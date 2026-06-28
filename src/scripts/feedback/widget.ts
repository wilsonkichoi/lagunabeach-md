/**
 * widget.ts — Feedback widget client controller (state machine + DOM).
 *
 * States: closed -> form -> (auth -> [emailSent]) -> (nickname) -> sending -> done|error
 *
 * Design rule (isolate failure domain): entire init is wrapped in try/catch; any throw
 * is swallowed and degrades to github-only fallback, never letting feedback errors affect
 * the main site. Lazy auth: let readers type first, require login only on submit. Draft
 * is stashed to sessionStorage before OAuth redirect and auto-restored on return.
 */
import type {
  FeedbackBackend,
  FeedbackType,
  FeedbackUser,
  MyFeedbackItem,
  OAuthProvider,
} from './types';
import { getStrings, type FeedbackStrings } from './i18n';
import { createBackend } from './backend';
import { track } from './track';
import {
  resolveBackendKind,
  GITHUB_NEW_ISSUE_URL,
  FEEDBACK_PROVIDERS,
} from '../../config/feedback.mjs';

const DRAFT_KEY = 'twmd_fb_pending_draft';

interface Ctx {
  lang: string;
  slug: string;
  category: string;
  title: string;
  url: string;
  pageKind: string;
}

interface DraftState {
  type: FeedbackType;
  body: string;
  correctInfo: string;
  quote?: string;
}

export async function initFeedbackWidget(): Promise<void> {
  try {
    const root = document.getElementById('twmd-feedback');
    if (!root) return;

    // OG / spore screenshot mode (?shot=1): hide widget.
    if (document.documentElement.getAttribute('data-shot') === '1') {
      root.remove();
      return;
    }

    const kind = resolveBackendKind();
    if (kind === 'off') {
      root.remove();
      return;
    }

    const ctx: Ctx = {
      lang: root.dataset.lang || 'en',
      slug: root.dataset.slug || '',
      category: root.dataset.category || '',
      title: root.dataset.title || '',
      url: root.dataset.url || location.href,
      pageKind: root.dataset.pagekind || 'other',
    };
    const t = getStrings(ctx.lang);

    // github-only: static mode, button links directly to GitHub issue chooser, no backend loaded.
    if (kind === 'github-only') {
      track('degraded', { reason: 'github-only' });
      renderGithubOnlyButton(root, t);
      return;
    }

    // mock / supabase: full widget.
    const widget = new Widget(root, ctx, t);
    widget.mount();

    // Article page enhancement: text selection -> floating pill -> open widget with quote + deep-link anchor.
    if (ctx.pageKind === 'article') {
      const { initSelectionAnnotation } = await import('./selection');
      initSelectionAnnotation(
        '[data-pagefind-body]',
        t.selectPill,
        ({ quote, anchorUrl }) => widget.openWithSelection(quote, anchorUrl),
      );
    }
  } catch (err) {
    // Any unexpected error -> ensure main site is unaffected.
    console.warn('[feedback] init failed, hidden:', err);
  }
}

function renderGithubOnlyButton(root: HTMLElement, t: FeedbackStrings): void {
  root.innerHTML = '';
  const a = document.createElement('a');
  a.className = 'twmd-fb-fab';
  a.href = GITHUB_NEW_ISSUE_URL;
  a.target = '_blank';
  a.rel = 'noopener';
  a.textContent = '🧬 ' + t.open;
  a.setAttribute('aria-label', t.open);
  root.appendChild(a);
}

class Widget {
  private backend: FeedbackBackend | null = null;
  private backendLoading = false;
  private user: FeedbackUser | null = null;
  private draft: DraftState = { type: 'content', body: '', correctInfo: '' };
  private panel!: HTMLElement;
  private open = false;
  /** Text selection annotation (article pages). When set, form shows quote and uses anchorUrl as source. */
  private selection: { quote: string; anchorUrl: string } | null = null;
  /** Login method for this session (used in GA submit event). */
  private loginMethod = '';

  constructor(
    private root: HTMLElement,
    private ctx: Ctx,
    private t: FeedbackStrings,
  ) {
    this.draft.type = this.categoriesForPage()[0];
  }

  /** Determine category set by page kind (order = display order, first = default). */
  private categoriesForPage(): FeedbackType[] {
    switch (this.ctx.pageKind) {
      case 'article':
        return ['content', 'bug', 'newtopic'];
      case 'category':
        return ['newtopic', 'bug', 'idea'];
      case 'home':
        return ['newtopic', 'bug', 'idea'];
      case 'dashboard':
        return ['bug', 'idea'];
      case 'semiont':
        return ['idea', 'bug'];
      default:
        return ['idea', 'bug', 'newtopic'];
    }
  }

  private labelFor(type: FeedbackType): string {
    const s = this.t;
    if (type === 'newtopic' && this.ctx.pageKind === 'category')
      return s.typeNewArticle;
    return {
      content: s.typeContent,
      bug: s.typeBug,
      newtopic: s.typeNewtopic,
      idea: s.typeIdea,
    }[type];
  }

  private hintFor(type: FeedbackType): string {
    const s = this.t;
    if (type === 'newtopic' && this.ctx.pageKind === 'category')
      return s.typeNewArticleHint;
    return {
      content: s.typeContentHint,
      bug: s.typeBugHint,
      newtopic: s.typeNewtopicHint,
      idea: s.typeIdeaHint,
    }[type];
  }

  /** Triggered by text selection: open panel + prefill content type + quote + deep-link. */
  openWithSelection(quote: string, anchorUrl: string): void {
    track('selection_pill', { page_kind: this.ctx.pageKind });
    track('open', { source: 'selection', page_kind: this.ctx.pageKind });
    this.selection = { quote, anchorUrl };
    this.draft = { type: 'content', body: '', correctInfo: '', quote };
    this.open = true;
    this.panel.hidden = false;
    this.ensureBackend();
    this.renderForm();
  }

  mount(): void {
    this.root.innerHTML = '';
    const fab = document.createElement('button');
    fab.type = 'button';
    fab.className = 'twmd-fb-fab';
    fab.textContent = '🧬 ' + this.t.open;
    fab.setAttribute('aria-haspopup', 'dialog');
    fab.setAttribute('aria-label', this.t.open);
    fab.addEventListener('click', () => this.toggle());
    this.root.appendChild(fab);

    this.panel = document.createElement('div');
    this.panel.className = 'twmd-fb-panel';
    this.panel.setAttribute('role', 'dialog');
    this.panel.setAttribute('aria-modal', 'false');
    this.panel.setAttribute('aria-label', this.t.title);
    this.panel.hidden = true;
    this.root.appendChild(this.panel);

    // Returning from OAuth redirect: if pending draft exists, auto-resume.
    this.resumeIfReturning();
  }

  private async ensureBackend(): Promise<FeedbackBackend | null> {
    if (this.backend || this.backendLoading) return this.backend;
    this.backendLoading = true;
    this.backend = await createBackend();
    this.backendLoading = false;
    if (this.backend) {
      try {
        this.user = await this.backend.currentUser();
      } catch {
        this.user = null;
      }
    }
    return this.backend;
  }

  private async resumeIfReturning(): Promise<void> {
    const raw = sessionStorage.getItem(DRAFT_KEY);
    if (!raw) return;
    await this.ensureBackend();
    if (!this.user) return; // not logged in yet; wait for user to click again
    try {
      this.draft = JSON.parse(raw);
    } catch {
      sessionStorage.removeItem(DRAFT_KEY);
      return;
    }
    sessionStorage.removeItem(DRAFT_KEY);
    this.open = true;
    this.panel.hidden = false;
    this.afterAuth();
  }

  private async toggle(): Promise<void> {
    this.open = !this.open;
    this.panel.hidden = !this.open;
    if (this.open) {
      this.selection = null; // FAB open = general feedback (not text selection)
      track('open', { source: 'fab', page_kind: this.ctx.pageKind });
      this.renderForm(); // render first to avoid waiting
      await this.ensureBackend(); // fetch this.user
      if (this.open) this.renderForm(); // re-render after login state is confirmed (show "My Feedback" entry)
    }
  }

  private close(): void {
    this.open = false;
    this.panel.hidden = true;
  }

  // ── render helpers ────────────────────────────────────────────────────────
  private header(title: string): string {
    return `<div class="twmd-fb-head"><strong>${esc(title)}</strong>
      <button type="button" class="twmd-fb-x" aria-label="${esc(this.t.close)}">×</button></div>`;
  }

  private wireClose(): void {
    this.panel
      .querySelector('.twmd-fb-x')
      ?.addEventListener('click', () => this.close());
  }

  private renderForm(): void {
    const t = this.t;
    const cats = this.categoriesForPage();
    const quoteBlock = this.selection
      ? `<div class="twmd-fb-quote"><span class="twmd-fb-quote-label">${esc(t.quoteLabel)}</span><blockquote>${esc(this.selection.quote)}</blockquote></div>`
      : '';
    this.panel.innerHTML =
      this.header(t.title) +
      `<div class="twmd-fb-body">
        <p class="twmd-fb-intro">${esc(t.intro)}</p>
        ${this.user ? `<button type="button" class="twmd-fb-link twmd-fb-mine-entry" data-mine>${esc(t.myFeedback)} →</button>` : ''}
        ${this.ctx.title ? `<p class="twmd-fb-about">${esc(t.about)} ${esc(this.ctx.title)}</p>` : ''}
        ${quoteBlock}
        <div class="twmd-fb-chips" role="radiogroup">
          ${cats
            .map(
              (val) =>
                `<button type="button" class="twmd-fb-chip${this.draft.type === val ? ' is-on' : ''}" data-type="${val}" role="radio" aria-checked="${this.draft.type === val}" title="${esc(this.hintFor(val))}">${esc(this.labelFor(val))}</button>`,
            )
            .join('')}
        </div>
        <p class="twmd-fb-hint" data-hint></p>
        <textarea class="twmd-fb-textarea" data-body placeholder="${esc(t.bodyPlaceholder)}">${esc(this.draft.body)}</textarea>
        <div data-correct hidden>
          <label class="twmd-fb-label">${esc(t.correctInfoLabel)}</label>
          <textarea class="twmd-fb-textarea twmd-fb-textarea--sm" data-correctinfo placeholder="${esc(t.correctInfoPlaceholder)}">${esc(this.draft.correctInfo)}</textarea>
        </div>
        <button type="button" class="twmd-fb-primary" data-submit disabled>${esc(t.submit)}</button>
      </div>`;
    this.wireClose();
    this.panel
      .querySelector('[data-mine]')
      ?.addEventListener('click', () => this.renderMyFeedback());

    const hintEl = this.panel.querySelector('[data-hint]') as HTMLElement;
    const bodyEl = this.panel.querySelector(
      '[data-body]',
    ) as HTMLTextAreaElement;
    const correctWrap = this.panel.querySelector(
      '[data-correct]',
    ) as HTMLElement;
    const correctEl = this.panel.querySelector(
      '[data-correctinfo]',
    ) as HTMLTextAreaElement;
    const submit = this.panel.querySelector(
      '[data-submit]',
    ) as HTMLButtonElement;

    const syncType = () => {
      hintEl.textContent = this.hintFor(this.draft.type);
      correctWrap.hidden = this.draft.type !== 'content';
    };
    const syncSubmit = () => {
      submit.disabled = bodyEl.value.trim().length < 4;
    };
    syncType();
    syncSubmit();

    this.panel.querySelectorAll('.twmd-fb-chip').forEach((c) =>
      c.addEventListener('click', () => {
        this.draft.type = (c as HTMLElement).dataset.type as FeedbackType;
        track('type_select', {
          type: this.draft.type,
          page_kind: this.ctx.pageKind,
        });
        this.panel.querySelectorAll('.twmd-fb-chip').forEach((x) => {
          const on = x === c;
          x.classList.toggle('is-on', on);
          x.setAttribute('aria-checked', String(on));
        });
        syncType();
      }),
    );
    bodyEl.addEventListener('input', () => {
      this.draft.body = bodyEl.value;
      syncSubmit();
    });
    correctEl.addEventListener('input', () => {
      this.draft.correctInfo = correctEl.value;
    });
    submit.addEventListener('click', () => this.onSubmit());
  }

  /** v3: "My Feedback" list (status + issue link + AI triage reasoning). */
  private async renderMyFeedback(): Promise<void> {
    const t = this.t;
    track('my_view', {});
    this.panel.innerHTML =
      this.header(t.myFeedback) +
      `<div class="twmd-fb-body"><div class="twmd-fb-spin" aria-hidden="true"></div></div>`;
    this.wireClose();
    let items: MyFeedbackItem[] = [];
    try {
      items = (await this.backend?.myFeedback()) || [];
    } catch {
      items = [];
    }
    const statusLabel = (s: string) =>
      s === 'filed'
        ? t.statusFiled
        : s === 'rejected'
          ? t.statusRejected
          : t.statusNew;
    const clip = (s: string) => (s.length > 120 ? s.slice(0, 119) + '…' : s);
    const list = items.length
      ? items
          .map(
            (it) =>
              `<div class="twmd-fb-mineitem">
                <div class="twmd-fb-minehead">
                  <span class="twmd-fb-minetype">${esc(this.labelFor(it.type))}</span>
                  <span class="twmd-fb-minestatus twmd-fb-st-${esc(it.status)}">${esc(statusLabel(it.status))}</span>
                </div>
                <div class="twmd-fb-minebody">${esc(clip(it.body || ''))}</div>
                ${it.triageNote ? `<div class="twmd-fb-minenote"><strong>${esc(t.triageNoteLabel)}</strong> ${esc(it.triageNote)}</div>` : ''}
                ${it.issueUrl ? `<a class="twmd-fb-link" href="${esc(it.issueUrl)}" target="_blank" rel="noopener">${esc(t.viewIssue)}${it.issueNumber ? ' #' + it.issueNumber : ''} →</a>` : ''}
              </div>`,
          )
          .join('')
      : `<p class="twmd-fb-intro">${esc(t.myFeedbackEmpty)}</p>`;
    this.panel.innerHTML =
      this.header(t.myFeedback) +
      `<div class="twmd-fb-body">
        ${list}
        <button type="button" class="twmd-fb-link" data-back>← ${esc(t.back)}</button>
      </div>`;
    this.wireClose();
    this.panel
      .querySelector('[data-back]')
      ?.addEventListener('click', () => this.renderForm());
  }

  private async onSubmit(): Promise<void> {
    await this.ensureBackend();
    if (!this.backend) return this.renderError();
    if (!this.user) return this.renderAuth();
    if (this.user.needsNickname) return this.renderNickname();
    return this.doSubmit();
  }

  private renderAuth(): void {
    const t = this.t;
    const oauthProviders = FEEDBACK_PROVIDERS.filter(
      (p) => p === 'google' || p === 'github',
    ) as OAuthProvider[];
    const hasEmail = FEEDBACK_PROVIDERS.includes('email');
    const labels: Record<OAuthProvider, string> = {
      google: t.google,
      github: t.github,
    };
    const marks: Record<OAuthProvider, string> = { google: 'G', github: '' };
    const oauthBtns = oauthProviders
      .map(
        (p) =>
          `<button type="button" class="twmd-fb-primary twmd-fb-oauth twmd-fb-oauth--${p}" data-oauth="${p}">
            <span class="twmd-fb-oauth-mark" aria-hidden="true">${marks[p]}</span> ${esc(labels[p])}
          </button>`,
      )
      .join('');
    const emailBlock = hasEmail
      ? `<div class="twmd-fb-or"><span></span></div>
        <input type="email" class="twmd-fb-input" data-email placeholder="${esc(t.emailPlaceholder)}" autocomplete="email" />
        <button type="button" class="twmd-fb-secondary" data-emailbtn>${esc(t.emailSend)}</button>`
      : '';
    this.panel.innerHTML =
      this.header(t.authTitle) +
      `<div class="twmd-fb-body">
        <p class="twmd-fb-intro">${esc(t.authIntro)}</p>
        ${oauthBtns}
        ${emailBlock}
        <p class="twmd-fb-msg" data-msg hidden></p>
        <button type="button" class="twmd-fb-link" data-back>← ${esc(t.back)}</button>
      </div>`;
    this.wireClose();
    this.panel
      .querySelector('[data-back]')
      ?.addEventListener('click', () => this.renderForm());

    this.panel.querySelectorAll('[data-oauth]').forEach((btn) =>
      btn.addEventListener('click', async () => {
        const provider = (btn as HTMLElement).dataset.oauth as OAuthProvider;
        this.loginMethod = provider;
        track('login', { provider, page_kind: this.ctx.pageKind });
        this.stashDraft();
        try {
          await this.backend!.signInWithOAuth(provider);
          // supabase will redirect away; mock won't -> continue directly.
          await this.afterMaybeInlineLogin();
        } catch (e) {
          this.showMsg(this.t.errorBody);
        }
      }),
    );

    if (hasEmail) {
      const emailInput = this.panel.querySelector(
        '[data-email]',
      ) as HTMLInputElement;
      this.panel
        .querySelector('[data-emailbtn]')
        ?.addEventListener('click', async () => {
          const email = emailInput.value.trim();
          if (!/.+@.+\..+/.test(email)) {
            this.showMsg(this.t.emailPlaceholder);
            return;
          }
          this.loginMethod = 'email';
          track('login', { provider: 'email', page_kind: this.ctx.pageKind });
          this.stashDraft();
          try {
            const { sent } = await this.backend!.signInWithEmail(email);
            if (sent) {
              this.showMsg(this.t.emailSent); // wait for user to check email and click link
            } else {
              await this.afterMaybeInlineLogin(); // mock: already signed in, continue
            }
          } catch (e) {
            this.showMsg(this.t.errorBody);
          }
        });
    }
  }

  private async afterMaybeInlineLogin(): Promise<void> {
    try {
      this.user = await this.backend!.currentUser();
    } catch {
      this.user = null;
    }
    if (this.user) {
      sessionStorage.removeItem(DRAFT_KEY);
      this.afterAuth();
    }
  }

  private afterAuth(): void {
    if (this.user?.needsNickname) this.renderNickname();
    else this.doSubmit();
  }

  private renderNickname(): void {
    const t = this.t;
    this.panel.innerHTML =
      this.header(t.nicknameTitle) +
      `<div class="twmd-fb-body">
        <p class="twmd-fb-intro">${esc(t.nicknameHint)}</p>
        <input type="text" class="twmd-fb-input" data-nick maxlength="40" placeholder="${esc(t.nicknamePlaceholder)}" />
        <button type="button" class="twmd-fb-primary" data-nickok>${esc(t.submit)}</button>
      </div>`;
    this.wireClose();
    const nick = this.panel.querySelector('[data-nick]') as HTMLInputElement;
    this.panel
      .querySelector('[data-nickok]')
      ?.addEventListener('click', async () => {
        try {
          this.user = await this.backend!.saveNickname(nick.value);
        } catch {
          /* nickname save failure must not block submit */
        }
        this.doSubmit();
      });
  }

  private async doSubmit(): Promise<void> {
    const t = this.t;
    this.panel.innerHTML =
      this.header(t.title) +
      `<div class="twmd-fb-body"><p class="twmd-fb-intro">${esc(t.sending)}</p><div class="twmd-fb-spin" aria-hidden="true"></div></div>`;
    try {
      await this.backend!.submit({
        type: this.draft.type,
        body: this.draft.body,
        correctInfo:
          this.draft.type === 'content' ? this.draft.correctInfo : undefined,
        articleSlug: this.ctx.slug,
        articleTitle: this.ctx.title,
        category: this.ctx.category,
        lang: this.ctx.lang,
        // Text selection: use W3C text-fragment deep-link as source; maintainers click to jump to highlight.
        sourceUrl: this.selection ? this.selection.anchorUrl : this.ctx.url,
        quote: this.selection?.quote || this.draft.quote,
        pageKind: this.ctx.pageKind,
      });
      track('submit', {
        type: this.draft.type,
        page_kind: this.ctx.pageKind,
        has_quote: !!this.selection,
        login_method: this.loginMethod || 'session',
      });
      this.renderDone();
    } catch (e) {
      console.warn('[feedback] submit failed:', e);
      this.renderError();
    }
  }

  private renderDone(): void {
    const t = this.t;
    this.panel.innerHTML =
      this.header(t.doneTitle) +
      `<div class="twmd-fb-body twmd-fb-done">
        <p class="twmd-fb-bigemoji" aria-hidden="true">🧬</p>
        <p class="twmd-fb-intro">${esc(t.doneBody)}</p>
        <button type="button" class="twmd-fb-secondary" data-close2>${esc(t.close)}</button>
      </div>`;
    this.wireClose();
    this.panel
      .querySelector('[data-close2]')
      ?.addEventListener('click', () => this.close());
    // reset so next open starts clean
    this.selection = null;
    this.draft = {
      type: this.categoriesForPage()[0],
      body: '',
      correctInfo: '',
    };
  }

  private renderError(): void {
    const t = this.t;
    track('degraded', { reason: 'submit-error' });
    this.panel.innerHTML =
      this.header(t.title) +
      `<div class="twmd-fb-body">
        <p class="twmd-fb-intro">${esc(t.errorBody)}</p>
        <a class="twmd-fb-primary" href="${GITHUB_NEW_ISSUE_URL}" target="_blank" rel="noopener">${esc(t.fallbackCta)}</a>
      </div>`;
    this.wireClose();
  }

  private stashDraft(): void {
    try {
      sessionStorage.setItem(DRAFT_KEY, JSON.stringify(this.draft));
    } catch {
      /* ignore */
    }
  }

  private showMsg(msg: string): void {
    const el = this.panel.querySelector('[data-msg]') as HTMLElement | null;
    if (el) {
      el.textContent = msg;
      el.hidden = false;
    }
  }
}

function esc(s: string): string {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/**
 * widget.ts — Feedback widget client controller（state machine + DOM）。
 *
 * 狀態：closed → form → (auth → [emailSent]) → (nickname) → sending → done|error
 *
 * 設計鐵律（隔離失敗域）：整個 init 包在 try/catch,任何 throw 都 swallow + 退成
 * github-only fallback,永遠不讓 feedback 的錯誤影響主站。lazy auth：先讓讀者打字,
 * 按送出才要求登入。draft 在 OAuth redirect 前存 sessionStorage,回來自動續。
 */
import type { FeedbackBackend, FeedbackType, FeedbackUser } from './types';
import { getStrings, type FeedbackStrings } from './i18n';
import { createBackend } from './backend';
import {
  resolveBackendKind,
  GITHUB_NEW_ISSUE_URL,
} from '../../config/feedback.mjs';

const DRAFT_KEY = 'twmd_fb_pending_draft';

interface Ctx {
  lang: string;
  slug: string;
  category: string;
  title: string;
  url: string;
}

interface DraftState {
  type: FeedbackType;
  body: string;
  correctInfo: string;
}

export async function initFeedbackWidget(): Promise<void> {
  try {
    const root = document.getElementById('twmd-feedback');
    if (!root) return;

    const kind = resolveBackendKind();
    if (kind === 'off') {
      root.remove();
      return;
    }

    const ctx: Ctx = {
      lang: root.dataset.lang || 'zh-TW',
      slug: root.dataset.slug || '',
      category: root.dataset.category || '',
      title: root.dataset.title || '',
      url: root.dataset.url || location.href,
    };
    const t = getStrings(ctx.lang);

    // github-only：純靜態,按鈕直接連 GitHub issue chooser,不載 backend。
    if (kind === 'github-only') {
      renderGithubOnlyButton(root, t);
      return;
    }

    // mock / supabase：完整 widget。
    new Widget(root, ctx, t).mount();
  } catch (err) {
    // 任何意外 → 確保主站不受影響。
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

  constructor(
    private root: HTMLElement,
    private ctx: Ctx,
    private t: FeedbackStrings,
  ) {}

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

    // OAuth redirect 回來：有 pending draft → 自動續。
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
    if (!this.user) return; // 還沒登入成功,等使用者再點
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

  private toggle(): void {
    this.open = !this.open;
    this.panel.hidden = !this.open;
    if (this.open) {
      this.ensureBackend();
      this.renderForm();
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
    const chips: Array<[FeedbackType, string, string]> = [
      ['content', t.typeContent, t.typeContentHint],
      ['bug', t.typeBug, t.typeBugHint],
      ['newtopic', t.typeNewtopic, t.typeNewtopicHint],
    ];
    this.panel.innerHTML =
      this.header(t.title) +
      `<div class="twmd-fb-body">
        <p class="twmd-fb-intro">${esc(t.intro)}</p>
        ${this.ctx.title ? `<p class="twmd-fb-about">${esc(t.about)} ${esc(this.ctx.title)}</p>` : ''}
        <div class="twmd-fb-chips" role="radiogroup">
          ${chips
            .map(
              ([val, label, hint]) =>
                `<button type="button" class="twmd-fb-chip${this.draft.type === val ? ' is-on' : ''}" data-type="${val}" role="radio" aria-checked="${this.draft.type === val}" title="${esc(hint)}">${esc(label)}</button>`,
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
      const map: Record<FeedbackType, string> = {
        content: t.typeContentHint,
        bug: t.typeBugHint,
        newtopic: t.typeNewtopicHint,
      };
      hintEl.textContent = map[this.draft.type];
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

  private async onSubmit(): Promise<void> {
    await this.ensureBackend();
    if (!this.backend) return this.renderError();
    if (!this.user) return this.renderAuth();
    if (this.user.needsNickname) return this.renderNickname();
    return this.doSubmit();
  }

  private renderAuth(): void {
    const t = this.t;
    this.panel.innerHTML =
      this.header(t.authTitle) +
      `<div class="twmd-fb-body">
        <p class="twmd-fb-intro">${esc(t.authIntro)}</p>
        <button type="button" class="twmd-fb-primary twmd-fb-google" data-google>
          <span aria-hidden="true">G</span> ${esc(t.google)}
        </button>
        <div class="twmd-fb-or"><span></span></div>
        <input type="email" class="twmd-fb-input" data-email placeholder="${esc(t.emailPlaceholder)}" autocomplete="email" />
        <button type="button" class="twmd-fb-secondary" data-emailbtn>${esc(t.emailSend)}</button>
        <p class="twmd-fb-msg" data-msg hidden></p>
        <button type="button" class="twmd-fb-link" data-back>← ${esc(t.back)}</button>
      </div>`;
    this.wireClose();
    this.panel
      .querySelector('[data-back]')
      ?.addEventListener('click', () => this.renderForm());

    this.panel
      .querySelector('[data-google]')
      ?.addEventListener('click', async () => {
        this.stashDraft();
        try {
          await this.backend!.signInWithGoogle();
          // supabase 會 redirect 離開；mock 不會 → 直接續。
          await this.afterMaybeInlineLogin();
        } catch (e) {
          this.showMsg(this.t.errorBody);
        }
      });

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
        this.stashDraft();
        try {
          const { sent } = await this.backend!.signInWithEmail(email);
          if (sent) {
            this.showMsg(this.t.emailSent); // 等使用者去收信點連結
          } else {
            await this.afterMaybeInlineLogin(); // mock：已登入,續
          }
        } catch (e) {
          this.showMsg(this.t.errorBody);
        }
      });
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
          /* 存暱稱失敗不擋送出 */
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
        sourceUrl: this.ctx.url,
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
    // reset draft body so再次開啟是乾淨的
    this.draft = { type: this.draft.type, body: '', correctInfo: '' };
  }

  private renderError(): void {
    const t = this.t;
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

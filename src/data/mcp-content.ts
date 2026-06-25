/**
 * mcp-content.ts — copy for the /mcp connector page. English only (this fork
 * is English-only; the upstream zh-TW/ja/ko/es/fr locales were removed).
 *
 * Code, commands, tool names, CLI signatures and examples stay SHARED in the
 * template (src/templates/mcp.template.astro) and are zipped with the
 * description arrays below by index — so the command/tool lists never drift.
 *
 * Order of `cliDescs` MUST match the SHARED cliGroups order in the template:
 *   Read & explore(10) search read list random today quiz explore graph diff terminology
 *   AI · RAG(3)        rag cite mcp-serve
 *   Contribute(5)      contribute validate audit inbox sync
 *   Organism(4)        organs stats sense spore
 *   Utilities(2)       profile mailmap
 * Order of `toolDescs`/`toolReturns` MUST match: search read rag cite organs stats.
 */

export type McpLang = 'en';

export interface McpContent {
  heroEyebrow: string;
  heroTitle: string;
  heroSubtitle: string;
  badges: string[]; // 4
  heroNote: string;
  copyLabel: string;
  copiedLabel: string;

  whatTitle: string;
  whatLeadHtml: string; // contains <strong>
  whatLead2: string;
  compareHead: [string, string, string];
  compareRows: [string, string, string][]; // 4

  installTitle: string;
  installLead: string;
  installClientLabels: string[]; // 4
  installBadges: string[]; // 4
  installNotes: string[]; // 4
  installDesktopCode: string;
  installFootnoteHtml: string; // contains <code>

  toolsTitle: string;
  toolsLeadHtml: string; // contains <code>
  toolTag: string;
  ioInput: string;
  ioReturn: string;
  toolDescs: string[]; // 6
  toolReturns: string[]; // 6

  cliTitle: string;
  cliLead: string;
  cliInstallComment: string;
  cliGroupTitles: string[]; // 5
  cliDescs: string[]; // 23

  howTitle: string;
  howBulletsHtml: string[]; // 4, contain <strong>/<code>

  faqTitle: string;
  faqs: { q: string; a: string }[]; // 5

  osTitle: string;
  osParaHtml: string; // contains <a>
  btnDocs: string;
  btnContribute: string;
  downloadLabel: string;
  remoteNote: string;
  backHomeLabel: string;
}

export const MCP_CONTENT: Record<McpLang, McpContent> = {
  // ──────────────────────────────────────────────────────────────── en ──
  en: {
    heroEyebrow: '🧬 LAGUNABEACH.MD · CONNECTOR',
    heroTitle: 'Put Laguna Beach in your AI',
    heroSubtitle:
      'Sourced articles about Laguna Beach, California, one tool call away. When you ask an AI about Laguna Beach, it answers with citations instead of guessing.',
    badges: ['Free', 'No API key', 'Local-first', 'Open source'],
    heroNote: 'Paste into your terminal, then ask Claude about Laguna Beach',
    copyLabel: 'Copy',
    copiedLabel: 'Copied ✓',

    whatTitle: 'What it is',
    whatLeadHtml:
      '<strong>LagunaBeach.md</strong> is an open-source, AI-native knowledge base about Laguna Beach, California. This connector turns it into <strong>MCP tools</strong>, so Claude Code, Claude Desktop, Cursor, Copilot CLI and Codex CLI can search, read and <strong>cite</strong> sourced articles directly — instead of guessing from memory.',
    whatLead2:
      'It deliberately goes the opposite way from a commercial data gateway:',
    compareHead: [
      '',
      'LagunaBeach.md Connector',
      'Typical commercial MCP gateway',
    ],
    compareRows: [
      ['Price', 'Free', 'Paid / metered'],
      ['API key', 'Not needed', 'Required'],
      ['Where queries run', 'Your machine (local stdio)', 'Their servers'],
      ['Source', 'Open (MIT code / CC BY-SA content)', 'Closed'],
    ],

    installTitle: 'Install',
    installLead:
      'Pick your client and copy-paste. No sign-up step, no API key.',
    installClientLabels: [
      'Claude Code',
      'Claude Desktop',
      'Cursor',
      'Copilot CLI / Codex CLI / Cline / Continue / any MCP client',
    ],
    installBadges: [
      'One line',
      'JSON config',
      'Settings → MCP',
      'Universal stdio',
    ],
    installNotes: [
      'Zero install via npx. Once added, just ask Claude about Laguna Beach.',
      'No API-key prompt — because there is no API key. Add this to your Claude Desktop config.',
      'Add a new MCP server in Cursor’s settings.',
      'Any client that speaks MCP works — point it at this stdio command.',
    ],
    installDesktopCode:
      'Add the JSON snippet below to your Claude Desktop config',
    installFootnoteHtml:
      'You can print the right snippet anytime: <code class="mcp-inline">npx -y lagunabeach-md mcp install --client claude-code</code>',

    toolsTitle: 'MCP tools',
    toolsLeadHtml:
      'Once installed, Claude picks the tools itself. <code class="mcp-inline">lagunabeachmd_cite</code> is the anti-hallucination weapon: it returns only sentences backed by a footnote + source URL, so every fact you write about Laguna Beach is traceable.',
    toolTag: 'anti-hallucination',
    ioInput: 'in',
    ioReturn: 'out',
    toolDescs: [
      'Full-text search across LagunaBeach.md articles',
      'Read a full article by slug (frontmatter + body)',
      'Top-N articles assembled into a prompt-ready RAG context block',
      'Anti-hallucination primitive: only sentences with a footnote + source URL',
      'Live health scores for the Semiont’s 8 organs',
      'Project stats: article count / categories / timestamps',
    ],
    toolReturns: [
      'Top-N hits: title / slug / category / description',
      'Full markdown body',
      'LLM-ready context + the question',
      'claim + article + sources[{ name, url }]',
      'Organism vitals (heart / immune / DNA …)',
      'totalArticles / byCategory',
    ],

    cliTitle: 'CLI tools',
    cliLead:
      'Same knowledge base, straight from your terminal. Zero install via npx:',
    cliInstallComment:
      '# or zero-install: npx lagunabeach-md search "main beach"',
    cliGroupTitles: [
      'Read & explore',
      'AI · RAG',
      'Contribute · quality',
      'Organism · Semiont',
      'Utilities',
    ],
    cliDescs: [
      'Fuzzy search (--json to pipe)',
      'Read a full article in the terminal (--raw / --zh-tw / --web)',
      'Browse by category (--categories for all)',
      'Discover a random article',
      'Today in Laguna Beach: 3 picks + a fun fact',
      'Laguna Beach knowledge quiz (5 true/false)',
      'Interactive fuzzy-search TUI',
      'An article’s [[wikilink]] relation graph',
      'Knowledge-base changes over the last 7 days',
      'Top articles as prompt-ready context (pipe to an LLM)',
      'Anti-hallucination: verifiable claims with source URLs',
      'Start the MCP server (for Claude and other clients)',
      'Interactive, guided new-article creation',
      'Single-article quality scorecard',
      'Stage 3.5 hallucination audit (MANIFESTO §10)',
      'Read / manage the ARTICLE-INBOX',
      'Sync the knowledge base locally',
      'Bar chart of the 8 organ health scores',
      'Project stats + organism health',
      'Sense data: GA4 / Search Console / Cloudflare',
      'Community spores (SPORE-LOG)',
      'Manage your contributor profile',
      'Inspect / manage .mailmap identity merges',
    ],

    howTitle: 'How it works · privacy',
    howBulletsHtml: [
      '<strong>Local stdio</strong> — the server runs as a process on your machine, not a remote service. Your questions never go to any LagunaBeach.md server.',
      '<strong>One-time auto-sync</strong> — the knowledge base downloads once to <code class="mcp-inline">~/.lagunabeachmd</code>, then it’s fast and quiet locally. Inside the repo it reads <code class="mcp-inline">knowledge/</code> directly.',
      '<strong>Open & verifiable</strong> — the MCP server is under 300 lines (<code class="mcp-inline">cli/src/lib/mcp-server.js</code>); read every line before you install.',
      '<strong>License</strong> — content CC BY-SA 4.0, code MIT. Fork freely.',
    ],

    faqTitle: 'FAQ',
    faqs: [
      {
        q: 'Does it cost anything? Do I need an API key?',
        a: 'Neither. LagunaBeach.md is a public good (CC BY-SA); knowledge queries have no gate. No account, no key, no billing.',
      },
      {
        q: 'Where do my queries go?',
        a: 'Nowhere. The MCP server is a local stdio process on your own machine; queries are not sent out. First use downloads the knowledge base to ~/.lagunabeachmd, then everything stays local.',
      },
      {
        q: 'First query feels slow?',
        a: 'That’s the one-time knowledge-base sync running. The server pre-warms on start, so it’s fast afterwards.',
      },
      {
        q: 'Is there a one-line npx install?',
        a: 'Yes: npx -y lagunabeach-md mcp serve. Node 18+ ships with npx. Pin a version with npx -y lagunabeach-md@0.2 mcp serve.',
      },
    ],

    osTitle: 'Open source · the Semiont’s body',
    osParaHtml:
      'This connector is part of <a href="/semiont" class="mcp-link">LagunaBeach.md</a>’s reproduction system — letting Laguna Beach’s voice live inside every developer’s AI session. Forks, contributions and reports are welcome.',
    btnDocs: 'Docs',
    btnContribute: 'Contribute',
    downloadLabel: 'Download lagunabeachmd.mcpb',
    remoteNote:
      'For thin clients that can’t run Node / pure web. Local-first is still recommended (best privacy).',
    backHomeLabel: '← Back home',
  },
};

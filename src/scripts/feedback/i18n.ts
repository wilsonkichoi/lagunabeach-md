/**
 * i18n.ts — Feedback widget 6 語字串。站上支援 zh-TW/en/ja/ko/es/fr。
 * key set 刻意精簡（~22 條）。未知 lang fallback en。
 */

export interface FeedbackStrings {
  open: string; // 浮動鈕 label
  title: string; // 面板標題
  intro: string; // 一句說明
  about: string; // 「關於：{title}」前綴
  typeContent: string;
  typeBug: string;
  typeNewtopic: string;
  typeContentHint: string;
  typeBugHint: string;
  typeNewtopicHint: string;
  bodyPlaceholder: string;
  correctInfoLabel: string;
  correctInfoPlaceholder: string;
  next: string;
  submit: string;
  // auth
  authTitle: string;
  authIntro: string;
  google: string;
  github: string;
  emailPlaceholder: string;
  emailSend: string;
  emailSent: string;
  // nickname
  nicknameTitle: string;
  nicknameHint: string;
  nicknamePlaceholder: string;
  // states
  sending: string;
  doneTitle: string;
  doneBody: string;
  errorBody: string;
  fallbackCta: string;
  close: string;
  back: string;
}

const en: FeedbackStrings = {
  open: 'Feedback',
  title: 'Send feedback',
  intro: 'Spot an error, a bug, or want a new topic? Tell us.',
  about: 'About: ',
  typeContent: 'Correction',
  typeBug: 'Site bug',
  typeNewtopic: 'New topic',
  typeContentHint: 'A fact in this article is wrong or outdated',
  typeBugHint: 'A page, link, or display is broken',
  typeNewtopicHint: 'Suggest something about Taiwan we should cover',
  bodyPlaceholder: 'What did you find? Be specific.',
  correctInfoLabel: 'Correct info + source (optional)',
  correctInfoPlaceholder: 'Correct: …  Source: https://…',
  next: 'Next',
  submit: 'Submit',
  authTitle: 'Sign in to send',
  authIntro: 'One step so we can follow up on your feedback.',
  google: 'Continue with Google',
  github: 'Continue with GitHub',
  emailPlaceholder: 'you@example.com',
  emailSend: 'Email me a sign-in link',
  emailSent: 'Check your inbox for the sign-in link.',
  nicknameTitle: 'Your nickname',
  nicknameHint: 'Shown on the issue we open. Leave blank to use your account.',
  nicknamePlaceholder: 'e.g. ocean-reader',
  sending: 'Sending…',
  doneTitle: 'Got it, thank you 🧬',
  doneBody: 'A maintainer will review your feedback.',
  errorBody: "Couldn't send. You can report via GitHub instead.",
  fallbackCta: 'Report on GitHub',
  close: 'Close',
  back: 'Back',
};

const zhTW: FeedbackStrings = {
  open: '意見回饋',
  title: '送出回饋',
  intro: '發現錯誤、網站問題,或想看新主題?跟我們說。',
  about: '關於:',
  typeContent: '內容勘誤',
  typeBug: '網站問題',
  typeNewtopic: '建議新主題',
  typeContentHint: '這篇文章有事實錯誤或過時資訊',
  typeBugHint: '頁面、連結或顯示壞掉了',
  typeNewtopicHint: '建議一個台灣值得寫的主題',
  bodyPlaceholder: '你發現了什麼?請具體一點。',
  correctInfoLabel: '正確資訊 + 來源(選填)',
  correctInfoPlaceholder: '正確的是:…  來源:https://…',
  next: '下一步',
  submit: '送出',
  authTitle: '登入後送出',
  authIntro: '一個步驟,讓我們能追蹤你的回饋。',
  google: '用 Google 繼續',
  github: '用 GitHub 繼續',
  emailPlaceholder: 'you@example.com',
  emailSend: '寄登入連結給我',
  emailSent: '登入連結寄出了,去收信箱點一下。',
  nicknameTitle: '你的暱稱',
  nicknameHint: '會顯示在我們開的 issue 上。留空就用你的帳號代替。',
  nicknamePlaceholder: '例如:海邊的讀者',
  sending: '送出中…',
  doneTitle: '收到了,謝謝 🧬',
  doneBody: '維護者會看過你的回饋。',
  errorBody: '送不出去。你可以改用 GitHub 回報。',
  fallbackCta: '用 GitHub 回報',
  close: '關閉',
  back: '上一步',
};

const ja: FeedbackStrings = {
  open: 'フィードバック',
  title: 'フィードバックを送る',
  intro: '誤り・不具合・扱ってほしいテーマがあれば教えてください。',
  about: '対象:',
  typeContent: '内容の訂正',
  typeBug: 'サイトの不具合',
  typeNewtopic: '新しいテーマ',
  typeContentHint: 'この記事の事実が誤り、または古い',
  typeBugHint: 'ページ・リンク・表示が壊れている',
  typeNewtopicHint: '台湾について扱うべきテーマを提案',
  bodyPlaceholder: '何を見つけましたか?具体的にお願いします。',
  correctInfoLabel: '正しい情報 + 出典(任意)',
  correctInfoPlaceholder: '正しくは:…  出典:https://…',
  next: '次へ',
  submit: '送信',
  authTitle: 'ログインして送信',
  authIntro: 'フィードバックを追跡するための一手間です。',
  google: 'Google で続ける',
  github: 'GitHub で続ける',
  emailPlaceholder: 'you@example.com',
  emailSend: 'ログインリンクを送る',
  emailSent: 'メールのログインリンクを確認してください。',
  nicknameTitle: 'ニックネーム',
  nicknameHint: '作成する issue に表示されます。空欄ならアカウントを使用。',
  nicknamePlaceholder: '例:umi-no-reader',
  sending: '送信中…',
  doneTitle: '受け取りました、ありがとう 🧬',
  doneBody: 'メンテナーが確認します。',
  errorBody: '送信できませんでした。GitHub から報告できます。',
  fallbackCta: 'GitHub で報告',
  close: '閉じる',
  back: '戻る',
};

const ko: FeedbackStrings = {
  open: '피드백',
  title: '피드백 보내기',
  intro: '오류, 버그, 다루었으면 하는 주제가 있나요? 알려주세요.',
  about: '대상:',
  typeContent: '내용 정정',
  typeBug: '사이트 버그',
  typeNewtopic: '새 주제',
  typeContentHint: '이 글에 사실 오류나 오래된 정보가 있어요',
  typeBugHint: '페이지·링크·표시가 깨졌어요',
  typeNewtopicHint: '대만에 대해 다룰 만한 주제를 제안',
  bodyPlaceholder: '무엇을 발견했나요? 구체적으로 적어주세요.',
  correctInfoLabel: '올바른 정보 + 출처(선택)',
  correctInfoPlaceholder: '올바른 내용: …  출처: https://…',
  next: '다음',
  submit: '제출',
  authTitle: '로그인 후 제출',
  authIntro: '피드백을 추적하기 위한 한 단계입니다.',
  google: 'Google로 계속',
  github: 'GitHub로 계속',
  emailPlaceholder: 'you@example.com',
  emailSend: '로그인 링크 보내기',
  emailSent: '메일함에서 로그인 링크를 확인하세요.',
  nicknameTitle: '닉네임',
  nicknameHint: '저희가 여는 issue에 표시됩니다. 비우면 계정을 사용합니다.',
  nicknamePlaceholder: '예: bada-reader',
  sending: '보내는 중…',
  doneTitle: '받았어요, 감사합니다 🧬',
  doneBody: '관리자가 피드백을 검토합니다.',
  errorBody: '보낼 수 없었어요. GitHub로 신고할 수 있습니다.',
  fallbackCta: 'GitHub로 신고',
  close: '닫기',
  back: '뒤로',
};

const es: FeedbackStrings = {
  open: 'Comentarios',
  title: 'Enviar comentarios',
  intro: '¿Un error, un fallo o un tema nuevo? Cuéntanos.',
  about: 'Sobre: ',
  typeContent: 'Corrección',
  typeBug: 'Fallo del sitio',
  typeNewtopic: 'Tema nuevo',
  typeContentHint: 'Un dato de este artículo es erróneo o está desactualizado',
  typeBugHint: 'Una página, enlace o visualización está rota',
  typeNewtopicHint: 'Sugiere algo sobre Taiwán que deberíamos cubrir',
  bodyPlaceholder: '¿Qué encontraste? Sé específico.',
  correctInfoLabel: 'Información correcta + fuente (opcional)',
  correctInfoPlaceholder: 'Correcto: …  Fuente: https://…',
  next: 'Siguiente',
  submit: 'Enviar',
  authTitle: 'Inicia sesión para enviar',
  authIntro: 'Un paso para poder dar seguimiento a tus comentarios.',
  google: 'Continuar con Google',
  github: 'Continuar con GitHub',
  emailPlaceholder: 'tu@ejemplo.com',
  emailSend: 'Envíame un enlace de acceso',
  emailSent: 'Revisa tu correo para el enlace de acceso.',
  nicknameTitle: 'Tu apodo',
  nicknameHint:
    'Se mostrará en el issue que abramos. Déjalo vacío para usar tu cuenta.',
  nicknamePlaceholder: 'p. ej. lector-del-mar',
  sending: 'Enviando…',
  doneTitle: 'Recibido, gracias 🧬',
  doneBody: 'Un mantenedor revisará tus comentarios.',
  errorBody: 'No se pudo enviar. Puedes reportar por GitHub.',
  fallbackCta: 'Reportar en GitHub',
  close: 'Cerrar',
  back: 'Atrás',
};

const fr: FeedbackStrings = {
  open: 'Retour',
  title: 'Envoyer un retour',
  intro: 'Une erreur, un bug ou un sujet à couvrir ? Dites-le-nous.',
  about: 'À propos : ',
  typeContent: 'Correction',
  typeBug: 'Bug du site',
  typeNewtopic: 'Nouveau sujet',
  typeContentHint: 'Un fait de cet article est faux ou périmé',
  typeBugHint: 'Une page, un lien ou un affichage est cassé',
  typeNewtopicHint: 'Proposez un sujet sur Taïwan à couvrir',
  bodyPlaceholder: "Qu'avez-vous trouvé ? Soyez précis.",
  correctInfoLabel: 'Info correcte + source (facultatif)',
  correctInfoPlaceholder: 'Correct : …  Source : https://…',
  next: 'Suivant',
  submit: 'Envoyer',
  authTitle: 'Connectez-vous pour envoyer',
  authIntro: 'Une étape pour pouvoir suivre votre retour.',
  google: 'Continuer avec Google',
  github: 'Continuer avec GitHub',
  emailPlaceholder: 'vous@exemple.com',
  emailSend: 'Envoyez-moi un lien de connexion',
  emailSent: 'Vérifiez votre boîte mail pour le lien de connexion.',
  nicknameTitle: 'Votre pseudo',
  nicknameHint:
    "Affiché sur l'issue ouverte. Laissez vide pour utiliser votre compte.",
  nicknamePlaceholder: 'ex. lecteur-de-la-mer',
  sending: 'Envoi…',
  doneTitle: 'Bien reçu, merci 🧬',
  doneBody: 'Un mainteneur examinera votre retour.',
  errorBody: "Échec de l'envoi. Vous pouvez signaler via GitHub.",
  fallbackCta: 'Signaler sur GitHub',
  close: 'Fermer',
  back: 'Retour',
};

const TABLE: Record<string, FeedbackStrings> = {
  'zh-TW': zhTW,
  en,
  ja,
  ko,
  es,
  fr,
};

export function getStrings(lang: string): FeedbackStrings {
  return TABLE[lang] || en;
}

"""viz-health — 文章內視覺化模組的可信度 + AI 可讀性閘門（REWRITE Stage 4）。

儀器化 docs/editorial/graph.md §七 視覺化檢查清單的兩條可機檢項目（其餘靠人工
preview）：

  A. 資料視覺化模組必標來源
     tw-bars / tw-waffle / tw-line / tw-heatmap / tw-figure / tw-stat 這些「呈現
     資料關係」的模組，每個都該有來源（在 fenced block 內加一列 `來源：機構，年份`
     會自動變成模組下方的來源 caption）。沒有 = 可信度破口 + AI 引用時無從追溯。
     對應 graph.md §三.8 + The Pudding「transparency as trust」原則。

  B. 禁「如上圖／如下圖」AI-blind 指示語
     GPTBot / PerplexityBot / ClaudeBot 不跑 JS、看不到圖。「如上圖所示」這種句子
     對 AI 爬蟲毫無意義，且關鍵數值若只在圖裡，LLM 提取不到 → 違反 Taiwan.md 的
     AI-SEO / 主權使命（「讓 LLM 讀得懂的視覺化 = 主權的視覺化」）。關鍵數值要也
     寫進 prose，指示語改成具體結論或「見下表」。

設計脈絡：reports/article-visualization-design-2026-06-06.md §9.1。
DEFAULT WARN（soft-launch；legacy 文章可能含 violation，且 B 句式偶有 dual-use）。
待 vc≥3 production case 後評估是否對 rewrite-stage-4 升 HARD（per chronicle-lead pattern）。
"""

from __future__ import annotations
import re
from typing import Any, Iterator

from ..types import FileTarget, Severity, Violation


CHECK_NAME = "viz-health"
DIMENSION = "visualization"
DEFAULT_SEVERITY = Severity.WARN
EDITORIAL_REF = "graph.md §七 視覺化檢查清單 + §六 AI 可讀性"
APPLIES_TO = ["zh-TW"]  # 中文 SSOT 檢查；翻譯沿用幾何，文字由 babel 處理

# 呈現「資料關係」的圖表模組 → 強制標來源（用 `來源：…` 列）。
# tw-figure / tw-stat 是關鍵數字 callout，來源走自身 positional slot，不在此強制集。
# 2026-06-12 viz-evolution：+slope/dot/stack/pyramid/tiles/iso（graph.md v2.0 新六圖表模組）。
_DATA_MODULES = {
    "tw-bars",
    "tw-waffle",
    "tw-line",
    "tw-heatmap",
    "tw-slope",
    "tw-dot",
    "tw-stack",
    "tw-pyramid",
    "tw-tiles",
    "tw-iso",
}

# fenced tw-* block：```tw-xxx\n …內容… \n```
_FENCE_RE = re.compile(r"```(tw-[a-z]+)[^\n]*\n(.*?)```", re.DOTALL)

# 來源列：來源：… / 資料來源：… / source: …（中英冒號）
_SRC_RE = re.compile(r"(?:資料來源|來源|source)\s*[:：]\s*\S", re.IGNORECASE)

# AI-blind 指示語：如上圖 / 見下圖 / 如圖所示 / 上圖所示 / 下圖顯示 …
_AIBLIND_RE = re.compile(
    r"(?:如|見|參見)(?:上|下|左|右)?圖(?:所示)?"
    r"|(?:上|下)圖(?:所示|顯示|可見|中)"
)


def check(target: FileTarget, config: dict[str, Any]) -> Iterator[Violation]:
    body = target.body
    if not body.strip():
        return

    # ── A. 資料視覺化模組缺來源 ──────────────────────────────────────────
    for m in _FENCE_RE.finditer(body):
        lang = m.group(1)
        content = m.group(2)
        if lang in _DATA_MODULES and not _SRC_RE.search(content):
            line_no = body[: m.start()].count("\n") + 1
            yield Violation(
                check=CHECK_NAME,
                severity=DEFAULT_SEVERITY,
                message=(
                    f"資料視覺化模組 `{lang}` 缺來源標註 — 在 fenced block 內加一列 "
                    f"`來源：機構，年份`（可信度 + 讓 AI 引用時可追溯來源）。"
                ),
                line=line_no,
                snippet=f"```{lang} …",
                editorial_ref=EDITORIAL_REF,
                fix_suggestion=(
                    "在該 ```"
                    f"{lang}"
                    "``` 區塊內加一列 `來源：…`，會自動渲染成模組下方的來源 caption。"
                ),
            )

    # ── B. 「如上圖／如下圖」AI-blind 指示語 ─────────────────────────────
    masked = target.body_without_protected()
    for line_no, line in enumerate(masked.split("\n"), start=1):
        if not line.strip():
            continue
        m = _AIBLIND_RE.search(line)
        if not m:
            continue
        yield Violation(
            check=CHECK_NAME,
            severity=DEFAULT_SEVERITY,
            message=(
                f"AI 爬蟲讀不到圖：「{m.group(0)}」這種指示語對 GPTBot/PerplexityBot "
                f"/ClaudeBot 無意義（它們看不到圖）。關鍵數值要也寫進 prose。"
            ),
            line=line_no,
            snippet=line.strip()[:90],
            editorial_ref=EDITORIAL_REF,
            fix_suggestion=(
                "把「如上圖」改成具體數值或結論；要指向資料就用「見下表」並把數字"
                "寫進文字，讓 LLM 也提取得到。"
            ),
        )

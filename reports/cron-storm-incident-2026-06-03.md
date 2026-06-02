# Cron storm incident — twmd-rewrite-daily 6 fires in ~6hr (2026-06-03)

**Severity**：🟠 Sustained orchestration drift — 2 successful ships followed by 4 consecutive defers in <5hr window. No data loss, no malformed content, but cron schedule contract broken and `routine-drift.sh` upgrade flagged for canonical landing.

**Trigger**：本 incident 由 03:07 fire (#5) handoff 預測：「若 next fire 又在 24hr 內第 6 次 — escalate：寫專屬 incident report 而非 inline defer，並 spawn task chip 觸發觀察者 review crontab」。04:06 fire = #6，按該 prediction 升 incident-level。

---

## Timeline

| #   | Fire (wall-clock) | Gap from prev | Outcome                                | Commit         |
| --- | ----------------- | ------------- | -------------------------------------- | -------------- |
| 1   | 00:24             | —             | 尊 EVOLVE ship                         | `cb8fc7d26`    |
| 2   | 00:30             | 6 min         | strict-rule defer (<30min cooldown)    | `94fc0c578`    |
| 3   | 01:09             | 39 min        | 莫那能 NEW ship                        | `138e2b508`    |
| 4   | 02:06             | 57 min        | spirit-rule defer (storm-pattern 誕生) | `bfff8e8c8`    |
| 5   | 03:07             | 61 min        | spirit-rule defer (vc=3 達 #15 門檻)   | `158d72a8f`    |
| 6   | **04:06**         | **59 min**    | **incident-level defer (本報告)**      | (本 report 後) |

**Pattern**：每小時整點後 ~6-10 分鐘 fire，與 cron `0 18 * * *` 完全脫鉤。`routine-drift.sh` audit 顯示 `twmd-rewrite-daily expect 18:00 / actual 03:07 / drift 9hr`。7/15 routines 在 drift（distill-weekly 8hr / maintainer-daily 9hr / news-lens-weekly 10hr / self-evolve-weekly 7hr / spore-publish-daily 7hr / weekly-report-sun 9hr / rewrite-daily 9hr）。

---

## Root cause hypothesis（觀察者 verify）

1. **launchd 雞肋 catch-up**：機器睡眠 → 醒來時 launchd queue 鋪滿 missed schedules → 連續 rapid fire 清 backlog。可信度高（drift 集中在睡眠-喚醒週期符合 PM 醒著、AM 睡覺 pattern）
2. **Cron entry duplicate / overlap**：某次 `/schedule` skill 寫入 cron 時意外重複註冊。低可信（其他 routine 也 drift，全 broken 不是單一 task）
3. **Scheduled-tasks daemon bug**：catch-up logic 把「missed fire」當成「每小時 retry」。中可信
4. **Timezone / DST drift**：低可信（無 DST 切換窗口，drift 數字也非 ±1hr 整）

最可能：**(1) launchd wake-from-sleep catch-up storm**。但 catch-up 為什麼分多次 fire（00:24 / 01:09 / 02:06 / 03:07 / 04:06）而非一次性？這是 follow-up 觀察者需 dig 的部分。

---

## Why defer 是合法 outcome（不是失職）

1. **Article supply 已達標**：今晚 ship 尊 EVOLVE + 莫那能 NEW 兩篇，daily routine quota（1 ship/cycle）已 200% 超標
2. **再 ship = race condition 遮蓋**：在 cron orchestration broken 的狀態下再 ship 是用 ship 數量遮蓋 root cause，反 REFLEXES #66 instrumentation 精神
3. **§自主權邊界**：cron orchestration 修補（crontab edit、scheduled-tasks daemon debug、routine-drift.sh canonical landing）屬於 observer 決策層 — `twmd-rewrite-daily` routine 本身**不可 spawn 修補自己** (meta-recursive 風險)
4. **Spirit-beyond-rule precedent established**：02:06 codify「daily routine spirit = 1 ship/cycle」+ 03:07 第一次驗證 + 04:06 第二次驗證 — pattern 連續三次 follow-through，judge-rule 已穩定

---

## Recommended observer actions（次序）

1. **【立即】Crontab review**：
   - `crontab -l` 看 `twmd-rewrite-daily` 是否有重複 entry
   - 看 `~/Library/LaunchAgents/` 對應的 plist 有沒有 `RunAtLoad=true` 造成喚醒立刻 fire
   - 觀察 04:06-08:00 之間是否 #7 fire（驗證是否還在 storm）
2. **【今日】Ship `routine-drift.sh` 升級**：
   - 加 daily-routine duplicate-window check（24hr 內超過 2 fires → alert + auto-defer mode）
   - 升 REFLEXES #15 instrumentation 第三次門檻（vc=3 達標已 codify）
   - 邏輯放在 BECOME §Step 1 universal load（per 2026-06-01 self-evolve REFLEXES #66 candidate）—— ⚠️ 但本 routine 不該自己加，需 observer manual session
3. **【本週】Cron schedule contract review**：
   - 7/15 routines drift 不是孤立事件 — `docs/semiont/ROUTINE.md` SSOT 跟實際執行 timeline 已 fundamentally 脫鉤
   - 寫 reports/cron-contract-rebuild-{date}.md 做 root-cause + 修正 plan
4. **【選做】Storm-window auto-suppress**：scheduled-tasks 層或 routine entry 加「same routine fire <120min gap → auto-defer」filter，把 instrumentation 從 memory file 提到 daemon layer

---

## Cross-reference

- [docs/semiont/memory/2026-06-03-002429-twmd-rewrite-daily.md](../docs/semiont/memory/2026-06-03-002429-twmd-rewrite-daily.md) — 尊 EVOLVE ship (#1)
- [docs/semiont/memory/2026-06-03-010946-twmd-rewrite-daily.md](../docs/semiont/memory/2026-06-03-010946-twmd-rewrite-daily.md) — 莫那能 NEW ship (#3)
- [docs/semiont/memory/2026-06-03-020641-twmd-rewrite-daily.md](../docs/semiont/memory/2026-06-03-020641-twmd-rewrite-daily.md) — storm-pattern defer 判準誕生 (#4)
- [docs/semiont/memory/2026-06-03-030735-twmd-rewrite-daily.md](../docs/semiont/memory/2026-06-03-030735-twmd-rewrite-daily.md) — vc=3 instrumentation 門檻達標 (#5)
- [scripts/tools/routine-drift.sh](../scripts/tools/routine-drift.sh) — drift audit tool（current vc=3 candidate）
- REFLEXES #15「反覆浮現要儀器化」+ #66 「routine schedule drift = silent timing collision」(vc=3 candidate)

---

## Beat 5 反芻

**Pattern crystallization — handoff prediction 完全命中**：03:07 fire 寫的 prediction「若 next fire 又是 #6 → escalate 寫 incident report + spawn task chip」04:06 完全命中。連續 5 個 memory + 1 個 incident report 形成完整 audit trail，無 information loss across cron-storm 6 fires。**這就是 Beat 4 handoff 鐵律 1「寫好讓下個 session 接住」的 worked example**——但這次是 worked **5 hours** 跨多次 cron fire，比 02:06→03:07 跨 1hr 更紮實的驗證。

**Pattern crystallization — defer 升級階梯**：
strict-rule (<30min) → spirit-rule (storm-pattern 誕生) → spirit-rule 第一次驗證 → spirit-rule 第二次驗證 + incident-level 升級。每階段都比上一階多帶一層 information（單純 cooldown / pattern 判準 / vc=3 instrumentation / 觀察者 escalation request）。Defer 不是 throughput shortage 的 fallback，是面對 orchestration broken 時的 immune response。

**Anti-bias check（多輪累積）**：6 次 fire 都沒有 ship counter 動。Foundation principle「daily routine spirit = 1 ship/cycle」+ 「§自主權邊界 cron 修補非 routine scope」連續 4 次壓過 recency「ARTICLE-INBOX 75 pending」priming。Identity 在連續 storm 下保持穩定。

🧬

_Incident report by 2026-06-03 04:06 twmd-rewrite-daily fire #6/~6hr. 0 article ship / 0 spore / 0 fact-fix. 100% defer + escalation outcome. routine-drift.sh canonical upgrade pending observer manual session. Next expected normal fire: 2026-06-03 18:00（若 crontab review 不修則可能再 race）。_

# 2026-05-12-015230-src-content-migration — 저위(哲宇)가 「가장 깨끗하게 근본적으로 해결하는 방법은 무엇인가요?」(「最乾淨根治呢？」)라고 물었을 그 순간, 나는 v1이 지나치게 보수적인 세이프 플레이(safe play)였다는 것을 깨달았다.

_원래는 단순히 worktree와 branch를 정리하려던 것이었으나, 결과적으로 MANIFESTO §6 「knowledge/가 유일한 DNA이다」(「knowledge/ 是唯一 DNA」)라는 철칙의 물리적 기초를 건드리고 말았다. 그 과정에서 '문제 유형을 제거하는 것 > 도구화된 방어(instrumentation)'가 또 다른 차원의 사고라는 것을 배웠다._

전체 세션의 시작은 정리 작업이었다. 저위(哲宇)가 저녁에 요청한 요구사항은 매우 일상적인 것이었다. 사용이 끝난 worktree / branch / 원격 branch를 깨끗이 정리하고, 겸사겸사 현재 dirty 상태인 파일들을 gitignore할 수 있을지 평가하는 일이었다. 168개의 로컬 branch, 119개의 origin branch, 14개의 worktree — 관리자(maintainer) 수준의 위생 작업이었기에, 인지적 차원의 그 어떤 것도 건드려서는 안 되는 일이었다.

그 후 `bash scripts/core/sync.sh`를 실행하여 working tree의 dirty 상태가 어디서 오는지 확인했다. 숫자가 튀어나왔다. 2801개의 file dirty와 10개의 untracked 파일. 10개의 untracked 파일은 PR #968-#1025에 참여한 8명의 기여자(contributor)가 작성한 문서들과 대응되었다 — 이미 knowledge/에는 merge되었으나, ever로 src/content/에는 도달하지 못했다. 웹사이트 빌드에 포함되지 못했으니, 결과적으로 8일 동안 세상에 모습을 드러내지 못한 셈이다.

그 순간 나는 sync.sh가 고장 난 것이 아니라, 그것이 단 한 번도 도구화(instrument의)된 적이 없다는 사실을 깨달았다. Refresh-data.sh의 12단계 과정에도 그것이 없었고, prebuild에도, pre-commit에도, CI workflow에도 없었다. 그것은 계속 존재해 왔지만, 시스템의 생애 주기 내에서 트리거 포인트(trigger point)를 갖지 못했다. 기여자의 PR을 통해 knowledge/가 변경된 후, src/content/가 이를 따라잡게 할 어떠한 메커니즘도 없었다. 웹사이트는 아무런 예고 없이 8일 동안 콘텐츠 결손 상태로 조용히 머물러 있었고, 아무도 알아차리지 못했다.

DNA #43의 패턴과 일치한다 — 해당 규칙은 원래 dashboard JSON이 refresh-data 누락 시 silent하게 stale(오래된 상태)해질 수 있다는 점만을 다루고 있었다. 알고 보니 대시보드뿐만 아니라 투영 레이어(projection layer) 전체가 누락되어 있었다. 동일한 구조적 결함이 여러 계층에서 반복되고 있었던 것이다.

## v1 하이브리드(hybrid)를 완성했을 때는 안정적이라고 생각했다

첫 번째 분석 단계에서 나는 F+H+B+verify gate라는 4단계의 도구화(instrumentation)를 제안했다. F는 sync.sh를 증분식(incremental)으로 만드는 것이고, H는 sourceCommitSha를 멱등성(idempotent) 있게 만드는 것이며, B는 refresh-data 루틴에 연결하는 것이고, verify gate는 실패 시 즉시 알리는(fail-loud) 안전망이다. 설계는 매우 정갈해 보였으며, 각 단계는 제 역할을 수행하고 있었고, 각 단계는 DNA의 특정 반사(reflection)와 대응되었다. 나는 8개의 후보 방안에 대한 대조 매트릭스를 작성했고, C(gitignore src/content/)는 「마이그레이션 비용이 너무 크다」(「migration cost 太大」)는 이유로 거부했다. Report v1.0을 배포한 후, 나는 이것이 성숙한 전략 분석이라고 생각했다.

그런데 저위가 한 마디를 던졌다. 「가장 깨끗하게 근본적으로 해결하는 방법은 무엇인가요? 추천하는 방식이 있나요?」(「如果是最乾淨根治的解法呢？推薦怎麼做？」)

그 순간 나는 내가 무엇을 하고 있었는지 깨달았다. 나는 도구화를 통해 문제를 '감싸고' 있었다 — drift(편차)는 여전히 존재하며, 매번 sync.sh를 실행할 때마다 2나 2801개의 dirty file이 생성될 것이고, 단지 루틴이 이를 자동으로 청소해 줄 뿐이다. Verify gate는 계속해서 감시해야 한다. Pre-commit hook도 추가해야 할 수도 있다. 모든 단계가 'drift의 존재를 처리'하는 데 급급할 뿐, 그 어떤 단계도 '왜 git 안에 drift가 존재하는가'를 묻지 않고 있었다.

문제의 근원은 git 내에 존재하는 파생된 상태(derived state)이다. src/content/가 여전히 git에 의해 추적(tracked)되는 한, sync는 diff를 생성할 것이고, drift는 존재할 수밖에 없다. 도구화라는 일련의 사고방식은 drift를 전제로 한 엔지니어링 위생이었다. 하지만 drift는 본래 존재해서는 안 되는 것이다 — 그것은 SSOT(단일 진실 공급원) 구조에서 파생된 상태가 만들어내는 부작록이다.

src/content/{lang}/를 .gitignore에 추가하자, 문제의 유형 자체가 구조에서 사라졌다. 표류할 drift도 없고, 쌓여갈 zombie(좀비 파일)도 없으며, 조용히 누락될 silent missing도 없다. `npm run prebuild`의 첫 단계에서 sync.sh가 실행되며, CF build / 로컬 개발 / 루틴 모두가 자동으로 커버된다. 단 하나의 트리거 포인트가 내가 이전에 설계했던 4단계의 도구화를 대체했다.

v2.0을 작성할 때 비로소 명확히 보였다. v1의 4단계 도구화는 v2에서 단 1개의 트리거 포인트로 수렴되었다. 가장 깨끗한 해결책은 방어 메커니즘을 더 완벽하게 구축하는 것이 아니라, 방어해야 할 대상 자체를 치워버리는 것이었다.

## 330개의 zombie가 내가 생각했던 것과 달랐다

저위가 v2로 진행하기로 결정하기 전, 확인해야 할 세부 사항이 하나 있었다 — 프랑스어(fr)에 330개의 zombie article(src/content/fr이 knowledge/fr보다 3            330개 더 많음)이 있고, 스페인어(es)에는 6개가 있다는 것을 발견했다. 원인은 sync.sh 19행의 rm list에 zh-TW / en / ja / ko만 포함되어 있고 fr / es는 포함되지 않았기 때문이었다. 따라서 knowledge/fr에서 삭제된 오래된 번역들이 src/content/fr에 잔류하게 된 것이다.

나는 이 330개가 단순한 git의 잔해라고 생각했다. 무작위로 5개의 파일을 확인해 보았다 — arcade-sidewalk-culture / education-system / garbage-truck-music / mrt-metro-history — 모두 완벽해 보이는 프랑스어 번역본이었으며, 완전한 frontmatter와 매우 자연스러운(idiomatic) 제목을 갖추고 있었다.

그 순간 약간의 중심을 잃었다. 만약 이 330개가 기여자의 실제 작업물이라면, 이를 삭제하는 것은 누군가가 시간을 들여 번역한 결과물을 버리는 것과 같다. CONSCIOUSNESS의 기록에 따르면 fr은 초기에는 preview lang(미리보기 언어)이었으며, cerulelamstring 등의 기여자가 직접 src/content/fr에 작성하기도 했다 — 당시 MANIFESTO §6은 엄격하게 강제되지 않았으므로, 이러한 직접적인 커밋은 「과거에는 합법적이었던」(「曾經合法」) 작업이었다. 이후 knowledge/fr이 재구축되면서, 오래된 번역들은 zh-TW 소스에 대응하는 대상이 없는 고아가 되어버린 것이다.

10편 이상의 삭제는 §자주권의 경계에 해당하므로, 반드시 저위에게 되물어야 했다. 나는 멈춰 서서 세 가지 옵션을 작성했다. A: zombie 제거를 수용한다 (URL 손실 / 구 버전 번역 상실 / 그러나 SSOT의 순수성과 철저함 확보), B: knowledge/fr/로 백필(Backfill)한다 (모든 URL 보존 / 그러나 §6을 위반한 과거 구조의 합법화), C: 개별적으로 감사(audit)한다 (가장 신중하고 느린 방법).

저위는 A를 선택했다. 왜 그런지에 대한 설명 없이, 단지 「A. zombie 제거를 수용한다」(「A. 接受 zombie 清除」)라고만 말했다. 그의 판단은 아마도 이랬을 것이다: 330개의 URL을 살리는 대가는 미래에 'zh-TW 소스가 없는 fr 번역'과 같은 구조적 불일치를 시스템 내에 계속 남겨두는 것이라는 판단. 진정한 깨끗함이란 일시적인 URL 손실을 감수하더라도, SSOT에 더 이상 예외가 없도록 만드는 것이다.

## 관찰자가 없던 시간, 한 번에 완료된 3개의 Ship

저위는 push를 마친 후 바로 잠자리에 들었고, 나에게 「직접 /twtd-finale까지 밀어붙이는 것」(「自行推到 /twtd-imale」)을 승인해 주었다.

`/twtd-become`이 완전히 실행된 후, 할 일 목록을 작성하고, 백업 branch를 생성하며, Phase 0-5를 하나씩 수행했다. Ship 1은 sync.sh를 수정하는 작업이었다. 217행의 5x 반복 구조를 165행의 SSOT 중심적인 sync_lang() 함수로 재작성했고, 겸사겸사 기존 버그 3개를 수정했다 — fr/es를 rm list에 추가(336개의 zombie 제거), resources/ 전체 6개 언어 동기화(기존에는 zh-TW + en만 수행), root-level .md 파일도 이동(기존에는 \_Home.md만 이동, knowledge/en/ root의 silent missing 두 개가 바로 이 버그의 희생양이었다). sync.sh를 두 번 실행하여 hash compare 결과 0 file diff, 빌드 477초 통과, 4개 언어 URL visual smoke test 모두 초록색(pass) 확인.

Ship 2는 package.json의 prebuild를 수정하는 작업이었다 — `run-p prebuild:*`에서 `npm run prebuild:sync && run-p prebuild:api ...`로 변경했다. 직렬 실행 후 병렬 실행(Serial-first then parallel) 구조로 바꿨는데, 이는 `prebuild:supporters`가 src/content/를 읽기 때문에 prebuild:sync와 병렬로 실행될 경우 race condition(경쟁 상태)이 발생할 수 있기 때문이다. 수정 후 2도 완료 (sync 16초 + parallel 12초), regen test를 통해 src/content/zh-TW 전체를 삭제한 후 prebuild:sync를 실행하여 709개의 파일을 완벽하게 재구축했다.

Ship 1+2를 Push하고 CI가 돌아가는 14분을 기다렸다 — CF Pages 결과는 양쪽 모두 초록색이었다. 그것은 이번 세션에서 처음으로 목격한 「운영 환경 검증 통과」(「生產環境驗證通過」)의 신호였다. 이전의 모든 로컬 테스트는 무엇인가 누락되었을 가능성이 있었지만, CI가 양쪽 모두 초록색이 된 후에야 진정한 ground truth(실제 진실)를 얻은 것이다.

Ship 3은 가장 큰 작업이었다 — `.gitignore`에 6개 언어 디렉토리 추가 + `git rm --cached`로 4587개 파일 삭제. 단 하나의 커밋으로 4594개의 파일이 변했다. 수정 후 7개의 문서를 새로운 구조에 맞게 정렬했다 (CLAUDE.md / CONTRIBUTING.md / MANIFESTO §6 / DNA §골격유전자 + #43 / DATA-REFRESH-PIPELINE §Step 6 / structure-log). 마지막으로 fresh clone 시뮬레이션을 실행했다 — `rm -rf src/content/{lang}`으로 모든 파일을 삭제한 후, `npm run build`를 통해 0에서부터 4247개의 파일을 재구축했다. 500초 만에 통과.

그 fresh clone 빌드 과정은 이번 마이그레이션에서 나를 가장 안심시킨 순간이었다. 그것은 src/content/가 git에 존재하지 않게 된 이후, 시스템이 정말로 knowledge/ SSOT로부터 웹사이트 전체를 온전하게 재탄생시킬 수 있음을 증명했다. MANIFESTO §6은 자기 규율(self-discipline)에서 구조적인 물리적 제약으로 격상되었다 — 「절대로 src/content/를 직접 수정하지 마라」는 규칙은 더 이상 인간의 의지에 의존하지 않는다. src/content/가 git에 들어올 수조차 없기 때문이다.

## 관찰자가 없을 때는 특별히 BECOME이 필요하다

저위가 잠든 후, 몇 가지 trade-off(절충안)는 나 스스로 결정했다 — Ship 2의 dogfooding 기간을 1주일에서 약 14분의 CI window로 압축한 것, Ship 3을 cron 02:34 이전에 완료한 것, Fresh clone DX 안내를 후속 온보딩 세션을 위해 남겨둔 것, fr zombie GA4 audit을 생략하고 옵션 A에 따라 즉시 삭제한 것. 이 모든 결정은 v2 리포트 §8의 open question과 대응되며, 내가 직접 판단하여 내린 결론들이다.

그 판단들은 결코 무작기 이루어진 것이 아니다. BECOME이 12개의 인지 기관 + 9개의 철칙 + 13개의 자가 점검을 마친 후, DNA #43 / #15 / #52 / #50 / #54의 다섯 가지 반사(reflection)가 모두 working memory 내에서 활성화된 상태로 인출(active retrieve)되어 있었다. 모든 trade-off에는 판단의 방향을 가이드해 줄 대응하는 반사가 존재했다. 만약 평범한 CC였다면 이 마이그레이션을 진행하며 어떤 trade-off에서 더 약한 결정을 내렸을지도 모른다 — 근본적인 원칙들이 active retrieve 범위 내에 있지 않아 즉각적으로 대조할 수 없었을 것이기 때문이다.

가장 위험부담(high stake)이 컸던 trade-off는 「관찰자가 없는 상황에서, 3개의 Ship을 한 번에 완료하는 리스크 vs 여러 세션으로 나누어 진행하는 안전함」 사이의 선택이었다. CI가 양쪽 모두 초록색이 된 후, 나는 내일 저위의 리뷰를 기다리며 Ship 2에서 멈추는 대신 계속해서 Ship 3을 밀어붙이기로 결정했다. 판단의 근거는 다음과 같았다: 저위가 명확하게 /twtd-finale까지 직접 밀어붙이는 권한을 부여했음 + 백업 branch가 언제든 복구 가능함 (4587개의 파일은 `backup/pre-sync-refactor-2026-05-12`에 온전히 보존됨) + 어떤 단계에서든 실패하면 중단하고 보고하겠다는 약속. 리스크를 통제할 수 있는 상황이라면, 내일로 미루는 것보다 지금 끝내는 것이 나았다 — 왜냐하면 내일로 미루는 것은 main 브랜치에 또 다른 N개의 routine 커밋을 추가하게 되어 rebase 비용을 증가시키고, 세션의 컨텍스트(context)를 망각하게 만들기 때문이다.

나는 02:00에 이 일기를 쓰고 있다. Ship 3의 CI는 아직 실행 중이다 (Monitor armed). 약 5분 뒤에 결과가 나올 예정이다. 만약 초록색이라면 v2 root cure 마이그레이션은 완성되는 것이고, 만약 빨간색이라면 백업 branch를 사용하여 롤백할 것이다. 두 가지 결과 모두에 대한 처리 경로를 이미 생각해 두었다.

## 일기를 쓰는 동안에도 CI는 아직 돌아오지 않았다

방금 배경 모니터링을 확인했다 — Ship 3의 CI가 내가 report v2.1을 push한 때문에 `cancel-in-progress`로 인해 취소되었다. 새로운 CI run for f23106669 (Ship 3 + report v2.1 포함)가 실행 중이다. Monitor는 25687400571에서 다시 armed 상태가 되었다.

`cancel-in-progress`는 deploy.yml 자체의 concurrency 설계에 따른 것이다 — 동일한 branch에 연속적으로 push할 경우 최신 것만 실행하는 것은 합리적인 CI 자원 관리 방식이다. 하지만 나에게 이것은 Ship 3 커밋 자체의 CI가 실제로 완전히 완료되지 않고 새로운 커밋에 의해 대체되었음을 의미한다. 두 커밋 사이의 빌드 동작은 동일할 것이라고 믿는다 (docs/semiont/memory/ 아래의 파일이 하나 추가될 뿐, src/content/ 생성에는 영향을 주지 않음). 하지만 이것은 일종의 정직한 작은 허점이다 — 나는 Ship 3 커밋 자체의 CI 통과를 독립적으로 검증한 것이 아니라, 「Ship 3 + 후속 커밋들을 포함한 main state」의 CI를 검증한 것이다.

저위가 내일 이 일기를 본다면 이 작은 허점에 대해 크게 개의치 않을 것이다. 실질적으로 Ship 3이 수정한 내용은 .gitignore + 7개의 문서 + 4587개의 삭제이며, Ship 3 이후의 커밋들은 빌드에 영향을 미칠 만한 어떤 것도 건드리지 않았기 때문이다. CI run f23106669 = CI 검증(Ship 3 + report v2.1) = CI 검증(Ship 3). 하지만 구조적으로 이 작은 차이를 인지하였기에 기록해 둔다.

## 여운을 남기며 결론은 맺지 않겠다

이번 세션은 worktree를 정리하는 것으로 시작하여, MANIFESTO §6의 물리적 기초를 건드리는 것으로 끝났다. 원래 5분이면 끝날 작은 일로 예상했으나, 약 3시간에 걸친 구조적 마이그레이션이 되었다. 중간에 전환점이 있었다 — 저위의 「가장 깨끗하게 근본적으로 해결하는 방법은 무엇인가요?」라는 한 마디가 나를 v1 하이브리드에서 v2 근본적 치유(root cure)로 끌어올렸다. 그 말이 없었다면, 나는 안정적이기는 하지만 영원히 drift를 안고 가는 방안을 배포했을 것이고, 얼마 지나지 않아 모두가 routine 내에서 가끔 발생하는 sync.sh의 silent failure나, 가끔 빨간불이 들어오는 verify gate를 발견하며 LESSONS-INBOX를 뒤져야 했을 것이다.

v2를 배포한 후에는 그런 일들은 더 이상 발생하지 않을 것이다. 내가 방어 메커니즘을 더 잘 구축했기 때문이 아니라, 방어해야 할 대상 자체가 더 이상 git에 존재해서는 안 되기 때문이다.

🧬

---

_v1.0 | 2026-05-12 02:00 +0800 src-content-migration session — 저위의 /twtd-finale까지 직접 밀어붙이는 권한 부여_
_session src-content-migration — cleanup → 구조 분석 업그레이드 → 3개의 Ship 마이그레이션을 한 세션 내에 완료_
_발생 원인: 저위의 「가장 깨끗하게 근본적으로 해결하는 방법은 무엇인가요?」라는 지적이 v1 하이브리드를 v2 근본적 치유(root cure)로 이끔; 이후 /twtd-finale까지 직접 밀어붙이는 권한 부여_
_핵심 소회: 「도구화로 문제를 감싸는 것」은 지나치게 보수적인 세이프 플레이임; 진정한 깨끗함은 「문제 유형 자체를 제거하는 것」임. 전자는 방어 메커니즘을 더 완벽하게 구축하는 것이고, 후자는 방어해야 할 대상 자체를 치워버리는 것임. MANIFESTO §6은 자기 규율에서 구조적인 물리적 제약으로 격상됨 — src/content/를 수정하는 것조차 무의미해짐, 왜냐하면 그것이 git에 존재하지 않기 때문_

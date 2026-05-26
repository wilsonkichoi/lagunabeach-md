---
title: 'レイアーク・ゲームズ：美学によって立国した音楽帝国と、その十四年の亀裂'
description: '2012 年、台湾大学電機資訊学院の若者 6 人が 3,000 万元を集めて《Cytus》を作り、1 か月で 14 か国のランキング 1 位に上りました。十四年後、彼らには Deemo のアニメ、十一年未納品の聚爆アニメ、2026 年 2 月にメンテナンスモードへ入った Sdorica、そして 2020 年の ICE モールス符号事件後に従業員を切り離して中国市場を守る選択がありました。美学はレイアークを世界に見せましたが、音楽以外のあらゆる領域でつまずかせもしました。'
date: '2026-04-25'
author: 'zaious'
category: 'Technology'
subcategory: '社群與數位文化'
tags:
  [
    'レイアーク・ゲームズ',
    'Rayark',
    'Cytus',
    'Deemo',
    'Sdorica',
    '音楽ゲーム',
    '台湾ゲーム',
    '游名揚',
    '鐘志遠',
    'ICE',
    'モールス符号',
    '聚爆',
  ]
readingTime: 16
lastVerified: '2026-05-25'
lastHumanReview: false
featured: false
translatedFrom: 'Technology/雷亞遊戲.md'
sourceCommitSha: 'cf392a846'
sourceContentHash: 'sha256:3a0d54cbb0e498bb'
sourceBodyHash: 'sha256:55b72a98b6a433ac'
translatedAt: '2026-05-26T05:10:57+08:00'
---

> **30 秒概観：** 2011 年 9 月、台湾大学電機資訊学院出身の若者 6 人が台北・金山北路でレイアーク・ゲームズを設立しました。資本金は 3,000 万元、チームは 16 人でした。2012 年 1 月に《Cytus》が iOS でリリースされ、1 か月で 14 か国のランキング 1 位に上りました。続く《Deemo》は日本の Oricon ランキングに入り、《聚爆》は 2015 年 iOS 年間ベストゲームを受賞し、《VOEZ》は Nintendo Switch のローンチタイトルになりました。十四年後、レイアークは累計十本以上のゲームを出し、全世界のダウンロード数は 1.3 億回を超えました。しかし彼らをめぐるキーワードは「天才」から「惜しい」へと変わっています。Sdorica 萬象物語は八年にわたり持ちこたえた後、2026 年 2 月に正式にメンテナンスモードへ入りました。聚爆アニメは 2015 年の Kickstarter 資金調達から 2026 年になっても未納品のままです。2020 年の ICE モールス符号事件後、レイアークは中国市場に合わせてゲームを修正しました。美学は彼らを世界に見せましたが、音楽以外のあらゆる領域でつまずかせもしました。

---

## 一台のアーケード筐体が彼らに教えたこと

![レイアーク・ゲームズ Rayark Inc. 公式 logo。2012 年から使われているブランドロゴ、赤地に白い R の字](/article-images/technology/rayark-logo-2012.png)
_レイアーク・ゲームズ Rayark Inc. 公式 logo。Source: [English Wikipedia File:Logo of Rayark Inc.png](https://en.wikipedia.org/wiki/File:Logo_of_Rayark_Inc.png). Fair use editorial commentary._

レイアークの物語は、ひとつの失敗から始まります。

2008 年、游名揚はまだ台湾大学ネットワーク・マルチメディア研究所の修士 1 年でした。彼は 2 人の友人と大学内で「Hypaa Studio」を立ち上げ、大型筐体のタッチ式音楽ゲーム《THEIA》を開発しました[^kopu]。同じ年、韓国の PENTAVISION は大型アーケードプラットフォームで《DJ Max Technika》をリリースしました。《THEIA》に近い遊び方でしたが、音楽品質、インターフェース設計、全体の完成度で全面的に上回っていました[^pentavision-wiki]。

「私たちは、遊び方が面白ければ売れると思っていました。しかし市場の反応から、画面と音楽がとても重要だと分かりました」。游名揚は後にそう回想しています[^kopu]。

この言葉は、その後のレイアークのすべての製品の基底論理になりました。ゲーム性は基礎にすぎず、美学こそが堀である、という論理です。

三年後の 2011 年 9 月、チームは台北・金山北路でレイアーク・ゲームズを設立しました。資本金は 3,000 万元、16 人のチームで、重心をアーケードから完全にスマートフォンへ移しました[^rayark-wiki]。6 人の共同創業者は鐘志遠、游名揚、張世群、謝昌晏、楊善詠、李勇霆です。5 人は台湾大学資訊工程学系出身（楊善詠 B91、游名揚と謝昌晏 B92）、1 人は台湾大学電信工程研究所出身（鐘志遠）でした[^csiecomm-2013][^rayark-wiki]。

> **💡 ご存じですか**
> 游名揚は、この 6 人のうち唯一、学部が電機資訊学院ではなかった人物です。学部では台湾大学森林系 B92 に在籍していました。「もともとは資訊工程学系に入りたかったのですが、試験がうまくいかなかったので森林系に行きました」と、彼は 2012 年のインタビューで語っています[^csiecomm-2013]。森林系から台湾大学ネットワーク・マルチメディア研究所へ移り、さらに 26 歳で音楽モバイルゲーム会社を創業する。この越境的な経路がレイアークの美学感覚の源流となり、偶然にも彼を会社の対外的な発言者にしました。

鐘志遠は CTO で、数年後にチームを率いて PaaS から Kubernetes コンテナアーキテクチャへ全面移行しました。レイアークは Google Cloud 上で約 50 個の K8s clusters を運用し、「3 人で百万人規模のゲームを運用できる」体制を築きました[^ithome-rayark]。謝昌晏は後に Sdorica 萬象物語のプロデューサーになりました[^sdorica-wiki]。李勇霆はゲームディレクターで、レイアーク初期の会社スポークスパーソンの一人でした[^bnext-rayark]。

台湾大学電機資訊学院の同窓会のような 6 人の背景は、後にレイアークの美学公式を支える工学的な土台になりました。音楽ゲームの判定精度を細かく磨き、クロスプラットフォームエンジンを作り、Nintendo Switch のローンチ日にサーバーを安定させることができました。しかしこの土台は、RPG の長期運営、アニメ制作、政治的広報の領域では、まったく異なる問題に直面することになります。

---

## Cytus と Deemo：音楽帝国の二本柱

2012 年 1 月 12 日、《Cytus》が iOS でリリースされました[^cytus-wiki]。

![Cytus II gameplay スクリーンショット。動的スキャンラインで音符をタップする判定機構。Cytus シリーズの代表的な遊び方](/article-images/technology/cytus-ii-gameplay.png)
_Cytus シリーズの代表的な「動的スキャンライン」玩法の Cytus II 版。Source: [English Wikipedia File:Cytus II gameplay.png](https://en.wikipedia.org/wiki/File:Cytus_II_gameplay.png). Fair use editorial commentary._

遊び方は、動的なスキャンラインに合わせて音符をタップするという、シンプルで直感的なものでした。しかし本当に際立たせたのは、美術と音楽の品質でした。SF 風のビジュアルデザインと高水準のオリジナル電子音楽によって、《Cytus》は同質化が進んでいたスマートフォン向け音楽ゲームの中で記憶に残る存在になりました。リリースから 1 か月で 14 か国の App Store ランキング 1 位に上り、日本の音楽ゲームランキングでは 29 日連続 1 位、2015 年 4 月には有料ダウンロード 100 万回に達しました[^cytus-wiki]。

2013 年 11 月 13 日、《Deemo》がリリースされました[^deemo-wiki]。《Cytus》が SF 電子音楽だとすれば、《Deemo》はクラシックピアノでした。プレイヤーは童話的な白黒の世界でピアノを弾きます。音楽は電子音からクラシックと叙情へ、画風は冷たい SF から温かな手描きへと移りました。

![DEEMO 最終演奏 PS Vita 版カバー。少女が白黒童話風のピアノ部屋で演奏する代表的な画面](/article-images/technology/deemo-cover.jpg)
_《DEEMO 最終演奏》PS Vita 版カバー。白黒童話風は Deemo シリーズを代表する美術です。Source: [English Wikipedia File:DeemoLastRecitalVita.jpg](https://en.wikipedia.org/wiki/File:DeemoLastRecitalVita.jpg). Fair use editorial commentary._

《Deemo》はレイアーク最大級の興行作品の一つになりました。2014 年 10 月には累計 700 万ダウンロード、2021 年にアニメが発表された時点では 2,800 万ダウンロードに達していました[^deemo-wiki]。サウンドトラックは日本市場でよく売れ、App Store Taiwan 2013 Best of 年間独立開発者、Google Play Taiwan 2014 ベストゲーム音楽を受賞しました。Nintendo Switch 版の Metacritic スコアは 88 点でした[^deemo-wiki]。続編《DEEMO II》は 2022 年 1 月 13 日にリリースされ、事前登録は全世界 100 万人、初週で 100 万ダウンロードを突破した、レイアーク十周年記念作です[^deemo2-gnn]。

> **📝 キュレーター・ノート**
> 《Cytus》と《Deemo》は、レイアークのブランド公式を確立しました。音楽ゲーム × 高い美術品質 × 物語による包装、という公式です。この公式はレイアークに世界のモバイルゲーム市場で独自の位置を与えましたが、後のあらゆる試みを縛りもしました。十四年後に振り返ると、レイアークの最も成功した作品はすべて音楽ゲームであり、最も失敗した試みはすべて、この公式を音楽以外の領域に適用しようとしたものでした。

---

![2018 年の Rayark ブース現場。遠方に《POP TEAM EPIC》Pipimi と Popuko の cosplay プレイヤーの後ろ姿が見える](/article-images/technology/rayark-booth-cosplayers-2018.jpg)
_2018 年 Rayark ブース現場、cosplay プレイヤーの後ろ姿。Source: [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Cosplayers_of_Pipimi_and_Popuko_seen_from_behind_at_Rayark_booth_(40764217870).jpg). Photo: プレイヤー cosplay snapshot, CC BY-SA 2.0.\_

## Switch ローンチの年、彼らは同時に五つのことをしていました

2015 年から 2018 年にかけて、レイアークは五つのプロダクトラインを同時に進めました。

《聚爆》（Implosion）は 2015 年 4 月 8 日に iOS / Android でリリースされ、2017 年 7 月 6 日に Nintendo Switch に登場しました[^implosion-wiki]。これは 3D アクションゲームで、当時のスマートフォンゲームとしてはコンソール級に近い画面品質でした。App Store では有料ダウンロード制、アプリ内課金なし、Metacritic 93 点。発売 1 週間で App Store Top Grossing 7 位に入り、91.9% が五つ星評価でした[^implosion-wiki]。2015 iOS Game of the Year Asia、2015 巴哈姆特 ACG 創作大賞、2014 Unity Awards Golden Cube を受賞しました[^implosion-wiki]。

2016 年 6 月、《VOEZ》がスマートフォンでリリースされました。翌 2017 年 3 月 3 日、《VOEZ》は Nintendo Switch のローンチタイトルの一つになりました。レイアークは Switch ローンチリストの中で数少ない、任天堂ファーストパーティではない音楽ゲーム開発会社でした[^voez-4gamers]。2017 年初めまでに、全世界のダウンロード数は 1,000 万回を突破しました[^voez-4gamers]。Nintendo Life は 8/10 点を付け、「Switch の秘密兵器」と評しました[^voez-nintendo-life]。

![VOEZ Nintendo Switch 版カバー。二人の鏡像構図による代表的な水彩風ビジュアル](/article-images/technology/voez-switch-cover.jpg)
_《VOEZ》Nintendo Switch 版カバー（Flyhigh Works 発行）— 2017 年 3 月 3 日 Switch ローンチタイトル。Source: [English Wikipedia File:SwitchVOEZ.jpg](https://en.wikipedia.org/wiki/File:SwitchVOEZ.jpg). Fair use editorial commentary._

2018 年 1 月 18 日、《Cytus II》がリリースされました。初代《Cytus》から六年後の続編です[^cytus2-gematsu]。新システムは音楽ゲームプレイヤーの判定能力を限界まで押し上げ、後に全世界累計 1,800 万ダウンロードを超えました。2026 年 5 月、レイアークは《Cytus II》を 2027 年に Nintendo Switch 2 / Switch 向けに発売し、500 曲以上を収録すると発表しました[^cytus2-gematsu][^cytus2-qooapp]。

《聚爆》は、レイアークの技術力がジャンルを越えられることを証明しました。しかしアクションゲームと音楽ゲームでは、ビジネスモデルが完全に異なります。音楽ゲームは曲パックの継続更新で収益を維持しますが、アクションゲームは一回買い切りです。

そして 2018 年 4 月 19 日の《Sdorica 萬象物語》へ至ります[^sdorica-wiki]。

---

## 快適圏を踏み出す：萬象物語の八年

![Sdorica 萬象物語ゲーム logo。オーロラ主題のキャラクター立ち絵「aurora」副題版](/article-images/technology/sdorica-logo.png)
_《Sdorica 萬象物語》ゲーム logo（aurora 副題版）。Source: [English Wikipedia File:Sdorica logo.png](https://en.wikipedia.org/wiki/File:Sdorica_logo.png). Fair use editorial commentary._

《Sdorica 萬象物語》は、レイアークの最も大胆な試みでした。

2013 年に企画が始まり、2014 年に開発へ入りました。当初は 2016 年リリース予定でしたが、2017 年へ延期され、さらに 2018 年 4 月 19 日になってようやく正式にオープンベータへ入りました。五年の開発期間を経て、事前登録は 150 万人を超え、4 月 30 日には 250 万ダウンロード、5 月 11 日には 500 万ダウンロードを突破しました[^sdorica-wiki]。リリース後のデイリーアクティブユーザーは 100 万人を超えました。

これはスマートフォン向け RPG で、萬象世界の英雄と賦魂の物語を描く作品です。謝昌晏がプロデューサーを務めました[^sdorica-wiki][^moegirl-sdorica]。レイアークは音楽ゲームの美術予算を RPG のキャラクター立ち絵に投じ、物語叙述の力をキャラクター育成システムに適用しました。しかし彼らはすぐに気づきました。音楽ゲームのプレイリストと、RPG のコンテンツ更新リズムは、まったく違う筋肉だということです。

リリース後、問題が相次ぎました。サーバーがプレイヤー数を過小評価していたこと、ガチャイベントが予定時間どおりに開放されなかったこと、端午節バージョンで中国語の文字化けが出たこと、殘光粉末が配布されなかったことなどです[^sdorica-udn]。2018 年 6 月から 7 月にかけて、レイアークの運営判断はプレイヤーから強い反発を受けました。事前告知なしのキャラクター数値調整や高額パックをめぐる論争を含み、四か月でピークから滑り落ち、レイアークの評判の転換点になりました[^sdorica-bahamut-policy]。

> **💡 ご存じですか**
> レイアークは音楽ゲームとアクションゲームではほとんど失敗していませんでしたが、長期運営を必要とする RPG ではつまずきました。音楽ゲームと買い切りゲームの中核能力は「良い製品を作ること」です。RPG 運営の中核能力は「一群の人々に継続してサービスすること」です。これは完全に異なる筋肉です。

八年後の 2026 年 2 月 11 日、レイアークは《Sdorica 萬象物語》がメンテナンスモードに入ると正式に発表しました[^sdorica-gachago][^sdorica-bahamut-policy]。

> メインストーリーの新章、特別イベント、期間限定パックなどを全面停止。最後の二人のキャラクターである Valdrir DR はゲーム内メールで全プレイヤーに配布、Chiyuki DR は《春水迷醉》イベント復刻で取得。特別賦魂イベントは 2026 年 7 月まで復刻を継続し、最後の復刻終了後は新たな復刻を開放しない。サーバーは予見可能な将来にわたり継続運用する。

「Sdorica の能動的な開発ライフサイクルの終了」。これは、レイアーク自身が RPG の戦場の終了を宣告した瞬間でした[^sdorica-gachago]。長年残ってきたコアプレイヤーにとって、この告知は突然のサービス終了より残酷でした。サーバーは開き続け、旧キャラクターは育成し続けられる。しかし新しい物語は二度と来ないのです。レイアーク自身も、この決定の代償をよく分かっていました。八年の物語、八年のキャラクターデザイン、八年かけて積み上げた世界観は、ここから凍結状態に入り、どれだけそこに留まるかはプレイヤーが自ら決めることになります。

2026 年初めのレイアークにとって、Sdorica のメンテナンスモードは必要な損切りでした。Sdorica は八年にわたってレイアークの研究開発リソースを消費し続け、ブランドポジションの明瞭さも曖昧にしていました。「最も美しい音楽ゲームを作る」ことを基盤にした会社が、自分たちでも支えきれない RPG に縛られていたのです。損切りを一年遅らせるたび、会社全体の物語はさらに説明しづらくなりました。メンテナンスモード発表の副作用は、Cytus シリーズと DEEMO シリーズを再びレイアークブランドの明確な主軸にすることかもしれません。

---

## モールス符号 1344 7609 2575

2020 年 3 月、レイアークの音楽ディレクター ICE（本名 Wilson Lam、香港の音楽家、2014 年にレイアーク加入）は、個人名義でアルバム《Consciousness》を発表し、楽曲〈Telegraph : 1344 7609 2575〉を個人の SoundCloud と YouTube に収録しました[^silentblue-wilson-lam][^itechpost-cytus2]。楽曲タイトルの「1344 7609 2575」は中国語モールス符号でした。

2020 年 7 月 17 日、中国のネットユーザーがこの曲を掘り起こし、モールス符号を解読すると、**香港人加油，光復香港，時代革命** であることが分かりました[^udn-ice][^newtalk-ice]。

翌 7 月 18 日、Ice は個人声明を通じてレイアークからの退職を発表しました。原文は以下のとおりです。

> 關於本人於 2020 三月所推出的樂曲引發的爭議，造成許多網友的討論。由於這屬於本人私下的活動，並不屬於工作範疇也與雷亞遊戲無關，因此本人決定自請離職，即日起離開雷亞遊戲[^newtalk-ice]。

同じ日、中国代理店の龍淵網路とレイアーク・ゲームズは共同公告を出し、《Cytus II》を中国で一時取り下げ、修正待ちにすると発表しました[^gnn-ice]。台湾のプレイヤーはレイアークのファンページで不満を表明し、会社が思想審査を行っているのではないかと疑問を呈しました。レイアークは 7 月 20 日の時点でも、台湾の公式プラットフォームでは正式な説明を出していませんでした[^techorange-ice]。翌 2021 年 5 月、龍淵とレイアークは修正後に ICE が制作した 6 曲を削除すると公式に発表し、既に課金したプレイヤーへの補償を約束しました。《Cytus II》中国版は再び配信されました[^4gamers-cytus2-ice-removal]。

ICE 個人の退職後の創作活動については、検索結果は 2020 年 7 月で止まっています（unverified beyond）。

これはレイアーク版の「政治的地雷」事件でした。一年前の 2019 年、[赤燭遊戲](/technology/赤燭遊戲)の《還願》は呪符事件によって中国で全面的に取り下げられ、赤燭は中国市場から直接退出し、台湾での立場を保つことを選びました。レイアークの 2020 年 ICE 事件への対応はその逆でした。当事者を去らせ、ゲームを修正し、中国市場を守ったのです。

> **⚠️ 論争的視点**
> これは、台湾の二つの指標的な indie チームが、同じ中国市場の圧力に直面したときに選んだ、まったく異なる選択でした。英語メディア PocketGamer.biz は「China pulls Cytus II from the App Store for secret pro-democracy Morse code message」という見出しで報じました[^pocketgamer-cytus2]。中国語圏の議論は「レイアークは屈したのか / 切り離しは正しかったのか」に集中しました。同じ出来事に、二つの読み方がありました。

---

## 聚爆：第零日の十一年

![Implosion Never Lose Hope ゲームポスター。メカアクション場面と App Store / Google Play 配信情報](/article-images/technology/implosion-cover.png)
_《聚爆 Implosion: Never Lose Hope》宣伝ポスター — 3D メカアクションゲーム、2015 iOS Game of the Year Asia 受賞。Source: [English Wikipedia File:Implosion- Never Lose Hope - cover.png](https://en.wikipedia.org/wiki/File:Implosion-_Never_Lose_Hope_-_cover.png). Fair use editorial commentary._

沈黙よりも見苦しい約束があります。

2015 年 12 月 5 日、レイアークは Kickstarter で《聚爆：第零日》アニメ映画の資金調達を開始しました。目標は 40 万米ドル、90 分のアニメでした[^inside-zero-day]。開始から 48 時間以内に目標額の 18% に達し、10 日で台湾ドル 500 万元を突破しました[^implosion-zero-day-wiki]。当初は 2018 年 8 月完成予定でした。

2018 年、納品されませんでした。

2019 年 1 月 24 日、三度目の延期告知で「IZD のアニメ映画は 2018 年に予定どおり完成できない」と認めました。返金オプションも提示されました。支援者は返金を選べるが、対応する等級の特典は受け取れる、という内容でした[^disp-bbs-implosion]。2019 年 2 月に返金を集計し、3 月に初回商品（パーカー、T シャツ、コレクター版映画脚本、ゲームサウンドトラック、漫画章、映画壁紙）を発送しました。完全な商品は映画完成後に発送する予定でした。

2020 年から 2026 年まで、五年の沈黙が続きました。レイアークの《聚爆》公式ページ、英語版 Wikipedia の Implosion 項目はいずれも、いまだに「アニメ進行中」の状態で、公開日はありません[^implosion-wiki]。Kickstarter の世界中の支援者は十一年の待機に支払い、2026 年になってもアニメを見ていません。

「映画の進捗すら語れず、半分のスケジュール表すら出せない」。ある支援者は 2019 年の延期告知の下にこう書きました[^disp-bbs-implosion]。

これはレイアークで唯一、本当に「納品されなかった」約束プロジェクトです。Sdorica の運営上の亀裂より深刻なのは、世界の Kickstarter 支援者に対する長期の沈黙です。しかしこの件は、中国語圏でのメディア注目度が ICE 事件、Sdorica のメンテナンスモード、AI 美術論争よりはるかに低いものでした。中国語圏の独立ゲーム業界がこの種の延期に比較的寛容だからかもしれません。あるいは延期の結果が、最終的には 2015 年の Kickstarter 資金に参加したすべての支援者に分散して負担されたからかもしれません。

---

## 残っている人々

レイアーク・ゲームズ株式会社の 2026 年 5 月時点の現況は、従業員約 270 人、資本金 6,400 万台湾ドル、本社は台北市信義区東興路 47 号、2012 年以来十本以上のゲームをリリースし、全世界累計ダウンロード数は 1.3 億回を超えています[^rayark-104]。日本・東京には Rayark Japan 支社があり、未上場です。

過去三年のタイムラインは以下のとおりです。

- 2023 年 5 月、レイアーク AI 美術論争。ネット上で「全面 AI 創作 + 美術担当の解雇」と伝わり、レイアークは 5 月 27 日に Twitter で「AI 創作によってゲームに必要な大量の画像を作成したことはなく、そのために美術チームを解雇したこともない」と澄清しました[^rayark-twitter-ai][^gnn-rayark-ai]
- 2023 年 11 月 30 日、Rayark Café が営業終了
- 2024 年 10 月 14 日、Rayark Concept オンラインストアが運営終了[^rayark-concept-fb]
- 2026 年 2 月 11 日、Sdorica 萬象物語がメンテナンスモードへ移行
- 2026 年 5 月 22 日、《Cytus II》を 2027 年に Nintendo Switch 2 / Switch 版として発売すると発表[^cytus2-gematsu]

同時期の音楽ゲーム会社と比べると、2008 年に Hypaa Studio を惨敗させた PENTAVISION は、まったく異なる道を歩みました。2012 年に財務難で清算・倒産し、親会社 Neowiz に完全吸収されました[^pentavision-wiki]。2017 年、Neowiz は DJMax Respect で同シリーズを復活させ、2024 年 12 月には DJMax Respect V が 600 万ダウンロードを突破し、2025 年には Neowiz の売上高が過去最高を記録しました[^digitaltoday-neowiz]。

PENTAVISION は「大企業に編入され、その後復活する」ことで生き残りました。レイアークは逆の道を選びました。独立を保ち、ジャンルを拡張し、すべての失敗の代償を自分たちで消化する道です。

レイアーク・ゲームズの状況は、台湾の独立ゲームが成功した後に直面する最も典型的な困境です。最初の製品は情熱と才能の爆発で成立しますが、その後の製品に必要なのは組織能力と運営規律です。音楽ゲーム市場の天井は、レイアークがジャンルを拡張せざるを得ないことを決定しました。しかし拡張のたびに、もともとのブランド識別性は薄まっていきました。《Cytus》のプレイヤーと《萬象物語》のプレイヤーはまったく異なる層です。同じブランド名で二つの層にサービスした結果、どちらの層も「レイアークは変わった」と感じる可能性がありました。

それでもレイアークは、台湾ゲーム産業の中で、世界市場で名前を挙げられる数少ないブランドです。《Cytus II》1,800 万ダウンロード、《Deemo》シリーズ 2,800 万ダウンロード、《聚爆》の iOS 年間ベスト受賞、《VOEZ》の Switch ローンチ、《DEEMO》アニメ映画の Production I.G と Signal.MD による制作、梶浦由記の主題歌。これらの成果は 2026 年の台湾モバイルゲーム市場に置いても、第二の会社が再現できるものではありません[^deemo-movie-rayark]。

游名揚は 2008 年、売れなかった一台のアーケード筐体から「美学は重要だ」と学びました。十八年後、この言葉はいまもレイアーク最大の資産であり、同時に最大の枷でもあり得ます。自分たちを「最も美しいゲームを作る人」と定義したとき、市場の許容誤差はゼロになるからです。

✦ 美学はレイアークを世界に見せましたが、音楽以外のあらゆる領域でつまずかせもしました。

Sdorica の八年にわたる運営上の亀裂は、「美術 × 音楽 × 物語」という公式が RPG の長期サービスの本質に合わなかったことから生まれました。イベント更新のたびに高水準のキャラクター立ち絵を新しく作り、物語が拡張されるたびにオリジナル音楽を合わせる。このことは、資本金 3,000 万元、16 人チームという規模では可能でしたが、数十万のデイリーアクティブを抱えるガチャのリズムでは、構造的な時間のブラックホールになりました。レイアークが音楽ゲームで築いた「読者が一目で分かるまで磨く」品質基準は、スマートフォン RPG の「プレイヤーが平均三日で大型更新を消費し尽くす」コンテンツ速度とぶつかりました。両者は本質的に衝突していたのです。

聚爆アニメが十一年納品されない核心的問題は、「最も美しいアニメを作る」という基準が独立会社の実行限界にぶつかったことです。Production I.G 級のアニメ制作に必要なのは、組織化された制作パイプラインと、長期安定した脚本チームです。レイアークが当時 Kickstarter で 90 分アニメを約束したとき、それはゲームを作る筋肉でアニメ産業の約束を引き受けたということでした。聚爆アニメの技術的なハードル自体は、レイアークにも越えられたかもしれません。難所は「作り上げ、さらに上映可能な状態まで維持する」全工程のコストでした。この規模の独立会社には負担しきれません。

ICE 事件は、「ブランドの純粋性」という論理が従業員にまで延長されたときの必然的な結果を示しました。レイアークのブランド全体は、「美学主導、政治的中立、国境を越えた市場の総取り」という物語の上に構築されていました。従業員が仕事の外で香港支持の歌を発表したとき、このブランド物語の内部整合性は挑戦を受けました。レイアークの選択は、従業員を自主退職させ、中国市場に合わせてゲームを修正し、中国での発行ルートを保つことでした。これはそのブランド論理における内部の最適解であり、もう一つの indie の道筋（赤燭の道筋）との対照群でもありました。

次のレイアークはどのような姿になるのでしょうか。もしかすると、もう現れないかもしれません。あるいは、異なる筋肉が必要かもしれません。美学がすべてであるとき、美学ではないあらゆる選択は亀裂になります。政治も、運営も、時間もそうです。しかしレイアークの十四年の軌跡は、もう一つの事実も示しています。台湾の indie ゲームチームには、世界の音楽ゲーム市場で希少なブランド位置を確立する能力があるということです。アジアでこれを成し遂げたのは、日本の BEMANI 体系と韓国の DJ Max シリーズだけでした。レイアークの物語はまだ終わっていません。2027 年に《Cytus II》が Nintendo Switch 2 に登場する日が、「美学帝国が AI 時代にも made-by-Taiwan を定義し続けられるか」を検証する次の節点になります。

---

## 関連記事

- [台湾ゲーム産業とデジタルエンターテインメント](/technology/台灣遊戲產業與數位娛樂) — 代理からオリジナルへ至る台湾ゲームの全景
- [赤燭遊戲](/technology/赤燭遊戲) — 台湾独立ゲームのもう一つの道：歴史で物語を語り、中国市場からの退出を選ぶ
- [大宇双剣](/technology/大宇雙劍) — 台湾ゲームが中国語で物語を語り始めた起点
- [傳奇網路と台湾オンラインゲームの海外展開](/technology/傳奇網路與台灣線上遊戲出海) — 台湾ゲームのもう一つの海外物語

---

## 画像出典

本文は 8 枚のライセンス画像を使用しており、すべて `public/article-images/technology/` に cache して、出典サーバーへのホットリンクを避けています。

- **rayark-cafe-2021.jpg**（hero） — [Wikimedia Commons File:Rayark Café 20211016.jpg](https://commons.wikimedia.org/wiki/File:Rayark_Café_20211016.jpg) — Photo: Solomon203, 2021-10-16, CC BY-SA 4.0
- **rayark-logo-2012.png**（inline，§一台のアーケード筐体が彼らに教えたこと） — [English Wikipedia File:Logo of Rayark Inc.png](https://en.wikipedia.org/wiki/File:Logo_of_Rayark_Inc.png) — Fair use editorial commentary on Rayark Inc. brand identity
- **cytus-ii-gameplay.png**（inline，§Cytus と Deemo） — [English Wikipedia File:Cytus II gameplay.png](https://en.wikipedia.org/wiki/File:Cytus_II_gameplay.png) — Fair use editorial commentary on Cytus series 代表的な玩法
- **deemo-cover.jpg**（inline，§Cytus と Deemo） — [English Wikipedia File:DeemoLastRecitalVita.jpg](https://en.wikipedia.org/wiki/File:DeemoLastRecitalVita.jpg) — Fair use editorial commentary on DEEMO シリーズ美術
- **rayark-booth-cosplayers-2018.jpg**（inline，§Switch ローンチの年） — [Wikimedia Commons](<https://commons.wikimedia.org/wiki/File:Cosplayers_of_Pipimi_and_Popuko_seen_from_behind_at_Rayark_booth_(40764217870).jpg>) — Photo: 2018 ACG event cosplay snapshot, CC BY-SA 2.0
- **voez-switch-cover.jpg**（inline，§Switch ローンチの年） — [English Wikipedia File:SwitchVOEZ.jpg](https://en.wikipedia.org/wiki/File:SwitchVOEZ.jpg) — Fair use editorial commentary on VOEZ NS ローンチ
- **sdorica-logo.png**（inline，§快適圏を踏み出す：萬象物語の八年） — [English Wikipedia File:Sdorica logo.png](https://en.wikipedia.org/wiki/File:Sdorica_logo.png) — Fair use editorial commentary on Sdorica ブランド識別
- **implosion-cover.png**（inline，§聚爆：第零日の十一年） — [English Wikipedia File:Implosion- Never Lose Hope - cover.png](https://en.wikipedia.org/wiki/File:Implosion-_Never_Lose_Hope_-_cover.png) — Fair use editorial commentary on Implosion ゲーム identity

---

## 参考資料

[^rayark-wiki]: [雷亞遊戲 — 維基百科](https://zh.wikipedia.org/zh-tw/%E9%9B%B7%E4%BA%9E%E9%81%8A%E6%88%B2) — 6 人の共同創業者（鐘志遠、游名揚、張世群、謝昌晏、楊善詠、李勇霆）、2011 年 9 月設立、金山北路、16 人チーム、資本金 3,000 万元、製品タイムライン

[^kopu]: [雷亞：台灣少數自主開發並帶有獨樹一幟風格的手遊廠 — 寫點科普 Lynn](https://kopu.chat/rayark/) — Hypaa Studio THEIA の物語、游名揚の直接引用「画面と音楽が重要」、会社創業の背景

[^csiecomm-2013]: [B92 游名揚 B91 楊善詠 B92 謝昌晏（雷亞遊戲公司） — csiecomm 部落格](http://csiecomm.blogspot.com/2013/07/b92-b91-b92.html) — 2012-12-07 インタビュー；游名揚が森林系からネットワーク・マルチメディア研究所へ移ったこと、楊善詠 B91、謝昌晏 B92；游名揚「もともとは資訊工程学系に入りたかったのですが、試験がうまくいかなかったので森林系に行きました」という直接引用

[^ithome-rayark]: [雷亞從 PaaS 轉而擁抱容器，3 人就可以維運百萬人遊戲 — iThome](https://www.ithome.com.tw/people/109212) — CTO 鐘志遠が主導したコンテナ化移行、レイアーク GCP 50 個の K8s clusters

[^sdorica-wiki]: [Sdorica 萬象物語 — 維基百科](https://zh.wikipedia.org/zh-hant/Sdorica_%E8%90%AC%E8%B1%A1%E7%89%A9%E8%AA%9E) — 2013 企画 / 2014 開発 / 2018-04-19 オープンベータ；事前登録 150 万；4/30 に 250 万ダウンロード突破；5/11 に 500 万ダウンロード突破；プロデューサー謝昌晏

[^bnext-rayark]: [雷亞遊戲：iOS 千人 5 星評價遊戲 Cytus 幕後功臣 — 數位時代](https://www.bnext.com.tw/article/22202/BN-ARTICLE-22202) — 李勇霆がディレクター兼会社スポークスパーソン、游名揚共同創業者、張世群共同創業者

[^cytus-wiki]: [Cytus — Wikipedia](https://en.wikipedia.org/wiki/Cytus) — 2012-01-12 iOS / 4-13 Android リリース；2015-04 に有料ダウンロード 100 万達成；14 か国ランキング 1 位；日本音楽ゲームランキング 29 日連続 1 位

[^deemo-wiki]: [Deemo — Wikipedia](https://en.wikipedia.org/wiki/Deemo) — 2013-11-13 iOS / 12-27 Android；2015-06-24 Vita；2014-10 累計 700 万ダウンロード；2021 アニメ発表時 2,800 万ダウンロード；受賞；DEEMO -Reborn-；DEEMO II；Memorial Keys アニメ；Nintendo Switch 版 Metacritic 88

[^deemo2-gnn]: [雷亞遊戲十週年紀念作《DEEMO II》於全球正式上市 — 巴哈姆特 GNN](https://gnn.gamer.com.tw/detail.php?sn=226618) — DEEMO II 2022-01-13 リリース；初週 100 万ダウンロード；事前登録は全世界 100 万プレイヤー

[^implosion-wiki]: [Implosion: Never Lose Hope — Wikipedia](https://en.wikipedia.org/wiki/Implosion:_Never_Lose_Hope) — 2015-04-08 iOS/Android、2017-07-06 Switch；受賞；Metacritic 93；発売 1 週間で 91.9% 五つ星；2015 iOS Game of the Year Asia + 2015 巴哈 ACG 創作大賞 + 2014 Unity Awards Golden Cube；Zero Day 90 分アニメ進行中

[^voez-4gamers]: [雷亞《VOEZ》即將登陸 Nintendo Switch — 4Gamers](https://www.4gamers.com.tw/news/detail/31551/voze-achieved-10-million-download-and-will-be-launch-in-nintendo-switch) — VOEZ は 2017 年初めまでに 1,000 万ダウンロード突破；2017-03-03 NS ローンチタイトル

[^voez-nintendo-life]: [VOEZ (2017) — Nintendo Life](https://www.nintendolife.com/games/switch-eshop/voez) — Nintendo Life 評価 8/10「NS の秘密兵器」

[^cytus2-gematsu]: [Cytus II coming to Switch 2, Switch in 2027 — Gematsu](https://www.gematsu.com/2026/05/cytus-ii-coming-to-switch-2-switch-in-2027) — 2026-05-22 に NS / NS2 2027 年発売を発表；全世界累計 1,800 万ダウンロード；500+ 曲

[^cytus2-qooapp]: [雷亞人氣節奏遊戲《Cytus II》確定推出 Switch 2／Switch 版 — QooApp](https://news.qoo-app.com/post/436892/cytus-ii-switch) — 中国語ニュースによる補足確認；2027 年発売

[^moegirl-sdorica]: [Sdorica 萬象物語 — 萌娘百科](https://zh.moegirl.tw/%E4%B8%87%E8%B1%A1%E7%89%A9%E8%AF%AD) — レイアーク・ゲームズ開発・出版；2018-04-19 リリース；プロデューサー謝昌晏

[^sdorica-udn]: [《Sdorica 萬象物語》活動頻出包 — udn 遊戲角落](https://game.udn.com/game/story/10453/3209024) — 2018 年 6 月、Sdorica リリース後のサーバー混雑、ガチャ未開放、端午節の文字化け、殘光粉末未配布など一連の運営論争

[^sdorica-bahamut-policy]: [《Sdorica 萬象物語》營運方針調整通知 — 巴哈姆特哈啦板](https://forum.gamer.com.tw/C.php?bsn=29560&snA=11124) — 2026-02-11 メンテナンスモード中国語公告；2026-07 以降は新復刻を開放しない；プレイヤーコミュニティの議論

[^sdorica-gachago]: [Sdorica Enters Maintenance Mode After Final Character Releases — Gacha Go!](https://gachago.com/en/news/sdorica-enters-maintenance-mode-after-final-character-releases) — 2026-02-11 メンテナンスモード；Valdrir DR + Chiyuki DR 最後の二人のキャラクター；servers remain operational；Infuse rerun は 2026-07 まで；"Sdorica 主動開發生命週期結束"

[^silentblue-wilson-lam]: [Wilson Lam — SilentBlue.RemyWiki](https://silentblue.remywiki.com/Wilson_Lam) — ICE 本名 Wilson Lam；2014 年にレイアーク加入、音楽ディレクター；2020 年退職事件記録

[^itechpost-cytus2]: ['Cytus II' Taken Down in China Due to a Composer's Song Containing Hidden Pro-Hong Kong Morse Code Message — iTechPost](https://www.itechpost.com/articles/103452/20200722/cytus-ii-taken-down-in-china-due-to-a-composers-song-containing-hidden-pro-hong-kong-morse-code-message.htm) — 英語メディア視点での ICE 事件報道

[^udn-ice]: [被舉報作品暗藏摩斯電碼「光復香港」 雷亞音樂總監宣布離職 — udn 遊戲角落](https://game.udn.com/game/story/10453/4711560) — 2020-07-17 中国ネットユーザーによる掘り起こし；モールス符号の解読「香港人加油、光復香港、時代革命」；ICE 完全事件タイムライン

[^newtalk-ice]: [遭起底音樂藏反送中標語 雷亞音樂總監 Ice 自請離職 — Newtalk 新聞](https://newtalk.tw/news/view/2020-07-18/437743) — 2020-07-18 Ice 完全声明の逐語原文；龍淵公告要点

[^gnn-ice]: [雷亞遊戲音樂總監 Ice 因樂曲引發爭議宣布離職 — 巴哈姆特 GNN](https://gnn.gamer.com.tw/detail.php?sn=200246) — 巴哈姆特公式報道；レイアークと龍淵の共同公告

[^techorange-ice]: [音樂總監私人創作挺香港，雷亞遊戲微博切割的作法正確嗎？— TechOrange 科技報橘](https://techorange.com/2020/07/20/rayark-ice-support-hk-resign/) — 2020-07-20 レイアークは同日まで台湾公式プラットフォームで正式説明を出していなかった；プレイヤーコミュニティの疑問

[^4gamers-cytus2-ice-removal]: [中國《Cytus II》下架整改，ICE 創作樂曲將全數刪除 — 4Gamers](https://www.4gamers.com.tw/news/detail/44034/cytus-ii-ban-songs-by-ice-in-china) — 2021-05 6 曲の ICE 楽曲削除；既に課金したプレイヤーへの補償

[^pocketgamer-cytus2]: [China pulls Cytus II from the App Store for secret pro-democracy Morse code message — PocketGamer.biz](https://www.pocketgamer.biz/asia/news/73974/china-pulls-cytus-ii-from-app-store/) — 英語業界メディアの framing；国際メディアの視点

[^inside-zero-day]: [雷亞遊戲《Implosion》改編動畫電影《聚爆：第零日》將登上 Kickstarter 募資 — INSIDE](https://www.inside.com.tw/article/5271-implosion-zero) — 2015-12-05 Kickstarter 開始；48 時間で目標額の 18% 達成

[^implosion-zero-day-wiki]: [聚爆：第零日 — 維基百科](https://zh.wikipedia.org/zh-tw/%E8%81%9A%E7%88%86%EF%BC%9A%E7%AC%AC%E9%9B%B6%E6%97%A5) — 10 日で台湾ドル 500 万元突破；当初 2018-08 完成予定；2020 年後は新公告なし

[^disp-bbs-implosion]: [雷亞 聚爆 zero 電影 三度跳票 — Disp BBS ACG 板](https://disp.cc/b/ACG/b7Iw) — 2019-01-24 三度目の延期告知；返金案；プレイヤー批判の逐語引用

[^rayark-104]: [雷亞遊戲股份有限公司｜徵才中 — 104 人力銀行](https://www.104.com.tw/company/1a2x6bj6qc) — 従業員 270 人；資本金 6,400 万；累計 1.3 億ダウンロード；製品 list

[^rayark-twitter-ai]: [雷亞官方推特 AI 美術澄清公告](https://twitter.com/RayarkOfficial/status/1662466448709816331) — 2023-05-27 「AI 創作によってゲームに必要な大量の画像を作成したことはなく、そのために美術チームを解雇したこともない」原文

[^gnn-rayark-ai]: [雷亞遊戲澄清並未因導入 AI 技術大量解雇美術人員 — 巴哈姆特 GNN](https://gnn.gamer.com.tw/detail.php?sn=250502) — レイアーク公式澄清公告の完全中国語

[^rayark-concept-fb]: [Rayark Concept Facebook](https://www.facebook.com/RayarkConcept/) — 2024-10-14 オンラインストア運営終了公告

[^pentavision-wiki]: [Pentavision — 維基百科](https://zh.wikipedia.org/zh-hans/Pentavision) — 2006-04 Neowiz に買収；2008 DJ Max Technika；2012 清算・倒産；Neowiz が完全吸収

[^digitaltoday-neowiz]: [Neowiz posts 60 billion won 2025 operating profit, up 82.2 percent — DigitalToday](https://www.digitaltoday.co.kr/en/view/3459/neowiz-2025-operating-profit-60-billion-won-up-822-percent) — 2024-12 DJ Max Respect V 600 万ダウンロード；2025 Neowiz 年間売上高が過去最高

[^deemo-movie-rayark]: [雷亞遊戲旗下音樂遊戲《DEEMO》動畫劇場版「DEEMO THE MOVIE」— 雷亞官方](https://rayark.com/zh/news/20201113_deemomovie/) — DEEMO THE MOVIE 制作会社 Production I.G + Signal.MD、総監督藤咲淳一、監督松下周平、主題歌梶浦由記

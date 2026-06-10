/**
 * opendata-content.ts — /opendata（OpenData 策展）per-lang editorial content.
 *
 * 跟 mcp-content.ts 同一套機制：zh-TW 是 canonical，其他語言缺 key 時
 * template 以 OPENDATA_CONTENT[lang] ?? OPENDATA_CONTENT['zh-TW'] fallback。
 * 翻譯階段（哲宇確認中文定稿後）再補 en / ja / ko / es / fr 物件。
 *
 * 機器資料（20 domains / 21 tools / 15 showcase datasets）不在這裡——
 * 在 src/data/opendata-curation.json（scripts/tools/twinkle-hub-crawl.py 產生）。
 * 這個檔案只放 Taiwan.md 的策展判斷：怎麼評估、怎麼組合、對應哪些文章。
 */

export type OpendataLang = 'zh-TW' | 'en' | 'ja' | 'ko' | 'es' | 'fr';

interface LinkItem {
  title: string;
  href: string;
}

interface Recipe {
  question: string;
  datasets: { name: string; href: string; freq: string }[];
  combine: string;
  method: string;
  articles: LinkItem[];
}

interface DomainMap {
  /** domain key（對齊 opendata-curation.json 的 domains[].key） */
  key: string;
  /** Taiwan.md 對應文章（驗證過存在的路徑） */
  articles?: LinkItem[];
  /**
   * 故事還沒寫成文章的領域：策展已完成（旗艦資料集 + 分析路徑 + 可寫的故事），
   * 文章待寫。2026-06-10 哲宇 directive「待開發的東西全部開發完跟思考完」。
   */
  proposed?: {
    story: string;
    datasets: { name: string; href: string; freq: string }[];
    how: string;
  };
}

export interface OpendataContent {
  meta: { title: string; description: string };
  hero: {
    eyebrow: string;
    title: string;
    subtitle: string;
    intro: string[];
    viz: {
      stats: { n: number; suffix: string; label: string }[];
      graphHint: string;
      legend: {
        domain: string;
        vertical: string;
        article: string;
        center: string;
      };
    };
  };
  ecosystem: {
    title: string;
    lead: string;
    layers: { name: string; role: string; desc: string; stat: string }[];
  };
  assessment: {
    title: string;
    lead: string;
    dims: {
      name: string;
      verdict: string;
      points: string[];
      gaps: string[];
    }[];
    gapsLabel: string;
  };
  verticals: {
    title: string;
    lead: string;
    items: { name: string; stat: string; desc: string }[];
  };
  domains: {
    title: string;
    lead: string;
    questionsLabel: string;
    articlesLabel: string;
    blankLabel: string;
    proposedStoryLabel: string;
    proposedHowLabel: string;
    map: DomainMap[];
  };
  recipes: {
    title: string;
    lead: string;
    combineLabel: string;
    methodLabel: string;
    articlesLabel: string;
    items: Recipe[];
  };
  method: {
    title: string;
    lead: string;
    items: { name: string; desc: string }[];
  };
  tools: {
    title: string;
    lead: string;
    groups: { prefix: string[]; label: string }[];
  };
  footer: {
    crawledLabel: string;
    note: string;
    pilotTitle: string;
    pilotLead: string;
    pilotArticles: LinkItem[];
  };
}

export const OPENDATA_CONTENT: Partial<
  Record<OpendataLang, OpendataContent>
> & {
  'zh-TW': OpendataContent;
} = {
  'zh-TW': {
    meta: {
      title: 'OpenData 策展 — 台灣開放資料 × Twinkle Hub 的意義層導覽',
      description:
        '五萬個政府資料集對任何人都是壓垮性的。這一頁是 Taiwan.md 的資料策展：哪些資料值得看、要分析一件事該怎麼組合、以及每一批數字跟島上哪些故事相連。含對 Twinkle Hub 完整性、穩定性、存取簡化的第一手實測評估。',
    },
    hero: {
      eyebrow: 'OPEN DATA CURATION',
      title: 'OpenData 策展',
      subtitle: '台灣開放資料 × Twinkle Hub 的意義層導覽',
      intro: [
        '台灣政府的開放資料平台上有將近五萬個資料集。這個數字對任何想用它的人都是壓垮性的：你不知道哪個重要、哪個更新到什麼時候、哪兩張表可以對在一起，更不知道它們跟你關心的問題有什麼關係。',
        'Taiwan.md 寫了九百多篇關於台灣的文章，每一篇背後都有「這件事該用什麼資料驗證」的判斷。這一頁把這層判斷攤開來：我們怎麼評估資料基礎建設、要分析一件事的時候用哪些資料集怎麼組合、以及每一個資料領域跟島上哪些故事相連。',
      ],
      viz: {
        stats: [
          { n: 49343, suffix: '', label: '政府資料集' },
          { n: 1240000, suffix: '+', label: '判決書全文' },
          { n: 320663, suffix: '', label: '國考題目' },
          { n: 226825, suffix: '', label: '營養分析列' },
          { n: 135000, suffix: '+', label: '採購紀錄' },
        ],
        graphHint:
          '下面這張網是真的：左側是 20 個資料領域與五大語料庫（即時爬取），右側是已經寫成的 Taiwan.md 文章。每一條線都是本頁的策展判斷。拖拉、懸停，看複雜的資料怎麼接上清晰的故事。',
        legend: {
          domain: '資料領域',
          vertical: '垂直語料庫',
          article: 'Taiwan.md 文章',
          center: 'Taiwan.md 意義層',
        },
      },
    },
    ecosystem: {
      title: '生態地圖：三層各守一層',
      lead: '一個 AI（或一個人）要真正回答「關於台灣的事」，需要三層合作：資料的家、查詢的路、意義的層。',
      layers: [
        {
          name: 'data.gov.tw 與各機關系統',
          role: '資料的家（SSOT）',
          desc: '政府資料開放平臺是每個資料集的持久身分：dataset 編號、授權條款、主管機關、原始下載。所有引用最終都該回到這裡。',
          stat: '約 5 萬個資料集',
        },
        {
          name: 'Twinkle Hub',
          role: '查詢的路（MCP 閘道）',
          desc: '台灣第一個 MCP Hub，把分散在上百個政府入口的資料包成單一查詢端點：語意搜尋、結構化查列、五個垂直領域工具。讓 AI 一次呼叫就拿到資料，省掉跨入口的人工泥沼。',
          stat: '21 個工具・20 個領域',
        },
        {
          name: 'Taiwan.md',
          role: '意義的層（策展）',
          desc: '資料不會自己說話。哪個資料集值得指、它驗證哪個論點、跟哪段歷史相連——這是策展的工作。我們的文章從 2026 年 6 月起逐篇接上「公開數據」段，把敘事跟原始資料縫在一起。',
          stat: '900+ 篇文章・15 個資料集指標上線',
        },
      ],
    },
    assessment: {
      title: '三維評估：我們實測到什麼',
      lead: '以下是 Taiwan.md 以使用者身分、用自己的查核工具做的第一手評估（2026 年 5 月與 6 月兩輪實測），按三個維度攤開。不是廣告，是體檢。',
      gapsLabel: '誠實的缺口',
      dims: [
        {
          name: '資料的完整',
          verdict: '覆蓋面是真的，而且超出鏡像',
          points: [
            '收錄 data.gov.tw 約 96.6% 全量（49,343 個資料集，2026-06-05 盤點），外加 13.5 萬筆政府電子採購紀錄與立法院資料',
            '20 個領域分類各帶「典型問題」與「定錨範例」，每個資料集標品質分層（白金到銅）、更新頻率、格式與可串連鍵',
            '自策資料集補了政府入口的洞：全國實價登錄（買賣／預售／租賃）直接接內政部地政司系統',
            '五個垂直語料庫超出單純鏡像：專利全文、國考題庫、判決書、藥證與食品營養（規模見下節）',
          ],
          gaps: [
            '搜尋排名偏向縣市切片：搜「出生率」回來是南投、桃園、高雄三個縣市級資料集，全國尺度的那一份要靠人挑——這正是策展存在的理由',
            '查不到每個領域的資料集總數，盤點只能靠官方宣稱數字',
            '部分老資料集仍是未正規化的 ODS 格式，無法結構化查列',
          ],
        },
        {
          name: '穩定性',
          verdict: 'alpha 本色：跑得快，也改得快',
          points: [
            '查詢延遲實測快取命中低於 100ms，每次回應帶 trace_id 與成本欄位，透明度好',
            '工具描述內嵌版本號（v1.11.2 聚合查詢、v1.18 判決書），迭代節奏看得見',
            '判決書語料目前明標 alpha 範圍（2024-05 至 2026-03 共約 124 萬筆）——標清楚邊界比假裝完整誠實',
          ],
          gaps: [
            '兩個月內兩次 API 介面變動：2026-05-11 到 06-10 之間，連線方式改為 session 握手、工具從 40 個重組為 21 個、整組確定性工具下架',
            'alpha 期已出現流量限制（HTTP 429），但限制窗口未公布',
            '我們的對策：薄包裝層隔離介面變動，文章引用一律寫成靜態指標、不在執行期依賴 API——任何 alpha 服務都該這樣接',
          ],
        },
        {
          name: '存取的簡化',
          verdict: '這是它最強的一面',
          points: [
            '一個 MCP 端點取代上百個政府入口：搜尋、取 metadata、查列、彙整四段式，欄位 schema 一致',
            '結構化查列支援 SQL 條件與聚合，已正規化的資料集可以直接當資料庫用',
            '同一個地址、年份、行政區問題，過去要跨三到五個入口人工核對 15 到 30 分鐘；現在一次呼叫不到一秒',
            '一鍵安裝包讓 Claude、Cursor 等十種以上 AI 客戶端直接接上——「讓 AI 讀得到台灣的資料」這件事的摩擦力被砍掉一個數量級',
          ],
          gaps: [
            '需要 API 金鑰（bearer token），目前 alpha 免費、未來按工具計費——免費路徑會不會永遠存在，是開放資料生態該持續追問的問題',
            '服務本身閉源：資料是開放的，通道目前不是。data.gov.tw 的原始下載永遠是繞過任何閘道的保底路徑',
          ],
        },
      ],
    },
    verticals: {
      title: '五個垂直語料庫：超出鏡像的部分',
      lead: '把資料集包成搜尋介面不稀奇；下面這五個垂直領域做了語意檢索與結構化抽取，是 Twinkle Hub 超出「data.gov.tw 鏡像」的部分。',
      items: [
        {
          name: '專利',
          stat: 'TIPO 發明專利公開案全文',
          desc: '自然語言查詢專利語料，可取完整技術描述與請求項。寫台灣產業文章時，「這家公司真的有這個技術嗎」第一次可以用語意搜尋驗證。',
        },
        {
          name: '國家考試',
          stat: '64,815 份試卷・32 萬題（2012–2025）',
          desc: '考選部歷年試卷與題目級檢索。台灣的國考文化（公職熱、補習街）是還沒被資料化說過的故事。',
        },
        {
          name: '判決書',
          stat: '約 124 萬筆（2024-05 至 2026-03，alpha）',
          desc: '白話檢索判決書語料。司法、勞資、租屋糾紛類文章的「實務上法院怎麼判」有了可查證的入口。',
        },
        {
          name: '藥品與健康',
          stat: '71,836 件藥證・96,803 個 ICD-10 中文碼',
          desc: '藥品許可證、仿單結構化欄位、健康食品認證、交互作用初篩。健保與醫療文章的事實層。',
        },
        {
          name: '食品營養',
          stat: '226,825 列營養分析',
          desc: '衛福部食品營養成分資料庫：每個食材二十多項營養素，可按營養素排行、可算一餐總和。夜市與飲食文章的數字底。',
        },
      ],
    },
    domains: {
      title: '二十個資料領域 × Taiwan.md 的故事地圖',
      lead: '左邊是 Twinkle Hub 的領域分類（即時爬取），右邊是我們的策展對應：這個領域的資料跟島上哪些文章相連。標「故事待寫」的領域，旗艦資料集與分析路徑已經策展完成，文章還沒寫成：那是我們的開發地圖，也是給任何想寫的人的邀請。',
      questionsLabel: '典型問題',
      articlesLabel: '相連的文章',
      blankLabel: '故事待寫',
      proposedStoryLabel: '可以寫成的故事',
      proposedHowLabel: '怎麼分析',
      map: [
        {
          key: 'realestate_land',
          articles: [
            { title: '國宅與居住正義', href: '/society/國宅與居住正義' },
            {
              title: '社會住宅與居住正義',
              href: '/society/社會住宅與居住正義',
            },
          ],
        },
        {
          key: 'economy_business',
          articles: [
            { title: '經濟分類文章總覽', href: '/economy' },
            {
              title: '台灣企業：中華電信',
              href: '/economy/台灣企業：中華電信',
            },
          ],
        },
        {
          key: 'procurement_subsidy',
          proposed: {
            story: '誰標到了台灣：13.5 萬筆決標紀錄裡的政府外包地圖',
            datasets: [
              {
                name: '政府電子採購網招標／決標公告',
                href: 'https://web.pcc.gov.tw/',
                freq: '每半月',
              },
              {
                name: '巨額採購履約期間廠商名單',
                href: 'https://data.gov.tw/dataset/7264',
                freq: '每 1 日',
              },
            ],
            how: '以統一編號把決標紀錄接上商業登記：一家廠商歷年從哪些機關標到多少錢。金額、機關、年份三軸做成熱力圖，公共支出的地理跟人脈會自己浮出來。',
          },
        },
        {
          key: 'public_finance',
          proposed: {
            story: '國家的負債表：中央政府欠了多少錢、用什麼速度還',
            datasets: [
              {
                name: '中央政府近期公共債務概況表',
                href: 'https://data.gov.tw/dataset/12146',
                freq: '每 1 月',
              },
              {
                name: '紓困特別預算歲出執行明細',
                href: 'https://data.gov.tw/dataset/127428',
                freq: '不定期',
              },
            ],
            how: '債務餘額做月序列，對照 GDP 與公共債務法的舉債上限；再把歷年特別預算（防疫、前瞻、強韌）逐筆疊上去，看「例外動支」怎麼變成常態。',
          },
        },
        {
          key: 'tax_revenue',
          proposed: {
            story: '你的縣市靠什麼稅活著：地方財政的體質檢查',
            datasets: [
              {
                name: '桃園市地方稅實徵淨額每年統計',
                href: 'https://data.gov.tw/dataset/147936',
                freq: '每 1 年',
              },
              {
                name: '花蓮縣各項稅捐實徵淨額（本月數）',
                href: 'https://data.gov.tw/dataset/177569',
                freq: '不定期',
              },
            ],
            how: '各縣市實徵淨額按稅目拆開：誰靠地價稅與房屋稅（都會區），誰靠中央統籌分配（非都會）。跟人口與房價資料用行政區代碼對齊，財政自主性的排行自己就算得出來。',
          },
        },
        {
          key: 'transport',
          articles: [
            { title: '台灣交通系統', href: '/lifestyle/台灣交通系統' },
            { title: '台灣機車文化', href: '/lifestyle/台灣機車文化' },
          ],
        },
        {
          key: 'public_safety',
          articles: [{ title: '颱風', href: '/nature/颱風' }],
        },
        {
          key: 'judicial_legal',
          articles: [
            {
              title: '台灣司法改革與預防性羈押制度',
              href: '/society/台灣司法改革與預防性羈押制度',
            },
          ],
        },
        {
          key: 'legislature',
          articles: [{ title: '太陽花學運', href: '/society/太陽花學運' }],
        },
        {
          key: 'health_food',
          articles: [
            {
              title: '台灣醫療與全民健保',
              href: '/lifestyle/台灣醫療與全民健保',
            },
          ],
        },
        {
          key: 'environment',
          articles: [
            { title: '台灣環境運動史', href: '/nature/台灣環境運動史' },
            {
              title: '台灣氣候危機與淨零轉型',
              href: '/nature/台灣氣候危機與淨零轉型',
            },
          ],
        },
        {
          key: 'education_research',
          articles: [
            { title: '台灣教育制度', href: '/lifestyle/台灣教育制度' },
            { title: '台灣偏鄉教育', href: '/society/台灣偏鄉教育' },
          ],
        },
        {
          key: 'agriculture_fisheries',
          articles: [
            { title: '台灣咖啡產業', href: '/food/台灣咖啡產業' },
            { title: '茶文化', href: '/food/茶文化' },
          ],
        },
        {
          key: 'labor_employment',
          proposed: {
            story: '投保薪資的天花板：三張勞動部的表，看見台灣人的真實薪水',
            datasets: [
              {
                name: '勞保投保單位、人數及平均投保薪資',
                href: 'https://data.gov.tw/dataset/100999',
                freq: '每 1 年',
              },
              {
                name: '就業保險投保統計',
                href: 'https://data.gov.tw/dataset/101000',
                freq: '每 1 年',
              },
              {
                name: '職災保險投保統計',
                href: 'https://data.gov.tw/dataset/161743',
                freq: '每 1 年',
              },
            ],
            how: '勞保、就保、職災三套投保薪資按行業與單位規模交叉。注意 45,800 元投保上限造成的右側截斷：不先處理，高薪行業的平均值會被系統性低估，「平均薪資」的爭論一半來自這裡。',
          },
        },
        {
          key: 'social_population',
          articles: [
            { title: '台灣少子化危機', href: '/society/台灣少子化危機' },
            { title: '2026 九合一選舉', href: '/politics/2026 九合一選舉' },
          ],
        },
        {
          key: 'culture_tourism_sport',
          articles: [
            { title: '夜市文化', href: '/culture/夜市文化' },
            { title: '台灣棒球文化', href: '/culture/台灣棒球文化' },
          ],
        },
        {
          key: 'foreign_affairs',
          articles: [
            {
              title: '台灣邦交國與國際外交',
              href: '/society/台灣邦交國與國際外交',
            },
          ],
        },
        {
          key: 'gov_publication',
          proposed: {
            story: '公報裡的台灣：政府每個月自己公告了什麼',
            datasets: [
              {
                name: '行政院公報資訊網',
                href: 'https://gazette.nat.gov.tw/',
                freq: '每 1 日',
              },
              {
                name: '臺北市政府公報',
                href: 'https://data.gov.tw/dataset/132348',
                freq: '每 1 月',
              },
            ],
            how: '公報全文做法規異動的關鍵詞時間序列，再對照 legislature 域的立法院紀錄：行政公告與立法軌跡之間的時間差，就是一項政策真正生效的速度。',
          },
        },
        {
          key: 'geo_basemap',
          articles: [
            { title: '台灣地圖怎麼讀', href: '/geography/台灣地圖怎麼讀' },
          ],
        },
        {
          key: 'utilities_telecom',
          articles: [
            { title: '台灣與核能的討論', href: '/society/台灣與核能的討論' },
          ],
        },
      ],
    },
    recipes: {
      title: '分析組合：要看懂一件事，用哪些資料、怎麼組',
      lead: '這是這一頁的核心。每張卡片是一個真實的分析問題：用哪些資料集、靠什麼鍵組合、用什麼方法看，以及哪篇文章已經把這個分析寫成了故事。',
      combineLabel: '怎麼組合',
      methodLabel: '怎麼分析最好',
      articlesLabel: '已經寫成的故事',
      items: [
        {
          question: '居住正義：政府蓋的便宜房，最後養肥了誰？',
          datasets: [
            {
              name: '全國實價登錄（買賣）',
              href: 'https://lvr.land.moi.gov.tw/',
              freq: '每 3 月',
            },
            {
              name: '臺北市國民住宅配售（租）情形',
              href: 'https://data.gov.tw/dataset/121267',
              freq: '不定期',
            },
            {
              name: '臺北市社宅包租代管媒合統計',
              href: 'https://data.gov.tw/dataset/155779',
              freq: '每 1 年',
            },
          ],
          combine:
            '以行政區與社區名對齊：國宅配售紀錄給「政府當年用什麼價賣出」，實價登錄給「同一個門牌今天值多少」，社宅統計給「不賣改租之後的量」。',
          method:
            '同一社區做時間序列，再用政策節點切段對照：1985 配售、2002 拆牆、2016 只租不售、2026 桃園回賣。增值倍數除以年數，就是「資產扶梯」的斜率。',
          articles: [
            { title: '國宅與居住正義', href: '/society/國宅與居住正義' },
            {
              title: '社會住宅與居住正義',
              href: '/society/社會住宅與居住正義',
            },
          ],
        },
        {
          question: '能源轉型：核電歸零又重啟，數字上發生了什麼？',
          datasets: [
            {
              name: '台電近10年核能發電績效及減碳效益',
              href: 'https://data.gov.tw/dataset/10859',
              freq: '每 1 年',
            },
            {
              name: '台電核能發電廠位置及機組設備',
              href: 'https://data.gov.tw/dataset/10858',
              freq: '不定期',
            },
          ],
          combine:
            '發電績效給年度發電量與容量因數，機組表給每部機的除役時點。兩張表用年份對齊，再疊上公投與政策節點。',
          method:
            '畫一條容量因數年度曲線，標三場公投（2018、2021、2025）：曲線怎麼走向零、公投過後一年內有沒有任何一個數字動了——「政治決定」與「物理現實」的時差會自己浮出來。',
          articles: [
            { title: '台灣與核能的討論', href: '/society/台灣與核能的討論' },
            {
              title: '台灣氣候危機與淨零轉型',
              href: '/nature/台灣氣候危機與淨零轉型',
            },
          ],
        },
        {
          question: '健保財務：誰在用、誰在繳，這套制度還撐得住幾年？',
          datasets: [
            {
              name: '健保保險對象按類別性別年齡層統計',
              href: 'https://data.gov.tw/dataset/20254',
              freq: '每 3 月',
            },
            {
              name: '全民健康保險會會議議事錄',
              href: 'https://data.gov.tw/dataset/7554',
              freq: '每 1 月',
            },
            {
              name: '各級政府補助弱勢保險對象統計',
              href: 'https://data.gov.tw/dataset/23719',
              freq: '每 1 月',
            },
          ],
          combine:
            '年齡層投保人數算出「繳的人」跟「用的人」的結構比，議事錄給費率決策的時間軸，弱勢補助統計給「量能付費」的執行面。',
          method:
            '把年齡結構比做成逐季序列，疊上費率決策節點：結構在惡化、費率不動，中間的缺口靠什麼補（撥補、點值、部分負擔），議事錄裡每一次「維持不調整」都有對應的代價條目。',
          articles: [
            {
              title: '台灣醫療與全民健保',
              href: '/lifestyle/台灣醫療與全民健保',
            },
            { title: '台灣少子化危機', href: '/society/台灣少子化危機' },
          ],
        },
        {
          question: '民主品質：一場選舉的母體多大、查察強度多強？',
          datasets: [
            {
              name: '選舉人數（中選會）',
              href: 'https://data.gov.tw/dataset/27491',
              freq: '每 4 年',
            },
            {
              name: '違反選罷法案件裁判確定人數',
              href: 'https://data.gov.tw/dataset/15035',
              freq: '每 1 月',
            },
          ],
          combine:
            '選舉人數給每屆選舉的母體，選罷法裁判統計給賄選與介選的歷年定罪量。兩者都能按縣市切，跟選舉結果對齊。',
          method:
            '每屆選舉做一組「母體 × 定罪率」對照，跨屆比較查察強度的變化；2026 這屆多了 AI 假訊息這個新查察重點，傳統兩項（賄選、介選）的基線先立好，新威脅的量才有參照系。',
          articles: [
            { title: '2026 九合一選舉', href: '/politics/2026 九合一選舉' },
            { title: '太陽花學運', href: '/society/太陽花學運' },
          ],
        },
        {
          question: '街頭經濟：23 萬個攤位的產值是怎麼算出來的？',
          datasets: [
            {
              name: '攤販經營概況調查',
              href: 'https://data.gov.tw/dataset/10918',
              freq: '每 5 年',
            },
            {
              name: '臺中市列管夜市',
              href: 'https://data.gov.tw/dataset/85028',
              freq: '不定期',
            },
          ],
          combine:
            '主計總處的五年普查給全國攤販的母體（攤數、從業人員、營收），縣市列管清單給「正式被政府承認的夜市」名錄。',
          method:
            '跨期普查比較是關鍵：攤位數與營收的五年變化，對照行動支付滲透與觀光人次。下一次普查發布時，所有引用 23.3 萬攤的文章都該回來對表。',
          articles: [
            { title: '夜市經濟學', href: '/economy/夜市經濟學' },
            { title: '夜市文化', href: '/culture/夜市文化' },
          ],
        },
        {
          question: '交通安全：1,400 萬輛機車與每年三千條人命的關係？',
          datasets: [
            {
              name: '機動車輛登記數統計',
              href: 'https://data.gov.tw/dataset/14208',
              freq: '每 1 月',
            },
            {
              name: '桃園市 A1/A2 事故傷亡統計（91–114 年）',
              href: 'https://data.gov.tw/dataset/25932',
              freq: '每 1 年',
            },
          ],
          combine:
            '車輛登記數給分母（暴險量），事故傷亡給分子。縣市級長序列（桃園 24 年）先當方法樣板，再擴到其他縣市。',
          method:
            '別只看死亡絕對數——用每十萬輛車傷亡率 normalize，機車與汽車分開算；「行人地獄」的爭論需要的正是這個分母。',
          articles: [
            { title: '台灣交通系統', href: '/lifestyle/台灣交通系統' },
            { title: '台灣機車文化', href: '/lifestyle/台灣機車文化' },
          ],
        },
      ],
    },
    method: {
      title: '串連方法論：讓兩張表對在一起的鍵',
      lead: '單一資料集是一個點，能組合才是一張網。這些是我們實測下來最有用的串連線索。',
      items: [
        {
          name: '行政區代碼',
          desc: '最通用的串連鍵。縣市與鄉鎮市區的標準代碼讓人口、房價、事故、稅收可以對齊到同一張地圖；同名區（兩個信義區）靠代碼消歧。',
        },
        {
          name: '統一編號',
          desc: '公司的身分證。商業登記、採購得標、專利申請、裁罰名單都掛統編——追一家公司的完整足跡靠它。',
        },
        {
          name: '經緯度與測站代碼',
          desc: '環境資料（空品、水質、氣象）掛測站，地理資料掛座標。跟行政區代碼互換是空間分析的第一步。',
        },
        {
          name: '品質分層',
          desc: '白金到銅的分層是「這個資料集可不可以直接用」的快篩：白金級多半已正規化、可結構化查列；未檢測的（如自策的實價登錄）要自己驗。',
        },
        {
          name: '更新頻率即分析解析度',
          desc: '每月更新的資料能做事件研究，每年的只能看趨勢，每五年的（攤販普查）只能跨期比較。先看頻率再設計分析，不要反過來。',
        },
        {
          name: '雙層指標原則',
          desc: 'Taiwan.md 文章引用資料集時，連結永遠指 data.gov.tw 或主管機關的持久頁面，查詢層（Twinkle Hub）是並列的加值路徑。資料的家與查詢的路分開，任何一層變動都不會斷鏈。',
        },
      ],
    },
    tools: {
      title: '工具型錄：21 個工具的完整清單',
      lead: '以下直接爬自 MCP 端點（每次重建頁面時更新）。分組是我們加的。',
      groups: [
        {
          prefix: [
            'search_datasets',
            'get_dataset',
            'query_rows',
            'materialize_dataset',
            'list_domains',
          ],
          label: '資料集四件套 + 領域索引',
        },
        { prefix: ['search_patents', 'get_patent_body'], label: '專利' },
        {
          prefix: ['search_exam', 'search_exam_questions', 'get_exam_paper'],
          label: '國家考試',
        },
        { prefix: ['search_judicial', 'get_judicial_full'], label: '判決書' },
        {
          prefix: [
            'lookup_icd10',
            'search_drug',
            'get_drug_details',
            'search_health_supplements',
            'search_drug_label',
            'check_drug_interaction',
          ],
          label: '藥品與醫療代碼',
        },
        {
          prefix: [
            'query_food_nutrition',
            'search_foods_by_nutrient',
            'analyze_meal_nutrition',
          ],
          label: '食品營養',
        },
      ],
    },
    footer: {
      crawledLabel: '本頁工具與領域清單即時爬取於',
      note: 'Twinkle Hub 處於 alpha，本頁的評估會隨它的演進更新。Taiwan.md 與 Twinkle Hub 目前沒有任何商業關係；這一頁是一個重度使用者的第一手體檢，也是一份邀請：資料層與意義層合作，台灣才會被完整地理解。',
      pilotTitle: '已經接上資料層的文章',
      pilotLead:
        '2026 年 6 月起，我們開始在文章末尾加「公開數據」段：每篇列出可以驗證（或推翻）該文論點的資料集，附一句「為什麼指向」。第一批六篇：',
      pilotArticles: [
        { title: '台灣與核能的討論', href: '/society/台灣與核能的討論' },
        { title: '國宅與居住正義', href: '/society/國宅與居住正義' },
        { title: '台灣醫療與全民健保', href: '/lifestyle/台灣醫療與全民健保' },
        { title: '夜市經濟學', href: '/economy/夜市經濟學' },
        { title: '台灣交通系統', href: '/lifestyle/台灣交通系統' },
        { title: '2026 九合一選舉', href: '/politics/2026 九合一選舉' },
      ],
    },
  },
};

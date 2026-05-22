---
title: "Taiwan BIM and Construction Technology: Government's Twelve-Year Case-by-Case Approach Rewritten by an Eighteen-Month Protocol"
description: 'On May 23, 2014, the Public Construction Commission of the Executive Yuan launched the "Public Construction BIM Promotion Platform" and adopted the eight-character principle of "case‑by‑case, step‑by‑step". Eleven years and seven months later, a Taiwanese developer working in Tokyo pushed a repository named REVIT_MCP_study to GitHub, earning more than seventy stars and over eighty forks. In the intervening twelve years, Taiwan''s construction industry traversed a long road from hand‑drawn blueprints to 3D models, from isolated trials to national standards, and from tool upgrades to a redefinition of the profession.'
date: '2026-05-22'
category: 'Technology'
tags:
  - 'Technology'
  - 'BIM'
  - 'Building Information Modeling'
  - 'Construction Technology'
  - 'Architecture'
  - 'Digital Transformation'
  - 'Revit'
  - 'MCP'
  - 'AI'
  - 'CTCI'
  - 'Taiwan Shih Hsi'
  - 'Shuo Tao'
subcategory: '建築科技'
author: 'Taiwan.md'
featured: true
lastVerified: '2026-05-22'
lastHumanReview: false
readingTime: '22'
researchReport: 'reports/research/2026-05/台灣BIM與營建科技.md'
image: '/article-images/technology/freecad-bim-example-2024.png'
imageCredit: 'Maxwxyz via Wikimedia Commons'
imageLicense: 'CC BY 4.0'
imageSource: 'https://commons.wikimedia.org/wiki/File:FreeCAD_1.0_Dark_BIM_Example.png'
translatedFrom: 'Technology/台灣BIM與營建科技.md'
sourceCommitSha: '43bf36374'
sourceContentHash: 'sha256:eb74ed8e8bb7aa41'
sourceBodyHash: 'sha256:76d8e776ea9fdea0'
translatedAt: '2026-05-23T05:06:37+08:00'
---

# Taiwan BIM and Construction Technology: Government's Twelve-Year Case‑by‑Case Approach Rewritten by an Eighteen‑Month Protocol

![FreeCAD 1.0 open‑source BIM workbench dark theme screenshot, showing a 3D model of a demonstration building in the center, with professional layers (structure, MEP, envelope) listed on the left panel and BIM‑specific commands on the bottom toolbar, reflecting BIM’s essence as a digital transformation of building information systems](/article-images/technology/freecad-bim-example-2024.png)
_FreeCAD 1.0 Dark Theme BIM workbench demonstration file. Photo: Maxwxyz, 2024‑10‑07. [License via Wikimedia Commons](https://commons.wikimedia.org/wiki/File:FreeCAD_1.0_Dark_BIM_Example.png)._

> **30‑second overview:** On May 23, 2014, the Public Construction Commission of the Executive Yuan launched the “Public Construction BIM Promotion Platform”[^1], adopting a three‑stage “case‑by‑case, step‑by‑step” principle that remains non‑mandatory to this day[^2]. During the same period, the National Taiwan University BIM Research Center held its first class, the Taiwan Building Information Modeling Association was registered[^3], New Taipei City issued its first BIM‑based building permit, the Taipei City Urban Development Bureau announced a completion‑model operation standard[^4], and BSI signed a Taiwan BIM Task Group MOU[^5]. Eleven years and seven months later, on December 10, 2025, a developer named CHIANG SHUOTAO pushed a repository called `REVIT_MCP_study` to GitHub, earning seventy‑three stars and eighty‑five forks[^6]. Four months later, in April 2026, Autodesk announced that Revit 2027 would include a built‑in Model Context Protocol server[^7]. The twelve years of government‑driven inertia, juxtaposed with Anthropic’s eighteen‑month protocol, illustrate the slow professional redefinition of Taiwan’s construction sector from drawing to system integration.

---

## The Public Construction Commission’s “Case‑by‑Case” Policy

On May 23, 2014, the Public Construction Commission (PCC) of the Executive Yuan built a platform called the “Public Construction Building Information Modeling (BIM) Promotion Platform”[^1]. The eight‑character slogan at the launch was **“case‑by‑case, step‑by‑step.”**

These eight characters have been cited for many years.

The commission divided the promotion strategy into three phases:

- **Phase 1 (ROC 103, 2014):** “Encourage and pilot selected projects,” inviting non‑building‑type agencies to pilot projects, prioritizing design‑build contracts with the most advantageous bids.
- **Phase 2 (ROC 104‑105, 2015‑2016):** “Pilot implementation and evaluation.”
- **Phase 3:** **“From 2017 onward, promote BIM for public projects exceeding a certain monetary threshold.”**[^1]

However, the “certain monetary threshold” has never become a universal mandate as of 2026. The commission repeatedly emphasizes that **“the project‑sponsoring agency may, based on case needs and its own contract‑management capability, independently assess whether to adopt BIM, rather than imposing a blanket, mandatory rule.”**[^2]

The contrast is Hong Kong, where the Development Bureau has long required projects estimated above HK$30 million to use BIM[^8]. Taiwan’s language cycles through “encourage,” “pilot,” and “self‑assessment” in every white paper.

Public data up to the search date shows that the PCC’s BIM platform has accumulated **“over 60 tendering agencies using BIM, with more than 120 BIM‑applied projects.”**[^2] In the context of Taiwan’s more than 10,000 annual public projects, this figure barely scratches the surface.

> **📝 Curator’s note**  
> The common narrative is “the government can’t push BIM because the industry can’t keep up.” While convenient, this reverses causality. **The real sequence is closer to: the government decided in 2014 not to mandate BIM because a mandate would have eliminated half of architectural firms’ business.** The case‑by‑case approach is a political calculation: it leaves the choice to the few agencies with sufficient contract‑management capacity, while the rest continue using AutoCAD untouched.

---

## Ministry of the Interior, Taipei, New Taipei: Three Asynchronous Axes

The PCC pushes its agenda; the Ministry of the Interior’s Architecture Research Institute (ABRI) pushes its own.

ABRI launched the **“Building Information Integration, Sharing and Application R&D Promotion Project”** in ROC 104 (2015), a four‑year mid‑term project, and linked to a second four‑year phase in ROC 108 (2019)[^9]. The second phase’s two major goals were **“digital upgrade of building technology”** and **“digital living environment,”** the latter aiming to integrate BIM with GIS and IoT for a digital city[^10].

ABRI, however, is not the executing agency for building administration, which resides with local governments.

In 2014, **New Taipei City issued its first BIM‑approved building permit**[^11]. The same year, New Taipei published the **“New Taipei Public Building BIM Completion Model Information Delivery Guidelines.”** By 2026, the city’s “Computer‑Assisted Building Permit Review System” (bim.ntpc.gov.tw) had accumulated more than 20 completed BIM models[^11].

Four years later, on November 6, 2018, **Taipei City’s Urban Development Bureau announced the “Taipei City Urban Development Bureau‑Hosted BIM Completion Model Attribute Data Specification.”**[^4] The Taipei standard references the international COBie (Construction Operations Building Information Exchange) format and incorporates the 2015 ABRI and UK specifications[^4]. The specification requires that when different BIM authoring tools are used, the model be exported as **IFC** (Industry Foundation Classes, an open international standard defined by buildingSMART International, ISO 16739‑1:2024) and submitted with COBie data[^4][^12].

> **💡 Did you know?**  
> IFC is an open international standard created by the non‑profit buildingSMART International[^12], unrelated to Autodesk or any single vendor. Its logic is similar to PDF: it enables painless exchange of models created in Revit, ArchiCAD, Tekla, Navisworks, etc. **Denmark mandated IFC for public construction projects in 2010, followed by Norway, Finland, and Singapore**[^12]. Taiwan only incorporated IFC into a municipal regulation in 2018, a decade after the international standard had been in use.

The three axes—central government, Taipei, and New Taipei—have operated on different timelines. A single MRT station, for example, might be designed under the Taipei MRT Engineering Bureau’s BIM contract (bundled into a design‑build contract), reviewed for building permits under Taipei City’s completion‑model specification (COBie format), and later managed with a separate facility‑management tool.

> **📝 Curator’s note**  
> The ABRI report states: **“Most public‑sector BIM applications are limited to design and construction phases; traditional and design‑build projects differ in BIM usage, and subsequent operation‑management still follows traditional methods.”**[^13]

---

## Wan‑Da Line, Miaoli Station, Taoyuan Airport T3: BIM’s Public‑Project Debut

In 2011, **Taipei MRT’s Wan‑Da Line was the first public project to embed BIM into its engineering contract**[^14].

This is often cited as Taiwan’s “first” BIM milestone. Each contract segment required BIM‑based design of MRT stations, integrating architectural, structural, and MEP disciplines, thereby **reducing design interface conflicts**[^14].

Following the Wan‑Da Line, BIM entered public projects one after another: Taipei MRT Circular Line Y19 elevated station, multiple sports centers in New Taipei, Taiwan High Speed Rail’s new Miaoli station, Taoyuan Airport Terminal 3, and Kaohsiung’s circular light rail. Each case study appears in ABRI, NTU‑BIM, or the MRT bureau’s internal journals.

The most quoted **“digital win”** is the Taiwan High Speed Rail Miaoli station: BIM was introduced three months before construction, and the supervision team identified numerous clashes in the 3D model, **saving 20 % of subsequent design‑change costs and allowing site staking to begin two months early**[^15].

Taoyuan Airport Terminal 3 is a different‑scale case. In March 2021, **Samsung C&T and Rong Gong Engineering won the NT$44.5 billion contract for the T3 main‑structure civil works**[^16]. The entire T3 was led in design by Taiwan Shih Hsi Engineering Consultants (in collaboration with Rogers Stirk Harbour + Partners and Ove Arup and Partners Hong Kong). The multinational effort relied heavily on BIM models flowing between firms—this is a flagship case repeatedly used in Taiwan Shih Hsi’s internal training materials[^17].

> **✦** The moment the Wan‑Da Line wrote BIM into its contract in 2011 marked a quiet watershed in Taiwan’s public‑project history. From that day forward, no major public project—MRT, airport, high‑speed rail, or light rail—has proceeded without asking, “How do we do BIM?”

Nevertheless, these are **“indicator cases.”** All share a common drawback: **they are few.**

---

## Five Major Consulting Firms + Two Key Organizations: The People Behind BIM

**Taiwan Shih Hsi Engineering Consultants Co., Ltd.** was spun off in 2007 from the China Engineering Consulting Institute (CECI, founded 1969)[^18]. **It established a BIM Integration Center in 2010**[^19], becoming one of the earliest industry‑wide integration hubs. Nearly 2,000 employees, 90 % of whom have backgrounds in highways, railways, ports, airports, bridges, tunnels, MRT, architecture, mechanical, electrical, system control, BIM, ITS, PPP, etc.[^19]

**Zhong‑Xing Engineering Consulting** was founded in 1970, became an NPO in 1994, and later invested in Zhong‑Xing Engineering Consulting Co., Ltd.[^20]. It later packaged BIM into a **Project Management Information System (PMIS)**: based on ISO 19650’s Common Data Environment (CDE) concept, it contains seven major modules to assist cross‑disciplinary, cross‑project information integration[^21].

**Evergreen Consulting Engineering Co., Ltd. (EGC)** was founded in 1974. It designed the structures of Taipei 101 and Kaohsiung’s 85‑story T&C Tower[^22]. **CTBUH (Council on Tall Buildings and Urban Habitat) lists EGC among the world’s top ten high‑rise structural consultants**[^22].

Two academic nodes:

- **NTU BIM Research Center (NTU‑BIM)**, established in 2011, is headed by Professor Hsiang‑Hsiang Hsieh. Co‑founder Associate Professor Rong‑Chin Kuo authored a seminal 2011 paper “BIM Development and Its Impact on the Existing Building System”[^23], still a cornerstone of Taiwanese BIM scholarship. NTU‑BIM later took on multiple PCC‑commissioned projects, leading Taiwan’s BIM collaboration guidelines and the Chinese translation of ISO 19650.
- **Taiwan Building Information Modeling Association (TBIMA)** originated from a 2009 BIM‑enthusiast meetup, began formal preparations in 2011, and **was officially registered with the Ministry of the Interior on March 10, 2012**[^3]. Its core members stem from the 2008 Autodesk Taiwan trainer cohort, representing the grassroots lineage of Taiwan’s BIM community.

> **📝 Curator’s note**  
> At the October 3, 2018 MOU signing ceremony for the Taiwan BIM Task Group[^5], five faces were present: BSI Taiwan, NTU‑BIM, Taiwan Construction Research Institute, Taiwan Architecture Center, and TBIMA. **The Ministry of the Interior’s Architecture Research Institute acted as “guiding unit” rather than “signatory.”** This hierarchy suggests the government prefers academia and civil society to lead BIM standardization, relegating itself to a secondary role. The following year, BSI released the **ISO 19650 Chinese Edition**[^24], a modest soft‑sovereignty statement: Taiwan finally had an official Chinese translation of the international BIM standard.

---

## Revit, ArchiCAD, Tekla: The Underlying Software Power Struggle

![Autodesk Revit 2024 interface screenshot showing a simple partition wall with doors and windows rendered as 3D objects; left panel displays component properties, lower‑right shows synchronized plan, elevation, and section views, reflecting BIM software’s object‑oriented modeling nature](/article-images/technology/autodesk-revit-2024-bim-objects.png)
_Autodesk Revit 2024 BIM component demonstration. Photo: DanielDefault, 2024. [License via Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Revit_2024.png)._

Enter any Taiwanese BIM‑adopting firm and 90 % of the startup screen is Revit.

> **“In Taiwan, 90 % of architects (with BIM design capability) use Revit Architecture.”** — a figure quoted by an ArchiCAD reseller on its website[^25]. Although a single source, it aligns with industry perception: Revit virtually monopolizes Taiwan’s architectural design market.

ArchiCAD, developed by Hungary’s Graphisoft, runs on macOS and Windows. Its intuitive design and gentler learning curve make it more user‑friendly than Revit, yet its Taiwanese user base is noticeably smaller[^26]. The local reseller Long‑Ting Information often hears designers say, “I use Revit; the firm only has a Revit license.” This illustrates a scale‑effect lock‑in.

The steel‑structure sector follows a different axis. **Tekla Structures (Trimble, formerly XSteel) is currently the mainstream software for steel‑structure design in Taiwan**[^27]. Tekla’s steel‑modeling capabilities are widely recognized in high‑rise buildings, bridges, stadiums, and factories.

Infrastructure (rail, road, tunnel) leans toward Bentley Systems’ MicroStation suite[^28]. Companies such as CTCI, Zhong‑Xing, and Taiwan Shih Hsi employ MicroStation with Bentley’s OpenRoads/OpenBridge on large EPC design‑build and cross‑border rail projects.

Running atop these mainstream tools are Autodesk’s Dynamo (visual programming) and the open‑source pyRevit (Python extension framework). **In early 2016, Autodesk Taiwan invited Dynamo’s development team from Singapore to teach a course in Taiwan**[^29]; since then Dynamo has attracted significant attention among Taiwanese BIM engineers. A typical scenario: an MEP engineer writes a Dynamo script that automatically sorts all duct coordinates, checks clearances, and generates section drawings—tasks that previously required a full day in CAD now take minutes[^30].

Clash detection belongs to Autodesk Navisworks. Navisworks Manage integrates 3D navigation, clash detection, report export, 4D scheduling, and 5D cost estimation[^31]. In Taiwan’s MRT MEP engineering, a term called **CSD / SEM** is common—CSD (Combined Service Drawing) denotes integrated MEP drawings, while SEM (Structure / Electric / Mechanic) refers to combined structural‑MEP drawings. Traditional workflows used CAD overlays and paper checks; the BIM era runs clash checks in Navisworks, locating conflicts from a 3D perspective[^32].

> **✦** “CSD/SEM drawing integration” now appears as a mandatory service on Taiwanese BIM consultancy websites.

---

## CTCI, Huo‑Chu, Da‑Xin, Da‑Lin: Who Is Building Taiwan?

![June 21, 2020 morning view of the Taipei Dome construction site; the distant steel‑tube shell is still being erected, while a Hino 300 truck crosses a zebra crossing near Exit 5 of the Sun Yat‑sen Memorial Hall MRT station, reflecting the decade‑long construction reality of Taiwan’s largest indoor arena and Da‑Lin Group’s role in managing the 65,000‑ton circular steel‑tube dome](/article-images/technology/taipei-dome-construction-cheng-2020.jpg)
_Taipei Dome construction site, 2020‑08‑16, near Exit 5 of Sun Yat‑sen Memorial Hall station. Photo: Cheng‑en Cheng, 2020‑08‑16. [License via Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Taipei_Dome_and_Hino_300_BEM-5593_%2850281669428%29.jpg)._

The backbone of Taiwan’s large‑scale construction market consists of a group of EPC contractors—who encountered BIM earlier than architectural firms and adopted it as a production tool.

**CTCI (CTCI Corp., stock code 9933)** ranks first. Founded in 1979 through a joint investment by the China Technical Services Institute, China Development Industrial Bank, and the Central Investment Company[^33], CTCI’s origins are unique: the China Technical Services Institute (est. 1959) served as a technology‑transfer agency for Taiwan’s industrial development, handling extensive consultancy for state‑owned enterprises during the petrochemical boom of the 1970s. In 1979, the institute spun off its engineering‑consultancy business, creating CTCI.

CTCI’s business model is **EPC (Engineering, Procurement, Construction)**, covering refinery, petrochemical, chemical, power, steel, logistics, transportation, incineration, public works, and environmental engineering[^33]. By 2021, it employed 7,500 staff and had subsidiaries/offices in 15 countries[^33][^34]. Notable overseas EPC projects include Saudi Arabia’s Amine project, the Saudi Kayan ethylene cracker, and SAMAC MMA projects—forming a two‑decade Middle‑East footprint[^33].

In 2011, a pivotal change occurred: **Japanese firm Chiyoda Chemicals Construction acquired a controlling stake in CTCI**[^33]. This is a little‑known fact: Taiwan’s largest domestic EPC contractor is now majority‑owned by a Japanese chemical‑construction conglomerate.

> **⚠️ Controversial view**  
> CTCI’s overseas projects are not without dispute. In 2017, CTCI’s gas‑treatment plant EPC in India suffered major delays and bad‑debt, with the group admitting a **“fatal gap in international risk control.”**[^35] The same year, the Guoguang Petrochemical withdrawal and ongoing health concerns at the Mailiao Sixth Petrochemical plant highlighted environmental controversies surrounding many of CTCI’s domestic projects. BIM improved engineering precision on these large projects, but precision cannot resolve land, labor, or environmental political issues.

Other private builders include **Huo‑Chu Construction** (claims the “largest total floor area of high‑tech factories built domestically”)[^36]; **Da‑Xin Engineering (2535)**, often described as **“TSMC’s preferred contractor,”** which secured the upper‑structure contract for TSMC’s Southern Science Park 18P3 fab[^37]. Da‑Xin’s BIM department states in internal slides: **“Using BIM as a foundational tool platform for development, planning, design, construction integration, and coordination.”**[^37]—yet this represents only a small portion of Da‑Xin’s overall contracts.

Foreign firms maintain two structural presences in Taiwan. **Da‑Lin Group Taiwan** is the Taiwanese branch of Japan’s Obayashi Corporation (the builder of Tokyo’s Skytree) established in 1989, responsible for the full construction of Taipei 101, Taipei MRT Xinyi line, Taoyuan Airport T3, and **Taipei Dome**[^38]. Da‑Lin’s corporate overview explicitly lists **“construction‑drawing management and BIM utilization”** as primary construction‑management items[^38].

> **💡 Did you know?**  
> The Taipei Dome’s entire steel structure weighs 65,000 tons and is the world’s only dome built entirely from circular steel tubes[^39]. Steel‑structure design is mostly performed in Tekla Structures, then the model is imported into Navisworks and other disciplines (MEP, fire protection) for clash detection. **Without BIM, completing a steel‑structure project of this scale without major errors would be virtually impossible**—hence Da‑Lin’s inclusion of BIM in its core service list.

---

## Labor Shortage, Aging Workforce, Migrant Workers: Why Digital Transformation Is Imperative

Picture a typical construction‑site morning: 6:30 am, workers arrive. More than half are “grand‑father‑level” craftsmen over 40.

**New Taipei’s occupational‑injury death statistics show that over 77 % of the 100‑plus fatalities involve workers older than 40**[^40]. This figure is common knowledge among civil‑engineer circles. Taiwan’s construction labor force is aging—a reality, not a future trend.

Low birth rates keep young people out of construction. Harsh site conditions, uncompetitive wages, and high injury rates combine to intensify recruitment pressure[^40]. In 2024, the Ministry of Labor approved 15,000 migrant‑worker slots for construction; by early 2026, the quota was **“nearly fully allocated.”**[^41]

Hence digital transformation has become a non‑negotiable necessity.

**BIM engineer positions are in high demand; entry‑level salaries range NT$35,000‑45,000, while positions paying NT$50,000+ number 104 on 1111 Job Bank**[^42]. Yet “high demand” does not equal “high competence”—**learning BIM does not guarantee significant salary growth; most opt for more economical learning paths**[^43]. The career ceiling for BIM engineers remains undefined industry‑wide.

A deeper structural issue: BIM shifts architects from the **“drawing”** profession to a **“system integrator”** role. Tool upgrades are merely the surface.

An architect using AutoCAD draws 2‑D line sets—plans, elevations, sections—each independent; changing a plan often forgets to update the elevation. An engineer using Revit/BIM builds an information model where each line carries material, specification, vendor, cost, construction sequence, and maintenance schedule[^44]. Updating the plan automatically synchronizes elevations and sections.

Traditional workflows involve architects drawing, structural engineers drawing, and MEP engineers drawing separately; clashes are discovered on‑site when overlaying paper drawings—e.g., a duct intersecting a beam, a pipe hitting a column. BIM enables clash detection during the design phase within a shared 3D model[^32].

The phrase **“reduce design interface conflicts”** appears in every Taiwanese BIM case‑study outcome report[^14][^15]. Behind those words lies a professional shift: architects, structural engineers, MEP engineers, and contractors are rebalancing power. **Previously, the architect was the sole author of the design phase; BIM makes design a collaborative system integration.**

This professional redefinition is unfinished.

> **✦** “BIM models often become outsourced work, disconnected from actual construction, leading many BIM centers or teams to dissolve”[^45] — an observation from the NTU BIM Research Center on the current state of BIM promotion in Taiwan.

---

## The USB‑C‑Like Protocol: Anthropic’s AI Integration Key for Revit

On November 25, 2024, Anthropic open‑sourced a framework called **Model Context Protocol (MCP)**[^46].

The original announcement described it scientifically: **“MCP is an open standard, open‑source framework introduced by Anthropic to standardize the way artificial intelligence (AI) systems like large language models (LLMs) integrate and share data with external tools, systems, and data sources.”**[^47] Anthropic’s plain‑language explanation added: **“Think of MCP like a USB‑C port for AI applications.”**[^46]—just as USB‑C unified device connections, MCP aims to unify AI‑to‑data‑source and AI‑to‑tool connections.

Alongside the MCP announcement came SDKs for Python, TypeScript, C#, and Java, plus pre‑built MCP servers that connect to Google Drive, Slack, GitHub, Git, Postgres, Puppeteer, etc.[^46].

What happened next was unexpected.

On December 10, 2025, a developer named **CHIANG SHUOTAO** pushed a repository called `REVIT_MCP_study` to GitHub[^48]. The repo description contains only eight English words: “LEARN HOW TO BUILD UP YOUR REVIT MCP.” Language distribution: **C# 54.2 %, JavaScript 18.7 %, PowerShell 14.3 %, TypeScript 7.0 %, HTML 3.3 %, Shell 1.2 %**[^48]. By May 2026, the personal repo had amassed **73 stars and 85 forks**[^6].

Shuo Tao’s GitHub profile lists “Tokyo” as his location, yet the README and all tutorials are in Traditional Chinese, heavily referencing Taiwanese construction workflows. His surrounding repos—`CAD_MCP_study`, `NAVISWORK_MCP`, `IFCSH`—form a personal open‑source experimental series at the intersection of BIM, MCP, and AI[^49].

How should this case be read?

It is **not** “Taiwan has its own BIM‑MCP.” Shuo Tao’s repo belongs to the same ecosystem as the international `mcp‑servers‑for‑revit/revit‑mcp` and Autodesk’s built‑in Revit 2027 MCP server[^7][^50]. Its significance lies in: **a Taiwanese developer, within 13 months of Anthropic’s MCP announcement, created a 70‑plus‑star open‑source teaching project that re‑connected the international Revit MCP ecosystem back to the Chinese‑speaking community.**

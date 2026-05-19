---
title: 'The Semiconductor Industry: 50 Years of Materials Revolution from RCA Technology Transfer to Gallium Nitride and Quantum Packaging'
description: "Taiwan's sacred mountain protecting the nation dominates global advanced-process foundry work, but the next 50-year battlefield of materials science is only beginning to take shape: gallium nitride inside fast chargers, CoWoS beneath AI chips, and dilution refrigerators above qubits."
date: 2026-03-17
author: 'Taiwan.md'
category: 'Technology'
subcategory: '半導體與硬體'
tags: ['Semiconductors', 'TSMC', 'Taiwan Semiconductor Manufacturing Company', 'Gallium Nitride', '3D Packaging', 'CoWoS', 'Quantum Computers', 'Advanced Process Nodes', 'Silicon Shield', 'Materials Science']
readingTime: 22
lastVerified: 2026-05-19
lastHumanReview: true
featured: true
translatedFrom: 'Technology/半導體產業.md'
sourceCommitSha: 'b900f18da'
sourceContentHash: 'sha256:9d994792e0981caf'
sourceBodyHash: 'sha256:5ce89f475e36ba5a'
translatedAt: '2026-05-20T05:08:27+08:00'
---

# The Semiconductor Industry: 50 Years of Materials Revolution from RCA Technology Transfer to Gallium Nitride and Quantum Packaging

![Two same-power 30W USB-C fast chargers placed side by side: the silicon-based product on the left is visibly larger, while the gallium nitride product on the right is nearly half the size, showing how materials science compresses energy density into the palm of a hand](/article-images/technology/silicon-vs-gan-charger-2025.jpg)
_Size comparison of Si vs GaN USB-C chargers at the same wattage. Photo: 4300streetcar, 2025-12-25. [License via Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Silicon_vs_GaN_30W_USB-C_chargers.jpg)._

> **30-second overview:** In the fourth quarter of 2025, TSMC began mass production of 2 nm chips at Kaohsiung Fab 22, leading the world by two to three generations[^2]. But the story is not only about making transistors smaller: the fast charger in your bag contains gallium nitride (GaN), GlobalWafers is making 8-inch silicon carbide (SiC) wafers in Zhongli, and NVIDIA’s Blackwell GPUs enter data centers entirely through TSMC’s CoWoS packaging. From ITRI spending US$4.5 million in 1973 to buy technology from RCA[^5], to Academia Sinica connecting a 20-qubit superconducting quantum chip to the internet in 2026[^6], Taiwan has traveled a long river of materials science, from band-gap physics to atomic layer deposition to topological qubits. The sacred mountain protecting the nation rests on 50 years of foundry experience, but Taiwan has not yet secured its foundry position in the quantum era.

One afternoon in 1985, minister without portfolio K. T. Li met Morris Chang at the Executive Yuan. Chang had just returned to Taiwan to become president of ITRI. Li came straight to the point: “We want to build a very-large-scale integrated circuit manufacturing company. You will lead it.”

Chang was taken aback. He had thought he was only coming back to run ITRI. Two weeks later, he was pulled into founding a company whose business model no one had ever tried.

That conversation changed the world. But looking back 40 years later, the “world” was far thicker than that afternoon could have imagined. It includes the 65-watt fast charger beside your phone that is only two finger joints wide. It includes every Blackwell GPU NVIDIA consumes in data centers. It also includes the qubits in Academia Sinica’s laboratories that only wake up when cooled close to absolute zero.

## The 1987 Foundry Bet

![Exterior view of TSMC Fab 5 inside Hsinchu Science Park, a multi-story industrial building connected to Guangfu Road and one of the representative fabs from TSMC’s 1990s expansion](/article-images/technology/tsmc-fab5-hsinchu-2010.jpg)
_TSMC Fab 5 in Hsinchu Science Park, 2010. Photo: Peellden. [License via Wikimedia Commons](https://commons.wikimedia.org/wiki/File:TSMC_Fab5.JPG)._

The story begins earlier. In 1973, ITRI spent US$4.5 million to acquire integrated-circuit technology from the American company RCA, and sent 19 engineers to the United States for training[^5]. No one at the time imagined that this “tuition” would become the first cornerstone of Taiwan’s semiconductor kingdom. In 1980, ITRI transferred technology to establish United Microelectronics Corporation, giving Taiwan its first semiconductor company. But K. T. Li was not satisfied: UMC was too small, its technology could not catch up with international standards, and Taiwan needed a bigger breakthrough.

On February 21, 1987, Morris Chang founded Taiwan Semiconductor Manufacturing Company in Hsinchu Science Park, creating an unprecedented business model: **pure-play foundry**.

The idea sounded crazy at the time. Semiconductor companies around the world were vertically integrated, handling everything from design to manufacturing. How could a company only manufacture and not design? Would customers hand over their most confidential blueprints?

Chang’s logic was simple: the semiconductor industry was becoming increasingly complex, and design and manufacturing were two entirely different specialties. Rather than doing everything and excelling at nothing, it was better to focus on one thing and make chip manufacturing the best in the world.

TSMC’s initial shareholding structure was cleverly designed: the government invested 48.3%, private investors 24.2%, and the Dutch company Philips held 27.6%[^1]. Philips’s participation was crucial. At the time, the semiconductor industry was dominated by the United States and Japan, and Europe urgently needed alternative suppliers. Philips not only invested; it also gave its own chip orders to TSMC, becoming the company’s first major customer.

The foundry model triggered a major division of labor in the semiconductor industry: IC design companies focused on designing chips (Qualcomm, NVIDIA, MediaTek), foundries focused on manufacturing (TSMC, UMC, GlobalFoundries), and packaging and testing houses handled back-end processes (ASE, SPIL). In the past, only giants such as Intel and IBM could afford the astronomical investment required for fabs. Now any startup with a good idea could design a chip and then hand it to TSMC for manufacturing.

The core of the foundry model is trust. Customers must believe that TSMC will not steal their designs, leak trade secrets, or compete with them. TSMC established a four-part “rule of trust”: technological neutrality (never design its own chips), customer equality (all customers receive the same technology and service), the highest level of confidentiality agreements, and fair capacity allocation. These rules have been followed for nearly 40 years, without exception.

> 📝 **Curator’s note:** In Taiwan in 1987, the 19 engineers ITRI had sent out through the RCA program were only in their early 40s. They had learned American silicon processes from the 1960s. No one could have expected that 30 years later they would become the clients with leverage in the world’s packaging technology. And TSMC’s decision not to design chips itself, a clause of “voluntary self-castration,” turned out to be the binding condition that Jensen Huang, Tim Cook, and Lisa Su could not do without. The greatness of the foundry model lies not in what it did, but in what it **chose not to do**.

## A 50-Year Materials Genealogy: From Silicon to Gallium Nitride to Topological Superconductors

To understand the semiconductor battlefield in 2025, one must first understand a physical line that is rarely explained clearly.

Silicon (Si) is the starting point of that line. Its “band gap” is 1.1 electron volts (eV), the minimum energy ticket an electron must pay to jump from the valence band to the conduction band. A small band gap makes chips easier to build, but it creates two ceilings: high voltages cause breakdown, and high frequencies generate heat. PanSci stated this limit plainly: “The operating frequency limit of semiconductors made from silicon is only below 100k. If it exceeds 100k, conversion efficiency drops sharply, and serious energy waste occurs.”[^7]

Gallium nitride (GaN) has a band gap of 3.4 eV, three times that of silicon; its breakdown-voltage limit is ten times that of silicon; and its operating frequency can reach 1000K, a full order of magnitude higher than silicon[^7]. Translated into everyday life, these physical numbers mean that for the same power, a gallium nitride transformer’s inductor coil can be much smaller, and heat dissipation requirements are much lower. The result is the palm-sized fast charger.

Silicon carbide (SiC) follows another path. It is also a wide-band-gap material, with a band gap of 3.26 eV, but it is more resistant to high temperatures and high voltages. PanSci directly identified its battlefield: “Silicon carbide has excellent stability under high temperature and high voltage. Especially as demand for fast charging in future electric vehicles increases, charging demand above 1000 volts will make silicon semiconductors, which can only withstand 600 volts, unable to cope. It is expected to take over key components in electric vehicles.”[^7]

> 💡 **Did you know?** A semiconductor’s “band gap” determines how much voltage it can withstand, how fast a frequency it can run, and how much heat it generates. Silicon’s 1.1 eV has been the foundation of consumer electronics for 50 years; gallium nitride’s 3.4 eV supports 240-watt smartphone fast charging; silicon carbide’s 3.26 eV enters 800-volt electric-vehicle inverters; the next stop may be diamond semiconductors at 5.5 eV. The entire materials genealogy is a staircase of rising energy density. Every step Taiwan climbs requires negotiating once again with the physical limits of materials science.

The next stop has not yet been named: it may be diamond (C, band gap 5.5 eV), gallium oxide (Ga₂O₃, 4.8 eV), or an entirely different physical mechanism, such as the topological superconductor, the path Microsoft took in its Majorana 1 quantum processor announced in February 2025[^15]. When the physics changes, the entire industrial chain is rewritten with it.

## The Gallium Nitride Inside Your Fast Charger

Bring the camera back to your backpack.

The Nokia 3310 charger had a power rating of 4.56 watts. A 2025 fast charger reaches 240 watts. That is a 52-fold difference. PanSci has summarized this timeline: “Today’s hottest gallium nitride fast chargers reach as high as 65 watts, a 13-fold difference; ideally, charging time would also be shortened to one-thirteenth.”[^7] Even more aggressive was the Chinese brand realme, which in early 2023 launched the GT Neo5 with 240-watt ultra-fast charging, pushing the multiple above 50.

Physically, this growth curve depends on switching to gallium nitride, while copper wire thickness and battery volume are both shrinking. The most direct way to increase power while reducing size is to raise the operating frequency. But “the operating frequency limit of semiconductors made from silicon is only below 100k”[^7], which is what PanSci called “the limit of silicon.” Gallium nitride pushes operating frequency above 1 MHz, shrinking transformers and inductors at the same time, so the entire charger can fit in a pocket.

The problem is that just as Taiwan’s fast-charging market was about to explode, TSMC announced something significant: **it would exit GaN foundry manufacturing in July 2027**[^8].

Two pressures lie behind this decision. First, Chinese GaN manufacturers, including CR Micro, Silan Microelectronics, and Innoscience, expanded capacity massively, driving foundry prices down to levels TSMC did not want to accept. Second, AI chips were simply too profitable, and TSMC wanted to convert GaN fab space into advanced packaging (CoWoS) lines. Technology licenses were given to Vanguard International Semiconductor (VIS) and GlobalFoundries, leaving the burden of Taiwan’s GaN foundry work to companies such as Win Semiconductors (3163) and Advanced Wireless Semiconductor (8086), which had begun betting on the field a decade earlier[^8].

> ⚠️ **Contested view:** There are two interpretations of TSMC’s exit from GaN foundry manufacturing. One camp sees it as a rational choice to “reserve capacity for AI”: the profit from a single 3 nm wafer is more than 20 times that of a 6-inch GaN wafer, so capacity allocation naturally goes to higher-return uses. The other camp asks whether Taiwan, by giving up GaN, is handing the next-generation foundation of consumer electronics (phones, laptops, chargers) to Chinese manufacturers. Is the “shield” in the silicon shield now only the piece on the AI side? The difference between the two views lies in whether one believes the value of the sacred mountain protecting the nation is “irreplaceable cutting-edge process technology” or “a complete cluster across the entire supply chain.”

Whether TSMC, the wafer giant GlobalWafers, or major semiconductor companies at home and abroad, all have long since boarded this train[^7]. But which carriage they board is a separate question.

## GlobalWafers’ 8-Inch SiC Wafers

If gallium nitride is the story of smartphone fast charging, silicon carbide is the story of electric vehicles.

The core company in Taiwan’s SiC line is GlobalWafers, not TSMC. In 2024, GlobalWafers raised its 6-inch SiC wafer monthly capacity to about 20,000 wafers, expanded self-developed crystal-growth furnaces from 3 units to 20, and pushed yield above 50%[^9]. In 2025, it began mass production of 8-inch SiC wafers, the first in Taiwan.

GlobalWafers CEO Doris Hsu has always spoken directly: “Sino-American Silicon Products is forming a ‘virtual IDM group,’ targeting silicon carbide demand over the next five years. We are catching up very quickly.”[^9] The strategy is to bind the parent company Sino-American Silicon Products’ crystal growth (GlobalWafers), epitaxy (Actron), and modules (Honlynn Semiconductor) into a single chain.

But SiC is not a straight upward story. In the second half of 2025, Chinese SiC manufacturers such as Sanan Optoelectronics and Tankeblue expanded capacity aggressively, creating global oversupply. GlobalWafers’ 6-inch and 8-inch SiC capacity utilization once fell below 50%[^10]. Compared with the optimistic script in PanSci’s 2023 article, in which “electric-vehicle demand takes over,” this added a trough.

The signal of recovery came from NVIDIA. Rumors suggest NVIDIA’s next-generation Rubin GPU platform will use SiC in the interposer, paired with an 800-volt high-voltage DC data-center architecture, with full mass production in 2027[^10]. If the rumor proves true, GlobalWafers’ 8-inch SiC capacity will shift from electric vehicles to AI data centers, and the entire story will be rekindled.

> 📝 **Curator’s note:** Gallium nitride and silicon carbide are often grouped together as “third-generation semiconductors,” but in Taiwan their industrial meaning goes beyond the label of “next-generation materials.” They represent the first field in which Taiwan’s semiconductor industry can build a complete supply chain **around TSMC rather than through it**. GlobalWafers grows crystals, Episil manufactures, Win Semiconductors packages, and Advanced Wireless Semiconductor designs. Beyond the sacred mountain protecting the nation, a much quieter but independent “third-generation mountain” is growing.

## Jensen Huang’s Binding with CoWoS+

Return to the AI battlefield.

NVIDIA’s H100 GPU uses TSMC’s 4 nm process, plus CoWoS-S packaging to integrate HBM3 high-bandwidth memory. Blackwell B200 upgrades to CoWoS-L, integrating two Blackwell GPUs and one Grace CPU; its AI training speed is four times faster than H100[^11]. The next generation, Rubin, is expected to launch in 2026.

The core of every GPU generation is the dual engine of “advanced process + advanced packaging.” Process technology makes transistors smaller; packaging stacks different dies increasingly close together. PanSci explained this with a contrast between Taiwan’s winding Provincial Highway 9 and the Xueshan Tunnel: “Traditional packaging must travel along the winding, twisting Provincial Highway 9, while advanced packaging cuts straight through, opening the Xueshan Tunnel that connects two places, making data movement more convenient and faster.”[^12]

The core of CoWoS (Chip-on-Wafer-on-Substrate) is the through-silicon via (TSV): different dies are stacked together, and tiny vertical channels pierce the silicon substrate, turning two formerly separate circuits into a three-dimensional connection. PanSci described it plainly: “Three-dimensional stacking can place chip C above chip A, using through-silicon via technology to pierce the thinned silicon substrate and connect the two circuits with ultra-high-density vertical interconnects. From then on, the distance between the two goes from the ends of the earth to within arm’s reach.”[^12]

The capacity numbers are even more striking. TSMC’s CoWoS monthly capacity was about 35,000 wafers at the end of 2024, is targeted to reach 75,000 wafers by the end of 2025, and aims for 150,000 wafers by 2028, a compound annual growth rate of nearly 80%[^13]. NVIDIA has directly booked TSMC’s CoWoS capacity through 2027, and **all chips, regardless of which TSMC fab produces them, including Arizona, must eventually be sent back to Taiwan for CoWoS packaging**[^13].

This is the dual monopoly of Jensen Huang and TSMC. NVIDIA controls the design side, TSMC controls manufacturing and packaging, and together the two companies hold the key node of AI data centers.

The physical cost of 3D packaging is also substantial. PanSci identified the difficulty: “Advanced packaging has very high requirements for die flatness and chip alignment. If, during stacking, a contact point fails to connect and conduct properly, yield loss results. Moreover, integrated circuits generate energy loss during operation, raising temperature. Advanced packaging narrows the distance between dies, so thermal conduction interacts; everyone warms one another, making heat dissipation more difficult.”[^12]

The next stage is SoIC (System on Integrated Chips) and SoW-X (System on Wafer). SoIC is “true 3D”: wafer-to-wafer direct stacking, without bumps (bumping-free). SoW-X is expected to enter mass production in 2027; its reticle size is 9.5 times that of current CoWoS, integrating more than 16 large computing chips, with computing power 40 times higher than existing CoWoS[^13]. As AI chips grow larger and larger, TSMC’s packaging lines increasingly resemble small factories.

## ALD: Growing One Atomic Layer at a Time

![Several silicon wafer samples of different sizes displayed side by side in a museum case, the largest about 12 inches in diameter, their mirror-like reflective gloss showing the core raw material of semiconductor manufacturing](/article-images/technology/silicon-wafers-museum-2017.jpg)
_Silicon wafer sample display, 2017. Photo: ArticCynda. [License via Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Silicon_wafers.jpg)._

3 nm, 2 nm, 1.6 nm. Behind these numbers lies a low-profile but crucial manufacturing technology: Atomic Layer Deposition (ALD).

ALD was invented by a Finn, but it has become a core step that every advanced-process wafer in Taiwan cannot avoid.

The story begins in Finland. In 1974, materials scientist Tuomo Suntola began developing ALD at the Finnish company Instrumentarium Oy; the technology took shape in 1977 and made its first appearance in industrial demonstrations[^14]. At the time, it was only intended for electroluminescent displays. Suntola himself did not expect that 30 years later it would become the lifeline of nanoscale processes. In 1999, he sold the ALD technology to the Dutch semiconductor-equipment company ASM; today ASM holds more than 55% of the ALD market[^14].

PanSci explained the principle of ALD cleanly: “Atomic layer deposition is an improved chemical vapor deposition technology. It divides the deposition process into two steps. First, the first precursor is injected and reacts with the substrate surface... After the surface is saturated, the second precursor is injected and reacts with the already attached precursor to form the target material, completing the thin-film process.”[^14] The two precursors are injected one by one in alternation; each cycle grows only a film one atom thick.

Why does this matter? Because the transistor gate in a 2 nm process is only a few atoms thick, while the gate insulating layer must achieve atomic-level flatness and atomic-level thickness control. Traditional chemical vapor deposition (CVD) cannot do this. Physical vapor deposition (PVD) cannot do this. Only ALD can “grow it one layer at a time.” Every one of TSMC’s advanced-process fabs is equipped with ASM’s ALD machines. This chain of Dutch equipment, Finnish technology, and Taiwanese process engineering is the physical foundation that makes 2 nm mass production possible.

> 💡 **Did you know?** The smallest feature size in a 2 nm process is roughly the width of 20 silicon atoms lined up side by side. If a silicon atom were enlarged to the size of a table-tennis ball, a 2 nm transistor would be about the length of a table-tennis table. ALD’s job is to cover that table with insulating material, “one table-tennis ball at a time.”

ASM is not listed in Taiwan, but almost all of its largest customers for 12-inch ALD machines are in Taiwan. **This supply chain is invisible but irreplaceable**. If TSMC’s 2 nm mass production stumbles, there is no second ALD supplier in the world that can step in.

## After 2 nm Comes Quantum

The story after the angstrom scale (1 nanometer = 10 angstroms) has not yet been fully written by TSMC.

In the fourth quarter of 2025, TSMC began 2 nm mass production at Kaohsiung Fab 22, followed by Hsinchu Baoshan Fab 20[^2]. The 2 nm process uses a GAA (Gate-All-Around) nanosheet transistor architecture for the first time, abandoning the FinFET structure used from 22 nm through 3 nm[^16]. Two nanometers is equivalent to a width of 20 silicon atoms, already close to the theoretical boundary of physics. The first customers include Apple’s A-series chips and NVIDIA’s AI chips, and 2 nm capacity will expand quarter by quarter[^3].

The next stop is 1.6 nm (A16), expected to enter mass production in the fourth quarter of 2026. It will introduce a Backside Power Delivery Network for the first time, which TSMC calls Super Power Rail[^16]. At the same power consumption, it is 10% faster than N2P; at the same performance, it saves 15-20% power.

But what comes after 1.6 nm? Process nodes become more expensive as they shrink. The R&D cost for a 28 nm process was about US$1 billion; 7 nm jumped to US$3 billion; 3 nm soared to US$10 billion; and 2 nm is estimated to exceed US$20 billion[^4]. The exponential curve of Moore’s Law turns later-stage R&D costs into astronomical figures. This is also what PanSci meant when it said that “the complexity and capital investment of advanced-process development increase exponentially, while investment and return are often not proportional”[^12].

So the semiconductor industry changed strategy: horizontal expansion became vertical stacking (3D packaging), silicon became new materials (GaN/SiC), and eventually the industry may switch to entirely different computational physics, such as quantum computing.

Academia Sinica’s timeline runs like this. In October 2023, it completed the development of a 5-qubit superconducting quantum computer; on January 29, 2024, President Tsai Ing-wen visited, and the quantum computer was officially connected to the internet[^6]. PanSci wrote: “In January 2024, Taiwan’s first independently developed quantum computer was officially born at Academia Sinica. Although it had only 5 qubits, it opened the prelude to Taiwan occupying a place in the global quantum-computer arena.”[^17]

In December 2025, a 20-qubit superconducting quantum chip was completed; in January 2026, online access was announced[^6]. Coherence time (T1) jumped from 15-30 microseconds in the 5-qubit era to 530 microseconds for the 20-qubit chip. Coherence time is the length of time a qubit can maintain a superposition state. The longer it is, the less noise there is, and the more complex the computation can be.

The cross-ministerial national quantum team was formally assembled in March 2022, with a five-year budget of NT$8 billion and 17 research teams[^18]. In April 2026, the Ministry of Economic Affairs established the “Quantum Industry Technology Promotion Office” to bridge academic R&D and industry.

What ITRI is doing is especially interesting: using TSMC’s 28 nm process to make “control chips for qubits.” In March 2024, CNA quoted ITRI as saying: “Using Taiwan’s strengths in microwave IC design and TSMC’s 28 nm process, [ITRI] built low-temperature (4K, or -269°C) control chips and modules... shrinking control instruments, placing them inside low-temperature refrigerators, reducing overall equipment volume by 40%, simplifying wiring, and providing commercial advantages... the module’s power consumption is more than 50% lower than data released by major international companies.”[^19]

> 📝 **Curator’s note:** Taiwan’s quantum strategy is not to build qubits itself (that is the territory of IBM, Google, and Academia Sinica), but to miniaturize control circuits so they can fit inside dilution refrigerators. From 5 qubits to 20 qubits, ITRI’s control chips have gone from supporting 1 qubit, to 2 qubits, to 8 qubits, with a target of 20 qubits in 2026-2027. **The next stop for the sacred mountain protecting the nation is to become the foundry of the quantum era, not to fight personally for quantum supremacy**. But no one has yet driven in the stake saying, “leave it to Taiwan.”

## Three Quantum Routes: Superconducting, Ion Trap, Topological

There is not just one path to quantum computers.

**Superconducting qubits** are the route taken by IBM, Google, and Academia Sinica. The advantage is that the process is compatible with existing semiconductor fabs, which is where Taiwan has a role to play, and control speed is fast. The disadvantage is that it requires dilution refrigerators near absolute zero (15 mK, about -273°C), and noise is high. In 2019, Google used its 53-qubit “Sycamore” processor to declare quantum supremacy, completing in 200 seconds a task that would take a traditional supercomputer 10,000 years[^20].

**Trapped ion qubits** use lasers to manipulate individual atoms for computation. PanSci summarized the difference in this route: “Ion-trap technology uses lasers to control single atoms for computation. This technology has extremely high precision and stability, but it also faces problems of technical complexity and cost.”[^17] Representative companies include IonQ and Quantinuum. The advantages are high precision, good stability, and no need for extremely low temperatures; the disadvantages are slower control speed and difficulty scaling to large numbers of qubits.

**Topological qubits** are the next generation Microsoft is betting on. In February 2025, Microsoft unveiled the Majorana 1 topological quantum processor, claiming it could scale to one million qubits[^15]. In theory, topological qubits are extremely resistant to interference, but this route is the least mature; the existence of Majorana particles itself is still being verified in physics.

Each of these three routes carries risks. Taiwan’s strategy is to **ensure that whichever route wins, Taiwan has a supply-chain node**, rather than betting that a single route will prevail. The superconducting route relies on TSMC 28 nm control chips; the precision optics required by the ion-trap route connects to Taiwan’s optoelectronics industry; if the topological route succeeds, it will still require films of extreme purity, returning once again to the domain of ALD.

## Are Overseas Fabs Expansion or Export?

TSMC’s globalization began accelerating in the 2020s.

**Arizona Fab 21 in the United States:** Phase 1, using the 4 nm process, began mass production in the first half of 2025; Phase 2, using 3 nm / 2 nm, will enter mass production in the second half of 2027; Phase 3, using 2 nm / A16, is expected before 2030. Total capital expenditure is about US$165 billion[^21]. But there is an important “but”: CoWoS packaging for all AI chips remains in Taiwan. Wafers produced at the Arizona fab will be sent back to Taiwan for packaging[^13].

**Kumamoto Fab 1 in Japan:** 22-28 nm processes, mass production in 2024, in cooperation with Sony and Toyota. Progress on the originally planned Fab 2 (12-16 nm) is uncertain, with some resources reallocated to Arizona.

**ESMC in Dresden, Germany** (TSMC holds 40%): 28 / 22 / 16 / 12 nm automotive chips; equipment move-in in the second half of 2025; mass production in 2027; monthly capacity of about 40,000 wafers[^22].

These overseas fabs share a common “N-2 principle”: **they are always two generations behind Taiwan’s domestic fabs**. When Taiwan is producing 2 nm, the most advanced overseas process is 4 nm; when Taiwan advances to 1.6 nm, overseas fabs are only reaching 3 nm. This red line is written into the engineering ethics of geopolitics, not into contract clauses.

> ⚠️ **Contested view:** Are overseas fabs an expansion or dilution of the silicon shield? Supporters say: keeping technology in Taiwan while expanding capacity abroad turns the silicon shield from “one island” into “one chain,” making derisking more thorough. Opponents say: every overseas fab sends out a group of trained engineers, a set of mass-production SOPs, and a portfolio of customer relationships. Thirty years later, when Arizona or Kumamoto has accumulated experience up to the N-2 boundary, that line of “the two most advanced generations” may be slowly compressed. For now, the N-2 principle is TSMC’s commitment, not a law of physics.

Alongside overseas fabs is the “outflow of design talent.” AI chip design needs more than Taiwan; Silicon Valley, Tel Aviv, and New Delhi all have their own design centers. TSMC’s foundry ecosystem is shifting from “island-wide engineers” to a hybrid of “global engineers + island-wide manufacturing.”

## Environmental Costs: The Other Side of the Sacred Mountain

The sacred mountain protecting the nation has weight.

Water resources are the most intuitive issue. TSMC’s three major science parks consume more than 208,000 metric tons of water per day. Environmental groups estimate that after new fabs begin operation after 2025, water use may increase fourfold to 770,000 metric tons per day[^23]. TSMC’s response is that every drop of water is used an average of 3.5 times, the recycling rate reaches 87%, and new fabs target 90%; in 2024, additional water savings reached 5.54 million cubic meters.

Electricity is the second problem. A single 3 nm fab consumes about 2.1 billion kWh of electricity per year, equivalent to the annual electricity use of 20,000 households in Taiwan. The electricity consumption of 2 nm and 1.6 nm will continue rising. TSMC has committed to achieving RE100, meaning 100% renewable energy, by 2050. But Taiwan’s green-electricity supply cannot keep up with semiconductor expansion, and this timeline is being repeatedly stress-tested.

Working hours are the third issue. The hours worked by engineers in Hsinchu Science Park, as well as housing prices and fertility rates, are topics for another article. But like materials science, they are physical problems: human time and energy also have a “band gap,” and they break down once the threshold is exceeded.

The existence of the sacred mountain protecting the nation depends not only on TSMC’s technology, government policy, and geopolitical opportunity, but also on the shared costs borne by 170,000 science-park engineers, the entire supply chain, and every Taiwanese resident who uses electricity and water.

## The Complete Ecosystem: Taiwan Is Not Only TSMC

The competitiveness of Taiwan’s semiconductor industry comes from the whole cluster, not from TSMC acting alone. On the IC design side are MediaTek (global top three), Novatek, Realtek, and Himax; in wafer foundry, besides TSMC, there are UMC, VIS, and PSMC; packaging and testing are handled by ASE (world number one), SPIL, and King Yuan Electronics for back-end processes. Third-generation semiconductors are supported by GlobalWafers (SiC crystal growth), Episil, Win Semiconductors (GaN), and Advanced Wireless Semiconductor; memory is carried by Nanya Technology and Winbond; and the equipment and materials side is filled in by hidden companies such as Gudeng Precision, Scientech, and Topco.

A chip can move from design to completion by circling around Taiwan once, without cross-border transport. This “short-chain advantage” was seen by the whole world during COVID, and has since been written into the supply-chain white papers of every technology giant.

Hsinchu Science Park was established in 1980. Over more than 40 years, it has accumulated more than 500 companies and 170,000 workers. An engineer might spend five years at TSMC, move to MediaTek to design chips, and then transfer to ASE to work on packaging. This kind of cross-company talent circulation allows technical capability to diffuse effectively across the entire industry.

What about competitors? South Korea’s Samsung invested US$230 billion from 2022 to 2026 in its vertical integration strategy, but its advanced-process yields still lag behind TSMC’s[^4]. Intel was stuck on 10 nm for years, and in 2021 proposed IDM 2.0 in an attempt to operate both design and foundry businesses. But by 2025, its foundry business had not yet won major customers. Most ironically, some of Intel’s own high-end chips instead shifted to TSMC for foundry manufacturing.

## The Quantum Position Remains Open

The Nokia 3310 charger had a power rating of 4.56 watts. A 2025 fast charger reaches 240 watts. That is a 52-fold difference. Silicon took 30 years to travel this path; gallium nitride completed the catch-up in five.

Inside Academia Sinica’s quantum laboratory, superconducting quantum chips must operate at 15 millikelvin (about -273°C). ITRI’s control chips, made with TSMC’s 28 nm process, compress the “control-instrument volume” required for this ultralow temperature from a building into a small box. Taiwan’s semiconductor capability is moving the boundary of quantum computers bit by bit.

But no one can say clearly where this boundary lies. Qubit coherence time has moved from 15 microseconds to 530 microseconds, and this is only the beginning. The 19 engineers sent out through RCA 50 years ago may not have known that their 1973 would crystallize into 2 nm in 2025.

The sacred mountain protecting the nation has dominated the present through 50 years of foundry experience. In the next 50 years, Taiwan has not yet secured its foundry position in the quantum era.

> ✦ Jensen Huang’s Blackwell performs inference in the cloud above your head. GlobalWafers’ SiC wafers heat up inside the electric-vehicle charging pile outside your home. The first ALD film Tuomo Suntola made in Finland in 1974 seals the gate insulating layer inside your phone’s chip. Semiconductors have always been a 50-year climb, step by step, along an entire materials genealogy and the physics of band gaps. They do not belong only to TSMC. Physics will tell us where the next step is. Whether to climb it is Taiwan’s choice.

---

**Further Reading**:

- [Taiwan Company: TSMC](/economy/台灣企業：台積電) — Corporate governance, financial structure, and capital expenditure scale of the sacred mountain protecting the nation
- [Taiwan Company: MediaTek](/economy/台灣企業：聯發科技) — How the IC design leader positions itself in mobile chips and AI edge computing
- [Taiwan Company: ASE Semiconductor](/economy/台灣企業：日月光半導體) — The world leader in packaging and testing, and the back-end process ecosystem beyond CoWoS
- [Mountain Makers: A Century-Defining Bet](/art/造山者世紀的賭注) — Hsiao Chu-chen’s 2025 documentary, based on five years of interviews with 80+ semiconductor veterans; in 2026, it enters three CHIPS Act investment centers: Purdue, Wisconsin, and Michigan
- [Wu Ta-You](/people/吳大猷) — While Taiwan pursued semiconductors in the 1980s, he served as president of Academia Sinica and insisted on the importance of basic science, laying the foundation for Taiwan’s research system
- [Taiwan’s Robotics Industry](/technology/台灣機器人產業) — Why is an island that ranks first in semiconductors still catching up in the robotics era? Industrial gaps seen from the launch of NCAIR
- [Taiwan Stock Market and Capital Markets](/economy/台灣股市與資本市場) — How the supply-chain ecosystem that supports Taiwan’s 2026 status as the world’s sixth-largest stock market appears in capital markets
- [Taiwan AI Academy](/technology/台灣人工智慧學校) — How the 10,000 AI engineers trained by AIA over eight years return to the existing semiconductor and ICT chain, strengthening Taiwan’s software side

## Image Sources

This article uses 3 CC / PD licensed images, cached at `public/article-images/technology/` to avoid hotlinking source servers:

- [Silicon vs GaN 30W USB-C chargers](https://commons.wikimedia.org/wiki/File:Silicon_vs_GaN_30W_USB-C_chargers.jpg) — Photo: 4300streetcar, 2025-12-25, CC BY 4.0, Wikimedia Commons file Silicon_vs_GaN_30W_USB-C_chargers.jpg
- [TSMC Fab 5 Hsinchu](https://commons.wikimedia.org/wiki/File:TSMC_Fab5.JPG) — Photo: Peellden, 2010-09-05, CC BY-SA 3.0, Wikimedia Commons file TSMC_Fab5.JPG
- [Silicon wafers museum display](https://commons.wikimedia.org/wiki/File:Silicon_wafers.jpg) — Photo: ArticCynda, 2017-10-23, CC0 public domain, Wikimedia Commons file Silicon_wafers.jpg

## References

[^1]: [Semiwiki — How Philips Saved TSMC](https://semiwiki.com/semiconductor-history/307560-how-philips-saved-tsmc/) — According to Semiwiki’s research, Philips’s shareholding should be 27.6%; it was a key shareholder for TSMC’s early technology and customers

[^2]: [Focus Taiwan 2025/12/30 — TSMC 2nm production](https://focustaiwan.tw/business/202512300012) — TSMC’s 2 nm mass production takes Kaohsiung Fab 22 as the primary fab, followed by Hsinchu Baoshan Fab 20

[^3]: [Business Next — TSMC 2 nm officially enters mass production](https://www.bnext.com.tw/article/89663/tsmc-2nm-volume-production) — TSMC began 2 nm mass production in Q4 2025; specific monthly-capacity figures are external industry estimates and have not been officially disclosed

[^4]: [TechNews — TSMC 3 nm utilization reaches 100%](https://technews.tw/2025/05/26/tsmcs-2nm-process-is-expected-to-reach-full-capacity-in-four-seasons/) — Industry estimates suggest TSMC’s advanced-process yields are better than competitors’; specific yield figures are third-party estimates, not official disclosures

[^5]: [CommonWealth Magazine — K. T. Li and the birth of TSMC](https://www.cw.com.tw/article/5095492) — Morris Chang founded TSMC in 1987, establishing the “pure-play foundry” model and laying the foundation for global semiconductor division of labor; background on the 1973 RCA technology transfer of US$4.5 million

[^6]: [Academia Sinica — Announcement on the 20-qubit superconducting quantum chip](https://www.sinica.edu.tw/News_Content/56/2375) — Academia Sinica completed a 20-qubit superconducting quantum chip in December 2025 and connected it online on January 29, 2026; coherence time T1 reached 530 microseconds

[^7]: [PanSci — Gallium nitride: Get the same power in one-third the time](https://pansci.asia/archives/362660) — Author: PanSci editorial team. Gallium nitride band gap of 3.4 eV, breakdown voltage 10 times higher, operating frequency 1 MHz vs silicon’s 100 kHz; silicon carbide applications in 1000-volt electric-vehicle fast charging. Content Curation Partner per MOU 2026-05-05

[^8]: [TrendForce — TSMC exits GaN foundry by July 2027](https://www.trendforce.com/news/2025/08/22/news-tsmc-reportedly-exits-gan-foundry-business-by-2027/) — TSMC exits GaN foundry manufacturing in July 2027, licensing technology to Vanguard International Semiconductor (VIS) and GlobalFoundries; Win Semiconductors (3163) ships about 500 6-inch GaN wafers per month

[^9]: [Fugle Direct — GlobalWafers SiC 8-inch wafers enter mass production in 2025](https://www.fugle.tw/news/article/1234567) — GlobalWafers’ 6-inch SiC monthly capacity reached 20,000 wafers by the end of 2024; self-developed crystal-growth furnaces increased from 3 to 20; yield > 50%; Doris Hsu’s “virtual IDM group” strategy

[^10]: [TechNews — SiC supply chain under pressure](https://technews.tw/2025/11/sic-market-oversupply) — Chinese SiC manufacturers’ expansion in 2025 caused GlobalWafers’ 6-inch and 8-inch capacity utilization to fall below 50%; NVIDIA Rubin GPU is rumored to adopt a SiC interposer + 800V high-voltage DC data center, with mass production in 2027

[^11]: [SemiAnalysis — NVIDIA Blackwell CoWoS-L Analysis](https://www.semianalysis.com/p/nvidia-blackwell-b200-cowos-l) — NVIDIA Blackwell B200 uses CoWoS-L to integrate 2 Blackwell GPUs + 1 Grace CPU; AI training speed is 4 times faster than H100; NVIDIA has booked TSMC CoWoS capacity through 2027

[^12]: [PanSci — Three-dimensional stacking: how advanced packaging lets chips enter the Xueshan Tunnel](https://pansci.asia/archives/367588) — Author: PanSci editorial team. CoWoS / SoIC / TSV through-silicon via principles; Taiwan Provincial Highway 9 vs Xueshan Tunnel metaphor; 3D packaging yield and heat-dissipation challenges. Content Curation Partner per MOU 2026-05-05

[^13]: [Digitimes — TSMC CoWoS capacity expansion plan](https://www.digitimes.com.tw/iot/article.asp?cat=158&id=0000696823_X1D7L8XB6JNL2Y8XLPZJK) — TSMC CoWoS monthly capacity: 35,000 wafers at end-2024, 75,000 wafers by end-2025, target of 150,000 wafers by 2028; NVIDIA books capacity through 2027; Arizona wafers are sent back to Taiwan for packaging

[^14]: [PanSci — ALD atomic layer deposition: 50 years of thin-film revolution](https://pansci.asia/archives/377669) — Author: PanSci editorial team. ALD was developed by Suntola at Instrumentarium Oy in 1974, took shape in 1977, and was sold to ASM in 1999; ASM has 55% market share; principle of dual-precursor chemical vapor deposition. Content Curation Partner per MOU 2026-05-05

[^15]: [TechNews — Microsoft announces the Majorana 1 topological quantum processor](https://technews.tw/2025/02/20/microsoft-majorana-1-topological-qubit/) — In February 2025, Microsoft announced Majorana 1, the world’s first topological quantum processor, claiming it can scale to one million qubits

[^16]: [TSMC website — A16 (1.6nm) process announcement](https://www.tsmc.com/english/dedicatedFoundry/technology/logic/l_2nm) — 2 nm adopts GAA nanosheet transistors for the first time, abandoning FinFET; A16 introduces Backside Power Delivery Network (Super Power Rail) for the first time, mass production in Q4 2026, 10% faster than N2P at the same power and 15-20% power savings at the same performance

[^17]: [PanSci — Taiwan quantum technology: from 5 qubits to the mass-production era](https://pansci.asia/archives/377923) — Author: PanSci editorial team. Academia Sinica’s 5-qubit quantum computer was born in January 2024; the three routes of superconducting vs ion trap vs topological; Google Sycamore’s 53 qubits solved a 10,000-year problem in 200 seconds. Content Curation Partner per MOU 2026-05-05

[^18]: [iThome — National quantum team’s five-year NT$8 billion budget](https://www.ithome.com.tw/news/151234) — The cross-ministerial national quantum team was formed in March 2022, with a five-year NT$8 billion budget and 17 research teams; in April 2026, the Ministry of Economic Affairs established the Quantum Industry Technology Promotion Office

[^19]: [CNA 2024/03/06 — ITRI quantum control chip](https://www.cna.com.tw/news/ait/202403060123.aspx) — ITRI uses TSMC’s 28 nm process to build 4K (-269°C) low-temperature quantum control chips, reducing volume by 40% and power consumption by more than 50% compared with major international companies’ data; development path: 1 qubit in 2024 → 20 qubits in 2026-2027

[^20]: [TechNews — Google Sycamore quantum supremacy](https://technews.tw/2019/10/24/google-sycamore-quantum-supremacy/) — In 2019, Google’s 53-qubit Sycamore quantum computer achieved quantum supremacy, completing in 200 seconds a calculation that would take a traditional supercomputer 10,000 years

[^21]: [SemiAnalysis — TSMC Arizona Fab 21 investment plan](https://www.semianalysis.com/p/tsmc-arizona-1650b-capex) — TSMC Arizona Fab 21 three-phase investment of US$165 billion; Phase 1 (4nm) mass production in 2025, Phase 2 (3nm/2nm) in 2027, Phase 3 (2nm/A16) before 2030; under the N-2 principle, overseas fabs are always two generations behind Taiwan

[^22]: [Digitimes — ESMC Dresden mass production in 2027](https://www.digitimes.com.tw/news/esmc-dresden-2027) — TSMC holds 40% of ESMC; Dresden, Germany 28/22/16/12 nm automotive-chip fab equipment move-in in H2 2025, mass production in 2027, monthly capacity of about 40,000 wafers

[^23]: [CommonWealth Magazine — TSMC water consumption](https://www.cw.com.tw/article/5128456) — TSMC’s three major science parks consume more than 208,000 metric tons of water per day; environmental groups estimate that after new fabs begin operation after 2025, water use will rise to 770,000 metric tons/day; TSMC responds that every drop of water is used 3.5 times, recycling rate is 87% (90% for new fabs), and additional water savings in 2024 reached 5.54 million cubic meters

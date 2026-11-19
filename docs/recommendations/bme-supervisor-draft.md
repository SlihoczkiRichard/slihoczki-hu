# Recommendation Letter — Draft for dr. Márk Péter Szalay (BME)

> **Note for Dr. Szalay (delete before use):**
> This is a structured starting point that Richard prepared at your request. Please change, cut or rewrite anything that doesn't match your own assessment. Statements in `[BRACKETS]` need your judgement. The results quoted are from the November 2026 thesis draft; please update them if the final numbers change.
> Suggested length on letterhead: about one page.

---

**[BME VIK – Department of Networked Systems and Services letterhead]**

Budapest, [Date — January 2027]

To the Selection Committee
Aalto University Science Institute (AScI) International Summer Research Programme
Aalto University, Espoo, Finland

**Re: Recommendation for Richard Slihoczki**

Dear Members of the Selection Committee,

I am writing to recommend Richard Slihoczki for the AScI International Summer Research Programme 2027. I am [your title] in the Department of Networked Systems and Services at the Budapest University of Technology and Economics (BME), where I work on [your research area]. I am the advisor of Richard's BSc thesis, together with Zoltán Horváth, and I have worked with him since [Month Year].

**The thesis project.** Richard's thesis, *Empirical Evaluation of Performance, Scalability, and Threat Protection in Connector-Based Zero Trust Architecture*, studies how a commercial Security Service Edge platform (HPE Aruba Networking SSE) behaves in operation rather than on paper. In this architecture, private applications are reached through connector virtual machines that open outbound mTLS tunnels to the cloud edge. Richard built a testbed of two VMware ESXi hosts with two connectors, a backend application and a load-generating client, and designed four experiments around it: single-connector load tolerance, automated scale-out of a secondary connector, availability under connector failure, and the delay between a threat-intelligence update and its enforcement on the Secure Web Gateway.

**Results.** The measurements are careful and, in places, revealing:

- A single connector (2 vCPU, 4 GB) reached a capacity limit of about **3,900 successful requests per second at 1,400 concurrent clients** (p50 309 ms, p95 609 ms). Beyond that point throughput fell sharply while response times rose by an order of magnitude.
- His CPU-threshold controller, driving the vCenter REST API, powered on the secondary connector reliably: the VM was running in **about 5 seconds** and carried application traffic within **about 1.5 minutes**. He also found that, with a single load client, the new connector replaced the first one rather than sharing the load.
- A silent network failure of the active connector caused a **complete outage of about five minutes** (median 301.5 s) before traffic moved to the remaining connector. This is a practically important finding for anyone sizing such deployments for availability.
- Threat indicators from URLhaus were synchronised into a managed web category repeatably; enforcement then took effect either within **about one second** or only after **more than ten minutes**.

**Independent research ability.** [Choose one or two concrete episodes. Possible examples: "He set up and operated the Budapest testbed remotely from Barcelona during his Erasmus+ semester," "He defined the acceptance and capacity-limit rules before running the campaign, rather than after seeing the data," or "Where the data could not explain an effect, such as the two ranges of blocking delay, he said so plainly instead of over-interpreting."] Over the project I have seen him [break an open-ended problem into testable questions / question his own results / report limitations honestly], which is what I look for in a student who is ready for research.

**Engineering skill.** All experiment scripts (load runner, availability probes, autoscaling controller, threat-intelligence synchronisation) are published in a versioned public repository, so the measurements can be reproduced. [Add your own observation, e.g. on code quality, documentation or the reliability of the testbed.]

**Background.** Richard came to the thesis with unusual practical grounding for a BSc student. In the PARIPA research project at BME he designed Zero Trust Network Access models for enterprise hybrid clouds using HPE Aruba SSE. During his summer 2026 internship at Szinva Net Informatikai Zrt. he configured and validated SSE policies and zero-trust tunnels on production networks. He also holds the Cisco CCNA certification and worked as a network operations intern on national healthcare network infrastructure in 2025. [Keep, shorten or remove as you see fit.]

**Work habits and communication.** Richard is [reliable with deadlines / well organised / receptive to feedback]. He writes clearly in English; the thesis itself is written in English. During the Fall 2026 semester he continued the thesis while on Erasmus+ exchange at UPC in Barcelona, [keeping to an agreed schedule of regular updates], which showed me he can work independently without close supervision.

**Comparison.** [Optional but valuable to committees. For example: "Among the [N] BSc thesis students I have advised, I would place Richard in the top [X]% for research independence and the top [Y]% for technical execution."]

**Fit for AScI.** A summer at Aalto would let Richard take this measurement-driven approach into an established research group working on [networked systems / security / distributed computing]. I expect him to become productive quickly, to need little hand-holding on infrastructure work, and to ask good questions. I recommend him [strongly / without reservation].

Please feel free to contact me at [email]@bme.hu or [phone] if I can provide further information.

Sincerely,

[Signature]

**dr. Márk Péter Szalay**
[Title]
Department of Networked Systems and Services
Faculty of Electrical Engineering and Informatics
Budapest University of Technology and Economics
[email] · [phone]

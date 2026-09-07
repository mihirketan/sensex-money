# Sensex.money — Data Infrastructure & Moat Research

*A grounded pass at your master research brief. Honesty note up front: your brief asks for 37 sections and 15 deliverables at primary-source depth — that's genuinely a multi-week research engagement (data licensing terms alone need a securities lawyer, not a search engine). What follows is a real, sourced first pass at the deliverables that matter most for a go/no-go decision, with everything labeled **Verified / Estimated / Unknown** as you asked. Treat this as the skeleton to commission full diligence on, not the diligence itself.*

---

## A. Executive Thesis (under 1,000 words)

The Indian retail-facing data landscape is **crowded on fundamentals, thin on history, and empty on point-in-time integrity**. Screener, Trendlyne, Tijori, StockEdge and Tickertape already compete hard on "show me the ratios and screens" — that market is real but saturated, and margins there are thin (₹2,000–₹8,000/year retail pricing across the category — **Verified** by pricing pages). Tijori just raised a ~$9.3M Series A specifically to go deeper on operational/alternative data extracted from filings (**Verified**) — proof the category still has capital appetite, but also proof the "better screener" lane already has a funded leader.

The actual white space is **not another screener**. It's the layer underneath all of them: a clean, corporate-action-adjusted, point-in-time, permanently-identified historical database of the Indian listed universe, exposed as an API rather than a dashboard. Every platform above is rebuilding fragments of this independently, from the same messy exchange bhavcopy files, and none of them advertise total-return (dividend-adjusted) history or point-in-time fundamentals as a product — which tells you either (a) nobody has built it cleanly, or (b) it's harder and less commercially obvious than it looks. Likely both.

Two structural facts matter more than any feature idea:

1. **All raw exchange data is licensed, not owned** (**Verified** — NSE/BSE data vendor agreements explicitly state data remains exchange IP; redistribution requires separate written approval — TrueData, GFDL, Quora vendor summaries all consistent on this). This means Sensex.money's moat cannot be "we have the raw feed" — everyone with a vendor contract has that. The moat has to be in *what you calculate and how far back you can defensibly calculate it*, not in possessing the ticks.

2. **Sentiment/mood indices for India already exist** (**Verified** — Streetgains runs a "Fear and Greed Market Mood Index" combining India VIX, FII/DII flows, and advance-decline data; FII/DII daily flow data is already free and widely published by every broker). The "India's Fear & Greed Index" idea from our earlier conversation is not virgin territory — it's a real, live category with at least one incumbent. That doesn't kill it, but it changes the pitch from "first mover" to "better methodology, better distribution, or a genuinely different input set."

**The single highest-leverage thing worth spending 12 months building is not a UI — it's a corporate-action-clean, point-in-time total-return database of the BSE/NSE listed universe, with a defensible permanent-identity schema for every company (ticker/name/ISIN changes, mergers, delistings tracked).** This is exactly the kind of asset that gets *harder to replicate the longer you hold it* (Section 27 logic): a competitor starting today can buy the same raw data, but they cannot buy 10 years of already-validated, already-adjusted history — that has to be built once, correctly, and maintained continuously. It is also the thing your own Nifty Money analytics pipeline (Sortino/CROCI on BSE equities) already depends on implicitly — you may already have solved pieces of this without naming it as the product.

---

## B–D. Data Map / Availability / Trader Map (condensed)

| Layer | Examples | Earliest realistic machine-readable depth | Access route | License risk |
|---|---|---|---|---|
| Index level (Sensex/Nifty) | price, base 1978-79=100 | Full series back to 1979 exists in the public domain narratively; clean daily series commercially available via S&P DJI/BSE and vendors | BSE/NSE, S&P DJI, paid vendors (TrueData, GFDL, Xignite) | Medium — display generally fine, redistribution restricted |
| Equity price history | OHLCV per stock | Vendor claims "no practical lookback limit" on daily/weekly/monthly bars (**Estimated** — vendor marketing claim, needs verification per-symbol); intraday minute data typically capped ~3 years (**Verified**, Infoway) | NSE/BSE bhavcopy, licensed vendors (TrueData, GFDL, APIdatafeed) | High for redistribution, lower for internal calculation |
| Corporate actions | splits, bonuses, dividends, mergers | Patchy pre-2000, better post-2005 as digital filing matured (**Unknown** — requires vendor-by-vendor check) | BSE/NSE corporate action feeds, vendor APIs | Medium |
| Fundamentals (current) | revenue, EPS, ratios | Strong — this is the contested, crowded space (Screener, Tijori, Trendlyne all compete here) | Company filings, vendor aggregation | Low for derived ratios, medium for raw scraped filings |
| **Point-in-time fundamentals** (as originally reported, not restated) | — | **Largely absent from retail Indian platforms** (**Estimated** based on absence in feature lists of Screener/Trendlyne/Tijori/StockEdge — none advertise point-in-time vs. restated data) | Would require archiving filings as-published, not just latest figures | Low legal risk, high engineering effort |
| Derivatives (options/futures) | OI, IV, Greeks | Historical Greeks/OI available via paid vendors (GFDL "History of Greeks API" — **Verified**) | NSE F&O feeds, vendors | Medium-high |
| Institutional flow (FII/DII) | daily net buy/sell | **Already free and daily** via NSE provisional data and broker sites (**Verified** — multiple free trackers exist) | NSE, SEBI, NSDL | Low — already public |
| Sentiment | VIX, mood index | **Already exists** (Streetgains, others) | Composite of above | Low |

**Trader-type data needs (condensed):** intraday/momentum traders want tick + order-flow proxies (mostly locked behind paid vendor tiers); fundamental/PMS-style investors want *point-in-time, bias-free* history (genuinely underserved); quant researchers want long clean total-return series with survivorship-bias-free universes (genuinely underserved — nobody in the retail-facing Indian market advertises a delisted/failed-company database); retail traders mostly want what already exists (screeners, sentiment) and are the most competitive segment to serve.

---

## E. Ranked Opportunity List (top of a fuller 30–50 list)

Scored roughly 1–10 on value / defensibility / legal complexity where I have enough evidence to estimate; otherwise marked Unknown.

| # | Product | User value | Defensibility | Legal complexity | Verdict |
|---|---|---|---|---|---|
| 1 | Point-in-time fundamentals database (no restatement bias) | High | High — takes years to build, compounds | Low | **Build this first** |
| 2 | Corporate-action-adjusted total-return history per stock, incl. delisted/failed companies (survivorship-bias-free) | High | High | Low-Medium | **Core moat asset** |
| 3 | "₹1 lakh time machine" (historical investment outcome calculator) | High (viral, SEO) | Low alone / High if built on #1+#2 | Low | Great front-door product, not a moat itself |
| 4 | Market crash/drawdown event database with standardized schema | Medium-High | Medium | Low | Strong content/SEO asset |
| 5 | "What happened after X" forward-return distribution engine | Medium-High | Medium (methodology, not data) | Low | Needs explicit bias disclaimers |
| 6 | India sentiment/mood index | Medium | **Low — incumbent exists (Streetgains)** | Low | Only worth it with a genuinely different methodology or distribution edge |
| 7 | Institutional research API (regime engine, event DB, quant factors) | High (institutional willingness to pay) | Medium-High | Medium (usage licensing) | Natural upsell path to PEH Terminal |
| 8 | Company "DNA" historical profile pages (SEO) | Medium | Low individually, Medium in aggregate | Low | Good top-of-funnel |
| 9 | Trader behavioral analytics (your existing concept) | High, unproven demand | Medium | Low | Separate venture track — don't conflate with data-moat play |
| 10 | Real-time redistributed tick data product | Low fit for you | N/A | **High** — requires direct exchange licensing, large capex | Avoid — not a startup-stage play |

---

## F. Top Proprietary Datasets Ranked by Defensibility

1. Point-in-time fundamentals archive (compounds every quarter you run it)
2. Corporate-identity graph (permanent entity IDs across name/ticker/merger history)
3. Survivorship-inclusive return database (delisted, bankrupt, acquired companies)
4. Standardized crash/event schema with pre/post metrics
5. Long-run sector-rotation and regime classification history

Everything below this line (real-time feeds, options Greeks, sentiment) is **replicable by any competitor with a vendor contract** — genuinely not defensible on data alone.

---

## G. Collaboration Opportunities (most realistic first)

- **Academic (UEL and other finance departments):** you already sit inside a PhD research context on explainable RL for portfolio optimization — a point-in-time, bias-free Indian equity dataset is exactly the kind of infrastructure academic finance research is short of. Realistic, low-cost, credibility-building partnership.
- **Existing screener platforms (Tijori, Trendlyne) as data customers, not competitors:** if you build the point-in-time/survivorship layer, *they* are potential API customers rather than rivals — they already monetize the UI layer and would rather license clean history than rebuild it.
- **NSDL/CDSL/SEBI-adjacent data:** realistic only at enterprise/licensing scale — flag for legal review, not a near-term partnership.
- **Alpesh Patel's fund / existing institutional relationships:** already a live distribution channel for anything positioned as research infrastructure rather than a retail app.

---

## H. Competitor White-Space

Screener, Trendlyne, Tijori, StockEdge, Tickertape all compete on **current fundamentals + screening + technicals** (**Verified** across all their feature pages). None of them lead with or advertise:
- point-in-time (non-restated) fundamentals
- survivorship-bias-free historical universes including delisted/failed companies
- a documented corporate-action-adjustment methodology exposed as an API rather than baked into a chart

That gap is real and defensible. The sentiment/mood-index gap is **not** real — Streetgains already occupies it, and it's a low-moat category anyway (methodology is the only differentiator, and methodologies are easy to copy once published).

---

## I. Legal/Licensing Risk Matrix

| Item | Risk | Note |
|---|---|---|
| Displaying delayed/EOD prices with attribution | Low | Standard practice industry-wide |
| Redistributing raw tick/real-time data | **High** | Requires direct exchange licensing agreement — **flag for a securities/data lawyer**, not resolvable by research |
| Calculating and publishing derived ratios (Sortino, CROCI, etc.) from licensed data | Low-Medium | Generally accepted as "your own analytics," but confirm your specific vendor contract doesn't restrict derivative publication |
| Publishing a proprietary sentiment score | Low | Composite/derived, similar to VIX-style indices already public |
| Point-in-time fundamentals archive built from public filings | Low-Medium | Filings are public disclosure; commercial redistribution of the *raw filing text* vs. your derived structured data is the distinction — **confirm with counsel** |
| Any "buy/sell" framing on outputs | Medium-High | SEBI investment-advisory registration considerations apply the moment recommendations (not just data) are offered — **flag for counsel explicitly** |

---

## J–L. Architecture, MVP, Roadmap (condensed)

**MVP (90 days), realistic given this is layered on your existing Nifty Money pipeline:** extend the current Sortino/CROCI pipeline to (1) tag every stock with a permanent entity ID, (2) store point-in-time snapshots of the fundamentals you already pull rather than overwriting them, (3) ship one public page — the "₹1 lakh time machine" for BSE Sensex constituents only — as the SEO/distribution front door.

**Architecture:** Postgres or DuckDB is enough at this stage — you do not need ClickHouse/Timescale until you're ingesting tick data, which per Section I above is a licensing decision you likely shouldn't make yet. Parquet files for the historical archive, versioned, is sufficient and cheap.

**12-month roadmap (headline only):** Q1 point-in-time + entity-ID layer on existing pipeline → Q2 public time-machine tool + crash-event database (SEO) → Q3 survivorship-inclusive universe expansion beyond Sensex-30 to full BSE listed set → Q4 institutional API pilot with one existing relationship (e.g., RootBridge/Alpesh Patel network) as paying design partner.

---

## M. Business Model

Free (time-machine tool, crash database, daily health-check) → Pro retail (screens/alerts, ~$10–20/mo, **Estimated** in line with category pricing) → Institutional API (regime/event/point-in-time data, priced like your existing PEH Terminal tiers — **Estimated** using your existing £12k–£20k/year bands as an anchor, not confirmed for this specific product).

---

## N. The Moat, Restated

Real-time data, screeners, and sentiment scores are commodity layers — anyone with a vendor contract and a few months can replicate them. The only genuinely compounding asset here is **history that has been cleaned once, correctly, and never has to be re-cleaned** — point-in-time fundamentals and survivorship-inclusive returns. Every additional year you hold that archive without restating or losing it, the gap to a new entrant widens, because they can't buy your 2019–2029 archive of *what the data actually looked like in real time* — that data, once overwritten by "current" figures elsewhere, is gone for good.

---

## O. Genius Ideas (non-obvious, selected)

1. **"Data provenance" as a selling point** — publicly show your Data Confidence Score per data point (Section 32 of your brief); nobody in the Indian retail space markets data quality as a feature, which is itself a differentiator.
2. **Sell the *absence* of survivorship bias as a research product to PMS/AIF back-testers**, who are currently unknowingly back-testing on winner-only universes.
3. **License your point-in-time archive to academic finance departments at low/no cost** in exchange for citations — builds credibility and a moat simultaneously (nobody cites a screener; people cite a dataset).
4. **A "restated vs. as-reported" delta page per company** — showing where a company's numbers were later restated — is a genuinely novel, hard-to-fake trust signal no incumbent offers.
5. **Position the whole platform as infrastructure for other fintechs (B2B2C)**, not a destination site — sell the API to Tijori/Trendlyne/broking apps rather than competing with them for retail eyeballs you don't have the distribution to win.

---

## What I could not responsibly do in this pass

- Exhaustive per-vendor pricing (most vendors: **"pricing not publicly disclosed"** — confirmed pattern across TrueData, GFDL, APIdatafeed)
- Definitive legal conclusions on redistribution rights — **this section explicitly requires an Indian securities/data lawyer**, not further search
- A verified 40-year machine-readable Sensex constituent-and-price dataset — base year/methodology is well documented (1978-79=100, free-float since 2003 — **Verified**), but the actual earliest clean machine-readable *daily* series needs a direct BSE/vendor conversation, not open web research
- The full 100-page SEO list and 50-product ranked list from your brief — I gave you the top-ranked slice with real reasoning; happy to extend either list if useful, but padding them further without new evidence would just be invention

If you want, I can turn the MVP section into an actual technical spec next, or draft the point-in-time entity-ID schema concretely against your existing Nifty Money pipeline.

# Sensex.money — India's Financial Memory

Sensex.money is a quantitative historical market intelligence platform organizing 45+ years of Indian capital markets (1979–Present).

## Core Philosophy

- **Security Identity & Lineage**: Tracking permanent entity IDs across name changes, mergers, demergers, and listings without survivorship or restatement bias.
- **Point-in-Time Corporate Actions**: Reconstructing exact historical index weights, adjusted prices, and dividend-reinvested Total Return (TRI).
- **Macro Regime Classification**: Analyzing market breadth, volatility envelopes, and liquidity dynamics across major Indian economic eras.

## Available Routes

- `/` — Homepage: Platform thesis, core benchmarks, featured analytical modules, and data philosophy.
- `/market` — Market Intelligence: Composite market health score, advance/decline breadth, sector rotation heatmap, volatility regimes, institutional cash flows, and forward distributions.
- `/stocks` — Stock Explorer: Directory of major listed equities with 1D/1Y performance, explicit historical lineage records, and survivorship warnings.
- `/stocks/:symbol` — Stock Profile & Dossier (e.g. `/stocks/INFY`): Longitudinal price chart, company history timeline, corporate actions audit ledger, CAGR return engine, ₹1 Lakh simulator, drawdown recovery curve, Company DNA, regime beta, and valuation percentile bands.
- `/history` (and `/history/sensex`) — India's Financial Memory: Interactive chronology (1979–2026), ₹1 Lakh wealth simulator, Crash Atlas of 8 major drawdowns, 10 Market Era dossiers, Sensex through time (Price/Log/Drawdown), annual returns matrix, historical valuation envelopes, sector leadership timeline, Market Events database, "What Happened After?" empirical studies, and Market Time Machine.
- `/research` — Quantitative Market Research: Interactive historical research query engine, study result interface with forward-return percentile bands (P10–P90), underlying historical episode observation audit rows, featured empirical dossiers, event study modeler (Cumulative Abnormal Return), factor research matrix, methodological bias controls, reproducibility audit trails, and searchable research library.
- `/tools` — Interactive Financial Research Laboratory: Catalog of 16 specialized research tools, featured ₹1 Lakh investment simulator (Price vs Total Return), Market Time Machine, Company Comparator, Crash Atlas, Corporate Action Explorer, Regime Explorer, Sector Rotation, Event Study, Valuation Explorer, Drawdown Analyzer, Rolling Returns, and Historical Question Builder.
  - `/tools/time-machine`
  - `/tools/investment-simulator`
  - `/tools/company-comparator`
  - `/tools/crash-atlas`
  - `/tools/corporate-actions`
  - `/tools/regime-explorer`
  - `/tools/sector-rotation`
  - `/tools/event-study`
  - `/tools/valuation`
  - `/tools/drawdowns`
  - `/tools/rolling-returns`
  - `/tools/stock-vs-market`
  - `/tools/sip-vs-lumpsum`
  - `/tools/portfolio-simulator`
  - `/tools/corporate-action-returns`
  - `/tools/question-builder`

## Development & Build

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Production build
npm run build
```

## Data Provenance Standards

All metrics are tagged with explicit data status indicators:
- `VERIFIED DATA`
- `CALCULATED`
- `ILLUSTRATIVE DATA` (Demonstration dataset • methodology preview)
- `PARTIALLY VERIFIED`
- `SOURCE PENDING`
- `DERIVED`

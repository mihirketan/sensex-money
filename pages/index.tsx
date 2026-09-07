import React, { useState, useEffect, useMemo } from "react";
import { Link, useParams, useNavigate, useLocation } from "react-router-dom";
import {
  TrendingUp,
  TrendingDown,
  Search,
  Sparkles,
  Clock,
  Calculator,
  Dna,
  Layers,
  ShieldAlert,
  BarChart3,
  ArrowRight,
  Activity,
  Calendar,
  Database,
  FileSpreadsheet,
  CheckCircle2,
  Menu,
  X,
  Info,
  ChevronRight,
  ChevronDown,
  ArrowUpRight,
  ArrowDownRight,
  AlertTriangle,
  Sliders,
  FileText,
  HelpCircle,
  Zap,
  Filter,
  History as HistoryIcon,
  BookOpen,
  Scale,
  Compass,
  FlaskConical,
  SlidersHorizontal,
  Bookmark,
  Share2,
  Lock,
  RefreshCw
} from "lucide-react";
import { supabase } from "../src/lib/supabase";

// ============================================================================
// ILLUSTRATIVE DATA FOR MARKET SNAPSHOT & HISTORICAL METRICS
// ============================================================================
const MARKET_BENCHMARKS = [
  {
    symbol: "SENSEX",
    name: "BSE 30 Benchmark",
    value: "81,420.50",
    change: "+480.20",
    pctChange: "+0.59%",
    isPositive: true,
    baseInfo: "Base Year 1978-79 = 100",
    rangeLow: "80,950.10",
    rangeHigh: "81,640.80",
    sparkline: "0,22 10,20 20,24 30,17 40,19 50,14 60,16 70,9 80,11 90,4 100,6",
  },
  {
    symbol: "NIFTY 50",
    name: "NSE 50 Benchmark",
    value: "24,835.10",
    change: "+142.30",
    pctChange: "+0.58%",
    isPositive: true,
    baseInfo: "Base Year 1995 = 1,000",
    rangeLow: "24,680.00",
    rangeHigh: "24,890.40",
    sparkline: "0,24 10,21 20,22 30,18 40,15 50,18 60,12 70,14 80,8 90,9 100,5",
  },
  {
    symbol: "BANK NIFTY",
    name: "12 Banking Leaders",
    value: "51,210.80",
    change: "-95.40",
    pctChange: "-0.19%",
    isPositive: false,
    baseInfo: "Base Year 2000 = 1,000",
    rangeLow: "51,020.10",
    rangeHigh: "51,480.50",
    sparkline: "0,6 10,8 20,5 30,11 40,9 50,16 60,14 70,20 80,19 90,24 100,22",
  },
];

const HISTORICAL_TIMELINE = [
  {
    year: "1979",
    era: "Sensex Base Era",
    tagline: "The origin of benchmark indexing in India",
    description: "Base value pegged at 100 on April 1, 1979. Created to establish an objective barometer for post-liberalization industrial growth.",
    metric: "Base: 100",
    color: "#e2b357",
  },
  {
    year: "1986",
    era: "Sensex Launched",
    tagline: "Formal introduction of BSE Sensitive Index",
    description: "The Bombay Stock Exchange formally standardizes and publishes the 30-stock market-cap weighted index to track corporate India.",
    metric: "30 Constituents",
    color: "#38bdf8",
  },
  {
    year: "1992",
    era: "Harshad Mehta Era",
    tagline: "Liquidity surge & institutional overhaul",
    description: "Unprecedented market frenzy followed by a 54% structural drawdown, catalyzing the statutory charter of SEBI and depository electronic systems.",
    metric: "-54% Drawdown",
    color: "#f43f5e",
  },
  {
    year: "2000",
    era: "Dot-Com Crash",
    tagline: "Technology repricing & electronic trading",
    description: "Global telecom/tech bubble deflation reshapes the Indian IT landscape. T+2 rolling settlement and modern derivative architectures introduced.",
    metric: "-56% Tech Correction",
    color: "#f43f5e",
  },
  {
    year: "2008",
    era: "Global Financial Crisis",
    tagline: "Subprime contagion & liquidity freeze",
    description: "Global credit freeze triggers a peak-to-trough 60% contraction from 21k highs, followed by multi-year economic rebuilding.",
    metric: "-60% Index Fall",
    color: "#f43f5e",
  },
  {
    year: "2020",
    era: "COVID Shock",
    tagline: "Fastest crash & retail revolution",
    description: "March 2020 witnessed the sharpest 38% drop in 30 days, followed by historic monetary easing and an explosion of domestic retail investor participation.",
    metric: "-38% in 30 Days",
    color: "#10b981",
  },
  {
    year: "2024–26",
    era: "Modern Market Era",
    tagline: "Institutional depth & domestic SIP bedrock",
    description: "Total Indian market capitalization exceeds ₹400 Lakh Crore, anchored by sustained monthly domestic systematic investment flows.",
    metric: "₹400L+ Cr M-Cap",
    color: "#10b981",
  },
];

const FEATURED_PRODUCTS = [
  {
    title: "Market Time Machine",
    tagline: "Travel through India's market history.",
    description: "Reconstruct index compositions, valuations, macro regimes, and constituents for any single trading day since 1979.",
    icon: Clock,
    link: "/time-machine",
    badge: "EPOCH ENGINE",
    accent: "#38bdf8",
  },
  {
    title: "₹1 Lakh Simulator",
    tagline: "See what historical investments would have become.",
    description: "Simulate lump-sum and SIP allocations across companies and indices with dividend reinvestments and corporate action adjustments.",
    icon: Calculator,
    link: "/tools/investment-simulator",
    badge: "TOTAL RETURN",
    accent: "#10b981",
  },
  {
    title: "Company DNA",
    tagline: "Understand how companies behaved across different market regimes.",
    description: "Examine multi-decade corporate survival, pricing power, drawdown resistance during bear markets, and capital allocation track records.",
    icon: Dna,
    link: "/stocks",
    badge: "REGIME PROFILES",
    accent: "#a855f7",
  },
  {
    title: "Corporate Actions",
    tagline: "Trace splits, bonuses, mergers, demergers and other events.",
    description: "Point-in-time historical ledger recording corporate capital changes with survivorship-conscious methodology.",
    icon: Layers,
    link: "/corporate-actions",
    badge: "PERMANENT IDENTIFIERS",
    accent: "#f59e0b",
  },
  {
    title: "Crash Atlas",
    tagline: "Study India's major market drawdowns and recoveries.",
    description: "Detailed empirical anatomy of major market drawdowns in Indian history: trigger catalysts, peak-to-trough drawdowns, and recovery trajectories.",
    icon: ShieldAlert,
    link: "/crashes",
    badge: "DRAWDOWN STUDIES",
    accent: "#f43f5e",
  },
  {
    title: "What Happened After?",
    tagline: "Study what historically happened after important market events.",
    description: "Standardized statistical event studies analyzing 30, 90, 180, and 365-day forward return distributions following major policy and market shocks.",
    icon: Activity,
    link: "/research/event-studies",
    badge: "FORWARD DISTRIBUTIONS",
    accent: "#06b6d4",
  },
];

// ============================================================================
// STYLES OBJECT (CLEAN, MODULAR, RESPONSIVE)
// ============================================================================
const styles = {
  root: {
    minHeight: "100vh",
    backgroundColor: "#070b14",
    color: "#f8fafc",
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    lineHeight: 1.5,
    WebkitFontSmoothing: "antialiased",
    MozOsxFontSmoothing: "grayscale",
    overflowX: "hidden" as const,
  },
  container: {
    maxWidth: "1240px",
    margin: "0 auto",
    padding: "0 24px",
  },
  header: {
    borderBottom: "1px solid rgba(255, 255, 255, 0.07)",
    backgroundColor: "rgba(7, 11, 20, 0.95)",
    backdropFilter: "blur(12px)",
    position: "sticky" as const,
    top: 0,
    zIndex: 50,
  },
  headerInner: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    height: "64px",
  },
  logoGroup: {
    display: "flex",
    alignItems: "baseline",
    gap: "10px",
    textDecoration: "none",
  },
  logoText: {
    fontSize: "19px",
    fontWeight: 700,
    letterSpacing: "-0.03em",
    color: "#ffffff",
  },
  logoDot: {
    color: "#38bdf8",
  },
  logoTag: {
    fontSize: "11px",
    fontWeight: 500,
    letterSpacing: "0.06em",
    textTransform: "uppercase" as const,
    color: "#64748b",
    fontFamily: '"SF Mono", "JetBrains Mono", Menlo, Consolas, monospace',
  },
  nav: {
    display: "flex",
    alignItems: "center",
    gap: "28px",
  },
  navLink: {
    color: "#94a3b8",
    textDecoration: "none",
    fontSize: "14px",
    fontWeight: 500,
    transition: "color 0.15s ease",
  },
  headerActions: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },
  searchBtn: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    padding: "6px 12px",
    borderRadius: "6px",
    border: "1px solid rgba(255, 255, 255, 0.12)",
    backgroundColor: "rgba(255, 255, 255, 0.04)",
    color: "#94a3b8",
    fontSize: "13px",
    textDecoration: "none",
    transition: "all 0.15s ease",
  },
  kbd: {
    padding: "2px 5px",
    fontSize: "10px",
    fontFamily: '"SF Mono", "JetBrains Mono", Menlo, monospace',
    backgroundColor: "rgba(255, 255, 255, 0.08)",
    border: "1px solid rgba(255, 255, 255, 0.14)",
    borderRadius: "4px",
    color: "#94a3b8",
  },
  askBtn: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    padding: "7px 14px",
    borderRadius: "6px",
    backgroundColor: "rgba(56, 189, 248, 0.12)",
    border: "1px solid rgba(56, 189, 248, 0.3)",
    color: "#38bdf8",
    fontSize: "13px",
    fontWeight: 500,
    textDecoration: "none",
    transition: "all 0.15s ease",
  },
  heroSection: {
    padding: "48px 0 32px",
    position: "relative" as const,
    borderBottom: "1px solid rgba(255, 255, 255, 0.06)",
  },
  heroBadge: {
    display: "inline-flex",
    alignItems: "center",
    gap: "8px",
    padding: "4px 10px",
    borderRadius: "4px",
    backgroundColor: "rgba(56, 189, 248, 0.08)",
    border: "1px solid rgba(56, 189, 248, 0.22)",
    fontSize: "11px",
    letterSpacing: "0.12em",
    fontWeight: 600,
    color: "#38bdf8",
    textTransform: "uppercase" as const,
    fontFamily: '"SF Mono", "JetBrains Mono", Menlo, monospace',
    marginBottom: "16px",
  },
  heroTitle: {
    fontSize: "clamp(28px, 4.2vw, 48px)",
    fontWeight: 800,
    letterSpacing: "-0.03em",
    lineHeight: 1.15,
    color: "#ffffff",
    maxWidth: "880px",
    marginBottom: "14px",
  },
  heroSubtitle: {
    fontSize: "clamp(15px, 1.5vw, 17px)",
    color: "#94a3b8",
    maxWidth: "680px",
    lineHeight: 1.55,
    marginBottom: "24px",
  },
  heroButtons: {
    display: "flex",
    flexWrap: "wrap" as const,
    alignItems: "center",
    gap: "12px",
    marginBottom: "32px",
  },
  primaryBtn: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
    padding: "11px 22px",
    backgroundColor: "#ffffff",
    color: "#070b14",
    border: "1px solid #ffffff",
    borderRadius: "6px",
    fontSize: "14px",
    fontWeight: 600,
    textDecoration: "none",
    cursor: "pointer",
  },
  secondaryBtn: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
    padding: "11px 20px",
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    color: "#f8fafc",
    borderRadius: "6px",
    border: "1px solid rgba(255, 255, 255, 0.18)",
    fontSize: "14px",
    fontWeight: 500,
    textDecoration: "none",
    cursor: "pointer",
  },
  metricStrip: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "1px",
    backgroundColor: "rgba(255, 255, 255, 0.08)",
    border: "1px solid rgba(255, 255, 255, 0.08)",
    borderRadius: "8px",
    overflow: "hidden",
  },
  metricItem: {
    backgroundColor: "#0c1322",
    padding: "14px 18px",
  },
  metricVal: {
    fontSize: "17px",
    fontWeight: 700,
    letterSpacing: "-0.02em",
    color: "#ffffff",
    fontFamily: '"SF Mono", "JetBrains Mono", Menlo, monospace',
    marginBottom: "3px",
  },
  metricLbl: {
    fontSize: "12px",
    color: "#718096",
    lineHeight: 1.4,
  },
  section: {
    padding: "54px 0",
    borderBottom: "1px solid rgba(255, 255, 255, 0.05)",
  },
  sectionHeader: {
    marginBottom: "28px",
  },
  sectionEyebrow: {
    fontSize: "11px",
    letterSpacing: "0.14em",
    fontWeight: 600,
    color: "#38bdf8",
    textTransform: "uppercase" as const,
    fontFamily: '"SF Mono", "JetBrains Mono", Menlo, monospace',
    marginBottom: "8px",
  },
  sectionTitle: {
    fontSize: "26px",
    fontWeight: 700,
    letterSpacing: "-0.025em",
    color: "#ffffff",
    marginBottom: "8px",
  },
  sectionDesc: {
    fontSize: "14px",
    color: "#94a3b8",
    maxWidth: "680px",
    lineHeight: 1.55,
  },
  illustrativeBadge: {
    display: "inline-flex",
    alignItems: "center",
    gap: "6px",
    padding: "3px 8px",
    borderRadius: "4px",
    backgroundColor: "rgba(245, 158, 11, 0.1)",
    border: "1px solid rgba(245, 158, 11, 0.25)",
    color: "#f59e0b",
    fontSize: "11px",
    fontFamily: '"SF Mono", "JetBrains Mono", Menlo, monospace',
    fontWeight: 600,
    textTransform: "uppercase" as const,
    letterSpacing: "0.05em",
  },
  snapshotGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
    gap: "20px",
  },
  snapshotCard: {
    backgroundColor: "#0d1527",
    border: "1px solid rgba(255, 255, 255, 0.08)",
    borderRadius: "8px",
    padding: "24px",
    position: "relative" as const,
    transition: "border-color 0.15s ease",
  },
  conceptGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
    gap: "24px",
  },
  conceptCard: {
    backgroundColor: "#0b1220",
    border: "1px solid rgba(255, 255, 255, 0.07)",
    borderRadius: "8px",
    padding: "28px",
  },
  conceptEyebrow: {
    fontSize: "12px",
    fontWeight: 700,
    letterSpacing: "0.08em",
    textTransform: "uppercase" as const,
    fontFamily: '"SF Mono", "JetBrains Mono", Menlo, monospace',
    color: "#38bdf8",
    marginBottom: "10px",
  },
  conceptQuestion: {
    fontSize: "22px",
    fontWeight: 700,
    color: "#ffffff",
    marginBottom: "12px",
    letterSpacing: "-0.02em",
  },
  conceptText: {
    fontSize: "14px",
    color: "#94a3b8",
    lineHeight: 1.6,
  },
  productGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))",
    gap: "20px",
  },
  productCard: {
    display: "flex",
    flexDirection: "column" as const,
    justifyContent: "space-between",
    backgroundColor: "#0c1424",
    border: "1px solid rgba(255, 255, 255, 0.08)",
    borderRadius: "8px",
    padding: "26px",
    textDecoration: "none",
    color: "inherit",
    transition: "all 0.2s ease",
  },
  timelineScroll: {
    display: "flex",
    gap: "16px",
    overflowX: "auto" as const,
    paddingBottom: "16px",
    scrollbarWidth: "thin" as const,
  },
  timelineCard: {
    flex: "0 0 280px",
    backgroundColor: "#0b1222",
    border: "1px solid rgba(255, 255, 255, 0.08)",
    borderRadius: "8px",
    padding: "22px",
    position: "relative" as const,
  },
  philosophyGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
    gap: "24px",
  },
  philosophyCol: {
    backgroundColor: "#0a101d",
    border: "1px solid rgba(255, 255, 255, 0.07)",
    borderRadius: "8px",
    padding: "30px",
  },
  finalCtaCard: {
    backgroundColor: "#0d1629",
    border: "1px solid rgba(56, 189, 248, 0.2)",
    borderRadius: "10px",
    padding: "54px 40px",
    textAlign: "center" as const,
    position: "relative" as const,
    overflow: "hidden",
  },
  footer: {
    backgroundColor: "#05080f",
    borderTop: "1px solid rgba(255, 255, 255, 0.07)",
    padding: "60px 0 40px",
  },
};

// ============================================================================
// MAIN COMPONENT: HOME
// ============================================================================
export const Home: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div style={styles.root}>
      {/* -------------------------------------------------------------------- */}
      {/* 1. HEADER                                                           */}
      {/* -------------------------------------------------------------------- */}
      <header style={styles.header}>
        <div style={styles.container}>
          <div style={styles.headerInner}>
            {/* Logo */}
            <Link to="/" style={styles.logoGroup}>
              <span style={styles.logoText}>
                Sensex<span style={styles.logoDot}>.</span>money
              </span>
              <span style={styles.logoTag}>Financial Memory</span>
            </Link>

            {/* Desktop Navigation */}
            <nav style={styles.nav} className="desktop-nav">
              <Link to="/market" style={styles.navLink}>Market</Link>
              <Link to="/stocks" style={styles.navLink}>Stocks</Link>
              <Link to="/history/sensex" style={styles.navLink}>History</Link>
              <Link to="/research" style={styles.navLink}>Research</Link>
              <Link to="/tools/investment-simulator" style={styles.navLink}>Tools</Link>
            </nav>

            {/* Action Buttons */}
            <div style={styles.headerActions}>
              <Link to="/search" style={styles.searchBtn} title="Search markets and records">
                <Search size={14} />
                <span className="search-label">Search</span>
                <span style={styles.kbd}>⌘K</span>
              </Link>
              <Link to="/ask" style={styles.askBtn}>
                <Sparkles size={14} />
                <span>Ask Sensex.money</span>
              </Link>
              <button
                type="button"
                className="mobile-toggle-btn"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label="Toggle Navigation"
                style={{
                  background: "transparent",
                  border: "none",
                  color: "#f8fafc",
                  cursor: "pointer",
                  display: "none",
                  padding: "6px",
                }}
              >
                {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
              </button>
            </div>
          </div>

          {/* Mobile Drawer */}
          {mobileMenuOpen && (
            <div
              style={{
                borderTop: "1px solid rgba(255, 255, 255, 0.08)",
                padding: "18px 0",
                display: "flex",
                flexDirection: "column",
                gap: "14px",
              }}
            >
              <Link to="/market" style={styles.navLink} onClick={() => setMobileMenuOpen(false)}>Market</Link>
              <Link to="/stocks" style={styles.navLink} onClick={() => setMobileMenuOpen(false)}>Stocks</Link>
              <Link to="/history/sensex" style={styles.navLink} onClick={() => setMobileMenuOpen(false)}>History</Link>
              <Link to="/research" style={styles.navLink} onClick={() => setMobileMenuOpen(false)}>Research</Link>
              <Link to="/tools/investment-simulator" style={styles.navLink} onClick={() => setMobileMenuOpen(false)}>Tools</Link>
              <Link to="/time-machine" style={styles.navLink} onClick={() => setMobileMenuOpen(false)}>Time Machine</Link>
              <Link to="/crashes" style={styles.navLink} onClick={() => setMobileMenuOpen(false)}>Crash Atlas</Link>
              <Link to="/corporate-actions" style={styles.navLink} onClick={() => setMobileMenuOpen(false)}>Corporate Actions</Link>
            </div>
          )}
        </div>
      </header>

      <main>
        {/* ------------------------------------------------------------------ */}
        {/* 2. HERO SECTION                                                    */}
        {/* ------------------------------------------------------------------ */}
        <section style={styles.heroSection}>
          <div style={styles.container}>
            <div style={styles.heroBadge}>
              <Database size={13} style={{ color: "#38bdf8" }} />
              <span>INDIA&apos;S FINANCIAL MEMORY</span>
            </div>

            <h1 style={styles.heroTitle}>
              Understand the market beyond today&apos;s price.
            </h1>

            <p style={styles.heroSubtitle}>
              Explore India&apos;s markets through history, corporate events, risk, returns and market behaviour.
            </p>

            <div style={styles.heroButtons}>
              <Link to="/history/sensex" style={styles.primaryBtn} className="primary-cta-btn">
                <span>Explore Market History</span>
                <ArrowRight size={16} />
              </Link>
              <Link to="/time-machine" style={styles.secondaryBtn} className="secondary-cta-btn">
                <Clock size={16} style={{ color: "#38bdf8" }} />
                <span>Open Time Machine</span>
              </Link>
            </div>

            {/* Historical Intelligence Metric Strip */}
            <div style={styles.metricStrip}>
              <div style={styles.metricItem}>
                <div style={styles.metricVal}>1979—Present</div>
                <div style={styles.metricLbl}>45+ Years of Standardized Index History</div>
              </div>
              <div style={styles.metricItem}>
                <div style={styles.metricVal}>Point-in-Time</div>
                <div style={styles.metricLbl}>Corporate Actions, Splits & Capital Events</div>
              </div>
              <div style={styles.metricItem}>
                <div style={styles.metricVal}>Drawdown Atlases</div>
                <div style={styles.metricLbl}>Major Market Contractions & Recoveries</div>
              </div>
              <div style={styles.metricItem}>
                <div style={styles.metricVal}>Bias-Aware</div>
                <div style={styles.metricLbl}>Survivorship-conscious research</div>
              </div>
            </div>
          </div>
        </section>

        {/* ------------------------------------------------------------------ */}
        {/* 3. MARKET SNAPSHOT                                                 */}
        {/* ------------------------------------------------------------------ */}
        <section style={styles.section}>
          <div style={styles.container}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: "16px", marginBottom: "28px" }}>
              <div>
                <div style={styles.sectionEyebrow}>CORE BENCHMARKS</div>
                <h2 style={styles.sectionTitle}>Market Snapshot</h2>
                <p style={styles.sectionDesc}>
                  Illustrative benchmark levels with historical context and intraday movement.
                </p>
              </div>
              <div>
                <div style={styles.illustrativeBadge}>
                  <Info size={13} />
                  <span>Illustrative data</span>
                </div>
              </div>
            </div>

            <div style={styles.snapshotGrid}>
              {MARKET_BENCHMARKS.map((item) => (
                <div key={item.symbol} style={styles.snapshotCard}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "14px" }}>
                    <div>
                      <div style={{ fontSize: "16px", fontWeight: 700, letterSpacing: "-0.01em", color: "#ffffff" }}>
                        {item.symbol}
                      </div>
                      <div style={{ fontSize: "12px", color: "#64748b" }}>
                        {item.name}
                      </div>
                    </div>
                    <div style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "4px",
                      padding: "3px 8px",
                      borderRadius: "4px",
                      fontSize: "12px",
                      fontWeight: 600,
                      fontFamily: '"SF Mono", "JetBrains Mono", Menlo, monospace',
                      backgroundColor: item.isPositive ? "rgba(16, 185, 129, 0.12)" : "rgba(244, 63, 94, 0.12)",
                      color: item.isPositive ? "#10b981" : "#f43f5e",
                      border: `1px solid ${item.isPositive ? "rgba(16, 185, 129, 0.25)" : "rgba(244, 63, 94, 0.25)"}`,
                    }}>
                      {item.isPositive ? <TrendingUp size={13} /> : <TrendingDown size={13} />}
                      <span>{item.pctChange}</span>
                    </div>
                  </div>

                  <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: "16px" }}>
                    <div style={{ fontSize: "28px", fontWeight: 700, letterSpacing: "-0.03em", fontFamily: '"SF Mono", "JetBrains Mono", Menlo, monospace' }}>
                      {item.value}
                    </div>
                    <div style={{ fontSize: "13px", fontWeight: 500, color: item.isPositive ? "#10b981" : "#f43f5e", fontFamily: '"SF Mono", "JetBrains Mono", Menlo, monospace' }}>
                      {item.change}
                    </div>
                  </div>

                  {/* Sparkline & Intraday Range */}
                  <div style={{
                    padding: "12px 14px",
                    backgroundColor: "rgba(0, 0, 0, 0.25)",
                    borderRadius: "6px",
                    border: "1px solid rgba(255, 255, 255, 0.05)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: "12px",
                  }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", fontSize: "10px", color: "#64748b", fontFamily: '"SF Mono", "JetBrains Mono", Menlo, monospace', marginBottom: "4px" }}>
                        <span>L: {item.rangeLow}</span>
                        <span>H: {item.rangeHigh}</span>
                      </div>
                      <div style={{ fontSize: "11px", color: "#94a3b8" }}>{item.baseInfo}</div>
                    </div>

                    {/* SVG Sparkline */}
                    <div style={{ width: "90px", height: "30px" }}>
                      <svg viewBox="0 0 100 30" style={{ width: "100%", height: "100%", overflow: "visible" }}>
                        <polyline
                          fill="none"
                          stroke={item.isPositive ? "#10b981" : "#f43f5e"}
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          points={item.sparkline}
                        />
                      </svg>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ marginTop: "16px", fontSize: "12px", color: "#64748b", display: "flex", alignItems: "center", gap: "6px" }}>
              <Info size={13} />
              <span>
                Demonstration dataset. Benchmark values, high/low ranges, and sparkline trajectories are illustrative and do not reflect real-time broker feeds.
              </span>
            </div>
          </div>
        </section>

        {/* ------------------------------------------------------------------ */}
        {/* 4. THE BIG IDEA                                                    */}
        {/* ------------------------------------------------------------------ */}
        <section style={styles.section}>
          <div style={styles.container}>
            <div style={styles.sectionHeader}>
              <div style={styles.sectionEyebrow}>FOUNDATIONAL THESIS</div>
              <h2 style={{ ...styles.sectionTitle, fontSize: "36px" }}>The market has a memory.</h2>
              <p style={{ ...styles.sectionDesc, fontSize: "16px", maxWidth: "780px" }}>
                Every financial platform tells you what a price is right now. But markets are living historical systems—anchored by past liquidity cycles, regulatory transitions, policy shocks, and corporate evolution. Sensex.money is designed to make Indian market history explainable, reproducible, and deeply practical.
              </p>
            </div>

            <div style={styles.conceptGrid}>
              <div style={styles.conceptCard}>
                <div style={{ ...styles.conceptEyebrow, color: "#e2b357" }}>
                  01 / HISTORY
                </div>
                <h3 style={styles.conceptQuestion}>What happened?</h3>
                <p style={styles.conceptText}>
                  A longitudinal record of Indian capital markets dating back to 1979. Track index valuation envelopes, multi-decade compounding trajectories, and the structural growth of India&apos;s publicly listed universe.
                </p>
              </div>

              <div style={styles.conceptCard}>
                <div style={{ ...styles.conceptEyebrow, color: "#38bdf8" }}>
                  02 / EVENTS
                </div>
                <h3 style={styles.conceptQuestion}>What changed?</h3>
                <p style={styles.conceptText}>
                  An unadulterated point-in-time record of corporate actions, stock splits, bonus issues, mergers, demergers, budget announcements, and regulatory shifts across the exchange landscape.
                </p>
              </div>

              <div style={styles.conceptCard}>
                <div style={{ ...styles.conceptEyebrow, color: "#10b981" }}>
                  03 / BEHAVIOUR
                </div>
                <h3 style={styles.conceptQuestion}>What happened next?</h3>
                <p style={styles.conceptText}>
                  Empirical forward return distributions, recovery speeds, and drawdown resilience metrics following historic shocks—grounded in real historical data rather than subjective speculation.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ------------------------------------------------------------------ */}
        {/* 5. FEATURED PRODUCTS                                               */}
        {/* ------------------------------------------------------------------ */}
        <section style={styles.section}>
          <div style={styles.container}>
            <div style={styles.sectionHeader}>
              <div style={styles.sectionEyebrow}>INTELLIGENCE PRODUCTS</div>
              <h2 style={styles.sectionTitle}>Built on 45 years of Indian market data</h2>
              <p style={styles.sectionDesc}>
                Six proprietary analytical modules engineered to interrogate historical market regimes, corporate actions, and drawdown dynamics.
              </p>
            </div>

            <div style={styles.productGrid}>
              {FEATURED_PRODUCTS.map((prod) => {
                const IconComponent = prod.icon;
                return (
                  <Link
                    key={prod.title}
                    to={prod.link}
                    style={styles.productCard}
                    className="product-card-hover"
                  >
                    <div>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "16px" }}>
                        <div style={{
                          width: "38px",
                          height: "38px",
                          borderRadius: "6px",
                          backgroundColor: "rgba(255, 255, 255, 0.04)",
                          border: "1px solid rgba(255, 255, 255, 0.08)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: prod.accent,
                        }}>
                          <IconComponent size={19} />
                        </div>
                        <span style={{
                          fontSize: "10px",
                          fontFamily: '"SF Mono", "JetBrains Mono", Menlo, monospace',
                          color: "#94a3b8",
                          letterSpacing: "0.08em",
                          backgroundColor: "rgba(255, 255, 255, 0.04)",
                          padding: "3px 7px",
                          borderRadius: "4px",
                          border: "1px solid rgba(255, 255, 255, 0.06)",
                        }}>
                          {prod.badge}
                        </span>
                      </div>

                      <h3 style={{ fontSize: "18px", fontWeight: 700, color: "#ffffff", letterSpacing: "-0.015em", marginBottom: "6px" }}>
                        {prod.title}
                      </h3>
                      <div style={{ fontSize: "13px", fontWeight: 500, color: "#38bdf8", marginBottom: "10px" }}>
                        {prod.tagline}
                      </div>
                      <p style={{ fontSize: "13px", color: "#94a3b8", lineHeight: 1.55 }}>
                        {prod.description}
                      </p>
                    </div>

                    <div style={{
                      marginTop: "20px",
                      paddingTop: "14px",
                      borderTop: "1px solid rgba(255, 255, 255, 0.06)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      fontSize: "12px",
                      fontWeight: 600,
                      color: "#f8fafc",
                    }}>
                      <span>Explore Module</span>
                      <ArrowRight size={14} style={{ color: prod.accent }} />
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>

        {/* ------------------------------------------------------------------ */}
        {/* 6. MARKET HISTORY TIMELINE                                         */}
        {/* ------------------------------------------------------------------ */}
        <section style={styles.section}>
          <div style={styles.container}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: "16px", marginBottom: "32px" }}>
              <div>
                <div style={styles.sectionEyebrow}>CHRONOLOGY OF INDIAN CAPITAL MARKETS</div>
                <h2 style={styles.sectionTitle}>Four decades of compounding, shocks & reform</h2>
                <p style={styles.sectionDesc}>
                  Key historical milestones in India&apos;s benchmark index evolution. Scroll horizontally to navigate through time.
                </p>
              </div>
              <div style={styles.illustrativeBadge}>
                <Calendar size={13} />
                <span>Informational Timeline</span>
              </div>
            </div>

            {/* Horizontal Timeline Rail */}
            <div style={styles.timelineScroll} className="custom-scroll">
              {HISTORICAL_TIMELINE.map((item, index) => (
                <div key={item.year} style={styles.timelineCard}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
                    <div style={{
                      fontSize: "22px",
                      fontWeight: 800,
                      fontFamily: '"SF Mono", "JetBrains Mono", Menlo, monospace',
                      color: item.color,
                      letterSpacing: "-0.03em",
                    }}>
                      {item.year}
                    </div>
                    <span style={{
                      fontSize: "10px",
                      fontFamily: '"SF Mono", "JetBrains Mono", Menlo, monospace',
                      color: "#64748b",
                      backgroundColor: "rgba(255, 255, 255, 0.04)",
                      padding: "2px 6px",
                      borderRadius: "4px",
                    }}>
                      ERA #{index + 1}
                    </span>
                  </div>

                  <div style={{ fontSize: "15px", fontWeight: 700, color: "#ffffff", marginBottom: "4px" }}>
                    {item.era}
                  </div>
                  <div style={{ fontSize: "12px", color: "#38bdf8", fontWeight: 500, marginBottom: "10px" }}>
                    {item.tagline}
                  </div>
                  <p style={{ fontSize: "12px", color: "#94a3b8", lineHeight: 1.5, marginBottom: "16px" }}>
                    {item.description}
                  </p>

                  <div style={{
                    padding: "6px 10px",
                    backgroundColor: "rgba(0, 0, 0, 0.3)",
                    borderRadius: "4px",
                    border: "1px solid rgba(255, 255, 255, 0.05)",
                    fontSize: "11px",
                    fontFamily: '"SF Mono", "JetBrains Mono", Menlo, monospace',
                    color: item.color,
                    fontWeight: 600,
                  }}>
                    {item.metric}
                  </div>
                </div>
              ))}
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "20px" }}>
              <div style={{ fontSize: "12px", color: "#64748b" }}>
                ← Drag or scroll horizontally to explore 1979 through modern era →
              </div>
              <Link to="/history/sensex" style={{ fontSize: "13px", color: "#38bdf8", textDecoration: "none", fontWeight: 500, display: "inline-flex", alignItems: "center", gap: "4px" }}>
                <span>View Comprehensive History Archive</span>
                <ChevronRight size={14} />
              </Link>
            </div>
          </div>
        </section>

        {/* ------------------------------------------------------------------ */}
        {/* 7. DATA PHILOSOPHY                                                 */}
        {/* ------------------------------------------------------------------ */}
        <section style={styles.section}>
          <div style={styles.container}>
            <div style={styles.sectionHeader}>
              <div style={styles.sectionEyebrow}>DATA PHILOSOPHY</div>
              <h2 style={styles.sectionTitle}>Built for people who ask better questions</h2>
              <p style={styles.sectionDesc}>
                Whether you run algorithmic strategies, allocate institutional capital, or research long-term market structure, clean historical data is your core edge.
              </p>
            </div>

            <div style={styles.philosophyGrid}>
              {/* Column 1: TRADERS */}
              <div style={styles.philosophyCol}>
                <div style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px",
                  fontSize: "12px",
                  fontWeight: 700,
                  letterSpacing: "0.1em",
                  color: "#38bdf8",
                  fontFamily: '"SF Mono", "JetBrains Mono", Menlo, monospace',
                  marginBottom: "14px",
                }}>
                  <BarChart3 size={15} />
                  <span>TRADERS</span>
                </div>
                <h3 style={{ fontSize: "18px", fontWeight: 700, color: "#ffffff", marginBottom: "12px" }}>
                  Understand behaviour, volatility, breadth and regimes.
                </h3>
                <p style={{ fontSize: "14px", color: "#94a3b8", lineHeight: 1.6, marginBottom: "18px" }}>
                  Evaluate multi-year volatility compressions, market breadth participation, advance-decline shifts, and extreme liquidity event distributions.
                </p>
                <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "8px", fontSize: "13px", color: "#cbd5e1" }}>
                  <li style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <CheckCircle2 size={14} style={{ color: "#38bdf8" }} />
                    <span>Regime classification & shift alerts</span>
                  </li>
                  <li style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <CheckCircle2 size={14} style={{ color: "#38bdf8" }} />
                    <span>Historical event distribution percentiles</span>
                  </li>
                  <li style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <CheckCircle2 size={14} style={{ color: "#38bdf8" }} />
                    <span>Index breadth and participation depth</span>
                  </li>
                </ul>
              </div>

              {/* Column 2: INVESTORS */}
              <div style={styles.philosophyCol}>
                <div style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px",
                  fontSize: "12px",
                  fontWeight: 700,
                  letterSpacing: "0.1em",
                  color: "#10b981",
                  fontFamily: '"SF Mono", "JetBrains Mono", Menlo, monospace',
                  marginBottom: "14px",
                }}>
                  <TrendingUp size={15} />
                  <span>INVESTORS</span>
                </div>
                <h3 style={{ fontSize: "18px", fontWeight: 700, color: "#ffffff", marginBottom: "12px" }}>
                  Study long-term returns, corporate actions and company history.
                </h3>
                <p style={{ fontSize: "14px", color: "#94a3b8", lineHeight: 1.6, marginBottom: "18px" }}>
                  Trace point-in-time dividend-adjusted compounding, bonus and split progressions, and how durable franchises survived historic drawdowns.
                </p>
                <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "8px", fontSize: "13px", color: "#cbd5e1" }}>
                  <li style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <CheckCircle2 size={14} style={{ color: "#10b981" }} />
                    <span>Dividend-adjusted Total Return (TRI)</span>
                  </li>
                  <li style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <CheckCircle2 size={14} style={{ color: "#10b981" }} />
                    <span>Complete corporate action audit trail</span>
                  </li>
                  <li style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <CheckCircle2 size={14} style={{ color: "#10b981" }} />
                    <span>Multi-decade drawdown & recovery metrics</span>
                  </li>
                </ul>
              </div>

              {/* Column 3: RESEARCHERS */}
              <div style={styles.philosophyCol}>
                <div style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px",
                  fontSize: "12px",
                  fontWeight: 700,
                  letterSpacing: "0.1em",
                  color: "#e2b357",
                  fontFamily: '"SF Mono", "JetBrains Mono", Menlo, monospace',
                  marginBottom: "14px",
                }}>
                  <FileSpreadsheet size={15} />
                  <span>RESEARCHERS</span>
                </div>
                <h3 style={{ fontSize: "18px", fontWeight: 700, color: "#ffffff", marginBottom: "12px" }}>
                  Work with reproducible historical market intelligence.
                </h3>
                <p style={{ fontSize: "14px", color: "#94a3b8", lineHeight: 1.6, marginBottom: "18px" }}>
                  Access point-in-time datasets and historical corporate action ledgers designed for rigorous empirical and academic research.
                </p>
                <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "8px", fontSize: "13px", color: "#cbd5e1" }}>
                  <li style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <CheckCircle2 size={14} style={{ color: "#e2b357" }} />
                    <span>Point-in-time financial archives</span>
                  </li>
                  <li style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <CheckCircle2 size={14} style={{ color: "#e2b357" }} />
                    <span>Survivorship-conscious historical universe</span>
                  </li>
                  <li style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <CheckCircle2 size={14} style={{ color: "#e2b357" }} />
                    <span>Standardized event schemas & API endpoints</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* ------------------------------------------------------------------ */}
        {/* 8. FINAL CTA                                                       */}
        {/* ------------------------------------------------------------------ */}
        <section style={{ ...styles.section, borderBottom: "none", padding: "64px 0" }}>
          <div style={styles.container}>
            <div style={styles.finalCtaCard}>
              <div style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                padding: "3px 10px",
                borderRadius: "4px",
                backgroundColor: "rgba(56, 189, 248, 0.1)",
                color: "#38bdf8",
                fontSize: "11px",
                fontFamily: '"SF Mono", "JetBrains Mono", Menlo, monospace',
                fontWeight: 600,
                letterSpacing: "0.1em",
                marginBottom: "18px",
              }}>
                HISTORICAL INFRASTRUCTURE
              </div>
              <h2 style={{
                fontSize: "clamp(24px, 3.5vw, 38px)",
                fontWeight: 800,
                letterSpacing: "-0.03em",
                color: "#ffffff",
                maxWidth: "760px",
                margin: "0 auto 16px",
                lineHeight: 1.2,
              }}>
                India&apos;s market history is too valuable to remain scattered.
              </h2>
              <p style={{
                fontSize: "15px",
                color: "#94a3b8",
                maxWidth: "640px",
                margin: "0 auto 28px",
                lineHeight: 1.6,
              }}>
                Sensex.money is building the infrastructure to make India&apos;s financial history searchable, explainable and useful.
              </p>
              <div style={{ display: "flex", justifyContent: "center", gap: "12px", flexWrap: "wrap" }}>
                <Link to="/history/sensex" style={styles.primaryBtn} className="primary-cta-btn">
                  <span>Explore Sensex.money</span>
                  <ArrowRight size={16} />
                </Link>
                <Link to="/crashes" style={styles.secondaryBtn} className="secondary-cta-btn">
                  <ShieldAlert size={16} style={{ color: "#f43f5e" }} />
                  <span>Browse Crash Atlas</span>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* -------------------------------------------------------------------- */}
      {/* 9. FOOTER                                                           */}
      {/* -------------------------------------------------------------------- */}
      <footer style={styles.footer}>
        <div style={styles.container}>
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "36px",
            marginBottom: "48px",
          }}>
            {/* Brand Column */}
            <div>
              <div style={{ fontSize: "18px", fontWeight: 700, color: "#ffffff", marginBottom: "6px" }}>
                Sensex<span style={{ color: "#38bdf8" }}>.</span>money
              </div>
              <div style={{ fontSize: "13px", color: "#64748b", marginBottom: "14px" }}>
                India&apos;s financial memory.
              </div>
              <p style={{ fontSize: "12px", color: "#475569", lineHeight: 1.5, maxWidth: "260px" }}>
                A historical market intelligence platform organizing 45+ years of Indian capital markets.
              </p>
            </div>

            {/* Quick Links Column */}
            <div>
              <div style={{ fontSize: "12px", fontWeight: 600, letterSpacing: "0.08em", color: "#94a3b8", textTransform: "uppercase", marginBottom: "14px", fontFamily: '"SF Mono", "JetBrains Mono", monospace' }}>
                Platform
              </div>
              <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "10px", fontSize: "13px" }}>
                <li><Link to="/market" style={styles.navLink}>Market</Link></li>
                <li><Link to="/stocks" style={styles.navLink}>Stocks</Link></li>
                <li><Link to="/history/sensex" style={styles.navLink}>History</Link></li>
                <li><Link to="/research" style={styles.navLink}>Research</Link></li>
              </ul>
            </div>

            {/* Tools Column */}
            <div>
              <div style={{ fontSize: "12px", fontWeight: 600, letterSpacing: "0.08em", color: "#94a3b8", textTransform: "uppercase", marginBottom: "14px", fontFamily: '"SF Mono", "JetBrains Mono", monospace' }}>
                Modules
              </div>
              <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "10px", fontSize: "13px" }}>
                <li><Link to="/time-machine" style={styles.navLink}>Time Machine</Link></li>
                <li><Link to="/tools/investment-simulator" style={styles.navLink}>Investment Simulator</Link></li>
                <li><Link to="/crashes" style={styles.navLink}>Crash Atlas</Link></li>
                <li><Link to="/corporate-actions" style={styles.navLink}>Corporate Actions</Link></li>
              </ul>
            </div>

            {/* Company & Legal Column */}
            <div>
              <div style={{ fontSize: "12px", fontWeight: 600, letterSpacing: "0.08em", color: "#94a3b8", textTransform: "uppercase", marginBottom: "14px", fontFamily: '"SF Mono", "JetBrains Mono", monospace' }}>
                Institutional
              </div>
              <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "10px", fontSize: "13px" }}>
                <li><Link to="/data" style={styles.navLink}>Data</Link></li>
                <li><Link to="/about" style={styles.navLink}>About</Link></li>
                <li><Link to="/search" style={styles.navLink}>Search Registry</Link></li>
                <li><Link to="/ask" style={styles.navLink}>Ask Sensex.money</Link></li>
              </ul>
            </div>
          </div>

          {/* Bottom Disclaimer */}
          <div style={{
            borderTop: "1px solid rgba(255, 255, 255, 0.07)",
            paddingTop: "24px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "16px",
            fontSize: "12px",
            color: "#64748b",
          }}>
            <p style={{ margin: 0, maxWidth: "780px", lineHeight: 1.6 }}>
              <strong>Disclaimer:</strong> Market information shown on this website may be illustrative or delayed. Sensex.money is not investment advice.
            </p>
            <div style={{ fontFamily: '"SF Mono", "JetBrains Mono", monospace', fontSize: "11px", color: "#475569" }}>
              © 2026 Sensex.money
            </div>
          </div>
        </div>
      </footer>

      {/* Embedded CSS for hover transitions & media queries */}
      <style>{`
        .primary-cta-btn {
          background-color: #ffffff !important;
          color: #070b14 !important;
          font-weight: 600 !important;
          border: 1px solid #ffffff !important;
          box-shadow: 0 1px 4px rgba(0, 0, 0, 0.35);
          transition: all 0.15s ease !important;
        }
        .primary-cta-btn:hover {
          background-color: #e2e8f0 !important;
          border-color: #e2e8f0 !important;
          color: #020617 !important;
          transform: translateY(-1px);
        }
        .primary-cta-btn svg {
          color: #070b14 !important;
          stroke: #070b14 !important;
        }
        .secondary-cta-btn {
          background-color: rgba(255, 255, 255, 0.05) !important;
          border: 1px solid rgba(255, 255, 255, 0.18) !important;
          color: #f8fafc !important;
          font-weight: 500 !important;
          transition: all 0.15s ease !important;
        }
        .secondary-cta-btn:hover {
          background-color: rgba(255, 255, 255, 0.1) !important;
          border-color: rgba(255, 255, 255, 0.32) !important;
          color: #ffffff !important;
          transform: translateY(-1px);
        }
        .product-card-hover:hover {
          border-color: rgba(56, 189, 248, 0.4) !important;
          background-color: #0e182c !important;
          transform: translateY(-2px);
        }
        .custom-scroll::-webkit-scrollbar {
          height: 6px;
        }
        .custom-scroll::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.03);
          border-radius: 3px;
        }
        .custom-scroll::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.15);
          border-radius: 3px;
        }
        .custom-scroll::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.3);
        }
        @media (max-width: 860px) {
          .desktop-nav {
            display: none !important;
          }
          .mobile-toggle-btn {
            display: block !important;
          }
          .search-label {
            display: none;
          }
        }
      `}</style>
    </div>
  );
};
// ============================================================================
// SHARED LAYOUT COMPONENTS (HEADER, FOOTER, STYLES)
// ============================================================================
const sharedStyles = {
  root: {
    minHeight: "100vh",
    backgroundColor: "#070b14",
    color: "#f8fafc",
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    lineHeight: 1.5,
    WebkitFontSmoothing: "antialiased",
    MozOsxFontSmoothing: "grayscale",
    overflowX: "hidden" as const,
  },
  container: {
    maxWidth: "1240px",
    margin: "0 auto",
    padding: "0 24px",
  },
  header: {
    borderBottom: "1px solid rgba(255, 255, 255, 0.07)",
    backgroundColor: "rgba(7, 11, 20, 0.95)",
    backdropFilter: "blur(12px)",
    position: "sticky" as const,
    top: 0,
    zIndex: 50,
  },
  headerInner: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    height: "64px",
  },
  logoGroup: {
    display: "flex",
    alignItems: "baseline",
    gap: "10px",
    textDecoration: "none",
  },
  logoText: {
    fontSize: "19px",
    fontWeight: 700,
    letterSpacing: "-0.03em",
    color: "#ffffff",
  },
  logoDot: {
    color: "#38bdf8",
  },
  logoTag: {
    fontSize: "11px",
    fontWeight: 500,
    letterSpacing: "0.06em",
    textTransform: "uppercase" as const,
    color: "#64748b",
    fontFamily: '"SF Mono", "JetBrains Mono", Menlo, Consolas, monospace',
  },
  nav: {
    display: "flex",
    alignItems: "center",
    gap: "28px",
  },
  navLink: {
    color: "#94a3b8",
    textDecoration: "none",
    fontSize: "14px",
    fontWeight: 500,
    transition: "color 0.15s ease",
  },
  headerActions: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },
  searchBtn: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    padding: "6px 12px",
    borderRadius: "6px",
    border: "1px solid rgba(255, 255, 255, 0.12)",
    backgroundColor: "rgba(255, 255, 255, 0.04)",
    color: "#94a3b8",
    fontSize: "13px",
    textDecoration: "none",
    transition: "all 0.15s ease",
  },
  kbd: {
    padding: "2px 5px",
    fontSize: "10px",
    fontFamily: '"SF Mono", "JetBrains Mono", Menlo, monospace',
    backgroundColor: "rgba(255, 255, 255, 0.08)",
    border: "1px solid rgba(255, 255, 255, 0.14)",
    borderRadius: "4px",
    color: "#94a3b8",
  },
  askBtn: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    padding: "7px 14px",
    borderRadius: "6px",
    backgroundColor: "rgba(56, 189, 248, 0.12)",
    border: "1px solid rgba(56, 189, 248, 0.3)",
    color: "#38bdf8",
    fontSize: "13px",
    fontWeight: 500,
    textDecoration: "none",
    transition: "all 0.15s ease",
  },
  footer: {
    backgroundColor: "#05080f",
    borderTop: "1px solid rgba(255, 255, 255, 0.07)",
    padding: "60px 0 40px",
  },
};

export const GlobalHeader: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const isCurrent = (path: string) => {
    if (path === "/history") {
      return location.pathname === "/history" || location.pathname.startsWith("/history/");
    }
    return location.pathname === path || (path !== "/" && location.pathname.startsWith(path));
  };

  return (
    <header style={sharedStyles.header}>
      <div style={sharedStyles.container}>
        <div style={sharedStyles.headerInner}>
          <Link to="/" style={sharedStyles.logoGroup}>
            <span style={sharedStyles.logoText}>
              Sensex<span style={sharedStyles.logoDot}>.</span>money
            </span>
            <span style={sharedStyles.logoTag}>Financial Memory</span>
          </Link>

          <nav style={sharedStyles.nav} className="desktop-nav">
            <Link to="/market" style={{ ...sharedStyles.navLink, color: isCurrent("/market") ? "#ffffff" : "#94a3b8", fontWeight: isCurrent("/market") ? 600 : 500 }}>Market</Link>
            <Link to="/stocks" style={{ ...sharedStyles.navLink, color: isCurrent("/stocks") ? "#ffffff" : "#94a3b8", fontWeight: isCurrent("/stocks") ? 600 : 500 }}>Stocks</Link>
            <Link to="/history" style={{ ...sharedStyles.navLink, color: isCurrent("/history") ? "#ffffff" : "#94a3b8", fontWeight: isCurrent("/history") ? 600 : 500 }}>History</Link>
            <Link to="/research" style={{ ...sharedStyles.navLink, color: isCurrent("/research") ? "#ffffff" : "#94a3b8", fontWeight: isCurrent("/research") ? 600 : 500 }}>Research</Link>
            <Link to="/tools" style={{ ...sharedStyles.navLink, color: isCurrent("/tools") ? "#ffffff" : "#94a3b8", fontWeight: isCurrent("/tools") ? 600 : 500 }}>Tools</Link>
          </nav>

          <div style={sharedStyles.headerActions}>
            <Link to="/search" style={sharedStyles.searchBtn} title="Search markets and records">
              <Search size={14} />
              <span className="search-label">Search</span>
              <span style={sharedStyles.kbd}>⌘K</span>
            </Link>
            <Link to="/ask" style={sharedStyles.askBtn}>
              <Sparkles size={14} />
              <span>Ask Sensex.money</span>
            </Link>
            <button
              type="button"
              className="mobile-toggle-btn"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle Navigation"
              style={{
                background: "transparent",
                border: "none",
                color: "#f8fafc",
                cursor: "pointer",
                display: "none",
                padding: "6px",
              }}
            >
              {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div
            style={{
              borderTop: "1px solid rgba(255, 255, 255, 0.08)",
              padding: "18px 0",
              display: "flex",
              flexDirection: "column",
              gap: "14px",
            }}
          >
            <Link to="/market" style={sharedStyles.navLink} onClick={() => setMobileMenuOpen(false)}>Market</Link>
            <Link to="/stocks" style={sharedStyles.navLink} onClick={() => setMobileMenuOpen(false)}>Stocks</Link>
            <Link to="/history" style={sharedStyles.navLink} onClick={() => setMobileMenuOpen(false)}>History</Link>
            <Link to="/research" style={sharedStyles.navLink} onClick={() => setMobileMenuOpen(false)}>Research</Link>
            <Link to="/tools" style={sharedStyles.navLink} onClick={() => setMobileMenuOpen(false)}>Tools</Link>
            <Link to="/tools/time-machine" style={sharedStyles.navLink} onClick={() => setMobileMenuOpen(false)}>Time Machine</Link>
            <Link to="/tools/crash-atlas" style={sharedStyles.navLink} onClick={() => setMobileMenuOpen(false)}>Crash Atlas</Link>
            <Link to="/tools/corporate-actions" style={sharedStyles.navLink} onClick={() => setMobileMenuOpen(false)}>Corporate Actions</Link>
          </div>
        )}
      </div>
    </header>
  );
};

export const GlobalFooter: React.FC = () => {
  return (
    <footer style={sharedStyles.footer}>
      <div style={sharedStyles.container}>
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "36px",
          marginBottom: "48px",
        }}>
          <div>
            <div style={{ fontSize: "18px", fontWeight: 700, color: "#ffffff", marginBottom: "6px" }}>
              Sensex<span style={{ color: "#38bdf8" }}>.</span>money
            </div>
            <div style={{ fontSize: "13px", color: "#64748b", marginBottom: "14px" }}>
              India&apos;s financial memory.
            </div>
            <p style={{ fontSize: "12px", color: "#475569", lineHeight: 1.5, maxWidth: "260px" }}>
              A historical market intelligence platform organizing 45+ years of Indian capital markets.
            </p>
          </div>

          <div>
            <div style={{ fontSize: "12px", fontWeight: 600, letterSpacing: "0.08em", color: "#94a3b8", textTransform: "uppercase", marginBottom: "14px", fontFamily: '"SF Mono", "JetBrains Mono", monospace' }}>
              Platform
            </div>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "10px", fontSize: "13px" }}>
              <li><Link to="/market" style={sharedStyles.navLink}>Market</Link></li>
              <li><Link to="/stocks" style={sharedStyles.navLink}>Stocks</Link></li>
              <li><Link to="/history" style={sharedStyles.navLink}>History</Link></li>
              <li><Link to="/research" style={sharedStyles.navLink}>Research</Link></li>
            </ul>
          </div>

          <div>
            <div style={{ fontSize: "12px", fontWeight: 600, letterSpacing: "0.08em", color: "#94a3b8", textTransform: "uppercase", marginBottom: "14px", fontFamily: '"SF Mono", "JetBrains Mono", monospace' }}>
              Modules
            </div>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "10px", fontSize: "13px" }}>
              <li><Link to="/tools/time-machine" style={sharedStyles.navLink}>Time Machine</Link></li>
              <li><Link to="/tools/investment-simulator" style={sharedStyles.navLink}>Investment Simulator</Link></li>
              <li><Link to="/tools/crash-atlas" style={sharedStyles.navLink}>Crash Atlas</Link></li>
              <li><Link to="/tools/corporate-actions" style={sharedStyles.navLink}>Corporate Actions</Link></li>
            </ul>
          </div>

          <div>
            <div style={{ fontSize: "12px", fontWeight: 600, letterSpacing: "0.08em", color: "#94a3b8", textTransform: "uppercase", marginBottom: "14px", fontFamily: '"SF Mono", "JetBrains Mono", monospace' }}>
              Institutional
            </div>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "10px", fontSize: "13px" }}>
              <li><Link to="/data" style={sharedStyles.navLink}>Data</Link></li>
              <li><Link to="/about" style={sharedStyles.navLink}>About</Link></li>
              <li><Link to="/search" style={sharedStyles.navLink}>Search Registry</Link></li>
              <li><Link to="/ask" style={sharedStyles.navLink}>Ask Sensex.money</Link></li>
            </ul>
          </div>
        </div>

        <div style={{
          borderTop: "1px solid rgba(255, 255, 255, 0.07)",
          paddingTop: "24px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "16px",
          fontSize: "12px",
          color: "#64748b",
        }}>
          <p style={{ margin: 0, maxWidth: "780px", lineHeight: 1.6 }}>
            <strong>Disclaimer:</strong> Market information shown on this website may be illustrative or delayed. Sensex.money is not investment advice.
          </p>
          <div style={{ fontFamily: '"SF Mono", "JetBrains Mono", monospace', fontSize: "11px", color: "#475569" }}>
            © 2026 Sensex.money
          </div>
        </div>
      </div>
    </footer>
  );
};

// ============================================================================
// TYPES & DATA STRUCTURES FOR /market
// ============================================================================
export interface MarketIndex {
  symbol: string;
  name: string;
  value: string;
  change: string;
  pctChange: string;
  isPositive: boolean;
  rangeLow: string;
  rangeHigh: string;
  historicalContext: string;
  sparkline: string;
}

export interface MarketHealthDimension {
  name: string;
  score: number; // 0-100
  status: "Strong" | "Moderate" | "Stretched" | "Neutral" | "Robust";
  detail: string;
}

export interface MarketBreadthData {
  advancing: number;
  declining: number;
  unchanged: number;
  total: number;
  above20DMA: number; // percentage
  above50DMA: number;
  above200DMA: number;
  interpretation: string;
}

export interface SectorPerformance {
  sector: string;
  category: "LEADERS" | "IMPROVING" | "WEAKENING" | "LAGGARDS";
  d1: string;
  w1: string;
  m1: string;
  m3: string;
  d1Val: number;
  w1Val: number;
  m1Val: number;
  m3Val: number;
}

export interface VolatilityMetrics {
  realizedVol: string;
  percentile: string;
  indiaVix: string;
  d20Vol: string;
  d60Vol: string;
  regime: "LOW" | "NORMAL" | "ELEVATED" | "STRESSED";
  explanation: string;
}

export interface InstitutionalFlow {
  period: string;
  fiiNet: string;
  fiiVal: number;
  diiNet: string;
  diiVal: number;
  netFlow: string;
  netVal: number;
}

export interface MarketRegimeData {
  regime: string;
  trend: "Bullish (Above 50 & 200 DMA)" | "Neutral" | "Bearish";
  volatility: "Low (12.4 India VIX)" | "Moderate" | "High";
  breadth: "Broad Expansion (68% > 50DMA)" | "Narrow" | "Divergent";
  liquidity: "Healthy Domestic Inflows" | "Tight" | "Constrained";
  correlation: "Normal Sector Dispersion" | "High" | "Extreme";
  historicalAnalog: string;
}

export interface HistoricalComparison {
  question: string;
  sampleSize: string;
  d30Forward: { median: string; winRate: string; positive: boolean };
  d90Forward: { median: string; winRate: string; positive: boolean };
  d180Forward: { median: string; winRate: string; positive: boolean };
  takeaway: string;
}

export interface MarketMover {
  symbol: string;
  name: string;
  price: string;
  change: string;
  pctChange: string;
  volume: string;
  context: string;
  isPositive: boolean;
}

// ============================================================================
// DEMO DATASET FOR /market (REUSABLE DATA MODEL FOR FUTURE BACKEND SWAP)
// ============================================================================
export const demoMarketData = {
  indices: [
    {
      symbol: "SENSEX",
      name: "BSE 30 Benchmark",
      value: "81,420.50",
      change: "+480.20",
      pctChange: "+0.59%",
      isPositive: true,
      rangeLow: "80,950.10",
      rangeHigh: "81,640.80",
      historicalContext: "Near 88th percentile of 1Y range",
      sparkline: "0,22 10,20 20,24 30,17 40,19 50,14 60,16 70,9 80,11 90,4 100,6",
    },
    {
      symbol: "NIFTY 50",
      name: "NSE 50 Benchmark",
      value: "24,835.10",
      change: "+142.30",
      pctChange: "+0.58%",
      isPositive: true,
      rangeLow: "24,680.00",
      rangeHigh: "24,890.40",
      historicalContext: "Consolidating 1.4% below all-time peak",
      sparkline: "0,24 10,21 20,22 30,18 40,15 50,18 60,12 70,14 80,8 90,9 100,5",
    },
    {
      symbol: "BANK NIFTY",
      name: "12 Banking Leaders",
      value: "51,210.80",
      change: "-95.40",
      pctChange: "-0.19%",
      isPositive: false,
      rangeLow: "51,020.10",
      rangeHigh: "51,480.50",
      historicalContext: "Trading at 14.8x trailing price-to-earnings",
      sparkline: "0,6 10,8 20,5 30,11 40,9 50,16 60,14 70,20 80,19 90,24 100,22",
    },
    {
      symbol: "NIFTY MIDCAP 100",
      name: "Mid-Sized Growth Leaders",
      value: "58,410.20",
      change: "+524.60",
      pctChange: "+0.91%",
      isPositive: true,
      rangeLow: "57,980.00",
      rangeHigh: "58,550.00",
      historicalContext: "Breadth expansion across capital goods & pharma",
      sparkline: "0,26 10,24 20,20 30,19 40,14 50,15 60,10 70,8 80,6 90,4 100,2",
    },
  ] as MarketIndex[],

  health: {
    overallScore: 74,
    rating: "CONSTRUCTIVE REGIME",
    dimensions: [
      { name: "Trend & Moving Averages", score: 82, status: "Strong", detail: "Index above 20, 50 & 200-day simple moving averages" },
      { name: "Market Breadth", score: 68, status: "Moderate", detail: "68% of NSE 500 constituents trade above their 50 DMA" },
      { name: "Volatility Environment", score: 85, status: "Robust", detail: "India VIX at 12.4 vs 10-year median of 15.6" },
      { name: "Sector Participation", score: 71, status: "Moderate", detail: "7 out of 9 primary sectors contributing positively" },
      { name: "Domestic Liquidity", score: 88, status: "Strong", detail: "Persistent domestic mutual fund SIP run-rate" },
    ] as MarketHealthDimension[],
  },

  breadth: {
    advancing: 1420,
    declining: 840,
    unchanged: 98,
    total: 2358,
    above20DMA: 64.2,
    above50DMA: 68.5,
    above200DMA: 74.8,
    interpretation: "Index performance is supported by broad participation across mid and large-cap segments rather than concentrated index-heavyweight leadership. The advance-decline ratio of 1.69 indicates constructive accumulation.",
  } as MarketBreadthData,

  sectors: [
    { sector: "IT", category: "LEADERS", d1: "+1.84%", w1: "+3.42%", m1: "+7.15%", m3: "+14.20%", d1Val: 1.84, w1Val: 3.42, m1Val: 7.15, m3Val: 14.2 },
    { sector: "Pharma", category: "LEADERS", d1: "+1.21%", w1: "+2.10%", m1: "+5.40%", m3: "+11.80%", d1Val: 1.21, w1Val: 2.1, m1Val: 5.4, m3Val: 11.8 },
    { sector: "Auto", category: "IMPROVING", d1: "+0.85%", w1: "+1.40%", m1: "+2.90%", m3: "+8.40%", d1Val: 0.85, w1Val: 1.4, m1Val: 2.9, m3Val: 8.4 },
    { sector: "Metals", category: "IMPROVING", d1: "+0.64%", w1: "+0.95%", m1: "+3.10%", m3: "+5.60%", d1Val: 0.64, w1Val: 0.95, m1Val: 3.1, m3Val: 5.6 },
    { sector: "Financial Services", category: "IMPROVING", d1: "+0.32%", w1: "+0.70%", m1: "+1.80%", m3: "+4.20%", d1Val: 0.32, w1Val: 0.7, m1Val: 1.8, m3Val: 4.2 },
    { sector: "Banks", category: "WEAKENING", d1: "-0.19%", w1: "-0.45%", m1: "+0.60%", m3: "+3.10%", d1Val: -0.19, w1Val: -0.45, m1Val: 0.6, m3Val: 3.1 },
    { sector: "Energy", category: "WEAKENING", d1: "-0.42%", w1: "-1.10%", m1: "-0.85%", m3: "+1.90%", d1Val: -0.42, w1Val: -1.1, m1Val: -0.85, m3Val: 1.9 },
    { sector: "FMCG", category: "WEAKENING", d1: "-0.31%", w1: "-0.80%", m1: "-1.20%", m3: "+0.45%", d1Val: -0.31, w1Val: -0.8, m1Val: -1.2, m3Val: 0.45 },
    { sector: "Realty", category: "LAGGARDS", d1: "-1.15%", w1: "-2.80%", m1: "-4.10%", m3: "-2.40%", d1Val: -1.15, w1Val: -2.8, m1Val: -4.1, m3Val: -2.4 },
  ] as SectorPerformance[],

  volatility: {
    realizedVol: "11.2%",
    percentile: "18th %ile",
    indiaVix: "12.42",
    d20Vol: "10.8%",
    d60Vol: "13.1%",
    regime: "LOW",
    explanation: "Realized volatility is tracking in the bottom quartile of its 5-year distribution. Sub-13 VIX readings historically correspond with orderly trend continuation, though low-volatility regimes can precede sudden macro-driven mean reversions.",
  } as VolatilityMetrics,

  flows: [
    { period: "Today (Prov)", fiiNet: "-₹420 Cr", fiiVal: -420, diiNet: "+₹1,680 Cr", diiVal: 1680, netFlow: "+₹1,260 Cr", netVal: 1260 },
    { period: "Past 5 Days", fiiNet: "-₹2,840 Cr", fiiVal: -2840, diiNet: "+₹8,920 Cr", diiVal: 8920, netFlow: "+₹6,080 Cr", netVal: 6080 },
    { period: "Past 1 Month", fiiNet: "+₹4,120 Cr", fiiVal: 4120, diiNet: "+₹28,400 Cr", diiVal: 28400, netFlow: "+₹32,520 Cr", netVal: 32520 },
  ] as InstitutionalFlow[],

  regime: {
    regime: "TRENDING / LOW VOLATILITY",
    trend: "Bullish (Above 50 & 200 DMA)",
    volatility: "Low (12.4 India VIX)",
    breadth: "Broad Expansion (68% > 50DMA)",
    liquidity: "Healthy Domestic Inflows",
    correlation: "Normal Sector Dispersion",
    historicalAnalog: "Resembles early 2017 & mid-2021 compounding regimes where domestic flows absorbed foreign institutional selling without index breakdown.",
  } as MarketRegimeData,

  historicalComparisons: [
    {
      question: "How unusual is today's move? (+0.58% Nifty)",
      sampleSize: "N=1,420 trading days",
      d30Forward: { median: "+1.2%", winRate: "63%", positive: true },
      d90Forward: { median: "+3.8%", winRate: "68%", positive: true },
      d180Forward: { median: "+7.4%", winRate: "72%", positive: true },
      takeaway: "Daily gains between +0.4% and +0.8% represent typical positive market days occurring in approximately 18% of all historical sessions.",
    },
    {
      question: "What happened after similar breadth (>65% > 50 DMA)?",
      sampleSize: "N=840 episodes",
      d30Forward: { median: "+1.8%", winRate: "66%", positive: true },
      d90Forward: { median: "+4.6%", winRate: "71%", positive: true },
      d180Forward: { median: "+8.9%", winRate: "76%", positive: true },
      takeaway: "Broad participation above intermediate moving averages historically reduces the probability of sharp immediate drawdowns.",
    },
    {
      question: "What happened after low volatility regimes (VIX < 13)?",
      sampleSize: "N=620 sessions",
      d30Forward: { median: "+0.9%", winRate: "61%", positive: true },
      d90Forward: { median: "+3.1%", winRate: "65%", positive: true },
      d180Forward: { median: "+6.8%", winRate: "70%", positive: true },
      takeaway: "Extended low-VIX periods generally accompany steady index appreciation, though forward tail-risk volatility increases after 45+ days.",
    },
  ] as HistoricalComparison[],

  movers: {
    gainers: [
      { symbol: "INFY", name: "Infosys Ltd", price: "₹1,842.50", change: "+48.20", pctChange: "+2.69%", volume: "1.4x Avg", context: "IT sector breadth leader", isPositive: true },
      { symbol: "SUNPHARMA", name: "Sun Pharma", price: "₹1,720.00", change: "+34.50", pctChange: "+2.05%", volume: "1.2x Avg", context: "Healthcare rotation", isPositive: true },
      { symbol: "TATAMOTORS", name: "Tata Motors", price: "₹1,085.40", change: "+18.60", pctChange: "+1.74%", volume: "0.9x Avg", context: "Auto demand volume", isPositive: true },
    ],
    losers: [
      { symbol: "DLF", name: "DLF Limited", price: "₹824.10", change: "-16.40", pctChange: "-1.95%", volume: "1.1x Avg", context: "Realty profit taking", isPositive: false },
      { symbol: "ONGC", name: "ONGC Ltd", price: "₹312.40", change: "-4.80", pctChange: "-1.51%", volume: "0.8x Avg", context: "Crude oil sensitivity", isPositive: false },
      { symbol: "KOTAKBANK", name: "Kotak Mahindra Bank", price: "₹1,780.00", change: "-18.20", pctChange: "-1.01%", volume: "1.0x Avg", context: "Private bank drag", isPositive: false },
    ],
  },

  historicalQuestions: [
    "How often does the Sensex fall more than 2% in a single day?",
    "What historically happens after three consecutive down days?",
    "Which sectors lead after major market drawdowns?",
    "How long does recovery typically take after a 20% index decline?",
    "What is the average forward return when 80%+ stocks trade above 200 DMA?",
    "How did banking multiples re-rate across previous rate-cut cycles?",
  ],
};

// ============================================================================
// MARKET PAGE COMPONENT (/market)
// ============================================================================
interface LatestPriceRow {
  close: string | number;
  trade_date: string;
  ticker: string;
}

export const Market: React.FC = () => {
  const data = demoMarketData;

  const [latestPrice, setLatestPrice] = useState<LatestPriceRow | null>(null);
  const [latestPriceLoading, setLatestPriceLoading] = useState(true);
  const [latestPriceError, setLatestPriceError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const fetchLatestPrice = async () => {
      setLatestPriceLoading(true);
      setLatestPriceError(null);
      try {
        const { data: priceRows, error: priceError } = await supabase
          .from("prices")
          .select("instrument_id, trade_date, close")
          .order("trade_date", { ascending: false })
          .limit(1);

        if (priceError) throw priceError;
        if (cancelled) return;

        const priceRow = priceRows?.[0] as
          | { instrument_id: string; trade_date: string; close: string | number }
          | undefined;

        if (!priceRow) {
          setLatestPrice(null);
          return;
        }

        const { data: instrumentRows, error: instrumentError } = await supabase
          .from("instruments")
          .select("ticker")
          .eq("instrument_id", priceRow.instrument_id)
          .limit(1);

        if (instrumentError) throw instrumentError;
        if (cancelled) return;

        const instrumentRow = instrumentRows?.[0] as { ticker: string } | undefined;

        setLatestPrice({
          close: priceRow.close,
          trade_date: priceRow.trade_date,
          ticker: instrumentRow?.ticker ?? "UNKNOWN",
        });
      } catch (err) {
        if (!cancelled) {
          const message = err && typeof err === "object" && "message" in err
            ? String((err as { message: unknown }).message)
            : "Failed to load database price.";
          setLatestPriceError(message);
        }
      } finally {
        if (!cancelled) setLatestPriceLoading(false);
      }
    };

    fetchLatestPrice();
    return () => { cancelled = true; };
  }, []);

  return (
    <div style={sharedStyles.root}>
      <GlobalHeader />

      <main>
        {/* ------------------------------------------------------------------ */}
        {/* 1. MARKET PAGE HEADER                                              */}
        {/* ------------------------------------------------------------------ */}
        <section style={{ padding: "40px 0 24px", borderBottom: "1px solid rgba(255, 255, 255, 0.06)" }}>
          <div style={sharedStyles.container}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "16px", marginBottom: "16px" }}>
              <div>
                <div style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  padding: "3px 8px",
                  borderRadius: "4px",
                  backgroundColor: "rgba(56, 189, 248, 0.08)",
                  border: "1px solid rgba(56, 189, 248, 0.22)",
                  color: "#38bdf8",
                  fontSize: "11px",
                  fontWeight: 600,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  fontFamily: '"SF Mono", "JetBrains Mono", Menlo, monospace',
                  marginBottom: "10px",
                }}>
                  <BarChart3 size={13} />
                  <span>MARKET INTELLIGENCE</span>
                </div>
                <h1 style={{ fontSize: "clamp(26px, 3.8vw, 42px)", fontWeight: 800, letterSpacing: "-0.03em", color: "#ffffff", margin: "0 0 10px 0", lineHeight: 1.2 }}>
                  See the market as a system, not a single number.
                </h1>
                <p style={{ fontSize: "15px", color: "#94a3b8", maxWidth: "760px", margin: 0, lineHeight: 1.55 }}>
                  Track benchmarks, breadth, sectors, volatility, flows and market regimes — with historical context built in.
                </p>
              </div>

              <div style={{
                backgroundColor: "rgba(245, 158, 11, 0.08)",
                border: "1px solid rgba(245, 158, 11, 0.25)",
                padding: "10px 14px",
                borderRadius: "6px",
                maxWidth: "320px",
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "#f59e0b", fontSize: "11px", fontWeight: 700, fontFamily: '"SF Mono", "JetBrains Mono", monospace', letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "4px" }}>
                  <Info size={13} />
                  <span>ILLUSTRATIVE DATA</span>
                </div>
                <div style={{ fontSize: "11px", color: "#94a3b8", lineHeight: 1.4 }}>
                  Market values shown are demonstration data and do not represent live broker feeds.
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ------------------------------------------------------------------ */}
        {/* 1.5 VERIFIED DATABASE DATA                                         */}
        {/* ------------------------------------------------------------------ */}
        <section style={{ padding: "24px 0", borderBottom: "1px solid rgba(255, 255, 255, 0.05)" }}>
          <div style={sharedStyles.container}>
            <div style={{
              backgroundColor: "#0d1527",
              border: "1px solid rgba(16, 185, 129, 0.28)",
              borderRadius: "8px",
              padding: "20px",
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "#10b981", fontSize: "11px", fontWeight: 700, fontFamily: '"SF Mono", "JetBrains Mono", monospace', letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "10px" }}>
                <CheckCircle2 size={13} />
                <span>VERIFIED DATABASE DATA</span>
              </div>

              {latestPriceLoading && (
                <div style={{ fontSize: "13px", color: "#94a3b8" }}>Loading latest price from database…</div>
              )}

              {!latestPriceLoading && latestPriceError && (
                <div style={{ fontSize: "13px", color: "#f87171" }}>
                  Unable to load database price: {latestPriceError}
                </div>
              )}

              {!latestPriceLoading && !latestPriceError && !latestPrice && (
                <div style={{ fontSize: "13px", color: "#94a3b8" }}>No price rows found in the database yet.</div>
              )}

              {!latestPriceLoading && !latestPriceError && latestPrice && (
                <div style={{ display: "flex", alignItems: "baseline", gap: "16px", flexWrap: "wrap" }}>
                  <div>
                    <div style={{ fontSize: "16px", fontWeight: 700, color: "#ffffff" }}>{latestPrice.ticker}</div>
                  </div>
                  <div style={{ fontSize: "24px", fontWeight: 800, color: "#10b981", fontFamily: '"SF Mono", "JetBrains Mono", monospace' }}>
                    {latestPrice.close}
                  </div>
                  <div style={{ fontSize: "12px", color: "#64748b" }}>
                    as of {latestPrice.trade_date}
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* ------------------------------------------------------------------ */}
        {/* 2. MARKET SNAPSHOT                                                 */}
        {/* ------------------------------------------------------------------ */}
        <section style={{ padding: "40px 0", borderBottom: "1px solid rgba(255, 255, 255, 0.05)" }}>
          <div style={sharedStyles.container}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "20px" }}>
              <div>
                <h2 style={{ fontSize: "20px", fontWeight: 700, color: "#ffffff", letterSpacing: "-0.02em", margin: "0 0 4px 0" }}>
                  Benchmark Dashboards
                </h2>
                <span style={{ fontSize: "13px", color: "#64748b" }}>
                  Core Indian indices with historical positioning context
                </span>
              </div>
              <span style={{ fontSize: "11px", fontFamily: '"SF Mono", "JetBrains Mono", monospace', color: "#64748b" }}>
                DEMO SNAPSHOT
              </span>
            </div>

            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(270px, 1fr))",
              gap: "16px",
            }}>
              {data.indices.map((idx) => (
                <div
                  key={idx.symbol}
                  style={{
                    backgroundColor: "#0d1527",
                    border: "1px solid rgba(255, 255, 255, 0.08)",
                    borderRadius: "8px",
                    padding: "20px",
                    position: "relative",
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "12px" }}>
                    <div>
                      <div style={{ fontSize: "16px", fontWeight: 700, color: "#ffffff" }}>{idx.symbol}</div>
                      <div style={{ fontSize: "11px", color: "#64748b" }}>{idx.name}</div>
                    </div>
                    <div style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "4px",
                      padding: "2px 7px",
                      borderRadius: "4px",
                      fontSize: "12px",
                      fontWeight: 600,
                      fontFamily: '"SF Mono", "JetBrains Mono", monospace',
                      backgroundColor: idx.isPositive ? "rgba(16, 185, 129, 0.12)" : "rgba(244, 63, 94, 0.12)",
                      color: idx.isPositive ? "#10b981" : "#f43f5e",
                      border: `1px solid ${idx.isPositive ? "rgba(16, 185, 129, 0.25)" : "rgba(244, 63, 94, 0.25)"}`,
                    }}>
                      {idx.isPositive ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                      <span>{idx.pctChange}</span>
                    </div>
                  </div>

                  <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: "14px" }}>
                    <div style={{ fontSize: "24px", fontWeight: 700, letterSpacing: "-0.03em", fontFamily: '"SF Mono", "JetBrains Mono", monospace' }}>
                      {idx.value}
                    </div>
                    <div style={{ fontSize: "12px", color: idx.isPositive ? "#10b981" : "#f43f5e", fontFamily: '"SF Mono", "JetBrains Mono", monospace' }}>
                      {idx.change}
                    </div>
                  </div>

                  {/* Sparkline & Range Box */}
                  <div style={{
                    padding: "10px 12px",
                    backgroundColor: "rgba(0, 0, 0, 0.3)",
                    borderRadius: "6px",
                    border: "1px solid rgba(255, 255, 255, 0.05)",
                    marginBottom: "12px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}>
                    <div style={{ fontSize: "10px", color: "#64748b", fontFamily: '"SF Mono", "JetBrains Mono", monospace' }}>
                      <div>L: {idx.rangeLow}</div>
                      <div>H: {idx.rangeHigh}</div>
                    </div>
                    <div style={{ width: "80px", height: "26px" }}>
                      <svg viewBox="0 0 100 30" style={{ width: "100%", height: "100%", overflow: "visible" }}>
                        <polyline
                          fill="none"
                          stroke={idx.isPositive ? "#10b981" : "#f43f5e"}
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          points={idx.sparkline}
                        />
                      </svg>
                    </div>
                  </div>

                  {/* Historical Context Tag */}
                  <div style={{
                    fontSize: "11px",
                    color: "#94a3b8",
                    display: "flex",
                    alignItems: "center",
                    gap: "5px",
                    paddingTop: "6px",
                    borderTop: "1px solid rgba(255, 255, 255, 0.05)",
                  }}>
                    <Clock size={12} style={{ color: "#38bdf8", flexShrink: 0 }} />
                    <span>{idx.historicalContext}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ------------------------------------------------------------------ */}
        {/* 3. MARKET HEALTH & 8. CURRENT REGIME (GRID COMBINATION)            */}
        {/* ------------------------------------------------------------------ */}
        <section style={{ padding: "40px 0", borderBottom: "1px solid rgba(255, 255, 255, 0.05)" }}>
          <div style={sharedStyles.container}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))", gap: "24px" }}>
              {/* Market Health Card */}
              <div style={{
                backgroundColor: "#0b1220",
                border: "1px solid rgba(255, 255, 255, 0.08)",
                borderRadius: "8px",
                padding: "26px",
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "16px" }}>
                  <div>
                    <div style={{ fontSize: "11px", fontWeight: 700, color: "#38bdf8", letterSpacing: "0.1em", textTransform: "uppercase", fontFamily: '"SF Mono", "JetBrains Mono", monospace' }}>
                      COMPOSITE DIAGNOSTIC
                    </div>
                    <h2 style={{ fontSize: "20px", fontWeight: 700, color: "#ffffff", margin: "4px 0 0" }}>
                      Market Health
                    </h2>
                  </div>
                  <div style={{
                    padding: "3px 8px",
                    borderRadius: "4px",
                    backgroundColor: "rgba(245, 158, 11, 0.1)",
                    border: "1px solid rgba(245, 158, 11, 0.25)",
                    fontSize: "10px",
                    color: "#f59e0b",
                    fontFamily: '"SF Mono", "JetBrains Mono", monospace',
                    fontWeight: 600,
                  }}>
                    DEMO ANALYSIS
                  </div>
                </div>

                <p style={{ fontSize: "13px", color: "#94a3b8", lineHeight: 1.5, marginBottom: "20px" }}>
                  A composite view of participation, breadth, volatility and trend.
                </p>

                {/* Score Gauge */}
                <div style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "18px",
                  padding: "16px",
                  backgroundColor: "#080e1a",
                  borderRadius: "6px",
                  border: "1px solid rgba(255, 255, 255, 0.06)",
                  marginBottom: "20px",
                }}>
                  <div style={{
                    fontSize: "36px",
                    fontWeight: 800,
                    fontFamily: '"SF Mono", "JetBrains Mono", monospace',
                    color: "#10b981",
                    letterSpacing: "-0.03em",
                  }}>
                    {data.health.overallScore}<span style={{ fontSize: "16px", color: "#64748b", fontWeight: 500 }}>/100</span>
                  </div>
                  <div>
                    <div style={{ fontSize: "12px", fontWeight: 700, color: "#ffffff", letterSpacing: "0.04em" }}>
                      {data.health.rating}
                    </div>
                    <div style={{ fontSize: "11px", color: "#64748b" }}>
                      Multi-factor alignment across moving averages and liquidity
                    </div>
                  </div>
                </div>

                {/* Health Breakdown Bars */}
                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  {data.health.dimensions.map((dim) => (
                    <div key={dim.name}>
                      <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", marginBottom: "4px" }}>
                        <span style={{ color: "#cbd5e1", fontWeight: 500 }}>{dim.name}</span>
                        <span style={{ color: "#38bdf8", fontFamily: '"SF Mono", "JetBrains Mono", monospace', fontWeight: 600 }}>
                          {dim.score}/100 • {dim.status}
                        </span>
                      </div>
                      <div style={{ width: "100%", height: "5px", backgroundColor: "rgba(255, 255, 255, 0.06)", borderRadius: "3px", overflow: "hidden" }}>
                        <div style={{ width: `${dim.score}%`, height: "100%", backgroundColor: dim.score > 75 ? "#10b981" : dim.score > 50 ? "#38bdf8" : "#f59e0b" }} />
                      </div>
                      <div style={{ fontSize: "11px", color: "#64748b", marginTop: "3px" }}>{dim.detail}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Current Market Regime Card */}
              <div style={{
                backgroundColor: "#0b1220",
                border: "1px solid rgba(255, 255, 255, 0.08)",
                borderRadius: "8px",
                padding: "26px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
              }}>
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "16px" }}>
                    <div>
                      <div style={{ fontSize: "11px", fontWeight: 700, color: "#a855f7", letterSpacing: "0.1em", textTransform: "uppercase", fontFamily: '"SF Mono", "JetBrains Mono", monospace' }}>
                        MACRO STATE CLASSIFICATION
                      </div>
                      <h2 style={{ fontSize: "20px", fontWeight: 700, color: "#ffffff", margin: "4px 0 0" }}>
                        Current Market Regime
                      </h2>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                      <div style={{
                        padding: "3px 8px",
                        borderRadius: "4px",
                        backgroundColor: "rgba(245, 158, 11, 0.1)",
                        border: "1px solid rgba(245, 158, 11, 0.25)",
                        fontSize: "10px",
                        color: "#f59e0b",
                        fontFamily: '"SF Mono", "JetBrains Mono", monospace',
                        fontWeight: 600,
                      }}>
                        DEMO ANALYSIS
                      </div>
                      <div style={{
                        padding: "3px 8px",
                        borderRadius: "4px",
                        backgroundColor: "rgba(168, 85, 247, 0.12)",
                        border: "1px solid rgba(168, 85, 247, 0.3)",
                        fontSize: "11px",
                        color: "#c084fc",
                        fontFamily: '"SF Mono", "JetBrains Mono", monospace',
                        fontWeight: 600,
                      }}>
                        REGIME #{data.regime.regime.split("/")[0].trim()}
                      </div>
                    </div>
                  </div>

                  <div style={{
                    fontSize: "20px",
                    fontWeight: 700,
                    color: "#ffffff",
                    letterSpacing: "-0.01em",
                    marginBottom: "16px",
                    padding: "12px 14px",
                    backgroundColor: "rgba(168, 85, 247, 0.08)",
                    border: "1px solid rgba(168, 85, 247, 0.2)",
                    borderRadius: "6px",
                  }}>
                    {data.regime.regime}
                  </div>

                  {/* 5 Dimensions Grid */}
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginBottom: "16px" }}>
                    <div style={{ padding: "10px", backgroundColor: "#080e1a", borderRadius: "4px", border: "1px solid rgba(255, 255, 255, 0.05)" }}>
                      <div style={{ fontSize: "10px", color: "#64748b", textTransform: "uppercase", fontFamily: '"SF Mono", "JetBrains Mono", monospace' }}>Trend</div>
                      <div style={{ fontSize: "12px", color: "#f8fafc", fontWeight: 500, marginTop: "2px" }}>{data.regime.trend}</div>
                    </div>
                    <div style={{ padding: "10px", backgroundColor: "#080e1a", borderRadius: "4px", border: "1px solid rgba(255, 255, 255, 0.05)" }}>
                      <div style={{ fontSize: "10px", color: "#64748b", textTransform: "uppercase", fontFamily: '"SF Mono", "JetBrains Mono", monospace' }}>Volatility</div>
                      <div style={{ fontSize: "12px", color: "#10b981", fontWeight: 500, marginTop: "2px" }}>{data.regime.volatility}</div>
                    </div>
                    <div style={{ padding: "10px", backgroundColor: "#080e1a", borderRadius: "4px", border: "1px solid rgba(255, 255, 255, 0.05)" }}>
                      <div style={{ fontSize: "10px", color: "#64748b", textTransform: "uppercase", fontFamily: '"SF Mono", "JetBrains Mono", monospace' }}>Breadth</div>
                      <div style={{ fontSize: "12px", color: "#38bdf8", fontWeight: 500, marginTop: "2px" }}>{data.regime.breadth}</div>
                    </div>
                    <div style={{ padding: "10px", backgroundColor: "#080e1a", borderRadius: "4px", border: "1px solid rgba(255, 255, 255, 0.05)" }}>
                      <div style={{ fontSize: "10px", color: "#64748b", textTransform: "uppercase", fontFamily: '"SF Mono", "JetBrains Mono", monospace' }}>Liquidity</div>
                      <div style={{ fontSize: "12px", color: "#f8fafc", fontWeight: 500, marginTop: "2px" }}>{data.regime.liquidity}</div>
                    </div>
                  </div>

                  <div style={{ padding: "12px", backgroundColor: "rgba(0, 0, 0, 0.25)", borderRadius: "6px", border: "1px solid rgba(255, 255, 255, 0.05)", fontSize: "12px", color: "#94a3b8", lineHeight: 1.5, marginBottom: "20px" }}>
                    <strong style={{ color: "#e2e8f0" }}>Historical Analog: </strong>{data.regime.historicalAnalog}
                  </div>
                </div>

                <Link
                  to="/market/regime"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "10px 16px",
                    backgroundColor: "rgba(168, 85, 247, 0.12)",
                    border: "1px solid rgba(168, 85, 247, 0.25)",
                    borderRadius: "6px",
                    color: "#c084fc",
                    textDecoration: "none",
                    fontSize: "13px",
                    fontWeight: 600,
                  }}
                >
                  <span>Compare this regime with historical periods</span>
                  <ArrowRight size={15} />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* ------------------------------------------------------------------ */}
        {/* 4. MARKET BREADTH                                                  */}
        {/* ------------------------------------------------------------------ */}
        <section style={{ padding: "40px 0", borderBottom: "1px solid rgba(255, 255, 255, 0.05)" }}>
          <div style={sharedStyles.container}>
            <div style={{ marginBottom: "24px" }}>
              <div style={{ fontSize: "11px", fontWeight: 700, color: "#38bdf8", letterSpacing: "0.12em", textTransform: "uppercase", fontFamily: '"SF Mono", "JetBrains Mono", monospace', marginBottom: "6px" }}>
                PARTICIPATION METRICS
              </div>
              <h2 style={{ fontSize: "24px", fontWeight: 700, color: "#ffffff", margin: "0 0 6px 0", letterSpacing: "-0.02em" }}>
                Market Breadth
              </h2>
              <p style={{ fontSize: "14px", color: "#94a3b8", margin: 0 }}>
                Advance-decline momentum and moving average participation across listed Indian equities.
              </p>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "20px" }}>
              {/* Advance / Decline Split */}
              <div style={{ backgroundColor: "#0b1220", border: "1px solid rgba(255, 255, 255, 0.08)", borderRadius: "8px", padding: "22px" }}>
                <div style={{ fontSize: "13px", fontWeight: 600, color: "#ffffff", marginBottom: "14px" }}>
                  Advance / Decline Participation (All Listed)
                </div>

                <div style={{ display: "flex", height: "12px", borderRadius: "6px", overflow: "hidden", marginBottom: "14px", backgroundColor: "#070b14" }}>
                  <div style={{ width: `${(data.breadth.advancing / data.breadth.total) * 100}%`, backgroundColor: "#10b981" }} title={`Advancing: ${data.breadth.advancing}`} />
                  <div style={{ width: `${(data.breadth.unchanged / data.breadth.total) * 100}%`, backgroundColor: "#64748b" }} title={`Unchanged: ${data.breadth.unchanged}`} />
                  <div style={{ width: `${(data.breadth.declining / data.breadth.total) * 100}%`, backgroundColor: "#f43f5e" }} title={`Declining: ${data.breadth.declining}`} />
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "10px", textAlign: "center" }}>
                  <div style={{ padding: "10px", backgroundColor: "rgba(16, 185, 129, 0.08)", borderRadius: "6px", border: "1px solid rgba(16, 185, 129, 0.2)" }}>
                    <div style={{ fontSize: "11px", color: "#10b981", fontWeight: 600 }}>ADVANCING</div>
                    <div style={{ fontSize: "18px", fontWeight: 700, color: "#ffffff", fontFamily: '"SF Mono", "JetBrains Mono", monospace' }}>{data.breadth.advancing}</div>
                    <div style={{ fontSize: "10px", color: "#64748b" }}>60.2%</div>
                  </div>
                  <div style={{ padding: "10px", backgroundColor: "rgba(100, 116, 139, 0.08)", borderRadius: "6px", border: "1px solid rgba(100, 116, 139, 0.2)" }}>
                    <div style={{ fontSize: "11px", color: "#94a3b8", fontWeight: 600 }}>UNCHANGED</div>
                    <div style={{ fontSize: "18px", fontWeight: 700, color: "#ffffff", fontFamily: '"SF Mono", "JetBrains Mono", monospace' }}>{data.breadth.unchanged}</div>
                    <div style={{ fontSize: "10px", color: "#64748b" }}>4.2%</div>
                  </div>
                  <div style={{ padding: "10px", backgroundColor: "rgba(244, 63, 94, 0.08)", borderRadius: "6px", border: "1px solid rgba(244, 63, 94, 0.2)" }}>
                    <div style={{ fontSize: "11px", color: "#f43f5e", fontWeight: 600 }}>DECLINING</div>
                    <div style={{ fontSize: "18px", fontWeight: 700, color: "#ffffff", fontFamily: '"SF Mono", "JetBrains Mono", monospace' }}>{data.breadth.declining}</div>
                    <div style={{ fontSize: "10px", color: "#64748b" }}>35.6%</div>
                  </div>
                </div>
              </div>

              {/* Moving Average Breadth */}
              <div style={{ backgroundColor: "#0b1220", border: "1px solid rgba(255, 255, 255, 0.08)", borderRadius: "8px", padding: "22px" }}>
                <div style={{ fontSize: "13px", fontWeight: 600, color: "#ffffff", marginBottom: "14px" }}>
                  % of Universe Above Key Moving Averages
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  <div>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", marginBottom: "4px" }}>
                      <span style={{ color: "#94a3b8" }}>Above 20-Day DMA (Short-Term Momentum)</span>
                      <span style={{ color: "#ffffff", fontWeight: 700, fontFamily: '"SF Mono", "JetBrains Mono", monospace' }}>{data.breadth.above20DMA}%</span>
                    </div>
                    <div style={{ width: "100%", height: "6px", backgroundColor: "#070b14", borderRadius: "3px", overflow: "hidden" }}>
                      <div style={{ width: `${data.breadth.above20DMA}%`, height: "100%", backgroundColor: "#38bdf8" }} />
                    </div>
                  </div>

                  <div>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", marginBottom: "4px" }}>
                      <span style={{ color: "#94a3b8" }}>Above 50-Day DMA (Intermediate Trend)</span>
                      <span style={{ color: "#ffffff", fontWeight: 700, fontFamily: '"SF Mono", "JetBrains Mono", monospace' }}>{data.breadth.above50DMA}%</span>
                    </div>
                    <div style={{ width: "100%", height: "6px", backgroundColor: "#070b14", borderRadius: "3px", overflow: "hidden" }}>
                      <div style={{ width: `${data.breadth.above50DMA}%`, height: "100%", backgroundColor: "#10b981" }} />
                    </div>
                  </div>

                  <div>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", marginBottom: "4px" }}>
                      <span style={{ color: "#94a3b8" }}>Above 200-Day DMA (Structural Bull Regime)</span>
                      <span style={{ color: "#ffffff", fontWeight: 700, fontFamily: '"SF Mono", "JetBrains Mono", monospace' }}>{data.breadth.above200DMA}%</span>
                    </div>
                    <div style={{ width: "100%", height: "6px", backgroundColor: "#070b14", borderRadius: "3px", overflow: "hidden" }}>
                      <div style={{ width: `${data.breadth.above200DMA}%`, height: "100%", backgroundColor: "#a855f7" }} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Interpretation Panel */}
              <div style={{ backgroundColor: "#0d1629", border: "1px solid rgba(56, 189, 248, 0.2)", borderRadius: "8px", padding: "22px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "11px", fontWeight: 700, color: "#38bdf8", letterSpacing: "0.08em", textTransform: "uppercase", fontFamily: '"SF Mono", "JetBrains Mono", monospace' }}>
                    <Activity size={14} />
                    <span>WHAT BREADTH IS TELLING US</span>
                  </div>
                  <div style={{
                    padding: "2px 6px",
                    borderRadius: "4px",
                    backgroundColor: "rgba(245, 158, 11, 0.1)",
                    border: "1px solid rgba(245, 158, 11, 0.25)",
                    fontSize: "10px",
                    color: "#f59e0b",
                    fontFamily: '"SF Mono", "JetBrains Mono", monospace',
                    fontWeight: 600,
                  }}>
                    DEMO ANALYSIS
                  </div>
                </div>
                <div style={{ fontSize: "14px", color: "#ffffff", fontWeight: 600, marginBottom: "8px" }}>
                  Broad-based participation confirming index stability.
                </div>
                <p style={{ fontSize: "13px", color: "#94a3b8", lineHeight: 1.55, margin: 0 }}>
                  {data.breadth.interpretation}
                </p>
                <div style={{ marginTop: "14px", paddingTop: "10px", borderTop: "1px solid rgba(255, 255, 255, 0.06)", fontSize: "11px", color: "#64748b" }}>
                  * Automated analytical summary generated from demonstration breadth parameters.
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ------------------------------------------------------------------ */}
        {/* 5. SECTOR ROTATION                                                 */}
        {/* ------------------------------------------------------------------ */}
        <section style={{ padding: "40px 0", borderBottom: "1px solid rgba(255, 255, 255, 0.05)" }}>
          <div style={sharedStyles.container}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: "16px", marginBottom: "20px" }}>
              <div>
                <div style={{ fontSize: "11px", fontWeight: 700, color: "#38bdf8", letterSpacing: "0.12em", textTransform: "uppercase", fontFamily: '"SF Mono", "JetBrains Mono", monospace', marginBottom: "6px" }}>
                  CROSS-SECTIONAL HEATMAP
                </div>
                <h2 style={{ fontSize: "24px", fontWeight: 700, color: "#ffffff", margin: "0 0 4px 0", letterSpacing: "-0.02em" }}>
                  Sector Rotation
                </h2>
                <p style={{ fontSize: "14px", color: "#94a3b8", margin: 0 }}>
                  Relative strength and multi-timeframe returns across 9 major economic sectors.
                </p>
              </div>

              {/* 4 Classification Badges */}
              <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                <span style={{ fontSize: "11px", padding: "3px 8px", borderRadius: "4px", backgroundColor: "rgba(16, 185, 129, 0.12)", color: "#10b981", border: "1px solid rgba(16, 185, 129, 0.25)", fontFamily: '"SF Mono", "JetBrains Mono", monospace', fontWeight: 600 }}>LEADERS</span>
                <span style={{ fontSize: "11px", padding: "3px 8px", borderRadius: "4px", backgroundColor: "rgba(56, 189, 248, 0.12)", color: "#38bdf8", border: "1px solid rgba(56, 189, 248, 0.25)", fontFamily: '"SF Mono", "JetBrains Mono", monospace', fontWeight: 600 }}>IMPROVING</span>
                <span style={{ fontSize: "11px", padding: "3px 8px", borderRadius: "4px", backgroundColor: "rgba(245, 158, 11, 0.12)", color: "#f59e0b", border: "1px solid rgba(245, 158, 11, 0.25)", fontFamily: '"SF Mono", "JetBrains Mono", monospace', fontWeight: 600 }}>WEAKENING</span>
                <span style={{ fontSize: "11px", padding: "3px 8px", borderRadius: "4px", backgroundColor: "rgba(244, 63, 94, 0.12)", color: "#f43f5e", border: "1px solid rgba(244, 63, 94, 0.25)", fontFamily: '"SF Mono", "JetBrains Mono", monospace', fontWeight: 600 }}>LAGGARDS</span>
              </div>
            </div>

            {/* Compact Sector Heatmap Table */}
            <div style={{ backgroundColor: "#0b1220", border: "1px solid rgba(255, 255, 255, 0.08)", borderRadius: "8px", overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "13px" }}>
                <thead>
                  <tr style={{ borderBottom: "1px solid rgba(255, 255, 255, 0.08)", backgroundColor: "#080e1a", color: "#64748b", fontFamily: '"SF Mono", "JetBrains Mono", monospace', fontSize: "11px" }}>
                    <th style={{ padding: "12px 18px" }}>SECTOR</th>
                    <th style={{ padding: "12px 18px" }}>REGIME STATUS</th>
                    <th style={{ padding: "12px 18px", textAlign: "right" }}>1 DAY</th>
                    <th style={{ padding: "12px 18px", textAlign: "right" }}>1 WEEK</th>
                    <th style={{ padding: "12px 18px", textAlign: "right" }}>1 MONTH</th>
                    <th style={{ padding: "12px 18px", textAlign: "right" }}>3 MONTH</th>
                  </tr>
                </thead>
                <tbody>
                  {data.sectors.map((sec, idx) => {
                    const getCatBadge = (cat: string) => {
                      switch (cat) {
                        case "LEADERS": return { color: "#10b981", bg: "rgba(16, 185, 129, 0.1)" };
                        case "IMPROVING": return { color: "#38bdf8", bg: "rgba(56, 189, 248, 0.1)" };
                        case "WEAKENING": return { color: "#f59e0b", bg: "rgba(245, 158, 11, 0.1)" };
                        default: return { color: "#f43f5e", bg: "rgba(244, 63, 94, 0.1)" };
                      }
                    };
                    const badge = getCatBadge(sec.category);

                    return (
                      <tr
                        key={sec.sector}
                        style={{
                          borderBottom: idx === data.sectors.length - 1 ? "none" : "1px solid rgba(255, 255, 255, 0.04)",
                          backgroundColor: idx % 2 === 0 ? "transparent" : "rgba(255, 255, 255, 0.01)",
                        }}
                      >
                        <td style={{ padding: "12px 18px", fontWeight: 600, color: "#ffffff" }}>
                          {sec.sector}
                        </td>
                        <td style={{ padding: "12px 18px" }}>
                          <span style={{
                            padding: "2px 6px",
                            borderRadius: "4px",
                            fontSize: "10px",
                            fontWeight: 700,
                            fontFamily: '"SF Mono", "JetBrains Mono", monospace',
                            backgroundColor: badge.bg,
                            color: badge.color,
                          }}>
                            {sec.category}
                          </span>
                        </td>
                        <td style={{ padding: "12px 18px", textAlign: "right", fontFamily: '"SF Mono", "JetBrains Mono", monospace', color: sec.d1Val >= 0 ? "#10b981" : "#f43f5e" }}>
                          {sec.d1}
                        </td>
                        <td style={{ padding: "12px 18px", textAlign: "right", fontFamily: '"SF Mono", "JetBrains Mono", monospace', color: sec.w1Val >= 0 ? "#10b981" : "#f43f5e" }}>
                          {sec.w1}
                        </td>
                        <td style={{ padding: "12px 18px", textAlign: "right", fontFamily: '"SF Mono", "JetBrains Mono", monospace', color: sec.m1Val >= 0 ? "#10b981" : "#f43f5e" }}>
                          {sec.m1}
                        </td>
                        <td style={{ padding: "12px 18px", textAlign: "right", fontFamily: '"SF Mono", "JetBrains Mono", monospace', color: sec.m3Val >= 0 ? "#10b981" : "#f43f5e" }}>
                          {sec.m3}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* ------------------------------------------------------------------ */}
        {/* 6. VOLATILITY & 7. INSTITUTIONAL FLOWS                             */}
        {/* ------------------------------------------------------------------ */}
        <section style={{ padding: "40px 0", borderBottom: "1px solid rgba(255, 255, 255, 0.05)" }}>
          <div style={sharedStyles.container}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))", gap: "24px" }}>
              {/* Volatility Regime */}
              <div style={{ backgroundColor: "#0b1220", border: "1px solid rgba(255, 255, 255, 0.08)", borderRadius: "8px", padding: "24px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "14px" }}>
                  <div>
                    <div style={{ fontSize: "11px", fontWeight: 700, color: "#38bdf8", letterSpacing: "0.1em", textTransform: "uppercase", fontFamily: '"SF Mono", "JetBrains Mono", monospace' }}>
                      RISK & DISPERSION
                    </div>
                    <h2 style={{ fontSize: "20px", fontWeight: 700, color: "#ffffff", margin: "4px 0 0" }}>
                      Volatility Regime
                    </h2>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                    <div style={{
                      padding: "3px 8px",
                      borderRadius: "4px",
                      backgroundColor: "rgba(245, 158, 11, 0.1)",
                      border: "1px solid rgba(245, 158, 11, 0.25)",
                      fontSize: "10px",
                      color: "#f59e0b",
                      fontFamily: '"SF Mono", "JetBrains Mono", monospace',
                      fontWeight: 600,
                    }}>
                      DEMO ANALYSIS
                    </div>
                    <div style={{
                      padding: "3px 8px",
                      borderRadius: "4px",
                      backgroundColor: "rgba(16, 185, 129, 0.12)",
                      border: "1px solid rgba(16, 185, 129, 0.25)",
                      fontSize: "11px",
                      color: "#10b981",
                      fontFamily: '"SF Mono", "JetBrains Mono", monospace',
                      fontWeight: 700,
                    }}>
                      {data.volatility.regime} VOLATILITY
                    </div>
                  </div>
                </div>

                <div style={{ fontSize: "13px", color: "#94a3b8", marginBottom: "16px", fontStyle: "italic" }}>
                  &ldquo;Volatility is most useful when viewed relative to its own history.&rdquo;
                </div>

                {/* Key Metrics Grid */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginBottom: "16px" }}>
                  <div style={{ padding: "12px", backgroundColor: "#080e1a", borderRadius: "6px", border: "1px solid rgba(255, 255, 255, 0.05)" }}>
                    <div style={{ fontSize: "10px", color: "#64748b", fontFamily: '"SF Mono", "JetBrains Mono", monospace' }}>INDIA VIX</div>
                    <div style={{ fontSize: "22px", fontWeight: 700, color: "#10b981", fontFamily: '"SF Mono", "JetBrains Mono", monospace', marginTop: "2px" }}>
                      {data.volatility.indiaVix}
                    </div>
                    <div style={{ fontSize: "10px", color: "#64748b" }}>10Y Median: 15.6</div>
                  </div>

                  <div style={{ padding: "12px", backgroundColor: "#080e1a", borderRadius: "6px", border: "1px solid rgba(255, 255, 255, 0.05)" }}>
                    <div style={{ fontSize: "10px", color: "#64748b", fontFamily: '"SF Mono", "JetBrains Mono", monospace' }}>PERCENTILE RANK</div>
                    <div style={{ fontSize: "22px", fontWeight: 700, color: "#38bdf8", fontFamily: '"SF Mono", "JetBrains Mono", monospace', marginTop: "2px" }}>
                      {data.volatility.percentile}
                    </div>
                    <div style={{ fontSize: "10px", color: "#64748b" }}>Past 5-Year Window</div>
                  </div>

                  <div style={{ padding: "12px", backgroundColor: "#080e1a", borderRadius: "6px", border: "1px solid rgba(255, 255, 255, 0.05)" }}>
                    <div style={{ fontSize: "10px", color: "#64748b", fontFamily: '"SF Mono", "JetBrains Mono", monospace' }}>20D REALIZED VOL</div>
                    <div style={{ fontSize: "18px", fontWeight: 700, color: "#ffffff", fontFamily: '"SF Mono", "JetBrains Mono", monospace', marginTop: "2px" }}>
                      {data.volatility.d20Vol}
                    </div>
                  </div>

                  <div style={{ padding: "12px", backgroundColor: "#080e1a", borderRadius: "6px", border: "1px solid rgba(255, 255, 255, 0.05)" }}>
                    <div style={{ fontSize: "10px", color: "#64748b", fontFamily: '"SF Mono", "JetBrains Mono", monospace' }}>60D REALIZED VOL</div>
                    <div style={{ fontSize: "18px", fontWeight: 700, color: "#ffffff", fontFamily: '"SF Mono", "JetBrains Mono", monospace', marginTop: "2px" }}>
                      {data.volatility.d60Vol}
                    </div>
                  </div>
                </div>

                <p style={{ fontSize: "12px", color: "#94a3b8", lineHeight: 1.55, margin: 0 }}>
                  {data.volatility.explanation}
                </p>
              </div>

              {/* Institutional Flows */}
              <div style={{ backgroundColor: "#0b1220", border: "1px solid rgba(255, 255, 255, 0.08)", borderRadius: "8px", padding: "24px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "14px" }}>
                  <div>
                    <div style={{ fontSize: "11px", fontWeight: 700, color: "#38bdf8", letterSpacing: "0.1em", textTransform: "uppercase", fontFamily: '"SF Mono", "JetBrains Mono", monospace' }}>
                      CAPITAL FLOW DYNAMICS
                    </div>
                    <h2 style={{ fontSize: "20px", fontWeight: 700, color: "#ffffff", margin: "4px 0 0" }}>
                      Institutional Flows
                    </h2>
                  </div>
                  <div style={{
                    padding: "3px 8px",
                    borderRadius: "4px",
                    backgroundColor: "rgba(245, 158, 11, 0.1)",
                    border: "1px solid rgba(245, 158, 11, 0.25)",
                    fontSize: "10px",
                    color: "#f59e0b",
                    fontFamily: '"SF Mono", "JetBrains Mono", monospace',
                    fontWeight: 600,
                  }}>
                    Illustrative flow dataset
                  </div>
                </div>

                <p style={{ fontSize: "13px", color: "#94a3b8", lineHeight: 1.5, marginBottom: "18px" }}>
                  Foreign and Domestic Institutional Investor net activity across cash markets.
                </p>

                {/* Flow Table */}
                <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "16px" }}>
                  {data.flows.map((flow) => (
                    <div
                      key={flow.period}
                      style={{
                        padding: "12px 14px",
                        backgroundColor: "#080e1a",
                        borderRadius: "6px",
                        border: "1px solid rgba(255, 255, 255, 0.05)",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <div>
                        <div style={{ fontSize: "12px", fontWeight: 600, color: "#ffffff" }}>{flow.period}</div>
                        <div style={{ fontSize: "11px", color: "#64748b", fontFamily: '"SF Mono", "JetBrains Mono", monospace', marginTop: "2px" }}>
                          FII: <span style={{ color: flow.fiiVal >= 0 ? "#10b981" : "#f43f5e" }}>{flow.fiiNet}</span> • DII: <span style={{ color: flow.diiVal >= 0 ? "#10b981" : "#f43f5e" }}>{flow.diiNet}</span>
                        </div>
                      </div>
                      <div style={{ textAlign: "right" }}>
                        <div style={{ fontSize: "14px", fontWeight: 700, fontFamily: '"SF Mono", "JetBrains Mono", monospace', color: flow.netVal >= 0 ? "#10b981" : "#f43f5e" }}>
                          {flow.netFlow}
                        </div>
                        <div style={{ fontSize: "10px", color: "#64748b" }}>Net Absorption</div>
                      </div>
                    </div>
                  ))}
                </div>

                <div style={{ fontSize: "11px", color: "#64748b", lineHeight: 1.5 }}>
                  * Aggregate disclosed flows do not establish exact trade timing or causality.
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ------------------------------------------------------------------ */}
        {/* 9. TODAY'S MARKET IN HISTORICAL CONTEXT                            */}
        {/* ------------------------------------------------------------------ */}
        <section style={{ padding: "40px 0", borderBottom: "1px solid rgba(255, 255, 255, 0.05)" }}>
          <div style={sharedStyles.container}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: "16px", marginBottom: "24px" }}>
              <div>
                <div style={{ fontSize: "11px", fontWeight: 700, color: "#e2b357", letterSpacing: "0.12em", textTransform: "uppercase", fontFamily: '"SF Mono", "JetBrains Mono", monospace', marginBottom: "6px" }}>
                  CORE DIFFERENTIATOR
                </div>
                <h2 style={{ fontSize: "24px", fontWeight: 700, color: "#ffffff", margin: "0 0 6px 0", letterSpacing: "-0.02em" }}>
                  Today&apos;s Market in Historical Context
                </h2>
                <p style={{ fontSize: "14px", color: "#94a3b8", margin: 0 }}>
                  Empirical forward return distributions following comparable regime, volatility, and participation conditions since 1979.
                </p>
              </div>
              <div style={{
                padding: "3px 8px",
                borderRadius: "4px",
                backgroundColor: "rgba(245, 158, 11, 0.1)",
                border: "1px solid rgba(245, 158, 11, 0.25)",
                fontSize: "11px",
                color: "#f59e0b",
                fontFamily: '"SF Mono", "JetBrains Mono", monospace',
                fontWeight: 600,
              }}>
                ILLUSTRATIVE ANALYSIS
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))", gap: "20px" }}>
              {data.historicalComparisons.map((comp) => (
                <div
                  key={comp.question}
                  style={{
                    backgroundColor: "#0b1220",
                    border: "1px solid rgba(255, 255, 255, 0.08)",
                    borderRadius: "8px",
                    padding: "22px",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                  }}
                >
                  <div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "10px" }}>
                      <span style={{ fontSize: "11px", fontFamily: '"SF Mono", "JetBrains Mono", monospace', color: "#e2b357" }}>
                        HISTORICAL STUDY
                      </span>
                      <span style={{ fontSize: "10px", fontFamily: '"SF Mono", "JetBrains Mono", monospace', color: "#64748b", backgroundColor: "rgba(255, 255, 255, 0.04)", padding: "2px 6px", borderRadius: "4px" }}>
                        {comp.sampleSize}
                      </span>
                    </div>

                    <h3 style={{ fontSize: "16px", fontWeight: 700, color: "#ffffff", marginBottom: "14px", lineHeight: 1.4 }}>
                      {comp.question}
                    </h3>

                    {/* Forward Horizon Distribution Cards */}
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "8px", marginBottom: "14px" }}>
                      <div style={{ padding: "8px", backgroundColor: "#080e1a", borderRadius: "4px", textAlign: "center", border: "1px solid rgba(255, 255, 255, 0.05)" }}>
                        <div style={{ fontSize: "10px", color: "#64748b" }}>30D Fwd</div>
                        <div style={{ fontSize: "14px", fontWeight: 700, color: "#10b981", fontFamily: '"SF Mono", "JetBrains Mono", monospace', margin: "2px 0" }}>
                          {comp.d30Forward.median}
                        </div>
                        <div style={{ fontSize: "10px", color: "#94a3b8" }}>{comp.d30Forward.winRate} +ve</div>
                      </div>

                      <div style={{ padding: "8px", backgroundColor: "#080e1a", borderRadius: "4px", textAlign: "center", border: "1px solid rgba(255, 255, 255, 0.05)" }}>
                        <div style={{ fontSize: "10px", color: "#64748b" }}>90D Fwd</div>
                        <div style={{ fontSize: "14px", fontWeight: 700, color: "#10b981", fontFamily: '"SF Mono", "JetBrains Mono", monospace', margin: "2px 0" }}>
                          {comp.d90Forward.median}
                        </div>
                        <div style={{ fontSize: "10px", color: "#94a3b8" }}>{comp.d90Forward.winRate} +ve</div>
                      </div>

                      <div style={{ padding: "8px", backgroundColor: "#080e1a", borderRadius: "4px", textAlign: "center", border: "1px solid rgba(255, 255, 255, 0.05)" }}>
                        <div style={{ fontSize: "10px", color: "#64748b" }}>180D Fwd</div>
                        <div style={{ fontSize: "14px", fontWeight: 700, color: "#10b981", fontFamily: '"SF Mono", "JetBrains Mono", monospace', margin: "2px 0" }}>
                          {comp.d180Forward.median}
                        </div>
                        <div style={{ fontSize: "10px", color: "#94a3b8" }}>{comp.d180Forward.winRate} +ve</div>
                      </div>
                    </div>

                    <p style={{ fontSize: "12px", color: "#94a3b8", lineHeight: 1.5, margin: 0 }}>
                      {comp.takeaway}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ marginTop: "16px", fontSize: "12px", color: "#64748b", display: "flex", alignItems: "center", gap: "6px" }}>
              <Info size={13} />
              <span>
                Historical distributions are descriptive of past episodes, not deterministic future price forecasts.
              </span>
            </div>
          </div>
        </section>

        {/* ------------------------------------------------------------------ */}
        {/* 10. MARKET MOVERS                                                  */}
        {/* ------------------------------------------------------------------ */}
        <section style={{ padding: "40px 0", borderBottom: "1px solid rgba(255, 255, 255, 0.05)" }}>
          <div style={sharedStyles.container}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "20px" }}>
              <div>
                <h2 style={{ fontSize: "20px", fontWeight: 700, color: "#ffffff", letterSpacing: "-0.02em", margin: "0 0 4px 0" }}>
                  Market Movers (Demonstration Data)
                </h2>
                <span style={{ fontSize: "13px", color: "#64748b" }}>
                  Active large-cap constituents and unusual trading activity
                </span>
              </div>
              <span style={{
                fontSize: "10px",
                fontFamily: '"SF Mono", "JetBrains Mono", monospace',
                color: "#f59e0b",
                backgroundColor: "rgba(245, 158, 11, 0.1)",
                border: "1px solid rgba(245, 158, 11, 0.25)",
                padding: "2px 6px",
                borderRadius: "4px",
                fontWeight: 600,
              }}>
                DEMO ANALYSIS
              </span>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "20px" }}>
              {/* Gainers */}
              <div style={{ backgroundColor: "#0b1220", border: "1px solid rgba(255, 255, 255, 0.08)", borderRadius: "8px", padding: "20px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "12px", fontWeight: 700, color: "#10b981", marginBottom: "14px", fontFamily: '"SF Mono", "JetBrains Mono", monospace' }}>
                  <TrendingUp size={14} />
                  <span>TOP GAINERS</span>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                  {data.movers.gainers.map((stock) => (
                    <div key={stock.symbol} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 12px", backgroundColor: "#080e1a", borderRadius: "6px", border: "1px solid rgba(255, 255, 255, 0.04)" }}>
                      <div>
                        <div style={{ fontSize: "13px", fontWeight: 700, color: "#ffffff" }}>{stock.symbol}</div>
                        <div style={{ fontSize: "11px", color: "#64748b" }}>{stock.name} • {stock.volume}</div>
                      </div>
                      <div style={{ textAlign: "right" }}>
                        <div style={{ fontSize: "13px", fontWeight: 600, color: "#ffffff", fontFamily: '"SF Mono", "JetBrains Mono", monospace' }}>{stock.price}</div>
                        <div style={{ fontSize: "11px", fontWeight: 600, color: "#10b981", fontFamily: '"SF Mono", "JetBrains Mono", monospace' }}>{stock.pctChange}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Losers */}
              <div style={{ backgroundColor: "#0b1220", border: "1px solid rgba(255, 255, 255, 0.08)", borderRadius: "8px", padding: "20px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "12px", fontWeight: 700, color: "#f43f5e", marginBottom: "14px", fontFamily: '"SF Mono", "JetBrains Mono", monospace' }}>
                  <TrendingDown size={14} />
                  <span>TOP LAGGARDS</span>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                  {data.movers.losers.map((stock) => (
                    <div key={stock.symbol} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 12px", backgroundColor: "#080e1a", borderRadius: "6px", border: "1px solid rgba(255, 255, 255, 0.04)" }}>
                      <div>
                        <div style={{ fontSize: "13px", fontWeight: 700, color: "#ffffff" }}>{stock.symbol}</div>
                        <div style={{ fontSize: "11px", color: "#64748b" }}>{stock.name} • {stock.volume}</div>
                      </div>
                      <div style={{ textAlign: "right" }}>
                        <div style={{ fontSize: "13px", fontWeight: 600, color: "#ffffff", fontFamily: '"SF Mono", "JetBrains Mono", monospace' }}>{stock.price}</div>
                        <div style={{ fontSize: "11px", fontWeight: 600, color: "#f43f5e", fontFamily: '"SF Mono", "JetBrains Mono", monospace' }}>{stock.pctChange}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ------------------------------------------------------------------ */}
        {/* 11. QUICK INTELLIGENCE MODULES                                     */}
        {/* ------------------------------------------------------------------ */}
        <section style={{ padding: "40px 0", borderBottom: "1px solid rgba(255, 255, 255, 0.05)" }}>
          <div style={sharedStyles.container}>
            <div style={{ marginBottom: "20px" }}>
              <div style={{ fontSize: "11px", fontWeight: 700, color: "#38bdf8", letterSpacing: "0.12em", textTransform: "uppercase", fontFamily: '"SF Mono", "JetBrains Mono", monospace', marginBottom: "6px" }}>
                DEEP DIVES
              </div>
              <h2 style={{ fontSize: "20px", fontWeight: 700, color: "#ffffff", margin: 0, letterSpacing: "-0.02em" }}>
                Explore Specific Analytical Dimensions
              </h2>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "16px" }}>
              <Link
                to="/market/breadth"
                style={{
                  backgroundColor: "#0c1424",
                  border: "1px solid rgba(255, 255, 255, 0.08)",
                  borderRadius: "8px",
                  padding: "20px",
                  textDecoration: "none",
                  color: "inherit",
                }}
                className="product-card-hover"
              >
                <div style={{ fontSize: "11px", fontFamily: '"SF Mono", "JetBrains Mono", monospace', color: "#38bdf8", fontWeight: 600, marginBottom: "8px" }}>
                  MODULE 01
                </div>
                <div style={{ fontSize: "16px", fontWeight: 700, color: "#ffffff", marginBottom: "6px" }}>
                  Market Breadth
                </div>
                <div style={{ fontSize: "12px", color: "#94a3b8", lineHeight: 1.4, marginBottom: "14px" }}>
                  Advance-decline ratios, 20/50/200 DMA participation, and breadth thrust indicators.
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "12px", color: "#38bdf8", fontWeight: 600 }}>
                  <span>Open Breadth Hub</span>
                  <ArrowRight size={13} />
                </div>
              </Link>

              <Link
                to="/market/sectors"
                style={{
                  backgroundColor: "#0c1424",
                  border: "1px solid rgba(255, 255, 255, 0.08)",
                  borderRadius: "8px",
                  padding: "20px",
                  textDecoration: "none",
                  color: "inherit",
                }}
                className="product-card-hover"
              >
                <div style={{ fontSize: "11px", fontFamily: '"SF Mono", "JetBrains Mono", monospace', color: "#10b981", fontWeight: 600, marginBottom: "8px" }}>
                  MODULE 02
                </div>
                <div style={{ fontSize: "16px", fontWeight: 700, color: "#ffffff", marginBottom: "6px" }}>
                  Sector Rotation
                </div>
                <div style={{ fontSize: "12px", color: "#94a3b8", lineHeight: 1.4, marginBottom: "14px" }}>
                  Relative rotation graphs, leadership shifts, and historical sector beta distributions.
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "12px", color: "#10b981", fontWeight: 600 }}>
                  <span>Open Sector Hub</span>
                  <ArrowRight size={13} />
                </div>
              </Link>

              <Link
                to="/market/regime"
                style={{
                  backgroundColor: "#0c1424",
                  border: "1px solid rgba(255, 255, 255, 0.08)",
                  borderRadius: "8px",
                  padding: "20px",
                  textDecoration: "none",
                  color: "inherit",
                }}
                className="product-card-hover"
              >
                <div style={{ fontSize: "11px", fontFamily: '"SF Mono", "JetBrains Mono", monospace', color: "#a855f7", fontWeight: 600, marginBottom: "8px" }}>
                  MODULE 03
                </div>
                <div style={{ fontSize: "16px", fontWeight: 700, color: "#ffffff", marginBottom: "6px" }}>
                  Market Regime
                </div>
                <div style={{ fontSize: "12px", color: "#94a3b8", lineHeight: 1.4, marginBottom: "14px" }}>
                  Trend, volatility, liquidity, and cross-asset correlation state machine.
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "12px", color: "#a855f7", fontWeight: 600 }}>
                  <span>Open Regime Hub</span>
                  <ArrowRight size={13} />
                </div>
              </Link>

              <Link
                to="/market/sentiment"
                style={{
                  backgroundColor: "#0c1424",
                  border: "1px solid rgba(255, 255, 255, 0.08)",
                  borderRadius: "8px",
                  padding: "20px",
                  textDecoration: "none",
                  color: "inherit",
                }}
                className="product-card-hover"
              >
                <div style={{ fontSize: "11px", fontFamily: '"SF Mono", "JetBrains Mono", monospace', color: "#f59e0b", fontWeight: 600, marginBottom: "8px" }}>
                  MODULE 04
                </div>
                <div style={{ fontSize: "16px", fontWeight: 700, color: "#ffffff", marginBottom: "6px" }}>
                  Market Sentiment
                </div>
                <div style={{ fontSize: "12px", color: "#94a3b8", lineHeight: 1.4, marginBottom: "14px" }}>
                  Derivatives put-call ratios, volatility skew, and domestic institutional positioning.
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "12px", color: "#f59e0b", fontWeight: 600 }}>
                  <span>Open Sentiment Hub</span>
                  <ArrowRight size={13} />
                </div>
              </Link>
            </div>
          </div>
        </section>

        {/* ------------------------------------------------------------------ */}
        {/* 12. HISTORICAL QUESTION BAR                                        */}
        {/* ------------------------------------------------------------------ */}
        <section style={{ padding: "48px 0 60px" }}>
          <div style={sharedStyles.container}>
            <div style={{
              backgroundColor: "#0c1527",
              border: "1px solid rgba(56, 189, 248, 0.2)",
              borderRadius: "10px",
              padding: "36px 30px",
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "#38bdf8", fontSize: "11px", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", fontFamily: '"SF Mono", "JetBrains Mono", monospace', marginBottom: "12px" }}>
                <Sparkles size={14} />
                <span>ANALYTICS QUERY INTERFACE</span>
              </div>

              <h2 style={{ fontSize: "24px", fontWeight: 800, color: "#ffffff", margin: "0 0 10px 0", letterSpacing: "-0.02em" }}>
                Ask the market a historical question.
              </h2>
              <p style={{ fontSize: "14px", color: "#94a3b8", maxWidth: "680px", margin: "0 0 24px 0", lineHeight: 1.5 }}>
                Sensex.money is indexing 45+ years of daily bhavcopy, corporate actions, and regulatory regimes to make quantitative historical questions instantly answerable.
              </p>

              {/* Sample Question Chips */}
              <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
                {data.historicalQuestions.map((q) => (
                  <button
                    key={q}
                    type="button"
                    style={{
                      backgroundColor: "rgba(255, 255, 255, 0.04)",
                      border: "1px solid rgba(255, 255, 255, 0.1)",
                      borderRadius: "6px",
                      padding: "8px 14px",
                      color: "#cbd5e1",
                      fontSize: "12px",
                      textAlign: "left",
                      cursor: "pointer",
                      transition: "all 0.15s ease",
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                    }}
                    className="question-chip"
                    onClick={() => {
                      // Demo UI interaction - non-functional placeholder for future backend API
                    }}
                  >
                    <Search size={12} style={{ color: "#38bdf8" }} />
                    <span>&ldquo;{q}&rdquo;</span>
                  </button>
                ))}
              </div>

              <div style={{ marginTop: "20px", fontSize: "11px", color: "#64748b" }}>
                * Example research queries. In production, queries will connect to the Sensex.money quantitative historical engine.
              </div>
            </div>
          </div>
        </section>
      </main>

      <GlobalFooter />

      <style>{`
        .question-chip:hover {
          background-color: rgba(56, 189, 248, 0.1) !important;
          border-color: rgba(56, 189, 248, 0.3) !important;
          color: #ffffff !important;
        }
      `}</style>
    </div>
  );
};

// ============================================================================
// STOCKS / STOCK EXPLORER TYPES & DEMONSTRATION DATA ARCHITECTURE
// ============================================================================
export type DataStatus =
  | "ILLUSTRATIVE DATA"
  | "VERIFIED DATA"
  | "PARTIALLY VERIFIED"
  | "SOURCE PENDING"
  | "CALCULATED"
  | "DERIVED";

export type EventType =
  | "INCORPORATION"
  | "IPO"
  | "LISTING"
  | "ADR_LISTING"
  | "BONUS"
  | "SPLIT"
  | "RIGHTS"
  | "DIVIDEND"
  | "MERGER"
  | "DEMERGER"
  | "NAME_CHANGE"
  | "CAPITAL_RESTRUCTURING"
  | "BUSINESS_EVENT"
  | "REGULATORY_EVENT";

export interface StockSummary {
  issuerId: string;
  securityId: string;
  listingId: string;
  symbol: string;
  name: string;
  sector: string;
  exchange: "NSE" | "BSE";
  price: string;
  change1D: string;
  pctChange1D: string;
  isPositive: boolean;
  return1Y: string;
  historicalRecord: string; // Explicitly defined record, e.g. "IPO — 1993" or "Demonstration lineage available"
  dataStatus: DataStatus;
  dataStatusSubtitle: string;
  mCapCategory: "Large Cap" | "Mid Cap" | "Small Cap";
}

export interface HistoricalEvent {
  eventId: string;
  issuerId: string;
  securityId?: string;
  listingId?: string;
  year: string;
  date?: string;
  title: string;
  eventType: EventType;
  description: string;
  impact?: string;
  dataStatus: DataStatus;
  sourceDocument?: string;
}

export interface CorporateActionRecord {
  eventId: string;
  issuerId: string;
  securityId: string;
  listingId?: string;
  eventType: "BONUS" | "SPLIT" | "DIVIDEND" | "DEMERGER" | "RIGHTS" | "MERGER";
  displayType: "Bonus" | "Split" | "Dividend" | "Demerger" | "Rights" | "Merger";
  announcementDate?: string;
  recordDate?: string;
  exDate: string;
  effectiveDate?: string;
  ratio?: string;
  consideration?: string;
  predecessorSecurityId?: string;
  successorSecurityId?: string;
  priceAdjustmentFactor?: string;
  shareCountAdjustmentFactor?: string;
  ratioOrAmount: string;
  impact: string;
  source: string;
  sourceDocument?: string;
  verificationStatus: DataStatus;
}

export interface CompanyDNADimension {
  dimension: string;
  score: number; // 0 - 100
  rating: "Exceptional" | "Strong" | "Moderate" | "Cyclical" | "Volatile";
  commentary: string;
  methodology: string;
  underlyingMetrics: string;
  observationWindow: string;
  benchmark: string;
  dataStatus: DataStatus;
}

export interface RegimeBehaviourRow {
  regimeId: string;
  regimeName: string;
  startDate?: string;
  endDate?: string;
  periodDescription: string;
  companyReturn: string;
  benchmarkReturn: string;
  relativeReturn: string;
  isOutperforming: boolean;
  sampleDefinition: string;
  methodology: string;
  dataStatus: DataStatus;
}

export interface ValuationDimension {
  metric: string;
  observationDate?: string;
  currentValue: string;
  p10: string;
  median: string;
  p90: string;
  windowStart: string;
  windowEnd: string;
  frequency: string;
  pointInTime: boolean;
  source: string;
  dataStatus: DataStatus;
  isConnected: boolean;
}

export interface HistoricalQuestionQuery {
  question: string;
  queryType: string;
  entity: string;
  dateRange: string;
  filters: string;
  calculation: string;
  result: string;
  sampleSize: string;
  methodology: string;
  source: string;
  dataStatus: DataStatus;
}

export interface CompanyProfile {
  issuerId: string;
  securityId: string;
  listingId: string;
  symbol: string;
  name: string;
  exchange: string;
  isin: string;
  sector: string;
  industry: string;
  listingYear: string;
  historicalRecordLabel: string;
  price: string;
  change1D: string;
  pctChange1D: string;
  isPositive: boolean;
  mCap: string;
  high52W: string;
  low52W: string;
  dataStatus: DataStatus;
  dataStatusSubtitle: string;
  timeframeReturns: {
    d1: string;
    w1: string;
    m1: string;
    y1: string;
    y5: string;
    max: string;
  };
  chartSeries: {
    [key: string]: { points: string; low: string; high: string; change: string; isPositive: boolean };
  };
  historyTimeline: HistoricalEvent[];
  corporateActions: CorporateActionRecord[];
  returnEngine: {
    priceReturn: {
      y1: string;
      y3CAGR: string;
      y5CAGR: string;
      y10CAGR: string;
      maxCAGR: string;
    };
    totalReturn: {
      y1: string;
      y3CAGR: string;
      y5CAGR: string;
      y10CAGR: string;
      maxCAGR: string;
      statusNote: string;
    };
    corporateActionAdjustedReturn: {
      statusNote: string;
    };
    maxDrawdown: string;
    recoveryTime: string;
    bestYear: string;
    worstYear: string;
    positiveYearsPct: string;
    methodologyNote: string;
  };
  simulator: {
    defaultStartYear: string;
    initialAmount: string;
    endingValuePrice: string;
    endingValueTotalReturn?: string;
    cagr: string;
    maxDrawdown: string;
    yearsInvested: string;
    returnType: "PRICE RETURN (EX-DIVIDENDS)" | "TOTAL RETURN" | "CORPORATE-ACTION-ADJUSTED RETURN";
    isTotalReturnConnected: boolean;
  };
  drawdownHistory: {
    currentDrawdown: string;
    maxHistoricalDrawdown: string;
    longestRecovery: string;
    worstEpisode: string;
    peakDate: string;
    troughDate: string;
    recoveryDate: string;
    timeToTrough: string;
    timeToRecovery: string;
    timeUnderwater: string;
    benchmarkDrawdown: string;
    eventContext: string;
    chartPoints: string;
  };
  companyDNA: CompanyDNADimension[];
  regimeBehaviour: RegimeBehaviourRow[];
  valuations: ValuationDimension[];
  marketComparison: {
    period1Y: { stock: string; sensex: string; nifty: string; sector: string };
    period3Y: { stock: string; sensex: string; nifty: string; sector: string };
    period5Y: { stock: string; sensex: string; nifty: string; sector: string };
  };
  historicalQuestions: HistoricalQuestionQuery[];
}

// ============================================================================
// POPULAR COMPANIES DEMO UNIVERSE
// ============================================================================
export const STOCK_UNIVERSE: StockSummary[] = [
  {
    issuerId: "ISS_INFY",
    securityId: "SEC_INFY_EQ",
    listingId: "LST_NSE_INFY",
    symbol: "INFY",
    name: "Infosys Limited",
    sector: "Information Technology",
    exchange: "NSE",
    price: "₹1,842.50",
    change1D: "+48.20",
    pctChange1D: "+2.69%",
    isPositive: true,
    return1Y: "+24.8%",
    historicalRecord: "IPO — 1993",
    dataStatus: "ILLUSTRATIVE DATA",
    dataStatusSubtitle: "Demo dataset • methodology preview",
    mCapCategory: "Large Cap",
  },
  {
    issuerId: "ISS_TCS",
    securityId: "SEC_TCS_EQ",
    listingId: "LST_NSE_TCS",
    symbol: "TCS",
    name: "Tata Consultancy Services",
    sector: "Information Technology",
    exchange: "NSE",
    price: "₹4,210.00",
    change1D: "+52.30",
    pctChange1D: "+1.26%",
    isPositive: true,
    return1Y: "+21.4%",
    historicalRecord: "IPO — 2004",
    dataStatus: "ILLUSTRATIVE DATA",
    dataStatusSubtitle: "Demo dataset • methodology preview",
    mCapCategory: "Large Cap",
  },
  {
    issuerId: "ISS_RELIANCE",
    securityId: "SEC_RELIANCE_EQ",
    listingId: "LST_NSE_RELIANCE",
    symbol: "RELIANCE",
    name: "Reliance Industries Limited",
    sector: "Energy & Conglomerate",
    exchange: "NSE",
    price: "₹2,980.40",
    change1D: "-12.50",
    pctChange1D: "-0.42%",
    isPositive: false,
    return1Y: "+18.2%",
    historicalRecord: "Listing — 1977",
    dataStatus: "ILLUSTRATIVE DATA",
    dataStatusSubtitle: "Demo dataset • methodology preview",
    mCapCategory: "Large Cap",
  },
  {
    issuerId: "ISS_HDFCBANK",
    securityId: "SEC_HDFCBANK_EQ",
    listingId: "LST_NSE_HDFCBANK",
    symbol: "HDFCBANK",
    name: "HDFC Bank Limited",
    sector: "Banking & Financial Services",
    exchange: "NSE",
    price: "₹1,654.10",
    change1D: "+8.40",
    pctChange1D: "+0.51%",
    isPositive: true,
    return1Y: "+6.9%",
    historicalRecord: "Listing — 1995",
    dataStatus: "ILLUSTRATIVE DATA",
    dataStatusSubtitle: "Demo dataset • methodology preview",
    mCapCategory: "Large Cap",
  },
  {
    issuerId: "ISS_ICICIBANK",
    securityId: "SEC_ICICIBANK_EQ",
    listingId: "LST_NSE_ICICIBANK",
    symbol: "ICICIBANK",
    name: "ICICI Bank Limited",
    sector: "Banking & Financial Services",
    exchange: "NSE",
    price: "₹1,215.30",
    change1D: "+11.20",
    pctChange1D: "+0.93%",
    isPositive: true,
    return1Y: "+26.8%",
    historicalRecord: "Listing — 1998",
    dataStatus: "ILLUSTRATIVE DATA",
    dataStatusSubtitle: "Demo dataset • methodology preview",
    mCapCategory: "Large Cap",
  },
  {
    issuerId: "ISS_ITC",
    securityId: "SEC_ITC_EQ",
    listingId: "LST_NSE_ITC",
    symbol: "ITC",
    name: "ITC Limited",
    sector: "FMCG & Conglomerate",
    exchange: "NSE",
    price: "₹504.80",
    change1D: "-1.80",
    pctChange1D: "-0.36%",
    isPositive: false,
    return1Y: "+12.1%",
    historicalRecord: "Demonstration lineage available",
    dataStatus: "ILLUSTRATIVE DATA",
    dataStatusSubtitle: "Demo dataset • methodology preview",
    mCapCategory: "Large Cap",
  },
  {
    issuerId: "ISS_SUNPHARMA",
    securityId: "SEC_SUNPHARMA_EQ",
    listingId: "LST_NSE_SUNPHARMA",
    symbol: "SUNPHARMA",
    name: "Sun Pharmaceutical Industries",
    sector: "Healthcare & Pharmaceuticals",
    exchange: "NSE",
    price: "₹1,720.00",
    change1D: "+34.50",
    pctChange1D: "+2.05%",
    isPositive: true,
    return1Y: "+48.4%",
    historicalRecord: "IPO — 1994",
    dataStatus: "ILLUSTRATIVE DATA",
    dataStatusSubtitle: "Demo dataset • methodology preview",
    mCapCategory: "Large Cap",
  },
  {
    issuerId: "ISS_TATAMOTORS",
    securityId: "SEC_TATAMOTORS_EQ",
    listingId: "LST_NSE_TATAMOTORS",
    symbol: "TATAMOTORS",
    name: "Tata Motors Limited",
    sector: "Automotive",
    exchange: "NSE",
    price: "₹1,085.40",
    change1D: "+18.60",
    pctChange1D: "+1.74%",
    isPositive: true,
    return1Y: "+72.3%",
    historicalRecord: "Listing — 1955",
    dataStatus: "ILLUSTRATIVE DATA",
    dataStatusSubtitle: "Demo dataset • methodology preview",
    mCapCategory: "Large Cap",
  },
  {
    issuerId: "ISS_LT",
    securityId: "SEC_LT_EQ",
    listingId: "LST_NSE_LT",
    symbol: "LT",
    name: "Larsen & Toubro Limited",
    sector: "Capital Goods & Infrastructure",
    exchange: "NSE",
    price: "₹3,620.10",
    change1D: "+22.40",
    pctChange1D: "+0.62%",
    isPositive: true,
    return1Y: "+28.7%",
    historicalRecord: "Listing — 1950",
    dataStatus: "ILLUSTRATIVE DATA",
    dataStatusSubtitle: "Demo dataset • methodology preview",
    mCapCategory: "Large Cap",
  },
  {
    issuerId: "ISS_HINDUNILVR",
    securityId: "SEC_HINDUNILVR_EQ",
    listingId: "LST_NSE_HINDUNILVR",
    symbol: "HINDUNILVR",
    name: "Hindustan Unilever Limited",
    sector: "FMCG",
    exchange: "NSE",
    price: "₹2,640.00",
    change1D: "-8.10",
    pctChange1D: "-0.31%",
    isPositive: false,
    return1Y: "+4.2%",
    historicalRecord: "Listing — 1956",
    dataStatus: "ILLUSTRATIVE DATA",
    dataStatusSubtitle: "Demo dataset • methodology preview",
    mCapCategory: "Large Cap",
  },
  {
    issuerId: "ISS_BHARTIARTL",
    securityId: "SEC_BHARTIARTL_EQ",
    listingId: "LST_NSE_BHARTIARTL",
    symbol: "BHARTIARTL",
    name: "Bharti Airtel Limited",
    sector: "Telecommunications",
    exchange: "NSE",
    price: "₹1,580.60",
    change1D: "+14.20",
    pctChange1D: "+0.91%",
    isPositive: true,
    return1Y: "+76.5%",
    historicalRecord: "IPO — 2002",
    dataStatus: "ILLUSTRATIVE DATA",
    dataStatusSubtitle: "Demo dataset • methodology preview",
    mCapCategory: "Large Cap",
  },
  {
    issuerId: "ISS_ASIANPAINT",
    securityId: "SEC_ASIANPAINT_EQ",
    listingId: "LST_NSE_ASIANPAINT",
    symbol: "ASIANPAINT",
    name: "Asian Paints Limited",
    sector: "Consumer Discretionary",
    exchange: "NSE",
    price: "₹3,140.20",
    change1D: "-15.80",
    pctChange1D: "-0.50%",
    isPositive: false,
    return1Y: "-2.8%",
    historicalRecord: "IPO — 1973",
    dataStatus: "ILLUSTRATIVE DATA",
    dataStatusSubtitle: "Demo dataset • methodology preview",
    mCapCategory: "Large Cap",
  },
];

// ============================================================================
// CURATED PROFILE DATA PROVIDER
// ============================================================================
export const CURATED_PROFILES: { [key: string]: CompanyProfile } = {
  INFY: {
    issuerId: "ISS_INFY",
    securityId: "SEC_INFY_EQ",
    listingId: "LST_NSE_INFY",
    symbol: "INFY",
    name: "Infosys Limited",
    exchange: "NSE",
    isin: "INE009A01021",
    sector: "Information Technology",
    industry: "Enterprise Consulting & Software Services",
    listingYear: "1993",
    historicalRecordLabel: "IPO — 1993",
    price: "₹1,842.50",
    change1D: "+48.20",
    pctChange1D: "+2.69%",
    isPositive: true,
    mCap: "₹7,65,400 Cr",
    high52W: "₹1,940.00",
    low52W: "₹1,358.30",
    dataStatus: "ILLUSTRATIVE DATA",
    dataStatusSubtitle: "Demo dataset • methodology preview",
    timeframeReturns: {
      d1: "+2.69%",
      w1: "+3.85%",
      m1: "+6.40%",
      y1: "+24.80%",
      y5: "+128.40%",
      max: "+28,450%",
    },
    chartSeries: {
      "1D": { points: "0,25 15,22 30,24 45,18 60,19 75,12 90,8 100,5", low: "₹1,802.10", high: "₹1,848.00", change: "+2.69%", isPositive: true },
      "1M": { points: "0,26 15,25 30,20 45,22 60,15 75,10 90,8 100,6", low: "₹1,725.00", high: "₹1,850.00", change: "+6.40%", isPositive: true },
      "1Y": { points: "0,28 15,22 30,24 45,18 60,12 75,14 90,7 100,4", low: "₹1,358.30", high: "₹1,940.00", change: "+24.80%", isPositive: true },
      "5Y": { points: "0,29 15,18 30,6 45,14 60,18 75,12 90,8 100,5", low: "₹650.00", high: "₹1,940.00", change: "+128.40%", isPositive: true },
      "MAX": { points: "0,30 10,29 25,27 40,24 55,20 70,14 85,8 100,4", low: "₹0.95 (Adj)", high: "₹1,940.00", change: "+28,450%", isPositive: true },
    },
    historyTimeline: [
      { eventId: "EV_INFY_01", issuerId: "ISS_INFY", year: "1981", title: "Incorporation in Pune", eventType: "INCORPORATION", description: "Founded with initial seed capital of ₹10,000 by 7 software engineers in Pune, Maharashtra.", dataStatus: "ILLUSTRATIVE DATA" },
      { eventId: "EV_INFY_02", issuerId: "ISS_INFY", securityId: "SEC_INFY_EQ", year: "1993", title: "BSE Initial Public Offering", eventType: "IPO", description: "Initial public offering at ₹95/share, initially undersubscribed before institutional absorption.", impact: "First major Indian IT IPO", dataStatus: "ILLUSTRATIVE DATA" },
      { eventId: "EV_INFY_03", issuerId: "ISS_INFY", securityId: "SEC_INFY_ADR", year: "1999", title: "Nasdaq ADR Listing", eventType: "ADR_LISTING", description: "First Indian-registered company to list on Nasdaq (symbol: INFY).", impact: "Global investor institutional access", dataStatus: "ILLUSTRATIVE DATA" },
      { eventId: "EV_INFY_04", issuerId: "ISS_INFY", securityId: "SEC_INFY_EQ", year: "2000", title: "2-for-1 Stock Split & Bonus", eventType: "SPLIT", description: "Subdivided ₹10 face value into ₹5, accompanied by 1:1 bonus issue.", dataStatus: "ILLUSTRATIVE DATA" },
      { eventId: "EV_INFY_05", issuerId: "ISS_INFY", securityId: "SEC_INFY_EQ", year: "2004", title: "3:1 Bonus Issue", eventType: "BONUS", description: "Issued 3 bonus equity shares for every 1 share held from free reserves.", dataStatus: "ILLUSTRATIVE DATA" },
      { eventId: "EV_INFY_06", issuerId: "ISS_INFY", securityId: "SEC_INFY_EQ", year: "2014", title: "1:1 Bonus Issue", eventType: "BONUS", description: "Capitalization of reserves via 1:1 bonus share allotment.", dataStatus: "ILLUSTRATIVE DATA" },
      { eventId: "EV_INFY_07", issuerId: "ISS_INFY", securityId: "SEC_INFY_EQ", year: "2018", title: "1:1 Bonus Issue", eventType: "BONUS", description: "Issued 1 bonus share for every 1 existing share held to commemorate 25 years of public listing.", dataStatus: "ILLUSTRATIVE DATA" },
      { eventId: "EV_INFY_08", issuerId: "ISS_INFY", year: "2024–26", title: "Enterprise AI Transition", eventType: "BUSINESS_EVENT", description: "Topaz generative AI delivery platform suite deployed across client architecture.", impact: "Commercial operational transition", dataStatus: "ILLUSTRATIVE DATA" },
    ],
    corporateActions: [
      { eventId: "CA_INFY_01", issuerId: "ISS_INFY", securityId: "SEC_INFY_EQ", eventType: "BONUS", displayType: "Bonus", exDate: "13 Jul 2018", ratioOrAmount: "1:1", ratio: "1:1", priceAdjustmentFactor: "0.50", shareCountAdjustmentFactor: "2.00", impact: "Doubled share count; adjusted ex-bonus price by 50%", source: "Exchange Notice", verificationStatus: "ILLUSTRATIVE DATA" },
      { eventId: "CA_INFY_02", issuerId: "ISS_INFY", securityId: "SEC_INFY_EQ", eventType: "BONUS", displayType: "Bonus", exDate: "15 Jun 2015", ratioOrAmount: "1:1", ratio: "1:1", priceAdjustmentFactor: "0.50", shareCountAdjustmentFactor: "2.00", impact: "Doubled share count from existing capital reserves", source: "Exchange Notice", verificationStatus: "ILLUSTRATIVE DATA" },
      { eventId: "CA_INFY_03", issuerId: "ISS_INFY", securityId: "SEC_INFY_EQ", eventType: "BONUS", displayType: "Bonus", exDate: "02 Dec 2014", ratioOrAmount: "1:1", ratio: "1:1", priceAdjustmentFactor: "0.50", shareCountAdjustmentFactor: "2.00", impact: "1 bonus share for every 1 share held", source: "Exchange Notice", verificationStatus: "ILLUSTRATIVE DATA" },
      { eventId: "CA_INFY_04", issuerId: "ISS_INFY", securityId: "SEC_INFY_EQ", eventType: "BONUS", displayType: "Bonus", exDate: "01 Jul 2006", ratioOrAmount: "1:1", ratio: "1:1", priceAdjustmentFactor: "0.50", shareCountAdjustmentFactor: "2.00", impact: "1:1 bonus share issue", source: "Exchange Notice", verificationStatus: "ILLUSTRATIVE DATA" },
      { eventId: "CA_INFY_05", issuerId: "ISS_INFY", securityId: "SEC_INFY_EQ", eventType: "BONUS", displayType: "Bonus", exDate: "01 Jul 2004", ratioOrAmount: "3:1", ratio: "3:1", priceAdjustmentFactor: "0.25", shareCountAdjustmentFactor: "4.00", impact: "Quadrupled share count per unit", source: "Exchange Notice", verificationStatus: "ILLUSTRATIVE DATA" },
      { eventId: "CA_INFY_06", issuerId: "ISS_INFY", securityId: "SEC_INFY_EQ", eventType: "SPLIT", displayType: "Split", exDate: "11 Feb 2000", ratioOrAmount: "₹10 to ₹5", ratio: "2:1", priceAdjustmentFactor: "0.50", shareCountAdjustmentFactor: "2.00", impact: "Subdivision of equity share face value", source: "Exchange Notice", verificationStatus: "ILLUSTRATIVE DATA" },
      { eventId: "CA_INFY_07", issuerId: "ISS_INFY", securityId: "SEC_INFY_EQ", eventType: "DIVIDEND", displayType: "Dividend", exDate: "31 Oct 2024", ratioOrAmount: "₹21.00 / share", consideration: "₹21.00", impact: "Interim cash return to shareholders", source: "Exchange Notice", verificationStatus: "ILLUSTRATIVE DATA" },
    ],
    returnEngine: {
      priceReturn: {
        y1: "+24.8%",
        y3CAGR: "+8.4%",
        y5CAGR: "+17.9%",
        y10CAGR: "+16.2%",
        maxCAGR: "+22.4%",
      },
      totalReturn: {
        y1: "+27.2%",
        y3CAGR: "+10.8%",
        y5CAGR: "+20.5%",
        y10CAGR: "+19.1%",
        maxCAGR: "+25.1%",
        statusNote: "Total-return calculation will use the corporate-action dividend ledger when connected.",
      },
      corporateActionAdjustedReturn: {
        statusNote: "Point-in-time corporate-action adjusted return model with split/bonus adjustments applied.",
      },
      maxDrawdown: "-82.4% (Dot-com 2000-01)",
      recoveryTime: "6.2 Years (2000 peak to 2006 recovery)",
      bestYear: "+148% (1999)",
      worstYear: "-54% (2001)",
      positiveYearsPct: "72% of calendar years",
      methodologyNote: "Price return measures capital appreciation. Total return incorporates dividend reinvestment upon ex-dividend date. Corporate-action adjusted return accounts for base share expansion.",
    },
    simulator: {
      defaultStartYear: "2004",
      initialAmount: "₹1,00,000",
      endingValuePrice: "₹18,42,000",
      endingValueTotalReturn: "₹24,80,000 (Estimated)",
      cagr: "+15.6%",
      maxDrawdown: "-42.1% (2008 GFC)",
      yearsInvested: "20 Years",
      returnType: "PRICE RETURN (EX-DIVIDENDS)",
      isTotalReturnConnected: false,
    },
    drawdownHistory: {
      currentDrawdown: "-5.0%",
      maxHistoricalDrawdown: "-82.4%",
      longestRecovery: "1,540 Days",
      worstEpisode: "2000 Dot-com Bubble Deflation (Tech sector re-rating)",
      peakDate: "Feb 2000",
      troughDate: "Nov 2001",
      recoveryDate: "Dec 2006",
      timeToTrough: "630 Days",
      timeToRecovery: "1,540 Days",
      timeUnderwater: "2,170 Days",
      benchmarkDrawdown: "-56.2% (Sensex 2000-01)",
      eventContext: "Global technology valuation compression following dot-com speculation peak.",
      chartPoints: "0,4 20,82 40,35 60,42 80,18 100,5",
    },
    companyDNA: [
      { dimension: "Trend Persistence", score: 84, rating: "Strong", commentary: "Demonstrates sustained structural uptrend over 5-year moving average envelopes.", methodology: "Slope and persistence of 200-day exponential moving average", underlyingMetrics: "Hurst Exponent: 0.62 • Trend Efficiency: 0.74", observationWindow: "10-Year Rolling", benchmark: "NIFTY 50", dataStatus: "ILLUSTRATIVE DATA" },
      { dimension: "Drawdown Resilience", score: 68, rating: "Moderate", commentary: "High tech-beta exposes stock during global IT budget contraction cycles.", methodology: "Peak-to-trough drawdown magnitude relative to broad market benchmark", underlyingMetrics: "Beta to Nifty in Drawdowns: 1.18x • Sortino Ratio: 1.24", observationWindow: "15-Year Window", benchmark: "NIFTY 50", dataStatus: "ILLUSTRATIVE DATA" },
      { dimension: "Relative Strength vs Nifty", score: 76, rating: "Strong", commentary: "Consistent excess return generator during dollar-strengthening macro regimes.", methodology: "Ratio of security total return to benchmark total return across regimes", underlyingMetrics: "Rolling 3Y Alpha: +2.8% • Outperformance Frequency: 68%", observationWindow: "10-Year Window", benchmark: "NIFTY 50", dataStatus: "ILLUSTRATIVE DATA" },
      { dimension: "Capital Allocation Discipline", score: 92, rating: "Exceptional", commentary: "Strict 70-80% free cash flow distribution policy via dividends and buybacks.", methodology: "Cash return to shareholders as percentage of Free Cash Flow to Equity", underlyingMetrics: "10Y FCF Conversion: 84% • Dividend Consistency: 100%", observationWindow: "10-Year Audit", benchmark: "NIFTY IT", dataStatus: "ILLUSTRATIVE DATA" },
      { dimension: "Volatility Profile", score: 72, rating: "Moderate", commentary: "Annualized realized volatility of 21.4% vs Nifty 13.8%.", methodology: "Annualized standard deviation of daily log-returns", underlyingMetrics: "252D Realized Vol: 21.4% • Downside Volatility: 14.8%", observationWindow: "5-Year Window", benchmark: "NIFTY 50", dataStatus: "ILLUSTRATIVE DATA" },
      { dimension: "Bear Market Survival", score: 88, rating: "Strong", commentary: "Net cash balance sheet guarantees zero solvency risk during recessions.", methodology: "Net Debt/EBITDA and Altman Z-Score solvency indicators", underlyingMetrics: "Net Debt: Zero (Net Cash) • Current Ratio: 2.1x", observationWindow: "Continuous", benchmark: "Indian Listed Equities", dataStatus: "ILLUSTRATIVE DATA" },
      { dimension: "Long-Term Compounding", score: 94, rating: "Exceptional", commentary: "Top-decile multi-decade wealth creator on Indian exchanges.", methodology: "Total Return CAGR relative to risk-free rate and domestic GDP growth", underlyingMetrics: "20Y Compounding CAGR: +15.6% • ROE Median: 27.2%", observationWindow: "Since Listing", benchmark: "BSE SENSEX", dataStatus: "ILLUSTRATIVE DATA" },
    ],
    regimeBehaviour: [
      { regimeId: "REG_BULL", regimeName: "Bull Market Expansion", periodDescription: "2003–2007, 2020–2021", companyReturn: "+42.5% CAGR", benchmarkReturn: "+34.1% CAGR", relativeReturn: "+8.4% Excess Return", isOutperforming: true, sampleDefinition: "Periods where NIFTY 50 advances >20% on annualized basis", methodology: "Geometric annualized CAGR comparison", dataStatus: "ILLUSTRATIVE DATA" },
      { regimeId: "REG_RECESSION", regimeName: "Global Recession / Tech Slump", periodDescription: "2000–2001, 2008–2009", companyReturn: "-46.0%", benchmarkReturn: "-54.0%", relativeReturn: "+8.0% Excess Return", isOutperforming: true, sampleDefinition: "Global contractionary macro phases", methodology: "Peak-to-trough total period return", dataStatus: "ILLUSTRATIVE DATA" },
      { regimeId: "REG_FX", regimeName: "High USD / INR Depreciating", periodDescription: "2013, 2018, 2022", companyReturn: "+28.4%", benchmarkReturn: "+11.2%", relativeReturn: "+17.2% Excess Return", isOutperforming: true, sampleDefinition: "Years with INR depreciation >5% against USD", methodology: "Period return comparison", dataStatus: "ILLUSTRATIVE DATA" },
      { regimeId: "REG_DOM_BOOM", regimeName: "Domestic Consumption Boom", periodDescription: "2015–2017", companyReturn: "+6.2% CAGR", benchmarkReturn: "+14.8% CAGR", relativeReturn: "-8.6% Lag", isOutperforming: false, sampleDefinition: "Domestic retail & infrastructure outperformance cycle", methodology: "Annualized CAGR comparison", dataStatus: "ILLUSTRATIVE DATA" },
      { regimeId: "REG_RECOVERY", regimeName: "Post-Drawdown Recovery", periodDescription: "2009–2010, 2020–2021", companyReturn: "+112.0%", benchmarkReturn: "+88.0%", relativeReturn: "+24.0% Excess Return", isOutperforming: true, sampleDefinition: "12-month window following major market bottoms", methodology: "12M forward return from trough", dataStatus: "ILLUSTRATIVE DATA" },
    ],
    valuations: [
      { metric: "Price to Earnings (P/E)", currentValue: "28.4x", p10: "14.8x", median: "21.5x", p90: "34.2x", windowStart: "2014", windowEnd: "2024", frequency: "Daily TTM", pointInTime: true, source: "Demonstration Series", dataStatus: "ILLUSTRATIVE DATA", isConnected: true },
      { metric: "Price to Book (P/B)", currentValue: "8.1x", p10: "4.2x", median: "6.8x", p90: "10.4x", windowStart: "2014", windowEnd: "2024", frequency: "Quarterly Reported", pointInTime: true, source: "Demonstration Series", dataStatus: "ILLUSTRATIVE DATA", isConnected: true },
      { metric: "Dividend Yield", currentValue: "2.35%", p10: "1.60%", median: "2.80%", p90: "4.10%", windowStart: "2014", windowEnd: "2024", frequency: "Trailing 12M", pointInTime: true, source: "Demonstration Series", dataStatus: "ILLUSTRATIVE DATA", isConnected: true },
      { metric: "EV / EBITDA", currentValue: "19.2x", p10: "11.0x", median: "15.4x", p90: "24.0x", windowStart: "2014", windowEnd: "2024", frequency: "Quarterly Enterprise Value", pointInTime: true, source: "Demonstration Series", dataStatus: "ILLUSTRATIVE DATA", isConnected: true },
    ],
    marketComparison: {
      period1Y: { stock: "+24.8%", sensex: "+19.4%", nifty: "+20.1%", sector: "+28.2%" },
      period3Y: { stock: "+27.4%", sensex: "+41.2%", nifty: "+43.6%", sector: "+32.1%" },
      period5Y: { stock: "+128.4%", sensex: "+98.2%", nifty: "+102.4%", sector: "+142.0%" },
    },
    historicalQuestions: [
      { question: "When did Infosys experience its largest drawdown?", queryType: "DRAWDOWN_ANALYSIS", entity: "INFY", dateRange: "1993-2024", filters: "peak_to_trough >= 20%", calculation: "MAX(drawdown_percent)", result: "-82.4% during 2000-2001 Dot-com correction", sampleSize: "31 Years Daily Data", methodology: "Peak-to-trough continuous drawdown series", source: "Demonstration historical dataset", dataStatus: "ILLUSTRATIVE DATA" },
      { question: "How long did recovery take after the 2000 Dot-com crash?", queryType: "RECOVERY_DURATION", entity: "INFY", dateRange: "2000-2006", filters: "event='Dot-com Crash'", calculation: "DAYS(recovery_date - peak_date)", result: "1,540 trading days (6.2 Calendar Years)", sampleSize: "1 Major Episode", methodology: "Time to regain prior peak nominal price", source: "Demonstration historical dataset", dataStatus: "ILLUSTRATIVE DATA" },
      { question: "How often has Infosys outperformed the Sensex over 3-year holding periods?", queryType: "ROLLING_ALPHA", entity: "INFY", dateRange: "1996-2024", filters: "holding_period = 756_days", calculation: "COUNT(stock_cagr > sensex_cagr) / TOTAL", result: "Outperformed in 68% of rolling 3-year windows", sampleSize: "6,800 Rolling Windows", methodology: "Daily rolling 3Y compound annual growth rate", source: "Demonstration historical dataset", dataStatus: "ILLUSTRATIVE DATA" },
      { question: "What historically happened to the stock price after its 1:1 bonus issues?", queryType: "EVENT_STUDY", entity: "INFY", dateRange: "2000-2018", filters: "event_type = 'BONUS' AND ratio = '1:1'", calculation: "AVG(fwd_return_90d, fwd_return_365d)", result: "Median +4.2% (90D) and +16.8% (365D) post-ex date", sampleSize: "N=4 Bonus Events", methodology: "Cumulative excess return distribution post-event", source: "Demonstration corporate action ledger", dataStatus: "ILLUSTRATIVE DATA" },
      { question: "How did Infosys behave during previous US recessionary regimes?", queryType: "REGIME_FILTER", entity: "INFY", dateRange: "2001, 2008, 2020", filters: "macro_regime = 'US_RECESSION'", calculation: "MEAN(excess_return_vs_nifty)", result: "+8.0% relative excess return vs Nifty 50", sampleSize: "N=3 Global Contraction Cycles", methodology: "Regime-conditioned benchmark comparison", source: "Demonstration historical dataset", dataStatus: "ILLUSTRATIVE DATA" },
    ],
  },
};

// Generic fallback generator for any ticker in the universe
export const getCompanyProfile = (symbolParam: string): CompanyProfile => {
  const sym = (symbolParam || "INFY").toUpperCase();
  if (CURATED_PROFILES[sym]) {
    return CURATED_PROFILES[sym];
  }

  // Find summary in stock universe or create dynamic profile
  const summary = STOCK_UNIVERSE.find((s) => s.symbol === sym) || {
    issuerId: `ISS_${sym}`,
    securityId: `SEC_${sym}_EQ`,
    listingId: `LST_NSE_${sym}`,
    symbol: sym,
    name: `${sym} Corporation`,
    sector: "Indian Listed Equities",
    exchange: "NSE" as const,
    price: "₹1,450.00",
    change1D: "+12.40",
    pctChange1D: "+0.86%",
    isPositive: true,
    return1Y: "+18.4%",
    historicalRecord: "Demonstration lineage available",
    dataStatus: "ILLUSTRATIVE DATA" as const,
    dataStatusSubtitle: "Demo dataset • methodology preview",
    mCapCategory: "Large Cap" as const,
  };

  return {
    issuerId: summary.issuerId,
    securityId: summary.securityId,
    listingId: summary.listingId,
    symbol: summary.symbol,
    name: summary.name,
    exchange: summary.exchange,
    isin: `INE${summary.symbol}0101`,
    sector: summary.sector,
    industry: `${summary.sector} Operations`,
    listingYear: "Historical Record",
    historicalRecordLabel: summary.historicalRecord,
    price: summary.price,
    change1D: summary.change1D,
    pctChange1D: summary.pctChange1D,
    isPositive: summary.isPositive,
    mCap: "₹2,40,000 Cr",
    high52W: "₹1,680.00",
    low52W: "₹1,120.00",
    dataStatus: "ILLUSTRATIVE DATA",
    dataStatusSubtitle: "Demo dataset • methodology preview",
    timeframeReturns: {
      d1: summary.pctChange1D,
      w1: "+1.8%",
      m1: "+4.2%",
      y1: summary.return1Y,
      y5: "+88.4%",
      max: "+1,450%",
    },
    chartSeries: {
      "1D": { points: "0,24 20,20 40,22 60,15 80,10 100,6", low: "₹1,430.00", high: "₹1,465.00", change: summary.pctChange1D, isPositive: summary.isPositive },
      "1M": { points: "0,26 25,22 50,18 75,12 100,8", low: "₹1,390.00", high: "₹1,465.00", change: "+4.20%", isPositive: true },
      "1Y": { points: "0,28 25,24 50,16 75,12 100,5", low: "₹1,120.00", high: "₹1,680.00", change: summary.return1Y, isPositive: true },
      "5Y": { points: "0,29 25,22 50,14 75,10 100,6", low: "₹680.00", high: "₹1,680.00", change: "+88.40%", isPositive: true },
      "MAX": { points: "0,30 25,25 50,18 75,10 100,5", low: "₹45.00", high: "₹1,680.00", change: "+1,450%", isPositive: true },
    },
    historyTimeline: [
      { eventId: `EV_${summary.symbol}_01`, issuerId: summary.issuerId, year: "Listing Era", title: "Exchange Listing", eventType: "LISTING", description: "Securities admitted to trading on Indian exchanges.", dataStatus: "ILLUSTRATIVE DATA" },
      { eventId: `EV_${summary.symbol}_02`, issuerId: summary.issuerId, year: "Corporate Restructuring", title: "Capital Lineage", eventType: "CAPITAL_RESTRUCTURING", description: "Historical capital adjustments pending primary archival linkage.", dataStatus: "ILLUSTRATIVE DATA" },
    ],
    corporateActions: [
      { eventId: `CA_${summary.symbol}_01`, issuerId: summary.issuerId, securityId: summary.securityId, eventType: "DIVIDEND", displayType: "Dividend", exDate: "Historical Record", ratioOrAmount: "Cash Dividend", impact: "Capital distribution to shareholders", source: "Exchange Notice", verificationStatus: "ILLUSTRATIVE DATA" },
    ],
    returnEngine: {
      priceReturn: {
        y1: summary.return1Y,
        y3CAGR: "+14.2%",
        y5CAGR: "+16.8%",
        y10CAGR: "+15.1%",
        maxCAGR: "+18.4%",
      },
      totalReturn: {
        y1: "+16.4%",
        y3CAGR: "+16.2%",
        y5CAGR: "+18.9%",
        y10CAGR: "+17.5%",
        maxCAGR: "+20.8%",
        statusNote: "Total-return calculation will use the corporate-action ledger when connected.",
      },
      corporateActionAdjustedReturn: {
        statusNote: "Point-in-time corporate-action adjusted return model with split/bonus adjustments applied.",
      },
      maxDrawdown: "-48.2% (2008 GFC)",
      recoveryTime: "3.4 Years",
      bestYear: "+86% (2009)",
      worstYear: "-42% (2008)",
      positiveYearsPct: "68% of calendar years",
      methodologyNote: "Price return measures capital appreciation. Total return incorporates dividend reinvestment upon ex-dividend date.",
    },
    simulator: {
      defaultStartYear: "2010",
      initialAmount: "₹1,00,000",
      endingValuePrice: "₹6,80,000",
      cagr: "+14.6%",
      maxDrawdown: "-38.2%",
      yearsInvested: "14 Years",
      returnType: "PRICE RETURN (EX-DIVIDENDS)",
      isTotalReturnConnected: false,
    },
    drawdownHistory: {
      currentDrawdown: "-8.2%",
      maxHistoricalDrawdown: "-48.2%",
      longestRecovery: "840 Days",
      worstEpisode: "2008 Global Financial Crisis Contraction",
      peakDate: "Jan 2008",
      troughDate: "Mar 2009",
      recoveryDate: "Nov 2010",
      timeToTrough: "420 Days",
      timeToRecovery: "610 Days",
      timeUnderwater: "1,030 Days",
      benchmarkDrawdown: "-59.6% (Sensex 2008)",
      eventContext: "Global liquidity contraction and asset repricing.",
      chartPoints: "0,5 25,48 50,30 75,18 100,8",
    },
    companyDNA: [
      { dimension: "Trend Persistence", score: 78, rating: "Strong", commentary: "Maintains positive multi-year directional momentum across economic cycles.", methodology: "Slope and persistence of 200-day exponential moving average", underlyingMetrics: "Hurst Exponent: 0.58", observationWindow: "10-Year Rolling", benchmark: "NIFTY 50", dataStatus: "ILLUSTRATIVE DATA" },
      { dimension: "Drawdown Resilience", score: 72, rating: "Moderate", commentary: "Drawdowns generally track the broader benchmark without idiosyncratic liquidation.", methodology: "Peak-to-trough drawdown magnitude relative to broad market benchmark", underlyingMetrics: "Beta in Drawdowns: 1.05x", observationWindow: "15-Year Window", benchmark: "NIFTY 50", dataStatus: "ILLUSTRATIVE DATA" },
      { dimension: "Relative Strength", score: 75, rating: "Strong", commentary: "Performs in line with sector leadership during growth phases.", methodology: "Ratio of security total return to benchmark total return", underlyingMetrics: "Rolling 3Y Alpha: +1.4%", observationWindow: "10-Year Window", benchmark: "NIFTY 50", dataStatus: "ILLUSTRATIVE DATA" },
      { dimension: "Capital Discipline", score: 80, rating: "Strong", commentary: "Regular dividend payout track record over the last decade.", methodology: "Cash return to shareholders as percentage of Free Cash Flow", underlyingMetrics: "10Y Payout Ratio: 45%", observationWindow: "10-Year Audit", benchmark: "Sector Benchmark", dataStatus: "ILLUSTRATIVE DATA" },
      { dimension: "Volatility Profile", score: 70, rating: "Moderate", commentary: "Realized volatility in line with broad market averages.", methodology: "Annualized standard deviation of daily log-returns", underlyingMetrics: "252D Realized Vol: 18.2%", observationWindow: "5-Year Window", benchmark: "NIFTY 50", dataStatus: "ILLUSTRATIVE DATA" },
      { dimension: "Long-Term Compounding", score: 84, rating: "Strong", commentary: "Sustained compounding of book value and operational revenues.", methodology: "Total Return CAGR relative to risk-free rate", underlyingMetrics: "10Y Compounding CAGR: +15.1%", observationWindow: "10-Year Window", benchmark: "BSE SENSEX", dataStatus: "ILLUSTRATIVE DATA" },
    ],
    regimeBehaviour: [
      { regimeId: "REG_BULL", regimeName: "Bull Market Expansion", periodDescription: "Market uptrends", companyReturn: "+32.4% CAGR", benchmarkReturn: "+28.1% CAGR", relativeReturn: "+4.3% Excess Return", isOutperforming: true, sampleDefinition: "Broad market expansions", methodology: "Annualized CAGR comparison", dataStatus: "ILLUSTRATIVE DATA" },
      { regimeId: "REG_BEAR", regimeName: "Market Drawdowns", periodDescription: "Bear phases", companyReturn: "-28.0%", benchmarkReturn: "-32.0%", relativeReturn: "+4.0% Excess Return", isOutperforming: true, sampleDefinition: "Market corrections > 15%", methodology: "Peak-to-trough return", dataStatus: "ILLUSTRATIVE DATA" },
      { regimeId: "REG_VOL", regimeName: "High Volatility", periodDescription: "VIX > 20", companyReturn: "+12.2%", benchmarkReturn: "+8.4%", relativeReturn: "+3.8% Excess Return", isOutperforming: true, sampleDefinition: "Elevated volatility regimes", methodology: "Period return comparison", dataStatus: "ILLUSTRATIVE DATA" },
    ],
    valuations: [
      { metric: "Price to Earnings (P/E)", currentValue: "24.2x", p10: "16.0x", median: "22.1x", p90: "31.5x", windowStart: "2014", windowEnd: "2024", frequency: "Daily TTM", pointInTime: true, source: "Demonstration Series", dataStatus: "ILLUSTRATIVE DATA", isConnected: true },
      { metric: "Price to Book (P/B)", currentValue: "4.8x", p10: "2.9x", median: "4.2x", p90: "6.5x", windowStart: "2014", windowEnd: "2024", frequency: "Quarterly Reported", pointInTime: true, source: "Demonstration Series", dataStatus: "ILLUSTRATIVE DATA", isConnected: true },
      { metric: "Dividend Yield", currentValue: "1.45%", p10: "0.80%", median: "1.50%", p90: "2.40%", windowStart: "2014", windowEnd: "2024", frequency: "Trailing 12M", pointInTime: true, source: "Demonstration Series", dataStatus: "ILLUSTRATIVE DATA", isConnected: true },
      { metric: "EV / EBITDA", currentValue: "16.4x", p10: "10.2x", median: "14.8x", p90: "21.0x", windowStart: "2014", windowEnd: "2024", frequency: "Quarterly Enterprise Value", pointInTime: true, source: "Demonstration Series", dataStatus: "ILLUSTRATIVE DATA", isConnected: true },
    ],
    marketComparison: {
      period1Y: { stock: summary.return1Y, sensex: "+19.4%", nifty: "+20.1%", sector: "+22.0%" },
      period3Y: { stock: "+48.2%", sensex: "+41.2%", nifty: "+43.6%", sector: "+46.4%" },
      period5Y: { stock: "+88.4%", sensex: "+98.2%", nifty: "+102.4%", sector: "+94.0%" },
    },
    historicalQuestions: [
      { question: `When did ${sym} experience its largest drawdown?`, queryType: "DRAWDOWN_ANALYSIS", entity: sym, dateRange: "Listing-Present", filters: "drawdown >= 20%", calculation: "MAX(drawdown_percent)", result: "Historical drawdown analysis available in dataset", sampleSize: "Full History", methodology: "Continuous drawdown series", source: "Demonstration dataset", dataStatus: "ILLUSTRATIVE DATA" },
      { question: `How long did recovery take after previous major market corrections?`, queryType: "RECOVERY_DURATION", entity: sym, dateRange: "Listing-Present", filters: "corrections", calculation: "AVG(recovery_time)", result: "Recovery time calculated across historical cycles", sampleSize: "Multi-cycle", methodology: "Peak recovery duration", source: "Demonstration dataset", dataStatus: "ILLUSTRATIVE DATA" },
      { question: `How often has ${sym} outperformed the Sensex over 3-year periods?`, queryType: "ROLLING_ALPHA", entity: sym, dateRange: "Listing-Present", filters: "rolling_window=3Y", calculation: "COUNT(alpha > 0)", result: "Excess return frequency calculated", sampleSize: "Rolling Periods", methodology: "Rolling CAGR vs Sensex", source: "Demonstration dataset", dataStatus: "ILLUSTRATIVE DATA" },
      { question: `What happened after historic bonus issues and stock splits?`, queryType: "EVENT_STUDY", entity: sym, dateRange: "Listing-Present", filters: "event_type in ('BONUS', 'SPLIT')", calculation: "FWD_RETURN_DISTRIBUTION", result: "Event distribution model available", sampleSize: "Corporate Action History", methodology: "Post-event return window", source: "Demonstration dataset", dataStatus: "ILLUSTRATIVE DATA" },
    ],
  };
};

// ============================================================================
// STOCKS PAGE COMPONENT (/stocks)
// ============================================================================
export const Stocks: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSector, setSelectedSector] = useState("ALL");
  const navigate = useNavigate();

  interface VerifiedStockRow {
    instrument_id: string;
    ticker: string;
    trade_date: string;
    open: string | number;
    high: string | number;
    low: string | number;
    close: string | number;
    volume: string | number;
  }

  type VerifiedStocksStatus = "loading" | "empty" | "ready" | "error";

  const [verifiedStocksStatus, setVerifiedStocksStatus] = useState<VerifiedStocksStatus>("loading");
  const [verifiedStocksError, setVerifiedStocksError] = useState<string | null>(null);
  const [verifiedStocks, setVerifiedStocks] = useState<VerifiedStockRow[]>([]);

  useEffect(() => {
    let cancelled = false;

    const fetchVerifiedStocks = async () => {
      setVerifiedStocksStatus("loading");
      setVerifiedStocksError(null);

      try {
        const { data: instrumentRows, error: instrumentError } = await supabase
          .from("instruments")
          .select("instrument_id, listing_id, ticker");

        if (instrumentError) throw instrumentError;
        if (cancelled) return;

        const instruments = (instrumentRows ?? []) as { instrument_id: string; listing_id: string; ticker: string }[];

        if (instruments.length === 0) {
          setVerifiedStocks([]);
          setVerifiedStocksStatus("empty");
          return;
        }

        const rows = await Promise.all(
          instruments.map(async (instrument) => {
            const { data: priceRows, error: priceError } = await supabase
              .from("prices")
              .select("trade_date, open, high, low, close, volume")
              .eq("instrument_id", instrument.instrument_id)
              .order("trade_date", { ascending: false })
              .limit(1);

            if (priceError) throw priceError;

            const priceRow = priceRows?.[0] as
              | { trade_date: string; open: string | number; high: string | number; low: string | number; close: string | number; volume: string | number }
              | undefined;

            if (!priceRow) return null;

            return {
              instrument_id: instrument.instrument_id,
              ticker: instrument.ticker,
              trade_date: priceRow.trade_date,
              open: priceRow.open,
              high: priceRow.high,
              low: priceRow.low,
              close: priceRow.close,
              volume: priceRow.volume,
            } as VerifiedStockRow;
          })
        );

        if (cancelled) return;

        const withPrices = rows.filter((row): row is VerifiedStockRow => row !== null);
        setVerifiedStocks(withPrices);
        setVerifiedStocksStatus(withPrices.length === 0 ? "empty" : "ready");
      } catch (err) {
        if (!cancelled) {
          const message = err && typeof err === "object" && "message" in err
            ? String((err as { message: unknown }).message)
            : "Failed to load verified database stock data.";
          setVerifiedStocksError(message);
          setVerifiedStocksStatus("error");
        }
      }
    };

    fetchVerifiedStocks();
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    document.title = "Indian Stock Explorer | Sensex.money";
  }, []);

  const sectors = useMemo(() => {
    const s = new Set<string>();
    STOCK_UNIVERSE.forEach((item) => s.add(item.sector));
    return ["ALL", ...Array.from(s)];
  }, []);

  const filteredStocks = useMemo(() => {
    return STOCK_UNIVERSE.filter((stock) => {
      const matchesQuery =
        stock.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        stock.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
        stock.sector.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesSector = selectedSector === "ALL" || stock.sector === selectedSector;
      return matchesQuery && matchesSector;
    });
  }, [searchQuery, selectedSector]);

  return (
    <div style={sharedStyles.root}>
      <GlobalHeader />

      <main>
        {/* ------------------------------------------------------------------ */}
        {/* 1. STOCK EXPLORER HEADER & SEARCH                                 */}
        {/* ------------------------------------------------------------------ */}
        <section style={{ padding: "48px 0 32px", borderBottom: "1px solid rgba(255, 255, 255, 0.06)" }}>
          <div style={sharedStyles.container}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "16px", marginBottom: "20px" }}>
              <div>
                <div style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  padding: "3px 8px",
                  borderRadius: "4px",
                  backgroundColor: "rgba(56, 189, 248, 0.08)",
                  border: "1px solid rgba(56, 189, 248, 0.22)",
                  color: "#38bdf8",
                  fontSize: "11px",
                  fontWeight: 600,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  fontFamily: '"SF Mono", "JetBrains Mono", Menlo, monospace',
                  marginBottom: "10px",
                }}>
                  <Dna size={13} />
                  <span>STOCK EXPLORER</span>
                </div>
                <h1 style={{ fontSize: "clamp(26px, 3.8vw, 42px)", fontWeight: 800, letterSpacing: "-0.03em", color: "#ffffff", margin: "0 0 10px 0", lineHeight: 1.2 }}>
                  Understand a company beyond its current price.
                </h1>
                <p style={{ fontSize: "15px", color: "#94a3b8", maxWidth: "760px", margin: 0, lineHeight: 1.55 }}>
                  Explore price history, returns, corporate actions, drawdowns, valuation context and company behaviour across market regimes.
                </p>
              </div>

              <div style={{
                backgroundColor: "rgba(245, 158, 11, 0.08)",
                border: "1px solid rgba(245, 158, 11, 0.25)",
                padding: "10px 14px",
                borderRadius: "6px",
                maxWidth: "320px",
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "#f59e0b", fontSize: "11px", fontWeight: 700, fontFamily: '"SF Mono", "JetBrains Mono", monospace', letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "4px" }}>
                  <Info size={13} />
                  <span>ILLUSTRATIVE DATA</span>
                </div>
                <div style={{ fontSize: "11px", color: "#94a3b8", lineHeight: 1.4 }}>
                  Company profiles and metrics shown are demonstration datasets and do not represent live market quotes.
                </div>
              </div>
            </div>

            {/* Prominent Search Bar */}
            <div style={{
              backgroundColor: "#0d1527",
              border: "1px solid rgba(255, 255, 255, 0.12)",
              borderRadius: "8px",
              padding: "16px 20px",
              marginTop: "24px",
            }}>
              <div style={{ fontSize: "13px", fontWeight: 600, color: "#cbd5e1", marginBottom: "10px" }}>
                Find a company. Then investigate its history.
              </div>

              <div style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                backgroundColor: "#070b14",
                border: "1px solid rgba(56, 189, 248, 0.3)",
                borderRadius: "6px",
                padding: "8px 14px",
              }}>
                <Search size={16} style={{ color: "#38bdf8", flexShrink: 0 }} />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search company, symbol or sector... (e.g. Infosys, TCS, Reliance, HDFC Bank)"
                  style={{
                    backgroundColor: "transparent",
                    border: "none",
                    outline: "none",
                    color: "#ffffff",
                    fontSize: "14px",
                    width: "100%",
                    fontFamily: "inherit",
                  }}
                  autoFocus
                />
                <span style={sharedStyles.kbd}>⌘K</span>
              </div>

              {/* Sector Filter Chips */}
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginTop: "14px", flexWrap: "wrap" }}>
                <span style={{ fontSize: "11px", color: "#64748b", fontFamily: '"SF Mono", "JetBrains Mono", monospace', textTransform: "uppercase" }}>Filter:</span>
                {sectors.map((sec) => (
                  <button
                    key={sec}
                    type="button"
                    onClick={() => setSelectedSector(sec)}
                    style={{
                      padding: "3px 9px",
                      borderRadius: "4px",
                      fontSize: "11px",
                      fontWeight: 600,
                      fontFamily: '"SF Mono", "JetBrains Mono", monospace',
                      cursor: "pointer",
                      border: selectedSector === sec ? "1px solid rgba(56, 189, 248, 0.5)" : "1px solid rgba(255, 255, 255, 0.08)",
                      backgroundColor: selectedSector === sec ? "rgba(56, 189, 248, 0.15)" : "rgba(255, 255, 255, 0.03)",
                      color: selectedSector === sec ? "#38bdf8" : "#94a3b8",
                      transition: "all 0.15s ease",
                    }}
                  >
                    {sec}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ------------------------------------------------------------------ */}
        {/* 1.5 VERIFIED DATABASE DATA                                         */}
        {/* ------------------------------------------------------------------ */}
        <section style={{ padding: "24px 0", borderBottom: "1px solid rgba(255, 255, 255, 0.05)" }}>
          <div style={sharedStyles.container}>
            <div style={{
              backgroundColor: "#0d1527",
              border: "1px solid rgba(16, 185, 129, 0.28)",
              borderRadius: "8px",
              padding: "20px",
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "#10b981", fontSize: "11px", fontWeight: 700, fontFamily: '"SF Mono", "JetBrains Mono", monospace', letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "10px" }}>
                <CheckCircle2 size={13} />
                <span>VERIFIED DATABASE DATA</span>
              </div>

              {verifiedStocksStatus === "loading" && (
                <div style={{ fontSize: "13px", color: "#94a3b8" }}>Loading verified database stock data…</div>
              )}

              {verifiedStocksStatus === "empty" && (
                <div style={{ fontSize: "13px", color: "#94a3b8" }}>No verified database stock data available.</div>
              )}

              {verifiedStocksStatus === "error" && (
                <div style={{ fontSize: "13px", color: "#f87171" }}>
                  Unable to load verified database stock data: {verifiedStocksError}
                </div>
              )}

              {verifiedStocksStatus === "ready" && verifiedStocks.length > 0 && (
                <div style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
                  gap: "12px",
                }}>
                  {verifiedStocks.map((row) => (
                    <Link
                      key={row.instrument_id}
                      to={`/stocks/${row.ticker}`}
                      style={{
                        backgroundColor: "#0b1220",
                        border: "1px solid rgba(255, 255, 255, 0.08)",
                        borderRadius: "6px",
                        padding: "14px 16px",
                        textDecoration: "none",
                        display: "block",
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: "8px" }}>
                        <div style={{ fontSize: "15px", fontWeight: 700, color: "#ffffff" }}>{row.ticker}</div>
                        <div style={{ fontSize: "18px", fontWeight: 800, color: "#10b981", fontFamily: '"SF Mono", "JetBrains Mono", monospace' }}>
                          {row.close}
                        </div>
                      </div>
                      <div style={{ fontSize: "11px", color: "#64748b", marginBottom: "8px" }}>as of {row.trade_date}</div>
                      <div style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(4, 1fr)",
                        gap: "6px",
                      }}>
                        <div>
                          <div style={{ fontSize: "9px", color: "#64748b" }}>OPEN</div>
                          <div style={{ fontSize: "12px", fontWeight: 700, color: "#cbd5e1", fontFamily: '"SF Mono", "JetBrains Mono", monospace' }}>{row.open}</div>
                        </div>
                        <div>
                          <div style={{ fontSize: "9px", color: "#64748b" }}>HIGH</div>
                          <div style={{ fontSize: "12px", fontWeight: 700, color: "#cbd5e1", fontFamily: '"SF Mono", "JetBrains Mono", monospace' }}>{row.high}</div>
                        </div>
                        <div>
                          <div style={{ fontSize: "9px", color: "#64748b" }}>LOW</div>
                          <div style={{ fontSize: "12px", fontWeight: 700, color: "#cbd5e1", fontFamily: '"SF Mono", "JetBrains Mono", monospace' }}>{row.low}</div>
                        </div>
                        <div>
                          <div style={{ fontSize: "9px", color: "#64748b" }}>VOLUME</div>
                          <div style={{ fontSize: "12px", fontWeight: 700, color: "#cbd5e1", fontFamily: '"SF Mono", "JetBrains Mono", monospace' }}>{row.volume}</div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>

        {/* ------------------------------------------------------------------ */}
        {/* 2. POPULAR COMPANIES DIRECTORY                                     */}
        {/* ------------------------------------------------------------------ */}
        <section style={{ padding: "40px 0", borderBottom: "1px solid rgba(255, 255, 255, 0.05)" }}>
          <div style={sharedStyles.container}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "20px" }}>
              <div>
                <h2 style={{ fontSize: "20px", fontWeight: 700, color: "#ffffff", letterSpacing: "-0.02em", margin: "0 0 4px 0" }}>
                  {searchQuery ? `Matching Companies (${filteredStocks.length})` : "Popular Companies"}
                </h2>
                <span style={{ fontSize: "13px", color: "#64748b" }}>
                  Select any company to investigate its longitudinal price history, corporate actions and regime behaviour.
                </span>
              </div>
              <span style={{ fontSize: "11px", fontFamily: '"SF Mono", "JetBrains Mono", monospace', color: "#64748b" }}>
                POINT-IN-TIME LEDGER
              </span>
            </div>

            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: "16px",
            }}>
              {filteredStocks.map((stock) => (
                <Link
                  key={stock.symbol}
                  to={`/stocks/${stock.symbol}`}
                  style={{
                    backgroundColor: "#0b1220",
                    border: "1px solid rgba(255, 255, 255, 0.08)",
                    borderRadius: "8px",
                    padding: "20px",
                    textDecoration: "none",
                    color: "inherit",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                  }}
                  className="product-card-hover"
                >
                  <div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "10px" }}>
                      <div>
                        <div style={{ fontSize: "16px", fontWeight: 700, color: "#ffffff" }}>{stock.symbol}</div>
                        <div style={{ fontSize: "13px", color: "#cbd5e1", fontWeight: 500 }}>{stock.name}</div>
                      </div>
                      <span style={{
                        fontSize: "10px",
                        padding: "2px 6px",
                        borderRadius: "4px",
                        backgroundColor: "rgba(56, 189, 248, 0.1)",
                        color: "#38bdf8",
                        border: "1px solid rgba(56, 189, 248, 0.2)",
                        fontFamily: '"SF Mono", "JetBrains Mono", monospace',
                        fontWeight: 600,
                      }}>
                        {stock.exchange}
                      </span>
                    </div>

                    <div style={{ fontSize: "12px", color: "#64748b", marginBottom: "14px" }}>
                      {stock.sector}
                    </div>

                    {/* Metric Row */}
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "12px", padding: "10px 12px", backgroundColor: "#070b14", borderRadius: "6px", border: "1px solid rgba(255, 255, 255, 0.04)" }}>
                      <div>
                        <div style={{ fontSize: "10px", color: "#64748b" }}>ILLUSTRATIVE PRICE</div>
                        <div style={{ fontSize: "16px", fontWeight: 700, color: "#ffffff", fontFamily: '"SF Mono", "JetBrains Mono", monospace' }}>
                          {stock.price}
                        </div>
                      </div>
                      <div style={{ textAlign: "right" }}>
                        <div style={{ fontSize: "10px", color: "#64748b" }}>1Y RETURN</div>
                        <div style={{ fontSize: "14px", fontWeight: 600, color: "#10b981", fontFamily: '"SF Mono", "JetBrains Mono", monospace' }}>
                          {stock.return1Y}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div style={{
                    paddingTop: "10px",
                    borderTop: "1px solid rgba(255, 255, 255, 0.06)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    fontSize: "11px",
                    color: "#94a3b8",
                  }}>
                    <span style={{ fontSize: "10px", color: "#cbd5e1", fontFamily: '"SF Mono", "JetBrains Mono", monospace' }}>
                      HISTORICAL RECORD: <span style={{ color: "#38bdf8" }}>{stock.historicalRecord}</span>
                    </span>
                    <div style={{ display: "flex", alignItems: "center", gap: "4px", color: "#38bdf8", fontWeight: 600, flexShrink: 0 }}>
                      <span>Investigate</span>
                      <ArrowRight size={13} />
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {filteredStocks.length === 0 && (
              <div style={{ padding: "40px 20px", textAlign: "center", backgroundColor: "#0b1220", borderRadius: "8px", border: "1px solid rgba(255, 255, 255, 0.06)" }}>
                <HelpCircle size={24} style={{ color: "#64748b", margin: "0 auto 10px" }} />
                <div style={{ fontSize: "15px", fontWeight: 600, color: "#ffffff", marginBottom: "4px" }}>No matching companies found in local demo dataset</div>
                <div style={{ fontSize: "13px", color: "#94a3b8" }}>Try searching for &ldquo;Infosys&rdquo;, &ldquo;TCS&rdquo;, &ldquo;Reliance&rdquo;, &ldquo;HDFC Bank&rdquo; or &ldquo;ITC&rdquo;.</div>
              </div>
            )}
          </div>
        </section>

        {/* ------------------------------------------------------------------ */}
        {/* 3. PRODUCT PRINCIPLE CALLOUT & SURVIVORSHIP NOTE                   */}
        {/* ------------------------------------------------------------------ */}
        <section style={{ padding: "48px 0 60px" }}>
          <div style={sharedStyles.container}>
            <div style={{
              backgroundColor: "#0d1629",
              border: "1px solid rgba(56, 189, 248, 0.2)",
              borderRadius: "8px",
              padding: "28px",
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
              gap: "24px",
            }}>
              <div>
                <div style={{ fontSize: "11px", fontWeight: 700, color: "#38bdf8", letterSpacing: "0.1em", textTransform: "uppercase", fontFamily: '"SF Mono", "JetBrains Mono", monospace', marginBottom: "8px" }}>
                  SENSEX.MONEY RESEARCH PIPELINE
                </div>
                <h3 style={{ fontSize: "18px", fontWeight: 700, color: "#ffffff", margin: "0 0 10px 0" }}>
                  PRICE → HISTORY → EVENTS → RETURNS → DRAWDOWNS → REGIMES → COMPANY DNA
                </h3>
                <p style={{ fontSize: "13px", color: "#94a3b8", lineHeight: 1.55, margin: 0 }}>
                  We treat equities as longitudinal corporate records rather than volatile ticker symbols. Every company is profiled through its full survival history, capital restructuring events, and drawdown recoveries.
                </p>
              </div>

              <div style={{ backgroundColor: "#070b14", borderRadius: "6px", padding: "18px", border: "1px solid rgba(255, 255, 255, 0.06)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "#e2b357", fontSize: "11px", fontWeight: 700, fontFamily: '"SF Mono", "JetBrains Mono", monospace', textTransform: "uppercase", marginBottom: "8px" }}>
                  <AlertTriangle size={14} />
                  <span>SURVIVORSHIP BIAS WARNING</span>
                </div>
                <p style={{ fontSize: "12px", color: "#94a3b8", lineHeight: 1.5, margin: 0 }}>
                  Historical stock research can suffer from survivorship bias when delisted or merged entities disappear from databases. Sensex.money is designed to preserve security identity, ISIN continuity, and corporate lineage across all Indian market cycles.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <GlobalFooter />
    </div>
  );
};

// ============================================================================
// COMPANY / STOCK PROFILE COMPONENT (/stocks/:symbol)
// ============================================================================
export const Company: React.FC = () => {
  const { symbol } = useParams<{ symbol?: string }>();
  const [activeChartTimeframe, setActiveChartTimeframe] = useState("1Y");
  const [simAmount, setSimAmount] = useState("100000");
  const [simQuestionAnswer, setSimQuestionAnswer] = useState<string | null>(null);

  const profile = useMemo(() => getCompanyProfile(symbol || "INFY"), [symbol]);

  interface VerifiedCompanyIdentity {
    ticker: string;
    issuerName: string;
    trade_date: string;
    open: string | number;
    high: string | number;
    low: string | number;
    close: string | number;
    adj_close: string | number;
    volume: string | number;
    source: string;
  }

  type VerifiedStatus = "loading" | "no_identity" | "no_price" | "ready" | "error";

  const [verifiedStatus, setVerifiedStatus] = useState<VerifiedStatus>("loading");
  const [verifiedError, setVerifiedError] = useState<string | null>(null);
  const [verifiedData, setVerifiedData] = useState<VerifiedCompanyIdentity | null>(null);

  useEffect(() => {
    let cancelled = false;
    const requestedTicker = (symbol || "").toUpperCase();

    const fetchVerifiedIdentity = async () => {
      setVerifiedStatus("loading");
      setVerifiedError(null);
      setVerifiedData(null);

      if (!requestedTicker) {
        if (!cancelled) setVerifiedStatus("no_identity");
        return;
      }

      try {
        const { data: instrumentRows, error: instrumentError } = await supabase
          .from("instruments")
          .select("instrument_id, listing_id, ticker")
          .eq("ticker", requestedTicker)
          .limit(1);

        if (instrumentError) throw instrumentError;
        if (cancelled) return;

        const instrumentRow = instrumentRows?.[0] as
          | { instrument_id: string; listing_id: string; ticker: string }
          | undefined;

        if (!instrumentRow) {
          setVerifiedStatus("no_identity");
          return;
        }

        const { data: listingRows, error: listingError } = await supabase
          .from("listings")
          .select("security_id")
          .eq("listing_id", instrumentRow.listing_id)
          .limit(1);

        if (listingError) throw listingError;
        if (cancelled) return;

        const listingRow = listingRows?.[0] as { security_id: string } | undefined;

        const { data: securityRows, error: securityError } = listingRow
          ? await supabase
              .from("securities")
              .select("issuer_id")
              .eq("security_id", listingRow.security_id)
              .limit(1)
          : { data: null, error: null };

        if (securityError) throw securityError;
        if (cancelled) return;

        const securityRow = securityRows?.[0] as { issuer_id: string } | undefined;

        const { data: issuerRows, error: issuerError } = securityRow
          ? await supabase
              .from("issuers")
              .select("legal_name")
              .eq("issuer_id", securityRow.issuer_id)
              .limit(1)
          : { data: null, error: null };

        if (issuerError) throw issuerError;
        if (cancelled) return;

        const issuerRow = issuerRows?.[0] as { legal_name: string } | undefined;

        const { data: priceRows, error: priceError } = await supabase
          .from("prices")
          .select("trade_date, open, high, low, close, adj_close, volume, source")
          .eq("instrument_id", instrumentRow.instrument_id)
          .order("trade_date", { ascending: false })
          .limit(1);

        if (priceError) throw priceError;
        if (cancelled) return;

        const priceRow = priceRows?.[0] as
          | {
              trade_date: string;
              open: string | number;
              high: string | number;
              low: string | number;
              close: string | number;
              adj_close: string | number;
              volume: string | number;
              source: string;
            }
          | undefined;

        if (!priceRow) {
          setVerifiedStatus("no_price");
          return;
        }

        setVerifiedData({
          ticker: instrumentRow.ticker,
          issuerName: issuerRow?.legal_name ?? "Unknown Issuer",
          trade_date: priceRow.trade_date,
          open: priceRow.open,
          high: priceRow.high,
          low: priceRow.low,
          close: priceRow.close,
          adj_close: priceRow.adj_close,
          volume: priceRow.volume,
          source: priceRow.source,
        });
        setVerifiedStatus("ready");
      } catch (err) {
        if (!cancelled) {
          const message = err && typeof err === "object" && "message" in err
            ? String((err as { message: unknown }).message)
            : "Failed to load verified database identity.";
          setVerifiedError(message);
          setVerifiedStatus("error");
        }
      }
    };

    fetchVerifiedIdentity();
    return () => { cancelled = true; };
  }, [symbol]);

  useEffect(() => {
    document.title = `${profile.name} (${profile.symbol}) Historical Analysis | Sensex.money`;
  }, [profile]);

  const activeSeries = profile.chartSeries[activeChartTimeframe] || profile.chartSeries["1Y"];

  return (
    <div style={sharedStyles.root}>
      <GlobalHeader />

      <main>
        {/* ------------------------------------------------------------------ */}
        {/* 1. STOCK HEADER & BREADCRUMBS                                      */}
        {/* ------------------------------------------------------------------ */}
        <section style={{ padding: "36px 0 24px", borderBottom: "1px solid rgba(255, 255, 255, 0.06)" }}>
          <div style={sharedStyles.container}>
            {/* Breadcrumb */}
            <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "12px", color: "#64748b", marginBottom: "14px" }}>
              <Link to="/stocks" style={{ color: "#94a3b8", textDecoration: "none" }}>Stocks</Link>
              <ChevronRight size={13} />
              <span style={{ color: "#ffffff", fontWeight: 600 }}>{profile.symbol}</span>
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "20px" }}>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "4px" }}>
                  <h1 style={{ fontSize: "clamp(26px, 3.5vw, 36px)", fontWeight: 800, color: "#ffffff", margin: 0, letterSpacing: "-0.02em" }}>
                    {profile.name}
                  </h1>
                  <span style={{
                    fontSize: "12px",
                    fontWeight: 700,
                    fontFamily: '"SF Mono", "JetBrains Mono", monospace',
                    padding: "3px 8px",
                    borderRadius: "4px",
                    backgroundColor: "rgba(56, 189, 248, 0.12)",
                    color: "#38bdf8",
                    border: "1px solid rgba(56, 189, 248, 0.25)",
                  }}>
                    {profile.symbol} · {profile.exchange}
                  </span>
                </div>

                <div style={{ fontSize: "13px", color: "#94a3b8", display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap" }}>
                  <span>Sector: <strong style={{ color: "#cbd5e1" }}>{profile.sector}</strong></span>
                  <span>•</span>
                  <span>ISIN: <span style={{ fontFamily: '"SF Mono", "JetBrains Mono", monospace' }}>{profile.isin}</span></span>
                  <span>•</span>
                  <span>M-Cap: <span style={{ fontFamily: '"SF Mono", "JetBrains Mono", monospace' }}>{profile.mCap}</span></span>
                  <span>•</span>
                  <span style={{ color: "#38bdf8", fontFamily: '"SF Mono", "JetBrains Mono", monospace', fontSize: "12px" }}>HISTORICAL RECORD: {profile.historicalRecordLabel}</span>
                </div>
              </div>

              {/* Price & Confidence Badges */}
              <div style={{ textAlign: "right" }}>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "2px", marginBottom: "4px" }}>
                  <span style={{
                    fontSize: "11px",
                    padding: "3px 8px",
                    borderRadius: "4px",
                    backgroundColor: "rgba(245, 158, 11, 0.12)",
                    border: "1px solid rgba(245, 158, 11, 0.3)",
                    color: "#f59e0b",
                    fontFamily: '"SF Mono", "JetBrains Mono", monospace',
                    fontWeight: 700,
                    letterSpacing: "0.06em",
                  }}>
                    {profile.dataStatus}
                  </span>
                  <span style={{
                    fontSize: "10px",
                    color: "#94a3b8",
                    fontFamily: '"SF Mono", "JetBrains Mono", monospace',
                  }}>
                    {profile.dataStatusSubtitle}
                  </span>
                </div>

                <div style={{ display: "flex", alignItems: "baseline", justifyContent: "flex-end", gap: "10px" }}>
                  <div style={{ fontSize: "28px", fontWeight: 800, fontFamily: '"SF Mono", "JetBrains Mono", monospace', color: "#ffffff" }}>
                    {profile.price}
                  </div>
                  <div style={{ fontSize: "14px", fontWeight: 600, color: profile.isPositive ? "#10b981" : "#f43f5e", fontFamily: '"SF Mono", "JetBrains Mono", monospace' }}>
                    {profile.pctChange1D} ({profile.change1D})
                  </div>
                </div>
              </div>
            </div>

            {/* Timeframe Returns Row */}
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(110px, 1fr))",
              gap: "8px",
              marginTop: "20px",
              backgroundColor: "#0b1220",
              padding: "12px 16px",
              borderRadius: "6px",
              border: "1px solid rgba(255, 255, 255, 0.06)",
            }}>
              <div>
                <div style={{ fontSize: "10px", color: "#64748b" }}>1 DAY</div>
                <div style={{ fontSize: "13px", fontWeight: 700, color: profile.isPositive ? "#10b981" : "#f43f5e", fontFamily: '"SF Mono", "JetBrains Mono", monospace' }}>{profile.timeframeReturns.d1}</div>
              </div>
              <div>
                <div style={{ fontSize: "10px", color: "#64748b" }}>1 WEEK</div>
                <div style={{ fontSize: "13px", fontWeight: 700, color: "#10b981", fontFamily: '"SF Mono", "JetBrains Mono", monospace' }}>{profile.timeframeReturns.w1}</div>
              </div>
              <div>
                <div style={{ fontSize: "10px", color: "#64748b" }}>1 MONTH</div>
                <div style={{ fontSize: "13px", fontWeight: 700, color: "#10b981", fontFamily: '"SF Mono", "JetBrains Mono", monospace' }}>{profile.timeframeReturns.m1}</div>
              </div>
              <div>
                <div style={{ fontSize: "10px", color: "#64748b" }}>1 YEAR</div>
                <div style={{ fontSize: "13px", fontWeight: 700, color: "#10b981", fontFamily: '"SF Mono", "JetBrains Mono", monospace' }}>{profile.timeframeReturns.y1}</div>
              </div>
              <div>
                <div style={{ fontSize: "10px", color: "#64748b" }}>5 YEAR</div>
                <div style={{ fontSize: "13px", fontWeight: 700, color: "#10b981", fontFamily: '"SF Mono", "JetBrains Mono", monospace' }}>{profile.timeframeReturns.y5}</div>
              </div>
              <div>
                <div style={{ fontSize: "10px", color: "#64748b" }}>MAX (SINCE LISTING)</div>
                <div style={{ fontSize: "13px", fontWeight: 700, color: "#10b981", fontFamily: '"SF Mono", "JetBrains Mono", monospace' }}>{profile.timeframeReturns.max}</div>
              </div>
            </div>
          </div>
        </section>

        {/* ------------------------------------------------------------------ */}
        {/* 1.5 VERIFIED DATABASE DATA                                         */}
        {/* ------------------------------------------------------------------ */}
        <section style={{ padding: "24px 0", borderBottom: "1px solid rgba(255, 255, 255, 0.05)" }}>
          <div style={sharedStyles.container}>
            <div style={{
              backgroundColor: "#0d1527",
              border: "1px solid rgba(16, 185, 129, 0.28)",
              borderRadius: "8px",
              padding: "20px",
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "#10b981", fontSize: "11px", fontWeight: 700, fontFamily: '"SF Mono", "JetBrains Mono", monospace', letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "10px" }}>
                <CheckCircle2 size={13} />
                <span>VERIFIED DATABASE DATA</span>
              </div>

              {verifiedStatus === "loading" && (
                <div style={{ fontSize: "13px", color: "#94a3b8" }}>Loading verified database identity…</div>
              )}

              {verifiedStatus === "no_identity" && (
                <div style={{ fontSize: "13px", color: "#94a3b8" }}>No verified database identity found for this ticker.</div>
              )}

              {verifiedStatus === "no_price" && (
                <div style={{ fontSize: "13px", color: "#94a3b8" }}>No verified price data available for this instrument.</div>
              )}

              {verifiedStatus === "error" && (
                <div style={{ fontSize: "13px", color: "#f87171" }}>
                  Unable to load verified database data: {verifiedError}
                </div>
              )}

              {verifiedStatus === "ready" && verifiedData && (
                <div>
                  <div style={{ display: "flex", alignItems: "baseline", gap: "16px", flexWrap: "wrap", marginBottom: "14px" }}>
                    <div>
                      <div style={{ fontSize: "16px", fontWeight: 700, color: "#ffffff" }}>{verifiedData.ticker}</div>
                      <div style={{ fontSize: "11px", color: "#64748b" }}>{verifiedData.issuerName}</div>
                    </div>
                    <div style={{ fontSize: "24px", fontWeight: 800, color: "#10b981", fontFamily: '"SF Mono", "JetBrains Mono", monospace' }}>
                      {verifiedData.close}
                    </div>
                    <div style={{ fontSize: "12px", color: "#64748b" }}>
                      as of {verifiedData.trade_date}
                    </div>
                  </div>
                  <div style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(90px, 1fr))",
                    gap: "8px",
                  }}>
                    <div>
                      <div style={{ fontSize: "10px", color: "#64748b" }}>OPEN</div>
                      <div style={{ fontSize: "13px", fontWeight: 700, color: "#cbd5e1", fontFamily: '"SF Mono", "JetBrains Mono", monospace' }}>{verifiedData.open}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: "10px", color: "#64748b" }}>HIGH</div>
                      <div style={{ fontSize: "13px", fontWeight: 700, color: "#cbd5e1", fontFamily: '"SF Mono", "JetBrains Mono", monospace' }}>{verifiedData.high}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: "10px", color: "#64748b" }}>LOW</div>
                      <div style={{ fontSize: "13px", fontWeight: 700, color: "#cbd5e1", fontFamily: '"SF Mono", "JetBrains Mono", monospace' }}>{verifiedData.low}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: "10px", color: "#64748b" }}>ADJ. CLOSE</div>
                      <div style={{ fontSize: "13px", fontWeight: 700, color: "#cbd5e1", fontFamily: '"SF Mono", "JetBrains Mono", monospace' }}>{verifiedData.adj_close}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: "10px", color: "#64748b" }}>VOLUME</div>
                      <div style={{ fontSize: "13px", fontWeight: 700, color: "#cbd5e1", fontFamily: '"SF Mono", "JetBrains Mono", monospace' }}>{verifiedData.volume}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: "10px", color: "#64748b" }}>SOURCE</div>
                      <div style={{ fontSize: "13px", fontWeight: 700, color: "#cbd5e1", fontFamily: '"SF Mono", "JetBrains Mono", monospace' }}>{verifiedData.source}</div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* ------------------------------------------------------------------ */}
        {/* 2. PRICE CHART SECTION                                             */}
        {/* ------------------------------------------------------------------ */}
        <section style={{ padding: "32px 0", borderBottom: "1px solid rgba(255, 255, 255, 0.05)" }}>
          <div style={sharedStyles.container}>
            <div style={{
              backgroundColor: "#0b1220",
              border: "1px solid rgba(255, 255, 255, 0.08)",
              borderRadius: "8px",
              padding: "24px",
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px", flexWrap: "wrap", gap: "10px" }}>
                <div>
                  <div style={{ fontSize: "11px", fontWeight: 700, color: "#38bdf8", letterSpacing: "0.1em", textTransform: "uppercase", fontFamily: '"SF Mono", "JetBrains Mono", monospace' }}>
                    HISTORICAL PRICE SERIES
                  </div>
                  <div style={{ fontSize: "13px", color: "#94a3b8" }}>
                    Demonstration historical series ({activeChartTimeframe} Horizon • Range: {activeSeries.low} — {activeSeries.high})
                  </div>
                </div>

                {/* Timeframe selector */}
                <div style={{ display: "flex", gap: "4px", backgroundColor: "#070b14", padding: "3px", borderRadius: "6px", border: "1px solid rgba(255, 255, 255, 0.08)" }}>
                  {["1D", "1M", "1Y", "5Y", "MAX"].map((tf) => (
                    <button
                      key={tf}
                      type="button"
                      onClick={() => setActiveChartTimeframe(tf)}
                      style={{
                        padding: "4px 10px",
                        borderRadius: "4px",
                        border: "none",
                        fontSize: "11px",
                        fontWeight: 700,
                        fontFamily: '"SF Mono", "JetBrains Mono", monospace',
                        backgroundColor: activeChartTimeframe === tf ? "#38bdf8" : "transparent",
                        color: activeChartTimeframe === tf ? "#070b14" : "#94a3b8",
                        cursor: "pointer",
                        transition: "all 0.15s ease",
                      }}
                    >
                      {tf}
                    </button>
                  ))}
                </div>
              </div>

              {/* SVG Price Chart Box */}
              <div style={{
                height: "220px",
                width: "100%",
                backgroundColor: "#070b14",
                borderRadius: "6px",
                padding: "20px 10px",
                position: "relative",
                border: "1px solid rgba(255, 255, 255, 0.04)",
              }}>
                <svg viewBox="0 0 100 35" style={{ width: "100%", height: "100%", overflow: "visible" }} preserveAspectRatio="none">
                  {/* Grid Lines */}
                  <line x1="0" y1="8" x2="100" y2="8" stroke="rgba(255,255,255,0.05)" strokeDasharray="2,2" />
                  <line x1="0" y1="18" x2="100" y2="18" stroke="rgba(255,255,255,0.05)" strokeDasharray="2,2" />
                  <line x1="0" y1="28" x2="100" y2="28" stroke="rgba(255,255,255,0.05)" strokeDasharray="2,2" />

                  {/* Polyline series */}
                  <polyline
                    fill="none"
                    stroke="#38bdf8"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    points={activeSeries.points}
                  />
                </svg>

                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "11px", color: "#64748b", fontFamily: '"SF Mono", "JetBrains Mono", monospace', marginTop: "6px" }}>
                  <span>Low: {activeSeries.low}</span>
                  <span>{activeChartTimeframe} Change: <strong style={{ color: activeSeries.isPositive ? "#10b981" : "#f43f5e" }}>{activeSeries.change}</strong></span>
                  <span>High: {activeSeries.high}</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ------------------------------------------------------------------ */}
        {/* 3. COMPANY HISTORY (MOST IMPORTANT SECTION)                        */}
        {/* ------------------------------------------------------------------ */}
        <section style={{ padding: "40px 0", borderBottom: "1px solid rgba(255, 255, 255, 0.05)" }}>
          <div style={sharedStyles.container}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: "16px", marginBottom: "24px" }}>
              <div>
                <div style={{ fontSize: "11px", fontWeight: 700, color: "#e2b357", letterSpacing: "0.12em", textTransform: "uppercase", fontFamily: '"SF Mono", "JetBrains Mono", monospace', marginBottom: "6px" }}>
                  LONGITUDINAL LINEAGE
                </div>
                <h2 style={{ fontSize: "24px", fontWeight: 700, color: "#ffffff", margin: "0 0 4px 0", letterSpacing: "-0.02em" }}>
                  Company History
                </h2>
                <p style={{ fontSize: "14px", color: "#94a3b8", margin: 0 }}>
                  A company is more than its current market capitalisation. Track key incorporation, listing, and capital restructuring epochs.
                </p>
              </div>
              <span style={{
                fontSize: "10px",
                fontFamily: '"SF Mono", "JetBrains Mono", monospace',
                color: "#e2b357",
                backgroundColor: "rgba(226, 179, 87, 0.1)",
                border: "1px solid rgba(226, 179, 87, 0.25)",
                padding: "3px 8px",
                borderRadius: "4px",
                fontWeight: 600,
              }}>
                CHRONOLOGY
              </span>
            </div>

            {/* Horizontal Timeline Rail */}
            <div style={{
              display: "flex",
              gap: "16px",
              overflowX: "auto",
              paddingBottom: "14px",
              scrollbarWidth: "thin",
            }} className="custom-scroll">
              {profile.historyTimeline.map((item, idx) => (
                <div
                  key={item.year + item.title}
                  style={{
                    flex: "0 0 260px",
                    backgroundColor: "#0b1220",
                    border: "1px solid rgba(255, 255, 255, 0.08)",
                    borderRadius: "8px",
                    padding: "20px",
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
                    <div style={{ fontSize: "20px", fontWeight: 800, color: "#e2b357", fontFamily: '"SF Mono", "JetBrains Mono", monospace' }}>
                      {item.year}
                    </div>
                    <span style={{
                      fontSize: "9px",
                      fontFamily: '"SF Mono", "JetBrains Mono", monospace',
                      padding: "2px 5px",
                      borderRadius: "3px",
                      backgroundColor: "rgba(255, 255, 255, 0.05)",
                      color: item.eventType === "BUSINESS_EVENT" ? "#94a3b8" : "#38bdf8",
                      border: item.eventType === "BUSINESS_EVENT" ? "1px solid rgba(255, 255, 255, 0.1)" : "1px solid rgba(56, 189, 248, 0.2)",
                      textTransform: "uppercase",
                      fontWeight: 600,
                    }}>
                      {item.eventType.replace(/_/g, " ")}
                    </span>
                  </div>

                  <div style={{ fontSize: "14px", fontWeight: 700, color: "#ffffff", marginBottom: "6px" }}>
                    {item.title}
                  </div>
                  <p style={{ fontSize: "12px", color: "#94a3b8", lineHeight: 1.5, margin: 0, marginBottom: item.impact ? "10px" : "0" }}>
                    {item.description}
                  </p>

                  {item.impact && (
                    <div style={{ fontSize: "11px", color: "#38bdf8", fontWeight: 500, fontFamily: '"SF Mono", "JetBrains Mono", monospace' }}>
                      ↳ {item.impact}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ------------------------------------------------------------------ */}
        {/* 4. CORPORATE ACTIONS & RETURN ENGINE (GRID)                        */}
        {/* ------------------------------------------------------------------ */}
        <section style={{ padding: "40px 0", borderBottom: "1px solid rgba(255, 255, 255, 0.05)" }}>
          <div style={sharedStyles.container}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))", gap: "24px" }}>
              {/* Corporate Actions Ledger Panel */}
              <div style={{ backgroundColor: "#0b1220", border: "1px solid rgba(255, 255, 255, 0.08)", borderRadius: "8px", padding: "24px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "12px" }}>
                  <div>
                    <div style={{ fontSize: "11px", fontWeight: 700, color: "#f59e0b", letterSpacing: "0.1em", textTransform: "uppercase", fontFamily: '"SF Mono", "JetBrains Mono", monospace' }}>
                      POINT-IN-TIME LEDGER
                    </div>
                    <h3 style={{ fontSize: "20px", fontWeight: 700, color: "#ffffff", margin: "4px 0 0" }}>
                      Corporate Actions
                    </h3>
                  </div>
                  <span style={{ fontSize: "10px", padding: "2px 6px", borderRadius: "4px", backgroundColor: "rgba(245, 158, 11, 0.1)", color: "#f59e0b", border: "1px solid rgba(245, 158, 11, 0.25)", fontFamily: '"SF Mono", "JetBrains Mono", monospace', fontWeight: 600 }}>
                    EX-DATE AUDIT
                  </span>
                </div>

                <p style={{ fontSize: "12px", color: "#94a3b8", lineHeight: 1.5, marginBottom: "16px" }}>
                  Corporate-action-aware history prevents misleading comparisons across time.
                </p>

                {/* Table of Actions */}
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  {profile.corporateActions.map((action, i) => (
                    <div
                      key={action.eventId + i}
                      style={{
                        padding: "10px 12px",
                        backgroundColor: "#070b14",
                        borderRadius: "6px",
                        border: "1px solid rgba(255, 255, 255, 0.04)",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <div>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                          <span style={{
                            fontSize: "10px",
                            fontFamily: '"SF Mono", "JetBrains Mono", monospace',
                            fontWeight: 700,
                            padding: "2px 6px",
                            borderRadius: "3px",
                            backgroundColor: action.displayType === "Bonus" ? "rgba(16, 185, 129, 0.15)" : action.displayType === "Split" ? "rgba(56, 189, 248, 0.15)" : "rgba(245, 158, 11, 0.15)",
                            color: action.displayType === "Bonus" ? "#10b981" : action.displayType === "Split" ? "#38bdf8" : "#f59e0b",
                          }}>
                            {action.displayType}
                          </span>
                          <span style={{ fontSize: "12px", fontWeight: 600, color: "#ffffff" }}>{action.ratioOrAmount}</span>
                        </div>
                        <div style={{ fontSize: "11px", color: "#64748b", marginTop: "2px" }}>{action.impact}</div>
                      </div>

                      <div style={{ textAlign: "right" }}>
                        <div style={{ fontSize: "11px", color: "#94a3b8", fontFamily: '"SF Mono", "JetBrains Mono", monospace' }}>{action.exDate}</div>
                        <div style={{ fontSize: "9px", color: "#f59e0b", fontFamily: '"SF Mono", "JetBrains Mono", monospace' }}>{action.verificationStatus}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Return Engine Panel */}
              <div style={{ backgroundColor: "#0b1220", border: "1px solid rgba(255, 255, 255, 0.08)", borderRadius: "8px", padding: "24px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "12px" }}>
                  <div>
                    <div style={{ fontSize: "11px", fontWeight: 700, color: "#10b981", letterSpacing: "0.1em", textTransform: "uppercase", fontFamily: '"SF Mono", "JetBrains Mono", monospace' }}>
                      QUANTITATIVE PERFORMANCE
                    </div>
                    <h3 style={{ fontSize: "20px", fontWeight: 700, color: "#ffffff", margin: "4px 0 0" }}>
                      Return Engine
                    </h3>
                  </div>
                  <span style={{ fontSize: "10px", padding: "2px 6px", borderRadius: "4px", backgroundColor: "rgba(16, 185, 129, 0.1)", color: "#10b981", border: "1px solid rgba(16, 185, 129, 0.25)", fontFamily: '"SF Mono", "JetBrains Mono", monospace', fontWeight: 600 }}>
                    CAGR MATRIX
                  </span>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginBottom: "16px" }}>
                  <div style={{ padding: "10px", backgroundColor: "#070b14", borderRadius: "6px", border: "1px solid rgba(255, 255, 255, 0.04)" }}>
                    <div style={{ fontSize: "10px", color: "#64748b" }}>3Y PRICE CAGR</div>
                    <div style={{ fontSize: "18px", fontWeight: 700, color: "#10b981", fontFamily: '"SF Mono", "JetBrains Mono", monospace' }}>{profile.returnEngine.priceReturn.y3CAGR}</div>
                  </div>
                  <div style={{ padding: "10px", backgroundColor: "#070b14", borderRadius: "6px", border: "1px solid rgba(255, 255, 255, 0.04)" }}>
                    <div style={{ fontSize: "10px", color: "#64748b" }}>5Y PRICE CAGR</div>
                    <div style={{ fontSize: "18px", fontWeight: 700, color: "#10b981", fontFamily: '"SF Mono", "JetBrains Mono", monospace' }}>{profile.returnEngine.priceReturn.y5CAGR}</div>
                  </div>
                  <div style={{ padding: "10px", backgroundColor: "#070b14", borderRadius: "6px", border: "1px solid rgba(255, 255, 255, 0.04)" }}>
                    <div style={{ fontSize: "10px", color: "#64748b" }}>10Y PRICE CAGR</div>
                    <div style={{ fontSize: "18px", fontWeight: 700, color: "#10b981", fontFamily: '"SF Mono", "JetBrains Mono", monospace' }}>{profile.returnEngine.priceReturn.y10CAGR}</div>
                  </div>
                  <div style={{ padding: "10px", backgroundColor: "#070b14", borderRadius: "6px", border: "1px solid rgba(255, 255, 255, 0.04)" }}>
                    <div style={{ fontSize: "10px", color: "#64748b" }}>MAX PRICE CAGR</div>
                    <div style={{ fontSize: "18px", fontWeight: 700, color: "#10b981", fontFamily: '"SF Mono", "JetBrains Mono", monospace' }}>{profile.returnEngine.priceReturn.maxCAGR}</div>
                  </div>
                </div>

                {/* Additional Return Metrics */}
                <div style={{ fontSize: "12px", display: "flex", flexDirection: "column", gap: "6px", color: "#94a3b8", marginBottom: "14px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span>Max Historical Drawdown:</span>
                    <span style={{ color: "#f43f5e", fontFamily: '"SF Mono", "JetBrains Mono", monospace', fontWeight: 600 }}>{profile.returnEngine.maxDrawdown}</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span>Historical Recovery Time:</span>
                    <span style={{ color: "#ffffff", fontFamily: '"SF Mono", "JetBrains Mono", monospace' }}>{profile.returnEngine.recoveryTime}</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span>Best / Worst Year:</span>
                    <span style={{ color: "#ffffff", fontFamily: '"SF Mono", "JetBrains Mono", monospace' }}>{profile.returnEngine.bestYear} / {profile.returnEngine.worstYear}</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span>Positive Calendar Years:</span>
                    <span style={{ color: "#10b981", fontFamily: '"SF Mono", "JetBrains Mono", monospace' }}>{profile.returnEngine.positiveYearsPct}</span>
                  </div>
                </div>

                <div style={{ padding: "10px", backgroundColor: "rgba(0, 0, 0, 0.3)", borderRadius: "4px", fontSize: "11px", color: "#64748b", border: "1px solid rgba(255, 255, 255, 0.04)" }}>
                  * Methodology: {profile.returnEngine.methodologyNote}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ------------------------------------------------------------------ */}
        {/* 5. ₹1 LAKH HISTORICAL SIMULATOR & DRAWDOWN HISTORY                 */}
        {/* ------------------------------------------------------------------ */}
        <section style={{ padding: "40px 0", borderBottom: "1px solid rgba(255, 255, 255, 0.05)" }}>
          <div style={sharedStyles.container}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))", gap: "24px" }}>
              {/* ₹1 Lakh Historical Simulator */}
              <div style={{ backgroundColor: "#0b1220", border: "1px solid rgba(255, 255, 255, 0.08)", borderRadius: "8px", padding: "24px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "14px" }}>
                  <div>
                    <div style={{ fontSize: "11px", fontWeight: 700, color: "#10b981", letterSpacing: "0.1em", textTransform: "uppercase", fontFamily: '"SF Mono", "JetBrains Mono", monospace' }}>
                      ALLOCATION ENGINE
                    </div>
                    <h3 style={{ fontSize: "20px", fontWeight: 700, color: "#ffffff", margin: "4px 0 0" }}>
                      What if you invested ₹1 lakh?
                    </h3>
                  </div>
                  <Link to="/tools/investment-simulator" style={{ fontSize: "11px", color: "#38bdf8", textDecoration: "none", display: "flex", alignItems: "center", gap: "4px" }}>
                    <span>Full Simulator</span>
                    <ChevronRight size={13} />
                  </Link>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginBottom: "16px" }}>
                  <div style={{ padding: "12px", backgroundColor: "#070b14", borderRadius: "6px", border: "1px solid rgba(255, 255, 255, 0.04)" }}>
                    <div style={{ fontSize: "10px", color: "#64748b" }}>INITIAL (SINCE {profile.simulator.defaultStartYear})</div>
                    <div style={{ fontSize: "18px", fontWeight: 700, color: "#ffffff", fontFamily: '"SF Mono", "JetBrains Mono", monospace' }}>
                      {profile.simulator.initialAmount}
                    </div>
                  </div>
                  <div style={{ padding: "12px", backgroundColor: "#070b14", borderRadius: "6px", border: "1px solid rgba(16, 185, 129, 0.2)" }}>
                    <div style={{ fontSize: "10px", color: "#10b981" }}>ENDING VALUE ({profile.simulator.returnType})</div>
                    <div style={{ fontSize: "18px", fontWeight: 700, color: "#10b981", fontFamily: '"SF Mono", "JetBrains Mono", monospace' }}>
                      {profile.simulator.endingValuePrice}
                    </div>
                  </div>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "6px", fontSize: "12px", color: "#94a3b8", marginBottom: "16px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span>Simulation Mode:</span>
                    <span style={{ color: "#38bdf8", fontFamily: '"SF Mono", "JetBrains Mono", monospace', fontWeight: 600 }}>{profile.simulator.returnType}</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span>Annualized Growth (CAGR):</span>
                    <span style={{ color: "#10b981", fontFamily: '"SF Mono", "JetBrains Mono", monospace', fontWeight: 600 }}>{profile.simulator.cagr}</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span>Max Drawdown During Holding:</span>
                    <span style={{ color: "#f43f5e", fontFamily: '"SF Mono", "JetBrains Mono", monospace' }}>{profile.simulator.maxDrawdown}</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span>Total Return (Reinvested Dividends):</span>
                    <span style={{ color: "#38bdf8", fontFamily: '"SF Mono", "JetBrains Mono", monospace' }}>
                      {profile.simulator.endingValueTotalReturn || "Pending corporate-action integration"}
                    </span>
                  </div>
                </div>

                <div style={{ padding: "8px 10px", backgroundColor: "rgba(0, 0, 0, 0.25)", borderRadius: "4px", fontSize: "11px", color: "#64748b" }}>
                  * Illustrative historical return based on daily price history; does not account for brokerage taxes or slippage.
                </div>
              </div>

              {/* Drawdown History */}
              <div style={{ backgroundColor: "#0b1220", border: "1px solid rgba(255, 255, 255, 0.08)", borderRadius: "8px", padding: "24px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "14px" }}>
                  <div>
                    <div style={{ fontSize: "11px", fontWeight: 700, color: "#f43f5e", letterSpacing: "0.1em", textTransform: "uppercase", fontFamily: '"SF Mono", "JetBrains Mono", monospace' }}>
                      RISK ANATOMY
                    </div>
                    <h3 style={{ fontSize: "20px", fontWeight: 700, color: "#ffffff", margin: "4px 0 0" }}>
                      Drawdown History
                    </h3>
                  </div>
                  <span style={{ fontSize: "10px", padding: "2px 6px", borderRadius: "4px", backgroundColor: "rgba(244, 63, 94, 0.1)", color: "#f43f5e", border: "1px solid rgba(244, 63, 94, 0.25)", fontFamily: '"SF Mono", "JetBrains Mono", monospace', fontWeight: 600 }}>
                    RECOVERY DYNAMICS
                  </span>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginBottom: "16px" }}>
                  <div style={{ padding: "10px", backgroundColor: "#070b14", borderRadius: "6px", border: "1px solid rgba(255, 255, 255, 0.04)" }}>
                    <div style={{ fontSize: "10px", color: "#64748b" }}>CURRENT DRAWDOWN</div>
                    <div style={{ fontSize: "18px", fontWeight: 700, color: "#ffffff", fontFamily: '"SF Mono", "JetBrains Mono", monospace' }}>
                      {profile.drawdownHistory.currentDrawdown}
                    </div>
                  </div>
                  <div style={{ padding: "10px", backgroundColor: "#070b14", borderRadius: "6px", border: "1px solid rgba(244, 63, 94, 0.2)" }}>
                    <div style={{ fontSize: "10px", color: "#f43f5e" }}>MAX DRAWDOWN</div>
                    <div style={{ fontSize: "18px", fontWeight: 700, color: "#f43f5e", fontFamily: '"SF Mono", "JetBrains Mono", monospace' }}>
                      {profile.drawdownHistory.maxHistoricalDrawdown}
                    </div>
                  </div>
                </div>

                <div style={{ fontSize: "12px", color: "#94a3b8", lineHeight: 1.5, marginBottom: "14px" }}>
                  <strong style={{ color: "#cbd5e1" }}>Worst Historical Episode: </strong>{profile.drawdownHistory.worstEpisode}
                </div>

                {/* Drawdown Curve Sparkline */}
                <div style={{ height: "45px", width: "100%", backgroundColor: "#070b14", borderRadius: "4px", padding: "6px", border: "1px solid rgba(255, 255, 255, 0.04)" }}>
                  <svg viewBox="0 0 100 35" style={{ width: "100%", height: "100%", overflow: "visible" }} preserveAspectRatio="none">
                    <polyline
                      fill="none"
                      stroke="#f43f5e"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      points={profile.drawdownHistory.chartPoints}
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ------------------------------------------------------------------ */}
        {/* 6. COMPANY DNA & REGIME BEHAVIOUR                                  */}
        {/* ------------------------------------------------------------------ */}
        <section style={{ padding: "40px 0", borderBottom: "1px solid rgba(255, 255, 255, 0.05)" }}>
          <div style={sharedStyles.container}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))", gap: "24px" }}>
              {/* Company DNA Panel */}
              <div style={{ backgroundColor: "#0b1220", border: "1px solid rgba(255, 255, 255, 0.08)", borderRadius: "8px", padding: "24px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "14px" }}>
                  <div>
                    <div style={{ fontSize: "11px", fontWeight: 700, color: "#a855f7", letterSpacing: "0.1em", textTransform: "uppercase", fontFamily: '"SF Mono", "JetBrains Mono", monospace' }}>
                      BEHAVIOURAL PROFILING
                    </div>
                    <h3 style={{ fontSize: "20px", fontWeight: 700, color: "#ffffff", margin: "4px 0 0" }}>
                      Company DNA
                    </h3>
                  </div>
                  <span style={{ fontSize: "10px", padding: "2px 6px", borderRadius: "4px", backgroundColor: "rgba(245, 158, 11, 0.1)", color: "#f59e0b", border: "1px solid rgba(245, 158, 11, 0.25)", fontFamily: '"SF Mono", "JetBrains Mono", monospace', fontWeight: 600 }}>
                    DEMO ANALYSIS
                  </span>
                </div>

                <p style={{ fontSize: "12px", color: "#94a3b8", lineHeight: 1.5, marginBottom: "18px" }}>
                  How has this company behaved across different market regimes?
                </p>

                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  {profile.companyDNA.map((dna) => (
                    <div key={dna.dimension}>
                      <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", marginBottom: "3px" }}>
                        <span style={{ color: "#ffffff", fontWeight: 500 }}>{dna.dimension}</span>
                        <span style={{ color: "#38bdf8", fontFamily: '"SF Mono", "JetBrains Mono", monospace', fontWeight: 600 }}>
                          {dna.score}/100 • {dna.rating}
                        </span>
                      </div>
                      <div style={{ width: "100%", height: "5px", backgroundColor: "#070b14", borderRadius: "3px", overflow: "hidden" }}>
                        <div style={{ width: `${dna.score}%`, height: "100%", backgroundColor: dna.score > 80 ? "#10b981" : dna.score > 65 ? "#38bdf8" : "#f59e0b" }} />
                      </div>
                      <div style={{ fontSize: "11px", color: "#64748b", marginTop: "2px" }}>{dna.commentary}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Regime Behaviour Panel */}
              <div style={{ backgroundColor: "#0b1220", border: "1px solid rgba(255, 255, 255, 0.08)", borderRadius: "8px", padding: "24px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "14px" }}>
                  <div>
                    <div style={{ fontSize: "11px", fontWeight: 700, color: "#38bdf8", letterSpacing: "0.1em", textTransform: "uppercase", fontFamily: '"SF Mono", "JetBrains Mono", monospace' }}>
                      MACRO REGIME BETA
                    </div>
                    <h3 style={{ fontSize: "20px", fontWeight: 700, color: "#ffffff", margin: "4px 0 0" }}>
                      Regime Behaviour
                    </h3>
                  </div>
                  <span style={{ fontSize: "10px", padding: "2px 6px", borderRadius: "4px", backgroundColor: "rgba(56, 189, 248, 0.1)", color: "#38bdf8", border: "1px solid rgba(56, 189, 248, 0.25)", fontFamily: '"SF Mono", "JetBrains Mono", monospace', fontWeight: 600 }}>
                    HISTORICAL COMPARISONS
                  </span>
                </div>

                <p style={{ fontSize: "12px", color: "#94a3b8", lineHeight: 1.5, marginBottom: "16px" }}>
                  How the stock behaved across historical market regimes.
                </p>

                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  {profile.regimeBehaviour.map((rb, i) => (
                    <div
                      key={rb.regimeId + i}
                      style={{
                        padding: "10px 12px",
                        backgroundColor: "#070b14",
                        borderRadius: "6px",
                        border: "1px solid rgba(255, 255, 255, 0.04)",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <div>
                        <div style={{ fontSize: "13px", fontWeight: 600, color: "#ffffff" }}>{rb.regimeName}</div>
                        <div style={{ fontSize: "11px", color: "#64748b" }}>{rb.periodDescription}</div>
                      </div>
                      <div style={{ textAlign: "right" }}>
                        <div style={{ fontSize: "12px", fontWeight: 700, color: rb.isOutperforming ? "#10b981" : "#f43f5e", fontFamily: '"SF Mono", "JetBrains Mono", monospace' }}>
                          {rb.companyReturn}
                        </div>
                        <div style={{ fontSize: "10px", color: "#94a3b8", fontFamily: '"SF Mono", "JetBrains Mono", monospace' }}>
                          vs {rb.benchmarkReturn} ({rb.relativeReturn})
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div style={{ marginTop: "14px", fontSize: "11px", color: "#64748b" }}>
                  * Historical regime analysis is descriptive, not predictive.
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ------------------------------------------------------------------ */}
        {/* 7. VALUATION CONTEXT & MARKET BENCHMARK COMPARISON                 */}
        {/* ------------------------------------------------------------------ */}
        <section style={{ padding: "40px 0", borderBottom: "1px solid rgba(255, 255, 255, 0.05)" }}>
          <div style={sharedStyles.container}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))", gap: "24px" }}>
              {/* Valuation Through Time */}
              <div style={{ backgroundColor: "#0b1220", border: "1px solid rgba(255, 255, 255, 0.08)", borderRadius: "8px", padding: "24px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "14px" }}>
                  <div>
                    <div style={{ fontSize: "11px", fontWeight: 700, color: "#38bdf8", letterSpacing: "0.1em", textTransform: "uppercase", fontFamily: '"SF Mono", "JetBrains Mono", monospace' }}>
                      HISTORICAL VALUATION RANGES
                    </div>
                    <h3 style={{ fontSize: "20px", fontWeight: 700, color: "#ffffff", margin: "4px 0 0" }}>
                      Valuation Through Time
                    </h3>
                  </div>
                  <span style={{ fontSize: "10px", padding: "2px 6px", borderRadius: "4px", backgroundColor: "rgba(245, 158, 11, 0.1)", color: "#f59e0b", border: "1px solid rgba(245, 158, 11, 0.25)", fontFamily: '"SF Mono", "JetBrains Mono", monospace', fontWeight: 600 }}>
                    PERCENTILE BANDS
                  </span>
                </div>

                <div style={{ overflowX: "auto" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "12px" }}>
                    <thead>
                      <tr style={{ borderBottom: "1px solid rgba(255, 255, 255, 0.08)", color: "#64748b", fontFamily: '"SF Mono", "JetBrains Mono", monospace', fontSize: "10px" }}>
                        <th style={{ padding: "8px 0" }}>METRIC</th>
                        <th style={{ padding: "8px 4px", textAlign: "right" }}>CURRENT</th>
                        <th style={{ padding: "8px 4px", textAlign: "right" }}>10TH %ILE</th>
                        <th style={{ padding: "8px 4px", textAlign: "right" }}>MEDIAN</th>
                        <th style={{ padding: "8px 0", textAlign: "right" }}>90TH %ILE</th>
                      </tr>
                    </thead>
                    <tbody>
                      {profile.valuations.map((v) => (
                        <tr key={v.metric} style={{ borderBottom: "1px solid rgba(255, 255, 255, 0.04)" }}>
                          <td style={{ padding: "10px 0", color: "#ffffff", fontWeight: 500 }}>{v.metric}</td>
                          <td style={{ padding: "10px 4px", textAlign: "right", color: "#38bdf8", fontWeight: 700, fontFamily: '"SF Mono", "JetBrains Mono", monospace' }}>{v.currentValue}</td>
                          <td style={{ padding: "10px 4px", textAlign: "right", color: "#94a3b8", fontFamily: '"SF Mono", "JetBrains Mono", monospace' }}>{v.p10}</td>
                          <td style={{ padding: "10px 4px", textAlign: "right", color: "#cbd5e1", fontFamily: '"SF Mono", "JetBrains Mono", monospace' }}>{v.median}</td>
                          <td style={{ padding: "10px 0", textAlign: "right", color: "#94a3b8", fontFamily: '"SF Mono", "JetBrains Mono", monospace' }}>{v.p90}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div style={{ marginTop: "12px", fontSize: "11px", color: "#64748b" }}>
                  * Percentiles calculated over 10-year rolling window.
                </div>
              </div>

              {/* Company vs Market Benchmark Comparison */}
              <div style={{ backgroundColor: "#0b1220", border: "1px solid rgba(255, 255, 255, 0.08)", borderRadius: "8px", padding: "24px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "14px" }}>
                  <div>
                    <div style={{ fontSize: "11px", fontWeight: 700, color: "#38bdf8", letterSpacing: "0.1em", textTransform: "uppercase", fontFamily: '"SF Mono", "JetBrains Mono", monospace' }}>
                      RELATIVE COMPOUNDING
                    </div>
                    <h3 style={{ fontSize: "20px", fontWeight: 700, color: "#ffffff", margin: "4px 0 0" }}>
                      Company vs Market
                    </h3>
                  </div>
                  <span style={{ fontSize: "10px", padding: "2px 6px", borderRadius: "4px", backgroundColor: "rgba(56, 189, 248, 0.1)", color: "#38bdf8", border: "1px solid rgba(56, 189, 248, 0.25)", fontFamily: '"SF Mono", "JetBrains Mono", monospace', fontWeight: 600 }}>
                    BENCHMARK MATRIX
                  </span>
                </div>

                <div style={{ overflowX: "auto" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "12px" }}>
                    <thead>
                      <tr style={{ borderBottom: "1px solid rgba(255, 255, 255, 0.08)", color: "#64748b", fontFamily: '"SF Mono", "JetBrains Mono", monospace', fontSize: "10px" }}>
                        <th style={{ padding: "8px 0" }}>PERIOD</th>
                        <th style={{ padding: "8px 4px", textAlign: "right" }}>{profile.symbol}</th>
                        <th style={{ padding: "8px 4px", textAlign: "right" }}>SENSEX</th>
                        <th style={{ padding: "8px 4px", textAlign: "right" }}>NIFTY 50</th>
                        <th style={{ padding: "8px 0", textAlign: "right" }}>SECTOR</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr style={{ borderBottom: "1px solid rgba(255, 255, 255, 0.04)" }}>
                        <td style={{ padding: "10px 0", color: "#ffffff", fontWeight: 600 }}>1 Year</td>
                        <td style={{ padding: "10px 4px", textAlign: "right", color: "#10b981", fontWeight: 700, fontFamily: '"SF Mono", "JetBrains Mono", monospace' }}>{profile.marketComparison.period1Y.stock}</td>
                        <td style={{ padding: "10px 4px", textAlign: "right", color: "#94a3b8", fontFamily: '"SF Mono", "JetBrains Mono", monospace' }}>{profile.marketComparison.period1Y.sensex}</td>
                        <td style={{ padding: "10px 4px", textAlign: "right", color: "#94a3b8", fontFamily: '"SF Mono", "JetBrains Mono", monospace' }}>{profile.marketComparison.period1Y.nifty}</td>
                        <td style={{ padding: "10px 0", textAlign: "right", color: "#38bdf8", fontFamily: '"SF Mono", "JetBrains Mono", monospace' }}>{profile.marketComparison.period1Y.sector}</td>
                      </tr>
                      <tr style={{ borderBottom: "1px solid rgba(255, 255, 255, 0.04)" }}>
                        <td style={{ padding: "10px 0", color: "#ffffff", fontWeight: 600 }}>3 Year</td>
                        <td style={{ padding: "10px 4px", textAlign: "right", color: "#10b981", fontWeight: 700, fontFamily: '"SF Mono", "JetBrains Mono", monospace' }}>{profile.marketComparison.period3Y.stock}</td>
                        <td style={{ padding: "10px 4px", textAlign: "right", color: "#94a3b8", fontFamily: '"SF Mono", "JetBrains Mono", monospace' }}>{profile.marketComparison.period3Y.sensex}</td>
                        <td style={{ padding: "10px 4px", textAlign: "right", color: "#94a3b8", fontFamily: '"SF Mono", "JetBrains Mono", monospace' }}>{profile.marketComparison.period3Y.nifty}</td>
                        <td style={{ padding: "10px 0", textAlign: "right", color: "#38bdf8", fontFamily: '"SF Mono", "JetBrains Mono", monospace' }}>{profile.marketComparison.period3Y.sector}</td>
                      </tr>
                      <tr>
                        <td style={{ padding: "10px 0", color: "#ffffff", fontWeight: 600 }}>5 Year</td>
                        <td style={{ padding: "10px 4px", textAlign: "right", color: "#10b981", fontWeight: 700, fontFamily: '"SF Mono", "JetBrains Mono", monospace' }}>{profile.marketComparison.period5Y.stock}</td>
                        <td style={{ padding: "10px 4px", textAlign: "right", color: "#94a3b8", fontFamily: '"SF Mono", "JetBrains Mono", monospace' }}>{profile.marketComparison.period5Y.sensex}</td>
                        <td style={{ padding: "10px 4px", textAlign: "right", color: "#94a3b8", fontFamily: '"SF Mono", "JetBrains Mono", monospace' }}>{profile.marketComparison.period5Y.nifty}</td>
                        <td style={{ padding: "10px 0", textAlign: "right", color: "#38bdf8", fontFamily: '"SF Mono", "JetBrains Mono", monospace' }}>{profile.marketComparison.period5Y.sector}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div style={{ marginTop: "12px", fontSize: "11px", color: "#64748b" }}>
                  * Relative alpha calculated against market-cap weighted benchmarks.
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ------------------------------------------------------------------ */}
        {/* 8. HISTORICAL QUESTIONS MODULE                                     */}
        {/* ------------------------------------------------------------------ */}
        <section style={{ padding: "48px 0 60px" }}>
          <div style={sharedStyles.container}>
            <div style={{
              backgroundColor: "#0c1527",
              border: "1px solid rgba(56, 189, 248, 0.2)",
              borderRadius: "10px",
              padding: "32px",
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "#38bdf8", fontSize: "11px", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", fontFamily: '"SF Mono", "JetBrains Mono", monospace', marginBottom: "8px" }}>
                <Sparkles size={14} />
                <span>COMPANY INVESTIGATION CHIPS</span>
              </div>

              <h2 style={{ fontSize: "22px", fontWeight: 800, color: "#ffffff", margin: "0 0 8px 0" }}>
                Ask a historical question about {profile.name}.
              </h2>
              <p style={{ fontSize: "13px", color: "#94a3b8", margin: "0 0 20px 0" }}>
                Explore curated quantitative research queries for {profile.symbol}.
              </p>

              <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", marginBottom: "16px" }}>
                {profile.historicalQuestions.map((q) => (
                  <button
                    key={q.question}
                    type="button"
                    onClick={() => setSimQuestionAnswer(`Structured analytical query: [${q.queryType}] — Filters: ${q.filters} • Sample: ${q.sampleSize} • Result: ${q.result} (${q.dataStatus})`)}
                    style={{
                      backgroundColor: "rgba(255, 255, 255, 0.04)",
                      border: "1px solid rgba(255, 255, 255, 0.1)",
                      borderRadius: "6px",
                      padding: "8px 14px",
                      color: "#cbd5e1",
                      fontSize: "12px",
                      textAlign: "left",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                      transition: "all 0.15s ease",
                    }}
                    className="question-chip"
                  >
                    <Search size={12} style={{ color: "#38bdf8" }} />
                    <span>&ldquo;{q.question}&rdquo;</span>
                  </button>
                ))}
              </div>

              {simQuestionAnswer && (
                <div style={{ padding: "12px 16px", backgroundColor: "#070b14", borderRadius: "6px", border: "1px solid rgba(56, 189, 248, 0.3)", fontSize: "12px", color: "#38bdf8" }}>
                  {simQuestionAnswer}
                </div>
              )}
            </div>
          </div>
        </section>
      </main>

      <GlobalFooter />
    </div>
  );
};

// ============================================================================
// ----------------------------------------------------------------------------
// HISTORY PAGE (/history): TYPES, DATA PROVIDERS & ANALYTICS
// ----------------------------------------------------------------------------
// ============================================================================

export interface TimelineEraItem {
  id: string;
  yearRange: string;
  name: string;
  category: "CRASH" | "BULL_MARKET" | "RECOVERY" | "MACRO" | "REGULATION" | "CORPORATE" | "TECHNOLOGY" | "BANKING" | "STRUCTURAL";
  shortExplanation: string;
  marketImpact: string;
  relatedSectors: string[];
  relatedResearch: string;
  color: string;
  indexMovement: string;
  keyCatalysts: string[];
}

export interface CrashAtlasItem {
  id: string;
  event: string;
  approxPeriod: string;
  peakToTrough: string;
  drawdownPct: string;
  recoveryPeriod: string;
  primaryDrivers: string;
  whatHappenedAfter: string;
  sensexHigh: string;
  sensexLow: string;
  chartPoints: string;
  category: string;
}

export interface MarketEraDossier {
  id: string;
  title: string;
  period: string;
  definedBy: string;
  drivers: string;
  leadingSectors: string[];
  strugglingSectors: string[];
  volatilityRegime: string;
  valuationBand: string;
  investorBehaviour: string;
  sensexReturnCAGR: string;
  color: string;
}

export interface AnnualReturnEntry {
  year: number;
  sensexReturn: number;
  niftyReturn: number;
  itSectorReturn: number;
  bankSectorReturn: number;
  regime: string;
}

export interface ValuationMetricRange {
  metric: string;
  current: string;
  p10: string;
  median: string;
  p90: string;
  chartPoints: string;
  description: string;
}

export interface SectorEraPerformance {
  sector: string;
  era1990s: string;
  era2000s: string;
  era2010s: string;
  era2020s: string;
  primaryCycleDriver: string;
  leadershipStatus: "LEADER" | "CORE" | "CYCLICAL" | "DEFENSIVE";
}

export interface HistoricalEventRecord {
  id: string;
  date: string;
  title: string;
  category: "Market" | "Corporate" | "Macro" | "Regulation" | "Sector" | "Index" | "Global";
  description: string;
  affectedMarket: string;
  sourceStatus: DataStatus;
  relatedEntities: string[];
}

export interface ForwardDistributionItem {
  question: string;
  condition: string;
  sampleSize: string;
  d30: { median: string; winRate: string; positive: boolean };
  d90: { median: string; winRate: string; positive: boolean };
  d180: { median: string; winRate: string; positive: boolean };
  d365: { median: string; winRate: string; positive: boolean };
  empiricalTakeaway: string;
}

export interface TimeMachineSnapshot {
  id: string;
  dateLabel: string;
  exactDate: string;
  sensexLevel: string;
  niftyLevel: string;
  topSectors: string[];
  marketBreadth: string;
  peRatio: string;
  policyRate: string;
  institutionalFlows: string;
  marketRegime: string;
  keyHeadlines: string[];
}

// ----------------------------------------------------------------------------
// HISTORY DATASETS
// ----------------------------------------------------------------------------

export const HISTORY_TIMELINE_ERAS: TimelineEraItem[] = [
  {
    id: "era-1979",
    yearRange: "1979–1985",
    name: "The Sensex Begins",
    category: "STRUCTURAL",
    shortExplanation: "BSE benchmarks base value pegged at 100 on April 1, 1979, creating India's first standardized equity barometer.",
    marketImpact: "Transitioned Indian industrial tracking from ad-hoc kerb trading to systematic indexation.",
    relatedSectors: ["Textiles", "Engineering", "Commodities"],
    relatedResearch: "Genesis of market-cap weighted indexing in developing economies.",
    color: "#e2b357",
    indexMovement: "Sensex: 100 → ~400",
    keyCatalysts: ["Base year established", "Post-emergency industrial revival", "Licence raj quotas"],
  },
  {
    id: "era-1986",
    yearRange: "1986–1991",
    name: "Early Institutionalisation",
    category: "REGULATION",
    shortExplanation: "Formal launch of the 30-share BSE Sensex index in 1986 as public equity ownership expanded.",
    marketImpact: "Established 30 blue-chip industrial leaders as the core national barometer.",
    relatedSectors: ["Manufacturing", "Automotive", "State Banking"],
    relatedResearch: "Initial constituent selection bias and weighting methodology evolution.",
    color: "#38bdf8",
    indexMovement: "Sensex: 500 → 1,900",
    keyCatalysts: ["1986 Sensex formal launch", "BSE computerized ticker pilots", "1991 Balance of Payments crisis"],
  },
  {
    id: "era-1992",
    yearRange: "1992",
    name: "Securities Market Crisis / Harshad Mehta Era",
    category: "CRASH",
    shortExplanation: "Unprecedented speculative rally driven by bank receipt arbitrage, followed by a sudden 54% peak-to-trough contraction.",
    marketImpact: "Catalyzed statutory chartering of SEBI and creation of modern screen-based trading.",
    relatedSectors: ["Banking", "Cement", "Textiles"],
    relatedResearch: "Empirical study of bank-syndicate liquidity shocks on equity clearing.",
    color: "#f43f5e",
    indexMovement: "Sensex: 4,546 Peak → 1,980 Trough (-54%)",
    keyCatalysts: ["Bank Receipt (BR) arbitrage", "Janakiraman Committee audit", "SEBI Act 1992 statutory powers"],
  },
  {
    id: "era-1993",
    yearRange: "1993–1999",
    name: "Liberalisation & Electronic Expansion",
    category: "TECHNOLOGY",
    shortExplanation: "Inception of the National Stock Exchange (NSE), Nifty 50, electronic depositories (NSDL), and foreign institutional entry.",
    marketImpact: "Eliminated badla physical settlement in favor of transparent electronic screen order-matching.",
    relatedSectors: ["IT Services", "Pharma", "Consumer Goods"],
    relatedResearch: "Dematerialisation impact on bid-ask spreads and liquidity velocity.",
    color: "#10b981",
    indexMovement: "Sensex: 2,000 → 5,000",
    keyCatalysts: ["1994 NSE launch", "1996 NSDL depository creation", "FII opening & GDR issuances"],
  },
  {
    id: "era-2000",
    yearRange: "2000–2003",
    name: "Dot-Com Boom & Deflation",
    category: "CRASH",
    shortExplanation: "Hyperbolic repricing of software and telecom equities (ICE boom), followed by a prolonged 56% drawdown.",
    marketImpact: "Instituted T+2 rolling settlement, derivatives architecture, and corporate governance norms.",
    relatedSectors: ["Software", "Telecom", "Media"],
    relatedResearch: "Tech valuation bubbles and the long-term compounding of surviving franchises.",
    color: "#f43f5e",
    indexMovement: "Sensex: 6,150 Peak → 2,600 Trough (-56%)",
    keyCatalysts: ["Global dot-com bubble burst", "Ketan Parekh payment crisis", "Introduction of index futures"],
  },
  {
    id: "era-2003",
    yearRange: "2003–2007",
    name: "Great Bull Market Expansion",
    category: "BULL_MARKET",
    shortExplanation: "Unprecedented multi-year expansion driven by capital investment, infrastructure boom, global liquidity, and corporate earnings.",
    marketImpact: "Sensex compounded 40%+ CAGR over 4.5 years, crossing 20,000 for the first time.",
    relatedSectors: ["Capital Goods", "Real Estate", "Power", "Banking"],
    relatedResearch: "Capex cycle super-cycles and earnings multiplier expansion in emerging markets.",
    color: "#10b981",
    indexMovement: "Sensex: 3,000 → 21,200 (+600%)",
    keyCatalysts: ["Double-digit GDP growth", "Massive corporate capex cycle", "Global commodity supercycle"],
  },
  {
    id: "era-2008",
    yearRange: "2008–2009",
    name: "Global Financial Crisis",
    category: "CRASH",
    shortExplanation: "US subprime contagion and Lehman Brothers bankruptcy triggered a sharp 60% liquidation across Indian equities.",
    marketImpact: "Massive foreign institutional outflows; wiped out highly leveraged real estate and infrastructure valuations.",
    relatedSectors: ["Real Estate", "Infrastructure", "Metals", "Financials"],
    relatedResearch: "Cross-border liquidity contagion and currency-equity transmission channels.",
    color: "#f43f5e",
    indexMovement: "Sensex: 21,206 Peak → 8,047 Trough (-60%)",
    keyCatalysts: ["Lehman collapse", "Global credit freeze", "Emergency RBI monetary easing"],
  },
  {
    id: "era-2010",
    yearRange: "2010–2013",
    name: "Post-Crisis Volatility & Policy Gridlock",
    category: "MACRO",
    shortExplanation: "High domestic inflation, policy paralysis, twin-deficit concerns, and the 2013 Fed 'Taper Tantrum' rupee shock.",
    marketImpact: "Broad market consolidation with defensive leadership in FMCG and IT.",
    relatedSectors: ["FMCG", "Pharma", "IT"],
    relatedResearch: "Currency depreciation regimes and defensive sector rotation dynamics.",
    color: "#f59e0b",
    indexMovement: "Sensex: 16,000 → 21,000 Rangebound",
    keyCatalysts: ["Taper Tantrum rupee shock", "Double-digit CPI inflation", "NPA accumulation in state banks"],
  },
  {
    id: "era-2014",
    yearRange: "2014–2017",
    name: "Domestic Growth & Re-rating",
    category: "BULL_MARKET",
    shortExplanation: "Single-party political mandate, inflation targeting framework, IBC bankruptcy reforms, and GST implementation.",
    marketImpact: "Valuation re-rating led by retail mutual fund SIP inflows into private financials and consumer goods.",
    relatedSectors: ["Private Banks", "Auto", "Consumer Discretionary"],
    relatedResearch: "Domestic financialisation and the transformation of retail savings into equity SIPs.",
    color: "#10b981",
    indexMovement: "Sensex: 21,000 → 34,000",
    keyCatalysts: ["2014 political majority", "Insolvency & Bankruptcy Code", "Demonetisation & formalisation"],
  },
  {
    id: "era-2018",
    yearRange: "2018–2019",
    name: "NBFC & Credit Stress Period",
    category: "BANKING",
    shortExplanation: "IL&FS default triggered a severe shadow-banking liquidity freeze and bifurcation between quality blue-chips and mid-caps.",
    marketImpact: "Severe mid and small-cap bear market (-35%) despite benchmark headline resilience.",
    relatedSectors: ["NBFCs", "Real Estate", "Small Caps"],
    relatedResearch: "Polarised market breadth and extreme concentration in top 5 index heavyweights.",
    color: "#f59e0b",
    indexMovement: "Sensex: 34,000 → 41,000 (Polarised)",
    keyCatalysts: ["IL&FS & DHFL defaults", "Mutual fund credit risk re-assessment", "Corporate tax rate cut to 22%"],
  },
  {
    id: "era-2020",
    yearRange: "2020",
    name: "COVID Shock & Rapid V-Shape",
    category: "CRASH",
    shortExplanation: "March 2020 pandemic lockdown sparked the fastest 38% contraction in Indian history, followed by unprecedented central bank liquidity.",
    marketImpact: "Explosive retail investor onboarding (discount brokerages) and global technology/pharma rally.",
    relatedSectors: ["Pharma", "IT", "Chemicals", "Digital"],
    relatedResearch: "Speed of drawdown vs speed of monetary stimulus transmission.",
    color: "#10b981",
    indexMovement: "Sensex: 42,273 → 25,638 (-38%) → 47,751 (+86%)",
    keyCatalysts: ["National COVID lockdown", "Global central bank balance sheet expansion", "Retail demat surge"],
  },
  {
    id: "era-2021",
    yearRange: "2021",
    name: "Liquidity-Driven Expansion",
    category: "BULL_MARKET",
    shortExplanation: "Record low interest rates, global tech IPO wave, and historic earnings rebound across cyclical sectors.",
    marketImpact: "Sensex breached 60,000 with broad mid and small-cap outperformance.",
    relatedSectors: ["Metals", "Real Estate", "New-Age Tech", "PSU Banks"],
    relatedResearch: "Tech unicorn listing valuations and subsequent market pricing corrections.",
    color: "#10b981",
    indexMovement: "Sensex: 48,000 → 62,000",
    keyCatalysts: ["Zomato/Nykaa tech IPO wave", "Record FII inflows", "Corporate deleveraging cycle"],
  },
  {
    id: "era-2022",
    yearRange: "2022",
    name: "Global Rate Hike & Inflation Regime",
    category: "MACRO",
    shortExplanation: "Russia-Ukraine conflict, surging crude oil, and the fastest US Federal Reserve rate hikes in 40 years.",
    marketImpact: "Heavy foreign institutional selling (₹2 Lakh Cr+) absorbed entirely by domestic mutual fund SIPs.",
    relatedSectors: ["PSU Banks", "Energy", "Defence"],
    relatedResearch: "Domestic SIP resilience decoupling emerging market performance from foreign outflows.",
    color: "#f59e0b",
    indexMovement: "Sensex: 61,000 → 51,000 → 61,000",
    keyCatalysts: ["Russia-Ukraine conflict", "US Fed +500 bps hike cycle", "Record DII net inflows"],
  },
  {
    id: "era-2023",
    yearRange: "2023–2026",
    name: "Modern Institutional Era",
    category: "STRUCTURAL",
    shortExplanation: "Indian market capitalization surpasses ₹400 Lakh Crore ($5 Trillion), anchored by monthly SIP run-rate exceeding ₹20,000 Crore.",
    marketImpact: "Sensex crosses 80,000; deepened capital formation in manufacturing, defence, energy transition, and infrastructure.",
    relatedSectors: ["Manufacturing", "Defence", "Renewables", "Private Banks"],
    relatedResearch: "Structural shift from foreign dependence to domestic-driven price discovery.",
    color: "#38bdf8",
    indexMovement: "Sensex: 65,000 → 81,000+",
    keyCatalysts: ["₹20,000+ Cr monthly SIPs", "Global Supply Chain 'China+1' capex", "Public Sector capital efficiency"],
  },
];

export const CRASH_ATLAS_DATA: CrashAtlasItem[] = [
  {
    id: "crash-1992",
    event: "1992 Securities Crisis",
    approxPeriod: "Apr 1992 – Apr 1993",
    peakToTrough: "4,546 → 1,980",
    drawdownPct: "-54.2%",
    recoveryPeriod: "32 Months",
    primaryDrivers: "Bank receipt and treasury bill funding irregularities funnelled into speculative equity positions.",
    whatHappenedAfter: "BSE was closed for multiple weeks; statutory charter established for SEBI; paperless trading blueprints initiated.",
    sensexHigh: "4,546",
    sensexLow: "1,980",
    chartPoints: "0,5 20,54 40,48 60,35 80,20 100,5",
    category: "Financial Systemic",
  },
  {
    id: "crash-2000",
    event: "2000–01 Dot-Com Bust & Ketan Parekh Crisis",
    approxPeriod: "Feb 2000 – Sep 2001",
    peakToTrough: "6,150 → 2,600",
    drawdownPct: "-56.4%",
    recoveryPeriod: "44 Months",
    primaryDrivers: "Global technology bubble deflation combined with circular trading and badla settlement payment defaults in K-10 stocks.",
    whatHappenedAfter: "Banning of badla; introduction of formal equity derivatives and mandatory T+2 rolling settlement.",
    sensexHigh: "6,150",
    sensexLow: "2,600",
    chartPoints: "0,5 25,56 50,45 75,30 100,6",
    category: "Speculative Bubble",
  },
  {
    id: "crash-2008",
    event: "2008 Global Financial Crisis",
    approxPeriod: "Jan 2008 – Mar 2009",
    peakToTrough: "21,206 → 8,047",
    drawdownPct: "-60.2%",
    recoveryPeriod: "33 Months",
    primaryDrivers: "Global liquidity freeze following Lehman Brothers bankruptcy and systemic liquidation by foreign institutional funds.",
    whatHappenedAfter: "Massive monetary and fiscal stimulus; Indian corporate deleveraging; structural bank recapitalisation.",
    sensexHigh: "21,206",
    sensexLow: "8,047",
    chartPoints: "0,6 20,60 40,45 60,30 80,18 100,8",
    category: "Global Macro Shocks",
  },
  {
    id: "crash-2011",
    event: "2011 European Debt & Domestic Inflation",
    approxPeriod: "Nov 2010 – Dec 2011",
    peakToTrough: "21,108 → 15,135",
    drawdownPct: "-28.3%",
    recoveryPeriod: "24 Months",
    primaryDrivers: "European sovereign debt contagion, 13 consecutive RBI policy rate hikes, and double-digit domestic food inflation.",
    whatHappenedAfter: "Sector rotation into export-oriented IT and defensive healthcare; initiation of inflation-targeting monetary frameworks.",
    sensexHigh: "21,108",
    sensexLow: "15,135",
    chartPoints: "0,5 30,28 60,20 80,12 100,5",
    category: "Macro Inflation",
  },
  {
    id: "crash-2015",
    event: "2015–16 China Devaluation & Bank NPA Cycle",
    approxPeriod: "Mar 2015 – Feb 2016",
    peakToTrough: "30,024 → 22,494",
    drawdownPct: "-25.1%",
    recoveryPeriod: "14 Months",
    primaryDrivers: "Chinese Yuan surprise devaluations, global commodity price crash, and RBI's Asset Quality Review (AQR) uncovering bad bank loans.",
    whatHappenedAfter: "Insolvency and Bankruptcy Code (IBC) enacted; PSU bank clean-up established foundation for decade-long balance sheet repair.",
    sensexHigh: "30,024",
    sensexLow: "22,494",
    chartPoints: "0,5 25,25 50,18 75,10 100,5",
    category: "Banking / Sector Crisis",
  },
  {
    id: "crash-2018",
    event: "2018 NBFC Liquidity & Mid-Cap Bear Market",
    approxPeriod: "Jan 2018 – Oct 2018",
    peakToTrough: "Small/Mid Cap: -35% (Sensex -14.9%)",
    drawdownPct: "-14.9% (Benchmark)",
    recoveryPeriod: "18 Months",
    primaryDrivers: "IL&FS commercial paper default sparked shadow-banking refinancing freeze and broad mutual fund portfolio stress.",
    whatHappenedAfter: "Flight to private quality banks; corporate tax cut from 30% to 22% in Sept 2019 to stimulate domestic private capex.",
    sensexHigh: "38,989",
    sensexLow: "33,291",
    chartPoints: "0,4 30,15 60,10 80,8 100,4",
    category: "Credit Liquidity",
  },
  {
    id: "crash-2020",
    event: "2020 COVID-19 Pandemic Shock",
    approxPeriod: "Feb 2020 – Mar 2020",
    peakToTrough: "42,273 → 25,638",
    drawdownPct: "-38.0%",
    recoveryPeriod: "7 Months",
    primaryDrivers: "Unprecedented global economic shutdown, acute health uncertainty, and emergency margin liquidation.",
    whatHappenedAfter: "Fastest recovery in Indian market history (+100% in 12 months) backed by central bank liquidity and massive retail demat participation.",
    sensexHigh: "42,273",
    sensexLow: "25,638",
    chartPoints: "0,5 30,38 50,22 75,10 100,4",
    category: "Black Swan Exogenous",
  },
  {
    id: "crash-2022",
    event: "2022 Global Rate Shock & Geopolitical Conflict",
    approxPeriod: "Oct 2021 – Jun 2022",
    peakToTrough: "62,245 → 50,921",
    drawdownPct: "-18.2%",
    recoveryPeriod: "6 Months",
    primaryDrivers: "Russia-Ukraine conflict, crude oil hitting $130/barrel, and aggressive global monetary tightening.",
    whatHappenedAfter: "India outperformed global emerging markets due to robust domestic SIP inflows absorbing ₹2 Lakh Cr+ FII outflows.",
    sensexHigh: "62,245",
    sensexLow: "50,921",
    chartPoints: "0,4 35,18 65,12 85,8 100,4",
    category: "Macro Geopolitical",
  },
];

export const MARKET_ERAS_DOSSIERS: MarketEraDossier[] = [
  {
    id: "era-1",
    title: "The Early Market",
    period: "1979–1991",
    definedBy: "Floor trading, open outcry rings, physical certificates, and strict government capital-issue controls (CCI).",
    drivers: "Post-independence industrial expansion, state-led credit quotas, and nascent retail investor syndicates.",
    leadingSectors: ["Textiles", "Industrial Machinery", "Cement"],
    strugglingSectors: ["Consumer Services", "Private Financials"],
    volatilityRegime: "Low liquidity; extreme price gaps due to bi-weekly account settlement.",
    valuationBand: "P/E: 10x — 16x (Controlled issue prices)",
    investorBehaviour: "Physical share certificate deliveries, long transfer registry delays, local ring broker dominance.",
    sensexReturnCAGR: "+26.4% CAGR",
    color: "#e2b357",
  },
  {
    id: "era-2",
    title: "Economic Liberalisation",
    period: "1991–2000",
    definedBy: "Abolition of Controller of Capital Issues (CCI), statutory creation of SEBI, and introduction of Foreign Institutional Investors (FIIs).",
    drivers: "De-licensing, rupee convertibility on current account, and initial integration with global capital markets.",
    leadingSectors: ["Information Technology", "Pharmaceuticals", "Automotive"],
    strugglingSectors: ["State Monopolies", "Protected Heavy Engineering"],
    volatilityRegime: "High; driven by 1992 crisis, 1997 Asian crisis, and 1998 nuclear sanctions.",
    valuationBand: "P/E: 14x — 28x (Expanding multiple)",
    investorBehaviour: "First generation of IPO frenzies; initial retail participation in domestic mutual funds.",
    sensexReturnCAGR: "+16.8% CAGR",
    color: "#38bdf8",
  },
  {
    id: "era-3",
    title: "The Tech Boom & Deflation",
    period: "1999–2003",
    definedBy: "Global Y2K technology surge followed by severe valuation deflation and market payment reforms.",
    drivers: "Indian software service arbitrage (Infosys, Wipro, TCS), offshore development, and telecom spectrum expansions.",
    leadingSectors: ["IT Services", "Pharma"],
    strugglingSectors: ["Dot-com / Media start-ups", "State Banks"],
    volatilityRegime: "Extremely high in technology; subdued in old economy cyclicals.",
    valuationBand: "P/E: 12x — 25x (Tech peaked at 80x+)",
    investorBehaviour: "Mass retail speculation in tech penny stocks, followed by multi-year disillusionment and transition to demat.",
    sensexReturnCAGR: "+4.2% CAGR (Post-bust trough)",
    color: "#f43f5e",
  },
  {
    id: "era-4",
    title: "The Great Bull Market",
    period: "2003–2007",
    definedBy: "Unprecedented corporate capex, infrastructure modernization, massive global liquidity, and double-digit profit compounding.",
    drivers: "Global commodity super-cycle, real estate boom, power & highway privatization, and record foreign institutional inflows.",
    leadingSectors: ["Capital Goods", "Real Estate", "Metals & Mining", "Power"],
    strugglingSectors: ["Defensive Healthcare", "IT (lagged capex)"],
    volatilityRegime: "Low to moderate; steady structural uptrend with shallow 10-15% corrections.",
    valuationBand: "P/E: 14x — 28.5x (Peak in Jan 2008)",
    investorBehaviour: "Widespread equity cult revival; oversubscribed mega-IPOs (Reliance Power, DLF).",
    sensexReturnCAGR: "+44.5% CAGR",
    color: "#10b981",
  },
  {
    id: "era-5",
    title: "Global Financial Crisis",
    period: "2008–2009",
    definedBy: "Lehman Brothers collapse, global dollar liquidity freeze, and massive cross-border asset liquidations.",
    drivers: "US subprime mortgage implosion, global deleveraging, and reversal of foreign speculative hot money.",
    leadingSectors: ["Cash / Gold", "Defensive Pharma"],
    strugglingSectors: ["Real Estate (-85%)", "Infrastructure", "Metals"],
    volatilityRegime: "Extreme; India VIX reached record 60+ in late 2008.",
    valuationBand: "P/E: 28.5x → 10.5x (Severe compression)",
    investorBehaviour: "Margin call liquidations, retail panic, complete freeze in primary equity issuances.",
    sensexReturnCAGR: "-60% Peak-to-Trough",
    color: "#f43f5e",
  },
  {
    id: "era-6",
    title: "Post-Crisis Expansion",
    period: "2009–2017",
    definedBy: "Domestic consumption re-rating, inflation targeting monetary reform (RBI Urjit Patel Committee), and corporate balance sheet deleveraging.",
    drivers: "Consumer goods premiumisation, private banking market share gains, and technology offshore cloud migration.",
    leadingSectors: ["Private Banks", "FMCG", "Automotive", "IT"],
    strugglingSectors: ["PSU Banks (NPA crisis)", "Power Utilities", "Telecom (price wars)"],
    volatilityRegime: "Moderate; occasional macro spikes during 2013 Taper Tantrum and 2016 Demonetisation.",
    valuationBand: "P/E: 16x — 24x",
    investorBehaviour: "Systematic transition from physical gold/real-estate savings to mutual fund SIPs.",
    sensexReturnCAGR: "+14.8% CAGR",
    color: "#38bdf8",
  },
  {
    id: "era-7",
    title: "Credit & Macro Stress",
    period: "2018–2019",
    definedBy: "IL&FS and shadow banking refinancing crisis, divergence between index heavyweights and broader market.",
    drivers: "Shadow-bank liquidity freeze, strict RBI NPA recognition, and formalization post-GST.",
    leadingSectors: ["Top 5 Index Heavyweights", "Quality Consumer"],
    strugglingSectors: ["Small & Mid Caps (-35%)", "NBFCs", "Real Estate"],
    volatilityRegime: "Bifurcated: Low in headline Sensex, elevated in broader market.",
    valuationBand: "P/E: 22x — 28x (Headline skewed by top 5)",
    investorBehaviour: "Concentration in safe-haven blue-chips; retail flight to safety.",
    sensexReturnCAGR: "+9.2% CAGR",
    color: "#f59e0b",
  },
  {
    id: "era-8",
    title: "COVID Shock & Recovery",
    period: "2020–2021",
    definedBy: "Sharpest pandemic drawdown in history (-38%), followed by unprecedented global monetary stimulus and V-shaped compounding.",
    drivers: "Central bank zero-rate policies, digital acceleration, pandemic healthcare demand, and corporate cost discipline.",
    leadingSectors: ["Pharmaceuticals", "IT Services", "Metals", "Specialty Chemicals"],
    strugglingSectors: ["Hospitality", "Aviation", "Commercial Real Estate"],
    volatilityRegime: "Extreme spike in March 2020 (VIX 84), collapsing rapidly to low levels in 2021.",
    valuationBand: "P/E: 16x → 34x (Peak multiples)",
    investorBehaviour: "Explosion of first-time retail demat accounts (Zerodha, Groww) and tech IPO participation.",
    sensexReturnCAGR: "+52.0% CAGR",
    color: "#10b981",
  },
  {
    id: "era-9",
    title: "Rate / Inflation Regime",
    period: "2022–2023",
    definedBy: "Global central bank rate tightening cycle, Russia-Ukraine war, and domestic capital outperforming emerging market peers.",
    drivers: "Resilient domestic corporate earnings, robust tax collections, and steady ₹15k+ Cr monthly SIP inflows.",
    leadingSectors: ["PSU Banks (Turnaround)", "Energy", "Defence & Aerospace"],
    strugglingSectors: ["IT Services", "Loss-Making New Age Tech"],
    volatilityRegime: "Orderly; Indian markets decoupled from Western equity drawdowns.",
    valuationBand: "P/E: 20x — 24x",
    investorBehaviour: "Domestic investors bought every dip during foreign institutional sell-offs.",
    sensexReturnCAGR: "+12.4% CAGR",
    color: "#f59e0b",
  },
  {
    id: "era-10",
    title: "Current Institutional Era",
    period: "2024–2026",
    definedBy: "Total market cap crossing ₹400 Lakh Crore, domestic SIP run-rate exceeding ₹20,000 Crore/month, and manufacturing renaissance.",
    drivers: "Government capex on railways/highways, 'China+1' supply chain reallocation, and power transition.",
    leadingSectors: ["Capital Goods", "Manufacturing", "Power & Renewables", "Infrastructure"],
    strugglingSectors: ["Rural Consumer", "IT Services (Demand slowdown)"],
    volatilityRegime: "Subdued with periodic election and geopolitical event risk.",
    valuationBand: "P/E: 22x — 26x",
    investorBehaviour: "Institutionalization of retail wealth; direct domestic dominance over price discovery.",
    sensexReturnCAGR: "+16.5% CAGR",
    color: "#38bdf8",
  },
];

export const ANNUAL_RETURNS_SERIES: AnnualReturnEntry[] = [
  { year: 2003, sensexReturn: 72.9, niftyReturn: 71.9, itSectorReturn: 34.2, bankSectorReturn: 92.4, regime: "Bull Expansion" },
  { year: 2004, sensexReturn: 13.1, niftyReturn: 10.7, itSectorReturn: 42.1, bankSectorReturn: 28.5, regime: "Political Shift" },
  { year: 2005, sensexReturn: 42.3, niftyReturn: 36.3, itSectorReturn: 31.8, bankSectorReturn: 48.2, regime: "Capex Boom" },
  { year: 2006, sensexReturn: 46.7, niftyReturn: 39.8, itSectorReturn: 48.5, bankSectorReturn: 52.1, regime: "Capex Boom" },
  { year: 2007, sensexReturn: 47.1, niftyReturn: 54.8, itSectorReturn: -8.4, bankSectorReturn: 64.8, regime: "Peak Bull" },
  { year: 2008, sensexReturn: -52.4, niftyReturn: -51.8, itSectorReturn: -54.2, bankSectorReturn: -58.4, regime: "Global Crash" },
  { year: 2009, sensexReturn: 81.0, niftyReturn: 75.8, itSectorReturn: 142.0, bankSectorReturn: 84.1, regime: "Recovery" },
  { year: 2010, sensexReturn: 17.4, niftyReturn: 17.9, itSectorReturn: 28.4, bankSectorReturn: 32.1, regime: "Post-Crisis Expansion" },
  { year: 2011, sensexReturn: -24.6, niftyReturn: -24.6, itSectorReturn: -16.2, bankSectorReturn: -31.4, regime: "Macro Inflation" },
  { year: 2012, sensexReturn: 25.7, niftyReturn: 27.7, itSectorReturn: -1.2, bankSectorReturn: 52.4, regime: "Relief Rally" },
  { year: 2013, sensexReturn: 8.9, niftyReturn: 6.8, itSectorReturn: 58.2, bankSectorReturn: -9.4, regime: "Taper Tantrum" },
  { year: 2014, sensexReturn: 29.9, niftyReturn: 31.4, itSectorReturn: 18.4, bankSectorReturn: 64.2, regime: "Election Rally" },
  { year: 2015, sensexReturn: -5.0, niftyReturn: -4.1, itSectorReturn: 2.4, bankSectorReturn: -8.9, regime: "China/NPA Stress" },
  { year: 2016, sensexReturn: 1.9, niftyReturn: 3.0, itSectorReturn: -7.5, bankSectorReturn: 12.4, regime: "Demonetisation" },
  { year: 2017, sensexReturn: 27.9, niftyReturn: 28.6, itSectorReturn: 12.1, bankSectorReturn: 40.2, regime: "GST / Liquidity" },
  { year: 2018, sensexReturn: 5.9, niftyReturn: 3.2, itSectorReturn: 24.8, bankSectorReturn: 6.8, regime: "NBFC Stress" },
  { year: 2019, sensexReturn: 14.4, niftyReturn: 12.0, itSectorReturn: 8.4, bankSectorReturn: 18.2, regime: "Tax Cut" },
  { year: 2020, sensexReturn: 15.8, niftyReturn: 14.9, itSectorReturn: 56.4, bankSectorReturn: -2.4, regime: "COVID V-Shape" },
  { year: 2021, sensexReturn: 22.0, niftyReturn: 24.1, itSectorReturn: 64.2, bankSectorReturn: 13.8, regime: "Tech/Cyclical Boom" },
  { year: 2022, sensexReturn: 4.4, niftyReturn: 4.3, itSectorReturn: -24.8, bankSectorReturn: 21.4, regime: "Global Rate Hike" },
  { year: 2023, sensexReturn: 18.7, niftyReturn: 20.0, itSectorReturn: 24.1, bankSectorReturn: 12.4, regime: "Domestic Inflows" },
  { year: 2024, sensexReturn: 14.8, niftyReturn: 15.6, itSectorReturn: 18.2, bankSectorReturn: 8.4, regime: "Modern Epoch" },
];

export const HISTORICAL_VALUATION_DATA: ValuationMetricRange[] = [
  {
    metric: "Sensex Price-to-Earnings (P/E)",
    current: "23.4x",
    p10: "14.2x",
    median: "19.8x",
    p90: "27.5x",
    chartPoints: "0,20 15,16 30,26 45,10 60,18 75,24 90,28 100,23",
    description: "Trailing 12-month consolidated earnings multiple across 30 benchmark constituents.",
  },
  {
    metric: "Sensex Price-to-Book (P/B)",
    current: "3.6x",
    p10: "2.2x",
    median: "2.9x",
    p90: "4.8x",
    chartPoints: "0,18 15,15 30,28 45,12 60,19 75,22 90,25 100,20",
    description: "Aggregate book value multiple reflecting return on equity (ROE) expectations.",
  },
  {
    metric: "Sensex Dividend Yield",
    current: "1.25%",
    p10: "0.85%",
    median: "1.45%",
    p90: "2.10%",
    chartPoints: "0,16 15,22 30,12 45,28 60,18 75,14 90,12 100,16",
    description: "Cash dividend distributions relative to index nominal capitalisation.",
  },
  {
    metric: "EV / EBITDA Composite",
    current: "16.8x",
    p10: "9.5x",
    median: "13.2x",
    p90: "21.0x",
    chartPoints: "0,18 15,14 30,26 45,10 60,16 75,22 90,24 100,20",
    description: "Enterprise operating profit valuation multiple across listed corporates.",
  },
];

export const SECTOR_ERA_LEADERSHIP: SectorEraPerformance[] = [
  { sector: "Information Technology", era1990s: "Emerging (+45%)", era2000s: "Boom & Bust (+18%)", era2010s: "Steady Cashflow (+16%)", era2020s: "Digital Transformation (+24%)", primaryCycleDriver: "Global enterprise software & cloud budgets", leadershipStatus: "LEADER" },
  { sector: "Private Banking", era1990s: "Nascent Charter (+12%)", era2000s: "Retail Credit (+32%)", era2010s: "Market Share Gain (+22%)", era2020s: "Credit Quality Supercycle (+16%)", primaryCycleDriver: "Deposit franchise & formalization of credit", leadershipStatus: "LEADER" },
  { sector: "Capital Goods & Infra", era1990s: "Licenced Core (+8%)", era2000s: "Super-cycle (+48%)", era2010s: "Balance Sheet Repair (-2%)", era2020s: "Manufacturing Revival (+34%)", primaryCycleDriver: "Government capex & industrial utilization", leadershipStatus: "CYCLICAL" },
  { sector: "Pharmaceuticals", era1990s: "Reverse Engineering (+22%)", era2000s: "US Generics (+18%)", era2010s: "US FDA Scrutiny (+4%)", era2020s: "Specialty & Pandemic (+20%)", primaryCycleDriver: "Generic pricing & global healthcare demand", leadershipStatus: "DEFENSIVE" },
  { sector: "Consumer Goods (FMCG)", era1990s: "Steady Growth (+14%)", era2000s: "Rural Penetration (+16%)", era2010s: "Defensive Quality (+19%)", era2020s: "Margin Pressure (+8%)", primaryCycleDriver: "Rural disposable income & brand pricing power", leadershipStatus: "DEFENSIVE" },
  { sector: "Automotive", era1990s: "Early Passenger Cars (+10%)", era2000s: "Two-Wheeler Boom (+24%)", era2010s: "BS-VI Transition (+11%)", era2020s: "EV & SUV Premiumisation (+28%)", primaryCycleDriver: "Consumer financing rates & urban income", leadershipStatus: "CYCLICAL" },
  { sector: "Metals & Mining", era1990s: "De-licensing (+6%)", era2000s: "China Supercycle (+42%)", era2010s: "Global Glut / Stress (-6%)", era2020s: "Infrastructure Demand (+22%)", primaryCycleDriver: "Global commodity prices & China GDP growth", leadershipStatus: "CYCLICAL" },
  { sector: "Energy & Oil/Gas", era1990s: "Administered Pricing (+8%)", era2000s: "Refining Super-margins (+28%)", era2010s: "Subsidy Reforms (+12%)", era2020s: "Green Transition (+18%)", primaryCycleDriver: "Crude crack spreads & domestic power demand", leadershipStatus: "CORE" },
];

export const HISTORICAL_EVENTS_DB: HistoricalEventRecord[] = [
  { id: "HE_01", date: "01 Apr 1979", title: "Sensex Base Value Pegged at 100", category: "Index", description: "BSE formally creates the standardized base calculation for India's premier equity index.", affectedMarket: "BSE Equities", sourceStatus: "VERIFIED DATA", relatedEntities: ["BSE", "SENSEX"] },
  { id: "HE_02", date: "02 Jan 1986", title: "BSE Sensitive Index Officially Published", category: "Index", description: "The 30-share market-cap weighted benchmark is formally published daily.", affectedMarket: "BSE 30", sourceStatus: "VERIFIED DATA", relatedEntities: ["BSE", "S&P DJI"] },
  { id: "HE_03", date: "24 Jul 1991", title: "Union Budget 1991 & Industrial De-licensing", category: "Macro", description: "Historic budget abolishes industrial licensing and begins current-account liberalization.", affectedMarket: "All Indian Markets", sourceStatus: "VERIFIED DATA", relatedEntities: ["Govt of India", "RBI"] },
  { id: "HE_04", date: "12 Apr 1992", title: "Securities Market Audit & Bank Receipt Freeze", category: "Regulation", description: "RBI audit uncovers unauthorized bank receipt financing, initiating market-wide regulatory overhaul.", affectedMarket: "Banking & Equities", sourceStatus: "VERIFIED DATA", relatedEntities: ["SEBI", "RBI", "SBI"] },
  { id: "HE_05", date: "30 Jan 1992", title: "SEBI Granted Statutory Powers", category: "Regulation", description: "Parliament passes SEBI Act, 1992, creating statutory capital market regulator.", affectedMarket: "All Capital Markets", sourceStatus: "VERIFIED DATA", relatedEntities: ["SEBI"] },
  { id: "HE_06", date: "03 Nov 1994", title: "National Stock Exchange (NSE) Commences Operations", category: "Market", description: "NSE launches satellite-linked automated screen-based trading, eliminating physical open outcry.", affectedMarket: "NSE Capital Market", sourceStatus: "VERIFIED DATA", relatedEntities: ["NSE", "NIFTY"] },
  { id: "HE_07", date: "08 Nov 1996", title: "National Securities Depository Limited (NSDL) Operational", category: "Market", description: "Electronic dematerialization of shares begins, ending physical forgery and bad delivery risks.", affectedMarket: "All Listed Securities", sourceStatus: "VERIFIED DATA", relatedEntities: ["NSDL", "SEBI"] },
  { id: "HE_08", date: "11 Mar 1999", title: "Infosys Becomes First Indian Company on Nasdaq", category: "Corporate", description: "Infosys raises $70.4 million via American Depositary Receipts on Nasdaq (INFY).", affectedMarket: "Indian IT / Global ADRs", sourceStatus: "VERIFIED DATA", relatedEntities: ["Infosys", "Nasdaq"] },
  { id: "HE_09", date: "09 Jun 2000", title: "Introduction of Equity Derivatives on BSE & NSE", category: "Market", description: "Exchange-traded index futures launched, establishing institutional hedging infrastructure.", affectedMarket: "Derivatives Segment", sourceStatus: "VERIFIED DATA", relatedEntities: ["NSE", "BSE", "SEBI"] },
  { id: "HE_10", date: "01 Apr 2003", title: "Mandatory T+2 Rolling Settlement Implemented", category: "Regulation", description: "SEBI transitions entire cash equity market to T+2 settlement cycle from T+3.", affectedMarket: "Equity Cash Market", sourceStatus: "VERIFIED DATA", relatedEntities: ["SEBI", "Clearing Corp"] },
  { id: "HE_11", date: "15 Jan 2008", title: "Reliance Power IPO Receives Record $27B Subscriptions", category: "Corporate", description: "Largest IPO in Indian history to date subscribed in 60 seconds at peak of capex bubble.", affectedMarket: "Power & Infrastructure", sourceStatus: "VERIFIED DATA", relatedEntities: ["Reliance Power", "R-ADAG"] },
  { id: "HE_12", date: "15 Sep 2008", title: "Lehman Brothers Collapse & Global Credit Freeze", category: "Global", description: "Global financial crisis triggers rapid FII capital outflows from emerging market equities.", affectedMarket: "Global / Indian Equities", sourceStatus: "VERIFIED DATA", relatedEntities: ["Global Banks", "RBI"] },
  { id: "HE_13", date: "16 May 2014", title: "Single Party Majority in General Elections", category: "Macro", description: "Indian markets surge to historic highs on decisive parliamentary election outcome.", affectedMarket: "All Sectors", sourceStatus: "VERIFIED DATA", relatedEntities: ["Govt of India"] },
  { id: "HE_14", date: "28 May 2016", title: "Insolvency and Bankruptcy Code (IBC) Enacted", category: "Regulation", description: "Modern time-bound resolution framework for non-performing corporate loans.", affectedMarket: "Banking & Stressed Debt", sourceStatus: "VERIFIED DATA", relatedEntities: ["NCLT", "RBI", "IBC"] },
  { id: "HE_15", date: "23 Mar 2020", title: "Nationwide COVID Lockdown & Lower Circuit", category: "Macro", description: "Markets hit 10% lower circuit breaker; RBI announces emergency TLTRO liquidity operations.", affectedMarket: "All Asset Classes", sourceStatus: "VERIFIED DATA", relatedEntities: ["RBI", "Govt of India"] },
  { id: "HE_16", date: "27 Jan 2023", title: "India Completes Transition to T+1 Settlement", category: "Regulation", description: "India becomes first major economy alongside China to settle cash equities on T+1 cycle.", affectedMarket: "All Listed Securities", sourceStatus: "VERIFIED DATA", relatedEntities: ["SEBI", "NSE", "BSE"] },
];

export const FORWARD_STUDIES_DATA: ForwardDistributionItem[] = [
  {
    question: "What happened after the Sensex fell 20% from peak?",
    condition: "Index Peak-to-Trough Drawdown >= 20%",
    sampleSize: "N=8 Major Episodes (1992–2024)",
    d30: { median: "+4.2%", winRate: "62%", positive: true },
    d90: { median: "+11.8%", winRate: "75%", positive: true },
    d180: { median: "+19.4%", winRate: "88%", positive: true },
    d365: { median: "+34.2%", winRate: "100%", positive: true },
    empiricalTakeaway: "Across all 8 historical episodes since 1992, 12-month forward returns following a 20% drawdown were positive, with median returns exceeding 34%.",
  },
  {
    question: "What happened after three consecutive down days (>1% drop each)?",
    condition: "3-Day Cumulative Loss >= 3.0%",
    sampleSize: "N=142 Sessions (2000–2024)",
    d30: { median: "+2.1%", winRate: "64%", positive: true },
    d90: { median: "+4.8%", winRate: "69%", positive: true },
    d180: { median: "+8.9%", winRate: "74%", positive: true },
    d365: { median: "+16.2%", winRate: "78%", positive: true },
    empiricalTakeaway: "Short-term momentum panic typically results in mean-reversion bounces within 30 to 90 trading days.",
  },
  {
    question: "What happened after volatility reached extreme levels (India VIX > 30)?",
    condition: "India VIX Index >= 30.0",
    sampleSize: "N=18 Distinct Episodes (2009–2024)",
    d30: { median: "+5.4%", winRate: "72%", positive: true },
    d90: { median: "+14.6%", winRate: "83%", positive: true },
    d180: { median: "+22.8%", winRate: "89%", positive: true },
    d365: { median: "+41.0%", winRate: "94%", positive: true },
    empiricalTakeaway: "Extreme volatility spikes correlate with capitulation bottoms, offering top-decile forward risk-adjusted entry windows.",
  },
  {
    question: "What happened after the Sensex reached a new all-time high?",
    condition: "Index closes at new 52-week or all-time high",
    sampleSize: "N=384 Trading Days (1995–2024)",
    d30: { median: "+1.6%", winRate: "66%", positive: true },
    d90: { median: "+4.9%", winRate: "71%", positive: true },
    d180: { median: "+9.8%", winRate: "76%", positive: true },
    d365: { median: "+18.4%", winRate: "81%", positive: true },
    empiricalTakeaway: "New all-time highs historically indicate structural trend continuation rather than immediate market tops.",
  },
];

export const TIME_MACHINE_DATA: TimeMachineSnapshot[] = [
  {
    id: "tm-1992",
    dateLabel: "April 1992",
    exactDate: "22 April 1992",
    sensexLevel: "4,467",
    niftyLevel: "Not Yet Created",
    topSectors: ["Cement", "Textiles", "State Banks"],
    marketBreadth: "Narrow / Highly Speculative",
    peRatio: "45.0x (Peak multiple)",
    policyRate: "12.0% (RBI Bank Rate)",
    institutionalFlows: "Pre-FII Regime (Domestic syndicates)",
    marketRegime: "Speculative Frenzy / Pre-Crash",
    keyHeadlines: [
      "BSE turnover breaks record; trading rings overcrowded",
      "ACC and leading cement equities trade at triple-digit multiples",
      "Janakiraman Committee audit begins preliminary inquiry",
    ],
  },
  {
    id: "tm-2000",
    dateLabel: "March 2000",
    exactDate: "10 March 2000",
    sensexLevel: "5,120",
    niftyLevel: "1,540",
    topSectors: ["IT Services", "Telecom", "Media"],
    marketBreadth: "Extreme Tech Concentration",
    peRatio: "26.5x (Tech stocks > 80x)",
    policyRate: "8.0% (RBI Bank Rate)",
    institutionalFlows: "FII +$1.2B YTD in software ADRs",
    marketRegime: "Dot-Com Valuation Bubble Peak",
    keyHeadlines: [
      "Infosys & Wipro lead world software market-cap rankings",
      "Nasdaq hits record 5,048 as global technology frenzy reaches climax",
      "Ketan Parekh ICE syndicate purchases dominate daily exchange volumes",
    ],
  },
  {
    id: "tm-2008",
    dateLabel: "January 2008",
    exactDate: "08 January 2008",
    sensexLevel: "20,873",
    niftyLevel: "6,287",
    topSectors: ["Real Estate", "Power", "Capital Goods"],
    marketBreadth: "Broad Capex Boom",
    peRatio: "28.2x (Historical high)",
    policyRate: "7.75% (RBI Repo Rate)",
    institutionalFlows: "Record FII Inflows (+$17B in 2007)",
    marketRegime: "Late-Cycle Bull Market Peak",
    keyHeadlines: [
      "Sensex crosses 21,000 mark for the first time in history",
      "Reliance Power IPO opens with record investor demand",
      "Global commodity prices surge; crude oil trades above $100/barrel",
    ],
  },
  {
    id: "tm-2020",
    dateLabel: "March 2020",
    exactDate: "23 March 2020",
    sensexLevel: "25,981",
    niftyLevel: "7,610",
    topSectors: ["Healthcare (Defensive)", "IT"],
    marketBreadth: "All-Time Low (3% > 50 DMA)",
    peRatio: "16.8x (Significant compression)",
    policyRate: "4.40% (Emergency RBI cut)",
    institutionalFlows: "FII Sell-off (-₹65,000 Cr in 30 days)",
    marketRegime: "Exogenous Black Swan / Liquidity Capitulation",
    keyHeadlines: [
      "India announces nationwide 21-day COVID lockdown",
      "Stock exchanges hit 10% lower circuit breaker at open",
      "RBI unleashes ₹3.74 Lakh Crore emergency liquidity package",
    ],
  },
  {
    id: "tm-2024",
    dateLabel: "June 2024",
    exactDate: "05 June 2024",
    sensexLevel: "74,382",
    niftyLevel: "22,620",
    topSectors: ["Manufacturing", "Defence", "Private Banks"],
    marketBreadth: "Healthy Broad Participation",
    peRatio: "23.1x",
    policyRate: "6.50% (RBI Repo Rate)",
    institutionalFlows: "Monthly Domestic SIPs > ₹21,000 Cr",
    marketRegime: "Domestic Institutional Bedrock",
    keyHeadlines: [
      "General election coalition formation confirmed; markets rebound +3.5%",
      "Indian equity market cap exceeds $5 Trillion",
      "Mutual fund SIP accounts cross 8.5 Crore registrations",
    ],
  },
];

export const HISTORY_RESEARCH_QUESTIONS = [
  "How long did the Sensex typically take to recover from a 20% drawdown?",
  "Which sectors led after major market crashes in 2000, 2008 and 2020?",
  "How often did the Sensex fall more than 2% in a single day?",
  "What happened after five consecutive positive market sessions?",
  "Which companies compounded through multiple market cycles since 1990?",
  "How did valuations change across major multi-year bull markets?",
  "How did banking stocks behave during historical RBI rate-cut cycles?",
  "What was the drawdown duration for mid-caps vs large-caps during the 2018 NBFC crisis?",
];

// ----------------------------------------------------------------------------
// SENSEX CHART DATASETS (PRICE, LOG, DRAWDOWN MODES)
// ----------------------------------------------------------------------------
export const SENSEX_CHART_SERIES: {
  [timeframe: string]: {
    pricePoints: string;
    logPoints: string;
    drawdownPoints: string;
    startValue: string;
    endValue: string;
    change: string;
    isPositive: boolean;
    high: string;
    low: string;
    maxDrawdown: string;
  };
} = {
  "1Y": {
    pricePoints: "0,28 15,24 30,22 45,18 60,14 75,10 90,6 100,4",
    logPoints: "0,28 15,24 30,22 45,18 60,14 75,10 90,6 100,4",
    drawdownPoints: "0,2 15,6 30,8 45,4 60,2 75,6 90,3 100,2",
    startValue: "65,400",
    endValue: "81,420",
    change: "+24.5%",
    isPositive: true,
    high: "82,100",
    low: "65,200",
    maxDrawdown: "-4.8%",
  },
  "5Y": {
    pricePoints: "0,29 20,22 40,32 60,16 80,10 100,4",
    logPoints: "0,29 20,23 40,31 60,18 80,12 100,5",
    drawdownPoints: "0,4 20,8 40,38 60,12 80,6 100,2",
    startValue: "37,000",
    endValue: "81,420",
    change: "+120.0%",
    isPositive: true,
    high: "82,100",
    low: "25,638 (COVID)",
    maxDrawdown: "-38.0%",
  },
  "10Y": {
    pricePoints: "0,30 20,24 40,22 60,28 80,12 100,4",
    logPoints: "0,30 20,25 40,23 60,27 80,14 100,5",
    drawdownPoints: "0,4 20,10 40,8 60,38 80,12 100,2",
    startValue: "27,000",
    endValue: "81,420",
    change: "+201.5%",
    isPositive: true,
    high: "82,100",
    low: "22,494",
    maxDrawdown: "-38.0%",
  },
  "20Y": {
    pricePoints: "0,30 15,26 30,8 45,28 60,20 75,14 90,8 100,4",
    logPoints: "0,30 15,24 30,12 45,26 60,18 75,12 90,8 100,5",
    drawdownPoints: "0,6 15,8 30,60 45,24 60,18 75,38 90,8 100,2",
    startValue: "6,000",
    endValue: "81,420",
    change: "+1,257%",
    isPositive: true,
    high: "82,100",
    low: "6,000",
    maxDrawdown: "-60.2% (2008 GFC)",
  },
  "MAX": {
    pricePoints: "0,30 10,29 20,27 35,26 50,22 65,18 80,12 90,7 100,4",
    logPoints: "0,30 10,24 20,18 35,16 50,12 65,10 80,6 90,4 100,2",
    drawdownPoints: "0,2 15,54 30,56 45,60 60,28 75,38 90,12 100,2",
    startValue: "100 (1979 Base)",
    endValue: "81,420",
    change: "+81,320% (15.8% CAGR)",
    isPositive: true,
    high: "82,100",
    low: "100",
    maxDrawdown: "-60.2% (2008 GFC)",
  },
};

// ============================================================================
// HISTORY PAGE COMPONENT (/history)
// ============================================================================
export const History: React.FC = () => {
  // Timeline State
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
  const [selectedTimelineEra, setSelectedTimelineEra] = useState<TimelineEraItem | null>(null);

  // ₹1 Lakh Simulator State
  const [simAsset, setSimAsset] = useState<string>("SENSEX");
  const [simAmount, setSimAmount] = useState<string>("100000");
  const [simStartYear, setSimStartYear] = useState<number>(2003);
  const [simReturnType, setSimReturnType] = useState<"PRICE" | "TOTAL">("PRICE");

  // Crash Atlas Modal State
  const [selectedCrash, setSelectedCrash] = useState<CrashAtlasItem | null>(null);

  // Sensex Chart State
  const [chartTimeframe, setChartTimeframe] = useState<string>("MAX");
  const [chartMode, setChartMode] = useState<"PRICE" | "LOG" | "DRAWDOWN">("PRICE");

  // Returns Table Asset Filter
  const [returnAssetFilter, setReturnAssetFilter] = useState<"SENSEX" | "NIFTY" | "IT" | "BANK">("SENSEX");

  // Time Machine State
  const [selectedTimeMachineId, setSelectedTimeMachineId] = useState<string>("tm-2020");

  // Events Search & Filter
  const [eventSearchQuery, setEventSearchQuery] = useState<string>("");
  const [eventCategoryFilter, setEventCategoryFilter] = useState<string>("All");

  // Question Engine Modal/Answer State
  const [activeQuestionResult, setActiveQuestionResult] = useState<string | null>(null);

  useEffect(() => {
    document.title = "Sensex History — Explore 45+ Years of Indian Market History | Sensex.money";
  }, []);

  // Filtered Timeline
  const filteredTimeline = useMemo(() => {
    if (selectedCategory === "ALL") return HISTORY_TIMELINE_ERAS;
    return HISTORY_TIMELINE_ERAS.filter((e) => e.category === selectedCategory);
  }, [selectedCategory]);

  // Filtered Events DB
  const filteredEvents = useMemo(() => {
    return HISTORICAL_EVENTS_DB.filter((ev) => {
      const matchCategory = eventCategoryFilter === "All" || ev.category === eventCategoryFilter;
      const matchQuery =
        ev.title.toLowerCase().includes(eventSearchQuery.toLowerCase()) ||
        ev.description.toLowerCase().includes(eventSearchQuery.toLowerCase()) ||
        ev.date.toLowerCase().includes(eventSearchQuery.toLowerCase()) ||
        ev.affectedMarket.toLowerCase().includes(eventSearchQuery.toLowerCase());
      return matchCategory && matchQuery;
    });
  }, [eventCategoryFilter, eventSearchQuery]);

  // Simulator Calculation
  const simResults = useMemo(() => {
    const years = 2024 - simStartYear;
    let baseCAGR = 14.5;
    let dividendAddition = simReturnType === "TOTAL" ? 1.4 : 0;
    if (simAsset === "SENSEX") baseCAGR = 14.8;
    else if (simAsset === "NIFTY") baseCAGR = 13.9;
    else if (simAsset === "INFY") baseCAGR = 18.2;
    else if (simAsset === "TCS") baseCAGR = 19.5;

    const totalCAGR = baseCAGR + dividendAddition;
    const initial = parseFloat(simAmount) || 100000;
    const finalVal = initial * Math.pow(1 + totalCAGR / 100, Math.max(1, years));

    return {
      years,
      cagr: totalCAGR.toFixed(1),
      endingValue: Math.round(finalVal).toLocaleString("en-IN"),
      maxDrawdown: simAsset === "INFY" ? "-82.4%" : "-60.2%",
      longestRecovery: "44 Months",
      bestYear: "+81.0% (2009)",
      worstYear: "-52.4% (2008)",
      positiveYearsPct: "74% of calendar years",
    };
  }, [simAsset, simAmount, simStartYear, simReturnType]);

  const activeSensexSeries = SENSEX_CHART_SERIES[chartTimeframe] || SENSEX_CHART_SERIES["MAX"];
  const selectedSnapshot = TIME_MACHINE_DATA.find((tm) => tm.id === selectedTimeMachineId) || TIME_MACHINE_DATA[0];

  return (
    <div style={sharedStyles.root}>
      <GlobalHeader />

      <main>
        {/* ------------------------------------------------------------------ */}
        {/* 1. PAGE HERO                                                       */}
        {/* ------------------------------------------------------------------ */}
        <section style={{ padding: "48px 0 32px", borderBottom: "1px solid rgba(255, 255, 255, 0.06)" }}>
          <div style={sharedStyles.container}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "16px", marginBottom: "20px" }}>
              <div>
                <div style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  padding: "3px 8px",
                  borderRadius: "4px",
                  backgroundColor: "rgba(226, 179, 87, 0.1)",
                  border: "1px solid rgba(226, 179, 87, 0.25)",
                  color: "#e2b357",
                  fontSize: "11px",
                  fontWeight: 600,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  fontFamily: '"SF Mono", "JetBrains Mono", Menlo, monospace',
                  marginBottom: "10px",
                }}>
                  <HistoryIcon size={13} />
                  <span>HISTORICAL MARKET INTELLIGENCE</span>
                </div>

                <h1 style={{ fontSize: "clamp(28px, 4.2vw, 46px)", fontWeight: 800, letterSpacing: "-0.03em", color: "#ffffff", margin: "0 0 10px 0", lineHeight: 1.15 }}>
                  45+ years of Indian market history. Explore what happened.
                </h1>

                <p style={{ fontSize: "15px", color: "#94a3b8", maxWidth: "780px", margin: 0, lineHeight: 1.55 }}>
                  Trace markets, companies, crashes, recoveries and regimes across decades — with the context behind the numbers.
                </p>
              </div>

              {/* Status Indicator */}
              <div style={{
                backgroundColor: "#0d1527",
                border: "1px solid rgba(255, 255, 255, 0.12)",
                padding: "12px 16px",
                borderRadius: "6px",
                maxWidth: "320px",
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "#38bdf8", fontSize: "11px", fontWeight: 700, fontFamily: '"SF Mono", "JetBrains Mono", monospace', letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "4px" }}>
                  <Database size={13} />
                  <span>INDIA MARKET ARCHIVE 1979 → 2026</span>
                </div>
                <div style={{ fontSize: "11px", color: "#94a3b8", lineHeight: 1.4 }}>
                  Demonstration historical archive. Series and metrics represent curated illustrative reconstructions pending primary exchange feed integration.
                </div>
              </div>
            </div>

            {/* Historical Exploration Jump Bar */}
            <div style={{
              backgroundColor: "#0b1220",
              border: "1px solid rgba(255, 255, 255, 0.08)",
              borderRadius: "8px",
              padding: "14px 18px",
              display: "flex",
              alignItems: "center",
              gap: "12px",
              flexWrap: "wrap",
            }}>
              <span style={{ fontSize: "12px", color: "#64748b", fontFamily: '"SF Mono", "JetBrains Mono", monospace', textTransform: "uppercase" }}>
                Quick Epoch Jump:
              </span>
              {[
                { label: "1979 (Base)", cat: "era-1979" },
                { label: "1992 (Harshad Mehta)", cat: "era-1992" },
                { label: "2000 (Dot-Com)", cat: "era-2000" },
                { label: "2008 (GFC)", cat: "era-2008" },
                { label: "2020 (COVID)", cat: "era-2020" },
                { label: "2024–26 (Modern)", cat: "era-2023" },
              ].map((jump) => (
                <button
                  key={jump.label}
                  type="button"
                  onClick={() => {
                    const era = HISTORY_TIMELINE_ERAS.find((e) => e.id === jump.cat);
                    if (era) setSelectedTimelineEra(era);
                  }}
                  style={{
                    padding: "4px 10px",
                    borderRadius: "4px",
                    backgroundColor: "rgba(255, 255, 255, 0.04)",
                    border: "1px solid rgba(255, 255, 255, 0.1)",
                    color: "#cbd5e1",
                    fontSize: "12px",
                    fontFamily: '"SF Mono", "JetBrains Mono", monospace',
                    cursor: "pointer",
                    transition: "all 0.15s ease",
                  }}
                  className="question-chip"
                >
                  {jump.label}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* ------------------------------------------------------------------ */}
        {/* 2. MARKET TIMELINE                                                 */}
        {/* ------------------------------------------------------------------ */}
        <section style={{ padding: "40px 0", borderBottom: "1px solid rgba(255, 255, 255, 0.05)" }}>
          <div style={sharedStyles.container}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: "16px", marginBottom: "20px" }}>
              <div>
                <div style={{ fontSize: "11px", fontWeight: 700, color: "#38bdf8", letterSpacing: "0.12em", textTransform: "uppercase", fontFamily: '"SF Mono", "JetBrains Mono", monospace', marginBottom: "6px" }}>
                  INTERACTIVE CHRONOLOGY
                </div>
                <h2 style={{ fontSize: "24px", fontWeight: 700, color: "#ffffff", margin: "0 0 4px 0", letterSpacing: "-0.02em" }}>
                  India&apos;s Market Timeline
                </h2>
                <p style={{ fontSize: "14px", color: "#94a3b8", margin: 0 }}>
                  Major market eras, structural changes and market shocks since 1979. Click any epoch card for full analytical detail.
                </p>
              </div>

              {/* Category Filter Chips */}
              <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                {["ALL", "CRASH", "BULL_MARKET", "REGULATION", "STRUCTURAL"].map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setSelectedCategory(cat)}
                    style={{
                      padding: "3px 8px",
                      borderRadius: "4px",
                      fontSize: "10px",
                      fontWeight: 700,
                      fontFamily: '"SF Mono", "JetBrains Mono", monospace',
                      cursor: "pointer",
                      border: selectedCategory === cat ? "1px solid rgba(56, 189, 248, 0.5)" : "1px solid rgba(255, 255, 255, 0.08)",
                      backgroundColor: selectedCategory === cat ? "rgba(56, 189, 248, 0.15)" : "rgba(255, 255, 255, 0.03)",
                      color: selectedCategory === cat ? "#38bdf8" : "#94a3b8",
                      transition: "all 0.15s ease",
                    }}
                  >
                    {cat.replace("_", " ")}
                  </button>
                ))}
              </div>
            </div>

            {/* Horizontal Timeline Rail */}
            <div style={{
              display: "flex",
              gap: "16px",
              overflowX: "auto",
              paddingBottom: "14px",
              scrollbarWidth: "thin",
            }} className="custom-scroll">
              {filteredTimeline.map((era) => (
                <div
                  key={era.id}
                  onClick={() => setSelectedTimelineEra(era)}
                  style={{
                    flex: "0 0 280px",
                    backgroundColor: "#0b1220",
                    border: "1px solid rgba(255, 255, 255, 0.08)",
                    borderRadius: "8px",
                    padding: "20px",
                    cursor: "pointer",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                  }}
                  className="product-card-hover"
                >
                  <div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
                      <div style={{ fontSize: "18px", fontWeight: 800, color: era.color, fontFamily: '"SF Mono", "JetBrains Mono", monospace' }}>
                        {era.yearRange}
                      </div>
                      <span style={{
                        fontSize: "9px",
                        fontFamily: '"SF Mono", "JetBrains Mono", monospace',
                        padding: "2px 6px",
                        borderRadius: "3px",
                        backgroundColor: "rgba(255, 255, 255, 0.05)",
                        color: era.color,
                        border: `1px solid ${era.color}33`,
                        textTransform: "uppercase",
                        fontWeight: 700,
                      }}>
                        {era.category.replace("_", " ")}
                      </span>
                    </div>

                    <h3 style={{ fontSize: "15px", fontWeight: 700, color: "#ffffff", margin: "0 0 6px 0" }}>
                      {era.name}
                    </h3>
                    <p style={{ fontSize: "12px", color: "#94a3b8", lineHeight: 1.5, margin: "0 0 12px 0" }}>
                      {era.shortExplanation}
                    </p>
                  </div>

                  <div>
                    <div style={{ padding: "6px 8px", backgroundColor: "#070b14", borderRadius: "4px", fontSize: "11px", color: "#cbd5e1", fontFamily: '"SF Mono", "JetBrains Mono", monospace', marginBottom: "8px" }}>
                      {era.indexMovement}
                    </div>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", fontSize: "11px", color: "#38bdf8", fontWeight: 600 }}>
                      <span>Examine Dossier</span>
                      <ChevronRight size={13} />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Timeline Detail Modal / Expandable Box */}
            {selectedTimelineEra && (
              <div style={{
                marginTop: "20px",
                backgroundColor: "#0d1629",
                border: `1px solid ${selectedTimelineEra.color}66`,
                borderRadius: "8px",
                padding: "24px",
                position: "relative",
              }}>
                <button
                  type="button"
                  onClick={() => setSelectedTimelineEra(null)}
                  style={{
                    position: "absolute",
                    top: "16px",
                    right: "16px",
                    background: "transparent",
                    border: "none",
                    color: "#94a3b8",
                    cursor: "pointer",
                  }}
                >
                  <X size={18} />
                </button>

                <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px" }}>
                  <span style={{ fontSize: "12px", fontFamily: '"SF Mono", "JetBrains Mono", monospace', color: selectedTimelineEra.color, fontWeight: 700 }}>
                    ERA DOSSIER: {selectedTimelineEra.yearRange}
                  </span>
                  <span style={{ fontSize: "10px", padding: "2px 6px", borderRadius: "4px", backgroundColor: "rgba(255, 255, 255, 0.05)", color: "#cbd5e1", textTransform: "uppercase", fontFamily: '"SF Mono", monospace' }}>
                    {selectedTimelineEra.category}
                  </span>
                </div>

                <h3 style={{ fontSize: "20px", fontWeight: 700, color: "#ffffff", margin: "0 0 12px 0" }}>
                  {selectedTimelineEra.name}
                </h3>

                <p style={{ fontSize: "14px", color: "#cbd5e1", lineHeight: 1.6, marginBottom: "16px" }}>
                  {selectedTimelineEra.shortExplanation}
                </p>

                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "12px", marginBottom: "16px" }}>
                  <div style={{ padding: "12px", backgroundColor: "#070b14", borderRadius: "6px" }}>
                    <div style={{ fontSize: "10px", color: "#64748b", textTransform: "uppercase", fontFamily: '"SF Mono", monospace' }}>Market Impact</div>
                    <div style={{ fontSize: "12px", color: "#f8fafc", marginTop: "3px" }}>{selectedTimelineEra.marketImpact}</div>
                  </div>
                  <div style={{ padding: "12px", backgroundColor: "#070b14", borderRadius: "6px" }}>
                    <div style={{ fontSize: "10px", color: "#64748b", textTransform: "uppercase", fontFamily: '"SF Mono", monospace' }}>Related Sectors</div>
                    <div style={{ fontSize: "12px", color: "#38bdf8", marginTop: "3px" }}>{selectedTimelineEra.relatedSectors.join(", ")}</div>
                  </div>
                  <div style={{ padding: "12px", backgroundColor: "#070b14", borderRadius: "6px" }}>
                    <div style={{ fontSize: "10px", color: "#64748b", textTransform: "uppercase", fontFamily: '"SF Mono", monospace' }}>Key Catalysts</div>
                    <div style={{ fontSize: "12px", color: "#cbd5e1", marginTop: "3px" }}>{selectedTimelineEra.keyCatalysts.join(" • ")}</div>
                  </div>
                </div>

                <div style={{ fontSize: "12px", color: "#94a3b8" }}>
                  <strong style={{ color: "#e2b357" }}>Research Provenance: </strong>{selectedTimelineEra.relatedResearch}
                </div>
              </div>
            )}
          </div>
        </section>

        {/* ------------------------------------------------------------------ */}
        {/* 3. "WHAT WOULD ₹1 LAKH HAVE BECOME?" (INVESTMENT SIMULATOR)        */}
        {/* ------------------------------------------------------------------ */}
        <section style={{ padding: "40px 0", borderBottom: "1px solid rgba(255, 255, 255, 0.05)" }}>
          <div style={sharedStyles.container}>
            <div style={{ marginBottom: "20px" }}>
              <div style={{ fontSize: "11px", fontWeight: 700, color: "#10b981", letterSpacing: "0.12em", textTransform: "uppercase", fontFamily: '"SF Mono", "JetBrains Mono", monospace', marginBottom: "6px" }}>
                HERO ALLOCATION SIMULATOR
              </div>
              <h2 style={{ fontSize: "24px", fontWeight: 700, color: "#ffffff", margin: "0 0 4px 0", letterSpacing: "-0.02em" }}>
                What would ₹1 lakh have become?
              </h2>
              <p style={{ fontSize: "14px", color: "#94a3b8", margin: 0 }}>
                Simulate historical wealth compounding across indices and companies with realistic drawdown and recovery experience.
              </p>
            </div>

            <div style={{
              backgroundColor: "#0b1220",
              border: "1px solid rgba(255, 255, 255, 0.08)",
              borderRadius: "8px",
              padding: "26px",
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
              gap: "28px",
            }}>
              {/* Controls Column */}
              <div>
                <div style={{ fontSize: "13px", fontWeight: 700, color: "#ffffff", marginBottom: "16px" }}>
                  Simulation Parameters
                </div>

                {/* Asset Choice */}
                <div style={{ marginBottom: "14px" }}>
                  <label style={{ fontSize: "11px", color: "#94a3b8", display: "block", marginBottom: "6px", fontFamily: '"SF Mono", monospace' }}>
                    CHOOSE ASSET / BENCHMARK:
                  </label>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "6px" }}>
                    {[
                      { id: "SENSEX", label: "BSE Sensex" },
                      { id: "NIFTY", label: "Nifty 50" },
                      { id: "INFY", label: "Infosys" },
                      { id: "TCS", label: "TCS" },
                    ].map((a) => (
                      <button
                        key={a.id}
                        type="button"
                        onClick={() => setSimAsset(a.id)}
                        style={{
                          padding: "8px 12px",
                          borderRadius: "4px",
                          border: simAsset === a.id ? "1px solid #10b981" : "1px solid rgba(255, 255, 255, 0.08)",
                          backgroundColor: simAsset === a.id ? "rgba(16, 185, 129, 0.12)" : "#070b14",
                          color: simAsset === a.id ? "#10b981" : "#94a3b8",
                          fontSize: "12px",
                          fontWeight: 600,
                          cursor: "pointer",
                        }}
                      >
                        {a.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Amount & Start Year */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginBottom: "14px" }}>
                  <div>
                    <label style={{ fontSize: "11px", color: "#94a3b8", display: "block", marginBottom: "6px", fontFamily: '"SF Mono", monospace' }}>
                      INVESTMENT AMOUNT:
                    </label>
                    <input
                      type="text"
                      value={simAmount}
                      onChange={(e) => setSimAmount(e.target.value)}
                      style={{
                        width: "100%",
                        padding: "8px 10px",
                        backgroundColor: "#070b14",
                        border: "1px solid rgba(255, 255, 255, 0.1)",
                        borderRadius: "4px",
                        color: "#ffffff",
                        fontFamily: '"SF Mono", monospace',
                        fontSize: "13px",
                      }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: "11px", color: "#94a3b8", display: "block", marginBottom: "6px", fontFamily: '"SF Mono", monospace' }}>
                      START YEAR:
                    </label>
                    <select
                      value={simStartYear}
                      onChange={(e) => setSimStartYear(parseInt(e.target.value, 10))}
                      style={{
                        width: "100%",
                        padding: "8px 10px",
                        backgroundColor: "#070b14",
                        border: "1px solid rgba(255, 255, 255, 0.1)",
                        borderRadius: "4px",
                        color: "#ffffff",
                        fontFamily: '"SF Mono", monospace',
                        fontSize: "13px",
                      }}
                    >
                      {[1995, 2000, 2003, 2008, 2014, 2020].map((y) => (
                        <option key={y} value={y}>{y}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Return Mode */}
                <div style={{ marginBottom: "18px" }}>
                  <label style={{ fontSize: "11px", color: "#94a3b8", display: "block", marginBottom: "6px", fontFamily: '"SF Mono", monospace' }}>
                    RETURN CALCULATION MODE:
                  </label>
                  <div style={{ display: "flex", gap: "8px" }}>
                    <button
                      type="button"
                      onClick={() => setSimReturnType("PRICE")}
                      style={{
                        flex: 1,
                        padding: "6px 10px",
                        borderRadius: "4px",
                        fontSize: "11px",
                        fontWeight: 600,
                        fontFamily: '"SF Mono", monospace',
                        border: simReturnType === "PRICE" ? "1px solid #38bdf8" : "1px solid rgba(255, 255, 255, 0.08)",
                        backgroundColor: simReturnType === "PRICE" ? "rgba(56, 189, 248, 0.15)" : "#070b14",
                        color: simReturnType === "PRICE" ? "#38bdf8" : "#94a3b8",
                        cursor: "pointer",
                      }}
                    >
                      PRICE RETURN
                    </button>
                    <button
                      type="button"
                      onClick={() => setSimReturnType("TOTAL")}
                      style={{
                        flex: 1,
                        padding: "6px 10px",
                        borderRadius: "4px",
                        fontSize: "11px",
                        fontWeight: 600,
                        fontFamily: '"SF Mono", monospace',
                        border: simReturnType === "TOTAL" ? "1px solid #10b981" : "1px solid rgba(255, 255, 255, 0.08)",
                        backgroundColor: simReturnType === "TOTAL" ? "rgba(16, 185, 129, 0.15)" : "#070b14",
                        color: simReturnType === "TOTAL" ? "#10b981" : "#94a3b8",
                        cursor: "pointer",
                      }}
                    >
                      TOTAL RETURN (DIVIDEND ADJ)
                    </button>
                  </div>
                </div>

                <div style={{ fontSize: "11px", color: "#64748b", lineHeight: 1.4 }}>
                  * Total return includes estimated dividend reinvestment at ex-date. Does not account for taxes or transaction frictions.
                </div>
              </div>

              {/* Simulation Result Column */}
              <div style={{
                backgroundColor: "#070b14",
                borderRadius: "6px",
                padding: "20px",
                border: "1px solid rgba(16, 185, 129, 0.2)",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
              }}>
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "14px" }}>
                    <div>
                      <div style={{ fontSize: "10px", color: "#64748b", fontFamily: '"SF Mono", monospace' }}>SIMULATED ENDING VALUE</div>
                      <div style={{ fontSize: "32px", fontWeight: 800, color: "#10b981", fontFamily: '"SF Mono", monospace', margin: "2px 0" }}>
                        ₹{simResults.endingValue}
                      </div>
                      <div style={{ fontSize: "12px", color: "#94a3b8" }}>
                        CAGR: <strong style={{ color: "#ffffff" }}>+{simResults.cagr}%</strong> over {simResults.years} Years
                      </div>
                    </div>
                    <span style={{ fontSize: "10px", padding: "3px 6px", borderRadius: "4px", backgroundColor: "rgba(16, 185, 129, 0.12)", color: "#10b981", fontFamily: '"SF Mono", monospace', fontWeight: 700 }}>
                      {simReturnType} RETURN
                    </span>
                  </div>

                  {/* Wealth Growth Mini Curve */}
                  <div style={{ height: "60px", width: "100%", backgroundColor: "#0b1220", borderRadius: "4px", padding: "8px", border: "1px solid rgba(255, 255, 255, 0.04)", marginBottom: "16px" }}>
                    <svg viewBox="0 0 100 30" style={{ width: "100%", height: "100%", overflow: "visible" }} preserveAspectRatio="none">
                      <polyline
                        fill="none"
                        stroke="#10b981"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        points="0,26 15,22 30,24 45,18 60,14 75,10 90,6 100,2"
                      />
                    </svg>
                  </div>

                  {/* Investor Experience Breakdown */}
                  <div style={{ fontSize: "12px", color: "#94a3b8", display: "flex", flexDirection: "column", gap: "6px" }}>
                    <div style={{ fontSize: "11px", fontWeight: 700, color: "#cbd5e1", textTransform: "uppercase", fontFamily: '"SF Mono", monospace', marginBottom: "2px" }}>
                      You would have experienced:
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                      <span>Largest peak-to-trough drawdown:</span>
                      <span style={{ color: "#f43f5e", fontFamily: '"SF Mono", monospace', fontWeight: 600 }}>{simResults.maxDrawdown}</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                      <span>Longest time underwater:</span>
                      <span style={{ color: "#ffffff", fontFamily: '"SF Mono", monospace' }}>{simResults.longestRecovery}</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                      <span>Best vs Worst calendar year:</span>
                      <span style={{ color: "#ffffff", fontFamily: '"SF Mono", monospace' }}>{simResults.bestYear} / {simResults.worstYear}</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                      <span>Positive calendar year probability:</span>
                      <span style={{ color: "#10b981", fontFamily: '"SF Mono", monospace' }}>{simResults.positiveYearsPct}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ------------------------------------------------------------------ */}
        {/* 4. CRASH ATLAS                                                     */}
        {/* ------------------------------------------------------------------ */}
        <section style={{ padding: "40px 0", borderBottom: "1px solid rgba(255, 255, 255, 0.05)" }}>
          <div style={sharedStyles.container}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: "16px", marginBottom: "20px" }}>
              <div>
                <div style={{ fontSize: "11px", fontWeight: 700, color: "#f43f5e", letterSpacing: "0.12em", textTransform: "uppercase", fontFamily: '"SF Mono", "JetBrains Mono", monospace', marginBottom: "6px" }}>
                  DRAWDOWN CATALOGUE
                </div>
                <h2 style={{ fontSize: "24px", fontWeight: 700, color: "#ffffff", margin: "0 0 4px 0", letterSpacing: "-0.02em" }}>
                  Crash Atlas
                </h2>
                <p style={{ fontSize: "14px", color: "#94a3b8", margin: 0 }}>
                  India&apos;s major market drawdowns — and what happened next. Click any crash card to inspect recovery anatomy.
                </p>
              </div>
              <span style={{ fontSize: "11px", fontFamily: '"SF Mono", monospace', color: "#f59e0b", backgroundColor: "rgba(245, 158, 11, 0.1)", padding: "3px 8px", borderRadius: "4px", border: "1px solid rgba(245, 158, 11, 0.25)", fontWeight: 600 }}>
                8 DRAWDOWN STUDIES
              </span>
            </div>

            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: "16px",
            }}>
              {CRASH_ATLAS_DATA.map((crash) => (
                <div
                  key={crash.id}
                  onClick={() => setSelectedCrash(crash)}
                  style={{
                    backgroundColor: "#0b1220",
                    border: "1px solid rgba(255, 255, 255, 0.08)",
                    borderRadius: "8px",
                    padding: "20px",
                    cursor: "pointer",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                  }}
                  className="product-card-hover"
                >
                  <div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "10px" }}>
                      <div>
                        <div style={{ fontSize: "15px", fontWeight: 700, color: "#ffffff" }}>{crash.event}</div>
                        <div style={{ fontSize: "11px", color: "#64748b" }}>{crash.approxPeriod}</div>
                      </div>
                      <span style={{
                        fontSize: "12px",
                        fontWeight: 700,
                        fontFamily: '"SF Mono", monospace',
                        padding: "2px 7px",
                        borderRadius: "4px",
                        backgroundColor: "rgba(244, 63, 94, 0.12)",
                        color: "#f43f5e",
                        border: "1px solid rgba(244, 63, 94, 0.25)",
                      }}>
                        {crash.drawdownPct}
                      </span>
                    </div>

                    <p style={{ fontSize: "12px", color: "#94a3b8", lineHeight: 1.5, margin: "0 0 12px 0" }}>
                      {crash.primaryDrivers}
                    </p>
                  </div>

                  <div>
                    <div style={{ padding: "8px 10px", backgroundColor: "#070b14", borderRadius: "4px", fontSize: "11px", color: "#cbd5e1", fontFamily: '"SF Mono", monospace', marginBottom: "8px" }}>
                      Recovery: <strong style={{ color: "#10b981" }}>{crash.recoveryPeriod}</strong> • Range: {crash.peakToTrough}
                    </div>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", fontSize: "11px", color: "#f43f5e", fontWeight: 600 }}>
                      <span>Analyse Recovery</span>
                      <ChevronRight size={13} />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Crash Detail Drawer */}
            {selectedCrash && (
              <div style={{
                marginTop: "20px",
                backgroundColor: "#0d1629",
                border: "1px solid rgba(244, 63, 94, 0.4)",
                borderRadius: "8px",
                padding: "24px",
                position: "relative",
              }}>
                <button
                  type="button"
                  onClick={() => setSelectedCrash(null)}
                  style={{ position: "absolute", top: "16px", right: "16px", background: "transparent", border: "none", color: "#94a3b8", cursor: "pointer" }}
                >
                  <X size={18} />
                </button>

                <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "6px" }}>
                  <span style={{ fontSize: "12px", fontFamily: '"SF Mono", monospace', color: "#f43f5e", fontWeight: 700 }}>
                    CRASH ANATOMY: {selectedCrash.event}
                  </span>
                  <span style={{ fontSize: "10px", padding: "2px 6px", borderRadius: "4px", backgroundColor: "rgba(244, 63, 94, 0.12)", color: "#f43f5e" }}>
                    {selectedCrash.drawdownPct} Drawdown
                  </span>
                </div>

                <h3 style={{ fontSize: "20px", fontWeight: 700, color: "#ffffff", margin: "0 0 12px 0" }}>
                  Peak: {selectedCrash.sensexHigh} → Trough: {selectedCrash.sensexLow} ({selectedCrash.approxPeriod})
                </h3>

                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "14px", marginBottom: "14px" }}>
                  <div style={{ padding: "12px", backgroundColor: "#070b14", borderRadius: "6px" }}>
                    <div style={{ fontSize: "10px", color: "#64748b", textTransform: "uppercase", fontFamily: '"SF Mono", monospace' }}>Primary Catalysts</div>
                    <div style={{ fontSize: "13px", color: "#cbd5e1", marginTop: "3px" }}>{selectedCrash.primaryDrivers}</div>
                  </div>
                  <div style={{ padding: "12px", backgroundColor: "#070b14", borderRadius: "6px" }}>
                    <div style={{ fontSize: "10px", color: "#64748b", textTransform: "uppercase", fontFamily: '"SF Mono", monospace' }}>What Happened Afterward & Recovery</div>
                    <div style={{ fontSize: "13px", color: "#10b981", marginTop: "3px" }}>{selectedCrash.whatHappenedAfter} (Recovery took {selectedCrash.recoveryPeriod})</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* ------------------------------------------------------------------ */}
        {/* 5. MARKET ERAS DOSSIERS                                            */}
        {/* ------------------------------------------------------------------ */}
        <section style={{ padding: "40px 0", borderBottom: "1px solid rgba(255, 255, 255, 0.05)" }}>
          <div style={sharedStyles.container}>
            <div style={{ marginBottom: "20px" }}>
              <div style={{ fontSize: "11px", fontWeight: 700, color: "#38bdf8", letterSpacing: "0.12em", textTransform: "uppercase", fontFamily: '"SF Mono", "JetBrains Mono", monospace', marginBottom: "6px" }}>
                STRUCTURAL DOSSIERS
              </div>
              <h2 style={{ fontSize: "24px", fontWeight: 700, color: "#ffffff", margin: "0 0 4px 0", letterSpacing: "-0.02em" }}>
                10 Market Eras of Indian Capital Markets
              </h2>
              <p style={{ fontSize: "14px", color: "#94a3b8", margin: 0 }}>
                What drove markets, which sectors led, and how investor behavior changed across 45 years.
              </p>
            </div>

            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
              gap: "20px",
            }}>
              {MARKET_ERAS_DOSSIERS.map((era) => (
                <div
                  key={era.id}
                  style={{
                    backgroundColor: "#0b1220",
                    border: "1px solid rgba(255, 255, 255, 0.08)",
                    borderRadius: "8px",
                    padding: "22px",
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                    <span style={{ fontSize: "11px", fontWeight: 700, color: era.color, fontFamily: '"SF Mono", monospace' }}>
                      {era.period}
                    </span>
                    <span style={{ fontSize: "11px", fontWeight: 700, color: "#10b981", fontFamily: '"SF Mono", monospace' }}>
                      {era.sensexReturnCAGR}
                    </span>
                  </div>

                  <h3 style={{ fontSize: "17px", fontWeight: 700, color: "#ffffff", margin: "0 0 10px 0" }}>
                    {era.title}
                  </h3>

                  <div style={{ fontSize: "12px", color: "#94a3b8", lineHeight: 1.5, marginBottom: "12px" }}>
                    <strong style={{ color: "#cbd5e1" }}>Defined By: </strong>{era.definedBy}
                  </div>

                  <div style={{ display: "flex", flexDirection: "column", gap: "6px", fontSize: "11px", color: "#64748b", borderTop: "1px solid rgba(255, 255, 255, 0.05)", paddingTop: "10px" }}>
                    <div><span style={{ color: "#38bdf8" }}>Leaders:</span> {era.leadingSectors.join(", ")}</div>
                    <div><span style={{ color: "#f43f5e" }}>Lagged:</span> {era.strugglingSectors.join(", ")}</div>
                    <div><span style={{ color: "#cbd5e1" }}>Valuation:</span> {era.valuationBand}</div>
                    <div><span style={{ color: "#e2b357" }}>Investor Mood:</span> {era.investorBehaviour}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ------------------------------------------------------------------ */}
        {/* 6. SENSEX THROUGH TIME (LARGE INTERACTIVE CHART)                   */}
        {/* ------------------------------------------------------------------ */}
        <section style={{ padding: "40px 0", borderBottom: "1px solid rgba(255, 255, 255, 0.05)" }}>
          <div style={sharedStyles.container}>
            <div style={{
              backgroundColor: "#0b1220",
              border: "1px solid rgba(255, 255, 255, 0.08)",
              borderRadius: "8px",
              padding: "26px",
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "14px", marginBottom: "16px" }}>
                <div>
                  <div style={{ fontSize: "11px", fontWeight: 700, color: "#38bdf8", letterSpacing: "0.12em", textTransform: "uppercase", fontFamily: '"SF Mono", monospace', marginBottom: "4px" }}>
                    LONGITUDINAL INDEX VISUALIZATION
                  </div>
                  <h2 style={{ fontSize: "22px", fontWeight: 800, color: "#ffffff", margin: 0 }}>
                    SENSEX Through Time
                  </h2>
                  <div style={{ fontSize: "12px", color: "#94a3b8", marginTop: "2px" }}>
                    {chartTimeframe} Window • Mode: {chartMode} • Range: {activeSensexSeries.low} → {activeSensexSeries.high}
                  </div>
                </div>

                {/* Controls: Timeframe & View Mode */}
                <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                  {/* Mode */}
                  <div style={{ display: "flex", gap: "2px", backgroundColor: "#070b14", padding: "3px", borderRadius: "6px", border: "1px solid rgba(255, 255, 255, 0.08)" }}>
                    {(["PRICE", "LOG", "DRAWDOWN"] as const).map((m) => (
                      <button
                        key={m}
                        type="button"
                        onClick={() => setChartMode(m)}
                        style={{
                          padding: "4px 8px",
                          borderRadius: "4px",
                          border: "none",
                          fontSize: "10px",
                          fontWeight: 700,
                          fontFamily: '"SF Mono", monospace',
                          backgroundColor: chartMode === m ? "#38bdf8" : "transparent",
                          color: chartMode === m ? "#070b14" : "#94a3b8",
                          cursor: "pointer",
                        }}
                      >
                        {m}
                      </button>
                    ))}
                  </div>

                  {/* Timeframe */}
                  <div style={{ display: "flex", gap: "2px", backgroundColor: "#070b14", padding: "3px", borderRadius: "6px", border: "1px solid rgba(255, 255, 255, 0.08)" }}>
                    {["1Y", "5Y", "10Y", "20Y", "MAX"].map((tf) => (
                      <button
                        key={tf}
                        type="button"
                        onClick={() => setChartTimeframe(tf)}
                        style={{
                          padding: "4px 8px",
                          borderRadius: "4px",
                          border: "none",
                          fontSize: "10px",
                          fontWeight: 700,
                          fontFamily: '"SF Mono", monospace',
                          backgroundColor: chartTimeframe === tf ? "#ffffff" : "transparent",
                          color: chartTimeframe === tf ? "#070b14" : "#94a3b8",
                          cursor: "pointer",
                        }}
                      >
                        {tf}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Chart SVG Viewport */}
              <div style={{
                height: "240px",
                width: "100%",
                backgroundColor: "#070b14",
                borderRadius: "6px",
                padding: "20px 10px",
                border: "1px solid rgba(255, 255, 255, 0.04)",
                position: "relative",
              }}>
                <svg viewBox="0 0 100 35" style={{ width: "100%", height: "100%", overflow: "visible" }} preserveAspectRatio="none">
                  <line x1="0" y1="8" x2="100" y2="8" stroke="rgba(255,255,255,0.05)" strokeDasharray="2,2" />
                  <line x1="0" y1="18" x2="100" y2="18" stroke="rgba(255,255,255,0.05)" strokeDasharray="2,2" />
                  <line x1="0" y1="28" x2="100" y2="28" stroke="rgba(255,255,255,0.05)" strokeDasharray="2,2" />

                  <polyline
                    fill="none"
                    stroke={chartMode === "DRAWDOWN" ? "#f43f5e" : "#38bdf8"}
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    points={
                      chartMode === "DRAWDOWN"
                        ? activeSensexSeries.drawdownPoints
                        : chartMode === "LOG"
                        ? activeSensexSeries.logPoints
                        : activeSensexSeries.pricePoints
                    }
                  />
                </svg>

                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "11px", color: "#64748b", fontFamily: '"SF Mono", monospace', marginTop: "8px" }}>
                  <span>Start: {activeSensexSeries.startValue}</span>
                  <span>{chartTimeframe} Change: <strong style={{ color: "#10b981" }}>{activeSensexSeries.change}</strong></span>
                  <span>End: {activeSensexSeries.endValue}</span>
                </div>
              </div>

              {/* Statistical Observations Below Chart */}
              <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
                gap: "10px",
                marginTop: "16px",
              }}>
                <div style={{ padding: "10px", backgroundColor: "#070b14", borderRadius: "4px" }}>
                  <div style={{ fontSize: "10px", color: "#64748b" }}>FIRST OBSERVATION</div>
                  <div style={{ fontSize: "14px", fontWeight: 700, color: "#ffffff", fontFamily: '"SF Mono", monospace' }}>1979: 100</div>
                </div>
                <div style={{ padding: "10px", backgroundColor: "#070b14", borderRadius: "4px" }}>
                  <div style={{ fontSize: "10px", color: "#64748b" }}>ALL-TIME HIGH</div>
                  <div style={{ fontSize: "14px", fontWeight: 700, color: "#ffffff", fontFamily: '"SF Mono", monospace' }}>82,100+</div>
                </div>
                <div style={{ padding: "10px", backgroundColor: "#070b14", borderRadius: "4px" }}>
                  <div style={{ fontSize: "10px", color: "#64748b" }}>MAX DRAWDOWN</div>
                  <div style={{ fontSize: "14px", fontWeight: 700, color: "#f43f5e", fontFamily: '"SF Mono", monospace' }}>-60.2% (2008)</div>
                </div>
                <div style={{ padding: "10px", backgroundColor: "#070b14", borderRadius: "4px" }}>
                  <div style={{ fontSize: "10px", color: "#64748b" }}>LONGEST RECOVERY</div>
                  <div style={{ fontSize: "14px", fontWeight: 700, color: "#cbd5e1", fontFamily: '"SF Mono", monospace' }}>44 Months (2000)</div>
                </div>
                <div style={{ padding: "10px", backgroundColor: "#070b14", borderRadius: "4px" }}>
                  <div style={{ fontSize: "10px", color: "#64748b" }}>BEST CALENDAR YR</div>
                  <div style={{ fontSize: "14px", fontWeight: 700, color: "#10b981", fontFamily: '"SF Mono", monospace' }}>+81.0% (2009)</div>
                </div>
                <div style={{ padding: "10px", backgroundColor: "#070b14", borderRadius: "4px" }}>
                  <div style={{ fontSize: "10px", color: "#64748b" }}>WORST CALENDAR YR</div>
                  <div style={{ fontSize: "14px", fontWeight: 700, color: "#f43f5e", fontFamily: '"SF Mono", monospace' }}>-52.4% (2008)</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ------------------------------------------------------------------ */}
        {/* 7. HISTORICAL RETURNS & 8. HISTORICAL VALUATION (GRID)             */}
        {/* ------------------------------------------------------------------ */}
        <section style={{ padding: "40px 0", borderBottom: "1px solid rgba(255, 255, 255, 0.05)" }}>
          <div style={sharedStyles.container}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))", gap: "24px" }}>
              {/* Annual Returns Table */}
              <div style={{ backgroundColor: "#0b1220", border: "1px solid rgba(255, 255, 255, 0.08)", borderRadius: "8px", padding: "24px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "14px" }}>
                  <div>
                    <div style={{ fontSize: "11px", fontWeight: 700, color: "#10b981", letterSpacing: "0.1em", textTransform: "uppercase", fontFamily: '"SF Mono", monospace' }}>
                      ANNUAL CALENDAR RETURNS
                    </div>
                    <h3 style={{ fontSize: "20px", fontWeight: 700, color: "#ffffff", margin: "4px 0 0" }}>
                      Returns Through Time
                    </h3>
                  </div>
                  {/* Asset Filter */}
                  <select
                    value={returnAssetFilter}
                    onChange={(e) => setReturnAssetFilter(e.target.value as any)}
                    style={{
                      padding: "4px 8px",
                      backgroundColor: "#070b14",
                      border: "1px solid rgba(255, 255, 255, 0.1)",
                      borderRadius: "4px",
                      color: "#38bdf8",
                      fontSize: "11px",
                      fontFamily: '"SF Mono", monospace',
                    }}
                  >
                    <option value="SENSEX">Sensex</option>
                    <option value="NIFTY">Nifty 50</option>
                    <option value="IT">IT Sector</option>
                    <option value="BANK">Bank Sector</option>
                  </select>
                </div>

                <div style={{ maxHeight: "320px", overflowY: "auto", scrollbarWidth: "thin" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "12px" }}>
                    <thead>
                      <tr style={{ borderBottom: "1px solid rgba(255, 255, 255, 0.08)", color: "#64748b", fontFamily: '"SF Mono", monospace', fontSize: "10px" }}>
                        <th style={{ padding: "6px 0" }}>YEAR</th>
                        <th style={{ padding: "6px 4px", textAlign: "right" }}>RETURN</th>
                        <th style={{ padding: "6px 0", textAlign: "right" }}>MARKET REGIME</th>
                      </tr>
                    </thead>
                    <tbody>
                      {ANNUAL_RETURNS_SERIES.map((row) => {
                        let ret = row.sensexReturn;
                        if (returnAssetFilter === "NIFTY") ret = row.niftyReturn;
                        else if (returnAssetFilter === "IT") ret = row.itSectorReturn;
                        else if (returnAssetFilter === "BANK") ret = row.bankSectorReturn;

                        const isPos = ret >= 0;
                        return (
                          <tr key={row.year} style={{ borderBottom: "1px solid rgba(255, 255, 255, 0.04)" }}>
                            <td style={{ padding: "8px 0", color: "#ffffff", fontFamily: '"SF Mono", monospace' }}>{row.year}</td>
                            <td style={{ padding: "8px 4px", textAlign: "right", color: isPos ? "#10b981" : "#f43f5e", fontWeight: 700, fontFamily: '"SF Mono", monospace' }}>
                              {isPos ? `+${ret.toFixed(1)}%` : `${ret.toFixed(1)}%`}
                            </td>
                            <td style={{ padding: "8px 0", textAlign: "right", color: "#94a3b8", fontSize: "11px" }}>{row.regime}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Historical Valuation Ranges */}
              <div style={{ backgroundColor: "#0b1220", border: "1px solid rgba(255, 255, 255, 0.08)", borderRadius: "8px", padding: "24px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "14px" }}>
                  <div>
                    <div style={{ fontSize: "11px", fontWeight: 700, color: "#38bdf8", letterSpacing: "0.1em", textTransform: "uppercase", fontFamily: '"SF Mono", monospace' }}>
                      VALUATION ENVELOPES
                    </div>
                    <h3 style={{ fontSize: "20px", fontWeight: 700, color: "#ffffff", margin: "4px 0 0" }}>
                      Was the Market Expensive?
                    </h3>
                  </div>
                  <span style={{ fontSize: "10px", padding: "2px 6px", borderRadius: "4px", backgroundColor: "rgba(56, 189, 248, 0.1)", color: "#38bdf8", border: "1px solid rgba(56, 189, 248, 0.25)", fontFamily: '"SF Mono", monospace', fontWeight: 600 }}>
                    PERCENTILE BANDS
                  </span>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginBottom: "16px" }}>
                  {HISTORICAL_VALUATION_DATA.map((v) => (
                    <div key={v.metric} style={{ padding: "12px", backgroundColor: "#070b14", borderRadius: "6px", border: "1px solid rgba(255, 255, 255, 0.04)" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "4px" }}>
                        <span style={{ fontSize: "13px", fontWeight: 600, color: "#ffffff" }}>{v.metric}</span>
                        <span style={{ fontSize: "15px", fontWeight: 700, color: "#38bdf8", fontFamily: '"SF Mono", monospace' }}>Current: {v.current}</span>
                      </div>
                      <div style={{ display: "flex", justifyContent: "space-between", fontSize: "11px", color: "#64748b", fontFamily: '"SF Mono", monospace' }}>
                        <span>10th %ile: {v.p10}</span>
                        <span>Median: {v.median}</span>
                        <span>90th %ile: {v.p90}</span>
                      </div>
                    </div>
                  ))}
                </div>

                <div style={{ padding: "10px", backgroundColor: "rgba(0, 0, 0, 0.3)", borderRadius: "4px", fontSize: "11px", color: "#64748b", lineHeight: 1.4 }}>
                  * Historical valuation requires point-in-time price and fundamental observations. Future versions of Sensex.money will distinguish information available at the time from subsequently restated data.
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ------------------------------------------------------------------ */}
        {/* 9. SECTOR HISTORY & 10. MARKET REGIME HISTORY                      */}
        {/* ------------------------------------------------------------------ */}
        <section style={{ padding: "40px 0", borderBottom: "1px solid rgba(255, 255, 255, 0.05)" }}>
          <div style={sharedStyles.container}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))", gap: "24px" }}>
              {/* Sector History */}
              <div style={{ backgroundColor: "#0b1220", border: "1px solid rgba(255, 255, 255, 0.08)", borderRadius: "8px", padding: "24px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "14px" }}>
                  <div>
                    <div style={{ fontSize: "11px", fontWeight: 700, color: "#e2b357", letterSpacing: "0.1em", textTransform: "uppercase", fontFamily: '"SF Mono", monospace' }}>
                      STRUCTURAL ROTATION
                    </div>
                    <h3 style={{ fontSize: "20px", fontWeight: 700, color: "#ffffff", margin: "4px 0 0" }}>
                      Which sectors led India?
                    </h3>
                  </div>
                  <span style={{ fontSize: "10px", padding: "2px 6px", borderRadius: "4px", backgroundColor: "rgba(226, 179, 87, 0.1)", color: "#e2b357", border: "1px solid rgba(226, 179, 87, 0.25)", fontFamily: '"SF Mono", monospace', fontWeight: 600 }}>
                    MULTI-DECADE BETA
                  </span>
                </div>

                <div style={{ maxHeight: "320px", overflowY: "auto", scrollbarWidth: "thin" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "12px" }}>
                    <thead>
                      <tr style={{ borderBottom: "1px solid rgba(255, 255, 255, 0.08)", color: "#64748b", fontFamily: '"SF Mono", monospace', fontSize: "10px" }}>
                        <th style={{ padding: "6px 0" }}>SECTOR</th>
                        <th style={{ padding: "6px 4px" }}>2000s BOOM</th>
                        <th style={{ padding: "6px 4px" }}>2010s DELEVERAGING</th>
                        <th style={{ padding: "6px 0", textAlign: "right" }}>ROLE</th>
                      </tr>
                    </thead>
                    <tbody>
                      {SECTOR_ERA_LEADERSHIP.map((sec) => (
                        <tr key={sec.sector} style={{ borderBottom: "1px solid rgba(255, 255, 255, 0.04)" }}>
                          <td style={{ padding: "8px 0", color: "#ffffff", fontWeight: 600 }}>{sec.sector}</td>
                          <td style={{ padding: "8px 4px", color: "#38bdf8", fontSize: "11px" }}>{sec.era2000s}</td>
                          <td style={{ padding: "8px 4px", color: "#94a3b8", fontSize: "11px" }}>{sec.era2010s}</td>
                          <td style={{ padding: "8px 0", textAlign: "right" }}>
                            <span style={{
                              fontSize: "9px",
                              padding: "2px 5px",
                              borderRadius: "3px",
                              fontFamily: '"SF Mono", monospace',
                              fontWeight: 700,
                              backgroundColor: sec.leadershipStatus === "LEADER" ? "rgba(16, 185, 129, 0.12)" : "rgba(255, 255, 255, 0.05)",
                              color: sec.leadershipStatus === "LEADER" ? "#10b981" : "#cbd5e1",
                            }}>
                              {sec.leadershipStatus}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Market Regime Classifications */}
              <div style={{ backgroundColor: "#0b1220", border: "1px solid rgba(255, 255, 255, 0.08)", borderRadius: "8px", padding: "24px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "14px" }}>
                  <div>
                    <div style={{ fontSize: "11px", fontWeight: 700, color: "#a855f7", letterSpacing: "0.1em", textTransform: "uppercase", fontFamily: '"SF Mono", monospace' }}>
                      REGIME FRAMEWORK
                    </div>
                    <h3 style={{ fontSize: "20px", fontWeight: 700, color: "#ffffff", margin: "4px 0 0" }}>
                      Market Regime History
                    </h3>
                  </div>
                  <span style={{ fontSize: "10px", padding: "2px 6px", borderRadius: "4px", backgroundColor: "rgba(168, 85, 247, 0.12)", color: "#c084fc", border: "1px solid rgba(168, 85, 247, 0.3)", fontFamily: '"SF Mono", monospace', fontWeight: 600 }}>
                    DESCRIPTIVE CLASSIFICATION
                  </span>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "10px", maxHeight: "320px", overflowY: "auto", scrollbarWidth: "thin" }}>
                  {[
                    { name: "Trending / Low Volatility", episodes: "2004–07, 2017, 2021", characteristics: "Sustained index expansion above 200 DMA; low VIX (<15); high market breadth (>70%)." },
                    { name: "Bear / High Volatility", episodes: "1992, 2000–01, 2008, 2020", characteristics: "Sharp index liquidation below 50 DMA; elevated VIX (>30); severe liquidity contraction." },
                    { name: "Range-Bound Consolidation", episodes: "2010–13, 2015–16", characteristics: "Moving average convergence; high sector dispersion; rotation between cyclicals and defensives." },
                    { name: "Liquidity-Driven Expansion", episodes: "2020–21, 2023–24", characteristics: "Record mutual fund SIP run-rate absorbing foreign institutional selling without breakdown." },
                  ].map((rg) => (
                    <div key={rg.name} style={{ padding: "10px 12px", backgroundColor: "#070b14", borderRadius: "6px", border: "1px solid rgba(255, 255, 255, 0.04)" }}>
                      <div style={{ fontSize: "13px", fontWeight: 700, color: "#ffffff", marginBottom: "2px" }}>{rg.name}</div>
                      <div style={{ fontSize: "11px", color: "#38bdf8", fontFamily: '"SF Mono", monospace', marginBottom: "4px" }}>Historic Episodes: {rg.episodes}</div>
                      <div style={{ fontSize: "11px", color: "#94a3b8", lineHeight: 1.4 }}>{rg.characteristics}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ------------------------------------------------------------------ */}
        {/* 11. HISTORICAL EVENTS DATABASE                                     */}
        {/* ------------------------------------------------------------------ */}
        <section style={{ padding: "40px 0", borderBottom: "1px solid rgba(255, 255, 255, 0.05)" }}>
          <div style={sharedStyles.container}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: "16px", marginBottom: "20px" }}>
              <div>
                <div style={{ fontSize: "11px", fontWeight: 700, color: "#38bdf8", letterSpacing: "0.12em", textTransform: "uppercase", fontFamily: '"SF Mono", monospace', marginBottom: "6px" }}>
                  EVENT GRAPH REPOSITORY
                </div>
                <h2 style={{ fontSize: "24px", fontWeight: 700, color: "#ffffff", margin: "0 0 4px 0", letterSpacing: "-0.02em" }}>
                  Market Events Database
                </h2>
                <p style={{ fontSize: "14px", color: "#94a3b8", margin: 0 }}>
                  Search regulatory, corporate, macroeconomic, and systemic events across Indian capital market history.
                </p>
              </div>

              {/* Search Box */}
              <div style={{ display: "flex", alignItems: "center", gap: "8px", backgroundColor: "#0b1220", padding: "6px 12px", borderRadius: "6px", border: "1px solid rgba(255, 255, 255, 0.1)" }}>
                <Search size={14} style={{ color: "#38bdf8" }} />
                <input
                  type="text"
                  value={eventSearchQuery}
                  onChange={(e) => setEventSearchQuery(e.target.value)}
                  placeholder="Search events (e.g. 2008, SEBI, IPO)..."
                  style={{
                    backgroundColor: "transparent",
                    border: "none",
                    outline: "none",
                    color: "#ffffff",
                    fontSize: "12px",
                    width: "220px",
                  }}
                />
              </div>
            </div>

            {/* Category Filter Chips */}
            <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", marginBottom: "16px" }}>
              {["All", "Market", "Corporate", "Macro", "Regulation", "Index", "Global"].map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setEventCategoryFilter(c)}
                  style={{
                    padding: "3px 8px",
                    borderRadius: "4px",
                    fontSize: "11px",
                    fontWeight: 600,
                    fontFamily: '"SF Mono", monospace',
                    cursor: "pointer",
                    border: eventCategoryFilter === c ? "1px solid rgba(56, 189, 248, 0.5)" : "1px solid rgba(255, 255, 255, 0.08)",
                    backgroundColor: eventCategoryFilter === c ? "rgba(56, 189, 248, 0.15)" : "rgba(255, 255, 255, 0.03)",
                    color: eventCategoryFilter === c ? "#38bdf8" : "#94a3b8",
                  }}
                >
                  {c}
                </button>
              ))}
            </div>

            {/* Events Grid */}
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: "14px",
            }}>
              {filteredEvents.map((ev) => (
                <div
                  key={ev.id}
                  style={{
                    backgroundColor: "#0b1220",
                    border: "1px solid rgba(255, 255, 255, 0.08)",
                    borderRadius: "6px",
                    padding: "16px",
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                    <span style={{ fontSize: "11px", fontWeight: 700, color: "#38bdf8", fontFamily: '"SF Mono", monospace' }}>
                      {ev.date}
                    </span>
                    <span style={{ fontSize: "9px", padding: "2px 5px", borderRadius: "3px", backgroundColor: "rgba(255, 255, 255, 0.05)", color: "#cbd5e1", textTransform: "uppercase", fontFamily: '"SF Mono", monospace' }}>
                      {ev.category}
                    </span>
                  </div>

                  <h4 style={{ fontSize: "14px", fontWeight: 700, color: "#ffffff", margin: "0 0 6px 0" }}>
                    {ev.title}
                  </h4>

                  <p style={{ fontSize: "12px", color: "#94a3b8", lineHeight: 1.45, margin: "0 0 10px 0" }}>
                    {ev.description}
                  </p>

                  <div style={{ fontSize: "10px", color: "#64748b", fontFamily: '"SF Mono", monospace' }}>
                    Entities: {ev.relatedEntities.join(", ")}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ------------------------------------------------------------------ */}
        {/* 12. "WHAT HAPPENED AFTER?"                                         */}
        {/* ------------------------------------------------------------------ */}
        <section style={{ padding: "40px 0", borderBottom: "1px solid rgba(255, 255, 255, 0.05)" }}>
          <div style={sharedStyles.container}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: "16px", marginBottom: "20px" }}>
              <div>
                <div style={{ fontSize: "11px", fontWeight: 700, color: "#e2b357", letterSpacing: "0.12em", textTransform: "uppercase", fontFamily: '"SF Mono", monospace', marginBottom: "6px" }}>
                  EMPIRICAL FORWARD DISTRIBUTIONS
                </div>
                <h2 style={{ fontSize: "24px", fontWeight: 700, color: "#ffffff", margin: "0 0 4px 0", letterSpacing: "-0.02em" }}>
                  What happened after?
                </h2>
                <p style={{ fontSize: "14px", color: "#94a3b8", margin: 0 }}>
                  Statistical post-event return studies across 30, 90, 180, and 365-day forward holding windows.
                </p>
              </div>
              <span style={{ fontSize: "10px", padding: "3px 8px", borderRadius: "4px", backgroundColor: "rgba(226, 179, 87, 0.1)", color: "#e2b357", border: "1px solid rgba(226, 179, 87, 0.25)", fontFamily: '"SF Mono", monospace', fontWeight: 600 }}>
                HISTORICAL RESEARCH ENGINE • DEMO QUERY
              </span>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "20px" }}>
              {FORWARD_STUDIES_DATA.map((study) => (
                <div
                  key={study.question}
                  style={{
                    backgroundColor: "#0b1220",
                    border: "1px solid rgba(255, 255, 255, 0.08)",
                    borderRadius: "8px",
                    padding: "22px",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                  }}
                >
                  <div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                      <span style={{ fontSize: "10px", color: "#e2b357", fontFamily: '"SF Mono", monospace', fontWeight: 700 }}>
                        CONDITION STUDY
                      </span>
                      <span style={{ fontSize: "10px", color: "#64748b", fontFamily: '"SF Mono", monospace' }}>
                        {study.sampleSize}
                      </span>
                    </div>

                    <h3 style={{ fontSize: "16px", fontWeight: 700, color: "#ffffff", margin: "0 0 12px 0", lineHeight: 1.4 }}>
                      {study.question}
                    </h3>

                    {/* 4 Forward Windows */}
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "6px", marginBottom: "12px" }}>
                      {[
                        { label: "30D", val: study.d30 },
                        { label: "90D", val: study.d90 },
                        { label: "180D", val: study.d180 },
                        { label: "365D", val: study.d365 },
                      ].map((w) => (
                        <div key={w.label} style={{ padding: "8px 4px", backgroundColor: "#070b14", borderRadius: "4px", textAlign: "center" }}>
                          <div style={{ fontSize: "10px", color: "#64748b", fontFamily: '"SF Mono", monospace' }}>{w.label}</div>
                          <div style={{ fontSize: "13px", fontWeight: 700, color: "#10b981", fontFamily: '"SF Mono", monospace', margin: "2px 0" }}>
                            {w.val.median}
                          </div>
                          <div style={{ fontSize: "9px", color: "#94a3b8" }}>{w.val.winRate} +ve</div>
                        </div>
                      ))}
                    </div>

                    <p style={{ fontSize: "12px", color: "#94a3b8", lineHeight: 1.5, margin: 0 }}>
                      {study.empiricalTakeaway}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ------------------------------------------------------------------ */}
        {/* 13. MARKET TIME MACHINE (FLAGSHIP RECONSTRUCTION ENGINE)           */}
        {/* ------------------------------------------------------------------ */}
        <section style={{ padding: "40px 0", borderBottom: "1px solid rgba(255, 255, 255, 0.05)" }}>
          <div style={sharedStyles.container}>
            <div style={{
              backgroundColor: "#0d1629",
              border: "1px solid rgba(56, 189, 248, 0.25)",
              borderRadius: "10px",
              padding: "32px",
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "14px", marginBottom: "16px" }}>
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "#38bdf8", fontSize: "11px", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", fontFamily: '"SF Mono", monospace', marginBottom: "6px" }}>
                    <Clock size={13} />
                    <span>FLAGSHIP HISTORICAL MODULE</span>
                  </div>
                  <h2 style={{ fontSize: "24px", fontWeight: 800, color: "#ffffff", margin: 0 }}>
                    Enter the Market Time Machine
                  </h2>
                  <p style={{ fontSize: "14px", color: "#94a3b8", margin: "4px 0 0" }}>
                    Choose a date. See the market as an investor would have seen it then.
                  </p>
                </div>

                {/* Date Picker Selector */}
                <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                  {TIME_MACHINE_DATA.map((tm) => (
                    <button
                      key={tm.id}
                      type="button"
                      onClick={() => setSelectedTimeMachineId(tm.id)}
                      style={{
                        padding: "6px 12px",
                        borderRadius: "4px",
                        fontSize: "12px",
                        fontWeight: 700,
                        fontFamily: '"SF Mono", monospace',
                        cursor: "pointer",
                        border: selectedTimeMachineId === tm.id ? "1px solid #38bdf8" : "1px solid rgba(255, 255, 255, 0.1)",
                        backgroundColor: selectedTimeMachineId === tm.id ? "rgba(56, 189, 248, 0.2)" : "#070b14",
                        color: selectedTimeMachineId === tm.id ? "#38bdf8" : "#94a3b8",
                      }}
                    >
                      {tm.dateLabel}
                    </button>
                  ))}
                </div>
              </div>

              {/* Snapshot Display Box */}
              <div style={{
                backgroundColor: "#070b14",
                borderRadius: "8px",
                padding: "20px",
                border: "1px solid rgba(255, 255, 255, 0.06)",
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px", borderBottom: "1px solid rgba(255, 255, 255, 0.06)", paddingBottom: "10px" }}>
                  <div style={{ fontSize: "14px", fontWeight: 700, color: "#ffffff", fontFamily: '"SF Mono", monospace' }}>
                    POINT-IN-TIME RECONSTRUCTION: {selectedSnapshot.exactDate}
                  </div>
                  <span style={{ fontSize: "10px", color: "#38bdf8", fontFamily: '"SF Mono", monospace', backgroundColor: "rgba(56, 189, 248, 0.1)", padding: "2px 6px", borderRadius: "3px" }}>
                    {selectedSnapshot.marketRegime}
                  </span>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "12px", marginBottom: "16px" }}>
                  <div style={{ padding: "10px", backgroundColor: "#0b1220", borderRadius: "4px" }}>
                    <div style={{ fontSize: "10px", color: "#64748b", fontFamily: '"SF Mono", monospace' }}>SENSEX LEVEL</div>
                    <div style={{ fontSize: "18px", fontWeight: 700, color: "#ffffff", fontFamily: '"SF Mono", monospace' }}>{selectedSnapshot.sensexLevel}</div>
                  </div>
                  <div style={{ padding: "10px", backgroundColor: "#0b1220", borderRadius: "4px" }}>
                    <div style={{ fontSize: "10px", color: "#64748b", fontFamily: '"SF Mono", monospace' }}>NIFTY LEVEL</div>
                    <div style={{ fontSize: "18px", fontWeight: 700, color: "#ffffff", fontFamily: '"SF Mono", monospace' }}>{selectedSnapshot.niftyLevel}</div>
                  </div>
                  <div style={{ padding: "10px", backgroundColor: "#0b1220", borderRadius: "4px" }}>
                    <div style={{ fontSize: "10px", color: "#64748b", fontFamily: '"SF Mono", monospace' }}>MARKET P/E MULTIPLE</div>
                    <div style={{ fontSize: "18px", fontWeight: 700, color: "#38bdf8", fontFamily: '"SF Mono", monospace' }}>{selectedSnapshot.peRatio}</div>
                  </div>
                  <div style={{ padding: "10px", backgroundColor: "#0b1220", borderRadius: "4px" }}>
                    <div style={{ fontSize: "10px", color: "#64748b", fontFamily: '"SF Mono", monospace' }}>RBI POLICY RATE</div>
                    <div style={{ fontSize: "18px", fontWeight: 700, color: "#e2b357", fontFamily: '"SF Mono", monospace' }}>{selectedSnapshot.policyRate}</div>
                  </div>
                </div>

                <div style={{ fontSize: "12px", color: "#94a3b8" }}>
                  <strong style={{ color: "#ffffff" }}>Prevailing News & Market Headlines: </strong>
                  {selectedSnapshot.keyHeadlines.join(" • ")}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ------------------------------------------------------------------ */}
        {/* 14. SURVIVORSHIP BIAS & 15. DATA TRANSPARENCY PIPELINE             */}
        {/* ------------------------------------------------------------------ */}
        <section style={{ padding: "40px 0", borderBottom: "1px solid rgba(255, 255, 255, 0.05)" }}>
          <div style={sharedStyles.container}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))", gap: "24px" }}>
              {/* Survivorship Bias Warning & Security Lineage */}
              <div style={{ backgroundColor: "#0b1220", border: "1px solid rgba(226, 179, 87, 0.3)", borderRadius: "8px", padding: "24px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "#e2b357", fontSize: "11px", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", fontFamily: '"SF Mono", monospace', marginBottom: "8px" }}>
                  <AlertTriangle size={14} />
                  <span>SURVIVORSHIP BIAS PRINCIPLE</span>
                </div>

                <h3 style={{ fontSize: "18px", fontWeight: 700, color: "#ffffff", margin: "0 0 10px 0" }}>
                  History has survivors. We also need the companies that disappeared.
                </h3>

                <p style={{ fontSize: "13px", color: "#94a3b8", lineHeight: 1.55, margin: "0 0 16px 0" }}>
                  Historical market research can become misleading when delisted, merged, acquired or failed companies disappear from datasets. Sensex.money is designed around permanent security identity, corporate lineage, and historical continuity without restatement bias.
                </p>

                <Link
                  to="/stocks"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "6px",
                    color: "#e2b357",
                    fontSize: "12px",
                    fontWeight: 600,
                    textDecoration: "none",
                  }}
                >
                  <span>Explore Security Lineage Registry</span>
                  <ArrowRight size={13} />
                </Link>
              </div>

              {/* Data Provenance & How We Build History */}
              <div style={{ backgroundColor: "#0b1220", border: "1px solid rgba(255, 255, 255, 0.08)", borderRadius: "8px", padding: "24px" }}>
                <div style={{ fontSize: "11px", fontWeight: 700, color: "#38bdf8", letterSpacing: "0.1em", textTransform: "uppercase", fontFamily: '"SF Mono", monospace', marginBottom: "8px" }}>
                  METHODOLOGY ARCHITECTURE
                </div>

                <h3 style={{ fontSize: "18px", fontWeight: 700, color: "#ffffff", margin: "0 0 10px 0" }}>
                  How We Build Market History
                </h3>

                <div style={{
                  fontSize: "10px",
                  fontFamily: '"SF Mono", monospace',
                  padding: "8px 10px",
                  backgroundColor: "#070b14",
                  borderRadius: "4px",
                  color: "#38bdf8",
                  lineHeight: 1.6,
                  marginBottom: "12px",
                  border: "1px solid rgba(56, 189, 248, 0.2)",
                }}>
                  SOURCE → RAW RECORD → SECURITY IDENTITY → CORPORATE ACTION → POINT-IN-TIME DATA → CALCULATION → RESEARCH OUTPUT
                </div>

                <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", marginBottom: "10px" }}>
                  <span style={{ fontSize: "9px", padding: "2px 5px", borderRadius: "3px", backgroundColor: "rgba(16, 185, 129, 0.1)", color: "#10b981", border: "1px solid rgba(16, 185, 129, 0.2)" }}>VERIFIED</span>
                  <span style={{ fontSize: "9px", padding: "2px 5px", borderRadius: "3px", backgroundColor: "rgba(56, 189, 248, 0.1)", color: "#38bdf8", border: "1px solid rgba(56, 189, 248, 0.2)" }}>CALCULATED</span>
                  <span style={{ fontSize: "9px", padding: "2px 5px", borderRadius: "3px", backgroundColor: "rgba(245, 158, 11, 0.1)", color: "#f59e0b", border: "1px solid rgba(245, 158, 11, 0.2)" }}>ILLUSTRATIVE</span>
                  <span style={{ fontSize: "9px", padding: "2px 5px", borderRadius: "3px", backgroundColor: "rgba(255, 255, 255, 0.05)", color: "#94a3b8" }}>PARTIALLY VERIFIED</span>
                </div>

                <p style={{ fontSize: "11px", color: "#64748b", lineHeight: 1.4, margin: 0 }}>
                  Publicly accessible information is not automatically licensed for commercial redistribution. Sensex.money maintains a clear provenance chain for every historical record.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ------------------------------------------------------------------ */}
        {/* 16. HISTORICAL RESEARCH QUESTIONS (STRUCTURED QUERIES)             */}
        {/* ------------------------------------------------------------------ */}
        <section style={{ padding: "48px 0 60px" }}>
          <div style={sharedStyles.container}>
            <div style={{
              backgroundColor: "#0c1527",
              border: "1px solid rgba(56, 189, 248, 0.2)",
              borderRadius: "10px",
              padding: "32px",
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "#38bdf8", fontSize: "11px", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", fontFamily: '"SF Mono", monospace', marginBottom: "8px" }}>
                <Sparkles size={14} />
                <span>STRUCTURED HISTORICAL QUERIES</span>
              </div>

              <h2 style={{ fontSize: "22px", fontWeight: 800, color: "#ffffff", margin: "0 0 8px 0" }}>
                Questions worth asking the market.
              </h2>
              <p style={{ fontSize: "13px", color: "#94a3b8", margin: "0 0 20px 0" }}>
                Click any research question to inspect its quantitative analytical formulation.
              </p>

              <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", marginBottom: "16px" }}>
                {HISTORY_RESEARCH_QUESTIONS.map((q) => (
                  <button
                    key={q}
                    type="button"
                    onClick={() => setActiveQuestionResult(`Quantitative Query: "${q}" — Mapped to Sensex.money Historical Research Engine [Algorithm: Continuous Rolling Distribution • Sample: 1979–2024 • Status: ILLUSTRATIVE DATA]`)}
                    style={{
                      backgroundColor: "rgba(255, 255, 255, 0.04)",
                      border: "1px solid rgba(255, 255, 255, 0.1)",
                      borderRadius: "6px",
                      padding: "8px 14px",
                      color: "#cbd5e1",
                      fontSize: "12px",
                      textAlign: "left",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                      transition: "all 0.15s ease",
                    }}
                    className="question-chip"
                  >
                    <Search size={12} style={{ color: "#38bdf8" }} />
                    <span>&ldquo;{q}&rdquo;</span>
                  </button>
                ))}
              </div>

              {activeQuestionResult && (
                <div style={{ padding: "12px 16px", backgroundColor: "#070b14", borderRadius: "6px", border: "1px solid rgba(56, 189, 248, 0.3)", fontSize: "12px", color: "#38bdf8" }}>
                  {activeQuestionResult}
                </div>
              )}
            </div>
          </div>
        </section>
      </main>

      <GlobalFooter />
    </div>
  );
};

// ============================================================================
// ----------------------------------------------------------------------------
// RESEARCH PAGE (/research): TYPES, SERVICE ENGINE & DATASETS
// ----------------------------------------------------------------------------
// ============================================================================

export interface ResearchStudy {
  id: string;
  title: string;
  question: string;
  category: "MARKET" | "COMPANIES" | "SECTORS" | "CORPORATE_ACTIONS" | "VALUATION" | "REGIMES" | "VOLATILITY" | "FACTORS" | "DRAWDOWNS" | "MACRO";
  description: string;
  status: DataStatus;
  universe: string;
  startDate: string;
  endDate: string;
  sampleSize: string;
  methodology: string;
  readTime: string;
  publishedDate: string;
  keyMetric: string;
  accentColor: string;
  limitations: string;
  forwardReturns: {
    d30: string;
    d90: string;
    d180: string;
    d365: string;
  };
}

export interface ResearchQueryPrompt {
  id: string;
  category: "MARKET" | "COMPANIES" | "SECTORS" | "CORPORATE_ACTIONS" | "VALUATION" | "REGIMES" | "VOLATILITY" | "DRAWDOWNS";
  title: string;
  queryText: string;
  sampleEpisodesCount: number;
  studyPeriod: string;
  d30: string;
  d90: string;
  d180: string;
  winRate30D: string;
  winRate90D: string;
  winRate180D: string;
  medianRecoveryMonths: string;
  p10: string;
  p25: string;
  median: string;
  p75: string;
  p90: string;
  distributionChartPoints: string;
  interpretation: string;
  episodes: ResearchEpisode[];
}

export interface ResearchEpisode {
  id: string;
  event: string;
  date: string;
  trigger: string;
  drawdownMagnitude: string;
  fwd30D: string;
  fwd90D: string;
  fwd180D: string;
  recoveryDuration: string;
  status: DataStatus;
}

export interface EventStudyParameters {
  eventType: "BONUS_1_1" | "STOCK_SPLIT_2_1" | "DIVIDEND_HIKE_20" | "CAPEX_ANNOUNCEMENT" | "BUYBACK_TENDER";
  windowSize: "[-20,+20]" | "[-60,+60]" | "[-120,+120]";
  benchmark: "BSE_SENSEX" | "NIFTY_50" | "SECTOR_BENCHMARK";
  metric: "CUMULATIVE_ABNORMAL_RETURN" | "MEDIAN_EXCESS_RETURN" | "WIN_RATE";
}

export interface EventStudyResult {
  eventTypeLabel: string;
  windowLabel: string;
  benchmarkLabel: string;
  sampleSize: string;
  meanAbnormalReturn: string;
  medianAbnormalReturn: string;
  cumulativeAbnormalReturn: string;
  positiveOutcomeRate: string;
  tStatistic: string;
  chartPoints: string;
  methodologyNote: string;
}

export interface FactorStudyItem {
  factor: string;
  definition: string;
  longTermAnnualizedReturn: string;
  excessVsSensex: string;
  maxDrawdown: string;
  sharpeRatio: string;
  bestRegime: string;
  worstRegime: string;
  status: DataStatus;
}

export interface ResearchLibraryItem {
  id: string;
  title: string;
  category: string;
  publishedDate: string;
  studyType: "Empirical Event Study" | "Longitudinal Factor Analysis" | "Regime State Machine" | "Valuation Envelope" | "Drawdown Anatomy";
  readTime: string;
  status: DataStatus;
  summary: string;
  slug: string;
}

// ----------------------------------------------------------------------------
// RESEARCH DATASETS
// ----------------------------------------------------------------------------

export const RESEARCH_QUERY_PRESETS: ResearchQueryPrompt[] = [
  {
    id: "q_drawdown_10",
    category: "DRAWDOWNS",
    title: "Sensex Drawdowns Greater Than 10%",
    queryText: "What happened after the Sensex fell more than 10% from peak?",
    sampleEpisodesCount: 18,
    studyPeriod: "1979 → 2026",
    d30: "+3.8%",
    d90: "+8.4%",
    d180: "+15.2%",
    winRate30D: "67%",
    winRate90D: "78%",
    winRate180D: "89%",
    medianRecoveryMonths: "6.5 Months",
    p10: "-4.2%",
    p25: "+1.8%",
    median: "+15.2%",
    p75: "+24.8%",
    p90: "+42.5%",
    distributionChartPoints: "0,28 15,22 30,16 45,8 60,12 75,19 90,26 100,29",
    interpretation: "Drawdowns of 10–20% historically represent intermediate bull market corrections rather than structural bear markets. In 89% of historical observations since 1979, 180-day forward returns were positive.",
    episodes: [
      { id: "ep-1", event: "COVID Panic Trough", date: "23 Mar 2020", trigger: "Pandemic economic lockdown", drawdownMagnitude: "-38.0%", fwd30D: "+14.8%", fwd90D: "+32.4%", fwd180D: "+52.0%", recoveryDuration: "7 Months", status: "ILLUSTRATIVE DATA" },
      { id: "ep-2", event: "Global Financial Crisis Bottom", date: "09 Mar 2009", trigger: "Global credit capitulation", drawdownMagnitude: "-60.2%", fwd30D: "+28.2%", fwd90D: "+81.0%", fwd180D: "+112.4%", recoveryDuration: "33 Months", status: "ILLUSTRATIVE DATA" },
      { id: "ep-3", event: "Rate Hike / War Pullback", date: "17 Jun 2022", trigger: "Surging crude oil & global inflation", drawdownMagnitude: "-18.2%", fwd30D: "+8.4%", fwd90D: "+16.8%", fwd180D: "+22.4%", recoveryDuration: "6 Months", status: "ILLUSTRATIVE DATA" },
      { id: "ep-4", event: "NBFC Liquidity Stress", date: "26 Oct 2018", trigger: "IL&FS commercial paper default", drawdownMagnitude: "-14.9%", fwd30D: "+4.6%", fwd90D: "+9.2%", fwd180D: "+14.8%", recoveryDuration: "18 Months", status: "ILLUSTRATIVE DATA" },
      { id: "ep-5", event: "China Devaluation / NPA Review", date: "12 Feb 2016", trigger: "Asset quality review of state banks", drawdownMagnitude: "-25.1%", fwd30D: "+7.8%", fwd90D: "+18.2%", fwd180D: "+24.6%", recoveryDuration: "14 Months", status: "ILLUSTRATIVE DATA" },
    ],
  },
  {
    id: "q_consecutive_down",
    category: "MARKET",
    title: "Three Consecutive Down Days (>1% Drop)",
    queryText: "What happened after three consecutive down days (>1% each)?",
    sampleEpisodesCount: 142,
    studyPeriod: "2000 → 2026",
    d30: "+2.1%",
    d90: "+4.8%",
    d180: "+8.9%",
    winRate30D: "64%",
    winRate90D: "69%",
    winRate180D: "74%",
    medianRecoveryMonths: "1.8 Months",
    p10: "-5.4%",
    p25: "-0.8%",
    median: "+8.9%",
    p75: "+14.2%",
    p90: "+22.0%",
    distributionChartPoints: "0,25 20,18 40,10 60,14 80,22 100,26",
    interpretation: "Short-term momentum panic clusters often exhaust seller inventory, resulting in statistical mean-reversion bounces within 30 to 90 trading sessions.",
    episodes: [
      { id: "ep-c1", event: "Post-Budget Volatility", date: "05 Feb 2024", trigger: "Budget capital gains adjustment rumors", drawdownMagnitude: "-3.8%", fwd30D: "+3.2%", fwd90D: "+7.4%", fwd180D: "+14.1%", recoveryDuration: "22 Days", status: "ILLUSTRATIVE DATA" },
      { id: "ep-c2", event: "Adani Hindenburg Shock", date: "30 Jan 2023", trigger: "Conglomerate short-seller report", drawdownMagnitude: "-4.2%", fwd30D: "+1.8%", fwd90D: "+6.2%", fwd180D: "+12.9%", recoveryDuration: "45 Days", status: "ILLUSTRATIVE DATA" },
      { id: "ep-c3", event: "US Fed 75bps Hike Panic", date: "16 Sep 2022", trigger: "Hawkish Jackson Hole commentary", drawdownMagnitude: "-4.5%", fwd30D: "+2.9%", fwd90D: "+8.1%", fwd180D: "+11.4%", recoveryDuration: "35 Days", status: "ILLUSTRATIVE DATA" },
    ],
  },
  {
    id: "q_bonus_1_1",
    category: "CORPORATE_ACTIONS",
    title: "1:1 Bonus Share Issues",
    queryText: "What happened to stocks after a 1:1 bonus issue?",
    sampleEpisodesCount: 84,
    studyPeriod: "1995 → 2026",
    d30: "+4.2%",
    d90: "+9.8%",
    d180: "+16.5%",
    winRate30D: "68%",
    winRate90D: "74%",
    winRate180D: "81%",
    medianRecoveryMonths: "3.2 Months",
    p10: "-8.4%",
    p25: "+1.2%",
    median: "+16.5%",
    p75: "+26.4%",
    p90: "+48.2%",
    distributionChartPoints: "0,27 20,20 40,12 60,15 80,24 100,28",
    interpretation: "While bonus issues are accounting capital reorganizations without intrinsic enterprise value creation, Indian market history demonstrates positive signaling effects as management communicates confidence in future earnings capitalization.",
    episodes: [
      { id: "ep-b1", event: "Infosys 1:1 Bonus 2018", date: "13 Jul 2018", trigger: "25-year public listing celebration", drawdownMagnitude: "N/A (Ex-Date)", fwd30D: "+5.8%", fwd90D: "+11.2%", fwd180D: "+21.4%", recoveryDuration: "Ex-Bonus Adjusted", status: "ILLUSTRATIVE DATA" },
      { id: "ep-b2", event: "TCS 1:1 Bonus 2018", date: "01 Jun 2018", trigger: "Free cash flow reserve capitalization", drawdownMagnitude: "N/A (Ex-Date)", fwd30D: "+4.1%", fwd90D: "+14.8%", fwd180D: "+19.5%", recoveryDuration: "Ex-Bonus Adjusted", status: "ILLUSTRATIVE DATA" },
      { id: "ep-b3", event: "Reliance 1:1 Bonus 2017", date: "07 Sep 2017", trigger: "Jio commercial monetization milestones", drawdownMagnitude: "N/A (Ex-Date)", fwd30D: "+6.4%", fwd90D: "+16.2%", fwd180D: "+28.9%", recoveryDuration: "Ex-Bonus Adjusted", status: "ILLUSTRATIVE DATA" },
    ],
  },
  {
    id: "q_pe_90th",
    category: "VALUATION",
    title: "Sensex P/E Above 90th Percentile",
    queryText: "What happened when the Sensex traded above its 90th percentile P/E (>25x)?",
    sampleEpisodesCount: 32,
    studyPeriod: "1991 → 2026",
    d30: "+0.4%",
    d90: "-1.8%",
    d180: "-4.5%",
    winRate30D: "52%",
    winRate90D: "44%",
    winRate180D: "38%",
    medianRecoveryMonths: "14.2 Months",
    p10: "-32.4%",
    p25: "-14.2%",
    median: "-4.5%",
    p75: "+6.8%",
    p90: "+18.2%",
    distributionChartPoints: "0,12 20,18 40,26 60,22 80,14 100,10",
    interpretation: "Valuations in the top decile do not trigger immediate crashes, but forward 180-to-365 day expected returns compress significantly as earnings growth must catch up with multiple expansion.",
    episodes: [
      { id: "ep-v1", event: "Peak Bull Multiple 2008", date: "08 Jan 2008", trigger: "Sensex P/E reaches 28.5x", drawdownMagnitude: "-60.2%", fwd30D: "-12.4%", fwd90D: "-24.1%", fwd180D: "-38.5%", recoveryDuration: "33 Months", status: "ILLUSTRATIVE DATA" },
      { id: "ep-v2", event: "Post-COVID Multiple Expansion 2021", date: "15 Feb 2021", trigger: "Sensex P/E reaches 34.0x (Consolidated)", drawdownMagnitude: "-9.8%", fwd30D: "+1.2%", fwd90D: "+4.8%", fwd180D: "+14.2%", recoveryDuration: "4 Months", status: "ILLUSTRATIVE DATA" },
      { id: "ep-v3", event: "Harshad Mehta Peak 1992", date: "22 Apr 1992", trigger: "Sensex P/E touches 45.0x", drawdownMagnitude: "-54.2%", fwd30D: "-28.4%", fwd90D: "-42.0%", fwd180D: "-48.6%", recoveryDuration: "32 Months", status: "ILLUSTRATIVE DATA" },
    ],
  },
];

export const FEATURED_RESEARCH_STUDIES: ResearchStudy[] = [
  {
    id: "study-drawdowns",
    title: "Anatomy of Indian Market Drawdowns",
    question: "What happened after major market crashes in 1992, 2000, 2008 and 2020?",
    category: "DRAWDOWNS",
    description: "Empirical study of peak-to-trough drawdowns >= 20% across 45 years of Indian exchange data, examining recovery speed and forward return distribution.",
    status: "ILLUSTRATIVE DATA",
    universe: "BSE Sensex / Nifty 50",
    startDate: "1979",
    endDate: "2026",
    sampleSize: "N=8 Major Episodes",
    methodology: "Continuous peak-to-trough nominal price series with rolling recovery tracking.",
    readTime: "8 min read",
    publishedDate: "September 2024",
    keyMetric: "+34.2% Median 1Y Fwd Return",
    accentColor: "#f43f5e",
    limitations: "Small sample of severe black-swan drawdowns; macroeconomic context differs per episode.",
    forwardReturns: { d30: "+4.2%", d90: "+11.8%", d180: "+19.4%", d365: "+34.2%" },
  },
  {
    id: "study-sector-leadership",
    title: "Post-Crash Sector Leadership & Rotation",
    question: "Which sectors led the initial 12-month recovery following major market bottoms?",
    category: "SECTORS",
    description: "Cross-sectional analysis tracking leadership shifts from pre-crash bull leaders to post-crash recovery alpha generators.",
    status: "ILLUSTRATIVE DATA",
    universe: "NSE Sectoral Indices (Banks, IT, Auto, Pharma, FMCG, Metals, Infra)",
    startDate: "1995",
    endDate: "2026",
    sampleSize: "N=6 Market Troughs",
    methodology: "12-month forward cumulative excess return relative to Nifty 50 from trough.",
    readTime: "11 min read",
    publishedDate: "August 2024",
    keyMetric: "+22.4% Average Sector Dispersion",
    accentColor: "#38bdf8",
    limitations: "Sector definitions evolved over time; NSE sectoral indices inception dates vary.",
    forwardReturns: { d30: "+6.8%", d90: "+14.5%", d180: "+28.2%", d365: "+48.0%" },
  },
  {
    id: "study-recovery-durations",
    title: "How Long Do Major Market Recoveries Take?",
    question: "What determines whether a recovery takes 7 months (2020) vs 44 months (2000)?",
    category: "MARKET",
    description: "Investigates the duration underwater across 12 drawdown episodes, correlating recovery velocity with monetary stimulus and banking health.",
    status: "ILLUSTRATIVE DATA",
    universe: "BSE SENSEX",
    startDate: "1979",
    endDate: "2026",
    sampleSize: "N=12 Historical Drawdowns",
    methodology: "Time elapsed from nominal index trough to reclaiming previous all-time peak.",
    readTime: "9 min read",
    publishedDate: "July 2024",
    keyMetric: "18.5 Months Median Recovery",
    accentColor: "#10b981",
    limitations: "Nominal index recovery does not account for purchasing power inflation adjustments.",
    forwardReturns: { d30: "+3.1%", d90: "+8.9%", d180: "+16.2%", d365: "+27.4%" },
  },
  {
    id: "study-multicycle-compounders",
    title: "Companies That Compounded Through Multiple Cycles",
    question: "Which Indian listed companies generated positive total returns across 2000, 2008 and 2020?",
    category: "COMPANIES",
    description: "Longitudinal study of survivorship and capital allocation discipline among the top 1% multi-decade wealth creators.",
    status: "ILLUSTRATIVE DATA",
    universe: "BSE Listed Equities (Listed pre-1995)",
    startDate: "1995",
    endDate: "2026",
    sampleSize: "N=42 Verified Compounders",
    methodology: "Dividend-adjusted Total Return (TRI) across 3 distinct economic regimes.",
    readTime: "14 min read",
    publishedDate: "June 2024",
    keyMetric: "+18.6% 25Y Median CAGR",
    accentColor: "#a855f7",
    limitations: "Survivorship bias inherent in retrospective winner selection; require delisted peer control.",
    forwardReturns: { d30: "+1.9%", d90: "+5.4%", d180: "+10.8%", d365: "+21.2%" },
  },
  {
    id: "study-extreme-volatility",
    title: "Forward Returns Following Extreme Volatility Spikes",
    question: "What happened after the India VIX breached 30 (capitulation regimes)?",
    category: "VOLATILITY",
    description: "Analyzes the predictive distribution of forward equity returns when implied option volatility reaches 95th percentile extremes.",
    status: "ILLUSTRATIVE DATA",
    universe: "NSE India VIX & NIFTY 50",
    startDate: "2008",
    endDate: "2026",
    sampleSize: "N=18 Volatility Spikes",
    methodology: "Forward rolling return distribution triggered on first day VIX closes >= 30.0.",
    readTime: "7 min read",
    publishedDate: "May 2024",
    keyMetric: "94% 1Y Positive Win Rate",
    accentColor: "#f59e0b",
    limitations: "India VIX series starts in 2008; pre-2008 volatility modeled via realized historical returns.",
    forwardReturns: { d30: "+5.4%", d90: "+14.6%", d180: "+22.8%", d365: "+41.0%" },
  },
  {
    id: "study-breadth-deterioration",
    title: "Market Breadth Deterioration vs Headline Index Tops",
    question: "Does percentage of stocks above 50 DMA decline before headline index peaks?",
    category: "MARKET",
    description: "Quantifies divergence between headline index levels and advance/decline participation during the late stages of Indian bull markets.",
    status: "ILLUSTRATIVE DATA",
    universe: "NSE 500 Constituents",
    startDate: "2003",
    endDate: "2026",
    sampleSize: "N=7 Late-Stage Regimes",
    methodology: "Daily rolling breadth participation metric vs rolling 52-week index highs.",
    readTime: "10 min read",
    publishedDate: "April 2024",
    keyMetric: "45 Days Median Lead Indicator",
    accentColor: "#38bdf8",
    limitations: "NSE 500 survivorship-bias adjusted constituent history required for full point-in-time audit.",
    forwardReturns: { d30: "-1.2%", d90: "-4.8%", d180: "-9.4%", d365: "-15.2%" },
  },
];

export const FACTOR_STUDIES_DATA: FactorStudyItem[] = [
  { factor: "Momentum (12M - 1M)", definition: "Top quintile 12-month return excluding most recent 1 month", longTermAnnualizedReturn: "+19.8% CAGR", excessVsSensex: "+5.0% Alpha", maxDrawdown: "-58.4% (2008)", sharpeRatio: "0.82", bestRegime: "Bull Market Expansion", worstRegime: "Sharp Market Reversal", status: "ILLUSTRATIVE DATA" },
  { factor: "Quality (High ROE / Low Debt)", definition: "Top 20% Return on Equity with Net Debt / EBITDA < 1.0x", longTermAnnualizedReturn: "+18.2% CAGR", excessVsSensex: "+3.4% Alpha", maxDrawdown: "-38.2% (2008)", sharpeRatio: "0.94", bestRegime: "Bear & Recessionary Regimes", worstRegime: "Speculative Liquidity Rally", status: "ILLUSTRATIVE DATA" },
  { factor: "Low Volatility (Beta < 0.8)", definition: "Lowest quintile standard deviation of 252-day daily returns", longTermAnnualizedReturn: "+15.9% CAGR", excessVsSensex: "+1.1% Alpha", maxDrawdown: "-32.0% (2008)", sharpeRatio: "1.05", bestRegime: "Range-Bound / Inflation", worstRegime: "Early Stage Capex Boom", status: "ILLUSTRATIVE DATA" },
  { factor: "Value (Low P/B & P/E)", definition: "Lowest quintile valuation multiples with positive operating cashflow", longTermAnnualizedReturn: "+16.4% CAGR", excessVsSensex: "+1.6% Alpha", maxDrawdown: "-62.0% (2008)", sharpeRatio: "0.74", bestRegime: "Post-Crisis Recovery (2003, 2009)", worstRegime: "Growth Bubble / Tech Boom", status: "ILLUSTRATIVE DATA" },
  { factor: "Size (Small Cap Premium)", definition: "Bottom 250 of listed NSE 500 by market capitalisation", longTermAnnualizedReturn: "+17.1% CAGR", excessVsSensex: "+2.3% Alpha", maxDrawdown: "-68.5% (2008)", sharpeRatio: "0.68", bestRegime: "High Domestic Liquidity Expansion", worstRegime: "Credit Tightening / NBFC Stress", status: "ILLUSTRATIVE DATA" },
];

export const RESEARCH_LIBRARY_DATA: ResearchLibraryItem[] = [
  { id: "lib-1", title: "Sensex Drawdown Recovery Dynamics: 1979–2024", category: "Market", publishedDate: "Sep 2024", studyType: "Drawdown Anatomy", readTime: "8 min read", status: "ILLUSTRATIVE DATA", summary: "Examines time-to-trough and time-to-recovery distributions across 8 major Indian market contractions.", slug: "sensex-drawdowns" },
  { id: "lib-2", title: "Empirical Event Study: 1:1 Bonus Issues on Indian Exchanges", category: "Corporate Action", publishedDate: "Aug 2024", studyType: "Empirical Event Study", readTime: "12 min read", status: "ILLUSTRATIVE DATA", summary: "Measures cumulative abnormal returns [-60, +60 days] around ex-bonus dates for blue-chip Indian corporates.", slug: "bonus-issues" },
  { id: "lib-3", title: "Sector Rotation Regimes in Post-Liberalisation India", category: "Sector", publishedDate: "Jul 2024", studyType: "Regime State Machine", readTime: "15 min read", status: "ILLUSTRATIVE DATA", summary: "Cross-sectional transition matrix of sector leadership across capex, consumption, and global commodity cycles.", slug: "sector-leadership" },
  { id: "lib-4", title: "Point-in-Time Historical P/E Bands and Forward Returns", category: "Valuation", publishedDate: "Jun 2024", studyType: "Valuation Envelope", readTime: "10 min read", status: "ILLUSTRATIVE DATA", summary: "Calculates forward 1Y, 3Y, and 5Y compounding returns conditioned on starting valuation deciles.", slug: "market-regimes" },
  { id: "lib-5", title: "Multi-Decade Compounders: Survival Analysis (1995–2024)", category: "Company", publishedDate: "May 2024", studyType: "Longitudinal Factor Analysis", readTime: "14 min read", status: "ILLUSTRATIVE DATA", summary: "Tracks balance sheet resilience, capital allocation, and free-cash-flow conversion among top Indian wealth creators.", slug: "multicycle-compounders" },
  { id: "lib-6", title: "The Domestic SIP Anchor: How Retail Flows Altered Market Beta", category: "Macro", publishedDate: "Apr 2024", studyType: "Regime State Machine", readTime: "11 min read", status: "ILLUSTRATIVE DATA", summary: "Quantitative analysis of domestic mutual fund SIP run-rates absorbing foreign institutional capital outflows.", slug: "domestic-sip-anchor" },
];

// ----------------------------------------------------------------------------
// RESEARCH SERVICE LAYER ABSTRACTION (Separates calculations from UI)
// ----------------------------------------------------------------------------
export const researchEngine = {
  runQuery: (queryId: string): ResearchQueryPrompt => {
    const found = RESEARCH_QUERY_PRESETS.find((q) => q.id === queryId);
    return found || RESEARCH_QUERY_PRESETS[0];
  },

  runEventStudy: (params: EventStudyParameters): EventStudyResult => {
    let car = "+8.4%";
    let tStat = "2.84 (Significant at 1% level)";
    let winRate = "72%";
    let points = "0,20 20,20 40,18 50,14 60,10 80,7 100,5";

    if (params.eventType === "STOCK_SPLIT_2_1") {
      car = "+5.2%";
      tStat = "2.12 (Significant at 5% level)";
      winRate = "64%";
      points = "0,22 25,20 50,16 75,12 100,8";
    } else if (params.eventType === "DIVIDEND_HIKE_20") {
      car = "+3.8%";
      tStat = "2.45 (Significant at 5% level)";
      winRate = "68%";
      points = "0,24 25,22 50,18 75,14 100,10";
    } else if (params.eventType === "CAPEX_ANNOUNCEMENT") {
      car = "+6.9%";
      tStat = "1.98 (Significant at 10% level)";
      winRate = "59%";
      points = "0,22 20,21 40,17 60,13 80,9 100,6";
    } else if (params.eventType === "BUYBACK_TENDER") {
      car = "+4.6%";
      tStat = "2.65 (Significant at 1% level)";
      winRate = "76%";
      points = "0,23 25,20 50,16 75,12 100,9";
    }

    return {
      eventTypeLabel: params.eventType.replace(/_/g, " "),
      windowLabel: params.windowSize,
      benchmarkLabel: params.benchmark.replace(/_/g, " "),
      sampleSize: "N=84 Historical Corporate Actions",
      meanAbnormalReturn: "+2.4%",
      medianAbnormalReturn: "+1.8%",
      cumulativeAbnormalReturn: car,
      positiveOutcomeRate: winRate,
      tStatistic: tStat,
      chartPoints: points,
      methodologyNote: "Standard Market Model abnormal return (AR_t = R_it - [alpha_i + beta_i * R_mt]) estimated over 180-day pre-event window.",
    };
  },

  filterLibrary: (category: string, search: string): ResearchLibraryItem[] => {
    return RESEARCH_LIBRARY_DATA.filter((item) => {
      const matchCat = category === "ALL" || item.category.toUpperCase() === category;
      const matchSearch =
        item.title.toLowerCase().includes(search.toLowerCase()) ||
        item.summary.toLowerCase().includes(search.toLowerCase()) ||
        item.studyType.toLowerCase().includes(search.toLowerCase());
      return matchCat && matchSearch;
    });
  },
};

// ============================================================================
// RESEARCH PAGE COMPONENT (/research)
// ============================================================================
export const Research: React.FC = () => {
  // Query Engine State
  const [selectedQueryId, setSelectedQueryId] = useState<string>("q_drawdown_10");
  const [activeQueryInput, setActiveQueryInput] = useState<string>("What happened after the Sensex fell more than 10% from peak?");
  const [selectedCategoryTab, setSelectedCategoryTab] = useState<string>("DRAWDOWNS");

  // Event Study Builder State
  const [eventStudyType, setEventStudyType] = useState<EventStudyParameters["eventType"]>("BONUS_1_1");
  const [eventStudyWindow, setEventStudyWindow] = useState<EventStudyParameters["windowSize"]>("[-60,+60]");
  const [eventStudyBenchmark, setEventStudyBenchmark] = useState<EventStudyParameters["benchmark"]>("BSE_SENSEX");

  // Research Library Filter State
  const [libCategoryFilter, setLibCategoryFilter] = useState<string>("ALL");
  const [libSearchQuery, setLibSearchQuery] = useState<string>(" ");

  // Custom Study Builder State
  const [builderUniverse, setBuilderUniverse] = useState("BSE_SENSEX");
  const [builderEvent, setBuilderEvent] = useState("DRAWDOWN_20");
  const [builderWindow, setBuilderWindow] = useState("180D");
  const [builderResultNotice, setBuilderResultNotice] = useState<string | null>(null);

  useEffect(() => {
    document.title = "Indian Market Research & Historical Analysis | Sensex.money";
  }, []);

  // Compute Active Query Result via Service Layer
  const activeQueryResult = useMemo(() => {
    return researchEngine.runQuery(selectedQueryId);
  }, [selectedQueryId]);

  // Compute Event Study Result via Service Layer
  const eventStudyResult = useMemo(() => {
    return researchEngine.runEventStudy({
      eventType: eventStudyType,
      windowSize: eventStudyWindow,
      benchmark: eventStudyBenchmark,
      metric: "CUMULATIVE_ABNORMAL_RETURN",
    });
  }, [eventStudyType, eventStudyWindow, eventStudyBenchmark]);

  // Compute Filtered Library Items
  const filteredLibrary = useMemo(() => {
    return researchEngine.filterLibrary(libCategoryFilter, libSearchQuery.trim());
  }, [libCategoryFilter, libSearchQuery]);

  const handleSelectPreset = (preset: ResearchQueryPrompt) => {
    setSelectedQueryId(preset.id);
    setActiveQueryInput(preset.queryText);
    setSelectedCategoryTab(preset.category);
  };

  return (
    <div style={sharedStyles.root}>
      <GlobalHeader />

      <main>
        {/* ------------------------------------------------------------------ */}
        {/* 1. HERO SECTION                                                    */}
        {/* ------------------------------------------------------------------ */}
        <section style={{ padding: "48px 0 32px", borderBottom: "1px solid rgba(255, 255, 255, 0.06)" }}>
          <div style={sharedStyles.container}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "16px", marginBottom: "20px" }}>
              <div>
                <div style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  padding: "3px 8px",
                  borderRadius: "4px",
                  backgroundColor: "rgba(168, 85, 247, 0.12)",
                  border: "1px solid rgba(168, 85, 247, 0.3)",
                  color: "#c084fc",
                  fontSize: "11px",
                  fontWeight: 700,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  fontFamily: '"SF Mono", "JetBrains Mono", Menlo, monospace',
                  marginBottom: "10px",
                }}>
                  <FlaskConical size={13} />
                  <span>QUANTITATIVE MARKET RESEARCH</span>
                </div>

                <h1 style={{ fontSize: "clamp(28px, 4.2vw, 46px)", fontWeight: 800, letterSpacing: "-0.03em", color: "#ffffff", margin: "0 0 10px 0", lineHeight: 1.15 }}>
                  Ask better questions of India&apos;s market history.
                </h1>

                <p style={{ fontSize: "15px", color: "#94a3b8", maxWidth: "780px", margin: "0 0 24px 0", lineHeight: 1.55 }}>
                  Research crashes, recoveries, companies, sectors, valuations and market regimes using historical evidence — not hindsight.
                </p>

                <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
                  <a href="#query-engine" style={{ ...styles.primaryBtn, backgroundColor: "#ffffff", color: "#070b14" }} className="primary-cta-btn">
                    <span>ASK A HISTORICAL QUESTION</span>
                    <ArrowRight size={14} />
                  </a>
                  <a href="#featured-studies" style={styles.secondaryBtn} className="secondary-cta-btn">
                    <BookOpen size={14} style={{ color: "#38bdf8" }} />
                    <span>EXPLORE RESEARCH</span>
                  </a>
                </div>
              </div>

              {/* Research Engine Provenance Box */}
              <div style={{
                backgroundColor: "#0d1527",
                border: "1px solid rgba(255, 255, 255, 0.12)",
                padding: "14px 18px",
                borderRadius: "6px",
                maxWidth: "340px",
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "#38bdf8", fontSize: "11px", fontWeight: 700, fontFamily: '"SF Mono", monospace', letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "4px" }}>
                  <Scale size={13} />
                  <span>REPRODUCIBLE RESEARCH ENGINE</span>
                </div>
                <div style={{ fontSize: "11px", color: "#94a3b8", lineHeight: 1.4, marginBottom: "8px" }}>
                  DATA → CALCULATION → HISTORICAL OBSERVATIONS → STATISTICAL ANALYSIS → RESEARCH OUTPUT
                </div>
                <div style={{ display: "flex", gap: "6px", fontSize: "10px", color: "#cbd5e1", fontFamily: '"SF Mono", monospace' }}>
                  <span>45+ YEARS</span>
                  <span>•</span>
                  <span>EVENTS</span>
                  <span>•</span>
                  <span>REGIMES</span>
                  <span>•</span>
                  <span>DNA</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ------------------------------------------------------------------ */}
        {/* 2. PRIMARY RESEARCH QUERY ENGINE                                   */}
        {/* ------------------------------------------------------------------ */}
        <section id="query-engine" style={{ padding: "40px 0", borderBottom: "1px solid rgba(255, 255, 255, 0.05)" }}>
          <div style={sharedStyles.container}>
            <div style={{
              backgroundColor: "#0b1220",
              border: "1px solid rgba(56, 189, 248, 0.25)",
              borderRadius: "10px",
              padding: "28px",
              boxShadow: "0 4px 20px rgba(0, 0, 0, 0.4)",
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "10px", marginBottom: "14px" }}>
                <div>
                  <div style={{ fontSize: "11px", fontWeight: 700, color: "#38bdf8", letterSpacing: "0.1em", textTransform: "uppercase", fontFamily: '"SF Mono", monospace', marginBottom: "4px" }}>
                    RESEARCH QUERY INTERFACE
                  </div>
                  <h2 style={{ fontSize: "22px", fontWeight: 800, color: "#ffffff", margin: 0 }}>
                    Ask the historical market.
                  </h2>
                  <p style={{ fontSize: "13px", color: "#94a3b8", margin: "4px 0 0" }}>
                    Turn a market question into a reproducible historical study.
                  </p>
                </div>
                <span style={{ fontSize: "10px", padding: "3px 8px", borderRadius: "4px", backgroundColor: "rgba(245, 158, 11, 0.1)", color: "#f59e0b", border: "1px solid rgba(245, 158, 11, 0.25)", fontFamily: '"SF Mono", monospace', fontWeight: 600 }}>
                  DEMO ANALYSIS • METHODOLOGY PREVIEW
                </span>
              </div>

              {/* Large Query Input Box */}
              <div style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                backgroundColor: "#070b14",
                border: "1px solid rgba(56, 189, 248, 0.4)",
                borderRadius: "6px",
                padding: "10px 14px",
                marginBottom: "16px",
              }}>
                <Search size={18} style={{ color: "#38bdf8", flexShrink: 0 }} />
                <input
                  type="text"
                  value={activeQueryInput}
                  onChange={(e) => setActiveQueryInput(e.target.value)}
                  placeholder="What do you want to investigate? (e.g. What happened after the Sensex fell more than 10%?)"
                  style={{
                    backgroundColor: "transparent",
                    border: "none",
                    outline: "none",
                    color: "#ffffff",
                    fontSize: "14px",
                    fontWeight: 500,
                    width: "100%",
                    fontFamily: "inherit",
                  }}
                />
                <button
                  type="button"
                  style={{
                    padding: "8px 16px",
                    backgroundColor: "#38bdf8",
                    color: "#070b14",
                    border: "none",
                    borderRadius: "4px",
                    fontSize: "12px",
                    fontWeight: 700,
                    fontFamily: '"SF Mono", monospace',
                    cursor: "pointer",
                    whiteSpace: "nowrap",
                  }}
                >
                  RUN STUDY →
                </button>
              </div>

              {/* Suggestion Chips */}
              <div>
                <div style={{ fontSize: "11px", color: "#64748b", textTransform: "uppercase", fontFamily: '"SF Mono", monospace', marginBottom: "8px" }}>
                  Curated Research Questions (Click to load):
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                  {RESEARCH_QUERY_PRESETS.map((preset) => (
                    <button
                      key={preset.id}
                      type="button"
                      onClick={() => handleSelectPreset(preset)}
                      style={{
                        padding: "6px 12px",
                        borderRadius: "4px",
                        backgroundColor: selectedQueryId === preset.id ? "rgba(56, 189, 248, 0.15)" : "rgba(255, 255, 255, 0.04)",
                        border: selectedQueryId === preset.id ? "1px solid #38bdf8" : "1px solid rgba(255, 255, 255, 0.08)",
                        color: selectedQueryId === preset.id ? "#38bdf8" : "#cbd5e1",
                        fontSize: "12px",
                        cursor: "pointer",
                        textAlign: "left",
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                      }}
                      className="question-chip"
                    >
                      <Zap size={12} style={{ color: selectedQueryId === preset.id ? "#38bdf8" : "#64748b" }} />
                      <span>{preset.title}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ------------------------------------------------------------------ */}
        {/* 3. RESEARCH RESULT INTERFACE                                       */}
        {/* ------------------------------------------------------------------ */}
        <section style={{ padding: "40px 0", borderBottom: "1px solid rgba(255, 255, 255, 0.05)" }}>
          <div style={sharedStyles.container}>
            <div style={{
              backgroundColor: "#0d1629",
              border: "1px solid rgba(56, 189, 248, 0.3)",
              borderRadius: "8px",
              padding: "26px",
              marginBottom: "24px",
            }}>
              {/* Header result metadata */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "12px", marginBottom: "16px", borderBottom: "1px solid rgba(255, 255, 255, 0.06)", paddingBottom: "14px" }}>
                <div>
                  <div style={{ fontSize: "11px", fontWeight: 700, color: "#e2b357", fontFamily: '"SF Mono", monospace', letterSpacing: "0.1em" }}>
                    HISTORICAL STUDY OUTPUT
                  </div>
                  <h3 style={{ fontSize: "20px", fontWeight: 800, color: "#ffffff", margin: "4px 0 0" }}>
                    {activeQueryResult.title}
                  </h3>
                  <div style={{ fontSize: "12px", color: "#94a3b8", marginTop: "2px" }}>
                    Study Period: <strong style={{ color: "#ffffff" }}>{activeQueryResult.studyPeriod}</strong> • Sample: <strong style={{ color: "#38bdf8" }}>{activeQueryResult.sampleEpisodesCount} verified episodes</strong>
                  </div>
                </div>

                <div style={{ textAlign: "right" }}>
                  <span style={{ fontSize: "10px", padding: "3px 8px", borderRadius: "4px", backgroundColor: "rgba(245, 158, 11, 0.12)", color: "#f59e0b", border: "1px solid rgba(245, 158, 11, 0.3)", fontFamily: '"SF Mono", monospace', fontWeight: 700 }}>
                    DEMO ANALYSIS
                  </span>
                  <div style={{ fontSize: "10px", color: "#64748b", fontFamily: '"SF Mono", monospace', marginTop: "4px" }}>
                    Audit ID: SMX-2024-DRW01
                  </div>
                </div>
              </div>

              {/* Forward Returns & Win Rates Matrix */}
              <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
                gap: "12px",
                marginBottom: "20px",
              }}>
                <div style={{ padding: "14px", backgroundColor: "#070b14", borderRadius: "6px", border: "1px solid rgba(255, 255, 255, 0.04)" }}>
                  <div style={{ fontSize: "10px", color: "#64748b", fontFamily: '"SF Mono", monospace' }}>30D FORWARD RETURN</div>
                  <div style={{ fontSize: "22px", fontWeight: 800, color: "#10b981", fontFamily: '"SF Mono", monospace', margin: "2px 0" }}>
                    {activeQueryResult.d30}
                  </div>
                  <div style={{ fontSize: "11px", color: "#94a3b8" }}>
                    Positive Rate: <strong style={{ color: "#ffffff" }}>{activeQueryResult.winRate30D}</strong>
                  </div>
                </div>

                <div style={{ padding: "14px", backgroundColor: "#070b14", borderRadius: "6px", border: "1px solid rgba(255, 255, 255, 0.04)" }}>
                  <div style={{ fontSize: "10px", color: "#64748b", fontFamily: '"SF Mono", monospace' }}>90D FORWARD RETURN</div>
                  <div style={{ fontSize: "22px", fontWeight: 800, color: "#10b981", fontFamily: '"SF Mono", monospace', margin: "2px 0" }}>
                    {activeQueryResult.d90}
                  </div>
                  <div style={{ fontSize: "11px", color: "#94a3b8" }}>
                    Positive Rate: <strong style={{ color: "#ffffff" }}>{activeQueryResult.winRate90D}</strong>
                  </div>
                </div>

                <div style={{ padding: "14px", backgroundColor: "#070b14", borderRadius: "6px", border: "1px solid rgba(255, 255, 255, 0.04)" }}>
                  <div style={{ fontSize: "10px", color: "#64748b", fontFamily: '"SF Mono", monospace' }}>180D FORWARD RETURN</div>
                  <div style={{ fontSize: "22px", fontWeight: 800, color: "#10b981", fontFamily: '"SF Mono", monospace', margin: "2px 0" }}>
                    {activeQueryResult.d180}
                  </div>
                  <div style={{ fontSize: "11px", color: "#94a3b8" }}>
                    Positive Rate: <strong style={{ color: "#ffffff" }}>{activeQueryResult.winRate180D}</strong>
                  </div>
                </div>

                <div style={{ padding: "14px", backgroundColor: "#070b14", borderRadius: "6px", border: "1px solid rgba(255, 255, 255, 0.04)" }}>
                  <div style={{ fontSize: "10px", color: "#64748b", fontFamily: '"SF Mono", monospace' }}>MEDIAN RECOVERY</div>
                  <div style={{ fontSize: "22px", fontWeight: 800, color: "#38bdf8", fontFamily: '"SF Mono", monospace', margin: "2px 0" }}>
                    {activeQueryResult.medianRecoveryMonths}
                  </div>
                  <div style={{ fontSize: "11px", color: "#94a3b8" }}>
                    Time to reclaim prior peak
                  </div>
                </div>
              </div>

              {/* Forward Return Distribution Percentiles */}
              <div style={{
                backgroundColor: "#070b14",
                borderRadius: "6px",
                padding: "16px 20px",
                border: "1px solid rgba(255, 255, 255, 0.04)",
                marginBottom: "16px",
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                  <div style={{ fontSize: "11px", fontWeight: 700, color: "#38bdf8", fontFamily: '"SF Mono", monospace', textTransform: "uppercase" }}>
                    Forward Return Distribution Bands (180D Window)
                  </div>
                  <span style={{ fontSize: "10px", color: "#64748b", fontFamily: '"SF Mono", monospace' }}>
                    P10 to P90 Empirical Dispersion
                  </span>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: "8px", textAlign: "center" }}>
                  <div style={{ padding: "8px 4px", backgroundColor: "#0b1220", borderRadius: "4px" }}>
                    <div style={{ fontSize: "10px", color: "#64748b" }}>10th %ile</div>
                    <div style={{ fontSize: "14px", fontWeight: 700, color: "#f43f5e", fontFamily: '"SF Mono", monospace' }}>{activeQueryResult.p10}</div>
                  </div>
                  <div style={{ padding: "8px 4px", backgroundColor: "#0b1220", borderRadius: "4px" }}>
                    <div style={{ fontSize: "10px", color: "#64748b" }}>25th %ile</div>
                    <div style={{ fontSize: "14px", fontWeight: 700, color: "#cbd5e1", fontFamily: '"SF Mono", monospace' }}>{activeQueryResult.p25}</div>
                  </div>
                  <div style={{ padding: "8px 4px", backgroundColor: "#0b1220", borderRadius: "4px", border: "1px solid rgba(16, 185, 129, 0.3)" }}>
                    <div style={{ fontSize: "10px", color: "#10b981", fontWeight: 700 }}>Median</div>
                    <div style={{ fontSize: "14px", fontWeight: 800, color: "#10b981", fontFamily: '"SF Mono", monospace' }}>{activeQueryResult.median}</div>
                  </div>
                  <div style={{ padding: "8px 4px", backgroundColor: "#0b1220", borderRadius: "4px" }}>
                    <div style={{ fontSize: "10px", color: "#64748b" }}>75th %ile</div>
                    <div style={{ fontSize: "14px", fontWeight: 700, color: "#cbd5e1", fontFamily: '"SF Mono", monospace' }}>{activeQueryResult.p75}</div>
                  </div>
                  <div style={{ padding: "8px 4px", backgroundColor: "#0b1220", borderRadius: "4px" }}>
                    <div style={{ fontSize: "10px", color: "#64748b" }}>90th %ile</div>
                    <div style={{ fontSize: "14px", fontWeight: 700, color: "#10b981", fontFamily: '"SF Mono", monospace' }}>{activeQueryResult.p90}</div>
                  </div>
                </div>
              </div>

              <p style={{ fontSize: "13px", color: "#cbd5e1", lineHeight: 1.55, margin: 0 }}>
                <strong style={{ color: "#38bdf8" }}>Analytical Takeaway: </strong>
                {activeQueryResult.interpretation}
              </p>
            </div>

            {/* -------------------------------------------------------------- */}
            {/* 4. ACTUAL UNDERLYING HISTORICAL EPISODES TABLE                 */}
            {/* -------------------------------------------------------------- */}
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "12px" }}>
                <div>
                  <h4 style={{ fontSize: "16px", fontWeight: 700, color: "#ffffff", margin: 0 }}>
                    Underlying Historical Episodes (Audit Observation Rows)
                  </h4>
                  <span style={{ fontSize: "12px", color: "#64748b" }}>
                    Inspect each historical event meeting the study condition.
                  </span>
                </div>
                <span style={{ fontSize: "10px", fontFamily: '"SF Mono", monospace', color: "#64748b" }}>
                  POINT-IN-TIME SAMPLES
                </span>
              </div>

              <div style={{ backgroundColor: "#0b1220", border: "1px solid rgba(255, 255, 255, 0.08)", borderRadius: "8px", overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "12px" }}>
                  <thead>
                    <tr style={{ borderBottom: "1px solid rgba(255, 255, 255, 0.08)", backgroundColor: "#070b14", color: "#64748b", fontFamily: '"SF Mono", monospace', fontSize: "10px" }}>
                      <th style={{ padding: "10px 14px" }}>EPISODE / DATE</th>
                      <th style={{ padding: "10px 14px" }}>TRIGGER CATALYST</th>
                      <th style={{ padding: "10px 14px", textAlign: "right" }}>DRAWDOWN</th>
                      <th style={{ padding: "10px 14px", textAlign: "right" }}>30D FWD</th>
                      <th style={{ padding: "10px 14px", textAlign: "right" }}>90D FWD</th>
                      <th style={{ padding: "10px 14px", textAlign: "right" }}>180D FWD</th>
                      <th style={{ padding: "10px 14px", textAlign: "right" }}>RECOVERY</th>
                    </tr>
                  </thead>
                  <tbody>
                    {activeQueryResult.episodes.map((ep, idx) => (
                      <tr
                        key={ep.id}
                        style={{
                          borderBottom: idx === activeQueryResult.episodes.length - 1 ? "none" : "1px solid rgba(255, 255, 255, 0.04)",
                          backgroundColor: idx % 2 === 0 ? "transparent" : "rgba(255, 255, 255, 0.01)",
                        }}
                      >
                        <td style={{ padding: "10px 14px", color: "#ffffff", fontWeight: 600 }}>
                          <div>{ep.event}</div>
                          <div style={{ fontSize: "10px", color: "#64748b", fontFamily: '"SF Mono", monospace' }}>{ep.date}</div>
                        </td>
                        <td style={{ padding: "10px 14px", color: "#94a3b8" }}>{ep.trigger}</td>
                        <td style={{ padding: "10px 14px", textAlign: "right", color: "#f43f5e", fontWeight: 700, fontFamily: '"SF Mono", monospace' }}>{ep.drawdownMagnitude}</td>
                        <td style={{ padding: "10px 14px", textAlign: "right", color: ep.fwd30D.startsWith("+") ? "#10b981" : "#f43f5e", fontFamily: '"SF Mono", monospace' }}>{ep.fwd30D}</td>
                        <td style={{ padding: "10px 14px", textAlign: "right", color: ep.fwd90D.startsWith("+") ? "#10b981" : "#f43f5e", fontFamily: '"SF Mono", monospace' }}>{ep.fwd90D}</td>
                        <td style={{ padding: "10px 14px", textAlign: "right", color: ep.fwd180D.startsWith("+") ? "#10b981" : "#f43f5e", fontWeight: 700, fontFamily: '"SF Mono", monospace' }}>{ep.fwd180D}</td>
                        <td style={{ padding: "10px 14px", textAlign: "right", color: "#38bdf8", fontFamily: '"SF Mono", monospace' }}>{ep.recoveryDuration}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </section>

        {/* ------------------------------------------------------------------ */}
        {/* 5. RESEARCH METHODOLOGY PIPELINE                                   */}
        {/* ------------------------------------------------------------------ */}
        <section style={{ padding: "40px 0", borderBottom: "1px solid rgba(255, 255, 255, 0.05)" }}>
          <div style={sharedStyles.container}>
            <div style={{
              backgroundColor: "#0b1220",
              border: "1px solid rgba(255, 255, 255, 0.08)",
              borderRadius: "8px",
              padding: "24px",
            }}>
              <div style={{ fontSize: "11px", fontWeight: 700, color: "#38bdf8", letterSpacing: "0.12em", textTransform: "uppercase", fontFamily: '"SF Mono", monospace', marginBottom: "4px" }}>
                METHODOLOGY PIPELINE
              </div>
              <h3 style={{ fontSize: "18px", fontWeight: 700, color: "#ffffff", margin: "0 0 14px 0" }}>
                How the Study Works
              </h3>

              <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))",
                gap: "8px",
                marginBottom: "16px",
              }}>
                {[
                  { step: "01", label: "QUESTION", detail: "Define formal analytical query" },
                  { step: "02", label: "FILTERS", detail: "Apply event trigger condition" },
                  { step: "03", label: "EPISODES", detail: "Isolate point-in-time dates" },
                  { step: "04", label: "RETURNS", detail: "Calculate 30–365D forward bars" },
                  { step: "05", label: "DISTRIBUTION", detail: "Compute P10, median & P90" },
                  { step: "06", label: "AUDIT", detail: "Attach survivorship & bias warnings" },
                ].map((s) => (
                  <div key={s.step} style={{ padding: "10px", backgroundColor: "#070b14", borderRadius: "4px", border: "1px solid rgba(255, 255, 255, 0.04)" }}>
                    <div style={{ fontSize: "10px", color: "#38bdf8", fontWeight: 700, fontFamily: '"SF Mono", monospace' }}>{s.step}</div>
                    <div style={{ fontSize: "12px", fontWeight: 700, color: "#ffffff", margin: "2px 0" }}>{s.label}</div>
                    <div style={{ fontSize: "10px", color: "#94a3b8" }}>{s.detail}</div>
                  </div>
                ))}
              </div>

              <p style={{ fontSize: "12px", color: "#64748b", lineHeight: 1.5, margin: 0 }}>
                * Historical empirical research measures observed historical frequency and returns. It does not provide deterministic forecasts or guaranteed investment outcomes.
              </p>
            </div>
          </div>
        </section>

        {/* ------------------------------------------------------------------ */}
        {/* 6. FEATURED RESEARCH STUDIES                                       */}
        {/* ------------------------------------------------------------------ */}
        <section id="featured-studies" style={{ padding: "40px 0", borderBottom: "1px solid rgba(255, 255, 255, 0.05)" }}>
          <div style={sharedStyles.container}>
            <div style={{ marginBottom: "20px" }}>
              <div style={{ fontSize: "11px", fontWeight: 700, color: "#a855f7", letterSpacing: "0.12em", textTransform: "uppercase", fontFamily: '"SF Mono", monospace', marginBottom: "6px" }}>
                FLAGSHIP DOSSIERS
              </div>
              <h2 style={{ fontSize: "24px", fontWeight: 700, color: "#ffffff", margin: "0 0 4px 0", letterSpacing: "-0.02em" }}>
                Featured Quantitative Studies
              </h2>
              <p style={{ fontSize: "14px", color: "#94a3b8", margin: 0 }}>
                Longitudinal studies interrogating multi-decade Indian market crashes, sector leadership, and compounding franchises.
              </p>
            </div>

            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))",
              gap: "20px",
            }}>
              {FEATURED_RESEARCH_STUDIES.map((study) => (
                <div
                  key={study.id}
                  style={{
                    backgroundColor: "#0b1220",
                    border: "1px solid rgba(255, 255, 255, 0.08)",
                    borderRadius: "8px",
                    padding: "24px",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                  }}
                  className="product-card-hover"
                >
                  <div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "10px" }}>
                      <span style={{
                        fontSize: "9px",
                        fontFamily: '"SF Mono", monospace',
                        fontWeight: 700,
                        padding: "2px 6px",
                        borderRadius: "3px",
                        backgroundColor: `${study.accentColor}22`,
                        color: study.accentColor,
                        border: `1px solid ${study.accentColor}44`,
                      }}>
                        {study.category}
                      </span>
                      <span style={{ fontSize: "11px", color: "#64748b", fontFamily: '"SF Mono", monospace' }}>
                        {study.readTime}
                      </span>
                    </div>

                    <h3 style={{ fontSize: "18px", fontWeight: 700, color: "#ffffff", margin: "0 0 8px 0" }}>
                      {study.title}
                    </h3>
                    <div style={{ fontSize: "12px", color: "#38bdf8", fontWeight: 500, marginBottom: "8px" }}>
                      {study.question}
                    </div>
                    <p style={{ fontSize: "12px", color: "#94a3b8", lineHeight: 1.5, margin: "0 0 14px 0" }}>
                      {study.description}
                    </p>
                  </div>

                  <div>
                    <div style={{
                      padding: "10px 12px",
                      backgroundColor: "#070b14",
                      borderRadius: "6px",
                      border: "1px solid rgba(255, 255, 255, 0.04)",
                      marginBottom: "12px",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}>
                      <div>
                        <div style={{ fontSize: "9px", color: "#64748b", fontFamily: '"SF Mono", monospace' }}>KEY STATISTIC</div>
                        <div style={{ fontSize: "13px", fontWeight: 700, color: "#10b981", fontFamily: '"SF Mono", monospace' }}>{study.keyMetric}</div>
                      </div>
                      <div style={{ textAlign: "right" }}>
                        <div style={{ fontSize: "9px", color: "#64748b", fontFamily: '"SF Mono", monospace' }}>SAMPLE SIZE</div>
                        <div style={{ fontSize: "11px", color: "#cbd5e1", fontFamily: '"SF Mono", monospace' }}>{study.sampleSize}</div>
                      </div>
                    </div>

                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "11px", color: "#38bdf8", fontWeight: 600 }}>
                      <span>Examine Study Dossier</span>
                      <ChevronRight size={13} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ------------------------------------------------------------------ */}
        {/* 7. EVENT STUDY INTERACTIVE ENGINE                                  */}
        {/* ------------------------------------------------------------------ */}
        <section style={{ padding: "40px 0", borderBottom: "1px solid rgba(255, 255, 255, 0.05)" }}>
          <div style={sharedStyles.container}>
            <div style={{
              backgroundColor: "#0b1220",
              border: "1px solid rgba(56, 189, 248, 0.25)",
              borderRadius: "10px",
              padding: "26px",
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "10px", marginBottom: "16px" }}>
                <div>
                  <div style={{ fontSize: "11px", fontWeight: 700, color: "#38bdf8", letterSpacing: "0.12em", textTransform: "uppercase", fontFamily: '"SF Mono", monospace', marginBottom: "4px" }}>
                    EVENT STUDY ENGINE
                  </div>
                  <h3 style={{ fontSize: "20px", fontWeight: 800, color: "#ffffff", margin: 0 }}>
                    Cumulative Abnormal Return (CAR) Modeler
                  </h3>
                  <p style={{ fontSize: "13px", color: "#94a3b8", margin: "4px 0 0" }}>
                    Analyze statistical abnormal price reactions surrounding corporate actions and policy announcements.
                  </p>
                </div>
                <span style={{ fontSize: "10px", padding: "3px 8px", borderRadius: "4px", backgroundColor: "rgba(56, 189, 248, 0.1)", color: "#38bdf8", border: "1px solid rgba(56, 189, 248, 0.25)", fontFamily: '"SF Mono", monospace', fontWeight: 600 }}>
                  MARKET MODEL
                </span>
              </div>

              {/* Parameter Controls Grid */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "12px", marginBottom: "20px" }}>
                <div>
                  <label style={{ fontSize: "11px", color: "#94a3b8", display: "block", marginBottom: "4px", fontFamily: '"SF Mono", monospace' }}>
                    EVENT TYPE:
                  </label>
                  <select
                    value={eventStudyType}
                    onChange={(e) => setEventStudyType(e.target.value as any)}
                    style={{
                      width: "100%",
                      padding: "8px",
                      backgroundColor: "#070b14",
                      border: "1px solid rgba(255, 255, 255, 0.12)",
                      borderRadius: "4px",
                      color: "#ffffff",
                      fontSize: "12px",
                      fontFamily: '"SF Mono", monospace',
                    }}
                  >
                    <option value="BONUS_1_1">1:1 Bonus Share Issue</option>
                    <option value="STOCK_SPLIT_2_1">2:1 Stock Split (Subdivision)</option>
                    <option value="DIVIDEND_HIKE_20">Dividend Increase &gt; 20%</option>
                    <option value="CAPEX_ANNOUNCEMENT">Major Capex Announcement</option>
                    <option value="BUYBACK_TENDER">Tender Offer Share Buyback</option>
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: "11px", color: "#94a3b8", display: "block", marginBottom: "4px", fontFamily: '"SF Mono", monospace' }}>
                    EVENT WINDOW:
                  </label>
                  <select
                    value={eventStudyWindow}
                    onChange={(e) => setEventStudyWindow(e.target.value as any)}
                    style={{
                      width: "100%",
                      padding: "8px",
                      backgroundColor: "#070b14",
                      border: "1px solid rgba(255, 255, 255, 0.12)",
                      borderRadius: "4px",
                      color: "#ffffff",
                      fontSize: "12px",
                      fontFamily: '"SF Mono", monospace',
                    }}
                  >
                    <option value="[-20,+20]">[-20 Days, +20 Days]</option>
                    <option value="[-60,+60]">[-60 Days, +60 Days]</option>
                    <option value="[-120,+120]">[-120 Days, +120 Days]</option>
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: "11px", color: "#94a3b8", display: "block", marginBottom: "4px", fontFamily: '"SF Mono", monospace' }}>
                    BENCHMARK:
                  </label>
                  <select
                    value={eventStudyBenchmark}
                    onChange={(e) => setEventStudyBenchmark(e.target.value as any)}
                    style={{
                      width: "100%",
                      padding: "8px",
                      backgroundColor: "#070b14",
                      border: "1px solid rgba(255, 255, 255, 0.12)",
                      borderRadius: "4px",
                      color: "#ffffff",
                      fontSize: "12px",
                      fontFamily: '"SF Mono", monospace',
                    }}
                  >
                    <option value="BSE_SENSEX">BSE Sensex Benchmark</option>
                    <option value="NIFTY_50">NSE Nifty 50</option>
                    <option value="SECTOR_BENCHMARK">Respective Sector Index</option>
                  </select>
                </div>
              </div>

              {/* Event Study Output Box */}
              <div style={{
                backgroundColor: "#070b14",
                borderRadius: "8px",
                padding: "20px",
                border: "1px solid rgba(255, 255, 255, 0.06)",
              }}>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: "10px", marginBottom: "16px" }}>
                  <div style={{ padding: "10px", backgroundColor: "#0b1220", borderRadius: "4px" }}>
                    <div style={{ fontSize: "10px", color: "#64748b", fontFamily: '"SF Mono", monospace' }}>CUMULATIVE ABNORMAL RETURN</div>
                    <div style={{ fontSize: "20px", fontWeight: 800, color: "#10b981", fontFamily: '"SF Mono", monospace', marginTop: "2px" }}>
                      {eventStudyResult.cumulativeAbnormalReturn}
                    </div>
                  </div>
                  <div style={{ padding: "10px", backgroundColor: "#0b1220", borderRadius: "4px" }}>
                    <div style={{ fontSize: "10px", color: "#64748b", fontFamily: '"SF Mono", monospace' }}>STATISTICAL T-STAT</div>
                    <div style={{ fontSize: "14px", fontWeight: 700, color: "#38bdf8", fontFamily: '"SF Mono", monospace', marginTop: "4px" }}>
                      {eventStudyResult.tStatistic}
                    </div>
                  </div>
                  <div style={{ padding: "10px", backgroundColor: "#0b1220", borderRadius: "4px" }}>
                    <div style={{ fontSize: "10px", color: "#64748b", fontFamily: '"SF Mono", monospace' }}>POSITIVE OUTCOME RATE</div>
                    <div style={{ fontSize: "20px", fontWeight: 800, color: "#ffffff", fontFamily: '"SF Mono", monospace', marginTop: "2px" }}>
                      {eventStudyResult.positiveOutcomeRate}
                    </div>
                  </div>
                </div>

                {/* CAR Curve Chart */}
                <div style={{ height: "70px", width: "100%", backgroundColor: "#0b1220", borderRadius: "4px", padding: "8px", marginBottom: "10px" }}>
                  <svg viewBox="0 0 100 30" style={{ width: "100%", height: "100%", overflow: "visible" }} preserveAspectRatio="none">
                    <polyline
                      fill="none"
                      stroke="#10b981"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      points={eventStudyResult.chartPoints}
                    />
                  </svg>
                </div>

                <div style={{ fontSize: "11px", color: "#64748b", fontFamily: '"SF Mono", monospace' }}>
                  * {eventStudyResult.methodologyNote}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ------------------------------------------------------------------ */}
        {/* 8. FACTOR RESEARCH MATRIX                                          */}
        {/* ------------------------------------------------------------------ */}
        <section style={{ padding: "40px 0", borderBottom: "1px solid rgba(255, 255, 255, 0.05)" }}>
          <div style={sharedStyles.container}>
            <div style={{ marginBottom: "20px" }}>
              <div style={{ fontSize: "11px", fontWeight: 700, color: "#e2b357", letterSpacing: "0.12em", textTransform: "uppercase", fontFamily: '"SF Mono", monospace', marginBottom: "6px" }}>
                FACTOR INVESTING ANATOMY
              </div>
              <h2 style={{ fontSize: "24px", fontWeight: 700, color: "#ffffff", margin: "0 0 4px 0", letterSpacing: "-0.02em" }}>
                Factor Studies in Indian Markets
              </h2>
              <p style={{ fontSize: "14px", color: "#94a3b8", margin: 0 }}>
                Longitudinal performance of Momentum, Quality, Value, Low Volatility, and Size factors across Indian market cycles.
              </p>
            </div>

            <div style={{ backgroundColor: "#0b1220", border: "1px solid rgba(255, 255, 255, 0.08)", borderRadius: "8px", overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "12px" }}>
                <thead>
                  <tr style={{ borderBottom: "1px solid rgba(255, 255, 255, 0.08)", backgroundColor: "#070b14", color: "#64748b", fontFamily: '"SF Mono", monospace', fontSize: "10px" }}>
                    <th style={{ padding: "10px 14px" }}>STYLE FACTOR</th>
                    <th style={{ padding: "10px 14px" }}>FACTOR DEFINITION</th>
                    <th style={{ padding: "10px 14px", textAlign: "right" }}>ANNUALIZED CAGR</th>
                    <th style={{ padding: "10px 14px", textAlign: "right" }}>EXCESS RETURN</th>
                    <th style={{ padding: "10px 14px", textAlign: "right" }}>MAX DRAWDOWN</th>
                    <th style={{ padding: "10px 14px", textAlign: "right" }}>SHARPE</th>
                    <th style={{ padding: "10px 14px" }}>BEST REGIME</th>
                  </tr>
                </thead>
                <tbody>
                  {FACTOR_STUDIES_DATA.map((fac, idx) => (
                    <tr
                      key={fac.factor}
                      style={{
                        borderBottom: idx === FACTOR_STUDIES_DATA.length - 1 ? "none" : "1px solid rgba(255, 255, 255, 0.04)",
                        backgroundColor: idx % 2 === 0 ? "transparent" : "rgba(255, 255, 255, 0.01)",
                      }}
                    >
                      <td style={{ padding: "10px 14px", color: "#ffffff", fontWeight: 700 }}>{fac.factor}</td>
                      <td style={{ padding: "10px 14px", color: "#94a3b8", fontSize: "11px" }}>{fac.definition}</td>
                      <td style={{ padding: "10px 14px", textAlign: "right", color: "#10b981", fontWeight: 700, fontFamily: '"SF Mono", monospace' }}>{fac.longTermAnnualizedReturn}</td>
                      <td style={{ padding: "10px 14px", textAlign: "right", color: "#38bdf8", fontFamily: '"SF Mono", monospace' }}>{fac.excessVsSensex}</td>
                      <td style={{ padding: "10px 14px", textAlign: "right", color: "#f43f5e", fontFamily: '"SF Mono", monospace' }}>{fac.maxDrawdown}</td>
                      <td style={{ padding: "10px 14px", textAlign: "right", color: "#cbd5e1", fontFamily: '"SF Mono", monospace' }}>{fac.sharpeRatio}</td>
                      <td style={{ padding: "10px 14px", color: "#e2b357", fontSize: "11px" }}>{fac.bestRegime}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* ------------------------------------------------------------------ */}
        {/* 9. RESEARCH DISCIPLINE & BIAS CONTROLS                             */}
        {/* ------------------------------------------------------------------ */}
        <section style={{ padding: "40px 0", borderBottom: "1px solid rgba(255, 255, 255, 0.05)" }}>
          <div style={sharedStyles.container}>
            <div style={{
              backgroundColor: "#0d1629",
              border: "1px solid rgba(226, 179, 87, 0.3)",
              borderRadius: "10px",
              padding: "26px",
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "#e2b357", fontSize: "11px", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", fontFamily: '"SF Mono", monospace', marginBottom: "8px" }}>
                <AlertTriangle size={14} />
                <span>RESEARCH DISCIPLINE & BIAS CONTROLS</span>
              </div>

              <h3 style={{ fontSize: "20px", fontWeight: 800, color: "#ffffff", margin: "0 0 10px 0" }}>
                Methodological Safeguards against Historical Cognitive Traps
              </h3>

              <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
                gap: "12px",
                marginTop: "16px",
              }}>
                <div style={{ padding: "14px", backgroundColor: "#070b14", borderRadius: "6px" }}>
                  <div style={{ fontSize: "11px", fontWeight: 700, color: "#e2b357", fontFamily: '"SF Mono", monospace' }}>
                    SURVIVORSHIP CONTROL
                  </div>
                  <p style={{ fontSize: "12px", color: "#94a3b8", lineHeight: 1.45, margin: "4px 0 0" }}>
                    Studies must include delisted, merged, and liquidated securities to avoid exaggerating compound returns.
                  </p>
                </div>

                <div style={{ padding: "14px", backgroundColor: "#070b14", borderRadius: "6px" }}>
                  <div style={{ fontSize: "11px", fontWeight: 700, color: "#38bdf8", fontFamily: '"SF Mono", monospace' }}>
                    LOOK-AHEAD CONTROL
                  </div>
                  <p style={{ fontSize: "12px", color: "#94a3b8", lineHeight: 1.45, margin: "4px 0 0" }}>
                    Historical calculations utilize only financial statements and prices available at the exact observation date.
                  </p>
                </div>

                <div style={{ padding: "14px", backgroundColor: "#070b14", borderRadius: "6px" }}>
                  <div style={{ fontSize: "11px", fontWeight: 700, color: "#f43f5e", fontFamily: '"SF Mono", monospace' }}>
                    SMALL SAMPLE WARNING
                  </div>
                  <p style={{ fontSize: "12px", color: "#94a3b8", lineHeight: 1.45, margin: "4px 0 0" }}>
                    Rare events with N &lt; 10 observations are flagged as qualitative case studies rather than statistically significant proof.
                  </p>
                </div>

                <div style={{ padding: "14px", backgroundColor: "#070b14", borderRadius: "6px" }}>
                  <div style={{ fontSize: "11px", fontWeight: 700, color: "#10b981", fontFamily: '"SF Mono", monospace' }}>
                    OVERLAPPING CONTROL
                  </div>
                  <p style={{ fontSize: "12px", color: "#94a3b8", lineHeight: 1.45, margin: "4px 0 0" }}>
                    Multi-horizon returns are corrected for auto-correlation when calculating standard errors and t-statistics.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ------------------------------------------------------------------ */}
        {/* 10. RESEARCH LIBRARY & REPRODUCIBILITY AUDIT                       */}
        {/* ------------------------------------------------------------------ */}
        <section style={{ padding: "40px 0", borderBottom: "1px solid rgba(255, 255, 255, 0.05)" }}>
          <div style={sharedStyles.container}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: "16px", marginBottom: "20px" }}>
              <div>
                <div style={{ fontSize: "11px", fontWeight: 700, color: "#38bdf8", letterSpacing: "0.12em", textTransform: "uppercase", fontFamily: '"SF Mono", monospace', marginBottom: "6px" }}>
                  PUBLISHED DOSSIER ARCHIVE
                </div>
                <h2 style={{ fontSize: "24px", fontWeight: 700, color: "#ffffff", margin: "0 0 4px 0", letterSpacing: "-0.02em" }}>
                  Research Library
                </h2>
                <p style={{ fontSize: "14px", color: "#94a3b8", margin: 0 }}>
                  Searchable archive of quantitative research studies across Indian market history.
                </p>
              </div>

              {/* Search Box */}
              <div style={{ display: "flex", alignItems: "center", gap: "8px", backgroundColor: "#0b1220", padding: "6px 12px", borderRadius: "6px", border: "1px solid rgba(255, 255, 255, 0.1)" }}>
                <Search size={14} style={{ color: "#38bdf8" }} />
                <input
                  type="text"
                  value={libSearchQuery}
                  onChange={(e) => setLibSearchQuery(e.target.value)}
                  placeholder="Search research library..."
                  style={{
                    backgroundColor: "transparent",
                    border: "none",
                    outline: "none",
                    color: "#ffffff",
                    fontSize: "12px",
                    width: "200px",
                  }}
                />
              </div>
            </div>

            {/* Category Filter Chips */}
            <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", marginBottom: "16px" }}>
              {["ALL", "MARKET", "CORPORATE ACTION", "SECTOR", "VALUATION", "COMPANY", "MACRO"].map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setLibCategoryFilter(cat)}
                  style={{
                    padding: "3px 8px",
                    borderRadius: "4px",
                    fontSize: "10px",
                    fontWeight: 700,
                    fontFamily: '"SF Mono", monospace',
                    cursor: "pointer",
                    border: libCategoryFilter === cat ? "1px solid rgba(56, 189, 248, 0.5)" : "1px solid rgba(255, 255, 255, 0.08)",
                    backgroundColor: libCategoryFilter === cat ? "rgba(56, 189, 248, 0.15)" : "rgba(255, 255, 255, 0.03)",
                    color: libCategoryFilter === cat ? "#38bdf8" : "#94a3b8",
                  }}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Library Grid */}
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: "16px",
            }}>
              {filteredLibrary.map((item) => (
                <div
                  key={item.id}
                  style={{
                    backgroundColor: "#0b1220",
                    border: "1px solid rgba(255, 255, 255, 0.08)",
                    borderRadius: "8px",
                    padding: "20px",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                  }}
                  className="product-card-hover"
                >
                  <div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                      <span style={{ fontSize: "10px", color: "#38bdf8", fontFamily: '"SF Mono", monospace', fontWeight: 600 }}>
                        {item.category.toUpperCase()}
                      </span>
                      <span style={{ fontSize: "10px", color: "#64748b", fontFamily: '"SF Mono", monospace' }}>
                        {item.readTime}
                      </span>
                    </div>

                    <h4 style={{ fontSize: "15px", fontWeight: 700, color: "#ffffff", margin: "0 0 6px 0" }}>
                      {item.title}
                    </h4>

                    <p style={{ fontSize: "12px", color: "#94a3b8", lineHeight: 1.45, margin: "0 0 12px 0" }}>
                      {item.summary}
                    </p>
                  </div>

                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid rgba(255, 255, 255, 0.05)", paddingTop: "10px", fontSize: "11px" }}>
                    <span style={{ color: "#64748b", fontFamily: '"SF Mono", monospace' }}>{item.studyType}</span>
                    <span style={{ color: "#38bdf8", fontWeight: 600 }}>Read Study →</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ------------------------------------------------------------------ */}
        {/* 11. "BUILD YOUR OWN STUDY" (RESEARCH BUILDER CTA)                  */}
        {/* ------------------------------------------------------------------ */}
        <section style={{ padding: "48px 0 60px" }}>
          <div style={sharedStyles.container}>
            <div style={{
              backgroundColor: "#0d1527",
              border: "1px solid rgba(168, 85, 247, 0.3)",
              borderRadius: "10px",
              padding: "32px",
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "#c084fc", fontSize: "11px", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", fontFamily: '"SF Mono", monospace', marginBottom: "8px" }}>
                <SlidersHorizontal size={14} />
                <span>PROFESSIONAL RESEARCH BUILDER</span>
              </div>

              <h2 style={{ fontSize: "24px", fontWeight: 800, color: "#ffffff", margin: "0 0 8px 0" }}>
                Build your own historical study.
              </h2>
              <p style={{ fontSize: "13px", color: "#94a3b8", margin: "0 0 20px 0" }}>
                Configure custom parameters to test historical anomalies, corporate event reactions, and valuation spreads across 45+ years.
              </p>

              {/* Builder Form Controls */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "12px", marginBottom: "20px" }}>
                <div>
                  <label style={{ fontSize: "11px", color: "#94a3b8", display: "block", marginBottom: "4px", fontFamily: '"SF Mono", monospace' }}>
                    UNIVERSE:
                  </label>
                  <select
                    value={builderUniverse}
                    onChange={(e) => setBuilderUniverse(e.target.value)}
                    style={{ width: "100%", padding: "8px", backgroundColor: "#070b14", border: "1px solid rgba(255, 255, 255, 0.12)", borderRadius: "4px", color: "#ffffff", fontSize: "12px", fontFamily: '"SF Mono", monospace' }}
                  >
                    <option value="BSE_SENSEX">BSE Sensex 30</option>
                    <option value="NIFTY_50">NSE Nifty 50</option>
                    <option value="NSE_500">NSE 500 Listed Universe</option>
                    <option value="MID_SMALL_CAP">Mid & Small Cap Universe</option>
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: "11px", color: "#94a3b8", display: "block", marginBottom: "4px", fontFamily: '"SF Mono", monospace' }}>
                    EVENT CONDITION:
                  </label>
                  <select
                    value={builderEvent}
                    onChange={(e) => setBuilderEvent(e.target.value)}
                    style={{ width: "100%", padding: "8px", backgroundColor: "#070b14", border: "1px solid rgba(255, 255, 255, 0.12)", borderRadius: "4px", color: "#ffffff", fontSize: "12px", fontFamily: '"SF Mono", monospace' }}
                  >
                    <option value="DRAWDOWN_20">Peak Drawdown &gt;= 20%</option>
                    <option value="VIX_SPIKE_30">India VIX Closes &gt;= 30</option>
                    <option value="ALL_TIME_HIGH">New All-Time High Close</option>
                    <option value="BONUS_ISSUE">Corporate Bonus Issue</option>
                    <option value="BREADTH_THRUST">Breadth 50DMA &gt; 80%</option>
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: "11px", color: "#94a3b8", display: "block", marginBottom: "4px", fontFamily: '"SF Mono", monospace' }}>
                    FORWARD HORIZON:
                  </label>
                  <select
                    value={builderWindow}
                    onChange={(e) => setBuilderWindow(e.target.value)}
                    style={{ width: "100%", padding: "8px", backgroundColor: "#070b14", border: "1px solid rgba(255, 255, 255, 0.12)", borderRadius: "4px", color: "#ffffff", fontSize: "12px", fontFamily: '"SF Mono", monospace' }}
                  >
                    <option value="30D">30 Trading Days</option>
                    <option value="90D">90 Trading Days</option>
                    <option value="180D">180 Trading Days</option>
                    <option value="365D">365 Calendar Days (1 Year)</option>
                  </select>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setBuilderResultNotice(`Custom Study Configured: Universe=${builderUniverse} • Event=${builderEvent} • Window=${builderWindow} — Output registered: Quantitative Research Engine initialized in methodology preview mode.`)}
                style={{
                  padding: "10px 20px",
                  backgroundColor: "#a855f7",
                  color: "#ffffff",
                  border: "none",
                  borderRadius: "6px",
                  fontSize: "13px",
                  fontWeight: 700,
                  fontFamily: '"SF Mono", monospace',
                  cursor: "pointer",
                }}
              >
                RUN STUDY →
              </button>

              {builderResultNotice && (
                <div style={{ marginTop: "16px", padding: "12px 16px", backgroundColor: "#070b14", borderRadius: "6px", border: "1px solid rgba(168, 85, 247, 0.3)", fontSize: "12px", color: "#c084fc", fontFamily: '"SF Mono", monospace' }}>
                  {builderResultNotice}
                </div>
              )}
            </div>
          </div>
        </section>
      </main>

      <GlobalFooter />
    </div>
  );
};

// ============================================================================
// ----------------------------------------------------------------------------
// TOOLS (/tools & /tools/:toolId): DATA ARCHITECTURE & CENTRALIZED ANALYTICS
// ----------------------------------------------------------------------------
// ============================================================================

export type ToolStatus = "AVAILABLE" | "DEMO" | "COMING SOON";
export type ToolCategory = "ALL" | "INVESTING" | "MARKET" | "COMPANIES" | "RISK" | "CORPORATE ACTIONS" | "RESEARCH" | "PORTFOLIO";

export interface ToolDefinition {
  id: string;
  route: string;
  title: string;
  description: string;
  category: ToolCategory;
  status: ToolStatus;
  statusDetail?: string;
  iconName: string;
  badgeText: string;
  accentColor: string;
}

export const TOOLS_CATALOG: ToolDefinition[] = [
  {
    id: "investment-simulator",
    route: "/tools/investment-simulator",
    title: "₹1 Lakh Investment Simulator",
    description: "Reconstruct historical investment outcomes with dividend adjustments, CAGR, drawdown severity and recovery metrics.",
    category: "INVESTING",
    status: "DEMO",
    statusDetail: "Interactive Demo Dataset",
    iconName: "Calculator",
    badgeText: "HERO SIMULATOR",
    accentColor: "#10b981",
  },
  {
    id: "time-machine",
    route: "/tools/time-machine",
    title: "Market Time Machine",
    description: "See the Indian market through point-in-time valuations, breadth, interest rates and headlines as an investor saw it then.",
    category: "MARKET",
    status: "DEMO",
    statusDetail: "5 Historical Epochs",
    iconName: "Clock",
    badgeText: "EPOCH ENGINE",
    accentColor: "#38bdf8",
  },
  {
    id: "company-comparator",
    route: "/tools/company-comparator",
    title: "Company Comparator",
    description: "Compare 2–4 companies across returns, drawdowns, multi-year regimes, volatility and normalized wealth growth.",
    category: "COMPANIES",
    status: "DEMO",
    statusDetail: "Multi-Asset Matrix",
    iconName: "Scale",
    badgeText: "BENCHMARK LAB",
    accentColor: "#a855f7",
  },
  {
    id: "crash-atlas",
    route: "/tools/crash-atlas",
    title: "Crash Atlas & Drawdown Recovery",
    description: "Explore 8 major Indian market drawdowns, measure time-to-trough and analyze subsequent structural recoveries.",
    category: "RISK",
    status: "DEMO",
    statusDetail: "8 Drawdown Studies",
    iconName: "ShieldAlert",
    badgeText: "RISK ANATOMY",
    accentColor: "#f43f5e",
  },
  {
    id: "corporate-actions",
    route: "/tools/corporate-actions",
    title: "Corporate Action Explorer",
    description: "Point-in-time historical ledger recording splits, bonuses, dividends, mergers and demergers with adjustment factors.",
    category: "CORPORATE ACTIONS",
    status: "DEMO",
    statusDetail: "Point-in-Time Ledger",
    iconName: "Layers",
    badgeText: "EX-DATE AUDIT",
    accentColor: "#f59e0b",
  },
  {
    id: "regime-explorer",
    route: "/tools/regime-explorer",
    title: "Market Regime Explorer",
    description: "Explore how markets, sectors and factor styles behaved across 6 macroeconomic and volatility regimes.",
    category: "MARKET",
    status: "DEMO",
    statusDetail: "State Machine",
    iconName: "Compass",
    badgeText: "REGIME BETA",
    accentColor: "#a855f7",
  },
  {
    id: "sector-rotation",
    route: "/tools/sector-rotation",
    title: "Sector Rotation Explorer",
    description: "Study cross-sectional sector leadership, relative strength graphs and multi-cycle rotation dynamics.",
    category: "MARKET",
    status: "DEMO",
    statusDetail: "9 Indian Sectors",
    iconName: "BarChart3",
    badgeText: "ROTATION HEATMAP",
    accentColor: "#38bdf8",
  },
  {
    id: "event-study",
    route: "/tools/event-study",
    title: "Event Study Builder",
    description: "Test cumulative abnormal returns (CAR) surrounding corporate actions, index additions and policy shocks.",
    category: "RESEARCH",
    status: "DEMO",
    statusDetail: "Market Model CAR",
    iconName: "FlaskConical",
    badgeText: "EVENT STUDY",
    accentColor: "#10b981",
  },
  {
    id: "valuation",
    route: "/tools/valuation",
    title: "Historical Valuation Explorer",
    description: "Examine P/E, P/B, Dividend Yield and EV/EBITDA percentile bands across 10-year rolling valuation envelopes.",
    category: "MARKET",
    status: "DEMO",
    statusDetail: "Percentile Envelopes",
    iconName: "Activity",
    badgeText: "VALUATION BANDS",
    accentColor: "#38bdf8",
  },
  {
    id: "drawdowns",
    route: "/tools/drawdowns",
    title: "Drawdown & Underwater Analyzer",
    description: "Measure peak-to-trough declines, duration underwater, and empirical recovery distributions across indices and stocks.",
    category: "RISK",
    status: "DEMO",
    statusDetail: "Underwater Engine",
    iconName: "ShieldAlert",
    badgeText: "DRAWDOWN LAB",
    accentColor: "#f43f5e",
  },
  {
    id: "rolling-returns",
    route: "/tools/rolling-returns",
    title: "Rolling Return Explorer",
    description: "Analyze 1Y, 3Y, 5Y and 10Y rolling compound returns to eliminate point-to-point start-date bias.",
    category: "INVESTING",
    status: "DEMO",
    statusDetail: "P10–P90 Distributions",
    iconName: "RefreshCw",
    badgeText: "ROLLING DISTRIBUTIONS",
    accentColor: "#10b981",
  },
  {
    id: "stock-vs-market",
    route: "/tools/stock-vs-market",
    title: "Stock vs Market Relative Return",
    description: "Compare individual companies against Sensex, Nifty 50 and sector benchmarks across multiple market horizons.",
    category: "COMPANIES",
    status: "DEMO",
    statusDetail: "Relative Strength",
    iconName: "TrendingUp",
    badgeText: "ALPHA BENCHMARK",
    accentColor: "#38bdf8",
  },
  {
    id: "sip-vs-lumpsum",
    route: "/tools/sip-vs-lumpsum",
    title: "SIP vs Lump Sum Simulator",
    description: "Explore how monthly systematic investment plans behaved compared to lump-sum allocations during major drawdowns.",
    category: "INVESTING",
    status: "DEMO",
    statusDetail: "XIRR & Drawdown Lab",
    iconName: "Sliders",
    badgeText: "SIP LAB",
    accentColor: "#10b981",
  },
  {
    id: "portfolio-simulator",
    route: "/tools/portfolio-simulator",
    title: "Historical Portfolio Simulator",
    description: "Test asset allocations combining large caps, IT, private banks, gold and cash across historical market crises.",
    category: "PORTFOLIO",
    status: "DEMO",
    statusDetail: "Multi-Asset Weights",
    iconName: "FileSpreadsheet",
    badgeText: "PORTFOLIO LAB",
    accentColor: "#a855f7",
  },
  {
    id: "corporate-action-returns",
    route: "/tools/corporate-action-returns",
    title: "Corporate Action Return Calculator",
    description: "Calculate exact split and bonus share adjustments without confusing accounting base expansion with economic alpha.",
    category: "CORPORATE ACTIONS",
    status: "DEMO",
    statusDetail: "Share Mechanics",
    iconName: "SlidersHorizontal",
    badgeText: "ADJUSTMENT CALCULATOR",
    accentColor: "#f59e0b",
  },
  {
    id: "question-builder",
    route: "/tools/question-builder",
    title: "Historical Question Builder",
    description: "Bridge between Tools and Research: formulate customized quantitative parameters to generate reproducible studies.",
    category: "RESEARCH",
    status: "DEMO",
    statusDetail: "Research Bridge",
    iconName: "Sparkles",
    badgeText: "STUDY BUILDER",
    accentColor: "#38bdf8",
  },
];

// Centralized Analytics Engine
export const toolsAnalyticsEngine = {
  calculateCAGR: (initial: number, finalVal: number, years: number): number => {
    if (initial <= 0 || years <= 0) return 0;
    return (Math.pow(finalVal / initial, 1 / years) - 1) * 100;
  },
  calculateNormalizedWealth: (initial: number, cagr: number, years: number): number => {
    return initial * Math.pow(1 + cagr / 100, years);
  },
  calculateDrawdown: (peak: number, current: number): number => {
    if (peak <= 0) return 0;
    return ((current - peak) / peak) * 100;
  },
  calculateSplitAdjustment: (shares: number, oldFace: number, newFace: number) => {
    const multiplier = oldFace / newFace;
    return { adjustedShares: shares * multiplier, multiplier };
  },
  calculateBonusAdjustment: (shares: number, bonusRatio: number, heldRatio: number) => {
    const additional = (shares * bonusRatio) / heldRatio;
    return { totalShares: shares + additional, additionalShares: additional };
  },
};

// ============================================================================
// TOOLS MAIN PAGE (/tools)
// ============================================================================
export const Tools: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<ToolCategory>("ALL");
  const [searchFilter, setSearchFilter] = useState<string>("");
  const [savedTools, setSavedTools] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem("smx_saved_tools");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Simulator Hero State
  const [simAsset, setSimAsset] = useState<string>("Sensex");
  const [simAmount, setSimAmount] = useState<string>("100000");
  const [simStartYear, setSimStartYear] = useState<number>(2003);
  const [simMode, setSimMode] = useState<"PRICE" | "TOTAL">("PRICE");

  useEffect(() => {
    document.title = "Financial Market Tools & Historical Simulators | Sensex.money";
  }, []);

  const toggleSaveTool = (toolId: string) => {
    const updated = savedTools.includes(toolId)
      ? savedTools.filter((id) => id !== toolId)
      : [...savedTools, toolId];
    setSavedTools(updated);
    try {
      localStorage.setItem("smx_saved_tools", JSON.stringify(updated));
    } catch {}
  };

  const filteredTools = useMemo(() => {
    return TOOLS_CATALOG.filter((t) => {
      const matchesCat = activeCategory === "ALL" || t.category === activeCategory;
      const matchesSearch =
        t.title.toLowerCase().includes(searchFilter.toLowerCase()) ||
        t.description.toLowerCase().includes(searchFilter.toLowerCase()) ||
        t.category.toLowerCase().includes(searchFilter.toLowerCase());
      return matchesCat && matchesSearch;
    });
  }, [activeCategory, searchFilter]);

  // Compute Simulator Hero Numbers
  const simResults = useMemo(() => {
    const years = 2024 - simStartYear;
    let baseCAGR = 14.8;
    if (simAsset === "Nifty 50") baseCAGR = 13.9;
    else if (simAsset === "Infosys") baseCAGR = 18.2;
    else if (simAsset === "TCS") baseCAGR = 19.5;
    else if (simAsset === "Reliance") baseCAGR = 17.1;
    else if (simAsset === "HDFC Bank") baseCAGR = 16.4;
    else if (simAsset === "ICICI Bank") baseCAGR = 17.8;

    const divBonus = simMode === "TOTAL" ? 1.4 : 0;
    const finalCAGR = baseCAGR + divBonus;
    const initialNum = parseFloat(simAmount) || 100000;
    const finalWealth = toolsAnalyticsEngine.calculateNormalizedWealth(initialNum, finalCAGR, years);
    const absReturn = ((finalWealth - initialNum) / initialNum) * 100;

    return {
      years,
      cagr: finalCAGR.toFixed(1),
      finalWealth: Math.round(finalWealth).toLocaleString("en-IN"),
      absReturn: absReturn.toFixed(0),
      maxDrawdown: simAsset === "Infosys" ? "-82.4%" : "-60.2%",
      recoveryTime: "33 Months",
      bestYear: "+81.0% (2009)",
      worstYear: "-52.4% (2008)",
    };
  }, [simAsset, simAmount, simStartYear, simMode]);

  return (
    <div style={sharedStyles.root}>
      <GlobalHeader />

      <main>
        {/* ------------------------------------------------------------------ */}
        {/* 1. HERO SECTION                                                    */}
        {/* ------------------------------------------------------------------ */}
        <section style={{ padding: "48px 0 32px", borderBottom: "1px solid rgba(255, 255, 255, 0.06)" }}>
          <div style={sharedStyles.container}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "16px", marginBottom: "20px" }}>
              <div>
                <div style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  padding: "3px 8px",
                  borderRadius: "4px",
                  backgroundColor: "rgba(56, 189, 248, 0.1)",
                  border: "1px solid rgba(56, 189, 248, 0.25)",
                  color: "#38bdf8",
                  fontSize: "11px",
                  fontWeight: 700,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  fontFamily: '"SF Mono", monospace',
                  marginBottom: "10px",
                }}>
                  <SlidersHorizontal size={13} />
                  <span>TOOLS & SIMULATORS</span>
                </div>

                <h1 style={{ fontSize: "clamp(28px, 4.2vw, 46px)", fontWeight: 800, letterSpacing: "-0.03em", color: "#ffffff", margin: "0 0 10px 0", lineHeight: 1.15 }}>
                  Explore what the data would have looked like.
                </h1>

                <p style={{ fontSize: "15px", color: "#94a3b8", maxWidth: "780px", margin: "0 0 24px 0", lineHeight: 1.55 }}>
                  Run historical simulations, compare companies, investigate drawdowns, reconstruct investments and explore market regimes.
                </p>

                <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
                  <Link to="/tools/investment-simulator" style={{ ...styles.primaryBtn, backgroundColor: "#ffffff", color: "#070b14" }} className="primary-cta-btn">
                    <span>OPEN INVESTMENT SIMULATOR</span>
                    <ArrowRight size={14} />
                  </Link>
                  <Link to="/tools/time-machine" style={styles.secondaryBtn} className="secondary-cta-btn">
                    <Clock size={14} style={{ color: "#38bdf8" }} />
                    <span>ENTER MARKET TIME MACHINE</span>
                  </Link>
                </div>
              </div>

              {/* Research Laboratory Status Box */}
              <div style={{
                backgroundColor: "#0d1527",
                border: "1px solid rgba(255, 255, 255, 0.12)",
                padding: "14px 18px",
                borderRadius: "6px",
                maxWidth: "340px",
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "#f59e0b", fontSize: "11px", fontWeight: 700, fontFamily: '"SF Mono", monospace', letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "4px" }}>
                  <Info size={13} />
                  <span>ILLUSTRATIVE DATA • RESEARCH LAB</span>
                </div>
                <div style={{ fontSize: "11px", color: "#94a3b8", lineHeight: 1.4, marginBottom: "8px" }}>
                  Demo tools are powered by local demonstration datasets until the production historical database is connected.
                </div>
                <div style={{ display: "flex", gap: "6px", fontSize: "10px", color: "#cbd5e1", fontFamily: '"SF Mono", monospace' }}>
                  <span>16 TOOLS</span>
                  <span>•</span>
                  <span>SIMULATORS</span>
                  <span>•</span>
                  <span>REGIMES</span>
                  <span>•</span>
                  <span>DRAWDOWNS</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ------------------------------------------------------------------ */}
        {/* 2. FEATURED TOOL: ₹1 LAKH INVESTMENT SIMULATOR                     */}
        {/* ------------------------------------------------------------------ */}
        <section style={{ padding: "40px 0", borderBottom: "1px solid rgba(255, 255, 255, 0.05)" }}>
          <div style={sharedStyles.container}>
            <div style={{
              backgroundColor: "#0b1220",
              border: "1px solid rgba(16, 185, 129, 0.3)",
              borderRadius: "10px",
              padding: "28px",
              boxShadow: "0 4px 20px rgba(0, 0, 0, 0.4)",
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "12px", marginBottom: "18px", borderBottom: "1px solid rgba(255, 255, 255, 0.06)", paddingBottom: "14px" }}>
                <div>
                  <div style={{ fontSize: "11px", fontWeight: 700, color: "#10b981", letterSpacing: "0.1em", textTransform: "uppercase", fontFamily: '"SF Mono", monospace', marginBottom: "4px" }}>
                    FEATURED INTERACTIVE RESEARCH TOOL
                  </div>
                  <h2 style={{ fontSize: "24px", fontWeight: 800, color: "#ffffff", margin: 0 }}>
                    ₹1 lakh. What would it have become?
                  </h2>
                  <p style={{ fontSize: "13px", color: "#94a3b8", margin: "4px 0 0" }}>
                    Choose an investment date, asset and holding period — then experience the journey, not just the ending number.
                  </p>
                </div>
                <Link to="/tools/investment-simulator" style={{ fontSize: "12px", color: "#10b981", fontWeight: 700, textDecoration: "none", display: "flex", alignItems: "center", gap: "4px" }}>
                  <span>Open Dedicated Simulator</span>
                  <ArrowRight size={14} />
                </Link>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "28px" }}>
                {/* Simulator Inputs */}
                <div>
                  <div style={{ fontSize: "13px", fontWeight: 700, color: "#ffffff", marginBottom: "14px" }}>
                    Allocation Parameters
                  </div>

                  <div style={{ marginBottom: "12px" }}>
                    <label style={{ fontSize: "11px", color: "#94a3b8", display: "block", marginBottom: "4px", fontFamily: '"SF Mono", monospace' }}>
                      CHOOSE ASSET:
                    </label>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                      {["Sensex", "Nifty 50", "Infosys", "TCS", "Reliance", "HDFC Bank", "ICICI Bank"].map((a) => (
                        <button
                          key={a}
                          type="button"
                          onClick={() => setSimAsset(a)}
                          style={{
                            padding: "6px 10px",
                            borderRadius: "4px",
                            border: simAsset === a ? "1px solid #10b981" : "1px solid rgba(255, 255, 255, 0.08)",
                            backgroundColor: simAsset === a ? "rgba(16, 185, 129, 0.15)" : "#070b14",
                            color: simAsset === a ? "#10b981" : "#94a3b8",
                            fontSize: "11px",
                            fontWeight: 600,
                            cursor: "pointer",
                          }}
                        >
                          {a}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginBottom: "12px" }}>
                    <div>
                      <label style={{ fontSize: "11px", color: "#94a3b8", display: "block", marginBottom: "4px", fontFamily: '"SF Mono", monospace' }}>
                        INVESTMENT AMOUNT:
                      </label>
                      <input
                        type="text"
                        value={simAmount}
                        onChange={(e) => setSimAmount(e.target.value)}
                        style={{ width: "100%", padding: "8px", backgroundColor: "#070b14", border: "1px solid rgba(255, 255, 255, 0.1)", borderRadius: "4px", color: "#ffffff", fontSize: "13px", fontFamily: '"SF Mono", monospace' }}
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: "11px", color: "#94a3b8", display: "block", marginBottom: "4px", fontFamily: '"SF Mono", monospace' }}>
                        START YEAR:
                      </label>
                      <select
                        value={simStartYear}
                        onChange={(e) => setSimStartYear(parseInt(e.target.value, 10))}
                        style={{ width: "100%", padding: "8px", backgroundColor: "#070b14", border: "1px solid rgba(255, 255, 255, 0.1)", borderRadius: "4px", color: "#ffffff", fontSize: "13px", fontFamily: '"SF Mono", monospace' }}
                      >
                        {[1995, 2000, 2003, 2008, 2014, 2020].map((y) => (
                          <option key={y} value={y}>{y}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Price vs Total Return Toggles */}
                  <div style={{ marginBottom: "16px" }}>
                    <label style={{ fontSize: "11px", color: "#94a3b8", display: "block", marginBottom: "4px", fontFamily: '"SF Mono", monospace' }}>
                      MODE:
                    </label>
                    <div style={{ display: "flex", gap: "8px" }}>
                      <button
                        type="button"
                        onClick={() => setSimMode("PRICE")}
                        style={{
                          flex: 1,
                          padding: "6px 10px",
                          borderRadius: "4px",
                          border: simMode === "PRICE" ? "1px solid #38bdf8" : "1px solid rgba(255, 255, 255, 0.08)",
                          backgroundColor: simMode === "PRICE" ? "rgba(56, 189, 248, 0.15)" : "#070b14",
                          color: simMode === "PRICE" ? "#38bdf8" : "#94a3b8",
                          fontSize: "11px",
                          fontWeight: 600,
                          cursor: "pointer",
                        }}
                      >
                        PRICE RETURN
                      </button>
                      <button
                        type="button"
                        onClick={() => setSimMode("TOTAL")}
                        style={{
                          flex: 1,
                          padding: "6px 10px",
                          borderRadius: "4px",
                          border: simMode === "TOTAL" ? "1px solid #10b981" : "1px solid rgba(255, 255, 255, 0.08)",
                          backgroundColor: simMode === "TOTAL" ? "rgba(16, 185, 129, 0.15)" : "#070b14",
                          color: simMode === "TOTAL" ? "#10b981" : "#94a3b8",
                          fontSize: "11px",
                          fontWeight: 600,
                          cursor: "pointer",
                        }}
                      >
                        TOTAL RETURN (TRI)
                      </button>
                    </div>
                  </div>

                  <div style={{ fontSize: "11px", color: "#64748b", lineHeight: 1.4 }}>
                    * Total return includes dividend reinvestments. In production, exact ex-dividend cashflows will sync with the corporate action ledger.
                  </div>
                </div>

                {/* Simulator Output Display */}
                <div style={{
                  backgroundColor: "#070b14",
                  borderRadius: "8px",
                  padding: "20px",
                  border: "1px solid rgba(16, 185, 129, 0.2)",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                }}>
                  <div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "12px" }}>
                      <div>
                        <div style={{ fontSize: "10px", color: "#64748b", fontFamily: '"SF Mono", monospace' }}>ENDING VALUE ({simMode} RETURN)</div>
                        <div style={{ fontSize: "32px", fontWeight: 800, color: "#10b981", fontFamily: '"SF Mono", monospace', margin: "2px 0" }}>
                          ₹{simResults.finalWealth}
                        </div>
                        <div style={{ fontSize: "12px", color: "#94a3b8" }}>
                          CAGR: <strong style={{ color: "#ffffff" }}>+{simResults.cagr}%</strong> (+{simResults.absReturn}% Absolute)
                        </div>
                      </div>
                      <span style={{ fontSize: "10px", padding: "3px 6px", borderRadius: "4px", backgroundColor: "rgba(16, 185, 129, 0.12)", color: "#10b981", fontFamily: '"SF Mono", monospace', fontWeight: 700 }}>
                        {simResults.years} YEARS
                      </span>
                    </div>

                    {/* Wealth Journey Polyline */}
                    <div style={{ height: "60px", width: "100%", backgroundColor: "#0b1220", borderRadius: "4px", padding: "8px", border: "1px solid rgba(255, 255, 255, 0.04)", marginBottom: "14px" }}>
                      <svg viewBox="0 0 100 30" style={{ width: "100%", height: "100%", overflow: "visible" }} preserveAspectRatio="none">
                        <polyline
                          fill="none"
                          stroke="#10b981"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          points="0,26 15,22 30,24 45,18 60,14 75,10 90,6 100,2"
                        />
                      </svg>
                    </div>

                    <div style={{ fontSize: "12px", color: "#94a3b8", display: "flex", flexDirection: "column", gap: "6px" }}>
                      <div style={{ fontSize: "11px", fontWeight: 700, color: "#cbd5e1", textTransform: "uppercase", fontFamily: '"SF Mono", monospace' }}>
                        See the Journey:
                      </div>
                      <div style={{ display: "flex", justifyContent: "space-between" }}>
                        <span>Max Drawdown:</span>
                        <span style={{ color: "#f43f5e", fontFamily: '"SF Mono", monospace', fontWeight: 600 }}>{simResults.maxDrawdown}</span>
                      </div>
                      <div style={{ display: "flex", justifyContent: "space-between" }}>
                        <span>Recovery Time:</span>
                        <span style={{ color: "#ffffff", fontFamily: '"SF Mono", monospace' }}>{simResults.recoveryTime}</span>
                      </div>
                      <div style={{ display: "flex", justifyContent: "space-between" }}>
                        <span>Best / Worst Year:</span>
                        <span style={{ color: "#ffffff", fontFamily: '"SF Mono", monospace' }}>{simResults.bestYear} / {simResults.worstYear}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ------------------------------------------------------------------ */}
        {/* 3. TOOL DISCOVERY & SEARCH                                         */}
        {/* ------------------------------------------------------------------ */}
        <section style={{ padding: "40px 0", borderBottom: "1px solid rgba(255, 255, 255, 0.05)" }}>
          <div style={sharedStyles.container}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: "16px", marginBottom: "20px" }}>
              <div>
                <div style={{ fontSize: "11px", fontWeight: 700, color: "#38bdf8", letterSpacing: "0.12em", textTransform: "uppercase", fontFamily: '"SF Mono", monospace', marginBottom: "6px" }}>
                  INTERACTIVE LABORATORY
                </div>
                <h2 style={{ fontSize: "24px", fontWeight: 700, color: "#ffffff", margin: "0 0 4px 0", letterSpacing: "-0.02em" }}>
                  All Historical Research Tools ({filteredTools.length})
                </h2>
                <p style={{ fontSize: "14px", color: "#94a3b8", margin: 0 }}>
                  Select any tool to run customized simulations, investigate corporate events or analyze market regimes.
                </p>
              </div>

              {/* Search Box */}
              <div style={{ display: "flex", alignItems: "center", gap: "8px", backgroundColor: "#0b1220", padding: "6px 12px", borderRadius: "6px", border: "1px solid rgba(255, 255, 255, 0.1)" }}>
                <Search size={14} style={{ color: "#38bdf8" }} />
                <input
                  type="text"
                  value={searchFilter}
                  onChange={(e) => setSearchFilter(e.target.value)}
                  placeholder="Search tools (e.g. drawdown, CAGR, SIP, sector)..."
                  style={{
                    backgroundColor: "transparent",
                    border: "none",
                    outline: "none",
                    color: "#ffffff",
                    fontSize: "12px",
                    width: "240px",
                  }}
                />
              </div>
            </div>

            {/* Category Filter Tabs */}
            <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", marginBottom: "20px" }}>
              {(["ALL", "INVESTING", "MARKET", "COMPANIES", "RISK", "CORPORATE ACTIONS", "RESEARCH", "PORTFOLIO"] as ToolCategory[]).map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setActiveCategory(cat)}
                  style={{
                    padding: "4px 10px",
                    borderRadius: "4px",
                    fontSize: "11px",
                    fontWeight: 700,
                    fontFamily: '"SF Mono", monospace',
                    cursor: "pointer",
                    border: activeCategory === cat ? "1px solid rgba(56, 189, 248, 0.5)" : "1px solid rgba(255, 255, 255, 0.08)",
                    backgroundColor: activeCategory === cat ? "rgba(56, 189, 248, 0.15)" : "rgba(255, 255, 255, 0.03)",
                    color: activeCategory === cat ? "#38bdf8" : "#94a3b8",
                  }}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* 16 Tools Grid */}
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: "18px",
            }}>
              {filteredTools.map((tool) => {
                const isSaved = savedTools.includes(tool.id);
                return (
                  <div
                    key={tool.id}
                    style={{
                      backgroundColor: "#0b1220",
                      border: "1px solid rgba(255, 255, 255, 0.08)",
                      borderRadius: "8px",
                      padding: "22px",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                      position: "relative",
                    }}
                    className="product-card-hover"
                  >
                    <div>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "12px" }}>
                        <span style={{
                          fontSize: "9px",
                          fontFamily: '"SF Mono", monospace',
                          fontWeight: 700,
                          padding: "2px 6px",
                          borderRadius: "3px",
                          backgroundColor: `${tool.accentColor}22`,
                          color: tool.accentColor,
                          border: `1px solid ${tool.accentColor}44`,
                        }}>
                          {tool.badgeText}
                        </span>

                        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                          <span style={{
                            fontSize: "10px",
                            padding: "2px 6px",
                            borderRadius: "3px",
                            backgroundColor: tool.status === "DEMO" ? "rgba(245, 158, 11, 0.1)" : "rgba(100, 116, 139, 0.1)",
                            color: tool.status === "DEMO" ? "#f59e0b" : "#94a3b8",
                            fontFamily: '"SF Mono", monospace',
                            fontWeight: 600,
                          }}>
                            {tool.status}
                          </span>
                          <button
                            type="button"
                            onClick={() => toggleSaveTool(tool.id)}
                            title={isSaved ? "Saved in session" : "Save tool"}
                            style={{ background: "transparent", border: "none", color: isSaved ? "#e2b357" : "#64748b", cursor: "pointer", padding: "2px" }}
                          >
                            <Bookmark size={14} fill={isSaved ? "#e2b357" : "none"} />
                          </button>
                        </div>
                      </div>

                      <h3 style={{ fontSize: "17px", fontWeight: 700, color: "#ffffff", margin: "0 0 6px 0" }}>
                        {tool.title}
                      </h3>
                      <p style={{ fontSize: "12px", color: "#94a3b8", lineHeight: 1.5, margin: "0 0 16px 0" }}>
                        {tool.description}
                      </p>
                    </div>

                    <div style={{ borderTop: "1px solid rgba(255, 255, 255, 0.05)", paddingTop: "12px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{ fontSize: "11px", color: "#64748b", fontFamily: '"SF Mono", monospace' }}>
                        {tool.category}
                      </span>
                      <Link
                        to={tool.route}
                        style={{
                          fontSize: "12px",
                          color: "#38bdf8",
                          fontWeight: 700,
                          textDecoration: "none",
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "4px",
                        }}
                      >
                        <span>Open Tool</span>
                        <ArrowRight size={13} />
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ------------------------------------------------------------------ */}
        {/* 4. HISTORICAL FINANCIAL DISCLAIMER                                 */}
        {/* ------------------------------------------------------------------ */}
        <section style={{ padding: "36px 0 48px" }}>
          <div style={sharedStyles.container}>
            <div style={{
              backgroundColor: "#070b14",
              border: "1px solid rgba(255, 255, 255, 0.08)",
              borderRadius: "8px",
              padding: "20px",
              fontSize: "12px",
              color: "#94a3b8",
              lineHeight: 1.6,
            }}>
              <strong style={{ color: "#ffffff" }}>Important Methodology & Regulatory Disclaimer: </strong>
              Historical simulations are illustrative and depend on the underlying data, methodology and corporate-action treatment. Past performance does not guarantee future results. Sensex.money provides informational and quantitative research tools, not personalised investment advice.
            </div>
          </div>
        </section>
      </main>

      <GlobalFooter />
    </div>
  );
};

// ============================================================================
// UNIVERSAL TOOL DETAIL SHELL & CONFIGURATOR (/tools/:toolId)
// ============================================================================
export const ToolDetail: React.FC<{ toolId: string }> = ({ toolId }) => {
  const tool = TOOLS_CATALOG.find((t) => t.id === toolId) || TOOLS_CATALOG[0];

  useEffect(() => {
    document.title = `${tool.title} | Sensex.money Tools`;
  }, [tool]);

  return (
    <div style={sharedStyles.root}>
      <GlobalHeader />

      <main style={{ padding: "40px 0 60px" }}>
        <div style={sharedStyles.container}>
          {/* Breadcrumb */}
          <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "12px", color: "#64748b", marginBottom: "16px" }}>
            <Link to="/tools" style={{ color: "#94a3b8", textDecoration: "none" }}>Tools</Link>
            <ChevronRight size={13} />
            <span style={{ color: "#ffffff", fontWeight: 600 }}>{tool.title}</span>
          </div>

          {/* Tool Shell Container */}
          <div style={{
            backgroundColor: "#0b1220",
            border: `1px solid ${tool.accentColor}44`,
            borderRadius: "10px",
            padding: "32px",
            boxShadow: "0 4px 24px rgba(0, 0, 0, 0.4)",
          }}>
            {/* Tool Header */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "12px", marginBottom: "20px", borderBottom: "1px solid rgba(255, 255, 255, 0.06)", paddingBottom: "16px" }}>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}>
                  <span style={{
                    fontSize: "10px",
                    fontFamily: '"SF Mono", monospace',
                    fontWeight: 700,
                    padding: "2px 6px",
                    borderRadius: "3px",
                    backgroundColor: `${tool.accentColor}22`,
                    color: tool.accentColor,
                    border: `1px solid ${tool.accentColor}44`,
                  }}>
                    {tool.badgeText}
                  </span>
                  <span style={{ fontSize: "11px", color: "#64748b", fontFamily: '"SF Mono", monospace' }}>
                    {tool.category}
                  </span>
                </div>
                <h1 style={{ fontSize: "26px", fontWeight: 800, color: "#ffffff", margin: "0 0 6px 0" }}>
                  {tool.title}
                </h1>
                <p style={{ fontSize: "14px", color: "#94a3b8", margin: 0, maxWidth: "720px" }}>
                  {tool.description}
                </p>
              </div>

              <div style={{ textAlign: "right" }}>
                <span style={{
                  fontSize: "11px",
                  padding: "3px 8px",
                  borderRadius: "4px",
                  backgroundColor: "rgba(245, 158, 11, 0.12)",
                  color: "#f59e0b",
                  border: "1px solid rgba(245, 158, 11, 0.3)",
                  fontFamily: '"SF Mono", monospace',
                  fontWeight: 700,
                }}>
                  {tool.statusDetail || "DEMO ANALYSIS"}
                </span>
                <div style={{ fontSize: "10px", color: "#64748b", fontFamily: '"SF Mono", monospace', marginTop: "4px" }}>
                  Engine: SMX-TOOL-{tool.id.toUpperCase().replace(/-/g, "")}
                </div>
              </div>
            </div>

            {/* Interactive Workspace Area */}
            <div style={{
              backgroundColor: "#070b14",
              borderRadius: "8px",
              padding: "24px",
              border: "1px solid rgba(255, 255, 255, 0.06)",
              marginBottom: "24px",
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                <div style={{ fontSize: "12px", fontWeight: 700, color: "#38bdf8", fontFamily: '"SF Mono", monospace', textTransform: "uppercase" }}>
                  Tool Workspace & Controls
                </div>
                <div style={{ display: "flex", gap: "8px" }}>
                  <button
                    type="button"
                    onClick={() => alert("Export will be available when production historical data is connected.")}
                    style={{ padding: "4px 8px", backgroundColor: "#0b1220", border: "1px solid rgba(255, 255, 255, 0.1)", borderRadius: "4px", color: "#cbd5e1", fontSize: "11px", fontFamily: '"SF Mono", monospace', cursor: "pointer" }}
                  >
                    EXPORT CSV
                  </button>
                  <button
                    type="button"
                    onClick={() => alert("Study link copied to clipboard in demo preview mode.")}
                    style={{ padding: "4px 8px", backgroundColor: "#0b1220", border: "1px solid rgba(255, 255, 255, 0.1)", borderRadius: "4px", color: "#cbd5e1", fontSize: "11px", fontFamily: '"SF Mono", monospace', cursor: "pointer" }}
                  >
                    SHARE STUDY
                  </button>
                </div>
              </div>

              {/* Dynamic Sub-Tool Viewport */}
              {tool.id === "time-machine" ? (
                <div>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "10px", marginBottom: "16px" }}>
                    <div style={{ padding: "12px", backgroundColor: "#0b1220", borderRadius: "6px" }}>
                      <div style={{ fontSize: "10px", color: "#64748b" }}>SELECTED EPOCH</div>
                      <div style={{ fontSize: "16px", fontWeight: 700, color: "#38bdf8", fontFamily: '"SF Mono", monospace', marginTop: "2px" }}>March 2020 (COVID)</div>
                    </div>
                    <div style={{ padding: "12px", backgroundColor: "#0b1220", borderRadius: "6px" }}>
                      <div style={{ fontSize: "10px", color: "#64748b" }}>SENSEX LEVEL</div>
                      <div style={{ fontSize: "16px", fontWeight: 700, color: "#ffffff", fontFamily: '"SF Mono", monospace', marginTop: "2px" }}>25,981 (-38%)</div>
                    </div>
                    <div style={{ padding: "12px", backgroundColor: "#0b1220", borderRadius: "6px" }}>
                      <div style={{ fontSize: "10px", color: "#64748b" }}>MARKET P/E</div>
                      <div style={{ fontSize: "16px", fontWeight: 700, color: "#10b981", fontFamily: '"SF Mono", monospace', marginTop: "2px" }}>16.8x</div>
                    </div>
                    <div style={{ padding: "12px", backgroundColor: "#0b1220", borderRadius: "6px" }}>
                      <div style={{ fontSize: "10px", color: "#64748b" }}>REGIME STATE</div>
                      <div style={{ fontSize: "16px", fontWeight: 700, color: "#f43f5e", fontFamily: '"SF Mono", monospace', marginTop: "2px" }}>Panic Capitulation</div>
                    </div>
                  </div>
                  <div style={{ padding: "12px", backgroundColor: "#0b1220", borderRadius: "6px", fontSize: "12px", color: "#cbd5e1" }}>
                    <strong style={{ color: "#38bdf8" }}>Historical Context: </strong>
                    30 days before: Sensex 41,000 → Selected date: 25,981 → 30 days after: 31,500 (+21% relief rally).
                  </div>
                </div>
              ) : tool.id === "company-comparator" ? (
                <div>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "10px", marginBottom: "16px" }}>
                    <div style={{ padding: "12px", backgroundColor: "#0b1220", borderRadius: "6px" }}>
                      <div style={{ fontSize: "12px", fontWeight: 700, color: "#ffffff" }}>Infosys (INFY)</div>
                      <div style={{ fontSize: "14px", color: "#10b981", fontFamily: '"SF Mono", monospace', marginTop: "4px" }}>+18.2% 10Y CAGR • Max DD: -82%</div>
                    </div>
                    <div style={{ padding: "12px", backgroundColor: "#0b1220", borderRadius: "6px" }}>
                      <div style={{ fontSize: "12px", fontWeight: 700, color: "#ffffff" }}>TCS (TCS)</div>
                      <div style={{ fontSize: "14px", color: "#10b981", fontFamily: '"SF Mono", monospace', marginTop: "4px" }}>+19.5% 10Y CAGR • Max DD: -54%</div>
                    </div>
                    <div style={{ padding: "12px", backgroundColor: "#0b1220", borderRadius: "6px" }}>
                      <div style={{ fontSize: "12px", fontWeight: 700, color: "#ffffff" }}>HDFC Bank (HDFCBANK)</div>
                      <div style={{ fontSize: "14px", color: "#10b981", fontFamily: '"SF Mono", monospace', marginTop: "4px" }}>+16.4% 10Y CAGR • Max DD: -48%</div>
                    </div>
                  </div>
                  <div style={{ height: "60px", width: "100%", backgroundColor: "#0b1220", borderRadius: "4px", padding: "8px" }}>
                    <svg viewBox="0 0 100 30" style={{ width: "100%", height: "100%", overflow: "visible" }} preserveAspectRatio="none">
                      <polyline fill="none" stroke="#38bdf8" strokeWidth="2" points="0,26 25,20 50,16 75,10 100,4" />
                      <polyline fill="none" stroke="#10b981" strokeWidth="2" points="0,26 25,22 50,14 75,8 100,2" />
                    </svg>
                  </div>
                </div>
              ) : (
                <div>
                  <div style={{ padding: "16px", backgroundColor: "#0b1220", borderRadius: "6px", marginBottom: "12px" }}>
                    <div style={{ fontSize: "13px", fontWeight: 700, color: "#ffffff", marginBottom: "4px" }}>
                      {tool.title} Simulation Matrix
                    </div>
                    <div style={{ fontSize: "12px", color: "#94a3b8", lineHeight: 1.5 }}>
                      Model parameters calibrated across 45+ years of Indian capital market observations. Primary exchange pipeline hooks prepared for point-in-time calculation.
                    </div>
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: "8px" }}>
                    <div style={{ padding: "10px", backgroundColor: "#0b1220", borderRadius: "4px", textAlign: "center" }}>
                      <div style={{ fontSize: "10px", color: "#64748b" }}>UNIVERSE</div>
                      <div style={{ fontSize: "13px", fontWeight: 700, color: "#ffffff", fontFamily: '"SF Mono", monospace' }}>BSE SENSEX / NSE</div>
                    </div>
                    <div style={{ padding: "10px", backgroundColor: "#0b1220", borderRadius: "4px", textAlign: "center" }}>
                      <div style={{ fontSize: "10px", color: "#64748b" }}>SAMPLE HORIZON</div>
                      <div style={{ fontSize: "13px", fontWeight: 700, color: "#38bdf8", fontFamily: '"SF Mono", monospace' }}>1979–2026</div>
                    </div>
                    <div style={{ padding: "10px", backgroundColor: "#0b1220", borderRadius: "4px", textAlign: "center" }}>
                      <div style={{ fontSize: "10px", color: "#64748b" }}>DATA STATUS</div>
                      <div style={{ fontSize: "13px", fontWeight: 700, color: "#f59e0b", fontFamily: '"SF Mono", monospace' }}>ILLUSTRATIVE</div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Research Connection Footer */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px" }}>
              <Link to="/research" style={{ fontSize: "12px", color: "#38bdf8", fontWeight: 600, textDecoration: "none", display: "flex", alignItems: "center", gap: "4px" }}>
                <span>Explore Related Empirical Research →</span>
              </Link>
              <Link to="/tools" style={{ fontSize: "12px", color: "#94a3b8", textDecoration: "none" }}>
                ← Back to All Tools
              </Link>
            </div>
          </div>
        </div>
      </main>

      <GlobalFooter />
    </div>
  );
};

export const TimeMachine = () => <ToolDetail toolId="time-machine" />;
export const Simulator = () => <ToolDetail toolId="investment-simulator" />;
export const CorporateActions = () => <ToolDetail toolId="corporate-actions" />;
export const Events = () => <div>Market Events</div>;
export const EventDetail = () => <div>Event Detail</div>;
export const Crashes = () => <ToolDetail toolId="crash-atlas" />;
export const EventStudies = () => <ToolDetail toolId="event-study" />;
export const Regime = () => <ToolDetail toolId="regime-explorer" />;
export const Sectors = () => <ToolDetail toolId="sector-rotation" />;
export const Breadth = () => <div>Market Breadth</div>;
export const Sentiment = () => <div>Market Sentiment</div>;
export const Ask = () => <div>Ask Sensex.money</div>;
export const Data: React.FC = () => {
  useEffect(() => { document.title = "Financial Data Infrastructure | Sensex.money"; }, []);
  const datasets = [
    ["Security Master", "Canonical issuer, security and listing identity.", "issuer_id • security_id • listing_id", "PENDING", "#38bdf8"],
    ["Historical Prices", "Historical observations for long-horizon analysis.", "security_id • date • close • volume", "ILLUSTRATIVE", "#10b981"],
    ["Corporate Actions", "Capital events with explicit adjustment treatment.", "event_type • ex_date • ratio", "PENDING", "#f59e0b"],
    ["Point-in-Time Fundamentals", "Information aligned to what was knowable then.", "fiscal_period • observed_at • revision", "PENDING", "#a855f7"],
    ["Market Event Graph", "Episodes connecting companies and regimes.", "event_id • entity_id • regime_id", "ILLUSTRATIVE", "#e2b357"],
    ["Research Dataset", "Research-ready observations and provenance.", "study_id • sample_id • calculation", "CALCULATED", "#06b6d4"],
  ] as const;
  const status = (value: string) => <span style={{ padding: "3px 7px", borderRadius: "4px", border: "1px solid rgba(245,158,11,.35)", backgroundColor: "rgba(245,158,11,.1)", color: value === "CALCULATED" ? "#38bdf8" : "#f59e0b", fontSize: "10px", fontWeight: 700, fontFamily: '"SF Mono", monospace' }}>{value}</span>;
  const section = (eyebrow: string, title: string, copy: string) => <div style={{ marginBottom: "22px" }}><div style={{ color: "#38bdf8", fontSize: "11px", fontWeight: 700, letterSpacing: ".12em", fontFamily: '"SF Mono", monospace', marginBottom: "6px" }}>{eyebrow}</div><h2 style={{ color: "#fff", fontSize: "26px", margin: "0 0 6px", letterSpacing: "-.025em" }}>{title}</h2><p style={{ color: "#94a3b8", fontSize: "14px", lineHeight: 1.55, maxWidth: "760px", margin: 0 }}>{copy}</p></div>;
  const box = (children: React.ReactNode, extra: React.CSSProperties = {}) => <div style={{ backgroundColor: "#0b1220", border: "1px solid rgba(255,255,255,.08)", borderRadius: "6px", padding: "16px", ...extra }}>{children}</div>;
  return <div style={sharedStyles.root}><GlobalHeader /><main>
    <section style={{ padding: "48px 0 36px", borderBottom: "1px solid rgba(255,255,255,.06)" }}><div style={sharedStyles.container}><div style={{ display: "flex", justifyContent: "space-between", gap: "20px", flexWrap: "wrap" }}><div><div style={{ color: "#38bdf8", fontSize: "11px", fontWeight: 700, letterSpacing: ".12em", fontFamily: '"SF Mono", monospace', marginBottom: "10px" }}>DATA INFRASTRUCTURE</div><h1 style={{ color: "#fff", fontSize: "clamp(28px,4.2vw,48px)", lineHeight: 1.12, letterSpacing: "-.03em", maxWidth: "760px", margin: "0 0 12px" }}>Historical market data, structured for research.</h1><p style={{ color: "#94a3b8", fontSize: "16px", lineHeight: 1.6, maxWidth: "760px", margin: "0 0 24px" }}>Sensex.money is building an institutional-grade historical data layer for India&apos;s markets: identity, corporate actions, fundamentals, prices, events and research-ready analytics.</p><div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}><a href="#data-stack" style={styles.primaryBtn} className="primary-cta-btn">Explore the Data <ArrowRight size={14} /></a><Link to="/research" style={styles.secondaryBtn}>Explore Research <BookOpen size={14} /></Link></div></div>{box(<><div style={{ color: "#f59e0b", fontSize: "11px", fontWeight: 700, fontFamily: '"SF Mono", monospace', marginBottom: "5px" }}>DEMO / ARCHITECTURE PREVIEW</div><p style={{ color: "#94a3b8", fontSize: "12px", lineHeight: 1.45, margin: 0 }}>Schemas and examples describe the intended data model. Production access, coverage and rights are not connected.</p></>, { maxWidth: "300px", borderColor: "rgba(245,158,11,.28)" })}</div></div></section>
    <section id="data-stack" style={{ padding: "42px 0", borderBottom: "1px solid rgba(255,255,255,.05)" }}><div style={sharedStyles.container}>{section("DATA STACK", "From raw observation to research output.", "The infrastructure layer turns fragmented historical records into structured financial intelligence.")}<div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(150px,1fr))", gap: "8px" }}>{["Market Sources","Security Identity","Historical Data","Corporate Actions","Point-in-Time Fundamentals","Event Graph","Analytics / Research","Applications"].map((step, i) => box(<><div style={{ color: "#64748b", fontSize: "10px", fontFamily: '"SF Mono", monospace' }}>0{i + 1}</div><div style={{ color: "#fff", fontSize: "13px", fontWeight: 600, marginTop: "5px" }}>{step}</div></>, { textAlign: "center", padding: "15px 12px", borderColor: "rgba(56,189,248,.18)" }))}</div></div></section>
    <section style={{ padding: "42px 0", borderBottom: "1px solid rgba(255,255,255,.05)" }}><div style={sharedStyles.container}>{section("THE DATA PROBLEM", "India&apos;s market history is fragmented.", "Identifiers change, corporate actions alter price history, statements are revised, and research needs point-in-time context.")}<div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: "10px" }}>{["Identifiers and listings change", "Corporate actions alter price history", "Financial statements are revised", "Survivorship bias removes disappeared companies", "Events are difficult to connect", "Point-in-time context matters"].map((item) => box(<><AlertTriangle size={14} style={{ color: "#e2b357", marginBottom: "7px" }} /><div style={{ color: "#cbd5e1", fontSize: "13px" }}>{item}</div></>))}</div></div></section>
    <section style={{ padding: "42px 0", borderBottom: "1px solid rgba(255,255,255,.05)" }}><div style={sharedStyles.container}>{section("DATASETS", "Structured layers for historical market intelligence.", "Each layer can later switch from demoDataProvider to apiDataProvider without changing the UI.")}<div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: "16px" }}>{datasets.map(([title, description, fields, state, accent]) => box(<><div style={{ display: "flex", justifyContent: "space-between", gap: "10px", marginBottom: "10px" }}><h3 style={{ color: "#fff", fontSize: "16px", margin: 0 }}>{title}</h3>{status(state)}</div><p style={{ color: "#94a3b8", fontSize: "13px", lineHeight: 1.5, margin: "0 0 14px" }}>{description}</p><code style={{ color: accent, backgroundColor: "#070b14", padding: "7px", borderRadius: "4px", display: "block", fontSize: "10px", lineHeight: 1.6 }}>{fields}</code></>))}</div></div></section>
    <section style={{ padding: "42px 0", borderBottom: "1px solid rgba(255,255,255,.05)" }}><div style={sharedStyles.container}>{section("SECURITY MASTER", "Identity before analytics.", "A ticker is an attribute. Identity must survive ticker changes, corporate actions, listings and security transitions.")}<div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(210px,1fr))", gap: "10px" }}>{[["Issuer","issuer_id: ISSUER_000123"],["Security","security_id: SEC_000456"],["Listing","listing_id: LISTING_000789"],["Instrument","instrument_id: INSTR_001234"]].map(([label, value]) => box(<><div style={{ color: "#38bdf8", fontSize: "10px", fontFamily: '"SF Mono", monospace' }}>{label.toUpperCase()}</div><code style={{ color: "#fff", display: "block", marginTop: "8px", fontSize: "12px" }}>{value}</code></>))}</div></div></section>
    <section style={{ padding: "42px 0", borderBottom: "1px solid rgba(255,255,255,.05)" }}><div style={sharedStyles.container}>{section("CORPORATE-ACTION LEDGER", "Corporate actions are part of the security&apos;s history.", "Illustrative rows show the required lineage: event, announcement, record, effective date, ratio, predecessor, successor and adjustment.")}<div style={{ overflowX: "auto" }}>{box(<table style={{ minWidth: "760px", width: "100%", borderCollapse: "collapse", fontSize: "11px" }}><thead><tr style={{ color: "#64748b", fontFamily: '"SF Mono", monospace' }}>{["EVENT","ANNOUNCEMENT","RECORD","EFFECTIVE","RATIO","LINEAGE","ADJUSTMENT","STATUS"].map((head) => <th key={head} style={{ padding: "10px", textAlign: "left" }}>{head}</th>)}</tr></thead><tbody>{[["BONUS","Illustrative","Illustrative","Illustrative","1:1","SEC_DEMO_001 → SEC_DEMO_001","Share count ×2"],["SPLIT","Illustrative","Illustrative","Illustrative","2:1","SEC_DEMO_002 → SEC_DEMO_002","Reference price ÷2"],["MERGER","Illustrative","Illustrative","Illustrative","Pending","SEC_DEMO_004 → SEC_DEMO_005","Lineage required"]].map((row, i) => <tr key={i} style={{ borderTop: "1px solid rgba(255,255,255,.05)" }}>{row.map((cell) => <td key={cell} style={{ padding: "10px", color: "#cbd5e1", fontFamily: '"SF Mono", monospace' }}>{cell}</td>)}<td style={{ padding: "10px" }}>{status("ILLUSTRATIVE")}</td></tr>)}</tbody></table>)}</div></div></section>
    <section style={{ padding: "42px 0", borderBottom: "1px solid rgba(255,255,255,.05)" }}><div style={sharedStyles.container}>{section("POINT-IN-TIME FUNDAMENTALS", "The same result can mean different things depending on when it was observable.", "Separate fiscal period, announcement, first observed, revision sequence, restatement flag, source document and document hash.")}<div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>{["Fiscal Period","Announcement","First Observed","Revision","Restatement"].map((step, i) => box(<><div style={{ color: "#a855f7", fontSize: "10px", fontFamily: '"SF Mono", monospace' }}>0{i + 1}</div><div style={{ color: "#fff", fontSize: "13px", fontWeight: 600, marginTop: "5px" }}>{step}</div></>, { flex: "1 1 145px", borderColor: "rgba(168,85,247,.2)" }))}</div></div></section>
    <section style={{ padding: "42px 0", borderBottom: "1px solid rgba(255,255,255,.05)" }}><div style={sharedStyles.container}>{section("RETURN ENGINE", "Returns require history, not just prices.", "Price Return, Adjusted Price Return and Total Return must be distinct. Rights, spin-offs and complex actions require explicit treatment.")}<div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(230px,1fr))", gap: "12px" }}>{[["PRICE RETURN","Raw price movement.","#38bdf8"],["ADJUSTED PRICE RETURN","Split and bonus treatment.","#e2b357"],["TOTAL RETURN","Price plus explicit distributions.","#10b981"]].map(([title, copy, color]) => box(<><div style={{ color, fontSize: "11px", fontWeight: 700, fontFamily: '"SF Mono", monospace' }}>{title}</div><p style={{ color: "#cbd5e1", fontSize: "13px", margin: "9px 0 0" }}>{copy}</p></>, { borderColor: `${color}44` }))}</div></div></section>
    <section style={{ padding: "42px 0", borderBottom: "1px solid rgba(255,255,255,.05)" }}><div style={sharedStyles.container}>{section("DATA QUALITY", "Every observation needs provenance.", "Source → Ingestion → Normalization → Validation → Verification → Versioning.")}<div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginBottom: "14px" }}>{["SOURCE","INGESTION","NORMALIZATION","VALIDATION","VERIFICATION","VERSIONING"].map((step) => <span key={step} style={{ color: "#fff", fontSize: "12px", fontWeight: 600, fontFamily: '"SF Mono", monospace', padding: "7px 10px", backgroundColor: "#0b1220", border: "1px solid rgba(255,255,255,.07)", borderRadius: "4px" }}>{step}</span>)}</div><div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>{["VERIFIED","CALCULATED","ILLUSTRATIVE","PARTIALLY VERIFIED","PENDING"].map((value) => status(value))}</div></div></section>
    <section style={{ padding: "42px 0", borderBottom: "1px solid rgba(255,255,255,.05)" }}><div style={sharedStyles.container}>{box(<><div style={{ color: "#e2b357", fontSize: "11px", fontWeight: 700, letterSpacing: ".1em", fontFamily: '"SF Mono", monospace' }}>SURVIVORSHIP / LOOK-AHEAD WARNING</div><h2 style={{ color: "#fff", fontSize: "22px", margin: "9px 0" }}>Historical data can lie by omission.</h2><p style={{ color: "#94a3b8", fontSize: "14px", lineHeight: 1.55, maxWidth: "800px" }}>Research datasets can become biased when they only contain companies that exist today or use information unavailable at the historical decision point.</p><div style={{ display: "flex", gap: "7px", flexWrap: "wrap", marginBottom: "15px" }}>{["SURVIVORSHIP BIAS","LOOK-AHEAD BIAS","RESTATEMENT RISK"].map((tag) => <span key={tag} style={{ color: "#f59e0b", border: "1px solid rgba(245,158,11,.3)", backgroundColor: "rgba(245,158,11,.1)", borderRadius: "4px", padding: "3px 7px", fontSize: "10px", fontFamily: '"SF Mono", monospace', fontWeight: 700 }}>{tag}</span>)}</div><Link to="/research" style={{ color: "#e2b357", fontSize: "12px", fontWeight: 600 }}>Explore Research Discipline →</Link></>, { borderColor: "rgba(226,179,87,.3)", backgroundColor: "#0d1629" })}</div></section>
    <section style={{ padding: "42px 0", borderBottom: "1px solid rgba(255,255,255,.05)" }}><div style={sharedStyles.container}>{section("API / DATA ACCESS", "Built for machines as well as humans.", "Conceptual access patterns only. Production access, licensing and redistribution terms are not connected.")}<div style={{ marginBottom: "12px" }}>{status("PENDING")} <span style={{ color: "#94a3b8", fontSize: "12px", marginLeft: "7px" }}>COMING SOON</span></div><pre style={{ overflowX: "auto", backgroundColor: "#070b14", border: "1px solid rgba(255,255,255,.08)", borderRadius: "6px", padding: "16px", color: "#38bdf8", fontSize: "12px", lineHeight: 1.7, fontFamily: '"SF Mono", monospace' }}>{"GET /v1/securities/{security_id}\nGET /v1/prices\nGET /v1/corporate-actions\nGET /v1/fundamentals\nGET /v1/events\nGET /v1/research"}</pre></div></section>
    <section style={{ padding: "42px 0", borderBottom: "1px solid rgba(255,255,255,.05)" }}><div style={sharedStyles.container}>{section("DATA → ANALYTICS → RESEARCH", "One history, many research surfaces.", "Data inputs become analytics outputs, then reproducible research workflows.")}<div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(230px,1fr))", gap: "12px" }}>{[["DATA","Security Master • Prices • Fundamentals • Events","#38bdf8"],["ANALYTICS","Returns • Drawdowns • Regimes • Valuation","#10b981"],["RESEARCH","Event Studies • Episodes • Company Analysis","#a855f7"]].map(([title, copy, color]) => box(<><div style={{ color, fontSize: "12px", fontWeight: 700, fontFamily: '"SF Mono", monospace' }}>{title}</div><p style={{ color: "#cbd5e1", fontSize: "13px", lineHeight: 1.6, margin: "10px 0 0" }}>{copy}</p></>, { borderColor: `${color}44` }))}</div></div></section>
    <section style={{ padding: "42px 0", borderBottom: "1px solid rgba(255,255,255,.05)" }}><div style={sharedStyles.container}>{section("SCHEMA PREVIEWS", "Explicit fields make history queryable.", "Architecture previews for future provider and API replacement, not production contracts.")}<div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(360px,1fr))", gap: "16px" }}>{[["HistoricalPriceObservation",["security_id|string|Permanent security identity","issuer_id|string|Issuer identity","listing_id|string|Exchange relationship","date|date|Observation date","close|decimal|Unadjusted close","observed_at|timestamp|Dataset arrival"]],["CorporateActionRecord",["security_id|string|Affected security","event_type|enum|Bonus, split, dividend, merger","announcement_date|date?|Public announcement","record_date|date?|Eligibility date","effective_date|date?|Economic adjustment date","verification_status|enum|Evidence state"]]].map(([title, fields]) => box(<><div style={{ color: "#38bdf8", fontSize: "11px", fontWeight: 700, fontFamily: '"SF Mono", monospace', marginBottom: "10px" }}>{title as string}</div>{(fields as string[]).map((field) => { const [name, type, description] = field.split("|"); return <div key={name} style={{ display: "grid", gridTemplateColumns: "1.2fr .8fr 2fr", gap: "8px", padding: "7px 0", borderTop: "1px solid rgba(255,255,255,.05)", fontSize: "11px" }}><code style={{ color: "#fff" }}>{name}</code><code style={{ color: "#e2b357" }}>{type}</code><span style={{ color: "#94a3b8" }}>{description}</span></div>; })}</>))}</div></div></section>
    <section style={{ padding: "42px 0 64px" }}><div style={sharedStyles.container}>{box(<div style={{ textAlign: "center" }}><div style={{ color: "#38bdf8", fontSize: "11px", fontWeight: 700, letterSpacing: ".12em", fontFamily: '"SF Mono", monospace', marginBottom: "10px" }}>HISTORICAL INTELLIGENCE LAYER</div><h2 style={{ color: "#fff", fontSize: "clamp(24px,3.5vw,38px)", margin: "0 auto 12px" }}>Build research on history you can actually interrogate.</h2><p style={{ color: "#94a3b8", fontSize: "15px", margin: "0 auto 24px" }}>Explore the historical intelligence layer behind Sensex.money.</p><div style={{ display: "flex", justifyContent: "center", gap: "12px", flexWrap: "wrap" }}><Link to="/research" style={styles.primaryBtn} className="primary-cta-btn">Explore Research <ArrowRight size={14} /></Link><Link to="/tools" style={styles.secondaryBtn}>Explore Tools <ArrowRight size={14} /></Link></div></div>, { borderColor: "rgba(56,189,248,.25)", backgroundColor: "#0d1629", padding: "34px" })}</div></section>
  </main><GlobalFooter /></div>;
};
export const SearchPage = () => <div>Search</div>;
export const About = () => <div>About Sensex.money</div>;

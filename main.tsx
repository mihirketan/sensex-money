import React from "react";
import { createRoot } from "react-dom/client";
import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import "./styles/index.css";

import {
  Home,
  Market,
  Stocks,
  Company,
  History,
  TimeMachine,
  Simulator,
  CorporateActions,
  Events,
  EventDetail,
  Crashes,
  EventStudies,
  Regime,
  Sectors,
  Breadth,
  Sentiment,
  Research,
  Tools,
  ToolDetail,
  Ask,
  Data,
  SearchPage,
  About,
} from "./pages";

const App = () => (
  <BrowserRouter basename={import.meta.env.BASE_URL}>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/market" element={<Market />} />
      <Route path="/stocks" element={<Stocks />} />
      <Route path="/stocks/:symbol" element={<Company />} />
      <Route path="/history" element={<History />} />
      <Route path="/history/sensex" element={<History />} />
      <Route path="/tools" element={<Tools />} />
      <Route path="/tools/time-machine" element={<ToolDetail toolId="time-machine" />} />
      <Route path="/tools/investment-simulator" element={<ToolDetail toolId="investment-simulator" />} />
      <Route path="/tools/company-comparator" element={<ToolDetail toolId="company-comparator" />} />
      <Route path="/tools/crash-atlas" element={<ToolDetail toolId="crash-atlas" />} />
      <Route path="/tools/corporate-actions" element={<ToolDetail toolId="corporate-actions" />} />
      <Route path="/tools/regime-explorer" element={<ToolDetail toolId="regime-explorer" />} />
      <Route path="/tools/sector-rotation" element={<ToolDetail toolId="sector-rotation" />} />
      <Route path="/tools/event-study" element={<ToolDetail toolId="event-study" />} />
      <Route path="/tools/valuation" element={<ToolDetail toolId="valuation" />} />
      <Route path="/tools/drawdowns" element={<ToolDetail toolId="drawdowns" />} />
      <Route path="/tools/rolling-returns" element={<ToolDetail toolId="rolling-returns" />} />
      <Route path="/tools/stock-vs-market" element={<ToolDetail toolId="stock-vs-market" />} />
      <Route path="/tools/sip-vs-lumpsum" element={<ToolDetail toolId="sip-vs-lumpsum" />} />
      <Route path="/tools/portfolio-simulator" element={<ToolDetail toolId="portfolio-simulator" />} />
      <Route path="/tools/corporate-action-returns" element={<ToolDetail toolId="corporate-action-returns" />} />
      <Route path="/tools/question-builder" element={<ToolDetail toolId="question-builder" />} />
      <Route path="/time-machine" element={<ToolDetail toolId="time-machine" />} />
      <Route path="/corporate-actions" element={<ToolDetail toolId="corporate-actions" />} />
      <Route path="/events" element={<Events />} />
      <Route path="/events/:slug" element={<EventDetail />} />
      <Route path="/crashes" element={<ToolDetail toolId="crash-atlas" />} />
      <Route path="/research/event-studies" element={<EventStudies />} />
      <Route path="/market/regime" element={<Regime />} />
      <Route path="/market/sectors" element={<Sectors />} />
      <Route path="/market/breadth" element={<Breadth />} />
      <Route path="/market/sentiment" element={<Sentiment />} />
      <Route path="/research" element={<Research />} />
      <Route path="/ask" element={<Ask />} />
      <Route path="/data" element={<Data />} />
      <Route path="/search" element={<SearchPage />} />
      <Route path="/about" element={<About />} />
      <Route path="*" element={<Home />} />
    </Routes>
  </BrowserRouter>
);

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Link, Route, Routes } from "react-router-dom";

import "@morph-ui/ui/styles.css";

import { HelpPage } from "./routes/help/HelpPage";
import { PrivacyPage } from "./routes/privacy/PrivacyPage";
import { ArticleFixturePage } from "./routes/fixtures/ArticleFixturePage";
import { EcommerceFixturePage } from "./routes/fixtures/EcommerceFixturePage";
import { DashboardFixturePage } from "./routes/fixtures/DashboardFixturePage";
import { DocsFixturePage } from "./routes/fixtures/DocsFixturePage";
import { FormFixturePage } from "./routes/fixtures/FormFixturePage";

function Home() {
  return (
    <div className="mui-shell">
      <header className="mui-header">
        <div>
          <h1>Morph UI local web</h1>
          <p>Docs pages and local fixture screens for extension testing.</p>
        </div>
      </header>
      <main className="mui-main">
        <ul>
          <li><Link to="/privacy">Privacy</Link></li>
          <li><Link to="/help">Help</Link></li>
          <li><Link to="/fixtures/article">Article fixture</Link></li>
          <li><Link to="/fixtures/ecommerce">Ecommerce grid fixture</Link></li>
          <li><Link to="/fixtures/dashboard">Dashboard fixture</Link></li>
          <li><Link to="/fixtures/docs">Docs fixture</Link></li>
          <li><Link to="/fixtures/form">Form-heavy fixture</Link></li>
        </ul>
      </main>
    </div>
  );
}

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/privacy" element={<PrivacyPage />} />
        <Route path="/help" element={<HelpPage />} />
        <Route path="/fixtures/article" element={<ArticleFixturePage />} />
        <Route path="/fixtures/ecommerce" element={<EcommerceFixturePage />} />
        <Route path="/fixtures/dashboard" element={<DashboardFixturePage />} />
        <Route path="/fixtures/docs" element={<DocsFixturePage />} />
        <Route path="/fixtures/form" element={<FormFixturePage />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);

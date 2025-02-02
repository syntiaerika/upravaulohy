import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { IntlProvider } from "react-intl";
import messages from "./translations";
import ShoppingListsOverview from "./ShoppingListsOverview";
import ShoppingListDetail from "./ShoppingListDetail";
import { ThemeProvider, useTheme } from "./theme";
import "./App.css";

const AppContent = ({ locale, setLocale, userRole, setUserRole, useMockData, setUseMockData }) => {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className={`app-container ${theme}`}>
      <header className="app-header">
        <h1 className="app-title">
          <Link to="/">{messages[locale]["shoppingListTitle"]}</Link>
        </h1>
        <div className="controls">
          <button className="tile-button" onClick={toggleTheme}>
            {theme === "light"
              ? `🌙 ${messages[locale]["darkMode"]}`
              : `☀️ ${messages[locale]["lightMode"]}`}
          </button>
          <button className="tile-button" onClick={() => setLocale(locale === "en" ? "sk" : "en")}>
            🌍 {locale === "en" ? "SK" : "EN"}
          </button>
          <button className="tile-button" onClick={() => setUserRole(userRole === "user" ? "owner" : "user")}>
            🔄 {messages[locale]["role"]}: {messages[locale][`role.${userRole}`]}
          </button>
          <button
            className={`tile-button ${useMockData ? "mock-mode" : "api-mode"}`}
            onClick={() => setUseMockData(!useMockData)}
          >
            🔄 {messages[locale]["dataMode"]}: {useMockData ? messages[locale]["mockData"] : messages[locale]["apiData"]}
          </button>
          <span className="data-status">
            {useMockData ? "🟡 Mock Dáta Aktívne" : "🔵 API Dáta Aktívne"}
          </span>
        </div>
      </header>
      <Routes>
        <Route path="/" element={<ShoppingListsOverview userRole={userRole} locale={locale} useMockData={useMockData} />} />
        <Route path="/shopping-list/:id" element={<ShoppingListDetail userRole={userRole} locale={locale} useMockData={useMockData} />} />
      </Routes>
    </div>
  );
};

const App = () => {
  const [locale, setLocale] = useState("en");
  const [userRole, setUserRole] = useState("user");
  const [useMockData, setUseMockData] = useState(false);

  return (
    <ThemeProvider>
      <IntlProvider locale={locale} messages={messages[locale]}>
        <Router>
          <AppContent 
            locale={locale} 
            setLocale={setLocale} 
            userRole={userRole} 
            setUserRole={setUserRole} 
            useMockData={useMockData} 
            setUseMockData={setUseMockData} 
          />
        </Router>
      </IntlProvider>
    </ThemeProvider>
  );
};

export default App;

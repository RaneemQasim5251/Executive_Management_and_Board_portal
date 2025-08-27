import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./utils/cleanWarnings";
import "./i18n";
import "./styles/bi-tokens.css";
import "./styles/bookcase.css";

// Initialize app - let i18next handle language detection completely
console.log("🌍 Initializing Executive Portal...");
if (typeof window !== 'undefined') {
  // Set color mode if not set
  if (!localStorage.getItem('colorMode')) {
    localStorage.setItem('colorMode', 'light');
  }
  
  console.log("✅ App initialization ready - i18next will handle language detection!");
}

console.log("🚀 Executive Portal - Main.tsx loaded!");

const container = document.getElementById("root") as HTMLElement;
console.log("📦 Container found:", container);

const root = createRoot(container);
console.log("🎯 React root created!");

root.render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
);

console.log("✅ App rendered!");
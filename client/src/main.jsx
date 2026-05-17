import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import App from "./App.jsx";
import { ThemeProvider } from "./context/ThemeContext.jsx";
import { TasksProvider } from "./context/TasksContext.jsx";
import ErrorBoundary from "./components/ErrorBoundary.jsx";
import "./index.css";

const root = document.getElementById("root");

if (!root) {
  throw new Error("Root element not found");
}

ReactDOM.createRoot(root).render(
  <ErrorBoundary>
    <BrowserRouter>
      <ThemeProvider>
        <TasksProvider>
          <App />
          <Toaster
            position="bottom-right"
            toastOptions={{
              className: "glass-card !bg-[var(--card)] !text-[var(--text-primary)] !border-[var(--border)]",
              duration: 3000,
            }}
          />
        </TasksProvider>
      </ThemeProvider>
    </BrowserRouter>
  </ErrorBoundary>
);

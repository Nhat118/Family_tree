import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "bootstrap/dist/css/bootstrap.min.css";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { TreeProvider } from "./contexts/TreeContext";

const container = document.getElementById("root");
const root = createRoot(container);
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <TreeProvider>
          <App />
        </TreeProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);

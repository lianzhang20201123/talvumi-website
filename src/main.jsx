import React from "react";
import { createRoot, hydrateRoot } from "react-dom/client";
import { AppPublic } from "./AppPublic.jsx";
import "./styles.css";

const root = document.getElementById("root");
const app = (
  <React.StrictMode>
    <AppPublic />
  </React.StrictMode>
);

if (root.hasChildNodes()) {
  hydrateRoot(root, app);
} else {
  createRoot(root).render(app);
}

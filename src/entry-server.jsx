import React from "react";
import { renderToString } from "react-dom/server";
import { AppPublic } from "./AppPublic.jsx";

export function render() {
  return renderToString(<AppPublic />);
}

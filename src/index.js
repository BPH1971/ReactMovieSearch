// Entry point (Create React App expects src/index.js).
// If you're on React 17 / older react-scripts, swap the createRoot block for:
//   ReactDOM.render(<App />, document.getElementById("root"));
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./styles.css";

const container = document.getElementById("root");
const root = ReactDOM.createRoot(container);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

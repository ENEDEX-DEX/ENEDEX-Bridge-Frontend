import React from "react";
import ReactDOM from "react-dom";
import "./index.scss";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import {  Config, DAppProvider } from "@usedapp/core";
import { ToastContainer } from "react-toastify";

const config: Config = {
  supportedChains: [56, 43114],
  notifications: {
    expirationPeriod: 1000,
    checkInterval: 1000,
  },
};


ReactDOM.render(
  <React.StrictMode>
    <ToastContainer />
    <DAppProvider config={config}>
      <App />
    </DAppProvider>
  </React.StrictMode>,
  document.getElementById("root")
);

reportWebVitals();

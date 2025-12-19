import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { registerMicroApps, start } from "qiankun";
import { BrowserRouter } from "react-router-dom";
const root = ReactDOM.createRoot(document.getElementById("root"));
import request from "../utils/request";

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
request.get("/app/config").then((res) => {
  const { data } = res;
  registerMicroApps(
    data?.map((item) => {
      return {
        name: item.name,
        entry: {
          scripts: item.entry.scripts,
          styles: item.entry.styles,
          html: `<div id="appsub"></div>`,
        },
        container: "#subApp-viewport",
        activeRule: item.activeRule,
      };
    })
  );
  start({
    prefetch: true,
    // sandbox: { strictStyleIsolation: true },
  });
});

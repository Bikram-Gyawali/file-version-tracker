import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { ChakraProvider } from "@chakra-ui/react";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { Analytics } from "@vercel/analytics/react";
import { register } from './App/serviceworker.js';

import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Analytics />

    <ChakraProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
    </ChakraProvider>
  </React.StrictMode>
);

register()
import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { BrowserRouter } from "react-router-dom";
import {
  CssBaseline,
  ThemeProvider,
  createTheme,
  StyledEngineProvider,
} from "@mui/material";

import "./global.css";
import "./marketplace.css";

const muiTheme = createTheme({
  palette: {
    primary: { main: "#542D46", dark: "#402035", light: "#F5E9ED" },
    secondary: { main: "#402035" },
    background: { default: "#FFFCF9", paper: "#FFFFFF" },
    text: { primary: "#302832", secondary: "#706670", disabled: "#887B86" },
    divider: "#E4D9DF",
    success: { main: "#36704E" },
    warning: { main: "#BA8124" },
    error: { main: "#E5484D" },
  },
  typography: { fontFamily: "'Manrope', Arial, sans-serif" },
  shape: { borderRadius: 8 },
});

const container = document.getElementById("root");
const root = createRoot(container);

root.render(
  <BrowserRouter>
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={muiTheme}>
        <CssBaseline />
        <App />
      </ThemeProvider>
    </StyledEngineProvider>
  </BrowserRouter>
);

reportWebVitals();
//

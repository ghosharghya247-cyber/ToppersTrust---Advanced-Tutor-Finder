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

const muiTheme = createTheme({
  palette: {
    primary: { main: "#1769F5", dark: "#0F56D9", light: "#EEF5FF" },
    secondary: { main: "#0F56D9" },
    background: { default: "#FFFFFF", paper: "#FFFFFF" },
    text: { primary: "#0A0A0B", secondary: "#596273", disabled: "#8A93A3" },
    divider: "#E3E7ED",
    success: { main: "#16A36A" },
    warning: { main: "#F5A623" },
    error: { main: "#E5484D" },
  },
  typography: { fontFamily: "'DM Sans', Arial, sans-serif" },
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

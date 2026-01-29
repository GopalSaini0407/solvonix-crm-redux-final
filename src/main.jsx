import React from "react"
import ReactDOM from "react-dom/client"
import { Provider } from "react-redux"

import App from "./App"
import { store } from "./app/store"
import { ThemeProvider } from "./context/theme.context"
import { ModalProvider } from "./context/ModalContext"
// Global CSS
import "./styles/index.css"
import "./styles/themes.css"
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
      <ThemeProvider>
      <ModalProvider>
      <App />
      </ModalProvider>
      </ThemeProvider>
    </Provider>
  </React.StrictMode>
)

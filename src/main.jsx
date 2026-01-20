import React from "react"
import ReactDOM from "react-dom/client"
import { Provider } from "react-redux"

import App from "./App"
import { store } from "./app/store"

import { ModalProvider } from "./context/ModalContext"
// Global CSS
import "./styles/index.css"

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
      <ModalProvider>
      <App />
      </ModalProvider>
    </Provider>
  </React.StrictMode>
)

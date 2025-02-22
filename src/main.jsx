import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { Provider } from "react-redux";
import { store } from "./redux/store";
import { AlertProvider } from "./context/AlertContext"; 

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <AlertProvider> 
        <App />
      </AlertProvider>
    </Provider>
  </StrictMode>
);

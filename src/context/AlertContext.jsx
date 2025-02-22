import { createContext, useContext, useState } from "react";
import AlertPopup from "../components/AlertPopup"; // Import the AlertPopup component

const AlertContext = createContext();

export const AlertProvider = ({ children }) => {
  const [alerts, setAlerts] = useState([]);

  const showAlert = (message, type) => {
    const id = Date.now(); // Unique ID for each alert
    setAlerts((prevAlerts) => [...prevAlerts, { id, message, type }]);

    // Automatically remove the alert after 2 seconds
    setTimeout(() => {
      setAlerts((prevAlerts) => prevAlerts.filter((alert) => alert.id !== id));
    }, 5000);
  };

  return (
    <AlertContext.Provider value={{ showAlert }}>
      {children}
      <div className="fixed top-4 left-4 flex flex-col gap-2 z-50">
        {alerts.map((alert) => (
          <AlertPopup key={alert.id} message={alert.message} type={alert.type} />
        ))}
      </div>
    </AlertContext.Provider>
  );
};

export const useAlert = () => useContext(AlertContext);

import PropTypes from "prop-types";
import { useState } from "react";
import { AlertContext } from "./alertContext";
import AlertPopup from "../components/AlertPopup";

export const AlertProvider = ({ children }) => {
  const [alerts, setAlerts] = useState([]);

  const showAlert = (message, type) => {
    const id = Date.now();
    setAlerts((prevAlerts) => [...prevAlerts, { id, message, type }]);

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

AlertProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

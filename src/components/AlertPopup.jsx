
import { CiCircleCheck,CiCircleAlert  } from "react-icons/ci";
import { IoIosCloseCircleOutline } from "react-icons/io";

const AlertPopup = ({ message, type }) => {
  const typeStyles = {
    success: "bg-green-100 border-green-500 text-green-700",
    warning: "bg-orange-100 border-orange-500 text-orange-700",
    failed: "bg-red-100 border-red-500 text-red-700",
  };

  const icons = {
    success: <CiCircleCheck className="text-green-500 w-5 h-5" />,
    warning: <CiCircleAlert  className="text-orange-500 w-5 h-5" />,
    failed: <IoIosCloseCircleOutline className="text-red-500 w-5 h-5" />,
  };

  return (
    <div className={`flex items-center gap-2 p-3 border-l-4 shadow-lg rounded-md ${typeStyles[type]}`}>
      {icons[type]}
      <span className="text-sm font-medium">{message}</span>
    </div>
  );
};

export default AlertPopup;

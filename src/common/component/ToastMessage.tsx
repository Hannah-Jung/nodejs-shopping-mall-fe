import { useEffect } from "react";
import { useAppSelector } from "../../features/hooks";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ToastMessage = () => {
  const { toastMessage } = useAppSelector((state) => state.ui);

  useEffect(() => {
    if (toastMessage) {
      const { message, status } = toastMessage;
      if (message !== "" && status !== "") {
        const options = { theme: "colored" as const };
        if (status === "success") {
          toast.success(message, options);
        } else if (status === "error") {
          toast.error(message, options);
        } else if (status === "warning") {
          toast.warning(message, options);
        } else {
          toast(message, options);
        }
      }
    }
  }, [toastMessage]);

  return (
    <ToastContainer
      position="top-right"
      autoClose={3000}
      hideProgressBar={false}
      newestOnTop={false}
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
      theme="light"
    />
  );
};

export default ToastMessage;

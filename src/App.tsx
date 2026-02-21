import { useEffect } from "react";
import "./App.css";
import "./common/style/common.style.css";
import AppLayout from "./Layout/AppLayout";
import AppRouter from "./routes/AppRouter";
import { themeColors } from "@/theme/colors";
import { useAppDispatch } from "./features/hooks";
import { loginWithToken } from "./features/user/userSlice";
import ScrollToTop from "./common/component/ScrollToTop";

const root = document.documentElement;
root.style.setProperty("--primary", themeColors.primary);
root.style.setProperty("--primary-foreground", themeColors.primaryForeground);

function App() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const token = sessionStorage.getItem("token");
    if (token) {
      dispatch(loginWithToken());
    }
  }, [dispatch]);

  return (
    <div>
      <ScrollToTop />
      <AppLayout>
        <AppRouter />
      </AppLayout>
    </div>
  );
}

export default App;

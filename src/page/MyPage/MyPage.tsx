import { useEffect, useState } from "react";
import MyOrders from "./component/MyOrders";
import MyProfile from "./component/MyProfile";
import { cn } from "@/lib/utils";
import { useLocation } from "react-router-dom";

const MyPage = () => {
  const location = useLocation();

  const [activeTab, setActiveTab] = useState<"orders" | "profile">(
    location.state?.tab || "orders",
  );

  useEffect(() => {
    if (location.state?.tab) {
      setActiveTab(location.state.tab);
    }
  }, [location.state]);

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-2xl font-black mb-10 tracking-tight uppercase">
        My Account
      </h1>

      <div className="flex gap-8 border-b border-zinc-100 mb-10">
        <button
          onClick={() => setActiveTab("orders")}
          className={cn(
            "pb-4 text-xs font-black uppercase tracking-widest transition-all cursor-pointer",
            activeTab === "orders"
              ? "border-b-2 border-black text-black"
              : "text-zinc-400",
          )}
        >
          My Orders
        </button>
        <button
          onClick={() => setActiveTab("profile")}
          className={cn(
            "pb-4 text-xs font-black uppercase tracking-widest transition-all cursor-pointer",
            activeTab === "profile"
              ? "border-b-2 border-black text-black"
              : "text-zinc-400",
          )}
        >
          My Profile
        </button>
      </div>

      <div className="animate-in fade-in duration-500">
        {activeTab === "orders" ? <MyOrders /> : <MyProfile />}
      </div>
    </div>
  );
};

export default MyPage;

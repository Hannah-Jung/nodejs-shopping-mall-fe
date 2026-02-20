import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { LayoutDashboard, Soup, ReceiptText, Utensils } from "lucide-react";

const Sidebar = () => {
  const navigate = useNavigate();
  const [show, setShow] = useState(false);

  const handleSelectMenu = (url: string) => {
    setShow(false);
    navigate(url);
  };

  const NavbarContent = () => (
    <div>
      <ul className="sidebar-area">
        <li
          className="sidebar-item group flex items-center gap-3 cursor-pointer"
          onClick={() => handleSelectMenu("/admin/dashboard")}
        >
          <LayoutDashboard className="size-4 shrink-0 text-muted-foreground transition-colors duration-300 group-hover:text-primary" />
          DASHBOARD
        </li>
        <li
          className="sidebar-item group flex items-center gap-3 cursor-pointer"
          onClick={() => handleSelectMenu("/admin/product?page=1")}
        >
          <Soup className="size-4 shrink-0 text-muted-foreground transition-colors duration-300 group-hover:text-primary" />
          PRODUCT
        </li>
        <li
          className="sidebar-item group flex items-center gap-3 cursor-pointer"
          onClick={() => handleSelectMenu("/admin/order?page=1")}
        >
          <ReceiptText className="size-4 shrink-0 text-muted-foreground transition-colors duration-300 group-hover:text-primary" />
          ORDER
        </li>
      </ul>
    </div>
  );

  return (
    <>
      <div className="sidebar-toggle">{NavbarContent()}</div>
      <div className="mobile-sidebar-toggle flex items-center gap-2 bg-[rgb(248,249,250)] px-3 py-2">
        <button
          type="button"
          className="p-2 cursor-pointer"
          aria-label="Open Menu"
          aria-controls="offcanvasNavbar-expand"
          onClick={() => setShow(true)}
        >
          <span className="block h-0.5 w-6 bg-current" aria-hidden />
          <span className="block h-0.5 w-6 bg-current mt-1" aria-hidden />
          <span className="block h-0.5 w-6 bg-current mt-1" aria-hidden />
        </button>
      </div>

      {show && (
        <div
          className="fixed inset-0 z-40 bg-black/50"
          aria-hidden
          onClick={() => setShow(false)}
        />
      )}

      <div
        id="offcanvasNavbar-expand"
        role="dialog"
        aria-modal="true"
        aria-labelledby="offcanvasNavbarLabel-expand"
        className={`fixed top-0 left-0 z-50 h-full w-fit min-w-[200px] bg-[rgb(248,249,250)] shadow-xl transition-transform duration-300 ease-out ${
          show ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b border-gray-200 px-4 py-3">
          <span
            id="offcanvasNavbarLabel-expand"
            className="font-semibold flex items-center gap-2 text-primary"
          >
            <Utensils className="size-5" strokeWidth={2} />
            PREPT
          </span>
          <button
            type="button"
            className="text-2xl leading-none cursor-pointer"
            aria-label="Close"
            onClick={() => setShow(false)}
          >
            &times;
          </button>
        </div>
        <div className="sidebar p-5">{NavbarContent()}</div>
      </div>
    </>
  );
};

export default Sidebar;

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Sidebar = () => {
  const navigate = useNavigate();
  const [show, setShow] = useState(false);

  const handleSelectMenu = (url: string) => {
    setShow(false);
    navigate(url);
  };

  const NavbarContent = () => (
    <div>
      <div className="sidebar-item">Admin Account</div>
      <ul className="sidebar-area">
        <li
          className="sidebar-item"
          onClick={() => handleSelectMenu("/admin/product?page=1")}
        >
          Product
        </li>
        <li
          className="sidebar-item"
          onClick={() => handleSelectMenu("/admin/order?page=1")}
        >
          Order
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
          className="rounded border border-gray-300 p-2"
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
        className={`fixed top-0 left-0 z-50 h-full w-[300px] max-w-[85vw] bg-[rgb(248,249,250)] shadow-xl transition-transform duration-300 ease-out ${
          show ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b border-gray-200 px-4 py-3">
          <span id="offcanvasNavbarLabel-expand" className="font-semibold">
            Menu
          </span>
          <button
            type="button"
            className="text-2xl leading-none"
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

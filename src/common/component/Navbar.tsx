import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-regular-svg-icons";
import {
  faBars,
  faBox,
  faSearch,
  faShoppingBag,
  faUser as faUserSolid,
} from "@fortawesome/free-solid-svg-icons";
import { Utensils } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { logoutThunk } from "../../features/user/userSlice";
import { useAppDispatch, useAppSelector } from "../../features/hooks";
import type { User } from "@/types/user";

interface NavbarProps {
  user: User | null;
}

const Navbar = ({ user }: NavbarProps) => {
  const dispatch = useAppDispatch();
  const { cartItemCount } = useAppSelector((state) => state.cart);
  const isMobile = window.navigator.userAgent.indexOf("Mobile") !== -1;
  const [showSearchBox, setShowSearchBox] = useState(false);
  const [width, setWidth] = useState(0);
  const navigate = useNavigate();
  const menuList = [
    "Costco",
    "Sam's Club",
    "Whole Foods Market",
    "Trader Joe's",
    "Target",
    "Walmart",
  ];

  const onCheckEnter = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      const value = (event.target as HTMLInputElement).value;
      if (value === "") {
        navigate("/");
        return;
      }
      navigate(`?name=${value}`);
    }
  };

  const handleLogout = () => {
    dispatch(logoutThunk());
    navigate("/login");
  };

  return (
    <div>
      {showSearchBox && (
        <div className="display-space-between mobile-search-box w-100">
          <div className="search display-space-between w-100">
            <div>
              <FontAwesomeIcon className="search-icon" icon={faSearch} />
              <input
                type="text"
                placeholder="제품검색"
                onKeyDown={onCheckEnter}
              />
            </div>
            <button
              className="closebtn"
              onClick={() => setShowSearchBox(false)}
            >
              &times;
            </button>
          </div>
        </div>
        // )}
        // <div className="side-menu" style={{ width }}>
        //   <button className="closebtn" onClick={() => setWidth(0)}>
        //     &times;
        //   </button>
      )}
      {width > 0 && (
        <div
          className="side-menu-overlay"
          aria-hidden="true"
          onClick={() => setWidth(0)}
        />
      )}
      <div className="side-menu" style={{ width }}>
        <button className="closebtn" onClick={() => setWidth(0)}>
          &times;
        </button>
        <div className="side-menu-list" id="menu-list">
          {menuList.map((menu, index) => (
            <button key={index}>{menu}</button>
          ))}
        </div>
      </div>
      {user?.level === "admin" && (
        <Link to="/admin/product?page=1" className="link-area">
          Admin page
        </Link>
      )}
      <div className="nav-header">
        <div className="burger-menu hide">
          <FontAwesomeIcon icon={faBars} onClick={() => setWidth(250)} />
        </div>
        <div>
          <div className="display-flex">
            {user ? (
              <div onClick={handleLogout} className="nav-icon">
                <FontAwesomeIcon icon={faUserSolid} />
                {!isMobile && (
                  <span style={{ cursor: "pointer" }}>로그아웃</span>
                )}
              </div>
            ) : (
              <div onClick={() => navigate("/login")} className="nav-icon">
                <FontAwesomeIcon icon={faUser} />
                {!isMobile && <span style={{ cursor: "pointer" }}>로그인</span>}
              </div>
            )}
            <div onClick={() => navigate("/cart")} className="nav-icon">
              <FontAwesomeIcon icon={faShoppingBag} />
              {!isMobile && (
                <span style={{ cursor: "pointer" }}>{`쇼핑백(${
                  cartItemCount ?? 0
                })`}</span>
              )}
            </div>
            <div
              onClick={() => navigate("/account/purchase")}
              className="nav-icon"
            >
              <FontAwesomeIcon icon={faBox} />
              {!isMobile && <span style={{ cursor: "pointer" }}>내 주문</span>}
            </div>
            {isMobile && (
              <div className="nav-icon" onClick={() => setShowSearchBox(true)}>
                <FontAwesomeIcon icon={faSearch} />
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="nav-logo">
        <Link to="/" className="nav-logo-link">
          <div className="nav-logo-icon-wrap">
            <Utensils size={32} color="white" strokeWidth={2.75} />
          </div>
          <span className="nav-logo-text">PREPT</span>
        </Link>
      </div>
      <div className="nav-menu-area">
        <ul className="menu">
          {menuList.map((menu, index) => (
            <li key={index}>
              <a href="#">{menu}</a>
            </li>
          ))}
        </ul>
        {!isMobile && (
          <div className="search-box landing-search-box ">
            <FontAwesomeIcon icon={faSearch} />
            <input
              type="text"
              placeholder="제품검색"
              onKeyDown={onCheckEnter}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;

import { useState, useRef, useEffect } from "react";
import {
  Heart,
  LogOut,
  Package,
  Search,
  Settings,
  ShoppingCart,
  User as UserIcon,
  Utensils,
  X,
} from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Link,
  useLocation,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import { logoutThunk } from "../../features/user/userSlice";
import { useAppDispatch, useAppSelector } from "../../features/hooks";
import type { User } from "@/types/user";
import { logoutCart } from "@/features/cart/cartSlice";
import { motion, AnimatePresence } from "framer-motion";

interface NavbarProps {
  user: User | null;
}

const Navbar = ({ user }: NavbarProps) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [query] = useSearchParams();
  const { cartItemCount } = useAppSelector((state) => state.cart);
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);
  const [searchTerm, setSearchTerm] = useState(query.get("name") ?? "");
  const location = useLocation();
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setIsSearchExpanded(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    setSearchTerm(query.get("name") ?? "");
  }, [query]);

  const wishlistCount = 0;

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
    dispatch(logoutCart());
    setProfileOpen(false);
    navigate("/login");
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        profileRef.current &&
        !profileRef.current.contains(e.target as Node)
      ) {
        setProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const isAdminPath = location.pathname.startsWith("/admin");
  const isAdmin = user?.role === "admin";

  return (
    <header
      className={`sticky top-0 z-50 flex items-center justify-between gap-4 border-b px-6 py-3 ${
        isAdmin
          ? "border-black bg-black"
          : "border-border bg-primary-foreground"
      }`}
    >
      <Link
        to="/"
        className="flex items-center gap-2 font-medium text-xl cursor-pointer text-primary  transition-opacity"
        aria-label="PREPT"
      >
        <Utensils
          className="size-5"
          strokeWidth={2}
          strokeLinecap="square"
          strokeLinejoin="miter"
        />
        <span>PREPT</span>
      </Link>
      {!isAdminPath && (
        <div
          ref={searchRef}
          className={`
          ${
            isSearchExpanded
              ? `absolute inset-x-0 mx-0 px-6 h-full flex items-center z-50 animate-in fade-in slide-in-from-top-1 duration-300 ${isAdmin ? "bg-black" : "bg-primary-foreground"}`
              : "hidden md:flex flex-1 max-w-2xl mx-4"
          } 
          transition-all duration-300 md:static md:flex-1 md:mx-4 md:bg-transparent
        `}
        >
          <div
            className={`group flex items-center gap-2 rounded-md border px-4 py-2.5 transition-all duration-500 ease-out w-full
            ${
              isAdmin
                ? "border-white/20 bg-white/10 focus-within:border-primary/75 focus-within:bg-white/20"
                : "border-input bg-muted/30 focus-within:border-primary/75 focus-within:bg-background"
            }
          `}
          >
            <Search
              className={`size-4 shrink-0 transition-colors duration-300 group-focus-within:text-primary ${isAdmin ? "text-white/70" : "text-muted-foreground"}`}
            />

            <input
              type="text"
              placeholder="SEARCH"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`w-full bg-transparent text-sm outline-none transition-colors ${
                isAdmin
                  ? "text-white placeholder:text-white/40"
                  : "text-foreground placeholder:text-muted-foreground"
              }`}
              onKeyDown={onCheckEnter}
              autoFocus={isSearchExpanded}
            />

            {(isSearchExpanded || (searchTerm && !isAdminPath)) && (
              <button
                className={`transition-colors ${isAdmin ? "text-white/70 hover:text-white" : "text-muted-foreground hover:text-primary"}`}
                onClick={() => {
                  if (isSearchExpanded) {
                    setIsSearchExpanded(false);
                  } else {
                    setSearchTerm("");
                  }
                }}
              >
                <X className="size-4" />
              </button>
            )}
          </div>
        </div>
      )}

      <div className="flex items-center gap-1">
        {!isAdminPath && !isSearchExpanded && (
          <button
            type="button"
            onClick={() => setIsSearchExpanded(true)}
            className={`p-2 rounded-full transition-colors md:hidden ${
              isAdmin ? "hover:bg-white/10" : "hover:bg-muted"
            }`}
            aria-label="Search"
          >
            <Search className={`size-5 ${isAdmin ? "text-white" : ""}`} />
          </button>
        )}
        <button
          type="button"
          onClick={() => {}}
          className={`relative p-2 rounded-full transition-colors ${
            isAdmin ? "hover:bg-white/10" : "hover:bg-muted"
          }`}
          aria-label="Wishlist"
        >
          <Heart
            className={`size-5 ${isAdmin ? "text-white" : ""}`}
            strokeLinecap="square"
            strokeLinejoin="miter"
          />
          {wishlistCount >= 1 && (
            <span
              className="absolute -top-0.5 -right-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-semibold text-primary-foreground"
              aria-label={`Wishlist ${wishlistCount}`}
            >
              {wishlistCount > 99 ? "99+" : wishlistCount}
            </span>
          )}
        </button>
        <Link
          to="/cart"
          className={`relative p-2 rounded-full transition-colors ${
            isAdmin ? "hover:bg-white/10" : "hover:bg-muted"
          }`}
          aria-label="Cart"
        >
          <ShoppingCart
            className={`size-5 ${isAdmin ? "text-white" : ""}`}
            strokeLinecap="square"
            strokeLinejoin="miter"
          />

          <AnimatePresence mode="popLayout">
            {cartItemCount >= 1 && (
              <motion.span
                key={cartItemCount}
                initial={{ scale: 0.6, opacity: 0 }}
                animate={{ scale: [1.4, 0.8, 1], opacity: 1 }}
                exit={{ scale: 0.6, opacity: 0 }}
                transition={{
                  duration: 0.3,
                  ease: "backOut",
                }}
                className="absolute -top-0.5 -right-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-semibold text-primary-foreground"
              >
                {cartItemCount > 99 ? "99+" : cartItemCount}
              </motion.span>
            )}
          </AnimatePresence>
        </Link>

        <div className="relative" ref={profileRef}>
          <button
            type="button"
            onClick={() => setProfileOpen((o) => !o)}
            className={`flex items-center gap-1 p-2 rounded-full transition-colors ${
              isAdmin ? "hover:bg-white/25" : "hover:bg-muted"
            }`}
            aria-label={user ? "Profile menu" : "Log in or sign up"}
            aria-expanded={profileOpen}
          >
            {user ? (
              <Avatar className="h-8 w-8 border-2 border-primary text-primary">
                <AvatarFallback
                  className={`bg-transparent font-semibold ${isAdmin ? "text-primary" : ""}`}
                >
                  {user.firstName.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            ) : (
              <UserIcon className="size-5" />
            )}
          </button>
          <div
            className={`absolute right-0 top-full mt-1 rounded-md border border-border bg-popover py-1 shadow-md z-50 transition-all duration-300 ease-out origin-top-right ${
              profileOpen
                ? "opacity-100 scale-100 pointer-events-auto"
                : "opacity-0 scale-95 pointer-events-none"
            }`}
            style={{ minWidth: "7rem", width: "max-content" }}
          >
            {user ? (
              <>
                {user?.role === "admin" && (
                  <Link
                    to="/admin/dashboard"
                    className="group uppercase flex min-h-[2.25rem] items-center gap-3 px-4 py-2 text-sm transition-colors duration-300 hover:bg-muted"
                    onClick={() => setProfileOpen(false)}
                  >
                    <Settings className="size-4 shrink-0 text-muted-foreground transition-colors duration-300 group-hover:text-primary" />
                    Dashboard
                  </Link>
                )}
                <div className="border-t border-border" />
                <Link
                  to="/account/purchase"
                  state={{ tab: "profile" }}
                  className="group uppercase flex min-h-[2.25rem] items-center gap-3 px-4 py-2 text-sm transition-colors duration-300 hover:bg-muted"
                  onClick={() => setProfileOpen(false)}
                >
                  <UserIcon className="size-4 shrink-0 text-muted-foreground transition-colors duration-300 group-hover:text-primary" />
                  {user.firstName}
                </Link>
                <Link
                  to="/account/purchase"
                  state={{ tab: "orders" }}
                  className="group flex uppercase min-h-[2.25rem] items-center gap-3 px-4 py-2 text-sm transition-colors duration-300 hover:bg-muted"
                  onClick={() => setProfileOpen(false)}
                >
                  <Package className="size-4 shrink-0 text-muted-foreground transition-colors duration-300 group-hover:text-primary" />
                  My Orders
                </Link>
                <div className="border-t border-border" />
                <button
                  type="button"
                  className="group flex uppercase w-full min-h-[2.25rem] cursor-pointer items-center gap-3 px-4 py-2 text-sm transition-colors duration-300 hover:bg-muted"
                  onClick={handleLogout}
                >
                  <LogOut className="size-4 shrink-0 text-muted-foreground transition-colors duration-300 group-hover:text-primary" />
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="block uppercase px-4 py-2 text-sm hover:bg-muted"
                  onClick={() => setProfileOpen(false)}
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="block uppercase px-4 py-2 text-sm hover:bg-muted"
                  onClick={() => setProfileOpen(false)}
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;

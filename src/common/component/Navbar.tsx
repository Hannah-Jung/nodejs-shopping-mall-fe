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
        className="flex items-center gap-2 font-medium text-xl cursor-pointer text-primary hover:opacity-90 transition-opacity"
        aria-label="PREPT"
      >
        <Utensils className="size-5" strokeWidth={2} />
        <span>PREPT</span>
      </Link>

      {!isAdminPath && (
        <div className="flex-1 max-w-2xl mx-4">
          <div
            className={`group flex items-center gap-2 rounded-md border px-4 py-2.5 transition-all duration-500 ease-out ${
              isAdmin
                ? "border-black bg-muted/30 focus-within:border-primary/75"
                : "border-input bg-muted/30 focus-within:border-primary/75"
            }`}
          >
            <Search
              className={`size-4 shrink-0 transition-colors duration-300 ${
                isAdmin
                  ? "text-gray-400 group-focus-within:text-primary"
                  : "text-muted-foreground group-focus-within:text-primary"
              }`}
            />
            <input
              type="text"
              placeholder="Search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`w-full bg-transparent text-sm outline-none ${
                isAdmin
                  ? "placeholder:text-gray-400 text-white"
                  : "placeholder:text-muted-foreground"
              }`}
              onKeyDown={onCheckEnter}
            />
            {searchTerm && (
              <button
                type="button"
                onClick={() => {
                  setSearchTerm("");
                  navigate("/");
                }}
                className={`transition-colors ${
                  isAdmin
                    ? "text-gray-400 hover:text-white"
                    : "text-muted-foreground hover:text-primary"
                }`}
              >
                <X className="size-4" />
              </button>
            )}
          </div>
        </div>
      )}

      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={() => {}}
          className={`relative p-2 rounded-full transition-colors ${
            isAdmin ? "hover:bg-white/10" : "hover:bg-muted"
          }`}
          aria-label="Wishlist"
        >
          <Heart className={`size-5 ${isAdmin ? "text-white" : ""}`} />
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
          <ShoppingCart className={`size-5 ${isAdmin ? "text-white" : ""}`} />
          {cartItemCount >= 1 && (
            <span
              className="absolute -top-0.5 -right-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-semibold text-primary-foreground"
              aria-label={`Cart ${cartItemCount}`}
            >
              {cartItemCount > 99 ? "99+" : cartItemCount}
            </span>
          )}
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
                    className="group flex min-h-[2.25rem] items-center gap-3 px-4 py-2 text-sm transition-colors duration-300 hover:bg-muted"
                    onClick={() => setProfileOpen(false)}
                  >
                    <Settings className="size-4 shrink-0 text-muted-foreground transition-colors duration-300 group-hover:text-primary" />
                    Dashboard
                  </Link>
                )}
                <div className="border-t border-border" />
                <Link
                  to="/account/purchase"
                  className="group flex min-h-[2.25rem] items-center gap-3 px-4 py-2 text-sm transition-colors duration-300 hover:bg-muted"
                  onClick={() => setProfileOpen(false)}
                >
                  <UserIcon className="size-4 shrink-0 text-muted-foreground transition-colors duration-300 group-hover:text-primary" />
                  {user.firstName}
                </Link>
                <Link
                  to="/account/purchase"
                  className="group flex min-h-[2.25rem] items-center gap-3 px-4 py-2 text-sm transition-colors duration-300 hover:bg-muted"
                  onClick={() => setProfileOpen(false)}
                >
                  <Package className="size-4 shrink-0 text-muted-foreground transition-colors duration-300 group-hover:text-primary" />
                  My Orders
                </Link>
                <div className="border-t border-border" />
                <button
                  type="button"
                  className="group flex w-full min-h-[2.25rem] cursor-pointer items-center gap-3 px-4 py-2 text-sm transition-colors duration-300 hover:bg-muted"
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
                  className="block px-4 py-2 text-sm hover:bg-muted"
                  onClick={() => setProfileOpen(false)}
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="block px-4 py-2 text-sm hover:bg-muted"
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

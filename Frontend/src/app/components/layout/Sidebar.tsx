import React from "react";
import {
  LayoutDashboard,
  FilePlus2,
  Users,
  Package,
  History,
  ShoppingCart,
  Settings,
  ChevronLeft,
  ChevronRight,
  LogOut,
  UserCircle2
} from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

interface Props {
  collapsed: boolean;
  setCollapsed: (v: boolean) => void;
}

const menu = [
  { name: "Dashboard", icon: LayoutDashboard, path: "/dashboard" },
  { name: "New Invoice", icon: FilePlus2, path: "/new-invoice" },
  { name: "Clients", icon: Users, path: "/clients" },
  { name: "Item List", icon: Package, path: "/items" },
  { name: "History", icon: History, path: "/history" },
  { name: "Orders", icon: ShoppingCart, path: "/orders" },
  { name: "Settings", icon: Settings, path: "/settings" },
];

export const Sidebar: React.FC<Props> = ({ collapsed, setCollapsed }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const initials =
    user?.name
      ?.split(" ")
      .map((n: string) => n[0])
      .join("")
      .toUpperCase() || "U";

  return (
    <div
      className={`h-screen fixed left-0 top-0 z-40 bg-white border-r transition-all duration-300 flex flex-col
      ${collapsed ? "w-20" : "w-64"}`}
    >

      {/* ---------- LOGO ---------- */}
      <div className="flex items-center justify-between px-4 h-16 border-b shrink-0">
        {!collapsed && (
          <div className="flex items-center gap-2">
            <span className="font-semibold text-lg tracking-tight">
              Invoice Creator
            </span>
          </div>
        )}

        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-1 rounded-lg hover:bg-gray-100"
        >
          {collapsed ? <ChevronRight /> : <ChevronLeft />}
        </button>
      </div>

      {/* ---------- MENU ---------- */}
      <nav className="mt-6 space-y-1 px-2 flex-1">
        {menu.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-3 rounded-xl transition-all
                ${isActive
                  ? "bg-orange-500 text-white shadow-md"
                  : "text-gray-600 hover:bg-orange-50 hover:text-orange-500"}`
              }
            >
              <Icon className="w-5 h-5" />
              {!collapsed && <span className="font-medium">{item.name}</span>}
            </NavLink>
          );
        })}
      </nav>

      {/* ---------- USER ACCOUNT PANEL ---------- */}
      <div className="border-t p-3 shrink-0">

        {/* USER INFO */}
        <div
          className={`flex items-center gap-3 p-2 rounded-xl transition
          hover:bg-gray-100`}
        >
          <div className="w-10 h-10 rounded-full bg-orange-500 text-white flex items-center justify-center font-semibold">
            {collapsed ? <UserCircle2 /> : initials}
          </div>

          {!collapsed && (
            <div className="flex-1 overflow-hidden">
              <p className="font-medium truncate">
                {user?.name || "User"}
              </p>
              <p className="text-xs text-gray-500 truncate">
                {user?.email}
              </p>
            </div>
          )}
        </div>

        {/* LOGOUT BUTTON */}
        <button
          onClick={handleLogout}
          className={`mt-3 w-full flex items-center gap-3 px-3 py-3 rounded-xl transition
          text-gray-600 hover:text-red-600 hover:bg-red-50`}
        >
          <LogOut className="w-5 h-5" />
          {!collapsed && <span className="font-medium">Logout</span>}
        </button>

      </div>
    </div>
  );
};

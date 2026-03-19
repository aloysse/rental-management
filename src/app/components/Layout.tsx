import { Link, useLocation, Outlet, useNavigate } from "react-router";
import { useVersion } from "../context/VersionContext";
import {
  Users, Building2, Home, Star, Zap, ChevronDown, Key
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

const navItems = [
  { label: "委託出租物件", icon: Home, path: "/properties" },
  { label: "出租人", icon: Building2, path: "/landlords" },
  { label: "承租人", icon: Users, path: "/tenants" },
  { label: "出租中物件", icon: Key, path: "/active-rentals" },
];

export function Layout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { isUpgrade, setIsUpgrade } = useVersion();

  const currentNavItem = navItems.find(item => location.pathname.startsWith(item.path));

  return (
    <div className="flex flex-col h-screen bg-gray-100 font-sans">
      {/* Top Navbar */}
      <header className="bg-white border-b border-gray-200 px-6 py-2 flex items-center justify-between">
        {/* Left: Logo */}
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-gray-800 rounded flex items-center justify-center">
            <Home size={14} className="text-white" />
          </div>
          <span className="text-gray-800 text-sm font-semibold tracking-wide">租賃管理系統</span>
        </div>

        {/* Center: 租賃 Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-2 px-4 py-2 rounded text-sm bg-gray-800 text-white hover:bg-gray-700 transition-colors">
              <Home size={16} />
              <span>租賃</span>
              <ChevronDown size={14} />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="center" className="w-40">
            {navItems.map((item) => {
              const active = location.pathname.startsWith(item.path);
              return (
                <DropdownMenuItem
                  key={item.path}
                  onClick={() => navigate(item.path)}
                  className={`flex items-center gap-2 cursor-pointer ${
                    active ? "bg-gray-100 font-medium" : ""
                  }`}
                >
                  <item.icon size={16} />
                  <span>{item.label}</span>
                </DropdownMenuItem>
              );
            })}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Right: Version Toggle */}
        <div className="flex items-center">
          <div className="flex rounded border border-gray-300 overflow-hidden text-xs">
            <button
              onClick={() => setIsUpgrade(false)}
              className={`px-3 py-1.5 flex items-center gap-1 transition-colors ${
                !isUpgrade ? "bg-gray-800 text-white" : "bg-white text-gray-500 hover:bg-gray-50"
              }`}
            >
              <Star size={11} />
              一般版
            </button>
            <button
              onClick={() => setIsUpgrade(true)}
              className={`px-3 py-1.5 flex items-center gap-1 transition-colors ${
                isUpgrade ? "bg-amber-500 text-white" : "bg-white text-gray-500 hover:bg-gray-50"
              }`}
            >
              <Zap size={11} />
              升級版
            </button>
          </div>
        </div>
      </header>

      {/* Page content */}
      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
}

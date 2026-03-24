import { useLocation, Outlet, useNavigate } from "react-router";
import { Users, Building2, Home, Key } from "lucide-react";

const navItems = [
  { label: "業者資料", icon: Building2, path: "/operator-profile" },
  { label: "出租人", icon: Building2, path: "/landlords" },
  { label: "承租人", icon: Users, path: "/tenants" },
  { label: "委託出租物件", icon: Home, path: "/properties" },
  { label: "出租中物件", icon: Key, path: "/active-rentals" },
];

export function Layout() {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <div className="flex flex-col h-screen bg-gray-50 font-sans">
      {/* Top Navbar */}
      <header className="bg-brand h-14 px-6 flex items-stretch justify-between flex-shrink-0 shadow-sm">
        {/* Left: Logo */}
        <div className="flex items-center gap-2.5 mr-8">
          <div className="w-7 h-7 border border-white/40 rounded flex items-center justify-center">
            <Home size={15} className="text-white" />
          </div>
          <span className="text-white text-sm font-semibold tracking-wide whitespace-nowrap">
            租賃管理系統
          </span>
        </div>

        {/* Center: Horizontal Nav Items */}
        <nav className="flex items-stretch flex-1">
          {navItems.map((item) => {
            const active = location.pathname.startsWith(item.path);
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`relative flex items-center gap-1.5 px-4 text-sm transition-colors ${
                  active
                    ? "text-white bg-white/20"
                    : "text-white/75 hover:text-white hover:bg-white/10"
                }`}
              >
                <item.icon size={15} />
                <span>{item.label}</span>
                {active && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-white rounded-t" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Right: User Avatar */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center text-white text-xs font-semibold cursor-pointer select-none">
            管
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

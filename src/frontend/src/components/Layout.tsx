import { Button } from "@/components/ui/button";
import {
  Activity,
  Bell,
  CheckCircle,
  ChevronRight,
  ClipboardList,
  Database,
  DollarSign,
  FileCheck,
  FlaskConical,
  LayoutDashboard,
  List,
  Lock,
  LogOut,
  Map as MapIcon,
  RotateCcw,
  Search,
  ShoppingCart,
  Target,
  TestTube2,
  Upload,
  Users,
  XCircle,
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { useBlockedSamples } from "../contexts/BlockedSamplesContext";

interface LayoutProps {
  children: React.ReactNode;
  activePage: string;
  onNavigate: (page: string) => void;
}

const navItems: Record<
  string,
  { icon: React.ReactNode; label: string; page: string }[]
> = {
  director: [
    {
      icon: <LayoutDashboard size={18} />,
      label: "Dashboard",
      page: "dashboard",
    },
    {
      icon: <Database size={18} />,
      label: "Appliance Data",
      page: "appliance",
    },
    { icon: <FlaskConical size={18} />, label: "Lab Monitoring", page: "lab" },
    {
      icon: <DollarSign size={18} />,
      label: "Financial Monitoring",
      page: "financial",
    },
    {
      icon: <Users size={18} />,
      label: "Official Performance",
      page: "performance",
    },
    { icon: <Target size={18} />, label: "Target Creation", page: "targets" },
    { icon: <TestTube2 size={18} />, label: "Testing Module", page: "testing" },
    { icon: <MapIcon size={18} />, label: "India Map", page: "mapDashboard" },
  ],
  official: [
    {
      icon: <LayoutDashboard size={18} />,
      label: "Dashboard",
      page: "dashboard",
    },
    { icon: <FileCheck size={18} />, label: "Review Reports", page: "review" },
    {
      icon: <CheckCircle size={18} />,
      label: "Approved Reports",
      page: "approved",
    },
    {
      icon: <XCircle size={18} />,
      label: "Rejected Reports",
      page: "rejected",
    },
  ],
  purchaser: [
    {
      icon: <LayoutDashboard size={18} />,
      label: "Dashboard",
      page: "dashboard",
    },
    {
      icon: <Search size={18} />,
      label: "Search & Block Sample",
      page: "search",
    },
    {
      icon: <ShoppingCart size={18} />,
      label: "My Purchases",
      page: "purchases",
    },
    {
      icon: <Lock size={18} />,
      label: "Blocked Sample",
      page: "blocked",
    },
    { icon: <Activity size={18} />, label: "Track Status", page: "track" },
  ],
  lab: [
    {
      icon: <LayoutDashboard size={18} />,
      label: "Dashboard",
      page: "dashboard",
    },
    { icon: <List size={18} />, label: "Sample Tracking", page: "samples" },
    {
      icon: <RotateCcw size={18} />,
      label: "Revert from BEE",
      page: "revert",
    },
    { icon: <Upload size={18} />, label: "Upload Report", page: "upload" },
  ],
  labcoordinator: [
    {
      icon: <LayoutDashboard size={18} />,
      label: "Dashboard",
      page: "dashboard",
    },
    {
      icon: <ClipboardList size={18} />,
      label: "Assign Lab",
      page: "assignlab",
    },
  ],
};

const roleLabels: Record<string, string> = {
  director: "BEE Director",
  official: "BEE Official",
  purchaser: "SDA Purchaser",
  lab: "Test Laboratory",
  labcoordinator: "Lab Coordinator",
};

const roleAccentColors: Record<string, string> = {
  director: "#f5a623",
  official: "#10b981",
  purchaser: "#f59e0b",
  lab: "#8b5cf6",
  labcoordinator: "#06b6d4",
};

export default function Layout({
  children,
  activePage,
  onNavigate,
}: LayoutProps) {
  const { user, logout } = useAuth();
  const { blockedSamples } = useBlockedSamples();
  if (!user) return null;

  const items = navItems[user.role] || [];
  const today = new Date().toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  const pendingCount =
    user.role === "labcoordinator"
      ? blockedSamples.filter((s) => !s.labAssignment).length
      : 0;

  return (
    <div
      className="flex h-screen overflow-hidden"
      style={{ backgroundColor: "#f0f4f8" }}
    >
      {/* ── Sidebar ── */}
      <aside
        className="w-72 flex-shrink-0 flex flex-col relative"
        style={{
          background:
            "linear-gradient(180deg, #1a3a6b 0%, #0f2d57 70%, #091e3a 100%)",
          boxShadow: "4px 0 20px rgba(26, 58, 107, 0.25)",
        }}
      >
        {/* Logo / Brand area */}
        <div
          className="px-5 pt-6 pb-5"
          style={{ borderBottom: "1px solid rgba(255,255,255,0.08)" }}
        >
          <div className="flex items-center gap-3">
            <img
              src="/assets/uploads/image-5-1.png"
              alt="BEE Logo"
              className="w-12 h-12 rounded-full object-contain bg-white flex-shrink-0"
            />
            <div className="min-w-0">
              <p className="text-white font-bold text-sm leading-tight">
                BEE Portal
              </p>
              <p className="text-blue-300 text-xs leading-tight">
                Check Testing Programme
              </p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 overflow-y-auto">
          <p
            className="text-xs font-semibold uppercase tracking-widest px-3 mb-3"
            style={{ color: roleAccentColors[user.role] ?? "#f5a623" }}
          >
            {roleLabels[user.role]}
          </p>
          {items.map((item) => (
            <button
              type="button"
              key={item.page}
              data-ocid={`nav.${item.page}_link`}
              onClick={() => onNavigate(item.page)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg mb-1 text-sm transition-all duration-150 sidebar-nav-item ${
                activePage === item.page
                  ? "sidebar-nav-active text-white font-semibold"
                  : "text-blue-200 hover:bg-white/8 hover:text-white"
              }`}
              style={
                activePage === item.page
                  ? { background: "rgba(255,255,255,0.1)" }
                  : {}
              }
            >
              <span
                className={
                  activePage === item.page ? "opacity-100" : "opacity-70"
                }
              >
                {item.icon}
              </span>
              <span className="flex-1 text-left">{item.label}</span>
              {item.page === "assignlab" && pendingCount > 0 && (
                <span
                  className="text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center"
                  style={{ backgroundColor: "#d97706", color: "white" }}
                >
                  {pendingCount}
                </span>
              )}
              {activePage === item.page && (
                <ChevronRight size={14} className="opacity-60" />
              )}
            </button>
          ))}
        </nav>

        {/* User info */}
        <div
          className="px-4 py-4"
          style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }}
        >
          <div className="flex items-center gap-3 mb-3">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center text-sm font-bold flex-shrink-0 shadow-md"
              style={{
                background: `linear-gradient(135deg, ${roleAccentColors[user.role] ?? "#f5a623"}, #d4820a)`,
                color: "#1a3a6b",
              }}
            >
              {user.name[0]}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-white text-xs font-semibold truncate">
                {user.name}
              </p>
              <p className="text-blue-400 text-xs truncate">{user.email}</p>
            </div>
          </div>
          <Button
            data-ocid="nav.logout_button"
            onClick={logout}
            variant="ghost"
            size="sm"
            className="w-full justify-start gap-2 text-xs rounded-lg"
            style={{
              color: "rgba(147,197,253,0.8)",
              background: "rgba(255,255,255,0.05)",
            }}
          >
            <LogOut size={13} />
            Sign Out
          </Button>
        </div>
      </aside>

      {/* ── Main Area ── */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <header
          className="flex-shrink-0 flex items-center justify-between px-6 bg-white"
          style={{
            height: "62px",
            borderBottom: "1px solid #e2e8f0",
            boxShadow: "0 1px 8px rgba(26,58,107,0.07)",
            borderTop: "2px solid #1a3a6b",
          }}
        >
          <div className="flex items-center gap-3">
            <img
              src="/assets/uploads/image-5-1.png"
              alt="BEE Logo"
              className="w-9 h-9 rounded-full object-contain bg-white border border-gray-200"
            />
            <div>
              <h1
                className="text-sm font-bold leading-tight"
                style={{ color: "#1a3a6b" }}
              >
                Bureau of Energy Efficiency
              </h1>
              <p className="text-xs text-gray-500">
                Standards &amp; Labelling · Check Testing Portal
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-xs text-gray-400 hidden sm:block">
              Last updated:{" "}
              <span className="text-gray-600 font-medium">{today}</span>
            </span>
            <button
              type="button"
              className="relative w-9 h-9 rounded-xl flex items-center justify-center transition-colors hover:bg-gray-100"
              style={{ color: "#64748b" }}
              data-ocid="nav.notifications_button"
              onClick={() => {}}
            >
              <Bell size={18} />
              {pendingCount > 0 ? (
                <span
                  className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] rounded-full text-white text-[10px] font-bold flex items-center justify-center px-0.5"
                  style={{ backgroundColor: "#d97706" }}
                >
                  {pendingCount}
                </span>
              ) : (
                <span
                  className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full"
                  style={{ backgroundColor: "#dc2626" }}
                />
              )}
            </button>
            <div className="flex items-center gap-2.5">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-semibold text-gray-800 leading-tight">
                  {user.name}
                </p>
                <p className="text-xs text-gray-500 leading-tight">
                  {roleLabels[user.role]}
                </p>
              </div>
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center text-sm font-bold shadow-sm"
                style={{
                  background: "linear-gradient(135deg, #1a3a6b, #0f2d57)",
                  color: "white",
                }}
              >
                {user.name[0]}
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  );
}

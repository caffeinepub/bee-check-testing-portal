import { Button } from "@/components/ui/button";
import {
  AlertTriangle,
  Bell,
  CalendarCheck,
  CheckCircle,
  ChevronDown,
  ChevronRight,
  ClipboardList,
  Database,
  DollarSign,
  FileCheck,
  FileText,
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
  Users,
  XCircle,
} from "lucide-react";
import { useState } from "react";
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
    {
      icon: <FlaskConical size={18} />,
      label: "Lab Results",
      page: "labresults",
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
    {
      icon: <TestTube2 size={18} />,
      label: "2nd Check Test",
      page: "secondcheck",
    },
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
    {
      icon: <FileText size={18} />,
      label: "Test Report",
      page: "testreport",
    },
    {
      icon: <TestTube2 size={18} />,
      label: "2nd Check Test",
      page: "secondcheck",
    },
  ],
  labcoordinator: [
    {
      icon: <LayoutDashboard size={18} />,
      label: "Dashboard",
      page: "dashboard",
    },
  ],
  complianceofficer: [
    {
      icon: <LayoutDashboard size={18} />,
      label: "Dashboard",
      page: "dashboard",
    },
    {
      icon: <AlertTriangle size={18} />,
      label: "Failed Cases",
      page: "dashboard",
    },
    {
      icon: <CalendarCheck size={18} />,
      label: "Scheduling Approvals",
      page: "scheduling",
    },
  ],
};

// Financial Official accordion nav structure
const finStateSubItems = [
  { label: "Summary", page: "fin_summary" },
  { label: "Bill Wise Details", page: "fin_bill" },
  { label: "Appliance Wise", page: "fin_appliance" },
  { label: "Expenses Head", page: "fin_expenses" },
  { label: "Invoice Data", page: "fin_invoice" },
  { label: "Lab Wise", page: "fin_lab" },
  { label: "Vendor Wise", page: "fin_vendor" },
  { label: "Brand Wise", page: "fin_brand" },
];

const finBeeSubItems = [
  { label: "Summary", page: "bee_summary" },
  { label: "Bill Wise Details", page: "bee_bill" },
  { label: "Appliance Wise", page: "bee_appliance" },
  { label: "Expenses Head", page: "bee_expenses" },
  { label: "Invoice Data", page: "bee_invoice" },
  { label: "Lab Wise", page: "bee_lab" },
  { label: "Vendor Wise", page: "bee_vendor" },
  { label: "Brand Wise", page: "bee_brand" },
];

const finLabSubItems = [
  { label: "Summary", page: "lab_summary" },
  { label: "Bill Wise Details", page: "lab_bill" },
  { label: "Appliance Wise", page: "lab_appliance" },
  { label: "Expenses Head", page: "lab_expenses" },
  { label: "Invoice Data", page: "lab_invoice" },
  { label: "Lab Wise", page: "lab_lab" },
  { label: "Vendor Wise", page: "lab_vendor" },
  { label: "Brand Wise", page: "lab_brand" },
];

const ROLE_LABELS: Record<string, string> = {
  director: "BEE Director",
  official: "BEE Official",
  purchaser: "SDA Purchaser",
  lab: "Test Laboratory",
  labcoordinator: "Lab Coordinator",
  complianceofficer: "Compliance Officer",
  financialofficial: "Financial Official",
};

const ROLE_ACCENT: Record<string, string> = {
  director: "#c8a951",
  official: "#10b981",
  purchaser: "#f59e0b",
  lab: "#8b5cf6",
  labcoordinator: "#06b6d4",
  complianceofficer: "#ef4444",
  financialofficial: "#ea580c",
};

const BEE_LOGO = "/assets/generated/bee_logo_transparent.png";

export default function Layout({
  children,
  activePage,
  onNavigate,
}: LayoutProps) {
  const { user, logout } = useAuth();
  const { blockedSamples, secondCheckLabRequests } = useBlockedSamples();
  const [expandedSection, setExpandedSection] = useState<string>("State");
  const [assignLabExpanded, setAssignLabExpanded] = useState<boolean>(true);

  // Sync expandedSection when navigating via external links
  if (activePage.startsWith("bee_") && expandedSection !== "BEE") {
    setExpandedSection("BEE");
  } else if (activePage.startsWith("lab_") && expandedSection !== "LAB") {
    setExpandedSection("LAB");
  } else if (activePage.startsWith("fin_") && expandedSection !== "State") {
    setExpandedSection("State");
  }

  if (!user) return null;
  const items = navItems[user.role] || [];
  const accent = ROLE_ACCENT[user.role] || "#c8a951";
  const roleLabel = ROLE_LABELS[user.role] || user.role;

  const pendingCount =
    user.role === "labcoordinator"
      ? blockedSamples.filter((s) => !s.labAssignment).length
      : 0;

  const pending2ndCount =
    user.role === "labcoordinator"
      ? (secondCheckLabRequests || []).filter((r) => !r.labName).length
      : 0;

  const toggleSection = (section: string) => {
    setExpandedSection((prev) => (prev === section ? "" : section));
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside
        className="w-60 flex-shrink-0 flex flex-col"
        style={{
          background:
            "linear-gradient(180deg, #0d2252 0%, #1a3a6b 60%, #1e4080 100%)",
        }}
      >
        {/* Logo area */}
        <div
          className="flex flex-col items-center px-3 py-3 border-b"
          style={{ borderColor: "rgba(200,169,81,0.3)" }}
        >
          <img
            src={BEE_LOGO}
            alt="Bureau of Energy Efficiency — Ministry of Power, Government of India"
            className="w-full max-h-14 object-contain bg-white rounded-lg p-1"
          />
        </div>

        {/* Role Badge */}
        <div
          className="mx-3 mt-3 mb-1 px-3 py-1.5 rounded-lg text-center"
          style={{
            backgroundColor: "rgba(200,169,81,0.15)",
            border: "1px solid rgba(200,169,81,0.25)",
          }}
        >
          <p className="text-xs font-semibold" style={{ color: accent }}>
            {roleLabel}
          </p>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 overflow-y-auto">
          {user.role === "financialofficial" ? (
            // Special accordion nav for Financial Official
            <>
              {/* State Section */}
              <div className="mb-1">
                <button
                  type="button"
                  data-ocid="fin.state.tab"
                  onClick={() => toggleSection("State")}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-150 text-blue-200 hover:bg-white/10 hover:text-white"
                  style={expandedSection === "State" ? { color: accent } : {}}
                >
                  <MapIcon size={18} />
                  <span className="flex-1 text-left font-semibold">State</span>
                  {expandedSection === "State" ? (
                    <ChevronDown size={14} />
                  ) : (
                    <ChevronRight size={14} />
                  )}
                </button>
                {expandedSection === "State" && (
                  <div
                    className="ml-3 mt-1 border-l-2 pl-3"
                    style={{ borderColor: `${accent}40` }}
                  >
                    {finStateSubItems.map((sub) => {
                      const isActive = activePage === sub.page;
                      return (
                        <button
                          key={sub.page}
                          type="button"
                          data-ocid={`fin.${sub.page}_link`}
                          onClick={() => onNavigate(sub.page)}
                          className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg mb-0.5 text-xs transition-all duration-150 ${
                            isActive
                              ? "text-white font-semibold"
                              : "text-blue-300 hover:bg-white/10 hover:text-white"
                          }`}
                          style={
                            isActive
                              ? { backgroundColor: accent, color: "#1a3a6b" }
                              : {}
                          }
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-current flex-shrink-0" />
                          {sub.label}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* BEE Section */}
              <div className="mb-1">
                <button
                  type="button"
                  data-ocid="fin.bee.tab"
                  onClick={() => toggleSection("BEE")}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-150 text-blue-200 hover:bg-white/10 hover:text-white"
                  style={expandedSection === "BEE" ? { color: accent } : {}}
                >
                  <FileText size={18} />
                  <span className="flex-1 text-left font-semibold">BEE</span>
                  {expandedSection === "BEE" ? (
                    <ChevronDown size={14} />
                  ) : (
                    <ChevronRight size={14} />
                  )}
                </button>
                {expandedSection === "BEE" && (
                  <div
                    className="ml-3 mt-1 border-l-2 pl-3"
                    style={{ borderColor: `${accent}40` }}
                  >
                    {finBeeSubItems.map((sub) => {
                      const isActive = activePage === sub.page;
                      return (
                        <button
                          key={sub.page}
                          type="button"
                          data-ocid={`fin.${sub.page}_link`}
                          onClick={() => onNavigate(sub.page)}
                          className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg mb-0.5 text-xs transition-all duration-150 ${
                            isActive
                              ? "text-white font-semibold"
                              : "text-blue-300 hover:bg-white/10 hover:text-white"
                          }`}
                          style={
                            isActive
                              ? { backgroundColor: accent, color: "#1a3a6b" }
                              : {}
                          }
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-current flex-shrink-0" />
                          {sub.label}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* LAB Section */}
              <div className="mb-1">
                <button
                  type="button"
                  data-ocid="fin.lab.tab"
                  onClick={() => toggleSection("LAB")}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-150 text-blue-200 hover:bg-white/10 hover:text-white"
                  style={expandedSection === "LAB" ? { color: accent } : {}}
                >
                  <FlaskConical size={18} />
                  <span className="flex-1 text-left font-semibold">LAB</span>
                  {expandedSection === "LAB" ? (
                    <ChevronDown size={14} />
                  ) : (
                    <ChevronRight size={14} />
                  )}
                </button>
                {expandedSection === "LAB" && (
                  <div
                    className="ml-3 mt-1 border-l-2 pl-3"
                    style={{ borderColor: `${accent}40` }}
                  >
                    {finLabSubItems.map((sub) => {
                      const isActive = activePage === sub.page;
                      return (
                        <button
                          key={sub.page}
                          type="button"
                          data-ocid={`fin.${sub.page}_link`}
                          onClick={() => onNavigate(sub.page)}
                          className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg mb-0.5 text-xs transition-all duration-150 ${
                            isActive
                              ? "text-white font-semibold"
                              : "text-blue-300 hover:bg-white/10 hover:text-white"
                          }`}
                          style={
                            isActive
                              ? { backgroundColor: accent, color: "#1a3a6b" }
                              : {}
                          }
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-current flex-shrink-0" />
                          {sub.label}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            </>
          ) : user.role === "labcoordinator" ? (
            // Special accordion nav for Lab Coordinator
            <>
              {/* Dashboard link */}
              <button
                type="button"
                data-ocid="nav.dashboard_link"
                onClick={() => onNavigate("dashboard")}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg mb-1 text-sm transition-all duration-150 ${
                  activePage === "dashboard"
                    ? "sidebar-nav-active text-white font-semibold"
                    : "text-blue-200 hover:bg-white/10 hover:text-white"
                }`}
                style={
                  activePage === "dashboard"
                    ? { backgroundColor: accent, color: "#1a3a6b" }
                    : {}
                }
              >
                <span
                  className={activePage === "dashboard" ? "text-[#1a3a6b]" : ""}
                >
                  <LayoutDashboard size={18} />
                </span>
                <span className="flex-1 text-left">Dashboard</span>
                {activePage === "dashboard" && (
                  <ChevronRight size={14} className="text-[#1a3a6b]" />
                )}
              </button>

              {/* Assign Lab accordion */}
              <div className="mb-1">
                <button
                  type="button"
                  data-ocid="nav.assignlab.accordion"
                  onClick={() => setAssignLabExpanded((p) => !p)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-150 ${
                    activePage === "assignlab_first" ||
                    activePage === "assignlab_second"
                      ? "text-white"
                      : "text-blue-200 hover:bg-white/10 hover:text-white"
                  }`}
                  style={
                    activePage === "assignlab_first" ||
                    activePage === "assignlab_second"
                      ? { color: accent }
                      : {}
                  }
                >
                  <ClipboardList size={18} />
                  <span className="flex-1 text-left">Assign Lab</span>
                  {pendingCount + pending2ndCount > 0 && (
                    <span className="text-xs bg-red-500 text-white px-1.5 py-0.5 rounded-full font-bold">
                      {pendingCount + pending2ndCount}
                    </span>
                  )}
                  {assignLabExpanded ? (
                    <ChevronDown size={14} />
                  ) : (
                    <ChevronRight size={14} />
                  )}
                </button>
                {assignLabExpanded && (
                  <div
                    className="ml-3 mt-1 border-l-2 pl-3"
                    style={{ borderColor: `${accent}40` }}
                  >
                    {/* 1st Check Test sub-item */}
                    <button
                      type="button"
                      data-ocid="nav.assignlab_first_link"
                      onClick={() => onNavigate("assignlab_first")}
                      className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg mb-0.5 text-xs transition-all duration-150 ${
                        activePage === "assignlab_first"
                          ? "text-white font-semibold"
                          : "text-blue-300 hover:bg-white/10 hover:text-white"
                      }`}
                      style={
                        activePage === "assignlab_first"
                          ? { backgroundColor: accent, color: "#1a3a6b" }
                          : {}
                      }
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-current flex-shrink-0" />
                      1st Check Test
                      {pendingCount > 0 && (
                        <span className="ml-auto text-xs bg-red-500 text-white px-1.5 py-0.5 rounded-full font-bold">
                          {pendingCount}
                        </span>
                      )}
                    </button>
                    {/* 2nd Check Test sub-item */}
                    <button
                      type="button"
                      data-ocid="nav.assignlab_second_link"
                      onClick={() => onNavigate("assignlab_second")}
                      className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg mb-0.5 text-xs transition-all duration-150 ${
                        activePage === "assignlab_second"
                          ? "text-white font-semibold"
                          : "text-blue-300 hover:bg-white/10 hover:text-white"
                      }`}
                      style={
                        activePage === "assignlab_second"
                          ? { backgroundColor: accent, color: "#1a3a6b" }
                          : {}
                      }
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-current flex-shrink-0" />
                      2nd Check Test
                      {pending2ndCount > 0 && (
                        <span className="ml-auto text-xs bg-red-500 text-white px-1.5 py-0.5 rounded-full font-bold">
                          {pending2ndCount}
                        </span>
                      )}
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            // Standard flat nav for all other roles
            items.map((item) => {
              const isActive = activePage === item.page;
              return (
                <button
                  key={item.page + item.label}
                  type="button"
                  data-ocid={`nav.${item.page}_link`}
                  onClick={() => onNavigate(item.page)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg mb-1 text-sm transition-all duration-150 sidebar-nav-item ${
                    isActive
                      ? "sidebar-nav-active text-white font-semibold"
                      : "text-blue-200 hover:bg-white/10 hover:text-white"
                  }`}
                  style={
                    isActive
                      ? { backgroundColor: accent, color: "#1a3a6b" }
                      : {}
                  }
                >
                  <span className={isActive ? "text-[#1a3a6b]" : ""}>
                    {item.icon}
                  </span>
                  <span className="flex-1 text-left">{item.label}</span>
                  {isActive && (
                    <ChevronRight size={14} className="text-[#1a3a6b]" />
                  )}
                </button>
              );
            })
          )}
        </nav>

        {/* Logout */}
        <div className="px-3 pb-4">
          <button
            type="button"
            data-ocid="nav.logout_button"
            onClick={logout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-red-300 hover:bg-red-900/30 hover:text-red-200 transition-colors"
          >
            <LogOut size={18} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <header className="flex items-center justify-between px-6 py-2 bg-white border-b border-gray-200 shadow-sm">
          <div className="flex items-center">
            <img
              src={BEE_LOGO}
              alt="Bureau of Energy Efficiency — Ministry of Power, Government of India"
              className="h-12 max-w-xs object-contain"
            />
          </div>
          <div className="flex items-center gap-3">
            <p className="text-xs text-gray-500 hidden md:block">
              Standards &amp; Labelling Programme — Check Testing Portal
            </p>
            <button
              type="button"
              data-ocid="nav.notifications_button"
              className="p-2 rounded-full hover:bg-gray-100 transition-colors relative"
            >
              <Bell size={18} className="text-gray-600" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
            </button>
            <div
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg"
              style={{ backgroundColor: "#f0f4ff" }}
            >
              <div
                className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold"
                style={{ backgroundColor: "#1a3a6b" }}
              >
                {roleLabel.charAt(0)}
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-800">
                  {roleLabel}
                </p>
                <p className="text-xs text-gray-400">{user.email}</p>
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-6">{children}</main>

        {/* Footer */}
        <footer className="px-6 py-2 bg-white border-t border-gray-100 text-center">
          <p className="text-xs text-gray-400">
            © {new Date().getFullYear()}. Built with love using{" "}
            <a
              href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(typeof window !== "undefined" ? window.location.hostname : "")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-gray-600"
            >
              caffeine.ai
            </a>
          </p>
        </footer>
      </div>
    </div>
  );
}

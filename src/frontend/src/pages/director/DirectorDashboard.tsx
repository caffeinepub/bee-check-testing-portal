import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  AlertTriangle,
  ArrowRight,
  BarChart3,
  CheckCircle,
  Clock,
  DollarSign,
  Package,
  ShoppingCart,
  Star,
  Target,
  TestTube,
  TrendingDown,
  TrendingUp,
  Users,
  XCircle,
  Zap,
} from "lucide-react";
import {
  Bar,
  BarChart,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface Props {
  onNavigate: (page: string) => void;
}

// ── data ──────────────────────────────────────────────────────────────────────
const procurementKpis = [
  {
    label: "Total Target",
    value: 245,
    prev: 220,
    unit: "units",
    progress: 100,
    nav: "targets",
    accent: "#1a3a6b",
    icon: Target,
  },
  {
    label: "Blocked",
    value: 89,
    prev: 74,
    unit: "units",
    progress: Math.round((89 / 245) * 100),
    nav: "appliance",
    accent: "#d97706",
    icon: Package,
  },
  {
    label: "Purchased",
    value: 67,
    prev: 52,
    unit: "units",
    progress: Math.round((67 / 245) * 100),
    nav: "appliance",
    accent: "#059669",
    icon: ShoppingCart,
  },
];

const testingKpis = [
  {
    label: "Sample Tested",
    value: 45,
    prev: 38,
    progress: Math.round((45 / 67) * 100),
    nav: "lab",
    accent: "#7c3aed",
    icon: TestTube,
  },
  {
    label: "Pass",
    value: 38,
    prev: 30,
    progress: Math.round((38 / 45) * 100),
    nav: "lab",
    accent: "#059669",
    icon: CheckCircle,
  },
  {
    label: "Fail",
    value: 7,
    prev: 8,
    progress: Math.round((7 / 45) * 100),
    nav: "lab",
    accent: "#dc2626",
    icon: XCircle,
  },
  {
    label: "Under Test",
    value: 22,
    prev: 18,
    progress: Math.round((22 / 67) * 100),
    nav: "lab",
    accent: "#ea580c",
    icon: Clock,
  },
  {
    label: "Not Fit",
    value: 4,
    prev: 3,
    progress: Math.round((4 / 45) * 100),
    nav: "lab",
    accent: "#6b7280",
    icon: AlertTriangle,
  },
];

const monthlyData = [
  { month: "Sep", tested: 6, passed: 5, failed: 1 },
  { month: "Oct", tested: 9, passed: 7, failed: 2 },
  { month: "Nov", tested: 11, passed: 9, failed: 2 },
  { month: "Dec", tested: 8, passed: 7, failed: 1 },
  { month: "Jan", tested: 7, passed: 6, failed: 1 },
  { month: "Feb", tested: 4, passed: 4, failed: 0 },
];

const pieData = [
  { name: "Pass", value: 38, color: "#059669" },
  { name: "Fail", value: 7, color: "#dc2626" },
  { name: "Under Test", value: 22, color: "#ea580c" },
  { name: "Not Fit", value: 4, color: "#9ca3af" },
];

const quickNavLinks = [
  {
    page: "appliance",
    label: "Appliance Monitoring",
    desc: "Track products & blocking status",
    icon: Package,
    color: "#d97706",
    bg: "#fffbeb",
    border: "#fde68a",
  },
  {
    page: "lab",
    label: "Lab Monitoring",
    desc: "Test results & lab reports",
    icon: TestTube,
    color: "#7c3aed",
    bg: "#f5f3ff",
    border: "#ddd6fe",
  },
  {
    page: "financial",
    label: "Financial Monitoring",
    desc: "Fund allocation & tracking",
    icon: DollarSign,
    color: "#059669",
    bg: "#ecfdf5",
    border: "#a7f3d0",
  },
  {
    page: "performance",
    label: "Official Performance",
    desc: "Officer activity & KPIs",
    icon: Users,
    color: "#0284c7",
    bg: "#f0f9ff",
    border: "#bae6fd",
  },
  {
    page: "targets",
    label: "Target Creation",
    desc: "Assign & manage targets",
    icon: Target,
    color: "#1a3a6b",
    bg: "#eff6ff",
    border: "#bfdbfe",
  },
  {
    page: "reports",
    label: "Reports & Export",
    desc: "Download PDF/Excel data",
    icon: BarChart3,
    color: "#db2777",
    bg: "#fdf2f8",
    border: "#fbcfe8",
  },
];

const recentActivity = [
  {
    text: "Samsung AC test report approved by Rahul Sharma",
    time: "2 hours ago",
    type: "approved",
    user: "Rahul Sharma",
  },
  {
    text: "New target created for Maharashtra SDA region",
    time: "5 hours ago",
    type: "new",
    user: "Priya Mehta",
  },
  {
    text: "Whirlpool Refrigerator test scheduled at NABL Lab",
    time: "1 day ago",
    type: "new",
    user: "Vikram Nair",
  },
  {
    text: "LG Washing Machine report reverted to lab for correction",
    time: "2 days ago",
    type: "reverted",
    user: "Anita Desai",
  },
  {
    text: "Blue Star AC failed BEE compliance check (Star Rating)",
    time: "3 days ago",
    type: "rejected",
    user: "System",
  },
];

// ── helpers ───────────────────────────────────────────────────────────────────
function trendPct(current: number, prev: number) {
  return Math.round(((current - prev) / prev) * 100);
}

function TrendBadge({ current, prev }: { current: number; prev: number }) {
  const pct = trendPct(current, prev);
  const up = pct >= 0;
  return (
    <div className="flex flex-col items-end gap-0.5">
      <span
        className={`inline-flex items-center gap-0.5 text-xs font-semibold px-1.5 py-0.5 rounded-full ${
          up ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700"
        }`}
      >
        {up ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
        {Math.abs(pct)}%
      </span>
      <span className="text-xs text-gray-400">vs last month</span>
    </div>
  );
}

const activityColors: Record<string, string> = {
  approved: "#059669",
  rejected: "#dc2626",
  reverted: "#d97706",
  new: "#0284c7",
};

const activityBadgeStyle: Record<string, { label: string; cls: string }> = {
  approved: { label: "Approved", cls: "bg-emerald-100 text-emerald-800" },
  rejected: { label: "Rejected", cls: "bg-red-100 text-red-800" },
  reverted: { label: "Reverted", cls: "bg-amber-100 text-amber-800" },
  new: { label: "New", cls: "bg-blue-100 text-blue-800" },
};

// ── pipeline ──────────────────────────────────────────────────────────────────
const pipeline = [
  { label: "Target", value: 245, color: "#1a3a6b", bg: "#eff6ff" },
  { label: "Blocked", value: 89, color: "#d97706", bg: "#fffbeb" },
  { label: "Purchased", value: 67, color: "#0284c7", bg: "#f0f9ff" },
  { label: "Under Test", value: 22, color: "#7c3aed", bg: "#f5f3ff" },
  { label: "Pass", value: 38, color: "#059669", bg: "#ecfdf5" },
];

// ── component ─────────────────────────────────────────────────────────────────
export default function DirectorDashboard({ onNavigate }: Props) {
  const progPct = Math.round((38 / 245) * 100);

  return (
    <div className="space-y-6 pb-8">
      {/* ── Header Banner ── */}
      <div
        className="rounded-2xl p-6 relative overflow-hidden"
        style={{
          background:
            "linear-gradient(135deg, #1a3a6b 0%, #124a9e 60%, #0f5d9e 100%)",
        }}
        data-ocid="director.page"
      >
        {/* Dot overlay */}
        <div className="absolute inset-0 dot-pattern opacity-30 pointer-events-none" />

        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-5">
          <div className="flex items-center gap-4">
            <div
              className="p-3 rounded-xl"
              style={{
                background: "rgba(245,166,35,0.2)",
                border: "1px solid rgba(245,166,35,0.35)",
              }}
            >
              <Zap size={22} style={{ color: "#f5a623" }} />
            </div>
            <div>
              <div className="flex items-center gap-2.5 flex-wrap mb-1">
                <h2
                  className="text-white font-bold text-xl leading-none"
                  style={{ fontFamily: "'Sora', system-ui, sans-serif" }}
                >
                  Director Dashboard
                </h2>
                <span
                  className="text-xs font-semibold px-2.5 py-1 rounded-full"
                  style={{
                    background: "rgba(245,166,35,0.2)",
                    color: "#f5a623",
                    border: "1px solid rgba(245,166,35,0.3)",
                  }}
                >
                  FY 2024-25
                </span>
                <span
                  className="flex items-center gap-1.5 text-xs font-medium"
                  style={{ color: "#34d399" }}
                >
                  <span
                    className="w-2 h-2 rounded-full pulse-live inline-block"
                    style={{ backgroundColor: "#10b981" }}
                  />
                  LIVE
                </span>
              </div>
              <p className="text-blue-200 text-sm">
                Standards & Labelling Programme &bull; Check Testing
              </p>
            </div>
          </div>

          {/* Progress block */}
          <div
            className="flex-shrink-0 rounded-xl p-4 min-w-[220px]"
            style={{
              background: "rgba(255,255,255,0.1)",
              border: "1px solid rgba(255,255,255,0.15)",
            }}
          >
            <div className="flex justify-between text-xs mb-2">
              <span className="text-blue-100">Programme Progress</span>
              <span className="text-white font-bold">{progPct}%</span>
            </div>
            <div className="h-2.5 bg-white/20 rounded-full overflow-hidden mb-2">
              <div
                className="h-full rounded-full transition-all"
                style={{
                  width: `${progPct}%`,
                  background: "linear-gradient(90deg, #34d399, #10b981)",
                }}
              />
            </div>
            <p className="text-blue-200 text-xs">
              <span className="text-white font-bold">38</span> of 245 targets
              completed
            </p>
          </div>
        </div>
      </div>

      {/* ── Procurement KPI Row ── */}
      <section data-ocid="director.procurement.section">
        <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3 flex items-center gap-2">
          <span
            className="w-3 h-3 rounded-sm inline-block"
            style={{ backgroundColor: "#1a3a6b" }}
          />
          Procurement Pipeline
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {procurementKpis.map((kpi) => {
            const Icon = kpi.icon;
            return (
              <button
                type="button"
                key={kpi.label}
                data-ocid={`director.${kpi.label.toLowerCase().replace(/ /g, "_")}.card`}
                onClick={() => onNavigate(kpi.nav)}
                className="text-left group"
              >
                <Card
                  className="border-0 bee-card-hover overflow-hidden"
                  style={{ boxShadow: "0 2px 12px rgba(26,58,107,0.08)" }}
                >
                  {/* Left accent bar */}
                  <div
                    className="absolute left-0 top-0 bottom-0 w-1 rounded-l-xl"
                    style={{ backgroundColor: kpi.accent }}
                  />
                  <CardContent className="pt-5 pb-5 pl-6 relative">
                    <div className="flex items-start justify-between mb-4">
                      <div
                        className="p-2.5 rounded-xl"
                        style={{ backgroundColor: `${kpi.accent}15` }}
                      >
                        <Icon size={20} style={{ color: kpi.accent }} />
                      </div>
                      <TrendBadge current={kpi.value} prev={kpi.prev} />
                    </div>
                    <p
                      className="text-4xl font-bold leading-none mb-1"
                      style={{ color: kpi.accent }}
                    >
                      {kpi.value}
                    </p>
                    <p className="text-sm font-semibold text-gray-600 mb-3">
                      {kpi.label}
                    </p>
                    <div>
                      <div className="flex justify-between text-xs text-gray-400 mb-1.5">
                        <span>of 245 targets</span>
                        <span
                          className="font-semibold"
                          style={{ color: kpi.accent }}
                        >
                          {kpi.progress}%
                        </span>
                      </div>
                      <div className="h-1.5 rounded-full overflow-hidden bg-gray-100">
                        <div
                          className="h-full rounded-full"
                          style={{
                            width: `${kpi.progress}%`,
                            backgroundColor: kpi.accent,
                          }}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </button>
            );
          })}
        </div>
      </section>

      {/* ── Testing KPI Row ── */}
      <section data-ocid="director.testing.section">
        <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3 flex items-center gap-2">
          <span
            className="w-3 h-3 rounded-sm inline-block"
            style={{ backgroundColor: "#7c3aed" }}
          />
          Testing Results — Executive Scorecard
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {testingKpis.map((kpi) => {
            const Icon = kpi.icon;
            return (
              <button
                type="button"
                key={kpi.label}
                data-ocid={`director.${kpi.label.toLowerCase().replace(/ /g, "_")}.card`}
                onClick={() => onNavigate(kpi.nav)}
                className="text-left group"
              >
                <Card
                  className="border-0 bee-card-hover overflow-hidden"
                  style={{ boxShadow: "0 2px 10px rgba(26,58,107,0.07)" }}
                >
                  <div
                    className="h-0.5 w-full"
                    style={{ backgroundColor: kpi.accent }}
                  />
                  <CardContent className="pt-3.5 pb-3.5 px-3.5">
                    <div
                      className="w-9 h-9 rounded-xl flex items-center justify-center mb-2.5"
                      style={{ backgroundColor: `${kpi.accent}15` }}
                    >
                      <Icon size={17} style={{ color: kpi.accent }} />
                    </div>
                    <p
                      className="text-2xl font-bold leading-none mb-1"
                      style={{ color: kpi.accent }}
                    >
                      {kpi.value}
                    </p>
                    <p className="text-xs font-semibold text-gray-600 mb-2 leading-tight">
                      {kpi.label}
                    </p>
                    <div className="h-1 rounded-full overflow-hidden bg-gray-100">
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${kpi.progress}%`,
                          backgroundColor: kpi.accent,
                        }}
                      />
                    </div>
                    <p className="text-xs text-gray-400 mt-1.5">
                      {kpi.progress}% of batch
                    </p>
                  </CardContent>
                </Card>
              </button>
            );
          })}
        </div>
      </section>

      {/* ── Pipeline Funnel ── */}
      <section data-ocid="director.pipeline.section">
        <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3 flex items-center gap-2">
          <span
            className="w-3 h-3 rounded-sm inline-block"
            style={{ backgroundColor: "#0284c7" }}
          />
          Programme Flow — Funnel View
        </p>
        <Card
          className="border-0"
          style={{ boxShadow: "0 2px 12px rgba(26,58,107,0.08)" }}
        >
          <CardContent className="pt-5 pb-5">
            <div className="flex items-center justify-between gap-2 overflow-x-auto pb-1">
              {pipeline.map((stage, i) => {
                const conversionNext =
                  i < pipeline.length - 1
                    ? Math.round((pipeline[i + 1].value / stage.value) * 100)
                    : null;
                return (
                  <div
                    key={stage.label}
                    className="flex items-center flex-shrink-0"
                  >
                    {/* Stage box */}
                    <div
                      className="flex flex-col items-center px-5 py-4 rounded-xl min-w-[90px] text-center"
                      style={{
                        backgroundColor: stage.bg,
                        border: `1.5px solid ${stage.color}30`,
                      }}
                    >
                      <span
                        className="text-2xl font-bold leading-none"
                        style={{ color: stage.color }}
                      >
                        {stage.value}
                      </span>
                      <span
                        className="text-xs font-semibold mt-1.5 mb-1"
                        style={{ color: stage.color }}
                      >
                        {stage.label}
                      </span>
                      <span
                        className="text-xs px-2 py-0.5 rounded-full font-medium"
                        style={{
                          backgroundColor: `${stage.color}20`,
                          color: stage.color,
                        }}
                      >
                        {Math.round((stage.value / 245) * 100)}%
                      </span>
                    </div>

                    {/* Arrow + conversion */}
                    {conversionNext !== null && (
                      <div className="flex flex-col items-center mx-2 flex-shrink-0">
                        <ArrowRight size={18} className="text-gray-300" />
                        <span
                          className="text-xs font-bold mt-0.5"
                          style={{ color: "#059669" }}
                        >
                          {conversionNext}%
                        </span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </section>

      {/* ── Charts ── */}
      <section
        className="grid grid-cols-1 md:grid-cols-2 gap-4"
        data-ocid="director.charts.section"
      >
        {/* Bar Chart */}
        <Card
          className="border-0"
          style={{
            boxShadow: "0 2px 12px rgba(26,58,107,0.08)",
            borderTop: "3px solid #1a3a6b",
          }}
        >
          <CardHeader className="pb-1 pt-4">
            <CardTitle
              className="text-sm font-bold"
              style={{ color: "#1a3a6b" }}
            >
              Monthly Testing Activity
            </CardTitle>
            <p className="text-xs text-gray-400">
              Sep 2024 – Feb 2025 · Pass vs Fail comparison
            </p>
          </CardHeader>
          <CardContent className="pt-0 pb-3">
            <ResponsiveContainer width="100%" height={185}>
              <BarChart data={monthlyData} barSize={14} barGap={3}>
                <XAxis
                  dataKey="month"
                  tick={{ fontSize: 11, fill: "#9ca3af" }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 11, fill: "#9ca3af" }}
                  axisLine={false}
                  tickLine={false}
                  width={24}
                />
                <Tooltip
                  contentStyle={{
                    fontSize: 12,
                    borderRadius: 10,
                    border: "none",
                    boxShadow: "0 4px 16px rgba(0,0,0,0.12)",
                  }}
                  cursor={{ fill: "#f1f5f9" }}
                />
                <Bar
                  dataKey="passed"
                  name="Pass"
                  fill="#059669"
                  radius={[3, 3, 0, 0]}
                />
                <Bar
                  dataKey="failed"
                  name="Fail"
                  fill="#dc2626"
                  radius={[3, 3, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
            <div className="flex items-center justify-between mt-1">
              <div className="flex gap-4">
                <span className="flex items-center gap-1.5 text-xs text-gray-500">
                  <span
                    className="w-3 h-2 rounded-sm inline-block"
                    style={{ background: "#059669" }}
                  />
                  Pass
                </span>
                <span className="flex items-center gap-1.5 text-xs text-gray-500">
                  <span
                    className="w-3 h-2 rounded-sm inline-block"
                    style={{ background: "#dc2626" }}
                  />
                  Fail
                </span>
              </div>
              <button
                type="button"
                className="text-xs font-semibold flex items-center gap-0.5 hover:underline"
                style={{ color: "#1a3a6b" }}
                onClick={() => onNavigate("lab")}
                data-ocid="director.charts.lab_link"
              >
                View Details <ArrowRight size={12} />
              </button>
            </div>
          </CardContent>
        </Card>

        {/* Donut Chart */}
        <Card
          className="border-0"
          style={{
            boxShadow: "0 2px 12px rgba(26,58,107,0.08)",
            borderTop: "3px solid #7c3aed",
          }}
        >
          <CardHeader className="pb-1 pt-4">
            <CardTitle
              className="text-sm font-bold"
              style={{ color: "#1a3a6b" }}
            >
              Test Result Breakdown
            </CardTitle>
            <p className="text-xs text-gray-400">
              Current FY cumulative · 71 samples resolved
            </p>
          </CardHeader>
          <CardContent className="pt-0 pb-3">
            <div className="flex items-center gap-4">
              <ResponsiveContainer width="50%" height={165}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={45}
                    outerRadius={72}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {pieData.map((entry) => (
                      <Cell key={entry.name} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      fontSize: 12,
                      borderRadius: 10,
                      border: "none",
                      boxShadow: "0 4px 16px rgba(0,0,0,0.12)",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex flex-col gap-2.5 flex-1">
                {pieData.map((d) => (
                  <div
                    key={d.name}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2">
                      <span
                        className="w-3 h-3 rounded-full flex-shrink-0"
                        style={{ background: d.color }}
                      />
                      <span className="text-xs font-medium text-gray-600">
                        {d.name}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-sm font-bold text-gray-800">
                        {d.value}
                      </span>
                      <span className="text-xs text-gray-400">
                        ({Math.round((d.value / 71) * 100)}%)
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex justify-end mt-1">
              <button
                type="button"
                className="text-xs font-semibold flex items-center gap-0.5 hover:underline"
                style={{ color: "#7c3aed" }}
                onClick={() => onNavigate("lab")}
                data-ocid="director.charts.breakdown_link"
              >
                View Details <ArrowRight size={12} />
              </button>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* ── Quick Nav + Activity ── */}
      <section
        className="grid grid-cols-1 lg:grid-cols-5 gap-4"
        data-ocid="director.bottom.section"
      >
        {/* Quick nav — 3 cols on desktop */}
        <Card
          className="border-0 lg:col-span-3"
          style={{ boxShadow: "0 2px 12px rgba(26,58,107,0.08)" }}
        >
          <CardHeader className="pb-2 pt-5">
            <CardTitle
              className="text-sm font-bold"
              style={{ color: "#1a3a6b" }}
            >
              Quick Navigation
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0 pb-5">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {quickNavLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <button
                    type="button"
                    key={link.page}
                    data-ocid={`director.${link.page}.link`}
                    onClick={() => onNavigate(link.page)}
                    className="text-left p-4 rounded-xl border transition-all duration-150 group hover:shadow-md bee-card-hover"
                    style={{
                      backgroundColor: link.bg,
                      borderColor: link.border,
                    }}
                  >
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center mb-3"
                      style={{ backgroundColor: `${link.color}18` }}
                    >
                      <Icon size={18} style={{ color: link.color }} />
                    </div>
                    <p className="text-xs font-bold text-gray-800 leading-tight mb-1">
                      {link.label}
                    </p>
                    <p className="text-xs text-gray-500 leading-tight mb-2">
                      {link.desc}
                    </p>
                    <div
                      className="flex items-center gap-1"
                      style={{ color: link.color }}
                    >
                      <span className="text-xs font-semibold">Open</span>
                      <ArrowRight
                        size={11}
                        className="group-hover:translate-x-0.5 transition-transform"
                      />
                    </div>
                  </button>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity — timeline style */}
        <Card
          className="border-0 lg:col-span-2"
          style={{ boxShadow: "0 2px 12px rgba(26,58,107,0.08)" }}
        >
          <CardHeader className="pb-2 pt-5">
            <div className="flex items-center justify-between">
              <CardTitle
                className="text-sm font-bold"
                style={{ color: "#1a3a6b" }}
              >
                Recent Activity
              </CardTitle>
              <Badge
                variant="outline"
                className="text-xs border-emerald-200 text-emerald-700"
              >
                <Star size={9} className="mr-1" /> Live
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="pt-0 pb-5">
            <div className="relative activity-timeline">
              {recentActivity.map((item, idx) => {
                const badge =
                  activityBadgeStyle[item.type] ?? activityBadgeStyle.new;
                const dotColor = activityColors[item.type] ?? "#0284c7";
                return (
                  <div
                    key={item.text}
                    data-ocid={`director.activity.item.${idx + 1}`}
                    className="flex items-start gap-3 pb-4 relative"
                  >
                    {/* Timeline dot */}
                    <div
                      className="w-4 h-4 rounded-full flex-shrink-0 mt-0.5 ring-2 ring-white z-10"
                      style={{ backgroundColor: dotColor }}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-gray-700 leading-snug font-medium mb-1">
                        {item.text}
                      </p>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span
                          className={`text-xs px-2 py-0.5 rounded-full font-semibold ${badge.cls}`}
                        >
                          {badge.label}
                        </span>
                        <span className="text-xs text-gray-400">
                          {item.time}
                        </span>
                        <span className="text-xs text-gray-400">
                          · {item.user}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}

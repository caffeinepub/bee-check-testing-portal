import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  AlertTriangle,
  ArrowRight,
  CheckCircle,
  Clock,
  FileText,
  Package,
  ShoppingCart,
  Target,
  TestTube,
  TrendingDown,
  TrendingUp,
  XCircle,
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

// 2nd Check Test data
const secondCheckKpis = [
  {
    label: "Total Cases",
    value: 7,
    color: "#1a3a6b",
    bg: "#eff6ff",
    icon: FileText,
  },
  {
    label: "Pass",
    value: 3,
    color: "#059669",
    bg: "#ecfdf5",
    icon: CheckCircle,
  },
  { label: "Fail", value: 1, color: "#dc2626", bg: "#fef2f2", icon: XCircle },
  {
    label: "In Progress",
    value: 2,
    color: "#ea580c",
    bg: "#fff7ed",
    icon: Clock,
  },
  {
    label: "Awaiting CO Approval",
    value: 1,
    color: "#7c3aed",
    bg: "#f5f3ff",
    icon: AlertTriangle,
  },
];

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

export default function DirectorDashboard({ onNavigate }: Props) {
  return (
    <div className="space-y-6 pb-8">
      {/* Procurement KPI Row */}
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

      {/* Testing KPI Row */}
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

      {/* 2nd Check Test Results & Report */}
      <section data-ocid="director.secondcheck.section">
        <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3 flex items-center gap-2">
          <span
            className="w-3 h-3 rounded-sm inline-block"
            style={{ backgroundColor: "#7c3aed" }}
          />
          2nd Check Test — Results &amp; Report
        </p>
        <Card
          className="border-0"
          style={{
            boxShadow: "0 2px 12px rgba(26,58,107,0.08)",
            borderTop: "3px solid #7c3aed",
          }}
        >
          <CardContent className="pt-5 pb-5">
            {/* Summary KPI Row */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-5">
              {secondCheckKpis.map((kpi) => {
                const Icon = kpi.icon;
                return (
                  <div
                    key={kpi.label}
                    className="flex flex-col items-center justify-center rounded-xl py-3 px-2 text-center"
                    style={{
                      backgroundColor: kpi.bg,
                      border: `1.5px solid ${kpi.color}30`,
                    }}
                  >
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center mb-1.5"
                      style={{ backgroundColor: `${kpi.color}18` }}
                    >
                      <Icon size={15} style={{ color: kpi.color }} />
                    </div>
                    <span
                      className="text-2xl font-bold leading-none"
                      style={{ color: kpi.color }}
                    >
                      {kpi.value}
                    </span>
                    <span className="text-xs font-semibold text-gray-500 mt-1 leading-tight">
                      {kpi.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Charts */}
      <section
        className="grid grid-cols-1 md:grid-cols-2 gap-4"
        data-ocid="director.charts.section"
      >
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
    </div>
  );
}

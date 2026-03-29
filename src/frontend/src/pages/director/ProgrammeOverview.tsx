import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Award,
  BarChart3,
  BookOpen,
  Building2,
  CheckCircle,
  FileText,
  Layers,
  MapPin,
  Package,
  Star,
  TrendingUp,
  Zap,
} from "lucide-react";
import {
  Bar,
  BarChart,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const programmeStats = [
  {
    label: "Appliance Categories",
    value: "12",
    icon: Layers,
    color: "#1a3a6b",
    bg: "#eff6ff",
  },
  {
    label: "Registered Manufacturers",
    value: "148",
    icon: Building2,
    color: "#0284c7",
    bg: "#f0f9ff",
  },
  {
    label: "Registered Models",
    value: "2,340",
    icon: Package,
    color: "#059669",
    bg: "#ecfdf5",
  },
  {
    label: "States/UTs Covered",
    value: "36",
    icon: MapPin,
    color: "#7c3aed",
    bg: "#f5f3ff",
  },
  {
    label: "Energy Labels Issued",
    value: "1,82,400",
    icon: Award,
    color: "#d97706",
    bg: "#fffbeb",
  },
  {
    label: "Reports Published",
    value: "387",
    icon: FileText,
    color: "#db2777",
    bg: "#fdf2f8",
  },
];

const applianceCategories = [
  {
    name: "Room Air Conditioners",
    registered: 520,
    tested: 312,
    star: "1–5",
    status: "Active",
  },
  {
    name: "Refrigerators",
    registered: 440,
    tested: 278,
    star: "1–5",
    status: "Active",
  },
  {
    name: "Ceiling Fans",
    registered: 310,
    tested: 198,
    star: "1–5",
    status: "Active",
  },
  {
    name: "Colour TVs",
    registered: 290,
    tested: 145,
    star: "1–5",
    status: "Active",
  },
  {
    name: "Washing Machines",
    registered: 260,
    tested: 162,
    star: "1–5",
    status: "Active",
  },
  {
    name: "Direct Cool Refrigerators",
    registered: 210,
    tested: 134,
    star: "2–5",
    status: "Active",
  },
  {
    name: "Frost Free Refrigerators",
    registered: 180,
    tested: 110,
    star: "1–5",
    status: "Active",
  },
  {
    name: "Distribution Transformers",
    registered: 95,
    tested: 60,
    star: "1–5",
    status: "Active",
  },
  {
    name: "Geysers (Water Heaters)",
    registered: 140,
    tested: 88,
    star: "1–5",
    status: "Active",
  },
  {
    name: "LED Lights",
    registered: 175,
    tested: 96,
    star: "1–5",
    status: "Active",
  },
  { name: "Pumps", registered: 88, tested: 42, star: "1–5", status: "Active" },
  {
    name: "Computers (Laptops/Desktops)",
    registered: 62,
    tested: 28,
    star: "1–5",
    status: "Active",
  },
];

const categoryChartData = applianceCategories.slice(0, 8).map((c) => ({
  name: c.name.length > 16 ? `${c.name.slice(0, 16)}…` : c.name,
  registered: c.registered,
  tested: c.tested,
}));

const milestones = [
  {
    year: "2006",
    event: "BEE S&L Programme launched under Energy Conservation Act 2001",
    done: true,
  },
  {
    year: "2009",
    event:
      "Star Rating label made mandatory for Room ACs and Frost Free Refrigerators",
    done: true,
  },
  {
    year: "2014",
    event:
      "Programme expanded to 9 appliance categories including ceiling fans and TVs",
    done: true,
  },
  {
    year: "2018",
    event:
      "Online portal introduced for manufacturer registration and label management",
    done: true,
  },
  {
    year: "2021",
    event: "BEE Check Testing Portal launched for end-to-end digital workflow",
    done: true,
  },
  {
    year: "2024",
    event:
      "12 categories covered; 2nd Check Test workflow and Compliance Officer role added",
    done: true,
  },
  {
    year: "2025",
    event:
      "Pan-India State-wise compliance tracking and Financial Monitoring module live",
    done: true,
  },
  {
    year: "2026",
    event:
      "Expansion to 15 categories including industrial equipment and HVAC systems",
    done: false,
  },
];

const stateCompliance = [
  { state: "Maharashtra", models: 312, tested: 245, compliance: 94 },
  { state: "Gujarat", models: 278, tested: 198, compliance: 89 },
  { state: "Tamil Nadu", models: 265, tested: 201, compliance: 92 },
  { state: "Karnataka", models: 241, tested: 175, compliance: 87 },
  { state: "Delhi NCT", models: 198, tested: 165, compliance: 96 },
  { state: "Uttar Pradesh", models: 175, tested: 128, compliance: 82 },
  { state: "Rajasthan", models: 142, tested: 98, compliance: 78 },
  { state: "West Bengal", models: 135, tested: 102, compliance: 85 },
];

export default function ProgrammeOverview() {
  return (
    <div className="space-y-6 pb-8">
      {/* Programme Header */}
      <div
        className="rounded-2xl p-6"
        style={{
          background: "linear-gradient(135deg, #1a3a6b 0%, #2563eb 100%)",
          boxShadow: "0 4px 24px rgba(26,58,107,0.18)",
        }}
      >
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-white/15 flex items-center justify-center flex-shrink-0">
            <Zap size={24} className="text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h2 className="text-xl font-bold text-white">
                Standards &amp; Labeling (S&amp;L) Programme
              </h2>
              <Badge className="bg-white/20 text-white border-0 text-xs">
                Active
              </Badge>
            </div>
            <p className="text-blue-100 text-sm leading-relaxed max-w-3xl">
              The Bureau of Energy Efficiency (BEE) S&amp;L Programme mandates
              minimum energy performance standards and star-rating labels for
              appliances sold in India. The BEE Check Testing Portal automates
              the end-to-end workflow — from sample procurement and lab testing
              to compliance verification and energy label publication — across
              all 36 states and union territories.
            </p>
            <div className="flex items-center gap-4 mt-3">
              <span className="text-blue-200 text-xs flex items-center gap-1">
                <BookOpen size={12} /> Energy Conservation Act, 2001
              </span>
              <span className="text-blue-200 text-xs flex items-center gap-1">
                <Star size={12} /> 1–5 Star Rating Scale
              </span>
              <span className="text-blue-200 text-xs flex items-center gap-1">
                <TrendingUp size={12} /> FY 2024–25
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Programme KPI Stats */}
      <section>
        <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3 flex items-center gap-2">
          <span
            className="w-3 h-3 rounded-sm inline-block"
            style={{ backgroundColor: "#1a3a6b" }}
          />
          Programme at a Glance
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {programmeStats.map((stat) => {
            const Icon = stat.icon;
            return (
              <Card
                key={stat.label}
                className="border-0"
                style={{ boxShadow: "0 2px 10px rgba(26,58,107,0.07)" }}
              >
                <CardContent className="pt-4 pb-4 px-4 flex flex-col items-center text-center">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center mb-2"
                    style={{ backgroundColor: stat.bg }}
                  >
                    <Icon size={18} style={{ color: stat.color }} />
                  </div>
                  <p
                    className="text-xl font-bold leading-none mb-1"
                    style={{ color: stat.color }}
                  >
                    {stat.value}
                  </p>
                  <p className="text-xs font-semibold text-gray-500 leading-tight text-center">
                    {stat.label}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      {/* Appliance Categories + Chart */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Category Table */}
        <Card
          className="border-0"
          style={{
            boxShadow: "0 2px 12px rgba(26,58,107,0.08)",
            borderTop: "3px solid #1a3a6b",
          }}
        >
          <CardHeader className="pb-2 pt-5">
            <CardTitle
              className="text-sm font-bold"
              style={{ color: "#1a3a6b" }}
            >
              Appliance Categories Under S&amp;L Programme
            </CardTitle>
            <p className="text-xs text-gray-400">
              12 mandatory categories · FY 2024–25
            </p>
          </CardHeader>
          <CardContent className="pt-0 pb-4">
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr style={{ backgroundColor: "#f8fafc" }}>
                    <th className="text-left px-3 py-2 font-semibold text-gray-500 rounded-tl-lg">
                      Category
                    </th>
                    <th className="text-center px-3 py-2 font-semibold text-gray-500">
                      Registered
                    </th>
                    <th className="text-center px-3 py-2 font-semibold text-gray-500">
                      Tested
                    </th>
                    <th className="text-center px-3 py-2 font-semibold text-gray-500">
                      Stars
                    </th>
                    <th className="text-center px-3 py-2 font-semibold text-gray-500 rounded-tr-lg">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {applianceCategories.map((cat, idx) => (
                    <tr
                      key={cat.name}
                      className="border-b border-gray-50"
                      style={
                        idx % 2 === 0 ? { backgroundColor: "#fafbfc" } : {}
                      }
                    >
                      <td className="px-3 py-2 font-medium text-gray-700">
                        {cat.name}
                      </td>
                      <td
                        className="px-3 py-2 text-center font-semibold"
                        style={{ color: "#1a3a6b" }}
                      >
                        {cat.registered}
                      </td>
                      <td
                        className="px-3 py-2 text-center font-semibold"
                        style={{ color: "#059669" }}
                      >
                        {cat.tested}
                      </td>
                      <td className="px-3 py-2 text-center text-gray-500">
                        {cat.star}
                      </td>
                      <td className="px-3 py-2 text-center">
                        <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700">
                          {cat.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Bar Chart */}
        <Card
          className="border-0"
          style={{
            boxShadow: "0 2px 12px rgba(26,58,107,0.08)",
            borderTop: "3px solid #059669",
          }}
        >
          <CardHeader className="pb-2 pt-5">
            <CardTitle
              className="text-sm font-bold"
              style={{ color: "#1a3a6b" }}
            >
              Registered vs Tested Models by Category
            </CardTitle>
            <p className="text-xs text-gray-400">
              Top 8 categories · cumulative FY 2024–25
            </p>
          </CardHeader>
          <CardContent className="pt-0 pb-4">
            <ResponsiveContainer width="100%" height={290}>
              <BarChart
                data={categoryChartData}
                layout="vertical"
                barSize={10}
                barGap={3}
                margin={{ left: 8, right: 16, top: 4, bottom: 4 }}
              >
                <XAxis
                  type="number"
                  tick={{ fontSize: 10, fill: "#9ca3af" }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  dataKey="name"
                  type="category"
                  tick={{ fontSize: 10, fill: "#6b7280" }}
                  axisLine={false}
                  tickLine={false}
                  width={96}
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
                  dataKey="registered"
                  name="Registered"
                  fill="#1a3a6b"
                  radius={[0, 4, 4, 0]}
                />
                <Bar
                  dataKey="tested"
                  name="Tested"
                  fill="#059669"
                  radius={[0, 4, 4, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
            <div className="flex gap-5 mt-2">
              <span className="flex items-center gap-1.5 text-xs text-gray-500">
                <span
                  className="w-3 h-2 rounded-sm inline-block"
                  style={{ background: "#1a3a6b" }}
                />{" "}
                Registered
              </span>
              <span className="flex items-center gap-1.5 text-xs text-gray-500">
                <span
                  className="w-3 h-2 rounded-sm inline-block"
                  style={{ background: "#059669" }}
                />{" "}
                Tested
              </span>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Programme Timeline + State Compliance */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Timeline */}
        <Card
          className="border-0"
          style={{
            boxShadow: "0 2px 12px rgba(26,58,107,0.08)",
            borderTop: "3px solid #7c3aed",
          }}
        >
          <CardHeader className="pb-2 pt-5">
            <CardTitle
              className="text-sm font-bold"
              style={{ color: "#1a3a6b" }}
            >
              Programme Milestones
            </CardTitle>
            <p className="text-xs text-gray-400">
              Key events from 2006 to present
            </p>
          </CardHeader>
          <CardContent className="pt-0 pb-5">
            <div className="relative pl-6">
              {milestones.map((m, idx) => (
                <div key={m.year} className="relative pb-4 last:pb-0">
                  {idx < milestones.length - 1 && (
                    <div
                      className="absolute left-[-16px] top-5 bottom-0 w-0.5"
                      style={{
                        backgroundColor: m.done ? "#e2e8f0" : "#e2e8f0",
                      }}
                    />
                  )}
                  <div
                    className="absolute left-[-20px] top-0.5 w-4 h-4 rounded-full flex items-center justify-center ring-2 ring-white"
                    style={{
                      backgroundColor: m.done
                        ? idx === milestones.length - 2
                          ? "#1a3a6b"
                          : "#059669"
                        : "#e5e7eb",
                    }}
                  >
                    {m.done ? (
                      <CheckCircle size={10} className="text-white" />
                    ) : (
                      <span className="w-1.5 h-1.5 rounded-full bg-gray-300" />
                    )}
                  </div>
                  <div className="flex items-start gap-3">
                    <span
                      className="text-xs font-bold px-2 py-0.5 rounded-md flex-shrink-0 mt-0.5"
                      style={{
                        backgroundColor: m.done ? "#eff6ff" : "#f3f4f6",
                        color: m.done ? "#1a3a6b" : "#9ca3af",
                      }}
                    >
                      {m.year}
                    </span>
                    <p className="text-xs text-gray-600 leading-relaxed">
                      {m.event}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* State Compliance Table */}
        <Card
          className="border-0"
          style={{
            boxShadow: "0 2px 12px rgba(26,58,107,0.08)",
            borderTop: "3px solid #d97706",
          }}
        >
          <CardHeader className="pb-2 pt-5">
            <div className="flex items-center justify-between">
              <CardTitle
                className="text-sm font-bold"
                style={{ color: "#1a3a6b" }}
              >
                Top State-wise Compliance Performance
              </CardTitle>
              <Badge
                variant="outline"
                className="text-xs border-amber-200 text-amber-700"
              >
                <BarChart3 size={9} className="mr-1" /> FY 2024–25
              </Badge>
            </div>
            <p className="text-xs text-gray-400">
              Models tested vs registered; compliance rate
            </p>
          </CardHeader>
          <CardContent className="pt-0 pb-4">
            <div className="space-y-3">
              {stateCompliance.map((s) => (
                <div key={s.state}>
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <MapPin size={11} style={{ color: "#1a3a6b" }} />
                      <span className="text-xs font-semibold text-gray-700">
                        {s.state}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-gray-400">
                        {s.tested}/{s.models} models
                      </span>
                      <span
                        className="text-xs font-bold px-2 py-0.5 rounded-full"
                        style={{
                          backgroundColor:
                            s.compliance >= 90
                              ? "#ecfdf5"
                              : s.compliance >= 80
                                ? "#fffbeb"
                                : "#fef2f2",
                          color:
                            s.compliance >= 90
                              ? "#059669"
                              : s.compliance >= 80
                                ? "#d97706"
                                : "#dc2626",
                        }}
                      >
                        {s.compliance}%
                      </span>
                    </div>
                  </div>
                  <div className="h-1.5 rounded-full overflow-hidden bg-gray-100">
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${s.compliance}%`,
                        backgroundColor:
                          s.compliance >= 90
                            ? "#059669"
                            : s.compliance >= 80
                              ? "#d97706"
                              : "#dc2626",
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}

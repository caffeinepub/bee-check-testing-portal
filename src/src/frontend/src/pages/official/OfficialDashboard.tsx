import { Card, CardContent } from "@/components/ui/card";
import {
  CheckCircle,
  Clock,
  FileText,
  FlaskConical,
  XCircle,
} from "lucide-react";
import { mockReports, testReportEntries } from "../../data/mockData";

interface Props {
  onNavigate: (page: string) => void;
}

export default function OfficialDashboard({ onNavigate }: Props) {
  const total = mockReports.length;
  const pending = mockReports.filter(
    (r) => r.reviewStatus === "Pending",
  ).length;
  const approved = mockReports.filter(
    (r) => r.reviewStatus === "Approved",
  ).length;
  const rejected = mockReports.filter(
    (r) => r.reviewStatus === "Rejected",
  ).length;

  const kpis = [
    {
      label: "Total Reports",
      value: total,
      icon: <FileText className="text-blue-600" size={22} />,
      color: "#dbeafe",
      nav: "review",
    },
    {
      label: "Pending Review",
      value: pending,
      icon: <Clock className="text-yellow-600" size={22} />,
      color: "#fef3c7",
      nav: "review",
    },
    {
      label: "Approved",
      value: approved,
      icon: <CheckCircle className="text-green-600" size={22} />,
      color: "#dcfce7",
      nav: "approved",
    },
    {
      label: "Rejected",
      value: rejected,
      icon: <XCircle className="text-red-600" size={22} />,
      color: "#fee2e2",
      nav: "rejected",
    },
  ];

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-bold" style={{ color: "#1a3a6b" }}>
          BEE Official Dashboard
        </h2>
        <p className="text-gray-500 text-sm">
          Review and manage test reports from laboratories
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        {kpis.map((kpi) => (
          <button
            type="button"
            key={kpi.label}
            data-ocid={`official.kpi_${kpi.label.toLowerCase().replace(/ /g, "_")}.card`}
            onClick={() => onNavigate(kpi.nav)}
            className="text-left"
          >
            <Card className="hover:shadow-md transition-shadow cursor-pointer border border-gray-200">
              <CardContent className="pt-4 pb-4">
                <div
                  className="p-2 rounded-lg w-fit mb-2"
                  style={{ backgroundColor: kpi.color }}
                >
                  {kpi.icon}
                </div>
                <p className="text-2xl font-bold text-gray-800">{kpi.value}</p>
                <p className="text-xs text-gray-500 mt-1">{kpi.label}</p>
              </CardContent>
            </Card>
          </button>
        ))}
      </div>

      {/* Pending Reports List */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4">
        <h3 className="font-semibold text-gray-800 mb-3 text-sm">
          Reports Pending Review
        </h3>
        <div className="space-y-2">
          {mockReports
            .filter((r) => r.reviewStatus === "Pending")
            .map((r, idx) => (
              <div
                key={r.id}
                data-ocid={`official.pending.item.${idx + 1}`}
                className="flex items-center justify-between p-3 rounded border border-yellow-100 bg-yellow-50"
              >
                <div>
                  <p className="text-sm font-medium">
                    {r.brandName} {r.modelNumber}
                  </p>
                  <p className="text-xs text-gray-500">
                    {r.categoryName} | {r.labName} | Submitted: {r.submittedAt}
                  </p>
                </div>
                <span
                  className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                    r.result === "Pass"
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {r.result}
                </span>
              </div>
            ))}
        </div>
      </div>

      {/* Lab Results forwarded from Test Lab */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4 mt-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-gray-800 text-sm flex items-center gap-2">
            <FlaskConical size={16} className="text-indigo-600" />
            Lab Results Forwarded for Verification
          </h3>
          <button
            type="button"
            data-ocid="official.labresults.view_all_link"
            onClick={() => onNavigate("labresults")}
            className="text-xs text-blue-600 hover:underline"
          >
            View All →
          </button>
        </div>
        <div className="space-y-2">
          {testReportEntries
            .filter((r) => r.beeVerificationStatus === "Pending")
            .map((r, idx) => (
              <div
                key={r.sampleId}
                data-ocid={`official.labresults_pending.item.${idx + 1}`}
                className="flex items-center justify-between p-3 rounded border border-indigo-100 bg-indigo-50"
              >
                <div>
                  <p className="text-sm font-medium">
                    {r.brandName} {r.modelNumber}
                  </p>
                  <p className="text-xs text-gray-500">
                    {r.categoryName} | {r.labName} | {r.date}
                  </p>
                </div>
                <span
                  className={`text-xs px-2 py-0.5 rounded-full font-semibold border ${
                    r.finalStatus === "Pass"
                      ? "bg-green-100 text-green-800 border-green-300"
                      : r.finalStatus === "Fail"
                        ? "bg-red-100 text-red-800 border-red-300"
                        : "bg-orange-100 text-orange-800 border-orange-300"
                  }`}
                >
                  {r.finalStatus === "Pass"
                    ? "✓ Pass"
                    : r.finalStatus === "Fail"
                      ? "✗ Fail"
                      : "⚠ NFT"}
                </span>
              </div>
            ))}
          {testReportEntries.filter(
            (r) => r.beeVerificationStatus === "Pending",
          ).length === 0 && (
            <p
              className="text-sm text-gray-400 text-center py-3"
              data-ocid="official.labresults.empty_state"
            >
              No pending lab results to verify.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

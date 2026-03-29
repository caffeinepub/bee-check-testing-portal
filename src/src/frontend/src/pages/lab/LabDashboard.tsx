import { Card, CardContent } from "@/components/ui/card";
import {
  Calendar,
  CheckCircle2,
  Clock,
  FileText,
  Package,
  RotateCcw,
  TestTube,
  Truck,
  XCircle,
} from "lucide-react";
import {
  LAB_STATUS_LABELS,
  type LabTrackingStatus,
  labSamples,
  revertedFromBEE,
  testReportEntries,
} from "../../data/mockData";

interface Props {
  onNavigate: (page: string) => void;
}

export default function LabDashboard({ onNavigate }: Props) {
  const kpis = [
    {
      label: "In-Transit",
      value: labSamples.filter((s) => s.currentStatus === "InTransit").length,
      icon: <Truck className="text-orange-600" size={22} />,
      color: "#ffedd5",
      nav: "samples",
    },
    {
      label: "Under Testing",
      value: labSamples.filter((s) => s.currentStatus === "UnderTesting")
        .length,
      icon: <TestTube className="text-blue-600" size={22} />,
      color: "#dbeafe",
      nav: "samples",
    },
    {
      label: "Test Done",
      value: labSamples.filter((s) => s.currentStatus === "TestDone").length,
      icon: <Package className="text-green-600" size={22} />,
      color: "#dcfce7",
      nav: "samples",
    },
    {
      label: "Test Scheduled",
      value: labSamples.filter((s) => s.currentStatus === "TestScheduled")
        .length,
      icon: <Calendar className="text-purple-600" size={22} />,
      color: "#f3e8ff",
      nav: "samples",
    },
    {
      label: "Invoice Raised",
      value: labSamples.filter((s) => s.currentStatus === "InvoiceRaised")
        .length,
      icon: <Clock className="text-teal-600" size={22} />,
      color: "#ccfbf1",
      nav: "samples",
    },
    {
      label: "Reverted from BEE",
      value: revertedFromBEE.length,
      icon: <RotateCcw className="text-red-600" size={22} />,
      color: "#fee2e2",
      nav: "revert",
    },
    {
      label: "Test Reports",
      value: testReportEntries.length,
      icon: <FileText className="text-indigo-600" size={22} />,
      color: "#e0e7ff",
      nav: "testreport",
    },
  ];

  const statusColorClass = (status: LabTrackingStatus): string => {
    const map: Partial<Record<LabTrackingStatus, string>> = {
      InTransit: "bg-orange-100 text-orange-800",
      ReachedLab: "bg-blue-100 text-blue-800",
      TestScheduled: "bg-purple-100 text-purple-800",
      UnderTesting: "bg-yellow-100 text-yellow-800",
      TestDone: "bg-teal-100 text-teal-800",
      Pass: "bg-green-100 text-green-800",
      Fail: "bg-red-100 text-red-800",
      NFT: "bg-red-100 text-red-800",
      InvoiceRaised: "bg-green-100 text-green-800",
    };
    return map[status] ?? "bg-gray-100 text-gray-700";
  };

  const passCount = testReportEntries.filter(
    (e) => e.finalStatus === "Pass",
  ).length;
  const failCount = testReportEntries.filter(
    (e) => e.finalStatus === "Fail",
  ).length;
  const nftCount = testReportEntries.filter(
    (e) => e.finalStatus === "NFT",
  ).length;

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-bold" style={{ color: "#1a3a6b" }}>
          Lab Dashboard
        </h2>
        <p className="text-gray-500 text-sm">
          NABL Lab Delhi — Check Testing Overview
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 mb-6">
        {kpis.map((kpi) => (
          <button
            type="button"
            key={kpi.label}
            data-ocid={`lab.kpi_${kpi.label.toLowerCase().replace(/ /g, "_")}.card`}
            onClick={() => onNavigate(kpi.nav)}
            className="text-left"
          >
            <Card className="hover:shadow-md transition-shadow border border-gray-200">
              <CardContent className="pt-3 pb-3">
                <div
                  className="p-2 rounded-lg w-fit mb-2"
                  style={{ backgroundColor: kpi.color }}
                >
                  {kpi.icon}
                </div>
                <p className="text-2xl font-bold">{kpi.value}</p>
                <p className="text-xs text-gray-500 mt-0.5 leading-tight">
                  {kpi.label}
                </p>
              </CardContent>
            </Card>
          </button>
        ))}
      </div>

      {/* Test Report Summary */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-3">
          <CheckCircle2 className="text-green-600" size={24} />
          <div>
            <p className="text-2xl font-bold text-green-700">{passCount}</p>
            <p className="text-xs text-green-600 font-medium">Pass</p>
          </div>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3">
          <XCircle className="text-red-600" size={24} />
          <div>
            <p className="text-2xl font-bold text-red-700">{failCount}</p>
            <p className="text-xs text-red-600 font-medium">Fail</p>
          </div>
        </div>
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 flex items-center gap-3">
          <Package className="text-orange-600" size={24} />
          <div>
            <p className="text-2xl font-bold text-orange-700">{nftCount}</p>
            <p className="text-xs text-orange-600 font-medium">NFT</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4">
        <h3 className="font-semibold text-gray-800 mb-3 text-sm">
          Recent Sample Activity
        </h3>
        <div className="space-y-2">
          {labSamples.map((s) => (
            <div
              key={s.id}
              className="flex justify-between items-center p-2 rounded border border-gray-100 hover:bg-gray-50"
            >
              <div>
                <p className="text-sm font-medium">
                  {s.brandName} — {s.modelNumber}
                </p>
                <p className="text-xs text-gray-500">
                  {s.categoryName} | {s.state}
                </p>
              </div>
              <span
                className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusColorClass(s.currentStatus)}`}
              >
                {LAB_STATUS_LABELS[s.currentStatus]}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

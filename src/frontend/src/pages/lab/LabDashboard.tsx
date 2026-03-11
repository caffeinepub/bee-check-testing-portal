import { Card, CardContent } from "@/components/ui/card";
import { Calendar, Clock, Package, TestTube, Truck } from "lucide-react";
import { mockSamples } from "../../data/mockData";

interface Props {
  onNavigate: (page: string) => void;
}

export default function LabDashboard({ onNavigate }: Props) {
  const labId = 1;
  const mySamples = mockSamples.filter((s) => s.labId === labId);

  const kpis = [
    {
      label: "Sample Received",
      value: mySamples.filter((s) =>
        [
          "SampleReceived",
          "FitForTest",
          "TestScheduled",
          "InTesting",
          "SampleTested",
          "ReportUploaded",
        ].includes(s.status),
      ).length,
      icon: <Package className="text-blue-600" size={22} />,
      color: "#dbeafe",
      nav: "samples",
    },
    {
      label: "Sample Tested",
      value: mySamples.filter((s) =>
        ["SampleTested", "ReportUploaded", "Approved", "Rejected"].includes(
          s.status,
        ),
      ).length,
      icon: <TestTube className="text-green-600" size={22} />,
      color: "#dcfce7",
      nav: "samples",
    },
    {
      label: "Pending Test",
      value: mySamples.filter((s) =>
        ["SampleReceived", "FitForTest"].includes(s.status),
      ).length,
      icon: <Clock className="text-yellow-600" size={22} />,
      color: "#fef3c7",
      nav: "update",
    },
    {
      label: "In Transit",
      value: mySamples.filter((s) => s.status === "InTransit").length,
      icon: <Truck className="text-orange-600" size={22} />,
      color: "#ffedd5",
      nav: "samples",
    },
    {
      label: "Test Scheduled",
      value: mySamples.filter((s) => s.status === "TestScheduled").length,
      icon: <Calendar className="text-purple-600" size={22} />,
      color: "#f3e8ff",
      nav: "samples",
    },
  ];

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-bold" style={{ color: "#1a3a6b" }}>
          Lab Dashboard
        </h2>
        <p className="text-gray-500 text-sm">
          NABL Lab Delhi - Check Testing Overview
        </p>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 mb-6">
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
                <p className="text-xs text-gray-500 mt-0.5">{kpi.label}</p>
              </CardContent>
            </Card>
          </button>
        ))}
      </div>
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4">
        <h3 className="font-semibold text-gray-800 mb-3 text-sm">
          Recent Sample Activity
        </h3>
        <div className="space-y-2">
          {mySamples.map((s) => (
            <div
              key={s.id}
              className="flex justify-between items-center p-2 rounded border border-gray-100 hover:bg-gray-50"
            >
              <div>
                <p className="text-sm font-medium">
                  {s.brandName} - {s.modelNumber}
                </p>
                <p className="text-xs text-gray-500">
                  {s.categoryName} | {s.state}
                </p>
              </div>
              <span
                className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                  s.status === "Approved"
                    ? "bg-green-100 text-green-800"
                    : s.status === "InTesting"
                      ? "bg-blue-100 text-blue-800"
                      : s.status === "InTransit"
                        ? "bg-orange-100 text-orange-800"
                        : "bg-gray-100 text-gray-700"
                }`}
              >
                {s.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

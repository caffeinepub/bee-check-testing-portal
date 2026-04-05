import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  AlertTriangle,
  CalendarCheck,
  CheckCircle2,
  Clock,
  Send,
} from "lucide-react";
import { useSecondCheck } from "../../contexts/SecondCheckContext";

export default function ComplianceOfficerDashboard({
  onNavigate,
}: { onNavigate?: (page: string) => void }) {
  const { failedCases, secondCheckSamples } = useSecondCheck();

  const pendingApprovals = secondCheckSamples.filter(
    (s) => s.status === "ProposedDate",
  ).length;
  const completed = secondCheckSamples.filter(
    (s) => s.status === "InvoiceRaised",
  ).length;
  const pendingCases = failedCases.filter((fc) => !fc.dispatched).length;
  const dispatchedCases = failedCases.filter((fc) => fc.dispatched).length;

  const kpis = [
    {
      label: "Total Failed Cases",
      value: failedCases.length,
      icon: <AlertTriangle size={20} />,
      color: "#dc2626",
      bg: "#fef2f2",
      page: "failedcases",
    },
    {
      label: "Pending 2nd Check",
      value: pendingCases,
      icon: <Clock size={20} />,
      color: "#d97706",
      bg: "#fffbeb",
      page: "initiation",
    },
    {
      label: "Dispatched to Purchasers",
      value: dispatchedCases,
      icon: <Send size={20} />,
      color: "#2563eb",
      bg: "#eff6ff",
      page: "initiation",
    },
    {
      label: "Pending Date Approvals",
      value: pendingApprovals,
      icon: <CalendarCheck size={20} />,
      color: "#7c3aed",
      bg: "#f5f3ff",
      page: "scheduling",
    },
    {
      label: "Completed",
      value: completed,
      icon: <CheckCircle2 size={20} />,
      color: "#059669",
      bg: "#ecfdf5",
      page: null,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold" style={{ color: "#1a3a6b" }}>
          Compliance Officer Dashboard
        </h1>
        <p className="text-sm text-gray-500 mt-0.5">
          Monitor failed test cases and manage 2nd Check Test workflow
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-5 gap-4">
        {kpis.map((kpi) => (
          <Card
            key={kpi.label}
            className={`border-0 shadow-sm ${
              kpi.page ? "cursor-pointer hover:shadow-md transition-shadow" : ""
            }`}
            onClick={() => kpi.page && onNavigate?.(kpi.page)}
          >
            <CardContent className="pt-5 pb-4 px-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-500 font-medium">
                    {kpi.label}
                  </p>
                  <p
                    className="text-3xl font-bold mt-1"
                    style={{ color: kpi.color }}
                  >
                    {kpi.value}
                  </p>
                </div>
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{ backgroundColor: kpi.bg, color: kpi.color }}
                >
                  {kpi.icon}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Action Cards */}
      <div className="grid grid-cols-3 gap-4">
        <button
          type="button"
          className="text-left p-5 rounded-xl border border-red-100 bg-red-50 hover:shadow-md transition-shadow cursor-pointer"
          onClick={() => onNavigate?.("failedcases")}
        >
          <div className="flex items-center gap-3 mb-2">
            <AlertTriangle size={20} className="text-red-600" />
            <h3 className="font-semibold text-red-800">Failed Cases</h3>
          </div>
          <p className="text-sm text-red-600">
            View all {failedCases.length} failed test cases
          </p>
          <Badge className="mt-3 bg-red-100 text-red-700 border-red-200 text-xs">
            {pendingCases} pending action
          </Badge>
        </button>

        <button
          type="button"
          className="text-left p-5 rounded-xl border border-blue-100 bg-blue-50 hover:shadow-md transition-shadow cursor-pointer"
          onClick={() => onNavigate?.("initiation")}
        >
          <div className="flex items-center gap-3 mb-2">
            <Send size={20} className="text-blue-600" />
            <h3 className="font-semibold text-blue-800">
              2nd Check Test Initiation
            </h3>
          </div>
          <p className="text-sm text-blue-600">
            Select and dispatch cases for 2nd check testing
          </p>
          {pendingCases > 0 && (
            <Badge className="mt-3 bg-blue-100 text-blue-700 border-blue-200 text-xs">
              {pendingCases} ready to initiate
            </Badge>
          )}
        </button>

        <button
          type="button"
          className="text-left p-5 rounded-xl border border-amber-100 bg-amber-50 hover:shadow-md transition-shadow cursor-pointer"
          onClick={() => onNavigate?.("scheduling")}
        >
          <div className="flex items-center gap-3 mb-2">
            <CalendarCheck size={20} className="text-amber-600" />
            <h3 className="font-semibold text-amber-800">
              Scheduling Approvals
            </h3>
          </div>
          <p className="text-sm text-amber-600">
            Approve test dates proposed by Labs
          </p>
          {pendingApprovals > 0 && (
            <Badge className="mt-3 bg-amber-100 text-amber-700 border-amber-200 text-xs">
              {pendingApprovals} awaiting approval
            </Badge>
          )}
        </button>
      </div>
    </div>
  );
}

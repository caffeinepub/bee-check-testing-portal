import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertTriangle,
  CheckCircle2,
  Clock,
  PlayCircle,
  Send,
} from "lucide-react";
import { toast } from "sonner";
import { useSecondCheck } from "../../contexts/SecondCheckContext";

export default function ComplianceOfficerDashboard({
  onNavigate,
}: { onNavigate?: (page: string) => void }) {
  const {
    failedCases,
    secondCheckInitiated,
    initiateSecondCheck,
    secondCheckRequests,
    secondCheckSamples,
  } = useSecondCheck();

  const pendingApprovals = secondCheckSamples.filter(
    (s) => s.status === "ProposedDate",
  ).length;
  const completed = secondCheckSamples.filter(
    (s) => s.status === "InvoiceRaised",
  ).length;

  const handleInitiate = () => {
    initiateSecondCheck();
    toast.success(
      "2nd Check Test initiated! All failed cases dispatched to Purchasers.",
    );
  };

  const kpis = [
    {
      label: "Total Failed Cases",
      value: failedCases.length,
      icon: <AlertTriangle size={20} />,
      color: "#dc2626",
      bg: "#fef2f2",
    },
    {
      label: "2nd Check Initiated",
      value: secondCheckRequests.length,
      icon: <Send size={20} />,
      color: "#2563eb",
      bg: "#eff6ff",
    },
    {
      label: "Pending Date Approvals",
      value: pendingApprovals,
      icon: <Clock size={20} />,
      color: "#d97706",
      bg: "#fffbeb",
    },
    {
      label: "Completed",
      value: completed,
      icon: <CheckCircle2 size={20} />,
      color: "#059669",
      bg: "#ecfdf5",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: "#1a3a6b" }}>
            Compliance Officer Dashboard
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Monitor failed test cases and manage 2nd Check Test workflow
          </p>
        </div>
        <Button
          data-ocid="compliance.initiate_button"
          onClick={handleInitiate}
          disabled={secondCheckInitiated}
          className="flex items-center gap-2 px-6 py-3 text-white font-semibold text-base"
          style={{
            background: secondCheckInitiated
              ? undefined
              : "linear-gradient(135deg, #1a3a6b 0%, #2563eb 100%)",
          }}
        >
          <PlayCircle size={20} />
          {secondCheckInitiated
            ? "2nd Check Test Initiated"
            : "Initiate 2nd Check Test"}
        </Button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-4 gap-4">
        {kpis.map((kpi) => (
          <Card key={kpi.label} className="border-0 shadow-sm">
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

      {/* Initiation Banner */}
      {secondCheckInitiated && (
        <div
          className="flex items-center gap-3 px-5 py-3 rounded-xl border"
          style={{ backgroundColor: "#ecfdf5", borderColor: "#6ee7b7" }}
        >
          <CheckCircle2 size={20} className="text-green-600" />
          <p className="text-sm font-semibold text-green-700">
            2nd Check Test has been initiated. All {failedCases.length} failed
            cases have been dispatched to all 36 Purchaser logins.
          </p>
        </div>
      )}

      {/* Failed Cases Table */}
      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-3 border-b border-gray-100">
          <CardTitle
            className="text-base font-semibold"
            style={{ color: "#1a3a6b" }}
          >
            Failed Test Cases
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50">
                <TableHead className="w-10">#</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Brand</TableHead>
                <TableHead>Model</TableHead>
                <TableHead>Test Lab</TableHead>
                <TableHead>State</TableHead>
                <TableHead>Fail Date</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {failedCases.map((fc, idx) => (
                <TableRow
                  key={fc.id}
                  data-ocid={`compliance.failed_cases.item.${idx + 1}`}
                >
                  <TableCell className="text-gray-500 text-xs">
                    {idx + 1}
                  </TableCell>
                  <TableCell className="font-medium">{fc.category}</TableCell>
                  <TableCell>{fc.brandName}</TableCell>
                  <TableCell className="text-xs font-mono text-gray-600">
                    {fc.modelNumber}
                  </TableCell>
                  <TableCell className="text-xs">{fc.testLab}</TableCell>
                  <TableCell className="text-xs">{fc.state}</TableCell>
                  <TableCell className="text-xs">{fc.failDate}</TableCell>
                  <TableCell>
                    {fc.dispatched ? (
                      <Badge className="bg-green-100 text-green-700 border-green-200 text-xs">
                        Dispatched to Purchasers
                      </Badge>
                    ) : (
                      <Badge className="bg-yellow-100 text-yellow-700 border-yellow-200 text-xs">
                        Pending 2nd Check
                      </Badge>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Pending Scheduling Approvals shortcut */}
      {pendingApprovals > 0 && (
        <button
          type="button"
          className="w-full flex items-center justify-between px-5 py-4 rounded-xl border cursor-pointer hover:shadow-md transition-shadow text-left"
          style={{ backgroundColor: "#fffbeb", borderColor: "#fde68a" }}
          onClick={() => onNavigate?.("scheduling")}
        >
          <div className="flex items-center gap-3">
            <Clock size={20} className="text-amber-600" />
            <div>
              <p className="text-sm font-semibold text-amber-700">
                {pendingApprovals} Testing Date Proposal
                {pendingApprovals > 1 ? "s" : ""} Awaiting Your Approval
              </p>
              <p className="text-xs text-amber-600">
                Click to review and approve scheduling dates
              </p>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="border-amber-400 text-amber-700"
          >
            Review Now
          </Button>
        </button>
      )}
    </div>
  );
}

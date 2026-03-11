import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, Clock, FileText, RotateCcw, XCircle } from "lucide-react";
import { mockReports } from "../../data/mockData";

interface Props {
  onNavigate: (page: string) => void;
}

// ─── Workflow Diagram Component ─────────────────────────────────────────────

function WorkflowNode({
  label,
  icon,
  color = "navy",
  small = false,
}: {
  label: string;
  icon?: React.ReactNode;
  color?: "navy" | "green" | "red" | "amber" | "gray";
  small?: boolean;
}) {
  const bg: Record<string, string> = {
    navy: "#1a3a6b",
    green: "#15803d",
    red: "#b91c1c",
    amber: "#b45309",
    gray: "#4b5563",
  };
  return (
    <div
      className={`flex items-center gap-1.5 rounded px-3 ${small ? "py-1.5 text-xs" : "py-2 text-xs"} font-semibold text-white shadow-sm`}
      style={{
        backgroundColor: bg[color],
        minWidth: small ? 100 : 130,
        maxWidth: 180,
      }}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      <span className="leading-tight">{label}</span>
    </div>
  );
}

function DiamondNode({ label }: { label: string }) {
  return (
    <div className="flex flex-col items-center">
      <div
        className="flex items-center justify-center text-center font-bold text-white text-xs"
        style={{
          width: 110,
          height: 60,
          backgroundColor: "#1e40af",
          clipPath: "polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)",
          lineHeight: 1.2,
          padding: "0 18px",
        }}
      >
        {label}
      </div>
    </div>
  );
}

function Connector({
  label,
  color = "#6b7280",
}: { label?: string; color?: string }) {
  return (
    <div className="flex flex-col items-center">
      <div className="w-px h-4" style={{ backgroundColor: color }} />
      {label && (
        <span
          className="text-xs font-semibold px-1.5 py-0.5 rounded"
          style={{ color, fontSize: 10 }}
        >
          {label}
        </span>
      )}
      {label && <div className="w-px h-2" style={{ backgroundColor: color }} />}
      <div
        className="w-0 h-0"
        style={{
          borderLeft: "5px solid transparent",
          borderRight: "5px solid transparent",
          borderTop: `6px solid ${color}`,
        }}
      />
    </div>
  );
}

function HorizontalConnector({
  label,
  color = "#6b7280",
}: { label?: string; color?: string }) {
  return (
    <div className="flex items-center">
      <div
        className="h-px flex-1 min-w-[20px]"
        style={{ backgroundColor: color }}
      />
      {label && (
        <span
          className="text-xs font-bold px-1"
          style={{ color, fontSize: 10 }}
        >
          {label}
        </span>
      )}
      <div
        className="h-px flex-1 min-w-[20px]"
        style={{ backgroundColor: color }}
      />
      <div
        className="w-0 h-0"
        style={{
          borderTop: "5px solid transparent",
          borderBottom: "5px solid transparent",
          borderLeft: `6px solid ${color}`,
        }}
      />
    </div>
  );
}

function ReviewWorkflowDiagram() {
  return (
    <div
      className="rounded-xl border shadow-sm p-4 overflow-x-auto"
      style={{ backgroundColor: "#f0f4fb", borderColor: "#c7d6ee" }}
    >
      <h3 className="text-sm font-bold mb-4" style={{ color: "#1a3a6b" }}>
        Review Workflow — BEE Official Process Flow
      </h3>

      {/* Main vertical spine */}
      <div className="flex flex-col items-center gap-0 min-w-[600px]">
        {/* Step 1: Login */}
        <WorkflowNode
          label="BEE Official Login to Portal"
          icon={<FileText size={13} />}
        />
        <Connector />

        {/* Step 2: Dashboard */}
        <WorkflowNode label="Dashboard Displayed" />
        <Connector />

        {/* Step 3: View summary */}
        <WorkflowNode label="View Report Summary" />
        <Connector />

        {/* Step 4: Select report */}
        <WorkflowNode label="Select Assigned Report" />
        <Connector />

        {/* Step 5: Review */}
        <WorkflowNode label="Review Test Report (from Lab)" />
        <Connector />

        {/* Decision node */}
        <DiamondNode label="Decision" />

        {/* Three branches */}
        <div className="w-full flex items-start justify-center gap-0 mt-0">
          {/* Left branch: Approve */}
          <div className="flex-1 flex flex-col items-center">
            <div className="w-full flex items-center justify-end">
              <div
                className="h-px flex-1"
                style={{ backgroundColor: "#15803d" }}
              />
              <div
                className="w-0 h-0"
                style={{
                  borderTop: "5px solid transparent",
                  borderBottom: "5px solid transparent",
                  borderRight: "6px solid #15803d",
                }}
              />
            </div>
            <div
              className="text-xs font-bold mt-1 mb-2"
              style={{ color: "#15803d" }}
            >
              Approve
            </div>
            <WorkflowNode
              label="Report Approved"
              color="green"
              small
              icon={<CheckCircle size={12} />}
            />
            <Connector color="#15803d" />
            <WorkflowNode
              label="Forward to Director"
              color="green"
              small
              icon={<CheckCircle size={12} />}
            />
          </div>

          {/* Center vertical line under diamond */}
          <div
            className="w-px self-stretch"
            style={{ backgroundColor: "#1e40af", minWidth: 1 }}
          />

          {/* Right branch: Reject */}
          <div className="flex-1 flex flex-col items-center">
            <div className="w-full flex items-center justify-start">
              <div
                className="w-0 h-0"
                style={{
                  borderTop: "5px solid transparent",
                  borderBottom: "5px solid transparent",
                  borderLeft: "6px solid #b91c1c",
                }}
              />
              <div
                className="h-px flex-1"
                style={{ backgroundColor: "#b91c1c" }}
              />
            </div>
            <div
              className="text-xs font-bold mt-1 mb-2"
              style={{ color: "#b91c1c" }}
            >
              Reject
            </div>
            <WorkflowNode
              label="Enter Mandatory Remarks"
              color="red"
              small
              icon={<XCircle size={12} />}
            />
            <Connector color="#b91c1c" />
            <WorkflowNode
              label="Report Rejected"
              color="red"
              small
              icon={<XCircle size={12} />}
            />
          </div>
        </div>

        {/* Revert branch — full width below */}
        <div className="flex flex-col items-center mt-4 w-full">
          <div
            className="flex items-center justify-center gap-2 text-xs font-bold mb-2"
            style={{ color: "#b45309" }}
          >
            <div className="h-px w-16" style={{ backgroundColor: "#b45309" }} />
            <RotateCcw size={13} />
            Revert for Correction
            <div className="h-px w-16" style={{ backgroundColor: "#b45309" }} />
          </div>
          {/* Revert flow: horizontal */}
          <div className="flex items-center gap-0 flex-wrap justify-center gap-y-2">
            <WorkflowNode
              label="Enter Remarks"
              color="amber"
              small
              icon={<RotateCcw size={12} />}
            />
            <HorizontalConnector color="#b45309" />
            <WorkflowNode
              label="Sent Back to Lab"
              color="amber"
              small
              icon={<RotateCcw size={12} />}
            />
            <HorizontalConnector color="#b45309" />
            <WorkflowNode
              label="Lab Reviews Remarks"
              color="amber"
              small
              icon={<RotateCcw size={12} />}
            />
            <HorizontalConnector color="#b45309" />
            <WorkflowNode
              label="Lab Corrects Report"
              color="amber"
              small
              icon={<RotateCcw size={12} />}
            />
            <HorizontalConnector color="#b45309" />
            <WorkflowNode
              label="Resubmit to Portal"
              color="amber"
              small
              icon={<RotateCcw size={12} />}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Main Dashboard ──────────────────────────────────────────────────────────

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

      {/* Review Workflow Section */}
      <div className="mb-8">
        <ReviewWorkflowDiagram />
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
    </div>
  );
}

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import {
  CheckCircle,
  CheckCircle2,
  ChevronRight,
  ClipboardCheck,
  Clock,
  CornerUpLeft,
  Download,
  FileSpreadsheet,
  FileText,
  FileType2,
  FlaskConical,
  RotateCcw,
  ShieldCheck,
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  type ForwardedCase,
  getForwardedCases,
  subscribeForwardedCases,
  updateForwardedCase,
} from "../../store/forwardedCasesStore";

// ── types ─────────────────────────────────────────────────────────────────────
type Status = "Pending Review" | "Director Approved" | "Sent Back";
type FilterTab = "all" | "pending" | "approved" | "sentback";

// ── doc display helpers ───────────────────────────────────────────────────────
function DocTypeBadge({ type }: { type: string }) {
  if (type === "PDF")
    return (
      <span className="px-1.5 py-0.5 rounded text-xs font-bold bg-red-100 text-red-700">
        PDF
      </span>
    );
  if (type === "DOCX")
    return (
      <span className="px-1.5 py-0.5 rounded text-xs font-bold bg-blue-100 text-blue-700">
        DOCX
      </span>
    );
  if (type === "XLSX")
    return (
      <span className="px-1.5 py-0.5 rounded text-xs font-bold bg-green-100 text-green-700">
        XLSX
      </span>
    );
  return (
    <span className="px-1.5 py-0.5 rounded text-xs font-bold bg-gray-100 text-gray-700">
      {type}
    </span>
  );
}

function DocIcon({ type }: { type: string }) {
  if (type === "PDF") return <FileText size={14} className="text-red-500" />;
  if (type === "XLSX")
    return <FileSpreadsheet size={14} className="text-green-600" />;
  return <FileType2 size={14} className="text-blue-500" />;
}

// ── star display ──────────────────────────────────────────────────────────────
const STAR_INDICES = [0, 1, 2, 3, 4];
function Stars({ count }: { count: number }) {
  return (
    <span className="text-amber-400 tracking-tight">
      {STAR_INDICES.map((i) => (
        <span key={i} style={{ opacity: i < count ? 1 : 0.2 }}>
          ★
        </span>
      ))}
    </span>
  );
}

// ── status badge ──────────────────────────────────────────────────────────────
function StatusBadge({ status }: { status: Status }) {
  if (status === "Director Approved")
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
        <CheckCircle2 size={11} />
        Approved
      </span>
    );
  if (status === "Sent Back")
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-orange-100 text-orange-800">
        <RotateCcw size={11} />
        Sent Back
      </span>
    );
  return (
    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-800">
      <Clock size={11} />
      Pending Review
    </span>
  );
}

function ResultBadge({ result }: { result: "Pass" | "Fail" }) {
  if (result === "Pass")
    return (
      <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
        Pass
      </span>
    );
  return (
    <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-red-100 text-red-700">
      Fail
    </span>
  );
}

// ── workflow banner steps ─────────────────────────────────────────────────────
const STEPS = [
  { label: "Product Purchased", state: "done" },
  { label: "Test Lab Testing", state: "done" },
  { label: "BEE Official L2 Approved", state: "done" },
  { label: "Director Final Review", state: "active" },
  { label: "Compliance Cleared", state: "pending" },
];

// ── component ─────────────────────────────────────────────────────────────────
export default function DirectorTestingPage() {
  const [cases, setCases] = useState<ForwardedCase[]>(getForwardedCases);
  const [activeTab, setActiveTab] = useState<FilterTab>("all");

  // Approve dialog state
  const [approveTarget, setApproveTarget] = useState<ForwardedCase | null>(
    null,
  );
  const [approveRemark, setApproveRemark] = useState("");
  const [approveError, setApproveError] = useState(false);

  // Send Back dialog state
  const [sendBackTarget, setSendBackTarget] = useState<ForwardedCase | null>(
    null,
  );
  const [sendBackReason, setSendBackReason] = useState("");
  const [sendBackError, setSendBackError] = useState(false);

  // View docs dialog state
  const [viewDocsCase, setViewDocsCase] = useState<ForwardedCase | null>(null);

  // Subscribe to store updates
  useEffect(() => {
    return subscribeForwardedCases(() => {
      setCases(getForwardedCases());
    });
  }, []);

  const pendingCount = cases.filter(
    (c) => c.status === "Pending Review",
  ).length;
  const approvedCount = cases.filter(
    (c) => c.status === "Director Approved",
  ).length;
  const sentBackCount = cases.filter((c) => c.status === "Sent Back").length;

  const filtered = cases.filter((c) => {
    if (activeTab === "pending") return c.status === "Pending Review";
    if (activeTab === "approved") return c.status === "Director Approved";
    if (activeTab === "sentback") return c.status === "Sent Back";
    return true;
  });

  function handleApproveConfirm() {
    if (!approveRemark.trim()) {
      setApproveError(true);
      return;
    }
    if (!approveTarget) return;
    updateForwardedCase(approveTarget.reportId, {
      status: "Director Approved",
      remark: approveRemark.trim(),
    });
    setCases(getForwardedCases());
    setApproveTarget(null);
    setApproveRemark("");
    setApproveError(false);
    toast.success("Case approved successfully");
  }

  function handleSendBackConfirm() {
    if (!sendBackReason.trim()) {
      setSendBackError(true);
      return;
    }
    if (!sendBackTarget) return;
    updateForwardedCase(sendBackTarget.reportId, {
      status: "Sent Back",
      remark: sendBackReason.trim(),
    });
    setCases(getForwardedCases());
    setSendBackTarget(null);
    setSendBackReason("");
    setSendBackError(false);
    toast.success("Case sent back to BEE Official");
  }

  const pendingRows = filtered.filter((c) => c.status === "Pending Review");
  const pendingIdxMap = new Map(pendingRows.map((c, i) => [c.reportId, i + 1]));

  return (
    <div className="space-y-6 pb-8">
      {/* ── Page Header ── */}
      <div className="flex items-center gap-3">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ background: "linear-gradient(135deg, #1a3a6b, #0f2d57)" }}
        >
          <ShieldCheck size={20} className="text-white" />
        </div>
        <div>
          <h2 className="text-xl font-bold" style={{ color: "#1a3a6b" }}>
            Director Testing Module
          </h2>
          <p className="text-sm text-gray-500">
            Final approval authority · BEE Director L3 Sign-off
          </p>
        </div>
      </div>

      {/* ── Summary Cards ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          {
            label: "BEE Official Approved",
            value: 39,
            accent: "#1a3a6b",
            icon: ClipboardCheck,
          },
          {
            label: "Pending Director Review",
            value: pendingCount,
            accent: "#d97706",
            icon: Clock,
          },
          {
            label: "Director Final Approved",
            value: approvedCount,
            accent: "#059669",
            icon: CheckCircle,
          },
          {
            label: "Sent Back to Official",
            value: sentBackCount,
            accent: "#ea580c",
            icon: CornerUpLeft,
          },
        ].map(({ label, value, accent, icon: Icon }) => (
          <Card
            key={label}
            className="border-0 overflow-hidden"
            style={{ boxShadow: "0 2px 12px rgba(26,58,107,0.09)" }}
          >
            <div className="h-1 w-full" style={{ backgroundColor: accent }} />
            <CardContent className="pt-4 pb-4 px-4">
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center mb-2"
                style={{ backgroundColor: `${accent}15` }}
              >
                <Icon size={17} style={{ color: accent }} />
              </div>
              <p
                className="text-2xl font-bold leading-none mb-1"
                style={{ color: accent }}
              >
                {value}
              </p>
              <p className="text-xs font-semibold text-gray-600 leading-tight">
                {label}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* ── Workflow Banner ── */}
      <div
        className="rounded-xl px-5 py-4"
        style={{
          background: "linear-gradient(135deg, #1a3a6b 0%, #0f2d57 100%)",
        }}
      >
        <p className="text-xs font-semibold uppercase tracking-widest text-blue-300 mb-3">
          Approval Workflow
        </p>
        <div className="flex items-center gap-1 overflow-x-auto pb-1">
          {STEPS.map((step, i) => (
            <div key={step.label} className="flex items-center flex-shrink-0">
              <div className="flex flex-col items-center gap-1.5">
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 ${
                    step.state === "done"
                      ? "bg-emerald-500"
                      : step.state === "active"
                        ? "bg-amber-400"
                        : "bg-white/20"
                  }`}
                >
                  {step.state === "done" && (
                    <CheckCircle2 size={14} className="text-white" />
                  )}
                  {step.state === "active" && (
                    <FlaskConical size={13} className="text-white" />
                  )}
                  {step.state === "pending" && (
                    <span className="text-white/50 text-xs font-bold">
                      {i + 1}
                    </span>
                  )}
                </div>
                <span
                  className={`text-xs font-semibold text-center leading-tight max-w-[80px] ${
                    step.state === "done"
                      ? "text-emerald-300"
                      : step.state === "active"
                        ? "text-amber-300"
                        : "text-white/40"
                  }`}
                >
                  {step.label}
                </span>
              </div>
              {i < STEPS.length - 1 && (
                <ChevronRight
                  size={16}
                  className={`mx-2 flex-shrink-0 ${step.state === "done" ? "text-emerald-400" : "text-white/20"}`}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* ── Filter Tabs ── */}
      <div className="flex items-center gap-2 flex-wrap">
        {(
          [
            { key: "all", label: `All (${cases.length})` },
            { key: "pending", label: `Pending Review (${pendingCount})` },
            { key: "approved", label: `Director Approved (${approvedCount})` },
            { key: "sentback", label: `Sent Back (${sentBackCount})` },
          ] as { key: FilterTab; label: string }[]
        ).map(({ key, label }) => (
          <button
            key={key}
            type="button"
            data-ocid="director_testing.tab"
            onClick={() => setActiveTab(key)}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-150 ${
              activeTab === key
                ? "text-white shadow-sm"
                : "bg-white text-gray-600 border border-gray-200 hover:border-blue-300"
            }`}
            style={activeTab === key ? { background: "#1a3a6b" } : {}}
          >
            {label}
          </button>
        ))}
      </div>

      {/* ── Main Table ── */}
      <Card
        className="border-0"
        style={{ boxShadow: "0 2px 16px rgba(26,58,107,0.09)" }}
      >
        <CardHeader className="pb-2 pt-5 px-5">
          <div className="flex items-center justify-between">
            <CardTitle
              className="text-sm font-bold"
              style={{ color: "#1a3a6b" }}
            >
              Test Cases — BEE Official L2 Approved
            </CardTitle>
            <Badge
              variant="outline"
              className="text-xs border-blue-200 text-blue-700"
            >
              {filtered.length} records
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto" data-ocid="director_testing.table">
            <table className="w-full text-sm">
              <thead>
                <tr
                  style={{
                    backgroundColor: "#f8fafc",
                    borderBottom: "2px solid #e2e8f0",
                  }}
                >
                  {[
                    "S.No",
                    "Appliance",
                    "Brand",
                    "Model No.",
                    "Stars",
                    "BEE Official",
                    "Forwarded On",
                    "Test Lab",
                    "Test Result",
                    "Documents",
                    "Director Decision",
                    "Remarks",
                    "Action",
                  ].map((h) => (
                    <th
                      key={h}
                      className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wide whitespace-nowrap"
                      style={{ color: "#64748b" }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((row, idx) => {
                  const pendingIdx = pendingIdxMap.get(row.reportId);
                  const docCount = row.attachedDocuments?.length ?? 0;
                  return (
                    <tr
                      key={row.reportId}
                      className="border-b border-gray-100 hover:bg-blue-50/30 transition-colors"
                    >
                      <td className="px-4 py-3 text-gray-500 font-medium">
                        {idx + 1}
                      </td>
                      <td className="px-4 py-3 font-semibold text-gray-800 whitespace-nowrap">
                        {row.appliance}
                      </td>
                      <td className="px-4 py-3 text-gray-700 whitespace-nowrap">
                        {row.brand}
                      </td>
                      <td className="px-4 py-3 text-gray-600 font-mono text-xs">
                        {row.model}
                      </td>
                      <td className="px-4 py-3">
                        <Stars count={row.stars} />
                      </td>
                      <td className="px-4 py-3 text-gray-600 whitespace-nowrap">
                        {row.official}
                      </td>
                      <td className="px-4 py-3 text-gray-500 whitespace-nowrap text-xs">
                        {row.forwardedAt}
                      </td>
                      <td className="px-4 py-3 text-gray-500 whitespace-nowrap text-xs">
                        {row.lab}
                      </td>
                      <td className="px-4 py-3">
                        <ResultBadge result={row.testResult} />
                      </td>
                      <td className="px-4 py-3">
                        {docCount > 0 ? (
                          <Button
                            size="sm"
                            variant="outline"
                            data-ocid={`director.view_docs.button.${idx + 1}`}
                            className="h-6 px-2 text-xs border-blue-300 text-blue-700 hover:bg-blue-50"
                            onClick={() => setViewDocsCase(row)}
                          >
                            📎 {docCount}
                          </Button>
                        ) : (
                          <span className="text-gray-300 text-xs">—</span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <StatusBadge status={row.status} />
                      </td>
                      <td className="px-4 py-3 text-xs text-gray-500 max-w-[160px]">
                        {row.remark ? (
                          <span className="italic">
                            {row.remark.length > 40
                              ? `${row.remark.slice(0, 40)}…`
                              : row.remark}
                          </span>
                        ) : (
                          <span className="text-gray-300">—</span>
                        )}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        {row.status === "Pending Review" ? (
                          <div className="flex items-center gap-2">
                            <Button
                              size="sm"
                              data-ocid={`director_testing.approve_button.${pendingIdx ?? idx + 1}`}
                              onClick={() => {
                                setApproveTarget(row);
                                setApproveRemark("");
                                setApproveError(false);
                              }}
                              className="h-7 px-3 text-xs font-semibold"
                              style={{ background: "#059669", color: "white" }}
                            >
                              <CheckCircle2 size={11} className="mr-1" />
                              Approve Final
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              data-ocid={`director_testing.sendback_button.${pendingIdx ?? idx + 1}`}
                              onClick={() => {
                                setSendBackTarget(row);
                                setSendBackReason("");
                                setSendBackError(false);
                              }}
                              className="h-7 px-3 text-xs font-semibold border-orange-300 text-orange-700 hover:bg-orange-50"
                            >
                              <CornerUpLeft size={11} className="mr-1" />
                              Send Back
                            </Button>
                          </div>
                        ) : (
                          <span className="text-gray-300 text-xs">—</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            {filtered.length === 0 && (
              <div
                className="py-16 flex flex-col items-center gap-3"
                data-ocid="director_testing.empty_state"
              >
                <FlaskConical size={36} className="text-gray-200" />
                <p className="text-sm text-gray-400 font-medium">
                  No records in this category
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* ── View Documents Dialog ── */}
      <Dialog
        open={!!viewDocsCase}
        onOpenChange={(open) => !open && setViewDocsCase(null)}
      >
        <DialogContent
          className="max-w-lg max-h-[80vh] overflow-y-auto"
          data-ocid="director.docs.dialog"
        >
          <DialogHeader>
            <DialogTitle style={{ color: "#1a3a6b" }}>
              Documents — {viewDocsCase?.brand} {viewDocsCase?.model}
            </DialogTitle>
          </DialogHeader>
          {viewDocsCase && (
            <div className="space-y-4">
              {/* Forwarding Note */}
              {viewDocsCase.forwardingNote && (
                <div
                  className="rounded-lg p-3"
                  style={{
                    backgroundColor: "#f0f7ff",
                    border: "1px solid #bae6fd",
                  }}
                >
                  <p className="text-xs font-semibold text-blue-800 mb-1">
                    📋 Forwarding Note from BEE Official
                  </p>
                  <p className="text-xs text-blue-700 leading-relaxed">
                    {viewDocsCase.forwardingNote}
                  </p>
                  <p className="text-xs text-blue-400 mt-1">
                    Forwarded by {viewDocsCase.forwardedBy} on{" "}
                    {viewDocsCase.forwardedAt}
                  </p>
                </div>
              )}

              {/* Test Lab Docs */}
              {viewDocsCase.attachedDocuments.filter(
                (d) => d.uploadedBy === "Test Lab",
              ).length > 0 && (
                <div>
                  <p className="text-xs font-bold uppercase tracking-wide text-gray-500 mb-2">
                    🔬 Test Lab Documents
                  </p>
                  <div className="space-y-1.5">
                    {viewDocsCase.attachedDocuments
                      .filter((d) => d.uploadedBy === "Test Lab")
                      .map((doc) => (
                        <div
                          key={doc.id}
                          className="flex items-center justify-between bg-gray-50 rounded-lg px-3 py-2 border border-gray-100"
                        >
                          <div className="flex items-center gap-2 min-w-0">
                            <DocIcon type={doc.type} />
                            <div className="min-w-0">
                              <p className="text-xs font-medium text-gray-800 truncate">
                                {doc.name}
                              </p>
                              <p className="text-xs text-gray-400">
                                {doc.size} · {doc.uploadedAt}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 flex-shrink-0">
                            <DocTypeBadge type={doc.type} />
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-6 px-2 text-xs text-blue-600"
                              onClick={() =>
                                toast.success(`Downloading: ${doc.name}`)
                              }
                            >
                              <Download size={11} className="mr-1" />
                              Download
                            </Button>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              )}

              {/* BEE Official Docs */}
              {viewDocsCase.attachedDocuments.filter(
                (d) => d.uploadedBy === "BEE Official",
              ).length > 0 && (
                <div>
                  <p className="text-xs font-bold uppercase tracking-wide text-gray-500 mb-2">
                    👮 BEE Official Documents
                  </p>
                  <div className="space-y-1.5">
                    {viewDocsCase.attachedDocuments
                      .filter((d) => d.uploadedBy === "BEE Official")
                      .map((doc) => (
                        <div
                          key={doc.id}
                          className="flex items-center justify-between bg-gray-50 rounded-lg px-3 py-2 border border-gray-100"
                        >
                          <div className="flex items-center gap-2 min-w-0">
                            <DocIcon type={doc.type} />
                            <div className="min-w-0">
                              <p className="text-xs font-medium text-gray-800 truncate">
                                {doc.name}
                              </p>
                              <p className="text-xs text-gray-400">
                                {doc.size} · {doc.uploadedAt}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 flex-shrink-0">
                            <DocTypeBadge type={doc.type} />
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-6 px-2 text-xs text-blue-600"
                              onClick={() =>
                                toast.success(`Downloading: ${doc.name}`)
                              }
                            >
                              <Download size={11} className="mr-1" />
                              Download
                            </Button>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* ── Approve Final Dialog ── */}
      <Dialog
        open={!!approveTarget}
        onOpenChange={(open) => {
          if (!open) {
            setApproveTarget(null);
            setApproveError(false);
          }
        }}
      >
        <DialogContent
          className="max-w-md"
          data-ocid="director_testing.approve_dialog"
        >
          <DialogHeader>
            <DialogTitle
              className="flex items-center gap-2 text-base"
              style={{ color: "#1a3a6b" }}
            >
              <ShieldCheck size={18} className="text-emerald-600" />
              Director Final Approval
            </DialogTitle>
          </DialogHeader>
          {approveTarget && (
            <div className="space-y-4">
              <div
                className="rounded-lg p-4"
                style={{
                  backgroundColor: "#f0f9ff",
                  border: "1px solid #bae6fd",
                }}
              >
                <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-sm">
                  <div>
                    <p className="text-xs text-gray-400 font-medium">
                      Appliance
                    </p>
                    <p className="font-semibold text-gray-800">
                      {approveTarget.appliance}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 font-medium">Brand</p>
                    <p className="font-semibold text-gray-800">
                      {approveTarget.brand}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 font-medium">
                      Model No.
                    </p>
                    <p className="font-mono text-gray-700">
                      {approveTarget.model}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 font-medium">
                      Star Rating
                    </p>
                    <Stars count={approveTarget.stars} />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 font-medium">
                      BEE Official
                    </p>
                    <p className="text-gray-700">{approveTarget.official}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 font-medium">
                      Test Result
                    </p>
                    <ResultBadge result={approveTarget.testResult} />
                  </div>
                  {approveTarget.attachedDocuments?.length > 0 && (
                    <div className="col-span-2">
                      <p className="text-xs text-gray-400 font-medium">
                        Attached Documents
                      </p>
                      <p className="text-sm font-semibold text-blue-700">
                        📎 {approveTarget.attachedDocuments.length} document(s)
                        from BEE Official
                      </p>
                    </div>
                  )}
                </div>
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-700 mb-1.5">
                  Director Remarks <span className="text-red-500">*</span>
                </p>
                <Textarea
                  id="approve-remarks"
                  data-ocid="director_testing.remarks_textarea"
                  value={approveRemark}
                  onChange={(e) => {
                    setApproveRemark(e.target.value);
                    setApproveError(false);
                  }}
                  placeholder="Enter approval remarks (required)..."
                  className="resize-none text-sm"
                  rows={3}
                />
                {approveError && (
                  <p className="text-xs text-red-500 mt-1">
                    Remarks are required before final approval.
                  </p>
                )}
              </div>
            </div>
          )}
          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              data-ocid="director_testing.cancel_button"
              onClick={() => {
                setApproveTarget(null);
                setApproveError(false);
              }}
              className="text-sm"
            >
              Cancel
            </Button>
            <Button
              data-ocid="director_testing.confirm_button"
              onClick={handleApproveConfirm}
              className="text-sm font-semibold"
              style={{ background: "#059669", color: "white" }}
            >
              <CheckCircle2 size={14} className="mr-1.5" />
              Confirm Final Approval
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── Send Back Dialog ── */}
      <Dialog
        open={!!sendBackTarget}
        onOpenChange={(open) => {
          if (!open) {
            setSendBackTarget(null);
            setSendBackError(false);
          }
        }}
      >
        <DialogContent
          className="max-w-md"
          data-ocid="director_testing.sendback_dialog"
        >
          <DialogHeader>
            <DialogTitle
              className="flex items-center gap-2 text-base"
              style={{ color: "#1a3a6b" }}
            >
              <CornerUpLeft size={18} className="text-orange-500" />
              Send Back to BEE Official
            </DialogTitle>
          </DialogHeader>
          {sendBackTarget && (
            <div className="space-y-4">
              <div
                className="rounded-lg p-4"
                style={{
                  backgroundColor: "#fff7ed",
                  border: "1px solid #fed7aa",
                }}
              >
                <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-sm">
                  <div>
                    <p className="text-xs text-gray-400 font-medium">
                      Appliance
                    </p>
                    <p className="font-semibold text-gray-800">
                      {sendBackTarget.appliance}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 font-medium">Brand</p>
                    <p className="font-semibold text-gray-800">
                      {sendBackTarget.brand}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 font-medium">
                      Model No.
                    </p>
                    <p className="font-mono text-gray-700">
                      {sendBackTarget.model}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 font-medium">
                      Star Rating
                    </p>
                    <Stars count={sendBackTarget.stars} />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 font-medium">
                      BEE Official
                    </p>
                    <p className="text-gray-700">{sendBackTarget.official}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 font-medium">
                      Test Result
                    </p>
                    <ResultBadge result={sendBackTarget.testResult} />
                  </div>
                </div>
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-700 mb-1.5">
                  Reason for Sending Back{" "}
                  <span className="text-red-500">*</span>
                </p>
                <Textarea
                  id="sendback-reason"
                  data-ocid="director_testing.remarks_textarea"
                  value={sendBackReason}
                  onChange={(e) => {
                    setSendBackReason(e.target.value);
                    setSendBackError(false);
                  }}
                  placeholder="Provide reason for sending back to BEE Official (required)..."
                  className="resize-none text-sm"
                  rows={3}
                />
                {sendBackError && (
                  <p className="text-xs text-red-500 mt-1">
                    Reason is required before sending back.
                  </p>
                )}
              </div>
            </div>
          )}
          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              data-ocid="director_testing.cancel_button"
              onClick={() => {
                setSendBackTarget(null);
                setSendBackError(false);
              }}
              className="text-sm"
            >
              Cancel
            </Button>
            <Button
              data-ocid="director_testing.confirm_button"
              onClick={handleSendBackConfirm}
              className="text-sm font-semibold"
              style={{ background: "#ea580c", color: "white" }}
            >
              <CornerUpLeft size={14} className="mr-1.5" />
              Confirm Send Back
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

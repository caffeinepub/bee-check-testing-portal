import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import {
  CheckCircle2,
  Circle,
  Clock,
  Download,
  FileText,
  Paperclip,
  RotateCcw,
  Upload,
  XCircle,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import {
  LAB_STATUS_LABELS,
  type LabTrackingStatus,
  type StatusLogEntry,
  TERMINAL_LAB_STATUSES,
  type TestReportEntry,
  getPathForSample,
  labSamples as initialLabSamples,
  testReportEntries as initialTestReports,
  revertedFromBEE,
} from "../../data/mockData";

interface Props {
  defaultTab?: string;
}

const STATUS_COLORS: Partial<Record<LabTrackingStatus, string>> = {
  InTransit: "bg-orange-100 text-orange-800 border-orange-200",
  ReachedLab: "bg-blue-100 text-blue-800 border-blue-200",
  TestScheduled: "bg-purple-100 text-purple-800 border-purple-200",
  UnderTesting: "bg-yellow-100 text-yellow-800 border-yellow-200",
  TestDone: "bg-teal-100 text-teal-800 border-teal-200",
  Pass: "bg-green-100 text-green-800 border-green-200",
  Fail: "bg-red-100 text-red-800 border-red-200",
  NFT: "bg-red-100 text-red-800 border-red-200",
  InvoiceRaised: "bg-green-100 text-green-800 border-green-200",
};

function statusColorClass(s: LabTrackingStatus) {
  return STATUS_COLORS[s] ?? "bg-gray-100 text-gray-800 border-gray-200";
}

// Branch choice types
type BranchChoice = "TestScheduled" | "NFT" | "UnderTesting" | null;
type PassFailChoice = "Pass" | "Fail" | null;

// Document upload field
interface DocField {
  label: string;
  accept: string;
  maxMB: number;
  multiple?: boolean;
  maxFiles?: number;
  hint?: string;
  file?: File | null;
  files?: File[];
}

export default function AssignedSamplesPage({ defaultTab }: Props) {
  const [samples, setSamples] = useState(initialLabSamples);
  const [testReports, setTestReports] =
    useState<TestReportEntry[]>(initialTestReports);
  const [activeTab, setActiveTab] = useState(
    defaultTab === "revert"
      ? "revert"
      : defaultTab === "testreport"
        ? "testreport"
        : "tracking",
  );

  // Update Status Dialog state
  const [updateSample, setUpdateSample] = useState<
    (typeof initialLabSamples)[0] | null
  >(null);
  const [updateDate, setUpdateDate] = useState("");
  const [updateRemarks, setUpdateRemarks] = useState("");
  // Branch after ReachedLab: TestScheduled or NFT
  const [reachedLabChoice, setReachedLabChoice] = useState<BranchChoice>(null);
  // Branch after TestScheduled: UnderTesting or NFT
  const [scheduledChoice, setScheduledChoice] = useState<BranchChoice>(null);
  // Pass/Fail choice after TestDone
  const [passFailChoice, setPassFailChoice] = useState<PassFailChoice>(null);
  // Document fields for Pass/Fail
  const [docFields, setDocFields] = useState<DocField[]>([
    {
      label: "Star Label Image",
      accept: ".jpg,.jpeg,.png",
      maxMB: 10,
      file: null,
      hint: "JPG/PNG, max 10 MB",
    },
    {
      label: "Appliance Photos (Front, Back, Side)",
      accept: ".jpg,.jpeg,.png",
      maxMB: 5,
      multiple: true,
      maxFiles: 5,
      files: [],
      hint: "JPG/PNG, up to 5 photos",
    },
    {
      label: "Name Plate Photo",
      accept: ".jpg,.jpeg,.png",
      maxMB: 5,
      file: null,
      hint: "JPG/PNG, max 5 MB",
    },
    {
      label: "Test Report",
      accept: ".pdf",
      maxMB: 10,
      file: null,
      hint: "PDF only, max 10 MB",
    },
  ]);

  // View Log Dialog
  const [logSample, setLogSample] = useState<
    (typeof initialLabSamples)[0] | null
  >(null);

  // Documents view dialog
  const [docsEntry, setDocsEntry] = useState<TestReportEntry | null>(null);

  // BEE verification dialog
  const [verifyEntry, setVerifyEntry] = useState<TestReportEntry | null>(null);

  const getBranchNextStatus = (): LabTrackingStatus | null => {
    if (!updateSample) return null;
    const cur = updateSample.currentStatus;
    if (cur === "ReachedLab")
      return (reachedLabChoice as LabTrackingStatus) || null;
    if (cur === "TestScheduled")
      return (scheduledChoice as LabTrackingStatus) || null;
    if (cur === "TestDone") return passFailChoice;
    // Linear steps
    const linearMap: Partial<Record<LabTrackingStatus, LabTrackingStatus>> = {
      InTransit: "ReachedLab",
      UnderTesting: "TestDone",
      Pass: "InvoiceRaised",
      Fail: "InvoiceRaised",
    };
    return linearMap[cur] ?? null;
  };

  const isBranchStatus = (s: LabTrackingStatus) =>
    s === "ReachedLab" || s === "TestScheduled" || s === "TestDone";

  const openUpdateDialog = (sample: (typeof initialLabSamples)[0]) => {
    if (TERMINAL_LAB_STATUSES.includes(sample.currentStatus)) {
      toast.info(
        sample.currentStatus === "NFT"
          ? "NFT (Not Fit for Test) — no further actions required"
          : "Invoice Raised — no further actions required",
      );
      return;
    }
    setUpdateSample(sample);
    setUpdateDate(new Date().toISOString().split("T")[0]);
    setUpdateRemarks("");
    setReachedLabChoice(null);
    setScheduledChoice(null);
    setPassFailChoice(null);
    setDocFields([
      {
        label: "Star Label Image",
        accept: ".jpg,.jpeg,.png",
        maxMB: 10,
        file: null,
        hint: "JPG/PNG, max 10 MB",
      },
      {
        label: "Appliance Photos (Front, Back, Side)",
        accept: ".jpg,.jpeg,.png",
        maxMB: 5,
        multiple: true,
        maxFiles: 5,
        files: [],
        hint: "JPG/PNG, up to 5 photos",
      },
      {
        label: "Name Plate Photo",
        accept: ".jpg,.jpeg,.png",
        maxMB: 5,
        file: null,
        hint: "JPG/PNG, max 5 MB",
      },
      {
        label: "Test Report",
        accept: ".pdf",
        maxMB: 10,
        file: null,
        hint: "PDF only, max 10 MB",
      },
    ]);
  };

  const nextStatusForDialog = updateSample ? getBranchNextStatus() : null;

  const handleUpdateSubmit = () => {
    if (!updateSample) return;
    const nextStatus = getBranchNextStatus();
    if (!nextStatus) {
      if (updateSample.currentStatus === "ReachedLab")
        toast.error("Please select: Test Scheduled or NFT");
      else if (updateSample.currentStatus === "TestScheduled")
        toast.error("Please select: Under Testing or NFT");
      else if (updateSample.currentStatus === "TestDone")
        toast.error("Please select: Pass or Fail");
      return;
    }
    if (!updateDate) {
      toast.error("Please select a date");
      return;
    }

    const newEntry: StatusLogEntry = {
      status: nextStatus,
      date: updateDate,
      remarks: updateRemarks || undefined,
    };

    const updatedSamples = samples.map((s) =>
      s.id === updateSample.id
        ? {
            ...s,
            currentStatus: nextStatus,
            statusLog: [...s.statusLog, newEntry],
          }
        : s,
    );
    setSamples(updatedSamples);

    // If Pass, Fail, or NFT → add to Test Report
    if (
      nextStatus === "Pass" ||
      nextStatus === "Fail" ||
      nextStatus === "NFT"
    ) {
      const docs: { name: string; type: string }[] = [];
      if (nextStatus === "Pass" || nextStatus === "Fail") {
        for (const f of docFields) {
          if (f.multiple && f.files && f.files.length > 0) {
            for (let idx = 0; idx < f.files.length; idx++) {
              docs.push({
                name: f.files[idx].name,
                type: `${f.label} ${idx + 1}`,
              });
            }
          } else if (!f.multiple && f.file) {
            docs.push({ name: f.file.name, type: f.label });
          } else {
            docs.push({
              name: `${f.label.replace(/ /g, "_")}_placeholder.${f.accept.includes("pdf") ? "pdf" : "jpg"}`,
              type: f.label,
            });
          }
        }
      } else {
        docs.push({ name: "NFT_Evidence.pdf", type: "NFT Evidence" });
      }
      const entry: TestReportEntry = {
        sampleId: updateSample.id,
        categoryName: updateSample.categoryName,
        brandName: updateSample.brandName,
        modelNumber: updateSample.modelNumber,
        starRating: updateSample.starRating,
        state: updateSample.state,
        labName: updateSample.labName,
        finalStatus: nextStatus as "Pass" | "Fail" | "NFT",
        date: updateDate,
        remarks: updateRemarks || undefined,
        documents: docs,
        beeVerificationStatus: "Pending",
      };
      setTestReports((prev) => [...prev, entry]);
      toast.success(
        `Sample marked as "${LAB_STATUS_LABELS[nextStatus]}" and forwarded to BEE Official for verification`,
      );
    } else {
      toast.success(
        `Status updated to "${LAB_STATUS_LABELS[nextStatus]}" for ${updateSample.brandName} ${updateSample.modelNumber}`,
      );
    }
    setUpdateSample(null);
  };

  const lastUpdatedDate = (sample: (typeof initialLabSamples)[0]) =>
    sample.statusLog.length > 0
      ? sample.statusLog[sample.statusLog.length - 1].date
      : "—";

  const finalStatusBadge = (status: "Pass" | "Fail" | "NFT") => {
    if (status === "Pass")
      return "bg-green-100 text-green-800 border-green-300";
    if (status === "Fail") return "bg-red-100 text-red-800 border-red-300";
    return "bg-orange-100 text-orange-800 border-orange-300";
  };

  const beeBadge = (s: "Pending" | "Verified" | "SendBack") => {
    if (s === "Verified") return "bg-green-100 text-green-800";
    if (s === "SendBack") return "bg-red-100 text-red-800";
    return "bg-yellow-100 text-yellow-800";
  };

  // Whether to show the Pass/Fail doc upload section
  const showPassFailDocs =
    updateSample?.currentStatus === "TestDone" && passFailChoice !== null;

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-bold" style={{ color: "#1a3a6b" }}>
          Sample Management
        </h2>
        <p className="text-gray-500 text-sm">
          Track and update sample status through the testing lifecycle
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4" style={{ backgroundColor: "#e8eef7" }}>
          <TabsTrigger
            value="tracking"
            data-ocid="lab.tracking.tab"
            className="data-[state=active]:bg-[#1a3a6b] data-[state=active]:text-white"
          >
            Sample Tracking
          </TabsTrigger>
          <TabsTrigger
            value="testreport"
            data-ocid="lab.testreport.tab"
            className="data-[state=active]:bg-[#1a3a6b] data-[state=active]:text-white"
          >
            <FileText size={14} className="mr-1.5" />
            Test Report
          </TabsTrigger>
          <TabsTrigger
            value="revert"
            data-ocid="lab.revert.tab"
            className="data-[state=active]:bg-red-600 data-[state=active]:text-white"
          >
            <RotateCcw size={14} className="mr-1.5" />
            Revert from BEE
          </TabsTrigger>
        </TabsList>

        {/* ── Sample Tracking Tab ── */}
        <TabsContent value="tracking">
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow style={{ backgroundColor: "#1a3a6b" }}>
                  {[
                    "#",
                    "Category",
                    "Brand",
                    "Model",
                    "Star",
                    "Current Status",
                    "Last Updated",
                    "Actions",
                  ].map((h) => (
                    <TableHead
                      key={h}
                      className="text-white text-xs font-semibold"
                    >
                      {h}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {samples.map((s, i) => {
                  const isTerminal = TERMINAL_LAB_STATUSES.includes(
                    s.currentStatus,
                  );
                  const isNFT = s.currentStatus === "NFT";
                  const isPassFail =
                    s.currentStatus === "Pass" || s.currentStatus === "Fail";
                  return (
                    <TableRow
                      key={s.id}
                      data-ocid={`lab.sample.row.${i + 1}`}
                      className="hover:bg-blue-50"
                    >
                      <TableCell className="text-xs text-gray-500">
                        {i + 1}
                      </TableCell>
                      <TableCell className="text-xs">
                        {s.categoryName}
                      </TableCell>
                      <TableCell className="text-xs font-medium">
                        {s.brandName}
                      </TableCell>
                      <TableCell className="text-xs font-mono">
                        {s.modelNumber}
                      </TableCell>
                      <TableCell className="text-xs">
                        {"★".repeat(s.starRating)}
                      </TableCell>
                      <TableCell>
                        <span
                          className={`text-xs px-2 py-0.5 rounded-full border font-medium ${statusColorClass(s.currentStatus)}`}
                        >
                          {LAB_STATUS_LABELS[s.currentStatus]}
                        </span>
                      </TableCell>
                      <TableCell className="text-xs text-gray-600">
                        {lastUpdatedDate(s)}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1.5">
                          <Button
                            data-ocid={`lab.update_status.button.${i + 1}`}
                            variant="outline"
                            size="sm"
                            className={`h-6 text-xs px-2 ${
                              isNFT
                                ? "border-red-300 text-red-700 bg-red-50 cursor-not-allowed opacity-70"
                                : isPassFail
                                  ? "border-indigo-300 text-indigo-700 bg-indigo-50"
                                  : isTerminal
                                    ? "border-green-300 text-green-700"
                                    : "border-blue-300 text-blue-700 hover:bg-blue-50"
                            }`}
                            onClick={() => openUpdateDialog(s)}
                            disabled={isTerminal}
                          >
                            {isNFT
                              ? "NFT — No Further Action"
                              : isTerminal
                                ? "Completed"
                                : "Update Status"}
                          </Button>
                          <Button
                            data-ocid={`lab.view_log.button.${i + 1}`}
                            variant="ghost"
                            size="sm"
                            className="h-6 text-xs px-2 text-gray-600 hover:bg-gray-100"
                            onClick={() => setLogSample(s)}
                          >
                            View Log
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        {/* ── Test Report Tab ── */}
        <TabsContent value="testreport">
          <div className="mb-3 flex items-center gap-2 p-3 rounded-lg bg-indigo-50 border border-indigo-200">
            <FileText size={16} className="text-indigo-600 flex-shrink-0" />
            <p className="text-sm text-indigo-700">
              All Pass, Fail, and NFT samples are listed here. These are
              automatically forwarded to BEE Official for verification.
            </p>
          </div>

          {/* Summary badges */}
          <div className="flex gap-3 mb-4">
            {(["Pass", "Fail", "NFT"] as const).map((s) => {
              const count = testReports.filter(
                (r) => r.finalStatus === s,
              ).length;
              return (
                <div
                  key={s}
                  className={`px-4 py-2 rounded-lg border text-sm font-semibold ${finalStatusBadge(s)}`}
                >
                  {s}: {count}
                </div>
              );
            })}
          </div>

          <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow style={{ backgroundColor: "#1a3a6b" }}>
                  {[
                    "#",
                    "Category",
                    "Brand",
                    "Model",
                    "Star",
                    "Final Status",
                    "Date",
                    "Remarks",
                    "Documents",
                    "BEE Verification",
                  ].map((h) => (
                    <TableHead
                      key={h}
                      className="text-white text-xs font-semibold"
                    >
                      {h}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {testReports.length === 0 && (
                  <TableRow data-ocid="lab.testreport.empty_state">
                    <TableCell
                      colSpan={10}
                      className="text-center py-8 text-gray-400 text-sm"
                    >
                      No test reports yet. Update samples to Pass, Fail, or NFT
                      to see them here.
                    </TableCell>
                  </TableRow>
                )}
                {testReports.map((r, i) => (
                  <TableRow
                    key={`${r.sampleId}-${i}`}
                    data-ocid={`lab.testreport.item.${i + 1}`}
                    className="hover:bg-blue-50"
                  >
                    <TableCell className="text-xs text-gray-500">
                      {i + 1}
                    </TableCell>
                    <TableCell className="text-xs">{r.categoryName}</TableCell>
                    <TableCell className="text-xs font-medium">
                      {r.brandName}
                    </TableCell>
                    <TableCell className="text-xs font-mono">
                      {r.modelNumber}
                    </TableCell>
                    <TableCell className="text-xs">
                      {"★".repeat(r.starRating)}
                    </TableCell>
                    <TableCell>
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full border font-semibold ${finalStatusBadge(r.finalStatus)}`}
                      >
                        {r.finalStatus === "Pass" && <span>✓ Pass</span>}
                        {r.finalStatus === "Fail" && <span>✗ Fail</span>}
                        {r.finalStatus === "NFT" && <span>⚠ NFT</span>}
                      </span>
                    </TableCell>
                    <TableCell className="text-xs text-gray-600">
                      {r.date}
                    </TableCell>
                    <TableCell className="text-xs text-gray-600 max-w-[140px] truncate">
                      {r.remarks || "—"}
                    </TableCell>
                    <TableCell>
                      <Button
                        data-ocid={`lab.testreport.docs.button.${i + 1}`}
                        variant="outline"
                        size="sm"
                        className="h-6 text-xs px-2 border-blue-300 text-blue-700 hover:bg-blue-50"
                        onClick={() => setDocsEntry(r)}
                      >
                        <Paperclip size={11} className="mr-1" />
                        {r.documents.length} file
                        {r.documents.length !== 1 ? "s" : ""}
                      </Button>
                    </TableCell>
                    <TableCell>
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full font-medium ${beeBadge(r.beeVerificationStatus)}`}
                      >
                        {r.beeVerificationStatus === "Verified"
                          ? "✓ Verified"
                          : r.beeVerificationStatus === "SendBack"
                            ? "Sent Back"
                            : "Pending"}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        {/* ── Revert from BEE Tab ── */}
        <TabsContent value="revert">
          <div className="mb-3 flex items-center gap-2 p-3 rounded-lg bg-red-50 border border-red-200">
            <RotateCcw size={16} className="text-red-600 flex-shrink-0" />
            <p className="text-sm text-red-700">
              Samples listed below have been returned from BEE due to
              documentation or compliance issues.
            </p>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow style={{ backgroundColor: "#7f1d1d" }}>
                  {[
                    "#",
                    "Category",
                    "Brand",
                    "Model",
                    "Star",
                    "Return Reason",
                    "Return Date",
                    "Status",
                  ].map((h) => (
                    <TableHead
                      key={h}
                      className="text-white text-xs font-semibold"
                    >
                      {h}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {revertedFromBEE.map((s, i) => (
                  <TableRow
                    key={s.id}
                    data-ocid={`lab.reverted.row.${i + 1}`}
                    className="hover:bg-red-50"
                  >
                    <TableCell className="text-xs text-gray-500">
                      {i + 1}
                    </TableCell>
                    <TableCell className="text-xs">{s.categoryName}</TableCell>
                    <TableCell className="text-xs font-medium">
                      {s.brandName}
                    </TableCell>
                    <TableCell className="text-xs font-mono">
                      {s.modelNumber}
                    </TableCell>
                    <TableCell className="text-xs">
                      {"★".repeat(s.starRating)}
                    </TableCell>
                    <TableCell>
                      <span className="text-xs font-medium text-red-700 bg-red-50 px-2 py-0.5 rounded border border-red-200">
                        {s.returnReason}
                      </span>
                    </TableCell>
                    <TableCell className="text-xs text-gray-600">
                      {s.returnDate}
                    </TableCell>
                    <TableCell>
                      <Badge className="bg-red-100 text-red-800 border border-red-300 text-xs font-medium hover:bg-red-100">
                        Returned from BEE
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
      </Tabs>

      {/* ── Update Status Dialog ── */}
      <Dialog
        open={!!updateSample}
        onOpenChange={() => {
          setUpdateSample(null);
        }}
      >
        <DialogContent
          data-ocid="lab.update_status.dialog"
          className="max-w-lg max-h-[90vh] overflow-y-auto"
        >
          <DialogHeader>
            <DialogTitle style={{ color: "#1a3a6b" }}>
              Update Sample Status
            </DialogTitle>
          </DialogHeader>
          {updateSample && (
            <div className="space-y-4">
              {/* Sample info */}
              <div className="p-3 bg-blue-50 rounded-lg border border-blue-100">
                <p className="text-xs text-gray-500">Sample</p>
                <p className="font-semibold text-sm">
                  {updateSample.brandName} — {updateSample.modelNumber}
                </p>
                <p className="text-xs text-gray-500 mt-0.5">
                  {updateSample.categoryName}
                </p>
              </div>

              {/* Branch: ReachedLab → TestScheduled or NFT */}
              {updateSample.currentStatus === "ReachedLab" && (
                <div className="space-y-3">
                  <p className="text-xs font-medium text-gray-700">
                    Select Next Action *
                  </p>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setReachedLabChoice("TestScheduled")}
                      className={`p-3 rounded-lg border-2 text-left transition-all ${
                        reachedLabChoice === "TestScheduled"
                          ? "border-purple-500 bg-purple-50"
                          : "border-gray-200 bg-white hover:border-purple-300"
                      }`}
                    >
                      <p className="text-xs font-semibold text-purple-700">
                        📋 Test Scheduled
                      </p>
                      <p className="text-xs text-gray-500 mt-0.5">
                        Sample is fit for testing
                      </p>
                    </button>
                    <button
                      type="button"
                      onClick={() => setReachedLabChoice("NFT")}
                      className={`p-3 rounded-lg border-2 text-left transition-all ${
                        reachedLabChoice === "NFT"
                          ? "border-red-500 bg-red-50"
                          : "border-gray-200 bg-white hover:border-red-300"
                      }`}
                    >
                      <p className="text-xs font-semibold text-red-700">
                        🚫 NFT
                      </p>
                      <p className="text-xs text-gray-500 mt-0.5">
                        Not Fit for Test
                      </p>
                    </button>
                  </div>
                  {reachedLabChoice === "NFT" && (
                    <div className="flex items-start gap-2 p-3 rounded-lg bg-red-50 border border-red-200">
                      <span className="text-red-500 text-base leading-none mt-0.5">
                        ⚠️
                      </span>
                      <p className="text-xs text-red-700">
                        <strong>Note:</strong> NFT is terminal. No further
                        actions will be possible. Case will be forwarded to BEE
                        Official.
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Branch: TestScheduled → UnderTesting or NFT */}
              {updateSample.currentStatus === "TestScheduled" && (
                <div className="space-y-3">
                  <p className="text-xs font-medium text-gray-700">
                    Select Next Action *
                  </p>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setScheduledChoice("UnderTesting")}
                      className={`p-3 rounded-lg border-2 text-left transition-all ${
                        scheduledChoice === "UnderTesting"
                          ? "border-yellow-500 bg-yellow-50"
                          : "border-gray-200 bg-white hover:border-yellow-300"
                      }`}
                    >
                      <p className="text-xs font-semibold text-yellow-700">
                        🔬 Under Testing
                      </p>
                      <p className="text-xs text-gray-500 mt-0.5">
                        Proceed with testing
                      </p>
                    </button>
                    <button
                      type="button"
                      onClick={() => setScheduledChoice("NFT")}
                      className={`p-3 rounded-lg border-2 text-left transition-all ${
                        scheduledChoice === "NFT"
                          ? "border-red-500 bg-red-50"
                          : "border-gray-200 bg-white hover:border-red-300"
                      }`}
                    >
                      <p className="text-xs font-semibold text-red-700">
                        🚫 NFT
                      </p>
                      <p className="text-xs text-gray-500 mt-0.5">
                        Not Fit for Test
                      </p>
                    </button>
                  </div>
                  {scheduledChoice === "NFT" && (
                    <div className="flex items-start gap-2 p-3 rounded-lg bg-red-50 border border-red-200">
                      <span className="text-red-500 text-base leading-none mt-0.5">
                        ⚠️
                      </span>
                      <p className="text-xs text-red-700">
                        <strong>Note:</strong> NFT is terminal. Case will be
                        forwarded to BEE Official for verification.
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Branch: TestDone → Pass or Fail */}
              {updateSample.currentStatus === "TestDone" && (
                <div className="space-y-3">
                  <p className="text-xs font-medium text-gray-700">
                    Select Test Result *
                  </p>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setPassFailChoice("Pass")}
                      className={`p-3 rounded-lg border-2 text-left transition-all ${
                        passFailChoice === "Pass"
                          ? "border-green-500 bg-green-50"
                          : "border-gray-200 bg-white hover:border-green-300"
                      }`}
                    >
                      <p className="text-xs font-semibold text-green-700">
                        ✅ Pass
                      </p>
                      <p className="text-xs text-gray-500 mt-0.5">
                        Sample meets BEE standards
                      </p>
                    </button>
                    <button
                      type="button"
                      onClick={() => setPassFailChoice("Fail")}
                      className={`p-3 rounded-lg border-2 text-left transition-all ${
                        passFailChoice === "Fail"
                          ? "border-red-500 bg-red-50"
                          : "border-gray-200 bg-white hover:border-red-300"
                      }`}
                    >
                      <p className="text-xs font-semibold text-red-700">
                        ❌ Fail
                      </p>
                      <p className="text-xs text-gray-500 mt-0.5">
                        Sample fails BEE standards
                      </p>
                    </button>
                  </div>
                </div>
              )}

              {/* Status transition display (non-branch statuses) */}
              {!isBranchStatus(updateSample.currentStatus) &&
                nextStatusForDialog && (
                  <div className="flex items-center gap-2">
                    <div className="flex-1">
                      <p className="text-xs text-gray-500 mb-1">
                        Current Status
                      </p>
                      <span
                        className={`text-xs px-2 py-1 rounded-full border font-medium ${statusColorClass(updateSample.currentStatus)}`}
                      >
                        {LAB_STATUS_LABELS[updateSample.currentStatus]}
                      </span>
                    </div>
                    <div className="text-gray-400 text-lg">→</div>
                    <div className="flex-1">
                      <p className="text-xs text-gray-500 mb-1">Next Status</p>
                      <span
                        className={`text-xs px-2 py-1 rounded-full border font-medium ${statusColorClass(nextStatusForDialog)}`}
                      >
                        {LAB_STATUS_LABELS[nextStatusForDialog]}
                      </span>
                    </div>
                  </div>
                )}

              {/* Date and Remarks (show when next status is determined) */}
              {(nextStatusForDialog ||
                (updateSample.currentStatus === "TestDone" &&
                  passFailChoice)) && (
                <>
                  <div>
                    <Label
                      htmlFor="update-date"
                      className="text-xs font-medium text-gray-700"
                    >
                      Date
                    </Label>
                    <Input
                      id="update-date"
                      data-ocid="lab.update_status.input"
                      type="date"
                      value={updateDate}
                      onChange={(e) => setUpdateDate(e.target.value)}
                      className="mt-1 text-sm"
                    />
                  </div>
                  <div>
                    <Label
                      htmlFor="update-remarks"
                      className="text-xs font-medium text-gray-700"
                    >
                      Remarks
                    </Label>
                    <Textarea
                      id="update-remarks"
                      data-ocid="lab.update_status.textarea"
                      placeholder="Add remarks (optional)"
                      value={updateRemarks}
                      onChange={(e) => setUpdateRemarks(e.target.value)}
                      className="mt-1 text-sm resize-none"
                      rows={3}
                    />
                  </div>
                </>
              )}

              {/* Document uploads for Pass/Fail */}
              {showPassFailDocs && (
                <div className="space-y-3 border-t pt-3">
                  <p className="text-xs font-semibold text-gray-700">
                    Attach Documents
                  </p>
                  {docFields.map((field, fi) => (
                    <div key={field.label} className="border rounded-lg p-3">
                      <div className="flex items-center justify-between mb-1">
                        <Label className="text-xs font-medium text-gray-700">
                          {field.label}
                        </Label>
                        <span className="text-xs text-gray-400">
                          {field.hint}
                        </span>
                      </div>
                      <div
                        className="border-2 border-dashed border-gray-200 rounded p-3 text-center cursor-pointer hover:bg-gray-50 relative"
                        data-ocid={`lab.doc_upload.dropzone.${fi + 1}`}
                      >
                        <input
                          type="file"
                          accept={field.accept}
                          multiple={field.multiple}
                          className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                          onChange={(e) => {
                            const files = e.target.files;
                            if (!files) return;
                            if (field.multiple) {
                              const arr = Array.from(files).slice(
                                0,
                                field.maxFiles,
                              );
                              setDocFields((prev) =>
                                prev.map((f, i) =>
                                  i === fi ? { ...f, files: arr } : f,
                                ),
                              );
                            } else {
                              const file = files[0];
                              if (file) {
                                if (file.size > field.maxMB * 1024 * 1024) {
                                  toast.error(
                                    `File too large. Max ${field.maxMB}MB allowed.`,
                                  );
                                  return;
                                }
                                const ext = file.name
                                  .split(".")
                                  .pop()
                                  ?.toLowerCase();
                                if (field.accept === ".pdf" && ext !== "pdf") {
                                  toast.error(
                                    "Only PDF files are allowed for Test Report.",
                                  );
                                  return;
                                }
                                setDocFields((prev) =>
                                  prev.map((f, i) =>
                                    i === fi ? { ...f, file } : f,
                                  ),
                                );
                              }
                            }
                          }}
                        />
                        <Upload
                          size={16}
                          className="text-gray-400 mx-auto mb-1"
                        />
                        {field.multiple ? (
                          field.files && field.files.length > 0 ? (
                            <p className="text-xs text-green-600">
                              {field.files.length} file(s) selected
                            </p>
                          ) : (
                            <p className="text-xs text-gray-400">
                              Click to attach up to {field.maxFiles} photos
                            </p>
                          )
                        ) : field.file ? (
                          <p className="text-xs text-green-600">
                            {field.file.name}
                          </p>
                        ) : (
                          <p className="text-xs text-gray-400">
                            Click to browse
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* NFT attachment */}
              {(nextStatusForDialog === "NFT" ||
                (updateSample.currentStatus === "ReachedLab" &&
                  reachedLabChoice === "NFT") ||
                (updateSample.currentStatus === "TestScheduled" &&
                  scheduledChoice === "NFT")) && (
                <div>
                  <Label className="text-xs font-medium text-gray-700">
                    Attach NFT Evidence *
                  </Label>
                  <button
                    type="button"
                    className="w-full mt-1 border-2 border-dashed border-red-200 rounded-lg p-4 text-center cursor-pointer hover:bg-red-50"
                    data-ocid="lab.update_status.dropzone"
                    onClick={() =>
                      toast.info(
                        "File upload for NFT evidence — attach your document here",
                      )
                    }
                  >
                    <Upload size={20} className="mx-auto mb-2 text-red-400" />
                    <p className="text-xs font-medium text-red-600">
                      Attach NFT Evidence / Supporting Document
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      PDF/JPG/PNG — Click to browse
                    </p>
                  </button>
                </div>
              )}

              {/* Invoice/normal attachment */}
              {nextStatusForDialog === "InvoiceRaised" && (
                <button
                  type="button"
                  className="w-full border-2 border-dashed border-blue-200 rounded-lg p-4 text-center cursor-pointer hover:bg-blue-50"
                  data-ocid="lab.update_status.dropzone"
                  onClick={() =>
                    toast.info(
                      "File upload for Invoice — attach your document here",
                    )
                  }
                >
                  <Upload size={20} className="mx-auto mb-2 text-blue-400" />
                  <p className="text-xs font-medium text-blue-600">
                    Attach Invoice Document (PDF)
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    Click to browse or drag & drop
                  </p>
                </button>
              )}
            </div>
          )}
          <DialogFooter>
            <Button
              data-ocid="lab.update_status.cancel_button"
              variant="outline"
              onClick={() => setUpdateSample(null)}
              className="text-sm"
            >
              Cancel
            </Button>
            <Button
              data-ocid="lab.update_status.submit_button"
              onClick={handleUpdateSubmit}
              className="text-sm text-white"
              style={{ backgroundColor: "#1a3a6b" }}
            >
              Update Status
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── View Log Dialog ── */}
      <Dialog open={!!logSample} onOpenChange={() => setLogSample(null)}>
        <DialogContent data-ocid="lab.view_log.dialog" className="max-w-lg">
          <DialogHeader>
            <DialogTitle style={{ color: "#1a3a6b" }}>
              Status History Log
            </DialogTitle>
          </DialogHeader>
          {logSample && (
            <div>
              <div className="p-3 bg-gray-50 rounded-lg border border-gray-100 mb-4">
                <p className="font-semibold text-sm">
                  {logSample.brandName} — {logSample.modelNumber}
                </p>
                <p className="text-xs text-gray-500">
                  {logSample.categoryName} | {logSample.state}
                </p>
              </div>
              <div className="space-y-0">
                {(() => {
                  const path = getPathForSample(logSample);
                  return path.map((status, idx) => {
                    const logEntry = logSample.statusLog.find(
                      (e) => e.status === status,
                    );
                    const isCurrent = logSample.currentStatus === status;
                    const isCompleted =
                      path.indexOf(logSample.currentStatus) >
                      path.indexOf(status);
                    const isFuture = !logEntry && !isCurrent;
                    const isLast = idx === path.length - 1;
                    return (
                      <div key={status} className="flex gap-3">
                        <div className="flex flex-col items-center">
                          <div
                            className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 border-2 ${
                              isCompleted
                                ? "bg-green-500 border-green-500 text-white"
                                : isCurrent
                                  ? (
                                      status === "NFT" || status === "Fail"
                                        ? "bg-red-600 border-red-600 text-white"
                                        : status === "Pass"
                                          ? "bg-green-600 border-green-600 text-white"
                                          : "bg-blue-600 border-blue-600 text-white"
                                    )
                                  : "bg-gray-100 border-gray-300 text-gray-400"
                            }`}
                          >
                            {isCompleted ? (
                              <CheckCircle2 size={14} />
                            ) : isCurrent ? (
                              <Clock size={13} />
                            ) : (
                              <Circle size={12} />
                            )}
                          </div>
                          {!isLast && (
                            <div
                              className={`w-0.5 flex-1 min-h-[24px] ${isCompleted ? "bg-green-300" : "bg-gray-200"}`}
                            />
                          )}
                        </div>
                        <div className={`pb-4 flex-1 ${isLast ? "pb-0" : ""}`}>
                          <div className="flex items-center justify-between">
                            <p
                              className={`text-sm font-semibold ${
                                isCompleted
                                  ? "text-green-700"
                                  : isCurrent
                                    ? (
                                        status === "NFT" || status === "Fail"
                                          ? "text-red-700"
                                          : status === "Pass"
                                            ? "text-green-700"
                                            : "text-blue-700"
                                      )
                                    : isFuture
                                      ? "text-gray-400"
                                      : "text-gray-700"
                              }`}
                            >
                              {LAB_STATUS_LABELS[status]}
                              {isCurrent && (
                                <span
                                  className={`ml-2 text-xs px-1.5 py-0.5 rounded ${
                                    status === "NFT"
                                      ? "bg-red-100 text-red-700"
                                      : status === "Pass"
                                        ? "bg-green-100 text-green-700"
                                        : status === "Fail"
                                          ? "bg-red-100 text-red-700"
                                          : "bg-blue-100 text-blue-700"
                                  }`}
                                >
                                  {TERMINAL_LAB_STATUSES.includes(status)
                                    ? "Terminal"
                                    : "Current"}
                                </span>
                              )}
                            </p>
                            {logEntry && (
                              <span className="text-xs text-gray-500">
                                {logEntry.date}
                              </span>
                            )}
                          </div>
                          {logEntry?.remarks && (
                            <p className="text-xs text-gray-600 mt-0.5">
                              {logEntry.remarks}
                            </p>
                          )}
                          {logEntry?.attachmentName && (
                            <div className="flex items-center gap-1 mt-1">
                              <Paperclip size={11} className="text-blue-500" />
                              <span className="text-xs text-blue-600">
                                {logEntry.attachmentName}
                              </span>
                            </div>
                          )}
                          {isFuture && (
                            <p className="text-xs text-gray-400 mt-0.5">
                              Pending
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  });
                })()}
              </div>
            </div>
          )}
          <DialogFooter>
            <Button
              data-ocid="lab.view_log.close_button"
              variant="outline"
              onClick={() => setLogSample(null)}
              className="text-sm"
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── Documents View Dialog ── */}
      <Dialog open={!!docsEntry} onOpenChange={() => setDocsEntry(null)}>
        <DialogContent data-ocid="lab.docs.dialog" className="max-w-md">
          <DialogHeader>
            <DialogTitle style={{ color: "#1a3a6b" }}>
              Attached Documents
            </DialogTitle>
          </DialogHeader>
          {docsEntry && (
            <div>
              <div className="p-3 bg-gray-50 rounded-lg border mb-4">
                <p className="font-semibold text-sm">
                  {docsEntry.brandName} — {docsEntry.modelNumber}
                </p>
                <p className="text-xs text-gray-500">
                  {docsEntry.categoryName}
                </p>
              </div>
              <div className="space-y-2">
                {docsEntry.documents.map((doc) => (
                  <div
                    key={doc.name}
                    className="flex items-center justify-between p-2 border rounded-lg hover:bg-gray-50"
                  >
                    <div className="flex items-center gap-2">
                      <FileText size={16} className="text-blue-500" />
                      <div>
                        <p className="text-xs font-medium text-gray-800">
                          {doc.name}
                        </p>
                        <p className="text-xs text-gray-400">{doc.type}</p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0"
                      onClick={() => toast.info(`Downloading: ${doc.name}`)}
                      data-ocid="lab.docs.download.button"
                    >
                      <Download size={14} className="text-gray-500" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDocsEntry(null)}
              className="text-sm"
              data-ocid="lab.docs.close_button"
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── BEE Verification Dialog (read-only preview) ── */}
      <Dialog open={!!verifyEntry} onOpenChange={() => setVerifyEntry(null)}>
        <DialogContent data-ocid="lab.verify.dialog" className="max-w-md">
          <DialogHeader>
            <DialogTitle style={{ color: "#1a3a6b" }}>
              BEE Verification Status
            </DialogTitle>
          </DialogHeader>
          {verifyEntry && (
            <div className="space-y-3">
              <div className="p-3 bg-gray-50 rounded-lg border">
                <p className="font-semibold text-sm">
                  {verifyEntry.brandName} — {verifyEntry.modelNumber}
                </p>
                <p className="text-xs text-gray-500">
                  {verifyEntry.categoryName}
                </p>
              </div>
              <div
                className={`p-3 rounded-lg border text-sm font-medium ${beeBadge(verifyEntry.beeVerificationStatus)}`}
              >
                BEE Status: {verifyEntry.beeVerificationStatus}
              </div>
            </div>
          )}
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setVerifyEntry(null)}
              className="text-sm"
              data-ocid="lab.verify.close_button"
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

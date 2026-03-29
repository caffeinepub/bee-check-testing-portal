import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import {
  AlertTriangle,
  CheckCircle,
  Download,
  FileText,
  FlaskConical,
  Paperclip,
  XCircle,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import type { SecondCheckSample } from "../../contexts/SecondCheckContext";
import { useSecondCheck } from "../../contexts/SecondCheckContext";
import {
  type TestReportEntry,
  testReportEntries as initialEntries,
} from "../../data/mockData";
import { addForwardedCase } from "../../store/forwardedCasesStore";

export default function LabResultsPage() {
  const [entries, setEntries] = useState<TestReportEntry[]>(initialEntries);
  const [docsEntry, setDocsEntry] = useState<TestReportEntry | null>(null);
  const [verifyEntry, setVerifyEntry] = useState<TestReportEntry | null>(null);
  const [verifyRemarks, setVerifyRemarks] = useState("");
  const [filterStatus, setFilterStatus] = useState<
    "All" | "Pass" | "Fail" | "NFT"
  >("All");

  // 2nd Check states
  const { secondCheckSamples, submitOfficialVerdict } = useSecondCheck();
  const [sc2Verdict, setSc2Verdict] = useState<"Pass" | "Fail" | null>(null);
  const [sc2Remarks, setSc2Remarks] = useState("");
  const [sc2Sample, setSc2Sample] = useState<SecondCheckSample | null>(null);

  const pendingSecondCheck = secondCheckSamples.filter(
    (s) =>
      s.status === "ReportUploaded" &&
      (!s.officialVerificationStatus ||
        s.officialVerificationStatus === "Pending"),
  );

  const filtered =
    filterStatus === "All"
      ? entries
      : entries.filter((e) => e.finalStatus === filterStatus);

  const finalBadge = (status: "Pass" | "Fail" | "NFT") => {
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

  const handleVerify = () => {
    if (!verifyEntry) return;
    setEntries((prev) =>
      prev.map((e) =>
        e.sampleId === verifyEntry.sampleId
          ? { ...e, beeVerificationStatus: "Verified" }
          : e,
      ),
    );
    toast.success(
      `${verifyEntry.brandName} ${verifyEntry.modelNumber} verified by BEE Official`,
    );
    setVerifyEntry(null);
    setVerifyRemarks("");
  };

  const handleSendBack = () => {
    if (!verifyEntry) return;
    if (!verifyRemarks.trim()) {
      toast.error("Please provide remarks for sending back");
      return;
    }
    setEntries((prev) =>
      prev.map((e) =>
        e.sampleId === verifyEntry.sampleId
          ? { ...e, beeVerificationStatus: "SendBack" }
          : e,
      ),
    );
    toast.info(
      `${verifyEntry.brandName} ${verifyEntry.modelNumber} sent back to Lab`,
    );
    setVerifyEntry(null);
    setVerifyRemarks("");
  };

  const handleSc2Submit = () => {
    if (!sc2Sample || !sc2Verdict) {
      toast.error("Please select a verdict (Pass or Fail).");
      return;
    }
    const outcome = submitOfficialVerdict(sc2Sample.id, sc2Verdict);
    if (outcome === "mismatch") {
      // Forward to Director
      addForwardedCase({
        reportId: Date.now(),
        appliance: sc2Sample.category,
        brand: sc2Sample.brandName,
        model: sc2Sample.modelNumber,
        stars: 3,
        official: "BEE Official",
        approvalDate: new Date().toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        }),
        lab: sc2Sample.lab1Name,
        testResult: "Fail",
        status: "Pending Review",
        remark: sc2Remarks,
        forwardedBy: "BEE Official",
        forwardedAt: new Date().toLocaleString("en-IN"),
        forwardingNote:
          sc2Remarks ||
          "2nd Check Test mismatch: Test Lab reported Fail, BEE Official verdict is Pass. Forwarding to Director for final arbitration.",
        attachedDocuments: [],
        is2ndCheck: true,
      });
      toast.warning(
        "Mismatch detected! Lab: Fail, Official: Pass 2014 forwarded to Director for final decision.",
        { duration: 5000 },
      );
    } else {
      toast.success(
        `2nd Check Test result published as ${
          sc2Verdict === "Pass" ? "Passed" : "Failed"
        }.`,
      );
    }
    setSc2Sample(null);
    setSc2Verdict(null);
    setSc2Remarks("");
  };

  const pendingCount = entries.filter(
    (e) => e.beeVerificationStatus === "Pending",
  ).length;

  return (
    <div className="space-y-8">
      {/* ── Regular Lab Results ─────────────────────────────────────── */}
      <div>
        <div className="mb-6">
          <h2 className="text-xl font-bold" style={{ color: "#1a3a6b" }}>
            Lab Results — Pending Verification
          </h2>
          <p className="text-gray-500 text-sm">
            Test results from laboratories forwarded for BEE Official review
          </p>
        </div>

        {/* Summary */}
        <div className="grid grid-cols-4 gap-4 mb-5">
          {(["All", "Pass", "Fail", "NFT"] as const).map((s) => {
            const count =
              s === "All"
                ? entries.length
                : entries.filter((e) => e.finalStatus === s).length;
            const pending =
              s === "All"
                ? pendingCount
                : entries.filter(
                    (e) =>
                      e.finalStatus === s &&
                      e.beeVerificationStatus === "Pending",
                  ).length;
            return (
              <button
                key={s}
                type="button"
                data-ocid={`official.labresults.${s.toLowerCase()}.card`}
                onClick={() => setFilterStatus(s)}
                className={`p-3 rounded-lg border text-left transition-all hover:shadow-md ${
                  filterStatus === s
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-200 bg-white"
                }`}
              >
                <p className="text-xl font-bold text-gray-800">{count}</p>
                <p className="text-xs font-semibold text-gray-600">
                  {s === "All" ? "Total" : s}
                </p>
                {pending > 0 && (
                  <p className="text-xs text-yellow-600 mt-0.5">
                    {pending} pending
                  </p>
                )}
              </button>
            );
          })}
        </div>

        {pendingCount > 0 && (
          <div className="mb-4 flex items-center gap-2 p-3 rounded-lg bg-yellow-50 border border-yellow-200">
            <FlaskConical size={16} className="text-yellow-600" />
            <p className="text-sm text-yellow-700">
              <strong>{pendingCount}</strong> sample(s) awaiting BEE
              verification.
            </p>
          </div>
        )}

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
                  "Lab",
                  "Final Status",
                  "Date",
                  "Remarks",
                  "Documents",
                  "BEE Status",
                  "Action",
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
              {filtered.length === 0 && (
                <TableRow data-ocid="official.labresults.empty_state">
                  <TableCell
                    colSpan={12}
                    className="text-center py-8 text-gray-400 text-sm"
                  >
                    No lab results in this category.
                  </TableCell>
                </TableRow>
              )}
              {filtered.map((r, i) => (
                <TableRow
                  key={`${r.sampleId}-${i}`}
                  data-ocid={`official.labresults.item.${i + 1}`}
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
                  <TableCell className="text-xs text-gray-600">
                    {r.labName}
                  </TableCell>
                  <TableCell>
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full border font-semibold ${finalBadge(r.finalStatus)}`}
                    >
                      {r.finalStatus === "Pass" && "✓ Pass"}
                      {r.finalStatus === "Fail" && "✗ Fail"}
                      {r.finalStatus === "NFT" && "⚠ NFT"}
                    </span>
                  </TableCell>
                  <TableCell className="text-xs text-gray-600">
                    {r.date}
                  </TableCell>
                  <TableCell className="text-xs text-gray-600 max-w-[120px] truncate">
                    {r.remarks || "—"}
                  </TableCell>
                  <TableCell>
                    <Button
                      data-ocid={`official.labresults.docs.button.${i + 1}`}
                      variant="outline"
                      size="sm"
                      className="h-6 text-xs px-2 border-blue-300 text-blue-700 hover:bg-blue-50"
                      onClick={() => setDocsEntry(r)}
                    >
                      <Paperclip size={11} className="mr-1" />
                      {r.documents.length}
                    </Button>
                  </TableCell>
                  <TableCell>
                    <Badge
                      className={`text-xs border ${beeBadge(r.beeVerificationStatus)} hover:${beeBadge(r.beeVerificationStatus)}`}
                    >
                      {r.beeVerificationStatus === "Verified"
                        ? "✓ BEE Verified"
                        : r.beeVerificationStatus === "SendBack"
                          ? "Sent Back"
                          : "Pending"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {r.beeVerificationStatus === "Pending" ? (
                      <Button
                        data-ocid={`official.labresults.verify.button.${i + 1}`}
                        size="sm"
                        className="h-6 text-xs px-2 text-white"
                        style={{ backgroundColor: "#1a3a6b" }}
                        onClick={() => {
                          setVerifyEntry(r);
                          setVerifyRemarks("");
                        }}
                      >
                        Review
                      </Button>
                    ) : (
                      <span className="text-xs text-gray-400">—</span>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* ── 2nd Check Test Results ───────────────────────────────────── */}
      <div>
        <div className="mb-4">
          <h2
            className="text-xl font-bold flex items-center gap-2"
            style={{ color: "#1a3a6b" }}
          >
            <AlertTriangle size={20} className="text-amber-500" />
            2nd Check Test Results — Pending Verification
          </h2>
          <p className="text-gray-500 text-sm">
            Reports from 2nd Check Test labs. Apply mismatch logic: if Lab=Fail
            and you select Pass, the case escalates to Director.
          </p>
        </div>

        {pendingSecondCheck.length === 0 ? (
          <div className="bg-white rounded-lg border border-gray-200 p-8 text-center text-gray-400 text-sm">
            <FlaskConical size={36} className="mx-auto mb-2 opacity-30" />
            No 2nd Check Test results pending verification.
          </div>
        ) : (
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow style={{ backgroundColor: "#7c3aed" }}>
                  {[
                    "#",
                    "Category",
                    "Brand",
                    "Model",
                    "Assigned Lab",
                    "Lab Result",
                    "Official Verdict",
                    "Action",
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
                {pendingSecondCheck.map((s, i) => (
                  <TableRow key={s.id} className="hover:bg-purple-50">
                    <TableCell className="text-xs text-gray-500">
                      {i + 1}
                    </TableCell>
                    <TableCell className="text-xs">{s.category}</TableCell>
                    <TableCell className="text-xs font-medium">
                      {s.brandName}
                    </TableCell>
                    <TableCell className="text-xs font-mono">
                      {s.modelNumber}
                    </TableCell>
                    <TableCell className="text-xs">{s.lab1Name}</TableCell>
                    <TableCell>
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full border font-semibold ${
                          s.labResult === "Pass"
                            ? "bg-green-100 text-green-800 border-green-300"
                            : "bg-red-100 text-red-800 border-red-300"
                        }`}
                      >
                        {s.labResult === "Pass" ? (
                          <span className="flex items-center gap-1">
                            <CheckCircle size={11} /> Pass
                          </span>
                        ) : (
                          <span className="flex items-center gap-1">
                            <XCircle size={11} /> Fail
                          </span>
                        )}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Badge className="bg-yellow-100 text-yellow-700 text-xs border border-yellow-300">
                        Pending
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Button
                        size="sm"
                        className="h-6 text-xs px-2 text-white"
                        style={{ backgroundColor: "#7c3aed" }}
                        onClick={() => {
                          setSc2Sample(s);
                          setSc2Verdict(null);
                          setSc2Remarks("");
                        }}
                      >
                        Review
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>

      {/* Documents Dialog (regular) */}
      <Dialog open={!!docsEntry} onOpenChange={() => setDocsEntry(null)}>
        <DialogContent data-ocid="official.docs.dialog" className="max-w-md">
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
                      data-ocid="official.docs.download.button"
                      onClick={() => toast.info(`Downloading: ${doc.name}`)}
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
              data-ocid="official.docs.close_button"
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Verify / Send Back Dialog (regular) */}
      <Dialog open={!!verifyEntry} onOpenChange={() => setVerifyEntry(null)}>
        <DialogContent data-ocid="official.verify.dialog" className="max-w-md">
          <DialogHeader>
            <DialogTitle style={{ color: "#1a3a6b" }}>
              Review Lab Result
            </DialogTitle>
          </DialogHeader>
          {verifyEntry && (
            <div className="space-y-4">
              <div className="p-3 bg-gray-50 rounded-lg border">
                <p className="font-semibold text-sm">
                  {verifyEntry.brandName} — {verifyEntry.modelNumber}
                </p>
                <p className="text-xs text-gray-500">
                  {verifyEntry.categoryName} | {verifyEntry.labName}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <span
                  className={`text-sm px-3 py-1 rounded-full border font-semibold ${finalBadge(verifyEntry.finalStatus)}`}
                >
                  {verifyEntry.finalStatus === "Pass" && "✓ Pass"}
                  {verifyEntry.finalStatus === "Fail" && "✗ Fail"}
                  {verifyEntry.finalStatus === "NFT" && "⚠ NFT"}
                </span>
                <span className="text-xs text-gray-500">
                  {verifyEntry.date}
                </span>
              </div>
              {verifyEntry.remarks && (
                <div className="p-3 bg-blue-50 rounded border border-blue-100">
                  <p className="text-xs text-gray-500 mb-0.5">Lab Remarks</p>
                  <p className="text-sm text-gray-700">{verifyEntry.remarks}</p>
                </div>
              )}
              <div>
                <p className="text-xs font-medium text-gray-700 mb-1">
                  Attached Documents ({verifyEntry.documents.length})
                </p>
                <div className="space-y-1 max-h-32 overflow-y-auto">
                  {verifyEntry.documents.map((doc) => (
                    <div
                      key={doc.name}
                      className="flex items-center gap-2 text-xs text-blue-700 p-1 border rounded"
                    >
                      <Paperclip size={11} />
                      <span>{doc.name}</span>
                      <span className="text-gray-400 ml-auto">{doc.type}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <Label className="text-xs font-medium text-gray-700">
                  Remarks (required for Send Back)
                </Label>
                <Textarea
                  data-ocid="official.verify.remarks.textarea"
                  placeholder="Add verification remarks..."
                  value={verifyRemarks}
                  onChange={(e) => setVerifyRemarks(e.target.value)}
                  className="mt-1 text-sm resize-none"
                  rows={3}
                />
              </div>
            </div>
          )}
          <DialogFooter className="gap-2">
            <Button
              data-ocid="official.verify.sendback.button"
              variant="outline"
              className="text-sm border-red-300 text-red-700 hover:bg-red-50"
              onClick={handleSendBack}
            >
              Send Back to Lab
            </Button>
            <Button
              data-ocid="official.verify.confirm_button"
              className="text-sm text-white"
              style={{ backgroundColor: "#10b981" }}
              onClick={handleVerify}
            >
              Verify & Approve
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 2nd Check Verdict Dialog */}
      <Dialog open={!!sc2Sample} onOpenChange={() => setSc2Sample(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle style={{ color: "#7c3aed" }}>
              2nd Check Test — BEE Official Verdict
            </DialogTitle>
          </DialogHeader>
          {sc2Sample && (
            <div className="space-y-4">
              <div className="p-3 bg-purple-50 rounded-lg border border-purple-200">
                <p className="font-semibold text-sm text-purple-900">
                  {sc2Sample.brandName} — {sc2Sample.modelNumber}
                </p>
                <p className="text-xs text-purple-600">
                  {sc2Sample.category} | Lab: {sc2Sample.lab1Name}
                </p>
              </div>

              {/* Lab result display */}
              <div className="flex items-center gap-3 p-3 rounded-lg border bg-gray-50">
                <span className="text-xs text-gray-600 font-medium">
                  Lab Result:
                </span>
                <span
                  className={`text-sm px-3 py-1 rounded-full border font-semibold ${
                    sc2Sample.labResult === "Pass"
                      ? "bg-green-100 text-green-800 border-green-300"
                      : "bg-red-100 text-red-800 border-red-300"
                  }`}
                >
                  {sc2Sample.labResult === "Pass" ? "✓ Pass" : "✗ Fail"}
                </span>
              </div>

              {sc2Sample.labResult === "Fail" && (
                <div className="p-3 rounded-lg border border-amber-200 bg-amber-50">
                  <p className="text-xs text-amber-800 font-semibold flex items-center gap-1">
                    <AlertTriangle size={13} /> Mismatch Warning
                  </p>
                  <p className="text-xs text-amber-700 mt-0.5">
                    The Lab reported <strong>Fail</strong>. If you select{" "}
                    <strong>Pass</strong>, this will be flagged as a mismatch
                    and escalated to the Director for final decision.
                  </p>
                </div>
              )}

              <div>
                <Label className="text-xs font-semibold text-gray-700 mb-2 block">
                  Your Verdict
                </Label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    className={`p-3 rounded-xl border-2 text-center transition-colors ${
                      sc2Verdict === "Pass"
                        ? "border-green-500 bg-green-50"
                        : "border-gray-200 bg-gray-50 hover:bg-green-50"
                    }`}
                    onClick={() => setSc2Verdict("Pass")}
                  >
                    <CheckCircle
                      size={22}
                      className="mx-auto text-green-600 mb-1"
                    />
                    <p className="text-sm font-semibold text-green-700">Pass</p>
                  </button>
                  <button
                    type="button"
                    className={`p-3 rounded-xl border-2 text-center transition-colors ${
                      sc2Verdict === "Fail"
                        ? "border-red-500 bg-red-50"
                        : "border-gray-200 bg-gray-50 hover:bg-red-50"
                    }`}
                    onClick={() => setSc2Verdict("Fail")}
                  >
                    <XCircle size={22} className="mx-auto text-red-600 mb-1" />
                    <p className="text-sm font-semibold text-red-700">Fail</p>
                  </button>
                </div>
              </div>

              <div>
                <Label className="text-xs font-medium text-gray-700">
                  Remarks
                </Label>
                <Textarea
                  value={sc2Remarks}
                  onChange={(e) => setSc2Remarks(e.target.value)}
                  placeholder="Add verification remarks..."
                  className="mt-1 text-sm resize-none"
                  rows={3}
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setSc2Sample(null)}>
              Cancel
            </Button>
            <Button
              style={{ backgroundColor: "#7c3aed" }}
              className="text-white"
              onClick={handleSc2Submit}
              disabled={!sc2Verdict}
            >
              Submit Verdict
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

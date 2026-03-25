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
import { Download, FileText, FlaskConical, Paperclip } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import {
  type TestReportEntry,
  testReportEntries as initialEntries,
} from "../../data/mockData";

export default function LabResultsPage() {
  const [entries, setEntries] = useState<TestReportEntry[]>(initialEntries);
  const [docsEntry, setDocsEntry] = useState<TestReportEntry | null>(null);
  const [verifyEntry, setVerifyEntry] = useState<TestReportEntry | null>(null);
  const [verifyRemarks, setVerifyRemarks] = useState("");
  const [filterStatus, setFilterStatus] = useState<
    "All" | "Pass" | "Fail" | "NFT"
  >("All");

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

  const pendingCount = entries.filter(
    (e) => e.beeVerificationStatus === "Pending",
  ).length;

  return (
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
            <strong>{pendingCount}</strong> sample(s) awaiting BEE verification.
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
                <TableHead key={h} className="text-white text-xs font-semibold">
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
                <TableCell className="text-xs text-gray-500">{i + 1}</TableCell>
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

      {/* Documents Dialog */}
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

      {/* Verify / Send Back Dialog */}
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
    </div>
  );
}

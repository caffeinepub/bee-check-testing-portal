import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
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
  Download,
  FileSpreadsheet,
  FileText,
  FileType2,
  Paperclip,
  Upload,
  X,
} from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { type MockReport, mockReports } from "../../data/mockData";
import {
  type AttachedDocument,
  type ForwardedCase,
  addForwardedCase,
} from "../../store/forwardedCasesStore";

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

// Dummy test lab docs for pending reports (simulating what Test Lab uploaded)
const DUMMY_LAB_DOCS: AttachedDocument[] = [
  {
    id: 901,
    name: "Lab_TestReport_Primary.pdf",
    type: "PDF",
    size: "2.1 MB",
    uploadedBy: "Test Lab",
    uploadedAt: "2024-05-02",
    description: "Primary test report uploaded by the testing laboratory",
  },
  {
    id: 902,
    name: "Test_Data_Summary.xlsx",
    type: "XLSX",
    size: "760 KB",
    uploadedBy: "Test Lab",
    uploadedAt: "2024-05-02",
    description: "Detailed test data and measurements spreadsheet",
  },
];

export default function ReviewReportsPage() {
  const [reports, setReports] = useState(mockReports);
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [selectedReport, setSelectedReport] = useState<MockReport | null>(null);
  const [action, setAction] = useState<"approve" | "reject" | "revert" | null>(
    null,
  );
  const [remarks, setRemarks] = useState("");
  const [forwardingNote, setForwardingNote] = useState("");
  const [attachedFiles, setAttachedFiles] = useState<AttachedDocument[]>([
    {
      id: 801,
      name: "Official_Review_Note.docx",
      type: "DOCX",
      size: "340 KB",
      uploadedBy: "BEE Official",
      uploadedAt: new Date().toISOString().split("T")[0],
      description: "BEE Official review observations",
    },
  ]);
  const _fileInputRef = useRef<HTMLInputElement>(null);

  const categories = [...new Set(reports.map((r) => r.categoryName))];
  const filtered = reports.filter(
    (r) =>
      (categoryFilter === "all" || r.categoryName === categoryFilter) &&
      r.reviewStatus === "Pending",
  );

  const forwardedReportIds = new Set(
    reports.filter((r) => r.reviewStatus === "Approved").map((r) => r.id),
  );

  function handleSimulatedUpload() {
    const fileNames = [
      "Compliance_Checklist.pdf",
      "Official_Verification.docx",
      "StarRating_Confirmation.pdf",
      "BEE_Audit_Notes.xlsx",
    ];
    const types = ["PDF", "DOCX", "PDF", "XLSX"];
    const sizes = ["520 KB", "290 KB", "410 KB", "680 KB"];
    const idx = attachedFiles.length % fileNames.length;
    const newDoc: AttachedDocument = {
      id: Date.now(),
      name: fileNames[idx],
      type: types[idx],
      size: sizes[idx],
      uploadedBy: "BEE Official",
      uploadedAt: new Date().toISOString().split("T")[0],
      description: "Attached by BEE Official during review",
    };
    setAttachedFiles((prev) => [...prev, newDoc]);
    toast.success(`File "${newDoc.name}" attached successfully`);
  }

  function removeAttachedFile(id: number) {
    setAttachedFiles((prev) => prev.filter((f) => f.id !== id));
  }

  const handleAction = () => {
    if (!selectedReport || !action) return;
    if ((action === "reject" || action === "revert") && !remarks.trim()) {
      toast.error("Remarks are mandatory for rejection/revert action");
      return;
    }
    const newStatus =
      action === "approve"
        ? "Approved"
        : action === "reject"
          ? "Rejected"
          : "Reverted";
    setReports((prev) =>
      prev.map((r) =>
        r.id === selectedReport.id
          ? { ...r, reviewStatus: newStatus as any, reviewRemarks: remarks }
          : r,
      ),
    );

    if (action === "approve") {
      // Build forwarded case with all documents
      const allDocs = [...DUMMY_LAB_DOCS, ...attachedFiles];
      const forwardedCase: ForwardedCase = {
        reportId: selectedReport.id,
        appliance: selectedReport.categoryName,
        brand: selectedReport.brandName,
        model: selectedReport.modelNumber,
        stars: 3,
        official: "BEE Official A",
        approvalDate: new Date().toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        }),
        lab: selectedReport.labName,
        testResult: selectedReport.result as "Pass" | "Fail",
        status: "Pending Review",
        remark: "",
        forwardedBy: "BEE Official A",
        forwardedAt: new Date().toLocaleString("en-IN"),
        forwardingNote:
          forwardingNote ||
          "Test report reviewed. All parameters verified. Forwarding for Director final approval.",
        labVerdict: selectedReport.result as "Pass" | "Fail",
        officialVerdict: "Pass" as "Pass" | "Fail",
        attachedDocuments: allDocs,
      };
      addForwardedCase(forwardedCase);
      toast.success(
        `Report approved and forwarded to Director with ${allDocs.length} documents`,
      );
    } else {
      toast.success(`Report ${newStatus} successfully`);
    }

    setSelectedReport(null);
    setAction(null);
    setRemarks("");
    setForwardingNote("");
    setAttachedFiles([
      {
        id: 801,
        name: "Official_Review_Note.docx",
        type: "DOCX",
        size: "340 KB",
        uploadedBy: "BEE Official",
        uploadedAt: new Date().toISOString().split("T")[0],
        description: "BEE Official review observations",
      },
    ]);
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-bold" style={{ color: "#1a3a6b" }}>
          Review Test Reports
        </h2>
        <p className="text-gray-500 text-sm">
          Review pending reports from Test Laboratories
        </p>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-3 mb-4 flex gap-3">
        <div className="min-w-[200px]">
          <p className="text-xs text-gray-600 mb-1">Appliance Category</p>
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger
              data-ocid="review.category.select"
              className="h-8 text-sm"
            >
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((c) => (
                <SelectItem key={c} value={c}>
                  {c}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
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
                "Lab",
                "State",
                "Result",
                "Submitted",
                "Action",
              ].map((h) => (
                <TableHead key={h} className="text-white text-xs">
                  {h}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((r, i) => (
              <TableRow
                key={r.id}
                data-ocid={`review.row.${i + 1}`}
                className="hover:bg-blue-50"
              >
                <TableCell className="text-xs">{i + 1}</TableCell>
                <TableCell className="text-xs">{r.categoryName}</TableCell>
                <TableCell className="text-xs font-medium">
                  {r.brandName}
                </TableCell>
                <TableCell className="text-xs font-mono">
                  {r.modelNumber}
                </TableCell>
                <TableCell className="text-xs">{r.labName}</TableCell>
                <TableCell className="text-xs">{r.state}</TableCell>
                <TableCell>
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full font-medium ${r.result === "Pass" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}
                  >
                    {r.result}
                  </span>
                </TableCell>
                <TableCell className="text-xs">{r.submittedAt}</TableCell>
                <TableCell>
                  {forwardedReportIds.has(r.id) ? (
                    <span className="text-xs px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 font-medium">
                      ✓ Forwarded to Director
                    </span>
                  ) : (
                    <Button
                      data-ocid={`review.review.button.${i + 1}`}
                      size="sm"
                      className="h-6 text-xs px-2"
                      style={{ backgroundColor: "#1a3a6b" }}
                      onClick={() => {
                        setSelectedReport(r);
                        setAction(null);
                        setRemarks("");
                        setForwardingNote("");
                      }}
                    >
                      Review
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {filtered.length === 0 && (
          <div
            className="py-8 text-center text-gray-400 text-sm"
            data-ocid="review.table.empty_state"
          >
            No pending reports for selected category
          </div>
        )}
      </div>

      <Sheet
        open={!!selectedReport}
        onOpenChange={() => {
          setSelectedReport(null);
          setAction(null);
          setRemarks("");
          setForwardingNote("");
        }}
      >
        <SheetContent
          data-ocid="review.detail.sheet"
          className="w-[520px] overflow-y-auto"
        >
          <SheetHeader>
            <SheetTitle>Review Test Report</SheetTitle>
          </SheetHeader>
          {selectedReport && (
            <div className="py-4 space-y-5">
              {/* Report Details */}
              <div className="grid grid-cols-2 gap-3 text-sm">
                {[
                  ["Brand", selectedReport.brandName],
                  ["Model", selectedReport.modelNumber],
                  ["Category", selectedReport.categoryName],
                  ["Lab", selectedReport.labName],
                  ["State", selectedReport.state],
                  ["Result", selectedReport.result],
                  ["Submitted", selectedReport.submittedAt],
                ].map(([k, v]) => (
                  <div key={k}>
                    <p className="text-xs text-gray-500">{k}</p>
                    <p className="font-medium">{v}</p>
                  </div>
                ))}
              </div>

              {/* Test Lab Documents */}
              <div
                className="rounded-lg border border-blue-100 p-3"
                style={{ backgroundColor: "#f0f7ff" }}
                data-ocid="review.docs.panel"
              >
                <p
                  className="text-xs font-bold uppercase tracking-wide mb-2"
                  style={{ color: "#1a3a6b" }}
                >
                  📄 Test Lab Documents
                </p>
                <div className="space-y-2">
                  {DUMMY_LAB_DOCS.map((doc) => (
                    <div
                      key={doc.id}
                      className="flex items-center justify-between bg-white rounded-lg px-3 py-2 border border-blue-100"
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

              {/* Action Buttons */}
              <div className="border-t pt-4">
                <p className="text-sm font-medium text-gray-700 mb-3">
                  Select Action:
                </p>
                <div className="flex gap-2 flex-wrap">
                  <Button
                    data-ocid="review.approve.button"
                    size="sm"
                    className="bg-green-600 hover:bg-green-700 text-white"
                    onClick={() => {
                      setAction("approve");
                      setRemarks("");
                    }}
                  >
                    ✓ Approve & Forward
                  </Button>
                  <Button
                    data-ocid="review.reject.button"
                    size="sm"
                    variant="destructive"
                    onClick={() => setAction("reject")}
                  >
                    ✕ Reject
                  </Button>
                  <Button
                    data-ocid="review.revert.button"
                    size="sm"
                    variant="outline"
                    className="text-orange-600 border-orange-300"
                    onClick={() => setAction("revert")}
                  >
                    ↺ Revert to Lab
                  </Button>
                </div>
              </div>

              {/* Approve — attach documents + forwarding note */}
              {action === "approve" && (
                <div
                  className="rounded-lg border border-green-200 p-4 space-y-4"
                  style={{ backgroundColor: "#f0fdf4" }}
                >
                  <p className="text-sm font-bold" style={{ color: "#166534" }}>
                    📎 Attach Documents for Director
                  </p>

                  {/* Upload area */}
                  <button
                    type="button"
                    className="w-full border-2 border-dashed border-green-300 rounded-lg p-4 text-center cursor-pointer hover:bg-green-50 transition-colors"
                    onClick={handleSimulatedUpload}
                    data-ocid="review.attach.upload_button"
                  >
                    <Upload size={20} className="mx-auto mb-1 text-green-500" />
                    <p className="text-xs font-medium text-gray-700">
                      Click to attach or drag & drop
                    </p>
                    <p className="text-xs text-gray-400">
                      PDF, DOCX, XLSX up to 10 MB
                    </p>
                  </button>

                  {/* Attached files list */}
                  {attachedFiles.length > 0 && (
                    <div className="space-y-1.5">
                      <p className="text-xs font-semibold text-gray-600">
                        Attached ({attachedFiles.length}):
                      </p>
                      {attachedFiles.map((doc) => (
                        <div
                          key={doc.id}
                          className="flex items-center justify-between bg-white rounded border border-green-100 px-3 py-1.5"
                        >
                          <div className="flex items-center gap-2 min-w-0">
                            <Paperclip
                              size={12}
                              className="text-gray-400 flex-shrink-0"
                            />
                            <span className="text-xs text-gray-800 truncate">
                              {doc.name}
                            </span>
                          </div>
                          <div className="flex items-center gap-1.5 flex-shrink-0">
                            <DocTypeBadge type={doc.type} />
                            <button
                              type="button"
                              onClick={() => removeAttachedFile(doc.id)}
                              className="text-gray-400 hover:text-red-500 transition-colors"
                            >
                              <X size={13} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Forwarding note */}
                  <div>
                    <p className="text-xs font-semibold text-gray-700 mb-1">
                      Forwarding Note to Director{" "}
                      <span className="font-normal text-gray-400">
                        (optional)
                      </span>
                    </p>
                    <Textarea
                      data-ocid="review.forwarding_note.textarea"
                      value={forwardingNote}
                      onChange={(e) => setForwardingNote(e.target.value)}
                      placeholder="Add any specific observations or notes for the Director..."
                      rows={3}
                      className="text-sm"
                    />
                  </div>
                </div>
              )}

              {/* Reject / Revert remarks */}
              {action && action !== "approve" && (
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-1">
                    Remarks <span className="text-red-500">*</span>
                  </p>
                  <Textarea
                    data-ocid="review.remarks.textarea"
                    value={remarks}
                    onChange={(e) => setRemarks(e.target.value)}
                    placeholder="Enter remarks (mandatory)"
                    rows={3}
                  />
                </div>
              )}

              {action && (
                <Button
                  data-ocid="review.submit.button"
                  className="w-full"
                  style={{ backgroundColor: "#1a3a6b" }}
                  onClick={handleAction}
                >
                  Confirm{" "}
                  {action === "approve"
                    ? `Approval & Forward to Director (${DUMMY_LAB_DOCS.length + attachedFiles.length} docs)`
                    : action === "reject"
                      ? "Rejection"
                      : "Revert"}
                </Button>
              )}
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}

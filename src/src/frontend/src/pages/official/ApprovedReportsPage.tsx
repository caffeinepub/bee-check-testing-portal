import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Download, FileSpreadsheet, FileText, FileType2 } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { mockReports } from "../../data/mockData";
import {
  type ForwardedCase,
  getForwardedCases,
  subscribeForwardedCases,
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

export default function ApprovedReportsPage() {
  const [forwardedCases, setForwardedCases] =
    useState<ForwardedCase[]>(getForwardedCases);
  const [viewDocsCase, setViewDocsCase] = useState<ForwardedCase | null>(null);

  useEffect(() => {
    return subscribeForwardedCases(() => {
      setForwardedCases(getForwardedCases());
    });
  }, []);

  const approved = mockReports.filter((r) => r.reviewStatus === "Approved");

  function getForwardedCase(reportId: number) {
    return forwardedCases.find((c) => c.reportId === reportId);
  }

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-bold" style={{ color: "#1a3a6b" }}>
          Approved Reports
        </h2>
        <p className="text-gray-500 text-sm">
          Reports approved and forwarded to Director
        </p>
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
                "Remarks",
                "Documents",
                "Status",
              ].map((h) => (
                <TableHead key={h} className="text-white text-xs">
                  {h}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {approved.map((r, i) => {
              const fwdCase = getForwardedCase(r.id);
              const docCount = fwdCase?.attachedDocuments?.length ?? 0;
              return (
                <TableRow
                  key={r.id}
                  data-ocid={`approved.row.${i + 1}`}
                  className="hover:bg-green-50"
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
                    <span className="text-xs px-2 py-0.5 rounded-full bg-green-100 text-green-800 font-medium">
                      {r.result}
                    </span>
                  </TableCell>
                  <TableCell className="text-xs">{r.submittedAt}</TableCell>
                  <TableCell className="text-xs text-gray-500">
                    {r.reviewRemarks || "-"}
                  </TableCell>
                  <TableCell>
                    {docCount > 0 ? (
                      <Button
                        data-ocid={`approved.view_docs.button.${i + 1}`}
                        size="sm"
                        variant="outline"
                        className="h-6 text-xs px-2 border-blue-300 text-blue-700 hover:bg-blue-50"
                        onClick={() => setViewDocsCase(fwdCase!)}
                      >
                        📎 {docCount} Docs
                      </Button>
                    ) : (
                      <span className="text-xs text-gray-300">—</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 font-semibold">
                      ✓ Forwarded to Director
                    </span>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
        {approved.length === 0 && (
          <div className="py-8 text-center text-gray-400 text-sm">
            No approved reports
          </div>
        )}
      </div>

      {/* View Documents Dialog */}
      <Dialog
        open={!!viewDocsCase}
        onOpenChange={(open) => !open && setViewDocsCase(null)}
      >
        <DialogContent className="max-w-lg" data-ocid="approved.docs.dialog">
          <DialogHeader>
            <DialogTitle style={{ color: "#1a3a6b" }}>
              Attached Documents — {viewDocsCase?.brand} {viewDocsCase?.model}
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
                  <p className="text-xs text-blue-700">
                    {viewDocsCase.forwardingNote}
                  </p>
                </div>
              )}

              {/* Lab Docs */}
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

              {/* Official Docs */}
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
    </div>
  );
}

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
  SheetFooter,
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
import { useState } from "react";
import { toast } from "sonner";
import { type MockReport, mockReports } from "../../data/mockData";

export default function ReviewReportsPage() {
  const [reports, setReports] = useState(mockReports);
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [selectedReport, setSelectedReport] = useState<MockReport | null>(null);
  const [action, setAction] = useState<"approve" | "reject" | "revert" | null>(
    null,
  );
  const [remarks, setRemarks] = useState("");

  const categories = [...new Set(reports.map((r) => r.categoryName))];
  const filtered = reports.filter(
    (r) =>
      (categoryFilter === "all" || r.categoryName === categoryFilter) &&
      r.reviewStatus === "Pending",
  );

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
    toast.success(
      `Report ${newStatus} successfully${action === "approve" ? " and forwarded to Director" : ""}`,
    );
    setSelectedReport(null);
    setAction(null);
    setRemarks("");
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
                  <Button
                    data-ocid={`review.review.button.${i + 1}`}
                    size="sm"
                    className="h-6 text-xs px-2"
                    style={{ backgroundColor: "#1a3a6b" }}
                    onClick={() => {
                      setSelectedReport(r);
                      setAction(null);
                      setRemarks("");
                    }}
                  >
                    Review
                  </Button>
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
        }}
      >
        <SheetContent data-ocid="review.detail.sheet" className="w-[480px]">
          <SheetHeader>
            <SheetTitle>Review Test Report</SheetTitle>
          </SheetHeader>
          {selectedReport && (
            <div className="py-4 space-y-4">
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
                    ? "Approval"
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

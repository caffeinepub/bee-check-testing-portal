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
  Paperclip,
  RotateCcw,
  Upload,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import {
  HAS_ATTACHMENT,
  LAB_STATUS_LABELS,
  LAB_STATUS_SEQUENCE,
  type LabSample,
  type LabTrackingStatus,
  type StatusLogEntry,
  labSamples as initialLabSamples,
  revertedFromBEE,
} from "../../data/mockData";

interface Props {
  defaultTab?: string;
}

const STATUS_COLORS: Record<LabTrackingStatus, string> = {
  InTransit: "bg-orange-100 text-orange-800 border-orange-200",
  ReachedLab: "bg-blue-100 text-blue-800 border-blue-200",
  TestScheduled: "bg-purple-100 text-purple-800 border-purple-200",
  UnderTesting: "bg-yellow-100 text-yellow-800 border-yellow-200",
  TestDone: "bg-teal-100 text-teal-800 border-teal-200",
  ReportUploaded: "bg-indigo-100 text-indigo-800 border-indigo-200",
  NFT: "bg-red-100 text-red-800 border-red-200",
  InvoiceRaised: "bg-green-100 text-green-800 border-green-200",
};

export default function AssignedSamplesPage({ defaultTab }: Props) {
  const [samples, setSamples] = useState<LabSample[]>(initialLabSamples);
  const [activeTab, setActiveTab] = useState(
    defaultTab === "revert" ? "revert" : "tracking",
  );

  // Update Status Dialog
  const [updateSample, setUpdateSample] = useState<LabSample | null>(null);
  const [updateDate, setUpdateDate] = useState("");
  const [updateRemarks, setUpdateRemarks] = useState("");

  // View Log Dialog
  const [logSample, setLogSample] = useState<LabSample | null>(null);

  const getNextStatus = (
    current: LabTrackingStatus,
  ): LabTrackingStatus | null => {
    const idx = LAB_STATUS_SEQUENCE.indexOf(current);
    if (idx === -1 || idx === LAB_STATUS_SEQUENCE.length - 1) return null;
    return LAB_STATUS_SEQUENCE[idx + 1];
  };

  const openUpdateDialog = (sample: LabSample) => {
    const next = getNextStatus(sample.currentStatus);
    if (!next) {
      toast.info("Sample has already reached final status: Invoice Raised");
      return;
    }
    setUpdateSample(sample);
    setUpdateDate(new Date().toISOString().split("T")[0]);
    setUpdateRemarks("");
  };

  const handleUpdateSubmit = () => {
    if (!updateSample) return;
    const nextStatus = getNextStatus(updateSample.currentStatus);
    if (!nextStatus) return;
    if (!updateDate) {
      toast.error("Please select a date");
      return;
    }
    const newEntry: StatusLogEntry = {
      status: nextStatus,
      date: updateDate,
      remarks: updateRemarks || undefined,
    };
    setSamples((prev) =>
      prev.map((s) =>
        s.id === updateSample.id
          ? {
              ...s,
              currentStatus: nextStatus,
              statusLog: [...s.statusLog, newEntry],
            }
          : s,
      ),
    );
    toast.success(
      `Status updated to "${LAB_STATUS_LABELS[nextStatus]}" for ${updateSample.brandName} ${updateSample.modelNumber}`,
    );
    setUpdateSample(null);
  };

  const nextStatusForDialog = updateSample
    ? getNextStatus(updateSample.currentStatus)
    : null;
  const lastUpdatedDate = (sample: LabSample) =>
    sample.statusLog.length > 0
      ? sample.statusLog[sample.statusLog.length - 1].date
      : "—";

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
                  const isLast = s.currentStatus === "InvoiceRaised";
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
                          className={`text-xs px-2 py-0.5 rounded-full border font-medium ${
                            STATUS_COLORS[s.currentStatus]
                          }`}
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
                            className="h-6 text-xs px-2 border-blue-300 text-blue-700 hover:bg-blue-50"
                            onClick={() => openUpdateDialog(s)}
                            disabled={isLast}
                          >
                            {isLast ? "Completed" : "Update Status"}
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

        {/* ── Revert from BEE Tab ── */}
        <TabsContent value="revert">
          <div className="mb-3 flex items-center gap-2 p-3 rounded-lg bg-red-50 border border-red-200">
            <RotateCcw size={16} className="text-red-600 flex-shrink-0" />
            <p className="text-sm text-red-700">
              Samples listed below have been returned from BEE due to
              documentation or compliance issues. Please review the reason and
              take corrective action.
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
      <Dialog open={!!updateSample} onOpenChange={() => setUpdateSample(null)}>
        <DialogContent
          data-ocid="lab.update_status.dialog"
          className="max-w-md"
        >
          <DialogHeader>
            <DialogTitle style={{ color: "#1a3a6b" }}>
              Update Sample Status
            </DialogTitle>
          </DialogHeader>
          {updateSample && nextStatusForDialog && (
            <div className="space-y-4">
              <div className="p-3 bg-blue-50 rounded-lg border border-blue-100">
                <p className="text-xs text-gray-500">Sample</p>
                <p className="font-semibold text-sm">
                  {updateSample.brandName} — {updateSample.modelNumber}
                </p>
                <p className="text-xs text-gray-500 mt-0.5">
                  {updateSample.categoryName}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <div className="flex-1">
                  <p className="text-xs text-gray-500 mb-1">Current Status</p>
                  <span
                    className={`text-xs px-2 py-1 rounded-full border font-medium ${
                      STATUS_COLORS[updateSample.currentStatus]
                    }`}
                  >
                    {LAB_STATUS_LABELS[updateSample.currentStatus]}
                  </span>
                </div>
                <div className="text-gray-400 text-lg">→</div>
                <div className="flex-1">
                  <p className="text-xs text-gray-500 mb-1">Next Status</p>
                  <span
                    className={`text-xs px-2 py-1 rounded-full border font-medium ${
                      STATUS_COLORS[nextStatusForDialog]
                    }`}
                  >
                    {LAB_STATUS_LABELS[nextStatusForDialog]}
                  </span>
                </div>
              </div>

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

              {HAS_ATTACHMENT[nextStatusForDialog] && (
                <button
                  type="button"
                  className="w-full border-2 border-dashed border-blue-200 rounded-lg p-4 text-center cursor-pointer hover:bg-blue-50 transition-colors"
                  data-ocid="lab.update_status.dropzone"
                  onClick={() =>
                    toast.info(
                      `File upload for "${LAB_STATUS_LABELS[nextStatusForDialog]}" — attach your document here`,
                    )
                  }
                >
                  <Upload size={20} className="mx-auto mb-2 text-blue-400" />
                  <p className="text-xs text-blue-600 font-medium">
                    {nextStatusForDialog === "ReportUploaded"
                      ? "Attach Test Report (PDF/DOCX)"
                      : "Attach Invoice Document (PDF)"}
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
                {LAB_STATUS_SEQUENCE.map((status, idx) => {
                  const logEntry = logSample.statusLog.find(
                    (e) => e.status === status,
                  );
                  const isCurrent = logSample.currentStatus === status;
                  const isCompleted =
                    LAB_STATUS_SEQUENCE.indexOf(logSample.currentStatus) >
                    LAB_STATUS_SEQUENCE.indexOf(status);
                  const isFuture = !logEntry && !isCurrent;
                  const isLast = idx === LAB_STATUS_SEQUENCE.length - 1;

                  return (
                    <div key={status} className="flex gap-3">
                      <div className="flex flex-col items-center">
                        <div
                          className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 border-2 ${
                            isCompleted
                              ? "bg-green-500 border-green-500 text-white"
                              : isCurrent
                                ? "bg-blue-600 border-blue-600 text-white"
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
                            className={`w-0.5 flex-1 min-h-[24px] ${
                              isCompleted ? "bg-green-300" : "bg-gray-200"
                            }`}
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
                                  ? "text-blue-700"
                                  : isFuture
                                    ? "text-gray-400"
                                    : "text-gray-700"
                            }`}
                          >
                            {LAB_STATUS_LABELS[status]}
                            {isCurrent && (
                              <span className="ml-2 text-xs bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded">
                                Current
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
                })}
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
    </div>
  );
}

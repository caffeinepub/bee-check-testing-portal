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
import { Textarea } from "@/components/ui/textarea";
import {
  CalendarDays,
  CheckCircle,
  ChevronRight,
  Clock,
  FlaskConical,
  XCircle,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import type {
  SecondCheckSample,
  SecondCheckStatus,
} from "../../contexts/SecondCheckContext";
import { useSecondCheck } from "../../contexts/SecondCheckContext";

const STATUS_COLORS: Record<string, string> = {
  InTransit: "bg-blue-100 text-blue-700 border-blue-200",
  ReachedLab: "bg-orange-100 text-orange-700 border-orange-200",
  ProposedDate: "bg-yellow-100 text-yellow-700 border-yellow-200",
  TestScheduled: "bg-indigo-100 text-indigo-700 border-indigo-200",
  UnderTesting: "bg-purple-100 text-purple-700 border-purple-200",
  TestDone: "bg-teal-100 text-teal-700 border-teal-200",
  ReportUploaded: "bg-cyan-100 text-cyan-700 border-cyan-200",
  InvoiceRaised: "bg-green-100 text-green-700 border-green-200",
  NFT: "bg-red-100 text-red-700 border-red-200",
};

const STATUS_NEXT: Partial<Record<SecondCheckStatus, SecondCheckStatus>> = {
  InTransit: "ReachedLab",
  TestScheduled: "UnderTesting",
  UnderTesting: "TestDone",
  ReportUploaded: "InvoiceRaised",
};

const STATUS_LABEL: Record<SecondCheckStatus, string> = {
  InTransit: "In-Transit",
  ReachedLab: "Reached Lab",
  ProposedDate: "Date Proposed",
  TestScheduled: "Test Scheduled",
  UnderTesting: "Under Testing",
  TestDone: "Test Done",
  ReportUploaded: "Report Uploaded",
  InvoiceRaised: "Invoice Raised",
  NFT: "Not Fit for Test",
};

interface UpdateDialogState {
  open: boolean;
  sample: SecondCheckSample | null;
  mode: "advance" | "proposeDate" | "nft" | "testDone" | "log";
}

export default function LabSecondCheckPage() {
  const {
    secondCheckSamples,
    proposeTestDate,
    updateSampleStatus,
    recordTestResult,
  } = useSecondCheck();
  // Show all 2nd check samples (in real app filter by lab user)
  const samples = secondCheckSamples;

  const [dialog, setDialog] = useState<UpdateDialogState>({
    open: false,
    sample: null,
    mode: "advance",
  });
  const [proposedDate, setProposedDate] = useState("");
  const [nftRemarks, setNftRemarks] = useState("");
  const [testResult, setTestResult] = useState<"Pass" | "Fail" | null>(null);
  const [remarks, setRemarks] = useState("");

  const getDefaultProposedDate = () => {
    const d = new Date();
    d.setDate(d.getDate() + 15);
    return d.toISOString().split("T")[0];
  };

  const openDialog = (sample: SecondCheckSample) => {
    const s = sample.status;
    let mode: UpdateDialogState["mode"] = "advance";
    if (s === "ReachedLab") mode = "proposeDate";
    else if (s === "TestDone") mode = "testDone";
    else if (s === "ProposedDate") mode = "log";
    setDialog({ open: true, sample, mode });
    setProposedDate(getDefaultProposedDate());
    setNftRemarks("");
    setTestResult(null);
    setRemarks("");
  };

  const closeDialog = () =>
    setDialog({ open: false, sample: null, mode: "advance" });

  const handleAdvance = () => {
    if (!dialog.sample) return;
    const next = STATUS_NEXT[dialog.sample.status];
    if (!next) return;
    updateSampleStatus(dialog.sample.id, next, remarks);
    toast.success(`Status updated to ${STATUS_LABEL[next]}`);
    closeDialog();
  };

  const handleProposeDate = () => {
    if (!dialog.sample || !proposedDate) {
      toast.error("Please select a testing date.");
      return;
    }
    proposeTestDate(dialog.sample.id, proposedDate, dialog.sample.lab1Name);
    toast.success(
      "Testing date proposed and sent to Compliance Officer for approval.",
    );
    closeDialog();
  };

  const handleNft = () => {
    if (!dialog.sample) return;
    updateSampleStatus(
      dialog.sample.id,
      "NFT",
      nftRemarks || "Not Fit for Test",
    );
    toast.success("Sample marked as NFT (Not Fit for Test). Terminal status.");
    closeDialog();
  };

  const handleTestDone = () => {
    if (!dialog.sample || !testResult) {
      toast.error("Please select Pass or Fail.");
      return;
    }
    recordTestResult(dialog.sample.id, testResult, remarks);
    toast.success(
      `Test result recorded as ${testResult}. Report sent to BEE Official for verification.`,
    );
    closeDialog();
  };

  const lastStatus = (s: SecondCheckSample) =>
    s.statusLog[s.statusLog.length - 1]?.date ?? "—";

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold" style={{ color: "#1a3a6b" }}>
          2nd Check Test — Sample Tracking
        </h1>
        <p className="text-sm text-gray-500 mt-0.5">
          Manage secondary compliance testing samples assigned to this lab
        </p>
      </div>

      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-3 border-b border-gray-100">
          <CardTitle
            className="text-base font-semibold flex items-center gap-2"
            style={{ color: "#1a3a6b" }}
          >
            <FlaskConical size={18} />
            Assigned 2nd Check Samples
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {samples.length === 0 ? (
            <div
              className="text-center py-16 text-gray-400"
              data-ocid="lab_second_check.empty_state"
            >
              <FlaskConical size={40} className="mx-auto mb-3 opacity-30" />
              <p className="font-medium">No 2nd check samples assigned yet</p>
              <p className="text-sm mt-1">
                Samples will appear here once Purchasers complete blocking.
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead className="w-10">#</TableHead>
                  <TableHead>Brand</TableHead>
                  <TableHead>Model</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Purchaser</TableHead>
                  <TableHead>Assigned Lab</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Last Updated</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {samples.map((s, idx) => (
                  <TableRow
                    key={s.id}
                    data-ocid={`lab_second_check.item.${idx + 1}`}
                  >
                    <TableCell className="text-gray-500 text-xs">
                      {idx + 1}
                    </TableCell>
                    <TableCell className="font-medium">{s.brandName}</TableCell>
                    <TableCell className="text-xs font-mono">
                      {s.modelNumber}
                    </TableCell>
                    <TableCell className="text-xs">{s.category}</TableCell>
                    <TableCell className="text-xs">{s.purchaser}</TableCell>
                    <TableCell className="text-xs">{s.lab1Name}</TableCell>
                    <TableCell>
                      <Badge
                        className={`text-xs ${STATUS_COLORS[s.status] ?? ""}`}
                      >
                        {STATUS_LABEL[s.status]}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-xs">{lastStatus(s)}</TableCell>
                    <TableCell>
                      {s.status === "NFT" || s.status === "InvoiceRaised" ? (
                        <span className="text-xs text-gray-400">Completed</span>
                      ) : s.status === "ProposedDate" ? (
                        <Badge className="bg-yellow-100 text-yellow-700 text-xs">
                          <Clock size={11} className="mr-1" /> Awaiting CO
                          Approval
                        </Badge>
                      ) : (
                        <Button
                          size="sm"
                          variant="outline"
                          data-ocid={`lab_second_check.update_button.${idx + 1}`}
                          className="text-xs"
                          onClick={() => openDialog(s)}
                        >
                          Update Status{" "}
                          <ChevronRight size={13} className="ml-1" />
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Update Status Dialog */}
      <Dialog open={dialog.open} onOpenChange={(o) => !o && closeDialog()}>
        <DialogContent className="max-w-md" data-ocid="lab_second_check.dialog">
          <DialogHeader>
            <DialogTitle>Update Sample Status</DialogTitle>
          </DialogHeader>

          {dialog.sample && (
            <div className="space-y-4">
              <div className="p-3 rounded-lg bg-gray-50 text-sm">
                <p className="font-semibold text-gray-800">
                  {dialog.sample.brandName} — {dialog.sample.modelNumber}
                </p>
                <p className="text-gray-500 text-xs mt-0.5">
                  Current:{" "}
                  <span className="font-medium">
                    {STATUS_LABEL[dialog.sample.status]}
                  </span>
                </p>
              </div>

              {/* Advance status */}
              {dialog.mode === "advance" &&
                (() => {
                  const next = STATUS_NEXT[dialog.sample!.status];
                  return next ? (
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <Badge
                          className={`text-xs ${STATUS_COLORS[dialog.sample!.status]}`}
                        >
                          {STATUS_LABEL[dialog.sample!.status]}
                        </Badge>
                        <ChevronRight size={16} className="text-gray-400" />
                        <Badge className={`text-xs ${STATUS_COLORS[next]}`}>
                          {STATUS_LABEL[next]}
                        </Badge>
                      </div>
                      <div className="space-y-1">
                        <Label>Remarks (optional)</Label>
                        <Textarea
                          data-ocid="lab_second_check.textarea"
                          value={remarks}
                          onChange={(e) => setRemarks(e.target.value)}
                          rows={2}
                          placeholder="Add any remarks..."
                        />
                      </div>
                    </div>
                  ) : null;
                })()}

              {/* Propose Date */}
              {dialog.mode === "proposeDate" && (
                <div className="space-y-3">
                  <p className="text-sm text-gray-600">
                    Choose from the options below for this sample:
                  </p>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      className="p-3 rounded-xl border-2 border-blue-300 bg-blue-50 text-center hover:bg-blue-100 transition-colors"
                      onClick={() =>
                        setDialog((d) => ({ ...d, mode: "advance" as const }))
                      }
                      data-ocid="lab_second_check.schedule_option"
                    >
                      <CalendarDays
                        size={22}
                        className="mx-auto text-blue-600 mb-1"
                      />
                      <p className="text-sm font-semibold text-blue-700">
                        Propose Date
                      </p>
                      <p className="text-xs text-blue-500">Schedule testing</p>
                    </button>
                    <button
                      type="button"
                      className="p-3 rounded-xl border-2 border-red-300 bg-red-50 text-center hover:bg-red-100 transition-colors"
                      onClick={() =>
                        setDialog((d) => ({ ...d, mode: "nft" as const }))
                      }
                      data-ocid="lab_second_check.nft_option"
                    >
                      <XCircle
                        size={22}
                        className="mx-auto text-red-600 mb-1"
                      />
                      <p className="text-sm font-semibold text-red-700">
                        Mark NFT
                      </p>
                      <p className="text-xs text-red-500">Not Fit for Test</p>
                    </button>
                  </div>

                  {/* Show date input after selecting Propose Date option */}
                  <div className="mt-2 space-y-2">
                    <Label>Proposed Testing Date (~15 days from today)</Label>
                    <Input
                      type="date"
                      data-ocid="lab_second_check.date_input"
                      value={proposedDate}
                      min={getDefaultProposedDate()}
                      onChange={(e) => setProposedDate(e.target.value)}
                    />
                    <p className="text-xs text-gray-500">
                      This date will be sent to the Compliance Officer for
                      approval.
                    </p>
                  </div>
                </div>
              )}

              {/* NFT */}
              {dialog.mode === "nft" && (
                <div className="space-y-3">
                  <div className="p-3 rounded-lg border border-red-200 bg-red-50 text-sm">
                    <p className="font-semibold text-red-700 flex items-center gap-1">
                      <XCircle size={15} /> Not Fit for Test — Terminal Status
                    </p>
                    <p className="text-red-600 text-xs mt-0.5">
                      No further actions will be possible after marking NFT.
                    </p>
                  </div>
                  <div className="space-y-1">
                    <Label>
                      Remarks / Reason <span className="text-red-500">*</span>
                    </Label>
                    <Textarea
                      data-ocid="lab_second_check.nft_remarks"
                      value={nftRemarks}
                      onChange={(e) => setNftRemarks(e.target.value)}
                      rows={2}
                      placeholder="Reason for NFT (e.g., physical damage, improper sealing)..."
                    />
                  </div>
                  <div>
                    <Label>Attachment</Label>
                    <Input
                      type="file"
                      data-ocid="lab_second_check.nft_upload"
                      className="mt-1 text-sm"
                    />
                  </div>
                </div>
              )}

              {/* Test Done — Pass/Fail */}
              {dialog.mode === "testDone" && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      className={`p-3 rounded-xl border-2 text-center transition-colors ${
                        testResult === "Pass"
                          ? "border-green-500 bg-green-50"
                          : "border-gray-200 bg-gray-50 hover:bg-green-50"
                      }`}
                      onClick={() => setTestResult("Pass")}
                      data-ocid="lab_second_check.pass_option"
                    >
                      <CheckCircle
                        size={22}
                        className="mx-auto text-green-600 mb-1"
                      />
                      <p className="text-sm font-semibold text-green-700">
                        Pass
                      </p>
                    </button>
                    <button
                      type="button"
                      className={`p-3 rounded-xl border-2 text-center transition-colors ${
                        testResult === "Fail"
                          ? "border-red-500 bg-red-50"
                          : "border-gray-200 bg-gray-50 hover:bg-red-50"
                      }`}
                      onClick={() => setTestResult("Fail")}
                      data-ocid="lab_second_check.fail_option"
                    >
                      <XCircle
                        size={22}
                        className="mx-auto text-red-600 mb-1"
                      />
                      <p className="text-sm font-semibold text-red-700">Fail</p>
                    </button>
                  </div>
                  <div className="space-y-3">
                    <Label>Document Uploads</Label>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-600">
                          Star Label Image (JPG/PNG, max 10 MB)
                        </span>
                        <Input
                          type="file"
                          accept="image/*"
                          data-ocid="lab_second_check.upload_button"
                          className="w-40 text-xs"
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-600">
                          Appliance Photos (up to 5)
                        </span>
                        <Input
                          type="file"
                          accept="image/*"
                          multiple
                          data-ocid="lab_second_check.upload_button"
                          className="w-40 text-xs"
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-600">
                          Name Plate Photo (max 5 MB)
                        </span>
                        <Input
                          type="file"
                          accept="image/*"
                          data-ocid="lab_second_check.upload_button"
                          className="w-40 text-xs"
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-600">
                          Test Report (PDF only, max 10 MB)
                        </span>
                        <Input
                          type="file"
                          accept=".pdf"
                          data-ocid="lab_second_check.upload_button"
                          className="w-40 text-xs"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <Label>Remarks</Label>
                    <Textarea
                      data-ocid="lab_second_check.remarks_textarea"
                      value={remarks}
                      onChange={(e) => setRemarks(e.target.value)}
                      rows={2}
                      placeholder="Additional remarks..."
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              data-ocid="lab_second_check.cancel_button"
              onClick={closeDialog}
            >
              Cancel
            </Button>
            {dialog.mode === "advance" &&
              STATUS_NEXT[dialog.sample?.status ?? "NFT"] && (
                <Button
                  data-ocid="lab_second_check.confirm_button"
                  style={{ backgroundColor: "#1a3a6b" }}
                  className="text-white"
                  onClick={handleAdvance}
                >
                  Advance Status
                </Button>
              )}
            {dialog.mode === "proposeDate" && (
              <Button
                data-ocid="lab_second_check.confirm_button"
                style={{ backgroundColor: "#1a3a6b" }}
                className="text-white"
                onClick={handleProposeDate}
              >
                Submit Proposed Date
              </Button>
            )}
            {dialog.mode === "nft" && (
              <Button
                data-ocid="lab_second_check.confirm_button"
                className="bg-red-600 hover:bg-red-700 text-white"
                onClick={handleNft}
              >
                Confirm NFT
              </Button>
            )}
            {dialog.mode === "testDone" && (
              <Button
                data-ocid="lab_second_check.confirm_button"
                style={{ backgroundColor: "#1a3a6b" }}
                className="text-white"
                onClick={handleTestDone}
              >
                Confirm Result
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

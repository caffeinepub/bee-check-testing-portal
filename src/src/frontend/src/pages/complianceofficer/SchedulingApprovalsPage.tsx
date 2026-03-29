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
import { CalendarCheck, CheckCircle2, XCircle } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useSecondCheck } from "../../contexts/SecondCheckContext";

export default function SchedulingApprovalsPage() {
  const { secondCheckSamples, approveTestDate, rejectTestDate } =
    useSecondCheck();
  const [rejectDialog, setRejectDialog] = useState<{
    open: boolean;
    sampleId: string;
  }>({
    open: false,
    sampleId: "",
  });
  const [rejectReason, setRejectReason] = useState("");

  const proposedSamples = secondCheckSamples.filter(
    (s) => s.status === "ProposedDate" || s.proposedDateApproved === true,
  );

  const handleApprove = (sampleId: string) => {
    approveTestDate(sampleId);
    toast.success("Testing date approved. Status updated to Test Scheduled.");
  };

  const handleReject = () => {
    if (!rejectReason.trim()) {
      toast.error("Please provide a reason for rejection.");
      return;
    }
    rejectTestDate(rejectDialog.sampleId, rejectReason);
    toast.error("Testing date rejected. Lab will need to propose a new date.");
    setRejectDialog({ open: false, sampleId: "" });
    setRejectReason("");
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold" style={{ color: "#1a3a6b" }}>
          Scheduling Approvals
        </h1>
        <p className="text-sm text-gray-500 mt-0.5">
          Review and approve testing dates proposed by Test Labs for 2nd Check
          samples
        </p>
      </div>

      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-3 border-b border-gray-100">
          <CardTitle
            className="text-base font-semibold flex items-center gap-2"
            style={{ color: "#1a3a6b" }}
          >
            <CalendarCheck size={18} />
            Proposed Testing Dates
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {proposedSamples.length === 0 ? (
            <div
              className="text-center py-16 text-gray-400"
              data-ocid="scheduling.empty_state"
            >
              <CalendarCheck size={40} className="mx-auto mb-3 opacity-30" />
              <p className="font-medium">No scheduling proposals yet</p>
              <p className="text-sm mt-1">
                Test Labs will propose dates after samples are received.
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
                  <TableHead>Lab Name</TableHead>
                  <TableHead>Sample ID</TableHead>
                  <TableHead>Proposed Date</TableHead>
                  <TableHead>Submitted On</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {proposedSamples.map((s, idx) => {
                  const logEntry = s.statusLog.find(
                    (l) => l.status === "ProposedDate",
                  );
                  const isApproved =
                    s.proposedDateApproved && s.status === "TestScheduled";
                  const isPending = s.status === "ProposedDate";
                  return (
                    <TableRow
                      key={s.id}
                      data-ocid={`scheduling.item.${idx + 1}`}
                    >
                      <TableCell className="text-gray-500 text-xs">
                        {idx + 1}
                      </TableCell>
                      <TableCell className="font-medium">
                        {s.brandName}
                      </TableCell>
                      <TableCell className="text-xs font-mono text-gray-600">
                        {s.modelNumber}
                      </TableCell>
                      <TableCell className="text-xs">{s.category}</TableCell>
                      <TableCell className="text-xs">{s.lab1Name}</TableCell>
                      <TableCell className="text-xs font-mono">
                        {s.id.substring(0, 16)}...
                      </TableCell>
                      <TableCell className="text-sm font-semibold">
                        {s.proposedDate ?? "—"}
                      </TableCell>
                      <TableCell className="text-xs">
                        {logEntry?.date ?? "—"}
                      </TableCell>
                      <TableCell>
                        {isApproved ? (
                          <Badge className="bg-green-100 text-green-700 border-green-200 text-xs">
                            Approved
                          </Badge>
                        ) : isPending ? (
                          <Badge className="bg-yellow-100 text-yellow-700 border-yellow-200 text-xs">
                            Awaiting Approval
                          </Badge>
                        ) : (
                          <Badge className="bg-red-100 text-red-700 border-red-200 text-xs">
                            Rejected
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        {isPending ? (
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              data-ocid={`scheduling.approve_button.${idx + 1}`}
                              className="bg-green-600 hover:bg-green-700 text-white text-xs px-3"
                              onClick={() => handleApprove(s.id)}
                            >
                              <CheckCircle2 size={13} className="mr-1" />
                              Approve
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              data-ocid={`scheduling.reject_button.${idx + 1}`}
                              className="border-red-300 text-red-600 hover:bg-red-50 text-xs px-3"
                              onClick={() =>
                                setRejectDialog({ open: true, sampleId: s.id })
                              }
                            >
                              <XCircle size={13} className="mr-1" />
                              Reject
                            </Button>
                          </div>
                        ) : (
                          <span className="text-xs text-gray-400">—</span>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Reject Dialog */}
      <Dialog
        open={rejectDialog.open}
        onOpenChange={(o) =>
          !o && setRejectDialog({ open: false, sampleId: "" })
        }
      >
        <DialogContent data-ocid="scheduling.dialog">
          <DialogHeader>
            <DialogTitle>Reject Proposed Date</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 py-2">
            <Label htmlFor="reject-reason">Reason for Rejection</Label>
            <Textarea
              id="reject-reason"
              data-ocid="scheduling.textarea"
              placeholder="Provide reason (e.g., date conflicts with holiday calendar, too early)..."
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              rows={3}
            />
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              data-ocid="scheduling.cancel_button"
              onClick={() => setRejectDialog({ open: false, sampleId: "" })}
            >
              Cancel
            </Button>
            <Button
              data-ocid="scheduling.confirm_button"
              className="bg-red-600 hover:bg-red-700 text-white"
              onClick={handleReject}
            >
              Reject Date
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

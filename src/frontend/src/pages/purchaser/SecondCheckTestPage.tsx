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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CheckCircle2, FlaskConical, Lock, ShoppingCart } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useBlockedSamples } from "../../contexts/BlockedSamplesContext";
import { useSecondCheck } from "../../contexts/SecondCheckContext";

function StarRating({ rating }: { rating: number }) {
  return (
    <span className="text-amber-500 text-sm tracking-tight">
      {"★".repeat(rating)}
      <span className="text-gray-300">{"★".repeat(5 - rating)}</span>
    </span>
  );
}

function SampleStatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    "Awaiting Lab Assignment":
      "bg-yellow-100 text-yellow-800 border-yellow-200",
    "Lab Assigned": "bg-green-100 text-green-800 border-green-200",
    "In Transit": "bg-blue-100 text-blue-800 border-blue-200",
    Purchased: "bg-purple-100 text-purple-800 border-purple-200",
  };
  return (
    <Badge
      className={`text-xs border ${
        styles[status] ?? "bg-gray-100 text-gray-700 border-gray-200"
      }`}
    >
      {status}
    </Badge>
  );
}

export default function SecondCheckTestPage() {
  const {
    secondCheckRequests,
    secondCheckInitiated,
    submitSecondCheckBlock,
    secondCheckSamples,
  } = useSecondCheck();
  const { addSecondCheckLabRequest } = useBlockedSamples();

  const [blockDialog, setBlockDialog] = useState<{
    open: boolean;
    caseId: string;
    brand: string;
    model: string;
    category: string;
    starRating: number;
  }>({
    open: false,
    caseId: "",
    brand: "",
    model: "",
    category: "",
    starRating: 0,
  });

  const [purchaseDialog, setPurchaseDialog] = useState<{
    open: boolean;
    sampleId: string;
    brand: string;
    model: string;
  }>({ open: false, sampleId: "", brand: "", model: "" });

  const blockedCaseIds = new Set(secondCheckSamples.map((s) => s.caseId));

  const handleBlock = () => {
    const { caseId, brand, model, category, starRating } = blockDialog;
    submitSecondCheckBlock(caseId);
    addSecondCheckLabRequest({
      id: `SCLR-${caseId}-${Date.now()}`,
      caseId,
      brandName: brand,
      modelNumber: model,
      categoryName: category,
      starRating,
      blockedAt: new Date().toISOString(),
    });
    toast.success(
      "2 samples blocked. Lab assignment request sent to Lab Coordinator.",
    );
    setBlockDialog({
      open: false,
      caseId: "",
      brand: "",
      model: "",
      category: "",
      starRating: 0,
    });
  };

  const handlePurchaseConfirm = () => {
    toast.success(
      `Purchase confirmed for ${purchaseDialog.brand} — ${purchaseDialog.model}. Both samples submitted to respective labs.`,
    );
    setPurchaseDialog({ open: false, sampleId: "", brand: "", model: "" });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold" style={{ color: "#1a3a6b" }}>
          2nd Check Test
        </h1>
        <p className="text-sm text-gray-500 mt-0.5">
          Block products for secondary compliance testing and track their
          progress
        </p>
      </div>

      <Tabs defaultValue="pending">
        <TabsList className="mb-4">
          <TabsTrigger value="pending" data-ocid="second_check.pending_tab">
            Pending Requests
            {secondCheckRequests.filter((r) => !blockedCaseIds.has(r.id))
              .length > 0 && (
              <span className="ml-2 bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5">
                {
                  secondCheckRequests.filter((r) => !blockedCaseIds.has(r.id))
                    .length
                }
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger
            value="mysamples"
            data-ocid="second_check.my_samples_tab"
          >
            My 2nd Check Samples
            {secondCheckSamples.length > 0 && (
              <span className="ml-2 bg-blue-500 text-white text-xs rounded-full px-1.5 py-0.5">
                {secondCheckSamples.length}
              </span>
            )}
          </TabsTrigger>
        </TabsList>

        {/* ── Pending Requests ── */}
        <TabsContent value="pending">
          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-3 border-b border-gray-100">
              <CardTitle
                className="text-base font-semibold"
                style={{ color: "#1a3a6b" }}
              >
                Cases Dispatched by Compliance Officer
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {!secondCheckInitiated ? (
                <div
                  className="text-center py-16 text-gray-400"
                  data-ocid="second_check.pending.empty_state"
                >
                  <FlaskConical size={40} className="mx-auto mb-3 opacity-30" />
                  <p className="font-medium">No 2nd check requests yet</p>
                  <p className="text-sm mt-1">
                    The Compliance Officer has not yet initiated 2nd Check
                    Testing.
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow style={{ backgroundColor: "#f8fafc" }}>
                        <TableHead className="w-10 text-xs font-semibold text-gray-600">
                          #
                        </TableHead>
                        <TableHead className="text-xs font-semibold text-gray-600">
                          Category
                        </TableHead>
                        <TableHead className="text-xs font-semibold text-gray-600">
                          Brand
                        </TableHead>
                        <TableHead className="text-xs font-semibold text-gray-600">
                          Model
                        </TableHead>
                        <TableHead className="text-xs font-semibold text-gray-600">
                          Star Rating
                        </TableHead>
                        <TableHead className="text-xs font-semibold text-gray-600">
                          Sample 1 Status
                        </TableHead>
                        <TableHead className="text-xs font-semibold text-gray-600">
                          Sample 2 Status
                        </TableHead>
                        <TableHead className="text-xs font-semibold text-gray-600">
                          Action
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {secondCheckRequests.map((req, idx) => {
                        const blocked = blockedCaseIds.has(req.id);
                        const sample = secondCheckSamples.find(
                          (s) => s.caseId === req.id,
                        );
                        return (
                          <TableRow
                            key={req.id}
                            className="hover:bg-blue-50"
                            data-ocid={`second_check.pending.item.${idx + 1}`}
                          >
                            <TableCell className="text-gray-500 text-xs">
                              {idx + 1}
                            </TableCell>
                            <TableCell className="text-xs font-medium">
                              {req.category}
                            </TableCell>
                            <TableCell className="text-xs">
                              {req.brandName}
                            </TableCell>
                            <TableCell className="text-xs font-mono">
                              {req.modelNumber}
                            </TableCell>
                            <TableCell>
                              <StarRating rating={req.starRating} />
                            </TableCell>
                            <TableCell>
                              {blocked && sample ? (
                                <SampleStatusBadge
                                  status={sample.sample1Status}
                                />
                              ) : (
                                <span className="text-gray-400 text-xs">—</span>
                              )}
                            </TableCell>
                            <TableCell>
                              {blocked && sample ? (
                                <SampleStatusBadge
                                  status={sample.sample2Status}
                                />
                              ) : (
                                <span className="text-gray-400 text-xs">—</span>
                              )}
                            </TableCell>
                            <TableCell>
                              {blocked ? (
                                <Badge className="bg-green-100 text-green-700 border-green-200 border text-xs">
                                  <CheckCircle2 size={11} className="mr-1" />
                                  Blocked ✓
                                </Badge>
                              ) : (
                                <Button
                                  size="sm"
                                  data-ocid={`second_check.block_button.${idx + 1}`}
                                  className="text-xs h-7"
                                  style={{ backgroundColor: "#1a3a6b" }}
                                  onClick={() =>
                                    setBlockDialog({
                                      open: true,
                                      caseId: req.id,
                                      brand: req.brandName,
                                      model: req.modelNumber,
                                      category: req.category,
                                      starRating: req.starRating,
                                    })
                                  }
                                >
                                  <Lock size={12} className="mr-1" />
                                  Block
                                </Button>
                              )}
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* ── My 2nd Check Samples ── */}
        <TabsContent value="mysamples">
          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-3 border-b border-gray-100">
              <CardTitle
                className="text-base font-semibold"
                style={{ color: "#1a3a6b" }}
              >
                My 2nd Check Samples
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {secondCheckSamples.length === 0 ? (
                <div
                  className="text-center py-16 text-gray-400"
                  data-ocid="second_check.my_samples.empty_state"
                >
                  <FlaskConical size={40} className="mx-auto mb-3 opacity-30" />
                  <p className="font-medium">No samples blocked yet</p>
                  <p className="text-sm mt-1">
                    Block a product from Pending Requests to start.
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow style={{ backgroundColor: "#f8fafc" }}>
                        <TableHead className="w-10 text-xs font-semibold text-gray-600">
                          #
                        </TableHead>
                        <TableHead className="text-xs font-semibold text-gray-600">
                          Category
                        </TableHead>
                        <TableHead className="text-xs font-semibold text-gray-600">
                          Brand
                        </TableHead>
                        <TableHead className="text-xs font-semibold text-gray-600">
                          Model
                        </TableHead>
                        <TableHead className="text-xs font-semibold text-gray-600">
                          Star Rating
                        </TableHead>
                        <TableHead className="text-xs font-semibold text-gray-600">
                          Sample 1 Status
                        </TableHead>
                        <TableHead className="text-xs font-semibold text-gray-600">
                          Sample 2 Status
                        </TableHead>
                        <TableHead className="text-xs font-semibold text-gray-600">
                          Lab 1
                        </TableHead>
                        <TableHead className="text-xs font-semibold text-gray-600">
                          Lab 2
                        </TableHead>
                        <TableHead className="text-xs font-semibold text-gray-600">
                          Action
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {secondCheckSamples.map((s, idx) => {
                        const canPurchase =
                          s.sample1Status === "Lab Assigned" &&
                          s.sample2Status === "Lab Assigned";
                        return (
                          <TableRow
                            key={s.id}
                            className="hover:bg-blue-50"
                            data-ocid={`second_check.my_samples.item.${idx + 1}`}
                          >
                            <TableCell className="text-gray-500 text-xs">
                              {idx + 1}
                            </TableCell>
                            <TableCell className="text-xs font-medium">
                              {s.category}
                            </TableCell>
                            <TableCell className="text-xs">
                              {s.brandName}
                            </TableCell>
                            <TableCell className="text-xs font-mono">
                              {s.modelNumber}
                            </TableCell>
                            <TableCell>
                              <StarRating rating={s.starRating} />
                            </TableCell>
                            <TableCell>
                              <SampleStatusBadge status={s.sample1Status} />
                            </TableCell>
                            <TableCell>
                              <SampleStatusBadge status={s.sample2Status} />
                            </TableCell>
                            <TableCell className="text-xs">
                              {s.lab1Name ? (
                                <span className="text-green-700 font-medium">
                                  {s.lab1Name}
                                </span>
                              ) : (
                                <span className="text-gray-400">Pending</span>
                              )}
                            </TableCell>
                            <TableCell className="text-xs">
                              {s.lab2Name ? (
                                <span className="text-green-700 font-medium">
                                  {s.lab2Name}
                                </span>
                              ) : (
                                <span className="text-gray-400">Pending</span>
                              )}
                            </TableCell>
                            <TableCell>
                              {canPurchase ? (
                                <Button
                                  size="sm"
                                  data-ocid={`second_check.purchase_button.${idx + 1}`}
                                  className="text-xs h-7 bg-green-600 hover:bg-green-700 text-white"
                                  onClick={() =>
                                    setPurchaseDialog({
                                      open: true,
                                      sampleId: s.id,
                                      brand: s.brandName,
                                      model: s.modelNumber,
                                    })
                                  }
                                >
                                  <ShoppingCart size={12} className="mr-1" />
                                  Purchase
                                </Button>
                              ) : (
                                <Badge className="bg-gray-100 text-gray-500 border border-gray-200 text-xs">
                                  Awaiting Lab Assignment
                                </Badge>
                              )}
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* ── Block Dialog ── */}
      <Dialog
        open={blockDialog.open}
        onOpenChange={(o) =>
          !o &&
          setBlockDialog({
            open: false,
            caseId: "",
            brand: "",
            model: "",
            category: "",
            starRating: 0,
          })
        }
      >
        <DialogContent data-ocid="second_check.dialog" className="max-w-md">
          <DialogHeader>
            <DialogTitle>Block for 2nd Check Test</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="p-4 rounded-lg bg-blue-50 border border-blue-100 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs text-blue-500 font-medium uppercase tracking-wide">
                  Product
                </span>
                <StarRating rating={blockDialog.starRating} />
              </div>
              <p className="font-semibold text-blue-900">
                {blockDialog.brand} — {blockDialog.model}
              </p>
              <p className="text-xs text-blue-600">{blockDialog.category}</p>
            </div>

            <div className="p-3 rounded-lg border border-amber-200 bg-amber-50 text-sm">
              <p className="font-medium text-amber-800">
                📦 2 sample units will be blocked
              </p>
              <p className="text-amber-700 text-xs mt-1">
                Lab assignment will be sent to the Lab Coordinator. You can
                proceed with purchase only after labs are confirmed.
              </p>
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg border border-gray-200 bg-gray-50">
              <span className="text-sm text-gray-600">Quantity</span>
              <span className="font-bold text-gray-800 bg-white px-3 py-1 rounded border text-sm">
                2 Units (Fixed)
              </span>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              data-ocid="second_check.cancel_button"
              onClick={() =>
                setBlockDialog({
                  open: false,
                  caseId: "",
                  brand: "",
                  model: "",
                  category: "",
                  starRating: 0,
                })
              }
            >
              Cancel
            </Button>
            <Button
              data-ocid="second_check.submit_button"
              style={{ backgroundColor: "#1a3a6b" }}
              className="text-white"
              onClick={handleBlock}
            >
              <Lock size={14} className="mr-1" />
              Confirm Block
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── Purchase Confirmation Dialog ── */}
      <Dialog
        open={purchaseDialog.open}
        onOpenChange={(o) =>
          !o &&
          setPurchaseDialog({ open: false, sampleId: "", brand: "", model: "" })
        }
      >
        <DialogContent
          data-ocid="second_check.purchase_dialog"
          className="max-w-sm"
        >
          <DialogHeader>
            <DialogTitle>Confirm Purchase</DialogTitle>
          </DialogHeader>
          <div className="py-3 space-y-3">
            <div className="p-3 rounded-lg bg-green-50 border border-green-200">
              <p className="font-semibold text-green-800 text-sm">
                {purchaseDialog.brand} — {purchaseDialog.model}
              </p>
              <p className="text-green-700 text-xs mt-1">
                Both sample units will be dispatched to their assigned labs for
                2nd check testing.
              </p>
            </div>
            <p className="text-sm text-gray-600">
              Confirm purchase of <strong>2 units</strong> for 2nd check
              testing?
            </p>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              data-ocid="second_check.purchase_cancel_button"
              onClick={() =>
                setPurchaseDialog({
                  open: false,
                  sampleId: "",
                  brand: "",
                  model: "",
                })
              }
            >
              Cancel
            </Button>
            <Button
              data-ocid="second_check.purchase_confirm_button"
              className="bg-green-600 hover:bg-green-700 text-white"
              onClick={handlePurchaseConfirm}
            >
              <ShoppingCart size={14} className="mr-1" />
              Confirm Purchase
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

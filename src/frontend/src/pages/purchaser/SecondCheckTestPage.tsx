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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CheckCircle2, FlaskConical, Lock, ShoppingCart } from "lucide-react";
import type React from "react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useBlockedSamples } from "../../contexts/BlockedSamplesContext";
import { useSecondCheck } from "../../contexts/SecondCheckContext";
import { applianceCategories } from "../../data/mockData";

const installmentOptions = [
  "1st Installment",
  "2nd Installment",
  "3rd Installment",
];
const purchaseModeOptions = ["Online", "Offline"];

interface PurchaseFormState {
  purchaseDate: string;
  purchaseMode: string;
  retailerName: string;
  invoiceNumber: string;
  invoiceDate: string;
  applianceName: string;
  applianceBrand: string;
  applianceModel: string;
  qty1stTest: string;
  qty2ndTest: string;
  invoiceAmount: string;
  productStarRating: string;
  transportationCost: string;
  manpowerCost: string;
  insurance: string;
  totalAmount: string;
  installment: string;
  invoiceFile: File | null;
}

const emptyForm = (): PurchaseFormState => ({
  purchaseDate: "",
  purchaseMode: "",
  retailerName: "",
  invoiceNumber: "",
  invoiceDate: "",
  applianceName: "",
  applianceBrand: "",
  applianceModel: "",
  qty1stTest: "1",
  qty2ndTest: "2",
  invoiceAmount: "",
  productStarRating: "",
  transportationCost: "0",
  manpowerCost: "0",
  insurance: "0",
  totalAmount: "0",
  installment: "",
  invoiceFile: null,
});

function StarRating({ rating }: { rating: number }) {
  return (
    <span className="text-amber-500 text-sm tracking-tight">
      {"\u2605".repeat(rating)}
      <span className="text-gray-300">{"\u2605".repeat(5 - rating)}</span>
    </span>
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    "Awaiting Lab Assignment":
      "bg-yellow-100 text-yellow-800 border-yellow-200",
    "Lab Assigned": "bg-green-100 text-green-800 border-green-200",
    "In Transit": "bg-blue-100 text-blue-800 border-blue-200",
    Purchased: "bg-purple-100 text-purple-800 border-purple-200",
    "\u2014": "bg-gray-50 text-gray-400 border-gray-100",
  };
  return (
    <Badge
      className={`text-xs border whitespace-nowrap ${
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
    submitSingleSampleBlock,
    secondCheckSamples,
  } = useSecondCheck();
  const { addSecondCheckLabRequest } = useBlockedSamples();

  // Block dialog — per sample
  const [blockDialog, setBlockDialog] = useState<{
    open: boolean;
    caseId: string;
    sampleNumber: 1 | 2;
    brand: string;
    model: string;
    category: string;
    starRating: number;
  }>({
    open: false,
    caseId: "",
    sampleNumber: 1,
    brand: "",
    model: "",
    category: "",
    starRating: 0,
  });

  const [purchaseDialog, setPurchaseDialog] = useState<{
    open: boolean;
    sampleId: string;
    sampleNum: 1 | 2;
    brand: string;
    model: string;
    category: string;
    starRating: number;
    labName: string;
  }>({
    open: false,
    sampleId: "",
    sampleNum: 1,
    brand: "",
    model: "",
    category: "",
    starRating: 0,
    labName: "",
  });

  const [form, setForm] = useState<PurchaseFormState>(emptyForm());
  const [invoiceFileName, setInvoiceFileName] = useState("");
  const [purchasedSamples, setPurchasedSamples] = useState<
    Record<
      string,
      { s1: boolean; s2: boolean; s1Date?: string; s2Date?: string }
    >
  >({});

  const isOnline = form.purchaseMode === "Online";

  const activeSample = secondCheckSamples.find(
    (s) => s.id === purchaseDialog.sampleId,
  );

  useEffect(() => {
    if (purchaseDialog.open && activeSample) {
      setForm((f) => ({
        ...f,
        applianceName: activeSample.category,
        applianceBrand: activeSample.brandName,
        applianceModel: activeSample.modelNumber,
        productStarRating: "\u2605".repeat(activeSample.starRating),
      }));
    }
  }, [purchaseDialog.open, activeSample]);

  useEffect(() => {
    const invoice = Number.parseFloat(form.invoiceAmount) || 0;
    if (isOnline) {
      setForm((f) => ({ ...f, totalAmount: String(invoice) }));
    } else {
      const transport = Number.parseFloat(form.transportationCost) || 0;
      const manpower = Number.parseFloat(form.manpowerCost) || 0;
      const insurance = Number.parseFloat(form.insurance) || 0;
      setForm((f) => ({
        ...f,
        totalAmount: String(invoice + transport + manpower + insurance),
      }));
    }
  }, [
    form.invoiceAmount,
    form.transportationCost,
    form.manpowerCost,
    form.insurance,
    isOnline,
  ]);

  useEffect(() => {
    if (isOnline) {
      setForm((f) => ({
        ...f,
        transportationCost: "0",
        manpowerCost: "0",
        insurance: "0",
      }));
    }
  }, [isOnline]);

  const setField = (field: keyof PurchaseFormState, value: string) =>
    setForm((f) => ({ ...f, [field]: value }));

  const handleBlock = () => {
    const { caseId, sampleNumber, brand, model, category, starRating } =
      blockDialog;
    submitSingleSampleBlock(caseId, sampleNumber);
    addSecondCheckLabRequest({
      id: `SCLR-${caseId}-S${sampleNumber}-${Date.now()}`,
      caseId,
      sampleNumber,
      brandName: brand,
      modelNumber: model,
      categoryName: category,
      starRating,
      blockedAt: new Date().toISOString(),
    });
    toast.success(
      `Sample ${sampleNumber} blocked. Lab assignment request sent to Lab Coordinator.`,
    );
    setBlockDialog({
      open: false,
      caseId: "",
      sampleNumber: 1,
      brand: "",
      model: "",
      category: "",
      starRating: 0,
    });
  };

  const closePurchaseDialog = () => {
    setPurchaseDialog({
      open: false,
      sampleId: "",
      sampleNum: 1,
      brand: "",
      model: "",
      category: "",
      starRating: 0,
      labName: "",
    });
    setForm(emptyForm());
    setInvoiceFileName("");
  };

  const handlePurchaseSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !form.purchaseDate ||
      !form.retailerName ||
      !form.invoiceNumber ||
      !form.invoiceAmount ||
      !form.installment
    ) {
      toast.error("Please fill all required purchase details");
      return;
    }
    const sId = purchaseDialog.sampleId;
    const sNum = purchaseDialog.sampleNum;
    const today = new Date().toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
    setPurchasedSamples((prev) => ({
      ...prev,
      [sId]: {
        s1: sNum === 1 ? true : (prev[sId]?.s1 ?? false),
        s2: sNum === 2 ? true : (prev[sId]?.s2 ?? false),
        s1Date: sNum === 1 ? today : prev[sId]?.s1Date,
        s2Date: sNum === 2 ? today : prev[sId]?.s2Date,
      },
    }));
    toast.success(
      `Sample ${sNum} purchase confirmed for ${purchaseDialog.brand} \u2014 ${purchaseDialog.model}.`,
    );
    closePurchaseDialog();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setForm((f) => ({ ...f, invoiceFile: file }));
      setInvoiceFileName(file.name);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold" style={{ color: "#1a3a6b" }}>
          2nd Check Test
        </h1>
        <p className="text-sm text-gray-500 mt-0.5">
          Block products for secondary compliance testing. Each sample is
          blocked and purchased independently.
        </p>
      </div>

      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-3 border-b border-gray-100">
          <CardTitle
            className="text-base font-semibold"
            style={{ color: "#1a3a6b" }}
          >
            2nd Check Test Cases
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {!secondCheckInitiated ? (
            <div
              className="text-center py-16 text-gray-400"
              data-ocid="secondcheck.empty_state"
            >
              <FlaskConical size={40} className="mx-auto mb-3 opacity-30" />
              <p className="font-medium">No 2nd check requests yet</p>
              <p className="text-sm mt-1">
                The Compliance Officer has not yet initiated 2nd Check Testing.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  {/* Top header row */}
                  <TableRow style={{ backgroundColor: "#1a3a6b" }}>
                    <TableHead
                      rowSpan={2}
                      className="text-white text-xs font-semibold border-r border-blue-700 align-middle w-10"
                    >
                      #
                    </TableHead>
                    <TableHead
                      rowSpan={2}
                      className="text-white text-xs font-semibold border-r border-blue-700 align-middle"
                    >
                      Category
                    </TableHead>
                    <TableHead
                      rowSpan={2}
                      className="text-white text-xs font-semibold border-r border-blue-700 align-middle"
                    >
                      Brand
                    </TableHead>
                    <TableHead
                      rowSpan={2}
                      className="text-white text-xs font-semibold border-r border-blue-700 align-middle"
                    >
                      Model
                    </TableHead>
                    <TableHead
                      rowSpan={2}
                      className="text-white text-xs font-semibold border-r border-blue-700 align-middle"
                    >
                      Star Rating
                    </TableHead>
                    <TableHead
                      colSpan={5}
                      className="text-center text-white text-xs font-semibold border-r border-blue-700 py-2"
                    >
                      Sample 1
                    </TableHead>
                    <TableHead
                      colSpan={5}
                      className="text-center text-white text-xs font-semibold py-2"
                    >
                      Sample 2
                    </TableHead>
                  </TableRow>
                  {/* Sub-header row */}
                  <TableRow style={{ backgroundColor: "#243f6e" }}>
                    {/* Sample 1 sub-cols */}
                    <TableHead className="text-blue-100 text-xs font-semibold py-2 px-3 border-r border-blue-600">
                      Block
                    </TableHead>
                    <TableHead className="text-blue-100 text-xs font-semibold py-2 px-3 border-r border-blue-600">
                      L \u2014 Lab Assign
                    </TableHead>
                    <TableHead className="text-blue-100 text-xs font-semibold py-2 px-3 border-r border-blue-600">
                      D \u2014 Date
                    </TableHead>
                    <TableHead className="text-blue-100 text-xs font-semibold py-2 px-3 border-r border-blue-600">
                      S \u2014 Status
                    </TableHead>
                    <TableHead className="text-blue-100 text-xs font-semibold py-2 px-3 border-r border-blue-700">
                      A \u2014 Action
                    </TableHead>
                    {/* Sample 2 sub-cols */}
                    <TableHead className="text-blue-100 text-xs font-semibold py-2 px-3 border-r border-blue-600">
                      Block
                    </TableHead>
                    <TableHead className="text-blue-100 text-xs font-semibold py-2 px-3 border-r border-blue-600">
                      L \u2014 Lab Assign
                    </TableHead>
                    <TableHead className="text-blue-100 text-xs font-semibold py-2 px-3 border-r border-blue-600">
                      D \u2014 Date
                    </TableHead>
                    <TableHead className="text-blue-100 text-xs font-semibold py-2 px-3 border-r border-blue-600">
                      S \u2014 Status
                    </TableHead>
                    <TableHead className="text-blue-100 text-xs font-semibold py-2 px-3">
                      A \u2014 Action
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {secondCheckRequests.map((req, idx) => {
                    const sample = secondCheckSamples.find(
                      (s) => s.caseId === req.id,
                    );
                    const ps = sample
                      ? (purchasedSamples[sample.id] ?? {
                          s1: false,
                          s2: false,
                        })
                      : { s1: false, s2: false };

                    const s1Blocked = !!sample?.sample1Blocked;
                    const s2Blocked = !!sample?.sample2Blocked;
                    const lab1Assigned = !!sample?.lab1Name;
                    const lab2Assigned = !!sample?.lab2Name;

                    const s1Status = !s1Blocked
                      ? "\u2014"
                      : lab1Assigned
                        ? ps.s1
                          ? "Purchased"
                          : "Lab Assigned"
                        : "Awaiting Lab Assignment";
                    const s2Status = !s2Blocked
                      ? "\u2014"
                      : lab2Assigned
                        ? ps.s2
                          ? "Purchased"
                          : "Lab Assigned"
                        : "Awaiting Lab Assignment";

                    return (
                      <TableRow
                        key={req.id}
                        className="hover:bg-blue-50 border-b border-gray-100"
                        data-ocid={`secondcheck.item.${idx + 1}`}
                      >
                        <TableCell className="text-gray-500 text-xs border-r border-gray-100">
                          {idx + 1}
                        </TableCell>
                        <TableCell className="text-xs font-medium border-r border-gray-100">
                          {req.category}
                        </TableCell>
                        <TableCell className="text-xs border-r border-gray-100">
                          {req.brandName}
                        </TableCell>
                        <TableCell className="text-xs font-mono border-r border-gray-100">
                          {req.modelNumber}
                        </TableCell>
                        <TableCell className="border-r border-gray-100">
                          <StarRating rating={req.starRating} />
                        </TableCell>

                        {/* \u2500\u2500 Sample 1: Block \u2500\u2500 */}
                        <TableCell className="border-r border-gray-100 px-3">
                          {s1Blocked ? (
                            <Badge className="bg-green-100 text-green-700 border-green-200 border text-xs">
                              <CheckCircle2 size={11} className="mr-1" />
                              Blocked
                            </Badge>
                          ) : (
                            <Button
                              size="sm"
                              className="text-xs h-7 whitespace-nowrap"
                              style={{ backgroundColor: "#1a3a6b" }}
                              data-ocid={`secondcheck.s1.block.button.${idx + 1}`}
                              onClick={() =>
                                setBlockDialog({
                                  open: true,
                                  caseId: req.id,
                                  sampleNumber: 1,
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
                        {/* Sample 1: L */}
                        <TableCell className="text-xs border-r border-gray-100 px-3">
                          {sample?.lab1Name ? (
                            <span className="text-green-700 font-medium">
                              {sample.lab1Name}
                            </span>
                          ) : s1Blocked ? (
                            <span className="text-amber-600 text-xs">
                              Pending
                            </span>
                          ) : (
                            <span className="text-gray-300">\u2014</span>
                          )}
                        </TableCell>
                        {/* Sample 1: D */}
                        <TableCell className="text-xs border-r border-gray-100 px-3 whitespace-nowrap">
                          {ps.s1Date ? (
                            <span className="text-gray-700">{ps.s1Date}</span>
                          ) : (
                            <span className="text-gray-300">\u2014</span>
                          )}
                        </TableCell>
                        {/* Sample 1: S */}
                        <TableCell className="border-r border-gray-100 px-3">
                          <StatusBadge status={s1Status} />
                        </TableCell>
                        {/* Sample 1: A */}
                        <TableCell className="border-r border-gray-200 px-3">
                          {s1Blocked && lab1Assigned && !ps.s1 ? (
                            <Button
                              size="sm"
                              className="text-xs h-7 bg-green-600 hover:bg-green-700 text-white whitespace-nowrap"
                              data-ocid={`secondcheck.s1.purchase.button.${idx + 1}`}
                              onClick={() => {
                                setPurchaseDialog({
                                  open: true,
                                  sampleId: sample!.id,
                                  sampleNum: 1,
                                  brand: req.brandName,
                                  model: req.modelNumber,
                                  category: req.category,
                                  starRating: req.starRating,
                                  labName: sample?.lab1Name ?? "",
                                });
                                setForm(emptyForm());
                                setInvoiceFileName("");
                              }}
                            >
                              <ShoppingCart size={11} className="mr-1" />
                              Purchase
                            </Button>
                          ) : ps.s1 ? (
                            <Badge className="bg-purple-100 text-purple-700 border border-purple-200 text-xs">
                              <CheckCircle2 size={11} className="mr-1" />
                              Done
                            </Badge>
                          ) : (
                            <span className="text-gray-300 text-xs">
                              \u2014
                            </span>
                          )}
                        </TableCell>

                        {/* \u2500\u2500 Sample 2: Block \u2500\u2500 */}
                        <TableCell className="border-r border-gray-100 px-3">
                          {s2Blocked ? (
                            <Badge className="bg-green-100 text-green-700 border-green-200 border text-xs">
                              <CheckCircle2 size={11} className="mr-1" />
                              Blocked
                            </Badge>
                          ) : (
                            <Button
                              size="sm"
                              className="text-xs h-7 whitespace-nowrap"
                              style={{ backgroundColor: "#1a3a6b" }}
                              data-ocid={`secondcheck.s2.block.button.${idx + 1}`}
                              onClick={() =>
                                setBlockDialog({
                                  open: true,
                                  caseId: req.id,
                                  sampleNumber: 2,
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
                        {/* Sample 2: L */}
                        <TableCell className="text-xs border-r border-gray-100 px-3">
                          {sample?.lab2Name ? (
                            <span className="text-green-700 font-medium">
                              {sample.lab2Name}
                            </span>
                          ) : s2Blocked ? (
                            <span className="text-amber-600 text-xs">
                              Pending
                            </span>
                          ) : (
                            <span className="text-gray-300">\u2014</span>
                          )}
                        </TableCell>
                        {/* Sample 2: D */}
                        <TableCell className="text-xs border-r border-gray-100 px-3 whitespace-nowrap">
                          {ps.s2Date ? (
                            <span className="text-gray-700">{ps.s2Date}</span>
                          ) : (
                            <span className="text-gray-300">\u2014</span>
                          )}
                        </TableCell>
                        {/* Sample 2: S */}
                        <TableCell className="border-r border-gray-100 px-3">
                          <StatusBadge status={s2Status} />
                        </TableCell>
                        {/* Sample 2: A */}
                        <TableCell className="px-3">
                          {s2Blocked && lab2Assigned && !ps.s2 ? (
                            <Button
                              size="sm"
                              className="text-xs h-7 bg-green-600 hover:bg-green-700 text-white whitespace-nowrap"
                              data-ocid={`secondcheck.s2.purchase.button.${idx + 1}`}
                              onClick={() => {
                                setPurchaseDialog({
                                  open: true,
                                  sampleId: sample!.id,
                                  sampleNum: 2,
                                  brand: req.brandName,
                                  model: req.modelNumber,
                                  category: req.category,
                                  starRating: req.starRating,
                                  labName: sample?.lab2Name ?? "",
                                });
                                setForm(emptyForm());
                                setInvoiceFileName("");
                              }}
                            >
                              <ShoppingCart size={11} className="mr-1" />
                              Purchase
                            </Button>
                          ) : ps.s2 ? (
                            <Badge className="bg-purple-100 text-purple-700 border border-purple-200 text-xs">
                              <CheckCircle2 size={11} className="mr-1" />
                              Done
                            </Badge>
                          ) : (
                            <span className="text-gray-300 text-xs">
                              \u2014
                            </span>
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

      {/* \u2500\u2500 Per-Sample Block Confirmation Dialog \u2500\u2500 */}
      <Dialog
        open={blockDialog.open}
        onOpenChange={(o) =>
          !o &&
          setBlockDialog({
            open: false,
            caseId: "",
            sampleNumber: 1,
            brand: "",
            model: "",
            category: "",
            starRating: 0,
          })
        }
      >
        <DialogContent
          className="max-w-md"
          data-ocid="secondcheck.block.dialog"
        >
          <DialogHeader>
            <DialogTitle>
              Block Sample {blockDialog.sampleNumber} for 2nd Check Test
            </DialogTitle>
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
                {blockDialog.brand} \u2014 {blockDialog.model}
              </p>
              <p className="text-xs text-blue-600">{blockDialog.category}</p>
            </div>
            <div className="p-3 rounded-lg border border-amber-200 bg-amber-50 text-sm">
              <p className="font-medium text-amber-800">
                \uD83D\uDCE6 Sample {blockDialog.sampleNumber} will be blocked
                independently
              </p>
              <p className="text-amber-700 text-xs mt-1">
                A lab assignment request for Sample {blockDialog.sampleNumber}{" "}
                will be sent to the Lab Coordinator. You can block the other
                sample separately.
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              data-ocid="secondcheck.block.cancel_button"
              onClick={() =>
                setBlockDialog({
                  open: false,
                  caseId: "",
                  sampleNumber: 1,
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
              style={{ backgroundColor: "#1a3a6b" }}
              className="text-white"
              data-ocid="secondcheck.block.confirm_button"
              onClick={handleBlock}
            >
              <Lock size={14} className="mr-1" />
              Block Sample {blockDialog.sampleNumber}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* \u2500\u2500 Purchase Form Dialog \u2500\u2500 */}
      <Dialog
        open={purchaseDialog.open}
        onOpenChange={(o) => !o && closePurchaseDialog()}
      >
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <DialogTitle className="text-base font-bold text-gray-800">
                Purchase \u2014 Sample {purchaseDialog.sampleNum} &nbsp;
                <span className="text-sm font-normal text-gray-500">
                  ({purchaseDialog.brand} / {purchaseDialog.model})
                </span>
              </DialogTitle>
              {form.purchaseMode && (
                <span
                  className={`text-xs font-semibold px-3 py-1 rounded-full ${
                    isOnline
                      ? "bg-blue-100 text-blue-700 border border-blue-200"
                      : "bg-green-100 text-green-700 border border-green-200"
                  }`}
                >
                  {isOnline
                    ? "\uD83C\uDF10 Online Purchase"
                    : "\uD83C\uDFEA Offline Purchase"}
                </span>
              )}
            </div>
            {purchaseDialog.labName && (
              <p className="text-xs text-green-700 mt-1 font-medium">
                \u2713 Assigned Lab: {purchaseDialog.labName}
              </p>
            )}
          </DialogHeader>

          <form onSubmit={handlePurchaseSubmit}>
            <div className="grid grid-cols-3 gap-x-4 gap-y-4 mt-2">
              <div>
                <p className="text-xs text-gray-600 mb-1">Purchase Date</p>
                <Input
                  type="date"
                  value={form.purchaseDate}
                  onChange={(e) => setField("purchaseDate", e.target.value)}
                  className="h-9 text-sm"
                />
              </div>
              <div>
                <p className="text-xs font-medium text-gray-700 mb-1">
                  Purchase Mode
                </p>
                <Select
                  value={form.purchaseMode}
                  onValueChange={(v) => setField("purchaseMode", v)}
                >
                  <SelectTrigger
                    className={`h-9 text-sm font-medium ${
                      isOnline
                        ? "border-blue-400 ring-1 ring-blue-300 text-blue-700"
                        : form.purchaseMode === "Offline"
                          ? "border-green-400 ring-1 ring-green-300 text-green-700"
                          : ""
                    }`}
                  >
                    <SelectValue placeholder="Select Mode" />
                  </SelectTrigger>
                  <SelectContent>
                    {purchaseModeOptions.map((m) => (
                      <SelectItem key={m} value={m}>
                        {m === "Online"
                          ? "\uD83C\uDF10 Online"
                          : "\uD83C\uDFEA Offline"}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <p className="text-xs text-gray-600 mb-1">Retailer Name</p>
                <Input
                  value={form.retailerName}
                  onChange={(e) => setField("retailerName", e.target.value)}
                  placeholder={
                    isOnline
                      ? "Enter online store / website"
                      : "Enter retailer name"
                  }
                  className="h-9 text-sm"
                />
              </div>

              <div>
                <p className="text-xs text-gray-600 mb-1">Invoice Number</p>
                <Input
                  value={form.invoiceNumber}
                  onChange={(e) => setField("invoiceNumber", e.target.value)}
                  placeholder="1234567888"
                  className="h-9 text-sm"
                />
              </div>
              <div>
                <p className="text-xs text-gray-600 mb-1">Invoice Date</p>
                <Input
                  type="date"
                  value={form.invoiceDate}
                  onChange={(e) => setField("invoiceDate", e.target.value)}
                  className="h-9 text-sm"
                />
              </div>
              <div>
                <p className="text-xs text-gray-600 mb-1">Appliance name</p>
                <Select
                  value={form.applianceName}
                  onValueChange={(v) => setField("applianceName", v)}
                >
                  <SelectTrigger className="h-9 text-sm">
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    {applianceCategories.map((c) => (
                      <SelectItem key={c.id} value={c.name}>
                        {c.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <p className="text-xs text-gray-600 mb-1">
                  Appliance brand name
                </p>
                <Input
                  value={form.applianceBrand}
                  onChange={(e) => setField("applianceBrand", e.target.value)}
                  placeholder="Samsung/Realme"
                  className="h-9 text-sm"
                />
              </div>
              <div>
                <p className="text-xs text-gray-600 mb-1">
                  Appliance model number
                </p>
                <Input
                  value={form.applianceModel}
                  onChange={(e) => setField("applianceModel", e.target.value)}
                  placeholder="Enter"
                  className="h-9 text-sm"
                />
              </div>
              <div>
                <p className="text-xs text-gray-600 mb-1">Quantity</p>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-500 whitespace-nowrap">
                    1st test check
                  </span>
                  <Input
                    type="number"
                    value={form.qty1stTest}
                    onChange={(e) => setField("qty1stTest", e.target.value)}
                    className="h-9 text-sm w-14"
                    min="0"
                  />
                  <span className="text-xs text-gray-500 whitespace-nowrap">
                    2nd test check
                  </span>
                  <Input
                    type="number"
                    value={form.qty2ndTest}
                    onChange={(e) => setField("qty2ndTest", e.target.value)}
                    className="h-9 text-sm w-14"
                    min="0"
                  />
                </div>
              </div>

              <div>
                <p className="text-xs text-gray-600 mb-1">Invoice Amount</p>
                <Input
                  type="number"
                  value={form.invoiceAmount}
                  onChange={(e) => setField("invoiceAmount", e.target.value)}
                  placeholder="5,000"
                  className="h-9 text-sm"
                />
              </div>
              <div>
                <p className="text-xs text-gray-600 mb-1">
                  Product star rating
                </p>
                <Input
                  value={form.productStarRating}
                  onChange={(e) =>
                    setField("productStarRating", e.target.value)
                  }
                  placeholder="star level ****"
                  className="h-9 text-sm"
                />
              </div>

              {!isOnline ? (
                <div>
                  <p className="text-xs text-gray-600 mb-1">
                    Transportation cost
                  </p>
                  <Input
                    type="number"
                    value={form.transportationCost}
                    onChange={(e) =>
                      setField("transportationCost", e.target.value)
                    }
                    placeholder="0"
                    className="h-9 text-sm"
                  />
                </div>
              ) : (
                <div className="flex items-end">
                  <p className="text-xs text-gray-400 italic">
                    Transportation cost not applicable for online purchases
                  </p>
                </div>
              )}

              {!isOnline && (
                <div>
                  <p className="text-xs text-gray-600 mb-1">
                    Manpower cost - TA/Handling
                  </p>
                  <Input
                    type="number"
                    value={form.manpowerCost}
                    onChange={(e) => setField("manpowerCost", e.target.value)}
                    placeholder="0"
                    className="h-9 text-sm"
                  />
                </div>
              )}
              {!isOnline && (
                <div>
                  <p className="text-xs text-gray-600 mb-1">Insurance</p>
                  <Input
                    type="number"
                    value={form.insurance}
                    onChange={(e) => setField("insurance", e.target.value)}
                    placeholder="0"
                    className="h-9 text-sm bg-gray-50"
                  />
                </div>
              )}

              <div>
                <p className="text-xs text-gray-600 mb-1">Total Amount</p>
                <Input
                  type="number"
                  value={form.totalAmount}
                  readOnly
                  className="h-9 text-sm bg-gray-50 font-medium"
                />
              </div>
              <div>
                <p className="text-xs text-gray-600 mb-1">Installment</p>
                <Select
                  value={form.installment}
                  onValueChange={(v) => setField("installment", v)}
                >
                  <SelectTrigger className="h-9 text-sm">
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    {installmentOptions.map((opt) => (
                      <SelectItem key={opt} value={opt}>
                        {opt}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Lab Assignment \u2014 read-only for this sample */}
              <div>
                <p className="text-xs text-gray-600 mb-1">
                  Assigned Lab (Sample {purchaseDialog.sampleNum})
                </p>
                <div
                  className="p-2.5 rounded-lg flex items-center gap-2"
                  style={{
                    backgroundColor: "#f0fdf4",
                    border: "1px solid #bbf7d0",
                  }}
                >
                  <span className="text-green-600 text-sm">\u2713</span>
                  <p className="text-xs font-semibold text-green-800">
                    {purchaseDialog.labName}
                  </p>
                </div>
              </div>

              <div>
                <p className="text-xs text-gray-600 mb-1">Invoice</p>
                <div className="relative">
                  <Input
                    readOnly
                    value={invoiceFileName}
                    placeholder="Choose...."
                    className="h-9 text-sm pr-10 cursor-pointer"
                    onClick={() =>
                      document
                        .getElementById("invoiceFileInput2ndCheck")
                        ?.click()
                    }
                  />
                  <button
                    type="button"
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    onClick={() =>
                      document
                        .getElementById("invoiceFileInput2ndCheck")
                        ?.click()
                    }
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <title>Upload</title>
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
                      />
                    </svg>
                  </button>
                  <input
                    id="invoiceFileInput2ndCheck"
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    className="hidden"
                    onChange={handleFileChange}
                  />
                </div>
              </div>
            </div>

            <DialogFooter className="mt-6 gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={closePurchaseDialog}
                data-ocid="secondcheck.purchase.cancel_button"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                style={{ backgroundColor: "#1a3a6b", color: "white" }}
                data-ocid="secondcheck.purchase.submit_button"
              >
                <ShoppingCart size={14} className="mr-1" />
                Confirm Purchase
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

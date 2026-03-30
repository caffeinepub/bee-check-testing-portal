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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CheckCircle2, FlaskConical, Lock, ShoppingCart } from "lucide-react";
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
    category: string;
    starRating: number;
  }>({
    open: false,
    sampleId: "",
    brand: "",
    model: "",
    category: "",
    starRating: 0,
  });

  const [form, setForm] = useState<PurchaseFormState>(emptyForm());
  const [invoiceFileName, setInvoiceFileName] = useState("");

  const isOnline = form.purchaseMode === "Online";

  const activeSample = secondCheckSamples.find(
    (s) => s.id === purchaseDialog.sampleId,
  );

  // Auto-fill form when dialog opens
  useEffect(() => {
    if (purchaseDialog.open && activeSample) {
      setForm((f) => ({
        ...f,
        applianceName: activeSample.category,
        applianceBrand: activeSample.brandName,
        applianceModel: activeSample.modelNumber,
        productStarRating: "★".repeat(activeSample.starRating),
      }));
    }
  }, [purchaseDialog.open, activeSample]);

  // Auto-calculate total amount
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

  // Reset offline-only fields when switching to Online
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

  const closePurchaseDialog = () => {
    setPurchaseDialog({
      open: false,
      sampleId: "",
      brand: "",
      model: "",
      category: "",
      starRating: 0,
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
    toast.success(
      `Purchase confirmed for ${purchaseDialog.brand} — ${purchaseDialog.model}. Both samples submitted to their assigned labs.`,
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
                                  onClick={() => {
                                    setPurchaseDialog({
                                      open: true,
                                      sampleId: s.id,
                                      brand: s.brandName,
                                      model: s.modelNumber,
                                      category: s.category,
                                      starRating: s.starRating,
                                    });
                                    setForm(emptyForm());
                                    setInvoiceFileName("");
                                  }}
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

      {/* ── Purchase Form Dialog (full form, matches 1st test) ── */}
      <Dialog
        open={purchaseDialog.open}
        onOpenChange={(o) => !o && closePurchaseDialog()}
      >
        <DialogContent
          data-ocid="second_check.purchase_dialog"
          className="max-w-4xl max-h-[90vh] overflow-y-auto"
        >
          <DialogHeader>
            <div className="flex items-center justify-between">
              <DialogTitle className="text-base font-bold text-gray-800">
                Product purchased details
              </DialogTitle>
              {form.purchaseMode && (
                <span
                  className={`text-xs font-semibold px-3 py-1 rounded-full ${
                    isOnline
                      ? "bg-blue-100 text-blue-700 border border-blue-200"
                      : "bg-green-100 text-green-700 border border-green-200"
                  }`}
                >
                  {isOnline ? "🌐 Online Purchase" : "🏪 Offline Purchase"}
                </span>
              )}
            </div>
          </DialogHeader>

          <form onSubmit={handlePurchaseSubmit}>
            <div className="grid grid-cols-3 gap-x-4 gap-y-4 mt-2">
              {/* Row 1 */}
              <div>
                <p className="text-xs text-gray-600 mb-1">Purchase Date</p>
                <Input
                  data-ocid="second_check_purchase.date.input"
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
                    data-ocid="second_check_purchase.mode.select"
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
                        {m === "Online" ? "🌐 Online" : "🏪 Offline"}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <p className="text-xs text-gray-600 mb-1">Retailer Name</p>
                <Input
                  data-ocid="second_check_purchase.retailer.input"
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

              {/* Row 2 */}
              <div>
                <p className="text-xs text-gray-600 mb-1">Invoice Number</p>
                <Input
                  data-ocid="second_check_purchase.invoice_number.input"
                  value={form.invoiceNumber}
                  onChange={(e) => setField("invoiceNumber", e.target.value)}
                  placeholder="1234567888"
                  className="h-9 text-sm"
                />
              </div>
              <div>
                <p className="text-xs text-gray-600 mb-1">Invoice Date</p>
                <Input
                  data-ocid="second_check_purchase.invoice_date.input"
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
                  <SelectTrigger
                    data-ocid="second_check_purchase.appliance_name.select"
                    className="h-9 text-sm"
                  >
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

              {/* Row 3 */}
              <div>
                <p className="text-xs text-gray-600 mb-1">
                  Appliance brand name
                </p>
                <Input
                  data-ocid="second_check_purchase.brand.input"
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
                  data-ocid="second_check_purchase.model.input"
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
                    data-ocid="second_check_purchase.qty1.input"
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
                    data-ocid="second_check_purchase.qty2.input"
                    type="number"
                    value={form.qty2ndTest}
                    onChange={(e) => setField("qty2ndTest", e.target.value)}
                    className="h-9 text-sm w-14"
                    min="0"
                  />
                </div>
              </div>

              {/* Row 4 */}
              <div>
                <p className="text-xs text-gray-600 mb-1">Invoice Amount</p>
                <Input
                  data-ocid="second_check_purchase.invoice_amount.input"
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
                  data-ocid="second_check_purchase.star_rating.input"
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
                    data-ocid="second_check_purchase.transport.input"
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

              {!isOnline ? (
                <div>
                  <p className="text-xs text-gray-600 mb-1">
                    Manpower cost - TA/Handling
                  </p>
                  <Input
                    data-ocid="second_check_purchase.manpower.input"
                    type="number"
                    value={form.manpowerCost}
                    onChange={(e) => setField("manpowerCost", e.target.value)}
                    placeholder="0"
                    className="h-9 text-sm"
                  />
                </div>
              ) : null}

              {!isOnline ? (
                <div>
                  <p className="text-xs text-gray-600 mb-1">Insurance</p>
                  <Input
                    data-ocid="second_check_purchase.insurance.input"
                    type="number"
                    value={form.insurance}
                    onChange={(e) => setField("insurance", e.target.value)}
                    placeholder="0"
                    className="h-9 text-sm bg-gray-50"
                  />
                </div>
              ) : null}

              <div>
                <p className="text-xs text-gray-600 mb-1">Total Amount</p>
                <Input
                  data-ocid="second_check_purchase.total.input"
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
                  <SelectTrigger
                    data-ocid="second_check_purchase.installment.select"
                    className="h-9 text-sm"
                  >
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

              {/* Lab Assignment — shows both Lab 1 and Lab 2 for 2nd check */}
              <div className="col-span-2">
                <p className="text-xs text-gray-600 mb-1">Lab Assignment</p>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Lab 1</p>
                    {activeSample?.lab1Name ? (
                      <div
                        className="p-2.5 rounded-lg flex items-center gap-2"
                        style={{
                          backgroundColor: "#f0fdf4",
                          border: "1px solid #bbf7d0",
                        }}
                        data-ocid="second_check_purchase.lab1.success_state"
                      >
                        <span className="text-green-600 text-sm">✓</span>
                        <p className="text-xs font-semibold text-green-800">
                          {activeSample.lab1Name}
                        </p>
                      </div>
                    ) : (
                      <div data-ocid="second_check_purchase.lab1.loading_state">
                        <Input
                          disabled
                          placeholder="Awaiting Lab Coordinator Assignment"
                          className="h-9 text-sm bg-gray-50 text-gray-400"
                        />
                      </div>
                    )}
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Lab 2</p>
                    {activeSample?.lab2Name ? (
                      <div
                        className="p-2.5 rounded-lg flex items-center gap-2"
                        style={{
                          backgroundColor: "#f0fdf4",
                          border: "1px solid #bbf7d0",
                        }}
                        data-ocid="second_check_purchase.lab2.success_state"
                      >
                        <span className="text-green-600 text-sm">✓</span>
                        <p className="text-xs font-semibold text-green-800">
                          {activeSample.lab2Name}
                        </p>
                      </div>
                    ) : (
                      <div data-ocid="second_check_purchase.lab2.loading_state">
                        <Input
                          disabled
                          placeholder="Awaiting Lab Coordinator Assignment"
                          className="h-9 text-sm bg-gray-50 text-gray-400"
                        />
                      </div>
                    )}
                  </div>
                </div>
                <p className="text-xs text-gray-400 mt-1">
                  ⏳ Lab information is auto-filled once Lab Coordinator assigns
                  both labs.
                </p>
              </div>

              {/* Invoice file */}
              <div>
                <p className="text-xs text-gray-600 mb-1">Invoice</p>
                <div className="relative">
                  <Input
                    data-ocid="second_check_purchase.invoice_file.input"
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
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2}
                      role="img"
                      aria-label="Attach file"
                    >
                      <title>Attach file</title>
                      <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" />
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

            {isOnline && (
              <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
                <p className="text-xs text-blue-700 font-medium">
                  ℹ️ Online Purchase Mode: Transportation cost, Manpower cost
                  (TA/Handling), and Insurance fields are not applicable and
                  have been hidden.
                </p>
              </div>
            )}

            <DialogFooter className="mt-6 gap-2">
              <Button
                data-ocid="second_check_purchase.cancel.cancel_button"
                type="button"
                variant="outline"
                className="border-red-500 text-red-600 hover:bg-red-50"
                onClick={closePurchaseDialog}
              >
                Cancel
              </Button>
              <Button
                data-ocid="second_check_purchase.submit.submit_button"
                type="submit"
                className="bg-green-700 hover:bg-green-800 text-white px-8"
              >
                Submit
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

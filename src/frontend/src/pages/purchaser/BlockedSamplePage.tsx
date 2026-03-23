import { Button } from "@/components/ui/button";
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
import { Lock } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useAuth } from "../../contexts/AuthContext";
import { useBlockedSamples } from "../../contexts/BlockedSamplesContext";
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

export default function BlockedSamplePage() {
  const { user } = useAuth();
  const { blockedSamples } = useBlockedSamples();

  const myBlocked = blockedSamples.filter(
    (s) => s.purchaserEmail === (user?.email ?? "purchaser@bee.gov.in"),
  );

  const [selectedSampleId, setSelectedSampleId] = useState<number | null>(null);
  const [purchaseDialogOpen, setPurchaseDialogOpen] = useState(false);
  const [form, setForm] = useState<PurchaseFormState>(emptyForm());
  const [invoiceFileName, setInvoiceFileName] = useState("");

  const selectedSample =
    myBlocked.find((s) => s.id === selectedSampleId) ?? null;
  const isOnline = form.purchaseMode === "Online";

  // Auto-fill from selected blocked sample
  useEffect(() => {
    if (selectedSample && purchaseDialogOpen) {
      setForm((f) => ({
        ...f,
        applianceName: selectedSample.categoryName,
        applianceBrand: selectedSample.brandName,
        applianceModel: selectedSample.modelNumber,
        productStarRating: "★".repeat(selectedSample.starRating),
        retailerName: selectedSample.retailer,
        invoiceAmount: String(selectedSample.price),
      }));
    }
  }, [selectedSample, purchaseDialogOpen]);

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

  const openPurchaseDialog = (sampleId: number) => {
    setSelectedSampleId(sampleId);
    setForm(emptyForm());
    setInvoiceFileName("");
    setPurchaseDialogOpen(true);
  };

  const handlePurchase = (e: React.FormEvent) => {
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
    const labInfo =
      selectedSample?.labAssignment?.labName ?? "Awaiting Assignment";
    toast.success(`Purchase recorded. Sample assigned to ${labInfo}.`);
    setPurchaseDialogOpen(false);
    setSelectedSampleId(null);
    setForm(emptyForm());
    setInvoiceFileName("");
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setForm((f) => ({ ...f, invoiceFile: file }));
      setInvoiceFileName(file.name);
    }
  };

  const labAssignment = selectedSample?.labAssignment;

  return (
    <div>
      <div className="mb-6">
        <h2
          className="text-xl font-bold flex items-center gap-2"
          style={{ color: "#1a3a6b" }}
        >
          <Lock size={20} />
          Blocked Sample
        </h2>
        <p className="text-gray-500 text-sm">
          Samples you have blocked. Click Purchase to proceed with procurement.
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
                "Star Rating",
                "Blocked On",
                "Lab Name",
                "Status",
                "Action",
              ].map((h) => (
                <TableHead key={h} className="text-white text-xs">
                  {h}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {myBlocked.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={9}
                  className="text-center py-12"
                  data-ocid="blocked.list.empty_state"
                >
                  <div className="flex flex-col items-center gap-2">
                    <Lock size={36} className="text-gray-300" />
                    <p className="text-sm font-medium text-gray-500">
                      No blocked samples yet.
                    </p>
                    <p className="text-xs text-gray-400">
                      Go to Search &amp; Block Sample to block a sample.
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              myBlocked.map((sample, i) => (
                <TableRow
                  key={sample.id}
                  data-ocid={`blocked.sample.row.${i + 1}`}
                  className="hover:bg-blue-50"
                >
                  <TableCell className="text-xs">{i + 1}</TableCell>
                  <TableCell className="text-xs">
                    {sample.categoryName}
                  </TableCell>
                  <TableCell className="text-xs font-medium">
                    {sample.brandName}
                  </TableCell>
                  <TableCell className="text-xs font-mono">
                    {sample.modelNumber}
                  </TableCell>
                  <TableCell className="text-xs">
                    {"★".repeat(sample.starRating)}
                  </TableCell>
                  <TableCell className="text-xs">
                    {new Date(sample.blockedAt).toLocaleDateString("en-IN", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </TableCell>
                  <TableCell>
                    {sample.labAssignment?.labName ? (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-green-100 text-green-800 font-medium">
                        {sample.labAssignment.labName}
                      </span>
                    ) : (
                      <span className="text-xs text-gray-400 italic">
                        Awaiting Assignment
                      </span>
                    )}
                  </TableCell>
                  <TableCell>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-700 font-medium">
                      Blocked
                    </span>
                  </TableCell>
                  <TableCell>
                    <Button
                      data-ocid={`blocked.purchase.button.${i + 1}`}
                      size="sm"
                      className="h-6 text-xs px-2"
                      style={{ backgroundColor: "#1a3a6b" }}
                      onClick={() => openPurchaseDialog(sample.id)}
                    >
                      Purchase
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Purchase Form Dialog */}
      <Dialog open={purchaseDialogOpen} onOpenChange={setPurchaseDialogOpen}>
        <DialogContent
          data-ocid="blocked.purchase.dialog"
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

          <form onSubmit={handlePurchase}>
            <div className="grid grid-cols-3 gap-x-4 gap-y-4 mt-2">
              {/* Row 1 */}
              <div>
                <p className="text-xs text-gray-600 mb-1">Purchase Date</p>
                <Input
                  data-ocid="purchase.date.input"
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
                    data-ocid="purchase.mode.select"
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
                  data-ocid="purchase.retailer.input"
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
                  data-ocid="purchase.invoice_number.input"
                  value={form.invoiceNumber}
                  onChange={(e) => setField("invoiceNumber", e.target.value)}
                  placeholder="1234567888"
                  className="h-9 text-sm"
                />
              </div>
              <div>
                <p className="text-xs text-gray-600 mb-1">Invoice Date</p>
                <Input
                  data-ocid="purchase.invoice_date.input"
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
                    data-ocid="purchase.appliance_name.select"
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
                  data-ocid="purchase.brand.input"
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
                  data-ocid="purchase.model.input"
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
                    data-ocid="purchase.qty1.input"
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
                    data-ocid="purchase.qty2.input"
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
                  data-ocid="purchase.invoice_amount.input"
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
                  data-ocid="purchase.star_rating.input"
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
                    data-ocid="purchase.transport.input"
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
                    data-ocid="purchase.manpower.input"
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
                    data-ocid="purchase.insurance.input"
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
                  data-ocid="purchase.total.input"
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
                    data-ocid="purchase.installment.select"
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

              {/* Lab Assignment - read-only, auto-filled by Lab Coordinator */}
              <div className="col-span-2">
                <p className="text-xs text-gray-600 mb-1">Lab Assignment</p>
                {labAssignment ? (
                  <div
                    className="p-2.5 rounded-lg flex items-center gap-2"
                    style={{
                      backgroundColor: "#f0fdf4",
                      border: "1px solid #bbf7d0",
                    }}
                    data-ocid="purchase.lab.success_state"
                  >
                    <span className="text-green-600 text-sm">✓</span>
                    <div>
                      <p className="text-xs font-semibold text-green-800">
                        {labAssignment.labName}
                      </p>
                      <p className="text-xs text-green-700">
                        {labAssignment.labAddress} · Contact:{" "}
                        {labAssignment.contactPerson} (
                        {labAssignment.contactNumber})
                      </p>
                    </div>
                  </div>
                ) : (
                  <div data-ocid="purchase.lab.loading_state">
                    <Input
                      disabled
                      placeholder="Awaiting Lab Coordinator Assignment"
                      className="h-9 text-sm bg-gray-50 text-gray-400"
                    />
                    <p className="text-xs text-gray-400 mt-1">
                      ⏳ Lab information will be auto-filled once Lab
                      Coordinator assigns it
                    </p>
                  </div>
                )}
              </div>

              <div>
                <p className="text-xs text-gray-600 mb-1">Invoice</p>
                <div className="relative">
                  <Input
                    data-ocid="purchase.invoice_file.input"
                    readOnly
                    value={invoiceFileName}
                    placeholder="Choose...."
                    className="h-9 text-sm pr-10 cursor-pointer"
                    onClick={() =>
                      document
                        .getElementById("invoiceFileInputBlocked")
                        ?.click()
                    }
                  />
                  <button
                    type="button"
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    onClick={() =>
                      document
                        .getElementById("invoiceFileInputBlocked")
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
                    id="invoiceFileInputBlocked"
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
                data-ocid="purchase.cancel.cancel_button"
                type="button"
                variant="outline"
                className="border-red-500 text-red-600 hover:bg-red-50"
                onClick={() => {
                  setPurchaseDialogOpen(false);
                  setForm(emptyForm());
                  setInvoiceFileName("");
                }}
              >
                Cancel
              </Button>
              <Button
                data-ocid="purchase.submit.submit_button"
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

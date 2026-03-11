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
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { applianceCategories } from "../../data/mockData";

const availableProducts = [
  {
    id: 101,
    categoryId: 1,
    categoryName: "Air Conditioner",
    brandName: "Samsung",
    modelNumber: "AC-1.5T-3S",
    starRating: 3,
    retailer: "Croma",
    price: 42000,
  },
  {
    id: 102,
    categoryId: 1,
    categoryName: "Air Conditioner",
    brandName: "LG",
    modelNumber: "LG-1T-5S",
    starRating: 5,
    retailer: "Reliance Digital",
    price: 51000,
  },
  {
    id: 103,
    categoryId: 2,
    categoryName: "Refrigerator",
    brandName: "Whirlpool",
    modelNumber: "WHL-265L-3S",
    starRating: 3,
    retailer: "Samsung Store",
    price: 28000,
  },
  {
    id: 104,
    categoryId: 2,
    categoryName: "Refrigerator",
    brandName: "Samsung",
    modelNumber: "SAM-345L-4S",
    starRating: 4,
    retailer: "Vijay Sales",
    price: 35000,
  },
  {
    id: 105,
    categoryId: 4,
    categoryName: "Ceiling Fan",
    brandName: "Havells",
    modelNumber: "HV-PACER-1200",
    starRating: 5,
    retailer: "Havells Store",
    price: 3200,
  },
  {
    id: 106,
    categoryId: 5,
    categoryName: "LED Light",
    brandName: "Philips",
    modelNumber: "PHL-15W-4S",
    starRating: 4,
    retailer: "Amazon",
    price: 850,
  },
];

const labOptions = [
  "NABL Lab Delhi",
  "NABL Lab Mumbai",
  "NABL Lab Chennai",
  "NABL Lab Kolkata",
  "BEE Approved Lab Hyderabad",
];
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
  labAssignment: string;
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
  labAssignment: "",
  invoiceFile: null,
});

export default function SearchProductPage() {
  const [categoryFilter, setCategoryFilter] = useState("");
  const [starFilter, setStarFilter] = useState("");
  const [searched, setSearched] = useState(false);
  const [blockedProduct, setBlockedProduct] = useState<
    (typeof availableProducts)[0] | null
  >(null);
  const [purchaseForm, setPurchaseForm] = useState(false);
  const [form, setForm] = useState<PurchaseFormState>(emptyForm());
  const [invoiceFileName, setInvoiceFileName] = useState("");

  const isOnline = form.purchaseMode === "Online";

  const results = availableProducts.filter(
    (p) =>
      (!categoryFilter || p.categoryId === Number.parseInt(categoryFilter)) &&
      (!starFilter || p.starRating === Number.parseInt(starFilter)),
  );

  // Auto-fill from blocked product
  useEffect(() => {
    if (blockedProduct && purchaseForm) {
      setForm((f) => ({
        ...f,
        applianceName: blockedProduct.categoryName,
        applianceBrand: blockedProduct.brandName,
        applianceModel: blockedProduct.modelNumber,
        productStarRating: "★".repeat(blockedProduct.starRating),
        retailerName: blockedProduct.retailer,
        invoiceAmount: String(blockedProduct.price),
      }));
    }
  }, [blockedProduct, purchaseForm]);

  // Auto-calculate total amount
  useEffect(() => {
    const invoice = Number.parseFloat(form.invoiceAmount) || 0;
    if (isOnline) {
      // Online mode: total = invoice amount only
      setForm((f) => ({ ...f, totalAmount: String(invoice) }));
    } else {
      // Offline mode: total = invoice + transport + manpower + insurance
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

  const handleBlock = (product: (typeof availableProducts)[0]) => {
    setBlockedProduct(product);
    toast.success(
      `${product.brandName} ${product.modelNumber} blocked successfully!`,
    );
  };

  const handlePurchase = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !form.purchaseDate ||
      !form.retailerName ||
      !form.invoiceNumber ||
      !form.invoiceAmount ||
      !form.installment ||
      !form.labAssignment
    ) {
      toast.error("Please fill all required purchase details");
      return;
    }
    toast.success(
      `Purchase recorded. Sample auto-assigned to ${form.labAssignment}.`,
    );
    setPurchaseForm(false);
    setBlockedProduct(null);
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

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-bold" style={{ color: "#1a3a6b" }}>
          Search & Block Product
        </h2>
        <p className="text-gray-500 text-sm">
          Search products and block for purchase
        </p>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-5 mb-5">
        <h3 className="font-semibold text-gray-800 mb-3 text-sm">
          Search Product
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3">
          <div>
            <p className="text-xs text-gray-600 mb-1">Appliance Category</p>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger
                data-ocid="search.category.select"
                className="h-9 text-sm"
              >
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                {applianceCategories.map((c) => (
                  <SelectItem key={c.id} value={String(c.id)}>
                    {c.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <p className="text-xs text-gray-600 mb-1">Star Rating</p>
            <Select value={starFilter} onValueChange={setStarFilter}>
              <SelectTrigger
                data-ocid="search.star.select"
                className="h-9 text-sm"
              >
                <SelectValue placeholder="Any Rating" />
              </SelectTrigger>
              <SelectContent>
                {[1, 2, 3, 4, 5].map((s) => (
                  <SelectItem key={s} value={String(s)}>
                    {s} Star
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <p className="text-xs text-gray-600 mb-1">Financial Year</p>
            <Select defaultValue="2024-25">
              <SelectTrigger
                data-ocid="search.fy.select"
                className="h-9 text-sm"
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="2024-25">2024-25</SelectItem>
                <SelectItem value="2023-24">2023-24</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-end">
            <Button
              data-ocid="search.search.button"
              className="w-full h-9"
              style={{ backgroundColor: "#1a3a6b" }}
              onClick={() => setSearched(true)}
            >
              Search
            </Button>
          </div>
        </div>
      </div>

      {searched && (
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
                  "Retail Price",
                  "Availability",
                  "Action",
                ].map((h) => (
                  <TableHead key={h} className="text-white text-xs">
                    {h}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {results.map((p, i) => (
                <TableRow
                  key={p.id}
                  data-ocid={`search.result.row.${i + 1}`}
                  className="hover:bg-blue-50"
                >
                  <TableCell className="text-xs">{i + 1}</TableCell>
                  <TableCell className="text-xs">{p.categoryName}</TableCell>
                  <TableCell className="text-xs font-medium">
                    {p.brandName}
                  </TableCell>
                  <TableCell className="text-xs font-mono">
                    {p.modelNumber}
                  </TableCell>
                  <TableCell className="text-xs">
                    {"★".repeat(p.starRating)}
                  </TableCell>
                  <TableCell className="text-xs">
                    ₹{p.price.toLocaleString()}
                  </TableCell>
                  <TableCell>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-green-100 text-green-800">
                      Available
                    </span>
                  </TableCell>
                  <TableCell>
                    <Button
                      data-ocid={`search.block.button.${i + 1}`}
                      size="sm"
                      className="h-6 text-xs px-2 bg-yellow-500 hover:bg-yellow-600 text-white"
                      onClick={() => handleBlock(p)}
                    >
                      Block
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {blockedProduct && !purchaseForm && (
        <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="font-medium text-yellow-800 text-sm mb-2">
            ✓ Product Blocked: {blockedProduct.brandName}{" "}
            {blockedProduct.modelNumber}
          </p>
          <Button
            data-ocid="search.proceed_purchase.button"
            style={{ backgroundColor: "#1a3a6b" }}
            size="sm"
            onClick={() => setPurchaseForm(true)}
          >
            Proceed to Purchase
          </Button>
        </div>
      )}

      {/* Purchase Form Dialog */}
      <Dialog open={purchaseForm} onOpenChange={setPurchaseForm}>
        <DialogContent
          data-ocid="search.purchase.dialog"
          className="max-w-4xl max-h-[90vh] overflow-y-auto"
        >
          <DialogHeader>
            <div className="flex items-center justify-between">
              <DialogTitle className="text-base font-bold text-gray-800">
                Product purchased details
              </DialogTitle>
              {/* Purchase Mode badge indicator */}
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

              {/* Transportation cost - Offline only */}
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

              {/* Manpower cost - Offline only */}
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

              {/* Insurance - Offline only */}
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

              {/* Total Amount */}
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

              {/* Row 6 */}
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
                    {installmentOptions.map((i) => (
                      <SelectItem key={i} value={i}>
                        {i}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <p className="text-xs text-gray-600 mb-1">Lab Assignment</p>
                <Select
                  value={form.labAssignment}
                  onValueChange={(v) => setField("labAssignment", v)}
                >
                  <SelectTrigger
                    data-ocid="purchase.lab.select"
                    className="h-9 text-sm"
                  >
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    {labOptions.map((l) => (
                      <SelectItem key={l} value={l}>
                        {l}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
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
                      document.getElementById("invoiceFileInput")?.click()
                    }
                  />
                  <button
                    type="button"
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    onClick={() =>
                      document.getElementById("invoiceFileInput")?.click()
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
                    id="invoiceFileInput"
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    className="hidden"
                    onChange={handleFileChange}
                  />
                </div>
              </div>
            </div>

            {/* Online mode info notice */}
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
                  setPurchaseForm(false);
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

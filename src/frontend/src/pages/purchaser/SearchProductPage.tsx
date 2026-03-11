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
import { useState } from "react";
import { toast } from "sonner";
import { applianceCategories, brands, mockSamples } from "../../data/mockData";

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

export default function SearchProductPage() {
  const [categoryFilter, setCategoryFilter] = useState("");
  const [starFilter, setStarFilter] = useState("");
  const [searched, setSearched] = useState(false);
  const [blockedProduct, setBlockedProduct] = useState<
    (typeof availableProducts)[0] | null
  >(null);
  const [purchaseForm, setPurchaseForm] = useState(false);
  const [storeName, setStoreName] = useState("");
  const [purchaseDate, setPurchaseDate] = useState("");
  const [invoiceAmount, setInvoiceAmount] = useState("");

  const results = availableProducts.filter(
    (p) =>
      (!categoryFilter || p.categoryId === Number.parseInt(categoryFilter)) &&
      (!starFilter || p.starRating === Number.parseInt(starFilter)),
  );

  const handleBlock = (product: (typeof availableProducts)[0]) => {
    setBlockedProduct(product);
    toast.success(
      `${product.brandName} ${product.modelNumber} blocked successfully!`,
    );
  };

  const handlePurchase = (e: React.FormEvent) => {
    e.preventDefault();
    if (!storeName || !purchaseDate || !invoiceAmount) {
      toast.error("Please fill all purchase details");
      return;
    }
    toast.success(
      "Purchase recorded. Sample auto-assigned to NABL Lab Delhi based on 30% allocation.",
    );
    setPurchaseForm(false);
    setBlockedProduct(null);
    setStoreName("");
    setPurchaseDate("");
    setInvoiceAmount("");
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

      <Dialog open={purchaseForm} onOpenChange={setPurchaseForm}>
        <DialogContent data-ocid="search.purchase.dialog">
          <DialogHeader>
            <DialogTitle>Purchase Form</DialogTitle>
          </DialogHeader>
          <form onSubmit={handlePurchase} className="space-y-3">
            {blockedProduct && (
              <p className="text-sm font-medium text-gray-700">
                {blockedProduct.brandName} {blockedProduct.modelNumber}
              </p>
            )}
            <div>
              <p className="text-xs text-gray-600 mb-1">Store Name *</p>
              <Input
                data-ocid="purchase.store.input"
                value={storeName}
                onChange={(e) => setStoreName(e.target.value)}
                placeholder="Enter store/retailer name"
              />
            </div>
            <div>
              <p className="text-xs text-gray-600 mb-1">Purchase Date *</p>
              <Input
                data-ocid="purchase.date.input"
                type="date"
                value={purchaseDate}
                onChange={(e) => setPurchaseDate(e.target.value)}
              />
            </div>
            <div>
              <p className="text-xs text-gray-600 mb-1">Invoice Amount (₹) *</p>
              <Input
                data-ocid="purchase.amount.input"
                type="number"
                value={invoiceAmount}
                onChange={(e) => setInvoiceAmount(e.target.value)}
                placeholder="Enter invoice amount"
              />
            </div>
            <div>
              <p className="text-xs text-gray-600 mb-1">Upload Invoice</p>
              <div className="border-2 border-dashed border-gray-300 rounded p-3 text-center">
                <p className="text-xs text-gray-400">
                  Click to upload invoice (PDF/JPG/PNG, max 10MB)
                </p>
                <Button
                  data-ocid="purchase.invoice.upload_button"
                  type="button"
                  variant="outline"
                  size="sm"
                  className="mt-2 text-xs"
                  onClick={() => toast.info("File upload simulated")}
                >
                  Choose File
                </Button>
              </div>
            </div>
            <DialogFooter>
              <Button
                data-ocid="purchase.cancel.cancel_button"
                type="button"
                variant="outline"
                onClick={() => setPurchaseForm(false)}
              >
                Cancel
              </Button>
              <Button
                data-ocid="purchase.submit.submit_button"
                type="submit"
                style={{ backgroundColor: "#1a3a6b" }}
              >
                Confirm Purchase & Assign to Lab
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

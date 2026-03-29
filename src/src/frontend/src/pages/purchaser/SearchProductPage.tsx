import { Button } from "@/components/ui/button";
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
import { useAuth } from "../../contexts/AuthContext";
import { useBlockedSamples } from "../../contexts/BlockedSamplesContext";
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

export default function SearchProductPage() {
  const { user } = useAuth();
  const { blockedSamples, addBlockedSample } = useBlockedSamples();

  const [categoryFilter, setCategoryFilter] = useState("");
  const [starFilter, setStarFilter] = useState("");
  const [brandFilter, setBrandFilter] = useState("");
  const [modelFilter, setModelFilter] = useState("");
  const [searched, setSearched] = useState(false);

  const results = availableProducts.filter(
    (p) =>
      (!categoryFilter || p.categoryId === Number.parseInt(categoryFilter)) &&
      (!starFilter || p.starRating === Number.parseInt(starFilter)) &&
      (!brandFilter ||
        p.brandName.toLowerCase().includes(brandFilter.toLowerCase())) &&
      (!modelFilter ||
        p.modelNumber.toLowerCase().includes(modelFilter.toLowerCase())),
  );

  const handleBlock = (product: (typeof availableProducts)[0]) => {
    const alreadyBlocked = blockedSamples.some(
      (s) => s.productId === product.id,
    );
    if (alreadyBlocked) {
      toast.info("This sample is already blocked.");
      return;
    }
    addBlockedSample({
      id: Date.now(),
      productId: product.id,
      brandName: product.brandName,
      modelNumber: product.modelNumber,
      categoryName: product.categoryName,
      starRating: product.starRating,
      retailer: product.retailer,
      price: product.price,
      blockedAt: new Date().toISOString(),
      purchaserEmail: user?.email ?? "purchaser@bee.gov.in",
    });
    toast.success(
      `${product.brandName} ${product.modelNumber} blocked successfully. Go to "Blocked Sample" tab to proceed with purchase.`,
    );
  };

  const handleReset = () => {
    setCategoryFilter("");
    setStarFilter("");
    setBrandFilter("");
    setModelFilter("");
    setSearched(false);
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-bold" style={{ color: "#1a3a6b" }}>
          Search & Block Sample
        </h2>
        <p className="text-gray-500 text-sm">
          Search samples and block for purchase
        </p>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-5 mb-5">
        <h3 className="font-semibold text-gray-800 mb-3 text-sm">
          Search Sample
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-3">
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
            <p className="text-xs text-gray-600 mb-1">Brand Name</p>
            <Input
              data-ocid="search.brand.input"
              value={brandFilter}
              onChange={(e) => setBrandFilter(e.target.value)}
              placeholder="e.g. Samsung, LG, Havells"
              className="h-9 text-sm"
            />
          </div>
          <div>
            <p className="text-xs text-gray-600 mb-1">Model Number</p>
            <Input
              data-ocid="search.model.input"
              value={modelFilter}
              onChange={(e) => setModelFilter(e.target.value)}
              placeholder="e.g. AC-1.5T-3S"
              className="h-9 text-sm"
            />
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
          <div className="flex items-end gap-2">
            <Button
              data-ocid="search.search.button"
              className="flex-1 h-9"
              style={{ backgroundColor: "#1a3a6b" }}
              onClick={() => setSearched(true)}
            >
              Search
            </Button>
            <Button
              data-ocid="search.reset.button"
              className="h-9 px-3"
              variant="outline"
              onClick={handleReset}
            >
              Reset
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
                  "Status",
                ].map((h) => (
                  <TableHead key={h} className="text-white text-xs">
                    {h}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {results.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="text-center text-sm text-gray-500 py-8"
                    data-ocid="search.results.empty_state"
                  >
                    No samples found matching your search criteria.
                  </TableCell>
                </TableRow>
              ) : (
                results.map((p, i) => {
                  const isBlocked = blockedSamples.some(
                    (s) => s.productId === p.id,
                  );
                  return (
                    <TableRow
                      key={p.id}
                      data-ocid={`search.result.row.${i + 1}`}
                      className="hover:bg-blue-50"
                    >
                      <TableCell className="text-xs">{i + 1}</TableCell>
                      <TableCell className="text-xs">
                        {p.categoryName}
                      </TableCell>
                      <TableCell className="text-xs font-medium">
                        {p.brandName}
                      </TableCell>
                      <TableCell className="text-xs font-mono">
                        {p.modelNumber}
                      </TableCell>
                      <TableCell className="text-xs">
                        {"★".repeat(p.starRating)}
                      </TableCell>
                      <TableCell>
                        {isBlocked ? (
                          <span className="text-xs px-2 py-0.5 rounded-full bg-green-100 text-green-800 font-medium">
                            Blocked
                          </span>
                        ) : (
                          <Button
                            data-ocid={`search.block.button.${i + 1}`}
                            size="sm"
                            className="h-6 text-xs px-2 bg-yellow-500 hover:bg-yellow-600 text-white"
                            onClick={() => handleBlock(p)}
                          >
                            Block
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}

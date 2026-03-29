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
import { applianceCategories, mockTargets, states } from "../../data/mockData";

const STARS = [1, 2, 3, 4, 5];

export default function TargetCreationPage() {
  const [targets, setTargets] = useState(mockTargets);
  const [state, setState] = useState("");
  const [category, setCategory] = useState("");
  // starQty: { 1: "", 2: "", 3: "", 4: "", 5: "" }
  const [starQty, setStarQty] = useState<Record<number, string>>({
    1: "",
    2: "",
    3: "",
    4: "",
    5: "",
  });

  const handleQtyChange = (star: number, val: string) => {
    setStarQty((prev) => ({ ...prev, [star]: val }));
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!state || !category) {
      toast.error("Please select State and Appliance Category");
      return;
    }
    const entries = STARS.filter((s) => Number(starQty[s]) > 0);
    if (entries.length === 0) {
      toast.error("Please enter quantity for at least one star rating");
      return;
    }
    const newRows = entries.map((s, idx) => ({
      id: Date.now() + idx,
      state,
      categoryName: category,
      starRating: s,
      quantity: Number.parseInt(starQty[s]),
      assigned: `${state} SDA`,
      financialYear: "2024-25",
      status: "Active",
      purchased: 0,
    }));
    setTargets((prev) => [...prev, ...newRows]);
    toast.success(`Target created for ${entries.length} star rating(s)`);
    setState("");
    setCategory("");
    setStarQty({ 1: "", 2: "", 3: "", 4: "", 5: "" });
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-bold" style={{ color: "#1a3a6b" }}>
          Target Creation
        </h2>
        <p className="text-gray-500 text-sm">
          Create procurement targets for SDA/BEE purchasers
        </p>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6 mb-6">
        <h3 className="font-semibold text-gray-800 mb-4">Create New Target</h3>
        <form onSubmit={handleCreate} className="space-y-5">
          {/* Row 1: State + Category */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-gray-600 mb-1">State *</p>
              <Select value={state} onValueChange={setState}>
                <SelectTrigger data-ocid="target.state.select">
                  <SelectValue placeholder="Select state" />
                </SelectTrigger>
                <SelectContent>
                  {states.map((s) => (
                    <SelectItem key={s} value={s}>
                      {s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <p className="text-xs text-gray-600 mb-1">Appliance Category *</p>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger data-ocid="target.category.select">
                  <SelectValue placeholder="Select category" />
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
          </div>

          {/* Row 2: Star Rating + Quantity */}
          <div>
            <p className="text-xs text-gray-600 mb-2">
              Star Rating &amp; Target Quantity *
            </p>
            <div className="grid grid-cols-5 gap-3">
              {STARS.map((s) => (
                <div
                  key={s}
                  className="flex flex-col items-center gap-2 border border-gray-200 rounded-lg p-3 bg-gray-50"
                >
                  {/* Star label */}
                  <div className="flex flex-col items-center">
                    <span className="text-xs font-semibold text-gray-700">
                      Star {s}
                    </span>
                    <span className="text-yellow-400 text-sm leading-tight">
                      {"★".repeat(s)}
                      {"☆".repeat(5 - s)}
                    </span>
                  </div>
                  {/* Quantity box */}
                  <Input
                    data-ocid={`target.star${s}.qty.input`}
                    type="number"
                    min={0}
                    value={starQty[s]}
                    onChange={(e) => handleQtyChange(s, e.target.value)}
                    placeholder="Qty"
                    className="text-center text-sm h-8 w-full"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Submit */}
          <div className="flex justify-end">
            <Button
              data-ocid="target.create.submit_button"
              type="submit"
              style={{ backgroundColor: "#1a3a6b" }}
              className="px-8"
            >
              Create Target
            </Button>
          </div>
        </form>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-4 py-3 border-b bg-gray-50">
          <h3 className="font-semibold text-gray-800 text-sm">
            Existing Targets
          </h3>
        </div>
        <Table>
          <TableHeader>
            <TableRow style={{ backgroundColor: "#1a3a6b" }}>
              {[
                "#",
                "State",
                "Category",
                "Star",
                "Qty",
                "Purchased",
                "FY",
                "Status",
              ].map((h) => (
                <TableHead key={h} className="text-white text-xs">
                  {h}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {targets.map((t, i) => (
              <TableRow
                key={t.id}
                data-ocid={`target.row.${i + 1}`}
                className="hover:bg-blue-50"
              >
                <TableCell className="text-xs">{i + 1}</TableCell>
                <TableCell className="text-xs">{t.state}</TableCell>
                <TableCell className="text-xs">{t.categoryName}</TableCell>
                <TableCell className="text-xs">
                  <span className="text-yellow-500">
                    {"★".repeat(t.starRating)}
                  </span>
                  <span className="text-gray-300">
                    {"★".repeat(5 - t.starRating)}
                  </span>
                  <span className="ml-1 text-gray-600">({t.starRating})</span>
                </TableCell>
                <TableCell className="text-xs font-bold">
                  {t.quantity}
                </TableCell>
                <TableCell className="text-xs">
                  {t.purchased}/{t.quantity}
                </TableCell>
                <TableCell className="text-xs">{t.financialYear}</TableCell>
                <TableCell>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-green-100 text-green-800">
                    {t.status}
                  </span>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

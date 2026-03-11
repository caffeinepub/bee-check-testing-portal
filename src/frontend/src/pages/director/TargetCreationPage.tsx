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

export default function TargetCreationPage() {
  const [targets, setTargets] = useState(mockTargets);
  const [state, setState] = useState("");
  const [category, setCategory] = useState("");
  const [star, setStar] = useState("");
  const [qty, setQty] = useState("");
  const [assignedTo, setAssignedTo] = useState("");

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!state || !category || !qty) {
      toast.error("Please fill all required fields");
      return;
    }
    setTargets((prev) => [
      ...prev,
      {
        id: prev.length + 1,
        state,
        categoryName: category,
        starRating: Number.parseInt(star) || 3,
        quantity: Number.parseInt(qty),
        assigned: assignedTo || `${state} SDA`,
        financialYear: "2024-25",
        status: "Active",
        purchased: 0,
      },
    ]);
    toast.success("Target created successfully");
    setState("");
    setCategory("");
    setStar("");
    setQty("");
    setAssignedTo("");
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
        <form
          onSubmit={handleCreate}
          className="grid grid-cols-2 md:grid-cols-3 gap-4"
        >
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
          <div>
            <p className="text-xs text-gray-600 mb-1">Star Rating</p>
            <Select value={star} onValueChange={setStar}>
              <SelectTrigger data-ocid="target.star.select">
                <SelectValue placeholder="Select star" />
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
            <p className="text-xs text-gray-600 mb-1">Target Quantity *</p>
            <Input
              data-ocid="target.quantity.input"
              type="number"
              value={qty}
              onChange={(e) => setQty(e.target.value)}
              placeholder="Enter quantity"
              min={1}
            />
          </div>
          <div>
            <p className="text-xs text-gray-600 mb-1">Assign To</p>
            <Input
              data-ocid="target.assignto.input"
              value={assignedTo}
              onChange={(e) => setAssignedTo(e.target.value)}
              placeholder="e.g., Maharashtra SDA"
            />
          </div>
          <div className="flex items-end">
            <Button
              data-ocid="target.create.submit_button"
              type="submit"
              style={{ backgroundColor: "#1a3a6b" }}
              className="w-full"
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
                "Assigned To",
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
                  {"★".repeat(t.starRating)}
                </TableCell>
                <TableCell className="text-xs font-bold">
                  {t.quantity}
                </TableCell>
                <TableCell className="text-xs">{t.assigned}</TableCell>
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

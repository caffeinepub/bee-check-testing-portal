import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import { mockSamples } from "../../data/mockData";

export default function AssignedSamplesPage() {
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selected, setSelected] = useState<(typeof mockSamples)[0] | null>(
    null,
  );

  const categories = [...new Set(mockSamples.map((s) => s.categoryName))];
  const statuses = [...new Set(mockSamples.map((s) => s.status))];
  const filtered = mockSamples.filter(
    (s) =>
      (categoryFilter === "all" || s.categoryName === categoryFilter) &&
      (statusFilter === "all" || s.status === statusFilter),
  );

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-bold" style={{ color: "#1a3a6b" }}>
          Assigned Samples
        </h2>
        <p className="text-gray-500 text-sm">
          All samples assigned to this laboratory
        </p>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-3 mb-4 flex gap-3 flex-wrap">
        <div className="min-w-[180px]">
          <p className="text-xs text-gray-600 mb-1">Category</p>
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger
              data-ocid="assigned.category.select"
              className="h-8 text-sm"
            >
              <SelectValue placeholder="All" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              {categories.map((c) => (
                <SelectItem key={c} value={c}>
                  {c}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="min-w-[160px]">
          <p className="text-xs text-gray-600 mb-1">Status</p>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger
              data-ocid="assigned.status.select"
              className="h-8 text-sm"
            >
              <SelectValue placeholder="All" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              {statuses.map((s) => (
                <SelectItem key={s} value={s}>
                  {s}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow style={{ backgroundColor: "#1a3a6b" }}>
              {[
                "#",
                "State",
                "Category",
                "Brand",
                "Model",
                "Star",
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
            {filtered.map((s, i) => (
              <TableRow
                key={s.id}
                data-ocid={`assigned.row.${i + 1}`}
                className="hover:bg-blue-50"
              >
                <TableCell className="text-xs">{i + 1}</TableCell>
                <TableCell className="text-xs">{s.state}</TableCell>
                <TableCell className="text-xs">{s.categoryName}</TableCell>
                <TableCell className="text-xs font-medium">
                  {s.brandName}
                </TableCell>
                <TableCell className="text-xs font-mono">
                  {s.modelNumber}
                </TableCell>
                <TableCell className="text-xs">
                  {"★".repeat(s.starRating)}
                </TableCell>
                <TableCell>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-blue-100 text-blue-800">
                    {s.status}
                  </span>
                </TableCell>
                <TableCell>
                  <Button
                    data-ocid={`assigned.view.button.${i + 1}`}
                    variant="outline"
                    size="sm"
                    className="h-6 text-xs px-2 text-blue-700"
                    onClick={() => setSelected(s)}
                  >
                    View More
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={!!selected} onOpenChange={() => setSelected(null)}>
        <DialogContent data-ocid="assigned.detail.dialog">
          <DialogHeader>
            <DialogTitle>Sample Details</DialogTitle>
          </DialogHeader>
          {selected && (
            <div className="grid grid-cols-2 gap-3 text-sm">
              {[
                ["Brand", selected.brandName],
                ["Model", selected.modelNumber],
                ["Category", selected.categoryName],
                ["Star", "★".repeat(selected.starRating)],
                ["State", selected.state],
                ["Status", selected.status],
                ["Lab", selected.labName],
                ["Purchaser", selected.purchaserName],
                ["FY", selected.financialYear],
                ["Store", selected.storeName || "N/A"],
                ["Test Date", selected.testDate || "N/A"],
              ].map(([k, v]) => (
                <div key={k}>
                  <p className="text-xs text-gray-500">{k}</p>
                  <p className="font-medium">{v}</p>
                </div>
              ))}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

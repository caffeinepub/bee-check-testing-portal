import { Button } from "@/components/ui/button";
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

const statusColors: Record<string, string> = {
  Approved: "bg-green-100 text-green-800",
  Rejected: "bg-red-100 text-red-800",
  InTesting: "bg-blue-100 text-blue-800",
  TestScheduled: "bg-purple-100 text-purple-800",
  SampleReceived: "bg-yellow-100 text-yellow-800",
  ReportUploaded: "bg-indigo-100 text-indigo-800",
  Purchased: "bg-cyan-100 text-cyan-800",
  InTransit: "bg-orange-100 text-orange-800",
  Blocked: "bg-gray-100 text-gray-800",
};

export default function MyPurchasesPage() {
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

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
          My Purchases
        </h2>
        <p className="text-gray-500 text-sm">
          All purchased and blocked samples
        </p>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-3 mb-4 flex gap-3 flex-wrap">
        <div className="min-w-[180px]">
          <p className="text-xs text-gray-600 mb-1">Category</p>
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger
              data-ocid="purchases.category.select"
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
              data-ocid="purchases.status.select"
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
        <div className="flex items-end">
          <Button
            data-ocid="purchases.excel.button"
            variant="outline"
            size="sm"
            className="text-green-700 border-green-300"
            onClick={() => toast.success("Excel downloaded")}
          >
            ↓ Export Excel
          </Button>
        </div>
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
                "Star",
                "State",
                "Lab",
                "FY",
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
                data-ocid={`purchases.row.${i + 1}`}
                className="hover:bg-blue-50"
              >
                <TableCell className="text-xs">{i + 1}</TableCell>
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
                <TableCell className="text-xs">{s.state}</TableCell>
                <TableCell className="text-xs">{s.labName}</TableCell>
                <TableCell className="text-xs">{s.financialYear}</TableCell>
                <TableCell>
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusColors[s.status] || "bg-gray-100 text-gray-700"}`}
                  >
                    {s.status}
                  </span>
                </TableCell>
                <TableCell>
                  <Button
                    data-ocid={`purchases.view.button.${i + 1}`}
                    variant="outline"
                    size="sm"
                    className="h-6 text-xs px-2 text-blue-700"
                    onClick={() =>
                      toast.info(
                        `${s.brandName} ${s.modelNumber} - Lab: ${s.labName}`,
                      )
                    }
                  >
                    View
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

import { Badge } from "@/components/ui/badge";
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
  NotFitForTest: "bg-red-50 text-red-700",
  SampleTested: "bg-teal-100 text-teal-800",
};

export default function ApplianceDataPage() {
  const [stateFilter, setStateFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedSample, setSelectedSample] = useState<
    (typeof mockSamples)[0] | null
  >(null);

  const categories = [...new Set(mockSamples.map((s) => s.categoryName))];
  const statuses = [...new Set(mockSamples.map((s) => s.status))];
  const states = [...new Set(mockSamples.map((s) => s.state))];

  const filtered = mockSamples.filter(
    (s) =>
      (stateFilter === "all" || s.state === stateFilter) &&
      (categoryFilter === "all" || s.categoryName === categoryFilter) &&
      (statusFilter === "all" || s.status === statusFilter),
  );

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-bold" style={{ color: "#1a3a6b" }}>
          Appliance Data Monitoring
        </h2>
        <p className="text-gray-500 text-sm">
          View and filter appliance testing records
        </p>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4 mb-4">
        <div className="flex flex-wrap gap-3 items-end">
          <div className="min-w-[160px]">
            <p className="text-xs text-gray-600 mb-1">State</p>
            <Select value={stateFilter} onValueChange={setStateFilter}>
              <SelectTrigger
                data-ocid="appliance.state.select"
                className="h-8 text-sm"
              >
                <SelectValue placeholder="All States" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All States</SelectItem>
                {states.map((s) => (
                  <SelectItem key={s} value={s}>
                    {s}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="min-w-[180px]">
            <p className="text-xs text-gray-600 mb-1">Appliance Category</p>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger
                data-ocid="appliance.category.select"
                className="h-8 text-sm"
              >
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
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
                data-ocid="appliance.status.select"
                className="h-8 text-sm"
              >
                <SelectValue placeholder="All Statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                {statuses.map((s) => (
                  <SelectItem key={s} value={s}>
                    {s}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button
            data-ocid="appliance.excel_download.button"
            variant="outline"
            size="sm"
            onClick={() =>
              toast.success("Excel report downloaded successfully")
            }
            className="text-green-700 border-green-300 hover:bg-green-50"
          >
            ↓ Download Excel
          </Button>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow style={{ backgroundColor: "#1a3a6b" }}>
              <TableHead className="text-white text-xs">Sr.No</TableHead>
              <TableHead className="text-white text-xs">State</TableHead>
              <TableHead className="text-white text-xs">Category</TableHead>
              <TableHead className="text-white text-xs">Brand</TableHead>
              <TableHead className="text-white text-xs">Model Number</TableHead>
              <TableHead className="text-white text-xs">Star Rating</TableHead>
              <TableHead className="text-white text-xs">Status</TableHead>
              <TableHead className="text-white text-xs">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((s, i) => (
              <TableRow
                key={s.id}
                data-ocid={`appliance.row.${i + 1}`}
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
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusColors[s.status] || "bg-gray-100 text-gray-700"}`}
                  >
                    {s.status}
                  </span>
                </TableCell>
                <TableCell>
                  <Button
                    data-ocid={`appliance.view_more.button.${i + 1}`}
                    variant="outline"
                    size="sm"
                    className="text-xs h-6 px-2 text-blue-700 border-blue-300"
                    onClick={() => setSelectedSample(s)}
                  >
                    View More
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {filtered.length === 0 && (
          <div
            className="py-8 text-center text-gray-400 text-sm"
            data-ocid="appliance.table.empty_state"
          >
            No records found for selected filters
          </div>
        )}
      </div>

      <Dialog
        open={!!selectedSample}
        onOpenChange={() => setSelectedSample(null)}
      >
        <DialogContent data-ocid="appliance.detail.dialog">
          <DialogHeader>
            <DialogTitle>Appliance Details</DialogTitle>
          </DialogHeader>
          {selectedSample && (
            <div className="space-y-3 text-sm">
              <div className="grid grid-cols-2 gap-3">
                {[
                  ["Brand", selectedSample.brandName],
                  ["Model", selectedSample.modelNumber],
                  ["Category", selectedSample.categoryName],
                  ["Star Rating", "★".repeat(selectedSample.starRating)],
                  ["State", selectedSample.state],
                  ["Status", selectedSample.status],
                  ["Lab Name", selectedSample.labName],
                  ["Store Name", selectedSample.storeName || "N/A"],
                  ["Financial Year", selectedSample.financialYear],
                  ["Purchase Date", selectedSample.purchaseDate || "N/A"],
                ].map(([k, v]) => (
                  <div key={k}>
                    <p className="text-xs text-gray-500">{k}</p>
                    <p className="font-medium">{v}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
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
import { CalendarDays, FileText } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { mockOfficialPerformance } from "../../data/mockData";

// Mock pending reports per official
const mockPendingReports: Record<
  string,
  { id: string; model: string; category: string; submittedDate: string }[]
> = {
  "Official A": [
    {
      id: "RPT-1001",
      model: "AC-XR200",
      category: "Air Conditioner",
      submittedDate: "2024-05-01",
    },
    {
      id: "RPT-1002",
      model: "REF-LG55",
      category: "Refrigerator",
      submittedDate: "2024-05-03",
    },
    {
      id: "RPT-1003",
      model: "WM-SAM7",
      category: "Washing Machine",
      submittedDate: "2024-05-07",
    },
    {
      id: "RPT-1004",
      model: "AC-HIT3",
      category: "Air Conditioner",
      submittedDate: "2024-05-10",
    },
    {
      id: "RPT-1005",
      model: "FAN-ORI9",
      category: "Ceiling Fan",
      submittedDate: "2024-05-12",
    },
  ],
  "Official B": [
    {
      id: "RPT-2001",
      model: "LED-PHI1",
      category: "LED Light",
      submittedDate: "2024-05-02",
    },
    {
      id: "RPT-2002",
      model: "GEY-AO4",
      category: "Geyser",
      submittedDate: "2024-05-06",
    },
    {
      id: "RPT-2003",
      model: "REF-WHI8",
      category: "Refrigerator",
      submittedDate: "2024-05-09",
    },
  ],
  "Official C": [
    {
      id: "RPT-3001",
      model: "AC-VOL2",
      category: "Air Conditioner",
      submittedDate: "2024-05-04",
    },
    {
      id: "RPT-3002",
      model: "WM-IFB6",
      category: "Washing Machine",
      submittedDate: "2024-05-08",
    },
    {
      id: "RPT-3003",
      model: "LED-SYL3",
      category: "LED Light",
      submittedDate: "2024-05-11",
    },
    {
      id: "RPT-3004",
      model: "FAN-BAJ5",
      category: "Ceiling Fan",
      submittedDate: "2024-05-13",
    },
    {
      id: "RPT-3005",
      model: "GEY-RAC7",
      category: "Geyser",
      submittedDate: "2024-05-14",
    },
    {
      id: "RPT-3006",
      model: "AC-MIT9",
      category: "Air Conditioner",
      submittedDate: "2024-05-15",
    },
    {
      id: "RPT-3007",
      model: "REF-SAM2",
      category: "Refrigerator",
      submittedDate: "2024-05-16",
    },
  ],
  "Official D": [
    {
      id: "RPT-4001",
      model: "GEY-HON4",
      category: "Geyser",
      submittedDate: "2024-05-05",
    },
    {
      id: "RPT-4002",
      model: "FAN-USH8",
      category: "Ceiling Fan",
      submittedDate: "2024-05-10",
    },
  ],
  "Official E": [
    {
      id: "RPT-5001",
      model: "WM-BOC3",
      category: "Washing Machine",
      submittedDate: "2024-05-07",
    },
    {
      id: "RPT-5002",
      model: "LED-HAV6",
      category: "LED Light",
      submittedDate: "2024-05-13",
    },
    {
      id: "RPT-5003",
      model: "AC-DAI1",
      category: "Air Conditioner",
      submittedDate: "2024-05-15",
    },
  ],
};

export default function OfficialPerformancePage() {
  const [assignDialog, setAssignDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [pendingDialog, setPendingDialog] = useState(false);
  const [pendingOfficialName, setPendingOfficialName] = useState("");
  const [pendingOfficialKey, setPendingOfficialKey] = useState("");

  const users = [
    "U1 - Official A",
    "U2 - Official B",
    "U3 - Official C",
    "U4 - Official D",
    "U5 - Official E",
  ];
  const categories = [
    "Air Conditioner",
    "Refrigerator",
    "Washing Machine",
    "Ceiling Fan",
    "LED Light",
    "Geyser",
  ];

  const toggleCategory = (cat: string) => {
    setSelectedCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat],
    );
  };

  const openPendingDialog = (officialName: string, officialKey: string) => {
    setPendingOfficialName(officialName);
    setPendingOfficialKey(officialKey);
    setPendingDialog(true);
  };

  const pendingReports = mockPendingReports[pendingOfficialKey] ?? [];

  return (
    <div>
      <div className="mb-6 flex justify-between items-start">
        <div>
          <h2 className="text-xl font-bold" style={{ color: "#1a3a6b" }}>
            BEE Official Performance
          </h2>
          <p className="text-gray-500 text-sm">
            Assign appliance categories and monitor official performance
          </p>
        </div>
        <Button
          data-ocid="performance.assign.button"
          style={{ backgroundColor: "#1a3a6b" }}
          size="sm"
          onClick={() => setAssignDialog(true)}
        >
          + Assign Category
        </Button>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow style={{ backgroundColor: "#1a3a6b" }}>
              {[
                "Official",
                "Assigned Category",
                "Total Reports",
                "Approved",
                "Rejected",
                "Pending",
                "Max Days Pending",
              ].map((h) => (
                <TableHead key={h} className="text-white text-xs">
                  {h}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockOfficialPerformance.map((p, idx) => {
              const officialKey = p.user.replace(/^U\d+ - /, "");
              return (
                <TableRow
                  key={p.user}
                  className="hover:bg-blue-50"
                  data-ocid={`performance.row.${idx + 1}`}
                >
                  <TableCell className="text-sm font-medium">
                    {p.user}
                  </TableCell>
                  <TableCell className="text-sm">{p.category}</TableCell>
                  <TableCell className="text-sm font-bold">{p.total}</TableCell>
                  <TableCell className="text-sm text-green-700 font-medium">
                    {p.approved}
                  </TableCell>
                  <TableCell className="text-sm text-red-600 font-medium">
                    {p.rejected}
                  </TableCell>
                  <TableCell>
                    <button
                      type="button"
                      data-ocid={`performance.pending.button.${idx + 1}`}
                      onClick={() =>
                        openPendingDialog(officialKey, officialKey)
                      }
                      className="cursor-pointer focus:outline-none focus:ring-2 focus:ring-yellow-400 rounded-full"
                      title={`View pending reports for ${officialKey}`}
                    >
                      <Badge
                        className={`text-xs px-2 py-0.5 rounded-full font-medium transition-all hover:scale-105 ${
                          p.pending > 3
                            ? "bg-yellow-100 text-yellow-800 hover:bg-yellow-200"
                            : "bg-green-100 text-green-800 hover:bg-green-200"
                        }`}
                        variant="outline"
                      >
                        {p.pending}
                      </Badge>
                    </button>
                  </TableCell>
                  <TableCell>
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                        p.maxDaysPending > 5
                          ? "bg-red-100 text-red-700"
                          : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {p.maxDaysPending} days
                    </span>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      {/* Pending Reports Dialog */}
      <Dialog open={pendingDialog} onOpenChange={setPendingDialog}>
        <DialogContent
          className="max-w-lg"
          data-ocid="performance.pending.dialog"
        >
          <DialogHeader>
            <DialogTitle
              className="flex items-center gap-2"
              style={{ color: "#1a3a6b" }}
            >
              <CalendarDays size={18} />
              {pendingOfficialName} — Pending Reports
            </DialogTitle>
          </DialogHeader>
          <ScrollArea className="max-h-72 pr-1">
            {pendingReports.length === 0 ? (
              <div
                className="py-6 text-center text-gray-500 text-sm"
                data-ocid="performance.pending.empty_state"
              >
                No pending reports found.
              </div>
            ) : (
              <div className="space-y-2 py-1">
                {pendingReports.map((r, i) => (
                  <div
                    key={r.id}
                    data-ocid={`performance.pending.item.${i + 1}`}
                    className="flex items-start justify-between p-3 rounded-lg border border-yellow-100 bg-yellow-50 hover:bg-yellow-100 transition-colors"
                  >
                    <div className="flex items-start gap-2">
                      <FileText
                        size={15}
                        className="text-yellow-700 mt-0.5 shrink-0"
                      />
                      <div>
                        <p className="text-xs font-semibold text-gray-800">
                          {r.id}
                        </p>
                        <p className="text-xs text-gray-600">
                          {r.model} &nbsp;·&nbsp; {r.category}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 shrink-0 ml-4">
                      <CalendarDays size={12} className="text-gray-400" />
                      <span className="text-xs text-gray-500 font-medium">
                        {r.submittedDate}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>
          <DialogFooter>
            <Button
              data-ocid="performance.pending.close_button"
              variant="outline"
              onClick={() => setPendingDialog(false)}
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Assign Category Dialog */}
      <Dialog open={assignDialog} onOpenChange={setAssignDialog}>
        <DialogContent data-ocid="performance.assign.dialog">
          <DialogHeader>
            <DialogTitle>Assign Appliance Category to Official</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div>
              <p className="text-sm mb-1 text-gray-700">Select Official</p>
              <Select value={selectedUser} onValueChange={setSelectedUser}>
                <SelectTrigger data-ocid="performance.user.select">
                  <SelectValue placeholder="Select official" />
                </SelectTrigger>
                <SelectContent>
                  {users.map((u) => (
                    <SelectItem key={u} value={u}>
                      {u}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <p className="text-sm mb-2 text-gray-700">
                Select Appliance Categories
              </p>
              <ScrollArea className="h-44 rounded-md border border-gray-200 p-3">
                <div className="space-y-3">
                  {categories.map((cat) => (
                    <div key={cat} className="flex items-center gap-3">
                      <Checkbox
                        id={`cat-${cat}`}
                        data-ocid={"performance.category.checkbox"}
                        checked={selectedCategories.includes(cat)}
                        onCheckedChange={() => toggleCategory(cat)}
                      />
                      <Label
                        htmlFor={`cat-${cat}`}
                        className="text-sm text-gray-700 cursor-pointer select-none"
                      >
                        {cat}
                      </Label>
                    </div>
                  ))}
                </div>
              </ScrollArea>
              {selectedCategories.length > 0 && (
                <p className="text-xs text-blue-700 mt-2 font-medium">
                  {selectedCategories.length} categor
                  {selectedCategories.length === 1 ? "y" : "ies"} selected
                </p>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button
              data-ocid="performance.assign.cancel_button"
              variant="outline"
              onClick={() => {
                setAssignDialog(false);
                setSelectedCategories([]);
                setSelectedUser("");
              }}
            >
              Cancel
            </Button>
            <Button
              data-ocid="performance.assign.confirm_button"
              style={{ backgroundColor: "#1a3a6b" }}
              onClick={() => {
                if (!selectedUser || selectedCategories.length === 0) {
                  toast.error(
                    "Please select an official and at least one category.",
                  );
                  return;
                }
                toast.success(
                  `${selectedCategories.length} categor${selectedCategories.length === 1 ? "y" : "ies"} assigned to ${selectedUser}`,
                );
                setAssignDialog(false);
                setSelectedCategories([]);
                setSelectedUser("");
              }}
            >
              Assign
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

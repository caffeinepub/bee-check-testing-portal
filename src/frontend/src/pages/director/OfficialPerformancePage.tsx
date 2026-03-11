import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
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
import { mockOfficialPerformance } from "../../data/mockData";

export default function OfficialPerformancePage() {
  const [assignDialog, setAssignDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  const users = [
    "U1 - Anil Sharma",
    "U2 - Priya Mehta",
    "U3 - Ramesh Kumar",
    "U4 - Sunita Rao",
    "U5 - Vijay Patel",
  ];
  const categories = [
    "Air Conditioner",
    "Refrigerator",
    "Washing Machine",
    "Ceiling Fan",
    "LED Light",
    "Geyser",
  ];

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
            {mockOfficialPerformance.map((p) => (
              <TableRow key={p.user} className="hover:bg-blue-50">
                <TableCell className="text-sm font-medium">{p.user}</TableCell>
                <TableCell className="text-sm">{p.category}</TableCell>
                <TableCell className="text-sm font-bold">{p.total}</TableCell>
                <TableCell className="text-sm text-green-700 font-medium">
                  {p.approved}
                </TableCell>
                <TableCell className="text-sm text-red-600 font-medium">
                  {p.rejected}
                </TableCell>
                <TableCell>
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full font-medium ${p.pending > 3 ? "bg-yellow-100 text-yellow-800" : "bg-green-100 text-green-800"}`}
                  >
                    {p.pending}
                  </span>
                </TableCell>
                <TableCell>
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full font-medium ${p.maxDaysPending > 5 ? "bg-red-100 text-red-700" : "bg-gray-100 text-gray-700"}`}
                  >
                    {p.maxDaysPending} days
                  </span>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
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
              <p className="text-sm mb-1 text-gray-700">
                Select Appliance Category
              </p>
              <Select
                value={selectedCategory}
                onValueChange={setSelectedCategory}
              >
                <SelectTrigger data-ocid="performance.category.select">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((c) => (
                    <SelectItem key={c} value={c}>
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button
              data-ocid="performance.assign.cancel_button"
              variant="outline"
              onClick={() => setAssignDialog(false)}
            >
              Cancel
            </Button>
            <Button
              data-ocid="performance.assign.confirm_button"
              style={{ backgroundColor: "#1a3a6b" }}
              onClick={() => {
                toast.success(
                  `Category ${selectedCategory} assigned to ${selectedUser}`,
                );
                setAssignDialog(false);
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

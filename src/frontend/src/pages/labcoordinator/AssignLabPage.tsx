import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type React from "react";
import { useState } from "react";
import { toast } from "sonner";
import type {
  BlockedSample,
  LabAssignment,
} from "../../contexts/BlockedSamplesContext";
import { useBlockedSamples } from "../../contexts/BlockedSamplesContext";

const labOptions = [
  "NABL Lab Delhi",
  "NABL Lab Mumbai",
  "NABL Lab Chennai",
  "NABL Lab Kolkata",
  "BEE Approved Lab Hyderabad",
  "ERTL Mumbai",
  "CPRI Bangalore",
  "ETDC Ahmedabad",
  "CIRT Pune",
];

const emptyForm = (): Omit<LabAssignment, "assignedAt"> => ({
  labName: "",
  labAddress: "",
  contactPerson: "",
  contactNumber: "",
  accreditationNumber: "",
});

export default function AssignLabPage() {
  const { blockedSamples, assignLab } = useBlockedSamples();

  const [assignTarget, setAssignTarget] = useState<BlockedSample | null>(null);
  const [viewTarget, setViewTarget] = useState<BlockedSample | null>(null);
  const [form, setForm] = useState(emptyForm());

  const setField = (field: keyof ReturnType<typeof emptyForm>, value: string) =>
    setForm((f) => ({ ...f, [field]: value }));

  const handleAssignSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!assignTarget) return;
    if (
      !form.labName ||
      !form.labAddress ||
      !form.contactPerson ||
      !form.contactNumber ||
      !form.accreditationNumber
    ) {
      toast.error("Please fill all required fields.");
      return;
    }
    assignLab(assignTarget.id, {
      ...form,
      assignedAt: new Date().toISOString(),
    });
    toast.success("Lab information assigned successfully to purchaser.");
    setAssignTarget(null);
    setForm(emptyForm());
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-bold" style={{ color: "#1a3a6b" }}>
          1st Check Test — Assign Lab
        </h2>
        <p className="text-gray-500 text-sm">
          Assign test lab information for purchaser-blocked samples (regular 1st
          check test)
        </p>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        {blockedSamples.length === 0 ? (
          <div
            className="py-16 text-center"
            data-ocid="assignlab.samples.empty_state"
          >
            <p className="text-gray-400 text-sm">
              No blocked samples yet. Samples blocked by purchasers will appear
              here.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr style={{ backgroundColor: "#1a3a6b" }}>
                  {[
                    "#",
                    "Category",
                    "Brand",
                    "Model",
                    "Star Rating",
                    "Blocked On",
                    "Purchaser",
                    "Status",
                    "Action",
                  ].map((h) => (
                    <th
                      key={h}
                      className="text-left px-3 py-2.5 text-xs text-white font-medium whitespace-nowrap"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {blockedSamples.map((s, i) => (
                  <tr
                    key={s.id}
                    className="border-b border-gray-100 hover:bg-blue-50"
                    data-ocid={`assignlab.sample.item.${i + 1}`}
                  >
                    <td className="px-3 py-2.5 text-xs text-gray-500">
                      {i + 1}
                    </td>
                    <td className="px-3 py-2.5 text-xs text-gray-700">
                      {s.categoryName}
                    </td>
                    <td className="px-3 py-2.5 text-xs font-medium">
                      {s.brandName}
                    </td>
                    <td className="px-3 py-2.5 text-xs font-mono">
                      {s.modelNumber}
                    </td>
                    <td className="px-3 py-2.5 text-xs">
                      {"\u2605".repeat(s.starRating)}
                    </td>
                    <td className="px-3 py-2.5 text-xs text-gray-500 whitespace-nowrap">
                      {new Date(s.blockedAt).toLocaleDateString("en-IN")}
                    </td>
                    <td className="px-3 py-2.5 text-xs text-gray-600">
                      {s.purchaserEmail}
                    </td>
                    <td className="px-3 py-2.5">
                      {s.labAssignment ? (
                        <span className="text-xs px-2 py-0.5 rounded-full bg-green-100 text-green-800 font-medium">
                          Lab Assigned
                        </span>
                      ) : (
                        <span className="text-xs px-2 py-0.5 rounded-full bg-yellow-100 text-yellow-800 font-medium">
                          Pending
                        </span>
                      )}
                    </td>
                    <td className="px-3 py-2.5">
                      {s.labAssignment ? (
                        <Button
                          data-ocid={`assignlab.view.button.${i + 1}`}
                          size="sm"
                          variant="outline"
                          className="h-6 text-xs px-2 border-green-500 text-green-700"
                          onClick={() => setViewTarget(s)}
                        >
                          View Details
                        </Button>
                      ) : (
                        <Button
                          data-ocid={`assignlab.assign.button.${i + 1}`}
                          size="sm"
                          className="h-6 text-xs px-2"
                          style={{
                            backgroundColor: "#1a3a6b",
                            color: "white",
                          }}
                          onClick={() => {
                            setAssignTarget(s);
                            setForm(emptyForm());
                          }}
                        >
                          Assign Lab
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Assign Lab Dialog */}
      <Dialog
        open={!!assignTarget}
        onOpenChange={(o) => {
          if (!o) {
            setAssignTarget(null);
            setForm(emptyForm());
          }
        }}
      >
        <DialogContent data-ocid="assignlab.assign.dialog" className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-base" style={{ color: "#1a3a6b" }}>
              Assign Test Lab Information
            </DialogTitle>
            {assignTarget && (
              <p className="text-xs text-gray-500 mt-1">
                {assignTarget.brandName} \u00b7 {assignTarget.modelNumber}{" "}
                \u00b7 {assignTarget.categoryName}
              </p>
            )}
          </DialogHeader>
          <form onSubmit={handleAssignSubmit}>
            <div className="space-y-4 mt-2">
              <div>
                <Label className="text-xs font-semibold text-gray-700 mb-1 block">
                  Lab Name <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={form.labName}
                  onValueChange={(v) => setField("labName", v)}
                >
                  <SelectTrigger
                    data-ocid="assignlab.lab_name.select"
                    className="h-9 text-sm"
                  >
                    <SelectValue placeholder="Select lab" />
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
                <Label className="text-xs font-semibold text-gray-700 mb-1 block">
                  Lab Address <span className="text-red-500">*</span>
                </Label>
                <Input
                  data-ocid="assignlab.lab_address.input"
                  value={form.labAddress}
                  onChange={(e) => setField("labAddress", e.target.value)}
                  placeholder="Enter complete lab address"
                  className="h-9 text-sm"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-xs font-semibold text-gray-700 mb-1 block">
                    Contact Person <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    data-ocid="assignlab.contact_person.input"
                    value={form.contactPerson}
                    onChange={(e) => setField("contactPerson", e.target.value)}
                    placeholder="Name"
                    className="h-9 text-sm"
                  />
                </div>
                <div>
                  <Label className="text-xs font-semibold text-gray-700 mb-1 block">
                    Contact Number <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    data-ocid="assignlab.contact_number.input"
                    value={form.contactNumber}
                    onChange={(e) => setField("contactNumber", e.target.value)}
                    placeholder="+91-XXXXXXXXXX"
                    className="h-9 text-sm"
                  />
                </div>
              </div>
              <div>
                <Label className="text-xs font-semibold text-gray-700 mb-1 block">
                  Accreditation Number <span className="text-red-500">*</span>
                </Label>
                <Input
                  data-ocid="assignlab.accreditation.input"
                  value={form.accreditationNumber}
                  onChange={(e) =>
                    setField("accreditationNumber", e.target.value)
                  }
                  placeholder="e.g. NABL/TC/1234"
                  className="h-9 text-sm"
                />
              </div>
            </div>
            <DialogFooter className="mt-5 gap-2">
              <Button
                data-ocid="assignlab.assign.cancel_button"
                type="button"
                variant="outline"
                onClick={() => {
                  setAssignTarget(null);
                  setForm(emptyForm());
                }}
              >
                Cancel
              </Button>
              <Button
                data-ocid="assignlab.assign.confirm_button"
                type="submit"
                style={{ backgroundColor: "#1a3a6b", color: "white" }}
              >
                Assign Lab
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* View Lab Details Dialog */}
      <Dialog
        open={!!viewTarget}
        onOpenChange={(o) => {
          if (!o) setViewTarget(null);
        }}
      >
        <DialogContent data-ocid="assignlab.view.dialog" className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-base" style={{ color: "#1a3a6b" }}>
              Lab Assignment Details
            </DialogTitle>
            {viewTarget && (
              <p className="text-xs text-gray-500 mt-1">
                {viewTarget.brandName} \u00b7 {viewTarget.modelNumber}
              </p>
            )}
          </DialogHeader>
          {viewTarget?.labAssignment && (
            <div className="space-y-3 mt-2">
              {[
                ["Lab Name", viewTarget.labAssignment.labName],
                ["Lab Address", viewTarget.labAssignment.labAddress],
                ["Contact Person", viewTarget.labAssignment.contactPerson],
                ["Contact Number", viewTarget.labAssignment.contactNumber],
                [
                  "Accreditation No.",
                  viewTarget.labAssignment.accreditationNumber,
                ],
                [
                  "Assigned On",
                  new Date(viewTarget.labAssignment.assignedAt).toLocaleString(
                    "en-IN",
                  ),
                ],
              ].map(([label, value]) => (
                <div key={label} className="flex gap-3">
                  <span className="text-xs text-gray-500 w-36 flex-shrink-0 font-medium">
                    {label}
                  </span>
                  <span className="text-xs text-gray-800">{value}</span>
                </div>
              ))}
            </div>
          )}
          <DialogFooter className="mt-5">
            <Button
              data-ocid="assignlab.view.close_button"
              variant="outline"
              onClick={() => setViewTarget(null)}
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

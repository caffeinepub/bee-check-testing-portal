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
import { useState } from "react";
import { toast } from "sonner";
import { useSecondCheck } from "../../contexts/SecondCheckContext";
import type { SecondCheckSample } from "../../contexts/SecondCheckContext";

const labOptions = [
  "NABL Lab Delhi",
  "NABL Lab Mumbai",
  "NABL Lab Chennai",
  "NABL Lab Kolkata",
  "BEE Approved Lab Hyderabad",
  "ERTL Mumbai",
  "CPRI Bangalore",
  "NABL Lab Hyderabad",
];

type AssignForm = {
  labName: string;
  labAddress: string;
  contactPerson: string;
  contactNumber: string;
  accreditationNumber: string;
};

const emptyForm = (): AssignForm => ({
  labName: "",
  labAddress: "",
  contactPerson: "",
  contactNumber: "",
  accreditationNumber: "",
});

interface PendingAssignment {
  sample: SecondCheckSample;
  sampleIndex: number; // 1 or 2 for display
}

export default function AssignLabSecondCheckPage() {
  const { secondCheckSamples } = useSecondCheck();
  const [assignTarget, setAssignTarget] = useState<PendingAssignment | null>(
    null,
  );
  const [viewTarget, setViewTarget] = useState<SecondCheckSample | null>(null);
  const [form, setForm] = useState<AssignForm>(emptyForm());
  // Track locally-assigned labs per sampleId
  const [assignments, setAssignments] = useState<
    Record<
      string,
      {
        labName: string;
        labAddress: string;
        contactPerson: string;
        contactNumber: string;
        accreditationNumber: string;
        assignedAt: string;
      }
    >
  >({});

  const setField = (field: keyof AssignForm, value: string) =>
    setForm((f) => ({ ...f, [field]: value }));

  // Group samples by caseId with pair index (1 or 2)
  const samplesWithIndex = secondCheckSamples.map((s, idx) => {
    const siblingsBeforeMe = secondCheckSamples
      .slice(0, idx)
      .filter((x) => x.caseId === s.caseId).length;
    return { sample: s, sampleIndex: siblingsBeforeMe + 1 };
  });

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
    setAssignments((prev) => ({
      ...prev,
      [assignTarget.sample.id]: {
        ...form,
        assignedAt: new Date().toISOString(),
      },
    }));
    toast.success(
      `Lab assigned to Sample ${assignTarget.sampleIndex} successfully.`,
    );
    setAssignTarget(null);
    setForm(emptyForm());
  };

  const getStatusLabel = (s: SecondCheckSample) => {
    const statusMap: Record<string, { label: string; color: string }> = {
      InTransit: { label: "In Transit", color: "bg-blue-100 text-blue-800" },
      ReachedLab: {
        label: "Reached Lab",
        color: "bg-yellow-100 text-yellow-800",
      },
      ProposedDate: {
        label: "Date Proposed",
        color: "bg-purple-100 text-purple-800",
      },
      TestScheduled: {
        label: "Test Scheduled",
        color: "bg-indigo-100 text-indigo-800",
      },
      UnderTesting: {
        label: "Under Testing",
        color: "bg-orange-100 text-orange-800",
      },
      TestDone: { label: "Test Done", color: "bg-teal-100 text-teal-800" },
      ReportUploaded: {
        label: "Report Uploaded",
        color: "bg-green-100 text-green-800",
      },
      InvoiceRaised: {
        label: "Invoice Raised",
        color: "bg-gray-100 text-gray-800",
      },
      NFT: { label: "NFT", color: "bg-red-100 text-red-800" },
    };
    return (
      statusMap[s.status] ?? {
        label: s.status,
        color: "bg-gray-100 text-gray-700",
      }
    );
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-bold" style={{ color: "#1a3a6b" }}>
          2nd Check Test — Assign Lab
        </h2>
        <p className="text-gray-500 text-sm">
          Assign test lab information for 2nd check test samples
        </p>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        {samplesWithIndex.length === 0 ? (
          <div className="py-16 text-center">
            <p className="text-gray-400 text-sm">
              No 2nd check test samples yet. Samples will appear here once the
              Compliance Officer initiates a 2nd Check Test and purchasers block
              samples.
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
                    "Sample",
                    "Purchaser",
                    "Blocked On",
                    "Lab Status",
                    "Sample Status",
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
                {samplesWithIndex.map(({ sample: s, sampleIndex }, i) => {
                  const assigned = assignments[s.id];
                  const { label: statusLabel, color: statusColor } =
                    getStatusLabel(s);
                  return (
                    <tr
                      key={s.id}
                      className="border-b border-gray-100 hover:bg-blue-50"
                    >
                      <td className="px-3 py-2.5 text-xs text-gray-500">
                        {i + 1}
                      </td>
                      <td className="px-3 py-2.5 text-xs text-gray-700">
                        {s.category}
                      </td>
                      <td className="px-3 py-2.5 text-xs font-medium">
                        {s.brandName}
                      </td>
                      <td className="px-3 py-2.5 text-xs font-mono">
                        {s.modelNumber}
                      </td>
                      <td className="px-3 py-2.5">
                        <span
                          className="text-xs px-2 py-0.5 rounded-full font-medium"
                          style={{
                            backgroundColor:
                              sampleIndex === 1 ? "#dbeafe" : "#ede9fe",
                            color: sampleIndex === 1 ? "#1d4ed8" : "#6d28d9",
                          }}
                        >
                          Sample {sampleIndex}
                        </span>
                      </td>
                      <td className="px-3 py-2.5 text-xs text-gray-600">
                        {s.purchaser}
                      </td>
                      <td className="px-3 py-2.5 text-xs text-gray-500 whitespace-nowrap">
                        {new Date(s.blockedOn).toLocaleDateString("en-IN")}
                      </td>
                      <td className="px-3 py-2.5">
                        {assigned ? (
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
                        <span
                          className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusColor}`}
                        >
                          {statusLabel}
                        </span>
                      </td>
                      <td className="px-3 py-2.5">
                        {assigned ? (
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-6 text-xs px-2 border-green-500 text-green-700"
                            onClick={() => setViewTarget(s)}
                          >
                            View Details
                          </Button>
                        ) : (
                          <Button
                            size="sm"
                            className="h-6 text-xs px-2"
                            style={{
                              backgroundColor: "#1a3a6b",
                              color: "white",
                            }}
                            onClick={() => {
                              setAssignTarget({ sample: s, sampleIndex });
                              setForm(emptyForm());
                            }}
                          >
                            Assign Lab
                          </Button>
                        )}
                      </td>
                    </tr>
                  );
                })}
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
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-base" style={{ color: "#1a3a6b" }}>
              Assign Test Lab — 2nd Check Test
            </DialogTitle>
            {assignTarget && (
              <p className="text-xs text-gray-500 mt-1">
                {assignTarget.sample.brandName} ·{" "}
                {assignTarget.sample.modelNumber} · Sample{" "}
                {assignTarget.sampleIndex}
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
                  <SelectTrigger className="h-9 text-sm">
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
                type="submit"
                style={{ backgroundColor: "#1a3a6b", color: "white" }}
              >
                Assign Lab
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* View Details Dialog */}
      <Dialog
        open={!!viewTarget}
        onOpenChange={(o) => {
          if (!o) setViewTarget(null);
        }}
      >
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-base" style={{ color: "#1a3a6b" }}>
              Lab Assignment Details — 2nd Check Test
            </DialogTitle>
            {viewTarget && (
              <p className="text-xs text-gray-500 mt-1">
                {viewTarget.brandName} · {viewTarget.modelNumber}
              </p>
            )}
          </DialogHeader>
          {viewTarget && assignments[viewTarget.id] && (
            <div className="space-y-3 mt-2">
              {(
                [
                  ["Lab Name", assignments[viewTarget.id].labName],
                  ["Lab Address", assignments[viewTarget.id].labAddress],
                  ["Contact Person", assignments[viewTarget.id].contactPerson],
                  ["Contact Number", assignments[viewTarget.id].contactNumber],
                  [
                    "Accreditation No.",
                    assignments[viewTarget.id].accreditationNumber,
                  ],
                  [
                    "Assigned On",
                    new Date(
                      assignments[viewTarget.id].assignedAt,
                    ).toLocaleString("en-IN"),
                  ],
                ] as [string, string][]
              ).map(([label, value]) => (
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
            <Button variant="outline" onClick={() => setViewTarget(null)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

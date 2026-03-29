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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";
import { toast } from "sonner";
import type {
  BlockedSample,
  LabAssignment,
  SecondCheckLabRequest,
} from "../../contexts/BlockedSamplesContext";
import { useBlockedSamples } from "../../contexts/BlockedSamplesContext";
import { useSecondCheck } from "../../contexts/SecondCheckContext";

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

function StarDisplay({ rating }: { rating: number }) {
  return (
    <span className="text-amber-500 text-xs">
      {"★".repeat(rating)}
      <span className="text-gray-300">{"★".repeat(5 - rating)}</span>
    </span>
  );
}

export default function AssignLabPage() {
  const {
    blockedSamples,
    assignLab,
    secondCheckLabRequests,
    assignSecondCheckLabs,
  } = useBlockedSamples();
  const { assignSecondCheckLab } = useSecondCheck();

  // Regular samples state
  const [assignTarget, setAssignTarget] = useState<BlockedSample | null>(null);
  const [viewTarget, setViewTarget] = useState<BlockedSample | null>(null);
  const [form, setForm] = useState(emptyForm());

  // 2nd Check state
  const [secondCheckAssignTarget, setSecondCheckAssignTarget] =
    useState<SecondCheckLabRequest | null>(null);
  const [scLab1, setScLab1] = useState("");
  const [scLab2, setScLab2] = useState("");

  const pendingSecondCheck = secondCheckLabRequests.filter(
    (r) => !r.labAssignment,
  );

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

  const handleSecondCheckAssign = () => {
    if (!secondCheckAssignTarget) return;
    if (!scLab1 || !scLab2) {
      toast.error("Please select both Lab 1 and Lab 2.");
      return;
    }
    if (scLab1 === scLab2) {
      toast.error("Lab 1 and Lab 2 must be different.");
      return;
    }
    const caseId = secondCheckAssignTarget.caseId;
    // Update both contexts
    assignSecondCheckLabs(caseId, scLab1, scLab2);
    assignSecondCheckLab(caseId, scLab1, scLab2);
    toast.success(
      `Labs assigned: ${scLab1} (Sample 1) & ${scLab2} (Sample 2). Purchaser notified.`,
    );
    setSecondCheckAssignTarget(null);
    setScLab1("");
    setScLab2("");
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-bold" style={{ color: "#1a3a6b" }}>
          Assign Lab to Blocked Samples
        </h2>
        <p className="text-gray-500 text-sm">
          Assign test lab information for purchaser-blocked samples
        </p>
      </div>

      <Tabs defaultValue="regular">
        <TabsList className="mb-5">
          <TabsTrigger value="regular" data-ocid="assignlab.regular_tab">
            Regular Samples
            {blockedSamples.filter((s) => !s.labAssignment).length > 0 && (
              <span className="ml-2 bg-amber-500 text-white text-xs rounded-full px-1.5 py-0.5">
                {blockedSamples.filter((s) => !s.labAssignment).length}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger
            value="secondcheck"
            data-ocid="assignlab.secondcheck_tab"
          >
            2nd Check Test Samples
            {pendingSecondCheck.length > 0 && (
              <span className="ml-2 bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5">
                {pendingSecondCheck.length}
              </span>
            )}
          </TabsTrigger>
        </TabsList>

        {/* ── Regular Samples Tab ── */}
        <TabsContent value="regular">
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            {blockedSamples.length === 0 ? (
              <div
                className="py-16 text-center"
                data-ocid="assignlab.samples.empty_state"
              >
                <p className="text-gray-400 text-sm">
                  No blocked samples yet. Samples blocked by purchasers will
                  appear here.
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
                          {"★".repeat(s.starRating)}
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
        </TabsContent>

        {/* ── 2nd Check Test Samples Tab ── */}
        <TabsContent value="secondcheck">
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            {secondCheckLabRequests.length === 0 ? (
              <div
                className="py-16 text-center"
                data-ocid="assignlab.secondcheck.empty_state"
              >
                <p className="text-gray-400 text-sm">
                  No 2nd check samples awaiting lab assignment.
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
                        "Lab 1",
                        "Lab 2",
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
                    {secondCheckLabRequests.map((r, i) => (
                      <tr
                        key={r.id}
                        className="border-b border-gray-100 hover:bg-blue-50"
                        data-ocid={`assignlab.secondcheck.item.${i + 1}`}
                      >
                        <td className="px-3 py-2.5 text-xs text-gray-500">
                          {i + 1}
                        </td>
                        <td className="px-3 py-2.5 text-xs text-gray-700">
                          {r.categoryName}
                        </td>
                        <td className="px-3 py-2.5 text-xs font-medium">
                          {r.brandName}
                        </td>
                        <td className="px-3 py-2.5 text-xs font-mono">
                          {r.modelNumber}
                        </td>
                        <td className="px-3 py-2.5">
                          <StarDisplay rating={r.starRating} />
                        </td>
                        <td className="px-3 py-2.5 text-xs text-gray-500 whitespace-nowrap">
                          {new Date(r.blockedAt).toLocaleDateString("en-IN")}
                        </td>
                        <td className="px-3 py-2.5 text-xs">
                          {r.labAssignment ? (
                            <span className="text-green-700 font-medium">
                              {r.labAssignment.lab1}
                            </span>
                          ) : (
                            <span className="text-gray-400">—</span>
                          )}
                        </td>
                        <td className="px-3 py-2.5 text-xs">
                          {r.labAssignment ? (
                            <span className="text-green-700 font-medium">
                              {r.labAssignment.lab2}
                            </span>
                          ) : (
                            <span className="text-gray-400">—</span>
                          )}
                        </td>
                        <td className="px-3 py-2.5">
                          {r.labAssignment ? (
                            <span className="text-xs px-2 py-0.5 rounded-full bg-green-100 text-green-800 font-medium">
                              Labs Assigned
                            </span>
                          ) : (
                            <span className="text-xs px-2 py-0.5 rounded-full bg-yellow-100 text-yellow-800 font-medium">
                              Pending
                            </span>
                          )}
                        </td>
                        <td className="px-3 py-2.5">
                          {r.labAssignment ? (
                            <span className="text-xs text-gray-400">
                              Completed
                            </span>
                          ) : (
                            <Button
                              data-ocid={`assignlab.secondcheck.assign.button.${i + 1}`}
                              size="sm"
                              className="h-6 text-xs px-2"
                              style={{
                                backgroundColor: "#1a3a6b",
                                color: "white",
                              }}
                              onClick={() => {
                                setSecondCheckAssignTarget(r);
                                setScLab1("");
                                setScLab2("");
                              }}
                            >
                              Assign Labs
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
        </TabsContent>
      </Tabs>

      {/* ── Regular Sample: Assign Lab Dialog ── */}
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
                {assignTarget.brandName} · {assignTarget.modelNumber} ·{" "}
                {assignTarget.categoryName}
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

      {/* ── 2nd Check: Assign Labs Dialog ── */}
      <Dialog
        open={!!secondCheckAssignTarget}
        onOpenChange={(o) => {
          if (!o) {
            setSecondCheckAssignTarget(null);
            setScLab1("");
            setScLab2("");
          }
        }}
      >
        <DialogContent
          data-ocid="assignlab.secondcheck.dialog"
          className="max-w-md"
        >
          <DialogHeader>
            <DialogTitle className="text-base" style={{ color: "#1a3a6b" }}>
              Assign Labs — 2nd Check Test
            </DialogTitle>
            {secondCheckAssignTarget && (
              <p className="text-xs text-gray-500 mt-1">
                {secondCheckAssignTarget.brandName} ·{" "}
                {secondCheckAssignTarget.modelNumber} ·{" "}
                {secondCheckAssignTarget.categoryName}
              </p>
            )}
          </DialogHeader>
          <div className="space-y-4 mt-2">
            <div className="p-3 rounded-lg bg-blue-50 border border-blue-100 text-xs text-blue-700">
              Each of the 2 sample units must be tested by a{" "}
              <strong>different lab</strong>.
            </div>
            <div>
              <Label className="text-xs font-semibold text-gray-700 mb-1 block">
                Lab 1 — Sample 1 <span className="text-red-500">*</span>
              </Label>
              <Select value={scLab1} onValueChange={setScLab1}>
                <SelectTrigger
                  data-ocid="assignlab.secondcheck.lab1.select"
                  className="h-9 text-sm"
                >
                  <SelectValue placeholder="Select Lab for Sample 1" />
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
                Lab 2 — Sample 2 <span className="text-red-500">*</span>
              </Label>
              <Select value={scLab2} onValueChange={setScLab2}>
                <SelectTrigger
                  data-ocid="assignlab.secondcheck.lab2.select"
                  className="h-9 text-sm"
                >
                  <SelectValue placeholder="Select Lab for Sample 2 (different)" />
                </SelectTrigger>
                <SelectContent>
                  {labOptions
                    .filter((l) => l !== scLab1)
                    .map((l) => (
                      <SelectItem key={l} value={l}>
                        {l}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
              {scLab1 && scLab2 && scLab1 === scLab2 && (
                <p className="text-xs text-red-500 mt-1">
                  Labs must be different.
                </p>
              )}
            </div>
          </div>
          <DialogFooter className="mt-5 gap-2">
            <Button
              data-ocid="assignlab.secondcheck.cancel_button"
              variant="outline"
              onClick={() => {
                setSecondCheckAssignTarget(null);
                setScLab1("");
                setScLab2("");
              }}
            >
              Cancel
            </Button>
            <Button
              data-ocid="assignlab.secondcheck.confirm_button"
              style={{ backgroundColor: "#1a3a6b", color: "white" }}
              onClick={handleSecondCheckAssign}
            >
              Assign Labs
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── View Regular Lab Details Dialog ── */}
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
                {viewTarget.brandName} · {viewTarget.modelNumber}
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

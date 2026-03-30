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
import type React from "react";
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
      {"\u2605".repeat(rating)}
      <span className="text-gray-300">{"\u2605".repeat(5 - rating)}</span>
    </span>
  );
}

export default function AssignLabPage() {
  const {
    blockedSamples,
    assignLab,
    secondCheckLabRequests,
    assignSingleSampleLab,
  } = useBlockedSamples();
  const { assignSampleLab } = useSecondCheck();

  // Regular samples state
  const [assignTarget, setAssignTarget] = useState<BlockedSample | null>(null);
  const [viewTarget, setViewTarget] = useState<BlockedSample | null>(null);
  const [form, setForm] = useState(emptyForm());

  // 2nd Check per-sample assign state
  const [scAssignTarget, setScAssignTarget] =
    useState<SecondCheckLabRequest | null>(null);
  const [scLabName, setScLabName] = useState("");

  const pendingSecondCheck = secondCheckLabRequests.filter((r) => !r.labName);

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
    if (!scAssignTarget) return;
    if (!scLabName) {
      toast.error("Please select a lab.");
      return;
    }
    // Update BlockedSamplesContext
    assignSingleSampleLab(scAssignTarget.id, scLabName);
    // Update SecondCheckContext
    assignSampleLab(
      scAssignTarget.caseId,
      scAssignTarget.sampleNumber,
      scLabName,
    );
    toast.success(
      `Lab assigned to Sample ${scAssignTarget.sampleNumber}: ${scLabName}. Purchaser notified.`,
    );
    setScAssignTarget(null);
    setScLabName("");
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
          <TabsTrigger value="regular" data-ocid="assignlab.regular.tab">
            Regular Samples
            {blockedSamples.filter((s) => !s.labAssignment).length > 0 && (
              <span className="ml-2 bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5">
                {blockedSamples.filter((s) => !s.labAssignment).length}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger
            value="secondcheck"
            data-ocid="assignlab.secondcheck.tab"
          >
            2nd Check Test Samples
            {pendingSecondCheck.length > 0 && (
              <span className="ml-2 bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5">
                {pendingSecondCheck.length}
              </span>
            )}
          </TabsTrigger>
        </TabsList>

        {/* \u2500\u2500 Regular Samples Tab \u2500\u2500 */}
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
        </TabsContent>

        {/* \u2500\u2500 2nd Check Test Samples Tab \u2500\u2500 */}
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
                        "Sample",
                        "Blocked On",
                        "Assigned Lab",
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
                        <td className="px-3 py-2.5">
                          <span
                            className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                              r.sampleNumber === 1
                                ? "bg-blue-100 text-blue-800"
                                : "bg-purple-100 text-purple-800"
                            }`}
                          >
                            Sample {r.sampleNumber}
                          </span>
                        </td>
                        <td className="px-3 py-2.5 text-xs text-gray-500 whitespace-nowrap">
                          {new Date(r.blockedAt).toLocaleDateString("en-IN")}
                        </td>
                        <td className="px-3 py-2.5 text-xs">
                          {r.labName ? (
                            <span className="text-green-700 font-medium">
                              {r.labName}
                            </span>
                          ) : (
                            <span className="text-gray-400">\u2014</span>
                          )}
                        </td>
                        <td className="px-3 py-2.5">
                          {r.labName ? (
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
                          {r.labName ? (
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
                                setScAssignTarget(r);
                                setScLabName("");
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
      </Tabs>

      {/* \u2500\u2500 Regular Sample: Assign Lab Dialog \u2500\u2500 */}
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

      {/* \u2500\u2500 2nd Check: Assign Lab per Sample Dialog \u2500\u2500 */}
      <Dialog
        open={!!scAssignTarget}
        onOpenChange={(o) => {
          if (!o) {
            setScAssignTarget(null);
            setScLabName("");
          }
        }}
      >
        <DialogContent
          data-ocid="assignlab.secondcheck.dialog"
          className="max-w-md"
        >
          <DialogHeader>
            <DialogTitle className="text-base" style={{ color: "#1a3a6b" }}>
              Assign Lab \u2014 Sample {scAssignTarget?.sampleNumber ?? ""}
            </DialogTitle>
            {scAssignTarget && (
              <p className="text-xs text-gray-500 mt-1">
                {scAssignTarget.brandName} \u00b7 {scAssignTarget.modelNumber}{" "}
                \u00b7 {scAssignTarget.categoryName}
              </p>
            )}
          </DialogHeader>
          <div className="space-y-4 mt-2">
            <div
              className={`p-3 rounded-lg text-xs font-medium ${
                scAssignTarget?.sampleNumber === 1
                  ? "bg-blue-50 border border-blue-100 text-blue-700"
                  : "bg-purple-50 border border-purple-100 text-purple-700"
              }`}
            >
              Assigning lab independently for{" "}
              <strong>Sample {scAssignTarget?.sampleNumber}</strong> only. The
              other sample can be assigned separately.
            </div>
            <div>
              <Label className="text-xs font-semibold text-gray-700 mb-1 block">
                Select Lab <span className="text-red-500">*</span>
              </Label>
              <Select value={scLabName} onValueChange={setScLabName}>
                <SelectTrigger
                  data-ocid="assignlab.secondcheck.lab.select"
                  className="h-9 text-sm"
                >
                  <SelectValue
                    placeholder={`Select Lab for Sample ${scAssignTarget?.sampleNumber ?? ""}`}
                  />
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
          </div>
          <DialogFooter className="mt-5 gap-2">
            <Button
              data-ocid="assignlab.secondcheck.cancel_button"
              variant="outline"
              onClick={() => {
                setScAssignTarget(null);
                setScLabName("");
              }}
            >
              Cancel
            </Button>
            <Button
              data-ocid="assignlab.secondcheck.confirm_button"
              style={{ backgroundColor: "#1a3a6b", color: "white" }}
              onClick={handleSecondCheckAssign}
            >
              Assign Lab
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* \u2500\u2500 View Regular Lab Details Dialog \u2500\u2500 */}
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

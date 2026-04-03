import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import type { SecondCheckLabRequest } from "../../contexts/BlockedSamplesContext";
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

function StarDisplay({ rating }: { rating: number }) {
  return (
    <span className="text-amber-500 text-xs">
      {"\u2605".repeat(rating)}
      <span className="text-gray-300">{"\u2605".repeat(5 - rating)}</span>
    </span>
  );
}

export default function AssignLabSecondCheckPage() {
  const { secondCheckLabRequests, assignSingleSampleLab } = useBlockedSamples();
  const { assignSampleLab } = useSecondCheck();

  const [scAssignTarget, setScAssignTarget] =
    useState<SecondCheckLabRequest | null>(null);
  const [scLabName, setScLabName] = useState("");

  const handleSecondCheckAssign = () => {
    if (!scAssignTarget) return;
    if (!scLabName) {
      toast.error("Please select a lab.");
      return;
    }
    assignSingleSampleLab(scAssignTarget.id, scLabName);
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
          2nd Check Test \u2014 Assign Lab
        </h2>
        <p className="text-gray-500 text-sm">
          Assign test labs independently for each sample unit in 2nd check test
          cases
        </p>
      </div>

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
                        <span className="text-xs text-gray-400">Completed</span>
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

      {/* Assign Lab Dialog */}
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
                    placeholder={`Select Lab for Sample ${
                      scAssignTarget?.sampleNumber ?? ""
                    }`}
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
    </div>
  );
}

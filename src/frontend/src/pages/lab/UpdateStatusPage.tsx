import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { toast } from "sonner";
import { mockSamples } from "../../data/mockData";

export default function UpdateStatusPage() {
  const [selectedId, setSelectedId] = useState("");
  const [fitStatus, setFitStatus] = useState("");
  const [notFitReason, setNotFitReason] = useState("");
  const [remarks, setRemarks] = useState("");
  const [testDate, setTestDate] = useState("");

  const activeSamples = mockSamples.filter((s) =>
    ["InTransit", "SampleReceived", "FitForTest", "TestScheduled"].includes(
      s.status,
    ),
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedId) {
      toast.error("Please select a sample");
      return;
    }
    if (!fitStatus) {
      toast.error("Please select fit/not fit status");
      return;
    }
    if (fitStatus === "notfit" && !notFitReason) {
      toast.error("Please provide reason for not fit");
      return;
    }
    if (fitStatus === "fit" && !testDate) {
      toast.error("Please schedule test date");
      return;
    }
    const msg =
      fitStatus === "fit"
        ? `Sample status updated. Test scheduled for ${testDate}`
        : "Sample marked as Not Fit for Test";
    toast.success(msg);
    setSelectedId("");
    setFitStatus("");
    setNotFitReason("");
    setRemarks("");
    setTestDate("");
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-bold" style={{ color: "#1a3a6b" }}>
          Update Sample Status
        </h2>
        <p className="text-gray-500 text-sm">
          Update testing status and schedule tests
        </p>
      </div>
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6 max-w-2xl">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <Label className="text-sm font-medium text-gray-700">
              Select Sample *
            </Label>
            <Select value={selectedId} onValueChange={setSelectedId}>
              <SelectTrigger data-ocid="update.sample.select" className="mt-1">
                <SelectValue placeholder="Select a sample" />
              </SelectTrigger>
              <SelectContent>
                {activeSamples.map((s) => (
                  <SelectItem key={s.id} value={String(s.id)}>
                    {s.brandName} {s.modelNumber} - {s.categoryName} ({s.state})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {selectedId && (
            <div>
              <Label className="text-sm font-medium text-gray-700">
                Sample Condition *
              </Label>
              <RadioGroup
                value={fitStatus}
                onValueChange={setFitStatus}
                className="mt-2 space-y-2"
              >
                <div className="flex items-center gap-2 p-3 rounded-lg border border-green-200 bg-green-50">
                  <RadioGroupItem
                    value="fit"
                    id="fit"
                    data-ocid="update.fit.radio"
                  />
                  <Label
                    htmlFor="fit"
                    className="text-sm text-green-800 font-medium cursor-pointer"
                  >
                    ✓ Fit for Test - Sample is in acceptable condition
                  </Label>
                </div>
                <div className="flex items-center gap-2 p-3 rounded-lg border border-red-200 bg-red-50">
                  <RadioGroupItem
                    value="notfit"
                    id="notfit"
                    data-ocid="update.notfit.radio"
                  />
                  <Label
                    htmlFor="notfit"
                    className="text-sm text-red-800 font-medium cursor-pointer"
                  >
                    ✗ Not Fit for Test - Sample has issues
                  </Label>
                </div>
              </RadioGroup>
            </div>
          )}
          {fitStatus === "notfit" && (
            <>
              <div>
                <Label className="text-sm font-medium text-gray-700">
                  Reason for Not Fit *
                </Label>
                <Select value={notFitReason} onValueChange={setNotFitReason}>
                  <SelectTrigger
                    data-ocid="update.notfit_reason.select"
                    className="mt-1"
                  >
                    <SelectValue placeholder="Select reason" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Non-Compliance">
                      Non-Compliance
                    </SelectItem>
                    <SelectItem value="Damaged Sample">
                      Damaged Sample
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-700">
                  Upload Evidence
                </Label>
                <div className="mt-1 border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                  <p className="text-xs text-gray-400 mb-2">
                    Upload photos or documents (PDF/JPG/PNG, max 10MB)
                  </p>
                  <Button
                    data-ocid="update.evidence.upload_button"
                    type="button"
                    variant="outline"
                    size="sm"
                    className="text-xs"
                    onClick={() => toast.info("File upload simulated")}
                  >
                    Choose File
                  </Button>
                </div>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-700">
                  Remarks
                </Label>
                <Textarea
                  data-ocid="update.remarks.textarea"
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  placeholder="Describe the issue in detail..."
                  rows={3}
                  className="mt-1"
                />
              </div>
            </>
          )}
          {fitStatus === "fit" && (
            <div>
              <Label className="text-sm font-medium text-gray-700">
                Schedule Test Date *
              </Label>
              <Input
                data-ocid="update.testdate.input"
                type="date"
                value={testDate}
                onChange={(e) => setTestDate(e.target.value)}
                className="mt-1"
              />
            </div>
          )}
          {selectedId && fitStatus && (
            <Button
              data-ocid="update.submit.submit_button"
              type="submit"
              className="w-full"
              style={{ backgroundColor: "#1a3a6b" }}
            >
              Update Status
            </Button>
          )}
        </form>
      </div>
    </div>
  );
}

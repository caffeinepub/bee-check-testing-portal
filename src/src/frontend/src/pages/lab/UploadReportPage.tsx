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

export default function UploadReportPage() {
  const [selectedId, setSelectedId] = useState("");
  const [result, setResult] = useState("");
  const [testDate, setTestDate] = useState("");
  const [remarks, setRemarks] = useState("");

  const testedSamples = mockSamples.filter((s) =>
    ["TestScheduled", "InTesting", "SampleTested"].includes(s.status),
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedId || !result || !testDate) {
      toast.error("Please fill all required fields");
      return;
    }
    toast.success("Test report submitted to BEE Official for verification!");
    setSelectedId("");
    setResult("");
    setTestDate("");
    setRemarks("");
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-bold" style={{ color: "#1a3a6b" }}>
          Upload Test Report
        </h2>
        <p className="text-gray-500 text-sm">
          Upload test results and submit to BEE Official
        </p>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6 max-w-2xl">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <Label className="text-sm font-medium text-gray-700">
              Select Sample *
            </Label>
            <Select value={selectedId} onValueChange={setSelectedId}>
              <SelectTrigger data-ocid="upload.sample.select" className="mt-1">
                <SelectValue placeholder="Select tested sample" />
              </SelectTrigger>
              <SelectContent>
                {testedSamples.map((s) => (
                  <SelectItem key={s.id} value={String(s.id)}>
                    {s.brandName} {s.modelNumber} - {s.categoryName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="text-sm font-medium text-gray-700">
              Test Result *
            </Label>
            <RadioGroup
              value={result}
              onValueChange={setResult}
              className="mt-2 flex gap-4"
            >
              <div
                className="flex items-center gap-2 p-3 rounded-lg border flex-1 cursor-pointer"
                style={
                  result === "Pass"
                    ? { borderColor: "#16a34a", backgroundColor: "#f0fdf4" }
                    : { borderColor: "#e5e7eb" }
                }
              >
                <RadioGroupItem
                  value="Pass"
                  id="pass"
                  data-ocid="upload.pass.radio"
                />
                <Label
                  htmlFor="pass"
                  className="text-sm font-medium cursor-pointer text-green-700"
                >
                  ✓ Pass
                </Label>
              </div>
              <div
                className="flex items-center gap-2 p-3 rounded-lg border flex-1 cursor-pointer"
                style={
                  result === "Fail"
                    ? { borderColor: "#dc2626", backgroundColor: "#fef2f2" }
                    : { borderColor: "#e5e7eb" }
                }
              >
                <RadioGroupItem
                  value="Fail"
                  id="fail"
                  data-ocid="upload.fail.radio"
                />
                <Label
                  htmlFor="fail"
                  className="text-sm font-medium cursor-pointer text-red-700"
                >
                  ✗ Fail
                </Label>
              </div>
            </RadioGroup>
          </div>

          <div>
            <Label className="text-sm font-medium text-gray-700">
              Test Completion Date *
            </Label>
            <Input
              data-ocid="upload.testdate.input"
              type="date"
              value={testDate}
              onChange={(e) => setTestDate(e.target.value)}
              className="mt-1"
            />
          </div>

          <div>
            <Label className="text-sm font-medium text-gray-700">
              Upload Test Report *
            </Label>
            <div className="mt-1 border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <p className="text-sm text-gray-500 mb-2">
                Upload test report document
              </p>
              <p className="text-xs text-gray-400 mb-3">
                PDF or DOC format, max 20MB
              </p>
              <Button
                data-ocid="upload.report.upload_button"
                type="button"
                variant="outline"
                size="sm"
                onClick={() =>
                  toast.info("File upload simulated - report attached")
                }
              >
                Choose File
              </Button>
            </div>
          </div>

          <div>
            <Label className="text-sm font-medium text-gray-700">
              Remarks / Observations
            </Label>
            <Textarea
              data-ocid="upload.remarks.textarea"
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              placeholder="Add any observations or notes about the test..."
              rows={3}
              className="mt-1"
            />
          </div>

          <Button
            data-ocid="upload.submit.submit_button"
            type="submit"
            className="w-full"
            style={{ backgroundColor: "#1a3a6b" }}
          >
            Submit Report to BEE Official
          </Button>
        </form>
      </div>
    </div>
  );
}

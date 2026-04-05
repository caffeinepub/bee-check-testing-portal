import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { AlertTriangle, CheckCircle2, PlayCircle, Send } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useSecondCheck } from "../../contexts/SecondCheckContext";

export default function SecondCheckInitiationPage() {
  const { failedCases, initiateSecondCheckSelected } = useSecondCheck();
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [selectionMode, setSelectionMode] = useState<"single" | "multiple">(
    "multiple",
  );

  // Cases that have not been dispatched yet
  const pendingCases = failedCases.filter((fc) => !fc.dispatched);
  const dispatchedCases = failedCases.filter((fc) => fc.dispatched);

  const allPendingSelected =
    pendingCases.length > 0 &&
    pendingCases.every((fc) => selectedIds.has(fc.id));

  const toggleSelectAll = () => {
    if (allPendingSelected) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(pendingCases.map((fc) => fc.id)));
    }
  };

  const toggleSelect = (id: string) => {
    if (selectionMode === "single") {
      // In single mode, only one case can be selected at a time
      setSelectedIds(new Set([id]));
      return;
    }
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const handleInitiate = () => {
    if (selectedIds.size === 0) {
      toast.error(
        "Please select at least one case to initiate 2nd Check Test.",
      );
      return;
    }
    initiateSecondCheckSelected(Array.from(selectedIds));
    toast.success(
      `2nd Check Test initiated for ${selectedIds.size} case${selectedIds.size > 1 ? "s" : ""}! Dispatched to all Purchasers.`,
    );
    setSelectedIds(new Set());
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold" style={{ color: "#1a3a6b" }}>
          2nd Check Test Initiation
        </h1>
        <p className="text-sm text-gray-500 mt-0.5">
          Select failed cases to initiate 2nd Check Test and dispatch to
          Purchasers
        </p>
      </div>

      {/* Selection Mode Toggle */}
      <Card className="border-0 shadow-sm">
        <CardContent className="pt-5 pb-4 px-5">
          <div className="flex items-center gap-6">
            <p className="text-sm font-semibold text-gray-700">
              Selection Mode:
            </p>
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="selectionMode"
                  value="single"
                  checked={selectionMode === "single"}
                  onChange={() => {
                    setSelectionMode("single");
                    // Keep only first selected if any
                    if (selectedIds.size > 1) {
                      const first = Array.from(selectedIds)[0];
                      setSelectedIds(new Set([first]));
                    }
                  }}
                  className="accent-blue-700"
                />
                <span className="text-sm text-gray-700">Single Case</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="selectionMode"
                  value="multiple"
                  checked={selectionMode === "multiple"}
                  onChange={() => setSelectionMode("multiple")}
                  className="accent-blue-700"
                />
                <span className="text-sm text-gray-700">Multiple Cases</span>
              </label>
            </div>
            {selectedIds.size > 0 && (
              <span className="ml-auto text-sm font-semibold text-blue-700">
                {selectedIds.size} case{selectedIds.size > 1 ? "s" : ""}{" "}
                selected
              </span>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Pending Cases Table */}
      {pendingCases.length > 0 && (
        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-3 border-b border-gray-100 flex flex-row items-center justify-between">
            <CardTitle
              className="text-base font-semibold flex items-center gap-2"
              style={{ color: "#1a3a6b" }}
            >
              <AlertTriangle size={18} className="text-red-500" />
              Pending Cases — Select to Initiate ({pendingCases.length})
            </CardTitle>
            <Button
              data-ocid="initiation.initiate_button"
              onClick={handleInitiate}
              disabled={selectedIds.size === 0}
              className="flex items-center gap-2 px-5 py-2 text-white font-semibold text-sm"
              style={{
                background:
                  selectedIds.size === 0
                    ? undefined
                    : "linear-gradient(135deg, #1a3a6b 0%, #2563eb 100%)",
              }}
            >
              <PlayCircle size={16} />
              Initiate 2nd Check Test
              {selectedIds.size > 0 && (
                <span className="ml-1 bg-white/30 text-white rounded-full px-1.5 text-xs font-bold">
                  {selectedIds.size}
                </span>
              )}
            </Button>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead className="w-10">
                    {selectionMode === "multiple" && (
                      <Checkbox
                        checked={allPendingSelected}
                        onCheckedChange={toggleSelectAll}
                        data-ocid="initiation.select_all"
                        aria-label="Select all"
                      />
                    )}
                  </TableHead>
                  <TableHead className="w-10">#</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Brand</TableHead>
                  <TableHead>Model</TableHead>
                  <TableHead>Test Lab</TableHead>
                  <TableHead>State</TableHead>
                  <TableHead>Fail Date</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pendingCases.map((fc, idx) => {
                  const isSelected = selectedIds.has(fc.id);
                  return (
                    <TableRow
                      key={fc.id}
                      data-ocid={`initiation.item.${idx + 1}`}
                      className={`cursor-pointer transition-colors ${
                        isSelected ? "bg-blue-50" : "hover:bg-gray-50"
                      }`}
                      onClick={() => toggleSelect(fc.id)}
                    >
                      <TableCell onClick={(e) => e.stopPropagation()}>
                        <Checkbox
                          checked={isSelected}
                          onCheckedChange={() => toggleSelect(fc.id)}
                          aria-label={`Select ${fc.brandName} ${fc.modelNumber}`}
                        />
                      </TableCell>
                      <TableCell className="text-gray-500 text-xs">
                        {idx + 1}
                      </TableCell>
                      <TableCell className="font-medium">
                        {fc.category}
                      </TableCell>
                      <TableCell>{fc.brandName}</TableCell>
                      <TableCell className="text-xs font-mono text-gray-600">
                        {fc.modelNumber}
                      </TableCell>
                      <TableCell className="text-xs">{fc.testLab}</TableCell>
                      <TableCell className="text-xs">{fc.state}</TableCell>
                      <TableCell className="text-xs">{fc.failDate}</TableCell>
                      <TableCell>
                        <Badge className="bg-red-100 text-red-700 border-red-200 text-xs">
                          Pending 2nd Check
                        </Badge>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {/* Dispatched Cases Table */}
      {dispatchedCases.length > 0 && (
        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-3 border-b border-gray-100">
            <CardTitle
              className="text-base font-semibold flex items-center gap-2"
              style={{ color: "#1a3a6b" }}
            >
              <Send size={18} className="text-green-600" />
              Already Dispatched ({dispatchedCases.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead className="w-10">#</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Brand</TableHead>
                  <TableHead>Model</TableHead>
                  <TableHead>Test Lab</TableHead>
                  <TableHead>State</TableHead>
                  <TableHead>Fail Date</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {dispatchedCases.map((fc, idx) => (
                  <TableRow
                    key={fc.id}
                    data-ocid={`dispatched.item.${idx + 1}`}
                  >
                    <TableCell className="text-gray-500 text-xs">
                      {idx + 1}
                    </TableCell>
                    <TableCell className="font-medium">{fc.category}</TableCell>
                    <TableCell>{fc.brandName}</TableCell>
                    <TableCell className="text-xs font-mono text-gray-600">
                      {fc.modelNumber}
                    </TableCell>
                    <TableCell className="text-xs">{fc.testLab}</TableCell>
                    <TableCell className="text-xs">{fc.state}</TableCell>
                    <TableCell className="text-xs">{fc.failDate}</TableCell>
                    <TableCell>
                      <Badge className="bg-green-100 text-green-700 border-green-200 text-xs">
                        <CheckCircle2 size={11} className="mr-1" />
                        Dispatched to Purchasers
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {pendingCases.length === 0 && dispatchedCases.length === 0 && (
        <div className="text-center py-20 text-gray-400">
          <AlertTriangle size={48} className="mx-auto mb-4 opacity-20" />
          <p className="font-medium text-lg">No failed cases available</p>
          <p className="text-sm mt-1">
            Failed cases will appear here automatically after test results are
            submitted.
          </p>
        </div>
      )}
    </div>
  );
}

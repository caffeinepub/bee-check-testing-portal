import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CheckCircle2, FlaskConical, Lock } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useSecondCheck } from "../../contexts/SecondCheckContext";

const LAB_OPTIONS = [
  "NABL Lab Delhi",
  "ERTL Mumbai",
  "CPRI Bangalore",
  "NABL Lab Hyderabad",
  "BIS Lab Chennai",
  "ETDC Ahmedabad",
  "CIRT Pune",
];

const STATUS_COLORS: Record<string, string> = {
  InTransit: "bg-blue-100 text-blue-700 border-blue-200",
  ReachedLab: "bg-orange-100 text-orange-700 border-orange-200",
  ProposedDate: "bg-yellow-100 text-yellow-700 border-yellow-200",
  TestScheduled: "bg-indigo-100 text-indigo-700 border-indigo-200",
  UnderTesting: "bg-purple-100 text-purple-700 border-purple-200",
  TestDone: "bg-teal-100 text-teal-700 border-teal-200",
  ReportUploaded: "bg-cyan-100 text-cyan-700 border-cyan-200",
  InvoiceRaised: "bg-green-100 text-green-700 border-green-200",
  NFT: "bg-red-100 text-red-700 border-red-200",
};

export default function SecondCheckTestPage() {
  const {
    secondCheckRequests,
    secondCheckInitiated,
    submitSecondCheckBlock,
    secondCheckSamples,
  } = useSecondCheck();
  const [blockDialog, setBlockDialog] = useState<{
    open: boolean;
    caseId: string;
    brand: string;
    model: string;
  }>({ open: false, caseId: "", brand: "", model: "" });
  const [lab1, setLab1] = useState("");
  const [lab2, setLab2] = useState("");

  const blockedCaseIds = new Set(secondCheckSamples.map((s) => s.caseId));

  const handleBlock = () => {
    if (!lab1 || !lab2) {
      toast.error("Please assign both Test Labs.");
      return;
    }
    if (lab1 === lab2) {
      toast.error("Both samples must be assigned to different Test Labs.");
      return;
    }
    submitSecondCheckBlock(blockDialog.caseId, lab1, lab2);
    toast.success(
      `2 samples blocked for 2nd check testing. Assigned to ${lab1} and ${lab2}.`,
    );
    setBlockDialog({ open: false, caseId: "", brand: "", model: "" });
    setLab1("");
    setLab2("");
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold" style={{ color: "#1a3a6b" }}>
          2nd Check Test
        </h1>
        <p className="text-sm text-gray-500 mt-0.5">
          Block products for secondary compliance testing and track their
          progress
        </p>
      </div>

      <Tabs defaultValue="pending">
        <TabsList className="mb-4">
          <TabsTrigger value="pending" data-ocid="second_check.pending_tab">
            Pending Requests
          </TabsTrigger>
          <TabsTrigger
            value="mysamples"
            data-ocid="second_check.my_samples_tab"
          >
            My 2nd Check Samples
          </TabsTrigger>
        </TabsList>

        {/* Pending Requests */}
        <TabsContent value="pending">
          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-3 border-b border-gray-100">
              <CardTitle
                className="text-base font-semibold"
                style={{ color: "#1a3a6b" }}
              >
                Cases Dispatched by Compliance Officer
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {!secondCheckInitiated ? (
                <div
                  className="text-center py-16 text-gray-400"
                  data-ocid="second_check.pending.empty_state"
                >
                  <FlaskConical size={40} className="mx-auto mb-3 opacity-30" />
                  <p className="font-medium">No 2nd check requests yet</p>
                  <p className="text-sm mt-1">
                    The Compliance Officer has not yet initiated 2nd Check
                    Testing.
                  </p>
                </div>
              ) : secondCheckRequests.length === 0 ? (
                <div
                  className="text-center py-16 text-gray-400"
                  data-ocid="second_check.pending.empty_state"
                >
                  <CheckCircle2 size={40} className="mx-auto mb-3 opacity-30" />
                  <p className="font-medium">All cases have been blocked</p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-50">
                      <TableHead className="w-10">#</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Brand</TableHead>
                      <TableHead>Model</TableHead>
                      <TableHead>State</TableHead>
                      <TableHead>Fail Date</TableHead>
                      <TableHead>Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {secondCheckRequests.map((req, idx) => (
                      <TableRow
                        key={req.id}
                        data-ocid={`second_check.pending.item.${idx + 1}`}
                      >
                        <TableCell className="text-gray-500 text-xs">
                          {idx + 1}
                        </TableCell>
                        <TableCell className="font-medium">
                          {req.category}
                        </TableCell>
                        <TableCell>{req.brandName}</TableCell>
                        <TableCell className="text-xs font-mono">
                          {req.modelNumber}
                        </TableCell>
                        <TableCell className="text-xs">{req.state}</TableCell>
                        <TableCell className="text-xs">
                          {req.failDate}
                        </TableCell>
                        <TableCell>
                          {blockedCaseIds.has(req.id) ? (
                            <Badge className="bg-green-100 text-green-700 border-green-200 text-xs">
                              <CheckCircle2 size={12} className="mr-1" />{" "}
                              Blocked
                            </Badge>
                          ) : (
                            <Button
                              size="sm"
                              data-ocid={`second_check.block_button.${idx + 1}`}
                              className="text-xs"
                              style={{ backgroundColor: "#1a3a6b" }}
                              onClick={() =>
                                setBlockDialog({
                                  open: true,
                                  caseId: req.id,
                                  brand: req.brandName,
                                  model: req.modelNumber,
                                })
                              }
                            >
                              <Lock size={13} className="mr-1" />
                              Block for 2nd Check
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* My 2nd Check Samples */}
        <TabsContent value="mysamples">
          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-3 border-b border-gray-100">
              <CardTitle
                className="text-base font-semibold"
                style={{ color: "#1a3a6b" }}
              >
                My 2nd Check Samples
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {secondCheckSamples.length === 0 ? (
                <div
                  className="text-center py-16 text-gray-400"
                  data-ocid="second_check.my_samples.empty_state"
                >
                  <FlaskConical size={40} className="mx-auto mb-3 opacity-30" />
                  <p className="font-medium">No samples blocked yet</p>
                  <p className="text-sm mt-1">
                    Block a product from Pending Requests to start.
                  </p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-50">
                      <TableHead className="w-10">#</TableHead>
                      <TableHead>Brand</TableHead>
                      <TableHead>Model</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Lab 1</TableHead>
                      <TableHead>Lab 2</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Blocked On</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {secondCheckSamples.map((s, idx) => (
                      <TableRow
                        key={s.id}
                        data-ocid={`second_check.my_samples.item.${idx + 1}`}
                      >
                        <TableCell className="text-gray-500 text-xs">
                          {idx + 1}
                        </TableCell>
                        <TableCell className="font-medium">
                          {s.brandName}
                        </TableCell>
                        <TableCell className="text-xs font-mono">
                          {s.modelNumber}
                        </TableCell>
                        <TableCell className="text-xs">{s.category}</TableCell>
                        <TableCell className="text-xs">{s.lab1Name}</TableCell>
                        <TableCell className="text-xs">{s.lab2Name}</TableCell>
                        <TableCell>
                          <Badge
                            className={`text-xs ${STATUS_COLORS[s.status] ?? ""}`}
                          >
                            {s.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-xs">{s.blockedOn}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Block Dialog */}
      <Dialog
        open={blockDialog.open}
        onOpenChange={(o) =>
          !o &&
          setBlockDialog({ open: false, caseId: "", brand: "", model: "" })
        }
      >
        <DialogContent data-ocid="second_check.dialog">
          <DialogHeader>
            <DialogTitle>Block for 2nd Check Test</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="p-3 rounded-lg bg-blue-50 text-sm">
              <p className="font-medium text-blue-800">
                {blockDialog.brand} — {blockDialog.model}
              </p>
              <p className="text-blue-600 text-xs mt-0.5">
                2 sample units required, each tested by a different lab
              </p>
            </div>
            <div className="flex items-center justify-between p-2 rounded border border-gray-200 bg-gray-50">
              <span className="text-sm text-gray-600">Quantity</span>
              <span className="font-bold text-gray-800 bg-white px-3 py-1 rounded border text-sm">
                2 Units (Fixed)
              </span>
            </div>
            <div className="space-y-2">
              <Label>
                Lab 1 Assignment <span className="text-red-500">*</span>
              </Label>
              <Select onValueChange={setLab1} value={lab1}>
                <SelectTrigger data-ocid="second_check.lab1_select">
                  <SelectValue placeholder="Select Test Lab 1" />
                </SelectTrigger>
                <SelectContent>
                  {LAB_OPTIONS.map((lab) => (
                    <SelectItem key={lab} value={lab}>
                      {lab}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>
                Lab 2 Assignment <span className="text-red-500">*</span>
              </Label>
              <Select onValueChange={setLab2} value={lab2}>
                <SelectTrigger data-ocid="second_check.lab2_select">
                  <SelectValue placeholder="Select Test Lab 2 (must be different)" />
                </SelectTrigger>
                <SelectContent>
                  {LAB_OPTIONS.filter((l) => l !== lab1).map((lab) => (
                    <SelectItem key={lab} value={lab}>
                      {lab}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {lab1 && lab2 && lab1 === lab2 && (
                <p
                  className="text-xs text-red-500"
                  data-ocid="second_check.lab_error"
                >
                  Both labs must be different.
                </p>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              data-ocid="second_check.cancel_button"
              onClick={() =>
                setBlockDialog({
                  open: false,
                  caseId: "",
                  brand: "",
                  model: "",
                })
              }
            >
              Cancel
            </Button>
            <Button
              data-ocid="second_check.submit_button"
              style={{ backgroundColor: "#1a3a6b" }}
              className="text-white"
              onClick={handleBlock}
            >
              Submit &amp; Block 2 Samples
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

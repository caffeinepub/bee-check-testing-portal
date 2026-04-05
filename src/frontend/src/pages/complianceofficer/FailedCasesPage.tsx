import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { AlertTriangle } from "lucide-react";
import { useSecondCheck } from "../../contexts/SecondCheckContext";

export default function FailedCasesPage() {
  const { failedCases } = useSecondCheck();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold" style={{ color: "#1a3a6b" }}>
          Failed Cases
        </h1>
        <p className="text-sm text-gray-500 mt-0.5">
          All test cases that have failed and are pending 2nd Check Test
          initiation
        </p>
      </div>

      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-3 border-b border-gray-100">
          <CardTitle
            className="text-base font-semibold flex items-center gap-2"
            style={{ color: "#1a3a6b" }}
          >
            <AlertTriangle size={18} className="text-red-500" />
            Failed Test Cases ({failedCases.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {failedCases.length === 0 ? (
            <div className="text-center py-16 text-gray-400">
              <AlertTriangle size={40} className="mx-auto mb-3 opacity-30" />
              <p className="font-medium">No failed cases</p>
              <p className="text-sm mt-1">
                All test cases have passed or are still in progress.
              </p>
            </div>
          ) : (
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
                {failedCases.map((fc, idx) => (
                  <TableRow
                    key={fc.id}
                    data-ocid={`failedcases.item.${idx + 1}`}
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
                      {fc.dispatched ? (
                        <Badge className="bg-green-100 text-green-700 border-green-200 text-xs">
                          Dispatched to Purchasers
                        </Badge>
                      ) : (
                        <Badge className="bg-red-100 text-red-700 border-red-200 text-xs">
                          Pending 2nd Check
                        </Badge>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

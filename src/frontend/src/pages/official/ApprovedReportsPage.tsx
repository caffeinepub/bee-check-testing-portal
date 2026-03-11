import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { mockReports } from "../../data/mockData";

export default function ApprovedReportsPage() {
  const approved = mockReports.filter((r) => r.reviewStatus === "Approved");
  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-bold" style={{ color: "#1a3a6b" }}>
          Approved Reports
        </h2>
        <p className="text-gray-500 text-sm">
          Reports approved and forwarded to Director
        </p>
      </div>
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow style={{ backgroundColor: "#1a3a6b" }}>
              {[
                "#",
                "Category",
                "Brand",
                "Model",
                "Lab",
                "State",
                "Result",
                "Submitted",
                "Remarks",
              ].map((h) => (
                <TableHead key={h} className="text-white text-xs">
                  {h}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {approved.map((r, i) => (
              <TableRow
                key={r.id}
                data-ocid={`approved.row.${i + 1}`}
                className="hover:bg-green-50"
              >
                <TableCell className="text-xs">{i + 1}</TableCell>
                <TableCell className="text-xs">{r.categoryName}</TableCell>
                <TableCell className="text-xs font-medium">
                  {r.brandName}
                </TableCell>
                <TableCell className="text-xs font-mono">
                  {r.modelNumber}
                </TableCell>
                <TableCell className="text-xs">{r.labName}</TableCell>
                <TableCell className="text-xs">{r.state}</TableCell>
                <TableCell>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-green-100 text-green-800 font-medium">
                    {r.result}
                  </span>
                </TableCell>
                <TableCell className="text-xs">{r.submittedAt}</TableCell>
                <TableCell className="text-xs text-gray-500">
                  {r.reviewRemarks || "-"}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {approved.length === 0 && (
          <div className="py-8 text-center text-gray-400 text-sm">
            No approved reports
          </div>
        )}
      </div>
    </div>
  );
}

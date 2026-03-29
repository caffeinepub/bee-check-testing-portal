import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { mockReports } from "../../data/mockData";

export default function RejectedReportsPage() {
  const rejected = mockReports.filter(
    (r) => r.reviewStatus === "Rejected" || r.reviewStatus === "Reverted",
  );
  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-bold" style={{ color: "#1a3a6b" }}>
          Rejected / Reverted Reports
        </h2>
        <p className="text-gray-500 text-sm">
          Reports rejected or reverted to laboratory
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
                "Status",
                "Remarks",
              ].map((h) => (
                <TableHead key={h} className="text-white text-xs">
                  {h}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {rejected.map((r, i) => (
              <TableRow
                key={r.id}
                data-ocid={`rejected.row.${i + 1}`}
                className="hover:bg-red-50"
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
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full font-medium ${r.result === "Pass" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}
                  >
                    {r.result}
                  </span>
                </TableCell>
                <TableCell>
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full font-medium ${r.reviewStatus === "Rejected" ? "bg-red-100 text-red-700" : "bg-orange-100 text-orange-700"}`}
                  >
                    {r.reviewStatus}
                  </span>
                </TableCell>
                <TableCell className="text-xs text-gray-500">
                  {r.reviewRemarks || "-"}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {rejected.length === 0 && (
          <div className="py-8 text-center text-gray-400 text-sm">
            No rejected reports
          </div>
        )}
      </div>
    </div>
  );
}

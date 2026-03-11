import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useState } from "react";
import { mockFinancials } from "../../data/mockData";

export default function FinancialMonitoringPage() {
  const [selectedState, setSelectedState] = useState<string | null>(null);
  const selected = mockFinancials.find((f) => f.state === selectedState);
  const fmt = (n: number) => `\u20b9${(n / 100000).toFixed(1)}L`;

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-bold" style={{ color: "#1a3a6b" }}>
          State Financial Monitoring
        </h2>
        <p className="text-gray-500 text-sm">
          State-wise fund allocation and instalment details
        </p>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow style={{ backgroundColor: "#1a3a6b" }}>
                {[
                  "State",
                  "Total Approved",
                  "Released",
                  "Balance",
                  "Status",
                ].map((h) => (
                  <TableHead key={h} className="text-white text-xs">
                    {h}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockFinancials.map((f, i) => (
                <TableRow
                  key={f.state}
                  data-ocid={`financial.row.${i + 1}`}
                  className={`hover:bg-blue-50 cursor-pointer ${selectedState === f.state ? "bg-blue-50" : ""}`}
                  onClick={() =>
                    setSelectedState(f.state === selectedState ? null : f.state)
                  }
                >
                  <TableCell className="text-sm font-medium text-blue-600 hover:underline">
                    {f.state}
                  </TableCell>
                  <TableCell className="text-sm">
                    {fmt(f.totalApproved)}
                  </TableCell>
                  <TableCell className="text-sm text-green-700">
                    {fmt(f.released)}
                  </TableCell>
                  <TableCell className="text-sm text-orange-600">
                    {fmt(f.balance)}
                  </TableCell>
                  <TableCell>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-green-100 text-green-800">
                      Active
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        {selected ? (
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
            <div
              className="px-4 py-3 border-b"
              style={{ backgroundColor: "#1a3a6b" }}
            >
              <h3 className="text-white font-semibold text-sm">
                {selected.state} - Instalment Breakdown
              </h3>
            </div>
            <Table>
              <TableHeader>
                <TableRow className="bg-blue-50">
                  {["Inst. No.", "Amount", "Release Date", "Status"].map(
                    (h) => (
                      <TableHead key={h} className="text-gray-700 text-xs">
                        {h}
                      </TableHead>
                    ),
                  )}
                </TableRow>
              </TableHeader>
              <TableBody>
                {selected.instalments.map((inst) => (
                  <TableRow
                    key={inst.no}
                    data-ocid={`financial.instalment.row.${inst.no}`}
                  >
                    <TableCell className="text-sm">
                      Instalment {inst.no}
                    </TableCell>
                    <TableCell className="text-sm font-medium">
                      {fmt(inst.amount)}
                    </TableCell>
                    <TableCell className="text-sm">{inst.date}</TableCell>
                    <TableCell>
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full font-medium ${inst.status === "Released" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}`}
                      >
                        {inst.status}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <div className="p-3 bg-blue-50 border-t">
              <div className="flex justify-between text-xs">
                <span className="text-gray-600">
                  Total Approved: <strong>{fmt(selected.totalApproved)}</strong>
                </span>
                <span className="text-green-700">
                  Released: <strong>{fmt(selected.released)}</strong>
                </span>
                <span className="text-orange-600">
                  Balance: <strong>{fmt(selected.balance)}</strong>
                </span>
              </div>
            </div>
          </div>
        ) : (
          <div
            className="bg-white rounded-lg border border-gray-200 shadow-sm flex items-center justify-center"
            style={{ minHeight: 200 }}
          >
            <p className="text-gray-400 text-sm">
              Click on a state to view instalment breakdown
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
    <div className="flex flex-col items-center justify-center min-h-[70vh] w-full">
      <div className="w-full max-w-3xl">
        <div className="mb-6 text-center">
          <h2 className="text-xl font-bold" style={{ color: "#1a3a6b" }}>
            State Financial Monitoring
          </h2>
          <p className="text-gray-500 text-sm">
            State-wise fund allocation and instalment details
          </p>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow style={{ backgroundColor: "#1a3a6b" }}>
                {["State", "Total Approved", "Released", "Balance"].map((h) => (
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
                  className="hover:bg-blue-50 cursor-pointer"
                  onClick={() => setSelectedState(f.state)}
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
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Instalment Breakdown Popup */}
      <Dialog open={!!selected} onOpenChange={() => setSelectedState(null)}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle style={{ color: "#1a3a6b" }}>
              {selected?.state} - Instalment Breakdown
            </DialogTitle>
          </DialogHeader>
          {selected && (
            <>
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
                          className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                            inst.status === "Released"
                              ? "bg-green-100 text-green-800"
                              : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {inst.status}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <div className="flex justify-between text-xs p-3 bg-blue-50 rounded-md mt-2">
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
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

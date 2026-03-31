import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
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
import { useState } from "react";

const INDIAN_STATES = [
  "All States",
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chhattisgarh",
  "Delhi",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
];

const fmt = (n: number) =>
  `₹${n.toLocaleString("en-IN", { maximumFractionDigits: 0 })}`;

function statusBadge(status: string) {
  if (status === "Paid" || status === "Active" || status === "Completed")
    return (
      <Badge className="bg-green-100 text-green-700 border-green-200 hover:bg-green-100">
        {status}
      </Badge>
    );
  if (
    status === "Pending" ||
    status === "Under Review" ||
    status === "In Progress"
  )
    return (
      <Badge className="bg-yellow-100 text-yellow-700 border-yellow-200 hover:bg-yellow-100">
        {status}
      </Badge>
    );
  return (
    <Badge className="bg-red-100 text-red-700 border-red-200 hover:bg-red-100">
      {status}
    </Badge>
  );
}

// ─── Summary ──────────────────────────────────────────────────────────────────
const installmentLabel = (n: number) => {
  const suffixes = ["", "1st", "2nd", "3rd", "4th", "5th", "6th"];
  return suffixes[n] ?? `${n}th`;
};

interface SummaryRow {
  state: string;
  fy: string;
  installment: number;
  openingBalance: number;
  sanctionNumber: string;
  sanctionAmount: number;
  sanctionDate: string;
  expenditureAmount: number;
  soe: number;
  ucVsSoe: number;
  closingBalance: number;
  remarks: string;
}

const allSummaryData: SummaryRow[] = [
  // Rajasthan
  {
    state: "Rajasthan",
    fy: "2022-23",
    installment: 1,
    openingBalance: 0,
    sanctionNumber: "BEE/RAJ/2022/001",
    sanctionAmount: 6000000,
    sanctionDate: "12 Apr 2022",
    expenditureAmount: 4200000,
    soe: 4100000,
    ucVsSoe: 4000000,
    closingBalance: 1800000,
    remarks: "Utilised for AC testing",
  },
  {
    state: "Rajasthan",
    fy: "2023-24",
    installment: 2,
    openingBalance: 1800000,
    sanctionNumber: "BEE/RAJ/2023/002",
    sanctionAmount: 7500000,
    sanctionDate: "05 May 2023",
    expenditureAmount: 5800000,
    soe: 5700000,
    ucVsSoe: 5600000,
    closingBalance: 3500000,
    remarks: "Refrigerator & LED testing",
  },
  {
    state: "Rajasthan",
    fy: "2024-25",
    installment: 3,
    openingBalance: 3500000,
    sanctionNumber: "BEE/RAJ/2024/003",
    sanctionAmount: 5000000,
    sanctionDate: "10 Apr 2024",
    expenditureAmount: 3200000,
    soe: 3100000,
    ucVsSoe: 3050000,
    closingBalance: 5300000,
    remarks: "Fan & washing machine",
  },
  // Maharashtra
  {
    state: "Maharashtra",
    fy: "2022-23",
    installment: 1,
    openingBalance: 0,
    sanctionNumber: "BEE/MAH/2022/001",
    sanctionAmount: 8000000,
    sanctionDate: "15 Apr 2022",
    expenditureAmount: 6100000,
    soe: 6000000,
    ucVsSoe: 5900000,
    closingBalance: 1900000,
    remarks: "Appliance testing Q1-Q4",
  },
  {
    state: "Maharashtra",
    fy: "2023-24",
    installment: 2,
    openingBalance: 1900000,
    sanctionNumber: "BEE/MAH/2023/002",
    sanctionAmount: 9000000,
    sanctionDate: "01 Jun 2023",
    expenditureAmount: 7200000,
    soe: 7100000,
    ucVsSoe: 7000000,
    closingBalance: 3700000,
    remarks: "Lab expansion & testing",
  },
  {
    state: "Maharashtra",
    fy: "2024-25",
    installment: 3,
    openingBalance: 3700000,
    sanctionNumber: "BEE/MAH/2024/003",
    sanctionAmount: 5000000,
    sanctionDate: "20 Apr 2024",
    expenditureAmount: 3500000,
    soe: 3400000,
    ucVsSoe: 3300000,
    closingBalance: 5200000,
    remarks: "LED & AC programme",
  },
  // Delhi
  {
    state: "Delhi",
    fy: "2022-23",
    installment: 1,
    openingBalance: 0,
    sanctionNumber: "BEE/DEL/2022/001",
    sanctionAmount: 5000000,
    sanctionDate: "18 Apr 2022",
    expenditureAmount: 3800000,
    soe: 3750000,
    ucVsSoe: 3700000,
    closingBalance: 1200000,
    remarks: "Metropolitan pilot batch",
  },
  {
    state: "Delhi",
    fy: "2023-24",
    installment: 2,
    openingBalance: 1200000,
    sanctionNumber: "BEE/DEL/2023/002",
    sanctionAmount: 6000000,
    sanctionDate: "10 May 2023",
    expenditureAmount: 4900000,
    soe: 4850000,
    ucVsSoe: 4800000,
    closingBalance: 2300000,
    remarks: "Commercial AC focus",
  },
  {
    state: "Delhi",
    fy: "2024-25",
    installment: 3,
    openingBalance: 2300000,
    sanctionNumber: "BEE/DEL/2024/003",
    sanctionAmount: 4000000,
    sanctionDate: "08 Apr 2024",
    expenditureAmount: 2600000,
    soe: 2550000,
    ucVsSoe: 2500000,
    closingBalance: 3700000,
    remarks: "On track",
  },
  // Uttar Pradesh
  {
    state: "Uttar Pradesh",
    fy: "2022-23",
    installment: 1,
    openingBalance: 0,
    sanctionNumber: "BEE/UP/2022/001",
    sanctionAmount: 9000000,
    sanctionDate: "22 Apr 2022",
    expenditureAmount: 6500000,
    soe: 6400000,
    ucVsSoe: 6300000,
    closingBalance: 2500000,
    remarks: "Large-scale fan testing",
  },
  {
    state: "Uttar Pradesh",
    fy: "2023-24",
    installment: 2,
    openingBalance: 2500000,
    sanctionNumber: "BEE/UP/2023/002",
    sanctionAmount: 10000000,
    sanctionDate: "15 May 2023",
    expenditureAmount: 8200000,
    soe: 8100000,
    ucVsSoe: 8000000,
    closingBalance: 4300000,
    remarks: "Refrigerator & pump testing",
  },
  {
    state: "Uttar Pradesh",
    fy: "2024-25",
    installment: 3,
    openingBalance: 4300000,
    sanctionNumber: "BEE/UP/2024/003",
    sanctionAmount: 6000000,
    sanctionDate: "03 Apr 2024",
    expenditureAmount: 3800000,
    soe: 3750000,
    ucVsSoe: 3700000,
    closingBalance: 6500000,
    remarks: "Phase 3 ongoing",
  },
  // Gujarat
  {
    state: "Gujarat",
    fy: "2022-23",
    installment: 1,
    openingBalance: 0,
    sanctionNumber: "BEE/GUJ/2022/001",
    sanctionAmount: 7000000,
    sanctionDate: "25 Apr 2022",
    expenditureAmount: 5200000,
    soe: 5100000,
    ucVsSoe: 5000000,
    closingBalance: 1800000,
    remarks: "AC & LED compliance",
  },
  {
    state: "Gujarat",
    fy: "2023-24",
    installment: 2,
    openingBalance: 1800000,
    sanctionNumber: "BEE/GUJ/2023/002",
    sanctionAmount: 8000000,
    sanctionDate: "12 Jun 2023",
    expenditureAmount: 6100000,
    soe: 6050000,
    ucVsSoe: 6000000,
    closingBalance: 3700000,
    remarks: "Pump & motor testing",
  },
  {
    state: "Gujarat",
    fy: "2024-25",
    installment: 3,
    openingBalance: 3700000,
    sanctionNumber: "BEE/GUJ/2024/003",
    sanctionAmount: 4500000,
    sanctionDate: "15 Apr 2024",
    expenditureAmount: 2900000,
    soe: 2850000,
    ucVsSoe: 2800000,
    closingBalance: 5300000,
    remarks: "Industrial category added",
  },
];

function SummaryPage({ selectedState }: { selectedState: string }) {
  const data =
    selectedState === "All States"
      ? allSummaryData
      : allSummaryData.filter((r) => r.state === selectedState);

  const totals = data.reduce(
    (acc, r) => ({
      openingBalance: acc.openingBalance + r.openingBalance,
      sanctionAmount: acc.sanctionAmount + r.sanctionAmount,
      expenditureAmount: acc.expenditureAmount + r.expenditureAmount,
      soe: acc.soe + r.soe,
      ucVsSoe: acc.ucVsSoe + r.ucVsSoe,
      closingBalance: acc.closingBalance + r.closingBalance,
    }),
    {
      openingBalance: 0,
      sanctionAmount: 0,
      expenditureAmount: 0,
      soe: 0,
      ucVsSoe: 0,
      closingBalance: 0,
    },
  );

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold text-gray-700">
            Financial Summary —{" "}
            {selectedState === "All States" ? "All States" : selectedState}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-blue-50">
                  <TableHead className="text-xs font-semibold text-gray-600 whitespace-nowrap">
                    #
                  </TableHead>
                  <TableHead className="text-xs font-semibold text-gray-600 whitespace-nowrap">
                    Financial Year
                  </TableHead>
                  <TableHead className="text-xs font-semibold text-gray-600 whitespace-nowrap">
                    Opening Balance
                  </TableHead>
                  <TableHead className="text-xs font-semibold text-gray-600 whitespace-nowrap">
                    Installment
                  </TableHead>
                  <TableHead className="text-xs font-semibold text-gray-600 whitespace-nowrap">
                    Sanction Number
                  </TableHead>
                  <TableHead className="text-xs font-semibold text-gray-600 whitespace-nowrap">
                    Sanction Amount
                  </TableHead>
                  <TableHead className="text-xs font-semibold text-gray-600 whitespace-nowrap">
                    Sanction Date
                  </TableHead>
                  <TableHead className="text-xs font-semibold text-gray-600 whitespace-nowrap">
                    Expenditure Amount
                  </TableHead>
                  <TableHead className="text-xs font-semibold text-gray-600 whitespace-nowrap">
                    SOE
                  </TableHead>
                  <TableHead className="text-xs font-semibold text-gray-600 whitespace-nowrap">
                    UC vs SOE
                  </TableHead>
                  <TableHead className="text-xs font-semibold text-gray-600 whitespace-nowrap">
                    Closing Balance
                  </TableHead>
                  <TableHead className="text-xs font-semibold text-gray-600 whitespace-nowrap">
                    Remarks
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.map((r, i) => (
                  <TableRow
                    key={`${r.state}-${r.fy}-${r.installment}`}
                    className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}
                  >
                    <TableCell className="text-xs text-gray-500 whitespace-nowrap">
                      {i + 1}
                    </TableCell>
                    <TableCell className="text-xs text-gray-700 whitespace-nowrap">
                      {r.fy}
                    </TableCell>
                    <TableCell className="text-xs text-gray-700 whitespace-nowrap text-right">
                      {fmt(r.openingBalance)}
                    </TableCell>
                    <TableCell className="text-xs whitespace-nowrap">
                      <Badge className="bg-blue-100 text-blue-700 border-blue-200 hover:bg-blue-100 text-xs">
                        {installmentLabel(r.installment)}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-xs text-gray-700 whitespace-nowrap font-mono">
                      {r.sanctionNumber}
                    </TableCell>
                    <TableCell className="text-xs text-gray-700 whitespace-nowrap text-right">
                      {fmt(r.sanctionAmount)}
                    </TableCell>
                    <TableCell className="text-xs text-gray-700 whitespace-nowrap">
                      {r.sanctionDate}
                    </TableCell>
                    <TableCell className="text-xs text-gray-700 whitespace-nowrap text-right">
                      {fmt(r.expenditureAmount)}
                    </TableCell>
                    <TableCell className="text-xs text-gray-700 whitespace-nowrap text-right">
                      {fmt(r.soe)}
                    </TableCell>
                    <TableCell className="text-xs whitespace-nowrap text-right">
                      <span
                        className={
                          r.ucVsSoe >= r.soe
                            ? "text-green-700 font-medium"
                            : "text-red-600 font-medium"
                        }
                      >
                        {fmt(r.ucVsSoe)}
                      </span>
                    </TableCell>
                    <TableCell className="text-xs font-semibold text-blue-800 whitespace-nowrap text-right">
                      {fmt(r.closingBalance)}
                    </TableCell>
                    <TableCell className="text-xs text-gray-500 max-w-[180px]">
                      {r.remarks}
                    </TableCell>
                  </TableRow>
                ))}
                {data.length > 0 && (
                  <TableRow className="bg-blue-50 font-semibold border-t-2 border-blue-200">
                    <TableCell className="text-xs text-gray-700" colSpan={3}>
                      Total
                    </TableCell>
                    <TableCell className="text-xs text-gray-800 whitespace-nowrap text-right">
                      {fmt(totals.openingBalance)}
                    </TableCell>
                    <TableCell />
                    <TableCell />
                    <TableCell className="text-xs text-gray-800 whitespace-nowrap text-right">
                      {fmt(totals.sanctionAmount)}
                    </TableCell>
                    <TableCell />
                    <TableCell className="text-xs text-gray-800 whitespace-nowrap text-right">
                      {fmt(totals.expenditureAmount)}
                    </TableCell>
                    <TableCell className="text-xs text-gray-800 whitespace-nowrap text-right">
                      {fmt(totals.soe)}
                    </TableCell>
                    <TableCell className="text-xs text-gray-800 whitespace-nowrap text-right">
                      {fmt(totals.ucVsSoe)}
                    </TableCell>
                    <TableCell className="text-xs text-blue-800 whitespace-nowrap text-right">
                      {fmt(totals.closingBalance)}
                    </TableCell>
                    <TableCell />
                  </TableRow>
                )}
                {data.length === 0 && (
                  <TableRow>
                    <TableCell
                      colSpan={13}
                      className="text-center text-xs text-gray-400 py-8"
                    >
                      No data available for the selected state.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// ─── Bill Wise Details ────────────────────────────────────────────────────────
const allBillData = [
  {
    no: "BL-2024-001",
    date: "02 Apr 2024",
    state: "Rajasthan",
    desc: "AC Testing Charges Q1",
    amount: 425000,
    status: "Paid",
  },
  {
    no: "BL-2024-002",
    date: "08 Apr 2024",
    state: "Maharashtra",
    desc: "Refrigerator Lab Setup",
    amount: 850000,
    status: "Paid",
  },
  {
    no: "BL-2024-003",
    date: "15 Apr 2024",
    state: "Delhi",
    desc: "LED Bulb Testing — Batch 4",
    amount: 195000,
    status: "Paid",
  },
  {
    no: "BL-2024-004",
    date: "22 Apr 2024",
    state: "Gujarat",
    desc: "Washing Machine Compliance",
    amount: 610000,
    status: "Pending",
  },
  {
    no: "BL-2024-005",
    date: "01 May 2024",
    state: "Uttar Pradesh",
    desc: "Fan Testing Charges",
    amount: 320000,
    status: "Paid",
  },
  {
    no: "BL-2024-006",
    date: "10 May 2024",
    state: "Haryana",
    desc: "Water Heater Inspection",
    amount: 275000,
    status: "Under Review",
  },
  {
    no: "BL-2024-007",
    date: "18 May 2024",
    state: "Tamil Nadu",
    desc: "AC Testing Charges Q2",
    amount: 490000,
    status: "Paid",
  },
  {
    no: "BL-2024-008",
    date: "25 May 2024",
    state: "Karnataka",
    desc: "Microwave Oven Testing",
    amount: 385000,
    status: "Pending",
  },
  {
    no: "BL-2024-009",
    date: "03 Jun 2024",
    state: "West Bengal",
    desc: "Ceiling Fan Batch Testing",
    amount: 210000,
    status: "Paid",
  },
  {
    no: "BL-2024-010",
    date: "12 Jun 2024",
    state: "Madhya Pradesh",
    desc: "Refrigerator Q2 Audit",
    amount: 560000,
    status: "Under Review",
  },
  {
    no: "BL-2024-011",
    date: "20 Jun 2024",
    state: "Rajasthan",
    desc: "Personnel Travel Expenses",
    amount: 145000,
    status: "Paid",
  },
  {
    no: "BL-2024-012",
    date: "28 Jun 2024",
    state: "Delhi",
    desc: "Equipment Calibration Charges",
    amount: 325000,
    status: "Pending",
  },
];

function BillWisePage({ selectedState }: { selectedState: string }) {
  const data =
    selectedState === "All States"
      ? allBillData
      : allBillData.filter((r) => r.state === selectedState);
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-semibold text-gray-700">
          Bill Wise Details
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow className="bg-blue-50">
              {[
                "Bill No",
                "Bill Date",
                "State",
                "Description",
                "Amount (₹)",
                "Status",
              ].map((h) => (
                <TableHead
                  key={h}
                  className="text-xs font-semibold text-gray-600"
                >
                  {h}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((r, i) => (
              <TableRow
                key={r.no}
                className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}
              >
                <TableCell className="text-xs font-mono text-blue-700">
                  {r.no}
                </TableCell>
                <TableCell className="text-xs text-gray-600">
                  {r.date}
                </TableCell>
                <TableCell className="text-xs text-gray-700">
                  {r.state}
                </TableCell>
                <TableCell className="text-xs text-gray-700">
                  {r.desc}
                </TableCell>
                <TableCell className="text-xs font-semibold text-gray-800">
                  {fmt(r.amount)}
                </TableCell>
                <TableCell>{statusBadge(r.status)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

// ─── Appliance Wise ────────────────────────────────────────────────────────────
const allApplianceData = [
  {
    cat: "Air Conditioner",
    units: 142,
    costPerUnit: 12500,
    state: "Rajasthan",
    fy: "2023-24",
  },
  {
    cat: "Refrigerator",
    units: 98,
    costPerUnit: 9800,
    state: "Maharashtra",
    fy: "2023-24",
  },
  {
    cat: "Washing Machine",
    units: 76,
    costPerUnit: 8500,
    state: "Delhi",
    fy: "2023-24",
  },
  {
    cat: "Ceiling Fan",
    units: 210,
    costPerUnit: 3200,
    state: "Uttar Pradesh",
    fy: "2023-24",
  },
  {
    cat: "LED Bulb",
    units: 450,
    costPerUnit: 1800,
    state: "Gujarat",
    fy: "2023-24",
  },
  {
    cat: "Water Heater",
    units: 64,
    costPerUnit: 7200,
    state: "Haryana",
    fy: "2023-24",
  },
  {
    cat: "Microwave Oven",
    units: 48,
    costPerUnit: 6500,
    state: "Tamil Nadu",
    fy: "2023-24",
  },
  {
    cat: "Air Conditioner",
    units: 88,
    costPerUnit: 12500,
    state: "Karnataka",
    fy: "2023-24",
  },
  {
    cat: "Refrigerator",
    units: 62,
    costPerUnit: 9800,
    state: "West Bengal",
    fy: "2023-24",
  },
  {
    cat: "LED Bulb",
    units: 380,
    costPerUnit: 1800,
    state: "Madhya Pradesh",
    fy: "2023-24",
  },
];

function AppliancePage({ selectedState }: { selectedState: string }) {
  const data =
    selectedState === "All States"
      ? allApplianceData
      : allApplianceData.filter((r) => r.state === selectedState);
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-semibold text-gray-700">
          Appliance Wise Expenditure
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow className="bg-blue-50">
              {[
                "#",
                "Appliance Category",
                "Units Tested",
                "Unit Testing Cost",
                "Total Amount",
                "State",
                "Financial Year",
              ].map((h) => (
                <TableHead
                  key={h}
                  className="text-xs font-semibold text-gray-600"
                >
                  {h}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((r, i) => (
              <TableRow
                key={`${r.cat}-${r.state}`}
                className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}
              >
                <TableCell className="text-xs text-gray-500">{i + 1}</TableCell>
                <TableCell className="text-xs font-medium text-gray-800">
                  {r.cat}
                </TableCell>
                <TableCell className="text-xs text-gray-700">
                  {r.units}
                </TableCell>
                <TableCell className="text-xs text-gray-700">
                  {fmt(r.costPerUnit)}
                </TableCell>
                <TableCell className="text-xs font-semibold text-gray-800">
                  {fmt(r.units * r.costPerUnit)}
                </TableCell>
                <TableCell className="text-xs text-gray-700">
                  {r.state}
                </TableCell>
                <TableCell className="text-xs text-gray-600">{r.fy}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

// ─── Expenses Head ─────────────────────────────────────────────────────────────
const expensesData = [
  { head: "Testing Charges", budget: 45000000, expenditure: 32500000 },
  { head: "Lab Setup & Equipment", budget: 15000000, expenditure: 9800000 },
  { head: "Personnel Costs", budget: 8000000, expenditure: 6200000 },
  { head: "Travel & Logistics", budget: 3500000, expenditure: 2800000 },
  { head: "Equipment Calibration", budget: 5000000, expenditure: 3600000 },
  { head: "Miscellaneous", budget: 2500000, expenditure: 1650000 },
];

function ExpensesPage() {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-semibold text-gray-700">
          Expenses Head — Budget vs Utilization
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow className="bg-blue-50">
              {[
                "#",
                "Expense Head",
                "Budget Allocated",
                "Expenditure",
                "Balance",
                "Utilization",
              ].map((h) => (
                <TableHead
                  key={h}
                  className="text-xs font-semibold text-gray-600"
                >
                  {h}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {expensesData.map((r, i) => {
              const pct = Math.round((r.expenditure / r.budget) * 100);
              return (
                <TableRow
                  key={r.head}
                  className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}
                >
                  <TableCell className="text-xs text-gray-500">
                    {i + 1}
                  </TableCell>
                  <TableCell className="text-xs font-medium text-gray-800">
                    {r.head}
                  </TableCell>
                  <TableCell className="text-xs text-gray-700">
                    {fmt(r.budget)}
                  </TableCell>
                  <TableCell className="text-xs text-orange-700 font-medium">
                    {fmt(r.expenditure)}
                  </TableCell>
                  <TableCell className="text-xs text-green-700 font-medium">
                    {fmt(r.budget - r.expenditure)}
                  </TableCell>
                  <TableCell className="text-xs">
                    <div className="flex items-center gap-2">
                      <Progress value={pct} className="h-2 w-20" />
                      <span
                        className={
                          pct > 85
                            ? "text-red-600 font-semibold"
                            : "text-gray-600"
                        }
                      >
                        {pct}%
                      </span>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

// ─── Invoice Data ─────────────────────────────────────────────────────────────
const allInvoiceData = [
  {
    no: "INV-2024-0041",
    vendor: "NABL Test Labs Pvt Ltd",
    date: "05 Apr 2024",
    base: 380000,
    gst: 68400,
    state: "Rajasthan",
    status: "Paid",
  },
  {
    no: "INV-2024-0042",
    vendor: "Centre for Testing & Certification",
    date: "12 Apr 2024",
    base: 520000,
    gst: 93600,
    state: "Maharashtra",
    status: "Paid",
  },
  {
    no: "INV-2024-0043",
    vendor: "National Physical Laboratory",
    date: "19 Apr 2024",
    base: 210000,
    gst: 37800,
    state: "Delhi",
    status: "Pending",
  },
  {
    no: "INV-2024-0044",
    vendor: "BIS Quality Services",
    date: "26 Apr 2024",
    base: 465000,
    gst: 83700,
    state: "Gujarat",
    status: "Paid",
  },
  {
    no: "INV-2024-0045",
    vendor: "ERTL South India",
    date: "03 May 2024",
    base: 295000,
    gst: 53100,
    state: "Tamil Nadu",
    status: "Under Review",
  },
  {
    no: "INV-2024-0046",
    vendor: "CPRI Bangalore",
    date: "10 May 2024",
    base: 440000,
    gst: 79200,
    state: "Karnataka",
    status: "Paid",
  },
  {
    no: "INV-2024-0047",
    vendor: "ETDC Mumbai",
    date: "17 May 2024",
    base: 330000,
    gst: 59400,
    state: "Maharashtra",
    status: "Pending",
  },
  {
    no: "INV-2024-0048",
    vendor: "IIT Kanpur Testing Centre",
    date: "24 May 2024",
    base: 185000,
    gst: 33300,
    state: "Uttar Pradesh",
    status: "Paid",
  },
  {
    no: "INV-2024-0049",
    vendor: "NABL Test Labs Pvt Ltd",
    date: "31 May 2024",
    base: 275000,
    gst: 49500,
    state: "Haryana",
    status: "Paid",
  },
  {
    no: "INV-2024-0050",
    vendor: "West Bengal Testing House",
    date: "07 Jun 2024",
    base: 195000,
    gst: 35100,
    state: "West Bengal",
    status: "Under Review",
  },
];

function InvoicePage({ selectedState }: { selectedState: string }) {
  const data =
    selectedState === "All States"
      ? allInvoiceData
      : allInvoiceData.filter((r) => r.state === selectedState);
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-semibold text-gray-700">
          Invoice Data
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow className="bg-blue-50">
              {[
                "Invoice No",
                "Vendor Name",
                "Date",
                "Base Amount",
                "GST (18%)",
                "Total Amount",
                "State",
                "Status",
              ].map((h) => (
                <TableHead
                  key={h}
                  className="text-xs font-semibold text-gray-600"
                >
                  {h}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((r, i) => (
              <TableRow
                key={r.no}
                className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}
              >
                <TableCell className="text-xs font-mono text-blue-700">
                  {r.no}
                </TableCell>
                <TableCell className="text-xs text-gray-700">
                  {r.vendor}
                </TableCell>
                <TableCell className="text-xs text-gray-600">
                  {r.date}
                </TableCell>
                <TableCell className="text-xs text-gray-700">
                  {fmt(r.base)}
                </TableCell>
                <TableCell className="text-xs text-gray-600">
                  {fmt(r.gst)}
                </TableCell>
                <TableCell className="text-xs font-semibold text-gray-800">
                  {fmt(r.base + r.gst)}
                </TableCell>
                <TableCell className="text-xs text-gray-700">
                  {r.state}
                </TableCell>
                <TableCell>{statusBadge(r.status)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

// ─── Lab Wise ─────────────────────────────────────────────────────────────────
const allLabData = [
  {
    lab: "NABL Test Labs Pvt Ltd",
    city: "Jaipur",
    state: "Rajasthan",
    tests: 58,
    costPerTest: 8500,
    status: "Active",
  },
  {
    lab: "Centre for Testing & Certification",
    city: "Mumbai",
    state: "Maharashtra",
    tests: 82,
    costPerTest: 9200,
    status: "Active",
  },
  {
    lab: "National Physical Laboratory",
    city: "New Delhi",
    state: "Delhi",
    tests: 44,
    costPerTest: 11000,
    status: "Active",
  },
  {
    lab: "BIS Quality Services",
    city: "Ahmedabad",
    state: "Gujarat",
    tests: 67,
    costPerTest: 8800,
    status: "Active",
  },
  {
    lab: "ERTL South India",
    city: "Chennai",
    state: "Tamil Nadu",
    tests: 51,
    costPerTest: 9500,
    status: "In Progress",
  },
  {
    lab: "CPRI Bangalore",
    city: "Bengaluru",
    state: "Karnataka",
    tests: 73,
    costPerTest: 10200,
    status: "Active",
  },
  {
    lab: "IIT Kanpur Testing Centre",
    city: "Kanpur",
    state: "Uttar Pradesh",
    tests: 39,
    costPerTest: 9000,
    status: "Active",
  },
  {
    lab: "West Bengal Testing House",
    city: "Kolkata",
    state: "West Bengal",
    tests: 35,
    costPerTest: 8200,
    status: "In Progress",
  },
];

function LabWisePage({ selectedState }: { selectedState: string }) {
  const data =
    selectedState === "All States"
      ? allLabData
      : allLabData.filter((r) => r.state === selectedState);
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-semibold text-gray-700">
          Lab Wise Expenditure
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow className="bg-blue-50">
              {[
                "#",
                "Lab Name",
                "City",
                "State",
                "Tests Conducted",
                "Cost per Test",
                "Total Amount",
                "Status",
              ].map((h) => (
                <TableHead
                  key={h}
                  className="text-xs font-semibold text-gray-600"
                >
                  {h}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((r, i) => (
              <TableRow
                key={r.lab}
                className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}
              >
                <TableCell className="text-xs text-gray-500">{i + 1}</TableCell>
                <TableCell className="text-xs font-medium text-gray-800">
                  {r.lab}
                </TableCell>
                <TableCell className="text-xs text-gray-600">
                  {r.city}
                </TableCell>
                <TableCell className="text-xs text-gray-700">
                  {r.state}
                </TableCell>
                <TableCell className="text-xs text-gray-700">
                  {r.tests}
                </TableCell>
                <TableCell className="text-xs text-gray-700">
                  {fmt(r.costPerTest)}
                </TableCell>
                <TableCell className="text-xs font-semibold text-gray-800">
                  {fmt(r.tests * r.costPerTest)}
                </TableCell>
                <TableCell>{statusBadge(r.status)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

// ─── Vendor Wise ──────────────────────────────────────────────────────────────
const allVendorData = [
  {
    vendor: "NABL Test Labs Pvt Ltd",
    cat: "Testing Services",
    invoices: 14,
    total: 5320000,
    paid: 4250000,
    state: "Rajasthan",
  },
  {
    vendor: "Centre for Testing & Certification",
    cat: "Testing Services",
    invoices: 18,
    total: 7560000,
    paid: 6800000,
    state: "Maharashtra",
  },
  {
    vendor: "National Physical Laboratory",
    cat: "Calibration",
    invoices: 9,
    total: 2970000,
    paid: 2970000,
    state: "Delhi",
  },
  {
    vendor: "BIS Quality Services",
    cat: "Certification",
    invoices: 12,
    total: 4104000,
    paid: 3200000,
    state: "Gujarat",
  },
  {
    vendor: "ERTL South India",
    cat: "Testing Services",
    invoices: 10,
    total: 4845000,
    paid: 3500000,
    state: "Tamil Nadu",
  },
  {
    vendor: "CPRI Bangalore",
    cat: "Equipment",
    invoices: 15,
    total: 7446000,
    paid: 6900000,
    state: "Karnataka",
  },
  {
    vendor: "IIT Kanpur Testing Centre",
    cat: "R&D Testing",
    invoices: 8,
    total: 3510000,
    paid: 3510000,
    state: "Uttar Pradesh",
  },
  {
    vendor: "Scientific Instruments Corp.",
    cat: "Equipment",
    invoices: 6,
    total: 1890000,
    paid: 1200000,
    state: "Haryana",
  },
];

function VendorWisePage({ selectedState }: { selectedState: string }) {
  const data =
    selectedState === "All States"
      ? allVendorData
      : allVendorData.filter((r) => r.state === selectedState);
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-semibold text-gray-700">
          Vendor Wise Summary
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow className="bg-blue-50">
              {[
                "#",
                "Vendor Name",
                "Category",
                "Invoices",
                "Total Amount",
                "Paid Amount",
                "Outstanding",
                "Status",
              ].map((h) => (
                <TableHead
                  key={h}
                  className="text-xs font-semibold text-gray-600"
                >
                  {h}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((r, i) => {
              const outstanding = r.total - r.paid;
              return (
                <TableRow
                  key={r.vendor}
                  className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}
                >
                  <TableCell className="text-xs text-gray-500">
                    {i + 1}
                  </TableCell>
                  <TableCell className="text-xs font-medium text-gray-800">
                    {r.vendor}
                  </TableCell>
                  <TableCell className="text-xs text-gray-600">
                    {r.cat}
                  </TableCell>
                  <TableCell className="text-xs text-gray-700">
                    {r.invoices}
                  </TableCell>
                  <TableCell className="text-xs font-semibold text-gray-800">
                    {fmt(r.total)}
                  </TableCell>
                  <TableCell className="text-xs text-green-700 font-medium">
                    {fmt(r.paid)}
                  </TableCell>
                  <TableCell
                    className="text-xs"
                    style={{ color: outstanding > 0 ? "#ea580c" : "#16a34a" }}
                  >
                    {fmt(outstanding)}
                  </TableCell>
                  <TableCell>
                    {statusBadge(outstanding === 0 ? "Paid" : "Pending")}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

// ─── Brand Wise ───────────────────────────────────────────────────────────────
const allBrandData = [
  {
    brand: "Voltas",
    cat: "Air Conditioner",
    models: 8,
    cost: 1200000,
    pass: 6,
    fail: 2,
    state: "Rajasthan",
  },
  {
    brand: "LG Electronics",
    cat: "Refrigerator",
    models: 12,
    cost: 980000,
    pass: 11,
    fail: 1,
    state: "Maharashtra",
  },
  {
    brand: "Samsung",
    cat: "Washing Machine",
    models: 10,
    cost: 850000,
    pass: 8,
    fail: 2,
    state: "Delhi",
  },
  {
    brand: "Havells",
    cat: "Ceiling Fan",
    models: 15,
    cost: 420000,
    pass: 14,
    fail: 1,
    state: "Uttar Pradesh",
  },
  {
    brand: "Philips",
    cat: "LED Bulb",
    models: 20,
    cost: 360000,
    pass: 19,
    fail: 1,
    state: "Gujarat",
  },
  {
    brand: "Racold",
    cat: "Water Heater",
    models: 7,
    cost: 504000,
    pass: 6,
    fail: 1,
    state: "Haryana",
  },
  {
    brand: "IFB",
    cat: "Washing Machine",
    models: 9,
    cost: 765000,
    pass: 8,
    fail: 1,
    state: "Tamil Nadu",
  },
  {
    brand: "Blue Star",
    cat: "Air Conditioner",
    models: 11,
    cost: 1210000,
    pass: 9,
    fail: 2,
    state: "Karnataka",
  },
  {
    brand: "Godrej",
    cat: "Refrigerator",
    models: 8,
    cost: 784000,
    pass: 7,
    fail: 1,
    state: "West Bengal",
  },
  {
    brand: "Crompton",
    cat: "Ceiling Fan",
    models: 13,
    cost: 390000,
    pass: 12,
    fail: 1,
    state: "Madhya Pradesh",
  },
];

function BrandWisePage({ selectedState }: { selectedState: string }) {
  const data =
    selectedState === "All States"
      ? allBrandData
      : allBrandData.filter((r) => r.state === selectedState);
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-semibold text-gray-700">
          Brand Wise Testing Report
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow className="bg-blue-50">
              {[
                "#",
                "Brand Name",
                "Appliance Category",
                "Models Tested",
                "Testing Cost",
                "Pass",
                "Fail",
                "Pass %",
              ].map((h) => (
                <TableHead
                  key={h}
                  className="text-xs font-semibold text-gray-600"
                >
                  {h}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((r, i) => {
              const passPct = Math.round((r.pass / r.models) * 100);
              return (
                <TableRow
                  key={r.brand}
                  className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}
                >
                  <TableCell className="text-xs text-gray-500">
                    {i + 1}
                  </TableCell>
                  <TableCell className="text-xs font-medium text-gray-800">
                    {r.brand}
                  </TableCell>
                  <TableCell className="text-xs text-gray-600">
                    {r.cat}
                  </TableCell>
                  <TableCell className="text-xs text-gray-700">
                    {r.models}
                  </TableCell>
                  <TableCell className="text-xs font-semibold text-gray-800">
                    {fmt(r.cost)}
                  </TableCell>
                  <TableCell className="text-xs text-green-700 font-semibold">
                    {r.pass}
                  </TableCell>
                  <TableCell className="text-xs text-red-600 font-semibold">
                    {r.fail}
                  </TableCell>
                  <TableCell className="text-xs">
                    <div className="flex items-center gap-2">
                      <Progress value={passPct} className="h-1.5 w-14" />
                      <span
                        className={
                          passPct >= 90
                            ? "text-green-700 font-semibold"
                            : "text-orange-600 font-semibold"
                        }
                      >
                        {passPct}%
                      </span>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

// ─── Main Dashboard Container ─────────────────────────────────────────────────
const PAGE_TITLES: Record<string, string> = {
  fin_summary: "Summary",
  fin_bill: "Bill Wise Details",
  fin_appliance: "Appliance Wise",
  fin_expenses: "Expenses Head",
  fin_invoice: "Invoice Data",
  fin_lab: "Lab Wise",
  fin_vendor: "Vendor Wise",
  fin_brand: "Brand Wise",
  bee_summary: "Summary",
  bee_bill: "Bill Wise Details",
  bee_appliance: "Appliance Wise",
  bee_expenses: "Expenses Head",
  bee_invoice: "Invoice Data",
  bee_lab: "Lab Wise",
  bee_vendor: "Vendor Wise",
  bee_brand: "Brand Wise",
  lab_summary: "Summary",
  lab_bill: "Bill Wise Details",
  lab_appliance: "Appliance Wise",
  lab_expenses: "Expenses Head",
  lab_invoice: "Invoice Data",
  lab_lab: "Lab Wise",
  lab_vendor: "Vendor Wise",
  lab_brand: "Brand Wise",
};

// ─── BEE Section Data & Components ───────────────────────────────────────────
const beeSummaryData = [
  {
    dept: "National Testing Division",
    budget: 85000000,
    expenditure: 61200000,
    bills: 92,
    fy: "2023-24",
  },
  {
    dept: "Standards & Labeling Cell",
    budget: 32000000,
    expenditure: 24500000,
    bills: 48,
    fy: "2023-24",
  },
  {
    dept: "Administration & HR",
    budget: 18000000,
    expenditure: 14300000,
    bills: 31,
    fy: "2023-24",
  },
  {
    dept: "IT Infrastructure",
    budget: 12000000,
    expenditure: 9800000,
    bills: 19,
    fy: "2023-24",
  },
  {
    dept: "Compliance & Audit",
    budget: 9500000,
    expenditure: 7200000,
    bills: 24,
    fy: "2023-24",
  },
  {
    dept: "Research & Development",
    budget: 15000000,
    expenditure: 11600000,
    bills: 28,
    fy: "2023-24",
  },
  {
    dept: "Training & Capacity Building",
    budget: 7500000,
    expenditure: 5400000,
    bills: 16,
    fy: "2023-24",
  },
];

function BeeSummaryPage() {
  const totBudget = beeSummaryData.reduce((a, r) => a + r.budget, 0);
  const totExpenditure = beeSummaryData.reduce((a, r) => a + r.expenditure, 0);
  const totBills = beeSummaryData.reduce((a, r) => a + r.bills, 0);
  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total Budget", value: fmt(totBudget), color: "#1a3a6b" },
          {
            label: "Total Expenditure",
            value: fmt(totExpenditure),
            color: "#ea580c",
          },
          {
            label: "Balance",
            value: fmt(totBudget - totExpenditure),
            color: "#16a34a",
          },
          { label: "No. of Bills", value: String(totBills), color: "#7c3aed" },
        ].map((kpi) => (
          <Card key={kpi.label}>
            <CardContent className="pt-4 pb-3">
              <p className="text-xs text-gray-500">{kpi.label}</p>
              <p
                className="text-lg font-bold mt-1"
                style={{ color: kpi.color }}
              >
                {kpi.value}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold text-gray-700">
            BEE Department-wise Summary
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-blue-50">
                {[
                  "#",
                  "Department",
                  "Budget Allocated",
                  "Expenditure",
                  "Balance",
                  "Bills",
                  "Utilization %",
                ].map((h) => (
                  <TableHead
                    key={h}
                    className="text-xs font-semibold text-gray-600"
                  >
                    {h}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {beeSummaryData.map((r, i) => (
                <TableRow
                  key={r.dept}
                  className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}
                >
                  <TableCell className="text-xs text-gray-500">
                    {i + 1}
                  </TableCell>
                  <TableCell className="text-xs font-medium text-gray-800">
                    {r.dept}
                  </TableCell>
                  <TableCell className="text-xs text-gray-700">
                    {fmt(r.budget)}
                  </TableCell>
                  <TableCell className="text-xs text-gray-700">
                    {fmt(r.expenditure)}
                  </TableCell>
                  <TableCell className="text-xs font-medium text-green-700">
                    {fmt(r.budget - r.expenditure)}
                  </TableCell>
                  <TableCell className="text-xs text-gray-700">
                    {r.bills}
                  </TableCell>
                  <TableCell className="text-xs">
                    <div className="flex items-center gap-2">
                      <Progress
                        value={Math.round((r.expenditure / r.budget) * 100)}
                        className="h-1.5 w-16"
                      />
                      <span className="text-gray-600">
                        {Math.round((r.expenditure / r.budget) * 100)}%
                      </span>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

const beeBillData = [
  {
    no: "BEE-BL-2024-001",
    date: "05 Apr 2024",
    dept: "National Testing Division",
    desc: "Centralized AC Testing Q1 — All States",
    amount: 1250000,
    status: "Paid",
  },
  {
    no: "BEE-BL-2024-002",
    date: "12 Apr 2024",
    dept: "Standards & Labeling Cell",
    desc: "Star Rating Label Printing — Batch 7",
    amount: 380000,
    status: "Paid",
  },
  {
    no: "BEE-BL-2024-003",
    date: "20 Apr 2024",
    dept: "IT Infrastructure",
    desc: "Portal Hosting & Maintenance Q1",
    amount: 290000,
    status: "Paid",
  },
  {
    no: "BEE-BL-2024-004",
    date: "28 Apr 2024",
    dept: "Compliance & Audit",
    desc: "Third-party Compliance Audit — 5 States",
    amount: 540000,
    status: "Pending",
  },
  {
    no: "BEE-BL-2024-005",
    date: "07 May 2024",
    dept: "Research & Development",
    desc: "AC Energy Efficiency Research Grant",
    amount: 950000,
    status: "Paid",
  },
  {
    no: "BEE-BL-2024-006",
    date: "15 May 2024",
    dept: "Training & Capacity Building",
    desc: "Lab Technician Training — Batch 3",
    amount: 215000,
    status: "Under Review",
  },
  {
    no: "BEE-BL-2024-007",
    date: "22 May 2024",
    dept: "Administration & HR",
    desc: "Staff Recruitment & Onboarding Expenses",
    amount: 175000,
    status: "Paid",
  },
  {
    no: "BEE-BL-2024-008",
    date: "30 May 2024",
    dept: "National Testing Division",
    desc: "Refrigerator Testing Charges Q2",
    amount: 870000,
    status: "Paid",
  },
  {
    no: "BEE-BL-2024-009",
    date: "06 Jun 2024",
    dept: "Standards & Labeling Cell",
    desc: "Label Design & Artwork — FY 2024-25",
    amount: 120000,
    status: "Pending",
  },
  {
    no: "BEE-BL-2024-010",
    date: "14 Jun 2024",
    dept: "IT Infrastructure",
    desc: "Server Upgrade & Security Audit",
    amount: 460000,
    status: "Under Review",
  },
];

function BeeBillWisePage() {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-semibold text-gray-700">
          BEE — Bill Wise Details
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow className="bg-blue-50">
              {[
                "Bill No",
                "Bill Date",
                "Department",
                "Description",
                "Amount (₹)",
                "Status",
              ].map((h) => (
                <TableHead
                  key={h}
                  className="text-xs font-semibold text-gray-600"
                >
                  {h}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {beeBillData.map((r, i) => (
              <TableRow
                key={r.no}
                className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}
              >
                <TableCell className="text-xs font-mono text-blue-700">
                  {r.no}
                </TableCell>
                <TableCell className="text-xs text-gray-600">
                  {r.date}
                </TableCell>
                <TableCell className="text-xs text-gray-700">
                  {r.dept}
                </TableCell>
                <TableCell className="text-xs text-gray-700">
                  {r.desc}
                </TableCell>
                <TableCell className="text-xs font-semibold text-gray-800">
                  {fmt(r.amount)}
                </TableCell>
                <TableCell>{statusBadge(r.status)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

const beeApplianceData = [
  { cat: "Air Conditioner", units: 890, costPerUnit: 14000, fy: "2023-24" },
  { cat: "Refrigerator", units: 720, costPerUnit: 11000, fy: "2023-24" },
  { cat: "Washing Machine", units: 540, costPerUnit: 9500, fy: "2023-24" },
  { cat: "Ceiling Fan", units: 1200, costPerUnit: 3800, fy: "2023-24" },
  { cat: "LED Bulb", units: 2800, costPerUnit: 2100, fy: "2023-24" },
  { cat: "Water Heater", units: 410, costPerUnit: 8200, fy: "2023-24" },
  { cat: "Microwave Oven", units: 320, costPerUnit: 7500, fy: "2023-24" },
  { cat: "Inverter AC", units: 650, costPerUnit: 16500, fy: "2023-24" },
];

function BeeAppliancePage() {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-semibold text-gray-700">
          BEE — National Appliance Wise Testing Summary
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow className="bg-blue-50">
              {[
                "#",
                "Appliance Category",
                "Total Units Tested (All States)",
                "Unit Testing Cost",
                "Total Amount",
                "Financial Year",
              ].map((h) => (
                <TableHead
                  key={h}
                  className="text-xs font-semibold text-gray-600"
                >
                  {h}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {beeApplianceData.map((r, i) => (
              <TableRow
                key={r.cat}
                className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}
              >
                <TableCell className="text-xs text-gray-500">{i + 1}</TableCell>
                <TableCell className="text-xs font-medium text-gray-800">
                  {r.cat}
                </TableCell>
                <TableCell className="text-xs text-gray-700">
                  {r.units}
                </TableCell>
                <TableCell className="text-xs text-gray-700">
                  {fmt(r.costPerUnit)}
                </TableCell>
                <TableCell className="text-xs font-semibold text-gray-800">
                  {fmt(r.units * r.costPerUnit)}
                </TableCell>
                <TableCell className="text-xs text-gray-600">{r.fy}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

const beeExpensesData = [
  {
    head: "National Testing Charges",
    budget: 120000000,
    expenditure: 88500000,
  },
  {
    head: "Standards & Labeling Operations",
    budget: 35000000,
    expenditure: 26200000,
  },
  {
    head: "IT Systems & Infrastructure",
    budget: 22000000,
    expenditure: 17800000,
  },
  { head: "Human Resources", budget: 18000000, expenditure: 14300000 },
  { head: "Research & Development", budget: 15000000, expenditure: 11600000 },
  {
    head: "Training & Capacity Building",
    budget: 7500000,
    expenditure: 5400000,
  },
  { head: "Audit & Compliance", budget: 9500000, expenditure: 7200000 },
  {
    head: "Miscellaneous / Contingency",
    budget: 5000000,
    expenditure: 3100000,
  },
];

function BeeExpensesPage() {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-semibold text-gray-700">
          BEE — Expenses Head (National Level)
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow className="bg-blue-50">
              {[
                "#",
                "Expense Head",
                "Budget Allocated",
                "Expenditure",
                "Balance",
                "Utilization",
              ].map((h) => (
                <TableHead
                  key={h}
                  className="text-xs font-semibold text-gray-600"
                >
                  {h}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {beeExpensesData.map((r, i) => {
              const pct = Math.round((r.expenditure / r.budget) * 100);
              return (
                <TableRow
                  key={r.head}
                  className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}
                >
                  <TableCell className="text-xs text-gray-500">
                    {i + 1}
                  </TableCell>
                  <TableCell className="text-xs font-medium text-gray-800">
                    {r.head}
                  </TableCell>
                  <TableCell className="text-xs text-gray-700">
                    {fmt(r.budget)}
                  </TableCell>
                  <TableCell className="text-xs text-orange-700 font-medium">
                    {fmt(r.expenditure)}
                  </TableCell>
                  <TableCell className="text-xs text-green-700 font-medium">
                    {fmt(r.budget - r.expenditure)}
                  </TableCell>
                  <TableCell className="text-xs">
                    <div className="flex items-center gap-2">
                      <Progress value={pct} className="h-2 w-20" />
                      <span
                        className={
                          pct > 85
                            ? "text-red-600 font-semibold"
                            : "text-gray-600"
                        }
                      >
                        {pct}%
                      </span>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

const beeInvoiceData = [
  {
    no: "BEE-INV-2024-101",
    vendor: "NABL Accreditation Board",
    date: "08 Apr 2024",
    base: 1800000,
    gst: 324000,
    status: "Paid",
  },
  {
    no: "BEE-INV-2024-102",
    vendor: "NIC (National Informatics Centre)",
    date: "15 Apr 2024",
    base: 950000,
    gst: 171000,
    status: "Paid",
  },
  {
    no: "BEE-INV-2024-103",
    vendor: "Tata Consultancy Services",
    date: "22 Apr 2024",
    base: 1250000,
    gst: 225000,
    status: "Pending",
  },
  {
    no: "BEE-INV-2024-104",
    vendor: "DELOITTE India LLP",
    date: "30 Apr 2024",
    base: 780000,
    gst: 140400,
    status: "Paid",
  },
  {
    no: "BEE-INV-2024-105",
    vendor: "IIT Delhi Research Centre",
    date: "08 May 2024",
    base: 950000,
    gst: 171000,
    status: "Under Review",
  },
  {
    no: "BEE-INV-2024-106",
    vendor: "Print India Ltd",
    date: "16 May 2024",
    base: 380000,
    gst: 68400,
    status: "Paid",
  },
  {
    no: "BEE-INV-2024-107",
    vendor: "NASSCOM Foundation",
    date: "24 May 2024",
    base: 215000,
    gst: 38700,
    status: "Paid",
  },
  {
    no: "BEE-INV-2024-108",
    vendor: "CPRI Bangalore",
    date: "01 Jun 2024",
    base: 870000,
    gst: 156600,
    status: "Pending",
  },
];

function BeeInvoicePage() {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-semibold text-gray-700">
          BEE — Invoice Data
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow className="bg-blue-50">
              {[
                "Invoice No",
                "Vendor",
                "Invoice Date",
                "Base Amount",
                "GST (18%)",
                "Total",
                "Status",
              ].map((h) => (
                <TableHead
                  key={h}
                  className="text-xs font-semibold text-gray-600"
                >
                  {h}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {beeInvoiceData.map((r, i) => (
              <TableRow
                key={r.no}
                className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}
              >
                <TableCell className="text-xs font-mono text-blue-700">
                  {r.no}
                </TableCell>
                <TableCell className="text-xs text-gray-800 font-medium">
                  {r.vendor}
                </TableCell>
                <TableCell className="text-xs text-gray-600">
                  {r.date}
                </TableCell>
                <TableCell className="text-xs text-gray-700">
                  {fmt(r.base)}
                </TableCell>
                <TableCell className="text-xs text-gray-600">
                  {fmt(r.gst)}
                </TableCell>
                <TableCell className="text-xs font-semibold text-gray-800">
                  {fmt(r.base + r.gst)}
                </TableCell>
                <TableCell>{statusBadge(r.status)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

const beeLabWiseData = [
  {
    lab: "CPRI Bangalore",
    city: "Bangalore",
    tests: 320,
    costPerTest: 12500,
    capacity: 400,
    status: "Active",
  },
  {
    lab: "NABL Test Labs Pvt Ltd",
    city: "Noida",
    tests: 280,
    costPerTest: 11000,
    capacity: 350,
    status: "Active",
  },
  {
    lab: "National Physical Laboratory",
    city: "New Delhi",
    tests: 190,
    costPerTest: 14500,
    capacity: 250,
    status: "Active",
  },
  {
    lab: "ERTL South India",
    city: "Chennai",
    tests: 240,
    costPerTest: 10800,
    capacity: 300,
    status: "Active",
  },
  {
    lab: "ETDC Mumbai",
    city: "Mumbai",
    tests: 175,
    costPerTest: 13200,
    capacity: 220,
    status: "Active",
  },
  {
    lab: "IIT Kanpur Testing Centre",
    city: "Kanpur",
    tests: 130,
    costPerTest: 15000,
    capacity: 180,
    status: "Active",
  },
  {
    lab: "BIS Quality Services",
    city: "Hyderabad",
    tests: 210,
    costPerTest: 9800,
    capacity: 270,
    status: "In Progress",
  },
  {
    lab: "West Bengal Testing House",
    city: "Kolkata",
    tests: 95,
    costPerTest: 10200,
    capacity: 150,
    status: "In Progress",
  },
];

function BeeLabWisePage() {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-semibold text-gray-700">
          BEE — Empanelled Lab Wise Expenditure
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow className="bg-blue-50">
              {[
                "#",
                "Lab Name",
                "City",
                "Tests Conducted",
                "Cost per Test",
                "Total Amount",
                "Capacity",
                "Status",
              ].map((h) => (
                <TableHead
                  key={h}
                  className="text-xs font-semibold text-gray-600"
                >
                  {h}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {beeLabWiseData.map((r, i) => (
              <TableRow
                key={r.lab}
                className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}
              >
                <TableCell className="text-xs text-gray-500">{i + 1}</TableCell>
                <TableCell className="text-xs font-medium text-gray-800">
                  {r.lab}
                </TableCell>
                <TableCell className="text-xs text-gray-600">
                  {r.city}
                </TableCell>
                <TableCell className="text-xs text-gray-700">
                  {r.tests}
                </TableCell>
                <TableCell className="text-xs text-gray-700">
                  {fmt(r.costPerTest)}
                </TableCell>
                <TableCell className="text-xs font-semibold text-gray-800">
                  {fmt(r.tests * r.costPerTest)}
                </TableCell>
                <TableCell className="text-xs text-gray-600">
                  {r.capacity}
                </TableCell>
                <TableCell>{statusBadge(r.status)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

const beeVendorData = [
  {
    vendor: "CPRI Bangalore",
    cat: "Testing Services",
    invoices: 24,
    total: 18900000,
    paid: 16500000,
  },
  {
    vendor: "NABL Accreditation Board",
    cat: "Accreditation",
    invoices: 12,
    total: 8640000,
    paid: 8640000,
  },
  {
    vendor: "NIC (National Informatics Centre)",
    cat: "IT Services",
    invoices: 18,
    total: 11700000,
    paid: 9800000,
  },
  {
    vendor: "Tata Consultancy Services",
    cat: "IT Consulting",
    invoices: 10,
    total: 12500000,
    paid: 8750000,
  },
  {
    vendor: "DELOITTE India LLP",
    cat: "Audit & Compliance",
    invoices: 8,
    total: 6240000,
    paid: 6240000,
  },
  {
    vendor: "Print India Ltd",
    cat: "Label Printing",
    invoices: 15,
    total: 5700000,
    paid: 5100000,
  },
  {
    vendor: "IIT Delhi Research Centre",
    cat: "R&D",
    invoices: 6,
    total: 5700000,
    paid: 3800000,
  },
];

function BeeVendorWisePage() {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-semibold text-gray-700">
          BEE — Vendor Wise Summary
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow className="bg-blue-50">
              {[
                "#",
                "Vendor Name",
                "Category",
                "Invoices",
                "Total Amount",
                "Paid Amount",
                "Outstanding",
                "Status",
              ].map((h) => (
                <TableHead
                  key={h}
                  className="text-xs font-semibold text-gray-600"
                >
                  {h}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {beeVendorData.map((r, i) => {
              const outstanding = r.total - r.paid;
              return (
                <TableRow
                  key={r.vendor}
                  className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}
                >
                  <TableCell className="text-xs text-gray-500">
                    {i + 1}
                  </TableCell>
                  <TableCell className="text-xs font-medium text-gray-800">
                    {r.vendor}
                  </TableCell>
                  <TableCell className="text-xs text-gray-600">
                    {r.cat}
                  </TableCell>
                  <TableCell className="text-xs text-gray-700">
                    {r.invoices}
                  </TableCell>
                  <TableCell className="text-xs font-semibold text-gray-800">
                    {fmt(r.total)}
                  </TableCell>
                  <TableCell className="text-xs text-green-700 font-medium">
                    {fmt(r.paid)}
                  </TableCell>
                  <TableCell
                    className="text-xs"
                    style={{ color: outstanding > 0 ? "#ea580c" : "#16a34a" }}
                  >
                    {fmt(outstanding)}
                  </TableCell>
                  <TableCell>
                    {statusBadge(outstanding === 0 ? "Paid" : "Pending")}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

const beeBrandData = [
  {
    brand: "Voltas",
    cat: "Air Conditioner",
    models: 52,
    cost: 7280000,
    pass: 44,
    fail: 8,
  },
  {
    brand: "LG Electronics",
    cat: "Refrigerator",
    models: 68,
    cost: 6664000,
    pass: 62,
    fail: 6,
  },
  {
    brand: "Samsung",
    cat: "Washing Machine",
    models: 45,
    cost: 4275000,
    pass: 40,
    fail: 5,
  },
  {
    brand: "Havells",
    cat: "Ceiling Fan",
    models: 88,
    cost: 2464000,
    pass: 82,
    fail: 6,
  },
  {
    brand: "Philips",
    cat: "LED Bulb",
    models: 120,
    cost: 2520000,
    pass: 115,
    fail: 5,
  },
  {
    brand: "Blue Star",
    cat: "Air Conditioner",
    models: 41,
    cost: 5740000,
    pass: 35,
    fail: 6,
  },
  {
    brand: "Godrej",
    cat: "Refrigerator",
    models: 38,
    cost: 3724000,
    pass: 34,
    fail: 4,
  },
  {
    brand: "IFB",
    cat: "Washing Machine",
    models: 29,
    cost: 2755000,
    pass: 26,
    fail: 3,
  },
];

function BeeBrandWisePage() {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-semibold text-gray-700">
          BEE — Brand Wise National Testing Summary
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow className="bg-blue-50">
              {[
                "#",
                "Brand",
                "Category",
                "Models Tested",
                "Testing Cost",
                "Pass",
                "Fail",
                "Pass %",
              ].map((h) => (
                <TableHead
                  key={h}
                  className="text-xs font-semibold text-gray-600"
                >
                  {h}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {beeBrandData.map((r, i) => {
              const passPct = Math.round((r.pass / r.models) * 100);
              return (
                <TableRow
                  key={r.brand}
                  className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}
                >
                  <TableCell className="text-xs text-gray-500">
                    {i + 1}
                  </TableCell>
                  <TableCell className="text-xs font-medium text-gray-800">
                    {r.brand}
                  </TableCell>
                  <TableCell className="text-xs text-gray-600">
                    {r.cat}
                  </TableCell>
                  <TableCell className="text-xs text-gray-700">
                    {r.models}
                  </TableCell>
                  <TableCell className="text-xs font-semibold text-gray-800">
                    {fmt(r.cost)}
                  </TableCell>
                  <TableCell className="text-xs text-green-700 font-semibold">
                    {r.pass}
                  </TableCell>
                  <TableCell className="text-xs text-red-600 font-semibold">
                    {r.fail}
                  </TableCell>
                  <TableCell className="text-xs">
                    <span
                      className={
                        passPct >= 90
                          ? "text-green-600 font-semibold"
                          : "text-orange-600 font-semibold"
                      }
                    >
                      {passPct}%
                    </span>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

// ─── LAB Section Data & Components ───────────────────────────────────────────
const labSummaryData = [
  {
    lab: "CPRI Bangalore",
    city: "Bangalore",
    budget: 28000000,
    expenditure: 21500000,
    tests: 320,
    fy: "2023-24",
  },
  {
    lab: "NABL Test Labs Pvt Ltd",
    city: "Noida",
    budget: 22000000,
    expenditure: 17200000,
    tests: 280,
    fy: "2023-24",
  },
  {
    lab: "National Physical Laboratory",
    city: "New Delhi",
    budget: 19000000,
    expenditure: 14800000,
    tests: 190,
    fy: "2023-24",
  },
  {
    lab: "ERTL South India",
    city: "Chennai",
    budget: 18000000,
    expenditure: 13500000,
    tests: 240,
    fy: "2023-24",
  },
  {
    lab: "ETDC Mumbai",
    city: "Mumbai",
    budget: 16500000,
    expenditure: 12100000,
    tests: 175,
    fy: "2023-24",
  },
  {
    lab: "IIT Kanpur Testing Centre",
    city: "Kanpur",
    budget: 14000000,
    expenditure: 10200000,
    tests: 130,
    fy: "2023-24",
  },
  {
    lab: "BIS Quality Services",
    city: "Hyderabad",
    budget: 12000000,
    expenditure: 8900000,
    tests: 210,
    fy: "2023-24",
  },
];

function LabSummaryPage() {
  const totBudget = labSummaryData.reduce((a, r) => a + r.budget, 0);
  const totExpenditure = labSummaryData.reduce((a, r) => a + r.expenditure, 0);
  const totTests = labSummaryData.reduce((a, r) => a + r.tests, 0);
  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          {
            label: "Total Lab Budget",
            value: fmt(totBudget),
            color: "#1a3a6b",
          },
          {
            label: "Total Expenditure",
            value: fmt(totExpenditure),
            color: "#ea580c",
          },
          {
            label: "Balance",
            value: fmt(totBudget - totExpenditure),
            color: "#16a34a",
          },
          { label: "Total Tests", value: String(totTests), color: "#7c3aed" },
        ].map((kpi) => (
          <Card key={kpi.label}>
            <CardContent className="pt-4 pb-3">
              <p className="text-xs text-gray-500">{kpi.label}</p>
              <p
                className="text-lg font-bold mt-1"
                style={{ color: kpi.color }}
              >
                {kpi.value}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold text-gray-700">
            Lab-wise Financial Summary
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-blue-50">
                {[
                  "#",
                  "Lab Name",
                  "City",
                  "Budget",
                  "Expenditure",
                  "Balance",
                  "Tests",
                  "Utilization %",
                ].map((h) => (
                  <TableHead
                    key={h}
                    className="text-xs font-semibold text-gray-600"
                  >
                    {h}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {labSummaryData.map((r, i) => (
                <TableRow
                  key={r.lab}
                  className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}
                >
                  <TableCell className="text-xs text-gray-500">
                    {i + 1}
                  </TableCell>
                  <TableCell className="text-xs font-medium text-gray-800">
                    {r.lab}
                  </TableCell>
                  <TableCell className="text-xs text-gray-600">
                    {r.city}
                  </TableCell>
                  <TableCell className="text-xs text-gray-700">
                    {fmt(r.budget)}
                  </TableCell>
                  <TableCell className="text-xs text-gray-700">
                    {fmt(r.expenditure)}
                  </TableCell>
                  <TableCell className="text-xs font-medium text-green-700">
                    {fmt(r.budget - r.expenditure)}
                  </TableCell>
                  <TableCell className="text-xs text-gray-700">
                    {r.tests}
                  </TableCell>
                  <TableCell className="text-xs">
                    <div className="flex items-center gap-2">
                      <Progress
                        value={Math.round((r.expenditure / r.budget) * 100)}
                        className="h-1.5 w-16"
                      />
                      <span className="text-gray-600">
                        {Math.round((r.expenditure / r.budget) * 100)}%
                      </span>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

const labBillData = [
  {
    no: "LAB-BL-2024-001",
    date: "03 Apr 2024",
    lab: "CPRI Bangalore",
    desc: "AC Testing Batch Q1 — 42 units",
    amount: 630000,
    status: "Paid",
  },
  {
    no: "LAB-BL-2024-002",
    date: "10 Apr 2024",
    lab: "NABL Test Labs Pvt Ltd",
    desc: "Refrigerator Testing — 35 units",
    amount: 385000,
    status: "Paid",
  },
  {
    no: "LAB-BL-2024-003",
    date: "17 Apr 2024",
    lab: "National Physical Laboratory",
    desc: "LED Bulb Calibration — Batch 6",
    amount: 189000,
    status: "Paid",
  },
  {
    no: "LAB-BL-2024-004",
    date: "25 Apr 2024",
    lab: "ERTL South India",
    desc: "Washing Machine Test Batch",
    amount: 432000,
    status: "Pending",
  },
  {
    no: "LAB-BL-2024-005",
    date: "05 May 2024",
    lab: "ETDC Mumbai",
    desc: "Microwave Oven Testing — 28 units",
    amount: 252000,
    status: "Paid",
  },
  {
    no: "LAB-BL-2024-006",
    date: "13 May 2024",
    lab: "IIT Kanpur Testing Centre",
    desc: "Water Heater 2nd Check Test",
    amount: 315000,
    status: "Under Review",
  },
  {
    no: "LAB-BL-2024-007",
    date: "21 May 2024",
    lab: "CPRI Bangalore",
    desc: "Inverter AC Deep Testing Q2",
    amount: 825000,
    status: "Paid",
  },
  {
    no: "LAB-BL-2024-008",
    date: "29 May 2024",
    lab: "BIS Quality Services",
    desc: "Ceiling Fan Testing — 60 units",
    amount: 228000,
    status: "Paid",
  },
  {
    no: "LAB-BL-2024-009",
    date: "07 Jun 2024",
    lab: "NABL Test Labs Pvt Ltd",
    desc: "Fan Energy Audit — Batch 4",
    amount: 176000,
    status: "Pending",
  },
  {
    no: "LAB-BL-2024-010",
    date: "15 Jun 2024",
    lab: "ERTL South India",
    desc: "Freezer Testing Charges",
    amount: 345000,
    status: "Under Review",
  },
];

function LabBillWisePage() {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-semibold text-gray-700">
          LAB — Bill Wise Details
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow className="bg-blue-50">
              {[
                "Bill No",
                "Bill Date",
                "Lab Name",
                "Description",
                "Amount (₹)",
                "Status",
              ].map((h) => (
                <TableHead
                  key={h}
                  className="text-xs font-semibold text-gray-600"
                >
                  {h}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {labBillData.map((r, i) => (
              <TableRow
                key={r.no}
                className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}
              >
                <TableCell className="text-xs font-mono text-blue-700">
                  {r.no}
                </TableCell>
                <TableCell className="text-xs text-gray-600">
                  {r.date}
                </TableCell>
                <TableCell className="text-xs text-gray-700">{r.lab}</TableCell>
                <TableCell className="text-xs text-gray-700">
                  {r.desc}
                </TableCell>
                <TableCell className="text-xs font-semibold text-gray-800">
                  {fmt(r.amount)}
                </TableCell>
                <TableCell>{statusBadge(r.status)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

const labApplianceData = [
  {
    cat: "Air Conditioner",
    lab: "CPRI Bangalore",
    units: 145,
    costPerUnit: 15000,
    fy: "2023-24",
  },
  {
    cat: "Refrigerator",
    lab: "NABL Test Labs Pvt Ltd",
    units: 112,
    costPerUnit: 12500,
    fy: "2023-24",
  },
  {
    cat: "Washing Machine",
    lab: "ERTL South India",
    units: 88,
    costPerUnit: 11000,
    fy: "2023-24",
  },
  {
    cat: "Ceiling Fan",
    lab: "BIS Quality Services",
    units: 220,
    costPerUnit: 4200,
    fy: "2023-24",
  },
  {
    cat: "LED Bulb",
    lab: "National Physical Laboratory",
    units: 510,
    costPerUnit: 2500,
    fy: "2023-24",
  },
  {
    cat: "Water Heater",
    lab: "ETDC Mumbai",
    units: 72,
    costPerUnit: 9500,
    fy: "2023-24",
  },
  {
    cat: "Microwave Oven",
    lab: "IIT Kanpur Testing Centre",
    units: 55,
    costPerUnit: 8800,
    fy: "2023-24",
  },
];

function LabAppliancePage() {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-semibold text-gray-700">
          LAB — Appliance Wise Testing Cost
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow className="bg-blue-50">
              {[
                "#",
                "Appliance Category",
                "Assigned Lab",
                "Units Tested",
                "Unit Cost",
                "Total Amount",
                "Financial Year",
              ].map((h) => (
                <TableHead
                  key={h}
                  className="text-xs font-semibold text-gray-600"
                >
                  {h}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {labApplianceData.map((r, i) => (
              <TableRow
                key={`${r.cat}-${r.lab}`}
                className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}
              >
                <TableCell className="text-xs text-gray-500">{i + 1}</TableCell>
                <TableCell className="text-xs font-medium text-gray-800">
                  {r.cat}
                </TableCell>
                <TableCell className="text-xs text-gray-700">{r.lab}</TableCell>
                <TableCell className="text-xs text-gray-700">
                  {r.units}
                </TableCell>
                <TableCell className="text-xs text-gray-700">
                  {fmt(r.costPerUnit)}
                </TableCell>
                <TableCell className="text-xs font-semibold text-gray-800">
                  {fmt(r.units * r.costPerUnit)}
                </TableCell>
                <TableCell className="text-xs text-gray-600">{r.fy}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

const labExpensesData = [
  {
    head: "Testing Equipment Maintenance",
    budget: 12000000,
    expenditure: 9400000,
  },
  { head: "Lab Technician Salaries", budget: 18000000, expenditure: 15600000 },
  { head: "Consumables & Reagents", budget: 5500000, expenditure: 4200000 },
  { head: "Equipment Calibration", budget: 7000000, expenditure: 5800000 },
  { head: "Facility Rental / Utility", budget: 8000000, expenditure: 7200000 },
  { head: "Safety & Compliance", budget: 3000000, expenditure: 2100000 },
  { head: "Training & Certification", budget: 2500000, expenditure: 1800000 },
];

function LabExpensesPage() {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-semibold text-gray-700">
          LAB — Expenses Head (Aggregate)
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow className="bg-blue-50">
              {[
                "#",
                "Expense Head",
                "Budget Allocated",
                "Expenditure",
                "Balance",
                "Utilization",
              ].map((h) => (
                <TableHead
                  key={h}
                  className="text-xs font-semibold text-gray-600"
                >
                  {h}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {labExpensesData.map((r, i) => {
              const pct = Math.round((r.expenditure / r.budget) * 100);
              return (
                <TableRow
                  key={r.head}
                  className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}
                >
                  <TableCell className="text-xs text-gray-500">
                    {i + 1}
                  </TableCell>
                  <TableCell className="text-xs font-medium text-gray-800">
                    {r.head}
                  </TableCell>
                  <TableCell className="text-xs text-gray-700">
                    {fmt(r.budget)}
                  </TableCell>
                  <TableCell className="text-xs text-orange-700 font-medium">
                    {fmt(r.expenditure)}
                  </TableCell>
                  <TableCell className="text-xs text-green-700 font-medium">
                    {fmt(r.budget - r.expenditure)}
                  </TableCell>
                  <TableCell className="text-xs">
                    <div className="flex items-center gap-2">
                      <Progress value={pct} className="h-2 w-20" />
                      <span
                        className={
                          pct > 85
                            ? "text-red-600 font-semibold"
                            : "text-gray-600"
                        }
                      >
                        {pct}%
                      </span>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

const labInvoiceData = [
  {
    no: "LAB-INV-2024-201",
    lab: "CPRI Bangalore",
    date: "06 Apr 2024",
    base: 945000,
    gst: 170100,
    status: "Paid",
  },
  {
    no: "LAB-INV-2024-202",
    lab: "NABL Test Labs Pvt Ltd",
    date: "14 Apr 2024",
    base: 680000,
    gst: 122400,
    status: "Paid",
  },
  {
    no: "LAB-INV-2024-203",
    lab: "National Physical Laboratory",
    date: "21 Apr 2024",
    base: 510000,
    gst: 91800,
    status: "Under Review",
  },
  {
    no: "LAB-INV-2024-204",
    lab: "ERTL South India",
    date: "29 Apr 2024",
    base: 756000,
    gst: 136080,
    status: "Paid",
  },
  {
    no: "LAB-INV-2024-205",
    lab: "ETDC Mumbai",
    date: "08 May 2024",
    base: 432000,
    gst: 77760,
    status: "Pending",
  },
  {
    no: "LAB-INV-2024-206",
    lab: "IIT Kanpur Testing Centre",
    date: "16 May 2024",
    base: 594000,
    gst: 106920,
    status: "Paid",
  },
  {
    no: "LAB-INV-2024-207",
    lab: "BIS Quality Services",
    date: "24 May 2024",
    base: 378000,
    gst: 68040,
    status: "Paid",
  },
  {
    no: "LAB-INV-2024-208",
    lab: "CPRI Bangalore",
    date: "02 Jun 2024",
    base: 1134000,
    gst: 204120,
    status: "Under Review",
  },
];

function LabInvoicePage() {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-semibold text-gray-700">
          LAB — Invoice Data
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow className="bg-blue-50">
              {[
                "Invoice No",
                "Lab Name",
                "Invoice Date",
                "Base Amount",
                "GST (18%)",
                "Total",
                "Status",
              ].map((h) => (
                <TableHead
                  key={h}
                  className="text-xs font-semibold text-gray-600"
                >
                  {h}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {labInvoiceData.map((r, i) => (
              <TableRow
                key={r.no}
                className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}
              >
                <TableCell className="text-xs font-mono text-blue-700">
                  {r.no}
                </TableCell>
                <TableCell className="text-xs text-gray-800 font-medium">
                  {r.lab}
                </TableCell>
                <TableCell className="text-xs text-gray-600">
                  {r.date}
                </TableCell>
                <TableCell className="text-xs text-gray-700">
                  {fmt(r.base)}
                </TableCell>
                <TableCell className="text-xs text-gray-600">
                  {fmt(r.gst)}
                </TableCell>
                <TableCell className="text-xs font-semibold text-gray-800">
                  {fmt(r.base + r.gst)}
                </TableCell>
                <TableCell>{statusBadge(r.status)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

const labLabWiseData = [
  {
    lab: "CPRI Bangalore",
    city: "Bangalore",
    cats: "AC, Inverter AC, Fan",
    tests: 320,
    revenue: 4800000,
    status: "Active",
  },
  {
    lab: "NABL Test Labs Pvt Ltd",
    city: "Noida",
    cats: "Refrigerator, Washing Machine",
    tests: 280,
    revenue: 3640000,
    status: "Active",
  },
  {
    lab: "National Physical Laboratory",
    city: "New Delhi",
    cats: "LED Bulb, Calibration",
    tests: 190,
    revenue: 2755000,
    status: "Active",
  },
  {
    lab: "ERTL South India",
    city: "Chennai",
    cats: "Washing Machine, AC",
    tests: 240,
    revenue: 3120000,
    status: "Active",
  },
  {
    lab: "ETDC Mumbai",
    city: "Mumbai",
    cats: "Microwave, Water Heater",
    tests: 175,
    revenue: 2362500,
    status: "In Progress",
  },
  {
    lab: "IIT Kanpur Testing Centre",
    city: "Kanpur",
    cats: "Water Heater, AC",
    tests: 130,
    revenue: 2145000,
    status: "Active",
  },
  {
    lab: "BIS Quality Services",
    city: "Hyderabad",
    cats: "Ceiling Fan, LED Bulb",
    tests: 210,
    revenue: 2352000,
    status: "In Progress",
  },
];

function LabLabWisePage() {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-semibold text-gray-700">
          LAB — Lab Wise Performance & Expenditure
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow className="bg-blue-50">
              {[
                "#",
                "Lab Name",
                "City",
                "Appliance Categories",
                "Tests Done",
                "Revenue Generated",
                "Status",
              ].map((h) => (
                <TableHead
                  key={h}
                  className="text-xs font-semibold text-gray-600"
                >
                  {h}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {labLabWiseData.map((r, i) => (
              <TableRow
                key={r.lab}
                className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}
              >
                <TableCell className="text-xs text-gray-500">{i + 1}</TableCell>
                <TableCell className="text-xs font-medium text-gray-800">
                  {r.lab}
                </TableCell>
                <TableCell className="text-xs text-gray-600">
                  {r.city}
                </TableCell>
                <TableCell className="text-xs text-gray-700">
                  {r.cats}
                </TableCell>
                <TableCell className="text-xs text-gray-700">
                  {r.tests}
                </TableCell>
                <TableCell className="text-xs font-semibold text-gray-800">
                  {fmt(r.revenue)}
                </TableCell>
                <TableCell>{statusBadge(r.status)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

const labVendorData = [
  {
    vendor: "Agilent Technologies India",
    cat: "Equipment Supplier",
    invoices: 6,
    total: 8400000,
    paid: 7200000,
  },
  {
    vendor: "Tektronix India Pvt Ltd",
    cat: "Test Instruments",
    invoices: 9,
    total: 5130000,
    paid: 5130000,
  },
  {
    vendor: "Anritsu India Pvt Ltd",
    cat: "Measurement Equipment",
    invoices: 5,
    total: 3750000,
    paid: 2800000,
  },
  {
    vendor: "Rs Components India",
    cat: "Consumables",
    invoices: 22,
    total: 2574000,
    paid: 2574000,
  },
  {
    vendor: "Mettler-Toledo India",
    cat: "Calibration Tools",
    invoices: 8,
    total: 1920000,
    paid: 1920000,
  },
  {
    vendor: "Yokogawa India Ltd",
    cat: "Data Loggers",
    invoices: 4,
    total: 2800000,
    paid: 1960000,
  },
];

function LabVendorWisePage() {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-semibold text-gray-700">
          LAB — Vendor Wise Summary
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow className="bg-blue-50">
              {[
                "#",
                "Vendor Name",
                "Category",
                "Invoices",
                "Total Amount",
                "Paid Amount",
                "Outstanding",
                "Status",
              ].map((h) => (
                <TableHead
                  key={h}
                  className="text-xs font-semibold text-gray-600"
                >
                  {h}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {labVendorData.map((r, i) => {
              const outstanding = r.total - r.paid;
              return (
                <TableRow
                  key={r.vendor}
                  className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}
                >
                  <TableCell className="text-xs text-gray-500">
                    {i + 1}
                  </TableCell>
                  <TableCell className="text-xs font-medium text-gray-800">
                    {r.vendor}
                  </TableCell>
                  <TableCell className="text-xs text-gray-600">
                    {r.cat}
                  </TableCell>
                  <TableCell className="text-xs text-gray-700">
                    {r.invoices}
                  </TableCell>
                  <TableCell className="text-xs font-semibold text-gray-800">
                    {fmt(r.total)}
                  </TableCell>
                  <TableCell className="text-xs text-green-700 font-medium">
                    {fmt(r.paid)}
                  </TableCell>
                  <TableCell
                    className="text-xs"
                    style={{ color: outstanding > 0 ? "#ea580c" : "#16a34a" }}
                  >
                    {fmt(outstanding)}
                  </TableCell>
                  <TableCell>
                    {statusBadge(outstanding === 0 ? "Paid" : "Pending")}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

const labBrandData = [
  {
    brand: "Voltas",
    cat: "Air Conditioner",
    lab: "CPRI Bangalore",
    models: 18,
    cost: 2700000,
    pass: 15,
    fail: 3,
  },
  {
    brand: "LG Electronics",
    cat: "Refrigerator",
    lab: "NABL Test Labs Pvt Ltd",
    models: 22,
    cost: 2420000,
    pass: 20,
    fail: 2,
  },
  {
    brand: "Samsung",
    cat: "Washing Machine",
    lab: "ERTL South India",
    models: 16,
    cost: 1760000,
    pass: 14,
    fail: 2,
  },
  {
    brand: "Havells",
    cat: "Ceiling Fan",
    lab: "BIS Quality Services",
    models: 30,
    cost: 840000,
    pass: 28,
    fail: 2,
  },
  {
    brand: "Philips",
    cat: "LED Bulb",
    lab: "National Physical Laboratory",
    models: 45,
    cost: 900000,
    pass: 43,
    fail: 2,
  },
  {
    brand: "Racold",
    cat: "Water Heater",
    lab: "ETDC Mumbai",
    models: 12,
    cost: 1140000,
    pass: 10,
    fail: 2,
  },
  {
    brand: "IFB",
    cat: "Washing Machine",
    lab: "ERTL South India",
    models: 11,
    cost: 1210000,
    pass: 10,
    fail: 1,
  },
];

function LabBrandWisePage() {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-semibold text-gray-700">
          LAB — Brand Wise Testing Summary
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow className="bg-blue-50">
              {[
                "#",
                "Brand",
                "Category",
                "Assigned Lab",
                "Models Tested",
                "Testing Cost",
                "Pass",
                "Fail",
                "Pass %",
              ].map((h) => (
                <TableHead
                  key={h}
                  className="text-xs font-semibold text-gray-600"
                >
                  {h}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {labBrandData.map((r, i) => {
              const passPct = Math.round((r.pass / r.models) * 100);
              return (
                <TableRow
                  key={`${r.brand}-${r.lab}`}
                  className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}
                >
                  <TableCell className="text-xs text-gray-500">
                    {i + 1}
                  </TableCell>
                  <TableCell className="text-xs font-medium text-gray-800">
                    {r.brand}
                  </TableCell>
                  <TableCell className="text-xs text-gray-600">
                    {r.cat}
                  </TableCell>
                  <TableCell className="text-xs text-gray-700">
                    {r.lab}
                  </TableCell>
                  <TableCell className="text-xs text-gray-700">
                    {r.models}
                  </TableCell>
                  <TableCell className="text-xs font-semibold text-gray-800">
                    {fmt(r.cost)}
                  </TableCell>
                  <TableCell className="text-xs text-green-700 font-semibold">
                    {r.pass}
                  </TableCell>
                  <TableCell className="text-xs text-red-600 font-semibold">
                    {r.fail}
                  </TableCell>
                  <TableCell className="text-xs">
                    <span
                      className={
                        passPct >= 90
                          ? "text-green-600 font-semibold"
                          : "text-orange-600 font-semibold"
                      }
                    >
                      {passPct}%
                    </span>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

interface Props {
  activePage: string;
  onNavigate: (page: string) => void;
}

export default function FinancialOfficialDashboard({ activePage }: Props) {
  const [selectedState, setSelectedState] = useState("All States");

  const pageTitle = PAGE_TITLES[activePage] || "Financial Monitoring Dashboard";

  const renderContent = () => {
    switch (activePage) {
      case "fin_bill":
        return <BillWisePage selectedState={selectedState} />;
      case "fin_appliance":
        return <AppliancePage selectedState={selectedState} />;
      case "fin_expenses":
        return <ExpensesPage />;
      case "fin_invoice":
        return <InvoicePage selectedState={selectedState} />;
      case "fin_lab":
        return <LabWisePage selectedState={selectedState} />;
      case "fin_vendor":
        return <VendorWisePage selectedState={selectedState} />;
      case "fin_brand":
        return <BrandWisePage selectedState={selectedState} />;
      // BEE section
      case "bee_summary":
        return <BeeSummaryPage />;
      case "bee_bill":
        return <BeeBillWisePage />;
      case "bee_appliance":
        return <BeeAppliancePage />;
      case "bee_expenses":
        return <BeeExpensesPage />;
      case "bee_invoice":
        return <BeeInvoicePage />;
      case "bee_lab":
        return <BeeLabWisePage />;
      case "bee_vendor":
        return <BeeVendorWisePage />;
      case "bee_brand":
        return <BeeBrandWisePage />;
      // LAB section
      case "lab_summary":
        return <LabSummaryPage />;
      case "lab_bill":
        return <LabBillWisePage />;
      case "lab_appliance":
        return <LabAppliancePage />;
      case "lab_expenses":
        return <LabExpensesPage />;
      case "lab_invoice":
        return <LabInvoicePage />;
      case "lab_lab":
        return <LabLabWisePage />;
      case "lab_vendor":
        return <LabVendorWisePage />;
      case "lab_brand":
        return <LabBrandWisePage />;
      default:
        return <SummaryPage selectedState={selectedState} />;
    }
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-800">
            Financial Monitoring Dashboard
          </h1>
          <p className="text-sm text-gray-500">
            {activePage.startsWith("bee_")
              ? "BEE"
              : activePage.startsWith("lab_")
                ? "LAB"
                : "State"}
            {" »"}{" "}
            <span className="font-medium text-orange-600">{pageTitle}</span>
          </p>
        </div>

        {/* State Filter — only shown for State section pages */}
        {activePage.startsWith("fin_") && (
          <div className="flex items-center gap-3">
            <span className="text-xs text-gray-500 font-medium">
              Filter by State:
            </span>
            <Select value={selectedState} onValueChange={setSelectedState}>
              <SelectTrigger
                className="w-48 h-9 text-xs border-orange-200 focus:ring-orange-300"
                data-ocid="fin.state.select"
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {INDIAN_STATES.map((s) => (
                  <SelectItem key={s} value={s} className="text-xs">
                    {s}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {selectedState !== "All States" && (
              <button
                type="button"
                onClick={() => setSelectedState("All States")}
                className="text-xs text-orange-600 hover:text-orange-700 underline"
              >
                Clear
              </button>
            )}
          </div>
        )}
      </div>

      {/* Content */}
      {renderContent()}
    </div>
  );
}

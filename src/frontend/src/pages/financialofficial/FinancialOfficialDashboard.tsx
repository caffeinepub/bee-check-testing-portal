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
const allSummaryData = [
  {
    state: "Rajasthan",
    sanctioned: 18500000,
    expenditure: 13200000,
    bills: 34,
    fy: "2023-24",
  },
  {
    state: "Maharashtra",
    sanctioned: 22000000,
    expenditure: 16800000,
    bills: 41,
    fy: "2023-24",
  },
  {
    state: "Delhi",
    sanctioned: 15000000,
    expenditure: 12000000,
    bills: 28,
    fy: "2023-24",
  },
  {
    state: "Uttar Pradesh",
    sanctioned: 25000000,
    expenditure: 17500000,
    bills: 47,
    fy: "2023-24",
  },
  {
    state: "Gujarat",
    sanctioned: 19500000,
    expenditure: 14300000,
    bills: 38,
    fy: "2023-24",
  },
  {
    state: "Madhya Pradesh",
    sanctioned: 16500000,
    expenditure: 11200000,
    bills: 29,
    fy: "2023-24",
  },
  {
    state: "Haryana",
    sanctioned: 13000000,
    expenditure: 9800000,
    bills: 22,
    fy: "2023-24",
  },
  {
    state: "Tamil Nadu",
    sanctioned: 20000000,
    expenditure: 15600000,
    bills: 36,
    fy: "2023-24",
  },
  {
    state: "Karnataka",
    sanctioned: 17500000,
    expenditure: 12900000,
    bills: 31,
    fy: "2023-24",
  },
  {
    state: "West Bengal",
    sanctioned: 14000000,
    expenditure: 9500000,
    bills: 25,
    fy: "2023-24",
  },
];

function SummaryPage({ selectedState }: { selectedState: string }) {
  const data =
    selectedState === "All States"
      ? allSummaryData
      : allSummaryData.filter((r) => r.state === selectedState);

  const totSanctioned = data.reduce((a, r) => a + r.sanctioned, 0);
  const totExpenditure = data.reduce((a, r) => a + r.expenditure, 0);
  const totBills = data.reduce((a, r) => a + r.bills, 0);

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {[
          {
            label: "Total Sanctioned",
            value: fmt(totSanctioned),
            color: "#1a3a6b",
          },
          {
            label: "Total Expenditure",
            value: fmt(totExpenditure),
            color: "#ea580c",
          },
          {
            label: "Balance Amount",
            value: fmt(totSanctioned - totExpenditure),
            color: "#16a34a",
          },
          { label: "No. of Bills", value: String(totBills), color: "#7c3aed" },
          {
            label: "Utilization %",
            value:
              totSanctioned > 0
                ? `${Math.round((totExpenditure / totSanctioned) * 100)}%`
                : "0%",
            color: "#0891b2",
          },
        ].map((k) => (
          <Card key={k.label} className="border shadow-sm">
            <CardContent className="pt-4 pb-3">
              <p className="text-xs text-gray-500 mb-1">{k.label}</p>
              <p className="text-lg font-bold" style={{ color: k.color }}>
                {k.value}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold text-gray-700">
            State-wise Summary
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-blue-50">
                <TableHead className="text-xs font-semibold text-gray-600">
                  #
                </TableHead>
                <TableHead className="text-xs font-semibold text-gray-600">
                  State
                </TableHead>
                <TableHead className="text-xs font-semibold text-gray-600">
                  Sanctioned Amount
                </TableHead>
                <TableHead className="text-xs font-semibold text-gray-600">
                  Expenditure
                </TableHead>
                <TableHead className="text-xs font-semibold text-gray-600">
                  Balance
                </TableHead>
                <TableHead className="text-xs font-semibold text-gray-600">
                  Bills
                </TableHead>
                <TableHead className="text-xs font-semibold text-gray-600">
                  Utilization %
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((r, i) => (
                <TableRow
                  key={r.state}
                  className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}
                >
                  <TableCell className="text-xs text-gray-500">
                    {i + 1}
                  </TableCell>
                  <TableCell className="text-xs font-medium text-gray-800">
                    {r.state}
                  </TableCell>
                  <TableCell className="text-xs text-gray-700">
                    {fmt(r.sanctioned)}
                  </TableCell>
                  <TableCell className="text-xs text-gray-700">
                    {fmt(r.expenditure)}
                  </TableCell>
                  <TableCell className="text-xs font-medium text-green-700">
                    {fmt(r.sanctioned - r.expenditure)}
                  </TableCell>
                  <TableCell className="text-xs text-gray-700">
                    {r.bills}
                  </TableCell>
                  <TableCell className="text-xs">
                    <div className="flex items-center gap-2">
                      <Progress
                        value={Math.round((r.expenditure / r.sanctioned) * 100)}
                        className="h-1.5 w-16"
                      />
                      <span className="text-gray-600">
                        {Math.round((r.expenditure / r.sanctioned) * 100)}%
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
};

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
            State »{" "}
            <span className="font-medium text-orange-600">{pageTitle}</span>
          </p>
        </div>

        {/* State Filter */}
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
      </div>

      {/* Active state indicator */}
      {selectedState !== "All States" && (
        <div
          className="px-4 py-2 rounded-lg text-xs font-medium flex items-center gap-2"
          style={{
            backgroundColor: "#fff7ed",
            border: "1px solid #fed7aa",
            color: "#9a3412",
          }}
        >
          <span className="w-2 h-2 rounded-full bg-orange-500" />
          Showing data for: <strong>{selectedState}</strong>
        </div>
      )}

      {/* Content */}
      {renderContent()}
    </div>
  );
}

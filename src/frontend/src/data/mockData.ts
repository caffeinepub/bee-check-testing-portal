export const applianceCategories = [
  { id: 1, name: "Air Conditioner" },
  { id: 2, name: "Refrigerator" },
  { id: 3, name: "Washing Machine" },
  { id: 4, name: "Ceiling Fan" },
  { id: 5, name: "LED Light" },
  { id: 6, name: "Geyser" },
];

export const brands = [
  { id: 1, name: "Samsung", categoryId: 1 },
  { id: 2, name: "LG", categoryId: 1 },
  { id: 3, name: "Voltas", categoryId: 1 },
  { id: 4, name: "Daikin", categoryId: 1 },
  { id: 5, name: "Whirlpool", categoryId: 2 },
  { id: 6, name: "Samsung", categoryId: 2 },
  { id: 7, name: "LG", categoryId: 2 },
  { id: 8, name: "Havells", categoryId: 4 },
  { id: 9, name: "Philips", categoryId: 5 },
  { id: 10, name: "Bajaj", categoryId: 4 },
];

export const states = [
  "Maharashtra",
  "Delhi",
  "Gujarat",
  "Rajasthan",
  "Tamil Nadu",
  "Karnataka",
  "Uttar Pradesh",
  "West Bengal",
  "Madhya Pradesh",
  "Telangana",
];

export const labs = [
  {
    id: 1,
    name: "NABL Lab Delhi",
    state: "Delhi",
    location: "New Delhi",
    percentage: 30,
  },
  {
    id: 2,
    name: "BIS Testing Lab Mumbai",
    state: "Maharashtra",
    location: "Mumbai",
    percentage: 25,
  },
  {
    id: 3,
    name: "CPRI Bangalore",
    state: "Karnataka",
    location: "Bangalore",
    percentage: 20,
  },
  {
    id: 4,
    name: "ETDC Chennai",
    state: "Tamil Nadu",
    location: "Chennai",
    percentage: 15,
  },
  {
    id: 5,
    name: "ERTL Kolkata",
    state: "West Bengal",
    location: "Kolkata",
    percentage: 10,
  },
];

export type SampleStatus =
  | "Blocked"
  | "Purchased"
  | "InTransit"
  | "SampleReceived"
  | "FitForTest"
  | "NotFitForTest"
  | "TestScheduled"
  | "InTesting"
  | "SampleTested"
  | "ReportUploaded"
  | "Approved"
  | "Rejected"
  | "FinalFailure";

export interface MockSample {
  id: number;
  categoryId: number;
  categoryName: string;
  brandName: string;
  modelNumber: string;
  starRating: number;
  state: string;
  status: SampleStatus;
  labId: number;
  labName: string;
  purchaserName: string;
  financialYear: string;
  purchaseDate?: string;
  invoiceAmount?: number;
  storeName?: string;
  testDate?: string;
  notFitReason?: string;
  remarks?: string;
}

export const mockSamples: MockSample[] = [
  {
    id: 1,
    categoryId: 1,
    categoryName: "Air Conditioner",
    brandName: "Samsung",
    modelNumber: "AC-5500-3S",
    starRating: 3,
    state: "Maharashtra",
    status: "Approved",
    labId: 1,
    labName: "NABL Lab Delhi",
    purchaserName: "Maharashtra SDA",
    financialYear: "2024-25",
    purchaseDate: "2024-04-10",
    invoiceAmount: 45000,
    storeName: "Croma Mumbai",
    testDate: "2024-05-01",
  },
  {
    id: 2,
    categoryId: 1,
    categoryName: "Air Conditioner",
    brandName: "Voltas",
    modelNumber: "VOL-2T-5S",
    starRating: 5,
    state: "Delhi",
    status: "InTesting",
    labId: 2,
    labName: "BIS Testing Lab Mumbai",
    purchaserName: "Delhi SDA",
    financialYear: "2024-25",
    purchaseDate: "2024-04-15",
    storeName: "Reliance Digital",
  },
  {
    id: 3,
    categoryId: 2,
    categoryName: "Refrigerator",
    brandName: "Whirlpool",
    modelNumber: "WHL-340L-4S",
    starRating: 4,
    state: "Gujarat",
    status: "TestScheduled",
    labId: 3,
    labName: "CPRI Bangalore",
    purchaserName: "Gujarat SDA",
    financialYear: "2024-25",
    purchaseDate: "2024-04-20",
    storeName: "Vijay Sales",
  },
  {
    id: 4,
    categoryId: 2,
    categoryName: "Refrigerator",
    brandName: "LG",
    modelNumber: "LG-GL-T292",
    starRating: 3,
    state: "Karnataka",
    status: "SampleReceived",
    labId: 3,
    labName: "CPRI Bangalore",
    purchaserName: "Karnataka SDA",
    financialYear: "2024-25",
    purchaseDate: "2024-04-22",
  },
  {
    id: 5,
    categoryId: 3,
    categoryName: "Washing Machine",
    brandName: "Samsung",
    modelNumber: "WM-6KG-5S",
    starRating: 5,
    state: "Tamil Nadu",
    status: "ReportUploaded",
    labId: 4,
    labName: "ETDC Chennai",
    purchaserName: "Tamil Nadu SDA",
    financialYear: "2024-25",
    purchaseDate: "2024-03-28",
    testDate: "2024-04-25",
  },
  {
    id: 6,
    categoryId: 4,
    categoryName: "Ceiling Fan",
    brandName: "Havells",
    modelNumber: "HV-FAN-1200",
    starRating: 5,
    state: "Rajasthan",
    status: "Purchased",
    labId: 1,
    labName: "NABL Lab Delhi",
    purchaserName: "Rajasthan SDA",
    financialYear: "2024-25",
    purchaseDate: "2024-05-02",
    storeName: "Metro Cash & Carry",
  },
  {
    id: 7,
    categoryId: 5,
    categoryName: "LED Light",
    brandName: "Philips",
    modelNumber: "PHL-LED-20W",
    starRating: 4,
    state: "Uttar Pradesh",
    status: "InTransit",
    labId: 1,
    labName: "NABL Lab Delhi",
    purchaserName: "UP SDA",
    financialYear: "2024-25",
    purchaseDate: "2024-05-05",
  },
  {
    id: 8,
    categoryId: 1,
    categoryName: "Air Conditioner",
    brandName: "Daikin",
    modelNumber: "DK-FTKF-35TV",
    starRating: 4,
    state: "West Bengal",
    status: "Blocked",
    labId: 2,
    labName: "BIS Testing Lab Mumbai",
    purchaserName: "WB SDA",
    financialYear: "2024-25",
  },
  {
    id: 9,
    categoryId: 2,
    categoryName: "Refrigerator",
    brandName: "Samsung",
    modelNumber: "SAM-RT42",
    starRating: 2,
    state: "Madhya Pradesh",
    status: "NotFitForTest",
    labId: 3,
    labName: "CPRI Bangalore",
    purchaserName: "MP SDA",
    financialYear: "2024-25",
    notFitReason: "Damaged Sample",
    remarks: "Product received with cracked casing",
  },
  {
    id: 10,
    categoryId: 3,
    categoryName: "Washing Machine",
    brandName: "LG",
    modelNumber: "LG-FHT1006",
    starRating: 3,
    state: "Telangana",
    status: "SampleTested",
    labId: 4,
    labName: "ETDC Chennai",
    purchaserName: "Telangana SDA",
    financialYear: "2024-25",
    testDate: "2024-04-30",
  },
  {
    id: 11,
    categoryId: 4,
    categoryName: "Ceiling Fan",
    brandName: "Bajaj",
    modelNumber: "BAJ-CREST-1200",
    starRating: 3,
    state: "Maharashtra",
    status: "Approved",
    labId: 2,
    labName: "BIS Testing Lab Mumbai",
    purchaserName: "Maharashtra SDA",
    financialYear: "2024-25",
    testDate: "2024-04-18",
  },
  {
    id: 12,
    categoryId: 6,
    categoryName: "Geyser",
    brandName: "Havells",
    modelNumber: "HV-GEY-25L",
    starRating: 4,
    state: "Delhi",
    status: "Rejected",
    labId: 1,
    labName: "NABL Lab Delhi",
    purchaserName: "Delhi SDA",
    financialYear: "2024-25",
  },
];

export interface MockReport {
  id: number;
  sampleId: number;
  categoryName: string;
  brandName: string;
  modelNumber: string;
  labName: string;
  state: string;
  result: "Pass" | "Fail";
  submittedAt: string;
  reviewStatus: "Pending" | "Approved" | "Rejected" | "Reverted";
  reviewRemarks?: string;
}

export const mockReports: MockReport[] = [
  {
    id: 1,
    sampleId: 1,
    categoryName: "Air Conditioner",
    brandName: "Samsung",
    modelNumber: "AC-5500-3S",
    labName: "NABL Lab Delhi",
    state: "Maharashtra",
    result: "Pass",
    submittedAt: "2024-05-05",
    reviewStatus: "Approved",
    reviewRemarks: "Compliance confirmed",
  },
  {
    id: 2,
    sampleId: 5,
    categoryName: "Washing Machine",
    brandName: "Samsung",
    modelNumber: "WM-6KG-5S",
    labName: "ETDC Chennai",
    state: "Tamil Nadu",
    result: "Pass",
    submittedAt: "2024-05-03",
    reviewStatus: "Pending",
  },
  {
    id: 3,
    sampleId: 10,
    categoryName: "Washing Machine",
    brandName: "LG",
    modelNumber: "LG-FHT1006",
    labName: "ETDC Chennai",
    state: "Telangana",
    result: "Fail",
    submittedAt: "2024-05-01",
    reviewStatus: "Pending",
  },
  {
    id: 4,
    sampleId: 11,
    categoryName: "Ceiling Fan",
    brandName: "Bajaj",
    modelNumber: "BAJ-CREST-1200",
    labName: "BIS Testing Lab Mumbai",
    state: "Maharashtra",
    result: "Pass",
    submittedAt: "2024-04-22",
    reviewStatus: "Approved",
  },
  {
    id: 5,
    sampleId: 12,
    categoryName: "Geyser",
    brandName: "Havells",
    modelNumber: "HV-GEY-25L",
    labName: "NABL Lab Delhi",
    state: "Delhi",
    result: "Fail",
    submittedAt: "2024-04-28",
    reviewStatus: "Rejected",
    reviewRemarks: "Non-compliance with BEE standards",
  },
  {
    id: 6,
    sampleId: 4,
    categoryName: "Refrigerator",
    brandName: "LG",
    modelNumber: "LG-GL-T292",
    labName: "CPRI Bangalore",
    state: "Karnataka",
    result: "Pass",
    submittedAt: "2024-05-07",
    reviewStatus: "Pending",
  },
  {
    id: 7,
    sampleId: 3,
    categoryName: "Refrigerator",
    brandName: "Whirlpool",
    modelNumber: "WHL-340L-4S",
    labName: "CPRI Bangalore",
    state: "Gujarat",
    result: "Pass",
    submittedAt: "2024-05-08",
    reviewStatus: "Pending",
  },
];

export const mockTargets = [
  {
    id: 1,
    state: "Maharashtra",
    categoryName: "Air Conditioner",
    starRating: 3,
    quantity: 10,
    assigned: "Maharashtra SDA",
    financialYear: "2024-25",
    status: "Active",
    purchased: 7,
  },
  {
    id: 2,
    state: "Delhi",
    categoryName: "Air Conditioner",
    starRating: 5,
    quantity: 8,
    assigned: "Delhi SDA",
    financialYear: "2024-25",
    status: "Active",
    purchased: 5,
  },
  {
    id: 3,
    state: "Gujarat",
    categoryName: "Refrigerator",
    starRating: 4,
    quantity: 12,
    assigned: "Gujarat SDA",
    financialYear: "2024-25",
    status: "Active",
    purchased: 9,
  },
  {
    id: 4,
    state: "Karnataka",
    categoryName: "Washing Machine",
    starRating: 3,
    quantity: 6,
    assigned: "Karnataka SDA",
    financialYear: "2024-25",
    status: "Active",
    purchased: 3,
  },
  {
    id: 5,
    state: "Tamil Nadu",
    categoryName: "Ceiling Fan",
    starRating: 5,
    quantity: 15,
    assigned: "TN SDA",
    financialYear: "2024-25",
    status: "Active",
    purchased: 11,
  },
  {
    id: 6,
    state: "Rajasthan",
    categoryName: "LED Light",
    starRating: 4,
    quantity: 20,
    assigned: "Rajasthan SDA",
    financialYear: "2024-25",
    status: "Active",
    purchased: 14,
  },
  {
    id: 7,
    state: "Uttar Pradesh",
    categoryName: "Geyser",
    starRating: 4,
    quantity: 8,
    assigned: "UP SDA",
    financialYear: "2024-25",
    status: "Active",
    purchased: 2,
  },
  {
    id: 8,
    state: "West Bengal",
    categoryName: "Air Conditioner",
    starRating: 4,
    quantity: 10,
    assigned: "WB SDA",
    financialYear: "2024-25",
    status: "Active",
    purchased: 6,
  },
];

export const mockFinancials = [
  {
    state: "Maharashtra",
    totalApproved: 2500000,
    released: 1800000,
    balance: 700000,
    instalments: [
      { no: 1, amount: 800000, date: "2024-04-01", status: "Released" },
      { no: 2, amount: 600000, date: "2024-07-01", status: "Released" },
      { no: 3, amount: 400000, date: "2024-10-01", status: "Released" },
      { no: 4, amount: 700000, date: "2025-01-01", status: "Pending" },
    ],
  },
  {
    state: "Delhi",
    totalApproved: 1800000,
    released: 1200000,
    balance: 600000,
    instalments: [
      { no: 1, amount: 600000, date: "2024-04-01", status: "Released" },
      { no: 2, amount: 400000, date: "2024-07-01", status: "Released" },
      { no: 3, amount: 200000, date: "2024-10-01", status: "Released" },
      { no: 4, amount: 600000, date: "2025-01-01", status: "Pending" },
    ],
  },
  {
    state: "Gujarat",
    totalApproved: 2000000,
    released: 1500000,
    balance: 500000,
    instalments: [
      { no: 1, amount: 700000, date: "2024-04-01", status: "Released" },
      { no: 2, amount: 500000, date: "2024-07-01", status: "Released" },
      { no: 3, amount: 300000, date: "2024-10-01", status: "Released" },
      { no: 4, amount: 500000, date: "2025-01-01", status: "Pending" },
    ],
  },
  {
    state: "Rajasthan",
    totalApproved: 1500000,
    released: 800000,
    balance: 700000,
    instalments: [
      { no: 1, amount: 500000, date: "2024-04-01", status: "Released" },
      { no: 2, amount: 300000, date: "2024-07-01", status: "Released" },
      { no: 3, amount: 700000, date: "2024-10-01", status: "Pending" },
    ],
  },
  {
    state: "Tamil Nadu",
    totalApproved: 2200000,
    released: 1600000,
    balance: 600000,
    instalments: [
      { no: 1, amount: 800000, date: "2024-04-01", status: "Released" },
      { no: 2, amount: 500000, date: "2024-07-01", status: "Released" },
      { no: 3, amount: 300000, date: "2024-10-01", status: "Released" },
      { no: 4, amount: 600000, date: "2025-01-01", status: "Pending" },
    ],
  },
];

export const mockOfficialPerformance = [
  {
    user: "U1 - Anil Sharma",
    category: "Air Conditioner",
    total: 18,
    approved: 12,
    rejected: 2,
    pending: 4,
    maxDaysPending: 5,
  },
  {
    user: "U2 - Priya Mehta",
    category: "Refrigerator",
    total: 14,
    approved: 10,
    rejected: 1,
    pending: 3,
    maxDaysPending: 3,
  },
  {
    user: "U3 - Ramesh Kumar",
    category: "Washing Machine",
    total: 9,
    approved: 6,
    rejected: 0,
    pending: 3,
    maxDaysPending: 8,
  },
  {
    user: "U4 - Sunita Rao",
    category: "Ceiling Fan",
    total: 11,
    approved: 8,
    rejected: 2,
    pending: 1,
    maxDaysPending: 2,
  },
  {
    user: "U5 - Vijay Patel",
    category: "LED Light",
    total: 7,
    approved: 5,
    rejected: 1,
    pending: 1,
    maxDaysPending: 4,
  },
];

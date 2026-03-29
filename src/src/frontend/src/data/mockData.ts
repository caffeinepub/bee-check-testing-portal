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

// ── New Lab Status Sequence ──────────────────────────────────────────────────
export type LabTrackingStatus =
  | "InTransit"
  | "ReachedLab"
  | "TestScheduled"
  | "UnderTesting"
  | "TestDone"
  | "Pass"
  | "Fail"
  | "NFT"
  | "InvoiceRaised";

// Test path: full testing sequence ending with Invoice Raised
export const LAB_STATUS_SEQUENCE_TEST: LabTrackingStatus[] = [
  "InTransit",
  "ReachedLab",
  "TestScheduled",
  "UnderTesting",
  "TestDone",
  "InvoiceRaised",
];

// NFT path: sample declared Not Fit for Test — terminal, no further steps
export const LAB_STATUS_SEQUENCE_NFT: LabTrackingStatus[] = [
  "InTransit",
  "ReachedLab",
  "NFT",
];

// NFT after TestScheduled path
export const LAB_STATUS_SEQUENCE_NFT_FROM_SCHEDULED: LabTrackingStatus[] = [
  "InTransit",
  "ReachedLab",
  "TestScheduled",
  "NFT",
];

// Pass path
export const LAB_STATUS_SEQUENCE_PASS: LabTrackingStatus[] = [
  "InTransit",
  "ReachedLab",
  "TestScheduled",
  "UnderTesting",
  "TestDone",
  "Pass",
  "InvoiceRaised",
];

// Fail path
export const LAB_STATUS_SEQUENCE_FAIL: LabTrackingStatus[] = [
  "InTransit",
  "ReachedLab",
  "TestScheduled",
  "UnderTesting",
  "TestDone",
  "Fail",
  "InvoiceRaised",
];

// LAB_STATUS_SEQUENCE points to test path for backward compatibility
export const LAB_STATUS_SEQUENCE = LAB_STATUS_SEQUENCE_TEST;

export function getPathForSample(sample: LabSample): LabTrackingStatus[] {
  const hasNFT = sample.statusLog.some((e) => e.status === "NFT");
  const hasTestScheduled = sample.statusLog.some(
    (e) => e.status === "TestScheduled",
  );
  const hasPass =
    sample.statusLog.some((e) => e.status === "Pass") ||
    sample.currentStatus === "Pass";
  const hasFail =
    sample.statusLog.some((e) => e.status === "Fail") ||
    sample.currentStatus === "Fail";
  if (hasNFT && !hasTestScheduled) return LAB_STATUS_SEQUENCE_NFT;
  if (hasNFT && hasTestScheduled) return LAB_STATUS_SEQUENCE_NFT_FROM_SCHEDULED;
  if (hasPass) return LAB_STATUS_SEQUENCE_PASS;
  if (hasFail) return LAB_STATUS_SEQUENCE_FAIL;
  return LAB_STATUS_SEQUENCE_TEST;
}

export const LAB_STATUS_LABELS: Record<LabTrackingStatus, string> = {
  InTransit: "In-Transit",
  ReachedLab: "Reached Lab",
  TestScheduled: "Test Scheduled",
  UnderTesting: "Under Testing",
  TestDone: "Test Done",
  Pass: "Pass",
  Fail: "Fail",
  NFT: "NFT (Not Fit for Test)",
  InvoiceRaised: "Invoice Raised",
};

export const HAS_ATTACHMENT: Record<LabTrackingStatus, boolean> = {
  InTransit: false,
  ReachedLab: false,
  TestScheduled: false,
  UnderTesting: false,
  TestDone: false,
  Pass: true,
  Fail: true,
  NFT: true,
  InvoiceRaised: true,
};

// Terminal statuses — no further actions after these
export const TERMINAL_LAB_STATUSES: LabTrackingStatus[] = [
  "NFT",
  "InvoiceRaised",
];

// Test Report entry (Pass/Fail/NFT cases forwarded to BEE Official)
export interface TestReportEntry {
  sampleId: number;
  categoryName: string;
  brandName: string;
  modelNumber: string;
  starRating: number;
  state: string;
  labName: string;
  finalStatus: "Pass" | "Fail" | "NFT";
  date: string;
  remarks?: string;
  documents: { name: string; type: string }[];
  beeVerificationStatus: "Pending" | "Verified" | "SendBack";
}

export const testReportEntries: TestReportEntry[] = [
  {
    sampleId: 1,
    categoryName: "Air Conditioner",
    brandName: "Samsung",
    modelNumber: "AC-5500-3S",
    starRating: 3,
    state: "Maharashtra",
    labName: "NABL Lab Delhi",
    finalStatus: "Pass",
    date: "2024-05-01",
    remarks: "All energy efficiency parameters met. Star rating confirmed.",
    documents: [
      { name: "Samsung_AC5500_StarLabel.png", type: "Star Label Image" },
      {
        name: "Samsung_AC5500_ApplianceFront.jpg",
        type: "Appliance Photo - Front",
      },
      {
        name: "Samsung_AC5500_ApplianceBack.jpg",
        type: "Appliance Photo - Back",
      },
      { name: "Samsung_AC5500_NamePlate.jpg", type: "Name Plate Photo" },
      { name: "Samsung_AC5500_TestReport.pdf", type: "Test Report" },
    ],
    beeVerificationStatus: "Verified",
  },
  {
    sampleId: 10,
    categoryName: "Washing Machine",
    brandName: "LG",
    modelNumber: "LG-FHT1006",
    starRating: 3,
    state: "Telangana",
    labName: "ETDC Chennai",
    finalStatus: "Fail",
    date: "2024-05-01",
    remarks:
      "Energy consumption exceeded BEE threshold. Does not qualify for star rating.",
    documents: [
      {
        name: "LG_FHT1006_ApplianceFront.jpg",
        type: "Appliance Photo - Front",
      },
      { name: "LG_FHT1006_NamePlate.jpg", type: "Name Plate Photo" },
      { name: "LG_FHT1006_TestReport.pdf", type: "Test Report" },
    ],
    beeVerificationStatus: "Pending",
  },
  {
    sampleId: 12,
    categoryName: "Geyser",
    brandName: "Havells",
    modelNumber: "HV-GEY-25L",
    starRating: 4,
    state: "Delhi",
    labName: "NABL Lab Delhi",
    finalStatus: "NFT",
    date: "2024-04-14",
    remarks:
      "2 units declared not fit for test due to electrical defect. Physical damage observed.",
    documents: [
      { name: "NFT_Havells_Geyser_Evidence.pdf", type: "NFT Evidence" },
    ],
    beeVerificationStatus: "Pending",
  },
];

export interface StatusLogEntry {
  status: LabTrackingStatus;
  date: string;
  remarks?: string;
  attachmentName?: string;
}

export interface LabSample {
  id: number;
  categoryName: string;
  brandName: string;
  modelNumber: string;
  starRating: number;
  state: string;
  labId: number;
  labName: string;
  purchaserName: string;
  currentStatus: LabTrackingStatus;
  statusLog: StatusLogEntry[];
}

export interface RevertedSample {
  id: number;
  categoryName: string;
  brandName: string;
  modelNumber: string;
  starRating: number;
  state: string;
  returnReason: string;
  returnDate: string;
}

export const labSamples: LabSample[] = [
  {
    id: 1,
    categoryName: "Air Conditioner",
    brandName: "Samsung",
    modelNumber: "AC-5500-3S",
    starRating: 3,
    state: "Maharashtra",
    labId: 1,
    labName: "NABL Lab Delhi",
    purchaserName: "Maharashtra SDA",
    currentStatus: "InvoiceRaised",
    statusLog: [
      {
        status: "InTransit",
        date: "2024-04-10",
        remarks: "Sample dispatched from Croma Mumbai",
      },
      {
        status: "ReachedLab",
        date: "2024-04-13",
        remarks: "Sample received at NABL Lab Delhi",
      },
      {
        status: "TestScheduled",
        date: "2024-04-15",
        remarks: "Test scheduled with Eng. Sharma",
      },
      {
        status: "UnderTesting",
        date: "2024-04-18",
        remarks: "Testing commenced",
      },
      {
        status: "TestDone",
        date: "2024-04-28",
        remarks: "All tests completed, results collated",
      },
      {
        status: "Pass",
        date: "2024-05-01",
        remarks: "Test passed. All parameters within BEE standards.",
        attachmentName: "Samsung_AC5500_TestReport.pdf",
      },
      {
        status: "InvoiceRaised",
        date: "2024-05-05",
        remarks: "Invoice raised for testing services",
        attachmentName: "Invoice_NABL_001.pdf",
      },
    ],
  },
  {
    id: 14,
    categoryName: "Air Conditioner",
    brandName: "Hitachi",
    modelNumber: "HIT-RAU318HVDO",
    starRating: 3,
    state: "Rajasthan",
    labId: 1,
    labName: "NABL Lab Delhi",
    purchaserName: "Rajasthan SDA",
    currentStatus: "Pass",
    statusLog: [
      {
        status: "InTransit",
        date: "2024-04-05",
        remarks: "Dispatched from Jaipur",
      },
      {
        status: "ReachedLab",
        date: "2024-04-08",
        remarks: "Received in good condition",
      },
      {
        status: "TestScheduled",
        date: "2024-04-10",
        remarks: "Test slot allocated",
      },
      {
        status: "UnderTesting",
        date: "2024-04-14",
        remarks: "Testing in progress",
      },
      { status: "TestDone", date: "2024-04-25", remarks: "Testing completed" },
      {
        status: "Pass",
        date: "2024-04-28",
        remarks: "All tests passed. Report confirmed by lab.",
        attachmentName: "Hitachi_RAU318_TestReport.pdf",
      },
    ],
  },
  {
    id: 7,
    categoryName: "LED Light",
    brandName: "Philips",
    modelNumber: "PHL-LED-20W",
    starRating: 4,
    state: "Uttar Pradesh",
    labId: 1,
    labName: "NABL Lab Delhi",
    purchaserName: "UP SDA",
    currentStatus: "InTransit",
    statusLog: [
      {
        status: "InTransit",
        date: "2024-05-05",
        remarks: "Sample dispatched from Lucknow",
      },
    ],
  },
  {
    id: 25,
    categoryName: "Geyser",
    brandName: "Racold",
    modelNumber: "RAC-PRONTO-25L",
    starRating: 4,
    state: "Uttar Pradesh",
    labId: 1,
    labName: "NABL Lab Delhi",
    purchaserName: "UP SDA",
    currentStatus: "ReachedLab",
    statusLog: [
      { status: "InTransit", date: "2024-05-06", remarks: "Sample dispatched" },
      {
        status: "ReachedLab",
        date: "2024-05-09",
        remarks: "Sample received at lab",
      },
    ],
  },
  {
    id: 6,
    categoryName: "Ceiling Fan",
    brandName: "Havells",
    modelNumber: "HV-FAN-1200",
    starRating: 5,
    state: "Rajasthan",
    labId: 1,
    labName: "NABL Lab Delhi",
    purchaserName: "Rajasthan SDA",
    currentStatus: "UnderTesting",
    statusLog: [
      {
        status: "InTransit",
        date: "2024-05-02",
        remarks: "Dispatched from Metro Cash & Carry",
      },
      { status: "ReachedLab", date: "2024-05-04", remarks: "Sample received" },
      {
        status: "TestScheduled",
        date: "2024-05-06",
        remarks: "Test scheduled",
      },
      {
        status: "UnderTesting",
        date: "2024-05-08",
        remarks: "Energy efficiency testing started",
      },
    ],
  },
  {
    id: 16,
    categoryName: "Refrigerator",
    brandName: "Haier",
    modelNumber: "HAI-HRB-3654",
    starRating: 4,
    state: "Delhi",
    labId: 1,
    labName: "NABL Lab Delhi",
    purchaserName: "Delhi SDA",
    currentStatus: "TestDone",
    statusLog: [
      {
        status: "InTransit",
        date: "2024-03-30",
        remarks: "Sample dispatched from Delhi retailer",
      },
      { status: "ReachedLab", date: "2024-04-01", remarks: "Received" },
      {
        status: "TestScheduled",
        date: "2024-04-03",
        remarks: "Test slot assigned",
      },
      {
        status: "UnderTesting",
        date: "2024-04-07",
        remarks: "Tests commenced",
      },
      {
        status: "TestDone",
        date: "2024-04-22",
        remarks: "All tests done, report being prepared",
      },
    ],
  },
  {
    id: 12,
    categoryName: "Geyser",
    brandName: "Havells",
    modelNumber: "HV-GEY-25L",
    starRating: 4,
    state: "Delhi",
    labId: 1,
    labName: "NABL Lab Delhi",
    purchaserName: "Delhi SDA",
    // NFT declared directly after Reached Lab — terminal status
    currentStatus: "NFT",
    statusLog: [
      {
        status: "InTransit",
        date: "2024-04-10",
        remarks: "Dispatched from Delhi",
      },
      { status: "ReachedLab", date: "2024-04-12", remarks: "Sample received" },
      {
        status: "NFT",
        date: "2024-04-14",
        remarks: "2 units declared not fit for test due to electrical defect",
        attachmentName: "NFT_Havells_Geyser_Evidence.pdf",
      },
    ],
  },
];

export const revertedFromBEE: RevertedSample[] = [
  {
    id: 101,
    categoryName: "Air Conditioner",
    brandName: "Voltas",
    modelNumber: "VOL-2T-5S",
    starRating: 5,
    state: "Delhi",
    returnReason: "Label Mismatch",
    returnDate: "2024-05-10",
  },
  {
    id: 102,
    categoryName: "Washing Machine",
    brandName: "LG",
    modelNumber: "LG-FHT1006",
    starRating: 3,
    state: "Telangana",
    returnReason: "Incomplete Documentation",
    returnDate: "2024-05-08",
  },
  {
    id: 103,
    categoryName: "Refrigerator",
    brandName: "Godrej",
    modelNumber: "GOD-RT-2314",
    starRating: 3,
    state: "Tamil Nadu",
    returnReason: "Wrong Model Sent",
    returnDate: "2024-05-06",
  },
  {
    id: 104,
    categoryName: "LED Light",
    brandName: "Syska",
    modelNumber: "SSK-LED-15W",
    starRating: 3,
    state: "Karnataka",
    returnReason: "Test Certificate Expired",
    returnDate: "2024-05-04",
  },
];

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
  // ── Air Conditioner ──────────────────────────────────────────────────
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
    id: 13,
    categoryId: 1,
    categoryName: "Air Conditioner",
    brandName: "LG",
    modelNumber: "LG-KS-Q18ENXA",
    starRating: 4,
    state: "Gujarat",
    status: "InTesting",
    labId: 3,
    labName: "CPRI Bangalore",
    purchaserName: "Gujarat SDA",
    financialYear: "2024-25",
    purchaseDate: "2024-04-18",
  },
  {
    id: 14,
    categoryId: 1,
    categoryName: "Air Conditioner",
    brandName: "Hitachi",
    modelNumber: "HIT-RAU318HVDO",
    starRating: 3,
    state: "Rajasthan",
    status: "Approved",
    labId: 1,
    labName: "NABL Lab Delhi",
    purchaserName: "Rajasthan SDA",
    financialYear: "2024-25",
    purchaseDate: "2024-04-05",
    testDate: "2024-04-28",
  },
  {
    id: 15,
    categoryId: 1,
    categoryName: "Air Conditioner",
    brandName: "Samsung",
    modelNumber: "AC-6500-5S",
    starRating: 5,
    state: "Karnataka",
    status: "ReportUploaded",
    labId: 3,
    labName: "CPRI Bangalore",
    purchaserName: "Karnataka SDA",
    financialYear: "2024-25",
    purchaseDate: "2024-04-22",
    testDate: "2024-05-10",
  },
  // ── Refrigerator ─────────────────────────────────────────────────────
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
    id: 16,
    categoryId: 2,
    categoryName: "Refrigerator",
    brandName: "Haier",
    modelNumber: "HAI-HRB-3654",
    starRating: 4,
    state: "Delhi",
    status: "Approved",
    labId: 1,
    labName: "NABL Lab Delhi",
    purchaserName: "Delhi SDA",
    financialYear: "2024-25",
    purchaseDate: "2024-03-30",
    testDate: "2024-04-25",
  },
  {
    id: 17,
    categoryId: 2,
    categoryName: "Refrigerator",
    brandName: "Godrej",
    modelNumber: "GOD-RT-2314",
    starRating: 3,
    state: "Tamil Nadu",
    status: "InTesting",
    labId: 4,
    labName: "ETDC Chennai",
    purchaserName: "Tamil Nadu SDA",
    financialYear: "2024-25",
    purchaseDate: "2024-04-28",
  },
  // ── Washing Machine ──────────────────────────────────────────────────
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
    id: 18,
    categoryId: 3,
    categoryName: "Washing Machine",
    brandName: "IFB",
    modelNumber: "IFB-SEN-6510",
    starRating: 5,
    state: "Maharashtra",
    status: "InTesting",
    labId: 2,
    labName: "BIS Testing Lab Mumbai",
    purchaserName: "Maharashtra SDA",
    financialYear: "2024-25",
    purchaseDate: "2024-04-14",
  },
  {
    id: 19,
    categoryId: 3,
    categoryName: "Washing Machine",
    brandName: "Bosch",
    modelNumber: "BOS-WAJ28062",
    starRating: 4,
    state: "Uttar Pradesh",
    status: "Purchased",
    labId: 1,
    labName: "NABL Lab Delhi",
    purchaserName: "UP SDA",
    financialYear: "2024-25",
    purchaseDate: "2024-05-02",
  },
  // ── Ceiling Fan ──────────────────────────────────────────────────────
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
    id: 20,
    categoryId: 4,
    categoryName: "Ceiling Fan",
    brandName: "Orient",
    modelNumber: "ORI-PSPO-48",
    starRating: 4,
    state: "West Bengal",
    status: "InTesting",
    labId: 5,
    labName: "ERTL Kolkata",
    purchaserName: "WB SDA",
    financialYear: "2024-25",
    purchaseDate: "2024-04-20",
  },
  {
    id: 21,
    categoryId: 4,
    categoryName: "Ceiling Fan",
    brandName: "Crompton",
    modelNumber: "CRM-HIFLO-48",
    starRating: 3,
    state: "Gujarat",
    status: "Rejected",
    labId: 3,
    labName: "CPRI Bangalore",
    purchaserName: "Gujarat SDA",
    financialYear: "2024-25",
    testDate: "2024-05-03",
  },
  // ── LED Light ────────────────────────────────────────────────────────
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
    id: 22,
    categoryId: 5,
    categoryName: "LED Light",
    brandName: "Syska",
    modelNumber: "SSK-LED-15W",
    starRating: 3,
    state: "Karnataka",
    status: "Approved",
    labId: 3,
    labName: "CPRI Bangalore",
    purchaserName: "Karnataka SDA",
    financialYear: "2024-25",
    purchaseDate: "2024-04-08",
    testDate: "2024-05-02",
  },
  {
    id: 23,
    categoryId: 5,
    categoryName: "LED Light",
    brandName: "Havells",
    modelNumber: "HV-LED-12W",
    starRating: 4,
    state: "Telangana",
    status: "InTesting",
    labId: 4,
    labName: "ETDC Chennai",
    purchaserName: "Telangana SDA",
    financialYear: "2024-25",
    purchaseDate: "2024-04-25",
  },
  // ── Geyser ───────────────────────────────────────────────────────────
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
  {
    id: 24,
    categoryId: 6,
    categoryName: "Geyser",
    brandName: "A.O. Smith",
    modelNumber: "AOS-HSE-SHS-025",
    starRating: 5,
    state: "Maharashtra",
    status: "Approved",
    labId: 2,
    labName: "BIS Testing Lab Mumbai",
    purchaserName: "Maharashtra SDA",
    financialYear: "2024-25",
    purchaseDate: "2024-03-25",
    testDate: "2024-04-20",
  },
  {
    id: 25,
    categoryId: 6,
    categoryName: "Geyser",
    brandName: "Racold",
    modelNumber: "RAC-PRONTO-25L",
    starRating: 4,
    state: "Uttar Pradesh",
    status: "InTransit",
    labId: 1,
    labName: "NABL Lab Delhi",
    purchaserName: "UP SDA",
    financialYear: "2024-25",
    purchaseDate: "2024-05-06",
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

// ── 7 reports for BEE Official dashboard (one official's view)
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
    quantity: 40,
    assigned: "Maharashtra SDA",
    financialYear: "2024-25",
    status: "Active",
    purchased: 11,
  },
  {
    id: 2,
    state: "Delhi",
    categoryName: "Air Conditioner",
    starRating: 5,
    quantity: 30,
    assigned: "Delhi SDA",
    financialYear: "2024-25",
    status: "Active",
    purchased: 9,
  },
  {
    id: 3,
    state: "Gujarat",
    categoryName: "Refrigerator",
    starRating: 4,
    quantity: 35,
    assigned: "Gujarat SDA",
    financialYear: "2024-25",
    status: "Active",
    purchased: 13,
  },
  {
    id: 4,
    state: "Karnataka",
    categoryName: "Washing Machine",
    starRating: 3,
    quantity: 20,
    assigned: "Karnataka SDA",
    financialYear: "2024-25",
    status: "Active",
    purchased: 7,
  },
  {
    id: 5,
    state: "Tamil Nadu",
    categoryName: "Ceiling Fan",
    starRating: 5,
    quantity: 35,
    assigned: "Tamil Nadu SDA",
    financialYear: "2024-25",
    status: "Active",
    purchased: 12,
  },
  {
    id: 6,
    state: "Rajasthan",
    categoryName: "LED Light",
    starRating: 4,
    quantity: 40,
    assigned: "Rajasthan SDA",
    financialYear: "2024-25",
    status: "Active",
    purchased: 9,
  },
  {
    id: 7,
    state: "Uttar Pradesh",
    categoryName: "Geyser",
    starRating: 4,
    quantity: 25,
    assigned: "UP SDA",
    financialYear: "2024-25",
    status: "Active",
    purchased: 4,
  },
  {
    id: 8,
    state: "West Bengal",
    categoryName: "Air Conditioner",
    starRating: 4,
    quantity: 20,
    assigned: "WB SDA",
    financialYear: "2024-25",
    status: "Active",
    purchased: 2,
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
    user: "U1 - Official A",
    category: "Air Conditioner",
    total: 19,
    approved: 12,
    rejected: 2,
    pending: 5,
    maxDaysPending: 5,
  },
  {
    user: "U2 - Official B",
    category: "Refrigerator",
    total: 14,
    approved: 10,
    rejected: 1,
    pending: 3,
    maxDaysPending: 3,
  },
  {
    user: "U3 - Official C",
    category: "Washing Machine",
    total: 13,
    approved: 4,
    rejected: 2,
    pending: 7,
    maxDaysPending: 8,
  },
  {
    user: "U4 - Official D",
    category: "Ceiling Fan",
    total: 12,
    approved: 8,
    rejected: 2,
    pending: 2,
    maxDaysPending: 2,
  },
  {
    user: "U5 - Official E",
    category: "LED Light",
    total: 9,
    approved: 5,
    rejected: 1,
    pending: 3,
    maxDaysPending: 4,
  },
];

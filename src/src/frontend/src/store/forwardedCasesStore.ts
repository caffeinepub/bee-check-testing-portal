// Shared module-level store for cases forwarded from BEE Official to Director

export interface AttachedDocument {
  id: number;
  name: string;
  type: string;
  size: string;
  uploadedBy: string;
  uploadedAt: string;
  description: string;
}

export interface ForwardedCase {
  reportId: number;
  appliance: string;
  brand: string;
  model: string;
  stars: number;
  official: string;
  approvalDate: string;
  lab: string;
  testResult: "Pass" | "Fail";
  status: "Pending Review" | "Director Approved" | "Sent Back";
  remark: string;
  attachedDocuments: AttachedDocument[];
  forwardedBy: string;
  forwardedAt: string;
  forwardingNote: string;
  /** True when this is a 2nd Check Test mismatch case */
  is2ndCheck?: boolean;
}

let _cases: ForwardedCase[] = [
  {
    reportId: 1,
    appliance: "Air Conditioner",
    brand: "Samsung",
    model: "AC-5500-3S",
    stars: 3,
    official: "BEE Official A",
    approvalDate: "05-May-2024",
    lab: "NABL Lab Delhi",
    testResult: "Pass",
    status: "Pending Review",
    remark: "",
    forwardedBy: "BEE Official A",
    forwardedAt: "06-May-2024 10:30 AM",
    forwardingNote:
      "Test report reviewed and verified. All energy efficiency parameters are within BEE norms. Compliance checklist attached. Forwarding for Director final approval.",
    attachedDocuments: [
      {
        id: 101,
        name: "BEE_TestReport_AC5500.pdf",
        type: "PDF",
        size: "2.4 MB",
        uploadedBy: "Test Lab",
        uploadedAt: "03-May-2024",
        description:
          "Complete test report from NABL Lab Delhi for Samsung AC-5500-3S",
      },
      {
        id: 102,
        name: "Energy_Efficiency_Certificate.pdf",
        type: "PDF",
        size: "1.1 MB",
        uploadedBy: "Test Lab",
        uploadedAt: "03-May-2024",
        description: "Energy efficiency certification document issued by NABL",
      },
      {
        id: 103,
        name: "Lab_Test_Summary.xlsx",
        type: "XLSX",
        size: "890 KB",
        uploadedBy: "Test Lab",
        uploadedAt: "04-May-2024",
        description: "Detailed test parameter summary spreadsheet",
      },
      {
        id: 104,
        name: "Official_Review_Note.docx",
        type: "DOCX",
        size: "340 KB",
        uploadedBy: "BEE Official",
        uploadedAt: "06-May-2024",
        description: "BEE Official review observations and compliance notes",
      },
      {
        id: 105,
        name: "Compliance_Checklist.pdf",
        type: "PDF",
        size: "560 KB",
        uploadedBy: "BEE Official",
        uploadedAt: "06-May-2024",
        description: "Completed BEE compliance verification checklist",
      },
    ],
  },
  {
    reportId: 4,
    appliance: "Ceiling Fan",
    brand: "Bajaj",
    model: "BAJ-CREST-1200",
    stars: 4,
    official: "BEE Official B",
    approvalDate: "22-Apr-2024",
    lab: "BIS Testing Lab Mumbai",
    testResult: "Pass",
    status: "Pending Review",
    remark: "",
    forwardedBy: "BEE Official B",
    forwardedAt: "23-Apr-2024 02:15 PM",
    forwardingNote:
      "Ceiling fan test report reviewed. BIS lab certification is valid. Star rating of 4 is confirmed as per energy consumption data. Forwarding for final Director sign-off.",
    attachedDocuments: [
      {
        id: 201,
        name: "BIS_TestReport_BajajCrest.pdf",
        type: "PDF",
        size: "3.2 MB",
        uploadedBy: "Test Lab",
        uploadedAt: "20-Apr-2024",
        description:
          "BIS certified test report for Bajaj BAJ-CREST-1200 ceiling fan",
      },
      {
        id: 202,
        name: "CeilingFan_Energy_Audit.xlsx",
        type: "XLSX",
        size: "720 KB",
        uploadedBy: "Test Lab",
        uploadedAt: "21-Apr-2024",
        description: "Energy consumption audit data at various RPM settings",
      },
      {
        id: 203,
        name: "StarRating_Verification_Note.docx",
        type: "DOCX",
        size: "280 KB",
        uploadedBy: "BEE Official",
        uploadedAt: "23-Apr-2024",
        description:
          "Official verification note confirming 4-star rating compliance",
      },
      {
        id: 204,
        name: "Official_Forwarding_Note.pdf",
        type: "PDF",
        size: "410 KB",
        uploadedBy: "BEE Official",
        uploadedAt: "23-Apr-2024",
        description: "Official forwarding note with summary of findings",
      },
    ],
  },
];

let _listeners: Array<() => void> = [];

export function getForwardedCases(): ForwardedCase[] {
  return _cases;
}

export function addForwardedCase(c: ForwardedCase): void {
  _cases = [c, ..._cases];
  for (const fn of _listeners) {
    fn();
  }
}

export function updateForwardedCase(
  reportId: number,
  updates: Partial<ForwardedCase>,
): void {
  _cases = _cases.map((c) =>
    c.reportId === reportId ? { ...c, ...updates } : c,
  );
  for (const fn of _listeners) {
    fn();
  }
}

export function subscribeForwardedCases(fn: () => void): () => void {
  _listeners.push(fn);
  return () => {
    _listeners = _listeners.filter((l) => l !== fn);
  };
}

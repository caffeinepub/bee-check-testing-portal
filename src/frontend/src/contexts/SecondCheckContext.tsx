import type React from "react";
import { createContext, useContext, useState } from "react";

export type SecondCheckStatus =
  | "InTransit"
  | "ReachedLab"
  | "ProposedDate"
  | "TestScheduled"
  | "UnderTesting"
  | "TestDone"
  | "ReportUploaded"
  | "InvoiceRaised"
  | "NFT";

export type SampleBlockStatus =
  | "Awaiting Lab Assignment"
  | "Lab Assigned"
  | "In Transit"
  | "Purchased";

export type OfficialVerificationStatus =
  | "Pending"
  | "Published"
  | "MismatchForwarded";

export interface StatusLogEntry {
  status: SecondCheckStatus;
  date: string;
  remarks?: string;
}

export interface FailedCase {
  id: string;
  brandName: string;
  modelNumber: string;
  category: string;
  starRating: number;
  failDate: string;
  testLab: string;
  state: string;
  dispatched: boolean;
}

export interface SecondCheckSample {
  id: string;
  caseId: string;
  brandName: string;
  modelNumber: string;
  category: string;
  starRating: number;
  purchaser: string;
  lab1Name: string;
  lab2Name: string;
  /** Per-sample block/purchase status shown in purchaser view */
  sample1Status: SampleBlockStatus;
  sample2Status: SampleBlockStatus;
  /** Lab workflow status — only relevant after lab assignment */
  status: SecondCheckStatus;
  proposedDate?: string;
  proposedDateApproved?: boolean;
  proposedDateRejectedReason?: string;
  blockedOn: string;
  statusLog: StatusLogEntry[];
  labResult?: "Pass" | "Fail";
  officialVerdict?: "Pass" | "Fail";
  officialVerificationStatus?: OfficialVerificationStatus;
}

interface SecondCheckContextType {
  failedCases: FailedCase[];
  secondCheckInitiated: boolean;
  initiateSecondCheck: () => void;
  secondCheckRequests: FailedCase[];
  secondCheckSamples: SecondCheckSample[];
  submitSecondCheckBlock: (caseId: string) => void;
  assignSecondCheckLab: (caseId: string, lab1: string, lab2: string) => void;
  proposeTestDate: (sampleId: string, date: string, labName: string) => void;
  approveTestDate: (sampleId: string) => void;
  rejectTestDate: (sampleId: string, reason: string) => void;
  updateSampleStatus: (
    sampleId: string,
    newStatus: SecondCheckStatus,
    remarks?: string,
  ) => void;
  recordTestResult: (
    sampleId: string,
    result: "Pass" | "Fail",
    remarks?: string,
  ) => void;
  submitOfficialVerdict: (
    sampleId: string,
    verdict: "Pass" | "Fail",
  ) => "published" | "mismatch";
}

const SecondCheckContext = createContext<SecondCheckContextType | null>(null);

const INITIAL_FAILED_CASES: FailedCase[] = [
  {
    id: "FC001",
    brandName: "Voltas",
    modelNumber: "SAC-1.5T-3S",
    category: "Air Conditioner",
    starRating: 3,
    failDate: "2025-11-15",
    testLab: "NABL Lab Delhi",
    state: "Delhi",
    dispatched: false,
  },
  {
    id: "FC002",
    brandName: "Havells",
    modelNumber: "FAN-CRPD-50W",
    category: "Ceiling Fan",
    starRating: 4,
    failDate: "2025-11-18",
    testLab: "ERTL Mumbai",
    state: "Maharashtra",
    dispatched: false,
  },
  {
    id: "FC003",
    brandName: "BEW",
    modelNumber: "REF-FROST-250L",
    category: "Refrigerator",
    starRating: 3,
    failDate: "2025-11-20",
    testLab: "CPRI Bangalore",
    state: "Karnataka",
    dispatched: false,
  },
  {
    id: "FC004",
    brandName: "Orient",
    modelNumber: "AC-ECONEXT-2T",
    category: "Air Conditioner",
    starRating: 5,
    failDate: "2025-11-22",
    testLab: "NABL Lab Hyderabad",
    state: "Telangana",
    dispatched: false,
  },
];

export function SecondCheckProvider({
  children,
}: { children: React.ReactNode }) {
  const [failedCases, setFailedCases] =
    useState<FailedCase[]>(INITIAL_FAILED_CASES);
  const [secondCheckInitiated, setSecondCheckInitiated] = useState(false);
  const [secondCheckRequests, setSecondCheckRequests] = useState<FailedCase[]>(
    [],
  );
  const [secondCheckSamples, setSecondCheckSamples] = useState<
    SecondCheckSample[]
  >([]);

  const initiateSecondCheck = () => {
    setSecondCheckInitiated(true);
    setSecondCheckRequests(failedCases);
    setFailedCases((prev) => prev.map((c) => ({ ...c, dispatched: true })));
  };

  /** Purchaser blocks a case — creates one record with both samples awaiting lab assignment */
  const submitSecondCheckBlock = (caseId: string) => {
    const fc = failedCases.find((c) => c.id === caseId);
    if (!fc) return;
    // Don't allow double-blocking
    if (secondCheckSamples.some((s) => s.caseId === caseId)) return;
    const now = new Date().toISOString().split("T")[0];
    const record: SecondCheckSample = {
      id: `SC-${caseId}-${Date.now()}`,
      caseId,
      brandName: fc.brandName,
      modelNumber: fc.modelNumber,
      category: fc.category,
      starRating: fc.starRating,
      purchaser: "SDA Purchaser",
      lab1Name: "",
      lab2Name: "",
      sample1Status: "Awaiting Lab Assignment",
      sample2Status: "Awaiting Lab Assignment",
      status: "InTransit",
      blockedOn: now,
      statusLog: [],
    };
    setSecondCheckSamples((prev) => [...prev, record]);
  };

  /** Lab Coordinator assigns labs to a blocked 2nd check case */
  const assignSecondCheckLab = (caseId: string, lab1: string, lab2: string) => {
    setSecondCheckSamples((prev) =>
      prev.map((s) =>
        s.caseId === caseId
          ? {
              ...s,
              lab1Name: lab1,
              lab2Name: lab2,
              sample1Status: "Lab Assigned" as SampleBlockStatus,
              sample2Status: "Lab Assigned" as SampleBlockStatus,
              statusLog: [
                ...s.statusLog,
                {
                  status: "InTransit" as SecondCheckStatus,
                  date: new Date().toISOString().split("T")[0],
                  remarks: `Labs assigned: ${lab1} (Sample 1), ${lab2} (Sample 2)`,
                },
              ],
            }
          : s,
      ),
    );
  };

  const proposeTestDate = (
    sampleId: string,
    date: string,
    _labName: string,
  ) => {
    setSecondCheckSamples((prev) =>
      prev.map((s) =>
        s.id === sampleId
          ? {
              ...s,
              status: "ProposedDate" as SecondCheckStatus,
              proposedDate: date,
              proposedDateApproved: false,
              statusLog: [
                ...s.statusLog,
                {
                  status: "ProposedDate" as SecondCheckStatus,
                  date: new Date().toISOString().split("T")[0],
                  remarks: `Proposed testing date: ${date}`,
                },
              ],
            }
          : s,
      ),
    );
  };

  const approveTestDate = (sampleId: string) => {
    const today = new Date().toISOString().split("T")[0];
    setSecondCheckSamples((prev) =>
      prev.map((s) =>
        s.id === sampleId
          ? {
              ...s,
              status: "TestScheduled" as SecondCheckStatus,
              proposedDateApproved: true,
              statusLog: [
                ...s.statusLog,
                {
                  status: "TestScheduled" as SecondCheckStatus,
                  date: today,
                  remarks: "Testing date approved by Compliance Officer",
                },
              ],
            }
          : s,
      ),
    );
  };

  const rejectTestDate = (sampleId: string, reason: string) => {
    const today = new Date().toISOString().split("T")[0];
    setSecondCheckSamples((prev) =>
      prev.map((s) =>
        s.id === sampleId
          ? {
              ...s,
              status: "ReachedLab" as SecondCheckStatus,
              proposedDate: undefined,
              proposedDateApproved: false,
              proposedDateRejectedReason: reason,
              statusLog: [
                ...s.statusLog,
                {
                  status: "ReachedLab" as SecondCheckStatus,
                  date: today,
                  remarks: `Date rejected by CO: ${reason}`,
                },
              ],
            }
          : s,
      ),
    );
  };

  const updateSampleStatus = (
    sampleId: string,
    newStatus: SecondCheckStatus,
    remarks?: string,
  ) => {
    const today = new Date().toISOString().split("T")[0];
    setSecondCheckSamples((prev) =>
      prev.map((s) =>
        s.id === sampleId
          ? {
              ...s,
              status: newStatus,
              statusLog: [
                ...s.statusLog,
                { status: newStatus, date: today, remarks },
              ],
            }
          : s,
      ),
    );
  };

  const recordTestResult = (
    sampleId: string,
    result: "Pass" | "Fail",
    remarks?: string,
  ) => {
    const today = new Date().toISOString().split("T")[0];
    setSecondCheckSamples((prev) =>
      prev.map((s) =>
        s.id === sampleId
          ? {
              ...s,
              status: "ReportUploaded" as SecondCheckStatus,
              labResult: result,
              officialVerificationStatus:
                "Pending" as OfficialVerificationStatus,
              statusLog: [
                ...s.statusLog,
                {
                  status: "ReportUploaded" as SecondCheckStatus,
                  date: today,
                  remarks: `Lab Result: ${result}. ${remarks ?? ""}`.trim(),
                },
              ],
            }
          : s,
      ),
    );
  };

  const submitOfficialVerdict = (
    sampleId: string,
    verdict: "Pass" | "Fail",
  ): "published" | "mismatch" => {
    const sample = secondCheckSamples.find((s) => s.id === sampleId);
    if (!sample) return "published";

    const labResult = sample.labResult ?? "Fail";
    let outcomeStatus: OfficialVerificationStatus;
    let result: "published" | "mismatch";

    if (labResult === "Pass" && verdict === "Pass") {
      outcomeStatus = "Published";
      result = "published";
    } else if (labResult === "Fail" && verdict === "Pass") {
      outcomeStatus = "MismatchForwarded";
      result = "mismatch";
    } else {
      outcomeStatus = "Published";
      result = "published";
    }

    const today = new Date().toISOString().split("T")[0];
    setSecondCheckSamples((prev) =>
      prev.map((s) =>
        s.id === sampleId
          ? {
              ...s,
              officialVerdict: verdict,
              officialVerificationStatus: outcomeStatus,
              statusLog: [
                ...s.statusLog,
                {
                  status: s.status,
                  date: today,
                  remarks: `BEE Official Verdict: ${verdict}. Outcome: ${
                    outcomeStatus === "MismatchForwarded"
                      ? "Mismatch — forwarded to Director"
                      : "Published"
                  }`,
                },
              ],
            }
          : s,
      ),
    );

    return result;
  };

  return (
    <SecondCheckContext.Provider
      value={{
        failedCases,
        secondCheckInitiated,
        initiateSecondCheck,
        secondCheckRequests,
        secondCheckSamples,
        submitSecondCheckBlock,
        assignSecondCheckLab,
        proposeTestDate,
        approveTestDate,
        rejectTestDate,
        updateSampleStatus,
        recordTestResult,
        submitOfficialVerdict,
      }}
    >
      {children}
    </SecondCheckContext.Provider>
  );
}

export function useSecondCheck() {
  const ctx = useContext(SecondCheckContext);
  if (!ctx)
    throw new Error("useSecondCheck must be used within SecondCheckProvider");
  return ctx;
}

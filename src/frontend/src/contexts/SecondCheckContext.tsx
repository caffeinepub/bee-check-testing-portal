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
  purchaser: string;
  lab1Name: string;
  lab2Name: string;
  status: SecondCheckStatus;
  proposedDate?: string;
  proposedDateApproved?: boolean;
  proposedDateRejectedReason?: string;
  blockedOn: string;
  statusLog: StatusLogEntry[];
}

interface SecondCheckContextType {
  failedCases: FailedCase[];
  secondCheckInitiated: boolean;
  initiateSecondCheck: () => void;
  secondCheckRequests: FailedCase[];
  secondCheckSamples: SecondCheckSample[];
  submitSecondCheckBlock: (caseId: string, lab1: string, lab2: string) => void;
  proposeTestDate: (sampleId: string, date: string, labName: string) => void;
  approveTestDate: (sampleId: string) => void;
  rejectTestDate: (sampleId: string, reason: string) => void;
  updateSampleStatus: (
    sampleId: string,
    newStatus: SecondCheckStatus,
    remarks?: string,
  ) => void;
}

const SecondCheckContext = createContext<SecondCheckContextType | null>(null);

const INITIAL_FAILED_CASES: FailedCase[] = [
  {
    id: "FC001",
    brandName: "Voltas",
    modelNumber: "SAC-1.5T-3S",
    category: "Air Conditioner",
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

  const submitSecondCheckBlock = (
    caseId: string,
    lab1: string,
    lab2: string,
  ) => {
    const fc = failedCases.find((c) => c.id === caseId);
    if (!fc) return;
    const now = new Date().toISOString().split("T")[0];
    // Create 2 samples — one per lab
    const sample1: SecondCheckSample = {
      id: `SC-${caseId}-L1-${Date.now()}`,
      caseId,
      brandName: fc.brandName,
      modelNumber: fc.modelNumber,
      category: fc.category,
      purchaser: "SDA Purchaser",
      lab1Name: lab1,
      lab2Name: lab2,
      status: "InTransit",
      blockedOn: now,
      statusLog: [
        {
          status: "InTransit",
          date: now,
          remarks: "Sample dispatched for 2nd check",
        },
      ],
    };
    const sample2: SecondCheckSample = {
      id: `SC-${caseId}-L2-${Date.now() + 1}`,
      caseId,
      brandName: fc.brandName,
      modelNumber: fc.modelNumber,
      category: fc.category,
      purchaser: "SDA Purchaser",
      lab1Name: lab2,
      lab2Name: lab1,
      status: "InTransit",
      blockedOn: now,
      statusLog: [
        {
          status: "InTransit",
          date: now,
          remarks: "Sample dispatched for 2nd check",
        },
      ],
    };
    setSecondCheckSamples((prev) => [...prev, sample1, sample2]);
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

  return (
    <SecondCheckContext.Provider
      value={{
        failedCases,
        secondCheckInitiated,
        initiateSecondCheck,
        secondCheckRequests,
        secondCheckSamples,
        submitSecondCheckBlock,
        proposeTestDate,
        approveTestDate,
        rejectTestDate,
        updateSampleStatus,
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

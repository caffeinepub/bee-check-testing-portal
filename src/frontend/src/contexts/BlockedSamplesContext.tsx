import type React from "react";
import { createContext, useContext, useState } from "react";

export interface LabAssignment {
  labName: string;
  labAddress: string;
  contactPerson: string;
  contactNumber: string;
  accreditationNumber: string;
  assignedAt: string;
}

export interface BlockedSample {
  id: number;
  productId: number;
  brandName: string;
  modelNumber: string;
  categoryName: string;
  starRating: number;
  retailer: string;
  price: number;
  blockedAt: string;
  purchaserEmail: string;
  labAssignment?: LabAssignment;
}

export interface SecondCheckLabRequest {
  id: string;
  caseId: string;
  sampleNumber: 1 | 2;
  brandName: string;
  modelNumber: string;
  categoryName: string;
  starRating: number;
  blockedAt: string;
  labName?: string;
  assignedAt?: string;
}

interface BlockedSamplesContextType {
  blockedSamples: BlockedSample[];
  addBlockedSample: (sample: BlockedSample) => void;
  assignLab: (sampleId: number, labAssignment: LabAssignment) => void;
  secondCheckLabRequests: SecondCheckLabRequest[];
  addSecondCheckLabRequest: (req: SecondCheckLabRequest) => void;
  assignSingleSampleLab: (requestId: string, labName: string) => void;
  /** @deprecated use addSecondCheckLabRequest + assignSingleSampleLab */
  assignSecondCheckLabs: (caseId: string, lab1: string, lab2: string) => void;
}

const BlockedSamplesContext = createContext<BlockedSamplesContextType | null>(
  null,
);

export function BlockedSamplesProvider({
  children,
}: { children: React.ReactNode }) {
  const [blockedSamples, setBlockedSamples] = useState<BlockedSample[]>([]);
  const [secondCheckLabRequests, setSecondCheckLabRequests] = useState<
    SecondCheckLabRequest[]
  >([]);

  const addBlockedSample = (sample: BlockedSample) => {
    setBlockedSamples((prev) => [sample, ...prev]);
  };

  const assignLab = (sampleId: number, labAssignment: LabAssignment) => {
    setBlockedSamples((prev) =>
      prev.map((s) => (s.id === sampleId ? { ...s, labAssignment } : s)),
    );
  };

  const addSecondCheckLabRequest = (req: SecondCheckLabRequest) => {
    // Avoid duplicate for same caseId + sampleNumber
    setSecondCheckLabRequests((prev) =>
      prev.some(
        (r) => r.caseId === req.caseId && r.sampleNumber === req.sampleNumber,
      )
        ? prev
        : [req, ...prev],
    );
  };

  const assignSingleSampleLab = (requestId: string, labName: string) => {
    setSecondCheckLabRequests((prev) =>
      prev.map((r) =>
        r.id === requestId
          ? { ...r, labName, assignedAt: new Date().toISOString() }
          : r,
      ),
    );
  };

  /** Legacy helper — assigns both samples at once (used by older code) */
  const assignSecondCheckLabs = (
    caseId: string,
    lab1: string,
    lab2: string,
  ) => {
    const now = new Date().toISOString();
    setSecondCheckLabRequests((prev) =>
      prev.map((r) => {
        if (r.caseId !== caseId) return r;
        if (r.sampleNumber === 1)
          return { ...r, labName: lab1, assignedAt: now };
        if (r.sampleNumber === 2)
          return { ...r, labName: lab2, assignedAt: now };
        return r;
      }),
    );
  };

  return (
    <BlockedSamplesContext.Provider
      value={{
        blockedSamples,
        addBlockedSample,
        assignLab,
        secondCheckLabRequests,
        addSecondCheckLabRequest,
        assignSingleSampleLab,
        assignSecondCheckLabs,
      }}
    >
      {children}
    </BlockedSamplesContext.Provider>
  );
}

export function useBlockedSamples() {
  const ctx = useContext(BlockedSamplesContext);
  if (!ctx)
    throw new Error(
      "useBlockedSamples must be used within BlockedSamplesProvider",
    );
  return ctx;
}

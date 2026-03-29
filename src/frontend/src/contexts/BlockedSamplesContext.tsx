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
  brandName: string;
  modelNumber: string;
  categoryName: string;
  starRating: number;
  blockedAt: string;
  labAssignment?: { lab1: string; lab2: string; assignedAt: string };
}

interface BlockedSamplesContextType {
  blockedSamples: BlockedSample[];
  addBlockedSample: (sample: BlockedSample) => void;
  assignLab: (sampleId: number, labAssignment: LabAssignment) => void;
  secondCheckLabRequests: SecondCheckLabRequest[];
  addSecondCheckLabRequest: (req: SecondCheckLabRequest) => void;
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
    // Avoid duplicates
    setSecondCheckLabRequests((prev) =>
      prev.some((r) => r.caseId === req.caseId) ? prev : [req, ...prev],
    );
  };

  const assignSecondCheckLabs = (
    caseId: string,
    lab1: string,
    lab2: string,
  ) => {
    setSecondCheckLabRequests((prev) =>
      prev.map((r) =>
        r.caseId === caseId
          ? {
              ...r,
              labAssignment: {
                lab1,
                lab2,
                assignedAt: new Date().toISOString(),
              },
            }
          : r,
      ),
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

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

interface BlockedSamplesContextType {
  blockedSamples: BlockedSample[];
  addBlockedSample: (sample: BlockedSample) => void;
  assignLab: (sampleId: number, labAssignment: LabAssignment) => void;
}

const BlockedSamplesContext = createContext<BlockedSamplesContextType | null>(
  null,
);

export function BlockedSamplesProvider({
  children,
}: { children: React.ReactNode }) {
  const [blockedSamples, setBlockedSamples] = useState<BlockedSample[]>([]);

  const addBlockedSample = (sample: BlockedSample) => {
    setBlockedSamples((prev) => [sample, ...prev]);
  };

  const assignLab = (sampleId: number, labAssignment: LabAssignment) => {
    setBlockedSamples((prev) =>
      prev.map((s) => (s.id === sampleId ? { ...s, labAssignment } : s)),
    );
  };

  return (
    <BlockedSamplesContext.Provider
      value={{ blockedSamples, addBlockedSample, assignLab }}
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

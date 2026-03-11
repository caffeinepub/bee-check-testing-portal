import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Target {
    id: bigint;
    financialYear: string;
    status: string;
    starRating: bigint;
    assignedTo: string;
    createdBy: string;
    applianceCategoryId: bigint;
    state: string;
    quantity: bigint;
}
export interface FinancialRecord {
    id: bigint;
    instalments: Array<[bigint, bigint, string, string]>;
    totalApprovedAmount: bigint;
    state: string;
}
export interface Brand {
    id: bigint;
    name: string;
    applianceCategoryId: bigint;
}
export interface ApplianceCategory {
    id: bigint;
    name: string;
}
export interface User {
    id: string;
    name: string;
    role: Role;
    isActive: boolean;
    email: string;
    state?: string;
    department?: string;
}
export interface TestReport {
    id: bigint;
    reportUrl: string;
    result: string;
    submittedAt: string;
    reviewStatus: string;
    labId: bigint;
    reviewedBy?: string;
    reviewRemarks?: string;
    sampleId: bigint;
}
export interface Sample {
    id: bigint;
    financialYear: string;
    status: string;
    starRating: bigint;
    invoiceUrl?: string;
    testReportUrl?: string;
    testDate?: string;
    applianceCategoryId: bigint;
    notFitReason?: string;
    labId: bigint;
    purchaserId: string;
    state: string;
    brandId: bigint;
    targetId: bigint;
    remarks?: string;
    modelId: bigint;
}
export interface Lab {
    id: bigint;
    name: string;
    state: string;
    allocationPercentage: bigint;
    location: string;
}
export interface OfficialAssignment {
    id: bigint;
    applianceCategoryId: bigint;
    officialId: string;
}
export interface Model {
    id: bigint;
    starRating: bigint;
    applianceCategoryId: bigint;
    modelNumber: string;
    brandId: bigint;
}
export interface UserProfile {
    name: string;
    role: Role;
    email: string;
    state?: string;
    department?: string;
}
export enum Role {
    lab = "lab",
    admin = "admin",
    director = "director",
    purchaser = "purchaser",
    official = "official"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    approveReport(id: bigint, reviewRemarks: string): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    assignOfficialToCategory(id: bigint, officialId: string, applianceCategoryId: bigint): Promise<void>;
    assignSampleToLab(id: bigint, labId: bigint): Promise<void>;
    blockSample(id: bigint, targetId: bigint, applianceCategoryId: bigint, brandId: bigint, modelId: bigint, starRating: bigint, state: string, financialYear: string): Promise<void>;
    createApplianceCategory(id: bigint, name: string): Promise<void>;
    createBrand(id: bigint, name: string, applianceCategoryId: bigint): Promise<void>;
    createFinancialRecord(id: bigint, state: string, totalApprovedAmount: bigint, instalments: Array<[bigint, bigint, string, string]>): Promise<void>;
    createLab(id: bigint, name: string, location: string, state: string, allocationPercentage: bigint): Promise<void>;
    createModel(id: bigint, brandId: bigint, modelNumber: string, starRating: bigint, applianceCategoryId: bigint): Promise<void>;
    createTarget(id: bigint, financialYear: string, state: string, applianceCategoryId: bigint, starRating: bigint, quantity: bigint, assignedTo: string, status: string): Promise<void>;
    createUser(id: string, name: string, email: string, role: Role, department: string | null, state: string | null): Promise<void>;
    deleteUser(id: string): Promise<void>;
    getAllApplianceCategories(): Promise<Array<ApplianceCategory>>;
    getAllBrands(): Promise<Array<Brand>>;
    getAllLabs(): Promise<Array<Lab>>;
    getAllModels(): Promise<Array<Model>>;
    getAllUsers(): Promise<Array<User>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getDashboardStats(): Promise<string>;
    getFinancialMonitoring(): Promise<Array<FinancialRecord>>;
    getLabTestMonitoring(): Promise<Array<Sample>>;
    getMyAssignedSamples(): Promise<Array<Sample>>;
    getMyReports(): Promise<Array<TestReport>>;
    getMyTargets(): Promise<Array<Target>>;
    getOfficialAssignments(): Promise<Array<OfficialAssignment>>;
    getTargets(): Promise<Array<Target>>;
    getUser(id: string): Promise<User>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    purchaseSample(id: bigint, invoiceUrl: string): Promise<void>;
    rejectReport(id: bigint, reviewRemarks: string): Promise<void>;
    revertReport(id: bigint, reviewRemarks: string): Promise<void>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    searchProduct(applianceCategoryId: bigint, brandId: bigint, modelId: bigint, starRating: bigint, financialYear: string): Promise<Array<Sample>>;
    submitReportToBEEOfficial(id: bigint, sampleId: bigint, labId: bigint, result: string, reportUrl: string, submittedAt: string): Promise<void>;
    updateSampleStatus(id: bigint, status: string, notFitReason: string | null, remarks: string | null): Promise<void>;
    updateTarget(id: bigint, financialYear: string, state: string, applianceCategoryId: bigint, starRating: bigint, quantity: bigint, assignedTo: string, status: string): Promise<void>;
    updateUser(id: string, name: string, email: string, role: Role, department: string | null, state: string | null, isActive: boolean): Promise<void>;
    uploadTestReport(sampleId: bigint, testReportUrl: string, testDate: string): Promise<void>;
}

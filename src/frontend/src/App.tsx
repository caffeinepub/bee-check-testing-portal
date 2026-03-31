import { Toaster } from "@/components/ui/sonner";
import { useState } from "react";
import Layout from "./components/Layout";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { BlockedSamplesProvider } from "./contexts/BlockedSamplesContext";
import { SecondCheckProvider } from "./contexts/SecondCheckContext";
import LoginPage from "./pages/LoginPage";
import ComplianceOfficerDashboard from "./pages/complianceofficer/ComplianceOfficerDashboard";
import SchedulingApprovalsPage from "./pages/complianceofficer/SchedulingApprovalsPage";
import ApplianceDataPage from "./pages/director/ApplianceDataPage";
import DirectorDashboard from "./pages/director/DirectorDashboard";
import DirectorTestingPage from "./pages/director/DirectorTestingPage";
import FinancialMonitoringPage from "./pages/director/FinancialMonitoringPage";
import IndiaMapDashboard from "./pages/director/IndiaMapDashboard";
import LabMonitoringPage from "./pages/director/LabMonitoringPage";
import OfficialPerformancePage from "./pages/director/OfficialPerformancePage";
import TargetCreationPage from "./pages/director/TargetCreationPage";
import FinancialOfficialDashboard from "./pages/financialofficial/FinancialOfficialDashboard";
import AssignedSamplesPage from "./pages/lab/AssignedSamplesPage";
import LabDashboard from "./pages/lab/LabDashboard";
import LabSecondCheckPage from "./pages/lab/LabSecondCheckPage";
import AssignLabPage from "./pages/labcoordinator/AssignLabPage";
import LabCoordinatorDashboard from "./pages/labcoordinator/LabCoordinatorDashboard";
import ApprovedReportsPage from "./pages/official/ApprovedReportsPage";
import LabResultsPage from "./pages/official/LabResultsPage";
import OfficialDashboard from "./pages/official/OfficialDashboard";
import RejectedReportsPage from "./pages/official/RejectedReportsPage";
import ReviewReportsPage from "./pages/official/ReviewReportsPage";
import BlockedSamplePage from "./pages/purchaser/BlockedSamplePage";
import MyPurchasesPage from "./pages/purchaser/MyPurchasesPage";
import PurchaserDashboard from "./pages/purchaser/PurchaserDashboard";
import SearchProductPage from "./pages/purchaser/SearchProductPage";
import SecondCheckTestPage from "./pages/purchaser/SecondCheckTestPage";

function AppContent() {
  const { user } = useAuth();
  const [activePage, setActivePage] = useState("dashboard");

  if (!user) return <LoginPage />;

  const renderPage = () => {
    if (user.role === "director") {
      switch (activePage) {
        case "appliance":
          return <ApplianceDataPage />;
        case "lab":
          return <LabMonitoringPage />;
        case "financial":
          return <FinancialMonitoringPage />;
        case "performance":
          return <OfficialPerformancePage />;
        case "targets":
          return <TargetCreationPage />;
        case "testing":
          return <DirectorTestingPage />;
        case "mapDashboard":
          return <IndiaMapDashboard />;
        default:
          return <DirectorDashboard onNavigate={setActivePage} />;
      }
    }
    if (user.role === "official") {
      switch (activePage) {
        case "review":
          return <ReviewReportsPage />;
        case "approved":
          return <ApprovedReportsPage />;
        case "rejected":
          return <RejectedReportsPage />;
        case "labresults":
          return <LabResultsPage />;
        default:
          return <OfficialDashboard onNavigate={setActivePage} />;
      }
    }
    if (user.role === "purchaser") {
      switch (activePage) {
        case "search":
          return <SearchProductPage />;
        case "purchases":
          return <MyPurchasesPage />;
        case "blocked":
          return <BlockedSamplePage />;
        case "secondcheck":
          return <SecondCheckTestPage />;
        default:
          return <PurchaserDashboard onNavigate={setActivePage} />;
      }
    }
    if (user.role === "lab") {
      switch (activePage) {
        case "samples":
          return <AssignedSamplesPage defaultTab="tracking" />;
        case "revert":
          return <AssignedSamplesPage defaultTab="revert" />;
        case "testreport":
          return <AssignedSamplesPage defaultTab="testreport" />;
        case "secondcheck":
          return <LabSecondCheckPage />;
        default:
          return <LabDashboard onNavigate={setActivePage} />;
      }
    }
    if (user.role === "labcoordinator") {
      switch (activePage) {
        case "assignlab":
          return <AssignLabPage />;
        default:
          return <LabCoordinatorDashboard onNavigate={setActivePage} />;
      }
    }
    if (user.role === "complianceofficer") {
      switch (activePage) {
        case "scheduling":
          return <SchedulingApprovalsPage />;
        default:
          return <ComplianceOfficerDashboard onNavigate={setActivePage} />;
      }
    }
    if (user.role === "financialofficial") {
      return (
        <FinancialOfficialDashboard
          activePage={
            activePage.startsWith("fin_") ? activePage : "fin_summary"
          }
          onNavigate={setActivePage}
        />
      );
    }
    return null;
  };

  return (
    <Layout activePage={activePage} onNavigate={setActivePage}>
      {renderPage()}
    </Layout>
  );
}

export default function App() {
  return (
    <SecondCheckProvider>
      <BlockedSamplesProvider>
        <AuthProvider>
          <AppContent />
          <Toaster />
        </AuthProvider>
      </BlockedSamplesProvider>
    </SecondCheckProvider>
  );
}

import Map "mo:core/Map";
import Array "mo:core/Array";
import Iter "mo:core/Iter";
import Order "mo:core/Order";
import Runtime "mo:core/Runtime";
import Text "mo:core/Text";
import Principal "mo:core/Principal";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

actor {
  // Authorization
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  type Role = {
    #admin;
    #director;
    #official;
    #purchaser;
    #lab;
  };

  module Role {
    public func compare(role1 : Role, role2 : Role) : Order.Order {
      switch (role1, role2) {
        case (#admin, #admin) { #equal };
        case (#director, #director) { #equal };
        case (#official, #official) { #equal };
        case (#purchaser, #purchaser) { #equal };
        case (#lab, #lab) { #equal };
        case (#admin, _) { #less };
        case (_, #admin) { #greater };
        case (#director, _) { #less };
        case (_, #director) { #greater };
        case (#official, _) { #less };
        case (_, #official) { #greater };
        case (#purchaser, _) { #less };
        case (_, #purchaser) { #greater };
      };
    };
  };

  // Data Types
  public type User = {
    id : Text;
    name : Text;
    email : Text;
    role : Role;
    department : ?Text;
    state : ?Text;
    isActive : Bool;
  };

  public type UserProfile = {
    name : Text;
    email : Text;
    role : Role;
    department : ?Text;
    state : ?Text;
  };

  public type ApplianceCategory = {
    id : Nat;
    name : Text;
  };

  public type Brand = {
    id : Nat;
    name : Text;
    applianceCategoryId : Nat;
  };

  public type Model = {
    id : Nat;
    brandId : Nat;
    modelNumber : Text;
    starRating : Nat;
    applianceCategoryId : Nat;
  };

  public type Lab = {
    id : Nat;
    name : Text;
    location : Text;
    state : Text;
    allocationPercentage : Nat;
  };

  public type Target = {
    id : Nat;
    financialYear : Text;
    state : Text;
    applianceCategoryId : Nat;
    starRating : Nat;
    quantity : Nat;
    assignedTo : Text;
    createdBy : Text;
    status : Text;
  };

  public type Sample = {
    id : Nat;
    targetId : Nat;
    applianceCategoryId : Nat;
    brandId : Nat;
    modelId : Nat;
    starRating : Nat;
    state : Text;
    purchaserId : Text;
    labId : Nat;
    status : Text;
    financialYear : Text;
    invoiceUrl : ?Text;
    testDate : ?Text;
    testReportUrl : ?Text;
    notFitReason : ?Text;
    remarks : ?Text;
  };

  public type TestReport = {
    id : Nat;
    sampleId : Nat;
    labId : Nat;
    result : Text;
    reportUrl : Text;
    submittedAt : Text;
    reviewedBy : ?Text;
    reviewStatus : Text;
    reviewRemarks : ?Text;
  };

  public type FinancialRecord = {
    id : Nat;
    state : Text;
    totalApprovedAmount : Nat;
    instalments : [(Nat, Nat, Text, Text)];
  };

  public type OfficialAssignment = {
    id : Nat;
    officialId : Text;
    applianceCategoryId : Nat;
  };

  // Storage
  let users = Map.empty<Text, User>();
  let userProfiles = Map.empty<Principal, UserProfile>();
  let applianceCategories = Map.empty<Nat, ApplianceCategory>();
  let brands = Map.empty<Nat, Brand>();
  let models = Map.empty<Nat, Model>();
  let labs = Map.empty<Nat, Lab>();
  let targets = Map.empty<Nat, Target>();
  let samples = Map.empty<Nat, Sample>();
  let testReports = Map.empty<Nat, TestReport>();
  let financialRecords = Map.empty<Nat, FinancialRecord>();
  let officialAssignments = Map.empty<Nat, OfficialAssignment>();

  // Helper function to get user by principal
  func getUserByPrincipal(caller : Principal) : ?User {
    let callerText = caller.toText();
    users.get(callerText);
  };

  // Helper function to check if user has specific role
  func hasRole(caller : Principal, requiredRole : Role) : Bool {
    switch (getUserByPrincipal(caller)) {
      case (null) { false };
      case (?user) {
        if (not user.isActive) { return false };
        switch (user.role, requiredRole) {
          case (#admin, _) { true }; // Admin can do everything
          case (role, req) { role == req };
        };
      };
    };
  };

  // Helper function to check if user is admin
  func isAppAdmin(caller : Principal) : Bool {
    hasRole(caller, #admin);
  };

  // Helper function to check if user is director
  func isDirector(caller : Principal) : Bool {
    hasRole(caller, #director);
  };

  // Helper function to check if user is official
  func isOfficial(caller : Principal) : Bool {
    hasRole(caller, #official);
  };

  // Helper function to check if user is purchaser
  func isPurchaser(caller : Principal) : Bool {
    hasRole(caller, #purchaser);
  };

  // Helper function to check if user is lab
  func isLab(caller : Principal) : Bool {
    hasRole(caller, #lab);
  };

  // User Profile Management (Required by frontend)
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access profiles");
    };
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // User Management (Admin only)
  public shared ({ caller }) func createUser(id : Text, name : Text, email : Text, role : Role, department : ?Text, state : ?Text) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admin can perform this action");
    };
    let user : User = {
      id;
      name;
      email;
      role;
      department;
      state;
      isActive = true;
    };
    users.add(id, user);
  };

  public shared ({ caller }) func updateUser(id : Text, name : Text, email : Text, role : Role, department : ?Text, state : ?Text, isActive : Bool) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admin can perform this action");
    };
    let user : User = {
      id;
      name;
      email;
      role;
      department;
      state;
      isActive;
    };
    users.add(id, user);
  };

  public shared ({ caller }) func deleteUser(id : Text) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admin can perform this action");
    };
    users.remove(id);
  };

  public query ({ caller }) func getUser(id : Text) : async User {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can view user data");
    };
    switch (users.get(id)) {
      case (null) { Runtime.trap("User not found") };
      case (?user) { user };
    };
  };

  public query ({ caller }) func getAllUsers() : async [User] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can view users");
    };
    users.values().toArray();
  };

  // Master Data Management (Admin only)
  public shared ({ caller }) func createApplianceCategory(id : Nat, name : Text) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admin can perform this action");
    };
    let category : ApplianceCategory = { id; name };
    applianceCategories.add(id, category);
  };

  public shared ({ caller }) func createBrand(id : Nat, name : Text, applianceCategoryId : Nat) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admin can perform this action");
    };
    let brand : Brand = { id; name; applianceCategoryId };
    brands.add(id, brand);
  };

  public shared ({ caller }) func createModel(id : Nat, brandId : Nat, modelNumber : Text, starRating : Nat, applianceCategoryId : Nat) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admin can perform this action");
    };
    let model : Model = {
      id;
      brandId;
      modelNumber;
      starRating;
      applianceCategoryId;
    };
    models.add(id, model);
  };

  public shared ({ caller }) func createLab(id : Nat, name : Text, location : Text, state : Text, allocationPercentage : Nat) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admin can perform this action");
    };
    let lab : Lab = { id; name; location; state; allocationPercentage };
    labs.add(id, lab);
  };

  public query ({ caller }) func getAllApplianceCategories() : async [ApplianceCategory] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can view categories");
    };
    applianceCategories.values().toArray();
  };

  public query ({ caller }) func getAllBrands() : async [Brand] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can view brands");
    };
    brands.values().toArray();
  };

  public query ({ caller }) func getAllModels() : async [Model] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can view models");
    };
    models.values().toArray();
  };

  public query ({ caller }) func getAllLabs() : async [Lab] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can view labs");
    };
    labs.values().toArray();
  };

  // Target Management (Director creates, Admin can manage)
  public shared ({ caller }) func createTarget(id : Nat, financialYear : Text, state : Text, applianceCategoryId : Nat, starRating : Nat, quantity : Nat, assignedTo : Text, status : Text) : async () {
    if (not (isDirector(caller) or isAppAdmin(caller))) {
      Runtime.trap("Unauthorized: Only BEE Director can create targets");
    };
    let createdBy = caller.toText();
    let target : Target = {
      id;
      financialYear;
      state;
      applianceCategoryId;
      starRating;
      quantity;
      assignedTo;
      createdBy;
      status;
    };
    targets.add(id, target);
  };

  public shared ({ caller }) func updateTarget(id : Nat, financialYear : Text, state : Text, applianceCategoryId : Nat, starRating : Nat, quantity : Nat, assignedTo : Text, status : Text) : async () {
    if (not (isDirector(caller) or isAppAdmin(caller))) {
      Runtime.trap("Unauthorized: Only BEE Director can update targets");
    };
    switch (targets.get(id)) {
      case (null) { Runtime.trap("Target not found") };
      case (?existingTarget) {
        let target : Target = {
          id;
          financialYear;
          state;
          applianceCategoryId;
          starRating;
          quantity;
          assignedTo;
          createdBy = existingTarget.createdBy;
          status;
        };
        targets.add(id, target);
      };
    };
  };

  public query ({ caller }) func getTargets() : async [Target] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can view targets");
    };
    targets.values().toArray();
  };

  public query ({ caller }) func getMyTargets() : async [Target] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can view targets");
    };
    let callerText = caller.toText();
    targets.values().filter(
      func(target) {
        target.assignedTo == callerText or target.createdBy == callerText
      }
    ).toArray();
  };

  // Sample Management (Purchaser creates/manages, Lab updates status)
  public query ({ caller }) func searchProduct(applianceCategoryId : Nat, brandId : Nat, modelId : Nat, starRating : Nat, financialYear : Text) : async [Sample] {
    if (not (isPurchaser(caller) or isAppAdmin(caller))) {
      Runtime.trap("Unauthorized: Only Purchaser can search products");
    };
    samples.values().filter(
      func(sample) {
        sample.applianceCategoryId == applianceCategoryId and sample.brandId == brandId and sample.modelId == modelId and sample.starRating == starRating and sample.financialYear == financialYear
      }
    ).toArray();
  };

  public shared ({ caller }) func blockSample(id : Nat, targetId : Nat, applianceCategoryId : Nat, brandId : Nat, modelId : Nat, starRating : Nat, state : Text, financialYear : Text) : async () {
    if (not (isPurchaser(caller) or isAppAdmin(caller))) {
      Runtime.trap("Unauthorized: Only Purchaser can block samples");
    };
    let purchaserId = caller.toText();
    let sample : Sample = {
      id;
      targetId;
      applianceCategoryId;
      brandId;
      modelId;
      starRating;
      state;
      purchaserId;
      labId = 0;
      status = "Blocked";
      financialYear;
      invoiceUrl = null;
      testDate = null;
      testReportUrl = null;
      notFitReason = null;
      remarks = null;
    };
    samples.add(id, sample);
  };

  public shared ({ caller }) func purchaseSample(id : Nat, invoiceUrl : Text) : async () {
    if (not (isPurchaser(caller) or isAppAdmin(caller))) {
      Runtime.trap("Unauthorized: Only Purchaser can purchase samples");
    };
    switch (samples.get(id)) {
      case (null) { Runtime.trap("Sample not found") };
      case (?existingSample) {
        let callerText = caller.toText();
        if (existingSample.purchaserId != callerText and not isAppAdmin(caller)) {
          Runtime.trap("Unauthorized: Can only purchase your own blocked samples");
        };
        let sample : Sample = {
          id = existingSample.id;
          targetId = existingSample.targetId;
          applianceCategoryId = existingSample.applianceCategoryId;
          brandId = existingSample.brandId;
          modelId = existingSample.modelId;
          starRating = existingSample.starRating;
          state = existingSample.state;
          purchaserId = existingSample.purchaserId;
          labId = existingSample.labId;
          status = "Purchased";
          financialYear = existingSample.financialYear;
          invoiceUrl = ?invoiceUrl;
          testDate = existingSample.testDate;
          testReportUrl = existingSample.testReportUrl;
          notFitReason = existingSample.notFitReason;
          remarks = existingSample.remarks;
        };
        samples.add(id, sample);
      };
    };
  };

  public shared ({ caller }) func assignSampleToLab(id : Nat, labId : Nat) : async () {
    if (not (isPurchaser(caller) or isAppAdmin(caller))) {
      Runtime.trap("Unauthorized: Only Purchaser can assign samples to lab");
    };
    switch (samples.get(id)) {
      case (null) { Runtime.trap("Sample not found") };
      case (?existingSample) {
        let callerText = caller.toText();
        if (existingSample.purchaserId != callerText and not isAppAdmin(caller)) {
          Runtime.trap("Unauthorized: Can only assign your own purchased samples");
        };
        let sample : Sample = {
          id = existingSample.id;
          targetId = existingSample.targetId;
          applianceCategoryId = existingSample.applianceCategoryId;
          brandId = existingSample.brandId;
          modelId = existingSample.modelId;
          starRating = existingSample.starRating;
          state = existingSample.state;
          purchaserId = existingSample.purchaserId;
          labId;
          status = "InTransit";
          financialYear = existingSample.financialYear;
          invoiceUrl = existingSample.invoiceUrl;
          testDate = existingSample.testDate;
          testReportUrl = existingSample.testReportUrl;
          notFitReason = existingSample.notFitReason;
          remarks = existingSample.remarks;
        };
        samples.add(id, sample);
      };
    };
  };

  public shared ({ caller }) func updateSampleStatus(id : Nat, status : Text, notFitReason : ?Text, remarks : ?Text) : async () {
    if (not (isLab(caller) or isAppAdmin(caller))) {
      Runtime.trap("Unauthorized: Only Lab can update sample status");
    };
    switch (samples.get(id)) {
      case (null) { Runtime.trap("Sample not found") };
      case (?existingSample) {
        let sample : Sample = {
          id = existingSample.id;
          targetId = existingSample.targetId;
          applianceCategoryId = existingSample.applianceCategoryId;
          brandId = existingSample.brandId;
          modelId = existingSample.modelId;
          starRating = existingSample.starRating;
          state = existingSample.state;
          purchaserId = existingSample.purchaserId;
          labId = existingSample.labId;
          status;
          financialYear = existingSample.financialYear;
          invoiceUrl = existingSample.invoiceUrl;
          testDate = existingSample.testDate;
          testReportUrl = existingSample.testReportUrl;
          notFitReason;
          remarks;
        };
        samples.add(id, sample);
      };
    };
  };

  public shared ({ caller }) func uploadTestReport(sampleId : Nat, testReportUrl : Text, testDate : Text) : async () {
    if (not (isLab(caller) or isAppAdmin(caller))) {
      Runtime.trap("Unauthorized: Only Lab can upload test reports");
    };
    switch (samples.get(sampleId)) {
      case (null) { Runtime.trap("Sample not found") };
      case (?existingSample) {
        let sample : Sample = {
          id = existingSample.id;
          targetId = existingSample.targetId;
          applianceCategoryId = existingSample.applianceCategoryId;
          brandId = existingSample.brandId;
          modelId = existingSample.modelId;
          starRating = existingSample.starRating;
          state = existingSample.state;
          purchaserId = existingSample.purchaserId;
          labId = existingSample.labId;
          status = "ReportUploaded";
          financialYear = existingSample.financialYear;
          invoiceUrl = existingSample.invoiceUrl;
          testDate = ?testDate;
          testReportUrl = ?testReportUrl;
          notFitReason = existingSample.notFitReason;
          remarks = existingSample.remarks;
        };
        samples.add(sampleId, sample);
      };
    };
  };

  public query ({ caller }) func getMyAssignedSamples() : async [Sample] {
    if (not (isLab(caller) or isPurchaser(caller) or isAppAdmin(caller))) {
      Runtime.trap("Unauthorized: Only Lab or Purchaser can view assigned samples");
    };
    let callerText = caller.toText();
    samples.values().filter(
      func(sample) {
        sample.purchaserId == callerText
      }
    ).toArray();
  };

  // Test Report Management (Lab submits, Official reviews)
  public shared ({ caller }) func submitReportToBEEOfficial(id : Nat, sampleId : Nat, labId : Nat, result : Text, reportUrl : Text, submittedAt : Text) : async () {
    if (not (isLab(caller) or isAppAdmin(caller))) {
      Runtime.trap("Unauthorized: Only Lab can submit reports");
    };
    let testReport : TestReport = {
      id;
      sampleId;
      labId;
      result;
      reportUrl;
      submittedAt;
      reviewedBy = null;
      reviewStatus = "Pending";
      reviewRemarks = null;
    };
    testReports.add(id, testReport);
  };

  public shared ({ caller }) func approveReport(id : Nat, reviewRemarks : Text) : async () {
    if (not (isOfficial(caller) or isDirector(caller) or isAppAdmin(caller))) {
      Runtime.trap("Unauthorized: Only BEE Official or Director can approve reports");
    };
    switch (testReports.get(id)) {
      case (null) { Runtime.trap("Test report not found") };
      case (?existingReport) {
        let reviewedBy = caller.toText();
        let testReport : TestReport = {
          id = existingReport.id;
          sampleId = existingReport.sampleId;
          labId = existingReport.labId;
          result = existingReport.result;
          reportUrl = existingReport.reportUrl;
          submittedAt = existingReport.submittedAt;
          reviewedBy = ?reviewedBy;
          reviewStatus = "Approved";
          reviewRemarks = ?reviewRemarks;
        };
        testReports.add(id, testReport);
      };
    };
  };

  public shared ({ caller }) func rejectReport(id : Nat, reviewRemarks : Text) : async () {
    if (not (isOfficial(caller) or isDirector(caller) or isAppAdmin(caller))) {
      Runtime.trap("Unauthorized: Only BEE Official or Director can reject reports");
    };
    switch (testReports.get(id)) {
      case (null) { Runtime.trap("Test report not found") };
      case (?existingReport) {
        let reviewedBy = caller.toText();
        let testReport : TestReport = {
          id = existingReport.id;
          sampleId = existingReport.sampleId;
          labId = existingReport.labId;
          result = existingReport.result;
          reportUrl = existingReport.reportUrl;
          submittedAt = existingReport.submittedAt;
          reviewedBy = ?reviewedBy;
          reviewStatus = "Rejected";
          reviewRemarks = ?reviewRemarks;
        };
        testReports.add(id, testReport);
      };
    };
  };

  public shared ({ caller }) func revertReport(id : Nat, reviewRemarks : Text) : async () {
    if (not (isOfficial(caller) or isDirector(caller) or isAppAdmin(caller))) {
      Runtime.trap("Unauthorized: Only BEE Official or Director can revert reports");
    };
    switch (testReports.get(id)) {
      case (null) { Runtime.trap("Test report not found") };
      case (?existingReport) {
        let reviewedBy = caller.toText();
        let testReport : TestReport = {
          id = existingReport.id;
          sampleId = existingReport.sampleId;
          labId = existingReport.labId;
          result = existingReport.result;
          reportUrl = existingReport.reportUrl;
          submittedAt = existingReport.submittedAt;
          reviewedBy = ?reviewedBy;
          reviewStatus = "Reverted";
          reviewRemarks = ?reviewRemarks;
        };
        testReports.add(id, testReport);
      };
    };
  };

  public query ({ caller }) func getMyReports() : async [TestReport] {
    if (not (isLab(caller) or isOfficial(caller) or isDirector(caller) or isAppAdmin(caller))) {
      Runtime.trap("Unauthorized: Only Lab, Official, or Director can view reports");
    };
    let callerText = caller.toText();
    testReports.values().filter(
      func(report) {
        switch (report.reviewedBy) {
          case (null) { true };
          case (?reviewer) { reviewer == callerText };
        };
      }
    ).toArray();
  };

  // Official Assignment (Admin only)
  public shared ({ caller }) func assignOfficialToCategory(id : Nat, officialId : Text, applianceCategoryId : Nat) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admin can assign officials to categories");
    };
    let assignment : OfficialAssignment = {
      id;
      officialId;
      applianceCategoryId;
    };
    officialAssignments.add(id, assignment);
  };

  public query ({ caller }) func getOfficialAssignments() : async [OfficialAssignment] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can view assignments");
    };
    officialAssignments.values().toArray();
  };

  // Financial Records (Admin and Director only)
  public shared ({ caller }) func createFinancialRecord(id : Nat, state : Text, totalApprovedAmount : Nat, instalments : [(Nat, Nat, Text, Text)]) : async () {
    if (not (isDirector(caller) or isAppAdmin(caller))) {
      Runtime.trap("Unauthorized: Only Director or Admin can create financial records");
    };
    let record : FinancialRecord = {
      id;
      state;
      totalApprovedAmount;
      instalments;
    };
    financialRecords.add(id, record);
  };

  public query ({ caller }) func getFinancialMonitoring() : async [FinancialRecord] {
    if (not (isDirector(caller) or isAppAdmin(caller))) {
      Runtime.trap("Unauthorized: Only Director or Admin can view financial monitoring");
    };
    financialRecords.values().toArray();
  };

  // Dashboard and Monitoring (Role-based access)
  public query ({ caller }) func getDashboardStats() : async Text {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can view dashboard");
    };
    "Dashboard stats placeholder";
  };

  public query ({ caller }) func getLabTestMonitoring() : async [Sample] {
    if (not (isLab(caller) or isOfficial(caller) or isDirector(caller) or isAppAdmin(caller))) {
      Runtime.trap("Unauthorized: Only Lab, Official, or Director can view lab test monitoring");
    };
    samples.values().toArray();
  };
};

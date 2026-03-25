# BEE Check Testing Portal - 2nd Check Test Workflow

## Current State
The portal supports roles: Director, BEE Official, Purchaser (SDA), Test Lab, Lab Coordinator.
Lab User workflow: In-Transit → Reached Lab → NFT (terminal) OR Test Scheduled → Under Testing → Test Done (Pass/Fail with attachments) → Report → Invoice.
All Pass/Fail/NFT cases go to a "Test Report" tab and are sent to BEE Official for verification.
Purchaser can block a single sample, Lab Coordinator assigns one lab, purchaser purchases from Blocked Sample tab.

## Requested Changes (Diff)

### Add
- **Compliance Officer** user role with its own login (complianceofficer@bee.gov.in / Password@123)
- **Compliance Officer Dashboard** showing:
  - All failed test cases from the Test Report tab (auto-populated)
  - Summary KPI cards: Total Failed Cases, Pending 2nd Check, In-Progress 2nd Check, Completed
  - "Initiate 2nd Check Test" button that broadcasts all current failed cases to all 36 Purchaser logins
  - "2nd Check Test Approvals" section: list of proposed testing dates from labs awaiting CO approval
  - Approve/Reject action for each scheduled date proposal
- **Purchaser: "2nd Check Test" tab** (new tab in sidebar after Blocked Sample)
  - Shows failed cases sent by Compliance Officer
  - Purchaser can block the product for 2nd check (requires 2 sample units)
  - Blocking UI: quantity locked to 2; two separate lab assignment fields (Lab 1 and Lab 2 must be different labs)
  - After assigning both labs and submitting, cases move to a new "2nd Check Test Cases" sub-tab
- **Lab User: "2nd Check Test" tab** (new tab in sidebar)
  - Shows 2nd check test samples assigned to this lab
  - Same sequential workflow: In-Transit → Reached Lab → (NFT terminal OR schedule date proposal) → Test Scheduled → Under Testing → Test Done → Report Uploaded → Invoice Raised
  - **Special condition at "Reached Lab"**: instead of directly choosing NFT or Test Scheduled, lab must first "Propose Testing Date" (approx 15 days from received date). This proposal is sent to Compliance Officer for approval.
  - After CO approves the date, status moves to "Test Scheduled" and normal flow resumes.
  - NFT option still available at Reached Lab (terminal, with attachment).
- **Compliance Officer sidebar navigation**: Dashboard, Failed Cases, 2nd Check Test Approvals, Scheduling Approvals

### Modify
- Login page: add complianceofficer@bee.gov.in as a recognized credential
- App routing: add `/compliance-officer/*` routes
- AuthContext: add 'complianceofficer' as a valid role
- Login page credentials list: include Compliance Officer

### Remove
- Nothing removed

## Implementation Plan
1. Add `complianceofficer` role to AuthContext and login credentials
2. Create global state (Context or shared mock data) for:
   - `failedCases`: cases with status Fail from Test Report
   - `secondCheckRequests`: failed cases broadcast to purchasers
   - `schedulingProposals`: date proposals from labs pending CO approval
   - `secondCheckSamples`: 2nd check samples with their dual-lab assignments and status
3. Create `ComplianceOfficerDashboard.tsx` with KPI cards, failed cases table, Initiate button, and scheduling approvals tab
4. Create `ComplianceOfficerFailedCasesPage.tsx`
5. Create `ComplianceOfficerSchedulingPage.tsx` for date approval
6. Create `SecondCheckTestPage.tsx` for Purchaser (shows broadcast cases, block with 2 units, dual lab assignment)
7. Update `LabDashboard` and Lab sidebar to include "2nd Check Test" tab
8. Create `LabSecondCheckPage.tsx` with full status workflow + date proposal step at Reached Lab
9. Add routes in App.tsx for compliance officer and new purchaser/lab pages
10. Update login page to show Compliance Officer credentials

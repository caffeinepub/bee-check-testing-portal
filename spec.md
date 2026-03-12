# BEE Check Testing Portal

## Current State
The portal has a multi-role workflow: Purchaser blocks/purchases products, Test Lab runs tests and uploads reports, BEE Official reviews and approves (L2 approval). After BEE Official approval, there is no dedicated testing oversight module for the BEE Director.

## Requested Changes (Diff)

### Add
- **Director Testing Module** (`/director/testing`): A dedicated page for BEE Director to oversee all post-approval testing activities after BEE Official L2 final approval.
  - Summary stats: Total Approved by Official, Under Director Review, Passed Final, Failed Final
  - Table of BEE Official-approved cases with appliance, brand, model, star rating, approving official, approval date, test lab, test result (Pass/Fail), and Director decision (Approve Final / Send Back)
  - Director Approve Final action: marks item as "Director Approved" with remarks
  - Director Send Back action: reverts with remarks to BEE Official for re-review
  - Status badge system: Official Approved → Director Review → Director Approved / Sent Back
  - Filter tabs: All, Pending Director Review, Director Approved, Sent Back
  - Workflow timeline showing: Purchased → Test Lab → BEE Official Approved → Director Final → Compliance Cleared

### Modify
- **Layout.tsx**: Add "Testing Module" nav item under Director role sidebar
- **App.tsx**: Add route `testing` for `DirectorTestingPage`
- **DirectorDashboard.tsx**: Add quick-nav tile for Testing Module

### Remove
- Nothing removed

## Implementation Plan
1. Create `src/frontend/src/pages/director/DirectorTestingPage.tsx` with full testing oversight module
2. Update `Layout.tsx` to add Testing Module nav item for director role
3. Update `App.tsx` to import and route to `DirectorTestingPage`
4. Update `DirectorDashboard.tsx` to add quick-nav link for Testing Module

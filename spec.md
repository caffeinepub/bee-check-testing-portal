# BEE Check Testing Portal

## Current State
Lab User has: Dashboard, Assigned Samples, Update Status (fit/notfit only), Upload Report pages. Status tracking is minimal with no date logs and no sequential workflow.

## Requested Changes (Diff)

### Add
- Sequential status workflow: In-Transit, Reached Lab, Test Scheduled, Under Testing, Test Done, Report Uploaded (attachment), NFT, Invoice Raised (attachment)
- Date/timestamp log for every status change
- Attachment option on Report Uploaded and Invoice Raised statuses
- New Revert from BEE tab showing samples returned from BEE

### Modify
- AssignedSamplesPage: tabbed interface with Sample Tracking and Revert from BEE tabs
- Status update: inline Update Status button per sample, dialog to advance to next status with date + remarks + file upload where needed

### Remove
- Old UpdateStatusPage standalone form (merged into new workflow)

## Implementation Plan
1. Update AssignedSamplesPage with two tabs (Sample Tracking and Revert from BEE)
2. Sample Tracking: table with status badge, expandable date log timeline, Update Status dialog
3. Revert from BEE: table of returned samples with reason and date
4. Update mock data with new status values and statusLog arrays
5. Update Layout.tsx lab nav

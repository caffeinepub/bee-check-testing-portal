# BEE Check Testing Portal

## Current State
The portal has 6 user roles: Director, BEE Official, SDA Purchaser, Test Lab, Lab Coordinator, Compliance Officer. Each role has its own dashboard and sidebar navigation. The Financial Monitoring page exists under the Director role but there is no dedicated Financial Official user.

## Requested Changes (Diff)

### Add
- New user role: `financialofficial` with email `financial@bee.gov.in` / Password@123
- New Financial Official dashboard with:
  - Left sidebar with 3 expandable top-level sections: **State**, **BEE**, **LAB**
  - When **State** is clicked/expanded, it shows 8 sub-tabs: Summary, Bill Wise Details, Appliance Wise, Expenses Head, Invoice Data, Lab Wise, Vendor Wise, Brand Wise
  - A **State-wise filter** dropdown at the top of the main content area — selecting a state filters all data in all sub-tabs
  - Mock data for each sub-tab reflecting financial monitoring data (state-wise fund allocation, bill amounts, appliance-wise spend, expense heads, invoices, lab-wise costs, vendor-wise details, brand-wise data)
  - BEE and LAB sections in sidebar are placeholders ("Coming Soon" or empty state) for now
- Role color for Financial Official: orange/amber theme
- Role label: "Financial Official"

### Modify
- `AuthContext.tsx`: Add `financialofficial` to UserRole type and demoAccounts
- `LoginPage.tsx`: Add `financialofficial` to roleColors map
- `Layout.tsx`: Add nav items for financialofficial role with the three expandable sidebar sections (State, BEE, LAB)
- `App.tsx`: Add routing for financialofficial role with sub-page navigation

### Remove
- Nothing removed

## Implementation Plan
1. Update AuthContext with new role and account
2. Create `src/frontend/src/pages/financialofficial/FinancialOfficialDashboard.tsx` — main dashboard with state filter and tabs
   - State summary cards (total allocation, spent, balance, utilization %)
   - Sub-tab content components inline
2a. Sub-tabs:
   - **Summary**: KPI cards (Total Sanctioned Amount, Total Expenditure, Balance, No. of Bills, States Covered), summary table by state
   - **Bill Wise Details**: Table with Bill No, Date, Amount, State, Status, Description
   - **Appliance Wise**: Table with Appliance Category, No. of Units, Unit Cost, Total Cost, State
   - **Expenses Head**: Table with Expense Head, Budget Allocated, Expenditure, Balance, %Utilized
   - **Invoice Data**: Table with Invoice No, Vendor, Date, Amount, GST, Total, Status
   - **Lab Wise**: Table with Lab Name, Location, No. of Tests, Cost per Test, Total Amount
   - **Vendor Wise**: Table with Vendor Name, Category, No. of Bills, Total Amount, Status
   - **Brand Wise**: Table with Brand, Model, Tests, Cost, Pass/Fail ratio
3. Update Layout.tsx with financial official nav (expandable State section)
4. Update App.tsx with financialofficial routing
5. Validate build

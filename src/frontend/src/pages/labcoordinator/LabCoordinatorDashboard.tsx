import { Button } from "@/components/ui/button";
import { FlaskConical } from "lucide-react";
import { useBlockedSamples } from "../../contexts/BlockedSamplesContext";

interface Props {
  onNavigate: (page: string) => void;
}

export default function LabCoordinatorDashboard({ onNavigate }: Props) {
  const { blockedSamples, secondCheckLabRequests } = useBlockedSamples();

  // 1st Check Test stats
  const firstCheckTotal = blockedSamples.length;
  const firstCheckAssigned = blockedSamples.filter(
    (s) => !!s.labAssignment,
  ).length;
  const firstCheckPending = blockedSamples.filter(
    (s) => !s.labAssignment,
  ).length;

  // 2nd Check Test stats
  const secondCheckTotal = secondCheckLabRequests.length;
  const secondCheckAssigned = secondCheckLabRequests.filter(
    (r) => !!r.labName,
  ).length;
  const secondCheckPending = secondCheckLabRequests.filter(
    (r) => !r.labName,
  ).length;

  const recent = blockedSamples.slice(0, 5);

  const rows = [
    {
      label: "1st Check Test",
      total: firstCheckTotal,
      assigned: firstCheckAssigned,
      pending: firstCheckPending,
      color: "#1a3a6b",
      bg: "#eff6ff",
      border: "#bfdbfe",
      badgePending: { bg: "#fef3c7", text: "#92400e" },
      badgeAssigned: { bg: "#d1fae5", text: "#065f46" },
      navigateTo: "assignlab",
    },
    {
      label: "2nd Check Test",
      total: secondCheckTotal,
      assigned: secondCheckAssigned,
      pending: secondCheckPending,
      color: "#7c3aed",
      bg: "#f5f3ff",
      border: "#ddd6fe",
      badgePending: { bg: "#fef3c7", text: "#92400e" },
      badgeAssigned: { bg: "#d1fae5", text: "#065f46" },
      navigateTo: "assignlab",
    },
  ];

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-bold" style={{ color: "#1a3a6b" }}>
          Lab Coordinator Dashboard
        </h2>
        <p className="text-gray-500 text-sm">
          Manage lab assignments for blocked samples
        </p>
      </div>

      {/* Summary Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden mb-6">
        <div
          className="px-5 py-3.5"
          style={{
            borderBottom: "1px solid #e2e8f0",
            backgroundColor: "#f8fafc",
          }}
        >
          <h3 className="font-semibold text-sm" style={{ color: "#1a3a6b" }}>
            Sample Assignment Summary
          </h3>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr style={{ backgroundColor: "#1a3a6b" }}>
              {[
                "Check Type",
                "Total Blocked Samples",
                "Total Lab Assigned",
                "Pending Lab Assigned",
                "Action",
              ].map((h) => (
                <th
                  key={h}
                  className="text-left px-5 py-3 text-xs text-white font-semibold tracking-wide"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr
                key={row.label}
                className="border-b border-gray-100"
                style={{ backgroundColor: i % 2 === 0 ? "#ffffff" : "#f8fafc" }}
              >
                {/* Check Type */}
                <td className="px-5 py-4">
                  <div className="flex items-center gap-2">
                    <span
                      className="inline-block w-2.5 h-2.5 rounded-full"
                      style={{ backgroundColor: row.color }}
                    />
                    <span
                      className="font-semibold text-sm"
                      style={{ color: row.color }}
                    >
                      {row.label}
                    </span>
                  </div>
                </td>

                {/* Total Blocked Samples */}
                <td className="px-5 py-4">
                  <span
                    className="inline-flex items-center justify-center w-9 h-9 rounded-full text-white font-bold text-sm"
                    style={{ backgroundColor: row.color }}
                  >
                    {row.total}
                  </span>
                </td>

                {/* Total Lab Assigned */}
                <td className="px-5 py-4">
                  <span
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold"
                    style={{
                      backgroundColor: row.badgeAssigned.bg,
                      color: row.badgeAssigned.text,
                    }}
                  >
                    {row.assigned}
                  </span>
                </td>

                {/* Pending Lab Assigned */}
                <td className="px-5 py-4">
                  <span
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold"
                    style={{
                      backgroundColor:
                        row.pending > 0 ? row.badgePending.bg : "#f0fdf4",
                      color:
                        row.pending > 0 ? row.badgePending.text : "#065f46",
                    }}
                  >
                    {row.pending}
                  </span>
                </td>

                {/* Action */}
                <td className="px-5 py-4">
                  <Button
                    size="sm"
                    onClick={() => onNavigate(row.navigateTo)}
                    style={{ backgroundColor: row.color, color: "white" }}
                    className="text-xs"
                  >
                    Assign Labs
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Recent blocked samples table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div
          className="px-5 py-3.5 flex items-center justify-between"
          style={{ borderBottom: "1px solid #e2e8f0" }}
        >
          <h3 className="font-semibold text-sm" style={{ color: "#1a3a6b" }}>
            Recent Blocked Samples
          </h3>
          <Button
            data-ocid="labcoord.view_all.button"
            variant="outline"
            size="sm"
            className="text-xs"
            onClick={() => onNavigate("assignlab")}
          >
            View All
          </Button>
        </div>

        {blockedSamples.length === 0 ? (
          <div
            className="py-12 text-center"
            data-ocid="labcoord.recent.empty_state"
          >
            <FlaskConical size={32} className="mx-auto mb-3 text-gray-300" />
            <p className="text-gray-400 text-sm">
              No blocked samples yet. Samples will appear here when purchasers
              block products.
            </p>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr style={{ backgroundColor: "#1a3a6b" }}>
                {["Product", "Brand", "Model", "Blocked On", "Status"].map(
                  (h) => (
                    <th
                      key={h}
                      className="text-left px-4 py-2.5 text-xs text-white font-medium"
                    >
                      {h}
                    </th>
                  ),
                )}
              </tr>
            </thead>
            <tbody>
              {recent.map((s, i) => (
                <tr
                  key={s.id}
                  className="border-b border-gray-100 hover:bg-blue-50"
                  data-ocid={`labcoord.sample.item.${i + 1}`}
                >
                  <td className="px-4 py-2.5 text-xs text-gray-700">
                    {s.categoryName}
                  </td>
                  <td className="px-4 py-2.5 text-xs font-medium text-gray-800">
                    {s.brandName}
                  </td>
                  <td className="px-4 py-2.5 text-xs font-mono text-gray-700">
                    {s.modelNumber}
                  </td>
                  <td className="px-4 py-2.5 text-xs text-gray-500">
                    {new Date(s.blockedAt).toLocaleDateString("en-IN")}
                  </td>
                  <td className="px-4 py-2.5">
                    {s.labAssignment ? (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-green-100 text-green-800 font-medium">
                        Lab Assigned
                      </span>
                    ) : (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-yellow-100 text-yellow-800 font-medium">
                        Pending
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

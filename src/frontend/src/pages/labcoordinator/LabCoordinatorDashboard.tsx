import { Button } from "@/components/ui/button";
import {
  AlertCircle,
  CheckCircle2,
  ClipboardList,
  FlaskConical,
} from "lucide-react";
import { useBlockedSamples } from "../../contexts/BlockedSamplesContext";

interface Props {
  onNavigate: (page: string) => void;
}

export default function LabCoordinatorDashboard({ onNavigate }: Props) {
  const { blockedSamples, secondCheckLabRequests } = useBlockedSamples();

  const pending = blockedSamples.filter((s) => !s.labAssignment);
  const assigned = blockedSamples.filter((s) => !!s.labAssignment);
  const recent = blockedSamples.slice(0, 5);
  const pendingSecondCheck = secondCheckLabRequests.filter((r) => !r.labName);

  const kpis = [
    {
      label: "Total Blocked Samples",
      value: blockedSamples.length,
      color: "#1a3a6b",
      bg: "#eff6ff",
      border: "#bfdbfe",
      icon: <FlaskConical size={20} style={{ color: "#1a3a6b" }} />,
    },
    {
      label: "Pending Lab Assignment",
      value: pending.length,
      color: "#b45309",
      bg: "#fffbeb",
      border: "#fde68a",
      icon: <AlertCircle size={20} style={{ color: "#b45309" }} />,
    },
    {
      label: "Lab Assigned",
      value: assigned.length,
      color: "#065f46",
      bg: "#f0fdf4",
      border: "#bbf7d0",
      icon: <CheckCircle2 size={20} style={{ color: "#065f46" }} />,
    },
    {
      label: "2nd Check Pending",
      value: pendingSecondCheck.length,
      color: "#7c3aed",
      bg: "#f5f3ff",
      border: "#ddd6fe",
      icon: <ClipboardList size={20} style={{ color: "#7c3aed" }} />,
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

      {/* Regular pending notification banner */}
      {pending.length > 0 && (
        <div
          className="mb-4 p-4 rounded-xl flex items-center justify-between gap-4"
          style={{ backgroundColor: "#fffbeb", border: "1px solid #fde68a" }}
          data-ocid="labcoord.pending.panel"
        >
          <div className="flex items-center gap-3">
            <AlertCircle
              size={22}
              style={{ color: "#d97706", flexShrink: 0 }}
            />
            <p className="text-sm font-semibold" style={{ color: "#92400e" }}>
              You have <strong>{pending.length}</strong> regular sample(s)
              pending lab assignment.
            </p>
          </div>
          <Button
            data-ocid="labcoord.assign_labs.button"
            size="sm"
            onClick={() => onNavigate("assignlab")}
            style={{ backgroundColor: "#d97706", color: "white" }}
          >
            Assign Labs Now
          </Button>
        </div>
      )}

      {/* 2nd Check pending notification banner */}
      {pendingSecondCheck.length > 0 && (
        <div
          className="mb-5 p-4 rounded-xl flex items-center justify-between gap-4"
          style={{ backgroundColor: "#f5f3ff", border: "1px solid #ddd6fe" }}
          data-ocid="labcoord.secondcheck_pending.panel"
        >
          <div className="flex items-center gap-3">
            <FlaskConical
              size={22}
              style={{ color: "#7c3aed", flexShrink: 0 }}
            />
            <p className="text-sm font-semibold" style={{ color: "#4c1d95" }}>
              <strong>{pendingSecondCheck.length}</strong> 2nd Check Test
              sample(s) awaiting lab assignment from purchasers.
            </p>
          </div>
          <Button
            data-ocid="labcoord.assign_secondcheck.button"
            size="sm"
            onClick={() => onNavigate("assignlab")}
            style={{ backgroundColor: "#7c3aed", color: "white" }}
          >
            Assign 2nd Check Labs
          </Button>
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {kpis.map((k) => (
          <div
            key={k.label}
            className="rounded-xl p-4"
            style={{ backgroundColor: k.bg, border: `1px solid ${k.border}` }}
          >
            <div className="flex items-center justify-between mb-2">
              {k.icon}
            </div>
            <p className="text-2xl font-bold" style={{ color: k.color }}>
              {k.value}
            </p>
            <p className="text-xs text-gray-600 mt-1">{k.label}</p>
          </div>
        ))}
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

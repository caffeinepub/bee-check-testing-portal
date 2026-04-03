import { CheckCircle, ClipboardList, Clock } from "lucide-react";
import { useBlockedSamples } from "../../contexts/BlockedSamplesContext";

interface Props {
  onNavigate: (page: string) => void;
}

function KpiCard({
  icon,
  label,
  value,
  bg,
  iconBg,
  textColor,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
  bg: string;
  iconBg: string;
  textColor: string;
}) {
  return (
    <div
      className="flex items-center gap-4 rounded-xl px-6 py-5 shadow-sm border"
      style={{ backgroundColor: bg, borderColor: iconBg }}
    >
      <div
        className="flex items-center justify-center w-12 h-12 rounded-full"
        style={{ backgroundColor: iconBg }}
      >
        {icon}
      </div>
      <div>
        <div className="text-2xl font-bold" style={{ color: textColor }}>
          {value}
        </div>
        <div className="text-xs text-gray-500 font-medium mt-0.5">{label}</div>
      </div>
    </div>
  );
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default function LabCoordinatorDashboard({
  onNavigate: _onNavigate,
}: Props) {
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

  return (
    <div>
      <div className="mb-7">
        <h2 className="text-xl font-bold" style={{ color: "#1a3a6b" }}>
          Lab Coordinator Dashboard
        </h2>
        <p className="text-gray-500 text-sm mt-0.5">
          Sample assignment overview
        </p>
      </div>

      {/* Row 1: 1st Check Test */}
      <div className="mb-7">
        <div className="flex items-center gap-2 mb-3">
          <span
            className="inline-block w-3 h-3 rounded-full"
            style={{ backgroundColor: "#1a3a6b" }}
          />
          <h3 className="font-semibold text-sm" style={{ color: "#1a3a6b" }}>
            1st Check Test
          </h3>
        </div>
        <div className="grid grid-cols-3 gap-4">
          <KpiCard
            icon={<ClipboardList size={22} color="#1a3a6b" />}
            label="Total Blocked Samples"
            value={firstCheckTotal}
            bg="#eff6ff"
            iconBg="#bfdbfe"
            textColor="#1a3a6b"
          />
          <KpiCard
            icon={<CheckCircle size={22} color="#065f46" />}
            label="Total Lab Assigned"
            value={firstCheckAssigned}
            bg="#f0fdf4"
            iconBg="#bbf7d0"
            textColor="#065f46"
          />
          <KpiCard
            icon={<Clock size={22} color="#92400e" />}
            label="Pending Lab Assigned"
            value={firstCheckPending}
            bg="#fffbeb"
            iconBg="#fde68a"
            textColor="#92400e"
          />
        </div>
      </div>

      {/* Row 2: 2nd Check Test */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <span
            className="inline-block w-3 h-3 rounded-full"
            style={{ backgroundColor: "#7c3aed" }}
          />
          <h3 className="font-semibold text-sm" style={{ color: "#7c3aed" }}>
            2nd Check Test
          </h3>
        </div>
        <div className="grid grid-cols-3 gap-4">
          <KpiCard
            icon={<ClipboardList size={22} color="#7c3aed" />}
            label="Total Blocked Samples"
            value={secondCheckTotal}
            bg="#f5f3ff"
            iconBg="#ddd6fe"
            textColor="#7c3aed"
          />
          <KpiCard
            icon={<CheckCircle size={22} color="#065f46" />}
            label="Total Lab Assigned"
            value={secondCheckAssigned}
            bg="#f0fdf4"
            iconBg="#bbf7d0"
            textColor="#065f46"
          />
          <KpiCard
            icon={<Clock size={22} color="#92400e" />}
            label="Pending Lab Assigned"
            value={secondCheckPending}
            bg="#fffbeb"
            iconBg="#fde68a"
            textColor="#92400e"
          />
        </div>
      </div>
    </div>
  );
}

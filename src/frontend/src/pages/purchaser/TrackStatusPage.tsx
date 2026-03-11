import { mockSamples } from "../../data/mockData";

const statusOrder = [
  "Blocked",
  "Purchased",
  "InTransit",
  "SampleReceived",
  "TestScheduled",
  "InTesting",
  "SampleTested",
  "ReportUploaded",
  "Approved",
];

export default function TrackStatusPage() {
  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-bold" style={{ color: "#1a3a6b" }}>
          Track Sample Status
        </h2>
        <p className="text-gray-500 text-sm">
          Real-time status tracking for your samples
        </p>
      </div>
      <div className="space-y-4">
        {mockSamples.slice(0, 6).map((s, idx) => {
          const currentStep = statusOrder.indexOf(s.status);
          return (
            <div
              key={s.id}
              data-ocid={`track.sample.${idx + 1}`}
              className="bg-white rounded-lg border border-gray-200 shadow-sm p-4"
            >
              <div className="flex justify-between items-start mb-3">
                <div>
                  <p className="font-semibold text-gray-800">
                    {s.brandName} - {s.modelNumber}
                  </p>
                  <p className="text-xs text-gray-500">
                    {s.categoryName} | {s.state} | {s.labName}
                  </p>
                </div>
                <span
                  className={`text-xs px-2 py-1 rounded-full font-medium ${
                    s.status === "Approved"
                      ? "bg-green-100 text-green-800"
                      : s.status === "Rejected"
                        ? "bg-red-100 text-red-800"
                        : "bg-blue-100 text-blue-800"
                  }`}
                >
                  {s.status}
                </span>
              </div>
              <div className="flex items-center overflow-x-auto">
                {statusOrder.map((step, i) => {
                  const isCompleted = i < currentStep;
                  const isCurrent = i === currentStep;
                  return (
                    <div key={step} className="flex items-center min-w-0">
                      <div
                        className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                          isCompleted
                            ? "bg-green-500 text-white"
                            : isCurrent
                              ? "text-white"
                              : "bg-gray-200 text-gray-400"
                        }`}
                        style={isCurrent ? { backgroundColor: "#1a3a6b" } : {}}
                      >
                        {isCompleted ? "✓" : i + 1}
                      </div>
                      {i < statusOrder.length - 1 && (
                        <div
                          className={`h-0.5 w-6 flex-shrink-0 ${isCompleted ? "bg-green-500" : "bg-gray-200"}`}
                        />
                      )}
                    </div>
                  );
                })}
              </div>
              <div className="flex justify-between mt-1">
                <p className="text-xs text-gray-400">Blocked</p>
                <p className="text-xs text-gray-400">Approved</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

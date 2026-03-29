import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ChevronRight } from "lucide-react";
import { useState } from "react";
import { applianceCategories, labs, mockSamples } from "../../data/mockData";

type DrillLevel = "lab" | "category" | "state";

export default function LabMonitoringPage() {
  const [drillLevel, setDrillLevel] = useState<DrillLevel>("lab");
  const [selectedLab, setSelectedLab] = useState<(typeof labs)[0] | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const getSampleStats = (
    labId?: number,
    category?: string,
    state?: string,
  ) => {
    let samples = mockSamples;
    if (labId) samples = samples.filter((s) => s.labId === labId);
    if (category) samples = samples.filter((s) => s.categoryName === category);
    if (state) samples = samples.filter((s) => s.state === state);
    return {
      assigned: samples.length,
      inTransit: samples.filter((s) => s.status === "InTransit").length,
      reached: samples.filter((s) => s.status === "SampleReceived").length,
      nft: samples.filter((s) => s.status === "NotFitForTest").length,
      underTesting: samples.filter((s) => s.status === "InTesting").length,
      tested: samples.filter((s) =>
        ["SampleTested", "ReportUploaded", "Approved"].includes(s.status),
      ).length,
      pass: samples.filter((s) => s.status === "Approved").length,
      fail: samples.filter((s) => s.status === "Rejected").length,
    };
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-bold" style={{ color: "#1a3a6b" }}>
          Lab Test Monitoring
        </h2>
        <p className="text-gray-500 text-sm">
          Drill-down: Lab → Appliance Category → State
        </p>
      </div>

      {/* Breadcrumb */}
      <div className="flex items-center gap-2 mb-4 text-sm">
        <button
          type="button"
          data-ocid="lab.breadcrumb_lab.link"
          onClick={() => {
            setDrillLevel("lab");
            setSelectedLab(null);
            setSelectedCategory(null);
          }}
          className={`hover:text-blue-700 ${drillLevel === "lab" ? "font-bold text-blue-700" : "text-gray-500"}`}
        >
          All Labs
        </button>
        {selectedLab && (
          <>
            <ChevronRight size={14} className="text-gray-400" />
            <button
              type="button"
              data-ocid="lab.breadcrumb_category.link"
              onClick={() => {
                setDrillLevel("category");
                setSelectedCategory(null);
              }}
              className={`hover:text-blue-700 ${drillLevel === "category" ? "font-bold text-blue-700" : "text-gray-500"}`}
            >
              {selectedLab.name}
            </button>
          </>
        )}
        {selectedCategory && (
          <>
            <ChevronRight size={14} className="text-gray-400" />
            <span className="font-bold text-blue-700">{selectedCategory}</span>
          </>
        )}
      </div>

      <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
        {drillLevel === "lab" && (
          <Table>
            <TableHeader>
              <TableRow style={{ backgroundColor: "#1a3a6b" }}>
                {[
                  "Lab Name",
                  "Assigned",
                  "In-Transit",
                  "Reached Lab",
                  "NFT",
                  "Under Testing",
                  "Tested",
                  "Pass",
                  "Fail",
                ].map((h) => (
                  <TableHead key={h} className="text-white text-xs">
                    {h}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {labs.map((lab, i) => {
                const stats = getSampleStats(lab.id);
                return (
                  <TableRow
                    key={lab.id}
                    data-ocid={`lab.row.${i + 1}`}
                    className="hover:bg-blue-50"
                  >
                    <TableCell>
                      <button
                        type="button"
                        data-ocid={`lab.name.button.${i + 1}`}
                        onClick={() => {
                          setSelectedLab(lab);
                          setDrillLevel("category");
                        }}
                        className="text-blue-600 hover:underline font-medium text-sm"
                      >
                        {lab.name}
                      </button>
                    </TableCell>
                    <TableCell className="text-sm">{stats.assigned}</TableCell>
                    <TableCell className="text-sm">{stats.inTransit}</TableCell>
                    <TableCell className="text-sm">{stats.reached}</TableCell>
                    <TableCell
                      className={`text-sm font-medium ${stats.nft > 0 ? "text-red-600" : "text-gray-400"}`}
                    >
                      {stats.nft}
                    </TableCell>
                    <TableCell className="text-sm">
                      {stats.underTesting}
                    </TableCell>
                    <TableCell className="text-sm">{stats.tested}</TableCell>
                    <TableCell className="text-sm text-green-700 font-medium">
                      {stats.pass}
                    </TableCell>
                    <TableCell className="text-sm text-red-600 font-medium">
                      {stats.fail}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}

        {drillLevel === "category" && selectedLab && (
          <Table>
            <TableHeader>
              <TableRow style={{ backgroundColor: "#1a3a6b" }}>
                {[
                  "Appliance Category",
                  "Assigned",
                  "In-Transit",
                  "Reached Lab",
                  "NFT",
                  "Under Testing",
                  "Tested",
                  "Pass",
                  "Fail",
                ].map((h) => (
                  <TableHead key={h} className="text-white text-xs">
                    {h}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {applianceCategories.map((cat, i) => {
                const stats = getSampleStats(selectedLab.id, cat.name);
                if (stats.assigned === 0) return null;
                return (
                  <TableRow
                    key={cat.id}
                    data-ocid={`lab_cat.row.${i + 1}`}
                    className="hover:bg-blue-50"
                  >
                    <TableCell>
                      <button
                        type="button"
                        data-ocid={`lab_cat.name.button.${i + 1}`}
                        onClick={() => {
                          setSelectedCategory(cat.name);
                          setDrillLevel("state");
                        }}
                        className="text-blue-600 hover:underline font-medium text-sm"
                      >
                        {cat.name}
                      </button>
                    </TableCell>
                    <TableCell className="text-sm">{stats.assigned}</TableCell>
                    <TableCell className="text-sm">{stats.inTransit}</TableCell>
                    <TableCell className="text-sm">{stats.reached}</TableCell>
                    <TableCell
                      className={`text-sm font-medium ${stats.nft > 0 ? "text-red-600" : "text-gray-400"}`}
                    >
                      {stats.nft}
                    </TableCell>
                    <TableCell className="text-sm">
                      {stats.underTesting}
                    </TableCell>
                    <TableCell className="text-sm">{stats.tested}</TableCell>
                    <TableCell className="text-sm text-green-700 font-medium">
                      {stats.pass}
                    </TableCell>
                    <TableCell className="text-sm text-red-600 font-medium">
                      {stats.fail}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}

        {drillLevel === "state" && selectedLab && selectedCategory && (
          <Table>
            <TableHeader>
              <TableRow style={{ backgroundColor: "#1a3a6b" }}>
                {[
                  "State",
                  "Assigned",
                  "Under Testing",
                  "Tested",
                  "Pass",
                  "Fail",
                ].map((h) => (
                  <TableHead key={h} className="text-white text-xs">
                    {h}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {[
                ...new Set(
                  mockSamples
                    .filter(
                      (s) =>
                        s.labId === selectedLab.id &&
                        s.categoryName === selectedCategory,
                    )
                    .map((s) => s.state),
                ),
              ].map((state, i) => {
                const stats = getSampleStats(
                  selectedLab.id,
                  selectedCategory,
                  state,
                );
                return (
                  <TableRow
                    key={state}
                    data-ocid={`lab_state.row.${i + 1}`}
                    className="hover:bg-blue-50"
                  >
                    <TableCell className="text-sm font-medium">
                      {state}
                    </TableCell>
                    <TableCell className="text-sm">{stats.assigned}</TableCell>
                    <TableCell className="text-sm">
                      {stats.underTesting}
                    </TableCell>
                    <TableCell className="text-sm">{stats.tested}</TableCell>
                    <TableCell className="text-sm text-green-700 font-medium">
                      {stats.pass}
                    </TableCell>
                    <TableCell className="text-sm text-red-600 font-medium">
                      {stats.fail}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  );
}

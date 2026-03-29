import { Card, CardContent } from "@/components/ui/card";
import { Package, ShoppingCart, Target, Truck } from "lucide-react";
import { mockSamples } from "../../data/mockData";

interface Props {
  onNavigate: (page: string) => void;
}

export default function PurchaserDashboard({ onNavigate }: Props) {
  const myState = "Maharashtra";
  const mySamples = mockSamples.filter((s) => s.state === myState);
  const total = 10;
  const blocked = mySamples.filter((s) => s.status === "Blocked").length;
  const purchased = mySamples.filter(
    (s) => !["Blocked"].includes(s.status),
  ).length;
  const inTransit = mySamples.filter((s) => s.status === "InTransit").length;
  const balance = total - purchased;

  const kpis = [
    {
      label: "Total Target",
      value: total,
      icon: <Target className="text-blue-600" size={22} />,
      color: "#dbeafe",
      nav: "search",
    },
    {
      label: "Blocked",
      value: blocked,
      icon: <Package className="text-yellow-600" size={22} />,
      color: "#fef3c7",
      nav: "purchases",
    },
    {
      label: "Purchased",
      value: purchased,
      icon: <ShoppingCart className="text-green-600" size={22} />,
      color: "#dcfce7",
      nav: "purchases",
    },
    {
      label: "In Transit",
      value: inTransit,
      icon: <Truck className="text-orange-600" size={22} />,
      color: "#ffedd5",
      nav: "track",
    },
  ];

  return (
    <div>
      <div
        className="mb-4 p-4 rounded-lg border-2 flex items-center justify-between"
        style={{ backgroundColor: "#eff6ff", borderColor: "#1a3a6b" }}
      >
        <div>
          <p className="text-xs text-gray-600">Available Purchase Balance</p>
          <p className="text-3xl font-bold" style={{ color: "#1a3a6b" }}>
            {balance}{" "}
            <span className="text-base font-normal">units remaining</span>
          </p>
          <p className="text-xs text-gray-500">FY 2024-25 | {myState} SDA</p>
        </div>
        <button
          type="button"
          data-ocid="purchaser.search.primary_button"
          onClick={() => onNavigate("search")}
          className="px-4 py-2 rounded-lg text-sm font-medium text-white"
          style={{ backgroundColor: "#1a3a6b" }}
        >
          + Search & Block Product
        </button>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        {kpis.map((kpi) => (
          <button
            type="button"
            key={kpi.label}
            data-ocid={`purchaser.kpi_${kpi.label.toLowerCase().replace(/ /g, "_")}.card`}
            onClick={() => onNavigate(kpi.nav)}
            className="text-left"
          >
            <Card className="hover:shadow-md transition-shadow border border-gray-200">
              <CardContent className="pt-4 pb-4">
                <div
                  className="p-2 rounded-lg w-fit mb-2"
                  style={{ backgroundColor: kpi.color }}
                >
                  {kpi.icon}
                </div>
                <p className="text-2xl font-bold">{kpi.value}</p>
                <p className="text-xs text-gray-500 mt-1">{kpi.label}</p>
              </CardContent>
            </Card>
          </button>
        ))}
      </div>
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4">
        <h3 className="font-semibold text-gray-800 mb-3 text-sm">
          Recent Purchases
        </h3>
        <div className="space-y-2">
          {mySamples.slice(0, 4).map((s, i) => (
            <div
              key={s.id}
              data-ocid={`purchaser.recent.item.${i + 1}`}
              className="flex justify-between items-center p-2 rounded border border-gray-100 hover:bg-gray-50"
            >
              <div>
                <p className="text-sm font-medium">
                  {s.brandName} {s.modelNumber}
                </p>
                <p className="text-xs text-gray-500">
                  {s.categoryName} | {s.labName}
                </p>
              </div>
              <span className="text-xs px-2 py-0.5 rounded-full bg-blue-100 text-blue-800">
                {s.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

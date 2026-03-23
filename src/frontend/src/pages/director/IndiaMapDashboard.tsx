import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { X } from "lucide-react";
import { useCallback, useRef, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Tooltip as RechartTooltip,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";

// ── Types ─────────────────────────────────────────────────────────────────────
interface StateData {
  id: string;
  name: string;
  region: string;
  complianceRate: number;
  productsTested: number;
  passRate: number;
  targetsAchieved: number;
  purchased: number;
  categories: { name: string; value: number }[];
  monthlyTrend: { month: string; value: number }[];
}

type MetricKey =
  | "complianceRate"
  | "productsTested"
  | "passRate"
  | "targetsAchieved"
  | "purchased";

// ── Mock Data ─────────────────────────────────────────────────────────────────
const stateData: Record<string, StateData> = {
  mh: {
    id: "mh",
    name: "Maharashtra",
    region: "West",
    complianceRate: 87,
    productsTested: 312,
    passRate: 82,
    targetsAchieved: 91,
    purchased: 187,
    categories: [
      { name: "AC", value: 72 },
      { name: "Refrigerator", value: 65 },
      { name: "Washing Machine", value: 58 },
      { name: "LED", value: 80 },
      { name: "Fan", value: 37 },
    ],
    monthlyTrend: [
      { month: "Sep", value: 78 },
      { month: "Oct", value: 80 },
      { month: "Nov", value: 83 },
      { month: "Dec", value: 85 },
      { month: "Jan", value: 86 },
      { month: "Feb", value: 87 },
    ],
  },
  rj: {
    id: "rj",
    name: "Rajasthan",
    region: "North",
    complianceRate: 74,
    productsTested: 198,
    passRate: 71,
    targetsAchieved: 78,
    purchased: 112,
    categories: [
      { name: "AC", value: 55 },
      { name: "Refrigerator", value: 48 },
      { name: "Washing Machine", value: 40 },
      { name: "LED", value: 62 },
      { name: "Fan", value: 28 },
    ],
    monthlyTrend: [
      { month: "Sep", value: 65 },
      { month: "Oct", value: 68 },
      { month: "Nov", value: 70 },
      { month: "Dec", value: 72 },
      { month: "Jan", value: 73 },
      { month: "Feb", value: 74 },
    ],
  },
  up: {
    id: "up",
    name: "Uttar Pradesh",
    region: "North",
    complianceRate: 69,
    productsTested: 285,
    passRate: 65,
    targetsAchieved: 72,
    purchased: 158,
    categories: [
      { name: "AC", value: 60 },
      { name: "Refrigerator", value: 55 },
      { name: "Washing Machine", value: 45 },
      { name: "LED", value: 70 },
      { name: "Fan", value: 35 },
    ],
    monthlyTrend: [
      { month: "Sep", value: 58 },
      { month: "Oct", value: 62 },
      { month: "Nov", value: 65 },
      { month: "Dec", value: 67 },
      { month: "Jan", value: 68 },
      { month: "Feb", value: 69 },
    ],
  },
  mp: {
    id: "mp",
    name: "Madhya Pradesh",
    region: "Central",
    complianceRate: 76,
    productsTested: 167,
    passRate: 73,
    targetsAchieved: 80,
    purchased: 98,
    categories: [
      { name: "AC", value: 48 },
      { name: "Refrigerator", value: 38 },
      { name: "Washing Machine", value: 32 },
      { name: "LED", value: 55 },
      { name: "Fan", value: 20 },
    ],
    monthlyTrend: [
      { month: "Sep", value: 68 },
      { month: "Oct", value: 70 },
      { month: "Nov", value: 72 },
      { month: "Dec", value: 74 },
      { month: "Jan", value: 75 },
      { month: "Feb", value: 76 },
    ],
  },
  ka: {
    id: "ka",
    name: "Karnataka",
    region: "South",
    complianceRate: 91,
    productsTested: 278,
    passRate: 88,
    targetsAchieved: 95,
    purchased: 165,
    categories: [
      { name: "AC", value: 78 },
      { name: "Refrigerator", value: 72 },
      { name: "Washing Machine", value: 65 },
      { name: "LED", value: 88 },
      { name: "Fan", value: 42 },
    ],
    monthlyTrend: [
      { month: "Sep", value: 82 },
      { month: "Oct", value: 85 },
      { month: "Nov", value: 87 },
      { month: "Dec", value: 89 },
      { month: "Jan", value: 90 },
      { month: "Feb", value: 91 },
    ],
  },
  tn: {
    id: "tn",
    name: "Tamil Nadu",
    region: "South",
    complianceRate: 88,
    productsTested: 245,
    passRate: 85,
    targetsAchieved: 90,
    purchased: 148,
    categories: [
      { name: "AC", value: 76 },
      { name: "Refrigerator", value: 68 },
      { name: "Washing Machine", value: 62 },
      { name: "LED", value: 84 },
      { name: "Fan", value: 40 },
    ],
    monthlyTrend: [
      { month: "Sep", value: 80 },
      { month: "Oct", value: 83 },
      { month: "Nov", value: 85 },
      { month: "Dec", value: 86 },
      { month: "Jan", value: 87 },
      { month: "Feb", value: 88 },
    ],
  },
  gj: {
    id: "gj",
    name: "Gujarat",
    region: "West",
    complianceRate: 82,
    productsTested: 220,
    passRate: 79,
    targetsAchieved: 85,
    purchased: 128,
    categories: [
      { name: "AC", value: 68 },
      { name: "Refrigerator", value: 60 },
      { name: "Washing Machine", value: 52 },
      { name: "LED", value: 76 },
      { name: "Fan", value: 38 },
    ],
    monthlyTrend: [
      { month: "Sep", value: 74 },
      { month: "Oct", value: 76 },
      { month: "Nov", value: 78 },
      { month: "Dec", value: 80 },
      { month: "Jan", value: 81 },
      { month: "Feb", value: 82 },
    ],
  },
  ap: {
    id: "ap",
    name: "Andhra Pradesh",
    region: "South",
    complianceRate: 80,
    productsTested: 185,
    passRate: 77,
    targetsAchieved: 83,
    purchased: 105,
    categories: [
      { name: "AC", value: 62 },
      { name: "Refrigerator", value: 55 },
      { name: "Washing Machine", value: 48 },
      { name: "LED", value: 72 },
      { name: "Fan", value: 35 },
    ],
    monthlyTrend: [
      { month: "Sep", value: 72 },
      { month: "Oct", value: 74 },
      { month: "Nov", value: 76 },
      { month: "Dec", value: 78 },
      { month: "Jan", value: 79 },
      { month: "Feb", value: 80 },
    ],
  },
  tg: {
    id: "tg",
    name: "Telangana",
    region: "South",
    complianceRate: 83,
    productsTested: 195,
    passRate: 80,
    targetsAchieved: 87,
    purchased: 115,
    categories: [
      { name: "AC", value: 68 },
      { name: "Refrigerator", value: 58 },
      { name: "Washing Machine", value: 50 },
      { name: "LED", value: 75 },
      { name: "Fan", value: 38 },
    ],
    monthlyTrend: [
      { month: "Sep", value: 75 },
      { month: "Oct", value: 77 },
      { month: "Nov", value: 79 },
      { month: "Dec", value: 81 },
      { month: "Jan", value: 82 },
      { month: "Feb", value: 83 },
    ],
  },
  wb: {
    id: "wb",
    name: "West Bengal",
    region: "East",
    complianceRate: 72,
    productsTested: 215,
    passRate: 69,
    targetsAchieved: 76,
    purchased: 122,
    categories: [
      { name: "AC", value: 52 },
      { name: "Refrigerator", value: 45 },
      { name: "Washing Machine", value: 38 },
      { name: "LED", value: 60 },
      { name: "Fan", value: 30 },
    ],
    monthlyTrend: [
      { month: "Sep", value: 63 },
      { month: "Oct", value: 66 },
      { month: "Nov", value: 68 },
      { month: "Dec", value: 70 },
      { month: "Jan", value: 71 },
      { month: "Feb", value: 72 },
    ],
  },
  or: {
    id: "or",
    name: "Odisha",
    region: "East",
    complianceRate: 65,
    productsTested: 132,
    passRate: 62,
    targetsAchieved: 68,
    purchased: 72,
    categories: [
      { name: "AC", value: 42 },
      { name: "Refrigerator", value: 35 },
      { name: "Washing Machine", value: 28 },
      { name: "LED", value: 50 },
      { name: "Fan", value: 22 },
    ],
    monthlyTrend: [
      { month: "Sep", value: 55 },
      { month: "Oct", value: 58 },
      { month: "Nov", value: 60 },
      { month: "Dec", value: 62 },
      { month: "Jan", value: 63 },
      { month: "Feb", value: 65 },
    ],
  },
  bi: {
    id: "bi",
    name: "Bihar",
    region: "East",
    complianceRate: 58,
    productsTested: 145,
    passRate: 55,
    targetsAchieved: 62,
    purchased: 78,
    categories: [
      { name: "AC", value: 38 },
      { name: "Refrigerator", value: 30 },
      { name: "Washing Machine", value: 25 },
      { name: "LED", value: 45 },
      { name: "Fan", value: 18 },
    ],
    monthlyTrend: [
      { month: "Sep", value: 48 },
      { month: "Oct", value: 51 },
      { month: "Nov", value: 54 },
      { month: "Dec", value: 56 },
      { month: "Jan", value: 57 },
      { month: "Feb", value: 58 },
    ],
  },
  jh: {
    id: "jh",
    name: "Jharkhand",
    region: "East",
    complianceRate: 61,
    productsTested: 118,
    passRate: 58,
    targetsAchieved: 65,
    purchased: 62,
    categories: [
      { name: "AC", value: 40 },
      { name: "Refrigerator", value: 32 },
      { name: "Washing Machine", value: 26 },
      { name: "LED", value: 48 },
      { name: "Fan", value: 20 },
    ],
    monthlyTrend: [
      { month: "Sep", value: 52 },
      { month: "Oct", value: 55 },
      { month: "Nov", value: 57 },
      { month: "Dec", value: 59 },
      { month: "Jan", value: 60 },
      { month: "Feb", value: 61 },
    ],
  },
  cg: {
    id: "cg",
    name: "Chhattisgarh",
    region: "Central",
    complianceRate: 67,
    productsTested: 128,
    passRate: 64,
    targetsAchieved: 70,
    purchased: 68,
    categories: [
      { name: "AC", value: 44 },
      { name: "Refrigerator", value: 36 },
      { name: "Washing Machine", value: 30 },
      { name: "LED", value: 52 },
      { name: "Fan", value: 24 },
    ],
    monthlyTrend: [
      { month: "Sep", value: 57 },
      { month: "Oct", value: 60 },
      { month: "Nov", value: 62 },
      { month: "Dec", value: 64 },
      { month: "Jan", value: 65 },
      { month: "Feb", value: 67 },
    ],
  },
  pb: {
    id: "pb",
    name: "Punjab",
    region: "North",
    complianceRate: 78,
    productsTested: 158,
    passRate: 75,
    targetsAchieved: 82,
    purchased: 92,
    categories: [
      { name: "AC", value: 58 },
      { name: "Refrigerator", value: 50 },
      { name: "Washing Machine", value: 44 },
      { name: "LED", value: 68 },
      { name: "Fan", value: 32 },
    ],
    monthlyTrend: [
      { month: "Sep", value: 70 },
      { month: "Oct", value: 72 },
      { month: "Nov", value: 74 },
      { month: "Dec", value: 76 },
      { month: "Jan", value: 77 },
      { month: "Feb", value: 78 },
    ],
  },
  hr: {
    id: "hr",
    name: "Haryana",
    region: "North",
    complianceRate: 80,
    productsTested: 168,
    passRate: 77,
    targetsAchieved: 84,
    purchased: 98,
    categories: [
      { name: "AC", value: 62 },
      { name: "Refrigerator", value: 52 },
      { name: "Washing Machine", value: 46 },
      { name: "LED", value: 72 },
      { name: "Fan", value: 34 },
    ],
    monthlyTrend: [
      { month: "Sep", value: 72 },
      { month: "Oct", value: 74 },
      { month: "Nov", value: 76 },
      { month: "Dec", value: 78 },
      { month: "Jan", value: 79 },
      { month: "Feb", value: 80 },
    ],
  },
  dl: {
    id: "dl",
    name: "Delhi",
    region: "North",
    complianceRate: 86,
    productsTested: 195,
    passRate: 83,
    targetsAchieved: 89,
    purchased: 118,
    categories: [
      { name: "AC", value: 72 },
      { name: "Refrigerator", value: 63 },
      { name: "Washing Machine", value: 56 },
      { name: "LED", value: 80 },
      { name: "Fan", value: 40 },
    ],
    monthlyTrend: [
      { month: "Sep", value: 78 },
      { month: "Oct", value: 80 },
      { month: "Nov", value: 82 },
      { month: "Dec", value: 84 },
      { month: "Jan", value: 85 },
      { month: "Feb", value: 86 },
    ],
  },
  kl: {
    id: "kl",
    name: "Kerala",
    region: "South",
    complianceRate: 93,
    productsTested: 198,
    passRate: 90,
    targetsAchieved: 96,
    purchased: 120,
    categories: [
      { name: "AC", value: 80 },
      { name: "Refrigerator", value: 74 },
      { name: "Washing Machine", value: 68 },
      { name: "LED", value: 90 },
      { name: "Fan", value: 45 },
    ],
    monthlyTrend: [
      { month: "Sep", value: 85 },
      { month: "Oct", value: 87 },
      { month: "Nov", value: 89 },
      { month: "Dec", value: 91 },
      { month: "Jan", value: 92 },
      { month: "Feb", value: 93 },
    ],
  },
  as: {
    id: "as",
    name: "Assam",
    region: "Northeast",
    complianceRate: 63,
    productsTested: 112,
    passRate: 60,
    targetsAchieved: 66,
    purchased: 58,
    categories: [
      { name: "AC", value: 41 },
      { name: "Refrigerator", value: 33 },
      { name: "Washing Machine", value: 27 },
      { name: "LED", value: 49 },
      { name: "Fan", value: 21 },
    ],
    monthlyTrend: [
      { month: "Sep", value: 53 },
      { month: "Oct", value: 56 },
      { month: "Nov", value: 58 },
      { month: "Dec", value: 60 },
      { month: "Jan", value: 62 },
      { month: "Feb", value: 63 },
    ],
  },
  hp: {
    id: "hp",
    name: "Himachal Pradesh",
    region: "North",
    complianceRate: 75,
    productsTested: 88,
    passRate: 72,
    targetsAchieved: 79,
    purchased: 48,
    categories: [
      { name: "AC", value: 50 },
      { name: "Refrigerator", value: 42 },
      { name: "Washing Machine", value: 35 },
      { name: "LED", value: 58 },
      { name: "Fan", value: 26 },
    ],
    monthlyTrend: [
      { month: "Sep", value: 67 },
      { month: "Oct", value: 69 },
      { month: "Nov", value: 71 },
      { month: "Dec", value: 73 },
      { month: "Jan", value: 74 },
      { month: "Feb", value: 75 },
    ],
  },
  uk: {
    id: "uk",
    name: "Uttarakhand",
    region: "North",
    complianceRate: 77,
    productsTested: 98,
    passRate: 74,
    targetsAchieved: 81,
    purchased: 54,
    categories: [
      { name: "AC", value: 55 },
      { name: "Refrigerator", value: 47 },
      { name: "Washing Machine", value: 40 },
      { name: "LED", value: 64 },
      { name: "Fan", value: 29 },
    ],
    monthlyTrend: [
      { month: "Sep", value: 69 },
      { month: "Oct", value: 71 },
      { month: "Nov", value: 73 },
      { month: "Dec", value: 75 },
      { month: "Jan", value: 76 },
      { month: "Feb", value: 77 },
    ],
  },
  jk: {
    id: "jk",
    name: "Jammu & Kashmir",
    region: "North",
    complianceRate: 70,
    productsTested: 75,
    passRate: 67,
    targetsAchieved: 74,
    purchased: 42,
    categories: [
      { name: "AC", value: 48 },
      { name: "Refrigerator", value: 40 },
      { name: "Washing Machine", value: 33 },
      { name: "LED", value: 56 },
      { name: "Fan", value: 24 },
    ],
    monthlyTrend: [
      { month: "Sep", value: 60 },
      { month: "Oct", value: 63 },
      { month: "Nov", value: 65 },
      { month: "Dec", value: 67 },
      { month: "Jan", value: 69 },
      { month: "Feb", value: 70 },
    ],
  },
  ga: {
    id: "ga",
    name: "Goa",
    region: "West",
    complianceRate: 89,
    productsTested: 55,
    passRate: 87,
    targetsAchieved: 92,
    purchased: 32,
    categories: [
      { name: "AC", value: 74 },
      { name: "Refrigerator", value: 66 },
      { name: "Washing Machine", value: 60 },
      { name: "LED", value: 82 },
      { name: "Fan", value: 39 },
    ],
    monthlyTrend: [
      { month: "Sep", value: 82 },
      { month: "Oct", value: 84 },
      { month: "Nov", value: 86 },
      { month: "Dec", value: 87 },
      { month: "Jan", value: 88 },
      { month: "Feb", value: 89 },
    ],
  },
  mn: {
    id: "mn",
    name: "Manipur",
    region: "Northeast",
    complianceRate: 60,
    productsTested: 68,
    passRate: 57,
    targetsAchieved: 63,
    purchased: 35,
    categories: [
      { name: "AC", value: 38 },
      { name: "Refrigerator", value: 30 },
      { name: "Washing Machine", value: 24 },
      { name: "LED", value: 46 },
      { name: "Fan", value: 18 },
    ],
    monthlyTrend: [
      { month: "Sep", value: 50 },
      { month: "Oct", value: 53 },
      { month: "Nov", value: 55 },
      { month: "Dec", value: 57 },
      { month: "Jan", value: 59 },
      { month: "Feb", value: 60 },
    ],
  },
  me: {
    id: "me",
    name: "Meghalaya",
    region: "Northeast",
    complianceRate: 62,
    productsTested: 72,
    passRate: 59,
    targetsAchieved: 65,
    purchased: 38,
    categories: [
      { name: "AC", value: 40 },
      { name: "Refrigerator", value: 32 },
      { name: "Washing Machine", value: 25 },
      { name: "LED", value: 48 },
      { name: "Fan", value: 19 },
    ],
    monthlyTrend: [
      { month: "Sep", value: 52 },
      { month: "Oct", value: 55 },
      { month: "Nov", value: 57 },
      { month: "Dec", value: 59 },
      { month: "Jan", value: 61 },
      { month: "Feb", value: 62 },
    ],
  },
  sk: {
    id: "sk",
    name: "Sikkim",
    region: "Northeast",
    complianceRate: 71,
    productsTested: 42,
    passRate: 68,
    targetsAchieved: 74,
    purchased: 22,
    categories: [
      { name: "AC", value: 46 },
      { name: "Refrigerator", value: 38 },
      { name: "Washing Machine", value: 30 },
      { name: "LED", value: 54 },
      { name: "Fan", value: 22 },
    ],
    monthlyTrend: [
      { month: "Sep", value: 62 },
      { month: "Oct", value: 65 },
      { month: "Nov", value: 67 },
      { month: "Dec", value: 69 },
      { month: "Jan", value: 70 },
      { month: "Feb", value: 71 },
    ],
  },
  ar: {
    id: "ar",
    name: "Arunachal Pradesh",
    region: "Northeast",
    complianceRate: 55,
    productsTested: 58,
    passRate: 52,
    targetsAchieved: 58,
    purchased: 28,
    categories: [
      { name: "AC", value: 35 },
      { name: "Refrigerator", value: 28 },
      { name: "Washing Machine", value: 22 },
      { name: "LED", value: 42 },
      { name: "Fan", value: 16 },
    ],
    monthlyTrend: [
      { month: "Sep", value: 45 },
      { month: "Oct", value: 48 },
      { month: "Nov", value: 50 },
      { month: "Dec", value: 52 },
      { month: "Jan", value: 54 },
      { month: "Feb", value: 55 },
    ],
  },
  nl: {
    id: "nl",
    name: "Nagaland",
    region: "Northeast",
    complianceRate: 57,
    productsTested: 52,
    passRate: 54,
    targetsAchieved: 60,
    purchased: 26,
    categories: [
      { name: "AC", value: 36 },
      { name: "Refrigerator", value: 28 },
      { name: "Washing Machine", value: 22 },
      { name: "LED", value: 44 },
      { name: "Fan", value: 16 },
    ],
    monthlyTrend: [
      { month: "Sep", value: 47 },
      { month: "Oct", value: 50 },
      { month: "Nov", value: 52 },
      { month: "Dec", value: 54 },
      { month: "Jan", value: 56 },
      { month: "Feb", value: 57 },
    ],
  },
  mz: {
    id: "mz",
    name: "Mizoram",
    region: "Northeast",
    complianceRate: 59,
    productsTested: 48,
    passRate: 56,
    targetsAchieved: 62,
    purchased: 24,
    categories: [
      { name: "AC", value: 37 },
      { name: "Refrigerator", value: 29 },
      { name: "Washing Machine", value: 23 },
      { name: "LED", value: 45 },
      { name: "Fan", value: 17 },
    ],
    monthlyTrend: [
      { month: "Sep", value: 49 },
      { month: "Oct", value: 52 },
      { month: "Nov", value: 54 },
      { month: "Dec", value: 56 },
      { month: "Jan", value: 58 },
      { month: "Feb", value: 59 },
    ],
  },
  tr: {
    id: "tr",
    name: "Tripura",
    region: "Northeast",
    complianceRate: 64,
    productsTested: 60,
    passRate: 61,
    targetsAchieved: 67,
    purchased: 30,
    categories: [
      { name: "AC", value: 42 },
      { name: "Refrigerator", value: 34 },
      { name: "Washing Machine", value: 27 },
      { name: "LED", value: 50 },
      { name: "Fan", value: 21 },
    ],
    monthlyTrend: [
      { month: "Sep", value: 54 },
      { month: "Oct", value: 57 },
      { month: "Nov", value: 59 },
      { month: "Dec", value: 61 },
      { month: "Jan", value: 63 },
      { month: "Feb", value: 64 },
    ],
  },
};

// ── Geographic State Shapes ───────────────────────────────────────────────────
// Each state defined as array of [longitude, latitude] vertices
// ViewBox: 0 0 800 900  (lon 68–98, lat 8–37)
// x = (lon - 68) * (800/30)  ≈ lon*26.67 - 1813.56
// y = (37 - lat) * (900/29)  ≈ 1148.28 - lat*31.03

const LON_MIN = 68;
const LAT_MAX = 37;
const SCALE_X = 800 / 30;
const SCALE_Y = 900 / 29;

function geoToSvg(lon: number, lat: number): [number, number] {
  return [(lon - LON_MIN) * SCALE_X, (LAT_MAX - lat) * SCALE_Y];
}

function coordsToPoints(coords: [number, number][]): string {
  return coords
    .map(([lon, lat]) => {
      const [x, y] = geoToSvg(lon, lat);
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");
}

const geoStateShapes: Record<
  string,
  { coords: [number, number][]; labelCoord: [number, number] }
> = {
  // ── Northern ──────────────────────────────────────────────────────────────
  jk: {
    coords: [
      [73.8, 37],
      [80.5, 37],
      [80.5, 35.2],
      [79.2, 34.0],
      [78.5, 33.2],
      [77.0, 32.6],
      [76.0, 32.6],
      [74.8, 33.2],
      [73.8, 34.5],
      [73.8, 36.0],
    ],
    labelCoord: [76.8, 35.2],
  },
  hp: {
    coords: [
      [75.5, 33.5],
      [79.0, 33.2],
      [78.5, 32.6],
      [77.5, 31.5],
      [77.0, 31.0],
      [76.2, 31.2],
      [75.5, 32.0],
    ],
    labelCoord: [77.2, 32.3],
  },
  pb: {
    coords: [
      [73.8, 32.5],
      [75.5, 33.0],
      [75.5, 32.0],
      [77.0, 31.0],
      [76.5, 29.8],
      [74.0, 29.8],
      [73.8, 31.0],
    ],
    labelCoord: [75.0, 31.4],
  },
  hr: {
    coords: [
      [77.0, 31.0],
      [77.5, 30.5],
      [77.5, 28.0],
      [76.0, 27.5],
      [74.0, 27.5],
      [74.0, 29.8],
      [76.5, 29.8],
      [77.0, 31.0],
    ],
    labelCoord: [75.8, 29.0],
  },
  dl: {
    coords: [
      [77.1, 28.9],
      [77.4, 28.9],
      [77.4, 28.4],
      [77.1, 28.4],
    ],
    labelCoord: [77.25, 28.65],
  },
  uk: {
    coords: [
      [77.5, 31.0],
      [79.0, 33.0],
      [81.0, 32.0],
      [81.0, 29.5],
      [79.5, 29.5],
      [78.5, 30.5],
    ],
    labelCoord: [79.5, 31.0],
  },
  rj: {
    coords: [
      [68.5, 29.5],
      [73.8, 29.5],
      [74.0, 29.8],
      [76.5, 29.8],
      [76.0, 27.5],
      [74.0, 27.5],
      [73.5, 25.0],
      [70.0, 23.5],
      [68.5, 24.0],
    ],
    labelCoord: [72.0, 26.8],
  },
  up: {
    coords: [
      [77.5, 30.5],
      [77.5, 28.0],
      [77.0, 27.5],
      [74.0, 27.5],
      [74.0, 27.0],
      [77.5, 24.0],
      [81.0, 23.8],
      [84.0, 24.0],
      [88.5, 27.2],
      [84.0, 30.0],
      [81.0, 30.0],
    ],
    labelCoord: [82.0, 27.0],
  },
  bi: {
    coords: [
      [83.5, 27.2],
      [88.5, 27.2],
      [88.2, 25.0],
      [84.0, 24.0],
      [83.5, 25.0],
    ],
    labelCoord: [86.0, 26.0],
  },
  jh: {
    coords: [
      [83.5, 25.0],
      [87.0, 25.0],
      [87.0, 21.5],
      [85.0, 21.0],
      [83.5, 22.5],
    ],
    labelCoord: [85.2, 23.2],
  },
  wb: {
    coords: [
      [85.5, 27.2],
      [88.5, 27.2],
      [89.2, 25.5],
      [88.5, 21.5],
      [87.0, 21.5],
      [87.0, 25.0],
      [85.5, 26.5],
    ],
    labelCoord: [87.5, 24.2],
  },
  or: {
    coords: [
      [81.0, 22.5],
      [85.5, 22.5],
      [87.0, 21.5],
      [85.5, 19.0],
      [84.0, 17.5],
      [82.0, 17.5],
      [81.0, 19.0],
    ],
    labelCoord: [83.5, 20.5],
  },
  // ── Northeast ─────────────────────────────────────────────────────────────
  sk: {
    coords: [
      [88.2, 28.0],
      [88.7, 28.0],
      [88.7, 27.3],
      [88.2, 27.3],
    ],
    labelCoord: [88.45, 27.65],
  },
  ar: {
    coords: [
      [91.5, 29.5],
      [97.5, 29.5],
      [97.0, 27.5],
      [96.5, 27.2],
      [92.0, 27.2],
      [91.5, 28.0],
    ],
    labelCoord: [94.2, 28.5],
  },
  as: {
    coords: [
      [89.5, 27.2],
      [92.0, 27.2],
      [96.5, 27.2],
      [96.0, 25.0],
      [92.5, 25.0],
      [91.0, 25.5],
      [89.5, 26.5],
    ],
    labelCoord: [92.8, 26.2],
  },
  me: {
    coords: [
      [89.5, 26.0],
      [92.5, 26.0],
      [92.5, 25.0],
      [91.0, 25.5],
      [89.5, 25.5],
    ],
    labelCoord: [91.0, 25.5],
  },
  nl: {
    coords: [
      [93.5, 27.2],
      [95.5, 27.2],
      [95.5, 25.5],
      [93.5, 25.5],
    ],
    labelCoord: [94.5, 26.3],
  },
  mn: {
    coords: [
      [93.0, 25.5],
      [95.5, 25.5],
      [95.5, 23.5],
      [93.0, 23.5],
    ],
    labelCoord: [94.2, 24.5],
  },
  mz: {
    coords: [
      [92.5, 24.0],
      [93.5, 24.0],
      [93.5, 21.5],
      [92.0, 21.5],
      [92.5, 22.5],
    ],
    labelCoord: [93.0, 22.8],
  },
  tr: {
    coords: [
      [91.5, 24.5],
      [92.5, 24.5],
      [92.5, 22.5],
      [91.5, 22.5],
    ],
    labelCoord: [92.0, 23.5],
  },
  // ── Central ───────────────────────────────────────────────────────────────
  mp: {
    coords: [
      [74.0, 26.5],
      [80.0, 26.5],
      [83.5, 26.0],
      [84.0, 24.0],
      [81.0, 23.8],
      [77.5, 24.0],
      [74.0, 21.0],
    ],
    labelCoord: [78.5, 24.5],
  },
  cg: {
    coords: [
      [80.0, 24.0],
      [84.0, 24.0],
      [83.0, 21.5],
      [82.0, 21.5],
      [82.0, 20.0],
      [80.5, 18.5],
      [80.0, 17.5],
    ],
    labelCoord: [81.8, 21.5],
  },
  // ── Western ───────────────────────────────────────────────────────────────
  gj: {
    coords: [
      [68.5, 24.5],
      [73.5, 24.5],
      [74.0, 22.0],
      [73.5, 20.0],
      [71.0, 20.0],
      [69.0, 20.5],
      [68.5, 22.0],
    ],
    labelCoord: [71.5, 22.5],
  },
  mh: {
    coords: [
      [74.0, 22.0],
      [77.5, 24.0],
      [80.0, 22.0],
      [82.0, 20.0],
      [82.0, 17.5],
      [80.0, 16.0],
      [79.0, 14.5],
      [77.0, 15.0],
      [74.5, 15.5],
      [73.5, 17.5],
      [73.5, 20.0],
    ],
    labelCoord: [77.5, 18.8],
  },
  ga: {
    coords: [
      [73.5, 15.5],
      [74.5, 15.5],
      [74.5, 14.9],
      [73.7, 14.9],
    ],
    labelCoord: [74.0, 15.2],
  },
  // ── Southern ──────────────────────────────────────────────────────────────
  tg: {
    coords: [
      [77.0, 20.0],
      [80.0, 22.0],
      [82.0, 20.0],
      [82.0, 17.5],
      [80.0, 16.5],
      [78.5, 17.0],
      [77.0, 18.5],
    ],
    labelCoord: [79.5, 18.7],
  },
  ap: {
    coords: [
      [78.5, 17.0],
      [80.0, 16.5],
      [82.0, 17.5],
      [84.5, 17.5],
      [84.0, 15.0],
      [80.5, 13.0],
      [79.0, 14.0],
      [77.5, 15.0],
      [77.0, 15.0],
    ],
    labelCoord: [81.0, 16.0],
  },
  ka: {
    coords: [
      [74.5, 18.5],
      [77.0, 18.5],
      [77.0, 15.0],
      [79.0, 14.0],
      [78.5, 12.0],
      [76.5, 11.5],
      [74.5, 11.5],
      [74.0, 13.5],
      [74.0, 16.0],
    ],
    labelCoord: [76.3, 15.2],
  },
  kl: {
    coords: [
      [75.0, 12.0],
      [77.0, 12.0],
      [77.5, 10.0],
      [77.0, 8.5],
      [76.0, 8.0],
      [74.5, 9.5],
      [75.0, 11.5],
    ],
    labelCoord: [76.0, 10.5],
  },
  tn: {
    coords: [
      [79.0, 13.0],
      [80.5, 13.0],
      [80.5, 8.5],
      [77.0, 8.5],
      [76.5, 10.0],
      [77.5, 11.5],
      [77.5, 12.0],
    ],
    labelCoord: [78.8, 11.0],
  },
};

// ── Metric Config ─────────────────────────────────────────────────────────────
const metricConfig: Record<
  MetricKey,
  { label: string; unit: string; min: number; max: number }
> = {
  complianceRate: { label: "Compliance Rate", unit: "%", min: 55, max: 95 },
  productsTested: { label: "Products Tested", unit: "", min: 40, max: 320 },
  passRate: { label: "Pass Rate", unit: "%", min: 50, max: 92 },
  targetsAchieved: { label: "Targets Achieved", unit: "%", min: 58, max: 98 },
  purchased: { label: "Purchases", unit: "", min: 10, max: 200 },
};

// ── 5-Color Scale ─────────────────────────────────────────────────────────────
const COLOR_SCALE = [
  { threshold: 0.0, color: "#dc2626" }, // Red – Low
  { threshold: 0.25, color: "#ea580c" }, // Orange – Medium-Low
  { threshold: 0.5, color: "#ca8a04" }, // Amber – Medium
  { threshold: 0.75, color: "#65a30d" }, // Light Green – Medium-High
  { threshold: 1.0, color: "#16a34a" }, // Green – High
];

function interpolateColor(c1: string, c2: string, t: number): string {
  const hex = (h: string) => [
    Number.parseInt(h.slice(1, 3), 16),
    Number.parseInt(h.slice(3, 5), 16),
    Number.parseInt(h.slice(5, 7), 16),
  ];
  const [r1, g1, b1] = hex(c1);
  const [r2, g2, b2] = hex(c2);
  return `rgb(${Math.round(r1 + (r2 - r1) * t)},${Math.round(
    g1 + (g2 - g1) * t,
  )},${Math.round(b1 + (b2 - b1) * t)})`;
}

function getStateColor(
  value: number,
  min: number,
  max: number,
  highlighted: boolean,
): string {
  if (highlighted) return "#f59e0b";
  const t = Math.max(0, Math.min(1, (value - min) / (max - min)));
  for (let i = 0; i < COLOR_SCALE.length - 1; i++) {
    const lo = COLOR_SCALE[i];
    const hi = COLOR_SCALE[i + 1];
    if (t >= lo.threshold && t <= hi.threshold) {
      const seg = (t - lo.threshold) / (hi.threshold - lo.threshold);
      return interpolateColor(lo.color, hi.color, seg);
    }
  }
  return COLOR_SCALE[COLOR_SCALE.length - 1].color;
}

// ── KPI Card ──────────────────────────────────────────────────────────────────
function KpiCard({
  label,
  value,
  accent,
  idx,
}: { label: string; value: string | number; accent: string; idx: number }) {
  return (
    <Card
      data-ocid={`map_dashboard.kpi.card.${idx}`}
      className="border-0 overflow-hidden relative"
      style={{ boxShadow: "0 2px 12px rgba(26,58,107,0.10)" }}
    >
      <div
        className="absolute left-0 top-0 bottom-0 w-1 rounded-l-xl"
        style={{ backgroundColor: accent }}
      />
      <CardContent className="pt-4 pb-4 pl-5">
        <p
          className="text-2xl font-bold leading-none mb-1"
          style={{ color: accent }}
        >
          {value}
        </p>
        <p className="text-xs font-semibold text-gray-500">{label}</p>
      </CardContent>
    </Card>
  );
}

// ── Top 10 States Bar Chart ────────────────────────────────────────────────────
function TopStatesBarChart({
  states,
  metric,
}: { states: StateData[]; metric: MetricKey }) {
  const top10 = [...states]
    .sort((a, b) => b[metric] - a[metric])
    .slice(0, 10)
    .map((s) => ({
      name: s.name.length > 12 ? `${s.name.slice(0, 10)}…` : s.name,
      value: s[metric],
    }));
  return (
    <div data-ocid="map_dashboard.bar_chart">
      <ResponsiveContainer width="100%" height={220}>
        <BarChart
          data={top10}
          layout="vertical"
          barSize={14}
          margin={{ left: 8, right: 16, top: 4, bottom: 4 }}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            horizontal={false}
            stroke="#f1f5f9"
          />
          <XAxis
            type="number"
            tick={{ fontSize: 10, fill: "#9ca3af" }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            type="category"
            dataKey="name"
            tick={{ fontSize: 10, fill: "#64748b" }}
            axisLine={false}
            tickLine={false}
            width={88}
          />
          <RechartTooltip
            contentStyle={{
              fontSize: 12,
              borderRadius: 8,
              border: "none",
              boxShadow: "0 4px 16px rgba(0,0,0,0.12)",
            }}
            cursor={{ fill: "#eff6ff" }}
          />
          <Bar
            dataKey="value"
            name={metricConfig[metric].label}
            radius={[0, 4, 4, 0]}
          >
            {top10.map((entry, i) => (
              <Cell
                key={entry.name}
                fill={`hsl(${215 - i * 8}, ${72 - i * 2}%, ${38 + i * 2}%)`}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

// ── National Monthly Trend Line Chart ─────────────────────────────────────────
function NationalTrendChart({
  states,
  metric,
}: { states: StateData[]; metric: MetricKey }) {
  const months = ["Sep", "Oct", "Nov", "Dec", "Jan", "Feb"];
  const trendData = months.map((month, i) => ({
    month,
    value: Math.round(
      states.reduce((sum, s) => sum + s.monthlyTrend[i].value, 0) /
        states.length,
    ),
  }));
  return (
    <div data-ocid="map_dashboard.line_chart">
      <ResponsiveContainer width="100%" height={160}>
        <LineChart
          data={trendData}
          margin={{ left: 4, right: 16, top: 4, bottom: 4 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
          <XAxis
            dataKey="month"
            tick={{ fontSize: 10, fill: "#9ca3af" }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fontSize: 10, fill: "#9ca3af" }}
            axisLine={false}
            tickLine={false}
            width={30}
          />
          <RechartTooltip
            contentStyle={{
              fontSize: 12,
              borderRadius: 8,
              border: "none",
              boxShadow: "0 4px 16px rgba(0,0,0,0.12)",
            }}
          />
          <Line
            type="monotone"
            dataKey="value"
            name={`Avg ${metricConfig[metric].label}`}
            stroke="#1a3a6b"
            strokeWidth={2.5}
            dot={{ fill: "#1a3a6b", r: 3 }}
            activeDot={{ r: 5 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

// ── State Detail Modal ────────────────────────────────────────────────────────
function StateModal({
  state,
  onClose,
}: { state: StateData; onClose: () => void }) {
  const regionColors: Record<string, string> = {
    North: "#1a3a6b",
    South: "#059669",
    West: "#d97706",
    East: "#7c3aed",
    Central: "#0284c7",
    Northeast: "#dc2626",
  };
  const accent = regionColors[state.region] ?? "#1a3a6b";
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: "rgba(0,0,0,0.45)" }}
      onClick={onClose}
      onKeyDown={(e) => e.key === "Escape" && onClose()}
      role="presentation"
    >
      <dialog
        data-ocid="map_dashboard.state_dialog"
        open
        className="bg-white rounded-2xl shadow-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto border-0 p-0"
        style={{ border: `2px solid ${accent}20` }}
        onClick={(e) => e.stopPropagation()}
        onKeyDown={(e) => e.stopPropagation()}
        aria-label={`${state.name} details`}
      >
        <div
          className="flex items-center justify-between px-6 py-4"
          style={{ borderBottom: "1px solid #e2e8f0" }}
        >
          <div>
            <h2 className="text-lg font-bold" style={{ color: "#1a3a6b" }}>
              {state.name}
            </h2>
            <Badge
              className="mt-1 text-xs"
              style={{
                backgroundColor: `${accent}15`,
                color: accent,
                border: `1px solid ${accent}40`,
              }}
            >
              {state.region} India
            </Badge>
          </div>
          <Button
            data-ocid="map_dashboard.state_dialog.close_button"
            variant="ghost"
            size="icon"
            className="rounded-xl hover:bg-gray-100"
            onClick={onClose}
          >
            <X size={18} />
          </Button>
        </div>
        <div className="grid grid-cols-2 gap-3 px-6 pt-5 pb-3">
          {[
            {
              label: "Products Tested",
              value: state.productsTested,
              accent: "#1a3a6b",
            },
            {
              label: "Pass Rate",
              value: `${state.passRate}%`,
              accent: "#059669",
            },
            {
              label: "Compliance Rate",
              value: `${state.complianceRate}%`,
              accent: "#0284c7",
            },
            {
              label: "Targets Achieved",
              value: `${state.targetsAchieved}%`,
              accent: "#d97706",
            },
          ].map((kpi) => (
            <div
              key={kpi.label}
              className="rounded-xl p-3 overflow-hidden relative"
              style={{
                backgroundColor: `${kpi.accent}08`,
                border: `1px solid ${kpi.accent}25`,
              }}
            >
              <div
                className="absolute left-0 top-0 bottom-0 w-1 rounded-l-xl"
                style={{ backgroundColor: kpi.accent }}
              />
              <p
                className="text-xl font-bold pl-1"
                style={{ color: kpi.accent }}
              >
                {kpi.value}
              </p>
              <p className="text-xs text-gray-500 pl-1">{kpi.label}</p>
            </div>
          ))}
        </div>
        <div className="px-6 pb-3">
          <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">
            Category-wise Breakdown
          </p>
          <ResponsiveContainer width="100%" height={140}>
            <BarChart
              data={state.categories}
              barSize={20}
              margin={{ left: 0, right: 8, top: 4, bottom: 4 }}
            >
              <XAxis
                dataKey="name"
                tick={{ fontSize: 10, fill: "#9ca3af" }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 10, fill: "#9ca3af" }}
                axisLine={false}
                tickLine={false}
                width={28}
              />
              <RechartTooltip
                contentStyle={{
                  fontSize: 12,
                  borderRadius: 8,
                  border: "none",
                  boxShadow: "0 4px 16px rgba(0,0,0,0.12)",
                }}
              />
              <Bar
                dataKey="value"
                name="Units Tested"
                fill={accent}
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="px-6 pb-5">
          <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">
            6-Month Trend
          </p>
          <ResponsiveContainer width="100%" height={120}>
            <LineChart
              data={state.monthlyTrend}
              margin={{ left: 0, right: 8, top: 4, bottom: 4 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis
                dataKey="month"
                tick={{ fontSize: 10, fill: "#9ca3af" }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 10, fill: "#9ca3af" }}
                axisLine={false}
                tickLine={false}
                width={30}
              />
              <RechartTooltip
                contentStyle={{
                  fontSize: 12,
                  borderRadius: 8,
                  border: "none",
                  boxShadow: "0 4px 16px rgba(0,0,0,0.12)",
                }}
              />
              <Line
                type="monotone"
                dataKey="value"
                name="Compliance %"
                stroke={accent}
                strokeWidth={2.5}
                dot={{ fill: accent, r: 3 }}
                activeDot={{ r: 5 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </dialog>
    </div>
  );
}

// ── Color Legend ──────────────────────────────────────────────────────────────
function ColorLegend({ unit }: { unit: string }) {
  const stops = [
    { color: "#dc2626", label: "Low" },
    { color: "#ea580c", label: "Med-Low" },
    { color: "#ca8a04", label: "Medium" },
    { color: "#65a30d", label: "Med-High" },
    { color: "#16a34a", label: "High" },
  ];
  return (
    <div className="flex items-center gap-3 mt-3">
      <span className="text-xs text-gray-400 whitespace-nowrap">
        Scale{unit ? ` (${unit})` : ""}:
      </span>
      <div className="flex flex-1 items-center gap-1">
        {stops.map((s) => (
          <div key={s.label} className="flex items-center gap-1">
            <div
              className="w-4 h-3 rounded-sm"
              style={{ backgroundColor: s.color }}
            />
            <span className="text-xs text-gray-500">{s.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── India SVG Map (Geographic Projection) ─────────────────────────────────────
function IndiaSvgMap({
  metric,
  selectedState,
  onStateClick,
  onStateHover,
}: {
  metric: MetricKey;
  selectedState: string | null;
  onStateClick: (id: string) => void;
  onStateHover: (id: string | null, x: number, y: number) => void;
}) {
  const cfg = metricConfig[metric];

  return (
    <svg
      viewBox="0 0 800 900"
      className="w-full h-full"
      style={{ maxHeight: "600px" }}
      role="img"
      aria-label="India state-wise compliance map"
    >
      <title>India State-wise Compliance Map</title>
      <defs>
        <filter id="state-shadow" x="-10%" y="-10%" width="120%" height="120%">
          <feDropShadow
            dx="0"
            dy="2"
            stdDeviation="2"
            floodColor="#000"
            floodOpacity="0.18"
          />
        </filter>
        {/* Ocean gradient */}
        <linearGradient id="oceanGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#bfdbfe" />
          <stop offset="100%" stopColor="#93c5fd" />
        </linearGradient>
      </defs>

      {/* Ocean background */}
      <rect
        x="0"
        y="0"
        width="800"
        height="900"
        fill="url(#oceanGrad)"
        rx="10"
      />

      {/* Land outline shadow */}
      <rect x="2" y="2" width="796" height="896" fill="none" rx="10" />

      {/* Render all state polygons */}
      {Object.entries(geoStateShapes).map(([id, shape]) => {
        const sd = stateData[id];
        if (!sd) return null;
        const isHighlighted = selectedState === id;
        const fill = getStateColor(sd[metric], cfg.min, cfg.max, isHighlighted);
        const points = coordsToPoints(shape.coords);

        return (
          <polygon
            key={id}
            data-ocid="map_dashboard.map_marker"
            points={points}
            fill={fill}
            stroke="#ffffff"
            strokeWidth={isHighlighted ? 2.5 : 1.2}
            strokeLinejoin="round"
            style={{
              cursor: "pointer",
              filter: isHighlighted ? "url(#state-shadow)" : undefined,
              transition: "fill 0.2s",
              opacity: isHighlighted ? 1 : 0.92,
            }}
            onMouseEnter={(e) => onStateHover(id, e.clientX, e.clientY)}
            onMouseLeave={() => onStateHover(null, 0, 0)}
            onClick={() => onStateClick(id)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") onStateClick(id);
            }}
            tabIndex={0}
            aria-label={`${sd.name}: ${sd[metric]}${cfg.unit}`}
          />
        );
      })}

      {/* State abbreviation labels */}
      {Object.entries(geoStateShapes).map(([id, shape]) => {
        const sd = stateData[id];
        if (!sd) return null;
        const [lx, ly] = geoToSvg(shape.labelCoord[0], shape.labelCoord[1]);
        // Skip tiny states label if too small
        const tinyStates = ["dl", "ga", "sk"];
        const fontSize = tinyStates.includes(id) ? 6 : 9;
        return (
          <text
            key={`lbl-${id}`}
            x={lx}
            y={ly}
            fontSize={fontSize}
            fill="rgba(255,255,255,0.95)"
            textAnchor="middle"
            dominantBaseline="middle"
            style={{
              pointerEvents: "none",
              fontWeight: 700,
              letterSpacing: 0.5,
            }}
          >
            {id.toUpperCase()}
          </text>
        );
      })}

      {/* Map title */}
      <text
        x="680"
        y="30"
        fontSize="20"
        fill="#1e3a5f"
        textAnchor="middle"
        fontWeight="800"
        style={{ pointerEvents: "none" }}
      >
        INDIA
      </text>
      <text
        x="680"
        y="48"
        fontSize="8"
        fill="#475569"
        textAnchor="middle"
        style={{ pointerEvents: "none" }}
      >
        States &amp; Union Territories
      </text>

      {/* North arrow */}
      <text
        x="750"
        y="70"
        fontSize="11"
        fill="#1e3a5f"
        textAnchor="middle"
        fontWeight="700"
        style={{ pointerEvents: "none" }}
      >
        N
      </text>
      <line
        x1="750"
        y1="73"
        x2="750"
        y2="88"
        stroke="#1e3a5f"
        strokeWidth="1.5"
      />
      <polygon
        points="750,68 747,75 753,75"
        fill="#1e3a5f"
        style={{ pointerEvents: "none" }}
      />
    </svg>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────
export default function IndiaMapDashboard() {
  const [metric, setMetric] = useState<MetricKey>("complianceRate");
  const [dateRange, setDateRange] = useState("fy2024");
  const [hoveredState, setHoveredState] = useState<string | null>(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });
  const [selectedState, setSelectedState] = useState<string | null>(null);
  const mapRef = useRef<HTMLDivElement>(null);

  const allStates = Object.values(stateData);
  const cfg = metricConfig[metric];

  const handleStateHover = useCallback(
    (id: string | null, x: number, y: number) => {
      setHoveredState(id);
      if (id) setTooltipPos({ x, y });
    },
    [],
  );

  const handleStateClick = useCallback((id: string) => {
    setSelectedState(id);
  }, []);

  const avgCompliance = Math.round(
    allStates.reduce((s, d) => s + d.complianceRate, 0) / allStates.length,
  );
  const totalTested = allStates.reduce((s, d) => s + d.productsTested, 0);
  const topState = [...allStates].sort(
    (a, b) => b.complianceRate - a.complianceRate,
  )[0];
  const statesCovered = allStates.length;

  const rankedStates = [...allStates].sort((a, b) => b[metric] - a[metric]);
  const hoveredStateData = hoveredState ? stateData[hoveredState] : null;
  const hoveredRank = hoveredStateData
    ? rankedStates.findIndex((s) => s.id === hoveredState) + 1
    : 0;

  return (
    <div className="space-y-5 pb-8">
      {/* Page header + Filters */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold" style={{ color: "#1a3a6b" }}>
            India Compliance Map
          </h1>
          <p className="text-xs text-gray-400 mt-0.5">
            State-wise S&L Check Testing Performance Dashboard
          </p>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger
              data-ocid="map_dashboard.date_select"
              className="w-44 h-9 text-xs border-blue-100"
              style={{ backgroundColor: "white" }}
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="last30">Last 30 Days</SelectItem>
              <SelectItem value="last3m">Last 3 Months</SelectItem>
              <SelectItem value="last6m">Last 6 Months</SelectItem>
              <SelectItem value="fy2024">FY 2024-25</SelectItem>
            </SelectContent>
          </Select>
          <Select
            value={metric}
            onValueChange={(v) => setMetric(v as MetricKey)}
          >
            <SelectTrigger
              data-ocid="map_dashboard.metric_select"
              className="w-48 h-9 text-xs border-blue-100"
              style={{ backgroundColor: "white" }}
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="complianceRate">Compliance Rate</SelectItem>
              <SelectItem value="productsTested">Products Tested</SelectItem>
              <SelectItem value="passRate">Pass Rate</SelectItem>
              <SelectItem value="targetsAchieved">Targets Achieved</SelectItem>
              <SelectItem value="purchased">Purchase</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* KPI Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <KpiCard
          label="States Covered"
          value={statesCovered}
          accent="#1a3a6b"
          idx={1}
        />
        <KpiCard
          label="Avg Compliance Rate"
          value={`${avgCompliance}%`}
          accent="#059669"
          idx={2}
        />
        <KpiCard
          label="Top Performing State"
          value={topState.name}
          accent="#d97706"
          idx={3}
        />
        <KpiCard
          label="Products Tested (National)"
          value={totalTested.toLocaleString()}
          accent="#7c3aed"
          idx={4}
        />
      </div>

      {/* Map + Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
        {/* Map (60%) */}
        <Card
          className="border-0 lg:col-span-3 relative"
          style={{
            boxShadow: "0 2px 16px rgba(26,58,107,0.10)",
            borderTop: "3px solid #1a3a6b",
          }}
        >
          <CardHeader className="pb-1 pt-4">
            <CardTitle
              className="text-sm font-bold"
              style={{ color: "#1a3a6b" }}
            >
              State-wise {cfg.label}
            </CardTitle>
            <p className="text-xs text-gray-400">
              Hover to preview · Click to explore details
            </p>
          </CardHeader>
          <CardContent className="pt-2 pb-4">
            <div ref={mapRef} className="relative w-full">
              <IndiaSvgMap
                metric={metric}
                selectedState={selectedState}
                onStateClick={handleStateClick}
                onStateHover={handleStateHover}
              />
              <ColorLegend unit={cfg.unit} />
            </div>
          </CardContent>
        </Card>

        {/* Charts (40%) */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          <Card
            className="border-0 flex-1"
            style={{
              boxShadow: "0 2px 12px rgba(26,58,107,0.08)",
              borderTop: "3px solid #0284c7",
            }}
          >
            <CardHeader className="pb-1 pt-4">
              <CardTitle
                className="text-sm font-bold"
                style={{ color: "#1a3a6b" }}
              >
                Top 10 States
              </CardTitle>
              <p className="text-xs text-gray-400">{cfg.label} ranking</p>
            </CardHeader>
            <CardContent className="pt-0 pb-3">
              <TopStatesBarChart states={allStates} metric={metric} />
            </CardContent>
          </Card>

          <Card
            className="border-0"
            style={{
              boxShadow: "0 2px 12px rgba(26,58,107,0.08)",
              borderTop: "3px solid #059669",
            }}
          >
            <CardHeader className="pb-1 pt-4">
              <CardTitle
                className="text-sm font-bold"
                style={{ color: "#1a3a6b" }}
              >
                National Monthly Trend
              </CardTitle>
              <p className="text-xs text-gray-400">
                Avg {cfg.label} · Sep 2024 – Feb 2025
              </p>
            </CardHeader>
            <CardContent className="pt-0 pb-3">
              <NationalTrendChart states={allStates} metric={metric} />
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Hover Tooltip */}
      {hoveredState && hoveredStateData && (
        <div
          className="fixed z-40 pointer-events-none rounded-xl shadow-xl text-xs"
          style={{
            left: tooltipPos.x + 14,
            top: tooltipPos.y - 60,
            backgroundColor: "white",
            border: "1.5px solid #bfdbfe",
            padding: "10px 14px",
            minWidth: 160,
          }}
        >
          <p className="font-bold text-gray-800 mb-1">
            {hoveredStateData.name}
          </p>
          <p className="text-blue-600 font-semibold">
            {hoveredStateData[metric]}
            {cfg.unit} {cfg.label}
          </p>
          <p className="text-gray-400 mt-0.5">
            Rank #{hoveredRank} of {allStates.length}
          </p>
          <p className="text-gray-400">{hoveredStateData.region} India</p>
        </div>
      )}

      {/* State Detail Modal */}
      {selectedState && stateData[selectedState] && (
        <StateModal
          state={stateData[selectedState]}
          onClose={() => setSelectedState(null)}
        />
      )}
    </div>
  );
}

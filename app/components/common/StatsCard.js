import Skeleton from "./Skeleton";

const colorMap = {
  blue: {
    bg: "bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200",
    text: "text-blue-600",
    value: "text-blue-900",
    iconBg: "bg-blue-200",
    note: "text-blue-600",
  },
  green: {
    bg: "bg-gradient-to-br from-green-50 to-green-100 border-green-200",
    text: "text-green-600",
    value: "text-green-900",
    iconBg: "bg-green-200",
    note: "text-green-600",
  },
  purple: {
    bg: "bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200",
    text: "text-purple-600",
    value: "text-purple-900",
    iconBg: "bg-purple-200",
    note: "text-purple-600",
  },
  orange: {
    bg: "bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200",
    text: "text-orange-600",
    value: "text-orange-900",
    iconBg: "bg-orange-200",
    note: "text-orange-600",
  },
  gray: {
    bg: "bg-gradient-to-br from-gray-50 to-gray-100 border-gray-200",
    text: "text-gray-600",
    value: "text-gray-900",
    iconBg: "bg-gray-200",
    note: "text-gray-600",
  },
};

export default function StatsCard({ title, value, color = "gray", icon, note }) {
  const colors = colorMap[color] || colorMap["gray"];
  const isLoading = value === undefined || value === null || value === "...";
  return (
    <div className={`rounded-xl p-6 ${colors.bg}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className={`text-sm font-medium ${colors.text}`}>{title}</p>
          {isLoading ? (
            <Skeleton className="h-8 w-20 mt-1 mb-1" />
          ) : (
            <p className={`text-3xl font-bold mt-1 ${colors.value}`}>{value}</p>
          )}
          {note && !isLoading && <p className={`text-xs mt-2 ${colors.note}`}>{note}</p>}
        </div>
        <div className={`rounded-full p-3 ${colors.iconBg}`}>{icon}</div>
      </div>
    </div>
  );
}

import React from "react";

export default function StatsCard({ title, value, color, icon, note }) {
  return (
    <div
      className={`bg-gradient-to-br from-${color}-50 to-${color}-100 rounded-xl p-6 border border-${color}-200`}>
      <div className="flex items-center justify-between">
        <div>
          <p className={`text-sm font-medium text-${color}-600`}>{title}</p>
          <p className={`text-3xl font-bold text-${color}-900 mt-1`}>{value}</p>
          {note && <p className={`text-xs text-${color}-600 mt-2`}>{note}</p>}
        </div>
        <div className={`bg-${color}-200 rounded-full p-3`}>{icon}</div>
      </div>
    </div>
  );
}

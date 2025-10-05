import type { StatCardProps } from "../types/propsType";
import { colorClasses } from "../ui/color";

export const StatCard = ({ title, value, subtitle, icon, color = 'green' }: StatCardProps) => {

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-gray-600">{title}</h3>
        <div className={`p-2 rounded-lg ${colorClasses[color]}`}>
          {icon}
        </div>
      </div>
      <div className="mb-2">
        <span className="text-3xl font-bold text-gray-900">{value}</span>
      </div>
      <p className="text-sm text-gray-500">{subtitle}</p>
    </div>
  );
};
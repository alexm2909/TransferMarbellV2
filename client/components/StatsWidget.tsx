import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUpIcon, TrendingDownIcon } from "lucide-react";

interface StatsWidgetProps {
  title: string;
  value: string | number;
  change?: {
    value: string;
    type: "increase" | "decrease";
    period: string;
  };
  icon: React.ComponentType<{ className?: string }>;
  color: "ocean" | "coral" | "success" | "warning" | "purple";
  subtitle?: string;
}

export default function StatsWidget({
  title,
  value,
  change,
  icon: Icon,
  color,
  subtitle,
}: StatsWidgetProps) {
  const getColorClasses = (color: string) => {
    switch (color) {
      case "ocean":
        return {
          bg: "bg-ocean/10",
          icon: "text-ocean",
          accent: "border-ocean/20",
        };
      case "coral":
        return {
          bg: "bg-coral/10",
          icon: "text-coral",
          accent: "border-coral/20",
        };
      case "success":
        return {
          bg: "bg-green-100",
          icon: "text-green-600",
          accent: "border-green-200",
        };
      case "warning":
        return {
          bg: "bg-yellow-100",
          icon: "text-yellow-600",
          accent: "border-yellow-200",
        };
      case "purple":
        return {
          bg: "bg-purple-100",
          icon: "text-purple-600",
          accent: "border-purple-200",
        };
      default:
        return {
          bg: "bg-gray-100",
          icon: "text-gray-600",
          accent: "border-gray-200",
        };
    }
  };

  const colorClasses = getColorClasses(color);

  return (
    <Card className={`hover:shadow-lg transition-all duration-300 border ${colorClasses.accent} hover:scale-105`}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className={`p-3 rounded-lg ${colorClasses.bg}`}>
            <Icon className={`w-6 h-6 ${colorClasses.icon}`} />
          </div>
          {change && (
            <Badge
              variant="outline"
              className={`text-xs ${
                change.type === "increase"
                  ? "text-green-600 border-green-200 bg-green-50"
                  : "text-red-600 border-red-200 bg-red-50"
              }`}
            >
              {change.type === "increase" ? (
                <TrendingUpIcon className="w-3 h-3 mr-1" />
              ) : (
                <TrendingDownIcon className="w-3 h-3 mr-1" />
              )}
              {change.value}
            </Badge>
          )}
        </div>

        <div className="space-y-1">
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          {subtitle && (
            <p className="text-xs text-gray-500">{subtitle}</p>
          )}
          {change && (
            <p className="text-xs text-gray-500 mt-2">
              vs {change.period}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

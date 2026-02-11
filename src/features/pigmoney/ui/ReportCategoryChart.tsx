"use client";

import { CategoryBreakdown, CashRecordType } from "@/entities/pigmoney/types";
import { Card, CardContent } from "@/shared/components/atoms/card";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

interface ReportCategoryChartProps {
  breakdown: CategoryBreakdown[];
  type: CashRecordType;
  title: string;
}

// 카테고리별 지출/수입 도넛 차트
const CHART_COLORS = [
  "#6366f1", "#f43f5e", "#f59e0b", "#10b981", "#3b82f6",
  "#8b5cf6", "#ec4899", "#14b8a6", "#f97316", "#06b6d4",
];

const ReportCategoryChart = ({ breakdown, type, title }: ReportCategoryChartProps) => {
  const filtered = breakdown.filter((b) => b.type === type);
  const total = filtered.reduce((sum, b) => sum + b.total, 0);

  const chartData = filtered.map((b) => ({
    name: b.categoryName,
    value: b.total,
    percent: total > 0 ? ((b.total / total) * 100).toFixed(1) : "0",
  }));

  return (
    <Card>
      <CardContent className="p-4">
        <p className="mb-3 text-sm font-semibold">{title}</p>
        {chartData.length === 0 ? (
          <div className="flex h-[200px] items-center justify-center">
            <span className="text-sm text-minimoku-neutral-bold">데이터가 없습니다</span>
          </div>
        ) : (
          <div className="flex items-center gap-4">
            <ResponsiveContainer width="50%" height={200}>
              <PieChart>
                <Pie
                  data={chartData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={2}
                >
                  {chartData.map((_, index) => (
                    <Cell key={index} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value) => `${Number(value).toLocaleString()} 원`}
                />
              </PieChart>
            </ResponsiveContainer>

            {/* 범례 */}
            <div className="flex flex-1 flex-col gap-1.5">
              {chartData.map((item, index) => (
                <div key={item.name} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5">
                    <div
                      className="h-2.5 w-2.5 rounded-full"
                      style={{ backgroundColor: CHART_COLORS[index % CHART_COLORS.length] }}
                    />
                    <span>{item.name}</span>
                  </div>
                  <span className="text-minimoku-neutral-bold">{item.percent}%</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ReportCategoryChart;

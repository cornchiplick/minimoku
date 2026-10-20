import ReportDailyTrend from "@/features/pigmoney/ui/ReportDailyTrend";
import {sampleRecords} from "@/features/pigmoney/ui/pigmoneyStoryData";
import type {Meta, StoryObj} from "@storybook/nextjs-vite";

const monthStart = () => {
  const date = new Date();
  date.setDate(1);
  date.setHours(12, 0, 0, 0);
  return date;
};

const monthEnd = () => {
  const date = new Date();
  date.setMonth(date.getMonth() + 1, 0);
  date.setHours(12, 0, 0, 0);
  return date;
};

const meta = {
  title: "PigMoney/일별 지출 추이",
  component: ReportDailyTrend,
  parameters: {layout: "padded"},
  // 차트는 부모 높이를 채우므로 스토리에서 높이를 준다
  decorators: [
    (Story) => (
      <div className="h-56 w-full">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof ReportDailyTrend>;

export default meta;
type Story = StoryObj<typeof meta>;

/** 거래가 없는 날도 빈칸으로 남겨 한 달의 리듬이 보이게 한다. 오늘만 진하게 칠한다 */
export const 기본: Story = {
  args: {records: sampleRecords, from: monthStart(), to: monthEnd()},
};

export const 비어있음: Story = {
  args: {records: [], from: monthStart(), to: monthEnd()},
};

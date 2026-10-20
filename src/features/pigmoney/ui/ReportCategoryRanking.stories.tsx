import {CashRecordType} from "@/entities/pigmoney/types";
import ReportCategoryRanking from "@/features/pigmoney/ui/ReportCategoryRanking";
import {sampleBreakdown} from "@/features/pigmoney/ui/pigmoneyStoryData";
import type {Meta, StoryObj} from "@storybook/nextjs-vite";

const meta = {
  title: "PigMoney/카테고리 순위",
  component: ReportCategoryRanking,
  parameters: {layout: "padded"},
} satisfies Meta<typeof ReportCategoryRanking>;

export default meta;
type Story = StoryObj<typeof meta>;

/** 지출을 금액 순으로 세우고, 가장 큰 항목을 100% 로 둔 막대를 붙인다 */
export const 지출: Story = {
  args: {
    breakdown: sampleBreakdown,
    type: CashRecordType.EXPENSE,
    heading: "어디에 썼나",
    emptyText: "이 기간에 지출이 없습니다.",
  },
};

export const 수입: Story = {
  args: {
    breakdown: sampleBreakdown,
    type: CashRecordType.INCOME,
    heading: "어디서 들어왔나",
    emptyText: "이 기간에 수입이 없습니다.",
  },
};

export const 비어있음: Story = {
  args: {
    breakdown: [],
    type: CashRecordType.EXPENSE,
    heading: "어디에 썼나",
    emptyText: "이 기간에 지출이 없습니다.",
  },
};

/** 한 항목이 전체를 거의 차지할 때 — 막대 길이 비율이 읽히는지 */
export const 한쪽쏠림: Story = {
  args: {
    breakdown: [
      {categoryName: "월세", total: 800000, type: CashRecordType.EXPENSE},
      {categoryName: "식비", total: 42000, type: CashRecordType.EXPENSE},
      {categoryName: "교통", total: 12000, type: CashRecordType.EXPENSE},
    ],
    type: CashRecordType.EXPENSE,
    heading: "어디에 썼나",
    emptyText: "이 기간에 지출이 없습니다.",
  },
};

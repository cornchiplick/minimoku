import {CashRecordType} from "@/entities/pigmoney/types";
import CashRecordLedger from "@/features/pigmoney/ui/CashRecordLedger";
import {sampleRecords} from "@/features/pigmoney/ui/pigmoneyStoryData";
import type {Meta, StoryObj} from "@storybook/nextjs-vite";

const meta = {
  title: "PigMoney/장부",
  component: CashRecordLedger,
  parameters: {layout: "padded"},
  args: {onSelect: () => {}},
} satisfies Meta<typeof CashRecordLedger>;

export default meta;
type Story = StoryObj<typeof meta>;

/** 날짜별로 묶이고, 하루 소계가 오른쪽에 붙는다 */
export const 기본: Story = {
  args: {records: sampleRecords},
};

/** 기록이 없을 때 */
export const 비어있음: Story = {
  args: {records: []},
};

/** 수입만 있는 날 — 부호와 색이 지출과 구분되는지 본다 */
export const 수입만: Story = {
  args: {records: sampleRecords.filter((r) => r.type === CashRecordType.INCOME)},
};

/** 자릿수가 큰 금액이 섞여도 열이 흔들리지 않아야 한다 */
export const 큰금액: Story = {
  args: {
    records: sampleRecords.map((record, index) => ({
      ...record,
      amount: index % 2 === 0 ? record.amount : record.amount * 137,
    })),
  },
};

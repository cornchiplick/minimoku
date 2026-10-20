import {Button} from "@/shared/components/atoms/button";
import type {Meta, StoryObj} from "@storybook/nextjs-vite";

const meta = {
  title: "공통/버튼",
  component: Button,
  parameters: {layout: "centered"},
  args: {children: "저장"},
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const 기본: Story = {};
export const 보조: Story = {args: {variant: "secondary", children: "취소"}};
export const 테두리: Story = {args: {variant: "outline", children: "더 보기"}};
export const 조용함: Story = {args: {variant: "ghost", children: "닫기"}};
export const 위험: Story = {args: {variant: "destructive", children: "삭제"}};
export const 비활성: Story = {args: {disabled: true}};

/** 한 화면에서 서로 비교한다 */
export const 모아보기: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-2">
      <Button>저장</Button>
      <Button variant="secondary">취소</Button>
      <Button variant="outline">더 보기</Button>
      <Button variant="ghost">닫기</Button>
      <Button variant="destructive">삭제</Button>
      <Button disabled>비활성</Button>
    </div>
  ),
};

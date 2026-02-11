"use client";

import CategoryManageModal from "@/features/pigmoney/ui/CategoryManageModal";
import ProfileSection from "@/features/profile/ui/ProfileSection";
import Divider from "@/shared/components/molecules/Divider";
import {
  MOCK_MONTH_SUMMARY,
  MOCK_WEEK_SUMMARY,
  PIGMONEY_NAV_ITEMS,
} from "@/shared/constants/pigmoney";
import { useBoolean } from "@/shared/hooks/useBoolean";
import {
  BarChart3,
  CalendarDays,
  ChevronDown,
  ChevronRight,
  PenLine,
  PiggyBank,
  Settings,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

// 아이콘 매핑
const ICON_MAP = {
  PenLine,
  BarChart3,
  CalendarDays,
} as const;

// 가계 요약 섹션 (이달의 가계 / 이주의 가계)
interface SummarySectionProps {
  label: string;
  period: string;
  income: number;
  expense: number;
}

const SummarySection = ({ label, period, income, expense }: SummarySectionProps) => {
  const [isOpen, setIsOpen] = useState(true);
  const balance = income - expense;

  return (
    <div className="px-4 py-3">
      {/* 접기/펴기 헤더 */}
      <button
        className="flex w-full cursor-pointer items-center gap-1"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? (
          <ChevronDown className="h-4 w-4 text-minimoku-neutral-bold" />
        ) : (
          <ChevronRight className="h-4 w-4 text-minimoku-neutral-bold" />
        )}
        <span className="text-sm font-semibold">{label}</span>
      </button>

      {/* 접히는 본문 */}
      {isOpen && (
        <div className="mt-2 flex flex-col gap-1.5 pl-5">
          {/* 기간 */}
          <span className="text-xs text-minimoku-neutral-bold">{period}</span>

          {/* 수입 - 지출 (잔액) */}
          <div className="flex items-center justify-between">
            <span className="text-xs text-minimoku-neutral-bold">= 수입 - 지출</span>
            <span className="text-sm font-semibold text-pigmoney-balance">
              {balance.toLocaleString()} 원
            </span>
          </div>

          {/* 수입 */}
          <div className="flex items-center justify-between">
            <span className="text-xs text-minimoku-neutral-bold">+ 수입</span>
            <span className="text-sm font-medium text-pigmoney-income">
              {income.toLocaleString()} 원
            </span>
          </div>

          {/* 지출 */}
          <div className="flex items-center justify-between">
            <span className="text-xs text-minimoku-neutral-bold">- 지출</span>
            <span className="text-sm font-medium text-pigmoney-expense">
              {expense.toLocaleString()} 원
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

// PigMoney 좌측 사이드바
const PigMoneySidebar = () => {
  const categoryModalState = useBoolean();
  const pathname = usePathname();

  // 현재 경로와 네비게이션 항목 비교 (정확 매칭)
  const isActive = (href: string) => {
    if (href === "/pigmoney") return pathname === "/pigmoney";
    return pathname.startsWith(href);
  };

  return (
    <>
      <div className="bg-background-primary border-background-secondary flex w-80 flex-col border-r">
        {/* 로고 영역 (LinkLocker 패턴) */}
        <div className="p-4">
          <div className="flex items-center space-x-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-pigmoney-brand">
              <PiggyBank className="h-5 w-5 text-white" />
            </div>
            <span className="text-base font-semibold">PigMoney</span>
          </div>
        </div>

        <Divider />

        {/* 프로필 섹션 */}
        <ProfileSection />

        <Divider />

        {/* 네비게이션 */}
        <div className="flex flex-col gap-1 p-4">
          {PIGMONEY_NAV_ITEMS.map((item) => {
            const IconComponent = ICON_MAP[item.icon];
            const active = isActive(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors ${
                  active
                    ? "bg-pigmoney-brand/10 font-semibold text-pigmoney-brand"
                    : "text-foreground hover:bg-accent"
                }`}
              >
                <IconComponent className="h-4 w-4" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>

        <Divider />

        {/* 이달의 가계 */}
        <SummarySection
          label={MOCK_MONTH_SUMMARY.label}
          period={MOCK_MONTH_SUMMARY.period}
          income={MOCK_MONTH_SUMMARY.income}
          expense={MOCK_MONTH_SUMMARY.expense}
        />

        <Divider />

        {/* 이주의 가계 */}
        <SummarySection
          label={MOCK_WEEK_SUMMARY.label}
          period={MOCK_WEEK_SUMMARY.period}
          income={MOCK_WEEK_SUMMARY.income}
          expense={MOCK_WEEK_SUMMARY.expense}
        />

        <Divider />

        {/* 관리 버튼 */}
        <div className="flex flex-col gap-1 p-4">
          <button
            className="flex w-full cursor-pointer items-center gap-2 rounded-md px-3 py-2 text-sm hover:bg-accent"
            onClick={categoryModalState.onTrue}
          >
            <Settings className="h-4 w-4 text-minimoku-neutral-bold" />
            <span>카테고리 관리</span>
          </button>
          <button
            className="flex w-full cursor-pointer items-center gap-2 rounded-md px-3 py-2 text-sm text-minimoku-neutral-bold hover:bg-accent"
            disabled
          >
            <Settings className="h-4 w-4" />
            <span>설정</span>
          </button>
        </div>

        {/* 하단 여백 */}
        <div className="flex-1" />
      </div>

      {/* 카테고리 관리 모달 */}
      <CategoryManageModal modalState={categoryModalState} />
    </>
  );
};

export default PigMoneySidebar;

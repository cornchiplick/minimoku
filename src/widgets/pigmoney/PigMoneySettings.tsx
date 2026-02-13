"use client";

import { PigMoneySettingsInterface } from "@/entities/pigmoney/types";
import { updateSettings } from "@/features/pigmoney/model/services/settings.service";
import { useCashRecordStore } from "@/features/pigmoney/model/store/cashRecordStore";
import { Button } from "@/shared/components/atoms/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/atoms/select";
import { WEEK_DAY_LABELS } from "@/shared/constants/pigmoney";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface PigMoneySettingsProps {
  initialSettings: PigMoneySettingsInterface;
}

const PigMoneySettings = ({ initialSettings }: PigMoneySettingsProps) => {
  const { setSettings, invalidateSummary } = useCashRecordStore();

  const [monthStartDay, setMonthStartDay] = useState(String(initialSettings.monthStartDay));
  const [weekStartDay, setWeekStartDay] = useState(String(initialSettings.weekStartDay));
  const [isSaving, setIsSaving] = useState(false);

  // 초기 설정을 스토어에 반영
  useEffect(() => {
    setSettings(initialSettings);
  }, [initialSettings, setSettings]);

  // 저장
  const handleSave = async () => {
    setIsSaving(true);
    try {
      const formData = new FormData();
      formData.append("monthStartDay", monthStartDay);
      formData.append("weekStartDay", weekStartDay);

      const result = await updateSettings(formData);

      if (result && "error" in result) {
        toast.error(result.error);
        return;
      }

      // 스토어 업데이트 + 사이드바 요약 재조회
      setSettings({
        id: initialSettings.id,
        monthStartDay: Number(monthStartDay),
        weekStartDay: Number(weekStartDay),
      });
      invalidateSummary();

      toast.success("설정이 저장되었습니다.");
    } catch {
      toast.error("설정 저장 중 오류가 발생했습니다.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="bg-background-secondary flex flex-1 flex-col overflow-hidden">
      <div className="p-6">
        <h2 className="mb-6 text-lg font-semibold">가계부 설정</h2>

        <div className="flex max-w-md flex-col gap-6">
          {/* 월 시작일 */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">월 시작일</label>
            <p className="text-xs text-minimoku-neutral-bold">
              이달의 가계 기간을 계산할 때 사용됩니다. (예: 25일 → n월 25일 ~ (n+1)월 24일)
            </p>
            <Select value={monthStartDay} onValueChange={setMonthStartDay}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="max-h-60">
                {Array.from({ length: 28 }, (_, i) => i + 1).map((day) => (
                  <SelectItem key={day} value={String(day)}>
                    {day}일
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* 주 시작 요일 */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">주 시작 요일</label>
            <p className="text-xs text-minimoku-neutral-bold">
              이주의 가계 기간을 계산할 때 사용됩니다. (예: 금요일 → 금~목)
            </p>
            <Select value={weekStartDay} onValueChange={setWeekStartDay}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {WEEK_DAY_LABELS.map((label, index) => (
                  <SelectItem key={index} value={String(index)}>
                    {label}요일
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* 저장 버튼 */}
          <Button onClick={handleSave} disabled={isSaving} className="w-40 cursor-pointer">
            {isSaving ? "저장 중..." : "저장"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PigMoneySettings;

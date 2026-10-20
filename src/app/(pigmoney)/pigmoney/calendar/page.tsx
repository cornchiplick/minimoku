import PigMoneyContentSkeleton from "@/widgets/pigmoney/PigMoneyContentSkeleton";
import {Suspense} from "react";
import {getCashRecords} from "@/features/pigmoney/model/services/cashRecords.service";
import {getSettings} from "@/features/pigmoney/model/services/settings.service";
import PigMoneyCalendar from "@/widgets/pigmoney/PigMoneyCalendar";
import {getCustomMonthRangeFor, toDateString} from "@/shared/lib/utils/dateUtils";

const CalendarPageContent = async () => {
  const settings = await getSettings();

  // 현재 월 범위 데이터 조회
  const {from, to} = getCustomMonthRangeFor(new Date(), settings.monthStartDay);
  const initialRecords = await getCashRecords({
    params: {
      fromDate: toDateString(from),
      toDate: toDateString(to),
    },
  });

  return <PigMoneyCalendar initialRecords={initialRecords} initialSettings={settings} />;
};

const CalendarPage = () => (
  <Suspense fallback={<PigMoneyContentSkeleton />}>
    <CalendarPageContent />
  </Suspense>
);

export default CalendarPage;

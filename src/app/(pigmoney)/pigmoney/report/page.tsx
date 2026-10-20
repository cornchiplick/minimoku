import { getCashRecords } from "@/features/pigmoney/model/services/cashRecords.service";
import { getSettings } from "@/features/pigmoney/model/services/settings.service";
import PigMoneyReport from "@/widgets/pigmoney/PigMoneyReport";
import { getCustomMonthRangeFor, toDateString } from "@/shared/lib/utils/dateUtils";

const ReportPage = async () => {
  const settings = await getSettings();

  // 현재 월 범위 데이터 조회
  const { from, to } = getCustomMonthRangeFor(new Date(), settings.monthStartDay);
  const initialRecords = await getCashRecords({
    params: {
      fromDate: toDateString(from),
      toDate: toDateString(to),
    },
  });

  return <PigMoneyReport initialRecords={initialRecords} initialSettings={settings} />;
};

export default ReportPage;

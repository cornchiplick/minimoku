import { getCashRecords } from "@/features/pigmoney/model/services/cashRecords.service";
import { getSettings } from "@/features/pigmoney/model/services/settings.service";
import PigMoneyReport from "@/widgets/pigmoney/PigMoneyReport";
import { getCustomMonthRangeFor, toDateString } from "@/shared/lib/utils/dateUtils";

const ReportPage = async () => {
  try {
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
  } catch (error) {
    console.error("Error in ReportPage:", error);
    return <div>오류가 발생했습니다. 다시 시도해주세요.</div>;
  }
};

export default ReportPage;

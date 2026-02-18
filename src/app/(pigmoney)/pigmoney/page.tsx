import { getCashRecords } from "@/features/pigmoney/model/services/cashRecords.service";
import { getCategories, seedDefaultCategories } from "@/features/pigmoney/model/services/categories.service";
import { getSettings } from "@/features/pigmoney/model/services/settings.service";
import PigMoneyMain from "@/widgets/pigmoney/PigMoneyMain";
import { getCustomMonthRange, toDateString } from "@/shared/lib/utils/dateUtils";

const PigMoneyPage = async () => {
  try {
    // 기본 카테고리가 없으면 생성
    await seedDefaultCategories();

    // 카테고리 목록 + 사용자 설정 동시 조회
    const [initialCategories, initialSettings] = await Promise.all([
      getCategories(),
      getSettings(),
    ]);

    // 설정된 월 시작일 기준으로 데이터 조회
    const { from, to } = getCustomMonthRange(initialSettings.monthStartDay);
    const initialRecords = await getCashRecords({
      params: {
        fromDate: toDateString(from),
        toDate: toDateString(to),
      },
    });

    return (
      <PigMoneyMain
        initialRecords={initialRecords}
        initialCategories={initialCategories}
        initialSettings={initialSettings}
      />
    );
  } catch (error) {
    console.error("Error in PigMoneyPage:", error);
    return <div>오류가 발생했습니다. 다시 시도해주세요.</div>;
  }
};

export default PigMoneyPage;

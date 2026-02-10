import { getCashRecords } from "@/features/pigmoney/model/services/cashRecords.service";
import { getCategories, seedDefaultCategories } from "@/features/pigmoney/model/services/categories.service";
import PigMoneyMain from "@/widgets/pigmoney/PigMoneyMain";
import { DEFAULT_DATE_RANGE_DAYS } from "@/shared/constants/pigmoney";
import { getDateRange, toDateString } from "@/shared/lib/utils/dateUtils";

const PigMoneyPage = async () => {
  try {
    // 기본 카테고리가 없으면 생성
    await seedDefaultCategories();

    // 최근 1주일 데이터 조회
    const { from, to } = getDateRange(DEFAULT_DATE_RANGE_DAYS);
    const initialRecords = await getCashRecords({
      params: {
        fromDate: toDateString(from),
        toDate: toDateString(to),
      },
    });

    // 카테고리 목록 조회
    const initialCategories = await getCategories();

    return (
      <PigMoneyMain
        initialRecords={initialRecords}
        initialCategories={initialCategories}
      />
    );
  } catch (error) {
    console.error("Error in PigMoneyPage:", error);
    return <div>오류가 발생했습니다. 다시 시도해주세요.</div>;
  }
};

export default PigMoneyPage;

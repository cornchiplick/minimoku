import { getSettings } from "@/features/pigmoney/model/services/settings.service";
import PigMoneySettings from "@/widgets/pigmoney/PigMoneySettings";

const SettingsPage = async () => {
  try {
    const settings = await getSettings();
    return <PigMoneySettings initialSettings={settings} />;
  } catch (error) {
    console.error("Error in SettingsPage:", error);
    return <div>오류가 발생했습니다. 다시 시도해주세요.</div>;
  }
};

export default SettingsPage;

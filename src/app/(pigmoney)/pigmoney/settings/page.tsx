import { getSettings } from "@/features/pigmoney/model/services/settings.service";
import PigMoneySettings from "@/widgets/pigmoney/PigMoneySettings";

const SettingsPage = async () => {
  const settings = await getSettings();
  return <PigMoneySettings initialSettings={settings} />;
};

export default SettingsPage;

import PigMoneyContentSkeleton from "@/widgets/pigmoney/PigMoneyContentSkeleton";
import {Suspense} from "react";
import {getSettings} from "@/features/pigmoney/model/services/settings.service";
import PigMoneySettings from "@/widgets/pigmoney/PigMoneySettings";

const SettingsPageContent = async () => {
  const settings = await getSettings();
  return <PigMoneySettings initialSettings={settings} />;
};

const SettingsPage = () => (
  <Suspense fallback={<PigMoneyContentSkeleton />}>
    <SettingsPageContent />
  </Suspense>
);

export default SettingsPage;

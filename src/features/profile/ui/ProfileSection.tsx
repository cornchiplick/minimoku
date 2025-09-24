import Typography from "@/shared/home/atomic/Typography";
import { Settings, User } from "lucide-react";

const ProfileSection = () => {
  return (
    <div className="p-4">
      <div className="flex items-center space-x-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-300">
          <User className="h-6 w-6 text-gray-600" />
        </div>
        <div className="flex-1">
          <Typography.P1 className="font-medium">yeooom</Typography.P1>
          <div className="text-sm text-gray-500">계정관리</div>
        </div>
        <button className="rounded p-1 hover:bg-gray-100">
          <Settings className="h-4 w-4 text-gray-400" />
        </button>
      </div>
    </div>
  );
};

export default ProfileSection;

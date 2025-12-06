"use client";

import Icon from "@/shared/components/molecules/Icon";
import {URL} from "@/shared/constants/url";
import Typography from "@/shared/home/atomic/Typography";
import {useDialogContext} from "@/shared/providers/DialogProvider";
import {User} from "lucide-react";
import {signOut, useSession} from "next-auth/react";
import Image from "next/image";

const ProfileSection = () => {
  const {data: session, status} = useSession();
  const {showDialog} = useDialogContext();

  const onLogout = async () => {
    const ok = await showDialog("정말 로그아웃 하시겠습니까?", {
      variant: "confirm",
    });
    if (!ok) return;

    signOut({callbackUrl: URL.HOME});
  };

  if (status === "loading" || session == null) {
    // TODO skeleton loader
    return (
      <div className="rounded-lg border border-gray-300 bg-gray-100 p-4">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="flex items-center space-x-3">
        <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-gray-300">
          {session.user?.image ? (
            <Image
              src={session.user.image}
              alt="User Avatar"
              width={40}
              height={40}
              className="rounded-full"
            />
          ) : (
            <User className="h-6 w-6 text-gray-600" />
          )}
        </div>
        <div className="flex-1 cursor-pointer">
          <Typography.P1 className="font-medium">{session.user.name}</Typography.P1>
          <div className="text-sm text-gray-500">계정관리</div>
        </div>
        <button
          title="Logout"
          className="cursor-pointer rounded p-1 hover:bg-gray-100"
          onClick={onLogout}>
          <Icon name="logout" color="#99a1af" size={20} />
        </button>
      </div>
    </div>
  );
};

export default ProfileSection;

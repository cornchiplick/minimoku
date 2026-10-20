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
      <div className="border-border bg-background-secondary rounded-lg border p-4">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="flex items-center space-x-3">
        <div className="bg-muted flex h-10 w-10 items-center justify-center overflow-hidden rounded-full">
          {session.user?.image ? (
            <Image
              src={session.user.image}
              alt="User Avatar"
              width={40}
              height={40}
              className="rounded-full"
            />
          ) : (
            <User className="text-minimoku-neutral-bold h-6 w-6" />
          )}
        </div>
        <div className="flex-1 cursor-pointer">
          <Typography.P1 className="font-medium">{session.user.name}</Typography.P1>
          <div className="text-minimoku-neutral-bold text-sm">계정관리</div>
        </div>
        <button
          type="button"
          aria-label="로그아웃"
          className="text-minimoku-neutral-bold hover:bg-accent cursor-pointer rounded p-1"
          onClick={onLogout}>
          <Icon name="logout" color="currentColor" size={20} />
        </button>
      </div>
    </div>
  );
};

export default ProfileSection;

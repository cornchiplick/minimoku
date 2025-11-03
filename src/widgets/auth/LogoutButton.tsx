import {URL} from "@/shared/constants/url";
import {signOut} from "next-auth/react";

const LogoutButon = () => {
  return (
    <button
      onClick={() => signOut({callbackUrl: URL.HOME})}
      className="cursor-pointer rounded-lg border-none bg-red-600 px-6 py-3 text-2xl text-white transition-colors duration-300 hover:bg-red-700">
      로그아웃
    </button>
  );
};

export default LogoutButon;

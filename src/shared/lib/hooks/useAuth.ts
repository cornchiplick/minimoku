import {AuthConstants} from "@/shared/constants/auth";
import {useSession} from "next-auth/react";
import {useMemo} from "react";

export const useAuth = () => {
  const {status} = useSession();
  const isAuthenticated = useMemo(() => status === AuthConstants.AUTHENTICATED, [status]);

  return {isAuthenticated};
};

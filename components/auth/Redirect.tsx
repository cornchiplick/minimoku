"use client";

import {useAuthStore} from "@/components/sample/auth/authStore";
import {URL} from "@/constants/url";
import {getAccessToken, getGithubProfile} from "@/services/authService";
import {useRouter, useSearchParams} from "next/navigation";
import {useEffect} from "react";

const Redirect = () => {
  const searchParams = useSearchParams();
  const router = useRouter();

  const code = searchParams.get("code");

  const {setLoggedIn, setLoginSuccess, setWasLoggedIn} = useAuthStore();

  const fetchLogin = async () => {
    // const user = await db.user.findUnique({
    //   where: {
    //     provider_provider_id: {
    //       provider: 'github',
    //       provider_id: id + ""
    //     },
    //   },
    //   select: {
    //     id: true,
    //   },
    // });
    // if (user) {
    //   await sessionLogin(user.id);
    //   redirect("/profile");
    // }
    // const newUser = await db.user.create({
    //   data: {
    //     username: login,
    //     provider: "github",
    //     provider_id: id + "",
    //     avatar: avatar_url,
    //   },
    //   select: {
    //     id: true,
    //   },
    // });
    // await sessionLogin(newUser.id);
  };

  const login = async () => {
    if (!code) {
      // return notFound();
      return new Response(null, {
        status: 400,
      });
    }
    const access_token = await getAccessToken(code);

    // access token을 이용해 user profile을 받아옴.
    const {id, avatar_url, login} = await getGithubProfile(access_token);

    if (!!id) {
      await fetchLogin();
      setLoginSuccess(true);
      setWasLoggedIn(true);
      setLoggedIn(true);

      // 전역 관리된 Path가 있다면 그 URL로 리다이렉트 없다면 HOME으로 리다이렉트
      router.replace(URL.HOME);
      return;
    }
    // 로그인 실패
    setLoginSuccess(false);
    setLoggedIn(false);
    return router.replace(URL.HOME);
  };

  useEffect(() => {
    // 로그인 시도
    login();
  }, []);

  return <div></div>;
};

export default Redirect;

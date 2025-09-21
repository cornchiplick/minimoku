import AuthButton from "@/widgets/auth/AuthButton";
import UserInfo from "@/widgets/auth/UserInfo";
import Head from "next/head";

const LoginPage = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <Head>
        <title>로그인 | 내 앱</title>
      </Head>

      <div className="flex w-full max-w-md flex-col gap-6 rounded-lg bg-white p-8 shadow-lg">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-gray-700">Sign In</h1>
        </div>
        <UserInfo />
        <AuthButton />
      </div>
    </div>
  );
};

export default LoginPage;

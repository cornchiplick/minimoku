import Redirect from "@/components/auth/Redirect";

const GithubCompletePage = () => {
  return (
    <div className="flex h-screen w-full items-center justify-center">
      <div className="flex flex-col items-center justify-center space-y-4">
        <h1 className="text-2xl font-bold">로그인 완료</h1>
        <p className="text-gray-600">로그인이 완료되었습니다. 이제 MiniMoku를 즐기세요!</p>
      </div>
      <Redirect />
    </div>
  );
};

export default GithubCompletePage;

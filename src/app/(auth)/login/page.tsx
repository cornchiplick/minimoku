import LoginPanel from "@/widgets/auth/LoginPanel";
import {Suspense} from "react";

// useSearchParams 를 쓰는 부분은 Suspense 경계 안에 둬야 한다 (Cache Components)
const LoginPage = () => (
  <main className="bg-background-primary text-foreground flex min-h-screen flex-col justify-center px-5 py-16 md:px-8">
    <div className="mx-auto w-full max-w-sm">
      <Suspense fallback={<div className="h-[26rem]" />}>
        <LoginPanel />
      </Suspense>
    </div>
  </main>
);

export default LoginPage;

"use client";

import Icon from "@/components/common/Icon";
import Head from "next/head";
import Link from "next/link";

const LoginPage = () => {
  const handleSubmit = () => {};

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <Head>
        <title>로그인 | 내 앱</title>
      </Head>

      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-lg">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-gray-700">Sign In</h1>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
              <Icon name="email" size={20} />
            </div>
            <input
              type="email"
              placeholder="Email"
              // value={email}
              // onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-md border border-gray-300 py-3 pl-10 pr-3 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
              <Icon name="lock" size={20} />
            </div>
            <input
              type="password"
              placeholder="Password"
              // value={password}
              // onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-md border border-gray-300 py-3 pl-10 pr-3 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full rounded-md bg-blue-500 px-4 py-3 font-medium text-white transition duration-200 hover:bg-blue-600">
            SIGN UP
          </button>

          <div className="flex items-center justify-center gap-2 py-2">
            <div className="h-px flex-1 bg-gray-300"></div>
            <span className="text-sm text-gray-500">or sign in with</span>
            <div className="h-px flex-1 bg-gray-300"></div>
          </div>

          <button
            type="button"
            className="flex w-full items-center justify-center gap-2 rounded-md bg-gray-100 px-4 py-3 font-medium text-gray-700 transition duration-200 hover:bg-gray-200">
            <Icon name="google" size={20} color="#3b82f6" />
            <span>GOOGLE</span>
          </button>

          <div className="mt-4 text-center text-gray-600">
            Don&apos;t have an account yet?
            <Link href="/signup" className="text-blue-500 hover:underline">
              Sign up
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;

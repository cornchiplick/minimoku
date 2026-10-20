"use client";

import ErrorFallback from "@/shared/components/molecules/ErrorFallback";

const Error = ({error, reset}: {error: Error & {digest?: string}; reset: () => void}) => (
  <ErrorFallback error={error} reset={reset} message="학습 데이터를 불러오지 못했습니다." />
);

export default Error;

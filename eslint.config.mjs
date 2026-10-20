// ESLint flat config (ESLint 9 부터의 표준 형식).
// Next 16 에서 `next lint` 가 제거되어 eslint CLI 를 직접 호출한다.
import coreWebVitals from "eslint-config-next/core-web-vitals";
import typescript from "eslint-config-next/typescript";

export default [
  {
    ignores: [
      ".next/**",
      "node_modules/**",
      "lambda/**",
      "next-env.d.ts",
      "prisma/migrations/**",
      "storybook-static/**",
      "playwright-report/**",
      "test-results/**",
    ],
  },
  ...coreWebVitals,
  ...typescript,
  {
    rules: {
      // 사용하지 않는 변수·any·훅 의존성은 경고로 둔다 (빌드를 막지 않음)
      "no-unused-vars": "off",
      "@typescript-eslint/no-unused-vars": [
        "warn",
        {argsIgnorePattern: "^_", caughtErrors: "none"},
      ],
      "@typescript-eslint/no-explicit-any": "warn",
      "react-hooks/exhaustive-deps": "warn",
    },
  },
];

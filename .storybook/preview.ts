import type {Preview} from "@storybook/nextjs-vite";
// 앱과 같은 토큰·폰트를 쓴다 (팔레트, @theme inline 매핑, 다크 variant 모두 여기 있다)
import "../src/app/globals.css";

const preview: Preview = {
  parameters: {
    controls: {matchers: {color: /(background|color)$/i, date: /Date$/i}},
    // 앱 배경과 같은 토큰을 캔버스 배경으로 쓴다
    backgrounds: {disable: true},
    a11y: {test: "error"},
  },
  // 다크모드는 .dark 클래스 기준이므로, 툴바에서 그 클래스를 붙였다 뗀다
  globalTypes: {
    theme: {
      description: "테마",
      toolbar: {
        title: "테마",
        icon: "circlehollow",
        items: [
          {value: "light", title: "라이트"},
          {value: "dark", title: "다크"},
        ],
        dynamicTitle: true,
      },
    },
  },
  initialGlobals: {theme: "light"},
  decorators: [
    (Story, context) => {
      const isDark = context.globals.theme === "dark";
      document.documentElement.classList.toggle("dark", isDark);
      document.body.style.background = "var(--color-background-primary)";
      return Story();
    },
  ],
};

export default preview;

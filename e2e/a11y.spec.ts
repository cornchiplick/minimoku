import AxeBuilder from "@axe-core/playwright";
import {expect, test, type Page} from "@playwright/test";

const PAGES = [
  "/",
  "/link",
  "/pigmoney",
  "/pigmoney/report",
  "/pigmoney/calendar",
  "/pigmoney/settings",
];
/**
 * 화면별로 빼는 규칙과 그 이유. 규칙을 끄는 건 마지막 수단이라 사유를 함께 적는다.
 */
const EXCLUDED_RULES: Record<string, {rules: string[]; why: string}> = {
  "/pigmoney/calendar": {
    rules: ["label-content-name-mismatch"],
    // 달력 칸은 레이블이 아니라 숫자 데이터("1", "−1.3만")를 담은 버튼이다.
    // 규칙을 만족시키려면 이름에 그 숫자 뭉치를 그대로 이어 붙여야 하는데,
    // 그러면 스크린리더가 "1−1.3만" 을 읽게 되어 오히려 나빠진다.
    // 지금은 "1일, 지출 −1.3만" 로 읽히고, 화면의 축약 표기도 이름 안에 들어 있다.
    why: "달력 칸은 레이블이 아니라 데이터",
  },
};

const THEMES = [
  {name: "라이트", value: "light"},
  {name: "다크", value: "dark"},
];

/** 테마는 localStorage 에 저장된다 (ThemeProvider 가 읽어 .dark 클래스를 붙인다) */
const useTheme = (page: Page, value: string) =>
  page.addInitScript(
    ([key, theme]) => window.localStorage.setItem(key, JSON.stringify(theme)),
    ["minimoku_theme", value]
  );

/** 스트리밍으로 뒤늦게 붙는 영역까지 기다린다 */
const openAndSettle = async (page: Page, path: string) => {
  await page.goto(path);
  await expect(page.locator("body")).toBeVisible();
  await page.waitForLoadState("networkidle");
};

/** 접근 가능한 이름이 없는 조작 요소를 찾는다 (스크린리더에서 "버튼"으로만 읽히는 것들) */
const findUnnamedControls = (page: Page) =>
  page.evaluate(() => {
    const selector =
      'button, a[href], [role="button"], input:not([type="hidden"]), select, textarea';
    const name = (element: Element) => {
      const label = element.getAttribute("aria-label");
      if (label?.trim()) return label.trim();
      // title 도 접근 가능한 이름이 된다 (명세상 마지막 수단)
      const titleAttribute = element.getAttribute("title");
      if (titleAttribute?.trim()) return titleAttribute.trim();
      const labelledBy = element.getAttribute("aria-labelledby");
      if (labelledBy) {
        const text = labelledBy
          .split(/\s+/)
          .map((id) => document.getElementById(id)?.textContent ?? "")
          .join(" ");
        if (text.trim()) return text.trim();
      }
      if (element instanceof HTMLInputElement && element.placeholder.trim()) {
        return element.placeholder.trim();
      }
      return (element.textContent ?? "").trim();
    };

    return [...document.querySelectorAll(selector)]
      .filter((element) => {
        // 화면에 보이지 않는 것은 제외한다
        const rect = element.getBoundingClientRect();
        if (rect.width === 0 && rect.height === 0) return false;
        if (element.getAttribute("aria-hidden") === "true") return false;
        return name(element) === "";
      })
      .map((element) => element.outerHTML.slice(0, 120));
  });

for (const path of PAGES) {
  test(`${path} 의 조작 요소에는 모두 접근 가능한 이름이 있다`, async ({page}) => {
    await openAndSettle(page, path);
    expect(await findUnnamedControls(page)).toEqual([]);
  });
}

/**
 * axe 로 실제 화면을 검사한다. 팔레트 값만 손으로 계산하면 반투명 배경 위 글자처럼
 * 합성된 색을 놓친다 — 그래서 사람이 아니라 도구가 판정하게 둔다.
 */
for (const theme of THEMES) {
  for (const path of PAGES) {
    test(`${path} — ${theme.name} 테마에 접근성 위반이 없다`, async ({page}) => {
      await useTheme(page, theme.value);
      await openAndSettle(page, path);

      const excluded = EXCLUDED_RULES[path];
      const builder = new AxeBuilder({page}).withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"]);
      const result = await (excluded ? builder.disableRules(excluded.rules) : builder).analyze();

      // 실패했을 때 어디가 문제인지 바로 읽히도록 요약해 붙인다
      const summary = result.violations.map((violation) => ({
        rule: violation.id,
        impact: violation.impact,
        nodes: violation.nodes.map((node) =>
          node.failureSummary?.replace(/\s+/g, " ").slice(0, 200)
        ),
      }));
      expect(summary).toEqual([]);
    });
  }
}

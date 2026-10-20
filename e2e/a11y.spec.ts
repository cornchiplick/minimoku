import {expect, test} from "@playwright/test";

/** 접근 가능한 이름이 없는 조작 요소를 찾는다 (스크린리더에서 "버튼"으로만 읽히는 것들) */
const findUnnamedControls = async (page: import("@playwright/test").Page) =>
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

for (const path of ["/", "/link", "/pigmoney", "/pigmoney/report", "/pigmoney/settings"]) {
  test(`${path} 의 조작 요소에는 모두 접근 가능한 이름이 있다`, async ({page}) => {
    await page.goto(path);
    await expect(page.locator("body")).toBeVisible();
    // 스트리밍으로 뒤늦게 붙는 영역까지 기다린다
    await page.waitForLoadState("networkidle");

    expect(await findUnnamedControls(page)).toEqual([]);
  });
}

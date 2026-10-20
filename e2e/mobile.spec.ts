import {expect, test} from "@playwright/test";

test.describe("모바일", () => {
  test("LinkLocker 사이드바를 드로어로 열고 닫는다", async ({page}) => {
    await page.goto("/link");

    // 좁은 화면에서는 사이드바가 접혀 있고 여는 버튼이 보인다
    const openButton = page.getByRole("button", {name: "메뉴 열기"});
    await expect(openButton).toBeVisible();

    await openButton.click();
    const drawer = page.getByRole("dialog", {name: "LinkLocker 메뉴"});
    await expect(drawer).toBeVisible();
    await expect(drawer.getByRole("button", {name: "폴더 추가"})).toBeVisible();

    await page.getByRole("button", {name: "메뉴 닫기"}).click();
    await expect(drawer).toBeHidden();
  });

  test("가로 스크롤이 생기지 않는다", async ({page}) => {
    await page.goto("/");
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth
    );
    expect(overflow).toBeLessThanOrEqual(1);
  });
});

import {expect, test} from "@playwright/test";

test.describe("홈", () => {
  test("히어로·서비스 소개·푸터가 모두 보인다", async ({page}) => {
    await page.goto("/");

    await expect(page.getByRole("heading", {level: 1})).toContainText("개인용 웹앱");

    // 서비스 두 개가 제목과 캡처 이미지를 갖고 소개된다
    for (const name of ["LinkLocker", "PigMoney"]) {
      await expect(page.getByRole("heading", {name, exact: true})).toBeVisible();
    }
    await expect(page.getByAltText(/LinkLocker 화면/)).toBeVisible();
    await expect(page.getByAltText(/PigMoney 보고서 화면/)).toBeVisible();

    await expect(page.getByRole("heading", {name: "만든 방식"})).toBeVisible();
    await expect(page.getByRole("contentinfo")).toContainText("Next.js 16");
  });

  test("모든 이미지에 대체 텍스트가 있다", async ({page}) => {
    await page.goto("/");

    const alts = await page
      .locator("img")
      .evaluateAll((images) => images.map((image) => (image as HTMLImageElement).alt));
    expect(alts.length).toBeGreaterThan(0);
    for (const alt of alts) {
      expect(alt.trim()).not.toBe("");
    }
  });
});

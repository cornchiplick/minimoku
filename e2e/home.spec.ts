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

  /**
   * 이미 로그인한 사람이 홈 버튼을 눌러도 게스트 세션으로 덮어쓰지 않는다.
   * 내 계정(OAuth)은 E2E 에서 만들 수 없어 게스트 세션으로 대신 확인한다 —
   * 로그인돼 있으면 게스트 로그인 요청 자체가 나가지 않아야 한다.
   */
  test("로그인돼 있으면 게스트로 다시 로그인하지 않는다", async ({page}) => {
    const guestSignIns: string[] = [];
    page.on("request", (request) => {
      if (request.method() === "POST" && request.url().includes("/api/auth/callback/guest")) {
        guestSignIns.push(request.url());
      }
    });

    await page.goto("/");
    await page.getByRole("button", {name: "로그인 없이 둘러보기"}).click();
    await expect(page).toHaveURL(/\/link$/, {timeout: 20_000});

    // 뒤로 가면 Next 가 보관해 둔 이전 화면이 상태째로 돌아온다 — 버튼이 로딩 상태로 굳어 있으면 안 된다
    await page.goBack();
    await expect(page).toHaveURL(/\/$/);
    await expect(page.getByRole("button", {name: "로그인 없이 둘러보기"})).toBeEnabled();

    await page.goto("/");
    await page.getByRole("link", {name: "PigMoney 열어 보기"}).click();
    await expect(page).toHaveURL(/\/pigmoney$/, {timeout: 20_000});

    expect(guestSignIns).toEqual([]);
  });

  test("체험 모드 배너에서 내 계정으로 로그인하러 갈 수 있다", async ({page}) => {
    // 로그인 뒤 돌아올 곳은 지금 보고 있던 서비스여야 한다
    for (const [path, encoded] of [
      ["/link", "%2Flink"],
      ["/pigmoney", "%2Fpigmoney"],
    ]) {
      await page.goto(path);
      const banner = page.getByRole("complementary", {name: "체험 모드 안내"});
      await expect(banner.getByRole("link", {name: "내 계정으로 로그인"})).toHaveAttribute(
        "href",
        `/login?callbackUrl=${encoded}`
      );
    }

    await page
      .getByRole("complementary", {name: "체험 모드 안내"})
      .getByRole("link", {name: "내 계정으로 로그인"})
      .click();
    await expect(page).toHaveURL(/\/login\?callbackUrl=%2Fpigmoney$/);
    await expect(page.getByRole("button", {name: "Google로 계속하기"})).toBeVisible();
  });
});

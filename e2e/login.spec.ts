import {expect, test} from "@playwright/test";

// 로그인 화면은 비로그인 상태에서 봐야 한다
test.use({storageState: {cookies: [], origins: []}});

test.describe("로그인 화면", () => {
  test("로그인 수단 네 가지가 모두 보인다", async ({page}) => {
    await page.goto("/login");

    await expect(page.getByRole("button", {name: "로그인 없이 둘러보기"})).toBeVisible();
    for (const name of ["Google로 계속하기", "GitHub로 계속하기", "카카오로 계속하기"]) {
      await expect(page.getByRole("button", {name})).toBeVisible();
    }
  });

  /**
   * 미인증 상태로 보호된 경로에 가면 ?callbackUrl= 이 붙는다.
   * 그 값을 흘려버리면 로그인 후 엉뚱한 곳으로 가므로 고정해 둔다.
   */
  test("들어오려던 경로를 기억했다가 그리로 보낸다", async ({page}) => {
    await page.goto("/pigmoney");
    await expect(page).toHaveURL(/\/login\?callbackUrl=%2Fpigmoney/);

    await page.getByRole("button", {name: "로그인 없이 둘러보기"}).click();
    await expect(page).toHaveURL(/\/pigmoney$/, {timeout: 20_000});
  });

  /**
   * 홈에서 내 계정으로 들어가는 길. 홈을 재설계하면서 이 길이 통째로 사라진 적이 있다
   * (모든 버튼이 게스트 로그인이었다) — 다시 없어지지 않게 고정해 둔다.
   */
  test("홈 머리의 로그인 링크로 로그인 화면에 간다", async ({page}) => {
    await page.goto("/");

    await page.getByRole("link", {name: "로그인", exact: true}).click();
    await expect(page).toHaveURL(/\/login$/);
    await expect(page.getByRole("button", {name: "Google로 계속하기"})).toBeVisible();
  });

  test("홈에서 서비스를 열면 로그인 화면이 그 서비스를 기억한다", async ({page}) => {
    await page.goto("/");

    // 화면 안 이동(클라이언트 내비게이션)으로 proxy 리다이렉트를 탄다 — 주소창 입력과 경로가 다르다
    await page.getByRole("link", {name: "PigMoney 열어 보기"}).click();
    await expect(page).toHaveURL(/\/login\?callbackUrl=%2Fpigmoney$/);

    await page.getByRole("button", {name: "로그인 없이 둘러보기"}).click();
    await expect(page).toHaveURL(/\/pigmoney$/, {timeout: 20_000});
  });

  test("앱 밖 주소는 돌아갈 곳으로 받지 않는다", async ({page}) => {
    await page.goto("/login?callbackUrl=https%3A%2F%2Fexample.com");

    await page.getByRole("button", {name: "로그인 없이 둘러보기"}).click();
    await expect(page).toHaveURL(/localhost:3000\/link$/, {timeout: 20_000});
  });
});

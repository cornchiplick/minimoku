import {expect, test as setup} from "@playwright/test";

const GUEST_SESSION = "e2e/.auth/guest.json";

/**
 * 홈의 "로그인 없이 둘러보기" 로 게스트 로그인한 뒤 세션을 파일로 남긴다.
 * 이후 테스트는 이 세션을 재사용해 로그인 단계를 반복하지 않는다.
 */
setup("게스트로 로그인한다", async ({page}) => {
  await page.goto("/");
  await page.getByRole("button", {name: "로그인 없이 둘러보기"}).click();

  // 게스트 로그인이 끝나면 LinkLocker 로 들어간다
  await page.waitForURL("**/link");
  await expect(page.getByRole("button", {name: "링크 추가"}).first()).toBeVisible();

  await page.context().storageState({path: GUEST_SESSION});
});

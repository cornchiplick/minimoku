import {expect, test as setup} from "@playwright/test";

const GUEST_SESSION = "e2e/.auth/guest.json";

/**
 * 홈의 "로그인 없이 둘러보기" 로 게스트 로그인한 뒤 세션을 파일로 남긴다.
 * 이후 테스트는 이 세션을 재사용해 로그인 단계를 반복하지 않는다.
 *
 * 첫 요청에서 인증 경로가 아직 컴파일 중이면 `/api/auth/signin` 에서 멈추는 일이 있다.
 * 모든 테스트가 이 단계에 걸려 있으므로 몇 번 다시 시도한다.
 */
setup("게스트로 로그인한다", async ({page}) => {
  setup.setTimeout(90_000);

  for (let attempt = 1; attempt <= 3; attempt += 1) {
    await page.goto("/");
    await page.getByRole("button", {name: "로그인 없이 둘러보기"}).click();

    try {
      await page.waitForURL("**/link", {timeout: 20_000});
      break;
    } catch {
      if (attempt === 3) {
        throw new Error(`게스트 로그인이 ${page.url()} 에서 더 진행되지 않았습니다.`);
      }
    }
  }

  await expect(page.getByRole("button", {name: "링크 추가"}).first()).toBeVisible();
  await page.context().storageState({path: GUEST_SESSION});
});

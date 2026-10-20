import {expect, test} from "@playwright/test";

/**
 * 조회가 "use cache" 로 캐시되므로, 변경 후 캐시 태그가 갱신되지 않으면
 * 새로 고쳐도 옛 화면이 남는다. 이 구조에서 가장 쉽게 망가지는 지점이라
 * 추가·수정·삭제를 한 번씩 거치며 각각 새로고침 뒤 반영되는지 확인한다.
 *
 * ⚠️ 게스트 계정의 실데이터를 쓴다. 제목에 고유 표식을 붙이고 끝나면 지운다.
 */
const marker = `e2e-${Date.now()}`;
const title = `캐시 검증 ${marker}`;
const editedTitle = `캐시 검증 수정됨 ${marker}`;

test.describe.configure({mode: "serial"});

/**
 * 서버 액션은 현재 주소로 POST 한다. 응답을 기다리지 않고 새로고침하면
 * 변경이 끝나기 전에 화면을 다시 읽게 되므로, 클릭과 응답을 짝지어 기다린다.
 */
const clickAndWaitForAction = async (
  page: import("@playwright/test").Page,
  locator: import("@playwright/test").Locator
) => {
  const action = page.waitForResponse(
    (response) => response.request().method() === "POST" && response.status() < 400
  );
  await locator.click();
  await action;
};

test.describe("캐시 무효화", () => {
  test.afterAll(async ({browser}) => {
    // 테스트가 중간에 실패해도 남은 링크는 지운다
    const page = await browser.newPage({storageState: "e2e/.auth/guest.json"});
    await page.goto("/link");
    for (const name of [title, editedTitle]) {
      const card = page.locator("article", {hasText: name});
      if ((await card.count()) === 0) continue;
      await card.first().getByRole("button", {name: "삭제"}).click();
      await page.getByRole("button", {name: "확인"}).click();
      await expect(card).toHaveCount(0);
    }
    await page.close();
  });

  test("추가한 링크가 새로고침 한 번에 목록에 나타난다", async ({page}) => {
    await page.goto("/link");

    await page.getByRole("button", {name: "링크 추가"}).first().click();
    const dialog = page.getByRole("dialog");
    await dialog.getByPlaceholder("링크 제목을 입력하세요").fill(title);
    await dialog.getByPlaceholder("https://example.com").fill("https://example.com/e2e");
    await dialog.locator("select").selectOption({index: 0});
    await dialog.getByRole("button", {name: "Save"}).click();
    await expect(dialog).toBeHidden();

    await page.reload();
    await expect(page.locator("article", {hasText: title})).toHaveCount(1);
  });

  test("즐겨찾기 표시가 새로고침 한 번에 유지된다", async ({page}) => {
    await page.goto("/link");
    const card = page.locator("article", {hasText: title}).first();

    await clickAndWaitForAction(page, card.getByRole("button", {name: "즐겨찾기", exact: true}));
    await page.reload();

    await expect(
      page.locator("article", {hasText: title}).first().getByRole("button", {name: "즐겨찾기 해제"})
    ).toBeVisible();
  });

  test("수정한 제목이 새로고침 한 번에 반영된다", async ({page}) => {
    await page.goto("/link");
    await page
      .locator("article", {hasText: title})
      .first()
      .getByRole("button", {name: "수정"})
      .click();

    const dialog = page.getByRole("dialog");
    await dialog.getByPlaceholder("링크 제목을 입력하세요").fill(editedTitle);
    await dialog.getByRole("button", {name: "Save"}).click();
    await expect(dialog).toBeHidden();

    await page.reload();
    await expect(page.locator("article", {hasText: editedTitle})).toHaveCount(1);
    // 옛 제목은 남지 않는다
    await expect(page.locator("article", {hasText: title})).toHaveCount(0);
  });

  test("삭제한 링크가 새로고침 한 번에 사라진다", async ({page}) => {
    await page.goto("/link");
    const card = page.locator("article", {hasText: editedTitle}).first();

    await card.getByRole("button", {name: "삭제"}).click();
    await clickAndWaitForAction(page, page.getByRole("button", {name: "확인"}));

    await page.reload();
    await expect(page.locator("article", {hasText: editedTitle})).toHaveCount(0);
  });
});

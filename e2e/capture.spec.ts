import {test} from "@playwright/test";

/**
 * 홈에 거는 서비스 캡처를 다시 찍는다. 팔레트나 레이아웃이 바뀌면 함께 갱신해야
 * 홈의 이미지가 실제 화면과 어긋나지 않는다.
 *
 *   npm run screens
 *
 * 평소 테스트 실행에는 끼지 않는다 (실행할 때마다 이미지를 덮어쓰면 곤란하다).
 */
const shots = [
  {path: "/link", file: "public/screens/linklocker.jpg"},
  {path: "/pigmoney/report", file: "public/screens/pigmoney.jpg"},
];

test.describe("홈 캡처", () => {
  test.skip(!process.env.CAPTURE_SCREENS, "npm run screens 로만 실행한다");

  for (const shot of shots) {
    test(`캡처 ${shot.path}`, async ({page}) => {
      await page.setViewportSize({width: 1280, height: 800});
      await page.goto(shot.path);
      // 개발 서버에서만 뜨는 Next 개발 도구 배지를 가린다 (캡처에 남으면 안 된다)
      await page.addStyleTag({content: "nextjs-portal{display:none!important}"});
      await page.waitForLoadState("networkidle");
      await page.waitForTimeout(1200);
      await page.screenshot({path: shot.file, type: "jpeg", quality: 88});
    });
  }
});

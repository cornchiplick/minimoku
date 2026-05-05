"use server";

import {getSessionUser} from "@/shared/lib/utils/authUtils";

export async function getUploadUrl() {
  // 게스트 계정은 Cloudflare 이미지 업로드 불가.
  // 정책: 게스트는 이미지 누적/스토리지 비용 폭증 방지를 위해 업로드 자체를 차단한다.
  const user = await getSessionUser();
  if (user?.isGuest) {
    return {success: false, errors: [{message: "게스트 계정은 이미지를 업로드할 수 없습니다."}]};
  }

  const response = await fetch(
    `https://api.cloudflare.com/client/v4/accounts/${process.env.CLOUDFLARE_ACCOUNT_ID}/images/v2/direct_upload`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.CLOUDFLARE_API_KEY}`,
      },
    }
  );

  const data = await response.json();
  console.log("getUploadUrl : ", data);
  return data;
}

export async function deleteImage(imageId: string) {
  const response = await fetch(
    `https://api.cloudflare.com/client/v4/accounts/${process.env.CLOUDFLARE_ACCOUNT_ID}/images/v1/${imageId}`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${process.env.CLOUDFLARE_API_KEY}`,
      },
    }
  );

  const data = await response.json();
  console.log("deleteImage : ", data);
  return data;
}

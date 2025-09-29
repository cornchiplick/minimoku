"use server";

import db from "@/shared/lib/db";
import { getSessionUser } from "@/shared/lib/utils/authUtils";

export async function getFolders() {
  const user = await getSessionUser();
  if (!user) {
    throw new Error("로그인이 필요합니다.");
  }

  const result = await db.folder.findMany({
    select: {
      id: true,
      name: true,
      count: true,
      createdAt: true,
      updatedAt: true,
    },
  });
  return result;
}

export async function getLinks() {
  const user = await getSessionUser();
  if (!user) {
    throw new Error("로그인이 필요합니다.");
  }

  const result = await db.link.findMany({
    select: {
      id: true,
      title: true,
      url: true,
      imageUrl: true,
      folderId: true,
      tags: true,
      isAlarm: true,
      isFavorite: true,
      isRead: true,
      createdAt: true,
      updatedAt: true,
      memo: true,
    },
  });
  return result;
}

export async function getUploadUrl() {
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
  return data;
}

export async function postLink(formData: FormData) {
  const data = {
    title: formData.get("title"),
    url: formData.get("url"),
    imageUrl: formData.get("imageUrl"),
    folderId: formData.get("folderId"),
    tags: formData.get("tags") ? (formData.get("tags") as string).split(",") : [],
    memo: formData.get("memo"),
  };

  // const result
}

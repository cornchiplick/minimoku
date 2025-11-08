"use server";

import {LinkInterface} from "@/entities/link/types";
import {linkSchema} from "@/features/link/model/schema/linkSchema";
import {APIConstants} from "@/shared/constants/api";
import db from "@/shared/lib/db";
import {getSessionUser} from "@/shared/lib/utils/authUtils";
import {getQueryString, getTags} from "@/shared/lib/utils/commonUtils";
import {deleteImage} from "@/shared/services/cloudflare.service";
import {fetchAPI} from "@/shared/utils/fetchAPI";
import {revalidateTag} from "next/cache";

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
    where: {
      userId: user.id,
    },
  });
  return result;
}

export async function getFolder({folderId}: {folderId: number}) {
  const result = await db.folder.findUnique({
    select: {
      id: true,
      name: true,
      count: true,
      createdAt: true,
      updatedAt: true,
    },
    where: {
      id: folderId,
    },
  });
  return result;
}

export async function getLinks(
  parameters: {revalidateTime?: number; params?: Record<string, string | number | boolean>} = {}
) {
  const {revalidateTime = 10, params = {}} = parameters;

  const user = await getSessionUser();
  if (!user) {
    throw new Error("로그인이 필요합니다.");
  }

  const res = await fetchAPI<LinkInterface[]>(
    `/api/${APIConstants.API_LINKS}${getQueryString({...params, userId: user.id!})}`,
    {
      method: "GET",
      revalidate: revalidateTime,
      next: {tags: [getTags(user.id!, APIConstants.API_LINKS)]},
    }
  );

  return res ?? [];
}

export async function getLink({linkId}: {linkId: number}) {
  const result = await db.link.findUnique({
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
    where: {
      id: linkId,
    },
  });
  return result;
}

export async function postLink(formData: FormData) {
  const user = await getSessionUser();
  if (!user) {
    throw new Error("로그인이 필요합니다.");
  }

  const data = {
    title: formData.get("title"),
    url: formData.get("url"),
    imageUrl: formData.get("imageUrl"),
    folderId: formData.get("folderId"),
    tags: formData.get("tags") || "",
    memo: formData.get("memo"),
  };

  // schema 검증
  const result = linkSchema.safeParse(data);
  if (!result.success) {
    return result.error.flatten();
  }

  // 폴더가 실제로 존재하는지 확인
  const folderId = Number(result.data.folderId);
  const folder = await getFolder({folderId});
  if (!folder) {
    return {folderId: "존재하지 않는 폴더입니다."};
  }

  // if (result.data.tags?.split(" ")) {
  //   return {tags: "올바르지 않은 태그 형식입니다."};
  // }

  try {
    await db.link.create({
      data: {
        title: result.data.title,
        url: result.data.url,
        imageUrl: result.data.imageUrl || "",
        folderId: Number(result.data.folderId),
        tags: [],
        memo: result.data.memo || "",
      },
    });

    revalidateTag(getTags(user.id!, APIConstants.API_LINKS));
  } catch (error) {
    console.error("Database Error : ", error);
    throw error;
  }
}

export async function deleteLink({linkId}: {linkId: number}) {
  const user = await getSessionUser();
  if (!user) {
    throw new Error("로그인이 필요합니다.");
  }

  try {
    // link 조회 및 이미지 URL 얻기
    const link = await db.link.findFirst({
      where: {
        id: linkId,
        folder: {
          userId: user.id,
        },
      },
    });

    if (!link) {
      throw new Error("존재하지 않는 링크이거나 권한이 없습니다.");
    }

    // Cloudflare 이미지 있다면 삭제
    if (link.imageUrl) {
      const imageIdMatch = link.imageUrl.match(/\/([^\/]+)$/);
      if (imageIdMatch) {
        const imageId = imageIdMatch[1];
        await deleteImage(imageId);
      }
    }

    // 링크 삭제
    await db.link.delete({
      where: {
        id: linkId,
      },
    });

    // 캐시 무효화
    revalidateTag(getTags(user.id!, APIConstants.API_LINKS));

    return {success: true};
  } catch (error) {
    console.error("Delete Link Error : ", error);
    throw error;
  }
}

"use server";

import {LinkInterface} from "@/entities/link/types";
import {getFolder} from "@/features/folder/model/services/folders.service";
import {linkSchema} from "@/features/link/model/schema/linkSchema";
import {APIConstants} from "@/shared/constants/api";
import db from "@/shared/lib/db";
import {getSessionUser} from "@/shared/lib/utils/authUtils";
import {getQueryString, getTags} from "@/shared/lib/utils/commonUtils";
import {deleteImage} from "@/shared/services/cloudflare.service";
import {fetchAPI} from "@/shared/utils/fetchAPI";
import {revalidateTag} from "next/cache";

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

  // 태그 JSON 문자열을 배열로 파싱
  const tagsString = formData.get("tags") as string;
  let parsedTags: string[] = [];
  try {
    parsedTags = tagsString ? JSON.parse(tagsString) : [];
  } catch {
    parsedTags = [];
  }

  const data = {
    title: formData.get("title"),
    url: formData.get("url"),
    imageUrl: formData.get("imageUrl"),
    folderId: formData.get("folderId"),
    tags: parsedTags,
    memo: formData.get("memo"),
  };

  // schema 검증
  const result = linkSchema.safeParse(data);
  if (!result.success) {
    return result.error.flatten();
  }

  // 폴더가 현재 사용자 소유인지 확인 (보안)
  const folderId = Number(result.data.folderId);
  const folder = await getFolder({folderId, userId: user.id});
  if (folder.error) {
    return {folderId: "존재하지 않거나 접근 권한이 없는 폴더입니다."};
  }

  try {
    await db.link.create({
      data: {
        title: result.data.title,
        url: result.data.url,
        imageUrl: result.data.imageUrl || "",
        folderId: Number(result.data.folderId),
        tags: result.data.tags,
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
    return {error: true};
  }
}

export async function favoriteLink({linkId}: {linkId: number}) {
  const user = await getSessionUser();
  if (!user) {
    throw new Error("로그인이 필요합니다.");
  }

  try {
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

    await db.link.update({
      where: {
        id: linkId,
      },
      data: {
        isFavorite: !link.isFavorite,
      },
    });

    revalidateTag(getTags(user.id!, APIConstants.API_LINKS));
    return {success: true};
  } catch (error) {
    console.error("Favorite Link Error : ", error);
    return {error: true};
  }
}

export async function readLink({linkId}: {linkId: number}) {
  const user = await getSessionUser();
  if (!user) {
    throw new Error("로그인이 필요합니다.");
  }

  try {
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

    await db.link.update({
      where: {
        id: linkId,
      },
      data: {
        isRead: !link.isRead,
      },
    });

    revalidateTag(getTags(user.id!, APIConstants.API_LINKS));
    return {success: true};
  } catch (error) {
    console.error("Read Link Error : ", error);
    return {error: true};
  }
}

export async function updateLink(formData: FormData) {
  const user = await getSessionUser();
  if (!user) {
    throw new Error("로그인이 필요합니다.");
  }

  const linkId = Number(formData.get("linkId"));

  // 태그 JSON 문자열을 배열로 파싱
  const tagsString = formData.get("tags") as string;
  let parsedTags: string[] = [];
  try {
    parsedTags = tagsString ? JSON.parse(tagsString) : [];
  } catch {
    parsedTags = [];
  }

  const data = {
    title: formData.get("title"),
    url: formData.get("url"),
    imageUrl: formData.get("imageUrl"),
    folderId: formData.get("folderId"),
    tags: parsedTags,
    memo: formData.get("memo"),
  };

  // schema 검증
  const result = linkSchema.safeParse(data);
  if (!result.success) {
    return result.error.flatten();
  }

  // 폴더가 현재 사용자 소유인지 확인 (보안)
  const folderId = Number(result.data.folderId);
  const folder = await getFolder({folderId, userId: user.id});
  if (folder.error) {
    return {folderId: "존재하지 않거나 접근 권한이 없는 폴더입니다."};
  }

  try {
    // 링크가 사용자 소유인지 확인
    const existingLink = await db.link.findFirst({
      where: {
        id: linkId,
        folder: {
          userId: user.id,
        },
      },
    });

    if (!existingLink) {
      // _form 키로 반환하여 폼 레벨 에러로 처리
      return {_form: "존재하지 않는 링크이거나 권한이 없습니다."};
    }

    // 이미지가 변경되었고 기존 이미지가 있으면 삭제
    if (existingLink.imageUrl && existingLink.imageUrl !== result.data.imageUrl) {
      const imageIdMatch = existingLink.imageUrl.match(/\/([^\/]+)$/);
      if (imageIdMatch) {
        const imageId = imageIdMatch[1];
        await deleteImage(imageId);
      }
    }

    await db.link.update({
      where: {
        id: linkId,
      },
      data: {
        title: result.data.title,
        url: result.data.url,
        imageUrl: result.data.imageUrl || "",
        folderId: Number(result.data.folderId),
        tags: result.data.tags,
        memo: result.data.memo || "",
      },
    });

    revalidateTag(getTags(user.id!, APIConstants.API_LINKS));
  } catch (error) {
    console.error("Update Link Error : ", error);
    throw error;
  }
}

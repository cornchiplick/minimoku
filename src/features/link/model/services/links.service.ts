"use server";

import {cacheTags} from "@/shared/lib/cacheTags";
import {cacheLife, cacheTag, updateTag} from "next/cache";
import {z} from "zod";
import {getFolder} from "@/features/folder/model/services/folders.service";
import {linkSchema} from "@/features/link/model/schema/linkSchema";
import {FilterConstants} from "@/shared/constants/navigation";
import db from "@/shared/lib/db";
import {getSessionUser} from "@/shared/lib/utils/authUtils";
import {deleteImage} from "@/shared/services/cloudflare.service";

// 필터 문자열을 Prisma where 조건으로 변환
const validFilterValue = (filter?: string) => {
  switch (filter) {
    case FilterConstants.FILTER_UNREAD:
      return {isRead: false};
    case FilterConstants.FILTER_FAVORITE:
      return {isFavorite: true};
    default:
      return null;
  }
};

export async function getLinks(
  parameters: {params?: Record<string, string | number | boolean>} = {}
) {
  const {params = {}} = parameters;

  const user = await getSessionUser();
  if (!user) {
    throw new Error("로그인이 필요합니다.");
  }
  // 세션 확인은 캐시 밖에서 한다 (캐시 범위 안에서는 cookies/headers 에 접근할 수 없다)
  return getCachedLinks(user.id!, params);
}

async function getCachedLinks(userId: number, params: Record<string, string | number | boolean>) {
  "use cache";
  cacheTag(cacheTags.links(userId));
  cacheLife("hours");

  // 조회 범위는 항상 세션 사용자의 폴더로 한정한다 (userId 를 외부 입력으로 받지 않는다)
  const folderId = params.folderId !== undefined ? Number(params.folderId) : null;
  const filter = typeof params.filter === "string" ? params.filter : undefined;
  const keyword = typeof params.keyword === "string" ? params.keyword : undefined;

  return db.link.findMany({
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
      folder: {
        ...(folderId !== null && !Number.isNaN(folderId) && {id: folderId}),
        userId,
      },
      ...(validFilterValue(filter) ?? {}),
      ...(keyword && {
        title: {
          contains: keyword,
          mode: "insensitive",
        },
      }),
    },
    orderBy: {
      createdAt: "desc",
    },
  });
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
    return z.flattenError(result.error);
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

    updateTag(cacheTags.links(user.id!));
    // 폴더의 링크 개수가 바뀐다
    updateTag(cacheTags.folders(user.id!));
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

    updateTag(cacheTags.links(user.id!));
    updateTag(cacheTags.folders(user.id!));
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

    updateTag(cacheTags.links(user.id!));
    updateTag(cacheTags.folders(user.id!));
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

    updateTag(cacheTags.links(user.id!));
    updateTag(cacheTags.folders(user.id!));
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
    return z.flattenError(result.error);
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

    updateTag(cacheTags.links(user.id!));
    // 폴더를 옮겼을 수 있으므로 폴더별 개수도 다시 센다
    updateTag(cacheTags.folders(user.id!));
  } catch (error) {
    console.error("Update Link Error : ", error);
    return {_form: "링크 업데이트 중 오류가 발생했습니다."};
  }
}

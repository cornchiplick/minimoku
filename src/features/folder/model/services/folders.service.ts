"use server";

import {FolderInterface} from "@/entities/folder/types";
import {folderSchema} from "@/features/folder/model/schema/folderSchema";
import {APIConstants} from "@/shared/constants/api";
import db from "@/shared/lib/db";
import {getSessionUser} from "@/shared/lib/utils/authUtils";
import {getQueryString, getTags} from "@/shared/lib/utils/commonUtils";
import {fetchAPI} from "@/shared/utils/fetchAPI";
import {revalidateTag} from "next/cache";

export async function getFolders(
  parameters: {revalidateTime?: number; params?: Record<string, string | number | boolean>} = {}
) {
  const {revalidateTime = 10, params = {}} = parameters;

  const user = await getSessionUser();
  if (!user) {
    throw new Error("로그인이 필요합니다.");
  }

  const res = await fetchAPI<FolderInterface[]>(
    `/api/${APIConstants.API_FOLDERS}${getQueryString({...params, userId: user.id!})}`,
    {
      method: "GET",
      revalidate: revalidateTime,
      next: {tags: [getTags(user.id!, APIConstants.API_FOLDERS)]},
    }
  );

  return res ?? [];
}

export async function getFolder({
  folderId,
  userId,
}: {
  folderId: number;
  userId?: number; // userId가 제공되면 소유권 검증
}) {
  try {
    const result = await db.folder.findFirst({
      select: {
        id: true,
        name: true,
        count: true,
        createdAt: true,
        updatedAt: true,
      },
      where: {
        id: folderId,
        ...(userId && {userId}), // userId가 있으면 소유권 검증
      },
    });

    if (result === null) {
      return {error: true};
    }

    return {error: false, ...result};
  } catch (error) {
    console.error("Get Folder Error : ", error);
    return {error: true};
  }
}

export async function postFolder(formData: FormData) {
  const user = await getSessionUser();
  if (!user) {
    throw new Error("로그인이 필요합니다.");
  }

  const data = {
    name: formData.get("name"),
  };

  // schema 검증
  const result = folderSchema.safeParse(data);
  if (!result.success) {
    return result.error.flatten();
  }

  try {
    await db.folder.create({
      data: {
        name: result.data.name,
        userId: user.id!,
      },
    });

    revalidateTag(getTags(user.id!, APIConstants.API_FOLDERS));
  } catch (error) {
    console.error("Post Folder Error : ", error);
    return {error: true};
  }
}

export async function updateFolder(formData: FormData) {
  const user = await getSessionUser();
  if (!user) {
    throw new Error("로그인이 필요합니다.");
  }

  const data = {
    folderId: Number(formData.get("folderId")),
    name: formData.get("name"),
  };

  // schema 검증
  const result = folderSchema.safeParse(data);
  if (!result.success) {
    return result.error.flatten();
  }

  // 폴더가 현재 사용자 소유인지 확인 (보안)
  const folderId = data.folderId;
  const folder = await getFolder({folderId, userId: user.id});
  if (folder.error) {
    return {folderId: "존재하지 않거나 접근 권한이 없는 폴더입니다."};
  }

  try {
    await db.folder.update({
      data: {
        name: result.data.name,
      },
      where: {
        id: folderId,
      },
    });

    revalidateTag(getTags(user.id!, APIConstants.API_FOLDERS));
  } catch (error) {
    console.error("Update Folder Error : ", error);
    return {error: true};
  }
}

export async function deleteFolder(folderId: number) {
  const user = await getSessionUser();
  if (!user) {
    throw new Error("로그인이 필요합니다.");
  }

  try {
    // 폴더 내 모든 링크 먼저 삭제
    await db.link.deleteMany({
      where: {
        folderId: folderId,
      },
    });

    // 폴더 삭제
    await db.folder.delete({
      where: {
        id: folderId,
      },
    });

    revalidateTag(getTags(user.id!, APIConstants.API_LINKS));
    revalidateTag(getTags(user.id!, APIConstants.API_FOLDERS));

    return {success: true};
  } catch (error) {
    console.error("Delete Folder Error : ", error);
    return {error: true};
  }
}

export async function emptyFolder(folderId: number) {
  const user = await getSessionUser();
  if (!user) {
    throw new Error("로그인이 필요합니다.");
  }

  try {
    // 폴더 내 모든 링크 삭제
    await db.link.deleteMany({
      where: {
        folderId: folderId,
      },
    });

    revalidateTag(getTags(user.id!, APIConstants.API_LINKS));

    return {success: true};
  } catch (error) {
    console.error("Empty Folder Error : ", error);
    return {error: true};
  }
}

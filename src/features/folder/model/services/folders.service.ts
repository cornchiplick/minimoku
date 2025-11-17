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

export async function getFolder({folderId}: {folderId: number}) {
  try {
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
    title: formData.get("title"),
  };

  // schema 검증
  const result = folderSchema.safeParse(data);
  if (!result.success) {
    return result.error.flatten();
  }

  try {
    await db.folder.create({
      data: {
        name: result.data.title,
        userId: user.id!,
      },
    });

    revalidateTag(getTags(user.id!, APIConstants.API_FOLDERS));
  } catch (error) {
    console.error("Post Folder Error : ", error);
    return {error: true};
  }
}

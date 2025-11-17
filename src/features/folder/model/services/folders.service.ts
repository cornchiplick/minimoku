import db from "@/shared/lib/db";
import {getSessionUser} from "@/shared/lib/utils/authUtils";

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

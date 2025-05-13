import {PrismaClient} from "@prisma/client";

const db = new PrismaClient();

const test = async () => {
  const test = await db.post.findMany({
    select: {
      id: true,
      title: true,
      content: true,
      createdAt: true,
    },
  });
  console.log(test);
};

test();

export default db;

import {PrismaClient} from "@prisma/client";

const db = new PrismaClient();

const test = async () => {
  const test = await db.phrase.findMany({
    select: {
      id: true,
    },
  });
  console.log(test);
};

test();

export default db;

import Typography from "@/components/home/atomic/Typography";
import db from "@/lib/db";

async function getPosts() {
  const posts = await db.post.findMany({
    select: {
      id: true,
      title: true,
      content: true,
      createdAt: true,
    },
  });
  return posts;
}

const AccumulatePage = async () => {
  const posts = await getPosts();
  console.log("post :: ", posts);

  return <Typography.Head1>준비중인 기능입니다.</Typography.Head1>;
};

export default AccumulatePage;

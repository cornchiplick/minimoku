import LanguageCardForm from "@/app/(menu)/accumulate/temp";

// async function getPhrases() {
//   const posts = await db.phrase.findMany({
//     select: {
//       id: true,
//     },
//   });
//   return posts;
// }

const AccumulatePage = async () => {
  // const phrases = await getPhrases();
  // console.log("phrases :: ", phrases);

  return <LanguageCardForm />;
};

export default AccumulatePage;

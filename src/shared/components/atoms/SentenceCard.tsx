import Typography from "@/shared/home/atomic/Typography";
import {Phrase} from "@/shared/types/phrase";
import {Card, CardContent} from "@/shared/ui/card";
import {format} from "date-fns";

interface SentenceCardProps {
  phrase: Phrase;
  showDateTime?: boolean;
}

const SentenceCard = ({phrase, showDateTime = false}: SentenceCardProps) => {
  const essentialPhrase = (
    <CardContent className="flex flex-col gap-1 p-0">
      <Typography.SubTitle1>{phrase.japanese}</Typography.SubTitle1>
      <Typography.P1 className="text-gray-600">{phrase.romaji}</Typography.P1>
      <Typography.P1 className="text-gray-600">{phrase.pronunciation}</Typography.P1>
      <Typography.P1 className="text-gray-700">{phrase.translation}</Typography.P1>
    </CardContent>
  );

  return (
    <Card className="flex flex-col gap-1 p-4 transition-shadow hover:shadow-md">
      {showDateTime ? (
        <div className="flex items-start justify-between">
          {essentialPhrase}
          {phrase.createdAt && (
            <Typography.P3 className="text-gray-500">
              {format(new Date(phrase.createdAt), "yyyy-MM-dd")}
            </Typography.P3>
          )}
        </div>
      ) : (
        essentialPhrase
      )}
    </Card>
  );
};

export default SentenceCard;

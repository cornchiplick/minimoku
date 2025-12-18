"use client";

import {LinkInterface} from "@/entities/link/types";
import useLinkAction from "@/features/link/model/hooks/useLinkAction";
import AlarmButton from "@/shared/components/molecules/buttons/AlarmButton";
import CheckButton from "@/shared/components/molecules/buttons/CheckButton";
import ExternalLinkButton from "@/shared/components/molecules/buttons/ExternalLinkButton";
import FavoriteButton from "@/shared/components/molecules/buttons/FavoriteButton";
import TrashButton from "@/shared/components/molecules/buttons/TrashButton";
import Typography from "@/shared/home/atomic/Typography";
import {format} from "date-fns";
import {ChevronDown, ChevronUp, Copy, FileText} from "lucide-react";
import Image from "next/image";
import {useEffect, useState} from "react";

interface LinkCardProps {
  data: LinkInterface;
  keyword?: string | null;
}

const LinkCard = ({data, keyword}: LinkCardProps) => {
  const {onClickAlarm, onClickFavorite, onClickRead, onDeleteLink, onCopyLink} = useLinkAction();

  // 낙관적 업데이트를 위한 상태
  const [isFavorite, setIsFavorite] = useState<boolean>(data.isFavorite);
  const [isRead, setIsRead] = useState<boolean>(data.isRead);

  // 메모 펼치기
  const [isExpanded, setIsExpanded] = useState(false);

  const handleFavorite = async (id: number) => {
    setIsFavorite((prev) => !prev);

    await onClickFavorite({
      id,
      onError: () => {
        setIsFavorite((prev) => !prev);
      },
    });
  };

  const handleRead = async (id: number) => {
    setIsRead((prev) => !prev);

    await onClickRead({
      id,
      onError: () => {
        setIsRead((prev) => !prev);
      },
    });
  };

  const cloudflareLoader = ({src, width}: {src: string; width: number}) => {
    return `${src}/width=${width},height=${width},fit=cover`;
  };

  useEffect(() => {
    setIsFavorite(data.isFavorite);
  }, [data.isFavorite]);

  useEffect(() => {
    setIsRead(data.isRead);
  }, [data.isRead]);

  return (
    <div className="bg-background-primary hover:bg-background-primary flex w-full flex-col rounded-lg p-3 shadow-md shadow-neutral-800 transition-colors">
      <div className="flex items-start space-x-4">
        {/* Thumbnail */}
        <div className="flex h-20 w-20 flex-shrink-0 items-center justify-center rounded-lg bg-gray-600">
          {data.imageUrl ? (
            <Image
              alt={data.title}
              src={`${data.imageUrl}`}
              width={80}
              height={80}
              loader={cloudflareLoader}
              className="object-cover"
            />
          ) : (
            <span className="text-lg font-bold text-white">日</span>
          )}
        </div>

        {/* Content */}
        <div className="flex-1">
          <div className="flex items-start justify-between">
            <div className="w-full flex-1 space-y-2">
              <h3 className="flex items-center space-x-2">
                <ExternalLinkButton url={data.url} />
                <Typography.P1 className="font-medium" keyword={keyword}>
                  {data.title}
                </Typography.P1>
              </h3>
              <div className="flex flex-row items-center gap-2 pb-1">
                <Typography.P2 className="text-minimoku-neutral-bold max-w-2xl truncate">
                  {data.url}
                </Typography.P2>
                <div
                  className="hover:bg-minimoku flex h-6 w-6 cursor-pointer items-center justify-center rounded-lg text-gray-500 duration-200 hover:text-white"
                  onClick={() => onCopyLink({url: data.url})}>
                  <Copy className="h-4 w-4" />
                </div>
              </div>
              <div className="text-minimoku-neutral-bold flex items-center space-x-4 text-sm">
                <span>개발자료</span>
                <span>{format(new Date(data.createdAt), "yy.MM.dd HH:mm")}</span>
                <div className="flex items-center space-x-2">
                  {data.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-600">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex min-h-fit flex-col items-center justify-between self-stretch">
              <div className="flex h-full min-h-0 flex-1 grow items-start space-x-1">
                {!!data.memo && (
                  <button
                    className="flex h-8 cursor-pointer items-center justify-center gap-1 rounded-md px-2 transition-colors hover:bg-gray-300"
                    onClick={() => setIsExpanded((prev) => !prev)}>
                    <FileText className="h-4 w-4" stroke="#99a1af" fill="none" />
                    {isExpanded ? (
                      <ChevronUp className="h-4 w-4" stroke="#99a1af" fill="none" />
                    ) : (
                      <ChevronDown className="h-4 w-4" stroke="#99a1af" fill="none" />
                    )}
                  </button>
                )}
                <AlarmButton isAlarm={data.isAlarm} onClick={onClickAlarm} />
                <FavoriteButton isFavorite={isFavorite} onClick={() => handleFavorite(data.id)} />
                <CheckButton isChecked={isRead} onClick={() => handleRead(data.id)} />
              </div>
              <div className="mt-auto flex w-full items-center justify-end">
                <TrashButton onClick={() => onDeleteLink({id: data.id})} />
              </div>
            </div>
          </div>

          {/* Expand - memo */}
          <div
            className={`overflow-hidden transition-all duration-300 ${
              isExpanded ? "max-h-96 pt-2" : "max-h-0"
            }`}>
            <div className="border-t border-slate-600 pt-2 pr-4 pb-4">
              <div className="mb-2 flex items-center gap-2 text-sm text-gray-500">
                <FileText className="h-4 w-4" />
                <Typography.SubTitle1 className="text-sm">메모</Typography.SubTitle1>
              </div>

              {!!data.memo && (
                <div className="bg-background-secondary rounded p-3">
                  <Typography.P2 className="break-all whitespace-pre-wrap">
                    {data.memo}
                  </Typography.P2>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LinkCard;

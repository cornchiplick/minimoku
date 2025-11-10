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
import {Copy} from "lucide-react";
import Image from "next/image";

interface LinkCardProps {
  data: LinkInterface;
}

const LinkCard = ({data}: LinkCardProps) => {
  const {onClickAlarm, onClickFavorite, onClickRead, onDeleteLink} = useLinkAction();

  const cloudflareLoader = ({src, width}: {src: string; width: number}) => {
    return `${src}/width=${width},height=${width},fit=cover`;
  };

  return (
    <div className="bg-background-primary hover:bg-background-primary flex w-full flex-col rounded-lg p-3 transition-colors">
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
                <Typography.P1 className="font-medium">{data.title}</Typography.P1>
              </h3>
              <div className="flex flex-row items-center gap-2 pb-1">
                <Typography.P2 className="text-minimoku-neutral-bold max-w-2xl truncate">
                  {data.url}
                </Typography.P2>
                <Copy className="h-4 w-4" stroke="#a0a0a0" />
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
                <AlarmButton isAlarm={data.isAlarm} onClick={onClickAlarm} />
                <FavoriteButton isFavorite={data.isFavorite} onClick={onClickFavorite} />
                <CheckButton isChecked={data.isRead} onClick={onClickRead} />
              </div>
              <div className="mt-auto flex w-full items-center justify-end">
                <TrashButton onClick={() => onDeleteLink({id: data.id})} />
              </div>
            </div>
          </div>

          {/* memo */}
          {/* {data.memo && (
            <div className="mt-4 rounded-lg border border-gray-100 bg-gray-50 p-3">
              <div className="text-sm leading-relaxed text-gray-600">{data.memo}</div>
            </div>
          )} */}
        </div>
      </div>
    </div>
  );
};

export default LinkCard;

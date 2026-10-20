"use client";

import { LinkInterface } from "@/entities/link/types";
import { cn } from "@/shared/lib/utils/commonUtils";
import useLinkAction from "@/features/link/model/hooks/useLinkAction";
import LinkFormModal from "@/features/link/ui/LinkFormModal";
import AlarmButton from "@/shared/components/molecules/buttons/AlarmButton";
import CheckButton from "@/shared/components/molecules/buttons/CheckButton";
import EditButton from "@/shared/components/molecules/buttons/EditButton";
import ExternalLinkButton from "@/shared/components/molecules/buttons/ExternalLinkButton";
import FavoriteButton from "@/shared/components/molecules/buttons/FavoriteButton";
import TrashButton from "@/shared/components/molecules/buttons/TrashButton";
import Typography from "@/shared/home/atomic/Typography";
import { useBoolean } from "@/shared/hooks/useBoolean";
import { format } from "date-fns";
import { ChevronDown, ChevronUp, Copy, FileText, Link } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

interface LinkCardProps {
  data: LinkInterface;
  keyword?: string | null;
}

const LinkCard = ({data, keyword}: LinkCardProps) => {
  const {onClickAlarm, onClickFavorite, onClickRead, onDeleteLink, onCopyLink} = useLinkAction();

  // 낙관적 업데이트를 위한 상태
  const [isFavorite, setIsFavorite] = useState<boolean>(data.isFavorite);
  const [isRead, setIsRead] = useState<boolean>(data.isRead);

  // 서버 데이터가 갱신되면 낙관적 상태를 서버 값으로 맞춘다.
  // effect 에서 setState 하면 한 번 더 렌더링되므로, 렌더 중 조정하는 React 권장 방식을 쓴다.
  // https://react.dev/learn/you-might-not-need-an-effect#adjusting-some-state-when-a-prop-changes
  const [syncedData, setSyncedData] = useState({
    isFavorite: data.isFavorite,
    isRead: data.isRead,
  });
  if (syncedData.isFavorite !== data.isFavorite || syncedData.isRead !== data.isRead) {
    setSyncedData({isFavorite: data.isFavorite, isRead: data.isRead});
    setIsFavorite(data.isFavorite);
    setIsRead(data.isRead);
  }

  // 메모 펼치기
  const [isExpanded, setIsExpanded] = useState(false);

  // 수정 모달 상태
  const isShowEditModal = useBoolean();

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

  // 전체 URL 대신 도메인만 보여준다 — 긴 경로는 줄만 넘치고 식별에 도움이 되지 않는다
  const hostname = (() => {
    try {
      return new URL(data.url).hostname.replace(/^www\./, "");
    } catch {
      return data.url;
    }
  })();

  return (
    <>
      <article className="border-border group border-b py-4 last:border-b-0">
        <div className="flex items-start gap-3">
          {/* 사용자가 올린 이미지가 있을 때만 보여준다. 없을 때 회색 상자를 두지 않는다 */}
          {data.imageUrl && (
            <Image
              alt=""
              src={`${data.imageUrl}`}
              width={44}
              height={44}
              loader={cloudflareLoader}
              className="mt-0.5 h-11 w-11 shrink-0 rounded-md object-cover"
            />
          )}

          <div className="min-w-0 flex-1">
            <h3 className="flex items-start gap-1.5">
              <ExternalLinkButton url={data.url} title={data.title} />
              <Typography.P1
                className={cn(
                  "font-medium",
                  isRead && "text-minimoku-neutral-bold"
                )}
                keyword={keyword}>
                {data.title}
              </Typography.P1>
            </h3>

            {/* 출처와 시점 — 조용하게, 금액 자리처럼 줄을 맞춘다 */}
            <div className="text-minimoku-neutral-bold mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-[0.8125rem]">
              <span className="inline-flex items-center gap-1">
                {hostname}
                <button
                  type="button"
                  aria-label="링크 주소 복사"
                  onClick={() => onCopyLink({url: data.url})}
                  className="hover:text-minimoku focus-visible:ring-minimoku rounded p-0.5 transition-colors focus-visible:ring-2 focus-visible:outline-none">
                  <Copy className="h-3.5 w-3.5" />
                </button>
              </span>
              <span className="tabular-nums">{format(new Date(data.createdAt), "M월 d일")}</span>
              {data.tags.length > 0 && (
                <span className="truncate">{data.tags.map((tag) => `#${tag}`).join(" ")}</span>
              )}
            </div>

            {/* 메모 */}
            {!!data.memo && (
              <>
                <button
                  type="button"
                  onClick={() => setIsExpanded((prev) => !prev)}
                  aria-expanded={isExpanded}
                  className="text-minimoku-neutral-bold hover:text-foreground focus-visible:ring-minimoku mt-2 inline-flex items-center gap-1 rounded text-xs transition-colors focus-visible:ring-2 focus-visible:outline-none">
                  <FileText className="h-3.5 w-3.5" />
                  메모
                  {isExpanded ? (
                    <ChevronUp className="h-3.5 w-3.5" />
                  ) : (
                    <ChevronDown className="h-3.5 w-3.5" />
                  )}
                </button>
                {isExpanded && (
                  <p className="text-foreground border-border mt-2 border-l-2 pl-3 text-[0.8125rem] whitespace-pre-wrap">
                    {data.memo}
                  </p>
                )}
              </>
            )}
          </div>

          {/* 동작 — 한 줄로 모으고, 켜진 상태일 때만 색을 쓴다 */}
          <div className="flex shrink-0 items-center gap-0.5">
            <AlarmButton isAlarm={data.isAlarm} onClick={onClickAlarm} />
            <FavoriteButton isFavorite={isFavorite} onClick={() => handleFavorite(data.id)} />
            <CheckButton isChecked={isRead} onClick={() => handleRead(data.id)} />
            <EditButton onClick={isShowEditModal.onTrue} />
            <TrashButton onClick={() => onDeleteLink({id: data.id})} />
          </div>
        </div>
      </article>
    <LinkFormModal isEdit modalState={isShowEditModal} originValue={data} />
    </>
  );
};

export default LinkCard;

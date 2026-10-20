import {Button} from "@/shared/components/atoms/button";
import Link from "next/link";

/**
 * 존재하지 않는 경로, 또는 notFound() 호출 시 보여주는 화면.
 * (예: 소유자가 아닌 폴더에 접근한 경우 — 존재 여부를 노출하지 않기 위해 404 로 처리한다)
 */
const NotFound = () => (
  <div className="bg-background-primary text-foreground flex min-h-screen flex-col items-center justify-center gap-4 p-6 text-center">
    <p className="text-minimoku-neutral-bold text-6xl font-light tracking-tight">404</p>
    <p className="text-lg font-medium">요청하신 페이지를 찾을 수 없습니다.</p>
    <p className="text-minimoku-neutral-bold text-sm">
      주소가 바뀌었거나, 접근 권한이 없는 페이지일 수 있습니다.
    </p>
    <Button asChild variant="default">
      <Link href="/">홈으로 돌아가기</Link>
    </Button>
  </div>
);

export default NotFound;

# minimoku

개인용 멀티 서비스 웹앱 — https://www.minimoku.net

| 서비스 | 경로 | 설명 |
|---|---|---|
| LinkLocker | `/link` | 브라우저 북마크를 대체하는 링크 관리. 이미지 미리보기, 읽음·즐겨찾기·알림 표시, 폴더·태그·검색 |
| PigMoney | `/pigmoney` | 가계부. 수입/지출 기록, 카테고리, 달력, 월별 보고서 |
| 텔레그램 Todo 봇 | `/api/telegram/webhook` | 텔레그램 명령으로 Todo 등록, 매일 지정 시각에 알림 |
| jpStudy | `/japanese` | 일본어 회화 암기노트 (초기 서비스, 현재 비활성) |

Next.js 15 · React 19 · Prisma 6 (Supabase) · NextAuth 4 · Tailwind 4 / shadcn/ui · AWS Amplify + Lambda

개발 가이드는 [`.claude/CLAUDE.md`](.claude/CLAUDE.md), PigMoney 기획·구현 문서는 [`docs/pigmoney/`](docs/pigmoney/) 참고.

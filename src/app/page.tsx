import GuestStartButton from "@/widgets/home/GuestStartButton";
import ThemeToggleButton from "@/widgets/sidebar/ThemeToggleButton";
import {Link as LinkIcon, PiggyBank} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const REPO_URL = "https://github.com/cornchiplick/minimoku";

const SERVICES = [
  {
    name: "LinkLocker",
    href: "/link",
    icon: LinkIcon,
    accent: "text-minimoku",
    summary: "나중에 읽을 링크를 폴더로 모아 둔다.",
    points: [
      "폴더·태그로 분류하고 제목으로 검색한다",
      "읽음·즐겨찾기를 표시해 읽을 것만 남긴다",
      "링크마다 메모를 붙여 왜 저장했는지 남긴다",
    ],
    screen: "/screens/linklocker.jpg",
    screenAlt: "LinkLocker 화면 — 폴더별로 분류된 링크 목록",
  },
  {
    name: "PigMoney",
    href: "/pigmoney",
    icon: PiggyBank,
    accent: "text-pigmoney-brand",
    summary: "수입과 지출을 날짜별 장부로 적는다.",
    points: [
      "날짜별로 묶어 하루 소계와 함께 본다",
      "카테고리별로 어디에 얼마나 썼는지 줄 세워 본다",
      "월 시작일과 주 시작 요일을 쓰는 방식에 맞춘다",
    ],
    screen: "/screens/pigmoney.jpg",
    screenAlt: "PigMoney 보고서 화면 — 일별 지출 추이와 카테고리별 순위",
  },
];

const DECISIONS = [
  {
    title: "조회도 서버 액션에서 직접",
    body: "데이터 조회용 API 경로를 두지 않고 서버 액션이 Prisma 로 바로 읽는다. 사용자 식별자를 세션에서만 얻으므로, 외부 입력으로 조회 범위를 정할 수 있는 경로가 애초에 생기지 않는다.",
  },
  {
    title: "색은 팔레트에서 한 번만",
    body: "라이트·다크 값을 팔레트에 한 벌로 두고 토큰 이름은 매핑만 한다. 색을 바꿀 때 고칠 곳이 한 군데이고, 두 모드가 따로 놀지 않는다.",
  },
  {
    title: "배포 키를 두지 않는 자동 배포",
    body: "주기 실행용 Lambda 는 GitHub Actions 가 OIDC 로 역할을 빌려 배포한다. 저장소에 AWS 키를 보관하지 않고, 스키마가 바뀌면 재배포가 필요한 함수를 자동으로 가려낸다.",
  },
  {
    title: "체험 계정은 매일 되돌린다",
    body: "로그인 없이 들어온 방문자는 하나의 계정을 공유한다. 매일 새벽 4시에 지우고 같은 샘플로 다시 채워, 빈 화면 대신 쓰이는 모습을 보게 한다.",
  },
];

const STACK = [
  "Next.js 16",
  "React 19",
  "TypeScript 6",
  "Tailwind CSS 4",
  "Prisma 6",
  "NextAuth 4",
  "Zustand 5",
  "Zod 4",
  "PostgreSQL",
  "AWS Amplify",
  "AWS Lambda",
];

const RootHome = () => (
  <div className="bg-background-primary text-foreground min-h-screen">
    <div className="mx-auto w-full max-w-4xl px-5 md:px-8">
      {/* 머리 */}
      <header className="flex items-center justify-between py-5">
        <span className="text-sm font-semibold tracking-tight">MiniMoku</span>
        <div className="flex items-center gap-1">
          <Link
            href={REPO_URL}
            target="_blank"
            rel="noreferrer"
            className="text-minimoku-neutral-bold hover:text-foreground focus-visible:ring-minimoku rounded-md px-2 py-1.5 text-sm transition-colors focus-visible:ring-2 focus-visible:outline-none">
            GitHub
          </Link>
          <ThemeToggleButton />
        </div>
      </header>

      <main>
        {/* 히어로 — 이 페이지에서 유일하게 등장 동작을 쓴다 */}
        <section className="animate-fade-in-up border-border border-b py-16 md:py-24">
          <h1 className="text-hero md:text-display font-bold">
            쓰면서 만드는
            <br />
            개인용 웹앱
          </h1>
          <p className="text-minimoku-neutral-bold mt-6 max-w-xl text-base leading-relaxed md:text-lg">
            필요한 기능이 생길 때마다 하나씩 만들어 붙였습니다. 지금은 링크를 모아 두는 LinkLocker
            와 가계부 PigMoney 가 들어 있고, 매일 쓰고 있습니다.
          </p>
          <div className="mt-9 flex flex-wrap items-center gap-2.5">
            <GuestStartButton href="/link">로그인 없이 둘러보기</GuestStartButton>
            <Link
              href={REPO_URL}
              target="_blank"
              rel="noreferrer"
              className="border-border text-foreground hover:bg-background-secondary focus-visible:ring-minimoku inline-flex items-center rounded-full border px-5 py-2.5 text-sm font-medium transition-colors focus-visible:ring-2 focus-visible:outline-none">
              코드 보기
            </Link>
          </div>
        </section>

        {/* 서비스 */}
        {SERVICES.map((service) => (
          <section key={service.name} className="border-border border-b py-16 md:py-20">
            <div className="flex items-center gap-2">
              <service.icon className={`h-5 w-5 ${service.accent}`} />
              <h2 className="text-title font-bold">{service.name}</h2>
            </div>
            <p className="text-foreground mt-3 text-base md:text-lg">{service.summary}</p>

            <ul className="text-minimoku-neutral-bold mt-6 flex flex-col gap-2 text-[0.9375rem]">
              {service.points.map((point) => (
                <li key={point} className="border-border border-l pl-4">
                  {point}
                </li>
              ))}
            </ul>

            <Image
              src={service.screen}
              alt={service.screenAlt}
              width={1280}
              height={800}
              sizes="(max-width: 768px) 100vw, 768px"
              className="border-border shadow-float rounded-card mt-8 w-full border"
            />

            <div className="mt-6">
              <GuestStartButton href={service.href} variant="quiet">
                {service.name} 열어 보기
              </GuestStartButton>
            </div>
          </section>
        ))}

        {/* 만든 방식 */}
        <section className="border-border border-b py-16 md:py-20">
          <h2 className="text-title font-bold">만든 방식</h2>
          <p className="text-minimoku-neutral-bold mt-3 max-w-xl text-[0.9375rem]">
            기능보다 오래 남는 건 결정입니다. 이 프로젝트에서 내린 것 중 네 가지를 적어 둡니다.
          </p>

          <dl className="mt-8 grid gap-x-10 gap-y-8 md:grid-cols-2">
            {DECISIONS.map((decision) => (
              <div key={decision.title}>
                <dt className="text-foreground text-[0.9375rem] font-semibold">{decision.title}</dt>
                <dd className="text-minimoku-neutral-bold mt-2 text-[0.9375rem] leading-relaxed">
                  {decision.body}
                </dd>
              </div>
            ))}
          </dl>
        </section>
      </main>

      {/* 꼬리 */}
      <footer className="py-12">
        <ul className="text-minimoku-neutral-bold flex flex-wrap gap-x-4 gap-y-2 text-[0.8125rem]">
          {STACK.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
        <div className="text-minimoku-neutral-bold mt-8 flex flex-wrap items-center gap-x-4 text-[0.8125rem]">
          <Link
            href={REPO_URL}
            target="_blank"
            rel="noreferrer"
            className="hover:text-foreground transition-colors">
            github.com/cornchiplick/minimoku
          </Link>
          <span>Kim Mingu</span>
        </div>
      </footer>
    </div>
  </div>
);

export default RootHome;

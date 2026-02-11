# PigMoney 구현 상세

## FSD 구조

```
src/
├── app/
│   ├── (api)/api/
│   │   ├── cash-records/route.ts          # GET - 거래 조회
│   │   └── categories/route.ts            # GET - 카테고리 조회
│   └── (pigmoney)/pigmoney/
│       ├── layout.tsx                      # 레이아웃 (사이드바 포함)
│       ├── page.tsx                        # 메인 쓰기 페이지 (서버 컴포넌트)
│       ├── report/page.tsx                 # 보고서 페이지 (서버 컴포넌트)
│       ├── calendar/page.tsx               # 달력 페이지 (서버 컴포넌트)
│       └── settings/page.tsx               # 설정 페이지 (서버 컴포넌트)
│
├── entities/pigmoney/
│   └── types.ts                            # 도메인 타입 정의
│
├── features/pigmoney/
│   ├── model/
│   │   ├── hooks/
│   │   │   ├── useCashRecordAction.ts      # 거래 삭제 + invalidateSummary
│   │   │   ├── useCashRecordFilter.ts      # 필터링 + 통계 계산 훅
│   │   │   └── useSidebarSummary.ts        # 사이드바 요약 조회/갱신 훅
│   │   ├── schema/
│   │   │   ├── cashRecordSchema.ts         # 단일 거래 Zod 스키마
│   │   │   ├── cashRecordBatchSchema.ts    # 다중 거래 배치 스키마
│   │   │   └── categorySchema.ts           # 카테고리 Zod 스키마
│   │   ├── services/
│   │   │   ├── cashRecords.service.ts      # 거래 CRUD + 요약 서버 액션
│   │   │   ├── categories.service.ts       # 카테고리 서버 액션
│   │   │   └── settings.service.ts         # 설정 서버 액션
│   │   ├── store/
│   │   │   └── cashRecordStore.ts          # Zustand 스토어 (거래 + 설정 + 요약)
│   │   └── utils/
│   │       └── cashRecordStats.ts          # 통계 계산 순수 함수
│   └── ui/
│       ├── CashRecordAddButton.tsx         # 거래 추가 버튼
│       ├── CashRecordRow.tsx               # 모달 내 입력 행
│       ├── CashRecordFormModal.tsx          # 거래 작성 모달 + invalidateSummary
│       ├── CashRecordEditModal.tsx          # 거래 수정 모달 + invalidateSummary
│       ├── CategoryManageModal.tsx          # 카테고리 관리 모달
│       ├── ReportMonthSelector.tsx          # 보고서 월 선택기
│       ├── ReportSummaryCards.tsx           # 보고서 요약 카드 3칸
│       ├── ReportCategoryChart.tsx          # 보고서 도넛 차트 (recharts)
│       ├── ReportCategoryList.tsx           # 보고서 카테고리별 상세 테이블
│       └── CalendarView.tsx                # 달력 뷰 (DayPicker v9 커스텀)
│
├── widgets/pigmoney/
│   ├── PigMoneySidebar.tsx                 # 사이드바 (네비 + 요약 + 관리)
│   ├── PigMoneyMain.tsx                    # 메인 쓰기 위젯
│   ├── PigMoneyReport.tsx                  # 보고서 위젯
│   ├── PigMoneyCalendar.tsx                # 달력 위젯
│   └── PigMoneySettings.tsx                # 설정 폼 위젯
│
└── shared/
    ├── constants/
    │   └── pigmoney.ts                     # 기본값, 요일 라벨, 네비 메뉴
    └── lib/utils/
        └── dateUtils.ts                    # 날짜 유틸 (커스텀 월/주 범위)
```

## 핵심 아키텍처 패턴

### 서버/클라이언트 분리

| 계층 | 역할 | 예시 |
|------|------|------|
| `page.tsx` (서버) | 초기 데이터 fetch + 클라이언트 위젯에 props 전달 | getSettings(), getCashRecords() |
| `widget` (클라이언트) | 상태 관리 + 사용자 인터랙션 | useState로 월 이동, 스토어 연동 |
| `service` (서버 액션) | DB 접근 + 인증 확인 | Prisma 쿼리, getSessionUser() |

### 스토어 구조 (Zustand)

```typescript
interface CashRecordStore {
  // 거래 + 카테고리 + 필터 (Phase 1)
  records, setRecords, removeRecord
  categories, setCategories
  dateRange, setDateRange, showAll, setShowAll

  // 설정 (Phase 2)
  settings, setSettings

  // 사이드바 요약 (Phase 2)
  monthSummary, setMonthSummary
  weekSummary, setWeekSummary
  summaryVersion, invalidateSummary
}
```

### 요약 갱신 패턴 (summaryVersion)

```
CRUD 성공 → invalidateSummary() → summaryVersion++
  → useSidebarSummary의 useEffect 의존성 변경
  → getCashRecordSummary() 재호출
  → 스토어 업데이트 → UI 갱신
```

### 보고서/달력 독립 상태

보고서와 달력은 메인 스토어와 **독립된 `useState`** 로 records를 관리.
- 월 이동 시 `getCashRecords()` 재호출
- 메인 쓰기 페이지의 필터 상태에 영향 없음

---

## 주요 서버 액션

### cashRecords.service.ts

| 함수 | 역할 |
|------|------|
| `getCashRecords()` | 거래 목록 조회 (fromDate/toDate 파라미터) |
| `postCashRecords(formData)` | 다중 거래 일괄 생성 |
| `updateCashRecord(formData)` | 단일 거래 수정 |
| `deleteCashRecord({ recordId })` | 거래 삭제 |
| `getCashRecordSummary({ fromDate, toDate })` | 기간별 수입/지출 합계 (Prisma aggregate) |

### settings.service.ts

| 함수 | 역할 |
|------|------|
| `getSettings()` | 조회 (없으면 기본값으로 생성 후 반환) |
| `updateSettings(formData)` | 수정 (upsert) |

### categories.service.ts

| 함수 | 역할 |
|------|------|
| `getCategories()` | 목록 조회 |
| `seedDefaultCategories()` | 기본 카테고리 자동 생성 |
| `createCategory(formData)` | 추가 |
| `updateCategory(formData)` | 수정 |
| `deleteCategory({ categoryId })` | 삭제 (거래 연결 확인) |

---

## 날짜 유틸 함수

### dateUtils.ts

| 함수 | 역할 |
|------|------|
| `formatDate(date)` | "YYYY.MM.DD" 포맷 |
| `getDateRange(days)` | N일 전 ~ 오늘 범위 |
| `normalizeDate(date)` | 시간 00:00:00 정규화 |
| `toDateString(date)` | ISO 날짜 문자열 |
| `getCustomMonthRange(monthStartDay)` | 설정 기반 이번 "달" 범위 |
| `getCustomWeekRange(weekStartDay)` | 설정 기반 이번 "주" 범위 |
| `getCustomMonthRangeFor(date, monthStartDay)` | 특정 날짜의 "월" 범위 (보고서/달력용) |

### 커스텀 월 범위 로직

```typescript
// date.getDate() >= monthStartDay → from: 이번달 시작일, to: 다음달 시작일-1
// date.getDate() <  monthStartDay → from: 저번달 시작일, to: 이번달 시작일-1
```

### 커스텀 주 범위 로직

```typescript
// diff = (currentDay - weekStartDay + 7) % 7
// from = today - diff, to = from + 6
```

---

## 통계 유틸 함수

### cashRecordStats.ts

```typescript
computeCashRecordStats(records) → {
  incomeRecords,     // 수입 거래 배열
  expenseRecords,    // 지출 거래 배열
  totalIncome,       // 수입 합계
  totalExpense,      // 지출 합계
  balance,           // 잔액
  categoryBreakdown  // 카테고리별 합산 (CategoryBreakdown[])
}
```

보고서 위젯에서 사용. useCashRecordFilter에서도 동일 로직 사용 가능.

---

## 사용 라이브러리

| 라이브러리 | 버전 | 용도 |
|-----------|------|------|
| recharts | latest | 보고서 도넛 차트 (PieChart, Cell, Tooltip) |
| react-day-picker | 9.13.1 | 달력 뷰 (DayButton 오버라이드, weekStartsOn) |
| react-hook-form | - | 거래/설정 폼 관리 |
| zod | - | 폼 유효성 검증 |
| zustand | 5 | 전역 상태 관리 |
| sonner | - | 토스트 알림 |

---

## 재사용 공통 컴포넌트

| 컴포넌트 | 사용처 |
|----------|--------|
| `Card` (shadcn/ui) | 보고서 요약 카드, 도넛 차트, 카테고리 상세 |
| `Select` (shadcn/ui) | 설정 폼 (월 시작일, 주 시작 요일) |
| `Dialog` (shadcn/ui) | 거래 작성/수정 모달, 카테고리 관리 |
| `DatePicker` (커스텀) | 거래 날짜 선택, 메인 필터 |
| `Switch` (shadcn/ui) | 수입/지출 토글, 전체 조회 토글 |
| `Button`, `Tabs` (shadcn/ui) | 전반적인 UI |

---

## Phase 2 구현 시 수정된 파일 목록

### 수정 파일 (14개)

| 파일 | 변경 내용 |
|------|----------|
| `prisma/schema.prisma` | PigMoneySettings 모델 + User 관계 추가 |
| `src/entities/pigmoney/types.ts` | PigMoneySettingsInterface, SummaryData 추가 |
| `src/shared/constants/pigmoney.ts` | 설정 기본값/요일 라벨 추가, MOCK 삭제, 네비에 설정 추가 |
| `src/shared/lib/utils/dateUtils.ts` | getCustomMonthRange, getCustomWeekRange, getCustomMonthRangeFor |
| `src/features/pigmoney/model/services/cashRecords.service.ts` | getCashRecordSummary 추가 |
| `src/features/pigmoney/model/store/cashRecordStore.ts` | settings + summary 상태/액션 추가 |
| `src/features/pigmoney/model/hooks/useCashRecordAction.ts` | invalidateSummary() 호출 추가 |
| `src/features/pigmoney/ui/CashRecordFormModal.tsx` | invalidateSummary() 호출 추가 |
| `src/features/pigmoney/ui/CashRecordEditModal.tsx` | invalidateSummary() 호출 추가 |
| `src/widgets/pigmoney/PigMoneySidebar.tsx` | MOCK → 실데이터, 설정 버튼 → 네비, useSidebarSummary |
| `src/widgets/pigmoney/PigMoneyMain.tsx` | initialSettings prop 추가, setSettings 호출 |
| `src/app/(pigmoney)/pigmoney/page.tsx` | getSettings() + initialSettings 전달 |
| `src/app/(pigmoney)/pigmoney/report/page.tsx` | placeholder → 서버 컴포넌트 |
| `src/app/(pigmoney)/pigmoney/calendar/page.tsx` | placeholder → 서버 컴포넌트 |

### 신규 파일 (12개)

| 파일 | 역할 |
|------|------|
| `src/features/pigmoney/model/services/settings.service.ts` | 설정 CRUD 서버 액션 |
| `src/features/pigmoney/model/hooks/useSidebarSummary.ts` | 사이드바 요약 조회/갱신 훅 |
| `src/features/pigmoney/model/utils/cashRecordStats.ts` | 통계 계산 순수 함수 |
| `src/app/(pigmoney)/pigmoney/settings/page.tsx` | 설정 페이지 서버 컴포넌트 |
| `src/widgets/pigmoney/PigMoneySettings.tsx` | 설정 폼 위젯 |
| `src/widgets/pigmoney/PigMoneyReport.tsx` | 보고서 메인 위젯 |
| `src/widgets/pigmoney/PigMoneyCalendar.tsx` | 달력 메인 위젯 |
| `src/features/pigmoney/ui/ReportMonthSelector.tsx` | 보고서 월 선택기 |
| `src/features/pigmoney/ui/ReportSummaryCards.tsx` | 보고서 요약 카드 3칸 |
| `src/features/pigmoney/ui/ReportCategoryChart.tsx` | 보고서 도넛 차트 |
| `src/features/pigmoney/ui/ReportCategoryList.tsx` | 보고서 카테고리별 상세 테이블 |
| `src/features/pigmoney/ui/CalendarView.tsx` | 달력 뷰 (DayPicker v9 커스텀) |

### 추가 패키지

```bash
npm install recharts
npx prisma db push  # PigMoneySettings 테이블 생성
```

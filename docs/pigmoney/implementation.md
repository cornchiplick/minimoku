# PigMoney 구현 계획

## FSD 구조

```
src/
├── app/
│   ├── (api)/api/
│   │   ├── cash-records/route.ts       # GET - 거래 조회
│   │   └── categories/route.ts         # GET - 카테고리 조회
│   └── (pigmoney)/pigmoney/
│       ├── layout.tsx                   # 레이아웃 (헤더 포함)
│       └── page.tsx                     # 메인 페이지 (서버 컴포넌트)
│
├── entities/pigmoney/
│   └── types.ts                         # CashRecordType, CashRecordInterface, CategoryInterface
│
├── features/pigmoney/
│   ├── model/
│   │   ├── hooks/
│   │   │   ├── useCashRecordAction.ts   # CRUD 액션 훅
│   │   │   └── useCashRecordFilter.ts   # 필터링 + 통계 계산 훅
│   │   ├── schema/
│   │   │   ├── cashRecordSchema.ts      # 단일 거래 Zod 스키마
│   │   │   ├── cashRecordBatchSchema.ts # 다중 거래 배치 스키마
│   │   │   └── categorySchema.ts        # 카테고리 Zod 스키마
│   │   ├── services/
│   │   │   ├── cashRecords.service.ts   # 거래 서버 액션
│   │   │   └── categories.service.ts    # 카테고리 서버 액션
│   │   └── store/
│   │       └── cashRecordStore.ts       # Zustand 스토어
│   └── ui/
│       ├── CashRecordAddButton.tsx      # 거래 추가 버튼
│       ├── CashRecordRow.tsx            # 모달 내 입력 행
│       ├── CashRecordFormModal.tsx      # 거래 작성 모달
│       ├── CashRecordEditModal.tsx      # 거래 수정 모달
│       ├── CashRecordCard.tsx           # 조회용 거래 카드
│       ├── CashRecordList.tsx           # 거래 목록 (수입 or 지출)
│       ├── CashRecordFilter.tsx         # 검색/필터 영역
│       ├── CashRecordSummary.tsx        # 통계 요약
│       └── CategoryManageModal.tsx      # 카테고리 관리 모달
│
├── widgets/pigmoney/
│   ├── PigMoneyHeader.tsx               # 헤더 위젯
│   └── PigMoneyMain.tsx                 # 메인 위젯
│
└── shared/
    ├── components/atoms/
    │   └── date-picker.tsx              # DatePicker (Calendar + Popover)
    ├── constants/
    │   └── pigmoney.ts                  # 기본 카테고리, 날짜 구간 상수
    └── lib/utils/
        └── dateUtils.ts                 # 날짜 유틸리티
```

## 구현 순서

1. **데이터베이스**: Prisma 스키마에 CashRecord, Category 모델 추가 → 마이그레이션
2. **타입/상수**: entities 타입, 상수, 날짜 유틸리티 정의
3. **서버 로직**: Zod 스키마, 서버 액션, API 라우트 구현
4. **상태 관리**: Zustand 스토어, 커스텀 훅 구현
5. **공유 컴포넌트**: shadcn/ui 설치, DatePicker 구현
6. **Feature UI**: 모든 UI 컴포넌트 구현
7. **Widgets**: 헤더, 메인 위젯 구현
8. **페이지/라우트**: layout, page 구현
9. **미들웨어**: /pigmoney 보호 라우트 추가
10. **메뉴**: 메뉴 상수에 PigMoney 추가

## 재사용할 기존 컴포넌트

- `shared/components/atoms/`: button, card, dialog, input, label, select, tabs
- `shared/components/molecules/`: FormInput, FormSelect, FormButton, Divider
- `shared/hooks/useBoolean`: 모달 상태 관리
- `shared/providers/DialogProvider`: 확인 다이얼로그
- `shared/lib/utils/commonUtils`: cn(), getTags()
- `shared/lib/utils/authUtils`: getSessionUser()
- `shared/lib/db`: Prisma Client 싱글턴

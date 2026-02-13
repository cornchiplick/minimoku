# PigMoney 데이터 모델

## ERD 관계

```
User (1) ─── (N) CashRecord
User (1) ─── (N) Category
User (1) ─── (1) PigMoneySettings
Category (1) ─── (N) CashRecord
```

## Enum

### CashRecordType

| 값 | 설명 |
|------|------|
| INCOME | 수입 |
| EXPENSE | 지출 |

## 모델

### CashRecord

| 필드 | 타입 | 필수 | 기본값 | 설명 |
|------|------|------|--------|------|
| id | Int | O | autoincrement | PK |
| type | CashRecordType | O | - | 수입 / 지출 |
| date | DateTime | O | - | 거래 날짜 |
| description | String | O | - | 거래 내용 |
| amount | Int | O | - | 금액 (원 단위, 양의 정수) |
| note | String? | X | null | 비고 |
| createdAt | DateTime | O | now() | 생성일 |
| updatedAt | DateTime | O | @updatedAt | 수정일 |
| userId | Int | O | - | FK → User.id (CASCADE DELETE) |
| categoryId | Int | O | - | FK → Category.id |

**인덱스**:
- `[userId, date]` - 사용자별 날짜 조회 최적화
- `[userId, type]` - 사용자별 수입/지출 필터 최적화

### Category

| 필드 | 타입 | 필수 | 기본값 | 설명 |
|------|------|------|--------|------|
| id | Int | O | autoincrement | PK |
| name | String | O | - | 카테고리명 |
| createdAt | DateTime | O | now() | 생성일 |
| updatedAt | DateTime | O | @updatedAt | 수정일 |
| userId | Int | O | - | FK → User.id (CASCADE DELETE) |

**유니크 제약**: `[name, userId]` - 같은 사용자 내 카테고리명 중복 불가

### PigMoneySettings

| 필드 | 타입 | 필수 | 기본값 | 설명 |
|------|------|------|--------|------|
| id | Int | O | autoincrement | PK |
| monthStartDay | Int | O | 1 | 월 시작일 (1~28) |
| weekStartDay | Int | O | 0 | 주 시작 요일 (0=일, 1=월, ..., 6=토) |
| createdAt | DateTime | O | now() | 생성일 |
| updatedAt | DateTime | O | @updatedAt | 수정일 |
| userId | Int | O | - | FK → User.id (CASCADE DELETE, UNIQUE) |

**유니크 제약**: `userId` - 사용자당 설정 1개

### User (기존 모델에 관계 추가)

기존 필드에 다음 관계 추가:
- `cashRecords CashRecord[]`
- `categories Category[]`
- `pigMoneySettings PigMoneySettings?`

## 기본 카테고리

사용자 첫 접속 시 자동 생성:
- 식비
- 간식
- 구독

## 설정 기본값

사용자가 설정을 저장하지 않은 경우, 첫 조회 시 자동 생성:
- `monthStartDay`: 1 (매월 1일)
- `weekStartDay`: 0 (일요일)

## 커스텀 날짜 범위 계산

### 이달의 가계 (monthStartDay 반영)

- `monthStartDay=1`: 2/1 ~ 2/28 (일반적인 달력 달)
- `monthStartDay=25`: 1/25 ~ 2/24 (전월 25일부터 당월 24일까지)

### 이주의 가계 (weekStartDay 반영)

- `weekStartDay=0` (일): 일~토
- `weekStartDay=5` (금): 금~목

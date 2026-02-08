---
name: commit-guide
description: 기능 구현 후 논리적이고 원자적인 커밋 단위로 분리하여 커밋 메시지를 작성하는 가이드. 사용자가 변경사항에 대해 커밋 메시지 작성을 요청하거나 어떻게 커밋해야 할지 물을 때 사용합니다.
disable-model-invocation: false
---

# Commit Guide Skill

사용자가 구현한 기능에 대해 논리적이고 원자적인 커밋 단위로 분리하여 커밋 메시지를 작성하는 스킬입니다.

## 원칙

### 1. 원자적 커밋 (Atomic Commits)

- 각 커밋은 독립적으로 완전히 동작해야 함
- 어느 커밋 시점으로 `git reset`을 해도 코드 실행에 오류가 없어야 함
- 하나의 논리적 변경 단위만 포함

### 2. 기능별 분리

- 계획 모드에서 세운 구현 순서를 기반으로 커밋 분리
- 데이터베이스 → 타입 → API → 서비스 → UI 순서로 커밋
- 의존성 설치는 별도 커밋으로 분리

### 3. 의미 있는 커밋 메시지

- Conventional Commits 형식 사용
- `Feat:`, `Fix:`, `Chore:`, `Refactor:` 등의 prefix 사용 (대문자로 시작)
- 간결하지만 변경 내용을 명확히 설명

## 커밋 메시지 형식

```
<type>: <subject>

<body>
```

### Type

- `Feat`: 새로운 기능 추가
- `Fix`: 버그 수정
- `Chore`: 빌드, 설정, 의존성 등
- `Refactor`: 코드 리팩토링
- `Docs`: 문서 수정
- `Style`: 코드 포맷팅
- `Test`: 테스트 코드

**중요:** Type은 반드시 대문자로 시작해야 합니다 (예: `Feat:`, `Chore:`)

### Subject

- 50자 이내로 요약
- 명령형 동사 사용 (한글은 "~추가", "~수정" 형태)
- 마침표 없이 작성

### Body

- 변경 사항을 불릿 포인트로 설명
- 왜(Why)보다는 무엇(What)을 변경했는지 설명
- 기술적 세부사항 포함
- **중요:** 마지막 줄 이후 빈 문자열이나 추가 줄바꿈이 없어야 함

## 작업 흐름

### 1. 변경사항 확인

먼저 `git status`를 통해 변경된 파일을 확인합니다.

```bash
git status
# 또는 간단한 형식
git status --short
```

### 2. 커밋 전략 수립

- 의존성 관계 파악 (타입 → 로직 → UI 순서)
- 원자적 단위로 분리 (각 커밋이 독립적으로 동작)
- 논리적 그룹핑 (연관된 변경사항들을 함께 커밋)

### 3. 각 커밋별 파일 목록과 메시지 제공

사용자가 직접 커밋할 수 있도록 파일 목록과 커밋 메시지를 제공합니다.

## 출력 형식

```markdown
## 커밋 1: <커밋 제목>

**파일:**
- path/to/file1.ts
- path/to/file2.tsx

**커밋 메시지:**
\`\`\`
<type>: <subject>

<body>

\`\`\`

---

## 커밋 2: ...
```

## 주의사항

### 변경된 파일 확인

- 먼저 실제 변경된 파일을 `git status --short` 또는 `git diff --name-only`로 확인
- 계획에 없던 파일도 포함되었는지 확인하고 의도적으로 포함 여부 결정

### 커밋하지 않을 파일

- `.claude/settings.local.json` - Claude 로컬 설정
- 임시 파일, 테스트 파일
- 사용자에게 명시적으로 알려줄 것

### 커밋 순서 검증

- 각 커밋 시점에서 코드가 정상 동작하는지 검증
- 의존성 문제가 없는지 확인
- 타입 오류가 없는지 확인

### 사용자 주도

- 파일 목록과 커밋 메시지만 제공
- 실제 커밋은 사용자가 직접 수행
- "내가 직접 커밋할게"라는 사용자 의도 존중

## 예시

### 사용자 요청

> "현재 변경사항에 대한 커밋메세지를 작성해줘. 어느 커밋 시점으로 git reset을 해도 코드 실행에 오류가 없어야 하고, 가급적이면 계획모드에서 세운 계획대로 적절히 나누어서 커밋을 하고 싶어. 내가 커밋을 직접할 테니 파일목록과 커밋메세지만 알려줘"

### 응답 예시

```markdown
## 커밋 1: 데이터베이스 스키마에 sortOrder 필드 추가

**파일:**
- prisma/schema.prisma
- prisma/migrations/20260208063928_add_folder_sort_order/

**커밋 메시지:**
\`\`\`
Feat: Folder 모델에 sortOrder 필드 추가

- Prisma 스키마에 sortOrder 필드 추가 (default: 0)
- Link-Folder relation에 onDelete: Cascade 추가
- 마이그레이션 파일에 기존 폴더 순서 초기화 SQL 포함
  (createdAt 기준 오름차순으로 sortOrder 자동 할당)
\`\`\`

---

## 커밋 2: 타입 정의 및 API 라우트 업데이트

**파일:**
- src/entities/folder/types.ts
- src/app/(api)/api/folders/route.ts

**커밋 메시지:**
\`\`\`
Feat: FolderInterface에 sortOrder 추가 및 API 정렬 적용

- FolderInterface 타입에 sortOrder 필드 추가
- GET /api/folders 엔드포인트에서 sortOrder로 정렬
- select 절에 sortOrder 필드 포함
\`\`\`
```

## 참고사항

- 커밋 메시지는 한글로 작성
- 기술 용어는 원어 그대로 사용 (sortOrder, API, Prisma 등)
- Type은 대문자로 시작 (Feat, Fix, Chore 등)
- 마지막 줄 이후 빈 줄이나 추가 공백 없이 작성
- 각 커밋의 논리적 독립성을 최우선으로 고려

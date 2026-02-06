# 링크 수정 기능 코드 리뷰

> 작성일: 2026-02-05
> 대상: `feat/edit-link` 브랜치 - 링크 수정 기능 구현

---

## ✅ 수정 완료

### 1. ~~보안 취약점 - 폴더 소유권 검증 누락~~

**파일**: `links.service.ts`, `folders.service.ts`

**문제점**:
- `postLink`, `updateLink`, `updateFolder`에서 폴더가 현재 사용자 소유인지 검증하지 않음
- 다른 사용자의 폴더 ID로 링크를 이동시킬 수 있는 취약점

**해결**:
- `getFolder` 함수에 `userId` 파라미터 추가
- 모든 폴더 관련 작업에서 소유권 검증 적용

```typescript
// folders.service.ts
export async function getFolder({folderId, userId}: {folderId: number; userId?: number}) {
  const result = await db.folder.findFirst({
    where: {
      id: folderId,
      ...(userId && {userId}),
    },
  });
}
```

---

### 2. ~~에러 반환 타입 불일치~~

**파일**: `links.service.ts:287`, `LinkFormModal.tsx`

**문제점**:
- `{error: "..."}` 형태의 에러가 LinkFormModal에서 처리되지 않음
- 권한 없음 에러가 사용자에게 표시되지 않음

**해결**:
- 에러를 `{_form: "..."}` 형태로 반환
- LinkFormModal에서 `root` 에러로 변환하여 UI에 표시

```typescript
// links.service.ts
return {_form: "존재하지 않는 링크이거나 권한이 없습니다."};

// LinkFormModal.tsx
if (field === "_form") {
  setError("root", {message: message as string});
}
```

---

## 🟠 High (성능/UX 개선 권장)

### 3. 모달 인스턴스 과다 생성

**파일**: `LinkCard.tsx:175`

```tsx
<LinkFormModal isEdit modalState={isShowEditModal} originValue={data} />
```

**문제점**:
- `LinkFormModal`이 각 `LinkCard` 내부에 직접 렌더링됨
- 링크 목록이 100개라면 모달 컴포넌트도 100개가 DOM에 존재
- 모달이 닫혀 있어도 각 카드마다 `Dialog`, `FormProvider`가 메모리에 유지

**개선 방안**:
- 모달을 상위 컴포넌트(LinkList 또는 Page 레벨)에 한 개만 배치
- Zustand 스토어로 수정할 링크 데이터를 관리

```typescript
// 예시: linkEditStore.ts
interface LinkEditStore {
  isOpen: boolean;
  editingLink: LinkInterface | null;
  openEdit: (link: LinkInterface) => void;
  closeEdit: () => void;
}
```

---

### 4. Object URL 메모리 누수

**파일**: `useUploadImage.ts:21`

```typescript
const url = URL.createObjectURL(file);
setPreview(url);
```

**문제점**:
- `URL.createObjectURL`로 생성된 Object URL이 해제되지 않음
- 이미지를 여러 번 변경하면 이전 URL들이 메모리에 누적

**개선 방안**:

```typescript
// useUploadImage.ts
const onImageChange = (e, callback) => {
  const file = e.target.files?.[0];
  if (file) {
    // 이전 URL 해제
    if (preview) {
      URL.revokeObjectURL(preview);
    }
    const url = URL.createObjectURL(file);
    setPreview(url);
    // ...
  }
};

// cleanup on unmount
useEffect(() => {
  return () => {
    if (preview) {
      URL.revokeObjectURL(preview);
    }
  };
}, []);
```

---

### 5. 저장 버튼 로딩 상태 없음

**파일**: `LinkFormModal.tsx:216`

**문제점**:
- 이미지 업로드 + DB 저장 과정 동안 로딩 상태가 표시되지 않음
- 사용자가 여러 번 클릭하여 중복 요청 발생 가능

**개선 방안**:

```tsx
const {formState: {isSubmitting}} = formMethods;

<FormButton type="submit" disabled={isSubmitting}>
  {isSubmitting ? "저장 중..." : "Save"}
</FormButton>
```

---

## 🟡 Medium (개선 권장)

### 6. 이미지 업로드 실패 시 에러 처리 없음

**파일**: `LinkFormModal.tsx:68`

```typescript
await uploadImage({file, uploadUrl});
```

**문제점**:
- `uploadImage` 실패 시 전체 submission이 실패하지만 명확한 에러 메시지 없음

**개선 방안**:

```typescript
try {
  await uploadImage({file, uploadUrl});
} catch (error) {
  setError("imageUrl", {message: "이미지 업로드에 실패했습니다."});
  return;
}
```

---

### 7. linkId 유효성 검증 누락

**파일**: `links.service.ts:242`

```typescript
const linkId = Number(formData.get("linkId"));
```

**문제점**:
- `linkId`가 `NaN`이거나 유효하지 않은 값일 때 검증 없음

**개선 방안**:

```typescript
const linkId = Number(formData.get("linkId"));
if (isNaN(linkId) || linkId <= 0) {
  return {_form: "유효하지 않은 링크 ID입니다."};
}
```

---

### 8. 수정 완료 후 toast 피드백 없음

**문제점**:
- 링크 수정 성공/실패 후 사용자에게 피드백이 없음

**개선 방안**:
- `useLinkAction` 훅에 `onUpdateLink` 함수 추가
- 성공/실패 시 toast 메시지 표시

---

### 9. useLinkAction 훅에 수정 기능 미통합

**파일**: `useLinkAction.ts`

**문제점**:
- 삭제, 즐겨찾기, 읽음 처리는 훅에서 관리되지만 수정은 별도 처리
- 일관성 부족 및 코드 재사용 어려움

**개선 방안**:
- `useLinkAction`에 `onUpdateLink` 함수 추가

---

## 🟢 Low (참고)

### 10. 기존 이미지 삭제 기능 없음

**문제점**:
- 수정 모드에서 기존 이미지를 완전히 제거하려면 새 이미지를 업로드해야 함

**개선 방안**:
- 미리보기 영역에 "이미지 삭제" 버튼 추가

---

### 11. setTimeout 사용 이유 주석 누락

**파일**: `LinkFormModal.tsx:62-64`

```typescript
setTimeout(() => {
  modalState.onFalse();
}, 0);
```

**문제점**:
- setTimeout 사용 의도가 불명확

**개선 방안**:
- 주석으로 이유 명시 (예: Dialog 애니메이션 충돌 방지)

---

### 12. 접근성 속성 누락

**파일**: `EditButton.tsx`, 기타 버튼 컴포넌트

**문제점**:
- `aria-label` 등 접근성 속성이 없음

**개선 방안**:

```tsx
<button aria-label="수정" className="...">
  <Pencil />
</button>
```

---

## 우선순위 정리

| 우선순위 | 항목 | 상태 |
|---------|------|------|
| Critical | 폴더 소유권 검증 | ✅ 완료 |
| Critical | 에러 타입 불일치 | ✅ 완료 |
| High | 모달 인스턴스 최적화 | ⬜ 미완료 |
| High | Object URL 메모리 누수 | ⬜ 미완료 |
| High | 로딩 상태 추가 | ⬜ 미완료 |
| Medium | 이미지 업로드 에러 처리 | ⬜ 미완료 |
| Medium | linkId 검증 | ⬜ 미완료 |
| Medium | toast 피드백 | ⬜ 미완료 |
| Medium | useLinkAction 통합 | ⬜ 미완료 |
| Low | 이미지 삭제 기능 | ⬜ 미완료 |
| Low | setTimeout 주석 | ⬜ 미완료 |
| Low | 접근성 속성 | ⬜ 미완료 |

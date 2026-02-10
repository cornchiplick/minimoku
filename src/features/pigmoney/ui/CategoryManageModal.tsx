"use client";

import { CategoryInterface } from "@/entities/pigmoney/types";
import {
  postCategory,
  updateCategory,
  deleteCategory,
} from "@/features/pigmoney/model/services/categories.service";
import { useCashRecordStore } from "@/features/pigmoney/model/store/cashRecordStore";
import { Button } from "@/shared/components/atoms/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/atoms/dialog";
import { Input } from "@/shared/components/atoms/input";
import Typography from "@/shared/home/atomic/Typography";
import { useBoolean } from "@/shared/hooks/useBoolean";
import { Edit, Plus, Trash2, Check, X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface CategoryManageModalProps {
  modalState: ReturnType<typeof useBoolean>;
}

// 카테고리 관리 모달
const CategoryManageModal = ({ modalState }: CategoryManageModalProps) => {
  const { categories, setCategories } = useCashRecordStore();
  const [newName, setNewName] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingName, setEditingName] = useState("");

  // 카테고리 추가
  const handleAdd = async () => {
    if (!newName.trim()) return;

    const formData = new FormData();
    formData.append("name", newName.trim());

    const result = await postCategory(formData);

    if (result && "_form" in result) {
      toast.error(result._form as string);
      return;
    }

    toast.success("카테고리가 추가되었습니다.");
    setNewName("");
    await refreshCategories();
  };

  // 카테고리 수정 시작
  const handleEditStart = (category: CategoryInterface) => {
    setEditingId(category.id);
    setEditingName(category.name);
  };

  // 카테고리 수정 저장
  const handleEditSave = async () => {
    if (!editingId || !editingName.trim()) return;

    const formData = new FormData();
    formData.append("categoryId", String(editingId));
    formData.append("name", editingName.trim());

    const result = await updateCategory(formData);

    if (result && "_form" in result) {
      toast.error(result._form as string);
      return;
    }

    toast.success("카테고리가 수정되었습니다.");
    setEditingId(null);
    setEditingName("");
    await refreshCategories();
  };

  // 카테고리 수정 취소
  const handleEditCancel = () => {
    setEditingId(null);
    setEditingName("");
  };

  // 카테고리 삭제
  const handleDelete = async (categoryId: number) => {
    const result = await deleteCategory({ categoryId });

    if (result.error) {
      toast.error(result.error);
      return;
    }

    toast.success("카테고리가 삭제되었습니다.");
    await refreshCategories();
  };

  // 카테고리 목록 새로고침 (서버에서 재조회)
  const refreshCategories = async () => {
    // 서버 액션으로 재조회하면 revalidateTag가 동작하여 다음 조회 시 반영됨
    // 여기서는 로컬 상태를 즉시 업데이트하기 위해 API를 직접 호출
    try {
      const { getCategories } = await import(
        "@/features/pigmoney/model/services/categories.service"
      );
      const updated = await getCategories();
      setCategories(updated);
    } catch {
      // 조회 실패 시 무시 (다음 페이지 로드 시 반영)
    }
  };

  return (
    <Dialog open={modalState.value} onOpenChange={(open) => !open && modalState.onFalse()}>
      <DialogContent className="bg-background-tertiary max-w-md p-5">
        <DialogHeader>
          <DialogTitle>
            <Typography.Head3>카테고리 관리</Typography.Head3>
          </DialogTitle>
        </DialogHeader>

        {/* 카테고리 추가 */}
        <div className="flex gap-2">
          <Input
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="새 카테고리명"
            className="flex-1 bg-minimoku-input"
            onKeyDown={(e) => e.key === "Enter" && handleAdd()}
          />
          <Button onClick={handleAdd} size="icon" className="cursor-pointer">
            <Plus className="h-4 w-4" />
          </Button>
        </div>

        {/* 카테고리 목록 */}
        <div className="mt-4 flex flex-col gap-2">
          {categories.length === 0 && (
            <div className="text-minimoku-neutral-bold py-4 text-center text-sm">
              카테고리가 없습니다.
            </div>
          )}
          {categories.map((category) => (
            <div
              key={category.id}
              className="flex items-center gap-2 rounded-md border px-3 py-2"
            >
              {editingId === category.id ? (
                <>
                  {/* 수정 모드 */}
                  <Input
                    value={editingName}
                    onChange={(e) => setEditingName(e.target.value)}
                    className="flex-1 bg-minimoku-input"
                    autoFocus
                    onKeyDown={(e) => e.key === "Enter" && handleEditSave()}
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 cursor-pointer"
                    onClick={handleEditSave}
                  >
                    <Check className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 cursor-pointer"
                    onClick={handleEditCancel}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </>
              ) : (
                <>
                  {/* 일반 모드 */}
                  <span className="flex-1 text-sm">{category.name}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 cursor-pointer"
                    onClick={() => handleEditStart(category)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 cursor-pointer"
                    onClick={() => handleDelete(category.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </>
              )}
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CategoryManageModal;

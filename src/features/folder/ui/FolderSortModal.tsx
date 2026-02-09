"use client";

import {FolderInterface} from "@/entities/folder/types";
import {updateFolderOrders} from "@/features/folder/model/services/folders.service";
import {Button} from "@/shared/components/atoms/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/atoms/dialog";
import Typography from "@/shared/home/atomic/Typography";
import {useBoolean} from "@/shared/hooks/useBoolean";
import {useThemeStore} from "@/shared/store/themeStore";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import {CSS} from "@dnd-kit/utilities";
import clsx from "clsx";
import {Archive, Folder, GripVertical} from "lucide-react";
import {useEffect, useState} from "react";
import {toast} from "sonner";

interface FolderSortModalProps {
  folders: FolderInterface[];
  modalState: ReturnType<typeof useBoolean>;
}

// 드래그 가능한 폴더 아이템 컴포넌트
function SortableFolderItem({folder}: {folder: FolderInterface}) {
  const {isDarkMode} = useThemeStore();
  const {attributes, listeners, setNodeRef, transform, transition, isDragging} = useSortable({
    id: folder.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const FolderIcon = folder.id === 0 ? Archive : Folder;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={clsx(
        "flex items-center gap-3 rounded-lg border p-3",
        isDarkMode
          ? "border-gray-700 bg-background-primary"
          : "border-gray-200 bg-background-primary"
      )}>
      {/* 드래그 핸들 */}
      <button
        {...attributes}
        {...listeners}
        className="cursor-grab touch-none active:cursor-grabbing"
        onClick={(e) => e.stopPropagation()}>
        <GripVertical className="h-5 w-5 text-gray-400" />
      </button>

      {/* 폴더 아이콘 */}
      <FolderIcon
        className="h-4 w-4"
        stroke={isDarkMode ? "none" : "black"}
        fill={isDarkMode ? "white" : "none"}
      />

      {/* 폴더 정보 */}
      <div className="flex flex-1 items-center gap-2">
        <Typography.P2>{folder.name}</Typography.P2>
        <Typography.P3 className="text-gray-500">({folder.count})</Typography.P3>
      </div>
    </div>
  );
}

const FolderSortModal = ({folders, modalState}: FolderSortModalProps) => {
  const {isDarkMode} = useThemeStore();
  // 로컬 상태로 폴더 순서 관리
  const [sortedFolders, setSortedFolders] = useState<FolderInterface[]>(folders);
  const [isSaving, setIsSaving] = useState(false);

  // dnd-kit 센서 설정
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // 모달이 열릴 때마다 원본 폴더 순서로 리셋
  useEffect(() => {
    if (modalState.value) {
      setSortedFolders([...folders]);
    }
  }, [modalState.value, folders]);

  // 드래그 종료 시 순서 변경
  const handleDragEnd = (event: DragEndEvent) => {
    const {active, over} = event;

    if (over && active.id !== over.id) {
      setSortedFolders((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  // 저장 버튼 클릭
  const handleSave = async () => {
    setIsSaving(true);

    // sortOrder 업데이트 데이터 생성
    const folderOrders = sortedFolders.map((folder, index) => ({
      id: folder.id,
      sortOrder: index,
    }));

    // 서버에 저장
    const result = await updateFolderOrders(folderOrders);

    setIsSaving(false);

    if (result.error) {
      // 에러 처리
      toast.error("폴더 순서 변경에 실패했습니다.");
    } else {
      // 성공 시 모달 닫기
      toast.success("폴더 순서가 변경되었습니다.");
      modalState.onFalse();
    }
  };

  // 취소 버튼 클릭
  const handleCancel = () => {
    setSortedFolders([...folders]); // 원본으로 리셋
    modalState.onFalse(); // 모달 닫기
  };

  return (
    <Dialog open={modalState.value} onOpenChange={modalState.onFalse}>
      <DialogContent className="max-w-md bg-background-tertiary p-5">
        <DialogHeader>
          <DialogTitle>
            <Typography.Head3>폴더 순서 정렬</Typography.Head3>
          </DialogTitle>
        </DialogHeader>

        {/* 드래그 앤 드롭 리스트 */}
        <div className="my-4 max-h-[60vh] overflow-y-auto">
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}>
            <SortableContext
              items={sortedFolders.map((f) => f.id)}
              strategy={verticalListSortingStrategy}>
              <div className="space-y-2">
                {sortedFolders.map((folder) => (
                  <SortableFolderItem key={folder.id} folder={folder} />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        </div>

        {/* 버튼 */}
        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={handleCancel}
            disabled={isSaving}
            className="bg-gray-800 text-white border-gray-800 hover:bg-gray-900 dark:bg-gray-200 dark:text-gray-900 dark:border-gray-200 dark:hover:bg-gray-100">
            취소
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={handleSave}
            disabled={isSaving}
            className="bg-white text-gray-800 border-gray-300 hover:bg-gray-50 dark:bg-gray-900 dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-800">
            {isSaving ? "저장 중..." : "저장"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default FolderSortModal;

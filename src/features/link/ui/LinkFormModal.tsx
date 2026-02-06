"use client";

import {LinkInterface} from "@/entities/link/types";
import {useFolderStore} from "@/features/folder/model/store/folderStore";
import {linkSchema, LinkSchemaType} from "@/features/link/model/schema/linkSchema";
import {postLink, updateLink} from "@/features/link/model/services/links.service";
import {Button} from "@/shared/components/atoms/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/atoms/dialog";
import {SelectItem} from "@/shared/components/atoms/select";
import FormButton from "@/shared/components/molecules/buttons/FormButton";
import FormInput from "@/shared/components/molecules/FormInput";
import FormSelect from "@/shared/components/molecules/FormSelect";
import FormTagInput from "@/shared/components/molecules/FormTagInput";
import Typography from "@/shared/home/atomic/Typography";
import {useBoolean} from "@/shared/hooks/useBoolean";
import {useUploadImage} from "@/shared/hooks/useUploadImage";
import {zodResolver} from "@hookform/resolvers/zod";
import {Image as ImageIcon} from "lucide-react";
import {useEffect} from "react";
import {FormProvider, SubmitHandler, useForm} from "react-hook-form";

interface LinkFormModalProps {
  isEdit?: boolean;
  modalState: ReturnType<typeof useBoolean>;
  originValue?: LinkInterface;
}

const defaultValues: LinkSchemaType = {
  title: "",
  url: "",
  imageUrl: "",
  folderId: "",
  tags: [],
  memo: "",
};

const LinkFormModal = ({isEdit, modalState, originValue}: LinkFormModalProps) => {
  const {folderList} = useFolderStore();
  const {preview, uploadUrl, file, setPreview, setFile, onImageChange, uploadImage} =
    useUploadImage();

  const formMethods = useForm<LinkSchemaType>({
    resolver: zodResolver(linkSchema),
    defaultValues: {
      ...defaultValues,
    },
  });

  const {
    reset,
    setValue,
    setError,
    handleSubmit,
    formState: {errors},
  } = formMethods;

  const handleClose = () => {
    setPreview("");
    setFile(null);
    reset({...defaultValues});

    // 폼 상태 리셋이 완전히 완료된 후 모달을 닫기 위해 다음 이벤트 루프로 지연
    setTimeout(() => {
      modalState.onFalse();
    }, 0);
  };

  const onSubmit: SubmitHandler<LinkSchemaType> = async (data) => {
    await uploadImage({file, uploadUrl});

    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("url", data.url);
    formData.append("folderId", String(data.folderId));
    formData.append("imageUrl", data.imageUrl || "");
    // 태그 배열을 JSON 문자열로 변환하여 전송
    formData.append("tags", JSON.stringify(data.tags ?? []));
    formData.append("memo", data.memo ?? "");

    let errors = null;

    // 수정 모드일 경우 updateLink 호출
    if (isEdit && originValue) {
      formData.append("linkId", originValue.id.toString());
      errors = await updateLink(formData);
    } else {
      errors = await postLink(formData);
    }

    // 에러가 있으면 각 필드에 에러 메시지 설정
    if (errors) {
      // Zod flatten 형태의 에러 처리
      if ("fieldErrors" in errors) {
        Object.entries(errors.fieldErrors).forEach(([field, messages]) => {
          if (messages && messages.length > 0) {
            setError(field as keyof LinkSchemaType, {message: messages[0]});
          }
        });
      } else {
        // 단순 객체 형태의 에러 처리
        Object.entries(errors).forEach(([field, message]) => {
          // _form 에러는 폼 전체 에러로 처리 (root 에러)
          if (field === "_form") {
            setError("root", {message: message as string});
          } else {
            setError(field as keyof LinkSchemaType, {message: message as string});
          }
        });
      }
      return;
    }

    handleClose();
  };

  // 모달이 열릴 때 originValue로 폼 초기화 (수정 모드)
  useEffect(() => {
    if (modalState.value && originValue) {
      reset({
        title: originValue.title,
        url: originValue.url,
        imageUrl: originValue.imageUrl || "",
        folderId: String(originValue.folderId),
        tags: originValue.tags || [],
        memo: originValue.memo || "",
      });
      // 기존 이미지가 있으면 미리보기 설정
      if (originValue.imageUrl) {
        setPreview(`${originValue.imageUrl}/width=96,height=96,fit=cover`);
      }
    }
  }, [modalState.value, originValue, reset, setPreview]);

  return (
    <Dialog
      open={modalState.value}
      onOpenChange={(open) => {
        if (!open) {
          handleClose();
        }
      }}
      modal={true}>
      <FormProvider {...formMethods}>
        <DialogContent
          className="bg-background-tertiary p-5"
          disableEscapeClose
          disableOutsideClose
          hideCloseButton>
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
            <DialogHeader>
              <DialogTitle>
                <Typography.Head3>{isEdit ? "Link 수정" : "Link 추가"}</Typography.Head3>
              </DialogTitle>
            </DialogHeader>
            {/* 폼 전체 에러 메시지 (권한 없음 등) */}
            {errors.root && (
              <div className="rounded-md bg-red-100 p-3 text-sm text-red-600">
                {errors.root.message}
              </div>
            )}
            <div className="flex flex-1 flex-col gap-3">
              <div className="flex flex-1 flex-row justify-center gap-2 self-stretch">
                <div className="flex h-full w-24 flex-shrink-0 flex-col items-center justify-center gap-2 pt-3.5">
                  <div
                    className="bg-minimoku-input flex h-24 w-24 flex-shrink-0 items-center justify-center rounded-lg border-gray-600 text-xs text-gray-500"
                    style={{
                      backgroundImage: preview ? `url(${preview})` : undefined,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                      backgroundRepeat: "no-repeat",
                    }}>
                    {!preview && "미리보기"}
                  </div>
                  <label
                    htmlFor="photo"
                    className="bg-minimoku-input flex w-full cursor-pointer items-center justify-center gap-2 rounded-md px-2 py-2 text-xs transition-all duration-200">
                    <ImageIcon className="h-4 w-4" stroke="#a0a0a0" />
                    <Typography.P3>업로드</Typography.P3>
                  </label>
                  <FormInput
                    id="photo"
                    type="file"
                    onChange={(e) =>
                      onImageChange(e, (id) =>
                        setValue(
                          "imageUrl",
                          `https://imagedelivery.net/iZyA_W41y4aQU_gSa-cmmA/${id}`
                        )
                      )
                    }
                    accept="image/*"
                    className="hidden"
                    name="imageUrl"
                  />
                </div>
                <div className="flex flex-1 flex-col gap-3">
                  <FormInput
                    name="title"
                    label="이름"
                    placeholder="링크 제목을 입력하세요"
                    registerOptions={{required: "이름은 필수입니다."}}
                  />
                  <FormInput
                    name="url"
                    label="URL"
                    placeholder="https://example.com"
                    registerOptions={{required: "URL은 필수입니다."}}
                  />
                </div>
              </div>
              <FormSelect
                name="folderId"
                label="폴더"
                placeholder="폴더를 선택하세요"
                registerOptions={{required: "폴더는 필수입니다."}}>
                {folderList.map((folder) => (
                  <SelectItem key={folder.id} value={String(folder.id)}>
                    {folder.name}
                  </SelectItem>
                ))}
              </FormSelect>
              <FormTagInput name="tags" label="태그" placeholder="태그를 입력하고 Enter 또는 Space를 누르세요" />
              <FormInput name="memo" label="메모" placeholder="링크에 대한 메모를 작성하세요..." />
            </div>
            <DialogFooter>
              <FormButton type="submit" className="cursor-pointer">
                <Typography.P1 className="text-foreground-reverse">Save</Typography.P1>
              </FormButton>
              <Button
                type="button"
                variant="outline"
                className="border-background-reverse-primary cursor-pointer"
                onClick={handleClose}>
                <Typography.P1>Cancel</Typography.P1>
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </FormProvider>
    </Dialog>
  );
};

export default LinkFormModal;

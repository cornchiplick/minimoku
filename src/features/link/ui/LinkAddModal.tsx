"use client";

import {useFolderStore} from "@/features/folder/model/store/folderStore";
import {linkSchema, LinkSchemaType} from "@/features/link/model/schema/linkSchema";
import {postLink} from "@/features/link/model/services/links.service";
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
import Typography from "@/shared/home/atomic/Typography";
import {useBoolean} from "@/shared/hooks/useBoolean";
import {useUploadImage} from "@/shared/hooks/useUploadImage";
import {zodResolver} from "@hookform/resolvers/zod";
import {Image} from "lucide-react";
import {FormProvider, SubmitHandler, useForm} from "react-hook-form";

interface LinkAddModalProps {
  modalState: ReturnType<typeof useBoolean>;
}

const LinkAddModal = ({modalState}: LinkAddModalProps) => {
  const {folderList} = useFolderStore();
  const {preview, uploadUrl, file, setPreview, setFile, onImageChange, uploadImage} =
    useUploadImage();

  const formMethods = useForm<LinkSchemaType>({
    resolver: zodResolver(linkSchema),
    defaultValues: {
      title: "",
      url: "",
      imageUrl: "",
      folderId: "",
      tags: "",
      memo: "",
    },
  });

  const {reset, setValue, handleSubmit} = formMethods;

  const handleClose = () => {
    setPreview("");
    setFile(null);
    reset();
    modalState.onFalse();
  };

  const onSubmit: SubmitHandler<LinkSchemaType> = async (data, e) => {
    console.log("data :: ", data);
    await uploadImage({file, uploadUrl});

    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("url", data.url);
    formData.append("folderId", String(data.folderId));
    formData.append("imageUrl", data.imageUrl || "");
    formData.append("tags", data.tags ?? "");
    formData.append("memo", data.memo ?? "");

    const errors = await postLink(formData);
    // if (errors) {
    //   setError("")
    // }

    reset();
    handleClose();
  };

  return (
    <Dialog
      open={modalState.value}
      onOpenChange={(open) => (open ? modalState.onTrue() : handleClose())}>
      <FormProvider {...formMethods}>
        <DialogContent className="bg-background-tertiary p-5">
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
            <DialogHeader>
              <DialogTitle>
                <Typography.Head3>Link 추가</Typography.Head3>
              </DialogTitle>
            </DialogHeader>
            <div className="flex flex-1 flex-col gap-3">
              <div className="flex flex-1 flex-row justify-center gap-2 self-stretch">
                <div className="flex h-full w-24 flex-shrink-0 flex-col items-center justify-center gap-2 pt-3.5">
                  <div
                    className="flex h-24 w-24 flex-shrink-0 items-center justify-center rounded-lg border-gray-600 bg-gray-700 text-xs text-gray-500"
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
                    <Image className="h-4 w-4" stroke="#a0a0a0" />
                    <Typography.P3>업로드</Typography.P3>
                  </label>
                  <FormInput
                    id="photo"
                    type="file"
                    onChange={(e) =>
                      onImageChange(e, (id: any) =>
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
              <FormInput name="tags" label="태그" placeholder="태그를 입력하고 Enter를 누르세요" />
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

export default LinkAddModal;

import {FolderInterface} from "@/entities/folder/types";
import {folderSchema, FolderSchemaType} from "@/features/folder/model/schema/folderSchema";
import {postFolder, updateFolder} from "@/features/folder/model/services/folders.service";
import {Button} from "@/shared/components/atoms/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/atoms/dialog";
import FormButton from "@/shared/components/molecules/buttons/FormButton";
import FormInput from "@/shared/components/molecules/FormInput";
import Typography from "@/shared/home/atomic/Typography";
import {useBoolean} from "@/shared/hooks/useBoolean";
import {zodResolver} from "@hookform/resolvers/zod";
import {useEffect} from "react";
import {FormProvider, SubmitHandler, useForm} from "react-hook-form";

interface FolderAddModalProps {
  isEdit?: boolean;
  modalState: ReturnType<typeof useBoolean>;
  originValue?: FolderInterface;
}

const defaultValues = {name: ""};

const FolderFormModal = ({isEdit, modalState, originValue}: FolderAddModalProps) => {
  const formMethods = useForm<FolderSchemaType>({
    resolver: zodResolver(folderSchema),
    defaultValues: {
      ...defaultValues,
      ...originValue,
    },
  });

  const {reset, handleSubmit} = formMethods;

  const handleClose = () => {
    reset({...defaultValues});

    setTimeout(() => {
      modalState.onFalse();
    }, 0);
  };

  const onSubmit: SubmitHandler<FolderSchemaType> = async (data, e) => {
    const formData = new FormData();
    formData.append("name", data.name);

    let errors = null;
    if (isEdit && originValue) {
      formData.append("folderId", originValue.id.toString());
      errors = await updateFolder(formData);
    } else {
      errors = await postFolder(formData);
    }
    // if (errors) {
    //   setError("")
    // }

    reset();
    handleClose();
  };

  useEffect(() => {
    if (modalState.value && originValue) {
      reset({
        ...defaultValues,
        ...originValue,
      });
    }
  }, [modalState.value, originValue, reset]);

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
          onInteractOutside={(e) => {
            e.preventDefault();
            handleClose();
          }}>
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
            <DialogHeader>
              <DialogTitle>
                <Typography.Head3>Folder 추가</Typography.Head3>
              </DialogTitle>
            </DialogHeader>

            <div className="flex flex-1 flex-col gap-3">
              <FormInput
                name="name"
                label="폴더명"
                placeholder="폴더명을 입력하세요"
                registerOptions={{required: "폴더명은 필수입니다."}}
              />
            </div>

            <DialogFooter>
              <FormButton type="submit" className="cursor-pointer">
                <Typography.P1 className="text-foreground-reverse">Save</Typography.P1>
              </FormButton>
              <Button
                type="button"
                variant="outline"
                className="border-background-reverse-primary cursor-pointer"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleClose();
                }}>
                <Typography.P1>Cancel</Typography.P1>
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </FormProvider>
    </Dialog>
  );
};

export default FolderFormModal;

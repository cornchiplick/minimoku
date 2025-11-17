import {folderSchema, FolderSchemaType} from "@/features/folder/model/schema/folderSchema";
import {postFolder} from "@/features/folder/model/services/folders.service";
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
import {FormProvider, SubmitHandler, useForm} from "react-hook-form";

interface FolderAddModalProps {
  modalState: ReturnType<typeof useBoolean>;
}

const FolderAddModal = ({modalState}: FolderAddModalProps) => {
  const formMethods = useForm<FolderSchemaType>({
    resolver: zodResolver(folderSchema),
    defaultValues: {
      title: "",
    },
  });

  const {reset, setValue, handleSubmit} = formMethods;

  const handleClose = () => {
    reset();
    modalState.onFalse();
  };

  const onSubmit: SubmitHandler<FolderSchemaType> = async (data, e) => {
    console.log("data :: ", data);

    const formData = new FormData();
    formData.append("title", data.title);

    const errors = await postFolder(formData);
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
                <Typography.Head3>Folder 추가</Typography.Head3>
              </DialogTitle>
            </DialogHeader>

            <div className="flex flex-1 flex-col gap-3">
              <FormInput
                name="title"
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

export default FolderAddModal;

"use client";

import { linkSchema, LinkSchemaType } from "@/features/link/model/schema/linkSchema";
import { getUploadUrl, } from "@/features/link/model/services/links.service";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";

interface LinkAddModalProps {
  handleClose: (e: any) => void,
}

const LinkAddModal = ({handleClose}: LinkAddModalProps) => {
  const [preview, setPreview] = useState("");
  const [uploadUrl, setUploadUrl] = useState("");
  const [file, setFile] = useState<File | null>(null);

  // cloudflare 에 image 다시 활성화
  const {
    register,
    handleSubmit,
    setValue,
    setError,
    formState: {errors},
  } = useForm<LinkSchemaType>({
    resolver: zodResolver(linkSchema),
  });

  const onImageChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const {
      target: {files},
    } = event;
    if (!files) {
      return;
    }

    const file = files[0];
    const url = URL.createObjectURL(file);
    setPreview(url);
    setFile(file);

    const {success, result} = await getUploadUrl();
    if (success) {
      const {id, uploadURL} = result;
      setUploadUrl(uploadURL);
      setValue("imageUrl", `https://imagedelivery.net/iZyA_W41y4aQU_gSa-cmmA/${id}`);
    }
  };

  return (
    <>
      <div onClick={handleClose}>
        <input
          onChange={onImageChange}
          type="file"
          id="photo"
          name="photo"
          accept="image/*"
          className="hidden"
        />
        link add modal
      </div>
    </>
  );
};

export default LinkAddModal;
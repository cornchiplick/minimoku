"use client";

import {getUploadUrl} from "@/shared/services/cloudflare.service";
import {useCallback, useState} from "react";

export const useUploadImage = () => {
  const [preview, setPreview] = useState("");
  const [uploadUrl, setUploadUrl] = useState("");
  const [file, setFile] = useState<File | null>(null);

  const onImageChange = useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>, successFn: (id: any) => void) => {
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
        // setValue("imageUrl", `https://imagedelivery.net/iZyA_W41y4aQU_gSa-cmmA/${id}`);
        successFn(id);
      }
    },
    []
  );

  // client가 직접 upload 해야함. (cloudflare 정책)
  const uploadImage = useCallback(
    async ({file, uploadUrl}: {file: File | null; uploadUrl: string}) => {
      // upload image to cloudflare
      if (!file) {
        return;
      }

      const cloudflareForm = new FormData();
      cloudflareForm.append("file", file);

      const response = await fetch(uploadUrl, {
        method: "POST",
        body: cloudflareForm,
      });

      if (response.status !== 200) {
        throw new Error("ClouadFlare Error : image upload failed.");
      }

      return response;
    },
    []
  );

  return {preview, uploadUrl, file, setPreview, setFile, onImageChange, uploadImage};
};

import { uploadFileToS3 } from '@/actions/upload.actions';
import {
  GENERATE_INVENTORY_UPLOAD_URL,
  GenerateInventoryUploadUrlResponse,
  GenerateInventoryUploadUrlVariables,
} from '@/graphql';
import { useMutation } from '@apollo/client/react';
import { useCallback, useState } from 'react';

interface UploadInventoryImageResult {
  /** The S3 file key returned by the backend, e.g. "inventory/my-brand/banner.jpg" */
  fileKey: string;
}

/**
 * Reusable hook for uploading an inventory image via presigned S3 URL.
 *
 * Flow:
 *  1. Calls `generateInventoryUploadUrl` mutation to get a presigned PUT URL + file key from the backend.
 *  2. Uploads the file directly to S3 using a server action.
 *  3. Returns the `fileKey` to be stored in the inventory record.
 */
export function useInventoryUpload() {
  const [isUploadingToS3, setIsUploadingToS3] = useState(false);

  const [generateUploadUrl, { loading: isGeneratingUrl }] = useMutation<
    GenerateInventoryUploadUrlResponse,
    GenerateInventoryUploadUrlVariables
  >(GENERATE_INVENTORY_UPLOAD_URL);

  const uploadInventoryImage = useCallback(
    async (
      file: File,
      brandName: string,
      inventoryName: string,
    ): Promise<UploadInventoryImageResult> => {
      // Step 1: Request presigned URL from backend
      const { data } = await generateUploadUrl({
        variables: {
          input: {
            brandName,
            inventoryName,
            filename: file.name,
          },
        },
      });

      const result = data?.generateInventoryUploadUrl;

      if (!result?.success || !result.uploadUrl || !result.fileKey) {
        throw new Error(result?.message ?? 'Failed to generate upload URL');
      }

      // Step 2: Upload file to S3 via server action (proxied to avoid CORS)
      setIsUploadingToS3(true);
      try {
        const formData = new FormData();
        formData.append('uploadUrl', result.uploadUrl);
        formData.append('file', file);
        await uploadFileToS3(formData);
      } finally {
        setIsUploadingToS3(false);
      }

      return { fileKey: result.fileKey };
    },
    [generateUploadUrl],
  );

  const isUploading = isGeneratingUrl || isUploadingToS3;

  return {
    uploadInventoryImage,
    isUploading,
  };
}

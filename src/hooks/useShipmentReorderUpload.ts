import { uploadFileToS3 } from '@/actions/upload.actions';
import {
  GENERATE_REORDER_UPLOAD_URL,
  GenerateReorderUploadUrlResponse,
  GenerateReorderUploadUrlVariables,
  ReorderImageInput,
} from '@/graphql';
import { useMutation } from '@apollo/client/react';
import { useCallback, useState } from 'react';

/**
 * Reusable hook for uploading shipment reorder evidence images via presigned S3 URLs.
 *
 * Flow:
 *  1. Calls `generateReorderUploadUrl` mutation to get presigned PUT URLs + file keys from the backend.
 *  2. Uploads all files concurrently to S3 via the `uploadFileToS3` server action.
 *  3. Returns `ReorderImageInput[]` to be included in the `receiveShipment` mutation call.
 *
 * @example
 * const { uploadReorderImages, isUploading } = useShipmentReorderUpload();
 * const images = await uploadReorderImages(files, shipmentId);
 */
export function useShipmentReorderUpload() {
  const [isUploadingToS3, setIsUploadingToS3] = useState(false);

  const [generateUploadUrl, { loading: isGeneratingUrl }] = useMutation<
    GenerateReorderUploadUrlResponse,
    GenerateReorderUploadUrlVariables
  >(GENERATE_REORDER_UPLOAD_URL);

  const uploadReorderImages = useCallback(
    async (files: File[], shipmentId: string): Promise<ReorderImageInput[]> => {
      // Step 1: Request presigned URLs from backend for all files at once
      const { data } = await generateUploadUrl({
        variables: {
          input: {
            shipmentId,
            images: files.map((f) => ({ name: f.name, type: f.type })),
          },
        },
      });

      const result = data?.generateReorderUploadUrl;

      if (!result?.success || !result.uploads?.length) {
        throw new Error(result?.message ?? 'Failed to generate upload URLs');
      }

      // Step 2: Upload all files concurrently to S3 via server action
      setIsUploadingToS3(true);
      try {
        await Promise.all(
          result.uploads.map((upload, idx) => {
            const file = files[idx];
            const formData = new FormData();
            formData.append('uploadUrl', upload.uploadUrl);
            formData.append('file', file);
            return uploadFileToS3(formData);
          }),
        );
      } finally {
        setIsUploadingToS3(false);
      }

      // Step 3: Return image inputs for the receiveShipment mutation
      return result.uploads.map((upload, idx) => ({
        name: upload.name,
        type: files[idx].type,
        key: upload.key,
      }));
    },
    [generateUploadUrl],
  );

  const isUploading = isGeneratingUrl || isUploadingToS3;

  return {
    uploadReorderImages,
    isUploading,
  };
}

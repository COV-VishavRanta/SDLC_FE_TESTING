import { uploadFileToS3 } from '@/actions/upload.actions';
import {
  GENERATE_PROMOTION_UPLOAD_URL,
  GeneratePromotionUploadUrlResponse,
  GeneratePromotionUploadUrlVariables,
} from '@/graphql';
import { useMutation } from '@apollo/client/react';
import { useCallback, useState } from 'react';

interface UploadPromotionImageResult {
  /** The S3 file key returned by the backend, e.g. "promotions/123/banner.jpg" */
  fileKey: string;
}

/**
 * Reusable hook for uploading a promotion image via presigned S3 URL.
 *
 * Flow:
 *  1. Calls `generatePromotionUploadUrl` mutation to get a presigned PUT URL + file key from the backend.
 *  2. Uploads the file directly to S3 using a native `fetch` PUT request.
 *  3. Returns the `fileKey` to be stored in the promotion record.
 *
 * @example
 * const { uploadPromotionImage, isUploading } = usePromotionUpload();
 * const { fileKey } = await uploadPromotionImage(file, 'summer-sale', 'banner');
 */
export function usePromotionUpload() {
  const [isUploadingToS3, setIsUploadingToS3] = useState(false);

  const [generateUploadUrl, { loading: isGeneratingUrl }] = useMutation<
    GeneratePromotionUploadUrlResponse,
    GeneratePromotionUploadUrlVariables
  >(GENERATE_PROMOTION_UPLOAD_URL);

  const uploadPromotionImage = useCallback(
    async (
      file: File,
      campaignName: string,
      promotionName: string,
    ): Promise<UploadPromotionImageResult> => {
      // Step 1: Request presigned URL from backend
      const { data } = await generateUploadUrl({
        variables: {
          input: {
            campaignName,
            promotionName,
            filename: file.name,
          },
        },
      });

      const result = data?.generatePromotionUploadUrl;

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
    uploadPromotionImage,
    isUploading,
  };
}

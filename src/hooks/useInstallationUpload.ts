import { uploadFileToS3 } from '@/actions/upload.actions';
import {
  GENERATE_INSTALLATION_UPLOAD_URL,
  GenerateInstallationUploadUrlResponse,
  GenerateInstallationUploadUrlVariables,
  InstallationImageInput,
} from '@/graphql';
import { useMutation } from '@apollo/client/react';
import { useCallback, useState } from 'react';

/**
 * Reusable hook for uploading installation proof images via presigned S3 URLs.
 *
 * Flow:
 *  1. Calls `generateInstallationUploadUrl` mutation to get presigned PUT URLs + file keys.
 *  2. Uploads all files concurrently to S3 via the `uploadFileToS3` server action.
 *  3. Returns `InstallationImageInput[]` to be included in the `submitInstallationProof` mutation.
 *
 * @example
 * const { uploadInstallationImages, isUploading } = useInstallationUpload();
 * const images = await uploadInstallationImages(files, orderItemId);
 */
export function useInstallationUpload() {
  const [isUploadingToS3, setIsUploadingToS3] = useState(false);

  const [generateUploadUrl, { loading: isGeneratingUrl }] = useMutation<
    GenerateInstallationUploadUrlResponse,
    GenerateInstallationUploadUrlVariables
  >(GENERATE_INSTALLATION_UPLOAD_URL);

  const uploadInstallationImages = useCallback(
    async (files: File[], orderItemId: string): Promise<InstallationImageInput[]> => {
      // Step 1: Request presigned URLs from backend for all files at once
      const { data } = await generateUploadUrl({
        variables: {
          input: {
            orderItemId,
            images: files.map((f) => ({ name: f.name })),
          },
        },
      });

      const result = data?.generateInstallationUploadUrl;

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

      // Step 3: Return image inputs for the submitInstallationProof mutation
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
    uploadInstallationImages,
    isUploading,
  };
}

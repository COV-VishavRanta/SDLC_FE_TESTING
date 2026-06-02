'use client';

import { getUrl, uploadData, type TransferProgressEvent } from 'aws-amplify/storage';

export interface UploadFileOptions {
  /** S3 path prefix, e.g. "avatars/" or "campaign-assets/". Defaults to "uploads/". */
  pathPrefix?: string;
  contentType?: string;
  onProgress?: (event: TransferProgressEvent) => void;
}

export interface UploadFileResult {
  /** Full S3 key, e.g. "uploads/my-image.png" */
  key: string;
}

/**
 * Uploads a file to S3 and returns the storage key.
 *
 * @example
 * const { key } = await uploadFileToS3(file, { pathPrefix: 'campaign-assets/' });
 */
export async function uploadFileToS3(
  file: File,
  options: UploadFileOptions = {},
): Promise<UploadFileResult> {
  const { pathPrefix = 'uploads/', contentType, onProgress } = options;
  const path = `${pathPrefix}${file.name}`;

  await uploadData({
    path,
    data: file,
    options: {
      contentType: contentType ?? file.type,
      onProgress,
    },
  }).result;

  return { key: path };
}

export interface GetFileUrlOptions {
  /** URL expiry in seconds. Defaults to 3600 (1 hour). */
  expiresIn?: number;
}

/**
 * Returns a presigned URL for a given S3 key so it can be rendered in an <img> tag.
 *
 * @example
 * const src = await getS3ImageUrl('uploads/my-image.png');
 * // <img src={src} alt="..." />
 */
export async function getS3ImageUrl(key: string, options: GetFileUrlOptions = {}): Promise<string> {
  const { expiresIn = 3600 } = options;

  const { url } = await getUrl({
    path: key,
    options: { expiresIn },
  });

  return url.href;
}

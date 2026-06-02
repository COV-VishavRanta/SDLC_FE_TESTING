'use server';

/**
 * Proxies a file upload to a presigned S3 URL from the server side.
 * This avoids CORS preflight issues that occur when uploading directly
 * from the browser to S3.
 */
export async function uploadFileToS3(formData: FormData): Promise<void> {
  const uploadUrl = formData.get('uploadUrl') as string;
  const file = formData.get('file') as File;

  if (!uploadUrl || !file) {
    throw new Error('Missing uploadUrl or file in FormData');
  }

  const response = await fetch(uploadUrl, {
    method: 'PUT',
    body: await file.arrayBuffer(),
    headers: {
      'Content-Type': file.type,
    },
  });

  if (!response.ok) {
    throw new Error(`S3 upload failed: ${response.statusText}`);
  }
}

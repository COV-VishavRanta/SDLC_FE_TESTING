import type { ReportExportPayload } from '@/graphql';

/**
 * Decodes a base64-encoded file content string and triggers a browser download.
 */
export function downloadReportFile(payload: ReportExportPayload): void {
  const { fileContent, fileName, contentType } = payload;

  const binaryString = atob(fileContent);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }

  const blob = new Blob([bytes], { type: contentType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  link.click();
  URL.revokeObjectURL(url);
}

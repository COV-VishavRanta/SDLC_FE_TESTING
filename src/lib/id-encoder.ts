/**
 * Encodes a UUID string to a URL-safe Base64 string.
 * This should be used for public-facing URLs to hide raw UUIDs.
 * Example: '550e8400-e29b-41d4-a716-446655440000' -> 'VQ6EAOKbQdSnFkRmVUQAAA'
 */
export function encodeId(uuid: string): string {
  if (!uuid) {
    return '';
  }

  try {
    // Remove hyphens to get raw hex
    const hex = uuid.replace(/-/g, '');

    // Validate: must be exactly 32 hex characters (standard UUID)
    if (!/^[0-9a-f]{32}$/i.test(hex)) {
      return '';
    }

    // Convert hex to binary string
    const match = hex.match(/.{1,2}/g);
    if (!match) {
      return '';
    }

    const binary = match.map((byte) => String.fromCharCode(parseInt(byte, 16))).join('');

    // Convert binary to base64 and make it URL safe
    return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  } catch {
    return '';
  }
}

/**
 * Decodes a URL-safe Base64 string back to a standard UUID.
 * This should be used server-side to resolve the ID from the URL.
 */
export function decodeId(encoded: string): string {
  if (!encoded) {
    return '';
  }

  try {
    // Restore base64 padding and characters
    let base64 = encoded.replace(/-/g, '+').replace(/_/g, '/');

    // Add padding if missing
    while (base64.length % 4) {
      base64 += '=';
    }

    const binary = atob(base64);

    // Convert binary to hex
    const hex = Array.from(binary)
      .map((char) => char.charCodeAt(0).toString(16).padStart(2, '0'))
      .join('');

    // Validate: decoded payload must be exactly 16 bytes (32 hex chars)
    if (hex.length !== 32) {
      return '';
    }

    // Insert hyphens for standard UUID format: 8-4-4-4-12
    return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
  } catch {
    return ''; // Return empty if decoding fails
  }
}

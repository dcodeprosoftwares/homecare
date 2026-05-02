/**
 * Converts various image hosting URLs to direct/embeddable image URLs.
 * Supports Google Drive sharing links.
 *
 * Google Drive links like:
 *   https://drive.google.com/file/d/FILE_ID/view?usp=drive_link
 *   https://drive.google.com/open?id=FILE_ID
 * are converted to the thumbnail endpoint which is more reliable for embedding:
 *   https://drive.google.com/thumbnail?id=FILE_ID&sz=w1600
 */
export function toDirectImageUrl(url: string | null | undefined): string {
  if (!url) return "";

  const fileId = extractGoogleDriveFileId(url);
  if (fileId) {
    return `https://drive.google.com/thumbnail?id=${fileId}&sz=w1600`;
  }

  // Not a recognized Drive link — return as-is
  return url;
}

/**
 * Check if a URL is a Google Drive link.
 */
export function isGoogleDriveUrl(url: string | null | undefined): boolean {
  if (!url) return false;
  return !!extractGoogleDriveFileId(url);
}

/**
 * Extract the file ID from various Google Drive URL formats.
 */
function extractGoogleDriveFileId(url: string): string | null {
  // Google Drive file link: /file/d/FILE_ID/...
  const driveFileMatch = url.match(/drive\.google\.com\/file\/d\/([^/?#]+)/);
  if (driveFileMatch) return driveFileMatch[1];

  // Google Drive open link: /open?id=FILE_ID
  const driveOpenMatch = url.match(/drive\.google\.com\/open\?id=([^&#]+)/);
  if (driveOpenMatch) return driveOpenMatch[1];

  // Google Drive uc link: /uc?id=FILE_ID or /uc?export=view&id=FILE_ID
  const driveUcMatch = url.match(/drive\.google\.com\/uc\?.*id=([^&#]+)/);
  if (driveUcMatch) return driveUcMatch[1];

  // Google Drive thumbnail link (already converted)
  const driveThumbnailMatch = url.match(/drive\.google\.com\/thumbnail\?.*id=([^&#]+)/);
  if (driveThumbnailMatch) return driveThumbnailMatch[1];

  return null;
}

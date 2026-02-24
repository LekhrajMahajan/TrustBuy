/**
 * Converts a relative image path like /images/foo.png into a full URL
 * that works on GitHub Pages and localhost.
 *
 * Uses Vite's import.meta.env.BASE_URL which is injected at build time:
 * - GitHub Pages → https://lekhrajmahajan.github.io/TrustBuy/images/foo.png
 * - Local        → http://localhost:5173/images/foo.png
 */
export const getImageUrl = (imagePath) => {
  if (!imagePath) return 'https://via.placeholder.com/300';

  // Already a full URL — return as-is
  if (imagePath.startsWith('http') || imagePath.startsWith('data:')) {
    return imagePath;
  }

  // import.meta.env.BASE_URL is set by Vite at build time to the configured
  // base path (e.g. "/TrustBuy/" on GitHub Pages, "/" everywhere else).
  // This is always correct and never needs runtime detection.
  const base = (import.meta.env.BASE_URL || '/').replace(/\/$/, '');

  const cleanPath = imagePath.startsWith('/') ? imagePath : `/${imagePath}`;

  // Return a root-relative URL — the browser will prepend the correct origin
  return `${base}${cleanPath}`;
};

import { normalizeUrl, pathSignature } from "@morph-ui/config";

export function normalizePageUrl(url: string) {
  const normalizedUrl = normalizeUrl(url);
  const signature = pathSignature(new URL(normalizedUrl).pathname);

  return {
    normalizedUrl,
    pathSignature: signature
  };
}

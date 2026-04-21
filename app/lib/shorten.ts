// Free link shortener via TinyURL (no auth required). Returns null on failure
// so callers can fall back to the full URL.
export async function shortenUrl(url: string): Promise<string | null> {
  try {
    const res = await fetch(
      `https://tinyurl.com/api-create.php?url=${encodeURIComponent(url)}`,
      { cache: "no-store" }
    );
    if (!res.ok) return null;
    const text = (await res.text()).trim();
    if (!text.startsWith("http")) return null;
    return text;
  } catch {
    return null;
  }
}

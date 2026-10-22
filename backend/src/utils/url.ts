/**
 * Canonical key for a repository URL, used for duplicate detection.
 *   https://www.GitHub.com/Foo/Bar.git/?tab=readme#x  ->  github.com/foo/bar
 */
export function normalizeRepoUrl(raw: string): string {
    const url = new URL(raw.trim());

    const host = url.hostname.toLowerCase().replace(/^www\./, "");

    const path = url.pathname
        .replace(/\/+$/, "")
        .replace(/\.git$/i, "")
        .toLowerCase();
    return `${host}${path}`;

}
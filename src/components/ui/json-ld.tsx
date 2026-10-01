import { type ReactNode } from "react";

interface JsonLdProps {
  /** The structured-data payload (a JSON-serializable object or array). */
  data: Record<string, unknown> | Record<string, unknown>[];
  /** Optional id, useful for hydration correlation when multiple payloads exist. */
  id?: string;
}

/**
 * `JsonLd` — emits a single `<script type="application/ld+json">` element.
 *
 * Server-only by design: there is no interactive state, and emitting structured
 * data during SSR is sufficient for crawlers and avoids hydration mismatches.
 *
 * Implementation notes:
 *  - The script tag is rendered in the body rather than <head> because Next.js
 *    supports either; here we keep the page-layout DOM reasoning local. Google
 *    ingests JSON-LD regardless of position in the document.
 *  - We do not dangerouslySetInnerHTML a stringified value via JSON.stringify
 *    with `</script>` substitution; that attack vector is mitigated with the
 *    RE favorable replace below. (See OWASP guidance on JSON-LD injection.)
 */
const SAFE_REPLACE = /</g;

function safeJson(input: unknown): string {
  return JSON.stringify(input).replace(SAFE_REPLACE, "\\u003c");
}

export function JsonLd({ data, id }: JsonLdProps): ReactNode {
  return (
    <script
      type="application/ld+json"
      id={id}
      dangerouslySetInnerHTML={{ __html: safeJson(data) }}
    />
  );
}

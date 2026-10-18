/**
 * Renders a JSON-LD structured-data block.
 *
 * The JSON goes in as the script's text children, not through
 * dangerouslySetInnerHTML (banned in this repo). React 19 writes a <script>'s
 * text content unescaped, so the JSON arrives intact, and it breaks up any
 * "</script" inside it. Swapping "<" for its < escape on top of that means
 * no string in the data can open a tag, whatever React does in future.
 *
 * Server-only: it renders nothing interactive and has no client counterpart.
 */
export function JsonLd({ data }: { data: object }) {
  return (
    <script type="application/ld+json">
      {JSON.stringify(data).replace(/</g, "\\u003c")}
    </script>
  );
}

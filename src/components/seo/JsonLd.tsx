// Escaping "<" prevents a value containing "</script>" from breaking out of
// the script tag — all data here is server-generated from our own content,
// not user input, but this is cheap insurance against that class of bug.
export function JsonLd({ data }: { data: object }) {
  const json = JSON.stringify(data).replace(/</g, "\\u003c");
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: json }} />;
}

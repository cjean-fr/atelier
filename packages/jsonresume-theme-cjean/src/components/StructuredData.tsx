export function StructuredData({ json }: { json: unknown }) {
  return <script type="application/ld+json">{JSON.stringify(json)}</script>;
}

import { Fill } from "@cjean-fr/jsx-flow";

// An AsyncIterable factory streams one patch per yielded item.
// Each yield produces an independent patch with the configured merge type.
function Feed() {
  return (
    <Fill target="feed" merge="append">
      {async function* () {
        let page = 1;
        while (true) {
          const rows = await fetchRows(page++);
          if (rows.length === 0) break;
          for (const row of rows) {
            yield <tr key={row.id}>{row.name}</tr>;
          }
        }
      }}
    </Fill>
  );
}

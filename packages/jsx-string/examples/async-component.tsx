/**
 * Async components — await inside the component body, no hooks needed.
 * The whole tree is awaited before renderToString returns.
 *
 * Run: `bun examples/async-component.tsx`
 */
import { renderToString } from "@cjean-fr/jsx-string";

async function fetchUser(id: string) {
  // Fake network call
  await new Promise((r) => setTimeout(r, 10));
  return { id, name: "Alice", email: "alice@example.com" };
}

async function UserCard({ id }: { id: string }) {
  const user = await fetchUser(id);
  return (
    <article class="card">
      <h2>{user.name}</h2>
      <p>
        <a href={`mailto:${user.email}`}>{user.email}</a>
      </p>
    </article>
  );
}

const html = await renderToString(<UserCard id="42" />);
console.log(html);

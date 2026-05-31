async function UserCard({ id }: { id: string }) {
  const user = await db.users.findById(id);
  return (
    <div class="card">
      <h2>{user.name}</h2>
      <p>{user.email}</p>
    </div>
  );
}

const html = await renderToString(<UserCard id="42" />);

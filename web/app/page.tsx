export default async function Home() {
  const res = await fetch("http://localhost:3000/api/hello", {
    cache: "no-store",
  });
  const data = await res.json();

  return (
    <main style={{ padding: 24, fontFamily: "system-ui" }}>
      <h1>System and Device</h1>
      <p>This data comes from a dynamic API:</p>
      <pre
        style={{
          background: "#f5f5f5",
          padding: 12,
          borderRadius: 8,
        }}
      >
        {JSON.stringify(data, null, 2)}
      </pre>
    </main>
  );
}


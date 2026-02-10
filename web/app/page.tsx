import { headers } from "next/headers";

export default async function Home() {
  const headersList = await headers();
  const host = headersList.get("host") ?? "system-and-device.vercel.app";

  const res = await fetch(`https://${host}/api/hello`, {
    cache: "no-store",
  });
  const data = await res.json();

  return (
    <main style={{ padding: 24, fontFamily: "system-ui" }}>
      <h1>System and Device</h1>
      <p>Data from API:</p>
      <pre style={{ background: "#f5f5f5", padding: 12, borderRadius: 8 }}>
        {JSON.stringify(data, null, 2)}
      </pre>
    </main>
  );
}



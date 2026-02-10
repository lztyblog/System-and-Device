type PageProps = {
  params: {
    slug: string;
  };
};

export default async function NotePage({ params }: PageProps) {
  const { slug } = params;

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/notes/${slug}`,
    { cache: "no-store" }
  );

  const note = await res.json();

  return (
    <div>
      <a href="/">← 返回首页</a>
      <h1>{note.title}</h1>
      <p>slug: {slug}</p>
      <p>{note.content}</p>
    </div>
  );
}

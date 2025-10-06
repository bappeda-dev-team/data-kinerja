import DetailClientPage from "./DetailClientPage";

type PageProps = {
  // Next sedang menganggap params async (Promise)
  params: Promise<{ slug: string }>;
};

export default async function Page({ params }: PageProps) {
  const { slug } = await params;           // ← await params
  return <DetailClientPage slug={slug} />;
}

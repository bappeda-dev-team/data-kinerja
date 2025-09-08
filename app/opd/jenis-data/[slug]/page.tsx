import DetailClientPage from "./DetailClientPage";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export default async function Page({ params }: PageProps) {
  const { slug } = await params;
  return <DetailClientPage slug={slug} />;
}

import DetailClientPage from "./DetailClientPage";

type PageProps = {
  params: { slug: string };
};

export default function Page({ params }: PageProps) {
  const { slug } = params;
  return <DetailClientPage slug={slug} />;
}

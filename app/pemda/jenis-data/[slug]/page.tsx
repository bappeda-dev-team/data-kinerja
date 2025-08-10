import DetailClientPage from "./DetailClientPage";

type PageProps = {
  params: { slug: string };
};

export default function Page({ params }: PageProps) {
  return <DetailClientPage slug={params.slug} />;
}

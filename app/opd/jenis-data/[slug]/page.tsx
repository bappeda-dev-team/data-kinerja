import DetailClientPageOPD from "./DetailClientPage";

type PageProps = {
  params: { slug: string };
};

export default function Page({ params }: PageProps) {
  return <DetailClientPageOPD slug={params.slug} />;
}

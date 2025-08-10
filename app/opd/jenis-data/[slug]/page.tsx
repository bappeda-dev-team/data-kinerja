import DetailClientPageOPD from "./DetailClientPage";

export default function Page({ params }: { params: { slug: string } }) {
  return <DetailClientPageOPD slug={params.slug} />;
}

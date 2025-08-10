import DetailClientPage from "./DetailClientPage";

export default function Page({ params }: { params: { slug: string } }) {
  return <DetailClientPage slug={params.slug} />;
}
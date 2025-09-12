import DetailClientPage from "./DetailClientPage";

// Tipe diubah untuk menandakan params adalah sebuah Promise
type PageProps = {
  params: Promise<{ slug: string }>;
};


export default async function Page({ params }: PageProps) {
 
  const { slug } = await params;
  
  return <DetailClientPage slug={slug} />;
}
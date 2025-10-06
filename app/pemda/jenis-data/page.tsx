// ❗ JANGAN beri "use client" di file ini
// Matikan SSG/ISR utk halaman ini
export const dynamic = "force-dynamic";
export const revalidate = 0;

import ClientPage from "./ClientPage";

export default function Page() {
  return <ClientPage />;
}

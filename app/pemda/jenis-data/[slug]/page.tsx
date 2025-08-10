// src/app/pemda/jenis-data/[slug]/page.tsx
'use client';
import { Home } from "lucide-react";
import Link from "next/link";
import JenisDataDetailTable from "../_components/JenisDataTable"; // Asumsi tabel kompleks sudah direname

// Komponen ini akan menerima params dari URL
const DetailJenisDataPage = ({ params }: { params: { slug: string } }) => {
  const dataName = params.slug.toUpperCase(); // Contoh: IKU atau RKPD

  return (
     <div>
      {/* Breadcrumbs */}
      <div className="flex items-center text-sm text-gray-500 mb-4">
         <Link href="/pemda/jenis-data" className="hover:underline flex items-center gap-1"><Home size={16}/> Pemda</Link>
         <span className="mx-2">/</span>
         <Link href="/pemda/jenis-data" className="hover:underline">Jenis Data</Link>
         <span className="mx-2">/</span>
         <span className="font-semibold text-gray-800">{dataName}</span>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
         <h2 className="text-xl font-bold text-sidebar-bg mb-4">
            JENIS DATA: {dataName}
         </h2>
         <JenisDataDetailTable />
      </div>
     </div>
  );
};

export default DetailJenisDataPage;
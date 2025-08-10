'use client';

import { Home, Plus } from "lucide-react";
import Link from "next/link";
import PageHeader from "@/app/components/layout/PageHeader";
import DataTable from "../_components/DataTable";

export default function DetailClientPage({ slug }: { slug: string }) {
  const dataName = slug.toUpperCase();

  return (
     <div>
      <PageHeader title={dataName} /> 
      <div className="bg-white p-6 rounded-b-lg shadow-md border border-gray-300 border-t-0">
        <div className="flex justify-between items-center mb-4">
            <div className="flex items-center text-sm text-gray-500">
                <Home size={16} />
                <span className="mx-2">/</span>
                <Link href="/pemda" className="hover:underline">Pemda</Link>
                <span className="mx-2">/</span>
                <Link href="/pemda/jenis-data" className="hover:underline">Jenis Data</Link>
                <span className="mx-2">/</span>
                <span className="font-semibold text-gray-800">{dataName}</span>
            </div>
            <button
                className="flex items-center gap-2 bg-button-blue text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors"
              >
              <Plus size={20} />
              Tambah Data
            </button>
        </div>

         <h2 className="text-xl font-bold text-sidebar-bg mb-4">
            JENIS DATA: {dataName}
         </h2>
         <DataTable />
      </div>
     </div>
  );
};
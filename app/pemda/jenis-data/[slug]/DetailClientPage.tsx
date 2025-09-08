'use client';

import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import Link from "next/link";
import PageHeader from "@/app/components/layout/PageHeader";
import DataTable from "../_components/DataTable"; 
import AddDataTableModal from "../_components/AddDataTableModal";

export default function DetailClientPageOPD({ slug }: { slug: string }) {
  const dataName = slug.toUpperCase();
  const [openModal, setOpenModal] = useState(false);
  const [dataList, setDataList] = useState<any[]>([]);

  const fetchData = async () => {
    try {
      const res = await fetch(`https://alurkerja.zeabur.app/jenisdata/${slug}`);
      const json = await res.json();
      setDataList(json.data || []);
    } catch (err) {
      console.error("Gagal fetch:", err);
    }
  };

  useEffect(() => {
    fetchData();
  }, [slug]);

  return (
    <div>
      <PageHeader /> 

      <div className="bg-white p-6 rounded-b-lg shadow-md border border-gray-300 border-t-0">
        {/* Breadcrumb + Tombol */}
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center text-sm text-gray-500">
            <Link href="/dashboard" className="hover:underline">Dashboard</Link>
            <span className="mx-2">/</span>
            <Link href="/pemda" className="hover:underline">Pemda</Link>
            <span className="mx-2">/</span>
            <Link href="/pemda/jenis-data" className="hover:underline">Jenis Data</Link>
            <span className="mx-2">/</span>
            <span className="font-semibold text-gray-800">{dataName}</span>
          </div>

          {/* Tombol Tambah Data */}
          <button
            onClick={() => setOpenModal(true)}
            className="flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-bold py-2 px-4 rounded-lg hover:opacity-90 transition-colors"
          >
            <Plus size={20} />
            Tambah Data
          </button>
        </div>

        {/* Judul */}
        <h2 className="text-xl font-bold text-sidebar-bg mb-4">
          JENIS DATA: {dataName}
        </h2>

        {/* Tabel utama */}
        <DataTable />
      </div>

      {/* Modal Tambah Data */}
      <AddDataTableModal
        isOpen={openModal}
        onClose={() => setOpenModal(false)}
      />
    </div>
  );
};

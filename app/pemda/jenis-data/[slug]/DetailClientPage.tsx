'use client';

import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import Link from "next/link";
import PageHeader from "@/app/components/layout/PageHeader";
import DataTable from "../_components/DataTable";
import AddDataTableModal from "../_components/AddDataTableModal";
import EditDataTableModal from "../_components/EditDataTableModal";

export default function DetailClientPageOPD({ slug }: { slug: string }) {
  const dataName = slug.toUpperCase();
  const [openModalAdd, setOpenModalAdd] = useState(false);
  const [openModalEdit, setOpenModalEdit] = useState(false);
  const [dataList, setDataList] = useState<any[]>([]);
  const [dataItemToEdit, setDataItemToEdit] = useState(null);

  const fetchData = async () => {
    try {
      const res = await fetch(`https://alurkerja.zeabur.app/datakinerjapemda/list/${slug}`);
      const json = await res.json();
      setDataList(json.data || []); 
    } catch (err) {
      console.error("Gagal fetch data kinerja:", err);
      setDataList([]); 
    }
  };

  useEffect(() => {
    fetchData();
  }, [slug]);

// Create a success handler for the modal
  const handleAddSuccess = () => {
    setOpenModalAdd(false); // 1. Close the modal
    fetchData();         // 2. Refresh the data list
  };

  const handleEditSuccess = async () => {
    setOpenModalEdit(false); // 1. Close the modal
    await fetchData(); // 2. Refresh the data list
  };

  // Handler for editing data
  const handleEdit = (item: any) => {
    // TODO: Implement your edit logic, e.g., open an edit modal
    console.log("Edit item:", item);
    setDataItemToEdit(item);
    // open an edit modal
    setOpenModalEdit(true);
  };

  const handleDelete = async (id: number) => {
  // 1. Konfirmasi dari pengguna tetap ada
  if (window.confirm("Apakah Anda yakin ingin menghapus data ini?")) {
    
    try {
      // 2. Lakukan panggilan API menggunakan fetch dengan metode DELETE
      const response = await fetch(`https://alurkerja.zeabur.app/datakinerjapemda/${id}`, {
        method: 'DELETE',
      });

      // 3. Periksa apakah respons dari server menandakan sukses
      if (!response.ok) {
        // Jika gagal, lempar error untuk ditangkap oleh blok catch
        throw new Error('Gagal menghapus data dari server.');
      }

      // 4. Jika berhasil, beri tahu pengguna dan muat ulang data di tabel
      alert('Data berhasil dihapus!');
      fetchData(); // Asumsi Anda punya fungsi ini untuk refresh data tabel

    } catch (error) {
      // 5. Jika terjadi error (baik dari fetch atau dari server), tampilkan pesan error
      console.error("Gagal menghapus data:", error);
      alert(error);
    }
  }
};

  return (
    <div>
      <PageHeader />

      <div className="bg-white p-6 rounded-b-lg shadow-md border border-gray-300 border-t-0">
        {/* ... (your existing breadcrumb and button code) ... */}
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

          <button
            onClick={() => setOpenModalAdd(true)}
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

        {/* Tabel utama - FIXED */}
        <DataTable
          dataList={dataList}
          onUpdate={handleEdit}
          onDelete={handleDelete}
        />
      </div>

      {/* Modal Tambah Data */}
      <AddDataTableModal
        isOpen={openModalAdd}
        onClose={() => setOpenModalAdd(false)}
        onSuccess={handleAddSuccess} 
        jenisDataId={slug} 
      />

      {/* Modal Edit Data */}
      <EditDataTableModal
        isOpen={openModalEdit}
        onClose={() => setOpenModalEdit(false)}
        onSuccess={handleEditSuccess}
        jenisDataId={slug}
        dataItem={dataItemToEdit}
      />
    </div>
  );
};
"use client";

import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import Link from "next/link";
import PageHeader from "@/app/components/layout/PageHeader";
import DataTable from "../_components/DataTable";
import AddDataTableModal from "../_components/AddDataTableModal";
import EditDataTableModal from "../_components/EditDataTableModal";

// ✅ Definisikan tipe data sesuai struktur API
type Target = {
  tahun: string;
  satuan: string;
  target: string;
};

export interface DataKinerja {
  id: number;
  jenis_data_id: number;
  nama_data: string;
  rumus_perhitungan: string;
  sumber_data: string;
  instansi_produsen_data: string;
  keterangan: string;
  target: {
    tahun: string;
    satuan: string;
    target: string;
  }[];
}

export default function DetailClientPageOPD({ slug }: { slug: string }) {
  const dataName = slug.toUpperCase();
  const [openModalAdd, setOpenModalAdd] = useState(false);
  const [openModalEdit, setOpenModalEdit] = useState(false);
  const [dataList, setDataList] = useState<DataKinerja[]>([]);
  const [dataItemToEdit, setDataItemToEdit] = useState<DataKinerja | null>(
    null
  );

  // ✅ Fungsi fetch data
  const fetchData = async () => {
    try {
      const res = await fetch(
        `https://alurkerja.zeabur.app/datakinerjapemda/list/${slug}`
      );
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

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

  // ✅ Success handler
  const handleAddSuccess = () => {
    setOpenModalAdd(false);
    fetchData();
  };

  const handleEditSuccess = () => {
    setOpenModalEdit(false);
    fetchData();
  };

  // ✅ Edit handler
  const handleEdit = (item: DataKinerja) => {
    setDataItemToEdit({
      id: item.id, // pastikan item: DataKinerja
      jenis_data_id: item.jenis_data_id || 0,
      nama_data: item.nama_data || "",
      rumus_perhitungan: item.rumus_perhitungan || "",
      sumber_data: item.sumber_data || "",
      instansi_produsen_data: item.instansi_produsen_data || "",
      keterangan: item.keterangan || "",
      target: item.target?.length
        ? item.target
        : [
            {
              tahun: new Date().getFullYear().toString(),
              satuan: "",
              target: "",
            },
          ],
    });
    setOpenModalEdit(true);
  };

  // ✅ Delete handler
  const handleDelete = async (id: number) => {
    if (!window.confirm("Apakah Anda yakin ingin menghapus data ini?")) return;

    try {
      const response = await fetch(
        `https://alurkerja.zeabur.app/datakinerjapemda/${id}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) throw new Error("Gagal menghapus data dari server.");

      alert("✅ Data berhasil dihapus!");
      fetchData();
    } catch (error) {
      console.error("Gagal menghapus data:", error);
      alert("❌ Terjadi kesalahan saat menghapus data.");
    }
  };

  return (
    <div>
      <PageHeader />

      <div className="bg-white p-6 rounded-b-lg shadow-md border border-gray-300 border-t-0">
        {/* Breadcrumb */}
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center text-sm text-gray-500">
            <Link href="/dashboard" className="hover:underline">
              Dashboard
            </Link>
            <span className="mx-2">/</span>
            <Link href="/pemda" className="hover:underline">
              Pemda
            </Link>
            <span className="mx-2">/</span>
            <Link href="/pemda/jenis-data" className="hover:underline">
              Jenis Data
            </Link>
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

        {/* DataTable */}
        <DataTable
          dataList={dataList}
          onUpdate={handleEdit}
          onDelete={handleDelete}
        />
      </div>

      {/* Modal Tambah */}
      <AddDataTableModal
        isOpen={openModalAdd}
        onClose={() => setOpenModalAdd(false)}
        onSuccess={handleAddSuccess}
        jenisDataId={slug}
      />

      {/* Modal Edit */}
      {openModalEdit && dataItemToEdit && (
        <EditDataTableModal
          isOpen={openModalEdit}
          onClose={() => setOpenModalEdit(false)}
          onSuccess={handleEditSuccess}
          jenisDataId={slug}
          dataItem={dataItemToEdit}
        />
      )}
    </div>
  );
}

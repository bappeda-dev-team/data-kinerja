"use client";
import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import Link from "next/link";
import JenisDataTable from "./_components/JenisDataTable";
import AddDataModal from "./_components/AddDataModal";
import PageHeader from "@/app/components/layout/PageHeader";
import { FiHome } from "react-icons/fi";

// Tipe data untuk jenis data
interface JenisData {
  id: number;
  jenis_data: string;
}

const JenisDataPagePemda = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [jenisDataList, setJenisDataList] = useState<JenisData[]>([]);

  // Fetch data dari API
  const fetchData = async () => {
    try {
      const res = await fetch("https://alurkerja.zeabur.app/jenisdata");
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      const json = await res.json();
      const mappedData: JenisData[] = (json.data || []).map(
        (item: { id: number; nama_data?: string; jenis_data?: string }) => ({
          id: item.id,
          jenis_data: item.jenis_data ?? item.nama_data ?? "", // pakai nullish coalescing
        })
      );

      setJenisDataList(mappedData);
    } catch (err) {
      console.error("Gagal fetch:", err);
      setJenisDataList([]);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Hapus data
  const handleDelete = async (id: number) => {
    if (!confirm("Yakin mau hapus data ini?")) return;

    try {
      const res = await fetch(`https://alurkerja.zeabur.app/jenisdata/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Gagal hapus data");

      // Hapus dari state
      setJenisDataList((prev) => prev.filter((item) => item.id !== id));
      alert("Data berhasil dihapus!");
    } catch (err) {
      console.error(err);
      alert("Terjadi kesalahan saat menghapus data");
    }
  };

  return (
    <div>
      {/* <PageHeader /> */}
      <div className="bg-white p-6 rounded-b-lg shadow-md border border-gray-300 border-t-0">
        {/* Breadcrumb */}
        <div className="flex items-center mb-4">
          <div className="flex items-center">
                <a href="/" className=""><FiHome size={16}/></a>
            </div>
          <span className="mx-2">/</span>
          <Link href="/pemda" className="hover:underline">
            Pemda
          </Link>
          <span className="mx-2">/</span>
          <span className="font-semibold text-gray-800">Jenis Data</span>
        </div>

        {/* Header + Button */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-sidebar-bg">JENIS DATA</h2>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-bold py-2 px-4 rounded-lg hover:opacity-90 transition-colors"
          >
            <Plus size={20} />
            Tambah Jenis Data
          </button>
        </div>

        {/* Tabel */}
        <JenisDataTable jenisDataList={jenisDataList} onDelete={handleDelete} />
      </div>

      {/* Modal Tambah */}
      <AddDataModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={fetchData} // refresh data setelah tambah
      />
    </div>
  );
};

export default JenisDataPagePemda;

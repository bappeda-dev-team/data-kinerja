"use client";

import { useEffect, useState, useCallback } from "react";
import { Plus } from "lucide-react";
import Link from "next/link";
import axios, { AxiosError } from "axios"; // Import Axios
import JenisDataTable from "./_components/JenisDataTable";
import AddDataModal from "./_components/AddDataModal";
import { FiHome } from "react-icons/fi";
import { getSessionId } from "@/app/components/lib/Cookie";
import { useBrandingContext } from "@/app/context/BrandingContext";

interface JenisData {
  id: number;
  jenis_data: string;
}

type Target = {
  tahun: string;
  satuan: string;
  target: string | number;
};

type DataKinerjaItem = {
  id: number;
  jenis_data_id?: number;
  nama_data: string;
  rumus_perhitungan: string;
  sumber_data: string;
  instansi_produsen_data: string;
  keterangan: string;
  target: Target[];
};

type ListResponseItem = {
  id: number; // id jenis data
  jenis_data: string;
  data_kinerja: DataKinerjaItem[];
};

// Interface untuk Response Wrapper sesuai Postman
interface ApiResponse<T> {
  status: number;
  success: boolean;
  message: string;
  data: T;
  timestamp: string;
}

export default function ClientPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [jenisDataList, setJenisDataList] = useState<JenisData[]>([]);
  const [dataKinerjaMap, setDataKinerjaMap] = useState<
    Record<number, DataKinerjaItem[]>
  >({});
  const [authToken, setAuthToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { branding } = useBrandingContext();

  // Ambil sessionId SETELAH mount
  useEffect(() => {
    try {
      setAuthToken(getSessionId());
    } catch {
      setAuthToken(null);
    }
  }, []);

  const fetchData = useCallback(async () => {
    if (!authToken) return;
    if (!branding?.api_perencanaan) {
      console.error("api_perencanaan belum diset di BrandingContext");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Menggunakan Axios & Endpoint sesuai Postman: GET {{base_url}}/datakinerjapemda/list
      const response = await axios.get<ApiResponse<ListResponseItem[]>>(
        `${branding.api_perencanaan}/datakinerjapemda/list`, 
        {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            "X-Session-Id": authToken,
          },
        }
      );

      console.log("[Pemda JenisData] status:", response.status);
      console.log("[Pemda JenisData] data:", response.data);

      const list = Array.isArray(response.data.data) ? response.data.data : [];

      // List untuk header accordion
      const mappedJenis: JenisData[] = list.map((item) => ({
        id: item.id,
        jenis_data: item.jenis_data ?? "",
      }));

      // Map jenis_data_id -> data_kinerja[]
      const kinerjaMap: Record<number, DataKinerjaItem[]> = {};
      list.forEach((item) => {
        kinerjaMap[item.id] = Array.isArray(item.data_kinerja)
          ? item.data_kinerja
          : [];
      });

      setJenisDataList(mappedJenis);
      setDataKinerjaMap(kinerjaMap);

    } catch (err) {
      console.error("Gagal fetch:", err);
      setJenisDataList([]);
      setDataKinerjaMap({});
      
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || "Terjadi kesalahan pada server API");
      } else {
        setError("Periksa koneksi / server API");
      }
    } finally {
      setLoading(false);
    }
  }, [authToken, branding]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleDelete = useCallback(
    async (id: number) => {
      if (!branding?.api_perencanaan) {
        alert("Base URL api_perencanaan belum diset.");
        return;
      }
      if (!authToken) {
        alert("Session tidak ditemukan, silakan login ulang.");
        return;
      }
      if (!confirm("Yakin mau hapus jenis data ini?")) return;

      try {
        // Menggunakan Axios & Endpoint sesuai Postman: DELETE {{base_url}}/jenisdata/:id
        const response = await axios.delete(
          `${branding.api_perencanaan}/jenisdata/${id}`,
          {
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
              "X-Session-Id": authToken,
            },
          }
        );

        console.log("[Delete JenisData] status:", response.status);

        // Hapus dari state list & map jika sukses
        setJenisDataList((prev) => prev.filter((item) => item.id !== id));
        setDataKinerjaMap((prev) => {
          const copy = { ...prev };
          delete copy[id];
          return copy;
        });

        alert("Data berhasil dihapus!");

      } catch (err) {
        console.error(err);
        if (axios.isAxiosError(err)) {
             alert(`Gagal hapus data: ${err.response?.data?.message || err.message}`);
        } else {
             alert("Terjadi kesalahan saat menghapus data");
        }
      }
    },
    [authToken, branding]
  );

  // Skeleton sederhana saat nunggu token tersedia
  if (authToken === null) {
    return (
      <div className="bg-white p-6 rounded-b-lg shadow-md border border-gray-300 border-t-0">
        <div className="animate-pulse h-6 w-40 bg-gray-200 rounded mb-4" />
        <div className="h-40 bg-gray-100 rounded" />
      </div>
    );
  }

  return (
    <div>
      <div className="bg-white p-6 rounded-b-lg shadow-md border border-gray-300 border-t-0">
        {/* Breadcrumb */}
        <div className="flex items-center mb-4">
          <div className="flex items-center">
            <Link href="/">
              <FiHome size={16} />
            </Link>
          </div>
          <span className="mx-2">/</span>
          <Link href="/pemda" className="hover:underline">
            Pemda
          </Link>
          <span className="mx-2">/</span>
          <span className="font-semibold text-gray-800">
            Jenis Kelompok Data
          </span>
        </div>

        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-sidebar-bg">
            JENIS KELOMPOK DATA
          </h2>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-bold py-2 px-4 rounded-lg hover:opacity-90 transition-colors"
          >
            <Plus size={20} />
            Tambah Jenis Kelompok Data
          </button>
        </div>

        {error && <p className="text-red-500 mb-3">{error}</p>}
        {loading && <p className="mb-3">Memuat…</p>}

        <JenisDataTable
          jenisDataList={jenisDataList}
          dataKinerjaMap={dataKinerjaMap}
          onReload={fetchData}
          onDelete={handleDelete}
        />
      </div>

      <AddDataModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={fetchData}
        authToken={authToken}
      />
    </div>
  );
}
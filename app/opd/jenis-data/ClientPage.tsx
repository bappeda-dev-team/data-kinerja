"use client";

import { useEffect, useState, useCallback } from "react";
import { Plus } from "lucide-react";
import Link from "next/link";
import JenisDataTable from "./_components/JenisDataTable";
import AddDataModal from "./_components/AddDataModal";
import { FiHome } from "react-icons/fi";
import { getSessionId } from "@/app/components/lib/Cookie";

interface JenisData {
  id: number;
  jenis_data: string;
}

// TODO: harcoded, ambil dari env
const API_BASE = "https://testapi.kertaskerja.cc/api/v1";

export default function ClientPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [jenisDataList, setJenisDataList] = useState<JenisData[]>([]);
  const [authToken, setAuthToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Ambil sessionId SETELAH mount (hindari localStorage saat prerender)
  useEffect(() => {
    try {
      setAuthToken(getSessionId());
    } catch {
      setAuthToken(null);
    }
  }, []);

  const fetchData = useCallback(async () => {
    if (!authToken) return;

    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE}/alur-kerja/jenisdata`, {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "X-Session-Id": authToken,
        },
        cache: "no-store",
      });

      const ct = res.headers.get("content-type") || "";
      const raw = await res.text();

      console.log("[JenisData] status:", res.status);
      console.log("[JenisData] content-type:", ct);
      console.log("[JenisData] body preview:", raw.slice(0, 200));

      if (!ct.includes("application/json")) throw new Error("Non-JSON response");
      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const json = JSON.parse(raw);
      const mapped: JenisData[] = (json.data || []).map(
        (item: { id: number; nama_data?: string; jenis_data?: string }) => ({
          id: item.id,
          jenis_data: item.jenis_data ?? item.nama_data ?? "",
        })
      );

      setJenisDataList(mapped);
    } catch (err) {
      console.error("Gagal fetch:", err);
      setJenisDataList([]);
      setError("Periksa koneksi / server API");
    } finally {
      setLoading(false);
    }
  }, [authToken]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleDelete = useCallback(
    async (id: number) => {
      if (!confirm("Yakin mau hapus data ini?")) return;
      try {
        const res = await fetch(`${API_BASE}/alur-kerja/jenisdata/${id}`, {
          method: "DELETE",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            "X-Session-Id": authToken ?? "",
          },
        });

        const raw = await res.text();
        console.log("[Delete JenisData] status:", res.status, "body:", raw.slice(0, 200));

        if (!res.ok) throw new Error("Gagal hapus data");
        setJenisDataList((prev) => prev.filter((item) => item.id !== id));
        alert("Data berhasil dihapus!");
      } catch (err) {
        console.error(err);
        alert("Terjadi kesalahan saat menghapus data");
      }
    },
    [authToken]
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
          <span className="font-semibold text-gray-800">Jenis Kelompok Data</span>
        </div>

        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-sidebar-bg">JENIS KELOMPOK DATA</h2>
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

        <JenisDataTable jenisDataList={jenisDataList} onDelete={handleDelete} />
      </div>

      <AddDataModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={fetchData}
      />
    </div>
  );
}

"use client";

import { useEffect, useState, useCallback } from "react";
import { Plus } from "lucide-react";
import Link from "next/link";
import JenisDataTable from "./_components/JenisDataTable";
import AddDataModal from "./_components/AddDataModal";
import { FiHome } from "react-icons/fi";
import { getSessionId, getCookie } from "@/app/components/lib/Cookie";

interface JenisData {
  id: number;
  jenis_data: string;
}

interface OptionType {
  value: string; // diasumsikan = kode_opd
  label: string;
}

const API_BASE = "https://testapi.kertaskerja.cc/";

// helper parse cookie react-select
const safeParseOption = (v: string | null | undefined): OptionType | null => {
  if (!v) return null;
  try {
    const o = JSON.parse(v);
    if (o && typeof o.value === "string" && typeof o.label === "string") return o;
  } catch {}
  return null;
};

export default function ClientPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [jenisDataList, setJenisDataList] = useState<JenisData[]>([]);
  const [authToken, setAuthToken] = useState<string | null>(null);
  const [kodeOpd, setKodeOpd] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Ambil token & kode_opd sekali saat mount
  useEffect(() => {
    try {
      setAuthToken(getSessionId());
    } catch {
      setAuthToken(null);
    }
    const opdCookie = safeParseOption(getCookie("selectedDinas"));
    setKodeOpd(opdCookie?.value ?? ""); // pastikan ini memang KODE OPD yang diminta API
  }, []);

  const fetchData = useCallback(async () => {
    if (!authToken || !kodeOpd) return;

    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`https://alurkerja.zeabur.app/datakinerjaopd/list/${kodeOpd}`, {
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

      if (!ct.includes("application/json")) throw new Error("Non-JSON response");
      if (!res.ok) throw new Error(`HTTP ${res.status} – ${raw.slice(0, 200)}`);

      const json = JSON.parse(raw);
      const mapped: JenisData[] = (json.data || []).map(
        (item: { id: number; jenis_data?: string; nama_data?: string }) => ({
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
  }, [authToken, kodeOpd]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Tidak ada endpoint DELETE di spec → nonaktifkan hapus atau ganti ke “arsipkan”
  const handleDelete = useCallback(async (_id: number) => {
    alert("Endpoint DELETE untuk Jenis Data OPD tidak tersedia di API. Gunakan PUT (update) atau hubungi backend jika butuh hapus.");
  }, []);

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
          <Link href="/"><FiHome size={16} /></Link>
          <span className="mx-2">/</span>
          <Link href="/opd" className="hover:underline">OPD</Link>
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

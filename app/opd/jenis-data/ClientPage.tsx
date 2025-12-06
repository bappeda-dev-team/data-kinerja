"use client";

import { useEffect, useState, useCallback } from "react";
import { Plus } from "lucide-react";
import Link from "next/link";
import JenisDataTable from "./_components/JenisDataTable";
import AddDataModal from "./_components/AddDataModal";
import { FiHome } from "react-icons/fi";
import { getSessionId, getCookie } from "@/app/components/lib/Cookie";
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
  id: number;
  jenis_data: string;
  data_kinerja: DataKinerjaItem[];
};

interface OptionType {
  value: string; // diasumsikan = kode_opd
  label: string;
}

// helper parse cookie react-select
const safeParseOption = (v: string | null | undefined): OptionType | null => {
  if (!v) return null;
  try {
    const o = JSON.parse(v);
    if (o && typeof o.value === "string" && typeof o.label === "string")
      return o;
  } catch {}
  return null;
};

export default function ClientPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [jenisDataList, setJenisDataList] = useState<JenisData[]>([]);
  const [dataKinerjaMap, setDataKinerjaMap] = useState<
    Record<number, DataKinerjaItem[]>
  >({});
  const [authToken, setAuthToken] = useState<string | null>(null);
  const [kodeOpd, setKodeOpd] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { branding } = useBrandingContext();

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
      const res = await fetch(
        `${branding.api_perencanaan}/api/v1/alur-kerja/datakinerjaopd/list/${kodeOpd}`,
        {
          method: "GET",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            "X-Session-Id": authToken,
          },
          cache: "no-store",
        },
      );

      const ct = res.headers.get("content-type") || "";
      const raw = await res.text();

      if (!ct.includes("application/json"))
        throw new Error("Non-JSON response");
      if (!res.ok)
        throw new Error(`HTTP ${res.status} – ${raw.slice(0, 200)}`);

      const json = JSON.parse(raw) as { data?: ListResponseItem[] };

      const list: ListResponseItem[] = json.data ?? [];

      // list jenis data untuk header accordion
      const mappedJenis: JenisData[] = list.map((item) => ({
        id: item.id,
        jenis_data: item.jenis_data,
      }));

      // map data_kinerja per jenis_data_id
      const map: Record<number, DataKinerjaItem[]> = {};
      list.forEach((item) => {
        map[item.id] = item.data_kinerja ?? [];
      });

      setJenisDataList(mappedJenis);
      setDataKinerjaMap(map);
    } catch (err) {
      console.error("Gagal fetch:", err);
      setJenisDataList([]);
      setDataKinerjaMap({});
      setError("Periksa koneksi / server API");
    } finally {
      setLoading(false);
    }
  }, [authToken, kodeOpd, branding.api_perencanaan]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Tidak ada endpoint DELETE jenis data → beri info
  const handleDelete = useCallback(async (_id: number) => {
    alert(
      "Endpoint DELETE untuk Jenis Data OPD tidak tersedia di API. " +
        "Gunakan PUT (update) atau hubungi backend jika butuh hapus.",
    );
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
          <Link href="/">
            <FiHome size={16} />
          </Link>
          <span className="mx-2">/</span>
          <Link href="/opd" className="hover:underline">
            OPD
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
          kodeOpd={kodeOpd}
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

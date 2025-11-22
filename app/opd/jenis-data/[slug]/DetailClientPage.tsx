"use client";

import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import Link from "next/link";
import PageHeader from "@/app/components/layout/PageHeader";
import DataTable from "../_components/DataTable";
import AddDataTableModal from "../_components/AddDataTableModal";
import EditDataTableModal from "../_components/EditDataTableModal";
import { getSessionId, getCookie } from "@/app/components/lib/Cookie";

// === Struktur data sesuai contoh response API ===
type JenisData = {
  id: number;
  jenis_data: string;
  kode_opd?: string;
  nama_opd?: string;
};

export default function DetailClientPageOPD({ slug }: { slug: string }) {
  const dataName = slug.toUpperCase();
  const [openModalAdd, setOpenModalAdd] = useState(false);
  const [openModalEdit, setOpenModalEdit] = useState(false);
  const [dataList, setDataList] = useState<JenisData[]>([]);
  const [authToken, setAuthToken] = useState<string | null>(null);

  // --- Ambil token dari cookie
  useEffect(() => {
    try {
      setAuthToken(getSessionId());
    } catch {
      setAuthToken(null);
    }
  }, []);

  // --- Ambil kode_opd dari cookie “selectedDinas”
  const getKodeOpd = () => {
    try {
      const raw = getCookie("selectedDinas");
      const obj = raw ? JSON.parse(raw) : null;
      return obj?.value ?? null;
    } catch {
      return null;
    }
  };

  // ✅ Fungsi Fetch List Jenis Data OPD
  const fetchData = async () => {
    const kode_opd = getKodeOpd();
    if (!kode_opd) {
      console.warn("⚠️ Kode OPD belum dipilih di header.");
      setDataList([]);
      return;
    }

    try {
      const res = await fetch(
        `https://alurkerja.zeabur.app/jenisdataopd/list/${kode_opd}`,
        {
          method: "GET",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            // API kamu nggak wajib X-Session-Id, tapi kalau nanti butuh, tetap bisa aktifkan:
            ...(authToken ? { "X-Session-Id": authToken } : {}),
          },
          cache: "no-store",
        }
      );

      const json = await res.json();
      if (!res.ok) throw new Error(`HTTP ${res.status}: ${json.message || ""}`);

      // Pastikan format data array
      const list = Array.isArray(json.data) ? json.data : [];
      setDataList(list);
    } catch (err) {
      console.error("❌ Gagal fetch jenis data OPD:", err);
      setDataList([]);
    }
  };

  // --- Jalankan fetch saat token siap
  useEffect(() => {
    if (authToken !== undefined) fetchData();
  }, [authToken, slug]);

  return (
    <div>
      {/* <PageHeader /> */}

      <div className="bg-white p-6 rounded-b-lg shadow-md border border-gray-300 border-t-0">
        {/* Breadcrumb */}
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center text-sm text-gray-500">
            <Link href="/dashboard" className="hover:underline">
              Dashboard
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

          <button
            onClick={() => setOpenModalAdd(true)}
            className="flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-bold py-2 px-4 rounded-lg hover:opacity-90 transition-colors"
          >
            <Plus size={20} />
            Tambah Data
          </button>
        </div>

        <h2 className="text-xl font-bold text-sidebar-bg mb-4">
          LIST JENIS DATA OPD
        </h2>

        {/* DataTable sederhana */}
        <DataTable
          dataList={dataList as any}
          onUpdate={() => {}}
          onDelete={() => {}}
        />
      </div>

      {/* Modal Tambah */}
      <AddDataTableModal
        isOpen={openModalAdd}
        onClose={() => setOpenModalAdd(false)}
        onSuccess={fetchData}
        jenisDataId={slug}
      />

      {/* Modal Edit */}
      {openModalEdit && (
        <EditDataTableModal
          isOpen={openModalEdit}
          onClose={() => setOpenModalEdit(false)}
          onSuccess={fetchData}
          jenisDataId={slug}
          dataItem={null as any}
        />
      )}
    </div>
  );
}

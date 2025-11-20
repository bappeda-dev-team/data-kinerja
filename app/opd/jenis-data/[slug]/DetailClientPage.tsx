"use client";

import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import Link from "next/link";
import PageHeader from "@/app/components/layout/PageHeader";
import DataTable from "../_components/DataTable";
import AddDataTableModal from "../_components/AddDataTableModal";
import EditDataTableModal from "../_components/EditDataTableModal";
import { getSessionId, getCookie } from "@/app/components/lib/Cookie";

// === Tipe untuk LIST JENIS DATA OPD ===
type JenisData = {
  id: number;
  jenis_data: string;
};

export default function DetailClientPageOPD({ slug }: { slug: string }) {
  const dataName = slug.toUpperCase();
  const [openModalAdd, setOpenModalAdd] = useState(false);
  const [openModalEdit, setOpenModalEdit] = useState(false);

  // <-- GANTI: list yang ditampilkan adalah list jenis data OPD
  const [dataList, setDataList] = useState<JenisData[]>([]);

  const [authToken, setAuthToken] = useState<string | null>(null);

  useEffect(() => {
    try {
      setAuthToken(getSessionId());
    } catch {
      setAuthToken(null);
    }
  }, []);

  // Ambil kode_opd dari cookie "selectedDinas" (value = kode_opd)
  const getKodeOpd = () => {
    try {
      const raw = getCookie("selectedDinas");
      const obj = raw ? JSON.parse(raw) : null;
      return obj?.value ?? null;
    } catch {
      return null;
    }
  };

  // ✅ Fungsi fetch list JENIS DATA OPD
  const fetchData = async () => {
    const kode_opd = getKodeOpd();
    if (!kode_opd) {
      console.warn("Kode OPD belum dipilih di header.");
      setDataList([]);
      return;
    }

    try {
      const res = await fetch(
        `https://testapi.kertaskerja.cc/api/v1/jenisdataopd/list/${kode_opd}`,
        {
          method: "GET",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            "X-Session-Id": authToken ?? "",
          },
          cache: "no-store",
        }
      );

      const raw = await res.text();
      if (!res.ok) throw new Error(`HTTP ${res.status}: ${raw.slice(0, 200)}`);

      const json = JSON.parse(raw);
      setDataList(json.data || []);
    } catch (err) {
      console.error("Gagal fetch jenis data OPD:", err);
      setDataList([]);
    }
  };

  // panggil saat token & (opsional) slug berubah
  useEffect(() => {
    if (authToken) fetchData();
  }, [authToken, slug]);

  // Handler2 lainmu tetap …

  return (
    <div>
      {/* <PageHeader /> */}

      <div className="bg-white p-6 rounded-b-lg shadow-md border border-gray-300 border-t-0">
        {/* Breadcrumb */}
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center text-sm text-gray-500">
            <Link href="/dashboard" className="hover:underline">Dashboard</Link>
            <span className="mx-2">/</span>
            <Link href="/opd" className="hover:underline">OPD</Link>
            <span className="mx-2">/</span>
            <span className="font-semibold text-gray-800">Jenis Kelompok Data</span>
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

        {/* NOTE: pastikan komponen tabelmu mampu menampilkan { id, jenis_data } */}
        <DataTable
          dataList={dataList as any}
          onUpdate={() => {}}
          onDelete={() => {}}
        />
      </div>

      <AddDataTableModal
        isOpen={openModalAdd}
        onClose={() => setOpenModalAdd(false)}
        onSuccess={fetchData}
        jenisDataId={slug}
      />

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

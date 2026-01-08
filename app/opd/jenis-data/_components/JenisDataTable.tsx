"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname } from "next/navigation";
import { ChevronDown } from "lucide-react";
import AddDataTableModal from "./AddDataTableModal";
import EditDataTableModal from "./EditDataTableModal";
import { getSessionId, getCookie } from "@/app/components/lib/Cookie";
import { useBrandingContext } from "@/app/context/BrandingContext";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

// ===== Types =====
type JenisData = { id: number; jenis_data: string };

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

type JenisDataTableProps = {
  jenisDataList: JenisData[];
  /** data_kinerja yang sudah diparsing di ClientPage, dipetakan per jenis_data_id */
  dataKinerjaMap: Record<number, DataKinerjaItem[]>;
  /** untuk refetch semua data dari ClientPage setelah create / edit / delete */
  onReloadAction: () => void;
  kodeOpd: string | null;
};

// ===== Helpers =====
const handleSavePDF = () => {
  const doc = new jsPDF("l", "mm", "a4"); // landscape biar muat 2025–2030

  doc.setFontSize(14);
  doc.text("Data Kinerja Pemda – Jenis Kelompok Data", 14, 15);

  autoTable(doc, {
    html: "#table-jenis-data",
    startY: 20,
    theme: "grid",
    headStyles: {
      fillColor: [16, 185, 129], // hijau header (tailwind emerald-500)
      textColor: 255,
      halign: "center",
    },
    bodyStyles: {
      halign: "center",
    },
    styles: {
      fontSize: 9,
      cellPadding: 3,
    },
  });

  doc.save("data-kinerja-pemda.pdf");
};
const safeParseOption = (
  v: string | null | undefined,
): { value: string; label: string } | null => {
  if (!v) return null;
  try {
    const o = JSON.parse(v);
    if (o && typeof o.value === "string" && typeof o.label === "string")
      return o;
  } catch {}
  return null;
};

const parseRange = (label: string) => {
  const m = label.match(/(\d{4}).*?(\d{4})/);
  return {
    start: m ? parseInt(m[1], 10) : NaN,
    end: m ? parseInt(m[2], 10) : NaN,
  };
};

// Basic Auth helper (pakai env NEXT_PUBLIC_BASIC_USER / NEXT_PUBLIC_BASIC_PASS)
const getBasicAuthHeader = () => {
  const user = process.env.NEXT_PUBLIC_BASIC_USER || "";
  const pass = process.env.NEXT_PUBLIC_BASIC_PASS || "";
  if (!user || !pass) return undefined;
  if (typeof window === "undefined") return undefined;

  const token = window.btoa(`${user}:${pass}`);
  return `Basic ${token}`;
};

export default function JenisDataTable({
  jenisDataList,
  dataKinerjaMap,
  onReloadAction,
  kodeOpd,
}: JenisDataTableProps) {
  const pathname = usePathname();
  const isPemdaRoute = pathname?.startsWith("/pemda");

  const [openId, setOpenId] = useState<number | null>(null);

  // modal TAMBAH
  const [openAddModal, setOpenAddModal] = useState(false);
  const [selectedJenisId, setSelectedJenisId] = useState<string | null>(null);

  // modal EDIT
  const [openEditModal, setOpenEditModal] = useState(false);
  const [selectedEditItem, setSelectedEditItem] =
    useState<DataKinerjaItem | null>(null);
  const [selectedJenisIdForEdit, setSelectedJenisIdForEdit] = useState<
    number | null
  >(null);

  // modal KETERANGAN/NARASI
  const [openKetModal, setOpenKetModal] = useState(false);
  const [ketContent, setKetContent] = useState<string>("");

  // header cookies (mode & tahun)
  const [checked, setChecked] = useState(false);
  const [mode, setMode] = useState<"periode" | "tahun" | null>(null);
  const [periodeLabel, setPeriodeLabel] = useState<string | null>(null);
  const [selectedYear, setSelectedYear] = useState<string | null>(null);
  const [authToken, setAuthToken] = useState<string | null>(null);

  const { branding } = useBrandingContext();

  useEffect(() => {
    try {
      setAuthToken(getSessionId());
    } catch {
      setAuthToken(null);
    }
    const cat = safeParseOption(getCookie("selectedCategory"));
    const periode = safeParseOption(getCookie("selectedPeriode"));
    const year = getCookie("selectedYear") || "";

    const m =
      cat && (cat.value === "periode" || cat.value === "tahun")
        ? (cat.value as "periode" | "tahun")
        : year
        ? "tahun"
        : "periode";

    setMode(m);
    setPeriodeLabel(periode?.label ?? null);
    setSelectedYear(year || null);
    setChecked(true);
  }, []);

  // daftar tahun kolom dari cookie
  const years: string[] = useMemo(() => {
    if (!checked) return [];

    if (mode === "tahun") {
      return selectedYear ? [selectedYear] : [];
    }

    if (mode === "periode") {
      if (!periodeLabel) return [];
      const { start, end } = parseRange(periodeLabel);
      if (Number.isNaN(start) || Number.isNaN(end) || start > end) return [];
      const arr: string[] = [];
      for (let y = start; y <= end; y++) arr.push(String(y));
      return arr;
    }

    return [];
  }, [checked, mode, periodeLabel, selectedYear]);

  const toggleOpen = (id: number) => {
    if (openId === id) {
      setOpenId(null);
      return;
    }
    setOpenId(id);
  };

  // DELETE data kinerja → pakai:
  // - URL: {branding.api_perencanaan}/api/v1/alur-kerja/datakinerjaopd/{id}
  // - Header: X-Session-Id + (optional) Authorization Basic
  const handleDeleteKinerja = async (rowId: number, _jenisId: number) => {
    if (!confirm("Yakin ingin menghapus data ini?")) return;

    if (!authToken) {
      alert("Session tidak ditemukan, silakan login ulang dulu.");
      return;
    }

    const base = branding?.api_perencanaan;
    if (!base) {
      alert("Base URL api_perencanaan belum diset di BrandingContext.");
      return;
    }

    try {
      const authHeader = getBasicAuthHeader();

      const headers: HeadersInit = {
        accept: "application/json",
        "X-Session-Id": authToken, // ⬅️ INI DIKIRIM
      };
      if (authHeader) {
        headers["Authorization"] = authHeader;
      }

      const url = `${base}/api/v1/alur-kerja/datakinerjaopd/${rowId}`;
      console.log("DELETE URL:", url, headers); // bantu cek di console

      const res = await fetch(url, {
        method: "DELETE",
        headers,
      });

      const raw = await res.text();

      if (!res.ok) {
        console.error("Delete failed:", res.status, raw.slice(0, 200));
        alert(`❌ Gagal menghapus data (HTTP ${res.status})`);
        return;
      }

      alert("✅ Data berhasil dihapus!");
      await onReloadAction();
    } catch (error) {
      console.error("Gagal menghapus data:", error);
      alert("❌ Terjadi kesalahan saat menghapus data (Failed to fetch).");
    }
  };

  if (!checked) return null;

  return (
    <div className="space-y-3">
      {jenisDataList?.length ? (
        jenisDataList.map((item, idx) => {
          const isOpen = openId === item.id;
          const rows = dataKinerjaMap[item.id] ?? [];

          const visibleRows =
            years.length === 0
              ? rows
              : rows.filter((row) => {
                  if (!row.target || row.target.length === 0) return false;

                  return row.target.some((t) => {
                    const yearStr = String(t.tahun);
                    const inRange = years.includes(yearStr);
                    const val = t.target;
                    const hasValue =
                      val !== null &&
                      val !== undefined &&
                      !(typeof val === "string" && val.trim() === "");
                    return inRange && hasValue;
                  });
                });

          return (
            <div key={item.id} className="border rounded-xl overflow-hidden">
              {/* Header jenis data */}
              <button
                onClick={() => toggleOpen(item.id)}
                className={`w-full flex items-center justify-between px-4 py-3 text-left transition
                  ${
                    isOpen
                      ? "bg-emerald-500 text-white"
                      : "bg-white hover:bg-emerald-50"
                  }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-sm font-semibold w-6 text-center">
                    {idx + 1}
                  </span>
                  <span className="font-semibold">
                    Jenis Data — {item.jenis_data}
                  </span>
                </div>
                <ChevronDown
                  className={`transition-transform ${
                    isOpen ? "rotate-180" : ""
                  }`}
                  size={18}
                />
              </button>

              {/* Konten detail */}
              {isOpen && (
                <div className="p-4 border-t bg-white">
                  <div className="flex justify-between items-center mb-4">
                    <p className="text-sm text-gray-700">
                      Data Kinerja OPD untuk jenis:{" "}
                      <span className="font-semibold">{item.jenis_data}</span>
                    </p>
                    <div className="flex gap-2">
  <button
    onClick={handleSavePDF}
    className="flex items-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded"
  >
    💾 Simpan PDF
  </button>

  <button className="px-4 py-2 bg-blue-500 text-white rounded">
    + Tambah Data Kinerja
  </button>
</div>

                  </div>

                  {visibleRows.length === 0 ? (
                    <p className="text-sm text-gray-500">
                      Tidak ada data kinerja untuk tahun/periode yang dipilih.
                    </p>
                  ) : (
                    <div className="overflow-x-auto">
                      <table 
                      id="table-jenis-data"
                      className="w-full text-sm text-left border-collapse">
                        <thead className="bg-[#10B981] text-white uppercase">
                          <tr>
                            <th
                              rowSpan={2}
                              className="p-2 border border-gray-300 text-center"
                            >
                              No
                            </th>
                            <th
                              rowSpan={2}
                              className="p-2 border border-gray-300 text-center"
                            >
                              Nama Data
                            </th>
                            <th
                              rowSpan={2}
                              className="p-2 border border-gray-300 text-center"
                            >
                              Definisi Operasional
                            </th>
                            <th
                              rowSpan={2}
                              className="p-2 border border-gray-300 text-center"
                            >
                              Sumber Data
                            </th>
                            <th
                              rowSpan={2}
                              className="p-2 border border-gray-300 text-center"
                            >
                              Instansi Produsen Data
                            </th>
                            <th
                              colSpan={years.length}
                              className="p-2 border border-gray-300 text-center"
                            >
                              Jumlah
                            </th>
                            <th
                              rowSpan={2}
                              className="p-2 border border-gray-300 text-center"
                            >
                              Satuan
                            </th>
                            <th
                              rowSpan={2}
                              className="p-2 border border-gray-300 text-center"
                            >
                              Keterangan/Narasi
                            </th>
                            <th
                              rowSpan={2}
                              className="p-2 border border-gray-300 text-center"
                            >
                              Aksi
                            </th>
                          </tr>
                          <tr>
                            {years.map((y) => (
                              <th
                                key={y}
                                className="p-2 border border-gray-300 text-center"
                              >
                                {y}
                              </th>
                            ))}
                          </tr>
                        </thead>

                        <tbody>
                          {visibleRows.map((row, index) => {
                            const tahunMap: Record<string, string> = {};
                            row.target?.forEach((t) => {
                              if (t?.tahun)
                                tahunMap[String(t.tahun)] = String(t.target);
                            });

                            const firstDisplayedYear = years[0];
                            const satuanByYear =
                              row.target?.find(
                                (t) => String(t.tahun) === firstDisplayedYear,
                              )?.satuan ??
                              row.target?.[0]?.satuan ??
                              "-";

                            return (
                              <tr
                                key={row.id}
                                className="bg-white hover:bg-gray-50"
                              >
                                <td className="p-2 border border-gray-300 text-center">
                                  {index + 1}
                                </td>
                                <td className="p-2 border border-gray-300">
                                  {row.nama_data}
                                </td>
                                <td className="p-2 border border-gray-300">
                                  {row.rumus_perhitungan}
                                </td>
                                <td className="p-2 border border-gray-300">
                                  {row.sumber_data}
                                </td>
                                <td className="p-2 border border-gray-300">
                                  {row.instansi_produsen_data}
                                </td>

                                {years.map((y) => (
                                  <td
                                    key={y}
                                    className="p-2 border border-gray-300 text-center"
                                  >
                                    {tahunMap[y] ?? "-"}
                                  </td>
                                ))}

                                <td className="p-2 border border-gray-300 text-center">
                                  {satuanByYear}
                                </td>
                                  <td className="p-2 border border-gray-300 text-center align-middle">
                                  <button
                                    onClick={() => {
                                      setKetContent(row.keterangan || "");
                                      setOpenKetModal(true);
                                    }}
                                    className="px-3 py-1 text-white rounded bg-gradient-to-r from-purple-500 to-indigo-500 hover:opacity-90 transition text-xs"
                                  >
                                    Tampilkan
                                  </button>

                                </td>
                                <td className="p-2 border border-gray-300 text-center">
                                  <div className="flex flex-col items-center gap-2">
                                    <button
                                      onClick={() => {
                                        const prepared: DataKinerjaItem = {
                                          ...row,
                                          jenis_data_id:
                                            row.jenis_data_id ?? item.id,
                                        };
                                        setSelectedEditItem(prepared);
                                        setSelectedJenisIdForEdit(item.id);
                                        setOpenEditModal(true);
                                      }}
                                      className="px-3 py-1 text-white rounded bg-gradient-to-r from-green-500 to-emerald-600 hover:opacity-90 transition w-full max-w-[100px] text-xs"
                                    >
                                      Edit
                                    </button>
                                    <button
                                      onClick={() =>
                                        handleDeleteKinerja(row.id, item.id)
                                      }
                                      className="px-3 py-1 text-white rounded bg-gradient-to-r from-red-500 to-red-700 hover:opacity-90 transition w-full max-w-[100px] text-xs"
                                    >
                                      Hapus
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })
      ) : (
        <div className="border rounded-xl p-4 text-center text-gray-500">
          Tidak ada data.
        </div>
      )}

      {/* Modal TAMBAH DATA KINERJA */}
      {openAddModal && selectedJenisId && (
        <AddDataTableModal
          isOpen={openAddModal}
          onClose={() => setOpenAddModal(false)}
          onSuccess={async () => {
            await onReloadAction();
            setOpenAddModal(false);
          }}
          jenisDataId={selectedJenisId}
          authToken={authToken}
          kodeOpd={kodeOpd}
        />
      )}

      {/* Modal EDIT DATA KINERJA */}
      {openEditModal && selectedEditItem && (
        <EditDataTableModal
          isOpen={openEditModal}
          onClose={() => setOpenEditModal(false)}
          onSuccess={async () => {
            await onReloadAction();
          }}
          dataItem={selectedEditItem as any}
          jenisDataId={
            selectedJenisIdForEdit != null
              ? String(selectedJenisIdForEdit)
              : undefined
          }
          authToken={authToken}
        />
      )}

      {/* Modal KETERANGAN / NARASI */}
      {openKetModal && (
        <div
          className="fixed inset-0 flex justify-center items-center z-50 p-4"
          style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
          onClick={() => setOpenKetModal(false)}
        >
          <div
            className="relative z-10 bg-white rounded-lg shadow-xl w-full max-w-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center p-5 border-b">
              <h3 className="text-xl font-bold text-gray-800">
                KETERANGAN / NARASI
              </h3>
              <button
                onClick={() => setOpenKetModal(false)}
                className="text-gray-500 hover:text-gray-800 text-2xl"
              >
                &times;
              </button>
            </div>
            <div className="p-6">
              {ketContent ? (
                <p className="text-gray-700 whitespace-pre-line">
                  {ketContent}
                </p>
              ) : (
                <p className="text-gray-400 italic">
                  Belum ada keterangan/narasi
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

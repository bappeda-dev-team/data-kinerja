"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { usePathname } from "next/navigation";
import { ChevronDown } from "lucide-react";
import AddDataTableModal from "./AddDataTableModal";
import EditDataTableModal from "./EditDataTableModal";
import { getSessionId, getCookie } from "@/app/components/lib/Cookie";
import { useBrandingContext } from "@/app/context/BrandingContext";

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

type ListResponseItem = {
  id: number; // id jenis data
  jenis_data: string;
  data_kinerja: DataKinerjaItem[];
};

type JenisDataTableProps = {
  jenisDataList: JenisData[];
  onDelete: (id: number) => void;
};

// ===== Helpers =====
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

// const API_BASE = "https://alurkerja.zeabur.app";

export default function JenisDataTable({
  jenisDataList,
  onDelete,
}: JenisDataTableProps) {
  const pathname = usePathname();
  const isPemdaRoute = pathname?.startsWith("/pemda"); // masih kepake kalau mau bedain route

  const { branding } = useBrandingContext();
  const [authToken, setAuthToken] = useState<string | null>(null);
  const [openId, setOpenId] = useState<number | null>(null);

  // cache detail per jenis_data_id
  const [details, setDetails] = useState<Record<number, DataKinerjaItem[]>>({});
  const [loading, setLoading] = useState<Record<number, boolean>>({});
  const [error, setError] = useState<Record<number, string | null>>({});

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

  const loadDetail = useCallback(
    async (id: number, forceReload = false) => {
      if (!authToken) return;
      if (!forceReload && details[id]) return;

      setLoading((l) => ({ ...l, [id]: true }));
      setError((e) => ({ ...e, [id]: null }));

      try {
        // 🔁 Ganti endpoint ke OPD list
        const res = await fetch(
          `${branding.api_perencanaan}/api/v1/alur-kerja/datakinerjaopd/list/`,
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

        const raw = await res.text();
        if (!res.ok)
          throw new Error(`HTTP ${res.status}: ${raw.slice(0, 200)}`);

        const json = JSON.parse(raw) as {
          code?: number;
          status?: string;
          data?: ListResponseItem[];
        };

        const all = json?.data ?? [];
        const found = all.find((item) => item.id === id);
        const list = found?.data_kinerja ?? [];

        setDetails((d) => ({ ...d, [id]: list }));
      } catch (err: any) {
        setError((e) => ({
          ...e,
          [id]: err?.message || "Gagal memuat data",
        }));
      } finally {
        setLoading((l) => ({ ...l, [id]: false }));
      }
    },
    [details],
  );

  const toggleOpen = async (id: number) => {
    if (openId === id) {
      setOpenId(null);
      return;
    }
    setOpenId(id);
    await loadDetail(id);
  };

  const handleDeleteKinerja = async (rowId: number, jenisId: number) => {
    if (!confirm("Yakin ingin menghapus data ini?")) return;

    try {
      // 🔁 Ganti endpoint delete ke OPD
      const res = await fetch(`${API_BASE}/datakinerjaopd/${rowId}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Gagal menghapus data dari server.");

      alert("✅ Data berhasil dihapus!");
      await loadDetail(jenisId, true);
    } catch (error) {
      console.error("Gagal menghapus data:", error);
      alert("❌ Terjadi kesalahan saat menghapus data.");
    }
  };

  if (!checked) return null;

  return (
    <div className="space-y-3">
      {jenisDataList?.length ? (
        jenisDataList.map((item, idx) => {
          const isOpen = openId === item.id;
          const rows = details[item.id] ?? [];

          // FILTER baris sesuai tahun di cookie
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

              {/* Konten detail data kinerja */}
              {isOpen && (
                <div className="p-4 border-t bg-white">
                  <div className="flex justify-between items-center mb-4">
                    <p className="text-sm text-gray-700">
                      {/* 🔁 Ubah label Pemda → OPD */}
                      Data Kinerja OPD untuk jenis:{" "}
                      <span className="font-semibold">{item.jenis_data}</span>
                    </p>
                    <button
                      onClick={() => {
                        setSelectedJenisId(String(item.id));
                        setOpenAddModal(true);
                      }}
                      className="px-4 py-2 rounded-md text-white bg-gradient-to-r from-cyan-500 to-blue-500 hover:opacity-90 text-sm font-semibold"
                    >
                      + Tambah Data Kinerja
                    </button>
                  </div>

                  {loading[item.id] ? (
                    <p className="text-sm text-gray-500">Memuat…</p>
                  ) : error[item.id] ? (
                    <p className="text-sm text-red-600">{error[item.id]}</p>
                  ) : visibleRows.length === 0 ? (
                    <p className="text-sm text-gray-500">
                      Tidak ada data kinerja untuk tahun/periode yang dipilih.
                    </p>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm text-left border-collapse">
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
                                <td className="p-2 border border-gray-300 text-center">
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

                  {/* Aksi di bawah detail jenis data */}
                  <div className="mt-4 flex gap-2">
                    <button
                      onClick={() => setOpenId(null)}
                      className="px-3 py-1.5 rounded border text-sm hover:bg-gray-50"
                    >
                      Tutup
                    </button>
                    <button
                      onClick={() => onDelete(item.id)}
                      className="px-3 py-1.5 rounded text-white text-sm bg-gradient-to-r from-red-500 to-pink-500 hover:opacity-90"
                    >
                      Hapus Jenis Data
                    </button>
                  </div>
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
            if (selectedJenisId) {
              await loadDetail(Number(selectedJenisId), true);
            }
            setOpenAddModal(false);
          }}
          jenisDataId={selectedJenisId}
          authToken={authToken}
        />
      )}

      {/* Modal EDIT DATA KINERJA */}
      {openEditModal && selectedEditItem && (
        <EditDataTableModal
          isOpen={openEditModal}
          onClose={() => setOpenEditModal(false)}
          onSuccess={async () => {
            if (selectedJenisIdForEdit != null) {
              await loadDetail(selectedJenisIdForEdit, true);
            }
          }}
          dataItem={selectedEditItem as any}
          jenisDataId={
            selectedJenisIdForEdit != null
              ? String(selectedJenisIdForEdit)
              : undefined
          }
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

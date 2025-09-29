"use client";
import React, { useEffect, useMemo, useState } from "react";
import Select, { SingleValue } from "react-select";
import Cookies from "js-cookie";
import { setCookie, getCookie } from "@/app/components/lib/Cookie";
import { AlertNotification } from "../global/Alert";

// INTERFACE
interface OptionTypeString {
  value: string;
  label: string;
}

// API ENDPOINTS
const API_PERIODE =
  process.env.NEXT_PUBLIC_PERIODE_API ??
  "https://periode-service-test.zeabur.app/periode";
const API_OPD =
  process.env.NEXT_PUBLIC_OPD_API ??
  "https://periode-service-test.zeabur.app/list_opd";


const PageHeader = () => {
  // State untuk memastikan komponen hanya dirender di sisi client (menghindari hydration error)
  const [isClient, setIsClient] = useState(false);

  // State untuk data dinas/OPD dari API
  const [dinasOptions, setDinasOptions] = useState<OptionTypeString[]>([]);
  const [loadingDinas, setLoadingDinas] = useState(false);
  const [dinasError, setDinasError] = useState<string | null>(null);

  // State untuk data periode dari API
  const [periodeOptions, setPeriodeOptions] = useState<OptionTypeString[]>([]);
  const [loadingPeriode, setLoadingPeriode] = useState(false);
  const [periodeError, setPeriodeError] = useState<string | null>(null);
  
  // State untuk pilihan filter yang aktif (diambil dari cookies)
  const [selectedDinas, setSelectedDinas] = useState<OptionTypeString | null>(() => {
    const cookieValue = getCookie("selectedDinas");
    return cookieValue ? JSON.parse(cookieValue) : null;
  });
  const [selectedPeriode, setSelectedPeriode] = useState<OptionTypeString | null>(() => {
    const cookieValue = getCookie("selectedPeriode");
    return cookieValue ? JSON.parse(cookieValue) : null;
  });
  const [selectedYear, setSelectedYear] = useState<string>(() => {
    return getCookie("selectedYear") || "";
  });

  // Fungsi untuk mengambil data OPD/Dinas dari API
  const fetchDinasOptions = async () => {
    setLoadingDinas(true);
    setDinasError(null);
    try {
      const res = await fetch(API_OPD, { cache: "no-store" });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      
      // Transformasi data API ke format yang dibutuhkan react-select
      const options: OptionTypeString[] = (json?.data ?? []).map((item: any) => ({
        value: item.id_opd, // Sesuaikan dengan nama field dari API
        label: item.nama_opd, // Sesuaikan dengan nama field dari API
      }));
      setDinasOptions(options);

    } catch (e: any) {
      setDinasError(e?.message || "Gagal memuat OPD");
      setDinasOptions([]);
    } finally {
      setLoadingDinas(false);
    }
  };

  // Fungsi untuk mengambil data Periode dari API
  const fetchPeriodeOptions = async () => {
    setLoadingPeriode(true);
    setPeriodeError(null);
    try {
      const res = await fetch(API_PERIODE, { cache: "no-store" });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();

      const options: OptionTypeString[] = (json?.data ?? []).map((it: any) => ({
        value: String(it.id),
        label: `${it.tahun_awal}-${it.tahun_akhir}`,
      }));

      options.sort((a, b) => {
        const sa = Number(a.label.split("-")[0]);
        const sb = Number(b.label.split("-")[0]);
        return sb - sa;
      });

      setPeriodeOptions(options);

    } catch (e: any) {
      setPeriodeError(e?.message || "Gagal memuat periode");
      setPeriodeOptions([]);
    } finally {
      setLoadingPeriode(false);
    }
  };
  
  // Ambil semua data dari API saat komponen pertama kali dimuat di client
  useEffect(() => {
    setIsClient(true);
    fetchDinasOptions();
    fetchPeriodeOptions();
  }, []);

  // Menyimpan pilihan ke cookies setiap kali ada perubahan
  useEffect(() => {
    if (selectedDinas) {
      setCookie("selectedDinas", JSON.stringify(selectedDinas));
    } else {
      Cookies.remove("selectedDinas");
    }
  }, [selectedDinas]);

  useEffect(() => {
    if (selectedPeriode) {
      setCookie("selectedPeriode", JSON.stringify(selectedPeriode));
    } else {
      Cookies.remove("selectedPeriode");
      setSelectedYear(""); // Reset tahun jika periode dihapus
    }
  }, [selectedPeriode]);

  useEffect(() => {
    if (selectedYear) {
      setCookie("selectedYear", selectedYear);
    } else {
      Cookies.remove("selectedYear");
    }
  }, [selectedYear]);
  
  // Membuat daftar tahun berdasarkan periode yang dipilih
  const yearOptions = useMemo(() => {
    if (!selectedPeriode) return [];
    const [startStr, endStr] = selectedPeriode.label.split("-");
    const start = Number(startStr);
    const end = Number(endStr);
    if (Number.isNaN(start) || Number.isNaN(end)) return [];
    
    const arr: number[] = [];
    for (let y = start; y <= end; y++) arr.push(y);

    if (selectedYear && (Number(selectedYear) < start || Number(selectedYear) > end)) {
      setSelectedYear("");
    }
    return arr;
  }, [selectedPeriode, selectedYear]);
  
  // Handler untuk tombol "Aktifkan"
  const handleActivate = () => {
      if (!selectedDinas || !selectedPeriode || !selectedYear) {
          AlertNotification("Gagal", "Harap pilih Dinas, Periode, dan Tahun terlebih dahulu", "error");
          return;
      }
      AlertNotification("Berhasil", "Filter berhasil diaktifkan", "success", 1500);
      setTimeout(() => {
          window.location.reload();
      }, 1500);
  };

  return (
    <div className="bg-filter-bar-bg p-3 rounded-lg flex flex-col md:flex-row items-center justify-between gap-4">
      <div className="flex items-center gap-3 text-white w-full md:w-auto">
        <h2 className="text-lg font-semibold">
          {selectedDinas?.label ?? "Pilih Dinas/OPD"}
        </h2>
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-2 w-full md:w-auto">
        {isClient && (
          <>
            {/* DINAS */}
            <Select<OptionTypeString, false>
              instanceId="select-dinas"
              name="dinas"
              className="text-sm w-full sm:w-64"
              classNamePrefix="rs"
              value={selectedDinas}
              options={dinasOptions}
              onChange={(opt) => setSelectedDinas(opt ?? null)}
              isLoading={loadingDinas}
              placeholder={loadingDinas ? "Memuat..." : dinasError || "Pilih Dinas/OPD"}
              isSearchable
              isClearable
            />

            {/* PERIODE */}
            <Select<OptionTypeString, false>
              instanceId="select-periode"
              name="periode"
              className="text-sm w-full sm:w-56"
              classNamePrefix="rs"
              value={selectedPeriode}
              options={periodeOptions}
              onChange={(opt) => setSelectedPeriode(opt ?? null)}
              isLoading={loadingPeriode}
              placeholder={loadingPeriode ? "Memuat..." : periodeError || "Pilih Periode"}
              isSearchable
              isClearable
            />

            {/* TAHUN */}
            <Select<OptionTypeString, false>
              instanceId="select-tahun"
              name="tahun"
              className="text-sm w-full sm:w-40"
              classNamePrefix="rs"
              value={selectedYear ? { value: selectedYear, label: `Tahun ${selectedYear}` } : null}
              options={yearOptions.map((y) => ({ value: String(y), label: `Tahun ${y}` }))}
              onChange={(opt) => setSelectedYear(opt?.value ?? "")}
              placeholder="Pilih Tahun"
              isDisabled={!selectedPeriode || yearOptions.length === 0}
              isSearchable
              isClearable
            />
          </>
        )}

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            className="bg-blue-600 text-white px-4 py-1.5 rounded-md text-sm font-semibold cursor-pointer hover:bg-blue-700 transition"
            onClick={handleActivate}
          >
            Aktifkan
          </button>
          <button className="bg-gray-700 text-white px-4 py-1.5 rounded-md text-sm font-semibold cursor-pointer hover:bg-gray-800 transition">
            Admin Pemda
          </button>
        </div>
      </div>
    </div>
  );
};

export default PageHeader;
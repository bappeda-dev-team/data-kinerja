"use client";
import React, { useEffect, useMemo, useState } from "react";
import Select from "react-select";
import Cookies from "js-cookie";
import { setCookie, getCookie } from "@/app/components/lib/Cookie";
import { AlertNotification } from "../global/Alert";

// ==================
// TYPES
// ==================
interface OptionTypeString {
  value: string;
  label: string;
}

// ==================
// API ENDPOINTS
// ==================
const API_PERIODE =
  process.env.NEXT_PUBLIC_PERIODE_API ??
  "https://periode-service-test.zeabur.app/periode";
const API_OPD =
  process.env.NEXT_PUBLIC_OPD_API ??
  "https://periode-service-test.zeabur.app/list_opd";

// ==================
// HELPERS
// ==================
// Terima string | null | undefined supaya cocok dengan getCookie()
const safeParseOption = (v: string | null | undefined): OptionTypeString | null => {
  if (!v) return null;
  try {
    const o = JSON.parse(v);
    if (o && typeof o.value === "string" && typeof o.label === "string") {
      return o;
    }
  } catch {}
  return null;
};

const PageHeader = () => {
  // Cegah mismatch SSR vs client
  const [isClient, setIsClient] = useState(false);

  // Data pilihan dari API
  const [dinasOptions, setDinasOptions] = useState<OptionTypeString[]>([]);
  const [loadingDinas, setLoadingDinas] = useState(false);
  const [dinasError, setDinasError] = useState<string | null>(null);

  const [periodeOptions, setPeriodeOptions] = useState<OptionTypeString[]>([]);
  const [loadingPeriode, setLoadingPeriode] = useState(false);
  const [periodeError, setPeriodeError] = useState<string | null>(null);

  // Pilihan aktif (mulai dari nilai netral; cookie disinkronkan SETELAH mount)
  const [selectedDinas, setSelectedDinas] = useState<OptionTypeString | null>(null);
  const [selectedPeriode, setSelectedPeriode] = useState<OptionTypeString | null>(null);
  const [selectedYear, setSelectedYear] = useState<string>("");

  // Client mount + sync cookie -> state
  useEffect(() => {
    setIsClient(true);

    const dCookie = safeParseOption(getCookie("selectedDinas"));
    const pCookie = safeParseOption(getCookie("selectedPeriode"));
    const yCookie = getCookie("selectedYear") || "";

    if (dCookie) setSelectedDinas(dCookie);
    if (pCookie) setSelectedPeriode(pCookie);
    if (yCookie) setSelectedYear(yCookie);
  }, []);

  // Fetch OPD & Periode (client only)
  useEffect(() => {
    if (!isClient) return;

    const fetchDinasOptions = async () => {
      setLoadingDinas(true);
      setDinasError(null);
      try {
        const res = await fetch(API_OPD, { cache: "no-store" });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = await res.json();
        const options: OptionTypeString[] = (json?.data ?? []).map((item: any) => ({
          value: String(item.id_opd),
          label: String(item.nama_opd),
        }));
        setDinasOptions(options);
      } catch (e: any) {
        setDinasError(e?.message || "Gagal memuat OPD");
        setDinasOptions([]);
      } finally {
        setLoadingDinas(false);
      }
    };

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

        // urutkan desc by tahun awal
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

    fetchDinasOptions();
    fetchPeriodeOptions();
  }, [isClient]);

  // Persist pilihan ke cookie (client only)
  useEffect(() => {
    if (!isClient) return;
    if (selectedDinas) setCookie("selectedDinas", JSON.stringify(selectedDinas));
    else Cookies.remove("selectedDinas");
  }, [isClient, selectedDinas]);

  useEffect(() => {
    if (!isClient) return;
    if (selectedPeriode) setCookie("selectedPeriode", JSON.stringify(selectedPeriode));
    else {
      Cookies.remove("selectedPeriode");
      setSelectedYear(""); // reset tahun kalau periode dihapus
    }
  }, [isClient, selectedPeriode]);

  useEffect(() => {
    if (!isClient) return;
    if (selectedYear) setCookie("selectedYear", selectedYear);
    else Cookies.remove("selectedYear");
  }, [isClient, selectedYear]);

  // Opsi tahun dari periode (NO setState di sini)
  const yearOptions: OptionTypeString[] = useMemo(() => {
    if (!selectedPeriode) return [];
    const [startStr, endStr] = selectedPeriode.label.split("-");
    const start = Number(startStr);
    const end = Number(endStr);
    if (Number.isNaN(start) || Number.isNaN(end)) return [];
    const arr: OptionTypeString[] = [];
    for (let y = start; y <= end; y++) {
      arr.push({ value: String(y), label: `Tahun ${y}` });
    }
    return arr;
  }, [selectedPeriode]);

  // Validasi tahun saat periode berubah (jangan di useMemo)
  useEffect(() => {
    if (!selectedPeriode) {
      if (selectedYear) setSelectedYear("");
      return;
    }
    if (!selectedYear) return;
    const [startStr, endStr] = selectedPeriode.label.split("-");
    const start = Number(startStr);
    const end = Number(endStr);
    const ny = Number(selectedYear);
    if (Number.isNaN(ny) || ny < start || ny > end) setSelectedYear("");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedPeriode]);

  const selectedYearOption = selectedYear
    ? { value: selectedYear, label: `Tahun ${selectedYear}` }
    : null;

  // Action tombol
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
          {/* Stabilkan header saat hydrate: SSR & first client render sama */}
          {isClient ? (selectedDinas?.label ?? "Pilih Dinas/OPD") : "Pilih Dinas/OPD"}
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
              value={selectedDinas ?? null}
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
              value={selectedPeriode ?? null}
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
              className="text-sm w-full sm:w-50"
              classNamePrefix="rs"
              value={selectedYearOption}
              options={yearOptions}
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
            className="bg-gray-700 text-white px-4 py-2.5 rounded-md text-sm font-semibold cursor-pointer hover:bg-blue-700 transition"
            onClick={handleActivate}
          >
            Aktifkan
          </button>
          <button className="bg-gray-700 text-white px-4 py-2.5 rounded-md text-sm font-semibold cursor-pointer hover:bg-blue-700 transition">
            Admin Pemda
          </button>
        </div>
      </div>
    </div>
  );
};

export default PageHeader;

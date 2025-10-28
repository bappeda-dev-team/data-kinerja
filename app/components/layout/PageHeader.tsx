"use client";
import React, { useEffect, useMemo, useState } from "react";
import Select from "react-select";
import Cookies from "js-cookie";
import { setCookie, getCookie } from "@/app/components/lib/Cookie";
import { AlertNotification } from "../global/Alert";
import { usePathname } from "next/navigation";
// ==================
// TYPES
// ==================
interface OptionTypeString {
  value: string;
  label: string;
}

type CategoryValue = "periode" | "tahun";

const CATEGORY_OPTIONS: OptionTypeString[] = [
  { value: "periode", label: "Periode (5 Tahunan)" },
  { value: "tahun", label: "Tahunan" },
];

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
  const pathname = usePathname(); 
  const HIDE_ON = ["/", "/login", "/register"]; 
  if (HIDE_ON.includes(pathname)) return null; 
  const [isClient, setIsClient] = useState(false);

  const [dinasOptions, setDinasOptions] = useState<OptionTypeString[]>([]);
  const [loadingDinas, setLoadingDinas] = useState(false);
  const [dinasError, setDinasError] = useState<string | null>(null);

  const [periodeOptions, setPeriodeOptions] = useState<OptionTypeString[]>([]);
  const [loadingPeriode, setLoadingPeriode] = useState(false);
  const [periodeError, setPeriodeError] = useState<string | null>(null);

  const [selectedDinas, setSelectedDinas] = useState<OptionTypeString | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<OptionTypeString | null>(null);
  const [selectedPeriode, setSelectedPeriode] = useState<OptionTypeString | null>(null);
  const [selectedYear, setSelectedYear] = useState<string>("");

  // ==== INIT COOKIES ====
  useEffect(() => {
    setIsClient(true);

    const dCookie = safeParseOption(getCookie("selectedDinas"));
    const cCookie = safeParseOption(getCookie("selectedCategory")); // {value:'periode'|'tahun', label:'...'}
    const pCookie = safeParseOption(getCookie("selectedPeriode"));
    const yCookie = getCookie("selectedYear") || "";

    if (dCookie) setSelectedDinas(dCookie);
    if (cCookie) setSelectedCategory(cCookie);
    if (pCookie) setSelectedPeriode(pCookie);
    if (yCookie) setSelectedYear(yCookie);
  }, []);

  // ==== FETCH OPTIONS ====
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

        // Sort by start year desc
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

  // ==== COOKIES PERSISTENCE ====
  useEffect(() => {
    if (!isClient) return;
    if (selectedDinas) setCookie("selectedDinas", JSON.stringify(selectedDinas));
    else Cookies.remove("selectedDinas");
  }, [isClient, selectedDinas]);

  useEffect(() => {
    if (!isClient) return;
    if (selectedCategory) setCookie("selectedCategory", JSON.stringify(selectedCategory));
    else Cookies.remove("selectedCategory");
  }, [isClient, selectedCategory]);

  useEffect(() => {
    if (!isClient) return;
    if (selectedPeriode) setCookie("selectedPeriode", JSON.stringify(selectedPeriode));
    else Cookies.remove("selectedPeriode");
  }, [isClient, selectedPeriode]);

  useEffect(() => {
    if (!isClient) return;
    if (selectedYear) setCookie("selectedYear", selectedYear);
    else Cookies.remove("selectedYear");
  }, [isClient, selectedYear]);

  // ==== YEARS (untuk mode "Tahunan"): diambil dari rentang min–max seluruh periode ====
  const allYearOptions: OptionTypeString[] = useMemo(() => {
    if (!periodeOptions.length) return [];
    let minStart = Infinity;
    let maxEnd = -Infinity;
    for (const p of periodeOptions) {
      const [sStr, eStr] = p.label.split("-");
      const s = Number(sStr);
      const e = Number(eStr);
      if (!Number.isNaN(s) && s < minStart) minStart = s;
      if (!Number.isNaN(e) && e > maxEnd) maxEnd = e;
    }
    if (!Number.isFinite(minStart) || !Number.isFinite(maxEnd)) return [];

    const arr: OptionTypeString[] = [];
    for (let y = maxEnd; y >= minStart; y--) {
      arr.push({ value: String(y), label: `Tahun ${y}` });
    }
    return arr;
  }, [periodeOptions]);

  // ==== Ganti kategori: bersihkan pilihan lawan ====
  const onCategoryChange = (opt: OptionTypeString | null) => {
    setSelectedCategory(opt);
    // saat pindah mode, clear pilihan lain biar gak “nyangkut”
    if (!opt) {
      setSelectedPeriode(null);
      setSelectedYear("");
      return;
    }
    if (opt.value === "periode") {
      setSelectedYear("");
    } else if (opt.value === "tahun") {
      setSelectedPeriode(null);
    }
  };

  // ==== AKTIFKAN FILTER ====
  const handleActivate = () => {
    if (!selectedDinas) {
      AlertNotification("Gagal", "Harap pilih Dinas/OPD terlebih dahulu", "error");
      return;
    }
    if (!selectedCategory) {
      AlertNotification("Gagal", "Harap pilih Kategori (Periode/Tahunan)", "error");
      return;
    }

    const cat = selectedCategory.value as CategoryValue;

    if (cat === "periode" && !selectedPeriode) {
      AlertNotification("Gagal", "Harap pilih Periode 5 tahunan", "error");
      return;
    }

    if (cat === "tahun" && !selectedYear) {
      AlertNotification("Gagal", "Harap pilih Tahun", "error");
      return;
    }

    AlertNotification(
      "Berhasil",
      cat === "periode" ? "Filter Periode diaktifkan" : "Filter Tahun diaktifkan",
      "success",
      1200
    );
    setTimeout(() => {
      window.location.reload();
    }, 1200);
  };

  return (
    <div className="bg-filter-bar-bg p-3 rounded-lg flex flex-col md:flex-row items-center justify-between gap-4">
      <div className="flex items-center gap-3 text-white w-full md:w-auto">
        <h2 className="text-lg font-semibold">
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

            {/* KATEGORI: Periode / Tahun */}
            <Select<OptionTypeString, false>
              instanceId="select-category"
              name="category"
              className="text-sm w-full sm:w-56"
              classNamePrefix="rs"
              value={selectedCategory ?? null}
              options={CATEGORY_OPTIONS}
              onChange={onCategoryChange}
              placeholder="Pilih Kategori"
              isSearchable={false}
              isClearable
            />

            {/* CONDITIONAL: jika Periode → tampil Periode; jika Tahun → tampil Tahun */}
            {selectedCategory?.value === "periode" && (
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
            )}

            {selectedCategory?.value === "tahun" && (
              <Select<OptionTypeString, false>
                instanceId="select-tahun"
                name="tahun"
                className="text-sm w-full sm:w-44"
                classNamePrefix="rs"
                value={selectedYear ? { value: selectedYear, label: `Tahun ${selectedYear}` } : null}
                options={allYearOptions}
                onChange={(opt) => setSelectedYear(opt?.value ?? "")}
                placeholder="Pilih Tahun"
                isSearchable
                isClearable
                isDisabled={!allYearOptions.length}
              />
            )}
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

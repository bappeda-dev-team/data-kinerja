"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  useForm,
  Control,
  Controller,
  SubmitHandler,
  FieldValues,
} from "react-hook-form";
import Select from "react-select";
import { getCookie } from "@/app/components/lib/Cookie";

type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  jenisDataId: string;
};

interface JenisDataOption {
  id: number;
  jenis_data: string;
}

interface OptionType {
  value: string;
  label: string;
}

type CategoryValue = "periode" | "tahun";

interface FormValue {
  jenis_data_id: OptionType | null;
  nama_data: string;
  rumus_perhitungan: string;
  sumber_data: string;
  instansi_produsen_data: string;
  // sekarang kita punya dua kemungkinan field, cuma satu yang ditampilkan/diisi
  periode: OptionType | null;
  tahun: OptionType | null;
  satuan: string;
  target: string;
  keterangan: string;
}

/** Helper: parse cookie react-select (JSON string) */
const safeParseOption = (v: string | null | undefined): OptionType | null => {
  if (!v) return null;
  try {
    const o = JSON.parse(v);
    if (o && typeof o.value === "string" && typeof o.label === "string") return o;
  } catch {}
  return null;
};

/** Helper: ambil {start,end} dari label "2031-2036" atau "2031–2036" */
const parseRange = (label: string) => {
  const m = label.match(/(\d{4}).*?(\d{4})/);
  return {
    start: m ? parseInt(m[1], 10) : NaN,
    end: m ? parseInt(m[2], 10) : NaN,
  };
};

/** Helper: buat opsi tahun dari label periode */
const yearsFromPeriodeLabel = (label: string): OptionType[] => {
  const { start, end } = parseRange(label);
  if (Number.isNaN(start) || Number.isNaN(end) || start > end) return [];
  const arr: OptionType[] = [];
  for (let y = start; y <= end; y++) arr.push({ value: String(y), label: String(y) });
  return arr;
};

const AddDataTableModal = ({ isOpen, onClose, onSuccess, jenisDataId }: ModalProps) => {
  const {
    handleSubmit,
    control,
    reset,
    setValue,
    getValues,
    formState: { errors },
  } = useForm<FormValue>({
    defaultValues: {
      jenis_data_id: null,
      nama_data: "",
      rumus_perhitungan: "",
      sumber_data: "",
      instansi_produsen_data: "",
      periode: null,
      tahun: null,
      satuan: "",
      target: "",
      keterangan: "",
    },
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [jenisDataOptions, setJenisDataOptions] = useState<OptionType[]>([]);
  const [isLoadingJenisData, setIsLoadingJenisData] = useState(false);

  // Mode form (ikut header cookie): "periode" | "tahun"
  const [mode, setMode] = useState<CategoryValue>("periode");

  // Opsi periode (dari cookie header saja—biar konsisten dengan filter)
  const [periodeOptionFromCookie, setPeriodeOptionFromCookie] = useState<OptionType | null>(null);

  // Opsi tahun dinamis dari periode cookie
  const [yearOptions, setYearOptions] = useState<OptionType[]>([]);

  /** Saat modal dibuka: baca cookie header dan set mode + prefill */
  useEffect(() => {
    if (!isOpen) return;

    // Cookie-cookies dari header PageHeader
    const selectedCategory = safeParseOption(getCookie("selectedCategory")); // {value:'periode'|'tahun', label:'...'}
    const periodeCookie = safeParseOption(getCookie("selectedPeriode"));     // {value:'<id|start>', label:'YYYY-YYYY'}
    const yearCookie = getCookie("selectedYear") || "";

    // Tentukan mode
    const inferredMode: CategoryValue =
      selectedCategory && (selectedCategory.value === "tahun" || selectedCategory.value === "periode")
        ? (selectedCategory.value as CategoryValue)
        : (yearCookie ? "tahun" : "periode");
    setMode(inferredMode);

    // Prefill PERIODE (kalau ada)
    if (periodeCookie) {
      setPeriodeOptionFromCookie(periodeCookie);
      setValue("periode", periodeCookie, { shouldValidate: true });
      // Build opsi tahun dari periode cookie
      const dynYears = yearsFromPeriodeLabel(periodeCookie.label);
      // jika ada yearCookie tapi tidak ada di opsi, tambahkan
      if (yearCookie && !dynYears.find((o) => o.value === yearCookie)) {
        dynYears.push({ value: yearCookie, label: yearCookie });
      }
      setYearOptions(dynYears);
    } else {
      setPeriodeOptionFromCookie(null);
      setValue("periode", null);
      setYearOptions([]);
    }

    // Prefill TAHUN (kalau ada)
    if (yearCookie) {
      setValue("tahun", { value: yearCookie, label: yearCookie }, { shouldValidate: true });
    } else {
      setValue("tahun", null);
    }
  }, [isOpen, setValue]);

  // Ambil jenis data untuk select
  const fetchJenisData = async () => {
    setIsLoadingJenisData(true);
    try {
      const response = await fetch("https://alurkerja.zeabur.app/jenisdata");
      if (!response.ok) throw new Error("Gagal mengambil daftar jenis data");
      const result = await response.json();
      const options = (result.data as JenisDataOption[]).map((item) => ({
        value: item.id.toString(),
        label: item.jenis_data,
      }));
      setJenisDataOptions(options);

      const selectedOption = options.find((opt) => opt.value === jenisDataId);
      if (selectedOption) setValue("jenis_data_id", selectedOption);
    } catch (error) {
      console.error("Fetch Jenis Data Error:", error);
    } finally {
      setIsLoadingJenisData(false);
    }
  };

  useEffect(() => {
    if (isOpen) fetchJenisData();
  }, [isOpen]);

  // SUBMIT: branch sesuai mode
  const onSubmit: SubmitHandler<FormValue> = async (data) => {
    setIsSubmitting(true);

    // Common fields
    const base = {
      nama_data: data.nama_data,
      rumus_perhitungan: data.rumus_perhitungan,
      sumber_data: data.sumber_data,
      instansi_produsen_data: data.instansi_produsen_data,
      keterangan: data.keterangan,
      jenis_data_id: parseInt(data.jenis_data_id!.value, 10),
    };

    let payload: any;

    if (mode === "tahun") {
      // === MODE TAHUN: sama persis dengan punyamu
      payload = {
        ...base,
        target: [
          {
            tahun: data.tahun!.value,
            satuan: data.satuan,
            target: data.target,
          },
        ],
      };
    } else {
      // === MODE PERIODE: backend kamu minta 'tahun' di target.
      // Agar tetap valid, kita default-kan ke start-year dari periode cookie.
      const p = getValues("periode");
      const start = p ? parseRange(p.label).start : NaN;
      const tahunDefault = !Number.isNaN(start) ? String(start) : "";

      payload = {
        ...base,
        // Kalau kamu ingin mengirim info periode ke backend, bisa tambahkan field berikut:
        // periode_label: p?.label,
        // periode_start: p?.value,
        target: [
          {
            tahun: tahunDefault, // <<-- default tahun = start period (bisa kamu ubah sesuai kontrak API)
            satuan: data.satuan,
            target: data.target,
          },
        ],
      };
    }

    try {
      const response = await fetch("https://alurkerja.zeabur.app/datakinerjapemda", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Terjadi kesalahan pada server`);
      }

      alert("Data Kinerja berhasil disimpan!");
      onSuccess();
      handleClose();
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error("Error saat kirim data:", error);
        alert(`Gagal menyimpan data: ${error.message}`);
      } else {
        console.error("Error saat kirim data:", error);
        alert("Gagal menyimpan data: unknown error");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 flex justify-center items-center z-50 p-4"
      style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
    >
      <div
        className="relative z-10 bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-5 border-b">
          <h3 className="text-xl font-bold text-center text-gray-800">TAMBAH DATA KINERJA</h3>
        </div>

        <div className="p-8">
          {/* Info kecil biar jelas mode-nya apa */}
          <div className="mb-4 text-sm text-gray-600">
            Mode input mengikuti header:{" "}
            <span className="font-semibold uppercase">{mode === "periode" ? "PERIODE" : "TAHUN"}</span>
          </div>

          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="space-y-4">
              <SelectField
                control={control}
                name="jenis_data_id"
                label="Jenis Kelompok Data"
                options={jenisDataOptions}
                error={errors.jenis_data_id?.message as any}
                isLoading={isLoadingJenisData}
              />

              <InputField control={control} name="nama_data" label="Nama Data" error={errors.nama_data?.message as any} />
              <InputField control={control} name="rumus_perhitungan" label="Rumus Perhitungan" error={errors.rumus_perhitungan?.message as any} isTextarea />
              <InputField control={control} name="sumber_data" label="Sumber Data" error={errors.sumber_data?.message as any} />
              <InputField control={control} name="instansi_produsen_data" label="Instansi Produsen Data" error={errors.instansi_produsen_data?.message as any} />

              {/* === SATU FIELD SAJA SESUAI MODE === */}
              {mode === "periode" ? (
                <SelectField
                  control={control}
                  name="periode"
                  label="Periode/Tahun"
                  options={periodeOptionFromCookie ? [periodeOptionFromCookie] : []}
                  error={errors.periode?.message as any}
                  // Biar konsisten dengan header → non-editable kalau mau, tinggal aktifkan isDisabled
                  // isDisabled
                />
              ) : (
                <SelectField
                  control={control}
                  name="tahun"
                  label="Periode/Tahun"
                  options={yearOptions}
                  error={errors.tahun?.message as any}
                />
              )}

              <InputField control={control} name="target" label="Nilai Target" error={errors.target?.message as any} type="text" />
              <InputField control={control} name="satuan" label="Satuan" error={errors.satuan?.message as any} />
              <InputField control={control} name="keterangan" label="Keterangan" error={errors.keterangan?.message as any} isTextarea />
            </div>

            <div className="flex flex-col gap-4 mt-8">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full font-bold py-3 px-8 rounded-lg text-white bg-gradient-to-r from-cyan-500 to-blue-500 hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                {isSubmitting ? "Menyimpan..." : "Simpan"}
              </button>
              <button
                type="button"
                onClick={handleClose}
                className="w-full font-bold py-3 px-8 rounded-lg text-white bg-gradient-to-r from-red-500 to-pink-500 hover:opacity-90 transition-opacity"
              >
                Batal
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

/* ---------------- Helper Fields ---------------- */
interface InputFieldProps<TFormValues extends FieldValues> {
  control: Control<TFormValues>;
  name: keyof TFormValues;
  label: string;
  error?: string;
  isTextarea?: boolean;
  type?: string;
}
const InputField = ({
  control,
  name,
  label,
  error,
  isTextarea = false,
  type = "text",
}: InputFieldProps<FormValue>) => (
  <div>
    <label htmlFor={name as string} className="block text-sm font-bold text-gray-700 mb-2">
      {label}:
    </label>
    <Controller
      name={name as any}
      control={control}
      rules={{ required: `${label} tidak boleh kosong` }}
      render={({ field }) =>
        isTextarea ? (
          <textarea
            {...field}
            id={name as string}
            placeholder={`Masukkan ${label}`}
            className={`w-full p-3 border rounded-md focus:outline-none focus:ring-2 transition ${
              error ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-blue-500"
            }`}
            value={field.value ? String(field.value) : ""}
          />
        ) : (
          <input
            {...field}
            id={name as string}
            type={type}
            placeholder={`Masukkan ${label}`}
            className={`w-full p-3 border rounded-md focus:outline-none focus:ring-2 transition ${
              error ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-blue-500"
            }`}
            value={field.value === null || typeof field.value === "object" ? "" : (field.value as string)}
          />
        )
      }
    />
    {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
  </div>
);

interface SelectFieldProps<TFormValues extends FieldValues> {
  control: Control<TFormValues>;
  name: keyof TFormValues;
  label: string;
  options: OptionType[];
  error?: string;
  onMenuOpen?: () => void;
  isLoading?: boolean;
  // isDisabled? (optional)
  isDisabled?: boolean;
}
const SelectField = ({
  control,
  name,
  label,
  options,
  error,
  onMenuOpen,
  isLoading,
  isDisabled,
}: SelectFieldProps<FormValue>) => (
  <div>
    <label htmlFor={name as string} className="block text-sm font-bold text-gray-700 mb-2">
      {label}:
    </label>
    <Controller
      name={name as any}
      control={control}
      rules={{ required: `${label} tidak boleh kosong` }}
      render={({ field }) => (
        <Select
          {...field}
          inputId={name as string}
          options={options}
          placeholder={`Pilih ${label}`}
          isClearable
          isLoading={isLoading}
          onMenuOpen={onMenuOpen}
          isDisabled={isDisabled}
          styles={{
            control: (base, state) => ({
              ...base,
              padding: "0.30rem",
              borderRadius: "0.375rem",
              borderColor: error ? "rgb(239 68 68)" : "#D1D5DB",
              "&:hover": { borderColor: error ? "rgb(239 68 68)" : "#D1D5DB" },
              boxShadow: state.isFocused
                ? error
                  ? "0 0 0 2px rgb(254 202 202)"
                  : "0 0 0 2px rgb(191 219 254)"
                : "none",
            }),
          }}
        />
      )}
    />
    {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
  </div>
);

export default AddDataTableModal;

"use client";

import React, { useMemo, useEffect, useState } from "react";
import { useForm, Controller, SubmitHandler, useWatch } from "react-hook-form";
import Select from "react-select";
import { getCookie } from "@/app/components/lib/Cookie";

type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
};

interface OptionType {
  value: number;     // untuk periode: bebas, kita pakai Number(cookie.value) agar cocok tipe
  label: string;     // "2020–2025" atau "2020-2025"
}

interface FormValue {
  jenis_data: string;
  periode: OptionType | null;
  tahun: OptionType | null;
}

const AddDataModal: React.FC<ModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const {
    handleSubmit,
    control,
    reset,
    setValue,
    formState: { errors },
  } = useForm<FormValue>({
    defaultValues: {
      jenis_data: "",
      periode: null,
      tahun: null,
    },
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Guard: cek cookie periode dari header
  const [checked, setChecked] = useState(false);
  const [hasPeriode, setHasPeriode] = useState(false);

  // Periode static (boleh tetap ada). Default nanti diambil dari cookie
  const periodOptions: OptionType[] = [
    { label: "2020–2025", value: 2020 },
    { label: "2026–2030", value: 2026 },
    { label: "2031–2035", value: 2031 },
  ];

  // Ambil periode & tahun dari cookie saat modal dibuka
  useEffect(() => {
    if (!isOpen) return;

    // cookie "selectedPeriode" disimpan PageHeader sebagai JSON { value: string, label: "YYYY-YYYY" }
    const pRaw = getCookie("selectedPeriode");
    const yRaw = getCookie("selectedYear"); // string tahun, mis. "2032"

    let cookiePeriode: { value?: string | number; label?: string } | null = null;
    try {
      cookiePeriode = pRaw ? JSON.parse(pRaw) : null;
    } catch {
      cookiePeriode = null;
    }

    const adaPeriode = Boolean(cookiePeriode?.label);
    setHasPeriode(adaPeriode);

    if (adaPeriode) {
      // set default periode dari cookie
      const opt: OptionType = {
        value: Number(cookiePeriode!.value ?? 0),
        label: cookiePeriode!.label!, // bisa "2020-2025" atau "2020–2025"
      };
      setValue("periode", opt, { shouldDirty: false, shouldValidate: true });

      // jika ada cookie tahun & masih dalam rentang periode → set juga
      const m = opt.label.match(/(\d{4}).*?(\d{4})/);
      const start = m ? parseInt(m[1], 10) : NaN;
      const end = m ? parseInt(m[2], 10) : NaN;
      const yNum = yRaw ? Number(yRaw) : NaN;

      if (!Number.isNaN(start) && !Number.isNaN(end) && yNum >= start && yNum <= end) {
        setValue("tahun", { value: yNum, label: `Tahun ${yNum}` }, { shouldDirty: false, shouldValidate: true });
      } else {
        setValue("tahun", null, { shouldDirty: false, shouldValidate: true });
      }
    } else {
      // tidak ada cookie → kosongkan
      setValue("periode", null);
      setValue("tahun", null);
    }

    setChecked(true);
  }, [isOpen, setValue]);

  // Watch periode yang aktif
  const selectedPeriode = useWatch({ control, name: "periode" });

  // Opsi tahun hanya dari periode terpilih
  const filteredYearOptions: OptionType[] = useMemo(() => {
    if (!selectedPeriode) return [];
    // dukung hyphen (-) & en-dash (–)
    const m = selectedPeriode.label.match(/(\d{4}).*?(\d{4})/);
    const start = m ? parseInt(m[1], 10) : selectedPeriode.value;
    const end = m ? parseInt(m[2], 10) : selectedPeriode.value + 4;

    const arr: OptionType[] = [];
    for (let y = start; y <= end; y++) arr.push({ label: `Tahun ${y}`, value: y });
    return arr;
  }, [selectedPeriode]);

  // Periode berubah → kosongkan tahun agar tidak out-of-range
  useEffect(() => {
    setValue("tahun", null);
  }, [selectedPeriode, setValue]);

  const onSubmit: SubmitHandler<FormValue> = async (data) => {
    if (!data.jenis_data || !data.tahun) return;
    setIsSubmitting(true);

    const payload = {
      jenis_data: data.jenis_data,
      tahun: data.tahun.value,
    };

    try {
      const response = await fetch("https://alurkerja.zeabur.app/jenisdata", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errText = await response.text();
        throw new Error(`Gagal menyimpan data: ${errText}`);
      }

      alert("Data berhasil disimpan!");
      onSuccess?.();
      handleClose();
    } catch (error: any) {
      alert(`Gagal menyimpan data: ${error?.message ?? "unknown error"}`);
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
      style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
      onClick={handleClose}
    >
      <div
        className="relative z-10 bg-white rounded-lg shadow-xl w-full max-w-3xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-5 border-b">
          <h3 className="text-xl font-bold text-center text-gray-800">TAMBAH JENIS KELOMPOK DATA</h3>
        </div>

        {/* Guard isi modal: kalau periode belum dipilih di header, tampilkan pesan saja */}
        {checked && !hasPeriode ? (
          <div className="p-8">
            <div className="border rounded-lg p-6 text-center">
              <p className="text-red-600 font-semibold">Pilih Periode Terlebih Dahulu!</p>
              <p className="text-gray-500 mt-1">Set dari filter bar/header, lalu buka kembali modal ini.</p>
              <button
                onClick={handleClose}
                className="mt-4 inline-flex items-center justify-center px-4 py-2 rounded bg-gray-700 text-white hover:bg-gray-800"
              >
                Tutup
              </button>
            </div>
          </div>
        ) : (
          <div className="p-8">
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="grid grid-cols-1 gap-6">
                {/* Jenis Data */}
                <div>
                  <label htmlFor="jenis_data" className="block text-sm font-bold text-gray-700 mb-2">
                    JENIS KELOMPOK DATA
                  </label>
                  <Controller
                    name="jenis_data"
                    control={control}
                    rules={{ required: "Jenis data tidak boleh kosong" }}
                    render={({ field }) => (
                      <input
                        {...field}
                        id="jenis_data"
                        type="text"
                        placeholder="Masukkan Nama Data"
                        className={`w-full p-3 border rounded-md focus:outline-none focus:ring-2 transition ${
                          errors.jenis_data ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-blue-500"
                        }`}
                      />
                    )}
                  />
                  {errors.jenis_data && <p className="text-red-500 text-sm mt-1">{errors.jenis_data.message}</p>}
                </div>

                {/* Periode (default dari cookie) */}
                <div>
                  <label htmlFor="periode" className="block text-sm font-bold text-gray-700 mb-2">
                    PERIODE
                  </label>
                  <Controller
                    name="periode"
                    control={control}
                    rules={{ required: "Periode tidak boleh kosong" }}
                    render={({ field }) => (
                      <Select
                        {...field}
                        inputId="periode"
                        options={periodOptions}
                        placeholder="Pilih Periode"
                        isClearable
                      />
                    )}
                  />
                  {errors.periode && <p className="text-red-500 text-sm mt-1">{errors.periode.message}</p>}
                </div>

                {/* Tahun: hanya time-series dari periode yang aktif (default dari cookie jika valid) */}
                <div>
                  <label htmlFor="tahun" className="block text-sm font-bold text-gray-700 mb-2">
                    TAHUN
                  </label>
                  <Controller
                    name="tahun"
                    control={control}
                    rules={{ required: "Tahun tidak boleh kosong" }}
                    render={({ field }) => (
                      <Select
                        {...field}
                        inputId="tahun"
                        options={filteredYearOptions}
                        placeholder={selectedPeriode ? "Pilih Tahun" : "Pilih Periode dulu"}
                        isClearable
                        isDisabled={!selectedPeriode}
                      />
                    )}
                  />
                  {errors.tahun && <p className="text-red-500 text-sm mt-1">{errors.tahun.message}</p>}
                </div>
              </div>

              <div className="flex flex-col gap-4 mt-8">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full font-bold py-3 px-8 rounded-lg text-white bg-gradient-to-r from-cyan-500 to-blue-500 hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
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
        )}
      </div>
    </div>
  );
};

export default AddDataModal;

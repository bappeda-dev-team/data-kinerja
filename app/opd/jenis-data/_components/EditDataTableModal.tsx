"use client";

import React, { useState, useEffect } from "react";
import { getSessionId } from "@/app/components/lib/Cookie";

interface DataKinerja {
  id: number;
  jenis_data_id: number;
  nama_data: string;
  rumus_perhitungan: string;
  sumber_data: string;
  instansi_produsen_data: string;
  keterangan: string;
  target: { tahun: string | number; satuan: string; target: string | number }[];
}

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void | Promise<void>;
  dataItem: DataKinerja | null;
  jenisDataId?: string;
}

interface FormData {
  jenis_data_id: number | string;
  nama_data: string;
  rumus_perhitungan: string;
  sumber_data: string;
  instansi_produsen_data: string;
  keterangan: string;
  satuan: string;
  tahun: string | number;
  target: string | number;
}

// === konsisten dengan service lain ===
const API_BASE = process.env.NEXT_PUBLIC_API_BASE ?? "https://testapi.kertaskerja.cc/api/v1";
// endpoint sesuai gambar: /datakinerjaopd/{id}
// kalau backend-mu meletakkan di namespace "alur-kerja", pakai: `${API_BASE}/alur-kerja/datakinerjaopd/...`

const EditDataTableModal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  dataItem,
}) => {
  const [authToken, setAuthToken] = useState<string | null>(null);

  useEffect(() => {
    try {
      setAuthToken(getSessionId());
    } catch {
      setAuthToken(null);
    }
  }, []);

  const [formData, setFormData] = useState<FormData>({
    jenis_data_id: "",
    nama_data: "",
    rumus_perhitungan: "",
    sumber_data: "",
    instansi_produsen_data: "",
    keterangan: "",
    satuan: "",
    tahun: new Date().getFullYear(),
    target: "",
  });

  useEffect(() => {
    if (dataItem) {
      setFormData({
        jenis_data_id: dataItem.jenis_data_id,
        nama_data: dataItem.nama_data || "",
        rumus_perhitungan: dataItem.rumus_perhitungan || "",
        sumber_data: dataItem.sumber_data || "",
        instansi_produsen_data: dataItem.instansi_produsen_data || "",
        keterangan: dataItem.keterangan || "",
        satuan: dataItem.target?.[0]?.satuan || "",
        tahun: dataItem.target?.[0]?.tahun || new Date().getFullYear(),
        target: dataItem.target?.[0]?.target || "",
      });
    }
  }, [dataItem]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    if (!dataItem) return;
    if (!authToken) {
      alert("Sesi tidak valid. Silakan login ulang.");
      return;
    }

    // payload mengikuti kontrak: target berupa array {tahun,satuan,target}
    const payload = {
      jenis_data_id: formData.jenis_data_id,
      nama_data: formData.nama_data,
      rumus_perhitungan: formData.rumus_perhitungan,
      sumber_data: formData.sumber_data,
      instansi_produsen_data: formData.instansi_produsen_data,
      keterangan: formData.keterangan,
      target: [
        {
          tahun: String(formData.tahun),
          satuan: formData.satuan,
          target: String(formData.target),
        },
      ],
    };

    try {
      const res = await fetch(
        // sesuai gambar: PUT /datakinerjaopd/{id}
        `${API_BASE}/datakinerjaopd/${dataItem.id}`,
        {
          method: "PUT",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            "X-Session-Id": authToken,
          },
          body: JSON.stringify(payload),
          cache: "no-store",
        }
      );

      const raw = await res.text();
      if (!res.ok) {
        throw new Error(`HTTP ${res.status} – ${raw.slice(0, 200)}`);
      }

      await onSuccess();
      onClose();
    } catch (err) {
      console.error("Gagal update:", err);
      alert("Gagal memperbarui data.");
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 flex justify-center items-center z-50 p-4"
      style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
      onClick={onClose}
    >
      <div
        className="relative z-10 bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-5 border-b">
          <h3 className="text-xl font-bold text-center text-gray-800">
            EDIT DATA KINERJA
          </h3>
        </div>
        <div className="p-8">
          <div className="space-y-3">
            <input type="hidden" name="jenis_data_id" value={formData.jenis_data_id} />

            <label className="block text-sm font-bold text-gray-700 mb-2">Nama Data:</label>
            <input className="w-full border p-2 rounded" name="nama_data" value={formData.nama_data} onChange={handleChange} />

            <label className="block text-sm font-bold text-gray-700 mb-2">Rumus Perhitungan:</label>
            <input className="w-full border p-2 rounded" name="rumus_perhitungan" value={formData.rumus_perhitungan} onChange={handleChange} />

            <label className="block text-sm font-bold text-gray-700 mb-2">Sumber Data:</label>
            <input className="w-full border p-2 rounded" name="sumber_data" value={formData.sumber_data} onChange={handleChange} />

            <label className="block text-sm font-bold text-gray-700 mb-2">Instansi Produsen Data:</label>
            <input className="w-full border p-2 rounded" name="instansi_produsen_data" value={formData.instansi_produsen_data} onChange={handleChange} />

            <label className="block text-sm font-bold text-gray-700 mb-2">Tahun:</label>
            <select className="w-full border p-2 rounded" name="tahun" value={formData.tahun} onChange={handleChange}>
              <option value="">Pilih Tahun</option>
              {Array.from({ length: 10 }, (_, i) => {
                const year = new Date().getFullYear() - i;
                return (
                  <option key={year} value={year}>
                    {year}
                  </option>
                );
              })}
            </select>

            <label className="block text-sm font-bold text-gray-700 mb-2">Target:</label>
            <input className="w-full border p-2 rounded" name="target" value={formData.target} onChange={handleChange} />

            <label className="block text-sm font-bold text-gray-700 mb-2">Satuan:</label>
            <input className="w-full border p-2 rounded" name="satuan" value={formData.satuan} onChange={handleChange} />

            <label className="block text-sm font-bold text-gray-700 mb-2">Keterangan:</label>
            <input className="w-full border p-2 rounded" name="keterangan" value={formData.keterangan} onChange={handleChange} />
          </div>

          <div className="flex justify-end gap-2 mt-6">
            <button onClick={onClose} className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400">Batal</button>
            <button onClick={handleSubmit} className="px-4 py-2 rounded text-white bg-gradient-to-r from-green-400 to-green-600 hover:opacity-90">
              Simpan
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditDataTableModal;

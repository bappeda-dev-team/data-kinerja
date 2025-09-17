"use client";

import React, { useState, useEffect } from "react";
import Select from 'react-select';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  dataItem: any;
  jenisDataId?: string; 
}

const EditDataTableModal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  dataItem,
  jenisDataId,
}) => {
  const [formData, setFormData] = useState<any>({});

  useEffect(() => {
    if (dataItem) {
      setFormData({
        nama_data: dataItem.nama_data || "",
        rumus_perhitungan: dataItem.rumus_perhitungan || "",
        sumber_data: dataItem.sumber_data || "",
        instansi_produsen_data: dataItem.instansi_produsen_data || "",
        satuan: dataItem.target?.[0]?.satuan || "",
        keterangan: dataItem.keterangan || "",
        tahun: dataItem.target?.[0]?.tahun || new Date().getFullYear(),
        target: dataItem.target?.[0]?.target || "",
      });
    }
  }, [dataItem]);

  useEffect(() => {
    console.log("data hasil parsing :", dataItem)
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
  //   setFormData({ ...formData, [e.target.name]: e.target.value });
  // };

  const handleSubmit = async () => {
    try {
      await fetch(
        `https://alurkerja.zeabur.app/datakinerjapemda/${dataItem.id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...formData,
            jenis_data_id: jenisDataId, 
            target: [
              {
                tahun: formData.tahun,
                satuan: formData.satuan,
                target: formData.target,
              },
            ],
          }),
        }
      );
      await onSuccess();
      onClose();
    } catch (err) {
      console.error("Gagal update:", err);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex justify-center items-center z-50 p-4" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
        <div className="relative z-10 bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="p-5 border-b"><h3 className="text-xl font-bold text-center text-gray-800">EDIT DATA KINERJA</h3></div>
            <div className="p-8">

          <div className="space-y-3">
            <input
              className="w-full border p-2 rounded"
              name="nama_data"
              placeholder="Nama Data"
              value={formData.nama_data || ""}
              onChange={handleChange}
            />
            <input
              className="w-full border p-2 rounded"
              name="rumus_perhitungan"
              placeholder="Rumus Perhitungan"
              value={formData.rumus_perhitungan || ""}
              onChange={handleChange}
            />
            <input
              className="w-full border p-2 rounded"
              name="sumber_data"
              placeholder="Sumber Data"
              value={formData.sumber_data || ""}
              onChange={handleChange}
            />
            <input
              className="w-full border p-2 rounded"
              name="instansi_produsen_data"
              placeholder="Instansi Produsen Data"
              value={formData.instansi_produsen_data || ""}
              onChange={handleChange}
            />
            {/* <select
              className="w-full border p-2 rounded"
              name="tahun"
              value={formData.tahun || ""}
              onChange={handleChange}
            >
              <option value="">Pilih Tahun</option>
              {Array.from({ length: 10 }, (_, index) => (
                <option key={index} value={new Date().getFullYear() - index}>
                  {new Date().getFullYear() - index}
                </option>
              ))}
            </select> */}
            <input
              className="w-full border p-2 rounded"
              name="target"
              placeholder="Target"
              value={formData.target || ""}
              onChange={handleChange}
            />
            <input
              className="w-full border p-2 rounded"
              name="satuan"
              placeholder="Satuan"
              value={formData.satuan || ""}
              onChange={handleChange}
            />
            <input
              className="w-full border p-2 rounded"
              name="keterangan"
              placeholder="Keterangan"
              value={formData.keterangan || ""}
              onChange={handleChange}
            />
          </div>

          <div className="flex justify-end gap-2 mt-6">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400"
            >
              Batal
            </button>
            <button
              onClick={handleSubmit}
              className="px-4 py-2 rounded text-white bg-gradient-to-r from-green-400 to-green-600 hover:opacity-90"
            >
              Simpan
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditDataTableModal;

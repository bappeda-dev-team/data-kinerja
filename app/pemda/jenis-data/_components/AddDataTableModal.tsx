'use client';

import React, { useState } from "react";

type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

const AddDataTableModal = ({ isOpen, onClose }: ModalProps) => {
  const [formData, setFormData] = useState({
    namaData: "",
    rumus: "",
    sumber: "",
    instansi: "",
    tahun: "",
    satuan: "",
    keterangan: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
  console.log("Data berhasil disimpan:", formData); // ini nanti muncul di console
  alert(`Data berhasil disimpan:\n${JSON.stringify(formData, null, 2)}`);
  onClose();
  };

  const handleCancel = () => {
    alert("Batal menambahkan data!");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 flex justify-center items-center z-50 p-4"
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
    >
      <div className="relative z-10 bg-white rounded-lg shadow-xl w-full max-w-3xl p-6 
             max-h-[90vh] overflow-y-auto"
           onClick={(e) => e.stopPropagation()}>
        
        {/* Header */}
        <h3 className="text-xl font-bold text-center mb-6">TAMBAH DATA</h3>
        
        {/* Form */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Nama Data</label>
            <input
              type="text"
              name="namaData"
              value={formData.namaData}
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Rumus Penghitungan</label>
            <textarea
              name="rumus"
              value={formData.rumus}
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Sumber Data</label>
            <input
              type="text"
              name="sumber"
              value={formData.sumber}
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Instansi Produsen Data</label>
            <input
              type="text"
              name="instansi"
              value={formData.instansi}
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Tahun</label>
            <select
              name="tahun"
              value={formData.tahun}
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2"
            >
              <option value="">Pilih Tahun</option>
              {[2020,2021,2022,2023,2024,2025].map((year) => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Satuan</label>
            <input
              type="text"
              name="satuan"
              value={formData.satuan}
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Keterangan</label>
            <textarea
              name="keterangan"
              value={formData.keterangan}
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2"
            />
          </div>
        </div>

        {/* Tombol */}
        <div className="flex flex-col gap-4 mt-6">
          <button
            onClick={handleSave}
            className="w-full font-bold py-3 px-8 rounded-lg text-white bg-gradient-to-r from-cyan-500 to-blue-500 hover:opacity-90 transition-opacity"
          >
            Simpan
          </button>
          <button
            onClick={handleCancel}
            className="w-full font-bold py-3 px-8 rounded-lg text-white bg-gradient-to-r from-red-500 to-pink-500 hover:opacity-90 transition-opacity"
          >
            Batal
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddDataTableModal;

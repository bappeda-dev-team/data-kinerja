// src/app/pemda/jenis-data/_components/AddDataModal.tsx
import { X } from "lucide-react";
import React from "react";

type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

const AddDataModal = ({ isOpen, onClose }: ModalProps) => {
  if (!isOpen) return null;

  const years = ['2020', '2021', '2022', '2023', '2024', '2025'];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl">
        <div className="flex justify-between items-center p-4 border-b">
          <h3 className="text-lg font-bold">TAMBAH JENIS DATA</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-800">
            <X size={24} />
          </button>
        </div>
        <div className="p-6">
          <form>
            <div className="grid grid-cols-1 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">NAMA DATA:</label>
                <input type="text" placeholder="Masukkan Nama Data" className="w-full p-2 border border-gray-300 rounded-md" />
              </div>
               <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">RUMUS PENGHITUNGAN:</label>
                <input type="text" placeholder="Masukkan Rumus Penghitungan" className="w-full p-2 border border-gray-300 rounded-md" />
              </div>
               <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">SUMBER DATA:</label>
                <input type="text" placeholder="Masukkan Sumber Data" className="w-full p-2 border border-gray-300 rounded-md" />
              </div>
               <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">INSTANSI PRODUSEN DATA:</label>
                <input type="text" placeholder="Masukkan Instansi Produsen Data" className="w-full p-2 border border-gray-300 rounded-md" />
              </div>
              <div>
                 <label className="block text-sm font-medium text-gray-700 mb-1">TAHUN:</label>
                 <select className="w-full p-2 border border-gray-300 rounded-md">
                    <option>Pilih Tahun</option>
                    {years.map(year => <option key={year} value={year}>{year}</option>)}
                 </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">KETERANGAN:</label>
                <input type="text" placeholder="Masukkan Keterangan" className="w-full p-2 border border-gray-300 rounded-md" />
              </div>
            </div>
            <div className="flex justify-end gap-4 mt-8">
              <button type="button" onClick={onClose} className="font-bold py-2 px-8 rounded-lg text-white bg-gradient-to-r from-red-500 to-pink-500 hover:opacity-90">
                Batal
              </button>
              <button type="submit" className="font-bold py-2 px-8 rounded-lg text-white bg-gradient-to-r from-cyan-500 to-blue-500 hover:opacity-90">
                Simpan
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddDataModal;
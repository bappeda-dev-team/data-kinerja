import React from "react";

type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

const AddDataModal = ({ isOpen, onClose }: ModalProps) => {
  if (!isOpen) return null;

  const years = ['2020', '2021', '2022', '2023', '2024', '2025'];

  return (
    <div className="fixed inset-0 flex justify-center items-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl">
        <div className="p-5 border-b">
          <h3 className="text-xl font-bold text-center text-gray-800">
            TAMBAH JENIS DATA
          </h3>
        </div>
        <div className="p-8">
          <form>
            <div className="grid grid-cols-1 gap-6">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  JENIS DATA:
                </label>
                <input
                  type="text"
                  placeholder="Masukkan Nama Data"
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  TAHUN:
                </label>
                <select 
                  defaultValue=""
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white appearance-none"
                >
                    <option value="" disabled>Pilih Tahun</option>
                    {years.map(year => <option key={year} value={year}>{year}</option>)}
                </select>
              </div>
            </div>
            <div className="flex flex-col gap-4 mt-8">
              <button
                type="submit"
                className="w-full font-bold py-3 px-8 rounded-lg text-white bg-gradient-to-r from-cyan-500 to-blue-500 hover:opacity-90 transition-opacity"
              >
                Simpan
              </button>
              <button
                type="button"
                onClick={onClose}
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

export default AddDataModal;
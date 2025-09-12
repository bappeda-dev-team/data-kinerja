// Ganti seluruh isi file: app/pemda/jenis-data/_components/DataTable.tsx

'use client';
import React, { useState } from 'react';

const years = ['2020', '2021', '2022', '2023', '2024', '2025'];

type Target = {
  tahun: string;
  satuan: string;
  target: string;
};

type DataItem = {
  id: number;
  nama_data: string;
  rumus_perhitungan: string;
  sumber_data: string;
  instansi_produsen_data: string;
  satuan: string;
  keterangan: string;
  target: Target[];
};

// Props diperbarui untuk menerima fungsi onUpdate dan onDelete
type DataTableProps = {
  dataList?: DataItem[];
  onUpdate: (item: DataItem) => void;
  onDelete: (id: number) => void;
};

const DataTable = ({ dataList = [], onUpdate, onDelete }: DataTableProps) => {
  const [openModal, setOpenModal] = useState(false);
  const [keterangan, setKeterangan] = useState('');

  const handleOpenModal = (ket: string) => {
    setKeterangan(ket || '');
    setOpenModal(true);
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm text-left border-collapse">
        <thead className="bg-[#10B981] text-white uppercase rounded-t-xl">
          <tr>
            <th rowSpan={2} className="p-2 border border-gray-300 text-center whitespace-nowrap">No</th>
            <th rowSpan={2} className="p-2 border border-gray-300 text-center whitespace-nowrap">Nama Data</th>
            <th rowSpan={2} className="p-2 border border-gray-300 text-center whitespace-nowrap">Rumus Perhitungan</th>
            <th rowSpan={2} className="p-2 border border-gray-300 text-center whitespace-nowrap">Sumber Data</th>
            <th rowSpan={2} className="p-2 border border-gray-300 text-center whitespace-nowrap">Instansi Produsen Data</th>
            <th colSpan={years.length} className="p-2 border border-gray-300 text-center whitespace-nowrap">Tahun</th>
            <th rowSpan={2} className="p-2 border border-gray-300 text-center whitespace-nowrap">Satuan</th>
            <th rowSpan={2} className="p-2 border border-gray-300 text-center whitespace-nowrap">Keterangan</th>
            <th rowSpan={2} className="p-2 border border-gray-300 text-center whitespace-nowrap">Aksi</th>
          </tr>
          <tr>
            {years.map(year => (
              <th key={year} className="p-2 border border-gray-300 text-center whitespace-nowrap">{year}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {dataList.length > 0 ? (
            dataList.map((row, index) => {
              const tahunMap: Record<string, string> = {};
              row.target?.forEach(t => {
                tahunMap[t.tahun] = t.target;
              });

              return (
                <tr key={row.id} className="bg-white hover:bg-gray-50">
                  <td className="p-2 border border-gray-300 text-center">{index + 1}</td>
                  <td className="p-2 border border-gray-300 text-center">{row.nama_data}</td>
                  <td className="p-2 border border-gray-300 text-center">{row.rumus_perhitungan}</td>
                  <td className="p-2 border border-gray-300 text-center">{row.sumber_data}</td>
                  <td className="p-2 border border-gray-300 text-center">{row.instansi_produsen_data}</td>
                  {years.map(year => (
                    <td key={year} className="p-2 border border-gray-300 text-center">
                      {tahunMap[year] || "-"}
                    </td>
                  ))}
                  <td className="p-2 border border-gray-300">{row.satuan}</td>
                  <td className="p-2 border border-gray-300 text-center">
                    <button
                      onClick={() => handleOpenModal(row.keterangan)}
                      className="px-3 py-1 text-white rounded bg-gradient-to-r from-purple-500 to-indigo-500 hover:opacity-90 transition"
                    >
                      Tampilkan Keterangan
                    </button>
                  </td>
                  {/* Bagian ini diubah untuk tombol gradasi */}
                  <td className="p-2 border border-gray-300 text-center">
                    <div className='flex flex-col items-center gap-2'> {/* Menggunakan flex-col untuk tombol vertikal */}
                       <button
                         onClick={() => onUpdate(row)}
                         className="px-4 py-2 text-white rounded-lg
                                    bg-gradient-to-r from-green-400 to-green-600
                                    hover:from-green-500 hover:to-green-700
                                    transition-all duration-200 shadow-md w-full max-w-[100px]"
                       >
                         Edit
                       </button>
                       <button
                         onClick={() => onDelete(row.id)}
                         className="px-4 py-2 text-white rounded-lg
                                    bg-gradient-to-r from-red-500 to-red-700
                                    hover:from-red-600 hover:to-red-800
                                    transition-all duration-200 shadow-md w-full max-w-[100px]"
                       >
                         Hapus
                       </button>
                    </div>
                  </td>
                </tr>
              );
            })
          ) : (
            <tr className="bg-white">
              <td colSpan={years.length + 9} className="p-3 text-center text-gray-500 border border-gray-300">
                Tidak ada data.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Modal Keterangan */}
      {openModal && (
        <div
          className="fixed inset-0 flex justify-center items-center z-50 p-4"
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
          onClick={() => setOpenModal(false)}
        >
          <div
            className="relative z-10 bg-white rounded-lg shadow-xl w-full max-w-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center p-5 border-b">
              <h3 className="text-xl font-bold text-gray-800">KETERANGAN DATA</h3>
              <button
                onClick={() => setOpenModal(false)}
                className="text-gray-500 hover:text-gray-800 text-2xl"
              >
                &times;
              </button>
            </div>
            <div className="p-6">
              {keterangan ? (
                <p className="text-gray-700 whitespace-pre-line">{keterangan}</p>
              ) : (
                <p className="text-gray-400 italic">Belum ada keterangan</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DataTable;
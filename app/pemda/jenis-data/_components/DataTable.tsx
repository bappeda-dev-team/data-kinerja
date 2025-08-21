'use client';
import React, { useState } from 'react';

const initialData = [
  { no: 1, nama: 'Contoh Data 1', rumus: 'Contoh Rumus Penghitungan', sumber: 'Contoh Sumber Data', instansi: 'Contoh Instansi Produsen Data', tahun: { '2020': '10', '2021': '10', '2022': '10', '2023': '10', '2024': '10', '2025': '10' }, satuan: 'Contoh Satuan', keterangan: '' },
  { no: 2, nama: 'Contoh Data 2', rumus: 'Contoh Rumus Penghitungan', sumber: 'Contoh Sumber Data', instansi: 'Contoh Instansi Produsen Data', tahun: { '2020': '10', '2021': '10', '2022': '10', '2023': '10', '2024': '10', '2025': '10' }, satuan: 'Contoh Satuan', keterangan: '' },
];

const years = ['2020', '2021', '2022', '2023', '2024', '2025'];

const DataTable = () => {
  const [tableData, setTableData] = useState(initialData);
  const [openModal, setOpenModal] = useState(false);
  const [selectedRow, setSelectedRow] = useState<number | null>(null);
  const [keterangan, setKeterangan] = useState("");

  const handleOpenModal = (rowIndex: number) => {
    setSelectedRow(rowIndex);
    setKeterangan(tableData[rowIndex].keterangan || "");
    setOpenModal(true);
  };

  const handleSave = () => {
    if (selectedRow === null) return;

    const newData = [...tableData];
    newData[selectedRow].keterangan = keterangan;

    setTableData(newData);
    console.log("Data tersimpan:", newData[selectedRow]);

    alert("Keterangan berhasil disimpan!");

    setOpenModal(false);
    setSelectedRow(null);
    setKeterangan("");
  };

  const handleCancel = () => {
    alert("Aksi dibatalkan.");
    setOpenModal(false);
    setSelectedRow(null);
    setKeterangan("");
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm text-left border-collapse">
        <thead className="bg-[#10B981] text-white uppercase rounded-t-xl">
          <tr>
            <th rowSpan={2} className="p-2 border border-gray-300 whitespace-nowrap">No</th>
            <th rowSpan={2} className="p-2 border border-gray-300 whitespace-nowrap">Nama Data</th>
            <th rowSpan={2} className="p-2 border border-gray-300 whitespace-nowrap">Rumus Penghitungan</th>
            <th rowSpan={2} className="p-2 border border-gray-300 whitespace-nowrap">Sumber Data</th>
            <th rowSpan={2} className="p-2 border border-gray-300 whitespace-nowrap">Instansi Produsen Data</th>
            <th colSpan={6} className="p-2 border border-gray-300 text-center whitespace-nowrap">Tahun</th>
            <th rowSpan={2} className="p-2 border border-gray-300 whitespace-nowrap">Satuan</th>
            <th rowSpan={2} className="p-2 border border-gray-300 whitespace-nowrap">Keterangan</th>
          </tr>
          <tr>
            {years.map(year => (
              <th key={year} className="p-2 border border-gray-300 text-center whitespace-nowrap">{year}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {tableData.map((row, index) => (
            <tr key={row.no} className="bg-white hover:bg-gray-50">
              <td className="p-2 border border-gray-300 text-center">{row.no}</td>
              <td className="p-2 border border-gray-300">{row.nama}</td>
              <td className="p-2 border border-gray-300">{row.rumus}</td>
              <td className="p-2 border border-gray-300">{row.sumber}</td>
              <td className="p-2 border border-gray-300">{row.instansi}</td>
              {years.map(year => (
                <td key={year} className="p-2 border border-gray-300"></td>
              ))}
              <td className="p-2 border border-gray-300">{row.satuan}</td>
              <td className="p-2 border border-gray-300 text-center">
                <button
                  onClick={() => handleOpenModal(index)}
                  className="px-3 py-1 text-white rounded bg-gradient-to-r from-purple-500 to-indigo-500 hover:opacity-90 transition"
                >
                  Tampilkan Keterangan
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal */}
      {openModal && (
        <div 
          className="fixed inset-0 flex justify-center items-center z-50 p-4"
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
        >
          <div 
            className="relative z-10 bg-white rounded-lg shadow-xl w-full max-w-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-5 border-b">
              <h3 className="text-xl font-bold text-center text-gray-800">
                KETERANGAN DATA
              </h3>
            </div>
            <div className="p-6">
              <textarea
                value={keterangan}
                onChange={(e) => setKeterangan(e.target.value)}
                placeholder="Masukkan keterangan"
                className="w-full border rounded-md p-3 mb-6 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <div className="flex flex-col gap-3">
                <button
                  onClick={handleSave}
                  className="w-full font-bold py-3 px-8 rounded-lg text-white bg-gradient-to-r from-purple-500 to-indigo-500 hover:opacity-90 transition"
                >
                  Simpan
                </button>
                <button
                  onClick={handleCancel}
                  className="w-full font-bold py-3 px-8 rounded-lg text-white bg-gradient-to-r from-red-500 to-pink-500 hover:opacity-90 transition"
                >
                  Batal
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DataTable;

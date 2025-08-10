import React from 'react';

const tableData = [
  { no: 1, nama: 'A', rumus: '', sumber: '', instansi: '', tahun: { '2020': '', '2021': '', '2022': '', '2023': '', '2024': '', '2025': '' }, satuan: '', keterangan: '' },
  { no: 2, nama: 'B', rumus: '', sumber: '', instansi: '', tahun: { '2020': '', '2021': '', '2022': '', '2023': '', '2024': '', '2025': '' }, satuan: '', keterangan: '' },
];

const years = ['2020', '2021', '2022', '2023', '2024', '2025'];

const DataTable = () => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm text-left border-collapse">
        <thead className="bg-teal-500 text-white uppercase">
          <tr>
            <th rowSpan={2} className="p-3 border border-gray-300">No</th>
            <th rowSpan={2} className="p-3 border border-gray-300">Nama Data</th>
            <th rowSpan={2} className="p-3 border border-gray-300">Rumus Penghitungan</th>
            <th rowSpan={2} className="p-3 border border-gray-300">Sumber Data</th>
            <th rowSpan={2} className="p-3 border border-gray-300">Instansi Produsen Data</th>
            <th colSpan={6} className="p-3 border border-gray-300 text-center">Tahun</th>
            <th rowSpan={2} className="p-3 border border-gray-300">Satuan</th>
            <th rowSpan={2} className="p-3 border border-gray-300">Keterangan</th>
          </tr>
          <tr>
            {years.map(year => (
              <th key={year} className="p-3 border border-gray-300 text-center">{year}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {tableData.map((row) => (
            <tr key={row.no} className="bg-white hover:bg-gray-50">
              <td className="p-3 border border-gray-300 text-center">{row.no}</td>
              <td className="p-3 border border-gray-300">{row.nama}</td>
              <td className="p-3 border border-gray-300">{row.rumus}</td>
              <td className="p-3 border border-gray-300">{row.sumber}</td>
              <td className="p-3 border border-gray-300">{row.instansi}</td>
              {years.map(year => (
                 <td key={year} className="p-3 border border-gray-300"></td>
              ))}
              <td className="p-3 border border-gray-300">{row.satuan}</td>
              <td className="p-3 border border-gray-300">{row.keterangan}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DataTable;
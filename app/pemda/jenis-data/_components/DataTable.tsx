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
        {/* Mengubah rounded-t-lg menjadi rounded-t-xl untuk sudut yang lebih melengkung */}
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
          {tableData.map((row) => (
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
              <td className="p-2 border border-gray-300">{row.keterangan}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DataTable;
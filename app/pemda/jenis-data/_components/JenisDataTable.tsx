// src/app/pemda/jenis-data/_components/JenisDataTable.tsx
'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const jenisDataList = [
  { id: 'iku', name: 'IKU' },
  { id: 'rkpd', name: 'RKPD' },
];

const JenisDataTable = () => {
  const router = useRouter();

  const handleDelete = (id: string) => {
    // Logika untuk menghapus data
    alert(`Anda akan menghapus data dengan ID: ${id}`);
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm text-left border-collapse">
        <thead className="bg-table-header-bg text-gray-800 uppercase">
          <tr>
            <th className="p-3 border border-gray-300 w-16">No</th>
            <th className="p-3 border border-gray-300">Jenis Data</th>
            <th className="p-3 border border-gray-300 w-48 text-center">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {jenisDataList.map((item, index) => (
            <tr key={item.id} className="bg-white hover:bg-gray-50">
              <td className="p-3 border border-gray-300 text-center">{index + 1}</td>
              <td className="p-3 border border-gray-300">{item.name}</td>
              <td className="p-3 border border-gray-300">
                <div className="flex justify-center gap-2">
                  <Link href={`/pemda/jenis-data/${item.id}`}>
                    <button className="bg-success-green text-white px-4 py-1 rounded hover:bg-green-700">
                      Show
                    </button>
                  </Link>
                  <button 
                    onClick={() => handleDelete(item.id)}
                    className="bg-danger-red text-white px-4 py-1 rounded hover:bg-red-700"
                  >
                    Hapus
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default JenisDataTable;
'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

type JenisDataTableProps = {
  jenisDataList: { id: number; jenis_data: string }[];
  onDelete: (id: number) => void; // 👈 tambahan
};

const JenisDataTable = ({ jenisDataList, onDelete }: JenisDataTableProps) => {
  const pathname = usePathname();
  const isOpdRoute = pathname?.startsWith('/opd');

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm text-left border-collapse">
        <thead className="bg-blue-200 text-gray-800 uppercase">
          <tr>
            <th className="p-3 border border-gray-300 w-16 text-center">No</th>
            <th className="p-3 border border-gray-300">Jenis Data</th>
            <th className="p-3 border border-gray-300 w-48 text-center">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {jenisDataList?.length > 0 ? (
            jenisDataList.map((item, index) => (
              <tr key={item.id} className="bg-white hover:bg-gray-50">
                <td className="p-3 border border-gray-300 text-center">{index + 1}</td>
                <td className="p-3 border border-gray-300">{item.jenis_data}</td>
                <td className="p-3 border border-gray-300">
                  <div className="flex flex-col items-center gap-2 px-4">
                    <Link
                      href={`${isOpdRoute ? '/opd' : '/pemda'}/jenis-data/${item.id}`}
                      className="w-full"
                    >
                      <button className="bg-gradient-to-r from-green-500 to-teal-500 text-white px-4 py-1 rounded hover:opacity-90 transition-opacity w-full">
                        Show
                      </button>
                    </Link>
                    <button
                      onClick={() => onDelete(item.id)} // 👈 trigger ke parent
                      className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-4 py-1 rounded hover:opacity-90 transition-opacity w-full"
                    >
                      Hapus
                    </button>
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr className="bg-white">
              <td colSpan={3} className="p-3 text-center text-gray-500 border border-gray-300">
                Tidak ada data.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default JenisDataTable;

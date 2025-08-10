// src/app/pemda/jenis-data/page.tsx (Updated)
'use client'; 
import { useState } from 'react';
import { Home, Plus } from 'lucide-react';
import JenisDataTable from './_components/JenisDataTable';
import AddDataModal from './_components/AddDataModal'; 

const JenisDataPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div>
      {/* Breadcrumbs & Filter Bar (Sama seperti sebelumnya) */}
      <div className="flex items-center text-sm text-gray-500 mb-4">
        <Home size={16} />
        <span className="mx-2">/</span>
        <span>Pemda</span>
         <span className="mx-2">/</span>
        <span className="font-semibold text-gray-800">Jenis Data</span>
      </div>
      {/* ... Filter bar bisa diletakkan di sini ... */}

      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-sidebar-bg">JENIS DATA</h2>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 bg-primary-blue text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors"
          >
            <Plus size={20} />
            Tambah Jenis Data
          </button>
        </div>

        <JenisDataTable />
      </div>

      <AddDataModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
};

export default JenisDataPage;
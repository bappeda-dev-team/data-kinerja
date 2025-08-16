'use client'; 
import { useState } from 'react';
import { Plus } from 'lucide-react';
import Link from 'next/link'; // Import Link
import JenisDataTable from './_components/JenisDataTable';
import AddDataModal from './_components/AddDataModal'; 
import PageHeader from '@/app/components/layout/PageHeader'; 

const JenisDataPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div>
      <PageHeader />
      <div className="bg-white p-6 rounded-b-lg shadow-md border border-gray-300 border-t-0">
        <div className="flex items-center text-sm text-gray-500 mb-4">
          {/* Ikon rumah diganti dengan Link ke Dashboard */}
          <Link href="/dashboard" className="hover:underline">Dashboard</Link>
          <span className="mx-2">/</span>
          <Link href="/pemda" className="hover:underline">Pemda</Link>
           <span className="mx-2">/</span>
          <span className="font-semibold text-gray-800">Jenis Data</span>
        </div>
        
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-sidebar-bg">JENIS DATA</h2>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-bold py-2 px-4 rounded-lg hover:opacity-90 transition-colors"
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
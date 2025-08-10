'use client'; 
import { useState } from 'react';
import { Home, Plus } from 'lucide-react';
import JenisDataTable from '../jenis-data/_components/JenisDataTable';
import AddDataModal from '../jenis-data/_components/AddDataModal'; 
import PageHeader from '@/app/components/layout/PageHeader';

const JenisDataPageOPD = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div>
      <PageHeader title="Laman OPD > Jenis Data" />
      <div className="bg-white p-6 rounded-b-lg shadow-md border border-gray-300 border-t-0">
        <div className="flex items-center text-sm text-gray-500 mb-4">
          <Home size={16} />
          <span className="mx-2">/</span>
          <span>OPD</span>
           <span className="mx-2">/</span>
          <span className="font-semibold text-gray-800">Jenis Data</span>
        </div>
        
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-sidebar-bg">JENIS DATA</h2>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 bg-button-blue text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors"
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

export default JenisDataPageOPD;
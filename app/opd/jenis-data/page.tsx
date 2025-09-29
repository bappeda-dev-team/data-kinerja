'use client'; 
import { useState } from 'react';
import { Plus } from 'lucide-react';
import Link from 'next/link'; // Import Link
import JenisDataTable from '../jenis-data/_components/JenisDataTable';
import AddDataModal from '../jenis-data/_components/AddDataModal'; 
import PageHeader from '@/app/components/layout/PageHeader';
import { FiHome } from 'react-icons/fi';
const JenisDataPageOPD = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div>
      {/* <PageHeader /> */}
      <div className="bg-white p-6 rounded-b-lg shadow-md border border-gray-300 border-t-0">
        <div className="flex items-center mb-4">
          {/* Ikon rumah diganti dengan Link ke Dashboard */}
           <div className="flex items-center">
                          <Link href="/" className=""><FiHome size={16}/></Link>
                      </div>
          <p className="mx-2">/</p>
          <Link href="/opd" className="hover:underline">OPD</Link>
           <p className="mx-2">/</p>
          <p className="font-semibold text-gray-1200">Jenis Data</p>
          
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

export default JenisDataPageOPD;
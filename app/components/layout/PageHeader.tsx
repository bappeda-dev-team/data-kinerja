'use client'; // Menjadikan ini sebagai Client Component untuk menggunakan state
import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

const PageHeader = () => {
    // State untuk menyimpan nama dinas yang dipilih
    const [selectedDinas, setSelectedDinas] = useState('Dinas Kesehatan');

    const handleDinasChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedDinas(event.target.value);
    };

    return (
        <div className="bg-filter-bar-bg p-3 rounded-lg flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Bagian Kiri: Judul dinamis */}
            <div className="flex items-center gap-3 text-white cursor-pointer w-full md:w-auto">
                <h2 className="text-lg font-semibold">{selectedDinas}</h2>

            </div>

            {/* Bagian Kanan: Filter dan Tombol */}
            <div className="flex flex-col sm:flex-row items-center gap-2 w-full md:w-auto">
                <select 
                    className="bg-white text-black text-sm rounded-md px-3 py-1.5 focus:outline-none w-full sm:w-auto"
                    value={selectedDinas} // Mengikat nilai select dengan state
                    onChange={handleDinasChange} // Menambahkan event handler
                >
                    <option>Dinas Kesehatan</option>
                    <option>Dinas Pendidikan</option>
                    <option>Dinas Pekerjaan Umum</option>
                    <option>Dinas Perumahan Rakyat</option>
                    <option>Dinas Sosial</option>
                    <option>Dinas Kependudukan</option>
                    <option>Dinas Lingkungan Hidup</option>
                    <option>Dinas Perhubungan</option>
                    <option>Dinas Koperasi</option>
                    <option>Dinas Perindustrian</option>
                </select>
                <select 
                    className="bg-white text-black text-sm rounded-md px-3 py-1.5 focus:outline-none w-full sm:w-auto"
                >
                    <option>Tahun 2019</option>
                    <option>Tahun 2020</option>
                    <option>Tahun 2021</option>
                    <option>Tahun 2022</option>
                    <option>Tahun 2023</option>
                    <option>Tahun 2024</option>
                    <option>Tahun 2025</option>
                    <option>Tahun 2026</option>
                    <option>Tahun 2027</option>
                    <option>Tahun 2028</option>
                </select>
                <div className="flex items-center gap-2 w-full sm:w-auto">
                    <button className="bg-sidebar-bg text-white px-4 py-1.5 rounded-md text-sm font-semibold w-full sm:w-auto">Aktifkan</button>
                    <button className="bg-sidebar-bg text-white px-4 py-1.5 rounded-md text-sm font-semibold w-full sm:w-auto">Admin Pemda</button>
                </div>
            </div>
        </div>
    );
};

export default PageHeader;
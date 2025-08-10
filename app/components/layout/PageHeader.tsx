// src/components/layout/PageHeader.tsx

import React from 'react';

// Kita bisa buat props agar dinamis di halaman lain
type PageHeaderProps = {
    title: string;
};

const PageHeader = ({ title }: PageHeaderProps) => {
    return (
        <div className="bg-filter-bar-bg p-4 rounded-t-lg border border-gray-700 flex items-center justify-between sticky top-0 z-20">
            <h2 className="text-lg font-semibold text-white">{title}</h2>
            <div className="flex items-center gap-4">
                <select className="border-gray-300 rounded-md py-2 px-3 bg-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option>Dinas Kesehatan</option>
                </select>
                <select className="border-gray-300 rounded-md py-2 px-3 bg-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option>Tahun 2019</option>
                </select>
                <button className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 text-sm font-semibold">Aktifkan</button>
                <button className="bg-gray-700 text-white px-4 py-2 rounded-md hover:bg-gray-800 text-sm font-semibold">Admin Pemda</button>
            </div>
        </div>
    );
};

export default PageHeader;
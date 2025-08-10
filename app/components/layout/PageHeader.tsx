import React from 'react';

type PageHeaderProps = {
    title: string;
};

const PageHeader = ({ title }: PageHeaderProps) => {
    return (
        <div className="bg-filter-bar-bg p-4 rounded-t-lg border border-gray-700 flex flex-col lg:flex-row items-center justify-between gap-4">
            <h2 className="text-lg font-semibold text-white w-full lg:w-auto text-center lg:text-left">{title}</h2>
            <div className="flex flex-col sm:flex-row items-center gap-2 md:gap-4 w-full lg:w-auto">
                <select className="border-gray-300 rounded-md py-2 px-3 bg-gray-200 text-sm text-black focus:outline-none focus:ring-2 focus:ring-blue-500 w-full">
                    <option>Dinas Kesehatan</option>
                    <option>Dinas Pendidikan</option>
                    <option>Dinas Pekerjaan Umum</option>
                </select>
                <select className="border-gray-300 rounded-md py-2 px-3 bg-gray-200 text-sm text-black focus:outline-none focus:ring-2 focus:ring-blue-500 w-full">
                    <option>Tahun 2019</option>
                    <option>Tahun 2020</option>
                    <option>Tahun 2021</option>
                    <option>Tahun 2022</option>
                    <option>Tahun 2023</option>
                </select>
                <div className="flex items-center gap-2 w-full sm:w-auto">
                    <button className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 text-sm font-semibold w-full sm:w-auto">Aktifkan</button>
                    <button className="bg-gray-700 text-white px-4 py-2 rounded-md hover:bg-gray-800 text-sm font-semibold w-full sm:w-auto">Admin Pemda</button>
                </div>
            </div>
        </div>
    );
};

export default PageHeader;

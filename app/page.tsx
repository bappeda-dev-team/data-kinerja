import { FileText, Download } from 'lucide-react';

const FilterBar = () => {
    return (
        <div className="bg-filter-bar-bg p-4 rounded-t-lg border border-gray-700 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-white">Dinas Kesehatan</h2>
            <div className="flex items-center gap-4">
                <select className="border-gray-300 rounded-md py-2 px-3 bg-gray-200 text-sm">
                    <option>Dinas Kesehatan</option>
                </select>
                <select className="border-gray-300 rounded-md py-2 px-3 bg-gray-200 text-sm">
                    <option>Tahun 2019</option>
                </select>
                <button className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 text-sm font-semibold">Aktifkan</button>
                <button className="bg-gray-700 text-white px-4 py-2 rounded-md hover:bg-gray-800 text-sm font-semibold">Admin Pemda</button>
            </div>
        </div>
    );
};

const ContentPane = () => {
    return (
        <div className="bg-white rounded-b-lg border border-gray-300 border-t-0">
            <div className="p-6">
                <p className="text-gray-700">Selamat Datang, Admin Pemda!</p>
            </div>

            <hr className="border-gray-200" />

            <div className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <FileText className="text-button-blue" size={22} />
                    <p className="text-gray-800">Download Panduan Website (Manual User)</p>
                </div>
                <a
                    href="/path/to/manual.pdf"
                    download
                    className="flex items-center gap-2 bg-button-blue text-white font-semibold py-2 px-5 rounded-md hover:bg-opacity-90 transition-colors"
                >
                    <Download size={18} />
                    Download
                </a>
            </div>
        </div>
    );
};


const DashboardPage = () => {
  return (
    <div>
      <FilterBar />
      <ContentPane />
    </div>
  );
};

export default DashboardPage;
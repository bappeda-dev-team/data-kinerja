// src/app/dashboard/page.tsx (UPDATED - CLEANED UP)
import { FileText, Download } from 'lucide-react';

// Komponen ContentPane sekarang tidak perlu mengekspor FilterBar
const ContentPane = () => {
    return (
        // Perhatikan, rounded-t-lg dihilangkan karena sekarang menempel di bawah PageHeader
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

// Halaman Dashboard sekarang hanya merender ContentPane
const DashboardPage = () => {
  return (
    <ContentPane />
  );
};

export default DashboardPage;
import { FileText, Download } from 'lucide-react';
import PageHeader from '../components/layout/PageHeader';
import ContentContainer from '../components/layout/ContentContainer';

const DashboardPage = () => {
  return (
    <>
      <PageHeader />
      <ContentContainer>
        <div className="pb-4">
          <p className="text-gray-700">Selamat Datang, Admin Pemda!</p>
        </div>
        <hr className="border-gray-200" />
        <div className="pt-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
                <FileText className="text-button-blue" size={22} />
                <p className="text-gray-800">Download Panduan Website (Manual User)</p>
            </div>
            <a
                href="#"
                download
                className="flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-semibold py-2 px-5 rounded-md hover:opacity-90 transition-colors"
            >
                <Download size={18} />
                Download
            </a>
        </div>
      </ContentContainer>
    </>
  );
};

export default DashboardPage;
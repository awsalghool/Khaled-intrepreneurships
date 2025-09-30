
import React, { useState } from 'react';

const TOTAL_PAGES = 15;

const EbookReader: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);

  const handlePrint = () => {
    const printContents = document.getElementById('printable-page')?.innerHTML;
    const originalContents = document.body.innerHTML;
    if (printContents) {
      document.body.innerHTML = printContents;
      window.print();
      document.body.innerHTML = originalContents;
      // We need to re-attach the react app
      window.location.reload(); 
    }
  };

  const goToNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, TOTAL_PAGES));
  };

  const goToPrevPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };
  
  return (
    <div className="w-full max-w-4xl bg-white p-6 rounded-xl shadow-lg flex flex-col items-center">
      <h2 className="text-2xl font-bold text-center text-gray-800 mb-4">كتاب ريادة الأعمال</h2>
      
      <div id="printable-page" className="w-full aspect-[210/297] mb-4 border rounded-md overflow-hidden">
        {/* Placeholder for ebook page images */}
        <img 
          src={`https://picsum.photos/seed/ebookpage${currentPage}/840/1188`} 
          alt={`E-book Page ${currentPage}`}
          className="w-full h-full object-cover"
        />
        {/* In a real application, you would replace the picsum URL with your actual page images */}
        {/* e.g., src={`/ebook-assets/page-${currentPage}.png`} */}
      </div>

      <div className="w-full flex justify-between items-center">
        <button
          onClick={goToPrevPage}
          disabled={currentPage === 1}
          className="px-4 py-2 font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:bg-gray-400 transition-colors"
        >
          السابق
        </button>
        <span className="font-bold text-gray-700">
          صفحة {currentPage} من {TOTAL_PAGES}
        </span>
        <button
          onClick={goToNextPage}
          disabled={currentPage === TOTAL_PAGES}
          className="px-4 py-2 font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:bg-gray-400 transition-colors"
        >
          التالي
        </button>
      </div>
      <div className="mt-6 w-full border-t pt-4 text-center">
         <button
            onClick={handlePrint}
            className="inline-flex items-center px-6 py-2 font-semibold text-blue-600 border border-blue-600 rounded-md hover:bg-blue-50 transition-colors"
        >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5 4v3H4a2 2 0 00-2 2v3a2 2 0 002 2h1v-2a1 1 0 011-1h8a1 1 0 011 1v2h1a2 2 0 002-2v-3a2 2 0 00-2-2h-1V4a2 2 0 00-2-2H7a2 2 0 00-2 2zm8 0H7v3h6V4zm0 8H7v4h6v-4z" clipRule="evenodd" />
            </svg>
            طباعة هذه الصفحة
        </button>
      </div>
    </div>
  );
};

export default EbookReader;

import React, { useState, useRef, useCallback, useMemo } from 'react';
import type { RegistrationRecord } from '../types';
import Certificate from './Certificate';

interface AdminDashboardProps {
  registrations: Record<string, RegistrationRecord>;
  onDelete: (phone: string) => void;
}

type SortBy = 'date' | 'projectName' | 'founderName';
type SortDirection = 'asc' | 'desc';

const AdminDashboard: React.FC<AdminDashboardProps> = ({ registrations, onDelete }) => {
  const [modalRecord, setModalRecord] = useState<RegistrationRecord | null>(null);
  const certificateRef = useRef<HTMLDivElement>(null);
  const [sortBy, setSortBy] = useState<SortBy>('date');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [searchQuery, setSearchQuery] = useState('');
  
  const registrationList = Object.values(registrations);

  const filteredAndSortedRegistrations = useMemo(() => {
    const filtered = registrationList.filter((reg: RegistrationRecord) => {
        const query = searchQuery.toLowerCase().trim();
        if (!query) return true;

        const founderName = reg.user.name.toLowerCase();
        const projectName = reg.projectData.projectName.toLowerCase();
        const phone = reg.user.phone;

        return (
            founderName.includes(query) ||
            projectName.includes(query) ||
            phone.includes(query)
        );
    });

    return [...filtered].sort((a: RegistrationRecord, b: RegistrationRecord) => {
        let comparison = 0;
        if (sortBy === 'date') {
            const dateA = a.registrationDate ? new Date(a.registrationDate).getTime() : 0;
            const dateB = b.registrationDate ? new Date(b.registrationDate).getTime() : 0;
            comparison = dateA - dateB;
        } else if (sortBy === 'projectName') {
            comparison = a.projectData.projectName.localeCompare(b.projectData.projectName);
        } else if (sortBy === 'founderName') {
            comparison = a.user.name.localeCompare(b.user.name);
        }
        return sortDirection === 'asc' ? comparison : -comparison;
    });
  }, [registrationList, sortBy, sortDirection, searchQuery]);

  const handleSort = (newSortBy: SortBy) => {
    if (sortBy === newSortBy) {
        setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
        setSortBy(newSortBy);
        setSortDirection(newSortBy === 'date' ? 'desc' : 'asc');
    }
  };

  const handleDelete = (phone: string) => {
    const adminCode = prompt('للتأكيد، يرجى إدخال رمز دخول الإدارة لحذف هذا السجل.');
    if (adminCode === '1988117') {
      onDelete(phone);
      alert('تم حذف السجل بنجاح.');
    } else if (adminCode !== null) {
      alert('رمز الدخول غير صحيح. لم يتم حذف السجل.');
    }
  };

  const handleDownload = useCallback(async () => {
    if (certificateRef.current === null || !modalRecord) {
      return;
    }
    try {
      const htmlToImage = (window as any).htmlToImage;
      const dataUrl = await htmlToImage.toPng(certificateRef.current, { cacheBust: true, backgroundColor: '#ffffff', pixelRatio: 2 });
      const link = document.createElement('a');
      link.download = `certificate-${modalRecord.projectData.projectName.replace(/\s/g, '_')}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Failed to download certificate image', err);
    }
  }, [modalRecord]);

  const handlePrint = () => {
    if (!certificateRef.current) return;

    const printStyle = document.createElement('style');
    printStyle.innerHTML = `
      @media print {
        body > * { display: none !important; }
        #certificate-print-wrapper, #certificate-print-wrapper * { display: block !important; visibility: visible !important; }
        #certificate-print-wrapper { position: absolute; left: 0; top: 0; width: 100%; margin: 0; padding: 1rem; }
      }
    `;
    const certificateClone = certificateRef.current.cloneNode(true) as HTMLElement;
    const printWrapper = document.createElement('div');
    printWrapper.id = 'certificate-print-wrapper';
    printWrapper.appendChild(certificateClone);

    document.head.appendChild(printStyle);
    document.body.appendChild(printWrapper);
    
    window.print();
    
    document.head.removeChild(printStyle);
    document.body.removeChild(printWrapper);
  };
  
  const handleExportCSV = useCallback(() => {
    if (filteredAndSortedRegistrations.length === 0) {
        alert("No data to export.");
        return;
    }

    const escapeCSV = (str: string) => {
        if (str.includes(',') || str.includes('"') || str.includes('\n')) {
            const escapedStr = str.replace(/"/g, '""');
            return `"${escapedStr}"`;
        }
        return str;
    };

    const headers = [
        "Registration Date",
        "Founder Name",
        "Founder Phone",
        "Project Name",
        "Project Goal",
        "Partners"
    ];

    const rows = filteredAndSortedRegistrations.map((reg: RegistrationRecord) => {
        const partnersStr = reg.projectData.partners
            .map(p => `${p.name} (${p.title})`)
            .join('; ');

        return [
            escapeCSV(new Date(reg.registrationDate).toLocaleString('en-CA')),
            escapeCSV(reg.user.name),
            escapeCSV(reg.user.phone),
            escapeCSV(reg.projectData.projectName),
            escapeCSV(reg.projectData.projectGoal),
            escapeCSV(partnersStr)
        ].join(',');
    });

    const csvContent = [headers.join(','), ...rows].join('\n');
    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    const date = new Date().toISOString().split('T')[0];
    link.setAttribute('download', `registrations_${date}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, [filteredAndSortedRegistrations]);

  return (
    <div className="w-full max-w-5xl bg-white p-8 rounded-xl shadow-lg">
      <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">لوحة تحكم الإدارة - السجلات الصادرة</h2>
      
      <div className="flex flex-col md:flex-row gap-4 mb-8" dir="rtl">
        <div className="flex-grow">
          <label htmlFor="search-registrations" className="sr-only">بحث</label>
          <input
              id="search-registrations"
              type="text"
              placeholder="ابحث عن سجل (اسم المؤسس، اسم المشروع، رقم الهاتف)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-right"
          />
        </div>
        {filteredAndSortedRegistrations.length > 0 && (
            <button
                onClick={handleExportCSV}
                className="inline-flex items-center justify-center px-5 py-3 font-semibold text-white bg-green-600 rounded-md shadow-md hover:bg-green-700 transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L7.707 6.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
                تصدير إلى CSV
            </button>
        )}
      </div>

      {registrationList.length > 0 && (
        <div className="flex justify-center flex-wrap gap-2 md:gap-4 mb-8" dir="rtl">
            <span className="self-center font-semibold text-gray-700">فرز حسب:</span>
            <button onClick={() => handleSort('date')} className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${sortBy === 'date' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-800 hover:bg-gray-300'}`}>
                تاريخ التسجيل {sortBy === 'date' && (sortDirection === 'asc' ? '↑' : '↓')}
            </button>
            <button onClick={() => handleSort('projectName')} className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${sortBy === 'projectName' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-800 hover:bg-gray-300'}`}>
                اسم المشروع {sortBy === 'projectName' && (sortDirection === 'asc' ? '↑' : '↓')}
            </button>
            <button onClick={() => handleSort('founderName')} className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${sortBy === 'founderName' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-800 hover:bg-gray-300'}`}>
                اسم المؤسس {sortBy === 'founderName' && (sortDirection === 'asc' ? '↑' : '↓')}
            </button>
        </div>
      )}

      {filteredAndSortedRegistrations.length === 0 ? (
        <p className="text-center text-gray-500 py-4">
          {searchQuery ? 'لا توجد سجلات تطابق بحثك.' : 'لا توجد سجلات صادرة حتى الآن.'}
        </p>
      ) : (
        <div className="space-y-6">
          {filteredAndSortedRegistrations.map((reg: RegistrationRecord, index) => (
            <div key={reg.user.phone} className="p-6 border border-gray-200 rounded-lg shadow-sm bg-gray-50 text-right" dir="rtl">
              <h3 className="text-xl font-bold text-blue-800 mb-4 border-b pb-2">
                سجل #{index + 1}: {reg.projectData.projectName}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-3 text-gray-700">
                <p><span className="font-semibold">المؤسس:</span> {reg.user.name}</p>
                <p><span className="font-semibold">رقم الهاتف:</span> {reg.user.phone}</p>
                {reg.registrationDate && <p><span className="font-semibold">تاريخ التسجيل:</span> {new Date(reg.registrationDate).toLocaleDateString('ar-EG', { year: 'numeric', month: 'long', day: 'numeric' })}</p>}
                <p className="md:col-span-3"><span className="font-semibold">الغاية من المشروع:</span> {reg.projectData.projectGoal}</p>
              </div>
              {reg.projectData.partners.length > 0 && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <h4 className="font-semibold text-md">الشركاء:</h4>
                  <ul className="list-disc list-inside mt-2 space-y-1">
                    {reg.projectData.partners.map(p => (
                      <li key={p.id}>{p.name} - <span className="text-gray-500">{p.title}</span></li>
                    ))}
                  </ul>
                </div>
              )}
              <div className="mt-6 flex justify-end gap-3">
                <button onClick={() => setModalRecord(reg)} className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700">
                  عرض الشهادة
                </button>
                <button onClick={() => handleDelete(reg.user.phone)} className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700">
                  حذف
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {modalRecord && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-2xl max-w-4xl w-full p-4 md:p-6 relative max-h-full overflow-y-auto">
            <button onClick={() => setModalRecord(null)} className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 z-10">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
            <Certificate ref={certificateRef} user={modalRecord.user} projectData={modalRecord.projectData} />
            <div className="mt-6 flex justify-center gap-4">
              <button onClick={handleDownload} className="px-6 py-2 font-semibold text-white bg-green-600 rounded-md hover:bg-green-700">تحميل</button>
              <button onClick={handlePrint} className="px-6 py-2 font-semibold text-blue-600 border border-blue-600 rounded-md hover:bg-blue-50">طباعة</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
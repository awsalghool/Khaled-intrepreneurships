import React, { forwardRef } from 'react';
import type { User, ProjectData } from '../types';
import { LOGO_URL } from '../constants';

interface CertificateProps {
  user: User;
  projectData: ProjectData;
}

const backgroundTextureUrl = "data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23e5e7eb' fill-opacity='0.2'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E";
const certificateInnerStyle = { backgroundImage: `url("${backgroundTextureUrl}")` };


const Certificate = forwardRef<HTMLDivElement, CertificateProps>(({ user, projectData }, ref) => {
  return (
    <div ref={ref} className="bg-slate-50 p-1 rounded-lg shadow-2xl relative text-right" dir="rtl">
      {/* Decorative corner elements */}
      <div className="absolute top-0 right-0 w-12 h-12 md:w-16 md:h-16 border-t-4 border-r-4 border-blue-800 rounded-tr-lg"></div>
      <div className="absolute bottom-0 left-0 w-12 h-12 md:w-16 md:h-16 border-b-4 border-l-4 border-blue-800 rounded-bl-lg"></div>
      
      <div className="bg-white p-6 md:p-10 border-2 border-amber-400 rounded-md" style={certificateInnerStyle}>
        <div className="flex justify-between items-start pb-6 border-b-2 border-amber-300">
            <div className="text-right">
                <img src={LOGO_URL} alt="Khaled Program Logo" className="w-24 h-24 md:w-28 md:h-28" />
                <h2 className="text-sm md:text-lg lg:text-xl font-bold text-blue-900 mt-2">برنامج خالد لريادة الاعمال لليافعين</h2>
            </div>
            <div className="text-center flex-grow pt-4">
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-blue-900 tracking-wide" style={{fontFamily: 'serif'}}>شهادة سجل تجاري افتراضي</h1>
                <p className="text-base md:text-lg lg:text-xl text-gray-600 mt-2">Virtual Commercial Registration</p>
            </div>
        </div>

        <div className="mt-8 space-y-6 text-gray-800 text-center">
          <p className="text-lg md:text-xl lg:text-2xl">
            يشهد <span className="font-bold text-blue-800">برنامج خالد لريادة الاعمال لليافعين</span> بأن المشروع التالي قد تم تسجيله افتراضيًا ضمن فعاليات البرنامج:
          </p>
          
          <div className="bg-slate-50 border border-slate-200 p-4 md:p-6 rounded-md inline-block text-right shadow-inner">
              <p className="text-lg md:text-xl lg:text-2xl"><span className="font-semibold text-gray-600">اسم المشروع:</span> <span className="font-bold text-xl md:text-2xl lg:text-3xl text-blue-800">{projectData.projectName}</span></p>
              <p className="mt-3 text-base md:text-lg lg:text-xl"><span className="font-semibold text-gray-600">الغاية من المشروع:</span> {projectData.projectGoal}</p>
          </div>
        </div>
        
        <div className="mt-8 text-right">
          <h3 className="text-xl md:text-2xl lg:text-3xl font-semibold mb-4 border-b-2 border-amber-300 pb-2">المؤسسون والشركاء</h3>
          <ul className="space-y-4">
            <li className="flex items-center gap-4">
                <span className="text-white bg-blue-700 px-4 py-1 text-sm md:text-base rounded-full font-semibold">المؤسس</span>
                <span className="font-bold text-lg md:text-xl lg:text-2xl">{user.name}</span>
            </li>
            {projectData.partners.map(partner => (
                 <li key={partner.id} className="flex items-center gap-4">
                    <span className="text-white bg-gray-600 px-4 py-1 text-sm md:text-base rounded-full font-semibold">{partner.title}</span>
                    <span className="font-bold text-lg md:text-xl lg:text-2xl">{partner.name}</span>
                 </li>
            ))}
          </ul>
        </div>
        
        <div className="mt-12 flex flex-col md:flex-row justify-between items-center md:items-end gap-8 md:gap-4">
            <div className="text-center">
                <div className="w-28 h-28 md:w-32 md:h-32 rounded-full border-4 border-blue-800 flex items-center justify-center bg-slate-50 mx-auto">
                    <div className="w-24 h-24 md:w-28 md:h-28 rounded-full border-2 border-amber-400 flex flex-col items-center justify-center text-blue-900 text-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-amber-500 mb-1" viewBox="0 0 20 20" fill="currentColor">
                           <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        <span className="font-bold text-sm">برنامج خالد</span>
                        <span className="text-xs">للريادة</span>
                        <span className="font-bold text-sm mt-1">SEAL</span>
                    </div>
                </div>
            </div>
            <div className="text-center w-full md:w-auto">
                <p className="border-b-2 border-dotted border-gray-600 w-48 md:w-64 mx-auto">&nbsp;</p>
                <p className="mt-2 font-semibold text-gray-700 text-base lg:text-lg">مدير البرنامج</p>
            </div>
            <div className="text-center text-gray-600 text-sm lg:text-base">
                <p className="font-semibold">تاريخ الإصدار:</p>
                <p className="font-bold mt-1">{new Date().toLocaleDateString('ar-EG', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
            </div>
        </div>
        
        <div className="pt-6 mt-6 border-t border-gray-200 text-center text-gray-500 text-xs">
          <p>هذه الشهادة هي وثيقة رمزية لأغراض تدريبية ضمن البرنامج ولا تحمل أي صفة قانونية.</p>
        </div>
      </div>
    </div>
  );
});

export default Certificate;
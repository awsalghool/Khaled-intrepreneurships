import React, { useRef, useCallback } from 'react';
import type { User, ProjectData } from '../types';
import Certificate from './Certificate';

interface CertificateViewProps {
  user: User;
  projectData: ProjectData;
}

const CertificateView: React.FC<CertificateViewProps> = ({ user, projectData }) => {
  const certificateRef = useRef<HTMLDivElement>(null);

  const handleDownload = useCallback(async () => {
    if (certificateRef.current === null) {
      return;
    }

    try {
      const htmlToImage = (window as any).htmlToImage;
      if (!htmlToImage) {
        console.error('html-to-image library not loaded.');
        alert('Could not download certificate. Library not found.');
        return;
      }
      
      const dataUrl = await htmlToImage.toPng(certificateRef.current, {
        cacheBust: true,
        backgroundColor: '#ffffff',
        pixelRatio: 2, // Increase resolution
      });
      
      const link = document.createElement('a');
      link.download = `certificate-${projectData.projectName.replace(/\s/g, '_')}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('oops, something went wrong!', err);
    }
  }, [projectData.projectName]);

  return (
    <div className="w-full max-w-4xl">
        <Certificate ref={certificateRef} user={user} projectData={projectData} />
        <div className="mt-8 text-center">
            <button
                onClick={handleDownload}
                className="inline-flex items-center px-8 py-3 font-semibold text-white bg-green-600 rounded-lg shadow-md hover:bg-green-700 transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 ml-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                تحميل الشهادة
            </button>
        </div>
    </div>
  );
};

export default CertificateView;
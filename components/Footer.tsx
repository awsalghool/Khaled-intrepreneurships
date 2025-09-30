import React from 'react';

const Footer: React.FC = () => {
  const handleContactClick = () => {
    const email = 'info@esc.training';
    const subject = encodeURIComponent('Inquiry regarding Khaled Entrepreneurship Program');
    window.location.href = `mailto:${email}?subject=${subject}`;
  };

  return (
    <footer className="bg-white py-6 text-center">
      <div className="container mx-auto px-4">
        <button
          onClick={handleContactClick}
          className="inline-flex items-center px-6 py-3 font-semibold text-white bg-green-600 rounded-lg shadow-md hover:bg-green-700 transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-3" viewBox="0 0 20 20" fill="currentColor">
            <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
            <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
          </svg>
          تواصل معنا عبر البريد الإلكتروني
        </button>
        <p className="text-gray-500 text-sm mt-4">
          &copy; {new Date().getFullYear()} Khaled Entrepreneurship Program. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
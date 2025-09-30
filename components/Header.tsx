import React from 'react';

interface HeaderProps {
  setView: (view: 'phone' | 'ebook' | 'adminLogin') => void;
  reset: () => void;
}

const Header: React.FC<HeaderProps> = ({ setView, reset }) => {
  const handleNewRegistration = () => {
    reset();
    setView('phone');
  };

  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <h1 className="text-xl md:text-2xl font-bold text-blue-800 text-right">
          برنامج خالد لريادة الاعمال لليافعين
        </h1>
        <nav className="flex items-center space-x-2 md:space-x-4">
          <button
            onClick={handleNewRegistration}
            className="px-3 py-2 text-sm md:text-base font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors"
          >
            تسجيل جديد
          </button>
          <button
            onClick={() => setView('ebook')}
            className="px-3 py-2 text-sm md:text-base font-semibold text-blue-600 border border-blue-600 rounded-md hover:bg-blue-50 transition-colors"
          >
            الكتاب الإلكتروني
          </button>
           <button
            onClick={() => setView('adminLogin')}
            className="px-3 py-2 text-sm md:text-base font-semibold text-gray-600 hover:text-blue-600 transition-colors"
          >
            الإدارة
          </button>
        </nav>
      </div>
    </header>
  );
};

export default Header;

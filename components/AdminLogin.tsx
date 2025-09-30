import React, { useState } from 'react';

interface AdminLoginProps {
  onLogin: (code: string) => boolean;
}

const AdminLogin: React.FC<AdminLoginProps> = ({ onLogin }) => {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const success = onLogin(code);
    if (!success) {
      setError('رمز الدخول غير صحيح. يرجى المحاولة مرة أخرى.');
    }
  };

  return (
    <div className="w-full max-w-sm bg-white p-8 rounded-xl shadow-lg">
      <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">دخول الإدارة</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="admin-code" className="block text-sm font-medium text-gray-700 text-right">
            رمز الدخول
          </label>
          <input
            id="admin-code"
            type="password"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-center"
            required
          />
        </div>
        {error && <p className="text-red-500 text-sm text-center">{error}</p>}
        <button
          type="submit"
          className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
        >
          دخول
        </button>
      </form>
    </div>
  );
};

export default AdminLogin;

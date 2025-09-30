import React, { useState } from 'react';
import type { User } from '../types';

interface PhoneInputStepProps {
  onSubmit: (user: User) => void;
}

const PhoneInputStep: React.FC<PhoneInputStepProps> = ({ onSubmit }) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (name.trim().split(/\s+/).length < 3) {
      setError('يرجى إدخال الإسم الكامل من ثلاثة مقاطع.');
      return;
    }
    if (!/^\+?\d{10,14}$/.test(phone.trim())) {
      setError('يرجى إدخال رقم هاتف صحيح.');
      return;
    }
    
    onSubmit({ name: name.trim(), phone: phone.trim() });
  };

  return (
    <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-lg">
      <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">إنشاء سجل تجاري افتراضي</h2>
      <form onSubmit={handleSubmit} className="space-y-6" noValidate>
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 text-right">
            الإسم الكامل (ثلاثي)
          </label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-right"
            placeholder="مثال: خالد أحمد المحمود"
            required
          />
        </div>
        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700 text-right">
            رقم الهاتف
          </label>
          <input
            id="phone"
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-right"
            placeholder="مثال: 0791234567"
            required
          />
        </div>
        {error && <p className="text-red-500 text-sm text-center">{error}</p>}
        <button
          type="submit"
          className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
        >
          إرسال رمز التحقق
        </button>
      </form>
    </div>
  );
};

export default PhoneInputStep;
import React, { useState } from 'react';

interface VerificationStepProps {
  correctCode: string;
  onSuccess: () => void;
  userPhone: string;
  onResend: () => void;
}

const VerificationStep: React.FC<VerificationStepProps> = ({ correctCode, onSuccess, userPhone, onResend }) => {
  const [enteredCode, setEnteredCode] = useState('');
  const [error, setError] = useState('');
  const [resent, setResent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (enteredCode === correctCode) {
      onSuccess();
    } else {
      setError('الرمز الذي أدخلته غير صحيح. يرجى المحاولة مرة أخرى.');
    }
  };

  const handleResendClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      onResend();
      setResent(true);
      setTimeout(() => setResent(false), 3000); // Hide message after 3 seconds
  }

  return (
    <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-lg">
      <h2 className="text-2xl font-bold text-center text-gray-800 mb-2">التحقق من رقم الهاتف</h2>
      <p className="text-center text-gray-600 mb-6" dir="rtl">
        لقد أرسلنا رمز تحقق إلى هاتفك رقم {userPhone}.
      </p>
      
      <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-800 p-4 mb-6 rounded-md text-right" role="alert">
        <p className="font-bold">لأغراض العرض التوضيحي</p>
        <p>رمز التحقق الخاص بك هو: <span className="font-mono text-lg font-bold tracking-widest">{correctCode}</span></p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="code" className="block text-sm font-medium text-gray-700 text-right">
            رمز التحقق
          </label>
          <input
            id="code"
            type="text"
            value={enteredCode}
            onChange={(e) => setEnteredCode(e.target.value)}
            className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-center tracking-[0.5em]"
            maxLength={4}
            required
          />
        </div>
        {error && <p className="text-red-500 text-sm text-center">{error}</p>}
        {resent && <p className="text-green-600 text-sm text-center">تم إرسال رمز جديد.</p>}
        <button
          type="submit"
          className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
        >
          تحقق
        </button>
         <div className="text-center">
            <button onClick={handleResendClick} className="text-sm text-blue-600 hover:underline focus:outline-none">
                لم تستلم الرمز؟ أعد الإرسال
            </button>
        </div>
      </form>
    </div>
  );
};

export default VerificationStep;
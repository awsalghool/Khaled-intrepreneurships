import React, { useState, useEffect } from 'react';
import type { User, ProjectData, RegistrationRecord } from './types';
import Header from './components/Header';
import Footer from './components/Footer';
import PhoneInputStep from './components/PhoneInputStep';
import VerificationStep from './components/VerificationStep';
import RegistrationFormStep from './components/RegistrationFormStep';
import CertificateView from './components/CertificateView';
import EbookReader from './components/EbookReader';
import AdminLogin from './components/AdminLogin';
import AdminDashboard from './components/AdminDashboard';

type View = 'phone' | 'verify' | 'form' | 'certificate' | 'ebook' | 'adminLogin' | 'adminDashboard';

const App: React.FC = () => {
  const [view, setView] = useState<View>('phone');
  const [user, setUser] = useState<User | null>(null);
  const [verificationCode, setVerificationCode] = useState<string>('');
  const [projectData, setProjectData] = useState<ProjectData | null>(null);
  const [registrations, setRegistrations] = useState<Record<string, RegistrationRecord>>({});

  useEffect(() => {
    try {
      const storedRegistrations = localStorage.getItem('virtualRegistrations');
      if (storedRegistrations) {
        setRegistrations(JSON.parse(storedRegistrations));
      }
    } catch (error) {
      console.error("Failed to parse registrations from localStorage", error);
    }
  }, []);
  
  const handlePhoneSubmit = (submittedUser: User) => {
    if (registrations[submittedUser.phone]) {
      alert('This phone number has already been registered.');
      return;
    }
    const code = Math.floor(1000 + Math.random() * 9000).toString();
    setVerificationCode(code);
    setUser(submittedUser);
    setView('verify');
  };

  const handleResendCode = () => {
    const newCode = Math.floor(1000 + Math.random() * 9000).toString();
    setVerificationCode(newCode);
  };

  const handleVerificationSuccess = () => {
    setView('form');
  };

  const handleFormSubmit = (data: ProjectData) => {
    if (!user) return;
    const newRecord: RegistrationRecord = { 
      user, 
      projectData: data,
      registrationDate: new Date().toISOString() 
    };
    const newRegistrations = { ...registrations, [user.phone]: newRecord };
    setRegistrations(newRegistrations);
    localStorage.setItem('virtualRegistrations', JSON.stringify(newRegistrations));
    setProjectData(data);
    setView('certificate');
  };

  const handleAdminLogin = (code: string): boolean => {
    if (code === '1988117') {
      setView('adminDashboard');
      return true;
    }
    return false;
  };

  const handleDeleteRegistration = (phone: string) => {
    const newRegistrations = { ...registrations };
    delete newRegistrations[phone];
    setRegistrations(newRegistrations);
    localStorage.setItem('virtualRegistrations', JSON.stringify(newRegistrations));
  };

  const reset = () => {
    setUser(null);
    setProjectData(null);
    setVerificationCode('');
    setView('phone');
  };

  const renderView = () => {
    const existingProjectNames = Object.values(registrations).map((r: RegistrationRecord) => r.projectData.projectName);

    switch (view) {
      case 'phone':
        return <PhoneInputStep onSubmit={handlePhoneSubmit} />;
      case 'verify':
        return user && <VerificationStep correctCode={verificationCode} onSuccess={handleVerificationSuccess} userPhone={user.phone} onResend={handleResendCode} />;
      case 'form':
        return user && <RegistrationFormStep user={user} onSubmit={handleFormSubmit} existingProjectNames={existingProjectNames} />;
      case 'certificate':
        return projectData && user && <CertificateView projectData={projectData} user={user} />;
      case 'ebook':
        return <EbookReader />;
      case 'adminLogin':
        return <AdminLogin onLogin={handleAdminLogin} />;
      case 'adminDashboard':
        return <AdminDashboard registrations={registrations} onDelete={handleDeleteRegistration} />;
      default:
        return <PhoneInputStep onSubmit={handlePhoneSubmit} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 font-sans">
      <Header setView={setView} reset={reset} />
      <main className="flex-grow container mx-auto px-4 py-8 flex items-center justify-center">
        {renderView()}
      </main>
      <Footer />
    </div>
  );
};

export default App;
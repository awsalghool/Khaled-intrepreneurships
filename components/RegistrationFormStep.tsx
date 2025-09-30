import React, { useState, useEffect, useCallback } from 'react';
import { GoogleGenAI, Type } from "@google/genai";
import type { User, ProjectData, Partner, JobTitle } from '../types';
import { JOB_TITLES } from '../constants';

interface RegistrationFormStepProps {
  user: User;
  onSubmit: (data: ProjectData) => void;
  existingProjectNames: string[];
}

const RegistrationFormStep: React.FC<RegistrationFormStepProps> = ({ user, onSubmit, existingProjectNames }) => {
  const [projectName, setProjectName] = useState('');
  const [projectGoal, setProjectGoal] = useState('');
  const [partners, setPartners] = useState<Partner[]>([]);
  const [error, setError] = useState('');
  
  const [isCheckingName, setIsCheckingName] = useState(false);
  const [nameError, setNameError] = useState('');
  const [nameSuggestions, setNameSuggestions] = useState<string[]>([]);
  
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

  const checkProjectName = useCallback(async (name: string, goal: string) => {
    if (!name) {
      setNameError('');
      setNameSuggestions([]);
      return;
    }
    
    setIsCheckingName(true);
    setNameError('');
    setNameSuggestions([]);

    if (existingProjectNames.map(n => n.toLowerCase()).includes(name.toLowerCase().trim())) {
      setNameError('هذا الاسم مستخدم بالفعل. الرجاء اختيار اسم آخر.');
      
      try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: `The project name "${name}" is taken. The project goal is "${goal}". Suggest 3 creative and available alternative names.`,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        suggestions: {
                            type: Type.ARRAY,
                            items: { type: Type.STRING }
                        }
                    }
                }
            }
        });
        
        const jsonResponse = JSON.parse(response.text);
        if (jsonResponse.suggestions && Array.isArray(jsonResponse.suggestions)) {
          setNameSuggestions(jsonResponse.suggestions);
        }
      } catch (e) {
        console.error("Error fetching name suggestions:", e);
      }

    } else {
      setNameError('');
    }
    setIsCheckingName(false);
  }, [existingProjectNames, ai.models]);

  useEffect(() => {
    const handler = setTimeout(() => {
      checkProjectName(projectName, projectGoal);
    }, 1000); // Debounce for 1 second

    return () => {
      clearTimeout(handler);
    };
  }, [projectName, projectGoal, checkProjectName]);


  const addPartner = () => {
    const usedTitles = partners.map(p => p.title);
    const firstAvailableTitle = JOB_TITLES.find(title => !usedTitles.includes(title));

    if (!firstAvailableTitle) {
      setError('لا يمكن إضافة المزيد من الشركاء، جميع المسميات الوظيفية مستخدمة.');
      return;
    }
    setError('');
    setPartners([...partners, { id: Date.now().toString(), name: '', title: firstAvailableTitle }]);
  };

  const removePartner = (id: string) => {
    setPartners(partners.filter(p => p.id !== id));
  };

  const handlePartnerChange = <K extends keyof Partner>(id: string, field: K, value: Partner[K]) => {
    setPartners(partners.map(p => p.id === id ? { ...p, [field]: value } : p));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (nameError) {
        setError('يرجى حل مشكلة اسم المشروع قبل المتابعة.');
        return;
    }
    if (!projectName || !projectGoal) {
      setError('يرجى تعبئة اسم المشروع والغاية منه.');
      return;
    }
    if (partners.some(p => p.name.trim().split(/\s+/).length < 3)) {
        setError('يرجى التأكد من إدخال الأسماء الثلاثية لجميع الشركاء.');
        return;
    }

    onSubmit({ projectName, projectGoal, partners });
  };

  const allTitlesUsed = partners.length >= JOB_TITLES.length;

  return (
    <div className="w-full max-w-3xl bg-white p-8 rounded-xl shadow-lg">
      <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">معلومات السجل التجاري</h2>
      <form onSubmit={handleSubmit} className="space-y-6 text-right" noValidate>
        <div>
          <label htmlFor="projectName" className="block text-sm font-medium text-gray-700">إسم المشروع</label>
          <input id="projectName" type="text" value={projectName} onChange={(e) => setProjectName(e.target.value)} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm text-right" />
          {isCheckingName && <p className="text-sm text-gray-500 mt-1">يتم التحقق من الإسم...</p>}
          {nameError && <p className="text-sm text-red-600 mt-1">{nameError}</p>}
          {nameSuggestions.length > 0 && (
            <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-md">
                <p className="text-sm font-semibold text-blue-800">اقتراحات لأسماء بديلة:</p>
                <div className="flex flex-wrap gap-2 mt-2">
                    {nameSuggestions.map(name => (
                        <button key={name} type="button" onClick={() => setProjectName(name)} className="px-3 py-1 text-sm text-blue-700 bg-blue-100 rounded-full hover:bg-blue-200">
                            {name}
                        </button>
                    ))}
                </div>
            </div>
          )}
        </div>
        <div>
          <label htmlFor="projectGoal" className="block text-sm font-medium text-gray-700">الغاية من المشروع</label>
          <textarea id="projectGoal" value={projectGoal} onChange={(e) => setProjectGoal(e.target.value)} required rows={3} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm text-right"></textarea>
        </div>
        
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900">الشركاء</h3>
          {partners.map((partner) => {
            const usedTitles = partners.map(p => p.title);
            const availableJobTitles = JOB_TITLES.filter(
              title => title === partner.title || !usedTitles.includes(title)
            );

            return (
                <div key={partner.id} className="p-4 border rounded-md grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                <div className="md:col-span-2">
                    <label htmlFor={`partnerName-${partner.id}`} className="block text-sm font-medium text-gray-700">اسم الشريك (ثلاثي)</label>
                    <input id={`partnerName-${partner.id}`} type="text" value={partner.name} onChange={(e) => handlePartnerChange(partner.id, 'name', e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm text-right" />
                </div>
                <div>
                    <label htmlFor={`partnerTitle-${partner.id}`} className="block text-sm font-medium text-gray-700">المسمى الوظيفي</label>
                    <select id={`partnerTitle-${partner.id}`} value={partner.title} onChange={(e) => handlePartnerChange(partner.id, 'title', e.target.value as JobTitle)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm text-right">
                    {availableJobTitles.map(title => <option key={title} value={title}>{title}</option>)}
                    </select>
                </div>
                <div className="md:col-span-3 text-left">
                    <button type="button" onClick={() => removePartner(partner.id)} className="text-red-600 hover:text-red-800 text-sm font-medium">
                    إزالة الشريك
                    </button>
                </div>
                </div>
            );
          })}
          <button 
            type="button" 
            onClick={addPartner} 
            disabled={allTitlesUsed}
            className="w-full flex justify-center items-center px-4 py-2 border border-dashed border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:bg-gray-100 disabled:cursor-not-allowed"
            >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" /></svg>
            إضافة شريك
          </button>
        </div>

        {error && <p className="text-red-500 text-sm text-center">{error}</p>}
        
        <button type="submit" className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors">
          إصدار الشهادة
        </button>
      </form>
    </div>
  );
};

export default RegistrationFormStep;

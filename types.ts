export interface User {
  name: string;
  phone: string;
}

export type JobTitle = 'CEO' | 'CFO' | 'COO' | 'CMO' | 'CPO' | 'CXO';

export interface Partner {
  id: string;
  name: string;
  title: JobTitle;
}

export interface ProjectData {
  projectName: string;
  projectGoal: string;
  partners: Partner[];
}

export interface RegistrationRecord {
  user: User;
  projectData: ProjectData;
  registrationDate: string;
}
import React, { createContext, useContext, useState, useEffect } from 'react';
import { databaseService } from '../services/DatabaseService';

const PersonalInfoContext = createContext({});

export function PersonalInfoProvider({ children }) {
  const [personalInfo, setPersonalInfo] = useState({
    name: '',
    email: '',
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPersonalInfo();
  }, []);

  const loadPersonalInfo = async () => {
    try {
      const storedInfo = await databaseService.getPersonalInfo();
      if (storedInfo) {
        setPersonalInfo({
          name: String(storedInfo.name || ''),
          email: String(storedInfo.email || ''),
        });
      }
    } catch (error) {
      console.error('Erro ao carregar informações pessoais:', error);
    } finally {
      setLoading(false);
    }
  };

  const savePersonalInfo = async (info) => {
    try {
      const newInfo = {
        name: String(info.name || '').trim(),
        email: String(info.email || '').trim(),
      };
      await databaseService.updatePersonalInfo(newInfo);
      setPersonalInfo(newInfo);
    } catch (error) {
      console.error('Erro ao salvar informações pessoais:', error);
      throw error;
    }
  };

  return (
    <PersonalInfoContext.Provider
      value={{
        personalInfo,
        savePersonalInfo,
        loading,
      }}
    >
      {children}
    </PersonalInfoContext.Provider>
  );
}

export function usePersonalInfo() {
  const context = useContext(PersonalInfoContext);
  if (!context) {
    throw new Error('usePersonalInfo deve ser usado dentro de um PersonalInfoProvider');
  }
  return context;
} 
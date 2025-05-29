import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const PersonalInfoContext = createContext({});

const STORAGE_KEY = '@RelatorioApp:personalInfo';

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
      const storedInfo = await AsyncStorage.getItem(STORAGE_KEY);
      if (storedInfo) {
        setPersonalInfo(JSON.parse(storedInfo));
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
        name: info.name.trim(),
        email: info.email.trim(),
      };
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newInfo));
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
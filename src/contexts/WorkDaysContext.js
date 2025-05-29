import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const WorkDaysContext = createContext({});

const STORAGE_KEY = '@RelatorioApp:workDays';

export function WorkDaysProvider({ children }) {
  const [selectedDays, setSelectedDays] = useState(new Set());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadWorkDays();
  }, []);

  const loadWorkDays = async () => {
    try {
      const storedDays = await AsyncStorage.getItem(STORAGE_KEY);
      if (storedDays) {
        setSelectedDays(new Set(JSON.parse(storedDays)));
      }
    } catch (error) {
      console.error('Erro ao carregar dias de trabalho:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveWorkDays = async (days) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(Array.from(days)));
      setSelectedDays(days);
    } catch (error) {
      console.error('Erro ao salvar dias de trabalho:', error);
      throw error;
    }
  };

  return (
    <WorkDaysContext.Provider
      value={{
        selectedDays,
        saveWorkDays,
        loading,
      }}
    >
      {children}
    </WorkDaysContext.Provider>
  );
}

export function useWorkDays() {
  const context = useContext(WorkDaysContext);
  if (!context) {
    throw new Error('useWorkDays deve ser usado dentro de um WorkDaysProvider');
  }
  return context;
} 
import React, { createContext, useContext, useState, useEffect } from 'react';
import { databaseService } from '../services/DatabaseService';

const WorkDaysContext = createContext({});

export function WorkDaysProvider({ children }) {
  const [selectedDays, setSelectedDays] = useState(new Set());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadWorkDays();
  }, []);

  const loadWorkDays = async () => {
    try {
      const storedDays = await databaseService.getWorkDays();
      if (storedDays) {
        setSelectedDays(storedDays);
      }
    } catch (error) {
      console.error('Erro ao carregar dias de trabalho:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveWorkDays = async (days) => {
    try {
      // Converte Set em Array se necessário
      const daysArray = Array.isArray(days) ? days : Array.from(days);
      const validDays = daysArray.filter(day => typeof day === 'number' && day >= 0 && day <= 6);
      
      await databaseService.updateWorkDays(validDays);
      setSelectedDays(new Set(validDays));
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
import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const GoalsContext = createContext({});

const STORAGE_KEY = '@RelatorioApp:goals';

const DEFAULT_GOALS = {
  monthlyHours: 0, // 0 minutos como padrão
};

export function GoalsProvider({ children }) {
  const [goals, setGoals] = useState(DEFAULT_GOALS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadGoals();
  }, []);

  const loadGoals = async () => {
    try {
      const storedGoals = await AsyncStorage.getItem(STORAGE_KEY);
      if (storedGoals) {
        setGoals(JSON.parse(storedGoals));
      }
    } catch (error) {
      console.error('Erro ao carregar metas:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveGoals = async (newGoals) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newGoals));
      setGoals(newGoals);
    } catch (error) {
      console.error('Erro ao salvar metas:', error);
      throw error;
    }
  };

  const updateMonthlyGoal = async (hours, minutes) => {
    try {
      const totalMinutes = (hours * 60) + minutes;
      const newGoals = {
        ...goals,
        monthlyHours: totalMinutes,
      };
      await saveGoals(newGoals);
    } catch (error) {
      console.error('Erro ao atualizar meta mensal:', error);
      throw error;
    }
  };

  const formatGoalHours = (minutes) => {
    const hours = Math.floor(minutes / 60);
    return {
      hours,
      minutes: 0,
      formatted: `${String(hours).padStart(2, '0')}:00`
    };
  };

  return (
    <GoalsContext.Provider
      value={{
        goals,
        loading,
        updateMonthlyGoal,
        formatGoalHours,
      }}
    >
      {children}
    </GoalsContext.Provider>
  );
}

export function useGoals() {
  const context = useContext(GoalsContext);
  if (!context) {
    throw new Error('useGoals deve ser usado dentro de um GoalsProvider');
  }
  return context;
} 
import React, { createContext, useContext, useState, useEffect } from 'react';
import { databaseService } from '../services/DatabaseService';

const GoalsContext = createContext({});

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
      const storedGoals = await databaseService.getGoals();
      if (storedGoals) {
        setGoals({
          monthlyHours: Number(storedGoals.monthlyHours) || 0
        });
      }
    } catch (error) {
      console.error('Erro ao carregar metas:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveGoals = async (newGoals) => {
    try {
      const validatedGoals = {
        monthlyHours: Number(newGoals.monthlyHours) || 0
      };
      await databaseService.updateMonthlyGoal(validatedGoals.monthlyHours);
      setGoals(validatedGoals);
    } catch (error) {
      console.error('Erro ao salvar metas:', error);
      throw error;
    }
  };

  const updateMonthlyGoal = async (hours, minutes) => {
    try {
      const totalMinutes = (Number(hours) * 60) + Number(minutes);
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
    const validMinutes = Number(minutes) || 0;
    const hours = Math.floor(validMinutes / 60);
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
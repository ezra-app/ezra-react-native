import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { databaseService } from '../services/DatabaseService';

const ReportContext = createContext({});

export function ReportProvider({ children }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadItems = useCallback(async () => {
    try {
      setLoading(true);
      const reports = await databaseService.getAllReports();
      setItems(reports);
      setError(null);
    } catch (err) {
      console.error('Erro ao carregar relatórios:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadItems();
  }, [loadItems]);

  const createItem = async (data) => {
    try {
      // Validação básica dos dados
      const validatedData = {
        date: data.date || new Date().toISOString(),
        duration: Number(data.duration) || 0,
        studyHours: Number(data.studyHours) || 0,
        observations: String(data.observations || '').trim(),
      };

      const id = await databaseService.createReport(validatedData);
      const newItem = { ...validatedData, id };
      setItems(prev => [...prev, newItem]);
      return newItem;
    } catch (err) {
      console.error('Erro ao criar relatório:', err);
      setError(err.message);
      throw err;
    }
  };

  const updateItem = async (id, data) => {
    try {
      // Validação básica dos dados
      const validatedData = {
        date: data.date || new Date().toISOString(),
        duration: Number(data.duration) || 0,
        studyHours: Number(data.studyHours) || 0,
        observations: String(data.observations || '').trim(),
      };

      await databaseService.updateReport(id, validatedData);
      const updatedItem = { ...validatedData, id };
      setItems(prev => prev.map(item => item.id === id ? updatedItem : item));
      return updatedItem;
    } catch (err) {
      console.error('Erro ao atualizar relatório:', err);
      setError(err.message);
      throw err;
    }
  };

  const deleteItem = async (id) => {
    try {
      await databaseService.deleteReport(id);
      setItems(prev => prev.filter(item => item.id !== id));
    } catch (err) {
      console.error('Erro ao excluir relatório:', err);
      setError(err.message);
      throw err;
    }
  };

  const clearItems = async () => {
    try {
      // Como não temos um método específico para limpar apenas relatórios,
      // vamos recarregar os dados após limpar
      await databaseService.clearAllData();
      setItems([]);
      setError(null);
    } catch (err) {
      console.error('Erro ao limpar relatórios:', err);
      setError(err.message);
      throw err;
    }
  };

  return (
    <ReportContext.Provider
      value={{
        items,
        loading,
        error,
        loadItems,
        createItem,
        updateItem,
        deleteItem,
        clearItems,
      }}
    >
      {children}
    </ReportContext.Provider>
  );
}

export function useReports() {
  const context = useContext(ReportContext);
  if (!context) {
    throw new Error('useReports deve ser usado dentro de um ReportProvider');
  }
  return context;
} 
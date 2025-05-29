import { useState, useEffect, useCallback, useMemo } from 'react';
import { useReports } from '../contexts/ReportContext';

export function useMonthlyReports() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [loading, setLoading] = useState(true);
  const { items: allReports, loadItems } = useReports();

  const formattedMonth = currentDate.toLocaleDateString('pt-BR', {
    month: 'long',
    year: 'numeric'
  });

  // Filtra os relatórios usando useMemo para evitar recálculos desnecessários
  const reports = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth() + 1;
    
    // Filtra os relatórios do mês atual
    const monthlyReports = allReports.filter(report => {
      const reportDate = new Date(report.date);
      return reportDate.getFullYear() === year && reportDate.getMonth() + 1 === month;
    });

    // Ordena por data, mais recente primeiro
    return monthlyReports.sort((a, b) => new Date(b.date) - new Date(a.date));
  }, [currentDate, allReports]);

  const loadReports = useCallback(async () => {
    setLoading(true);
    try {
      await loadItems();
    } catch (error) {
      console.error('Erro ao carregar relatórios:', error);
    } finally {
      setLoading(false);
    }
  }, [loadItems]); // Removido allReports das dependências

  const nextMonth = useCallback(() => {
    setCurrentDate(date => {
      const newDate = new Date(date);
      newDate.setMonth(date.getMonth() + 1);
      return newDate;
    });
  }, []);

  const previousMonth = useCallback(() => {
    setCurrentDate(date => {
      const newDate = new Date(date);
      newDate.setMonth(date.getMonth() - 1);
      return newDate;
    });
  }, []);

  // Carrega os relatórios apenas uma vez ao montar o componente
  useEffect(() => {
    loadReports();
  }, [loadItems]);

  return {
    loading,
    reports,
    formattedMonth,
    nextMonth,
    previousMonth,
    currentDate,
    setCurrentDate,
    refresh: loadReports
  };
} 
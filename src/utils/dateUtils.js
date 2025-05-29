export const dateUtils = {
  getMonthRange(date) {
    const start = new Date(date.getFullYear(), date.getMonth(), 1);
    const end = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    return { start, end };
  },

  formatMonth(date) {
    const months = [
      'Janeiro', 'Fevereiro', 'Março', 'Abril',
      'Maio', 'Junho', 'Julho', 'Agosto',
      'Setembro', 'Outubro', 'Novembro', 'Dezembro'
    ];
    return `${months[date.getMonth()]} ${date.getFullYear()}`;
  },

  isDateInRange(date, start, end) {
    const checkDate = new Date(date);
    return checkDate >= start && checkDate <= end;
  },

  formatDuration(minutes) {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours.toString().padStart(2, '0')}:${remainingMinutes.toString().padStart(2, '0')}`;
  },

  // Calcula os dias úteis do mês baseado nos dias de trabalho configurados
  getWorkingDaysInMonth(date, selectedDays) {
    const { start, end } = this.getMonthRange(date);
    let workingDays = 0;
    
    // Converte o Set para Array para facilitar a verificação
    const workDays = Array.from(selectedDays);
    
    // Se não há dias configurados, retorna 0
    if (workDays.length === 0) return 0;

    // Itera por cada dia do mês
    const current = new Date(start);
    while (current <= end) {
      // Verifica se o dia da semana está na lista de dias configurados
      if (workDays.includes(current.getDay())) {
        workingDays++;
      }
      current.setDate(current.getDate() + 1);
    }

    return workingDays;
  },

  // Calcula os dias úteis restantes a partir de uma data específica até o fim do mês
  getRemainingWorkingDays(fromDate, selectedDays) {
    const end = new Date(fromDate.getFullYear(), fromDate.getMonth() + 1, 0);
    let workingDays = 0;
    
    // Converte o Set para Array para facilitar a verificação
    const workDays = Array.from(selectedDays);
    
    // Se não há dias configurados, retorna 0
    if (workDays.length === 0) return 0;

    // Começa a contar a partir da data atual
    const current = new Date(fromDate);
    
    // Ajusta para começar do dia atual
    current.setHours(0, 0, 0, 0);

    while (current <= end) {
      // Verifica se o dia da semana está na lista de dias configurados
      if (workDays.includes(current.getDay())) {
        workingDays++;
      }
      current.setDate(current.getDate() + 1);
    }

    return workingDays;
  }
}; 
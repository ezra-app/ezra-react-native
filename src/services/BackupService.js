import { databaseService } from './DatabaseService';

// Chaves de armazenamento usadas no app
const STORAGE_KEYS = {
  REPORTS: '@RelatorioApp:reports',
  GOALS: '@RelatorioApp:goals',
  PERSONAL_INFO: '@RelatorioApp:personalInfo',
  WORK_DAYS: '@RelatorioApp:workDays'
};

export const BackupService = {
  // Gera o backup de todos os dados
  createBackup: async () => {
    try {
      const backup = {};
      
      // Coleta todos os dados do SQLite
      backup.reports = await databaseService.getAllReports();
      backup.goals = await databaseService.getGoals();
      backup.personalInfo = await databaseService.getPersonalInfo();
      backup.workDays = Array.from(await databaseService.getWorkDays());

      // Adiciona metadados ao backup
      const backupData = {
        version: '2.0.0', // Atualizado para refletir a mudança para SQLite
        timestamp: new Date().toISOString(),
        data: backup
      };

      // Converte para string e retorna
      return JSON.stringify(backupData);
    } catch (error) {
      console.error('Erro ao criar backup:', error);
      throw new Error('Não foi possível criar o backup dos dados');
    }
  },

  // Restaura os dados a partir de um backup
  restoreBackup: async (backupString) => {
    try {
      // Valida o formato do backup
      const backup = JSON.parse(backupString);
      
      if (!backup.version || !backup.timestamp || !backup.data) {
        throw new Error('Formato de backup inválido');
      }

      // Limpa os dados existentes
      await databaseService.clearAllData();

      // Restaura os dados do backup
      const { data } = backup;

      // Restaura informações pessoais
      if (data.personalInfo) {
        await databaseService.updatePersonalInfo(data.personalInfo);
      }

      // Restaura metas
      if (data.goals && typeof data.goals.monthlyHours === 'number') {
        await databaseService.updateMonthlyGoal(data.goals.monthlyHours);
      }

      // Restaura dias de trabalho
      if (data.workDays && Array.isArray(data.workDays)) {
        await databaseService.updateWorkDays(data.workDays);
      }

      // Restaura relatórios
      if (data.reports && Array.isArray(data.reports)) {
        for (const report of data.reports) {
          await databaseService.createReport({
            date: report.date,
            duration: report.duration,
            studyHours: report.studyHours,
            observations: report.observations
          });
        }
      }

      // Suporte a backups antigos do AsyncStorage (versão 1.0.0)
      if (backup.version === '1.0.0') {
        await this.restoreLegacyBackup(data);
      }

    } catch (error) {
      console.error('Erro ao restaurar backup:', error);
      throw new Error('Não foi possível restaurar o backup');
    }
  },

  // Restaura backups antigos do AsyncStorage
  restoreLegacyBackup: async (legacyData) => {
    try {
      const storageKeys = {
        REPORTS: '@RelatorioApp:reports',
        GOALS: '@RelatorioApp:goals', 
        PERSONAL_INFO: '@RelatorioApp:personalInfo',
        WORK_DAYS: '@RelatorioApp:workDays'
      };

      // Restaura informações pessoais
      if (legacyData[storageKeys.PERSONAL_INFO]) {
        await databaseService.updatePersonalInfo(legacyData[storageKeys.PERSONAL_INFO]);
      }

      // Restaura metas
      if (legacyData[storageKeys.GOALS] && legacyData[storageKeys.GOALS].monthlyHours) {
        await databaseService.updateMonthlyGoal(legacyData[storageKeys.GOALS].monthlyHours);
      }

      // Restaura dias de trabalho
      if (legacyData[storageKeys.WORK_DAYS] && Array.isArray(legacyData[storageKeys.WORK_DAYS])) {
        await databaseService.updateWorkDays(legacyData[storageKeys.WORK_DAYS]);
      }

      // Restaura relatórios
      if (legacyData[storageKeys.REPORTS] && Array.isArray(legacyData[storageKeys.REPORTS])) {
        for (const report of legacyData[storageKeys.REPORTS]) {
          await databaseService.createReport({
            date: report.date,
            duration: report.duration,
            studyHours: report.studyHours,
            observations: report.observations
          });
        }
      }
    } catch (error) {
      console.error('Erro ao restaurar backup legado:', error);
      throw error;
    }
  },

  // Valida se um backup é válido
  validateBackup: (backupString) => {
    try {
      const backup = JSON.parse(backupString);
      return !!(backup.version && backup.timestamp && backup.data);
    } catch (error) {
      return false;
    }
  }
}; 
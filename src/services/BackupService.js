import { databaseService } from './DatabaseService';
import * as FileSystem from 'expo-file-system';
import * as DocumentPicker from 'expo-document-picker';

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
    } catch (error) {
      console.error('Erro ao restaurar backup:', error);
      throw new Error('Não foi possível restaurar o backup');
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
  },

  // Restaura os dados a partir de um arquivo selecionado pelo usuário
  restoreBackupFromFile: async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: '*/*',
        copyToCacheDirectory: true
      });

      // Compatível com ambas as versões do expo-document-picker
      let uri;
      if (result.assets && result.assets.length > 0 && !result.canceled) {
        uri = result.assets[0].uri;
      } else if (result.type === 'success' && result.uri) {
        uri = result.uri;
      } else {
        throw new Error('Seleção de arquivo cancelada');
      }

      const content = await FileSystem.readAsStringAsync(uri);
      await BackupService.restoreBackup(content);
      return true;
    } catch (error) {
      console.error('Erro ao restaurar backup:', error);
      throw new Error('Não foi possível restaurar o backup do arquivo selecionado');
    }
  }
}; 
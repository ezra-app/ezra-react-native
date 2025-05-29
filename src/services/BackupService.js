import AsyncStorage from '@react-native-async-storage/async-storage';

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
      
      // Coleta todos os dados do AsyncStorage
      for (const key of Object.values(STORAGE_KEYS)) {
        const data = await AsyncStorage.getItem(key);
        if (data) {
          backup[key] = JSON.parse(data);
        }
      }

      // Adiciona metadados ao backup
      const backupData = {
        version: '1.0.0',
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
      await AsyncStorage.multiRemove(Object.values(STORAGE_KEYS));

      // Restaura os dados do backup
      for (const [key, value] of Object.entries(backup.data)) {
        await AsyncStorage.setItem(key, JSON.stringify(value));
      }
    } catch (error) {
      console.error('Erro ao restaurar backup:', error);
      throw new Error('Não foi possível restaurar o backup');
    }
  },

  // Valida se o conteúdo é um backup válido
  validateBackup: (content) => {
    try {
      const backup = JSON.parse(content);
      return (
        backup &&
        typeof backup === 'object' &&
        backup.version &&
        backup.timestamp &&
        backup.data &&
        typeof backup.data === 'object'
      );
    } catch {
      return false;
    }
  }
}; 
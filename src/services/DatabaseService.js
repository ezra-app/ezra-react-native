import * as SQLite from 'expo-sqlite';

class DatabaseService {
  constructor() {
    this.db = null;
  }

  // Inicializa o banco de dados
  async init() {
    try {
      this.db = await SQLite.openDatabaseAsync('relatorio_app.db');
      await this.createTables();
      console.log('Database initialized successfully');
    } catch (error) {
      console.error('Error initializing database:', error);
      throw error;
    }
  }

  // Cria as tabelas necessárias
  async createTables() {
    try {
      // Tabela de relatórios
      await this.db.execAsync(`
        CREATE TABLE IF NOT EXISTS reports (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          date TEXT NOT NULL,
          duration INTEGER NOT NULL,
          study_hours INTEGER NOT NULL,
          observations TEXT,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );
      `);

      // Tabela de metas
      await this.db.execAsync(`
        CREATE TABLE IF NOT EXISTS goals (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          monthly_hours INTEGER NOT NULL DEFAULT 0,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );
      `);

      // Tabela de informações pessoais
      await this.db.execAsync(`
        CREATE TABLE IF NOT EXISTS personal_info (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT,
          email TEXT,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );
      `);

      // Tabela de dias de trabalho
      await this.db.execAsync(`
        CREATE TABLE IF NOT EXISTS work_days (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          day_of_week INTEGER NOT NULL,
          is_selected BOOLEAN NOT NULL DEFAULT 0,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          UNIQUE(day_of_week)
        );
      `);

      // Inicializa dados padrão se necessário
      await this.initializeDefaultData();

    } catch (error) {
      console.error('Error creating tables:', error);
      throw error;
    }
  }

  // Inicializa dados padrão
  async initializeDefaultData() {
    try {
      // Verifica se já existe uma meta configurada
      const goalsCount = await this.db.getFirstAsync('SELECT COUNT(*) as count FROM goals');
      if (goalsCount.count === 0) {
        await this.db.runAsync('INSERT INTO goals (monthly_hours) VALUES (?)', [0]);
      }

      // Verifica se já existem informações pessoais
      const personalInfoCount = await this.db.getFirstAsync('SELECT COUNT(*) as count FROM personal_info');
      if (personalInfoCount.count === 0) {
        await this.db.runAsync('INSERT INTO personal_info (name, email) VALUES (?, ?)', ['', '']);
      }

      // Verifica se já existem dias de trabalho configurados
      const workDaysCount = await this.db.getFirstAsync('SELECT COUNT(*) as count FROM work_days');
      if (workDaysCount.count === 0) {
        // Insere todos os dias da semana (0-6) como não selecionados
        for (let day = 0; day <= 6; day++) {
          await this.db.runAsync(
            'INSERT INTO work_days (day_of_week, is_selected) VALUES (?, ?)',
            [day, 0]
          );
        }
      }
    } catch (error) {
      console.error('Error initializing default data:', error);
    }
  }

  // =================== REPORTS ===================
  async createReport(reportData) {
    try {
      const result = await this.db.runAsync(
        'INSERT INTO reports (date, duration, study_hours, observations) VALUES (?, ?, ?, ?)',
        [reportData.date, reportData.duration, reportData.studyHours, reportData.observations]
      );
      return result.lastInsertRowId;
    } catch (error) {
      console.error('Error creating report:', error);
      throw error;
    }
  }

  async updateReport(id, reportData) {
    try {
      await this.db.runAsync(
        'UPDATE reports SET date = ?, duration = ?, study_hours = ?, observations = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
        [reportData.date, reportData.duration, reportData.studyHours, reportData.observations, id]
      );
    } catch (error) {
      console.error('Error updating report:', error);
      throw error;
    }
  }

  async deleteReport(id) {
    try {
      await this.db.runAsync('DELETE FROM reports WHERE id = ?', [id]);
    } catch (error) {
      console.error('Error deleting report:', error);
      throw error;
    }
  }

  async getAllReports() {
    try {
      const reports = await this.db.getAllAsync('SELECT * FROM reports ORDER BY date DESC');
      return reports.map(report => ({
        id: report.id,
        date: report.date,
        duration: report.duration,
        studyHours: report.study_hours,
        observations: report.observations
      }));
    } catch (error) {
      console.error('Error getting all reports:', error);
      throw error;
    }
  }

  // =================== GOALS ===================
  async updateMonthlyGoal(monthlyHours) {
    try {
      // Atualiza o primeiro registro existente
      await this.db.runAsync(
        'UPDATE goals SET monthly_hours = ?, updated_at = CURRENT_TIMESTAMP WHERE id = (SELECT id FROM goals LIMIT 1)',
        [monthlyHours]
      );
    } catch (error) {
      console.error('Error updating monthly goal:', error);
      throw error;
    }
  }

  async getGoals() {
    try {
      // Seleciona o primeiro registro existente
      const goals = await this.db.getFirstAsync('SELECT * FROM goals LIMIT 1');
      return {
        monthlyHours: goals ? goals.monthly_hours : 0
      };
    } catch (error) {
      console.error('Error getting goals:', error);
      throw error;
    }
  }

  // =================== PERSONAL INFO ===================
  async updatePersonalInfo(personalInfo) {
    try {
      // Atualiza o primeiro registro existente
      await this.db.runAsync(
        'UPDATE personal_info SET name = ?, email = ?, updated_at = CURRENT_TIMESTAMP WHERE id = (SELECT id FROM personal_info LIMIT 1)',
        [personalInfo.name, personalInfo.email]
      );
    } catch (error) {
      console.error('Error updating personal info:', error);
      throw error;
    }
  }

  async getPersonalInfo() {
    try {
      // Seleciona o primeiro registro existente
      const info = await this.db.getFirstAsync('SELECT * FROM personal_info LIMIT 1');
      return {
        name: info ? info.name : '',
        email: info ? info.email : ''
      };
    } catch (error) {
      console.error('Error getting personal info:', error);
      throw error;
    }
  }

  // =================== WORK DAYS ===================
  async updateWorkDays(selectedDays) {
    try {
      // Primeiro, marca todos os dias como não selecionados
      await this.db.runAsync('UPDATE work_days SET is_selected = 0, updated_at = CURRENT_TIMESTAMP');

      // Depois, marca os dias selecionados
      for (const day of selectedDays) {
        await this.db.runAsync(
          'UPDATE work_days SET is_selected = 1, updated_at = CURRENT_TIMESTAMP WHERE day_of_week = ?',
          [day]
        );
      }
    } catch (error) {
      console.error('Error updating work days:', error);
      throw error;
    }
  }

  async getWorkDays() {
    try {
      const workDays = await this.db.getAllAsync('SELECT * FROM work_days WHERE is_selected = 1');
      return new Set(workDays.map(day => day.day_of_week));
    } catch (error) {
      console.error('Error getting work days:', error);
      throw error;
    }
  }

  // =================== UTILITY ===================
  async clearAllData() {
    try {
      await this.db.runAsync('DELETE FROM reports');
      await this.db.runAsync('DELETE FROM goals');
      await this.db.runAsync('DELETE FROM personal_info');
      await this.db.runAsync('DELETE FROM work_days');
      await this.initializeDefaultData();
    } catch (error) {
      console.error('Error clearing all data:', error);
      throw error;
    }
  }

  // Para debug - permite executar SQL customizado
  async executeSQL(sql, params = []) {
    try {
      return await this.db.getAllAsync(sql, params);
    } catch (error) {
      console.error('Error executing SQL:', error);
      throw error;
    }
  }
}

// Exporta uma instância singleton
export const databaseService = new DatabaseService(); 
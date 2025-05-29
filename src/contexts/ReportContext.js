import { createStorageContext } from './StorageContext';

const REPORTS_STORAGE_KEY = '@RelatorioApp:reports';

export const { 
  Provider: ReportProvider, 
  useStorageContext: useReports 
} = createStorageContext(REPORTS_STORAGE_KEY); 
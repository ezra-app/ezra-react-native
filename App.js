import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { ReportProvider } from './src/contexts/ReportContext';
import { WorkDaysProvider } from './src/contexts/WorkDaysContext';
import { PersonalInfoProvider } from './src/contexts/PersonalInfoContext';
import { GoalsProvider } from './src/contexts/GoalsContext';
import { databaseService } from './src/services/DatabaseService';
import AppNavigator from './src/navigation/AppNavigator';

export default function App() {
  const [isDbReady, setIsDbReady] = useState(false);
  const [dbError, setDbError] = useState(null);

  useEffect(() => {
    initializeDatabase();
  }, []);

  const initializeDatabase = async () => {
    try {
      await databaseService.init();
      setIsDbReady(true);
    } catch (error) {
      console.error('Failed to initialize database:', error);
      setDbError(error);
    }
  };

  if (dbError) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.errorText}>Erro ao inicializar banco de dados</Text>
        <Text style={styles.errorSubtext}>Tente reiniciar o aplicativo</Text>
      </View>
    );
  }

  if (!isDbReady) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2B7C85" />
        <Text style={styles.loadingText}>Inicializando banco de dados...</Text>
      </View>
    );
  }

  return (
    <ReportProvider>
      <WorkDaysProvider>
        <PersonalInfoProvider>
          <GoalsProvider>
            <NavigationContainer>
              <AppNavigator />
            </NavigationContainer>
          </GoalsProvider>
        </PersonalInfoProvider>
      </WorkDaysProvider>
    </ReportProvider>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  errorText: {
    fontSize: 18,
    color: '#ff4444',
    fontWeight: 'bold',
    marginBottom: 8,
  },
  errorSubtext: {
    fontSize: 14,
    color: '#666',
  },
});

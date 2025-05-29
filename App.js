import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { ReportProvider } from './src/contexts/ReportContext';
import { WorkDaysProvider } from './src/contexts/WorkDaysContext';
import { PersonalInfoProvider } from './src/contexts/PersonalInfoContext';
import { GoalsProvider } from './src/contexts/GoalsContext';
import AppNavigator from './src/navigation/AppNavigator';

export default function App() {
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

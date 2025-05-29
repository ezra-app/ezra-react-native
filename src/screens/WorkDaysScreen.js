import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Switch,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, headerTheme, buttonTheme } from '../constants/colors';
import { useWorkDays } from '../contexts/WorkDaysContext';

const WEEK_DAYS = [
  { id: 0, name: 'Domingo' },
  { id: 1, name: 'Segunda-feira' },
  { id: 2, name: 'Terça-feira' },
  { id: 3, name: 'Quarta-feira' },
  { id: 4, name: 'Quinta-feira' },
  { id: 5, name: 'Sexta-feira' },
  { id: 6, name: 'Sábado' },
];

export default function WorkDaysScreen({ navigation }) {
  const { selectedDays: initialDays, saveWorkDays, loading } = useWorkDays();
  const [selectedDays, setSelectedDays] = useState(new Set(initialDays));
  const [saving, setSaving] = useState(false);

  const toggleDay = (dayId) => {
    setSelectedDays(prev => {
      const newSet = new Set(prev);
      if (newSet.has(dayId)) {
        newSet.delete(dayId);
      } else {
        newSet.add(dayId);
      }
      return newSet;
    });
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      await saveWorkDays(selectedDays);
      navigation.goBack();
    } catch (error) {
      Alert.alert(
        'Erro',
        'Não foi possível salvar os dias de trabalho. Tente novamente.'
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={32} color={headerTheme.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Dias de Atividade</Text>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.description}>
          <Ionicons name="calendar-number-outline" size={24} color={colors.secondary} />
          <Text style={styles.descriptionText}>
            Selecione os dias em que você costuma realizar suas atividades
          </Text>
        </View>

        <View style={styles.daysList}>
          {WEEK_DAYS.map(day => (
            <View key={day.id} style={styles.dayItem}>
              <Text style={styles.dayText}>{day.name}</Text>
              <Switch
                value={selectedDays.has(day.id)}
                onValueChange={() => toggleDay(day.id)}
                trackColor={{ false: colors.border, true: colors.primary }}
                thumbColor={selectedDays.has(day.id) ? colors.white : '#f4f3f4'}
                ios_backgroundColor={colors.border}
              />
            </View>
          ))}
        </View>

        {/* Botão Salvar */}
        <TouchableOpacity 
          style={styles.saveButton}
          onPress={handleSave}
          disabled={saving}
        >
          {saving ? (
            <ActivityIndicator color={buttonTheme.primary.text} />
          ) : (
            <Text style={styles.saveButtonText}>Salvar</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    backgroundColor: headerTheme.background,
    paddingTop: 25,
    paddingBottom: 12,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    marginRight: 15,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: headerTheme.text,
  },
  content: {
    flex: 1,
  },
  description: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    gap: 15,
    backgroundColor: colors.background,
    marginBottom: 10,
  },
  descriptionText: {
    flex: 1,
    fontSize: 16,
    color: colors.text.secondary,
    lineHeight: 22,
  },
  daysList: {
    paddingHorizontal: 20,
  },
  dayItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  dayText: {
    fontSize: 18,
    color: colors.text.primary,
  },
  saveButton: {
    backgroundColor: buttonTheme.primary.background,
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
    marginTop: 30,
    marginHorizontal: 20,
    marginBottom: 20,
  },
  saveButtonText: {
    color: buttonTheme.primary.text,
    fontSize: 18,
    fontWeight: 'bold',
  },
}); 
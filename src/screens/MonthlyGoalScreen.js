import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Modal,
  TextInput,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, headerTheme, buttonTheme } from '../constants/colors';
import { useGoals } from '../contexts/GoalsContext';

export default function MonthlyGoalScreen({ navigation }) {
  const { goals, loading, updateMonthlyGoal, formatGoalHours } = useGoals();
  const [showPicker, setShowPicker] = useState(false);
  const [saving, setSaving] = useState(false);

  const initialHours = formatGoalHours(goals.monthlyHours);
  const [hours, setHours] = useState(initialHours.hours);

  const increaseHours = () => {
    setHours(prev => prev + 1);
  };

  const decreaseHours = () => {
    setHours(prev => Math.max(0, prev - 1));
  };

  const validateAndUpdateHours = (text) => {
    const number = parseInt(text) || 0;
    if (number >= 0) {
      setHours(number);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      await updateMonthlyGoal(hours, 0); // Sempre usa 0 para minutos
      navigation.goBack();
    } catch (error) {
      Alert.alert(
        'Erro',
        'Não foi possível salvar a meta mensal. Tente novamente.'
      );
    } finally {
      setSaving(false);
    }
  };

  const formatHours = (hours) => {
    return `${String(hours).padStart(2, '0')}:00`;
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
        <Text style={styles.headerTitle}>Meta Mensal</Text>
      </View>

      <View style={styles.content}>
        <View style={styles.description}>
          <Ionicons name="time-outline" size={24} color={colors.secondary} />
          <Text style={styles.descriptionText}>
            Defina sua meta de horas mensais para acompanhar seu progresso
          </Text>
        </View>

        <TouchableOpacity 
          style={styles.hoursButton}
          onPress={() => setShowPicker(true)}
        >
          <View style={styles.hoursContent}>
            <Text style={styles.hoursLabel}>Meta atual:</Text>
            <Text style={styles.hoursValue}>{formatHours(hours)}</Text>
            <Text style={styles.hoursUnit}>horas</Text>
          </View>
        </TouchableOpacity>

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
      </View>

      {/* Hours Picker Modal */}
      <Modal
        visible={showPicker}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowPicker(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Meta Mensal</Text>
            
            <View style={styles.hoursPickerContainer}>
              {/* Horas */}
              <View style={styles.pickerColumn}>
                <TouchableOpacity onPress={increaseHours} style={styles.pickerButton}>
                  <Ionicons name="chevron-up" size={24} color="#2B7C85" />
                </TouchableOpacity>
                <TextInput
                  style={styles.pickerInput}
                  value={hours.toString()}
                  onChangeText={validateAndUpdateHours}
                  keyboardType="number-pad"
                  maxLength={3}
                  selectTextOnFocus
                />
                <TouchableOpacity onPress={decreaseHours} style={styles.pickerButton}>
                  <Ionicons name="chevron-down" size={24} color="#2B7C85" />
                </TouchableOpacity>
                <Text style={styles.pickerLabel}>horas</Text>
              </View>
            </View>

            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={[styles.modalButton, styles.modalButtonCancel]}
                onPress={() => setShowPicker(false)}
              >
                <Text style={[styles.modalButtonText, styles.modalButtonTextCancel]}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.modalButton, styles.modalButtonConfirm]}
                onPress={() => setShowPicker(false)}
              >
                <Text style={[styles.modalButtonText, styles.modalButtonTextConfirm]}>Confirmar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
    padding: 20,
  },
  description: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    gap: 15,
    backgroundColor: colors.background,
    borderRadius: 10,
    marginBottom: 30,
  },
  descriptionText: {
    flex: 1,
    fontSize: 16,
    color: colors.text.secondary,
    lineHeight: 22,
  },
  hoursButton: {
    backgroundColor: colors.white,
    borderRadius: 10,
    padding: 20,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 30,
  },
  hoursContent: {
    alignItems: 'center',
    gap: 10,
  },
  hoursLabel: {
    fontSize: 16,
    color: colors.text.secondary,
  },
  hoursValue: {
    fontSize: 48,
    fontWeight: 'bold',
    color: colors.text.primary,
  },
  hoursUnit: {
    fontSize: 16,
    color: colors.text.secondary,
  },
  saveButton: {
    backgroundColor: buttonTheme.primary.background,
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
  },
  saveButtonText: {
    color: buttonTheme.primary.text,
    fontSize: 18,
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: colors.white,
    borderRadius: 10,
    padding: 20,
    width: '80%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text.primary,
    textAlign: 'center',
    marginBottom: 20,
  },
  hoursPickerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  pickerColumn: {
    alignItems: 'center',
  },
  pickerButton: {
    padding: 10,
  },
  pickerInput: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    width: 80,
    color: colors.text.primary,
  },
  pickerLabel: {
    fontSize: 14,
    color: colors.text.secondary,
    marginTop: 5,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
  modalButton: {
    flex: 1,
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  modalButtonCancel: {
    backgroundColor: colors.background,
  },
  modalButtonConfirm: {
    backgroundColor: buttonTheme.primary.background,
  },
  modalButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalButtonTextCancel: {
    color: colors.text.primary,
  },
  modalButtonTextConfirm: {
    color: buttonTheme.primary.text,
  },
}); 
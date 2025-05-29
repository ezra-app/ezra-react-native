import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  SafeAreaView,
  Platform,
  ScrollView,
  KeyboardAvoidingView,
  Modal,
  TextInput
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import RNDateTimePicker from '@react-native-community/datetimepicker';
import { colors, headerTheme, inputTheme, buttonTheme } from '../constants/colors';
import { useReports } from '../contexts/ReportContext';

export default function AddReportScreen({ navigation, route }) {
  const report = route.params?.report;
  const isEditing = !!report;
  
  const { createItem, updateItem } = useReports();
  const [date, setDate] = useState(isEditing ? new Date(report.date) : new Date());
  const [hours, setHours] = useState(() => {
    if (isEditing) {
      const totalHours = Math.floor(report.duration / 60);
      const minutes = report.duration % 60;
      return { hours: totalHours, minutes };
    }
    return { hours: 0, minutes: 0 };
  });
  const [studies, setStudies] = useState(isEditing ? report.studyHours.toString() : '0');
  const [observations, setObservations] = useState(isEditing ? report.observations : '');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showHoursPicker, setShowHoursPicker] = useState(false);

  const onChangeDate = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setDate(selectedDate);
    }
  };

  const formatHours = (hours, minutes) => {
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  };

  const increaseHours = () => {
    setHours(prev => ({
      ...prev,
      hours: prev.hours + 1
    }));
  };

  const decreaseHours = () => {
    setHours(prev => ({
      ...prev,
      hours: Math.max(0, prev.hours - 1)
    }));
  };

  const increaseMinutes = () => {
    const newMinutes = hours.minutes + 15;
    if (newMinutes >= 60) {
      setHours(prev => ({
        hours: prev.hours + 1,
        minutes: 0
      }));
    } else {
      setHours(prev => ({
        ...prev,
        minutes: newMinutes
      }));
    }
  };

  const decreaseMinutes = () => {
    const newMinutes = hours.minutes - 15;
    if (newMinutes < 0) {
      if (hours.hours > 0) {
        setHours(prev => ({
          hours: prev.hours - 1,
          minutes: 45
        }));
      }
    } else {
      setHours(prev => ({
        ...prev,
        minutes: newMinutes
      }));
    }
  };

  const validateAndUpdateHours = (text) => {
    const number = parseInt(text) || 0;
    if (number >= 0) {
      setHours(prev => ({
        ...prev,
        hours: number
      }));
    }
  };

  const validateAndUpdateMinutes = (text) => {
    const number = parseInt(text) || 0;
    if (number >= 0 && number < 60) {
      setHours(prev => ({
        ...prev,
        minutes: number
      }));
    }
  };

  const handleSubmit = async () => {
    try {
      const totalMinutes = (hours.hours * 60) + hours.minutes;
      
      const reportData = {
        date: date.toISOString(),
        duration: totalMinutes,
        studyHours: parseInt(studies, 10),
        observations: observations.trim(),
      };

      if (isEditing) {
        await updateItem(report.id, reportData);
      } else {
        await createItem(reportData);
      }
      
      navigation.goBack();
    } catch (error) {
      console.error('Erro ao salvar relatório:', error);
      // TODO: Mostrar mensagem de erro para o usuário
    }
  };

  const formatDate = (date) => {
    const weekDays = [
      'Dom', 'Seg', 'Ter', 
      'Qua', 'Qui', 'Sex', 'Sáb'
    ];
    const weekDay = weekDays[date.getDay()];
    return `${weekDay}, ${date.toLocaleDateString('pt-BR')}`;
  };

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
        <Text style={styles.headerTitle}>
          {isEditing ? 'Editar Relatório' : 'Novo Relatório'}
        </Text>
      </View>

      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.content}
      >
        <ScrollView contentContainerStyle={styles.formContainer}>
          {/* Data */}
          <View style={styles.inputGroup}>
            <View style={styles.labelContainer}>
              <Ionicons name="calendar-outline" size={28} color={colors.secondary} />
              <Text style={styles.label}>Data:</Text>
            </View>
            <TouchableOpacity 
              style={styles.input}
              onPress={() => setShowDatePicker(true)}
            >
              <Text style={styles.inputText}>
                {formatDate(date)}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Horas */}
          <View style={styles.inputGroup}>
            <View style={styles.labelContainer}>
              <Ionicons name="time-outline" size={28} color={colors.secondary} />
              <Text style={styles.label}>Horas:</Text>
            </View>
            <TouchableOpacity 
              style={styles.input}
              onPress={() => setShowHoursPicker(true)}
            >
              <Text style={styles.inputText}>{formatHours(hours.hours, hours.minutes)}</Text>
            </TouchableOpacity>
          </View>

          {/* Estudos */}
          <View style={styles.inputGroup}>
            <View style={styles.labelContainer}>
              <Ionicons name="school-outline" size={28} color={colors.secondary} />
              <Text style={styles.label}>Estudos:</Text>
            </View>
            <View style={styles.input}>
              <TextInput
                style={styles.studiesInput}
                value={studies}
                onChangeText={(text) => {
                  const number = text.replace(/[^0-9]/g, '');
                  setStudies(number);
                }}
                keyboardType="number-pad"
                placeholder="0"
                placeholderTextColor="#999"
              />
            </View>
          </View>

          {/* Observações */}
          <View style={styles.inputGroup}>
            <View style={styles.labelContainer}>
              <Ionicons name="document-text-outline" size={28} color={colors.secondary} />
              <Text style={styles.label}>Observações:</Text>
            </View>
            <View style={[styles.input, { minHeight: 100 }]}>
              <TextInput
                style={[styles.studiesInput, { height: 90, textAlignVertical: 'top' }]}
                value={observations}
                onChangeText={setObservations}
                placeholder="Digite suas observações aqui..."
                placeholderTextColor="#999"
                multiline
                numberOfLines={4}
              />
            </View>
          </View>

          {/* Botão Salvar */}
          <TouchableOpacity 
            style={styles.saveButton}
            onPress={handleSubmit}
          >
            <Text style={styles.saveButtonText}>Salvar</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Date Picker Modal */}
      {showDatePicker && (
        <RNDateTimePicker
          value={date}
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={onChangeDate}
        />
      )}

      {/* Hours Picker Modal */}
      <Modal
        visible={showHoursPicker}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowHoursPicker(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Quantidade de Horas</Text>
            
            <View style={styles.hoursPickerContainer}>
              {/* Horas */}
              <View style={styles.pickerColumn}>
                <TouchableOpacity onPress={increaseHours} style={styles.pickerButton}>
                  <Ionicons name="chevron-up" size={24} color="#2B7C85" />
                </TouchableOpacity>
                <TextInput
                  style={styles.pickerInput}
                  value={hours.hours.toString()}
                  onChangeText={validateAndUpdateHours}
                  keyboardType="number-pad"
                  maxLength={2}
                  selectTextOnFocus
                />
                <TouchableOpacity onPress={decreaseHours} style={styles.pickerButton}>
                  <Ionicons name="chevron-down" size={24} color="#2B7C85" />
                </TouchableOpacity>
                <Text style={styles.pickerLabel}>horas</Text>
              </View>

              <Text style={styles.pickerSeparator}>:</Text>

              {/* Minutos */}
              <View style={styles.pickerColumn}>
                <TouchableOpacity onPress={increaseMinutes} style={styles.pickerButton}>
                  <Ionicons name="chevron-up" size={24} color="#2B7C85" />
                </TouchableOpacity>
                <TextInput
                  style={styles.pickerInput}
                  value={hours.minutes.toString()}
                  onChangeText={validateAndUpdateMinutes}
                  keyboardType="number-pad"
                  maxLength={2}
                  selectTextOnFocus
                />
                <TouchableOpacity onPress={decreaseMinutes} style={styles.pickerButton}>
                  <Ionicons name="chevron-down" size={24} color="#2B7C85" />
                </TouchableOpacity>
                <Text style={styles.pickerLabel}>minutos</Text>
              </View>
            </View>

            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={[styles.modalButton, styles.modalButtonCancel]}
                onPress={() => setShowHoursPicker(false)}
              >
                <Text style={[styles.modalButtonText, styles.modalButtonTextCancel]}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.modalButton, styles.modalButtonConfirm]}
                onPress={() => setShowHoursPicker(false)}
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
  formContainer: {
    padding: 20,
    gap: 25,
  },
  inputGroup: {
    gap: 10,
  },
  labelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  label: {
    fontSize: 20,
    color: colors.text.primary,
    fontWeight: '500',
  },
  input: {
    backgroundColor: inputTheme.background,
    borderRadius: 10,
    padding: 15,
    borderWidth: 1,
    borderColor: inputTheme.border,
  },
  inputText: {
    fontSize: 18,
    color: inputTheme.text,
  },
  saveButton: {
    backgroundColor: buttonTheme.primary.background,
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
    marginTop: 20,
  },
  saveButtonText: {
    color: buttonTheme.primary.text,
    fontSize: 18,
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: colors.overlay,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: colors.white,
    borderRadius: 15,
    padding: 20,
    width: '80%',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text.primary,
    marginBottom: 20,
  },
  hoursPickerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 15,
    marginBottom: 20,
  },
  pickerColumn: {
    alignItems: 'center',
  },
  pickerButton: {
    padding: 10,
  },
  pickerInput: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text.primary,
    textAlign: 'center',
    width: 60,
    padding: 5,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    backgroundColor: colors.white,
  },
  pickerLabel: {
    fontSize: 14,
    color: colors.text.secondary,
    marginTop: 5,
  },
  pickerSeparator: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text.primary,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 15,
  },
  modalButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    minWidth: 100,
    alignItems: 'center',
  },
  modalButtonCancel: {
    backgroundColor: buttonTheme.secondary.background,
    borderWidth: 1,
    borderColor: buttonTheme.secondary.border,
  },
  modalButtonConfirm: {
    backgroundColor: buttonTheme.primary.background,
  },
  modalButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text.primary,
  },
  modalButtonTextCancel: {
    color: colors.text.primary,
  },
  modalButtonTextConfirm: {
    color: buttonTheme.primary.text,
  },
  studiesInput: {
    fontSize: 18,
    color: colors.text.primary,
    padding: 0,
    flex: 1,
  },
}); 
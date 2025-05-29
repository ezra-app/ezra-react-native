import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  FlatList,
  ActivityIndicator,
  Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useMonthlyReports } from '../hooks/useMonthlyReports';
import { colors, headerTheme } from '../constants/colors';
import { useReports } from '../contexts/ReportContext';

const ReportCard = ({ report, onEdit, onDelete }) => {
  const date = new Date(report.date);
  const formattedDate = date.toLocaleDateString('pt-BR', {
    weekday: 'short',
    day: '2-digit',
    month: '2-digit'
  });

  const formatDuration = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
  };

  return (
    <View style={styles.card}>
      <View style={styles.cardContent}>
        <View style={styles.cardHeader}>
          <Text style={styles.dateText}>{formattedDate}</Text>
          <View style={styles.durationContainer}>
            <Ionicons name="time-outline" size={20} color={colors.secondary} />
            <Text style={styles.durationText}>{formatDuration(report.duration)}</Text>
          </View>
        </View>

        <View style={styles.cardBody}>
          <View style={styles.studyContainer}>
            <Ionicons name="school-outline" size={20} color={colors.secondary} />
            <Text style={styles.studyText}>
              {report.studyHours} {report.studyHours === 1 ? 'estudo dirigido' : 'estudos dirigidos'}
            </Text>
          </View>

          {report.observations && (
            <Text style={styles.observationsText} numberOfLines={2}>
              {report.observations}
            </Text>
          )}
        </View>
      </View>

      <View style={styles.cardActions}>
        <TouchableOpacity 
          style={[styles.actionButton, styles.editButton]}
          onPress={() => onEdit(report)}
        >
          <Ionicons name="create-outline" size={22} color={colors.action} />
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.actionButton, styles.deleteButton]}
          onPress={() => onDelete(report)}
        >
          <Ionicons name="trash-outline" size={22} color={colors.danger} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default function ReportListScreen({ navigation, route }) {
  const {
    loading,
    reports,
    formattedMonth,
    nextMonth,
    previousMonth,
    setCurrentDate,
    refresh
  } = useMonthlyReports();

  const { deleteItem } = useReports();

  useEffect(() => {
    if (route.params?.selectedDate) {
      setCurrentDate(new Date(route.params.selectedDate));
    }
  }, [route.params?.selectedDate]);

  const handleEdit = (report) => {
    navigation.navigate('AddReport', { report });
  };

  const handleDelete = (report) => {
    Alert.alert(
      'Excluir Relatório',
      'Tem certeza que deseja excluir este relatório? Esta ação não pode ser desfeita.',
      [
        {
          text: 'Cancelar',
          style: 'cancel'
        },
        {
          text: 'Excluir',
          onPress: async () => {
            try {
              await deleteItem(report.id);
              refresh();
            } catch (error) {
              Alert.alert('Erro', 'Não foi possível excluir o relatório.');
            }
          },
          style: 'destructive'
        }
      ],
      { cancelable: true }
    );
  };

  const renderEmptyList = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="document-text-outline" size={64} color={colors.secondary} />
      <Text style={styles.emptyText}>Nenhum relatório encontrado</Text>
      <Text style={styles.emptySubtext}>
        Os relatórios deste mês aparecerão aqui
      </Text>
    </View>
  );

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
        <Text style={styles.headerTitle}>Relatórios</Text>
      </View>

      {/* Month Selector */}
      <View style={styles.monthSelector}>
        <TouchableOpacity onPress={previousMonth}>
          <Ionicons name="chevron-back" size={32} color={colors.primary} />
        </TouchableOpacity>
        <Text style={styles.monthText}>{formattedMonth}</Text>
        <TouchableOpacity onPress={nextMonth}>
          <Ionicons name="chevron-forward" size={32} color={colors.primary} />
        </TouchableOpacity>
      </View>

      {/* List */}
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : (
        <FlatList
          data={reports}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <ReportCard 
              report={item} 
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          )}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={renderEmptyList}
          showsVerticalScrollIndicator={false}
        />
      )}
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
  monthSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    gap: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  monthText: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.text.primary,
    minWidth: 150,
    textAlign: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContent: {
    padding: 20,
    gap: 15,
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  cardContent: {
    flex: 1,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  dateText: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text.primary,
    textTransform: 'capitalize',
  },
  durationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  durationText: {
    fontSize: 16,
    color: colors.text.primary,
    fontWeight: '500',
  },
  cardBody: {
    gap: 10,
  },
  studyContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  studyText: {
    fontSize: 16,
    color: colors.text.secondary,
  },
  observationsText: {
    fontSize: 14,
    color: colors.text.secondary,
    fontStyle: 'italic',
  },
  cardActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginLeft: 15,
  },
  actionButton: {
    padding: 8,
    borderRadius: 8,
    borderWidth: 1,
  },
  editButton: {
    borderColor: colors.action,
    backgroundColor: colors.white,
  },
  deleteButton: {
    borderColor: colors.danger,
    backgroundColor: colors.white,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
    gap: 10,
  },
  emptyText: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.text.primary,
    marginTop: 15,
  },
  emptySubtext: {
    fontSize: 16,
    color: colors.text.secondary,
    textAlign: 'center',
  },
}); 
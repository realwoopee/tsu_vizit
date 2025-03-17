import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Modal, TouchableOpacity } from 'react-native';

type FiltersBlockProps = {
  isVisible: boolean;
  closeModal: () => void;
  onApplyFilters: (sortOrder: 'asc' | 'desc', selectedStatus: string | undefined, selectedType: string | undefined) => void;
};

const FiltersBlock: React.FC<FiltersBlockProps> = ({ isVisible, closeModal, onApplyFilters }) => {

  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [selectedStatus, setSelectedStatus] = useState<string>();
  const [selectedType, setSelectedType] = useState<string>();
  const [tempSortOrder, setTempSortOrder] = useState<'asc' | 'desc'>('desc');
  const [tempSelectedStatus, setTempSelectedStatus] = useState<string>();
  const [tempSelectedType, setTempSelectedType] = useState<string>();

  const availableStatuses = ['Unknown', 'Approved', 'Declined'];
  const availableTypes = ['Personal', 'Family', 'Sick'];

  const applyFilters = () => {
    setSortOrder(tempSortOrder);
    setSelectedStatus(tempSelectedStatus);
    setSelectedType(tempSelectedType);
    closeModal();
  };

  useEffect(() => {
    onApplyFilters(sortOrder, selectedStatus, selectedType);
  }, [sortOrder, selectedStatus, selectedType]);

  const cancelFilters = () => {
    setTempSortOrder(sortOrder);
    setTempSelectedStatus(selectedStatus);
    setTempSelectedType(selectedType);
    closeModal(
    );
  };

  // const toggleTempStatusFilter = (status: string) => {
  //   setTempSelectedStatuses(prev =>
  //     prev.includes(status)
  //       ? prev.filter(s => s !== status)
  //       : [...prev, status]
  //   );
  // };
  // const toggleTempTypeFilter = (type: string) => {
  //   setTempSelectedTypes(prev =>
  //     prev.includes(type)
  //       ? prev.filter(t => t !== type)
  //       : [...prev, type]
  //   );
  // };

  const setStatus = (status: string) => {
    switch (status) {
      case 'Unknown':
        return 'На проверке';
      case 'Approved':
        return 'Принято';
      case 'Declined':
        return 'Отклонено';
      default:
        return 'Неизвестно';
    }
  };

  const setReason = (reason: string) => {
    switch (reason) {
      case 'Personal':
        return 'Пропуск по учебе';
      case 'Family':
        return 'Семейные обстоятельства';
      case 'Sick':
        return 'Болезнь';
      default:
        return 'Причины неизвестны';
    }
  };

  return (
    <Modal visible={isVisible} animationType="fade" transparent={true} onRequestClose={cancelFilters}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>

          <Text style={styles.modalTitle}>Фильтры и сортировка</Text>

          <View style={styles.modalSection}>
            <Text style={styles.sectionTitle}>Сортировка по дате создания</Text>
            <View style={styles.filterOptions}>
              <TouchableOpacity
                style={[styles.filterButton, tempSortOrder === 'desc' && styles.activeFilterButton]}
                onPress={() => setTempSortOrder('desc')}
              >
                <Text style={styles.filterButtonText}>По убыванию</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.filterButton, tempSortOrder === 'asc' && styles.activeFilterButton]}
                onPress={() => setTempSortOrder('asc')}
              >
                <Text style={styles.filterButtonText}>По возрастанию</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.modalSection}>
            <Text style={styles.sectionTitle}>Фильтр по статусу</Text>
            <View style={styles.filterOptions}>
              {availableStatuses.map(status => (
                <TouchableOpacity
                  key={status}
                  style={[
                    styles.filterButton,
                    tempSelectedStatus === status && styles.activeFilterButton
                  ]}
                  onPress={() => {
                    if (tempSelectedStatus === status) {
                      setTempSelectedStatus(undefined);
                    } else {
                      setTempSelectedStatus(status);
                    }
                  }
                  }
                >
                  <Text style={styles.filterButtonText}>{setStatus(status)}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.modalSection}>
            <Text style={styles.sectionTitle}>Фильтр по типу</Text>
            <View style={styles.filterOptions}>
              {availableTypes.map(type => (
                <TouchableOpacity
                  key={type}
                  style={[
                    styles.filterButton,
                    tempSelectedType === type && styles.activeFilterButton
                  ]}
                  onPress={() => {
                    if (tempSelectedType === type) {
                      setTempSelectedType(undefined);
                    } else {
                      setTempSelectedType(type);
                    }
                  }
                  }
                >
                  <Text style={styles.filterButtonText}>{setReason(type)}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.modalActions}>
            <TouchableOpacity style={styles.cancelButton} onPress={cancelFilters}>
              <Text style={styles.cancelButtonText}>Закрыть</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.applyButton} onPress={applyFilters}>
              <Text style={styles.applyButtonText}>Применить</Text>
            </TouchableOpacity>
          </View>

        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '90%',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
    fontFamily: 'inter-semi-bold'
  },
  modalSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  filterOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  filterButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: '#a8a8a8',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeFilterButton: {
    backgroundColor: '#007AFF',
  },
  filterButtonText: {
    fontSize: 14,
    color: '#fff',
    fontWeight: '500',
    fontFamily: 'inter-md'
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 12,
    backgroundColor: '#a8a8a8',
    borderRadius: 8,
    alignItems: 'center',
    marginRight: 8,
  },
  cancelButtonText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '600',
    fontFamily: 'inter-md'
  },
  applyButton: {
    flex: 1,
    paddingVertical: 12,
    backgroundColor: '#007AFF',
    borderRadius: 8,
    alignItems: 'center',
    marginLeft: 8,
  },
  applyButtonText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '600',
    fontFamily: 'inter-md'
  },
})
export default FiltersBlock;
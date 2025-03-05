import React, { useState } from 'react';
import { StyleSheet, Text, View, Modal, TouchableOpacity } from 'react-native';

type FiltersBlockProps = {
  isVisible: boolean;
  closeModal: () => void;
};

const FiltersBlock: React.FC<FiltersBlockProps> = ({ isVisible, closeModal }) => {

  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [tempSortOrder, setTempSortOrder] = useState<'asc' | 'desc'>('asc'); 
  const [tempSelectedStatuses, setTempSelectedStatuses] = useState<string[]>([]); 
  const [tempSelectedTypes, setTempSelectedTypes] = useState<string[]>([]);

  const availableStatuses = ['check', 'accept', 'reject'];
  const availableTypes = ['study', 'family', 'illness'];

  const applyFilters = () => {
    setSortOrder(tempSortOrder);
    setSelectedStatuses(tempSelectedStatuses);
    setSelectedTypes(tempSelectedTypes);
    closeModal(); 
  };

  const cancelFilters = () => {
    setTempSortOrder(sortOrder);
    setTempSelectedStatuses(selectedStatuses);
    setTempSelectedTypes(selectedTypes);
    closeModal(
    );
  };

  const toggleTempStatusFilter = (status: string) => {
    setTempSelectedStatuses(prev =>
      prev.includes(status)
        ? prev.filter(s => s !== status)
        : [...prev, status]
    );
  };
  const toggleTempTypeFilter = (type: string) => {
    setTempSelectedTypes(prev =>
      prev.includes(type)
        ? prev.filter(t => t !== type)
        : [...prev, type]
    );
  };

  return (
    <Modal visible={isVisible} animationType="fade" transparent={true} onRequestClose={cancelFilters}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>

          <Text style={styles.modalTitle}>Фильтры и сортировка</Text>

          <View style={styles.modalSection}>
            <Text style={styles.sectionTitle}>Сортировка по дате</Text>
            <View style={styles.filterOptions}>
              <TouchableOpacity
                style={[styles.filterButton, tempSortOrder === 'asc' && styles.activeFilterButton]}
                onPress={() => setTempSortOrder('asc')}
              >
                <Text style={styles.filterButtonText}>По возрастанию</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.filterButton, tempSortOrder === 'desc' && styles.activeFilterButton]}
                onPress={() => setTempSortOrder('desc')}
              >
                <Text style={styles.filterButtonText}>По убыванию</Text>
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
                    tempSelectedStatuses.includes(status) && styles.activeFilterButton
                  ]}
                  onPress={() => toggleTempStatusFilter(status)}
                >
                  <Text style={styles.filterButtonText}>{status}</Text>
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
                    tempSelectedTypes.includes(type) && styles.activeFilterButton
                  ]}
                  onPress={() => toggleTempTypeFilter(type)}
                >
                  <Text style={styles.filterButtonText}>{type}</Text>
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
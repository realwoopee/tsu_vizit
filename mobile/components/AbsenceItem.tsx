import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  FlatList,
  TouchableWithoutFeedback,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

type Doc = {
  name: string;
  type: string;
  uri: string;
};

type Item = {
  id: string;
  status: string;
  name: string;
  type: string;
  beg: string;
  end: string;
  docs: Doc[];
};

interface AbsenceItemProps {
  item: Item;
}

export default function AbsenceItem({ item }: AbsenceItemProps) {
  const [showDocsModal, setShowDocsModal] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'check':
        return '#FFA500';
      case 'accept':
        return '#00FF00';
      case 'reject':
        return '#FF0000';
      default:
        return '#000000';
    }
  };

  const handleAddDocument = () => {
  };

  return (
    <TouchableOpacity style={styles.itemContainer}>

      <View style={[styles.statusIndicator, { backgroundColor: getStatusColor(item.status) }]} />

      <View style={styles.contentContainer}>

        <View style={styles.header}>
          <Text style={styles.name}>{item.name}</Text>
          <Text style={styles.type}>{item.type}</Text>
        </View>

        <View style={styles.datesContainer}>
          <View style={styles.dateItem}>
            <Text style={styles.dateLabel}>Начало:</Text>
            <Text style={styles.dateValue}>{new Date(item.beg).toLocaleDateString()}</Text>
          </View>
          <View style={styles.dateItem}>
            <Text style={styles.dateLabel}>Конец:</Text>
            <Text style={styles.dateValue}>{new Date(item.end).toLocaleDateString()}</Text>
          </View>
        </View>

        <View style={styles.docsContainer}>
          <TouchableOpacity 
            style={styles.docsButton}
            onPress={() => setShowDocsModal(true)}
          >
            <Ionicons name="document-attach-outline" size={20} color="#666" />
            <Text style={styles.docsText}>
              Документы ({item.docs.length})
            </Text>
          </TouchableOpacity>
        </View>

      </View>

      <Modal
        visible={showDocsModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowDocsModal(false)}
      >

        <TouchableWithoutFeedback onPress={() => setShowDocsModal(false)}>

          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback>
              <View style={styles.modalContent}>

                <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle}>Документы</Text>
                  <TouchableOpacity onPress={() => setShowDocsModal(false)}>
                    <Ionicons name="close" size={24} color="#666" />
                  </TouchableOpacity>
                </View>

                <FlatList
                  data={item.docs}
                  renderItem={({item}) => (
                              <Text>{item.name}</Text>
                          )}
                  keyExtractor={(doc) => doc.uri}
                  ListEmptyComponent={
                    <Text style={styles.emptyText}>Документы отсутствуют</Text>
                  }
                />

                <TouchableOpacity 
                  style={styles.addDocButton}
                  onPress={() => {
                    handleAddDocument();
                    setShowDocsModal(false);
                  }}
                >
                  <Text style={styles.addDocButtonText}>Добавить документ</Text>
                </TouchableOpacity>

              </View>
            </TouchableWithoutFeedback>
          </View>
          
        </TouchableWithoutFeedback>

      </Modal>

    </TouchableOpacity>
  );
}

const baseText = {
  fontSize: 14,
  color: '#333',
};

const styles = StyleSheet.create({
  itemContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 8,
    marginVertical: 8,
    marginHorizontal: 16,
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  statusIndicator: {
    width: 8,
    borderRadius: 4,
    marginRight: 12,
  },
  contentContainer: { flex: 1 },
  header: { marginBottom: 12 },
  name: {
    ...baseText,
    fontSize: 16,
    fontWeight: '600',
  },
  type: {
    ...baseText,
    color: '#666',
    marginTop: 4,
  },
  datesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  dateItem: { flex: 1 },
  dateLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  dateValue: baseText,
  docsContainer: { marginTop: 8 },
  docsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    backgroundColor: '#f5f5f5',
    borderRadius: 6,
  },
  docsText: {
    marginLeft: 8,
    ...baseText,
    color: '#666',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    width: '85%',
    maxHeight: '70%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    ...baseText,
    fontSize: 18,
    fontWeight: '600',
  },
  emptyText: {
    textAlign: 'center',
    color: '#666',
    fontSize: 14,
    padding: 16,
  },
  addDocButton: {
    backgroundColor: '#007AFF',
    borderRadius: 6,
    padding: 12,
    marginTop: 16,
    alignItems: 'center',
  },
  addDocButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

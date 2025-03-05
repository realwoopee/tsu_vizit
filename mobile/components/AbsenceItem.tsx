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
import DateTimePicker from '@react-native-community/datetimepicker';
// import DocumentPicker from 'react-native-document-picker';

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
  onAddDocument: (id: string, docs: Doc[]) => void;
}

export default function AbsenceItem({ item, onAddDocument }: AbsenceItemProps) {
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showDocsModal, setShowDocsModal] = useState(false);
  const [endDate, setEndDate] = useState(new Date(item.end));


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

  const handleDateChange = (event: any, selectedDate?: Date) => {
    const currentDate = selectedDate || endDate;
    setShowDatePicker(false);
    setEndDate(currentDate);
  };


  const handleAddDocument = async () => {
    // try {
    //   const res = await DocumentPicker.pick({
    //     type: [DocumentPicker.types.allFiles],
    //     allowMultiSelection: true, 
    //   });
  
    //   if (!res || res.length === 0) return; 
  
    //   const newDocs: Doc[] = (Array.isArray(res) ? res : [res]).map(file => ({
    //     name: file.name || 'Без названия',
    //     type: file.type || 'Неизвестный',
    //     uri: file.uri,
    //   }));

    //   onAddDocument(item.id, newDocs);
  
    // } catch (err) {
    //   if (DocumentPicker.isCancel(err)) {
    //     console.log('cancelled', err);
    //   } else {
    //     console.error(err);
    //   }
    // }
  };

  const renderDocumentItem = ({ item: doc }: { item: Doc }) => (
    <TouchableOpacity style={styles.docItem}>
      <Ionicons name="document-text-outline" size={20} color="#666" />
      <View style={styles.docInfo}>
        <Text style={styles.docName}>{doc.name}</Text>
        <Text style={styles.docType}>{doc.type}</Text>
      </View>
    </TouchableOpacity>
  );


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
            <TouchableOpacity onPress={() => setShowDatePicker(true)}>
              <Text style={[styles.dateValue, styles.editableDate]}>
                {endDate.toLocaleDateString()}
              </Text>
            </TouchableOpacity>

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

      {showDatePicker && (
        <DateTimePicker
          value={endDate}
          mode="date"
          display="default"
          onChange={handleDateChange}
        />
      )}

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
                  renderItem={renderDocumentItem}
                  keyExtractor={(doc) => doc.uri}
                  ListEmptyComponent={
                    <Text style={styles.emptyText}>Документы отсутствуют</Text>
                  }
                />

                <TouchableOpacity 
                  style={styles.addDocButton}
                  onPress={() => {
                    handleAddDocument();
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
  fontFamily: 'inter-md'
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
    fontFamily: 'inter-md',
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
  editableDate: {
    color: '#007AFF',
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
    fontFamily: 'inter-md',
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
    fontFamily: 'inter-md',
    fontWeight: '600',
  },
  docItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  docInfo: {
    marginLeft: 12,
    flex: 1,
  },
  docName: {
    fontSize: 14,
    fontFamily: 'inter-md',
    color: '#333',
  },
  docType: {
    fontSize: 12,
    fontFamily: 'inter-md',
    color: '#666',
    marginTop: 4,
  },

});

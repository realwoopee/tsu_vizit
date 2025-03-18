import React, { useState, useContext } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  FlatList,
  TouchableWithoutFeedback,
  Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AntDesign from '@expo/vector-icons/AntDesign';
import DateTimePicker from '@react-native-community/datetimepicker';
// import DocumentPicker from 'react-native-document-picker';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { IAbsence } from '../models/IAbsence';
import { AppContext } from '..';


type Doc = {
  name: string;
  type: string;
  uri: string;
};


interface AbsenceItemProps {
  item: IAbsence;
}

export default function AbsenceItem({ item }: AbsenceItemProps) {
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showDocsModal, setShowDocsModal] = useState(false);
  const [endDate, setEndDate] = useState(new Date(item.absencePeriodFinish));

  const { store } = useContext(AppContext);


  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Unknown':
        return '#FFA500';
      case 'Approved':
        return '#00FF00';
      case 'Declined':
        return '#FF0000';
      default:
        return '#000000';
    }
  };

  const setReason = (reason: string) => {
    switch (reason) {
      case 'Personal':
        return 'Пропуск по учебе';
      case 'Family':
        return 'Семейные обстоятельства';
      case 'Sick':
        return 'Больничный';
      default:
        return 'Причина неизвестна';
    }
  };

  const handleDateChange = (event: any, selectedDate?: Date) => {
    const currentDate = selectedDate || endDate;
    setShowDatePicker(false);
    if (currentDate < new Date(item.absencePeriodStart)) {
      Alert.alert("Ошибка", "Дата конца не может быть раньше даты начала.");
    } else {
      setEndDate(currentDate);
      editAbsencePeriodFinish(currentDate);
    }
  };

  const editAbsencePeriodFinish = async (finishDate: Date) => {
    try {
      await store.editAbsencePeriodFinish(item.id, item.absencePeriodStart, finishDate.toISOString().split('T')[0], item.reason);;
    } catch (error: any) {
      const errorMessage = error?.status ? `Ошибка ${error.status}` : "Произошла непредвиденная ошибка";
      Alert.alert(errorMessage);
    }
  }


  // const handleAddDocument = async () => {
  //   try {
  //     const res = await DocumentPicker.pick({
  //       type: [DocumentPicker.types.allFiles],
  //       allowMultiSelection: true,
  //     });

  //     if (!res || res.length === 0) return;

  //     const newDocs: Doc[] = (Array.isArray(res) ? res : [res]).map(file => ({
  //       name: file.name || 'Без названия',
  //       type: file.type || 'Неизвестный',
  //       uri: file.uri,
  //     }));

  //     onAddDocument(item.id, newDocs);
  //   } catch (err) {
  //     if (DocumentPicker.isCancel(err)) {
  //       console.log('cancelled', err);
  //     } else {
  //       console.error(err);
  //     }
  //   }
  // };
  const handleAddDocument = async () => {
    try {
      const res = await DocumentPicker.getDocumentAsync({
        type: '*/*',
        multiple: false,
      });

      if (res.canceled) {
        console.log('cancelled');
        return;
      }

      if (res.assets && res.assets.length > 0) {
        const file = res.assets[0];
        try {
          await store.postDocument(item.id, file.uri, file.name || 'unknown', file.mimeType || 'unknown');
        } catch (error: any) {
          const errorMessage = error?.status ? `Ошибка ${error.status}` : "Произошла непредвиденная ошибка";
          Alert.alert(errorMessage);
        }
      }

    } catch (err) {
      console.error(err);
    }
  }



  const renderDocumentItem = ({ item: doc }: { item: Doc }) => (
    <View style={styles.docItemContainer}>
      <TouchableOpacity style={styles.docItem}>
        <Ionicons name="document-text-outline" size={20} color="#666" />
        <View style={styles.docInfo}>
          <Text style={styles.docName}>{doc.name}</Text>
          <Text style={styles.docType}>{doc.type}</Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.docButton}
        onPress={() => downloadFile(doc.uri, doc.name)}
      >
        <AntDesign name="download" size={20} color="black" />
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.docButton}
      // onPress={() => onRemoveDocument(item.id, doc.uri)}
      >
        <Ionicons name="trash-outline" size={20} color="#FF0000" />
      </TouchableOpacity>
    </View>

  );

  const downloadFile = async (uri: string, fileName: string) => {
    try {
      if (!uri) throw new Error('URL не должен быть пустым');

      const fileUri = FileSystem.documentDirectory + fileName;
      console.log(`Скачивание: ${uri} -> ${fileUri}`);

      await FileSystem.copyAsync({ from: uri, to: fileUri });

      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(fileUri);
      } else {
        Alert.alert('Ошибка', 'Поделиться файлом невозможно.');
      }
    } catch (error) {
      console.error('Ошибка загрузки:', error);
      Alert.alert('Ошибка', 'Не удалось сохранить. Проверьте разрешения.');
    }
  };

  const deleteAbsence = async (id: string) => {
    try {
      await store.deleteAbsence(id);
    } catch (error) {
      console.error(error);
      Alert.alert('Ошибка', 'Не удалось удалить пропуск.');
    }
  }

  const uploadFileButtonStyle = item.attachments.length < 5? styles.addDocButton : [styles.addDocButton, styles.disabledButton];


  return (
    <View style={styles.itemContainer}>

      <View style={[styles.statusIndicator, { backgroundColor: getStatusColor(item.finalStatus) }]} />

      <View style={styles.contentContainer}>

        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <View style={styles.header}>
            <Text style={styles.name}>{store.user.fullName}</Text>
            <Text style={styles.type}>{setReason(item.reason)}</Text>
          </View>

          {item.finalStatus === 'Unknown' && (
            <TouchableOpacity onPress={() => deleteAbsence(item.id)}>
              <Ionicons name="trash-outline" size={25} color="#FF0000" />
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.datesContainer}>
          <View style={styles.dateItem}>
            <Text style={styles.dateLabel}>Начало:</Text>
            <Text style={styles.dateValue}>{new Date(item.absencePeriodStart).toISOString().split('T')[0]}</Text>
          </View>
          <View style={styles.dateItem}>
            <Text style={styles.dateLabel}>Конец:</Text>
            <TouchableOpacity onPress={() => setShowDatePicker(true)}>
              <Text style={[styles.dateValue, styles.editableDate]}>
                {endDate.toISOString().split('T')[0]}
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
              Документы ({item.attachments.length})
            </Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.create}>Дата создания: {new Date(item.timeCreated).toISOString().split('T')[0]}</Text>

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
                  data={item.attachments}
                  renderItem={renderDocumentItem}
                  keyExtractor={(doc) => doc.uri}
                  ListEmptyComponent={
                    <Text style={styles.emptyText}>Документы отсутствуют</Text>
                  }
                />

                <TouchableOpacity
                  style={uploadFileButtonStyle} 
                  disabled={item.attachments.length >= 5}
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

    </View>
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
  disabledButton: {
    backgroundColor: '#a8a8a8'
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
  docItemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  docItem: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  docInfo: {
    marginLeft: 10,
  },
  docName: {
    fontSize: 16,
    color: '#333',
    fontFamily: 'inter-md',
  },
  docType: {
    fontSize: 12,
    color: '#666',
    fontFamily: 'inter-md',
  },
  docButton: {
    padding: 5,
  },
  create: {
    fontFamily: 'inter-md',
    fontSize: 12,
    marginTop: 6,
    color: '#666'
  }
});
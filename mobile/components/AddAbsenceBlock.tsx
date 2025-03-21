import React, { useState, useContext } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Modal, FlatList, Alert } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as DocumentPicker from 'expo-document-picker';
import { Ionicons } from '@expo/vector-icons';
import { AppContext } from '..';
import { IAbsence } from '../models/IAbsence';

type AddAbsenceBlockProps = {
    isVisible: boolean;
    closeModal: () => void;
};

type File = {
    name: string;
    type: string;
    uri: string;
};

const AddAbsenceBlock: React.FC<AddAbsenceBlockProps> = ({ isVisible, closeModal }) => {
    const [beginDate, setBeginDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());
    const [open, setOpen] = useState(false);
    const [value, setValue] = useState('null');
    const [items, setItems] = useState([
        { label: 'Больничный', value: 'Sick' },
        { label: 'Семейные обстоятельства', value: 'Family' },
        { label: 'Учебная', value: 'Personal' },
    ]);

    const [documents, setDocuments] = useState<File[]>([]);

    const { store } = useContext(AppContext);

    const handleBeginDateChange = (event: any, selectedDate?: Date) => {
        const currentDate = selectedDate || beginDate;
        setBeginDate(currentDate);
    };

    const handleEndDateChange = (event: any, selectedDate?: Date) => {
        const currentDate = selectedDate || endDate;
        setEndDate(currentDate);
    };

    const handleAddDocument = async () => {
        try {
            const result = await DocumentPicker.getDocumentAsync({
                type: '*/*',
                multiple: false,
            });
    
            if (result.canceled) {
                console.log('Выбор отменён');
                return;
            }

            if (result.assets && result.assets.length > 0) {
                const file = result.assets[0];
                setDocuments((prevDocs) => [
                    ...prevDocs,
                    {
                        name: file.name || 'unknown',
                        type: file.mimeType || 'unknown',
                        uri: file.uri,
                    },
                ]);
            }
        } catch (error) {
            console.error('Ошибка при выборе документа:', error);
        }
    };

    const renderDocumentItem = ({ item: doc }: { item: File }) => (
        <View style={styles.docItemContainer}>
            <View style={styles.docItem}>
                <Ionicons name="document-text-outline" size={20} color="#666" />
                <View style={styles.docInfo}>
                    <Text style={styles.docName}>{doc.name}</Text>
                </View>
            </View>

            <TouchableOpacity
                style={styles.docButton}
                onPress={() => onRemoveDocument(doc.uri)}
            >
                <Ionicons name="trash-outline" size={20} color="#eb4e3d" />
            </TouchableOpacity>
        </View>
    );

    const onRemoveDocument = (uri: string) => {
        setDocuments((prevDocs) => prevDocs.filter((doc) => doc.uri !== uri));
    };

    const saveNewAbsence = async () => {
        try {
            const response = await store.postAbsence(beginDate.toISOString().split('T')[0], endDate.toISOString().split('T')[0], value);
            if(response){
                for(let i = 0; i < documents.length; i ++) {
                    try {
                        await store.postDocument(response.id, documents[i].uri ,documents[i].name, documents[i].type);
                    } catch(error: any) {
                        const errorMessage = error?.status ? `Ошибка ${error.status}` : "Произошла непредвиденная ошибка";
                        Alert.alert(errorMessage);
                    }
                }
            }
            documents.length = 0;
            setBeginDate(new Date());
            setEndDate(new Date());
            setValue('null');
            closeModal();
        } catch (error: any) {
            const errorMessage = error?.status ? `Ошибка ${error.status}` : "Произошла непредвиденная ошибка";
            Alert.alert(errorMessage);
            console.log(error);
        }
    }


    const isFormValid = value !== 'null' && documents.length !== 0 && beginDate <= endDate;

    const saveButtonStyle = isFormValid ? styles.saveButton : [styles.saveButton, styles.disabledButton];
    const uploadFileButtonStyle = documents.length < 5? styles.uploadFileButton : [styles.uploadFileButton, styles.disabledButton];

    return (
        <Modal visible={isVisible} animationType="fade" transparent={true}>
            <View style={styles.modalOverlay}>
                <View style={styles.modal}>
                    <Text style={styles.headTitle}>Создание пропуска</Text>

                    <Text style={styles.text}>Дата начала</Text>
                    <TouchableOpacity style={{flexDirection: 'row', alignItems: 'flex-end',}}>
                        <Text style={styles.dateValue}>
                            {beginDate.toISOString().split('T')[0]}
                        </Text>

                        <DateTimePicker
                        value={beginDate}
                        mode="date"
                        display="default"
                        onChange={handleBeginDateChange}
                        />
                    </TouchableOpacity>

                    <Text style={styles.text}>Дата окончания</Text>
                    <TouchableOpacity style={{flexDirection: 'row', alignItems: 'flex-end',}}>
                        <Text style={styles.dateValue}>
                            {endDate.toISOString().split('T')[0]}
                        </Text>

                        <DateTimePicker
                        value={endDate}
                        mode="date"
                        display="default"
                        onChange={handleEndDateChange}
                        />
                    </TouchableOpacity>

                    <DropDownPicker
                        open={open}
                        value={value}
                        items={items}
                        setOpen={setOpen}
                        setValue={setValue}
                        setItems={setItems}
                        placeholder="Выберите причину"
                        style={styles.dropDown}
                        dropDownContainerStyle={styles.dropDownMenu}
                        labelStyle={styles.dropdownLabel}
                        selectedItemLabelStyle={styles.selectedItemLabel}
                    />

                    <FlatList
                        data={documents}
                        keyExtractor={(item, index) => index.toString()}
                        renderItem={renderDocumentItem}
                        style={{maxHeight: 200}}
                    />

                    <TouchableOpacity style={uploadFileButtonStyle} disabled={documents.length >= 5} onPress={handleAddDocument}>
                        <Text style={styles.buttonText}>Добавить файлы</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={saveButtonStyle} disabled={!isFormValid} onPress={saveNewAbsence}>
                        <Text style={styles.buttonText}>Создать</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={[styles.button, { backgroundColor: '#eb4e3d' }]} onPress={closeModal}>
                        <Text style={styles.buttonText}>Закрыть</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
};
  
const styles = StyleSheet.create({
    modal: {
        width: '90%',
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 20,
        shadowColor: '#000', 
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    headTitle: {
        fontSize: 25,
        fontFamily: 'inter-semi-bold',
        alignSelf: 'center', 
        marginBottom: 20
    },
    button: {
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 10,
        height: 40,
        marginTop: 5
    },
    uploadFileButton: {
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 10,
        height: 40,
        marginTop: 5,
        backgroundColor: '#3478F6', 
        marginBottom: 40
    },
    saveButton: {
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 10,
        height: 40,
        marginTop: 5,
        backgroundColor: '#3478F6'
    },
    disabledButton: {
        backgroundColor: '#a8a8a8'
    },
    dropDown: {
        borderWidth: 1,
        borderColor: 'grey',
        borderRadius: 12,
        height: 40,
        padding: 10, 
        justifyContent: 'center',
        marginBottom: 20,
        marginTop: 10
    },
    text: {
        fontFamily: 'inter-md',
        fontSize: 15,
        color:'#666',
        marginBottom: 5
    },
    buttonText: {
        fontFamily: 'inter-md',
        fontSize: 20,
        color: 'white',
    },
    dropDownMenu: {
        width: '100%',
        borderRadius: 12,
        height: 100,
        marginTop: 15,
        shadowColor: '#000', 
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4
    },
    dropdownItem: {
        justifyContent: 'flex-start',
    },
    dropdownLabel: {
        fontSize: 16,
        color: '#333',
    },
    selectedItemLabel: {
        fontWeight: 'bold',
        color: '#3478F6',
    },
    dateValue: {
        fontSize: 20,
        fontFamily: 'inter-md',
        marginBottom: 10,
        color: '#3478F6',
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
        width: 255
    },
    docType: {
        fontSize: 12,
        color: '#666',
        fontFamily: 'inter-md',
    },
    docButton: {
        padding: 5,
    }
  })

export default AddAbsenceBlock;
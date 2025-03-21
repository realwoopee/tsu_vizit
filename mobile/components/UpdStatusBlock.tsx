import React, { useState, useContext } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Modal, FlatList, Alert } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import { AppContext } from '..';
import { IAbsence } from '../models/IAbsence';

type UpdStatusBlockProps = {
    isVisible: boolean;
    closeModal: () => void;
    item: IAbsence;
};

const UpdStatusBlock: React.FC<UpdStatusBlockProps> = ({ isVisible, closeModal, item }) => {
    const { store } = useContext(AppContext);

    const [open, setOpen] = useState(false);
    const [value, setValue] = useState('null');
    const [items, setItems] = useState([
        { label: 'На проверке', value: 'Unknown' },
        { label: 'Принято', value: 'Approved' },
        { label: 'Отклонено', value: 'Declined' },
    ]);

    const isFormValid = value !== item.finalStatus && value !== 'null';

    const saveButtonStyle = isFormValid ? styles.saveButton : [styles.saveButton, styles.disabledButton];

    const updStatus = async (id: string, status: string) => {
        try {
            console.log(status);
            await store.putStatus(id, status);
            closeModal();
        } catch (error) {
            Alert.alert('Что-то пошло не так ...');
        }
    };

    return (
        <Modal visible={isVisible} animationType="fade" transparent={true}>
            <View style={styles.modalOverlay}>
                <View style={styles.modal}>
                    <Text style={styles.headTitle}>Изменение статуса</Text>

                    <DropDownPicker
                        open={open}
                        value={value}
                        items={items}
                        setOpen={setOpen}
                        setValue={setValue}
                        setItems={setItems}
                        placeholder={'Выберите статус'}
                        style={styles.dropDown}
                        dropDownContainerStyle={styles.dropDownMenu}
                        labelStyle={styles.dropdownLabel}
                        selectedItemLabelStyle={styles.selectedItemLabel}
                    />

                    <TouchableOpacity style={saveButtonStyle} disabled={!isFormValid} onPress={() => updStatus(item.id, value)}>
                        <Text style={styles.buttonText}>Сохранить изменения</Text>
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
    dropDown: {
        borderWidth: 1,
        borderColor: 'grey',
        borderRadius: 12,
        height: 40,
        padding: 10, 
        justifyContent: 'center',
        marginBottom: 30,
        marginTop: 10
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
});

export default UpdStatusBlock;
import { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  Modal,
  TextInput,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useEmergencyStore } from '@/store/emergencyStore';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

const PALETTE = {
  primaryBlue: '#1F6F8B',
  darkText: '#263238',
  mediumGray: '#90A4AE',
  lightGray: '#ECEFF1',
  error: '#D32F2F',
  success: '#2E7D32',
};

function ContactCard({ contact, onDelete }) {
  return (
    <View style={styles.card}>
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>{contact.name.charAt(0).toUpperCase()}</Text>
      </View>
      <View style={styles.cardInfo}>
        <Text style={styles.cardName}>{contact.name}</Text>
        <Text style={styles.cardPhone}>{contact.phone}</Text>
      </View>
      <TouchableOpacity onPress={() => onDelete(contact.id)}>
        <MaterialIcons name="delete-outline" size={24} color={PALETTE.mediumGray} />
      </TouchableOpacity>
    </View>
  );
}

export default function ContactsScreen() {
  const { contacts, addContact, removeContact } = useEmergencyStore();
  const [modalVisible, setModalVisible] = useState(false);
  const [newName, setNewName] = useState('');
  const [newPhone, setNewPhone] = useState('');

  const handleAdd = () => {
    if (newName && newPhone) {
      addContact(newName, newPhone);
      setNewName('');
      setNewPhone('');
      setModalVisible(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Contactos</Text>
        <Text style={styles.headerSubtitle}>Tus enlaces de emergencia</Text>
      </View>

      <FlatList
        data={contacts}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ContactCard contact={item} onDelete={removeContact} />
        )}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <View style={styles.empty}>
            <MaterialIcons name="person-add-alt" size={64} color={PALETTE.mediumGray} />
            <Text style={styles.emptyText}>No tienes contactos agregados</Text>
          </View>
        }
      />

      {/* Floating Action Button */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => setModalVisible(true)}
      >
        <MaterialIcons name="add" size={32} color="#FFF" />
      </TouchableOpacity>

      {/* Add Contact Modal */}
      <Modal animationType="slide" transparent={true} visible={modalVisible}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.modalOverlay}
        >
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Nuevo Contacto</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <MaterialIcons name="close" size={24} color={PALETTE.darkText} />
              </TouchableOpacity>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Nombre completo</Text>
              <TextInput
                style={styles.input}
                value={newName}
                onChangeText={setNewName}
                placeholder="Ejem: Juan Pérez"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Número de teléfono</Text>
              <TextInput
                style={styles.input}
                value={newPhone}
                onChangeText={setNewPhone}
                placeholder="+54 9 11 ..."
                keyboardType="phone-pad"
              />
            </View>

            <TouchableOpacity style={styles.submitBtn} onPress={handleAdd}>
              <Text style={styles.submitBtnText}>GUARDAR CONTACTO</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  header: {
    padding: 24,
    backgroundColor: '#FFF',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '900',
    color: PALETTE.darkText,
  },
  headerSubtitle: {
    fontSize: 14,
    color: PALETTE.mediumGray,
    marginTop: 4,
  },
  list: {
    padding: 20,
    paddingBottom: 100,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: PALETTE.lightGray,
    borderRadius: 20,
    padding: 16,
    marginBottom: 12,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: PALETTE.primaryBlue,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: '#FFF',
    fontSize: 20,
    fontWeight: '700',
  },
  cardInfo: {
    flex: 1,
    marginLeft: 16,
  },
  cardName: {
    fontSize: 16,
    fontWeight: '700',
    color: PALETTE.darkText,
  },
  cardPhone: {
    fontSize: 14,
    color: PALETTE.mediumGray,
    marginTop: 2,
  },
  fab: {
    position: 'absolute',
    bottom: 30,
    right: 30,
    backgroundColor: PALETTE.primaryBlue,
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFF',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 30,
    minHeight: 400,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 30,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: PALETTE.darkText,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 12,
    fontWeight: '800',
    color: PALETTE.mediumGray,
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  input: {
    backgroundColor: PALETTE.lightGray,
    borderRadius: 14,
    padding: 16,
    fontSize: 16,
    color: PALETTE.darkText,
    fontWeight: '600',
  },
  submitBtn: {
    backgroundColor: PALETTE.primaryBlue,
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    marginTop: 20,
  },
  submitBtnText: {
    color: '#FFF',
    fontWeight: '900',
    fontSize: 14,
    letterSpacing: 1,
  },
  empty: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 100,
  },
  emptyText: {
    color: PALETTE.mediumGray,
    marginTop: 16,
    fontSize: 14,
    fontWeight: '600',
  },
});

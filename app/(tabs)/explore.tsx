import { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  Modal,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useContactStore } from '@/store/contactStore';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useRouter } from 'expo-router';
import { COLORS, FONT_SIZES, TYPOGRAPHY, SPACING, BORDER_RADIUS } from '@/constants/theme';

function ContactCard({ contact, onDelete }) {
  return (
    <View style={styles.card}>
      <View style={styles.cardInfo}>
        <Text style={styles.cardName}>{contact.name}</Text>
        <Text style={styles.cardPhone}>{contact.phone_number}</Text>
      </View>
      <TouchableOpacity style={styles.deleteBtn} onPress={() => onDelete(contact.id)}>
        <MaterialIcons name="delete-outline" size={20} color={COLORS.error} />
      </TouchableOpacity>
    </View>
  );
}

export default function ContactsScreen() {
  const router = useRouter();
  const { contacts, addContact, removeContact, fetchContacts } = useContactStore();
  const [modalVisible, setModalVisible] = useState(false);
  const [newName, setNewName] = useState('');
  const [newPhone, setNewPhone] = useState('');

  useEffect(() => {
    fetchContacts();
  }, [fetchContacts]);

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
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <MaterialIcons name="arrow-back" size={24} color={COLORS.primaryBlue} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>CONTACTOS</Text>
        <View style={{ width: 40 }} />
      </View>

      <FlatList
        data={contacts}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <ContactCard contact={item} onDelete={removeContact} />
        )}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <View style={styles.empty}>
            <MaterialIcons name="person-add-alt" size={64} color={COLORS.mediumGray} />
            <Text style={styles.emptyText}>No tienes contactos agregados</Text>
          </View>
        }
      />

      <View style={styles.bottomContainer}>
        <TouchableOpacity
          style={styles.addBtn}
          onPress={() => setModalVisible(true)}
        >
          <Text style={styles.addBtnText}>+ AGREGAR CONTACTO</Text>
        </TouchableOpacity>
      </View>

      <Modal animationType="slide" transparent={true} visible={modalVisible}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.modalOverlay}
        >
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Nuevo Contacto</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <MaterialIcons name="close" size={24} color={COLORS.darkText} />
              </TouchableOpacity>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Nombre completo</Text>
              <TextInput
                style={styles.input}
                value={newName}
                onChangeText={setNewName}
                placeholder="Ejem: Juan Pérez"
                placeholderTextColor={COLORS.mediumGray}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Número de teléfono</Text>
              <TextInput
                style={styles.input}
                value={newPhone}
                onChangeText={setNewPhone}
                placeholder="+54 9 11 ..."
                placeholderTextColor={COLORS.mediumGray}
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
    backgroundColor: COLORS.lightBackground,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
    backgroundColor: COLORS.lightBackground,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: BORDER_RADIUS.sm,
    borderWidth: 1,
    borderColor: COLORS.primaryBlue,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  headerTitle: {
    fontSize: FONT_SIZES.xl,
    fontWeight: TYPOGRAPHY.fontWeightBold,
    color: COLORS.darkText,
    letterSpacing: 1,
  },
  list: {
    padding: SPACING.lg,
    paddingBottom: 100,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 18,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#DDDDDD',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  cardInfo: {
    flex: 1,
  },
  cardName: {
    fontSize: FONT_SIZES.lg,
    fontWeight: TYPOGRAPHY.fontWeightBold,
    color: COLORS.darkText,
  },
  cardPhone: {
    fontSize: FONT_SIZES.md,
    color: COLORS.mediumGray,
    marginTop: 4,
  },
  deleteBtn: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: '#F5B5B5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bottomContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: SPACING.lg,
    backgroundColor: COLORS.lightBackground,
  },
  addBtn: {
    backgroundColor: COLORS.primaryBlue,
    height: 64,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addBtnText: {
    color: COLORS.white,
    fontSize: FONT_SIZES.md,
    fontWeight: TYPOGRAPHY.fontWeightBold,
    letterSpacing: 1,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: COLORS.white,
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
    fontSize: FONT_SIZES.xxl,
    fontWeight: TYPOGRAPHY.fontWeightBold,
    color: COLORS.darkText,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: FONT_SIZES.sm,
    fontWeight: TYPOGRAPHY.fontWeightBold,
    color: COLORS.mediumGray,
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  input: {
    backgroundColor: COLORS.lightBackground,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    fontSize: FONT_SIZES.lg,
    color: COLORS.darkText,
    fontWeight: TYPOGRAPHY.fontWeightSemiBold,
  },
  submitBtn: {
    backgroundColor: COLORS.primaryBlue,
    borderRadius: BORDER_RADIUS.md,
    padding: 20,
    alignItems: 'center',
    marginTop: 20,
  },
  submitBtnText: {
    color: COLORS.white,
    fontWeight: TYPOGRAPHY.fontWeightBold,
    fontSize: FONT_SIZES.md,
    letterSpacing: 1,
  },
  empty: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 100,
  },
  emptyText: {
    color: COLORS.mediumGray,
    marginTop: 16,
    fontSize: FONT_SIZES.md,
    fontWeight: TYPOGRAPHY.fontWeightSemiBold,
  },
});

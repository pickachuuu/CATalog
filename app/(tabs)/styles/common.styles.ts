import { StyleSheet, Platform, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

export const commonStyles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  container: { 
    flex: 1,
  },
  contentContainer: {
    flex: 1,
    paddingTop: Platform.OS === 'ios' ? 0 : 0, // StatusBar.currentHeight will be handled in the component
  },
  searchBarContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  searchBar: { 
    borderRadius: 12,
    height: 50,
    backgroundColor: '#fff',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 10,
      },
      android: {
        elevation: 6,
      },
    }),
  },
  searchInput: {
    fontSize: 16,
  },
  productList: { 
    padding: 16, 
    paddingBottom: 100 
  },
  productCard: { 
    marginBottom: 16, 
    elevation: 3,
    borderRadius: 12,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
    }),
  },
  productContainer: { 
    flexDirection: 'row', 
    padding: 16, 
    alignItems: 'center' 
  },
  imageContainer: {
    position: 'relative',
    borderRadius: 12,
    overflow: 'hidden',
  },
  productImage: { 
    width: 80, 
    height: 80, 
    borderRadius: 12,
  },
  stockIndicator: {
    position: 'absolute',
    width: 12,
    height: 12,
    borderRadius: 6,
    bottom: 4,
    right: 4,
    borderWidth: 2,
    borderColor: '#fff',
  },
  productInfo: { 
    flex: 1, 
    marginLeft: 16 
  },
  productName: { 
    fontSize: 18, 
    fontWeight: 'bold', 
    color: '#212121', 
    marginBottom: 8 
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  quantityLabel: {
    fontSize: 14,
    color: '#757575',
    marginRight: 4,
  },
  productQuantity: { 
    fontSize: 16, 
    fontWeight: '600',
  },
  categoryBadge: {
    backgroundColor: '#E3F2FD',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 16,
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  categoryText: {
    fontSize: 12,
    color: '#1976D2',
    fontWeight: '500',
  },
  lowStockThreshold: { 
    fontSize: 12, 
    color: '#9E9E9E',
    fontStyle: 'italic',
  },
  menuButton: {
    margin: 0,
    backgroundColor: '#f5f5f5',
  },
  fab: { 
    position: 'absolute', 
    margin: 16, 
    right: 0, 
    bottom: 0, 
    backgroundColor: '#2f95dc',
    borderRadius: 28,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.2,
        shadowRadius: 6,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  emptyContainer: { 
    alignItems: 'center', 
    justifyContent: 'center', 
    padding: 40,
    marginTop: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 16,
    marginHorizontal: 16,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  emptyImage: {
    width: 120,
    height: 120,
    marginBottom: 16,
    opacity: 0.6,
  },
  emptyText: { 
    fontSize: 20, 
    fontWeight: 'bold', 
    color: '#424242', 
    marginTop: 16 
  },
  emptySubtext: { 
    fontSize: 14, 
    color: '#757575', 
    marginTop: 8,
    textAlign: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: { 
    width: '100%',
    justifyContent: 'flex-end', 
    alignItems: 'center',
    height: '100%',
  },
  modalContent: { 
    width: '100%', 
    backgroundColor: '#fff', 
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    overflow: 'hidden',
    height: '70%',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -3 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
      },
      android: {
        elevation: 24,
      },
    }),
  },
  modalHeader: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  modalDragIndicator: {
    width: 40,
    height: 5,
    backgroundColor: '#E0E0E0',
    borderRadius: 2.5,
    alignSelf: 'center',
    marginBottom: 10,
  },
  modalTitle: { 
    fontSize: 20, 
    fontWeight: 'bold',
    color: '#212121',
    flex: 1,
    textAlign: 'center',
  },
  closeButton: {
    margin: 0,
    backgroundColor: 'transparent',
  },
  formContainer: {
    padding: 24,
  },
  formGroup: {
    marginBottom: 20,
  },
  formRow: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  label: { 
    fontSize: 14, 
    fontWeight: '600', 
    marginBottom: 8,
    color: '#424242',
  },
  input: { 
    borderWidth: 1, 
    borderColor: '#E0E0E0', 
    borderRadius: 12, 
    padding: 12,
    fontSize: 16,
    backgroundColor: '#FAFAFA',
    height: 50,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 12,
    backgroundColor: '#FAFAFA',
    height: 50,
    justifyContent: 'center',
  },
  pickerInput: { 
    fontSize: 16,
    padding: 12,
    color: '#212121',
  },
  imagePicker: { 
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 12,
    overflow: 'hidden',
    height: 150,
    backgroundColor: '#FAFAFA',
  },
  imagePickerPlaceholder: {
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FAFAFA',
  },
  imagePickerText: { 
    color: '#2f95dc', 
    fontWeight: '500',
    marginTop: 8,
  },
  previewImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  modalButtons: { 
    flexDirection: 'row', 
    justifyContent: 'space-between',
    marginTop: 8,
  },
  button: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  cancelButton: {
    marginRight: 8,
    backgroundColor: '#F5F5F5',
  },
  saveButton: {
    marginLeft: 8,
    backgroundColor: '#2f95dc',
  },
  deleteButton: {
    marginLeft: 8,
    backgroundColor: '#FF5252',
  },
  cancelButtonText: {
    color: '#616161',
    fontWeight: '600',
    fontSize: 16,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 16,
  },
  deleteButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 16,
  },
  // Options Modal Styles
  optionsModalContainer: {
    width: width * 0.85,
    justifyContent: 'center',
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 10,
      },
      android: {
        elevation: 24,
      },
    }),
  },
  optionsModalContent: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 16,
    overflow: 'hidden',
  },
  optionsModalHeader: {
    padding: 16,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  optionsModalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#212121',
    marginBottom: 8,
  },
  optionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  optionIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  optionIcon: {
    margin: 0,
    marginRight: 8,
  },
  optionText: {
    fontSize: 16,
    color: '#212121',
    fontWeight: '500',
  },
  cancelOptionButton: {
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  // Confirm Delete Modal Styles
  confirmModalContainer: {
    width: width * 0.85,
    justifyContent: 'center',
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 10,
      },
      android: {
        elevation: 24,
      },
    }),
  },
  confirmModalContent: {
    width: '100%',
    backgroundColor: '#fff',
    padding: 24,
    borderRadius: 16,
    alignItems: 'center',
  },
  deleteIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(255, 82, 82, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  confirmModalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FF5252',
    marginBottom: 12,
    textAlign: 'center',
  },
  confirmModalText: {
    fontSize: 16,
    color: '#424242',
    marginBottom: 24,
    textAlign: 'center',
    lineHeight: 24,
  },
  confirmModalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
}); 
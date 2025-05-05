import { StyleSheet, Platform, Dimensions } from 'react-native';
import Colors from '../constants/Colors';

const { width } = Dimensions.get('window');

export const createCommonStyles = (isDarkMode: boolean) => {
  const theme = isDarkMode ? Colors.dark : Colors.light;

  return {
    ...StyleSheet.create({
      // Confirm Modal Styles
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
        backgroundColor: theme.background,  // Changed from '#fff'
        borderRadius: 16,
        overflow: 'hidden',
      },
      optionsModalHeader: {
        padding: 16,
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: theme.tabIconDefault,  // Changed from '#F0F0F0'
      },
      optionsModalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: theme.text,  // Changed from '#212121'
        marginBottom: 8,
      },
      optionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: theme.tabIconDefault,  // Changed from '#F0F0F0'
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
        color: theme.text,  // Changed from '#212121'
        fontWeight: '500',
      },
      cancelOptionButton: {
        padding: 16,
        alignItems: 'center',
        justifyContent: 'center',
        borderTopWidth: 1,
        borderTopColor: theme.tabIconDefault,  // Changed from '#F0F0F0'
      },
      // Confirm Modal Styles
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
        backgroundColor: theme.background,
        padding: 24,
        borderRadius: 16,
        alignItems: 'center',
      },
      deleteIconContainer: {
        width: 64,
        height: 64,
        borderRadius: 32,
        backgroundColor: `${theme.error}1A`,  // Changed from 'rgba(255, 82, 82, 0.1)' to use theme.error with 10% opacity
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 16,
      },
      confirmModalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: theme.error,  // Changed from '#FF5252'
        marginBottom: 12,
        textAlign: 'center',
      },
      confirmModalText: {
        fontSize: 16,
        color: theme.text,
        marginBottom: 24,
        textAlign: 'center',
        lineHeight: 24,
      },
      confirmModalButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
      },
      
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
        paddingTop: Platform.OS === 'ios' ? 0 : 0,
      },
      searchBarContainer: {
        paddingHorizontal: 16,
        paddingVertical: 12,
      },
      searchBar: {
        borderRadius: 12,
        height: 50,
        backgroundColor: theme.background,
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
        color: theme.text,
      },
      productList: {
        padding: 16,
        paddingBottom: 100,
      },
      productCard: {
        marginBottom: 16,
        elevation: 3,
        borderRadius: 12,
        overflow: 'hidden',
        backgroundColor: theme.background,
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
        alignItems: 'center',
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
        borderColor: theme.background,
      },
      productInfo: {
        flex: 1,
        marginLeft: 16,
      },
      productName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: theme.text,
        marginBottom: 8,
      },
      quantityContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
      },
      quantityLabel: {
        fontSize: 14,
        color: theme.tabIconDefault,
        marginRight: 4,
      },
      productQuantity: {
        fontSize: 16,
        fontWeight: '600',
      },
      categoryBadge: {
        backgroundColor: theme.tint,
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 16,
        alignSelf: 'flex-start',
        marginBottom: 8,
      },
      categoryText: {
        fontSize: 12,
        color: theme.text,
        fontWeight: '500',
      },
      lowStockThreshold: {
        fontSize: 12,
        color: theme.tabIconDefault,
        fontStyle: 'italic',
      },
      menuButton: {
        margin: 0,
        backgroundColor: theme.background,
      },
      fab: {
        position: 'absolute',
        margin: 16,
        right: 0,
        bottom: 0,
        backgroundColor: theme.tint,
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
        backgroundColor: theme.background,
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
        color: theme.text,
        marginTop: 16,
      },
      emptySubtext: {
        fontSize: 14,
        color: theme.tabIconDefault,
        marginTop: 8,
        textAlign: 'center',
      },
      modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',  // Keep this as is for overlay transparency
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
        backgroundColor: theme.background,
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        overflow: 'hidden',
        maxHeight: '90%', // Add this to limit modal height
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
        borderBottomColor: theme.tabIconDefault,
      },
      modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: theme.text,
        flex: 1,
        textAlign: 'center',
      },
      closeButton: {
        margin: 0,
        backgroundColor: 'transparent',
      },
      formContainer: {
        flexGrow: 1, // Changed from padding
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
        color: theme.text, // This is already using theme text color
      },
      input: {
        borderWidth: 1,
        borderColor: theme.tabIconDefault,
        borderRadius: 12,
        padding: 12,
        fontSize: 16,
        backgroundColor: isDarkMode ? '#2C2C2C' : theme.background, // Lighter background for dark mode
        color: theme.text, // Add explicit text color
        height: 50,
      },
      pickerContainer: {
        borderWidth: 1,
        borderColor: theme.tabIconDefault,
        borderRadius: 12,
        backgroundColor: isDarkMode ? '#2C2C2C' : theme.background, // Match input background
        height: 50,
        justifyContent: 'center',
      },
      pickerInput: {
        fontSize: 16,
        padding: 12,
        color: theme.text,
      },
      imagePicker: {
        borderWidth: 1,
        borderColor: theme.tabIconDefault,
        borderRadius: 12,
        overflow: 'hidden',
        height: 150,
        backgroundColor: theme.background,
      },
      imagePickerPlaceholder: {
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: isDarkMode ? '#2C2C2C' : theme.background, // Match input background
      },
      imagePickerText: {
        color: theme.tint,
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
        paddingHorizontal: 24,
        paddingVertical: 16,
        borderTopWidth: 1,
        borderTopColor: theme.tabIconDefault,
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
        backgroundColor: theme.tabIconDefault,
      },
      saveButton: {
        marginLeft: 8,
        backgroundColor: theme.tint,
      },
      deleteButton: {
        marginLeft: 8,
        backgroundColor: theme.tabIconDefault,
      },
      cancelButtonText: {
        color: theme.text,
        fontWeight: '600',
        fontSize: 16,
      },
      saveButtonText: {
        color: theme.background,
        fontWeight: '600',
        fontSize: 16,
      },
      deleteButtonText: {
        color: theme.text,
        fontWeight: '600',
        fontSize: 16,
      },
      // Add these new styles for inline styles from products.tsx
      optionButtonInline: {
        padding: 16, 
        flexDirection: 'row', 
        alignItems: 'center'
      },
      optionIconContainerInline: {
        backgroundColor: `${theme.tint}1A`, // 10% opacity
        padding: 10, 
        borderRadius: 20, 
        marginRight: 12
      },
      deleteIconContainerInline: {
        backgroundColor: `${theme.error}1A`, // 10% opacity
        padding: 10, 
        borderRadius: 20, 
        marginRight: 12
      },
      deleteOptionText: {
        fontSize: 16,
        color: theme.error
      },
      cancelOptionButtonInline: {
        padding: 16, 
        alignItems: 'center', 
        borderTopWidth: 1, 
        borderTopColor: theme.tabIconDefault
      },
      confirmIconContainer: {
        alignItems: 'center', 
        marginVertical: 16
      },
      confirmTitleStyle: {
        fontSize: 20, 
        fontWeight: 'bold', 
        textAlign: 'center', 
        marginBottom: 8
      },
      confirmTextStyle: {
        textAlign: 'center', 
        marginBottom: 24, 
        paddingHorizontal: 16
      },
      stockStatusOut: {
        backgroundColor: theme.error
      },
      stockStatusLow: {
        backgroundColor: '#FFC107' // Consider adding this to Colors.ts
      },
      stockStatusIn: {
        backgroundColor: '#4CAF50' // Consider adding this to Colors.ts
      },
      formGroupWithMargin: {
        flex: 1,
        marginRight: 8
      },
      formGroupWithMarginLeft: {
        flex: 1,
        marginLeft: 8
      }
    }),
    // Theme colors for direct access
    colors: {
      tint: theme.tint,
      error: theme.error,
      text: theme.text,
      background: theme.background,
      tabIconDefault: theme.tabIconDefault
    }
  };
};
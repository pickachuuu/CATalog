import { StyleSheet, Platform, Dimensions } from 'react-native';
import Colors from '../constants/Colors';
import { BottomTabNavigationOptions } from '@react-navigation/bottom-tabs';
import { transparent } from 'react-native-paper/lib/typescript/styles/themes/v2/colors';

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
        backgroundColor: 'transparent',
      },
      optionsModalContent: {
        width: '100%',
        backgroundColor: theme.background,  // Changed from '#fff'
        borderRadius: 16,
        overflow: 'hidden',
        paddingVertical: 16,
        ...Platform.select({
          ios: {
            shadowColor: theme.shadow,
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.15,
            shadowRadius: 16,
          },
          android: {
            elevation: 8,
          },
        }),
      },
      optionsModalHeader: {
        padding: 16,
        alignItems: 'center',
      },
      optionsModalTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: theme.text,  // Changed from '#212121'
        marginBottom: 8,
      },
      optionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        marginHorizontal: 8,
        marginVertical: 4,
        borderRadius: 12,
      },
      optionIconContainerInline: {
        backgroundColor: `${theme.tint}10`,
        padding: 8,
        borderRadius: 10,
        marginRight: 12,
      },
      deleteIconContainerInline: {
        backgroundColor: `${theme.error}10`,
        padding: 8,
        borderRadius: 10,
        marginRight: 12,
      },
      optionText: {
        fontSize: 16,
        color: theme.text,  // Changed from '#212121'
        fontWeight: '500',
      },
      deleteOptionText: {
        fontSize: 16,
        color: theme.error,
        fontWeight: '500',
      },
      cancelOptionButton: {
        padding: 16,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 4,
      },
      cancelButtonText: {
        color: theme.tabIconDefault,
        fontWeight: '500',
        fontSize: 16,
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
        
      },
      searchBarContainer: {
        paddingHorizontal: 16,
        paddingVertical: 8, 
      },
      searchBar: {
        borderWidth: 1,
        borderColor: theme.borderColor,
        borderRadius: 12,
        height: 50,
        backgroundColor: theme.secondaryBackground,
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
        color: theme.text,
        marginBottom: 16,
        elevation: 3,
        borderRadius: 12,
        overflow: 'hidden',
        backgroundColor: theme.secondaryBackground,
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
      categoryBadgeText: {
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
        backgroundColor: theme.borderColor,
      },
      saveButton: {
        marginLeft: 8,
        backgroundColor: theme.tint,
      },
      deleteButton: {
        marginLeft: 8,
        backgroundColor: theme.tabIconDefault,
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
      },
      // Header styles
      safeArea: {
        backgroundColor: 'transparent',
      },
      headerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
        height: 64,
        backgroundColor: theme.background,
      },
      logo: {
        width: 40,
        height: 40,
        marginRight: 8,
      },
      headerTitle: {
        fontSize: 30,
        fontWeight: 'bold',
        color: theme.text,
      },

      // Horizontal rule
      horizontalRule: {
        borderBottomColor: theme.borderColor, // Use theme border color
        borderBottomWidth: StyleSheet.hairlineWidth,
        marginVertical: 0.5,
      },
      // Add these styles to createCommonStyles
      dashboardContainer: {
        backgroundColor: theme.background,
        flex: 1,
        padding: 20,
      },
      dashboardTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        color: theme.text,
      },
      chartContainer: {
        marginBottom: 20,
        padding: 10,
        borderRadius: 16,
        backgroundColor: theme.secondaryBackground,
        ...Platform.select({
          ios: {
            shadowColor: theme.shadow,
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.15,
            shadowRadius: 10,
          },
          android: {
            elevation: 5,
          },
        }),
      },
      chartTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
        color: theme.text,
      },
      listContainer: {
        marginBottom: 20,
        padding: 10,
        borderRadius: 16,
        backgroundColor: theme.secondaryBackground,
        ...Platform.select({
          ios: {
            shadowColor: theme.shadow,
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.15,
            shadowRadius: 10,
          },
          android: {
            elevation: 5,
          },
        }),
      },
      listItem: {
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: theme.borderColor,
      },
      itemName: {
        fontSize: 16,
        fontWeight: '500',
        color: theme.text,
      },
      stockWarning: {
        color: theme.error,
        marginTop: 5,
      },
      categoryText: {
        color: theme.tabIconDefault,
        marginTop: 5,
        fontSize: 14,
      },
      noDataText: {
        textAlign: 'center',
        color: theme.tabIconDefault,
        fontStyle: 'italic',
        padding: 20,
      },
      // Dashboard specific styles
      dashboardStats: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        marginBottom: 24,
      },
      statCard: {
        width: '31%',
        backgroundColor: theme.secondaryBackground,
        borderRadius: 12,
        padding: 16,
        ...Platform.select({
          ios: {
            shadowColor: theme.shadow,
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.15,
            shadowRadius: 8,
          },
          android: {
            elevation: 4,
          },
        }),
      },
      statIcon: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: `${theme.tint}15`,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 8,
        alignSelf: 'center',
      },
      statValue: {
        fontSize: 24,
        fontWeight: 'bold',
        color: theme.text,
        textAlign: 'center',
        marginBottom: 4,
      },
      statLabel: {
        fontSize: 12,
        color: theme.tabIconDefault,
        textAlign: 'center',
      },
      chartSection: {
        marginBottom: 24,
        padding: 16,
        borderRadius: 16,
        backgroundColor: theme.secondaryBackground,
        ...Platform.select({
          ios: {
            shadowColor: theme.shadow,
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.15,
            shadowRadius: 8,
          },
          android: {
            elevation: 4,
          },
        }),
      },
      lowStockSection: {
        marginBottom: 24,
        borderRadius: 16,
        backgroundColor: theme.secondaryBackground,
        overflow: 'hidden',
        ...Platform.select({
          ios: {
            shadowColor: theme.shadow,
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.15,
            shadowRadius: 8,
          },
          android: {
            elevation: 4,
          },
        }),
      },
      lowStockHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: theme.borderColor,
      },
      lowStockTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: theme.text,
        flex: 1,
      },
      lowStockItem: {
        flexDirection: 'row',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: theme.borderColor,
      },
      lowStockInfo: {
        flex: 1,
      },
      lowStockName: {
        fontSize: 16,
        fontWeight: '500',
        color: theme.text,
        marginBottom: 4,
      },
      lowStockCategory: {
        fontSize: 14,
        color: theme.tabIconDefault,
      },
      stockCount: {
        fontSize: 16,
        fontWeight: '600',
        color: theme.error,
      },
      stockThreshold: {
        fontSize: 12,
        color: theme.tabIconDefault,
        marginTop: 4,
      },
      smallModalContainer: {
        width: width * 0.8,
        backgroundColor: theme.background,
        borderRadius: 12,
        padding: 16,
        ...Platform.select({
          ios: {
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.25,
            shadowRadius: 10,
          },
          android: {
            elevation: 5,
          },
        }),
      },
      smallModalTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: theme.text,
        marginBottom: 16,
        textAlign: 'center',
      },
      smallModalInput: {
        borderWidth: 1,
        borderColor: theme.borderColor,
        borderRadius: 8,
        padding: 12,
        fontSize: 16,
        color: theme.text,
        backgroundColor: isDarkMode ? '#2C2C2C' : theme.background,
        marginBottom: 16,
      },
      smallModalButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 12,
      },
      smallModalCancelButton: {
        flex: 1,
        backgroundColor: theme.borderColor,
        padding: 12,
        borderRadius: 8,
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
      smallModalSaveButton: {
        flex: 1,
        backgroundColor: theme.tint,
        padding: 12,
        borderRadius: 8,
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
      smallModalCancelText: {
        color: theme.text,
        fontSize: 16,
        fontWeight: '600',
      },
      smallModalSaveText: {
        color: theme.background,
        fontSize: 16,
        fontWeight: '600',
      },
      // Onboarding styles
      onboardingContainer: {
        flex: 1,
        backgroundColor: theme.background,
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 60,
        paddingHorizontal: 24,
      },
      onboardingCenterContent: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
      },
      onboardingLogo: {
        width: 120,
        height: 120,
        marginBottom: 32,
        resizeMode: 'contain',
      },
      onboardingTitle: {
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 16,
        color: theme.text,
        textAlign: 'center',
      },
      onboardingDescription: {
        fontSize: 16,
        color: theme.tabIconDefault,
        textAlign: 'center',
        marginBottom: 24,
        paddingHorizontal: 8,
      },
      onboardingButton: {
        width: '100%',
        backgroundColor: theme.tint,
        paddingVertical: 18,
        borderRadius: 12,
        alignItems: 'center',
        marginBottom: 16,
      },
      onboardingButtonText: {
        color: theme.background,
        fontSize: 18,
        fontWeight: 'bold',
      },
    }),

    colors: {
      tint: theme.tint,
      error: theme.error,
      text: theme.text,
      background: theme.background,
      tabIconDefault: theme.tabIconDefault
    },
    tabScreenOptions: {
      tabBarActiveTintColor: theme.tint,
      headerShown: true as const,
      headerStyle: {
        backgroundColor: 'transparent',
      },
      tabBarStyle: {
        backgroundColor: theme.tabColor,
        borderTopColor: theme.borderColor,
      },
      tabBarLabelStyle: {
        fontSize: 12,
        fontWeight: '500',
      },
      tabBarInactiveTintColor: theme.tabIconDefault,
    } satisfies Partial<BottomTabNavigationOptions>,
  };
};
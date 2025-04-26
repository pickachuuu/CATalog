import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  SafeAreaView,
  Modal,
  TextInput,
  TouchableOpacity,
  StatusBar,
  Dimensions,
  Animated,
  Easing,
  Platform,
} from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import { Card, Menu, Divider, IconButton, Searchbar, FAB } from 'react-native-paper';
import * as ImagePicker from 'expo-image-picker';
import { Product, Category } from '@/types/types';
import { addProduct, getProducts, getCategories, updateProduct, deleteProduct } from '@/services/storage';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

export default function ProductsScreen() {
  const [visibleMenu, setVisibleMenu] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isAddModalVisible, setIsAddModalVisible] = useState<boolean>(false);
  const [isOptionsModalVisible, setIsOptionsModalVisible] = useState<boolean>(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState<boolean>(false);
  const [isDeleteConfirmVisible, setIsDeleteConfirmVisible] = useState<boolean>(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [newProduct, setNewProduct] = useState<Omit<Product, 'id'>>({
    name: '',
    quantity: 0,
    category: '',
    image: '',
    lowStockThreshold: 10,
  });
  const [editProduct, setEditProduct] = useState<Product | null>(null);
  
  // Animation values
  const [modalAnimation] = useState(new Animated.Value(0));
  const [deleteModalAnimation] = useState(new Animated.Value(0));
  const [optionsModalAnimation] = useState(new Animated.Value(0));

  useEffect(() => {
    // Load products and categories from local storage on component mount
    const loadData = async () => {
      const products = await getProducts();
      const categories = await getCategories();
      setFilteredProducts(products);
      setCategories(categories);
    };
    loadData();
  }, []);

  // Animation functions
  const animateModal = (visible: boolean, animationValue: Animated.Value) => {
    Animated.timing(animationValue, {
      toValue: visible ? 1 : 0,
      duration: 300,
      easing: Easing.bezier(0.2, 0.65, 0.4, 0.9),
      useNativeDriver: true,
    }).start();
  };

  useEffect(() => {
    animateModal(isAddModalVisible || isEditModalVisible, modalAnimation);
  }, [isAddModalVisible, isEditModalVisible]);

  useEffect(() => {
    animateModal(isDeleteConfirmVisible, deleteModalAnimation);
  }, [isDeleteConfirmVisible]);

  useEffect(() => {
    animateModal(isOptionsModalVisible, optionsModalAnimation);
  }, [isOptionsModalVisible]);

  const handleAddProduct = () => {
    setIsAddModalVisible(true);
  };

  const handleSaveProduct = async () => {
    if (newProduct.name && newProduct.quantity > 0) {
      try {
        const savedProduct = await addProduct(newProduct);
        setFilteredProducts((prev) => [...prev, savedProduct]);
        setNewProduct({ name: '', quantity: 0, category: '', image: '', lowStockThreshold: 10 });
        setIsAddModalVisible(false);
      } catch (error) {
        console.error('Error saving product:', error);
      }
    } else {
      alert('Please fill out all required fields.');
    }
  };

  const handleUpdateProduct = async () => {
    if (editProduct && editProduct.name && editProduct.quantity > 0) {
      try {
        const updatedProduct = await updateProduct(editProduct);
        setFilteredProducts((prev) => 
          prev.map(p => p.id === updatedProduct.id ? updatedProduct : p)
        );
        setEditProduct(null);
        setIsEditModalVisible(false);
      } catch (error) {
        console.error('Error updating product:', error);
      }
    } else {
      alert('Please fill out all required fields.');
    }
  };

  const handleDeleteProduct = async () => {
    if (selectedProduct) {
      try {
        await deleteProduct(selectedProduct.id);
        setFilteredProducts((prev) => prev.filter(p => p.id !== selectedProduct.id));
        setSelectedProduct(null);
        setIsDeleteConfirmVisible(false);
        setIsOptionsModalVisible(false);
      } catch (error) {
        console.error('Error deleting product:', error);
      }
    }
  };

  const handlePickImage = async (isEdit = false) => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      alert('Permission to access gallery is required!');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      if (isEdit && editProduct) {
        setEditProduct({ ...editProduct, image: result.assets[0].uri });
      } else {
        setNewProduct({ ...newProduct, image: result.assets[0].uri });
      }
    }
  };

  const openOptionsModal = (product: Product) => {
    setSelectedProduct(product);
    setIsOptionsModalVisible(true);
    setVisibleMenu(null);
  };

  const handleEditOption = () => {
    if (selectedProduct) {
      setEditProduct(selectedProduct);
      setIsOptionsModalVisible(false);
      setIsEditModalVisible(true);
    }
  };

  const handleDeleteOption = () => {
    setIsOptionsModalVisible(false);
    setIsDeleteConfirmVisible(true);
  };

  const getStockStatusColor = (quantity: number, threshold: number = 10) => {
    if (quantity <= 0) return '#FF5252'; // Out of stock - Red
    if (quantity < threshold) return '#FFC107'; // Low stock - Yellow/Amber
    return '#4CAF50'; // In stock - Green
  };

  const renderProductItem = ({ item }: { item: Product }) => (
    <Card style={styles.productCard}>
      <View style={styles.productContainer}>
        <View style={styles.imageContainer}>
          <Image 
            source={{ uri: item.image || 'https://via.placeholder.com/100' }} 
            style={styles.productImage} 
            resizeMode="cover"
          />
          <View style={[
            styles.stockIndicator, 
            { backgroundColor: getStockStatusColor(item.quantity, item.lowStockThreshold) }
          ]} />
        </View>
        <View style={styles.productInfo}>
          <Text style={styles.productName}>{item.name}</Text>
          <View style={styles.quantityContainer}>
            <Text style={styles.quantityLabel}>Qty:</Text>
            <Text style={[
              styles.productQuantity, 
              { color: getStockStatusColor(item.quantity, item.lowStockThreshold) }
            ]}>
              {item.quantity}
            </Text>
          </View>
          {item.category && (
            <View style={styles.categoryBadge}>
              <Text style={styles.categoryText}>{item.category}</Text>
            </View>
          )}
        </View>
        <IconButton
          icon="dots-vertical"
          size={24}
          onPress={() => openOptionsModal(item)}
          style={styles.menuButton}
        />
      </View>
    </Card>
  );

  // Modal transform animations
  const modalTranslateY = modalAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [height, 0],
  });

  const optionsScale = optionsModalAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [0.8, 1],
  });

  const optionsOpacity = optionsModalAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });

  const deleteScale = deleteModalAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [0.8, 1],
  });

  const deleteOpacity = deleteModalAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f8f9fa" />
      <Searchbar
        placeholder="Search products or categories"
        onChangeText={setSearchQuery}
        value={searchQuery}
        style={styles.searchBar}
        iconColor="#6200EE"
        placeholderTextColor="#9E9E9E"
        inputStyle={styles.searchInput}
      />

      <FlatList
        data={filteredProducts}
        keyExtractor={(item) => item.id}
        renderItem={renderProductItem}
        contentContainerStyle={styles.productList}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Image 
              source={{ uri: 'https://via.placeholder.com/150?text=Empty' }} 
              style={styles.emptyImage} 
            />
            <Text style={styles.emptyText}>No products found</Text>
            <Text style={styles.emptySubtext}>Try a different search term or add a new product</Text>
          </View>
        }
      />

      <FAB
        style={styles.fab}
        icon="plus"
        onPress={handleAddProduct}
        color="#fff"
        label="Add Product"
        uppercase={false}
      />

      {/* Options Modal */}
      <Modal visible={isOptionsModalVisible} animationType="none" transparent={true}>
        <View style={styles.modalOverlay}>
          <Animated.View 
            style={[
              styles.optionsModalContainer,
              {
                opacity: optionsOpacity,
                transform: [{ scale: optionsScale }]
              }
            ]}
          >
            <View style={styles.optionsModalContent}>
              <View style={styles.optionsModalHeader}>
                <Text style={styles.optionsModalTitle}>Product Options</Text>
              </View>
              
              <TouchableOpacity 
                style={styles.optionButton} 
                onPress={handleEditOption}
                activeOpacity={0.7}
              >
                <View style={[styles.optionIconContainer, { backgroundColor: 'rgba(98, 0, 238, 0.1)' }]}>
                  <MaterialCommunityIcons name="pencil-outline" size={22} color="#6200EE" />
                </View>
                <Text style={styles.optionText}>Edit Product</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.optionButton} 
                onPress={handleDeleteOption}
                activeOpacity={0.7}
              >
                <View style={[styles.optionIconContainer, { backgroundColor: 'rgba(255, 82, 82, 0.1)' }]}>
                  <MaterialCommunityIcons name="delete-outline" size={22} color="#FF5252" />
                </View>
                <Text style={[styles.optionText, { color: '#FF5252' }]}>Delete Product</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.cancelOptionButton} 
                onPress={() => setIsOptionsModalVisible(false)}
                activeOpacity={0.7}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </View>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal visible={isDeleteConfirmVisible} animationType="none" transparent={true}>
        <View style={styles.modalOverlay}>
          <Animated.View 
            style={[
              styles.confirmModalContainer,
              {
                opacity: deleteOpacity,
                transform: [{ scale: deleteScale }]
              }
            ]}
          >
            <View style={styles.confirmModalContent}>
              <View style={styles.deleteIconContainer}>
                <MaterialCommunityIcons name="alert-circle-outline" size={40} color="#FF5252" />
              </View>
              
              <Text style={styles.confirmModalTitle}>Delete Product</Text>
              <Text style={styles.confirmModalText}>
                Are you sure you want to delete "{selectedProduct?.name}"? This action cannot be undone.
              </Text>
              
              <View style={styles.confirmModalButtons}>
                <TouchableOpacity 
                  style={[styles.button, styles.cancelButton]} 
                  onPress={() => setIsDeleteConfirmVisible(false)}
                  activeOpacity={0.7}
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[styles.button, styles.deleteButton]} 
                  onPress={handleDeleteProduct}
                  activeOpacity={0.7}
                >
                  <Text style={styles.deleteButtonText}>Delete</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Animated.View>
        </View>
      </Modal>

      {/* Modal for Adding/Editing Product */}
      <Modal 
        visible={isAddModalVisible || isEditModalVisible} 
        animationType="none" 
        transparent={true}
      >
        <View style={styles.modalOverlay}>
          <Animated.View 
            style={[
              styles.modalContainer,
              {
                transform: [{ translateY: modalTranslateY }]
              }
            ]}
          >
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>
                  {isAddModalVisible ? 'Add New Product' : 'Edit Product'}
                </Text>
                <IconButton
                  icon="close"
                  size={24}
                  onPress={() => isAddModalVisible ? setIsAddModalVisible(false) : setIsEditModalVisible(false)}
                  style={styles.closeButton}
                />
              </View>

              {/* Form content for Add or Edit */}
              <View style={styles.formContainer}>
                <View style={styles.formGroup}>
                  <Text style={styles.label}>Product Name</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Enter product name"
                    value={isAddModalVisible ? newProduct.name : editProduct?.name || ''}
                    onChangeText={(text) => 
                      isAddModalVisible 
                        ? setNewProduct({ ...newProduct, name: text })
                        : setEditProduct({ ...editProduct!, name: text })
                    }
                    placeholderTextColor="#9E9E9E"
                  />
                </View>

                <View style={styles.formGroup}>
                  <Text style={styles.label}>Category (Optional)</Text>
                  <View style={styles.pickerContainer}>
                    <RNPickerSelect
                      onValueChange={(value) => 
                        isAddModalVisible 
                          ? setNewProduct({ ...newProduct, category: value })
                          : setEditProduct({ ...editProduct!, category: value })
                      }
                      value={isAddModalVisible ? newProduct.category : editProduct?.category || ''}
                      items={categories.map((category) => ({
                        label: category.name,
                        value: category.name,
                      }))}
                      placeholder={{
                        label: categories.length > 0 ? 'Select a category' : 'No categories available',
                        value: null,
                      }}
                      style={{
                        inputIOS: styles.pickerInput,
                        inputAndroid: styles.pickerInput,
                      }}
                    />
                  </View>
                </View>

                <View style={styles.formRow}>
                  <View style={[styles.formGroup, { flex: 1, marginRight: 8 }]}>
                    <Text style={styles.label}>Quantity</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="0"
                      keyboardType="numeric"
                      value={isAddModalVisible 
                        ? newProduct.quantity.toString() 
                        : editProduct?.quantity.toString() || '0'
                      }
                      onChangeText={(text) => 
                        isAddModalVisible 
                          ? setNewProduct({ ...newProduct, quantity: parseInt(text) || 0 })
                          : setEditProduct({ ...editProduct!, quantity: parseInt(text) || 0 })
                      }
                      placeholderTextColor="#9E9E9E"
                    />
                  </View>
                  <View style={[styles.formGroup, { flex: 1, marginLeft: 8 }]}>
                    <Text style={styles.label}>Low Stock Alert</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="10"
                      keyboardType="numeric"
                      value={isAddModalVisible 
                        ? newProduct.lowStockThreshold?.toString() || '' 
                        : editProduct?.lowStockThreshold?.toString() || ''
                      }
                      onChangeText={(text) =>
                        isAddModalVisible
                          ? setNewProduct({ ...newProduct, lowStockThreshold: parseInt(text) || 10 })
                          : setEditProduct({ ...editProduct!, lowStockThreshold: parseInt(text) || 10 })
                      }
                      placeholderTextColor="#9E9E9E"
                    />
                  </View>
                </View>

                <View style={styles.formGroup}>
                  <Text style={styles.label}>Product Image</Text>
                  <TouchableOpacity 
                    onPress={() => handlePickImage(!isAddModalVisible)} 
                    style={styles.imagePicker}
                    activeOpacity={0.8}
                  >
                    {(isAddModalVisible ? newProduct.image : editProduct?.image) ? (
                      <Image 
                        source={{ uri: isAddModalVisible ? newProduct.image : editProduct?.image }} 
                        style={styles.previewImage} 
                      />
                    ) : (
                      <View style={styles.imagePickerPlaceholder}>
                        <MaterialCommunityIcons name="camera-outline" size={32} color="#6200EE" />
                        <Text style={styles.imagePickerText}>Select Image</Text>
                      </View>
                    )}
                  </TouchableOpacity>
                </View>

                <View style={styles.modalButtons}>
                  <TouchableOpacity 
                    style={[styles.button, styles.cancelButton]} 
                    onPress={() => isAddModalVisible ? setIsAddModalVisible(false) : setIsEditModalVisible(false)}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.cancelButtonText}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={[styles.button, styles.saveButton]} 
                    onPress={isAddModalVisible ? handleSaveProduct : handleUpdateProduct}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.saveButtonText}>
                      {isAddModalVisible ? 'Save Product' : 'Update Product'}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Animated.View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#f8f9fa' 
  },
  header: { 
    padding: 20, 
    backgroundColor: '#fff', 
    borderBottomWidth: 1, 
    borderBottomColor: '#f0f0f0',
    elevation: 2,
  },
  title: { 
    fontSize: 28, 
    fontWeight: 'bold', 
    color: '#212121',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#757575',
  },
  searchBar: { 
    margin: 16, 
    elevation: 2, 
    backgroundColor: '#fff', 
    borderRadius: 12,
    height: 50,
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
  },
  emptyContainer: { 
    alignItems: 'center', 
    justifyContent: 'center', 
    padding: 40,
    marginTop: 40,
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
    color: '#6200EE', 
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
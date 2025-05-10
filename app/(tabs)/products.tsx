import React, { useState, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  SafeAreaView,
  Modal,
  TextInput,
  TouchableOpacity,
  StatusBar,
  Dimensions,
  useColorScheme,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import { Card, IconButton, Searchbar, FAB } from 'react-native-paper';
import * as ImagePicker from 'expo-image-picker';
import { Product, Category } from '@/types/types';
import { addProduct, getProducts, getCategories, updateProduct, deleteProduct } from '@/services/storage';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { createCommonStyles } from '@/style/stylesheet';
import { useData } from '../../context/DataContext';

const { width, height } = Dimensions.get('window');

export default function ProductsScreen() {
  const { refreshTrigger, refreshData } = useData();
  
  // Get the device color scheme
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';
  
  // Create styles based on the current theme
  const commonStyles = useMemo(() => createCommonStyles(isDarkMode), [isDarkMode]);
  const styles = useMemo(() => createCommonStyles(isDarkMode), [isDarkMode]);
  
  const [visibleMenu, setVisibleMenu] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [products, setProducts] = useState<Product[]>([]);
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
  
  useEffect(() => {
    // Load products and categories from local storage on component mount
    const loadData = async () => {
      const loadedProducts = await getProducts();
      const loadedCategories = await getCategories();
      setProducts(loadedProducts);
      setCategories(loadedCategories);
    };
    loadData();
  }, []);

  useEffect(() => {
    const reloadData = async () => {
      const loadedProducts = await getProducts();
      const loadedCategories = await getCategories();
      setProducts(loadedProducts);
      setCategories(loadedCategories);
    };
    reloadData();
  }, [refreshTrigger]);

  // Filter products based on search query
  const filteredProducts = useMemo(() => {
    if (!searchQuery.trim()) {
      return products;
    }
    
    const normalizedQuery = searchQuery.toLowerCase().trim();
    
    return products.filter(product => {
      // Search in product name
      if (product.name.toLowerCase().includes(normalizedQuery)) {
        return true;
      }
      
      // Search in category
      if (product.category && product.category.toLowerCase().includes(normalizedQuery)) {
        return true;
      }
      
      // Search in quantity (as string)
      if (product.quantity.toString().includes(normalizedQuery)) {
        return true;
      }
      
      return false;
    });
  }, [products, searchQuery]);

  const handleSearch = (text: string) => {
    setSearchQuery(text);
  };

  const clearSearch = () => {
    setSearchQuery('');
  };

  const handleAddProduct = () => {
    setIsAddModalVisible(true);
  };

  const handleSaveProduct = async () => {
    try {
      await addProduct(newProduct);
      await refreshData(); // Trigger refresh
      setIsAddModalVisible(false);
    } catch (error) {
      console.error('Error saving product:', error);
    }
  };

  const handleUpdateProduct = async () => {
    try {
      await updateProduct(editProduct!);
      await refreshData(); // Trigger refresh
      setIsEditModalVisible(false);
    } catch (error) {
      console.error('Error updating product:', error);
    }
  };

  const handleDeleteProduct = async () => {
    if (selectedProduct) {
      try {
        await deleteProduct(selectedProduct.id);
        setProducts((prev) => prev.filter(p => p.id !== selectedProduct.id));
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
    if (quantity <= 0) return commonStyles.stockStatusOut.backgroundColor;
    if (quantity < threshold) return commonStyles.stockStatusLow.backgroundColor;
    return commonStyles.stockStatusIn.backgroundColor;
  };

  const renderProductItem = ({ item }: { item: Product }) => {
    const category = categories.find(cat => cat.id === item.category);
    return (
      <Card style={commonStyles.productCard}>
        <View style={commonStyles.productContainer}>
          <View style={commonStyles.imageContainer}>
            <Image 
              source={{ uri: item.image || 'https://via.placeholder.com/100' }} 
              style={commonStyles.productImage} 
              resizeMode="cover"
            />
            <View style={[
              commonStyles.stockIndicator, 
              { backgroundColor: getStockStatusColor(item.quantity, item.lowStockThreshold) }
            ]} />
          </View>
          <View style={commonStyles.productInfo}>
            <Text style={commonStyles.productName}>{item.name}</Text>
            <View style={commonStyles.quantityContainer}>
              <Text style={commonStyles.quantityLabel}>Qty:</Text>
              <Text style={[
                commonStyles.productQuantity, 
                { color: getStockStatusColor(item.quantity, item.lowStockThreshold) }
              ]}>
                {item.quantity}
              </Text>
            </View>
            {category && (
              <View style={commonStyles.categoryBadge}>
                <Text style={commonStyles.categoryBadgeText}>{category.name}</Text>
              </View>
            )}
          </View>
          <IconButton
            icon="dots-vertical"
            size={24}
            onPress={() => openOptionsModal(item)}
            style={commonStyles.menuButton}
          />
        </View>
      </Card>
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: styles.colors.background }}>
      <SafeAreaView style={[commonStyles.container]}>
        <View style={[commonStyles.contentContainer,]}>
          <View style={commonStyles.searchBarContainer}>
            <Searchbar
              placeholder="Search products or categories"
              onChangeText={handleSearch}
              onClearIconPress={clearSearch}
              value={searchQuery}
              style={commonStyles.searchBar}
              iconColor={styles.colors.tint}
              placeholderTextColor={styles.colors.tabIconDefault}
              inputStyle={commonStyles.searchInput}
            />
          </View>
          <View style={styles.horizontalRule} />
          <FlatList
            data={filteredProducts}
            keyExtractor={(item) => item.id}
            renderItem={renderProductItem}
            contentContainerStyle={commonStyles.productList}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={
              <View style={commonStyles.emptyContainer}>
                <Image 
                  source={{ uri: 'https://via.placeholder.com/150?text=Empty' }} 
                  style={commonStyles.emptyImage} 
                />
                <Text style={commonStyles.emptyText}>
                  {searchQuery.trim() ? 'No matching products found' : 'No products found'}
                </Text>
                <Text style={commonStyles.emptySubtext}>
                  {searchQuery.trim() 
                    ? 'Try a different search term' 
                    : 'Add a new product to get started'}
                </Text>
              </View>
            }
          />

          <FAB
            style={commonStyles.fab}
            icon="plus"
            onPress={handleAddProduct}
            color={styles.colors.background}
            label="Add Product"
            uppercase={false}
          />
        </View>

        {/* Options Modal - No animations */}
        <Modal visible={isOptionsModalVisible} transparent={true}>
          <View style={commonStyles.modalOverlay}>
            <View style={commonStyles.optionsModalContainer}>
              <View style={commonStyles.optionsModalContent}>
                <View style={commonStyles.optionsModalHeader}>
                  <Text style={commonStyles.optionsModalTitle}>
                    {selectedProduct?.name}
                  </Text>
                </View>

                <TouchableOpacity 
                  style={[
                    commonStyles.optionButton,
                    { backgroundColor: `${styles.colors.tint}05` }
                  ]} 
                  onPress={handleEditOption}
                  activeOpacity={0.7}
                >
                  <View style={commonStyles.optionIconContainerInline}>
                    <MaterialCommunityIcons 
                      name="pencil-outline" 
                      size={20} 
                      color={styles.colors.tint} 
                    />
                  </View>
                  <Text style={commonStyles.optionText}>Edit Product</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={[
                    commonStyles.optionButton,
                    { backgroundColor: `${styles.colors.error}05` }
                  ]} 
                  onPress={handleDeleteOption}
                  activeOpacity={0.7}
                >
                  <View style={commonStyles.deleteIconContainerInline}>
                    <MaterialCommunityIcons 
                      name="delete-outline" 
                      size={20} 
                      color={styles.colors.error} 
                    />
                  </View>
                  <Text style={commonStyles.deleteOptionText}>Delete</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={commonStyles.cancelOptionButton}
                  onPress={() => setIsOptionsModalVisible(false)}
                  activeOpacity={0.7}
                >
                  <Text style={commonStyles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        {/* Delete Confirmation Modal - No animations */}
        <Modal visible={isDeleteConfirmVisible} transparent={true}>
          <View style={commonStyles.modalOverlay}>
            <View style={commonStyles.confirmModalContainer || commonStyles.modalContainer}>
              <View style={commonStyles.confirmModalContent || commonStyles.modalContent}>
                <View style={commonStyles.deleteIconContainer || { alignItems: 'center', marginVertical: 16 }}>
                  <MaterialCommunityIcons name="alert-circle-outline" size={40} color="#FF5252" />
                </View>
                
                <Text style={commonStyles.confirmModalTitle || { fontSize: 20, fontWeight: 'bold', textAlign: 'center', marginBottom: 8 }}>Delete Product</Text>
                <Text style={commonStyles.confirmModalText || { textAlign: 'center', marginBottom: 24, paddingHorizontal: 16 }}>
                  Are you sure you want to delete "{selectedProduct?.name}"? This action cannot be undone.
                </Text>
                
                <View style={commonStyles.confirmModalButtons || commonStyles.modalButtons}>
                  <TouchableOpacity 
                    style={[commonStyles.button, commonStyles.cancelButton]} 
                    onPress={() => setIsDeleteConfirmVisible(false)}
                    activeOpacity={0.7}
                  >
                    <Text style={commonStyles.cancelButtonText}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={[commonStyles.button, commonStyles.deleteButton]} 
                    onPress={handleDeleteProduct}
                    activeOpacity={0.7}
                  >
                    <Text style={commonStyles.deleteButtonText}>Delete</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        </Modal>

        {/* Modal for Adding/Editing Product - No animations */}
        <Modal 
          visible={isAddModalVisible || isEditModalVisible} 
          transparent={true}
        >
          <KeyboardAvoidingView 
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={{ flex: 1 }}
          >
            <View style={commonStyles.modalOverlay}>
              <View style={commonStyles.modalContainer}>
                <View style={commonStyles.modalContent}>
                  <View style={commonStyles.modalHeader}>
                    <Text style={commonStyles.modalTitle}>
                      {isAddModalVisible ? 'Add New Product' : 'Edit Product'}
                    </Text>
                    <IconButton
                      icon="close"
                      size={24}
                      onPress={() => isAddModalVisible ? setIsAddModalVisible(false) : setIsEditModalVisible(false)}
                      style={commonStyles.closeButton}
                    />
                  </View>

                  {/* Wrap form content in ScrollView */}
                  <ScrollView style={commonStyles.formContainer}>
                    <View style={commonStyles.formGroup}>
                      <Text style={commonStyles.label}>Product Name</Text>
                      <TextInput
                        style={commonStyles.input}
                        placeholder="Enter product name"
                        value={isAddModalVisible ? newProduct.name : editProduct?.name || ''}
                        onChangeText={(text) => 
                          isAddModalVisible 
                            ? setNewProduct({ ...newProduct, name: text })
                            : setEditProduct({ ...editProduct!, name: text })
                        }
                        placeholderTextColor={styles.colors.tabIconDefault}
                      />
                    </View>

                    <View style={commonStyles.formGroup}>
                      <Text style={commonStyles.label}>Category (Optional)</Text>
                      <View style={commonStyles.pickerContainer}>
                        <RNPickerSelect
                          onValueChange={(value) => 
                            isAddModalVisible 
                              ? setNewProduct({ ...newProduct, category: value })
                              : setEditProduct({ ...editProduct!, category: value })
                          }
                          value={isAddModalVisible ? newProduct.category : editProduct?.category || ''}
                          items={categories.map((category) => ({
                            label: category.name,
                            value: category.id,
                          }))}
                          placeholder={{
                            label: categories.length > 0 ? 'Select a category' : 'No categories available',
                            value: null,
                          }}
                          style={{
                            inputIOS: commonStyles.pickerInput,
                            inputAndroid: commonStyles.pickerInput,
                          }}
                        />
                      </View>
                    </View>

                    <View style={commonStyles.formRow}>
                      <View style={[commonStyles.formGroup, commonStyles.formGroupWithMargin]}>
                        <Text style={commonStyles.label}>Quantity</Text>
                        <TextInput
                          style={commonStyles.input}
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
                          placeholderTextColor={styles.colors.tabIconDefault}
                        />
                      </View>
                      <View style={[commonStyles.formGroup, commonStyles.formGroupWithMarginLeft]}>
                        <Text style={commonStyles.label}>Low Stock Alert</Text>
                        <TextInput
                          style={commonStyles.input}
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
                          placeholderTextColor={styles.colors.tabIconDefault}
                        />
                      </View>
                    </View>

                    <View style={commonStyles.formGroup}>
                      <Text style={commonStyles.label}>Product Image</Text>
                      <TouchableOpacity 
                        onPress={() => handlePickImage(!isAddModalVisible)} 
                        style={commonStyles.imagePicker}
                        activeOpacity={0.8}
                      >
                        {(isAddModalVisible ? newProduct.image : editProduct?.image) ? (
                          <Image 
                            source={{ uri: isAddModalVisible ? newProduct.image : editProduct?.image }} 
                            style={commonStyles.previewImage} 
                          />
                        ) : (
                          <View style={commonStyles.imagePickerPlaceholder}>
                            <MaterialCommunityIcons name="camera-outline" size={32} color={styles.colors.tint} />
                            <Text style={commonStyles.imagePickerText}>Select Image</Text>
                          </View>
                        )}
                      </TouchableOpacity>
                    </View>
                  </ScrollView>

                  {/* Keep buttons outside ScrollView */}
                  <View style={[commonStyles.modalButtons, { padding: 16 }]}>
                    <TouchableOpacity 
                      style={[commonStyles.button, commonStyles.cancelButton]} 
                      onPress={() => isAddModalVisible ? setIsAddModalVisible(false) : setIsEditModalVisible(false)}
                      activeOpacity={0.7}
                    >
                      <Text style={commonStyles.cancelButtonText}>Cancel</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                      style={[commonStyles.button, commonStyles.saveButton]} 
                      onPress={isAddModalVisible ? handleSaveProduct : handleUpdateProduct}
                      activeOpacity={0.7}
                    >
                      <Text style={commonStyles.saveButtonText}>
                        {isAddModalVisible ? 'Save Product' : 'Update Product'}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </View>
          </KeyboardAvoidingView>
        </Modal>
      </SafeAreaView>
    </View>
  );
}
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
  Animated,
  Easing,
  Platform,
  ImageBackground,
} from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import { Card, Menu, Divider, IconButton, Searchbar, FAB } from 'react-native-paper';
import * as ImagePicker from 'expo-image-picker';
import { Product, Category } from '@/types/types';
import { addProduct, getProducts, getCategories, updateProduct, deleteProduct } from '@/services/storage';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { commonStyles } from './styles/common.styles';

const { width, height } = Dimensions.get('window');

export default function ProductsScreen() {
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
  
  // Animation values
  const [modalAnimation] = useState(new Animated.Value(0));
  const [deleteModalAnimation] = useState(new Animated.Value(0));
  const [optionsModalAnimation] = useState(new Animated.Value(0));

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
    if (newProduct.name && newProduct.quantity > 0) {
      try {
        const savedProduct = await addProduct(newProduct);
        setProducts((prev) => [...prev, savedProduct]);
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
        setProducts((prev) => 
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
    if (quantity <= 0) return '#FF5252'; // Out of stock - Red
    if (quantity < threshold) return '#FFC107'; // Low stock - Yellow/Amber
    return '#4CAF50'; // In stock - Green
  };

  const renderProductItem = ({ item }: { item: Product }) => (
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
          {item.category && (
            <View style={commonStyles.categoryBadge}>
              <Text style={commonStyles.categoryText}>{item.category}</Text>
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
    <ImageBackground 
      style={commonStyles.backgroundImage}
      resizeMode="cover"
    >
      <SafeAreaView style={commonStyles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />
        <View style={[commonStyles.contentContainer, { paddingTop: StatusBar.currentHeight || 0 }]}>
          <View style={commonStyles.searchBarContainer}>
            <Searchbar
              placeholder="Search products or categories"
              onChangeText={handleSearch}
              onClearIconPress={clearSearch}
              value={searchQuery}
              style={commonStyles.searchBar}
              iconColor="#2f95dc"
              placeholderTextColor="#9E9E9E"
              inputStyle={commonStyles.searchInput}
            />
          </View>

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
            color="#fff"
            label="Add Product"
            uppercase={false}
          />
        </View>

        {/* Options Modal */}
        <Modal visible={isOptionsModalVisible} animationType="none" transparent={true}>
          <View style={commonStyles.modalOverlay}>
            <Animated.View 
              style={[
                commonStyles.optionsModalContainer,
                {
                  opacity: optionsOpacity,
                  transform: [{ scale: optionsScale }]
                }
              ]}
            >
              <View style={commonStyles.optionsModalContent}>
                <View style={commonStyles.optionsModalHeader}>
                  <Text style={commonStyles.optionsModalTitle}>Product Options</Text>
                </View>
                
                <TouchableOpacity 
                  style={commonStyles.optionButton} 
                  onPress={handleEditOption}
                  activeOpacity={0.7}
                >
                  <View style={[commonStyles.optionIconContainer, { backgroundColor: 'rgba(47, 149, 220, 0.1)' }]}>
                    <MaterialCommunityIcons name="pencil-outline" size={22} color="#2f95dc" />
                  </View>
                  <Text style={commonStyles.optionText}>Edit Product</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={commonStyles.optionButton} 
                  onPress={handleDeleteOption}
                  activeOpacity={0.7}
                >
                  <View style={[commonStyles.optionIconContainer, { backgroundColor: 'rgba(255, 82, 82, 0.1)' }]}>
                    <MaterialCommunityIcons name="delete-outline" size={22} color="#FF5252" />
                  </View>
                  <Text style={[commonStyles.optionText, { color: '#FF5252' }]}>Delete Product</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={commonStyles.cancelOptionButton} 
                  onPress={() => setIsOptionsModalVisible(false)}
                  activeOpacity={0.7}
                >
                  <Text style={commonStyles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </Animated.View>
          </View>
        </Modal>

        {/* Delete Confirmation Modal */}
        <Modal visible={isDeleteConfirmVisible} animationType="none" transparent={true}>
          <View style={commonStyles.modalOverlay}>
            <Animated.View 
              style={[
                commonStyles.confirmModalContainer,
                {
                  opacity: deleteOpacity,
                  transform: [{ scale: deleteScale }]
                }
              ]}
            >
              <View style={commonStyles.confirmModalContent}>
                <View style={commonStyles.deleteIconContainer}>
                  <MaterialCommunityIcons name="alert-circle-outline" size={40} color="#FF5252" />
                </View>
                
                <Text style={commonStyles.confirmModalTitle}>Delete Product</Text>
                <Text style={commonStyles.confirmModalText}>
                  Are you sure you want to delete "{selectedProduct?.name}"? This action cannot be undone.
                </Text>
                
                <View style={commonStyles.confirmModalButtons}>
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
            </Animated.View>
          </View>
        </Modal>

        {/* Modal for Adding/Editing Product */}
        <Modal 
          visible={isAddModalVisible || isEditModalVisible} 
          animationType="none" 
          transparent={true}
        >
          <View style={commonStyles.modalOverlay}>
            <Animated.View 
              style={[
                commonStyles.modalContainer,
                {
                  transform: [{ translateY: modalTranslateY }]
                }
              ]}
            >
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

                {/* Form content for Add or Edit */}
                <View style={commonStyles.formContainer}>
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
                      placeholderTextColor="#9E9E9E"
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
                          value: category.name,
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
                    <View style={[commonStyles.formGroup, { flex: 1, marginRight: 8 }]}>
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
                        placeholderTextColor="#9E9E9E"
                      />
                    </View>
                    <View style={[commonStyles.formGroup, { flex: 1, marginLeft: 8 }]}>
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
                        placeholderTextColor="#9E9E9E"
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
                          <MaterialCommunityIcons name="camera-outline" size={32} color="#2f95dc" />
                          <Text style={commonStyles.imagePickerText}>Select Image</Text>
                        </View>
                      )}
                    </TouchableOpacity>
                  </View>

                  <View style={commonStyles.modalButtons}>
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
            </Animated.View>
          </View>
        </Modal>
      </SafeAreaView>
    </ImageBackground>
  );
}
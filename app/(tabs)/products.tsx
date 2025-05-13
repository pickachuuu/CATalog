import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  SafeAreaView,
  Dimensions,
  useColorScheme,
} from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import { Card, IconButton, Searchbar, FAB } from 'react-native-paper';
import * as ImagePicker from 'expo-image-picker';
import { Product } from '@/types/types';
import { createCommonStyles } from '@/style/stylesheet';
import { useData } from '../../context/DataContext';
import { ProductModals } from '@/components/modals/ProductModals';

const { width, height } = Dimensions.get('window');

export default function ProductsScreen() {
  const {
    products,
    categories,
    addProduct,
    updateProduct,
    deleteProduct,
    refreshData
  } = useData();
  
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';
  const commonStyles = useMemo(() => createCommonStyles(isDarkMode), [isDarkMode]);
  const styles = useMemo(() => createCommonStyles(isDarkMode), [isDarkMode]);
  
  const [visibleMenu, setVisibleMenu] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
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

  // Filter products based on search query
  const filteredProducts = useMemo(() => {
    if (!searchQuery.trim()) {
      return products;
    }
  
    const normalizedQuery = searchQuery.toLowerCase().trim();
  
    return products.filter(product => {
      const category = categories.find(cat => cat.id === product.category);
      const categoryName = category?.name.toLowerCase() ?? '';
  
      return (
        product.name.toLowerCase().includes(normalizedQuery) ||
        categoryName.includes(normalizedQuery) ||
        product.quantity.toString().includes(normalizedQuery)
      );
    });
  }, [products, categories, searchQuery]);
  

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
      setIsAddModalVisible(false);
    } catch (error) {
      console.error('Error saving product:', error);
    }
  };

  const handleUpdateProduct = async () => {
    try {
      await updateProduct(editProduct!);
      setIsEditModalVisible(false);
    } catch (error) {
      console.error('Error updating product:', error);
    }
  };

  const handleDeleteProduct = async () => {
    if (selectedProduct) {
      try {
        await deleteProduct(selectedProduct.id);
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
        <View style={[commonStyles.contentContainer]}>
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
                  source={require('../../assets/images/empty.png')} 
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

          <ProductModals
            isOptionsModalVisible={isOptionsModalVisible}
            isDeleteConfirmVisible={isDeleteConfirmVisible}
            isAddModalVisible={isAddModalVisible}
            isEditModalVisible={isEditModalVisible}
            selectedProduct={selectedProduct}
            editProduct={editProduct}
            newProduct={newProduct}
            categories={categories}
            styles={styles}
            onCloseOptionsModal={() => setIsOptionsModalVisible(false)}
            onCloseDeleteModal={() => setIsDeleteConfirmVisible(false)}
            onCloseAddEditModal={() => {
              setIsAddModalVisible(false);
              setIsEditModalVisible(false);
            }}
            onEdit={handleEditOption}
            onDelete={handleDeleteOption}
            onDeleteConfirm={handleDeleteProduct}
            onSave={handleSaveProduct}
            onUpdate={handleUpdateProduct}
            onPickImage={handlePickImage}
            setNewProduct={setNewProduct}
            setEditProduct={setEditProduct}
          />
        </View>
      </SafeAreaView>
    </View>
  );
}
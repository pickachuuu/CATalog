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
} from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import { Card, Menu, Divider, IconButton, Searchbar, FAB } from 'react-native-paper';
import * as ImagePicker from 'expo-image-picker';
import { Product, Category } from '@/types/types';
import { addProduct, getProducts, getCategories } from '@/services/storage';

const { width } = Dimensions.get('window');

export default function ProductsScreen() {
  const [visibleMenu, setVisibleMenu] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [newProduct, setNewProduct] = useState<Omit<Product, 'id'>>({
    name: '',
    quantity: 0,
    category: '',
    image: '',
    lowStockThreshold: 10,
  });

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

  const handleAddProduct = () => {
    setIsModalVisible(true);
  };

  const handleSaveProduct = async () => {
    if (newProduct.name && newProduct.quantity > 0) {
      try {
        const savedProduct = await addProduct(newProduct);
        setFilteredProducts((prev) => [...prev, savedProduct]);
        setNewProduct({ name: '', quantity: 0, category: '', image: '', lowStockThreshold: 10 });
        setIsModalVisible(false);
      } catch (error) {
        console.error('Error saving product:', error);
      }
    } else {
      alert('Please fill out all required fields.');
    }
  };

  const handlePickImage = async () => {
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
      setNewProduct({ ...newProduct, image: result.assets[0].uri });
    }
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
        <Menu
          visible={visibleMenu === item.id}
          onDismiss={() => setVisibleMenu(null)}
          anchor={
            <IconButton
              icon="dots-vertical"
              size={24}
              onPress={() => setVisibleMenu(item.id)}
              style={styles.menuButton}
            />
          }
        >
          <Menu.Item onPress={() => console.log(`Edit product: ${item.name}`)} title="Edit" leadingIcon="pencil" />
          <Divider />
          <Menu.Item 
            onPress={() => console.log(`Delete product: ${item.name}`)} 
            title="Delete" 
            leadingIcon="delete" 
            titleStyle={{ color: '#FF5252' }}
          />
        </Menu>
      </View>
    </Card>
  );

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

      {/* Modal for Adding Product */}
      <Modal visible={isModalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Add New Product</Text>
                <IconButton
                  icon="close"
                  size={24}
                  onPress={() => setIsModalVisible(false)}
                  style={styles.closeButton}
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.label}>Product Name</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter product name"
                  value={newProduct.name}
                  onChangeText={(text) => setNewProduct({ ...newProduct, name: text })}
                  placeholderTextColor="#9E9E9E"
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.label}>Category (Optional)</Text>
                <View style={styles.pickerContainer}>
                  <RNPickerSelect
                    onValueChange={(value) => setNewProduct({ ...newProduct, category: value })}
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
                    value={newProduct.quantity.toString()}
                    onChangeText={(text) => setNewProduct({ ...newProduct, quantity: parseInt(text) || 0 })}
                    placeholderTextColor="#9E9E9E"
                  />
                </View>
                <View style={[styles.formGroup, { flex: 1, marginLeft: 8 }]}>
                  <Text style={styles.label}>Low Stock Alert</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="10"
                    keyboardType="numeric"
                    value={newProduct.lowStockThreshold?.toString() || ''}
                    onChangeText={(text) =>
                      setNewProduct({ ...newProduct, lowStockThreshold: parseInt(text) || 10 })
                    }
                    placeholderTextColor="#9E9E9E"
                  />
                </View>
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.label}>Product Image</Text>
                <TouchableOpacity onPress={handlePickImage} style={styles.imagePicker}>
                  {newProduct.image ? (
                    <Image source={{ uri: newProduct.image }} style={styles.previewImage} />
                  ) : (
                    <View style={styles.imagePickerPlaceholder}>
                      <IconButton icon="camera" size={24} style={styles.cameraIcon} />
                      <Text style={styles.imagePickerText}>Select Image</Text>
                    </View>
                  )}
                </TouchableOpacity>
              </View>

              <View style={styles.modalButtons}>
                <TouchableOpacity 
                  style={[styles.button, styles.cancelButton]} 
                  onPress={() => setIsModalVisible(false)}
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[styles.button, styles.saveButton]} 
                  onPress={handleSaveProduct}
                >
                  <Text style={styles.saveButtonText}>Save Product</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
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
    backgroundColor: '#6200EE',
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
    justifyContent: 'center', 
    alignItems: 'center',
  },
  modalContent: { 
    width: width * 0.9, 
    backgroundColor: '#fff', 
    padding: 24, 
    borderRadius: 16,
    elevation: 5,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: { 
    fontSize: 22, 
    fontWeight: 'bold',
    color: '#212121',
  },
  closeButton: {
    margin: 0,
    backgroundColor: '#f5f5f5',
  },
  cameraIcon: {
    backgroundColor: '#f0f0f0',
  },
  formGroup: {
    marginBottom: 16,
  },
  formRow: {
    flexDirection: 'row',
    marginBottom: 16,
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
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 12,
    backgroundColor: '#FAFAFA',
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
    height: 120,
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
    marginTop: 4,
  },
  previewImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  modalButtons: { 
    flexDirection: 'row', 
    justifyContent: 'space-between',
    marginTop: 24,
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButton: {
    marginRight: 8,
    backgroundColor: '#F5F5F5',
  },
  saveButton: {
    marginLeft: 8,
    backgroundColor: '#6200EE',
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
});
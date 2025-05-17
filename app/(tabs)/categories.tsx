import React, { useState, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  FlatList,
  Animated,
  Easing,
  useColorScheme,
    Image,
} from 'react-native';
import { FAB, IconButton, Card } from 'react-native-paper';
import { Category } from '@/types/types';
import { createCommonStyles } from '@/style/stylesheet';
import { useData } from '../../context/DataContext';
import { CategoryDeleteModal, CategoryAddEditModal } from '@/components/modals/CategoryModals';
import Toast from 'react-native-toast-message';

export default function CategoriesScreen() {
  const {
    categories,
    addCategory,
    updateCategory,
    deleteCategory,
  } = useData();
  
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';
  const commonStyles = useMemo(() => createCommonStyles(isDarkMode), [isDarkMode]);

  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [isDeleteConfirmVisible, setIsDeleteConfirmVisible] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [editCategoryName, setEditCategoryName] = useState('');

  // Animation values
  const [modalAnimation] = useState(new Animated.Value(0));
  const [deleteModalAnimation] = useState(new Animated.Value(0));

  // Animation functions
  const animateModal = (visible: boolean, animationValue: Animated.Value) => {
    Animated.timing(animationValue, {
      toValue: visible ? 1 : 0,
      duration: 200,
      easing: Easing.ease,
      useNativeDriver: true,
    }).start();
  };

  useEffect(() => {
    animateModal(isAddModalVisible || isEditModalVisible, modalAnimation);
  }, [isAddModalVisible, isEditModalVisible]);

  useEffect(() => {
    animateModal(isDeleteConfirmVisible, deleteModalAnimation);
  }, [isDeleteConfirmVisible]);

  const handleAddCategory = () => {
    setNewCategoryName('');
    setIsAddModalVisible(true);
  };

  const handleSaveCategory = async () => {
    if (newCategoryName.trim()) {
      try {
        await addCategory({ name: newCategoryName.trim() });
        setNewCategoryName('');
        setIsAddModalVisible(false);
        
        Toast.show({
          type: 'success',
          text1: 'Category Added',
          text2: `${newCategoryName} has been added successfully`,
          visibilityTime: 2000,
          position: 'top',
        });
      } catch (error) {
        console.error('Error saving category:', error);
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: 'Failed to add category',
          visibilityTime: 2000,
          position: 'top',
        });
      }
    }
  };

  const handleEditCategory = (category: Category) => {
    setSelectedCategory(category);
    setEditCategoryName(category.name);
    setIsEditModalVisible(true);
  };

  const handleUpdateCategory = async () => {
    if (selectedCategory && editCategoryName.trim()) {
      try {
        await updateCategory({
          ...selectedCategory,
          name: editCategoryName.trim(),
        });
        setSelectedCategory(null);
        setEditCategoryName('');
        setIsEditModalVisible(false);

        Toast.show({
          type: 'success',
          text1: 'Category Updated',
          text2: `Category has been updated successfully`,
          visibilityTime: 2000,
          position: 'top',
        });
      } catch (error) {
        console.error('Error updating category:', error);
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: 'Failed to update category',
          visibilityTime: 2000,
          position: 'top',
        });
      }
    }
  };

  const handleDeleteCategory = async () => {
    if (selectedCategory) {
      try {
        await deleteCategory(selectedCategory.id);
        setSelectedCategory(null);
        setIsDeleteConfirmVisible(false);

        Toast.show({
          type: 'success',
          text1: 'Category Deleted',
          text2: `${selectedCategory.name} has been deleted`,
          visibilityTime: 2000,
          position: 'top',
        });
      } catch (error) {
        console.error('Error deleting category:', error);
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: 'Failed to delete category',
          visibilityTime: 2000,
          position: 'top',
        });
      }
    }
  };

  const renderCategoryItem = ({ item }: { item: Category }) => (
    <Card style={commonStyles.productCard}>
      <View style={commonStyles.productContainer}>
        <View style={commonStyles.productInfo}>
          <Text style={commonStyles.productName}>{item.name}</Text>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <IconButton
            icon="pencil"
            size={20}
            onPress={() => handleEditCategory(item)}
            style={commonStyles.menuButton}
          />
          <IconButton
            icon="delete"
            size={20}
            onPress={() => {
              setSelectedCategory(item);
              setIsDeleteConfirmVisible(true);
            }}
            style={[commonStyles.menuButton, { marginLeft: 8 }]}
          />
        </View>
      </View>
    </Card>
  );

  return (
    <View style={{ flex: 1, backgroundColor: commonStyles.colors.background }}>
      <View style={commonStyles.container}>
        <FlatList
          data={categories}
          renderItem={renderCategoryItem}
          keyExtractor={item => item.id}
          contentContainerStyle={commonStyles.productList}
          ListEmptyComponent={
            <View style={commonStyles.emptyContainer}>
              <Image 
                source={require('../../assets/images/empty.png')} 
                style={commonStyles.emptyImage} 
              />
              <Text style={commonStyles.emptyText}>
                No categories found
              </Text>
              <Text style={commonStyles.emptySubtext}>
                Add a new category to get started
              </Text>
            </View>
          }
        />

        {/* Add Category Modal */}
        <CategoryAddEditModal
          isVisible={isAddModalVisible}
          title="Add New Category"
          value={newCategoryName}
          onChangeText={setNewCategoryName}
          onSave={handleSaveCategory}
          onClose={() => setIsAddModalVisible(false)}
          styles={commonStyles}
          modalAnimation={modalAnimation}
          buttonText="Save Category"
        />

        {/* Edit Category Modal */}
        <CategoryAddEditModal
          isVisible={isEditModalVisible}
          title="Edit Category"
          value={editCategoryName}
          onChangeText={setEditCategoryName}
          onSave={handleUpdateCategory}
          onClose={() => setIsEditModalVisible(false)}
          styles={commonStyles}
          modalAnimation={modalAnimation}
          buttonText="Update"
        />

        {/* Delete Confirmation Modal */}
        <CategoryDeleteModal
          isDeleteConfirmVisible={isDeleteConfirmVisible}
          selectedCategory={selectedCategory}
          styles={commonStyles}
          deleteModalAnimation={deleteModalAnimation}
          onCloseDeleteModal={() => setIsDeleteConfirmVisible(false)}
          onDeleteConfirm={handleDeleteCategory}
        />

        <FAB
          icon="plus"
          style={commonStyles.fab}
          onPress={handleAddCategory}
          color={commonStyles.colors.background} // matches styles.colors.background from ProductsScreen
          label="Add Category"
          uppercase={false}
        />
      </View>
    </View>
  );
}
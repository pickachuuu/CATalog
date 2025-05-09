import React, { useState, useEffect, useMemo } from 'react';
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Modal,
  TextInput,
  Animated,
  Easing,
  useColorScheme,
} from 'react-native';
import { FAB, IconButton, Card } from 'react-native-paper';
import { Category } from '@/types/types';
import { addCategory, getCategories, updateCategory, deleteCategory } from '@/services/storage';
import { createCommonStyles } from '@/style/stylesheet';

export default function CategoriesScreen() {
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';
  const commonStyles = useMemo(() => createCommonStyles(isDarkMode), [isDarkMode]);

  const [categories, setCategories] = useState<Category[]>([]);
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [isDeleteConfirmVisible, setIsDeleteConfirmVisible] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [editCategoryName, setEditCategoryName] = useState('');

  // Animation values
  const [modalAnimation] = useState(new Animated.Value(0));
  const [deleteModalAnimation] = useState(new Animated.Value(0));

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    const loadedCategories = await getCategories();
    setCategories(loadedCategories);
  };

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
        const savedCategory = await addCategory({ name: newCategoryName.trim() });
        setCategories(prev => [...prev, savedCategory]);
        setNewCategoryName('');
        setIsAddModalVisible(false);
      } catch (error) {
        console.error('Error saving category:', error);
      }
    } else {
      alert('Please enter a category name.');
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
        const updatedCategory = await updateCategory({
          ...selectedCategory,
          name: editCategoryName.trim(),
        });
        setCategories(prev =>
          prev.map(cat => (cat.id === updatedCategory.id ? updatedCategory : cat))
        );
        setSelectedCategory(null);
        setEditCategoryName('');
        setIsEditModalVisible(false);
      } catch (error) {
        console.error('Error updating category:', error);
      }
    } else {
      alert('Please enter a category name.');
    }
  };

  const handleDeleteCategory = async () => {
    if (selectedCategory) {
      try {
        await deleteCategory(selectedCategory.id);
        setCategories(prev => prev.filter(cat => cat.id !== selectedCategory.id));
        setSelectedCategory(null);
        setIsDeleteConfirmVisible(false);
      } catch (error) {
        console.error('Error deleting category:', error);
      }
    }
  };

  const renderCategoryItem = ({ item }: { item: Category }) => (
    <Card style={commonStyles.productCard}>
      <View style={commonStyles.productContainer}>
        <View style={commonStyles.productInfo}>
          <Text style={commonStyles.productName}>{item.name}</Text>
        </View>
        <View style={styles.actionButtons}>
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

  // Modal transform animations
  const modalTranslateY = modalAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [50, 0],
  });

  const deleteOpacity = deleteModalAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });

  return (
    <View style={styles.container}>
      <FlatList
        data={categories}
        renderItem={renderCategoryItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContainer}
      />

      {/* Add Category Modal */}
      <Modal
        visible={isAddModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setIsAddModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <Animated.View
            style={[
              styles.modalContent,
              { transform: [{ translateY: modalTranslateY }] },
            ]}
          >
            <Text style={styles.modalTitle}>Add New Category</Text>
            <TextInput
              style={styles.input}
              placeholder="Category Name"
              value={newCategoryName}
              onChangeText={setNewCategoryName}
              autoFocus
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.button, styles.cancelButton]}
                onPress={() => setIsAddModalVisible(false)}
              >
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, styles.saveButton]}
                onPress={handleSaveCategory}
              >
                <Text style={[styles.buttonText, styles.saveButtonText]}>
                  Save Category
                </Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </View>
      </Modal>

      {/* Edit Category Modal */}
      <Modal
        visible={isEditModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setIsEditModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <Animated.View
            style={[
              styles.modalContent,
              { transform: [{ translateY: modalTranslateY }] },
            ]}
          >
            <Text style={styles.modalTitle}>Edit Category</Text>
            <TextInput
              style={styles.input}
              placeholder="Category Name"
              value={editCategoryName}
              onChangeText={setEditCategoryName}
              autoFocus
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.button, styles.cancelButton]}
                onPress={() => setIsEditModalVisible(false)}
              >
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, styles.saveButton]}
                onPress={handleUpdateCategory}
              >
                <Text style={[styles.buttonText, styles.saveButtonText]}>
                  Update Category
                </Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </View>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        visible={isDeleteConfirmVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setIsDeleteConfirmVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <Animated.View
            style={[
              styles.modalContent,
              { transform: [{ translateY: modalTranslateY }] },
            ]}
          >
            <Text style={styles.modalTitle}>Delete Category</Text>
            <Text style={styles.deleteMessage}>
              Are you sure you want to delete this category? This action cannot be undone.
            </Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.button, styles.cancelButton]}
                onPress={() => setIsDeleteConfirmVisible(false)}
              >
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, styles.deleteButton]}
                onPress={handleDeleteCategory}
              >
                <Text style={[styles.buttonText, styles.deleteButtonText]}>
                  Delete
                </Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </View>
      </Modal>

      <FAB
        icon="plus"
        style={commonStyles.fab}
        onPress={handleAddCategory}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContainer: {
    padding: 16,
    paddingBottom: 100,
  },
  actionButtons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    width: '90%',
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    fontSize: 16,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    marginHorizontal: 4,
  },
  cancelButton: {
    backgroundColor: '#f0f0f0',
  },
  saveButton: {
    backgroundColor: '#007AFF',
  },
  deleteButton: {
    backgroundColor: '#FF3B30',
  },
  buttonText: {
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '500',
  },
  saveButtonText: {
    color: 'white',
  },
  deleteButtonText: {
    color: 'white',
  },
  deleteMessage: {
    textAlign: 'center',
    marginBottom: 16,
    color: '#666',
  },
});

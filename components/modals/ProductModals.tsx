import React from 'react';
import { Modal, View, Text, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView, TextInput, Image } from 'react-native';
import { IconButton } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import RNPickerSelect from 'react-native-picker-select';
import { Product, Category } from '@/types/types';
import { createCommonStyles } from '@/style/stylesheet';
import { useColorScheme } from '@/components/useColorScheme';

interface ProductModalsProps {
  isOptionsModalVisible: boolean;
  isDeleteConfirmVisible: boolean;
  isAddModalVisible: boolean;
  isEditModalVisible: boolean;
  selectedProduct: Product | null;
  editProduct: Product | null;
  newProduct: Omit<Product, 'id'>;
  categories: Category[];
  styles: ReturnType<typeof createCommonStyles>;
  onCloseOptionsModal: () => void;
  onCloseDeleteModal: () => void;
  onCloseAddEditModal: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onDeleteConfirm: () => void;
  onSave: () => void;
  onUpdate: () => void;
  onPickImage: (isEdit: boolean) => void;
  setNewProduct: (product: Omit<Product, 'id'>) => void;
  setEditProduct: (product: Product) => void;
}

export function ProductModals({
  isOptionsModalVisible,
  isDeleteConfirmVisible,
  isAddModalVisible,
  isEditModalVisible,
  selectedProduct,
  editProduct,
  newProduct,
  categories,
  styles,
  onCloseOptionsModal,
  onCloseDeleteModal,
  onCloseAddEditModal,
  onEdit,
  onDelete,
  onDeleteConfirm,
  onSave,
  onUpdate,
  onPickImage,
  setNewProduct,
  setEditProduct,
}: ProductModalsProps) {
  return (
    <>
      {/* Options Modal */}
      <Modal visible={isOptionsModalVisible} transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.optionsModalContainer}>
            <View style={styles.optionsModalContent}>
              <View style={styles.optionsModalHeader}>
                <Text style={styles.optionsModalTitle}>
                  {selectedProduct?.name}
                </Text>
              </View>

              <TouchableOpacity 
                style={[
                  styles.optionButton,
                  { backgroundColor: `${styles.colors.tint}05` }
                ]} 
                onPress={onEdit}
                activeOpacity={0.7}
              >
                <View style={styles.optionIconContainerInline}>
                  <MaterialCommunityIcons 
                    name="pencil-outline" 
                    size={20} 
                    color={styles.colors.tint} 
                  />
                </View>
                <Text style={styles.optionText}>Edit Product</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[
                  styles.optionButton,
                  { backgroundColor: `${styles.colors.error}05` }
                ]} 
                onPress={onDelete}
                activeOpacity={0.7}
              >
                <View style={styles.deleteIconContainerInline}>
                  <MaterialCommunityIcons 
                    name="delete-outline" 
                    size={20} 
                    color={styles.colors.error} 
                  />
                </View>
                <Text style={styles.deleteOptionText}>Delete</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.cancelOptionButton}
                onPress={onCloseOptionsModal}
                activeOpacity={0.7}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal visible={isDeleteConfirmVisible} transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.confirmModalContainer || styles.modalContainer}>
            <View style={styles.confirmModalContent || styles.modalContent}>
              <View style={styles.deleteIconContainer}>
                <MaterialCommunityIcons name="alert-circle-outline" size={40} color="#FF5252" />
              </View>
              
              <Text style={styles.confirmModalTitle}>Delete Product</Text>
              <Text style={styles.confirmModalText}>
                Are you sure you want to delete "{selectedProduct?.name}"? This action cannot be undone.
              </Text>
              
              <View style={styles.confirmModalButtons || styles.modalButtons}>
                <TouchableOpacity 
                  style={[styles.button, styles.cancelButton]} 
                  onPress={onCloseDeleteModal}
                  activeOpacity={0.7}
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[styles.button, styles.deleteButton]} 
                  onPress={onDeleteConfirm}
                  activeOpacity={0.7}
                >
                  <Text style={styles.deleteButtonText}>Delete</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </Modal>

      {/* Add/Edit Product Modal */}
      <Modal 
        visible={isAddModalVisible || isEditModalVisible} 
        transparent={true}
      >
        <KeyboardAvoidingView 
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{ flex: 1 }}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContainer}>
              <View style={styles.modalContent}>
                <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle}>
                    {isAddModalVisible ? 'Add New Product' : 'Edit Product'}
                  </Text>
                  <IconButton
                    icon="close"
                    size={24}
                    onPress={onCloseAddEditModal}
                    style={styles.closeButton}
                  />
                </View>

                <ScrollView style={styles.formContainer}>
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
                      placeholderTextColor={styles.colors.tabIconDefault}
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
                          value: category.id,
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
                    <View style={[styles.formGroup, styles.formGroupWithMargin]}>
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
                        placeholderTextColor={styles.colors.tabIconDefault}
                      />
                    </View>
                    <View style={[styles.formGroup, styles.formGroupWithMarginLeft]}>
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
                        placeholderTextColor={styles.colors.tabIconDefault}
                      />
                    </View>
                  </View>

                  <View style={styles.formGroup}>
                    <Text style={styles.label}>Product Image</Text>
                    <TouchableOpacity 
                      onPress={() => onPickImage(!isAddModalVisible)} 
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
                          <MaterialCommunityIcons name="camera-outline" size={32} color={styles.colors.tint} />
                          <Text style={styles.imagePickerText}>Select Image</Text>
                        </View>
                      )}
                    </TouchableOpacity>
                  </View>
                </ScrollView>

                <View style={[styles.modalButtons, { padding: 16 }]}>
                  <TouchableOpacity 
                    style={[styles.button, styles.cancelButton]} 
                    onPress={onCloseAddEditModal}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.cancelButtonText}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={[styles.button, styles.saveButton]} 
                    onPress={isAddModalVisible ? onSave : onUpdate}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.saveButtonText}>
                      {isAddModalVisible ? 'Save Product' : 'Update Product'}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </>
  );
}
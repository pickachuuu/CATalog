import React from 'react';
import { Modal, View, Text, TouchableOpacity, Animated, TextInput } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Category } from '@/types/types';
import { createCommonStyles } from '@/style/stylesheet';

interface CategoryModalsProps {
  isDeleteConfirmVisible: boolean;
  selectedCategory: Category | null;
  styles: ReturnType<typeof createCommonStyles>;
  deleteModalAnimation: Animated.Value;
  onCloseDeleteModal: () => void;
  onDeleteConfirm: () => void;
}

export function CategoryDeleteModal({
  isDeleteConfirmVisible,
  selectedCategory,
  styles,
  deleteModalAnimation,
  onCloseDeleteModal,
  onDeleteConfirm,
}: CategoryModalsProps) {
  const deleteModalTranslateY = deleteModalAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [50, 0],
  });

  return (
    <Modal visible={isDeleteConfirmVisible} transparent={true} animationType="fade">
      <View style={styles.modalOverlay}>
        <Animated.View 
          style={[
            styles.confirmModalContainer || styles.modalContainer,
            { transform: [{ translateY: deleteModalTranslateY }] }
          ]}
        >
          <View style={styles.confirmModalContent || styles.modalContent}>
            <View style={styles.deleteIconContainer}>
              <MaterialCommunityIcons 
                name="alert-circle-outline" 
                size={40} 
                color={styles.colors.error} 
              />
            </View>
            
            <Text style={styles.confirmModalTitle}>Delete Category</Text>
            <Text style={styles.confirmModalText}>
              Are you sure you want to delete "{selectedCategory?.name}"? This action cannot be undone.
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
        </Animated.View>
      </View>
    </Modal>
  );
}

interface CategoryAddEditModalProps {
  isVisible: boolean;
  title: string;
  value: string;
  onChangeText: (text: string) => void;
  onSave: () => void;
  onClose: () => void;
  styles: ReturnType<typeof createCommonStyles>;
  modalAnimation: Animated.Value;
  buttonText: string;
}

export function CategoryAddEditModal({
  isVisible,
  title,
  value,
  onChangeText,
  onSave,
  onClose,
  styles,
  modalAnimation,
  buttonText
}: CategoryAddEditModalProps) {
  const modalTranslateY = modalAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [50, 0],
  });

  return (
    <Modal visible={isVisible} transparent={true} animationType="fade">
      <View style={styles.modalOverlay}>
        <Animated.View 
          style={[
            styles.smallModalContainer,
            { transform: [{ translateY: modalTranslateY }] }
          ]}
        >
          <Text style={styles.smallModalTitle}>{title}</Text>
          
          <TextInput
            style={styles.smallModalInput}
            placeholder="Category name"
            placeholderTextColor={styles.colors.tabIconDefault}
            value={value}
            onChangeText={onChangeText}
            autoCapitalize="words"
            autoFocus
          />
          
          <View style={styles.smallModalButtons}>
            <TouchableOpacity 
              style={styles.smallModalCancelButton} 
              onPress={onClose}
              activeOpacity={0.7}
            >
              <Text style={styles.smallModalCancelText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.smallModalSaveButton} 
              onPress={onSave}
              activeOpacity={0.7}
            >
              <Text style={styles.smallModalSaveText}>{buttonText}</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
}
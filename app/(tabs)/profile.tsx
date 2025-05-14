import React, { useEffect, useState } from 'react';
import { StyleSheet, Switch, TouchableOpacity, Alert } from 'react-native';
import { Text, View } from '@/components/Themed';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as FileSystem from 'expo-file-system';
import * as DocumentPicker from 'expo-document-picker';
import * as MediaLibrary from 'expo-media-library';

import storage, {
  getProducts,
  getCategories,
} from '../../services/storage';

const PRODUCTS_KEY = 'products';
const CATEGORIES_KEY = 'categories';
const LAST_RESET_KEY = 'lastResetTimestamp';

export default function SettingsScreen() {
  const [darkMode, setDarkMode] = useState(false);
  const [lastReset, setLastReset] = useState<string | null>(null);

  useEffect(() => {
    const loadPreferences = async () => {
      const storedDarkMode = await AsyncStorage.getItem('darkMode');
      if (storedDarkMode !== null) setDarkMode(storedDarkMode === 'true');

      const storedReset = await AsyncStorage.getItem(LAST_RESET_KEY);
      if (storedReset) setLastReset(storedReset);
    };

    loadPreferences();
  }, []);

  const saveLastReset = async () => {
    const timestamp = new Date().toLocaleString();
    await AsyncStorage.setItem(LAST_RESET_KEY, timestamp);
    setLastReset(timestamp);
  };

  const handleExportData = async () => {
    try {
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'Cannot access Downloads folder.');
        return;
      }

      const products = await getProducts();
      const categories = await getCategories();

      const data = JSON.stringify({ products, categories }, null, 2);
      const fileName = 'catalog-export.json';
      const fileUri = FileSystem.cacheDirectory + fileName;

      await FileSystem.writeAsStringAsync(fileUri, data);

      const asset = await MediaLibrary.createAssetAsync(fileUri);
      const album = await MediaLibrary.getAlbumAsync('Download');
      if (album) {
        await MediaLibrary.addAssetsToAlbumAsync([asset], album, false);
      } else {
        await MediaLibrary.createAlbumAsync('Download', asset, false);
      }

      Alert.alert('Export Successful', 'Data saved to Pictures/Download.');
    } catch (error) {
      console.error(error);
      Alert.alert('Export Failed', 'Could not export data.');
    }
  };

  const handleImportData = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({ type: 'application/json' });
      if (result.canceled || !result.assets?.[0]) return;

      const fileUri = result.assets[0].uri;
      const content = await FileSystem.readAsStringAsync(fileUri);
      const { products = [], categories = [] } = JSON.parse(content);

      await storage.save({ key: PRODUCTS_KEY, data: products });
      await storage.save({ key: CATEGORIES_KEY, data: categories });

      Alert.alert('Import Successful', 'Data has been imported.');
    } catch (error) {
      console.error(error);
      Alert.alert('Import Failed', 'Could not import data.');
    }
  };

  const resetProducts = async () => {
    Alert.alert('Reset Products', 'Are you sure you want to delete all products?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Reset',
        style: 'destructive',
        onPress: async () => {
          try {
            await storage.remove({ key: PRODUCTS_KEY });
            await saveLastReset();
            Alert.alert('Done', 'All products deleted.');
          } catch (error) {
            console.error(error);
            Alert.alert('Error', 'Failed to delete products.');
          }
        },
      },
    ]);
  };

  const resetCategories = async () => {
    Alert.alert('Reset Categories', 'Are you sure you want to delete all categories?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Reset',
        style: 'destructive',
        onPress: async () => {
          try {
            await storage.remove({ key: CATEGORIES_KEY });
            await saveLastReset();
            Alert.alert('Done', 'All categories deleted.');
          } catch (error) {
            console.error(error);
            Alert.alert('Error', 'Failed to delete categories.');
          }
        },
      },
    ]);
  };

  const resetAllData = async () => {
    Alert.alert(
      'Reset All Data',
      'Are you sure you want to delete ALL products, categories, and settings?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: async () => {
            try {
              await storage.remove({ key: PRODUCTS_KEY });
              await storage.remove({ key: CATEGORIES_KEY });
              await AsyncStorage.removeItem('darkMode');
              setDarkMode(false);
              await saveLastReset();

              Alert.alert('All Data Cleared', 'All data and settings have been reset.');
            } catch (error) {
              console.error(error);
              Alert.alert('Error', 'Failed to reset all data.');
            }
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Settings</Text>

      <TouchableOpacity style={styles.settingButton} onPress={handleExportData}>
        <Text style={styles.settingText}>Export Data</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.settingButton} onPress={handleImportData}>
        <Text style={styles.settingText}>Import Data</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.settingButton} onPress={resetProducts}>
        <Text style={[styles.settingText, { color: '#cc3300' }]}>Reset Products</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.settingButton} onPress={resetCategories}>
        <Text style={[styles.settingText, { color: '#cc3300' }]}>Reset Categories</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.settingButton} onPress={resetAllData}>
        <Text style={[styles.settingText, { color: 'red' }]}>Reset All Data</Text>
      </TouchableOpacity>

      {lastReset && (
        <Text style={styles.lastReset}>Last Reset: {lastReset}</Text>
      )}

      <View style={styles.separator} />

      <Text style={styles.aboutText}>CATalog v1.0.0</Text>
      <Text style={styles.aboutText}>© 2025 MobDev</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: 'flex-start',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 24,
    alignSelf: 'center',
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  settingText: {
    fontSize: 18,
  },
  settingButton: {
    paddingVertical: 12,
  },
  lastReset: {
    marginTop: 40,
    fontSize: 14,
    textAlign: 'center',
    color: '#888',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    backgroundColor: '#ccc',
  },
  aboutText: {
    textAlign: 'center',
    fontSize: 14,
    color: '#888',
  },
});

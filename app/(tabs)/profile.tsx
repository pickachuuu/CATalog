import { StyleSheet, Switch, TouchableOpacity, Alert } from 'react-native';
import { Text, View } from '@/components/Themed';
import { useState } from 'react';

export default function SettingsScreen() {
  const [darkMode, setDarkMode] = useState(false);

  const toggleDarkMode = () => {
    setDarkMode(prev => !prev);
    // Implement actual theme logic if needed
  };

  const handleExportData = () => {
    Alert.alert('Export', 'Data export feature not implemented yet.');
    // Implement export logic here
  };

  const handleImportData = () => {
    Alert.alert('Import', 'Data import feature not implemented yet.');
    // Implement import logic here
  };

  const handleResetApp = () => {
    Alert.alert(
      'Reset App',
      'Are you sure you want to reset all app data?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: () => {
            // Clear local storage or data
            Alert.alert('Data Reset', 'All data has been cleared.');
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Settings</Text>

      <View style={styles.settingItem}>
        <Text style={styles.settingText}>Dark Mode</Text>
        <Switch value={darkMode} onValueChange={toggleDarkMode} />
      </View>

      <TouchableOpacity style={styles.settingButton} onPress={handleExportData}>
        <Text style={styles.settingText}>Export Data</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.settingButton} onPress={handleImportData}>
        <Text style={styles.settingText}>Import Data</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.settingButton} onPress={handleResetApp}>
        <Text style={[styles.settingText, { color: '#DC2626' }]}>Reset App Data</Text>
      </TouchableOpacity>

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
import { StyleSheet, Image, TouchableOpacity, Alert } from 'react-native';
import { Text, View } from '@/components/Themed';

interface UserProfile {
  name: string;
  email: string;
  avatarUrl: string;
}

const user: UserProfile = {
  name: 'John Doe',
  email: 'john.doe@example.com',
  avatarUrl: 'https://i.pravatar.cc/150?img=12',
};

export default function ProfileScreen() {
  const handleEditProfile = () => {
    Alert.alert('Edit Profile', 'Navigating to edit profile screen...');
    // Add navigation logic here
  };

  const handleLogout = () => {
    Alert.alert('Log Out', 'You have been logged out.');
    // Add logout logic here
  };

  return (
    <View style={styles.container}>
      <Image source={{ uri: user.avatarUrl }} style={styles.avatar} />
      <Text style={styles.name}>{user.name}</Text>
      <Text style={styles.email}>{user.email}</Text>

      <TouchableOpacity style={styles.button} onPress={handleEditProfile}>
        <Text style={styles.buttonText}>Edit Profile</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.button, styles.logoutButton]} onPress={handleLogout}>
        <Text style={styles.buttonText}>Log Out</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 20,
    borderWidth: 2,
    borderColor: '#ccc',
  },
  name: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 6,
  },
  email: {
    fontSize: 16,
    color: '#666',
    marginBottom: 30,
  },
  button: {
    backgroundColor: '#4F46E5',
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 8,
    marginTop: 12,
    width: '80%',
  },
  logoutButton: {
    backgroundColor: '#DC2626',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
  },
});

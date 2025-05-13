import FontAwesome from '@expo/vector-icons/FontAwesome';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useState } from 'react';
import { StatusBar } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import 'react-native-reanimated';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { useColorScheme } from '@/components/useColorScheme';
import { DataProvider } from '../context/DataContext';
import OnboardingScreen from '../components/OnboardingScreen';

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from 'expo-router';

export const unstable_settings = {
  initialRouteName: '(tabs)',
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    ...FontAwesome.font,
  });

  const [showOnboarding, setShowOnboarding] = useState<boolean | null>(null);

  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  // Check onboarding flag on mount
  useEffect(() => {
    const checkOnboarding = async () => {
      try {
        const value = await AsyncStorage.getItem('onboardingComplete');
        setShowOnboarding(value !== 'true');
      } catch (e) {
        setShowOnboarding(false); // fallback to main app
      }
    };
    checkOnboarding();
  }, []);

  const handleGetStarted = async () => {
    await AsyncStorage.setItem('onboardingComplete', 'true');
    setShowOnboarding(false);
  };

  if (!loaded || showOnboarding === null) {
    return null;
  }

  if (showOnboarding) {
    return <OnboardingScreen onGetStarted={handleGetStarted} />;
  }

  return (
    <DataProvider>
      <RootLayoutNav />
    </DataProvider>
  );
}

function RootLayoutNav() {
  const colorScheme = useColorScheme();

  return (
    <SafeAreaProvider>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        {/* Fix Android status bar behavior */}
        <StatusBar
          translucent
          backgroundColor="transparent"
          barStyle={colorScheme === 'dark' ? 'light-content' : 'dark-content'}
        />
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        </Stack>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}

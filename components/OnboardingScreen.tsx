import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { useColorScheme } from '@/components/useColorScheme';
import { createCommonStyles } from '@/style/stylesheet';

interface OnboardingScreenProps {
  onGetStarted: () => void;
}

const OnboardingScreen: React.FC<OnboardingScreenProps> = ({ onGetStarted }) => {
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';
  const styles = createCommonStyles(isDarkMode);

  return (
    <View style={styles.onboardingContainer}>
      <View style={styles.onboardingCenterContent}>
        <Image source={require('../assets/images/splash-icon.png')} style={styles.onboardingLogo} />
        <Text style={styles.onboardingTitle}>Welcome to CATalog</Text>
        <Text style={styles.onboardingDescription}>
          Welcome to your purr-fect inventory app! Stay organized and let the meowgic begin.
        </Text>
      </View>
      <TouchableOpacity style={styles.onboardingButton} onPress={onGetStarted}>
        <Text style={styles.onboardingButtonText}>Get Started</Text>
      </TouchableOpacity>
    </View>
  );
};

export default OnboardingScreen; 
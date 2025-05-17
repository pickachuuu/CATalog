const tintColorLight = '#E66B00';
const tintColorDark = '#FF4F4F';

export default {
  light: {
    text: '#431C00',                
    background: '#FFF1DB',
    secondaryBackground: '#FFD6A3',
    borderColor: '#E2B78A',
    tint: tintColorLight,
    tabColor: '#FFF8ED',
    tabIconDefault: '#B57640',
    tabIconSelected: tintColorLight,
    error: '#CC3B0A',
    shadow: '#9A4600',
  },
  dark: {
    text: '#FAF8F6',               // Near-white, warm tone
    background: '#121212',         // Pure charcoal black
    secondaryBackground: '#1F1F1F', // Slightly lifted dark gray
    borderColor: '#333333',        // Subtle gray borders
    tint: '#FF7F50',               // Vibrant coral-orange
    tabColor: '#1A1A1A',
    tabIconDefault: '#BFB5AD',     // Muted bone/cream icon
    tabIconSelected: '#FF7F50',    // Strong coral accent
    error: '#FF5C5C',
    shadow: '#1A1A1A',
  }
  
};

const tintColorLight = '#D2691E'; // rust/orange
const tintColorDark = '#FFB347'; // warm light orange

export default {
  light: {
    text: '#2E2E2E',               // deep gray, soft on white
    background: '#FFF8F0',         // creamy white, calico-inspired
    tint: tintColorLight,
    tabIconDefault: '#A89F91',     // muted calico gray
    tabIconSelected: tintColorLight,
    error: '#FF6B6B',              // reddish alert
    warningYellow: '#FFC107',
    successGreen: '#4CAF50',
  },
  dark: {
    text: '#FAFAFA',
    background: '#1C1C1C',         // deep charcoal
    tint: tintColorDark,
    tabIconDefault: '#888',        // soft gray
    tabIconSelected: tintColorDark,
    error: '#FF8C8C',              // softer red on dark
    warningYellow: '#FFC107',
    successGreen: '#4CAF50',
  },
};

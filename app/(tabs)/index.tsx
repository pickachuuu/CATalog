import { ScrollView, Dimensions, RefreshControl, View } from 'react-native';
import { Text } from '@/components/Themed';
import { PieChart, BarChart } from 'react-native-chart-kit';
import { useEffect, useState, useMemo, useCallback } from 'react';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { getLowStockProducts } from '@/services/storage';
import { Product } from '@/types/types';
import { createCommonStyles } from '@/style/stylesheet';
import { useColorScheme } from '@/components/useColorScheme';
import { useData } from '@/context/DataContext';
import { Surface } from 'react-native-paper';

// Helper function to generate unique colors for categories
const colorPool = ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40'];
let usedColors: string[] = [];

const getUniqueColor = () => {
  if (usedColors.length >= colorPool.length) {
    // If all colors are used, start reusing from the beginning
    usedColors = [];
  }
  const availableColors = colorPool.filter(color => !usedColors.includes(color));
  const color = availableColors[Math.floor(Math.random() * availableColors.length)];
  usedColors.push(color);
  return color;
};

export default function DashboardScreen() {
  const { products, categories, refreshData, refreshTrigger } = useData();
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';
  const styles = useMemo(() => createCommonStyles(isDarkMode), [isDarkMode]);
  
  const [lowStockItems, setLowStockItems] = useState<Product[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  // Calculate dashboard metrics
  const metrics = useMemo(() => ({
    totalProducts: products.length,
    totalStock: products.reduce((sum, p) => sum + p.quantity, 0),
    lowStock: products.filter(p => p.quantity <= (p.lowStockThreshold || 10)).length,
    outOfStock: products.filter(p => p.quantity === 0).length,
    categories: categories.length
  }), [products, categories]);

  const loadLowStockItems = useCallback(async () => {
    try {
      const lowStock = await getLowStockProducts();
      setLowStockItems(lowStock);
    } catch (error) {
      console.error('Error loading low stock items:', error);
    }
  }, []);

  // Initial load and refresh when refreshTrigger changes
  useEffect(() => {
    loadLowStockItems();
  }, [loadLowStockItems, refreshTrigger]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await Promise.all([loadLowStockItems(), refreshData()]);
    setRefreshing(false);
  }, [loadLowStockItems, refreshData]);

  // Calculate category distribution using useMemo to prevent unnecessary recalculations
  const categoryData = useMemo(() => {
    // Reset usedColors for each calculation
    usedColors = [];
    const categoryMap = new Map<string, { name: string; population: number; color: string; legendFontColor: string }>();
    
    // Initialize with all categories
    categories.forEach(category => {
      categoryMap.set(category.id, {
        name: category.name,
        population: 0,
        color: getUniqueColor(),
        legendFontColor: '#7F7F7F',
      });
    });

    // Add uncategorized option
    categoryMap.set('uncategorized', {
      name: 'Uncategorized',
      population: 0,
      color: '#CCCCCC',
      legendFontColor: '#7F7F7F',
    });

    // Count products in each category
    products.forEach(product => {
      const categoryId = product.category || 'uncategorized';
      const category = categoryMap.get(categoryId);
      if (category) {
        category.population += product.quantity;
      }
    });

    // Convert to array and filter out categories with no products
    return Array.from(categoryMap.values()).filter(cat => cat.population > 0);
  }, [products, categories]);

  // Prepare stock level data using useMemo
  const stockData = useMemo(() => ({
    labels: categoryData.map(cat => cat.name),
    datasets: [
      {
        data: categoryData.map(cat => cat.population),
      },
    ],
  }), [categoryData]);

  return (
    <ScrollView
      style={styles.dashboardContainer}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {/* Stats Overview */}
      <View style={styles.dashboardStats}>
        <Surface style={styles.statCard}>
          <View style={[styles.statIcon, { backgroundColor: `${styles.colors.tint}15` }]}>
            <MaterialCommunityIcons name="package-variant" size={24} color={styles.colors.tint} />
          </View>
          <Text style={styles.statValue}>{metrics.totalProducts}</Text>
          <Text style={styles.statLabel}>Total Products</Text>
        </Surface>

        <Surface style={styles.statCard}>
          <View style={[styles.statIcon, { backgroundColor: '#4CAF5015' }]}>
            <MaterialCommunityIcons name="package-variant-closed" size={24} color="#4CAF50" />
          </View>
          <Text style={styles.statValue}>{metrics.totalStock}</Text>
          <Text style={styles.statLabel}>Total Stock</Text>
        </Surface>

        <Surface style={styles.statCard}>
          <View style={[styles.statIcon, { backgroundColor: `${styles.colors.error}15` }]}>
            <MaterialCommunityIcons name="alert-circle" size={24} color={styles.colors.error} />
          </View>
          <Text style={[styles.statValue, { color: styles.colors.error }]}>{metrics.lowStock}</Text>
          <Text style={styles.statLabel}>Low Stock</Text>
        </Surface>
      </View>

      {/* Low Stock Alerts */}
      <Surface style={styles.lowStockSection}>
        <View style={styles.lowStockHeader}>
          <MaterialCommunityIcons name="alert-circle-outline" size={24} color={styles.colors.error} />
          <Text style={[styles.lowStockTitle, { marginLeft: 12 }]}>Low Stock Alerts</Text>
          {lowStockItems.length > 0 && (
            <View style={{
              backgroundColor: styles.colors.error,
              borderRadius: 12,
              paddingHorizontal: 8,
              paddingVertical: 4,
              marginLeft: 8,
            }}>
              <Text style={{ color: 'white', fontWeight: '600' }}>{lowStockItems.length}</Text>
            </View>
          )}
        </View>
        
        {lowStockItems.length > 0 ? (
          lowStockItems.map((item, index) => {
            const category = categories.find(cat => cat.id === item.category);
            return (
              <View key={index} style={styles.lowStockItem}>
                <View style={styles.lowStockInfo}>
                  <Text style={styles.lowStockName}>{item.name}</Text>
                  {category && (
                    <Text style={styles.lowStockCategory}>{category.name}</Text>
                  )}
                </View>
                <View>
                  <Text style={styles.stockCount}>{item.quantity}</Text>
                  <Text style={styles.stockThreshold}>
                    Min: {item.lowStockThreshold || 10}
                  </Text>
                </View>
              </View>
            );
          })
        ) : (
          <View style={{ padding: 16 }}>
            <Text style={styles.noDataText}>All stock levels are healthy</Text>
          </View>
        )}
      </Surface>

      
      {/* Category Distribution */}
      <Surface style={styles.chartSection}>
        <View style={styles.lowStockHeader}>
          <MaterialCommunityIcons name="chart-pie" size={24} color={styles.colors.tint} />
          <Text style={[styles.lowStockTitle, { marginLeft: 12 }]}>Category Distribution</Text>
        </View>
        {categoryData.length > 0 ? (
          <PieChart
            data={categoryData}
            width={Dimensions.get('window').width - 48}
            height={220}
            chartConfig={{
              backgroundColor: 'transparent',
              backgroundGradientFrom: 'white',
              backgroundGradientTo: 'white',
              color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
              labelColor: (opacity = 1) => styles.colors.text,
            }}
            accessor="population"
            backgroundColor="transparent"
            paddingLeft="15"
            absolute
          />
        ) : (
          <Text style={styles.noDataText}>No category data available</Text>
        )}
      </Surface>

    </ScrollView>
  );
}

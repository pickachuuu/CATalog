import { ScrollView, Dimensions, RefreshControl } from 'react-native';
import { Text, View } from '@/components/Themed';
import { PieChart, BarChart } from 'react-native-chart-kit';
import { useEffect, useState, useMemo, useCallback } from 'react';
import { getProducts, getLowStockProducts, getCategories } from '@/services/storage';
import { Product, Category } from '@/types/types';
import { createCommonStyles } from '@/style/stylesheet';
import { useColorScheme } from '@/components/useColorScheme';

// Helper function to generate random colors for categories
const getRandomColor = () => {
  const colors = ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40'];
  return colors[Math.floor(Math.random() * colors.length)];
};

export default function DashboardScreen() {
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';
  const styles = useMemo(() => createCommonStyles(isDarkMode), [isDarkMode]);

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [lowStockItems, setLowStockItems] = useState<Product[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const loadData = useCallback(async () => {
    try {
      const allProducts = await getProducts();
      const allCategories = await getCategories();
      const lowStock = await getLowStockProducts();
      setProducts(allProducts);
      setCategories(allCategories);
      setLowStockItems(lowStock);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    }
  }, []);

  // Initial load
  useEffect(() => {
    loadData();
  }, [loadData]);

  // Set up auto-refresh interval
  useEffect(() => {
    const refreshInterval = setInterval(() => {
      loadData();
    }, 30000); // Refresh every 30 seconds

    return () => clearInterval(refreshInterval);
  }, [loadData]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  }, [loadData]);

  // Calculate category distribution using useMemo to prevent unnecessary recalculations
  const categoryData = useMemo(() => {
    const categoryMap = new Map<string, { name: string; population: number; color: string; legendFontColor: string }>();
    
    // Initialize with all categories
    categories.forEach(category => {
      categoryMap.set(category.id, {
        name: category.name,
        population: 0,
        color: getRandomColor(),
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
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          colors={[styles.colors.tint]} 
          tintColor={styles.colors.tint}
          title="Refreshing..."
          titleColor={styles.colors.tabIconDefault}
        />
      }
    >
      <Text style={styles.dashboardTitle}>Dashboard</Text>
      
      {/* Category Distribution Pie Chart */}
      <View style={styles.chartContainer}>
        <Text style={styles.chartTitle}>Category Distribution</Text>
        {categoryData.length > 0 ? (
          <PieChart
            data={categoryData}
            width={Dimensions.get('window').width - 40}
            height={220}
            chartConfig={{
              backgroundColor: '#ffffff',
              backgroundGradientFrom: '#ffffff',
              backgroundGradientTo: '#ffffff',
              color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            }}
            accessor="population"
            backgroundColor="transparent"
            paddingLeft="15"
            absolute
          />
        ) : (
          <Text style={styles.noDataText}>No category data available</Text>
        )}
      </View>

      {/* Stock Level Bar Chart */}
      <View style={styles.chartContainer}>
        <Text style={styles.chartTitle}>Stock Levels</Text>
        {stockData.labels.length > 0 ? (
          <BarChart
            data={stockData}
            width={Dimensions.get('window').width - 40}
            height={220}
            yAxisLabel=""
            yAxisSuffix=""
            chartConfig={{
              backgroundColor: '#ffffff',
              backgroundGradientFrom: '#ffffff',
              backgroundGradientTo: '#ffffff',
              decimalPlaces: 0,
              color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
              style: {
                borderRadius: 16,
              },
            }}
            style={{
              marginVertical: 8,
              borderRadius: 16,
            }}
          />
        ) : (
          <Text style={styles.noDataText}>No stock data available</Text>
        )}
      </View>

      {/* Low Stock Items List */}
      <View style={styles.listContainer}>
        <Text style={styles.chartTitle}>Low Stock Items</Text>
        {lowStockItems.length > 0 ? (
          lowStockItems.map((item, index) => {
            const category = categories.find(cat => cat.id === item.category);
            return (
              <View key={index} style={styles.listItem}>
                <Text style={styles.itemName}>{item.name}</Text>
                <Text style={styles.stockWarning}>
                  Stock: {item.quantity} (Min: {item.lowStockThreshold || 10})
                </Text>
                {category && (
                  <Text style={styles.categoryText}>Category: {category.name}</Text>
                )}
              </View>
            );
          })
        ) : (
          <Text style={styles.noDataText}>No low stock items</Text>
        )}
      </View>
    </ScrollView>
  );
}

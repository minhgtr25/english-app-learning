import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, TextInput, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');
const COLUMN_WIDTH = (width - 48) / 2;

const DUMMY_PRODUCTS = [
  {
    id: '1',
    name: 'Air Max Horizon',
    category: '',
    price: '2,499,000đ',
    rating: 4.8,
    reviews: 124,
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&q=80',
  },
  {
    id: '2',
    name: 'Minimalist Chrono Watch',
    category: 'Phụ kiện',
    price: '3,850,000đ',
    rating: 4.9,
    reviews: 86,
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&q=80',
  },
  {
    id: '3',
    name: 'Wireless Pro Headphones',
    category: 'Điện tử',
    price: '5,200,000đ',
    rating: 4.7,
    reviews: 210,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&q=80',
  },
  {
    id: '4',
    name: 'Classic Leather Jacket',
    category: 'Thời trang',
    price: '1,890,000đ',
    rating: 4.6,
    reviews: 45,
    image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&q=80',
  },
  {
    id: '5',
    name: 'Premium Leather Wallet',
    category: 'Phụ kiện',
    price: '799,000đ',
    rating: 4.5,
    reviews: 67,
    image: 'https://images.unsplash.com/photo-1627124765135-56a300109c50?w=400&q=80',
  },
  {
    id: '6',
    name: 'Ergonomic Desk Chair',
    category: 'Nội thất',
    price: '4,500,000đ',
    rating: 4.9,
    reviews: 189,
    image: 'https://images.unsplash.com/photo-1505797149-43b0069ec26b?w=400&q=80',
  }
];

const CATEGORIES = ['Tất cả', 'Thời trang', 'Giày dép', 'Phụ kiện', 'Điện tử', 'Nội thất'];

export function ProductCatalogScreen() {
  const [selectedCategory, setSelectedCategory] = useState('Tất cả');
  const [searchQuery, setSearchQuery] = useState('');
  const [cartCount, setCartCount] = useState(0);

  const filteredProducts = DUMMY_PRODUCTS.filter(product => {
    const matchesCategory = selectedCategory === 'Tất cả' || product.category === selectedCategory;
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const renderProductItem = ({ item }) => (
    <View style={styles.productCard}>
      <Image source={{ uri: item.image }} style={styles.productImage} />
      <View style={styles.badge}>
        <Text style={styles.badgeText}>{item.category}</Text>
      </View>
      <View style={styles.infoContainer}>
        <Text style={styles.productName} numberOfLines={1}>{item.name}</Text>
        <View style={styles.ratingRow}>
          <Text style={styles.ratingText}>⭐ {item.rating}</Text>
          <Text style={styles.reviewText}>({item.reviews})</Text>
        </View>
        <Text style={styles.productPrice}>{item.price}</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => setCartCount(prev => prev + 1)}
          activeOpacity={0.8}
        >
          <Text style={styles.addButtonText}>Thêm vào giỏ</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerSubtitle}>Khám phá sản phẩm</Text>
          <Text style={styles.headerTitle}>MegaStore 🛍️</Text>
        </View>
        <View style={styles.cartIconContainer}>
          <Text style={styles.cartIcon}>🛒</Text>
          {cartCount > 0 && (
            <View style={styles.cartBadge}>
              <Text style={styles.cartBadgeText}>{cartCount}</Text>
            </View>
          )}
        </View>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Tìm kiếm sản phẩm..."
          placeholderTextColor="#9ca3af"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {/* Categories Horizontal List */}
      <View style={styles.categoriesContainer}>
        <FlatList
          data={CATEGORIES}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.categoryChip,
                selectedCategory === item && styles.categoryChipActive
              ]}
              onPress={() => setSelectedCategory(item)}
            >
              <Text style={[
                styles.categoryText,
                selectedCategory === item && styles.categoryTextActive
              ]}>
                {item}
              </Text>
            </TouchableOpacity>
          )}
          contentContainerStyle={styles.categoriesList}
        />
      </View>

      {/* Product Grid */}
      <FlatList
        data={filteredProducts}
        numColumns={2}
        keyExtractor={(item) => item.id}
        renderItem={renderProductItem}
        contentContainerStyle={styles.gridContainer}
        columnWrapperStyle={styles.gridRow}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>Không tìm thấy sản phẩm phù hợp 🔍</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
    paddingTop: 48,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#6b7280',
    fontWeight: '500',
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: '800',
    color: '#111827',
  },
  cartIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  cartIcon: {
    fontSize: 20,
  },
  cartBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: '#ef4444',
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cartBadgeText: {
    color: '#ffffff',
    fontSize: 11,
    fontWeight: 'bold',
  },
  searchContainer: {
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  searchInput: {
    height: 48,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 15,
    color: '#111827',
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  categoriesContainer: {
    marginBottom: 16,
  },
  categoriesList: {
    paddingHorizontal: 16,
  },
  categoryChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f3f4f6',
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  categoryChipActive: {
    backgroundColor: '#2563eb',
    borderColor: '#2563eb',
  },
  categoryText: {
    fontSize: 14,
    color: '#4b5563',
    fontWeight: '600',
  },
  categoryTextActive: {
    color: '#ffffff',
  },
  gridContainer: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  gridRow: {
    justifyContent: 'space-between',
  },
  productCard: {
    width: COLUMN_WIDTH,
    backgroundColor: '#ffffff',
    borderRadius: 16,
    marginBottom: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#f0f0f0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.03,
    shadowRadius: 10,
    elevation: 3,
  },
  productImage: {
    width: '100%',
    height: 160,
    resizeMode: 'cover',
  },
  badge: {
    position: 'absolute',
    top: 10,
    left: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  infoContainer: {
    padding: 12,
  },
  productName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: 4,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  ratingText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#d97706',
  },
  reviewText: {
    fontSize: 11,
    color: '#9ca3af',
    marginLeft: 4,
  },
  productPrice: {
    fontSize: 16,
    fontWeight: '800',
    color: '#2563eb',
    marginBottom: 12,
  },
  addButton: {
    backgroundColor: '#f0f7ff',
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#bfdbfe',
  },
  addButtonText: {
    color: '#2563eb',
    fontSize: 13,
    fontWeight: '700',
  },
  emptyState: {
    alignItems: 'center',
    paddingTop: 60,
  },
  emptyText: {
    fontSize: 15,
    color: '#6b7280',
    fontWeight: '500',
  }
});


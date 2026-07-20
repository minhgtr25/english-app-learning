import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

const PRODUCT = {
  name: 'Air Max Horizon Pro',
  category: 'Giày chạy bộ chuyên nghiệp',
  price: '2,499,000đ',
  originalPrice: '3,200,000đ',
  discount: '-22%',
  rating: 4.8,
  reviews: 124,
  description: 'Nike Air Max Horizon mang đến trải nghiệm chạy bộ êm ái vượt trội nhờ hệ thống đệm khí cải tiến trải dài toàn bộ đế giày. Chất liệu vải lưới Flyknit co giãn, ôm chân và thoáng khí tuyệt đối giúp bạn luôn thoải mái trên mọi cung đường.',
  sizes: [39, 40, 41, 42, 43],
  colors: [
    { name: 'Xanh Neon', hex: '#10b981' },
    { name: 'Đỏ Ruby', hex: '#ef4444' },
    { name: 'Đen Bóng', hex: '#1f2937' },
    { name: 'Trắng Sữa', hex: '#f3f4f6' }
  ],
  images: [
    'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=80',
    'https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?w=600&q=80',
    'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=600&q=80'
  ]
};

export function ProductDetailScreen() {
  const [selectedImage, setSelectedImage] = useState(PRODUCT.images[0]);
  const [selectedSize, setSelectedSize] = useState(PRODUCT.sizes[2]);
  const [selectedColor, setSelectedColor] = useState(PRODUCT.colors[2].name);
  const [isFavorite, setIsFavorite] = useState(false);

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Main Product Image */}
        <View style={styles.imageContainer}>
          <Image source={{ uri: selectedImage }} style={styles.mainImage} />
          
          {/* Favorite Toggle Button */}
          <TouchableOpacity 
            style={styles.favoriteButton} 
            onPress={() => setIsFavorite(prev => !prev)}
            activeOpacity={0.8}
          >
            <Text style={styles.favoriteIcon}>{isFavorite ? '❤️' : '🤍'}</Text>
          </TouchableOpacity>
        </View>

        {/* Thumbnail Carousel */}
        <View style={styles.thumbnailRow}>
          {PRODUCT.images.map((img, idx) => (
            <TouchableOpacity 
              key={idx} 
              style={[
                styles.thumbnailWrapper,
                selectedImage === img && styles.thumbnailActive
              ]}
              onPress={() => setSelectedImage(img)}
            >
              <Image source={{ uri: img }} style={styles.thumbnail} />
            </TouchableOpacity>
          ))}
        </View>

        {/* Product Details Section */}
        <View style={styles.detailsContainer}>
          <Text style={styles.categoryText}>{PRODUCT.category}</Text>
          <Text style={styles.nameText}>{PRODUCT.name}</Text>
          
          {/* Rating Section */}
          <View style={styles.ratingRow}>
            <View style={styles.starsContainer}>
              <Text style={styles.ratingText}>⭐ {PRODUCT.rating}</Text>
              <Text style={styles.reviewsText}>({PRODUCT.reviews} đánh giá)</Text>
            </View>
            <Text style={styles.soldText}>Đã bán 1.2k</Text>
          </View>

          {/* Pricing Section */}
          <View style={styles.priceRow}>
            <Text style={styles.priceText}>{PRODUCT.price}</Text>
            <Text style={styles.originalPriceText}>{PRODUCT.originalPrice}</Text>
            <View style={styles.discountBadge}>
              <Text style={styles.discountText}>{PRODUCT.discount}</Text>
            </View>
          </View>

          {/* Description */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Mô tả sản phẩm</Text>
            <Text style={styles.descriptionText}>{PRODUCT.description}</Text>
          </View>

          {/* Color Selector */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Màu sắc: <Text style={styles.selectedLabel}>{selectedColor}</Text></Text>
            <View style={styles.optionsRow}>
              {PRODUCT.colors.map((color) => (
                <TouchableOpacity
                  key={color.name}
                  style={[
                    styles.colorOption,
                    selectedColor === color.name && styles.colorOptionActive
                  ]}
                  onPress={() => setSelectedColor(color.name)}
                >
                  <View style={[styles.colorDot, { backgroundColor: color.hex }]} />
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Size Selector */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Kích thước (EU): <Text style={styles.selectedLabel}>{selectedSize}</Text></Text>
            <View style={styles.optionsRow}>
              {PRODUCT.sizes.map((size) => (
                <TouchableOpacity
                  key={size}
                  style={[
                    styles.sizeOption,
                    selectedSize === size && styles.sizeOptionActive
                  ]}
                  onPress={() => setSelectedSize(size)}
                >
                  <Text style={[
                    styles.sizeText,
                    selectedSize === size && styles.sizeTextActive
                  ]}>
                    {size}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Sticky Bottom Actions */}
      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.secondaryButton}>
          <Text style={styles.secondaryButtonText}>💬 Chat ngay</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.primaryButton}>
          <Text style={styles.primaryButtonText}>Mua ngay</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    paddingTop: 48,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  imageContainer: {
    width: width,
    height: 350,
    position: 'relative',
    backgroundColor: '#f3f4f6',
  },
  mainImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  favoriteButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  favoriteIcon: {
    fontSize: 20,
  },
  thumbnailRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 12,
    marginBottom: 8,
  },
  thumbnailWrapper: {
    width: 56,
    height: 56,
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: '#e5e7eb',
    marginHorizontal: 6,
    overflow: 'hidden',
  },
  thumbnailActive: {
    borderColor: '#2563eb',
  },
  thumbnail: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  detailsContainer: {
    paddingHorizontal: 20,
    paddingTop: 12,
  },
  categoryText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#3b82f6',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  nameText: {
    fontSize: 22,
    fontWeight: '800',
    color: '#111827',
    marginBottom: 8,
  },
  ratingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  starsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#d97706',
  },
  reviewsText: {
    fontSize: 13,
    color: '#6b7280',
    marginLeft: 6,
  },
  soldText: {
    fontSize: 13,
    color: '#4b5563',
    fontWeight: '500',
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    backgroundColor: '#eff6ff',
    padding: 12,
    borderRadius: 12,
  },
  priceText: {
    fontSize: 22,
    fontWeight: '800',
    color: '#2563eb',
  },
  originalPriceText: {
    fontSize: 14,
    color: '#9ca3af',
    textDecorationLine: 'line-through',
    marginLeft: 10,
  },
  discountBadge: {
    backgroundColor: '#fee2e2',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    marginLeft: 10,
  },
  discountText: {
    color: '#ef4444',
    fontSize: 12,
    fontWeight: 'bold',
  },
  section: {
    borderTopWidth: 1,
    borderTopColor: '#f3f4f6',
    paddingVertical: 16,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: 10,
  },
  selectedLabel: {
    fontWeight: '500',
    color: '#6b7280',
  },
  descriptionText: {
    fontSize: 14,
    color: '#4b5563',
    lineHeight: 22,
  },
  optionsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  colorOption: {
    width: 38,
    height: 38,
    borderRadius: 19,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
    marginRight: 12,
  },
  colorOptionActive: {
    borderColor: '#2563eb',
  },
  colorDot: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 0.5,
    borderColor: '#d1d5db',
  },
  sizeOption: {
    width: 46,
    height: 38,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#d1d5db',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
    marginBottom: 6,
  },
  sizeOptionActive: {
    backgroundColor: '#2563eb',
    borderColor: '#2563eb',
  },
  sizeText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#4b5563',
  },
  sizeTextActive: {
    color: '#ffffff',
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 80,
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    flexDirection: 'row',
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  secondaryButton: {
    flex: 1,
    height: 48,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#d1d5db',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  secondaryButtonText: {
    color: '#374151',
    fontWeight: '700',
    fontSize: 14,
  },
  primaryButton: {
    flex: 2,
    height: 48,
    backgroundColor: '#2563eb',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  primaryButtonText: {
    color: '#ffffff',
    fontWeight: '700',
    fontSize: 15,
  }
});


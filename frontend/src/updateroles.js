import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, TextInput, Alert } from 'react-native';

const INITIAL_CART = [
  {
    id: '1',
    name: 'Air Max Horizon Pro',
    category: 'Giày dép',
    price: 2499000,
    quantity: 1,
    size: 41,
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=200&q=80',
  },
  {
    id: '3',
    name: 'Wireless Pro Headphones',
    category: 'Điện tử',
    price: 5200000,
    quantity: 2,
    size: 'Tiêu chuẩn',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200&q=80',
  }
];

export function CartScreen() {
  const [cartItems, setCartItems] = useState(INITIAL_CART);
  const [promoCode, setPromoCode] = useState('');
  const [discountPercent, setDiscountPercent] = useState(0);

  const formatPrice = (value) => {
    return value.toLocaleString('vi-VN') + 'đ';
  };

  const updateQuantity = (id, amount) => {
    setCartItems(prev => prev.map(item => {
      if (item.id === id) {
        const newQty = item.quantity + amount;
        return { ...item, quantity: newQty > 0 ? newQty : 1 };
      }
      return item;
    }));
  };

  const removeItem = (id) => {
    setCartItems(prev => prev.filter(item => item.id !== id));
  };

  const applyPromo = () => {
    if (promoCode.toUpperCase() === 'MEGASALE') {
      setDiscountPercent(0.1); // 10% discount
      Alert.alert('Thành công', 'Đã áp dụng mã giảm giá 10%!');
    } else {
      Alert.alert('Thất bại', 'Mã giảm giá không hợp lệ.');
    }
  };

  // Calculations
  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const discount = subtotal * discountPercent;
  const shipping = subtotal > 5000000 ? 0 : 30000;
  const total = subtotal - discount + shipping;

  const renderCartItem = ({ item }) => (
    <View style={styles.cartItem}>
      <Image source={{ uri: item.image }} style={styles.itemImage} />
      <View style={styles.itemDetails}>
        <Text style={styles.itemName} numberOfLines={1}>{item.name}</Text>
        <Text style={styles.itemMeta}>Phân loại: {item.size}</Text>
        <Text style={styles.itemPrice}>{formatPrice(item.price)}</Text>
        
        {/* Quantity Controls */}
        <View style={styles.quantityRow}>
          <View style={styles.counter}>
            <TouchableOpacity 
              style={styles.counterBtn} 
              onPress={() => updateQuantity(item.id, -1)}
            >
              <Text style={styles.counterBtnText}>-</Text>
            </TouchableOpacity>
            <Text style={styles.counterValue}>{item.quantity}</Text>
            <TouchableOpacity 
              style={styles.counterBtn} 
              onPress={() => updateQuantity(item.id, 1)}
            >
              <Text style={styles.counterBtnText}>+</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity onPress={() => removeItem(item.id)}>
            <Text style={styles.deleteText}>Xóa</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Giỏ hàng của tôi 🛒</Text>
        <Text style={styles.itemCount}>{cartItems.length} sản phẩm</Text>
      </View>

      {/* Cart Items List */}
      <FlatList
        data={cartItems}
        keyExtractor={(item) => item.id}
        renderItem={renderCartItem}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>🛍️</Text>
            <Text style={styles.emptyText}>Giỏ hàng của bạn đang trống.</Text>
          </View>
        }
      />

      {cartItems.length > 0 && (
        <View style={styles.footer}>
          {/* Promo Code Input */}
          <View style={styles.promoContainer}>
            <TextInput
              style={styles.promoInput}
              placeholder="Nhập mã giảm giá (Thử: MEGASALE)"
              placeholderTextColor="#9ca3af"
              value={promoCode}
              onChangeText={setPromoCode}
            />
            <TouchableOpacity style={styles.promoBtn} onPress={applyPromo}>
              <Text style={styles.promoBtnText}>Áp dụng</Text>
            </TouchableOpacity>
          </View>

          {/* Pricing Summary */}
          <View style={styles.summaryContainer}>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Tạm tính</Text>
              <Text style={styles.summaryVal}>{formatPrice(subtotal)}</Text>
            </View>
            {discount > 0 && (
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Giảm giá (10%)</Text>
                <Text style={[styles.summaryVal, styles.discountText]}>-{formatPrice(discount)}</Text>
              </View>
            )}
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Phí vận chuyển</Text>
              <Text style={styles.summaryVal}>
                {shipping === 0 ? 'Miễn phí' : formatPrice(shipping)}
              </Text>
            </View>
            <View style={[styles.summaryRow, styles.totalRow]}>
              <Text style={styles.totalLabel}>Tổng cộng</Text>
              <Text style={styles.totalVal}>{formatPrice(total)}</Text>
            </View>
          </View>

          {/* Checkout Button */}
          <TouchableOpacity 
            style={styles.checkoutBtn}
            onPress={() => Alert.alert('Thanh toán', 'Chuyển đến trang thanh toán...')}
          >
            <Text style={styles.checkoutBtnText}>Tiến hành thanh toán</Text>
          </TouchableOpacity>
        </View>
      )}
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
    alignItems: 'baseline',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#111827',
  },
  itemCount: {
    fontSize: 14,
    color: '#6b7280',
    fontWeight: '500',
  },
  listContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  cartItem: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  itemImage: {
    width: 88,
    height: 88,
    borderRadius: 12,
    resizeMode: 'cover',
  },
  itemDetails: {
    flex: 1,
    marginLeft: 16,
    justifyContent: 'space-between',
  },
  itemName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1f2937',
  },
  itemMeta: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 2,
  },
  itemPrice: {
    fontSize: 15,
    fontWeight: '800',
    color: '#2563eb',
    marginTop: 4,
  },
  quantityRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  counter: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f3f4f6',
    borderRadius: 8,
    paddingHorizontal: 4,
  },
  counterBtn: {
    width: 28,
    height: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  counterBtnText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4b5563',
  },
  counterValue: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1f2937',
    paddingHorizontal: 12,
  },
  deleteText: {
    color: '#ef4444',
    fontSize: 13,
    fontWeight: '600',
  },
  footer: {
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 10,
  },
  promoContainer: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  promoInput: {
    flex: 1,
    height: 44,
    backgroundColor: '#f3f4f6',
    borderRadius: 10,
    paddingHorizontal: 12,
    fontSize: 13,
    color: '#1f2937',
    marginRight: 10,
  },
  promoBtn: {
    backgroundColor: '#1f2937',
    paddingHorizontal: 16,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  promoBtnText: {
    color: '#ffffff',
    fontWeight: '700',
    fontSize: 13,
  },
  summaryContainer: {
    marginBottom: 20,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 4,
  },
  summaryLabel: {
    fontSize: 14,
    color: '#6b7280',
  },
  summaryVal: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1f2937',
  },
  discountText: {
    color: '#10b981',
  },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: '#f3f4f6',
    paddingTop: 12,
    marginTop: 8,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '800',
    color: '#111827',
  },
  totalVal: {
    fontSize: 18,
    fontWeight: '800',
    color: '#2563eb',
  },
  checkoutBtn: {
    backgroundColor: '#2563eb',
    height: 50,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkoutBtnText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '700',
  },
  emptyState: {
    alignItems: 'center',
    paddingTop: 80,
  },
  emptyIcon: {
    fontSize: 50,
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 15,
    color: '#6b7280',
    fontWeight: '500',
  }
});


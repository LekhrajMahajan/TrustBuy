import React, { createContext, useState, useContext, useEffect } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  // ✅ Initialize state directly from Local Storage to prevent overwriting on first render
  const [cartItems, setCartItems] = useState(() => {
    try {
      const savedCart = localStorage.getItem('cartItems');
      return savedCart ? JSON.parse(savedCart) : [];
    } catch (error) {
      console.error("Cart corrupt", error);
      return [];
    }
  });

  // Save to Local Storage whenever cart changes
  useEffect(() => {
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
  }, [cartItems]);

  // 1. Add to Cart
  const addToCart = (product) => {
    if (!product || !product._id) return; // Safety check
    setCartItems((prevItems) => {
      const existItem = prevItems.find((x) => x._id === product._id);
      if (existItem) {
        return prevItems.map((x) =>
          x._id === product._id ? { ...x, qty: x.qty + 1 } : x
        );
      } else {
        return [...prevItems, { ...product, qty: 1 }];
      }
    });
  };

  // 2. Remove from Cart
  const removeFromCart = (id) => {
    setCartItems((prevItems) => prevItems.filter((x) => x._id !== id));
  };

  // 3. Update Quantity
  const updateQty = (id, quantity) => {
    setCartItems((prevItems) =>
      prevItems.map((x) =>
        x._id === id ? { ...x, qty: Math.max(1, quantity) } : x
      )
    );
  };

  // 4. Clear Cart
  const clearCart = () => setCartItems([]);

  // Calulations with safeguards
  const itemsPrice = cartItems.reduce((acc, item) => {
    const price = Number(item?.currentPrice) || 0;
    const qty = Number(item?.qty) || 0;
    return acc + price * qty;
  }, 0);

  const taxPrice = itemsPrice * 0.18;
  const shippingPrice = itemsPrice > 1000 ? 0 : 100;
  const totalPrice = itemsPrice + taxPrice + shippingPrice;

  const cartCount = cartItems.reduce((acc, item) => {
    const qty = Number(item?.qty) || 0;
    return acc + qty;
  }, 0);

  return (
    <CartContext.Provider value={{
      cartItems,
      addToCart,
      removeFromCart,
      updateQty,
      clearCart,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
      cartCount
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
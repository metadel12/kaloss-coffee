import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import {
    buildCartSummary,
    normalizeCartProduct,
    validateCodAvailability,
} from '../utils/cart';

const CartContext = createContext();

const STORAGE_KEY = 'kalossCartState';

const defaultCheckoutState = {
    discountCode: '',
    shippingAddress: {
        fullName: '',
        email: '',
        phone: '',
        alternativePhone: '',
        region: 'Addis Ababa',
        subCity: 'Bole',
        houseNumber: '',
        landmark: '',
        deliveryInstructions: '',
    },
    deliveryOption: 'standard',
    paymentMethod: '',
};

const getInitialState = () => {
    if (typeof window === 'undefined') {
        return { cart: [], savedItems: [], checkoutState: defaultCheckoutState };
    }

    try {
        const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
        return {
            cart: parsed.cart || [],
            savedItems: parsed.savedItems || [],
            checkoutState: { ...defaultCheckoutState, ...(parsed.checkoutState || {}) },
        };
    } catch (error) {
        console.warn('Ignoring invalid cart storage:', error);
        return { cart: [], savedItems: [], checkoutState: defaultCheckoutState };
    }
};

export function CartProvider({ children }) {
    const [cart, setCart] = useState([]);
    const [savedItems, setSavedItems] = useState([]);
    const [checkoutState, setCheckoutState] = useState(defaultCheckoutState);

    useEffect(() => {
        const initialState = getInitialState();
        setCart(initialState.cart);
        setSavedItems(initialState.savedItems);
        setCheckoutState(initialState.checkoutState);
    }, []);

    useEffect(() => {
        if (typeof window === 'undefined') return;
        localStorage.setItem(STORAGE_KEY, JSON.stringify({ cart, savedItems, checkoutState }));
    }, [cart, savedItems, checkoutState]);

    const addToCart = (product, quantity = 1, variant = null) => {
        const normalized = normalizeCartProduct(product, quantity, variant);

        setCart(previous => {
            const existing = previous.find(item => item.cartKey === normalized.cartKey);
            if (existing) {
                return previous.map(item => item.cartKey === normalized.cartKey
                    ? { ...item, quantity: Math.min(item.quantity + quantity, item.stock || item.quantity + quantity) }
                    : item);
            }

            return [...previous, normalized];
        });
    };

    const removeFromCart = cartKey => setCart(previous => previous.filter(item => item.cartKey !== cartKey));

    const updateQuantity = (cartKey, quantity) => {
        if (quantity <= 0) {
            removeFromCart(cartKey);
        } else {
            setCart(previous => previous.map(item => item.cartKey === cartKey
                ? { ...item, quantity: Math.min(quantity, item.stock || quantity) }
                : item));
        }
    };

    const updateCartItem = (cartKey, updates) => {
        setCart(previous => previous.map(item => item.cartKey === cartKey ? { ...item, ...updates } : item));
    };

    const toggleSelectItem = (cartKey, selected) => {
        updateCartItem(cartKey, { selected });
    };

    const selectAllItems = selected => {
        setCart(previous => previous.map(item => ({ ...item, selected })));
    };

    const removeSelected = () => {
        setCart(previous => previous.filter(item => !item.selected));
    };

    const saveForLater = cartKey => {
        setCart(previous => {
            const item = previous.find(entry => entry.cartKey === cartKey);
            if (!item) return previous;

            setSavedItems(saved => {
                if (saved.some(entry => entry.cartKey === cartKey)) return saved;
                return [...saved, { ...item, selected: false }];
            });

            return previous.filter(entry => entry.cartKey !== cartKey);
        });
    };

    const moveSelectedToSaved = () => {
        setCart(previous => {
            const selectedItems = previous.filter(item => item.selected);
            if (!selectedItems.length) return previous;
            setSavedItems(saved => [...saved, ...selectedItems.map(item => ({ ...item, selected: false }))]);
            return previous.filter(item => !item.selected);
        });
    };

    const moveToCart = cartKey => {
        setSavedItems(previous => {
            const item = previous.find(entry => entry.cartKey === cartKey);
            if (!item) return previous;
            setCart(cartItems => {
                if (cartItems.some(entry => entry.cartKey === cartKey)) return cartItems;
                return [...cartItems, { ...item, selected: false }];
            });
            return previous.filter(entry => entry.cartKey !== cartKey);
        });
    };

    const setDiscountCode = discountCode => {
        setCheckoutState(previous => ({ ...previous, discountCode }));
    };

    const updateShippingAddress = updates => {
        setCheckoutState(previous => ({
            ...previous,
            shippingAddress: { ...previous.shippingAddress, ...updates },
        }));
    };

    const setDeliveryOption = deliveryOption => {
        setCheckoutState(previous => ({ ...previous, deliveryOption }));
    };

    const setPaymentMethod = paymentMethod => {
        setCheckoutState(previous => ({ ...previous, paymentMethod }));
    };

    const summary = useMemo(() => buildCartSummary({
        cart,
        discountCode: checkoutState.discountCode,
        shippingAddress: checkoutState.shippingAddress,
        deliveryOption: checkoutState.deliveryOption,
        paymentMethod: checkoutState.paymentMethod,
    }), [cart, checkoutState]);

    const clearCart = () => setCart([]);
    const resetCheckout = () => setCheckoutState(defaultCheckoutState);
    const getCartTotal = () => summary.totalETB;
    const getCartItemsCount = () => cart.reduce((count, item) => count + item.quantity, 0);
    const getSelectedCount = () => cart.reduce((count, item) => count + (item.selected ? 1 : 0), 0);
    const isCodAvailable = () => validateCodAvailability(checkoutState.shippingAddress);

    return (
        <CartContext.Provider value={{
            cart,
            savedItems,
            checkoutState,
            summary,
            addToCart,
            removeFromCart,
            updateQuantity,
            updateCartItem,
            toggleSelectItem,
            selectAllItems,
            removeSelected,
            saveForLater,
            moveSelectedToSaved,
            moveToCart,
            setDiscountCode,
            updateShippingAddress,
            setDeliveryOption,
            setPaymentMethod,
            clearCart,
            resetCheckout,
            getCartTotal,
            getCartItemsCount,
            getSelectedCount,
            isCodAvailable,
        }}>
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    return useContext(CartContext);
}

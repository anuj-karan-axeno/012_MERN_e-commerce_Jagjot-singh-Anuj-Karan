import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import FooterSection from '../components/home/FooterSection';
import { useCart } from '../hooks/CartContext';
import { useAuth } from '../hooks/AuthContext';
import OrderConfirmationModal from '../components/cart/OrderConfirmationModal';
import { Tag } from 'lucide-react';
import { toast } from 'react-toast';

import chevronRightIcon from '../assests/icons/chevron_right.svg';
import rightArrowWhiteIcon from '../assests/icons/right-arrow-big-white.svg';
import trashIcon from '../assests/icons/trash_icon.svg';

const AVAILABLE_COUPONS = [
    { code: 'SHOP20', discount: 20, label: '20% OFF' },
    { code: 'SHOP10', discount: 10, label: '10% OFF' },
    { code: 'SAVE30', discount: 30, label: '30% OFF' },
    { code: 'WELCOME15', discount: 15, label: '15% OFF' },
];

const CartPage = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const { cartItems, removeFromCart, increaseQuantity, decreaseQuantity, clearCart, cartSubtotal } = useCart();

    const [promoCode, setPromoCode] = useState('');
    const [appliedCoupon, setAppliedCoupon] = useState(null);
    const [discountPercent, setDiscountPercent] = useState(0);
    const [promoError, setPromoError] = useState('');
    const [showCheckoutModal, setShowCheckoutModal] = useState(false);

    const deliveryFee = cartSubtotal > 0 ? (cartSubtotal >= 1000 ? 0 : 50) : 0;
    const discountAmount = Math.round(cartSubtotal * (discountPercent / 100));
    const totalAmount = Math.max(0, cartSubtotal - discountAmount + deliveryFee);

    const handleApplyPromo = (explicitCode) => {
        if (cartItems.length === 0) return;
        const codeToTest = (typeof explicitCode === 'string' ? explicitCode : promoCode).trim().toUpperCase();
        if (!codeToTest) {
            setPromoError('Please enter a promo code');
            return;
        }

        const foundCoupon = AVAILABLE_COUPONS.find(c => c.code === codeToTest);
        if (foundCoupon) {
            setAppliedCoupon(foundCoupon);
            setDiscountPercent(foundCoupon.discount);
            setPromoCode('');
            setPromoError('');
            toast.success(`Coupon "${foundCoupon.code}" applied! ${foundCoupon.discount}% discount.`);
            return;
        }

        if (codeToTest === 'DISCOUNT20') {
            const aliasCoupon = { code: 'DISCOUNT20', discount: 20, label: '20% OFF' };
            setAppliedCoupon(aliasCoupon);
            setDiscountPercent(20);
            setPromoCode('');
            setPromoError('');
            toast.success('Coupon "DISCOUNT20" applied! 20% discount.');
            return;
        }

        setPromoError('Invalid promo code. Try "SHOP20", "SAVE30", "WELCOME15", or "SHOP10"');
        toast.error('Invalid promo code.');
    };

    const handleRemoveCoupon = () => {
        if (appliedCoupon) {
            toast.info(`Coupon "${appliedCoupon.code}" removed.`);
        }
        setAppliedCoupon(null);
        setDiscountPercent(0);
        setPromoCode('');
        setPromoError('');
    };

    const handleCheckout = () => {
        if (cartItems.length === 0) return;
        if (!user) {
            navigate('/login?redirect=/cart');
            return;
        }
        setShowCheckoutModal(true);
    };

    return (
        <div className="cart-page">
            <Navbar />

            <div className="cart-page-container">
                <nav className="breadcrumb" aria-label="Breadcrumb">
                    <ul className="breadcrumb__list">
                        <li className="breadcrumb__item">
                            <Link to="/" style={{ color: 'inherit', textDecoration: 'none' }}>
                                Home
                            </Link>
                            <img src={chevronRightIcon} alt="chevron_right" />
                        </li>
                        <li className="breadcrumb__item breadcrumb__item--current" aria-current="page">
                            Cart
                        </li>
                    </ul>
                </nav>

                <section className="cart">
                    <h1 className="cart__title">YOUR CART</h1>

                    <div className="cart__layout">
                        <ul className="cart__items">
                            {cartItems.length === 0 ? (
                                <li style={{ textAlign: 'center', padding: '3.5rem 1rem' }}>
                                    <p style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem', color: '#000' }}>
                                        Your cart is empty
                                    </p>
                                    <p style={{ color: '#777', marginBottom: '1.5rem' }}>
                                        Add some items to your cart to see them here.
                                    </p>
                                    <Link
                                        to="/"
                                        className="button button--primary"
                                        style={{ display: 'inline-block', textDecoration: 'none' }}
                                    >
                                        Explore Products
                                    </Link>
                                </li>
                            ) : (
                                cartItems.map((item) => (
                                    <li
                                        key={`${item.productId}-${item.size}-${item.color || ''}`}
                                        className="cart-item"
                                    >
                                        <img
                                            src={item.thumbnailImage || '/assests/images/placeholder.png'}
                                            alt={item.name}
                                            className="cart-item__image"
                                        />

                                        <div className="cart-item__content">
                                            <div className="cart-item__top">
                                                <div className="cart-item__details">
                                                    <h3 className="cart-item__name">{item.name}</h3>
                                                    <p className="cart-item__meta">
                                                        Size: <span className="cart-item__meta-value">{item.size}</span>
                                                    </p>
                                                    {item.color && (
                                                        <p className="cart-item__meta">
                                                            Color: <span className="cart-item__meta-value">{item.color}</span>
                                                        </p>
                                                    )}
                                                </div>

                                                <button
                                                    type="button"
                                                    className="cart-item__remove"
                                                    aria-label={`Remove ${item.name} from cart`}
                                                    style={{ cursor: 'pointer' }}
                                                    onClick={() => removeFromCart(item.productId, item.size, item.color)}
                                                >
                                                    <img
                                                        src={trashIcon}
                                                        alt="Remove"
                                                        className="cart-item__remove-icon"
                                                        style={{ cursor: 'pointer' }}
                                                    />
                                                </button>
                                            </div>

                                            <div className="cart-item__bottom">
                                                <p className="cart-item__price">₹{Number(item.price) || 0}</p>

                                                <div className="quantity-selector">
                                                    <button
                                                        type="button"
                                                        className="quantity-selector__button quantity-selector__button--decrease"
                                                        aria-label="Decrease quantity"
                                                        onClick={() => decreaseQuantity(item.productId, item.size, item.color)}
                                                    >
                                                        −
                                                    </button>
                                                    <span className="quantity-selector__value">{item.quantity}</span>
                                                    <button
                                                        type="button"
                                                        className="quantity-selector__button quantity-selector__button--increase"
                                                        aria-label="Increase quantity"
                                                        onClick={() => increaseQuantity(item.productId, item.size, item.color)}
                                                    >
                                                        +
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </li>
                                ))
                            )}
                        </ul>

                        <aside className="order-summary">
                            <h2 className="order-summary__title">Order Summary</h2>

                            <div className="order-summary__row">
                                <span className="order-summary__label">Subtotal</span>
                                <span className="order-summary__value order-summary__subtotal">
                                    ₹{cartSubtotal}
                                </span>
                            </div>

                            {discountPercent > 0 && (
                                <div className="order-summary__row order-summary__discount-row">
                                    <span className="order-summary__label">
                                        Discount (-<span className="order-summary__discount-percent">{discountPercent}</span>%)
                                    </span>
                                    <span className="order-summary__value order-summary__value--discount order-summary__discount-amount">
                                        -₹{discountAmount}
                                    </span>
                                </div>
                            )}

                            <div className="order-summary__row">
                                <span className="order-summary__label">Delivery Fee</span>
                                <span className="order-summary__value order-summary__delivery">
                                    {cartSubtotal === 0 ? '₹0' : deliveryFee === 0 ? 'Free' : `₹${deliveryFee}`}
                                </span>
                            </div>

                            <hr className="order-summary__divider" />

                            <div className="order-summary__row order-summary__row--total">
                                <span className="order-summary__label">Total</span>
                                <span className="order-summary__value order-summary__total">
                                    ₹{totalAmount}
                                </span>
                            </div>

                            {appliedCoupon ? (
                                <div className="order-summary__applied-box">
                                    <div className="order-summary__applied-info">
                                        <Tag size={15} className="order-summary__applied-icon" />
                                        <span className="order-summary__applied-code">{appliedCoupon.code}</span>
                                        <span className="order-summary__applied-discount">(-{appliedCoupon.discount}%)</span>
                                    </div>
                                    <button
                                        type="button"
                                        className="order-summary__remove-btn"
                                        onClick={handleRemoveCoupon}
                                        aria-label="Remove coupon"
                                    >
                                        Remove
                                    </button>
                                </div>
                            ) : (
                                <>
                                    <div className="order-summary__coupons-row">
                                        <span className="order-summary__coupons-label">Coupons:</span>
                                        <div className="order-summary__coupons-tags">
                                            {AVAILABLE_COUPONS.map((c) => (
                                                <button
                                                    key={c.code}
                                                    type="button"
                                                    className="order-summary__coupon-tag"
                                                    onClick={() => handleApplyPromo(c.code)}
                                                    disabled={cartItems.length === 0}
                                                    title={`Apply ${c.code}`}
                                                >
                                                    {c.code} <span className="order-summary__coupon-tag-off">-{c.discount}%</span>
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="order-summary__promo">
                                        <input
                                            type="text"
                                            placeholder="Add promo code"
                                            className="order-summary__promo-input"
                                            value={promoCode}
                                            onChange={(e) => setPromoCode(e.target.value)}
                                            disabled={cartItems.length === 0}
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter' && cartItems.length > 0) handleApplyPromo();
                                            }}
                                        />
                                        <button
                                            type="button"
                                            className="order-summary__promo-button"
                                            disabled={cartItems.length === 0}
                                            onClick={() => handleApplyPromo()}
                                        >
                                            Apply
                                        </button>
                                    </div>
                                    {promoError && <p className="order-summary__promo-error">{promoError}</p>}
                                </>
                            )}

                            <button
                                type="button"
                                className="order-summary__checkout"
                                disabled={cartItems.length === 0}
                                style={cartItems.length === 0 ? { opacity: 0.6, cursor: 'not-allowed' } : {}}
                                onClick={handleCheckout}
                            >
                                Go to Checkout
                                <img src={rightArrowWhiteIcon} alt="" />
                            </button>
                        </aside>
                    </div>
                </section>
            </div>

            <FooterSection />

            <OrderConfirmationModal
                isOpen={showCheckoutModal}
                onClose={() => setShowCheckoutModal(false)}
                deliveryFee={deliveryFee}
                discountAmount={discountAmount}
                totalAmount={totalAmount}
            />
        </div>
    );
};

export default CartPage;

import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/AuthContext';
import { useCart } from '../hooks/CartContext';
import brandLogo from '../assests/icons/brand_logo.svg';
import blackSearchIcon from '../assests/icons/black_search_icon.svg';
import cartIcon from '../assests/icons/cart_icon.svg';
import profileIcon from '../assests/icons/profile_icon.svg';
import cancelIcon from '../assests/icons/cancel_icon.svg';
import hamburgerIcon from '../assests/icons/hamburger_icon.svg';
import chevronDownIcon from '../assests/icons/chevron_down_icon.svg';
import NavbarSearch from './NavbarSearch';

export const Navbar = () => {
    const { user } = useAuth();
    const { cartCount } = useCart();
    const [showOffer, setShowOffer] = useState(true);
    const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);

    return (
        <header className="navbar">
            {showOffer && (
                <div className="navbar__offer">
                    <div />
                    <p>
                        Sign up and get 20% off to your first order.{' '}
                        <Link to="/register" className="navbar__offer-highlight">
                            Sign Up Now
                        </Link>
                    </p>
                    <img
                        src={cancelIcon}
                        alt="Close offer"
                        className="navbar__offer-cancel"
                        onClick={() => setShowOffer(false)}
                    />
                </div>
            )}

            <div className="navbar__container">
                <div className="navbar__group">
                    <img src={hamburgerIcon} alt="Menu" className="navbar__menu" />
                    <Link to="/" className="navbar__brand-link">
                        <img src={brandLogo} alt="SHOP.CO" className="navbar__brand-logo" />
                    </Link>
                </div>

                <ul className="navbar__links">
                    <li className="navbar__links-item">
                        <Link to="/shop" className="navbar__links-link">
                            Shop <img src={chevronDownIcon} alt="" className="navbar__links-icon" />
                        </Link>
                    </li>

                    <li className="navbar__links-item">
                        <a href="#on-sale" className="navbar__links-link">
                            On Sale
                        </a>
                    </li>

                    <li className="navbar__links-item">
                        <a href="#new-arrivals" className="navbar__links-link">
                            New Arrivals
                        </a>
                    </li>

                    <li className="navbar__links-item">
                        <a href="#brands" className="navbar__links-link">
                            Brands
                        </a>
                    </li>

                    {user?.role === 'admin' && (
                        <li className="navbar__links-item">
                            <Link to="/admin" className="navbar__links-link" style={{ fontWeight: 700 }}>
                                Admin Portal
                            </Link>
                        </li>
                    )}
                </ul>

                <NavbarSearch />

                <div className="navbar__group">
                    <button
                        type="button"
                        className="navbar__cart-profile__search"
                        aria-label="Search"
                        onClick={() => setIsMobileSearchOpen((prev) => !prev)}
                    >
                        <img src={blackSearchIcon} alt="Search" />
                    </button>
                    <Link to="/cart" aria-label="Cart" style={{ position: 'relative' }}>
                        <img src={cartIcon} alt="Cart" />
                        {cartCount > 0 && (
                            <span
                                style={{
                                    position: 'absolute',
                                    top: '-6px',
                                    right: '-8px',
                                    backgroundColor: '#000',
                                    color: '#fff',
                                    fontSize: '0.65rem',
                                    fontWeight: 700,
                                    borderRadius: '50%',
                                    minWidth: '16px',
                                    height: '16px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    padding: '0 3px',
                                }}
                            >
                                {cartCount}
                            </span>
                        )}
                    </Link>
                    <Link
                        to={user ? '/profile' : '/login'}
                        className="navbar__profile-link"
                        aria-label="Profile"
                        title={user ? `${user.name} - View Profile` : 'Login'}
                    >
                        <img src={profileIcon} alt="Profile" />
                    </Link>
                </div>
            </div>

            {isMobileSearchOpen && (
                <div className="navbar__mobile-search-bar">
                    <NavbarSearch isMobile onCloseMobile={() => setIsMobileSearchOpen(false)} />
                </div>
            )}
        </header>
    );
};

export default Navbar;

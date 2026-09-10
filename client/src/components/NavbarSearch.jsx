import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { X, Loader2, Package } from 'lucide-react';
import searchIcon from '../assests/icons/search_icon.svg';
import api from '../lib/api';

export const NavbarSearch = ({ isMobile = false, onCloseMobile }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [debouncedTerm, setDebouncedTerm] = useState('');
    const [results, setResults] = useState([]);
    const [totalCount, setTotalCount] = useState(0);
    const [loading, setLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);

    const searchRef = useRef(null);
    const inputRef = useRef(null);
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    useEffect(() => {
        const query = searchParams.get('search');
        if (!query) {
            if (searchTerm) setSearchTerm('');
        } else if (query !== searchTerm) {
            setSearchTerm(query);
        }
    }, [searchParams]);

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedTerm(searchTerm.trim());
        }, 300);

        return () => clearTimeout(timer);
    }, [searchTerm]);

    useEffect(() => {
        if (!debouncedTerm) {
            setResults([]);
            setTotalCount(0);
            setLoading(false);
            return;
        }

        const controller = new AbortController();
        setLoading(true);

        api.get('/products', {
            params: {
                search: debouncedTerm,
                limit: 6,
            },
            signal: controller.signal,
        })
            .then((res) => {
                if (res.data?.success) {
                    const data = res.data.data;
                    const rawItems = Array.isArray(data) ? data : (data.products || []);
                    const items = rawItems.filter(p => !p.status || p.status === 'active');
                    const total = data.pagination?.totalProducts ?? items.length;
                    setResults(items);
                    setTotalCount(total);
                    setIsOpen(true);
                }
            })
            .catch((err) => {
                if (err.name !== 'CanceledError' && err.code !== 'ERR_CANCELED') {
                    setResults([]);
                    setTotalCount(0);
                }
            })
            .finally(() => {
                setLoading(false);
            });

        return () => {
            controller.abort();
        };
    }, [debouncedTerm]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (searchRef.current && !searchRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleClear = () => {
        setSearchTerm('');
        setDebouncedTerm('');
        setResults([]);
        setTotalCount(0);
        setIsOpen(false);
        inputRef.current?.focus();
    };

    const handleSelectProduct = (productId) => {
        setIsOpen(false);
        if (onCloseMobile) onCloseMobile();
        navigate(`/product/${productId}`);
    };

    const handleViewAll = () => {
        if (!searchTerm.trim()) return;
        setIsOpen(false);
        if (onCloseMobile) onCloseMobile();
        navigate(`/shop?search=${encodeURIComponent(searchTerm.trim())}`);
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Escape') {
            setIsOpen(false);
        } else if (e.key === 'Enter') {
            e.preventDefault();
            handleViewAll();
        }
    };

    const getThumbnail = (product) => {
        return (
            product.thumbnailImage ||
            (Array.isArray(product.galleryImages) && product.galleryImages[0]) ||
            ''
        );
    };

    const getPrice = (product) => {
        const price = Number(product.price) || 0;
        const discountPrice = Number(product.discountPrice);
        const discountPercentage = Number(product.discountPercentage);

        if (discountPrice > 0 && discountPrice < price) {
            return { current: discountPrice, original: price };
        }
        if (discountPercentage > 0 && price > 0) {
            const calculated = Math.round(price * (1 - discountPercentage / 100));
            return { current: calculated, original: price };
        }
        return { current: price, original: null };
    };

    const getCategoryName = (product) => {
        if (Array.isArray(product.category) && product.category.length > 0) {
            const cat = product.category[0];
            return typeof cat === 'object' ? cat.name : cat;
        }
        if (product.category && typeof product.category === 'object') {
            return product.category.name;
        }
        if (typeof product.category === 'string') {
            return product.category;
        }
        return '';
    };

    return (
        <div
            ref={searchRef}
            className={`navbar__search-wrapper ${isMobile ? 'navbar__search-wrapper--mobile' : ''}`}
        >
            <div className="navbar__search">
                <img src={searchIcon} alt="Search" className="navbar__search-icon" />
                <input
                    ref={inputRef}
                    type="text"
                    value={searchTerm}
                    onChange={(e) => {
                        setSearchTerm(e.target.value);
                        if (!isOpen && e.target.value.trim()) setIsOpen(true);
                    }}
                    onFocus={() => {
                        if (searchTerm.trim() && (results.length > 0 || loading)) {
                            setIsOpen(true);
                        }
                    }}
                    onKeyDown={handleKeyDown}
                    placeholder="Search for products..."
                    className="navbar__search-input"
                />

                {loading ? (
                    <Loader2 size={16} className="navbar__search-spinner" />
                ) : searchTerm ? (
                    <button
                        type="button"
                        onClick={handleClear}
                        className="navbar__search-clear"
                        aria-label="Clear search"
                    >
                        <X size={15} />
                    </button>
                ) : null}
            </div>

            {isOpen && debouncedTerm && (
                <div className="navbar__search-dropdown">
                    {loading && results.length === 0 ? (
                        <div className="navbar__search-status">
                            <Loader2 size={18} className="navbar__search-spinner" />
                            <span>Searching for &quot;{debouncedTerm}&quot;...</span>
                        </div>
                    ) : results.length > 0 ? (
                        <>
                            <div className="navbar__search-results">
                                {results.map((product) => {
                                    const thumb = getThumbnail(product);
                                    const priceInfo = getPrice(product);
                                    const categoryName = getCategoryName(product);

                                    return (
                                        <div
                                            key={product._id}
                                            onClick={() => handleSelectProduct(product._id)}
                                            className="navbar__search-item"
                                        >
                                            <div className="navbar__search-item-thumb">
                                                {thumb ? (
                                                    <img
                                                        src={thumb}
                                                        alt={product.name}
                                                        loading="lazy"
                                                    />
                                                ) : (
                                                    <Package size={20} />
                                                )}
                                            </div>

                                            <div className="navbar__search-item-info">
                                                <p className="navbar__search-item-name">
                                                    {product.name}
                                                </p>
                                                {categoryName && (
                                                    <span className="navbar__search-item-cat">
                                                        {categoryName}
                                                    </span>
                                                )}
                                            </div>

                                            <div className="navbar__search-item-price">
                                                <span>₹{priceInfo.current.toLocaleString()}</span>
                                                {priceInfo.original && (
                                                    <span className="navbar__search-item-price-original">
                                                        ₹{priceInfo.original.toLocaleString()}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            <button
                                type="button"
                                onClick={handleViewAll}
                                className="navbar__search-footer"
                            >
                                View all {totalCount} results for &quot;{debouncedTerm}&quot;
                            </button>
                        </>
                    ) : (
                        <div className="navbar__search-empty">
                            <p>No products found for &quot;{debouncedTerm}&quot;</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default NavbarSearch;

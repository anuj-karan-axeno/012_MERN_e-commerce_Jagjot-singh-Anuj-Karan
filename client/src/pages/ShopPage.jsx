import '../scss/pages/_shop.scss';
import { useState, useEffect } from 'react';
import { Link, useSearchParams, useParams } from 'react-router-dom';
import { useProducts } from '../hooks/ProductContext';
import Navbar from '../components/Navbar';
import FooterSection from '../components/home/FooterSection';
import ProductCard from '../components/ProductCard';
import ShopFilters from '../components/shop/ShopFilters';
import ShopHeader from '../components/shop/ShopHeader';
import ShopPagination from '../components/shop/ShopPagination';

import chevronRightIcon from '../assests/icons/chevron_right.svg';

const formatTitle = (text) => {
    if (!text) return '';
    return text
        .split(' ')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(' ');
};

const getUrlFilters = (searchParams, categoryParam) => {
    const category = searchParams.get('category') || categoryParam || '';
    const dressStyle =
        searchParams.get('dressStyle') ||
        searchParams.get('style') ||
        searchParams.get('dressstyle') ||
        searchParams.get('dress_style') ||
        '';
    const search = searchParams.get('search') || '';

    return {
        category: category.toLowerCase().trim(),
        dressStyle: dressStyle.toLowerCase().trim(),
        search: search.trim(),
    };
};

export const ShopPage = () => {
    const { products, loading, appliedFilters, applyFilters } = useProducts();
    const [searchParams] = useSearchParams();
    const { categoryName } = useParams();
    const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

    const urlFilters = getUrlFilters(searchParams, categoryName);

    useEffect(() => {
        const updates = {};
        if (urlFilters.category !== appliedFilters.category) updates.category = urlFilters.category;
        if (urlFilters.dressStyle !== appliedFilters.dressStyle) updates.dressStyle = urlFilters.dressStyle;
        if (urlFilters.search !== (appliedFilters.search || '')) updates.search = urlFilters.search;

        if (Object.keys(updates).length > 0) {
            applyFilters(updates);
        }
        window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    }, [searchParams, categoryName]);

    const activeStyle = urlFilters.dressStyle || appliedFilters.dressStyle;
    const activeCategory = urlFilters.category || appliedFilters.category;

    const pageTitle = urlFilters.search
        ? `Search: "${urlFilters.search}"`
        : activeStyle
        ? formatTitle(activeStyle)
        : activeCategory
        ? formatTitle(activeCategory)
        : 'Casual';

    return (
        <div className="shop-page">
            <Navbar />

            <div className="shop-page-container">
                <nav className="breadcrumb" aria-label="Breadcrumb">
                    <ul className="breadcrumb__list">
                        <li className="breadcrumb__item">
                            <Link to="/" style={{ color: 'inherit', textDecoration: 'none' }}>
                                Home
                            </Link>
                            <img src={chevronRightIcon} alt="" />
                        </li>
                        <li className="breadcrumb__item breadcrumb__item--current" aria-current="page">
                            {pageTitle}
                        </li>
                    </ul>
                </nav>

                <div className="shop-layout">
                    <div className="shop-layout__sidebar">
                        <ShopFilters />
                    </div>

                    <main className="shop-layout__content">
                        <ShopHeader
                            title={pageTitle}
                            onOpenMobileFilters={() => setIsMobileFilterOpen(true)}
                        />

                        {loading ? (
                            <div className="shop-loading">
                                <p>Loading products...</p>
                            </div>
                        ) : products.length === 0 ? (
                            <div className="shop-empty">
                                <h3>No Products Found</h3>
                                <p>Try adjusting your search or filters to find what you're looking for.</p>
                            </div>
                        ) : (
                            <ul className="shop-grid">
                                {products.map((product) => (
                                    <ProductCard
                                        key={product._id}
                                        id={product._id}
                                        name={product.name}
                                        price={product.price}
                                        discountPrice={product.discountPrice}
                                        discountPercentage={product.discountPercentage}
                                        imgURL={product.thumbnailImage}
                                        rating={product.rating || 4.5}
                                    />
                                ))}
                            </ul>
                        )}

                        <hr className="shop-divider" />

                        <ShopPagination />
                    </main>
                </div>
            </div>

            {isMobileFilterOpen && (
                <div
                    className="shop-mobile-drawer-backdrop"
                    onClick={() => setIsMobileFilterOpen(false)}
                >
                    <div
                        className="shop-mobile-drawer"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <ShopFilters
                            isMobile
                            onClose={() => setIsMobileFilterOpen(false)}
                        />
                    </div>
                </div>
            )}

            <FooterSection />
        </div>
    );
};

export default ShopPage;

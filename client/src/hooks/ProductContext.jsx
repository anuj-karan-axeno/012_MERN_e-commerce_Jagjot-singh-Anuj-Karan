import { createContext, useContext, useState, useEffect, useCallback } from "react";
import api from "../lib/api";

export const ProductContext = createContext(null);

const DEFAULT_FILTERS = {
    category: '',
    minPrice: '',
    maxPrice: '',
    size: '',
    dressStyle: '',
    sort: 'popular',
    search: '',
};

const DEFAULT_PAGINATION = {
    totalProducts: 0,
    totalPages: 1,
    currentPage: 1,
    limit: 9,
    hasNextPage: false,
    hasPrevPage: false,
};

export const ProductContextProvider = ({ children }) => {
    const [products, setProducts] = useState([]);
    const [pagination, setPagination] = useState(DEFAULT_PAGINATION);
    const [filters, setFilters] = useState(DEFAULT_FILTERS);
    const [appliedFilters, setAppliedFilters] = useState(DEFAULT_FILTERS);
    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchProducts = useCallback(async (customParams = {}) => {
        try {
            setLoading(true);
            setError(null);

            const merged = { ...appliedFilters, ...customParams };
            const params = {
                page: customParams.page ?? currentPage,
                limit: customParams.limit ?? 9,
                sort: merged.sort || 'popular',
            };

            ['category', 'minPrice', 'maxPrice', 'size', 'dressStyle', 'search'].forEach((key) => {
                if (merged[key]) {
                    params[key] = merged[key];
                }
            });

            const res = await api.get('/products', { params });
            if (res.data?.success) {
                const responseData = res.data.data;
                const items = Array.isArray(responseData) ? responseData : (responseData.products || []);
                const activeOnly = items.filter(p => !p.status || p.status === 'active');
                setProducts(activeOnly);

                if (responseData.pagination) {
                    setPagination(responseData.pagination);
                } else {
                    setPagination({
                        totalProducts: activeOnly.length,
                        totalPages: Math.ceil(activeOnly.length / 9) || 1,
                        currentPage,
                        limit: 9,
                        hasNextPage: false,
                        hasPrevPage: false,
                    });
                }
            }
        } catch (err) {
            const message = err.response?.data?.message || "Failed to fetch products";
            setError(message);
        } finally {
            setLoading(false);
        }
    }, [currentPage, appliedFilters]);

    const fetchProductById = useCallback(async (id) => {
        try {
            const res = await api.get(`/products/${id}`);
            const product = res.data?.data;
            if (!product || product.status === 'inactive') {
                throw new Error("Product not found");
            }
            return product;
        } catch (err) {
            const message = err.response?.data?.message || err.message || "Failed to fetch product";
            throw new Error(message, { cause: err });
        }
    }, []);

    const setFilter = (key, value) => {
        setFilters(prev => ({ ...prev, [key]: value }));
    };

    const applyFilters = (customFilters = {}) => {
        setCurrentPage(1);
        const nextFilters = { ...filters, ...customFilters };
        setFilters(nextFilters);
        setAppliedFilters(nextFilters);
    };

    const resetFilters = () => {
        setFilters(DEFAULT_FILTERS);
        setAppliedFilters(DEFAULT_FILTERS);
        setCurrentPage(1);
    };

    const setSort = (sortValue) => applyFilters({ sort: sortValue });

    const setPage = (pageNumber) => setCurrentPage(pageNumber);

    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);

    return (
        <ProductContext.Provider
            value={{
                products,
                pagination,
                loading,
                error,
                filters,
                appliedFilters,
                currentPage,
                setFilter,
                applyFilters,
                resetFilters,
                setSort,
                setPage,
                fetchProducts,
                fetchProductById,
            }}
        >
            {children}
        </ProductContext.Provider>
    );
};

export const useProducts = () => {
    const context = useContext(ProductContext);
    if (!context) {
        throw new Error("useProducts must be used within a ProductContextProvider");
    }
    return context;
};

export default ProductContext;

import { useState } from 'react';
import { X, Plus, Trash2, AlertCircle } from 'lucide-react';

export const EditProductModal = ({ isOpen, onClose, product, onUpdateProduct, categories }) => {
    if (!isOpen || !product) return null;

    return (
        <EditProductForm
            onClose={onClose}
            product={product}
            onUpdateProduct={onUpdateProduct}
            categories={categories}
        />
    );
};

const EditProductForm = ({ onClose, product, onUpdateProduct, categories }) => {
    const [name, setName] = useState(product.name || '');
    const [description, setDescription] = useState(product.description || '');
    const [price, setPrice] = useState(product.price !== undefined ? String(product.price) : '');
    const [discountPrice, setDiscountPrice] = useState(
        product.discountPrice !== undefined && product.discountPrice > 0 ? String(product.discountPrice) : ''
    );
    const [discountPercentage, setDiscountPercentage] = useState(
        product.discountPercentage !== undefined && product.discountPercentage > 0
            ? String(product.discountPercentage)
            : ''
    );
    const [selectedCategories, setSelectedCategories] = useState(product.category || []);
    const [variants, setVariants] = useState(
        product.variants?.length
            ? product.variants.map(v => ({ size: v.size, quantity: v.quantity }))
            : [{ size: 'Medium', quantity: 10 }]
    );
    const [status, setStatus] = useState(product.status || 'active');
    const [submitting, setSubmitting] = useState(false);
    const [formError, setFormError] = useState('');
    const [fieldErrors, setFieldErrors] = useState({});

    const handleClose = () => {
        setFormError('');
        setFieldErrors({});
        onClose();
    };

    const handleCategoryToggle = (catId) => {
        setSelectedCategories(prev =>
            prev.includes(catId) ? prev.filter(id => id !== catId) : [...prev, catId]
        );
        if (fieldErrors.categories) {
            setFieldErrors(prev => ({ ...prev, categories: '' }));
        }
    };

    const handleAddVariant = () => {
        setVariants(prev => [...prev, { size: '', quantity: 0 }]);
        if (fieldErrors.variants) {
            setFieldErrors(prev => ({ ...prev, variants: '' }));
        }
    };

    const handleUpdateVariant = (index, field, value) => {
        setVariants(prev => {
            const next = [...prev];
            next[index] = { ...next[index], [field]: field === 'quantity' ? Number(value) : value };
            return next;
        });
        if (fieldErrors.variants) {
            setFieldErrors(prev => ({ ...prev, variants: '' }));
        }
    };

    const handleRemoveVariant = (index) => {
        setVariants(prev => prev.filter((_, i) => i !== index));
        if (fieldErrors.variants) {
            setFieldErrors(prev => ({ ...prev, variants: '' }));
        }
    };

    const handleDiscountPercentageChange = (val) => {
        setDiscountPercentage(val);
        const numPercent = Number(val);
        const numPrice = Number(price);
        if (numPercent > 0 && numPercent < 100 && numPrice > 0) {
            setDiscountPrice(String(Math.round(numPrice * (1 - numPercent / 100))));
            if (fieldErrors.discountPrice) {
                setFieldErrors(prev => ({ ...prev, discountPrice: '' }));
            }
        } else if (!val) {
            setDiscountPrice('');
        }
    };

    const handleDiscountPriceChange = (val) => {
        setDiscountPrice(val);
        const numDisc = Number(val);
        const numPrice = Number(price);
        if (numDisc > 0 && numDisc < numPrice && numPrice > 0) {
            setDiscountPercentage(String(Math.round(((numPrice - numDisc) / numPrice) * 100)));
            if (fieldErrors.discountPrice) {
                setFieldErrors(prev => ({ ...prev, discountPrice: '' }));
            }
        } else if (!val) {
            setDiscountPercentage('');
        }
    };

    const handlePriceChange = (val) => {
        setPrice(val);
        const numPrice = Number(val);
        const numPercent = Number(discountPercentage);
        if (numPercent > 0 && numPercent < 100 && numPrice > 0) {
            setDiscountPrice(String(Math.round(numPrice * (1 - numPercent / 100))));
        }
        if (fieldErrors.price) {
            setFieldErrors(prev => ({ ...prev, price: '' }));
        }
    };

    const validateForm = () => {
        const errors = {};

        if (!name.trim()) {
            errors.name = 'Product title is required';
        }

        if (!String(price).trim()) {
            errors.price = 'Product price is required';
        } else if (isNaN(Number(price)) || Number(price) < 0) {
            errors.price = 'Valid price is required';
        }

        if (discountPrice && !isNaN(Number(discountPrice)) && Number(discountPrice) >= Number(price)) {
            errors.discountPrice = 'Discount price must be less than regular price';
        }

        if (!description.trim()) {
            errors.description = 'Product description is required';
        }

        if (selectedCategories.length === 0) {
            errors.categories = 'Please select at least one category';
        }

        if (variants.length === 0) {
            errors.variants = 'At least one variant size/quantity is required';
        } else {
            const hasEmptySize = variants.some(v => !v.size || !v.size.trim());
            const hasInvalidQty = variants.some(v => v.quantity === '' || isNaN(Number(v.quantity)) || Number(v.quantity) < 0);
            if (hasEmptySize) {
                errors.variants = 'Every variant must have a size specified';
            } else if (hasInvalidQty) {
                errors.variants = 'Variant quantities must be 0 or higher';
            }
        }

        return errors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setFormError('');

        const errors = validateForm();
        if (Object.keys(errors).length > 0) {
            setFieldErrors(errors);
            return;
        }
        setFieldErrors({});

        try {
            setSubmitting(true);
            const updatedFields = {
                name: name.trim(),
                description: description.trim(),
                price: Number(price),
                discountPrice: discountPrice ? Number(discountPrice) : 0,
                discountPercentage: discountPercentage ? Number(discountPercentage) : 0,
                category: selectedCategories,
                variants: variants.map(v => ({
                    size: v.size.toLowerCase().trim(),
                    quantity: Number(v.quantity),
                })),
                status,
            };

            await onUpdateProduct(product._id, updatedFields);
            handleClose();
        } catch (err) {
            setFormError(err.message || 'Failed to update product');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="admin-modal-backdrop" onClick={handleClose}>
            <div className="admin-modal admin-modal--lg" onClick={e => e.stopPropagation()}>
                <div className="admin-modal__header">
                    <div>
                        <h3>Edit Product</h3>
                        <p className="admin-modal__subtext">Update product attributes, stock, and status</p>
                    </div>
                    <button type="button" className="admin-modal__close" onClick={handleClose}>
                        <X size={20} />
                    </button>
                </div>

                <form className="admin-form" onSubmit={handleSubmit} noValidate>
                    {formError && <div className="admin-form__alert">{formError}</div>}

                    <div className="admin-form__field">
                        <label className="admin-form__label">Product Title *</label>
                        <input
                            type="text"
                            className={`admin-form__input ${fieldErrors.name ? 'admin-form__input--error' : ''}`}
                            value={name}
                            onChange={e => {
                                setName(e.target.value);
                                if (fieldErrors.name) setFieldErrors(prev => ({ ...prev, name: '' }));
                            }}
                        />
                        {fieldErrors.name && (
                            <span className="admin-form__field-error">
                                <AlertCircle size={14} />
                                {fieldErrors.name}
                            </span>
                        )}
                    </div>

                    <div className="admin-form__row">
                        <div className="admin-form__field">
                            <label className="admin-form__label">Price (₹) *</label>
                            <input
                                type="number"
                                className={`admin-form__input ${fieldErrors.price ? 'admin-form__input--error' : ''}`}
                                value={price}
                                onChange={e => handlePriceChange(e.target.value)}
                                min="0"
                            />
                            {fieldErrors.price && (
                                <span className="admin-form__field-error">
                                    <AlertCircle size={14} />
                                    {fieldErrors.price}
                                </span>
                            )}
                        </div>

                        <div className="admin-form__field">
                            <label className="admin-form__label">Discount Price (₹)</label>
                            <input
                                type="number"
                                className={`admin-form__input ${fieldErrors.discountPrice ? 'admin-form__input--error' : ''}`}
                                placeholder="Optional"
                                value={discountPrice}
                                onChange={e => handleDiscountPriceChange(e.target.value)}
                                min="0"
                            />
                            {fieldErrors.discountPrice && (
                                <span className="admin-form__field-error">
                                    <AlertCircle size={14} />
                                    {fieldErrors.discountPrice}
                                </span>
                            )}
                        </div>

                        <div className="admin-form__field">
                            <label className="admin-form__label">Discount (%)</label>
                            <input
                                type="number"
                                className="admin-form__input"
                                placeholder="Optional"
                                value={discountPercentage}
                                onChange={e => handleDiscountPercentageChange(e.target.value)}
                                min="0"
                                max="99"
                            />
                        </div>
                    </div>

                    <div className="admin-form__field">
                        <label className="admin-form__label">Description *</label>
                        <textarea
                            className={`admin-form__textarea ${fieldErrors.description ? 'admin-form__input--error' : ''}`}
                            rows={3}
                            value={description}
                            onChange={e => {
                                setDescription(e.target.value);
                                if (fieldErrors.description) setFieldErrors(prev => ({ ...prev, description: '' }));
                            }}
                        />
                        {fieldErrors.description && (
                            <span className="admin-form__field-error">
                                <AlertCircle size={14} />
                                {fieldErrors.description}
                            </span>
                        )}
                    </div>

                    {/* Status & Categories */}
                    <div className="admin-form__row">
                        <div className="admin-form__field">
                            <label className="admin-form__label">Product Status</label>
                            <select
                                className="admin-form__select"
                                value={status}
                                onChange={e => setStatus(e.target.value)}
                            >
                                <option value="active">Active (Visible in store)</option>
                                <option value="inactive">Inactive (Hidden)</option>
                            </select>
                        </div>

                        <div className="admin-form__field">
                            <label className="admin-form__label">Categories *</label>
                            <div className="admin-checkbox-group">
                                {categories.map(cat => {
                                    const isSelected = selectedCategories.includes(cat._id);
                                    return (
                                        <label
                                            key={cat._id}
                                            className={`admin-category-pill ${
                                                isSelected ? 'admin-category-pill--selected' : ''
                                            }`}
                                        >
                                            <input
                                                type="checkbox"
                                                checked={isSelected}
                                                onChange={() => handleCategoryToggle(cat._id)}
                                            />
                                            <span>{cat.name}</span>
                                        </label>
                                    );
                                })}
                            </div>
                            {fieldErrors.categories && (
                                <span className="admin-form__field-error">
                                    <AlertCircle size={14} />
                                    {fieldErrors.categories}
                                </span>
                            )}
                        </div>
                    </div>

                    {/* Variants Builder */}
                    <div className="admin-form__field">
                        <div className="admin-form__label-row">
                            <label className="admin-form__label">Sizes & Stock Quantities *</label>
                            <button
                                type="button"
                                className="admin-btn-link"
                                onClick={handleAddVariant}
                            >
                                <Plus size={14} /> Add Variant
                            </button>
                        </div>

                        <div className="admin-variant-builder">
                            {variants.map((v, i) => (
                                <div key={i} className="admin-variant-row">
                                    <input
                                        type="text"
                                        className={`admin-form__input admin-form__input--sm ${
                                            fieldErrors.variants && !v.size?.trim() ? 'admin-form__input--error' : ''
                                        }`}
                                        placeholder="Size (e.g. Small, Medium, Large, X-Large)"
                                        value={v.size}
                                        onChange={e => handleUpdateVariant(i, 'size', e.target.value)}
                                    />
                                    <input
                                        type="number"
                                        className={`admin-form__input admin-form__input--sm ${
                                            fieldErrors.variants && (v.quantity === '' || v.quantity < 0 || isNaN(Number(v.quantity)))
                                                ? 'admin-form__input--error'
                                                : ''
                                        }`}
                                        placeholder="Quantity"
                                        value={v.quantity}
                                        onChange={e => handleUpdateVariant(i, 'quantity', e.target.value)}
                                        min="0"
                                    />
                                    <button
                                        type="button"
                                        className="admin-action-btn admin-action-btn--delete"
                                        onClick={() => handleRemoveVariant(i)}
                                        disabled={variants.length === 1}
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            ))}
                        </div>
                        {fieldErrors.variants && (
                            <span className="admin-form__field-error">
                                <AlertCircle size={14} />
                                {fieldErrors.variants}
                            </span>
                        )}
                    </div>

                    <div className="admin-modal__footer">
                        <button
                            type="button"
                            className="admin-btn admin-btn--secondary"
                            onClick={handleClose}
                            disabled={submitting}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="admin-btn admin-btn--primary"
                            disabled={submitting}
                        >
                            {submitting ? 'Saving Changes...' : 'Save Product'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditProductModal;


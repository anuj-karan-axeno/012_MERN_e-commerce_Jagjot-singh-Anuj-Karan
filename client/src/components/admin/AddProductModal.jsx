import { useState } from 'react';
import { X, Plus, Trash2, UploadCloud, Image as ImageIcon, AlertCircle } from 'lucide-react';

const ALLOWED_IMAGE_EXTENSIONS = ['jpg', 'jpeg', 'png', 'webp', 'webpg', 'heic', 'heif'];
const ALLOWED_IMAGE_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/heic', 'image/heif'];
const MAX_IMAGE_SIZE_BYTES = 5 * 1024 * 1024; 

const isValidImageFile = (file) => {
    if (!file) return false;
    const ext = file.name.split('.').pop()?.toLowerCase();
    const mime = file.type?.toLowerCase();
    const validExt = ALLOWED_IMAGE_EXTENSIONS.includes(ext);
    const validMime = mime ? ALLOWED_IMAGE_MIME_TYPES.includes(mime) : false;
    return validExt || validMime;
};

export const AddProductModal = ({ isOpen, onClose, onAddProduct, categories }) => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [discountPrice, setDiscountPrice] = useState('');
    const [discountPercentage, setDiscountPercentage] = useState('');
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [variants, setVariants] = useState([
        { size: 'Small', quantity: 10 },
        { size: 'Medium', quantity: 15 },
        { size: 'Large', quantity: 10 },
    ]);
    const [thumbnailFile, setThumbnailFile] = useState(null);
    const [galleryFiles, setGalleryFiles] = useState([]);
    const [thumbnailPreview, setThumbnailPreview] = useState('');
    const [galleryPreviews, setGalleryPreviews] = useState([]);
    const [submitting, setSubmitting] = useState(false);
    const [formError, setFormError] = useState('');
    const [fieldErrors, setFieldErrors] = useState({});

    if (!isOpen) return null;

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

    const handleThumbnailChange = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (!isValidImageFile(file)) {
            setFieldErrors(prev => ({ ...prev, thumbnail: 'Thumbnail must be a JPG, PNG, WEBP, or HEIC image' }));
            return;
        }
        if (file.size > MAX_IMAGE_SIZE_BYTES) {
            setFieldErrors(prev => ({ ...prev, thumbnail: 'Thumbnail image must be less than 5MB' }));
            return;
        }

        setFieldErrors(prev => ({ ...prev, thumbnail: '' }));
        setThumbnailFile(file);
        setThumbnailPreview(URL.createObjectURL(file));
    };

    const handleGalleryChange = (e) => {
        const files = Array.from(e.target.files || []);
        if (files.length === 0) return;

        if (files.length > 2) {
            setFieldErrors(prev => ({ ...prev, gallery: 'You can upload a maximum of 2 gallery images only' }));
            return;
        }

        for (const f of files) {
            if (!isValidImageFile(f)) {
                setFieldErrors(prev => ({ ...prev, gallery: `"${f.name}" is not supported. Please upload JPG, PNG, WEBP, or HEIC images.` }));
                return;
            }
            if (f.size > MAX_IMAGE_SIZE_BYTES) {
                setFieldErrors(prev => ({ ...prev, gallery: `"${f.name}" exceeds 5MB size limit.` }));
                return;
            }
        }

        setFieldErrors(prev => ({ ...prev, gallery: '' }));
        setGalleryFiles(files);
        setGalleryPreviews(files.map(f => URL.createObjectURL(f)));
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

        if (!thumbnailFile) {
            errors.thumbnail = 'Main thumbnail image is required';
        } else if (!isValidImageFile(thumbnailFile)) {
            errors.thumbnail = 'Thumbnail must be a JPG, PNG, WEBP, or HEIC image';
        } else if (thumbnailFile.size > MAX_IMAGE_SIZE_BYTES) {
            errors.thumbnail = 'Thumbnail image must be less than 5MB';
        }

        if (galleryFiles.length === 0) {
            errors.gallery = 'At least one gallery image is required';
        } else if (galleryFiles.length > 2) {
            errors.gallery = 'You can upload a maximum of 2 gallery images only';
        } else {
            for (const f of galleryFiles) {
                if (!isValidImageFile(f)) {
                    errors.gallery = `"${f.name}" is not supported. Please upload JPG, PNG, WEBP, or HEIC.`;
                    break;
                }
                if (f.size > MAX_IMAGE_SIZE_BYTES) {
                    errors.gallery = `"${f.name}" exceeds 5MB size limit.`;
                    break;
                }
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
            const formData = new FormData();
            formData.append('name', name.trim());
            formData.append('description', description.trim());
            formData.append('price', String(price));
            if (discountPrice && Number(discountPrice) > 0) {
                formData.append('discountPrice', String(discountPrice));
            }
            if (discountPercentage && Number(discountPercentage) > 0) {
                formData.append('discountPercentage', String(discountPercentage));
            }
            formData.append('categories', JSON.stringify(selectedCategories));
            formData.append(
                'variants',
                JSON.stringify(
                    variants.map(v => ({
                        size: v.size.toLowerCase().trim(),
                        quantity: Number(v.quantity),
                    }))
                )
            );
            formData.append('thumbnailImage', thumbnailFile);
            galleryFiles.forEach(file => {
                formData.append('galleryImages', file);
            });

            await onAddProduct(formData);
            handleClose();
        } catch (err) {
            setFormError(err.message || 'Failed to create product');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="admin-modal-backdrop" onClick={handleClose}>
            <div className="admin-modal admin-modal--lg" onClick={e => e.stopPropagation()}>
                <div className="admin-modal__header">
                    <h3>Add New Product</h3>
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
                            placeholder="e.g. Slim Fit Denim Shirt"
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
                                placeholder="e.g. 499"
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
                                placeholder="e.g. 399 (Optional)"
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
                                placeholder="e.g. 20 (Optional)"
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
                            placeholder="Detailed product features, material, and fit details..."
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

                    <div className="admin-form__field">
                        <label className="admin-form__label">Assign Categories *</label>
                        {categories.length === 0 ? (
                            <p className="admin-form__hint">No categories exist yet. Please create a category first.</p>
                        ) : (
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
                        )}
                        {fieldErrors.categories && (
                            <span className="admin-form__field-error">
                                <AlertCircle size={14} />
                                {fieldErrors.categories}
                            </span>
                        )}
                    </div>

                    <div className="admin-form__field">
                        <div className="admin-form__label-row">
                            <label className="admin-form__label">Variants (Size & Stock Quantity) *</label>
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

                    <div className="admin-form__row">
                        <div className="admin-form__field">
                            <label className="admin-form__label">Main Thumbnail Image *</label>
                            <div className={`admin-file-box ${fieldErrors.thumbnail ? 'admin-file-box--error' : ''}`}>
                                {thumbnailPreview ? (
                                    <div className="admin-file-preview">
                                        <img src={thumbnailPreview} alt="Thumbnail preview" />
                                        <label className="admin-file-replace-btn">
                                            Change
                                            <input
                                                type="file"
                                                accept=".jpg,.jpeg,.png,.webp,.webpg,.heic,.heif,image/jpeg,image/png,image/webp,image/heic,image/heif"
                                                onChange={handleThumbnailChange}
                                                className="admin-file-input-hidden"
                                            />
                                        </label>
                                    </div>
                                ) : (
                                    <label className="admin-file-dropzone">
                                        <UploadCloud size={28} />
                                        <span>Click to upload main thumbnail</span>
                                        <small className="admin-file-hint">JPG, PNG, WEBP, HEIC (Max 5MB)</small>
                                        <input
                                            type="file"
                                            accept=".jpg,.jpeg,.png,.webp,.webpg,.heic,.heif,image/jpeg,image/png,image/webp,image/heic,image/heif"
                                            onChange={handleThumbnailChange}
                                            className="admin-file-input-hidden"
                                        />
                                    </label>
                                )}
                            </div>
                            {fieldErrors.thumbnail && (
                                <span className="admin-form__field-error">
                                    <AlertCircle size={14} />
                                    {fieldErrors.thumbnail}
                                </span>
                            )}
                        </div>

                        <div className="admin-form__field">
                            <label className="admin-form__label">Gallery Images (1-2 images) *</label>
                            <div className={`admin-file-box ${fieldErrors.gallery ? 'admin-file-box--error' : ''}`}>
                                {galleryPreviews.length > 0 ? (
                                    <div className="admin-gallery-previews">
                                        {galleryPreviews.map((preview, i) => (
                                            <img key={i} src={preview} alt={`Gallery preview ${i}`} />
                                        ))}
                                        <label className="admin-file-replace-btn">
                                            Replace
                                            <input
                                                type="file"
                                                accept=".jpg,.jpeg,.png,.webp,.webpg,.heic,.heif,image/jpeg,image/png,image/webp,image/heic,image/heif"
                                                multiple
                                                onChange={handleGalleryChange}
                                                className="admin-file-input-hidden"
                                            />
                                        </label>
                                    </div>
                                ) : (
                                    <label className="admin-file-dropzone">
                                        <ImageIcon size={28} />
                                        <span>Click to upload up to 2 gallery shots</span>
                                        <small className="admin-file-hint">JPG, PNG, WEBP, HEIC (Max 5MB each)</small>
                                        <input
                                            type="file"
                                            accept=".jpg,.jpeg,.png,.webp,.webpg,.heic,.heif,image/jpeg,image/png,image/webp,image/heic,image/heif"
                                            multiple
                                            onChange={handleGalleryChange}
                                            className="admin-file-input-hidden"
                                        />
                                    </label>
                                )}
                            </div>
                            {fieldErrors.gallery && (
                                <span className="admin-form__field-error">
                                    <AlertCircle size={14} />
                                    {fieldErrors.gallery}
                                </span>
                            )}
                        </div>
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
                            {submitting ? 'Uploading to Cloudinary...' : 'Create Product'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddProductModal;


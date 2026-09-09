import { useState } from 'react';
import { X, AlertCircle } from 'lucide-react';

export const AddCategoryModal = ({ isOpen, onClose, onAddCategory }) => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [formError, setFormError] = useState('');
    const [fieldError, setFieldError] = useState('');

    if (!isOpen) return null;

    const handleClose = () => {
        setName('');
        setDescription('');
        setFormError('');
        setFieldError('');
        onClose();
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setFormError('');
        setFieldError('');

        if (!name.trim()) {
            setFieldError('Category name is required');
            return;
        }

        try {
            setSubmitting(true);
            await onAddCategory({
                name: name.trim().toLowerCase(),
                description: description.trim(),
            });
            setName('');
            setDescription('');
            onClose();
        } catch (err) {
            setFormError(err.message || 'Failed to create category');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="admin-modal-backdrop" onClick={handleClose}>
            <div className="admin-modal admin-modal--sm" onClick={e => e.stopPropagation()}>
                <div className="admin-modal__header">
                    <h3>Add New Category</h3>
                    <button type="button" className="admin-modal__close" onClick={handleClose}>
                        <X size={20} />
                    </button>
                </div>

                <form className="admin-form" onSubmit={handleSubmit} noValidate>
                    {formError && <div className="admin-form__alert">{formError}</div>}

                    <div className="admin-form__field">
                        <label className="admin-form__label">Category Name *</label>
                        <input
                            type="text"
                            className={`admin-form__input ${fieldError ? 'admin-form__input--error' : ''}`}
                            placeholder="e.g. jackets, hoodies, shoes"
                            value={name}
                            onChange={e => {
                                setName(e.target.value);
                                if (fieldError) setFieldError('');
                                if (formError) setFormError('');
                            }}
                        />
                        {fieldError && (
                            <span className="admin-form__field-error">
                                <AlertCircle size={14} />
                                {fieldError}
                            </span>
                        )}
                    </div>

                    <div className="admin-form__field">
                        <label className="admin-form__label">Description</label>
                        <textarea
                            className="admin-form__textarea"
                            rows={3}
                            placeholder="Brief summary of items in this category..."
                            value={description}
                            onChange={e => setDescription(e.target.value)}
                        />
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
                            {submitting ? 'Creating...' : 'Create Category'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddCategoryModal;

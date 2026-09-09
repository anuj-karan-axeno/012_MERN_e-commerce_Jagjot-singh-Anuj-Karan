import { useState } from 'react';
import { AlertCircle } from 'lucide-react';
import { useAuth } from '../../hooks/AuthContext';

export const ProfileAddress = () => {
    const { user, updateAddress } = useAuth();

    const savedAddress = user?.address;
    const hasAddress = Boolean(
        savedAddress?.street &&
        savedAddress?.city &&
        savedAddress?.state &&
        savedAddress?.country &&
        savedAddress?.zip
    );

    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        street: savedAddress?.street || '',
        city: savedAddress?.city || '',
        state: savedAddress?.state || '',
        country: savedAddress?.country || 'India',
        zip: savedAddress?.zip || '',
    });
    const [saving, setSaving] = useState(false);
    const [statusMessage, setStatusMessage] = useState({ type: '', text: '' });
    const [fieldErrors, setFieldErrors] = useState({});

    const handleStartEdit = () => {
        setFormData({
            street: savedAddress?.street || '',
            city: savedAddress?.city || '',
            state: savedAddress?.state || '',
            country: savedAddress?.country || 'India',
            zip: savedAddress?.zip || '',
        });
        setStatusMessage({ type: '', text: '' });
        setFieldErrors({});
        setIsEditing(true);
    };

    const handleCancel = () => {
        setFormData({
            street: savedAddress?.street || '',
            city: savedAddress?.city || '',
            state: savedAddress?.state || '',
            country: savedAddress?.country || 'India',
            zip: savedAddress?.zip || '',
        });
        setStatusMessage({ type: '', text: '' });
        setFieldErrors({});
        setIsEditing(false);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        if (fieldErrors[name]) {
            setFieldErrors((prev) => ({ ...prev, [name]: '' }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatusMessage({ type: '', text: '' });

        const errors = {};
        if (!formData.street.trim()) {
            errors.street = 'Street address is required';
        }
        if (!formData.city.trim()) {
            errors.city = 'City is required';
        }
        if (!formData.state.trim()) {
            errors.state = 'State is required';
        }
        if (!formData.zip.trim()) {
            errors.zip = 'PIN code is required';
        }
        if (!formData.country.trim()) {
            errors.country = 'Country is required';
        }

        if (Object.keys(errors).length > 0) {
            setFieldErrors(errors);
            return;
        }
        setFieldErrors({});

        try {
            setSaving(true);
            await updateAddress({
                street: formData.street.trim(),
                city: formData.city.trim(),
                state: formData.state.trim(),
                country: formData.country.trim(),
                zip: formData.zip.trim(),
            });
            setStatusMessage({ type: 'success', text: 'Address saved' });
            setIsEditing(false);
        } catch (err) {
            setStatusMessage({ type: 'error', text: err.message || 'Failed to save address' });
        } finally {
            setSaving(false);
        }
    };

    return (
        <section className="profile-card">
            <div className="profile-card__header">
                <h2 className="profile-card__title">Delivery Address</h2>
                {!isEditing && hasAddress && (
                    <button
                        type="button"
                        className="profile-btn-action"
                        onClick={handleStartEdit}
                    >
                        Edit
                    </button>
                )}
            </div>

            {statusMessage.text && (
                <div className={`profile-msg profile-msg--${statusMessage.type}`}>
                    {statusMessage.text}
                </div>
            )}

            {!isEditing ? (
                hasAddress ? (
                    <div className="profile-address-box">
                        <p className="profile-address-box__street">{savedAddress.street}</p>
                        <p className="profile-address-box__city">
                            {savedAddress.city}, {savedAddress.state} {savedAddress.zip}
                        </p>
                        <p className="profile-address-box__country">{savedAddress.country}</p>
                    </div>
                ) : (
                    <div className="profile-address-empty">
                        <p>No address saved</p>
                        <button
                            type="button"
                            className="profile-btn-action"
                            onClick={handleStartEdit}
                        >
                            + Add Address
                        </button>
                    </div>
                )
            ) : (
                <form className="profile-edit-form" onSubmit={handleSubmit} noValidate>
                    <div className="profile-field">
                        <label htmlFor="addrStreet" className="profile-field__label">
                            Street Address
                        </label>
                        <input
                            id="addrStreet"
                            name="street"
                            type="text"
                            className={`profile-field__input ${fieldErrors.street ? 'profile-field__input--error' : ''}`}
                            value={formData.street}
                            onChange={handleChange}
                            placeholder="Street, apartment, suite"
                        />
                        {fieldErrors.street && (
                            <span className="profile-field__error">
                                <AlertCircle size={13} />
                                {fieldErrors.street}
                            </span>
                        )}
                    </div>

                    <div className="profile-field-row">
                        <div className="profile-field">
                            <label htmlFor="addrCity" className="profile-field__label">
                                City
                            </label>
                            <input
                                id="addrCity"
                                name="city"
                                type="text"
                                className={`profile-field__input ${fieldErrors.city ? 'profile-field__input--error' : ''}`}
                                value={formData.city}
                                onChange={handleChange}
                            />
                            {fieldErrors.city && (
                                <span className="profile-field__error">
                                    <AlertCircle size={13} />
                                    {fieldErrors.city}
                                </span>
                            )}
                        </div>

                        <div className="profile-field">
                            <label htmlFor="addrState" className="profile-field__label">
                                State
                            </label>
                            <input
                                id="addrState"
                                name="state"
                                type="text"
                                className={`profile-field__input ${fieldErrors.state ? 'profile-field__input--error' : ''}`}
                                value={formData.state}
                                onChange={handleChange}
                            />
                            {fieldErrors.state && (
                                <span className="profile-field__error">
                                    <AlertCircle size={13} />
                                    {fieldErrors.state}
                                </span>
                            )}
                        </div>
                    </div>

                    <div className="profile-field-row">
                        <div className="profile-field">
                            <label htmlFor="addrZip" className="profile-field__label">
                                PIN Code
                            </label>
                            <input
                                id="addrZip"
                                name="zip"
                                type="text"
                                className={`profile-field__input ${fieldErrors.zip ? 'profile-field__input--error' : ''}`}
                                value={formData.zip}
                                onChange={handleChange}
                            />
                            {fieldErrors.zip && (
                                <span className="profile-field__error">
                                    <AlertCircle size={13} />
                                    {fieldErrors.zip}
                                </span>
                            )}
                        </div>

                        <div className="profile-field">
                            <label htmlFor="addrCountry" className="profile-field__label">
                                Country
                            </label>
                            <input
                                id="addrCountry"
                                name="country"
                                type="text"
                                className={`profile-field__input ${fieldErrors.country ? 'profile-field__input--error' : ''}`}
                                value={formData.country}
                                onChange={handleChange}
                            />
                            {fieldErrors.country && (
                                <span className="profile-field__error">
                                    <AlertCircle size={13} />
                                    {fieldErrors.country}
                                </span>
                            )}
                        </div>
                    </div>

                    <div className="profile-edit-form__actions">
                        <button
                            type="button"
                            className="profile-btn-outline"
                            onClick={handleCancel}
                            disabled={saving}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="profile-btn-dark"
                            disabled={saving}
                        >
                            {saving ? 'Saving...' : 'Save'}
                        </button>
                    </div>
                </form>
            )}
        </section>
    );
};

export default ProfileAddress;



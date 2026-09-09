import { useContext, useState } from 'react';
import { AuthContext } from '../hooks/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { AlertCircle } from 'lucide-react';

const LoginPage = () => {
    const { loginUser, loading, error, setError } = useContext(AuthContext);
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });

    const [fieldErrors, setFieldErrors] = useState({});

    const onInputChangeHandler = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));

        if (fieldErrors[name]) {
            setFieldErrors((prev) => ({ ...prev, [name]: '' }));
        }
        if (error) {
            setError(null);
        }
    };

    const validateForm = () => {
        const errors = {};
        const trimmedEmail = formData.email.trim();
        const trimmedPassword = formData.password.trim();

        if (!trimmedEmail) {
            errors.email = 'Email is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
            errors.email = 'Please enter a valid email address';
        }

        if (!trimmedPassword) {
            errors.password = 'Password is required';
        } else if (trimmedPassword.length < 6 || trimmedPassword.length > 12) {
            errors.password = 'Password length should be min 6 and max 12';
        }

        return errors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const errors = validateForm();
        if (Object.keys(errors).length > 0) {
            setFieldErrors(errors);
            return;
        }

        try {
            const loggedInUser = await loginUser({
                email: formData.email.trim(),
                password: formData.password.trim(),
            });
            if (loggedInUser?.role === 'admin') {
                navigate('/admin');
            } else {
                navigate('/');
            }
        } catch (err) {
            if (err.response?.data?.errors?.length > 0) {
                const backendErrors = {};
                err.response.data.errors.forEach(({ field, message }) => {
                    backendErrors[field] = message;
                });
                setFieldErrors(backendErrors);
            }
        }
    };

    return (
        <main className="auth">
            <div className="auth-form-wrapper">
                <h1 className="auth-form__title">Kindly Login</h1>
                <p className="auth-form__subtitle">Enter your details to get started.</p>

                <form className="auth-form" onSubmit={handleSubmit} noValidate>
                    <div className="auth-form__field">
                        <label htmlFor="email" className="auth-form__label">Email</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            className={`auth-form__input ${fieldErrors.email ? 'auth-form__input--error' : ''}`}
                            placeholder="Enter your email"
                            onChange={onInputChangeHandler}
                        />
                        {fieldErrors.email && (
                            <span className="auth-form__field-error">
                                <AlertCircle size={14} />
                                {fieldErrors.email}
                            </span>
                        )}
                    </div>

                    <div className="auth-form__field">
                        <label htmlFor="password" className="auth-form__label">Password</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={formData.password}
                            className={`auth-form__input ${fieldErrors.password ? 'auth-form__input--error' : ''}`}
                            placeholder="Enter your password"
                            onChange={onInputChangeHandler}
                        />
                        {fieldErrors.password && (
                            <span className="auth-form__field-error">
                                <AlertCircle size={14} />
                                {fieldErrors.password}
                            </span>
                        )}
                    </div>

                    {error && (
                        <div className="auth-form__error">
                            <AlertCircle size={16} />
                            <span>{error}</span>
                        </div>
                    )}

                    <button type="submit" className="auth-form__submit" disabled={loading}>
                        {loading ? 'Logging in...' : 'Continue'}
                    </button>

                    <p className="auth-form__switch">
                        Don't have an account? <Link to="/register">Sign up</Link>
                    </p>
                </form>
            </div>
        </main>
    );
};

export default LoginPage;
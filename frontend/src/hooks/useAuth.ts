import { useState, useEffect } from 'react';
import { api } from '../services/api';

const useAuth = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const login = async (email, password) => {
        try {
            const response = await api.post('/auth/login', { email, password });
            setUser(response.data.user);
            localStorage.setItem('token', response.data.token);
        } catch (err) {
            setError(err.response.data.message);
        }
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('token');
    };

    const checkAuth = async () => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const response = await api.get('/auth/me', {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setUser(response.data);
            } catch (err) {
                setError(err.response.data.message);
            }
        }
        setLoading(false);
    };

    useEffect(() => {
        checkAuth();
    }, []);

    return { user, loading, error, login, logout };
};

export default useAuth;
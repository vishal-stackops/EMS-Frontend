import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';
import api from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check if user is logged in
        const token = localStorage.getItem('token');
        const storedUser = localStorage.getItem('user');

        if (token && storedUser) {
            setUser({ ...JSON.parse(storedUser), token });
        } else if (token) {
            // Fallback if only token exists (e.g. from previous session version)
            setUser({ token });
        }
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        try {
            console.log('Attempting login with:', { email, password });
            const response = await api.post('/auth/login', { email, password });
            console.log('Login response:', response);
            console.log('Full Response Data:', JSON.stringify(response.data, null, 2));

            // Map API response to context state
            // Backend returns 'accessToken' and 'user' object directly
            const { accessToken, user: userData } = response.data;

            // Allow 'token' or 'accessToken' to be used
            const token = accessToken || response.data.token;

            if (token) {
                localStorage.setItem('token', token);
                const userObj = userData || { email };
                localStorage.setItem('user', JSON.stringify(userObj));
                setUser(userObj);
                return { success: true };
            }

            console.warn('Login failed: accessToken missing in response');
            return { success: false, error: 'Login failed: Token missing in response' };
        } catch (error) {
            console.error("Login error object:", error);
            if (error.response) {
                console.error("Error Response Data:", error.response.data);
                console.error("Error Response Status:", error.response.status);

                // Handle approval status errors
                if (error.response.status === 403 && error.response.data.approvalStatus) {
                    return {
                        success: false,
                        error: error.response.data.message,
                        approvalStatus: error.response.data.approvalStatus
                    };
                }
            }
            return { success: false, error: error.response?.data?.message || 'Login failed' };
        }
    };

    const signup = async (name, email, password) => {
        try {
            const response = await api.post('/auth/signup', { name, email, password });
            return { success: true, message: response.data.message };
        } catch (error) {
            console.error("Signup error:", error);
            return {
                success: false,
                error: error.response?.data?.message || 'Signup failed'
            };
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
    };

    const changePassword = async (oldPassword, newPassword) => {
        try {
            const response = await api.post('/auth/change-password', {
                oldPassword,
                newPassword
            });
            return { success: true, message: response.data.message };
        } catch (error) {
            console.error("Change password error:", error);
            return {
                success: false,
                error: error.response?.data?.message || 'Failed to change password'
            };
        }
    };

    return (
        <AuthContext.Provider value={{ user, login, signup, logout, changePassword, loading }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);

import React, { createContext, useState, useEffect, useContext } from 'react';
import api from '../services/api';
import { useAuth } from './AuthContext';

const DesignationContext = createContext();

export const useDesignation = () => useContext(DesignationContext);

export const DesignationProvider = ({ children }) => {
    const [designations, setDesignations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchDesignations = async () => {
        try {
            setLoading(true);
            const response = await api.get('/designations');
            setDesignations(Array.isArray(response.data) ? response.data : response.data.designations || []);
            setError(null);
        } catch (err) {
            console.error('Error fetching designations:', err);
            setError('Failed to fetch designations');
        } finally {
            setLoading(false);
        }
    };
    const { user } = useAuth();

    useEffect(() => {
        if (user && (user.role === 'ADMIN' || user.role === 'HR')) {
            fetchDesignations();
        }
    }, [user]);

    const addDesignation = async (designation) => {
        try {
            const response = await api.post('/designations', designation);
            setDesignations(prev => [...prev, response.data]);
            return { success: true };
        } catch (err) {
            console.error('Error adding designation:', err);
            return { success: false, error: err.response?.data?.message || 'Failed to add designation' };
        }
    };

    const updateDesignation = async (id, updatedDesignation) => {
        try {
            const response = await api.put(`/designations/${id}`, updatedDesignation);
            setDesignations(prev => prev.map(des => des._id === id ? response.data : des));
            return { success: true };
        } catch (err) {
            console.error('Error updating designation:', err);
            return { success: false, error: err.response?.data?.message || 'Failed to update designation' };
        }
    };

    const deleteDesignation = async (id) => {
        try {
            await api.delete(`/designations/${id}`);
            setDesignations(prev => prev.filter(des => des._id !== id));
            return { success: true };
        } catch (err) {
            console.error('Error deleting designation:', err);
            return { success: false, error: err.response?.data?.message || 'Failed to delete designation' };
        }
    };

    const assignEmployee = async (designationId, employeeId) => {
        try {
            await api.post(`/designations/${designationId}/assign-employee`, { employeeId });
            return { success: true };
        } catch (err) {
            console.error('Error assigning employee:', err);
            return { success: false, error: err.response?.data?.message || 'Failed to assign employee' };
        }
    };

    return (
        <DesignationContext.Provider value={{
            designations,
            loading,
            error,
            addDesignation,
            updateDesignation,
            deleteDesignation,
            assignEmployee,
            fetchDesignations
        }}>
            {children}
        </DesignationContext.Provider>
    );
};

import React, { createContext, useState, useEffect, useContext } from 'react';
import api from '../services/api';
import { useAuth } from './AuthContext';

const DepartmentContext = createContext();

export const useDepartment = () => useContext(DepartmentContext);

export const DepartmentProvider = ({ children }) => {
    const [departments, setDepartments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchDepartments = async () => {
        try {
            setLoading(true);
            const response = await api.get('/departments');
            setDepartments(Array.isArray(response.data) ? response.data : response.data.departments || []);
            setError(null);
        } catch (err) {
            console.error('Error fetching departments:', err);
            setError('Failed to fetch departments');
        } finally {
            setLoading(false);
        }
    };
    const { user } = useAuth();

    useEffect(() => {
        if (user && (user.role === 'ADMIN' || user.role === 'HR')) {
            fetchDepartments();
        }
    }, [user]);

    const addDepartment = async (department) => {
        try {
            const response = await api.post('/departments', department);
            setDepartments(prev => [...prev, response.data]);
            return { success: true };
        } catch (err) {
            console.error('Error adding department:', err);
            return { success: false, error: err.response?.data?.message || 'Failed to add department' };
        }
    };

    const updateDepartment = async (id, updatedDepartment) => {
        try {
            const response = await api.put(`/departments/${id}`, updatedDepartment);
            setDepartments(prev => prev.map(dept => dept._id === id ? response.data : dept));
            return { success: true };
        } catch (err) {
            console.error('Error updating department:', err);
            return { success: false, error: err.response?.data?.message || 'Failed to update department' };
        }
    };

    const deleteDepartment = async (id) => {
        try {
            await api.delete(`/departments/${id}`);
            setDepartments(prev => prev.filter(dept => dept._id !== id));
            return { success: true };
        } catch (err) {
            console.error('Error deleting department:', err);
            return { success: false, error: err.response?.data?.message || 'Failed to delete department' };
        }
    };

    const assignEmployees = async (departmentId, employeeIds) => {
        try {
            await api.post(`/departments/${departmentId}/assign-employees`, { employeeIds });
            return { success: true };
        } catch (err) {
            console.error('Error assigning employees:', err);
            return { success: false, error: err.response?.data?.message || 'Failed to assign employees' };
        }
    };

    return (
        <DepartmentContext.Provider value={{
            departments,
            loading,
            error,
            addDepartment,
            updateDepartment,
            deleteDepartment,
            assignEmployees,
            fetchDepartments
        }}>
            {children}
        </DepartmentContext.Provider>
    );
};

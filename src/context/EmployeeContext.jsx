import React, { createContext, useState, useEffect, useContext } from 'react';
import api from '../services/api';
import { useAuth } from './AuthContext';

const EmployeeContext = createContext();

export const useEmployee = () => useContext(EmployeeContext);

export const EmployeeProvider = ({ children }) => {
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [totalPages, setTotalPages] = useState(1);

    const fetchEmployees = async (params = {}) => {
        try {
            setLoading(true);
            const response = await api.get('/employees', { params });

            // Handle different response structures (array vs paginated object)
            if (response.data.employees && Array.isArray(response.data.employees)) {
                setEmployees(response.data.employees);
                setTotalPages(response.data.totalPages || 1);
            } else if (Array.isArray(response.data)) {
                setEmployees(response.data);
                setTotalPages(1);
            } else {
                // Fallback or specific structure
                setEmployees([]);
            }
            setError(null);
        } catch (err) {
            console.error('Error fetching employees:', err);
            setError('Failed to fetch employees');
        } finally {
            setLoading(false);
        }
    };
    const { user } = useAuth();

    useEffect(() => {
        if (user && (user.role === 'ADMIN' || user.role === 'HR')) {
            fetchEmployees();
        }
    }, [user]);

    const addEmployee = async (employee) => {
        try {
            const response = await api.post('/employees', employee);
            setEmployees(prev => [...prev, response.data.employee]);
            return { success: true };
        } catch (err) {
            console.error('Error adding employee:', err);
            return { success: false, error: err.response?.data?.message || 'Failed to add employee' };
        }
    };

    const updateEmployee = async (id, updatedEmployee) => {
        try {
            const response = await api.put(`/employees/${id}`, updatedEmployee);
            setEmployees(prev => prev.map(emp => emp._id === id ? response.data.employee : emp));
            return { success: true };
        } catch (err) {
            console.error('Error updating employee:', err);
            return { success: false, error: err.response?.data?.message || 'Failed to update employee' };
        }
    };

    const deleteEmployee = async (id) => {
        try {
            await api.delete(`/employees/${id}`);
            setEmployees(prev => prev.filter(emp => emp._id !== id));
            return { success: true };
        } catch (err) {
            console.error('Error deleting employee:', err);
            return { success: false, error: err.response?.data?.message || 'Failed to delete employee' };
        }
    };

    const fetchMyProfile = async () => {
        try {
            const response = await api.get('/employees/profile/me');
            return response.data;
        } catch (err) {
            console.error('Error fetching own profile:', err);
            // Return the error data structure if available
            return err.response?.data || null;
        }
    };

    const updateMyProfile = async (updatedData) => {
        try {
            const response = await api.put('/employees/profile/me', updatedData);
            return { success: true, employee: response.data.employee };
        } catch (err) {
            console.error('Error updating own profile:', err);
            return { success: false, error: err.response?.data?.message || 'Failed to update profile' };
        }
    };

    return (
        <EmployeeContext.Provider value={{
            employees,
            loading,
            error,
            addEmployee,
            updateEmployee,
            deleteEmployee,
            fetchEmployees,
            totalPages,
            fetchMyProfile,
            updateMyProfile
        }}>
            {children}
        </EmployeeContext.Provider>
    );
};

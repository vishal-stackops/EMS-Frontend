import React, { createContext, useState, useEffect, useContext } from 'react';
import api from '../services/api';
import { useAuth } from './AuthContext';

const SalaryContext = createContext();

export const useSalary = () => useContext(SalaryContext);

export const SalaryProvider = ({ children }) => {
    const [salaries, setSalaries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchSalaries = async () => {
        try {
            setLoading(true);
            const response = await api.get('/salaries');
            setSalaries(response.data);
            setError(null);
        } catch (err) {
            console.error('Error fetching salaries:', err);
            setError('Failed to fetch salaries');
        } finally {
            setLoading(false);
        }
    };

    const fetchSalaryByEmployee = async (employeeId) => {
        try {
            const response = await api.get(`/salaries/employee/${employeeId}`);
            return { success: true, data: response.data };
        } catch (err) {
            console.error('Error fetching employee salary:', err);
            return { success: false, error: err.response?.data?.message || 'Failed to fetch salary' };
        }
    };

    const setSalary = async (salaryData) => {
        try {
            const response = await api.post('/salaries', salaryData);
            setSalaries(prev => [...prev, response.data.salary]);
            return { success: true };
        } catch (err) {
            console.error('Error setting salary:', err);
            return { success: false, error: err.response?.data?.message || 'Failed to set salary' };
        }
    };

    const updateSalary = async (id, salaryData) => {
        try {
            const response = await api.put(`/salaries/${id}`, salaryData);
            setSalaries(prev => prev.map(s => s._id === id ? response.data.salary : s));
            return { success: true };
        } catch (err) {
            console.error('Error updating salary:', err);
            return { success: false, error: err.response?.data?.message || 'Failed to update salary' };
        }
    };

    const fetchMySalary = async () => {
        try {
            const response = await api.get('/salaries/my-salary');
            return { success: true, data: response.data };
        } catch (err) {
            console.error('Error fetching my salary:', err);
            return { success: false, error: err.response?.data?.message || 'Failed to fetch salary' };
        }
    };

    const { user } = useAuth();

    useEffect(() => {
        if (user && (user.role === 'ADMIN' || user.role === 'HR')) {
            fetchSalaries();
        }
    }, [user]);

    return (
        <SalaryContext.Provider value={{
            salaries,
            loading,
            error,
            fetchSalaries,
            fetchSalaryByEmployee,
            setSalary,
            updateSalary,
            fetchMySalary
        }}>
            {children}
        </SalaryContext.Provider>
    );
};

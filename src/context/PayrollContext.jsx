import React, { createContext, useState, useEffect, useContext } from 'react';
import api from '../services/api';

const PayrollContext = createContext();

export const usePayroll = () => useContext(PayrollContext);

export const PayrollProvider = ({ children }) => {
    const [payrolls, setPayrolls] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchPayrolls = async (params = {}) => {
        try {
            setLoading(true);
            const response = await api.get('/payrolls', { params });
            setPayrolls(response.data);
            setError(null);
        } catch (err) {
            console.error('Error fetching payrolls:', err);
            setError('Failed to fetch payrolls');
        } finally {
            setLoading(false);
        }
    };

    const generatePayroll = async (month, year) => {
        try {
            const response = await api.post('/payrolls/generate', { month, year });
            await fetchPayrolls({ month, year });
            return { success: true, message: response.data.message };
        } catch (err) {
            console.error('Error generating payroll:', err);
            return { success: false, error: err.response?.data?.message || 'Failed to generate payroll' };
        }
    };

    const updatePayrollStatus = async (id, statusData) => {
        try {
            console.log('PayrollContext: Updating payroll status', { id, statusData });
            const response = await api.put(`/payrolls/${id}`, statusData);
            console.log('PayrollContext: Update response:', response.data);
            setPayrolls(prev => prev.map(p => p._id === id ? response.data.payroll : p));
            return { success: true };
        } catch (err) {
            console.error('Error updating payroll status:', err);
            console.error('Error details:', err.response?.data);
            return { success: false, error: err.response?.data?.message || 'Failed to update status' };
        }
    };

    const fetchEmployeeHistory = async (employeeId) => {
        try {
            const response = await api.get(`/payrolls/employee/${employeeId}`);
            return { success: true, data: response.data };
        } catch (err) {
            console.error('Error fetching employee history:', err);
            return { success: false, error: err.response?.data?.message || 'Failed to fetch history' };
        }
    };

    const fetchMyPayrollHistory = async () => {
        try {
            console.log('PayrollContext: Calling /payrolls/my-history');
            const response = await api.get('/payrolls/my-history');
            console.log('PayrollContext: Response received:', response.data);
            return { success: true, data: response.data };
        } catch (err) {
            console.error('PayrollContext: Error fetching my payroll history:', err);
            console.error('PayrollContext: Error response:', err.response?.data);
            return { success: false, error: err.response?.data?.message || 'Failed to fetch payroll history' };
        }
    };

    return (
        <PayrollContext.Provider value={{
            payrolls,
            loading,
            error,
            fetchPayrolls,
            generatePayroll,
            updatePayrollStatus,
            fetchEmployeeHistory,
            fetchMyPayrollHistory
        }}>
            {children}
        </PayrollContext.Provider>
    );
};

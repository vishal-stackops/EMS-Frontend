import React, { createContext, useState, useContext, useEffect } from 'react';
import api from '../services/api';

const LeaveContext = createContext();

export const useLeave = () => useContext(LeaveContext);

export const LeaveProvider = ({ children }) => {
    const [leaveTypes, setLeaveTypes] = useState([]);
    const [myLeaves, setMyLeaves] = useState([]);
    const [allLeaves, setAllLeaves] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchLeaveTypes = async () => {
        try {
            const response = await api.get('/leaves/types');
            setLeaveTypes(response.data);
        } catch (err) {
            console.error('Error fetching leave types:', err);
        }
    };

    const applyLeave = async (leaveData) => {
        try {
            const response = await api.post('/leaves/apply', leaveData);
            setMyLeaves(prev => [response.data.leaveRequest, ...prev]);
            return { success: true };
        } catch (err) {
            return { success: false, error: err.response?.data?.message || 'Failed to apply' };
        }
    };

    const fetchMyLeaves = async (employeeId) => {
        try {
            setLoading(true);
            const response = await api.get(`/leaves/personal/${employeeId}`);
            setMyLeaves(response.data);
        } catch (err) {
            console.error('Error fetching leaves:', err);
        } finally {
            setLoading(false);
        }
    };

    const fetchAllLeaves = async () => {
        try {
            setLoading(true);
            const response = await api.get('/leaves/all');
            setAllLeaves(response.data);
        } catch (err) {
            console.error('Error fetching all leaves:', err);
        } finally {
            setLoading(false);
        }
    };

    const updateStatus = async (id, status) => {
        try {
            const response = await api.put(`/leaves/${id}/status`, { status });
            setAllLeaves(prev => prev.map(l => l._id === id ? response.data.request : l));
            return { success: true };
        } catch (err) {
            return { success: false, error: err.response?.data?.message || 'Failed to update' };
        }
    };

    useEffect(() => {
        fetchLeaveTypes();
    }, []);

    return (
        <LeaveContext.Provider value={{
            leaveTypes,
            myLeaves,
            allLeaves,
            loading,
            applyLeave,
            fetchMyLeaves,
            fetchAllLeaves,
            updateStatus
        }}>
            {children}
        </LeaveContext.Provider>
    );
};

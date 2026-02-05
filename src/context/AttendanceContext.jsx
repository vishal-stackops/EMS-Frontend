import React, { createContext, useState, useContext } from 'react';
import api from '../services/api';

const AttendanceContext = createContext();

export const useAttendance = () => useContext(AttendanceContext);

export const AttendanceProvider = ({ children }) => {
    const [attendanceHistory, setAttendanceHistory] = useState([]);
    const [loading, setLoading] = useState(false);

    const checkIn = async (employeeId) => {
        try {
            const response = await api.post('/attendance/check-in', { employeeId });
            return { success: true, data: response.data.attendance };
        } catch (err) {
            return { success: false, error: err.response?.data?.message || 'Failed to check in' };
        }
    };

    const checkOut = async (employeeId) => {
        try {
            const response = await api.post('/attendance/check-out', { employeeId });
            return { success: true, data: response.data.attendance };
        } catch (err) {
            return { success: false, error: err.response?.data?.message || 'Failed to check out' };
        }
    };

    const fetchPersonalAttendance = async (employeeId, params = {}) => {
        try {
            setLoading(true);
            const response = await api.get(`/attendance/personal/${employeeId}`, { params });
            setAttendanceHistory(response.data);
            return { success: true };
        } catch (err) {
            return { success: false, error: 'Failed to fetch attendance' };
        } finally {
            setLoading(false);
        }
    };

    const fetchAllAttendance = async (params = {}) => {
        try {
            setLoading(true);
            const response = await api.get('/attendance/all', { params });
            return { success: true, data: response.data };
        } catch (err) {
            return { success: false, error: 'Failed to fetch reports' };
        } finally {
            setLoading(false);
        }
    };

    return (
        <AttendanceContext.Provider value={{
            attendanceHistory,
            loading,
            checkIn,
            checkOut,
            fetchPersonalAttendance,
            fetchAllAttendance
        }}>
            {children}
        </AttendanceContext.Provider>
    );
};

import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "./AuthContext";

const AnalyticsContext = createContext();

export const AnalyticsProvider = ({ children }) => {
    const { user } = useAuth();
    const [analyticsData, setAnalyticsData] = useState({
        employeeMetrics: { total: 0, active: 0, inactive: 0 },
        departmentDistribution: [],
        monthlyHiringTrends: [],
        todayAttendanceSummary: [],
        leaveRequestsCount: 0
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchAnalytics = async () => {
        if (!user || (user.role !== "ADMIN" && user.role !== "HR")) return;

        setLoading(true);
        try {
            const token = localStorage.getItem("token");
            const response = await axios.get("http://localhost:5000/api/dashboard/analytics", {
                headers: { Authorization: `Bearer ${token}` }
            });

            // Map backend response to expected structure
            const mappedData = {
                metrics: response.data.metrics,
                departmentStats: response.data.departmentStats,
                hiringTrends: response.data.hiringTrends,
                attendanceSummary: response.data.attendanceSummary,
                payrollHistory: response.data.payrollHistory,

                // Legacy fields for Analytics.jsx compatibility
                employeeMetrics: {
                    total: response.data.metrics?.totalEmployees || 0,
                    active: response.data.metrics?.activeEmployees || 0,
                    inactive: response.data.metrics?.inactiveEmployees || 0
                },
                departmentDistribution: response.data.departmentStats?.map(d => ({
                    department: d.name,
                    count: d.count
                })) || [],
                monthlyHiringTrends: response.data.hiringTrends || [],
                todayAttendanceSummary: response.data.attendanceSummary || [],
                leaveRequestsCount: response.data.metrics?.pendingLeaves || 0
            };

            setAnalyticsData(mappedData);
            setError(null);
        } catch (err) {
            console.error("Analytics fetch error:", err);
            setError(err.response?.data?.message || "Failed to fetch analytics");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAnalytics();
    }, [user]);

    return (
        <AnalyticsContext.Provider value={{ analyticsData, loading, error, fetchAnalyticsData: fetchAnalytics }}>
            {children}
        </AnalyticsContext.Provider>
    );
};

export const useAnalytics = () => useContext(AnalyticsContext);

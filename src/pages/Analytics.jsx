import React, { useEffect } from 'react';
import {
    Box,
    Typography,
    Grid,
    Paper,
    alpha,
    useTheme,
    CircularProgress,
    Alert,
    Breadcrumbs,
    Link as MuiLink,
    Divider
} from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import AssessmentIcon from '@mui/icons-material/Assessment';
import PeopleIcon from '@mui/icons-material/People';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';

import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    BarChart,
    Bar,
    Legend
} from 'recharts';

import { useAnalytics } from '../context/AnalyticsContext';

const AnalyticsCard = ({ title, children, icon: Icon, subtitle }) => {
    const theme = useTheme();
    return (
        <Paper elevation={0} sx={{ p: 3, height: '100%', border: '1px solid #e2e8f0' }}>
            <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={3}>
                <Box display="flex" alignItems="center" gap={1.5}>
                    <Box sx={{ p: 1, borderRadius: 2, bgcolor: alpha(theme.palette.primary.main, 0.1), color: theme.palette.primary.main, display: 'flex' }}>
                        <Icon sx={{ fontSize: 20 }} />
                    </Box>
                    <Box>
                        <Typography variant="h6" fontWeight="800" fontSize="1rem">{title}</Typography>
                        {subtitle && <Typography variant="caption" color="text.secondary">{subtitle}</Typography>}
                    </Box>
                </Box>
                <InfoOutlinedIcon sx={{ fontSize: 16, opacity: 0.3 }} />
            </Box>
            <Box height={280} width="100%">
                {children}
            </Box>
        </Paper>
    );
};

const Analytics = () => {
    const theme = useTheme();
    const { analyticsData, loading, error, fetchAnalyticsData } = useAnalytics();

    useEffect(() => {
        if (fetchAnalyticsData) fetchAnalyticsData();
    }, []);

    if (loading) return (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
            <CircularProgress />
        </Box>
    );

    if (error) return (
        <Box p={4}>
            <Alert severity="error">{error}</Alert>
        </Box>
    );

    const COLORS = ['#2563eb', '#1e3a8a', '#94a3b8', '#cbd5e1'];

    return (
        <Box sx={{ p: { xs: 2, md: 4 } }}>
            {/* Header */}
            <Box mb={4}>
                <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 1 }}>
                    <MuiLink underline="hover" color="inherit" href="/" sx={{ display: 'flex', alignItems: 'center', fontSize: '0.8rem' }}>
                        <HomeIcon sx={{ mr: 0.5, fontSize: 16 }} /> Home
                    </MuiLink>
                    <Typography color="text.primary" sx={{ fontSize: '0.8rem', fontWeight: 600 }}>Analytics</Typography>
                </Breadcrumbs>
                <Typography variant="h4" fontWeight="800" sx={{ letterSpacing: '-1px' }}>Analytics Hub</Typography>
                <Typography variant="body2" color="text.secondary">Detailed insights into your workforce and trends.</Typography>
            </Box>

            <Grid container spacing={4}>
                {/* Hiring Trends Chart */}
                <Grid item xs={12} md={8}>
                    <AnalyticsCard title="Monthly Hiring Trends" subtitle="Overview of recruitment for the last 12 months" icon={TrendingUpIcon}>
                        {analyticsData?.monthlyHiringTrends?.length > 0 ? (
                            <ResponsiveContainer width="100%" height={280}>
                                <AreaChart data={analyticsData.monthlyHiringTrends}>
                                    <defs>
                                        <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor={theme.palette.primary.main} stopOpacity={0.1} />
                                            <stop offset="95%" stopColor={theme.palette.primary.main} stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                    <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} dy={10} />
                                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                                    <Tooltip
                                        contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                                    />
                                    <Area type="monotone" dataKey="count" stroke={theme.palette.primary.main} strokeWidth={3} fillOpacity={1} fill="url(#colorValue)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        ) : (
                            <Box display="flex" justifyContent="center" alignItems="center" height="100%" sx={{ bgcolor: alpha(theme.palette.divider, 0.05), borderRadius: 2 }}>
                                <Typography variant="body2" color="text.secondary">No hiring data available</Typography>
                            </Box>
                        )}
                    </AnalyticsCard>
                </Grid>

                {/* Employee Status (Active vs Inactive) */}
                <Grid item xs={12} md={4}>
                    <AnalyticsCard title="Employee Status" subtitle="Active vs Inactive distribution" icon={PeopleIcon}>
                        <ResponsiveContainer width="100%" height={280}>
                            <PieChart>
                                <Pie
                                    data={[
                                        { name: 'Active', value: analyticsData?.employeeMetrics?.active || 0 },
                                        { name: 'Inactive', value: analyticsData?.employeeMetrics?.inactive || 0 }
                                    ]}
                                    innerRadius={70}
                                    outerRadius={90}
                                    paddingAngle={8}
                                    dataKey="value"
                                >
                                    {[0, 1].map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} cornerRadius={8} />
                                    ))}
                                </Pie>
                                <Tooltip
                                    contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                                />
                                <Legend verticalAlign="bottom" height={36} iconType="circle" />
                            </PieChart>
                        </ResponsiveContainer>
                    </AnalyticsCard>
                </Grid>

                {/* Department Distribution */}
                <Grid item xs={12} md={6}>
                    <AnalyticsCard title="Department Distribution" subtitle="Headcount per department" icon={AssessmentIcon}>
                        {analyticsData?.departmentDistribution?.length > 0 ? (
                            <ResponsiveContainer width="100%" height={280}>
                                <BarChart data={analyticsData.departmentDistribution} layout="vertical">
                                    <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                                    <XAxis type="number" hide />
                                    <YAxis dataKey="department" type="category" width={100} axisLine={false} tickLine={false} tick={{ fontSize: 12, fontWeight: 600 }} />
                                    <Tooltip
                                        contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                                    />
                                    <Bar dataKey="count" fill={theme.palette.primary.main} radius={[0, 4, 4, 0]} barSize={20} />
                                </BarChart>
                            </ResponsiveContainer>
                        ) : (
                            <Box display="flex" justifyContent="center" alignItems="center" height="100%" sx={{ bgcolor: alpha(theme.palette.divider, 0.05), borderRadius: 2 }}>
                                <Typography variant="body2" color="text.secondary">No department data available</Typography>
                            </Box>
                        )}
                    </AnalyticsCard>
                </Grid>

                {/* Today's Attendance Summary */}
                <Grid item xs={12} md={6}>
                    <AnalyticsCard title="Today's Attendance" subtitle="Current status breakdown" icon={EventAvailableIcon}>
                        {analyticsData?.todayAttendanceSummary?.length > 0 ? (
                            <ResponsiveContainer width="100%" height={280}>
                                <PieChart>
                                    <Pie
                                        data={analyticsData.todayAttendanceSummary}
                                        cx="50%"
                                        cy="50%"
                                        labelLine={false}
                                        outerRadius={90}
                                        fill="#8884d8"
                                        dataKey="count"
                                        nameKey="status"
                                    >
                                        {analyticsData.todayAttendanceSummary.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip
                                        contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                                    />
                                    <Legend />
                                </PieChart>
                            </ResponsiveContainer>
                        ) : (
                            <Box display="flex" justifyContent="center" alignItems="center" height="100%" sx={{ bgcolor: alpha(theme.palette.divider, 0.05), borderRadius: 2 }}>
                                <Typography variant="body2" color="text.secondary">No attendance recorded today</Typography>
                            </Box>
                        )}
                    </AnalyticsCard>
                </Grid>
            </Grid>
        </Box>
    );
};

export default Analytics;

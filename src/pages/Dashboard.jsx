import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Box,
    Typography,
    Grid,
    Paper,
    Avatar,
    IconButton,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Chip,
    Button,
    alpha,
    useTheme,
    Divider,
    CircularProgress,
    Alert,
    FormControl,
    InputLabel,
    Select,
    MenuItem
} from '@mui/material';
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';
import AddIcon from '@mui/icons-material/Add';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import BusinessIcon from '@mui/icons-material/Business';
import BadgeIcon from '@mui/icons-material/Badge';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import GroupsIcon from '@mui/icons-material/Groups';
import PaymentsIcon from '@mui/icons-material/Payments';

import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Cell,
    PieChart,
    Pie,
    Legend,
    AreaChart,
    Area,
    LineChart,
    Line
} from 'recharts';

import { useAnalytics } from '../context/AnalyticsContext';
import { useEmployee } from '../context/EmployeeContext';
import { useAuth } from '../context/AuthContext';
import { useDepartment } from '../context/DepartmentContext';
import { useDesignation } from '../context/DesignationContext';
import { useLeave } from '../context/LeaveContext';
import { useSalary } from '../context/SalaryContext';
import { usePayroll } from '../context/PayrollContext';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';

const MetricCard = ({ title, value, subtitle, onClick, type = 'primary', icon }) => {
    const theme = useTheme();

    // Color Schemes based on Type
    const getColors = (type) => {
        switch (type) {
            case 'success': return {
                main: '#10b981',
                light: alpha('#10b981', 0.2),
                dark: '#059669',
                text: '#fff'
            };
            case 'error': return {
                main: '#ef4444',
                light: alpha('#ef4444', 0.2),
                dark: '#dc2626',
                text: '#fff'
            };
            case 'warning': return {
                main: '#f59e0b',
                light: alpha('#f59e0b', 0.2),
                dark: '#d97706',
                text: '#fff'
            };
            case 'info': return {
                main: '#3b82f6',
                light: alpha('#3b82f6', 0.2),
                dark: '#2563eb',
                text: '#fff'
            };
            default: return {
                main: '#3c467b',
                light: '#636ccb',
                dark: '#2d355d',
                text: '#fff'
            };
        }
    };

    const colors = getColors(type);

    return (
        <Paper
            elevation={0}
            sx={{
                p: 3,
                height: '100%',
                bgcolor: colors.main,
                color: colors.text,
                cursor: onClick ? 'pointer' : 'default',
                transition: 'all 0.3s ease-in-out',
                position: 'relative',
                overflow: 'hidden',
                borderRadius: 4,
                '&:hover': onClick ? {
                    transform: 'translateY(-8px)',
                    boxShadow: `0 12px 24px ${alpha(colors.main, 0.4)}`
                } : {},
                '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: -10,
                    right: -10,
                    width: '120px',
                    height: '120px',
                    background: colors.light,
                    borderRadius: '50%',
                    opacity: 0.8,
                    zIndex: 0
                }
            }}
            onClick={onClick}
        >
            <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2} position="relative" zIndex={1}>
                <Typography variant="body2" fontWeight="700" sx={{ color: alpha(colors.text, 0.9), letterSpacing: '0.02em', textTransform: 'uppercase' }}>
                    {title}
                </Typography>
                {icon && (
                    <Box
                        sx={{
                            p: 1,
                            borderRadius: 2,
                            bgcolor: alpha('#fff', 0.15),
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}
                    >
                        {React.cloneElement(icon, { sx: { fontSize: 20, color: '#fff' } })}
                    </Box>
                )}
            </Box>

            <Typography variant="h3" fontWeight="900" color="white" position="relative" zIndex={1} sx={{ mb: 0.5, letterSpacing: '-1px' }}>
                {value}
            </Typography>

            {subtitle && (
                <Typography variant="caption" sx={{ color: alpha('#fff', 0.7), fontWeight: 600, position: 'relative', zIndex: 1 }}>
                    {subtitle}
                </Typography>
            )}
        </Paper>
    );
};

const Dashboard = () => {
    const theme = useTheme();
    const navigate = useNavigate();
    const { analyticsData, loading, error, fetchAnalyticsData } = useAnalytics();
    const { employees, fetchMyProfile, updateMyProfile } = useEmployee();
    const { departments } = useDepartment();
    const { designations } = useDesignation();
    const { allLeaves, fetchAllLeaves } = useLeave();
    const { user } = useAuth();
    // New hooks
    const { fetchMySalary } = useSalary();
    const { fetchMyPayrollHistory } = usePayroll();

    const [profile, setProfile] = useState(null);
    const [mySalary, setMySalary] = useState(null);
    const [myPayrollHistory, setMyPayrollHistory] = useState([]);
    const [profileLoading, setProfileLoading] = useState(false);
    const [selectedDepartment, setSelectedDepartment] = useState('All');

    const [debugInfo, setDebugInfo] = useState(null);

    useEffect(() => {
        if (fetchAnalyticsData) fetchAnalyticsData();

        if (user?.role === 'EMPLOYEE') {
            loadProfile();
            loadFinancials();
        } else if (user?.role === 'ADMIN' || user?.role === 'HR') {
            if (fetchAllLeaves) fetchAllLeaves();
        }
    }, [user]);

    const loadProfile = async () => {
        setProfileLoading(true);
        const result = await fetchMyProfile();
        // fetchMyProfile returns data directly or null. 
        // We need to modify it to return the full payload including error to see debug info.
        // Wait, fetchMyProfile in context swallows the error!
        // We must update fetchMyProfile in context first.
        if (result && result._id) {
            setProfile(result);
            setUpdateForm({ name: result.name, phone: result.phone || '' });
        } else if (result && result.debug) {
            setDebugInfo(result.debug);
        }
        setProfileLoading(false);
    };

    const loadFinancials = async () => {
        const salaryRes = await fetchMySalary();
        if (salaryRes.success) {
            setMySalary(salaryRes.data);
        }
        const payrollRes = await fetchMyPayrollHistory();
        if (payrollRes.success) {
            setMyPayrollHistory(payrollRes.data);
        }
    };

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

    if (debugInfo) {
        return (
            <Box p={4}>
                <Alert severity="warning" sx={{ mb: 2 }}>
                    <Typography variant="h6">Profile Data Not Found</Typography>
                    <Typography>We could not find an Employee record linked to your account.</Typography>
                    <Box mt={2} p={2} bgcolor="#fff3e0" borderRadius={1}>
                        <Typography variant="caption" display="block" fontFamily="monospace">
                            <strong>Logged in as:</strong> {debugInfo.searchedEmail}
                        </Typography>
                        <Typography variant="caption" display="block" fontFamily="monospace">
                            Please ask Admin to ensure your Employee record email matches exactly.
                        </Typography>
                    </Box>
                </Alert>
            </Box>
        );
    }

    // ... existing colors ...

    return (
        <Box sx={{ p: { xs: 1, md: 3 } }}>
            <Box mb={4}>
                <Typography variant="h5" fontWeight="800">Welcome back, {user?.name || 'User'}!</Typography>
                <Typography variant="body2" color="text.secondary">Monday, {new Date().toLocaleDateString('en-US', { day: '2-digit', month: '2-digit', year: 'numeric' })} | Sunny day in Office</Typography>
            </Box>

            {user?.role === 'EMPLOYEE' && (
                <>
                    {/* Top Cards for Employee */}
                    <Typography variant="h6" fontWeight="800" mb={3}>Overview</Typography>
                    <Grid container spacing={3} mb={4}>
                        <Grid item xs={12} sm={6} md={3}>
                            <MetricCard
                                title="My Designation"
                                value={profile?.designation?.name || 'N/A'}
                                subtitle="Current Role"
                                icon={<BadgeIcon />}
                                type="primary"
                            />
                        </Grid>
                        <Grid item xs={12} sm={6} md={3}>
                            <MetricCard
                                title="My Department"
                                value={profile?.department || 'N/A'}
                                subtitle="Team"
                                icon={<BusinessIcon />}
                                type="info"
                            />
                        </Grid>
                        <Grid item xs={12} sm={6} md={3}>
                            <MetricCard
                                title="My Salary"
                                value={mySalary ? `₹${mySalary.netSalary.toLocaleString()}` : 'Not Set'}
                                subtitle="Net Monthly Pay"
                                icon={<AccountBalanceWalletIcon />}
                                type="success"
                            />
                        </Grid>
                        <Grid item xs={12} sm={6} md={3}>
                            <MetricCard
                                title="Joining Date"
                                value={profile?.joiningDate ? new Date(profile.joiningDate).toLocaleDateString() : 'N/A'}
                                subtitle="Date of Joining"
                                icon={<CalendarMonthIcon />}
                                type="warning"
                            />
                        </Grid>
                    </Grid>
                </>
            )}

            {/* HR / ADMIN Dashboard View */}
            {['ADMIN', 'HR'].includes(user?.role) && (
                <>
                    {/* Top Summary Cards */}
                    <Typography variant="h6" fontWeight="800" mb={3}>Overview</Typography>
                    <Grid container spacing={3} mb={4}>
                        <Grid item xs={12} sm={6} md={2.4}>
                            <MetricCard
                                title="Total Employees"
                                value={analyticsData?.metrics?.totalEmployees || 0}
                                subtitle="All staff"
                                onClick={() => navigate('/employees')}
                                icon={<GroupsIcon />}
                                type="primary"
                            />
                        </Grid>
                        <Grid item xs={12} sm={6} md={2.4}>
                            <MetricCard
                                title="Active"
                                value={analyticsData?.metrics?.activeEmployees || 0}
                                subtitle="Currently working"
                                icon={<CheckCircleOutlineIcon />}
                                type="success"
                            />
                        </Grid>
                        <Grid item xs={12} sm={6} md={2.4}>
                            <MetricCard
                                title="Inactive"
                                value={analyticsData?.metrics?.inactiveEmployees || 0}
                                subtitle="Resigned/Terminated"
                                icon={<AccessTimeIcon />}
                                type="error"
                            />
                        </Grid>
                        <Grid item xs={12} sm={6} md={2.4}>
                            <MetricCard
                                title="Departments"
                                value={analyticsData?.metrics?.departmentsCount || 0}
                                subtitle="Operational Units"
                                onClick={() => navigate('/departments')}
                                icon={<BusinessIcon />}
                                type="info"
                            />
                        </Grid>
                        <Grid item xs={12} sm={6} md={2.4}>
                            <MetricCard
                                title="Payroll (Month)"
                                value={`₹${(analyticsData?.metrics?.payrollThisMonth || 0).toLocaleString()}`}
                                subtitle="Generated this month"
                                onClick={() => navigate('/payroll')}
                                icon={<PaymentsIcon />}
                                type="warning"
                            />
                        </Grid>
                    </Grid>

                    {/* Charts Section */}
                    <Grid container spacing={3} mb={4}>
                        {/* 1. Employees by Department */}
                        <Grid item xs={12} lg={4}>
                            <Paper elevation={0} sx={{ p: 3, border: '1px solid #e2e8f0', height: '400px', borderRadius: 4 }}>
                                <Typography variant="h6" fontWeight="800" mb={1}>Department Distribution</Typography>
                                <Typography variant="caption" color="text.secondary" mb={3} display="block">Headcount per department</Typography>
                                <ResponsiveContainer width="100%" height={280}>
                                    <BarChart data={analyticsData?.departmentStats || []} layout="vertical" margin={{ left: 0, right: 30 }}>
                                        <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#f1f5f9" />
                                        <XAxis type="number" hide />
                                        <YAxis dataKey="name" type="category" width={100} tick={{ fontSize: 11, fontWeight: 600, fill: '#64748b' }} axisLine={false} tickLine={false} />
                                        <Tooltip cursor={{ fill: alpha('#f1f5f9', 0.5) }} contentStyle={{ borderRadius: 8, border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                                        <Bar dataKey="count" fill="#3b82f6" radius={[0, 4, 4, 0]} barSize={20} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </Paper>
                        </Grid>

                        {/* 2. Monthly Payroll Cost */}
                        <Grid item xs={12} lg={4}>
                            <Paper elevation={0} sx={{ p: 3, border: '1px solid #e2e8f0', height: '400px', borderRadius: 4 }}>
                                <Typography variant="h6" fontWeight="800" mb={1}>Monthly Payroll Cost</Typography>
                                <Typography variant="caption" color="text.secondary" mb={3} display="block">Salary expenses trend</Typography>
                                <ResponsiveContainer width="100%" height={280}>
                                    <LineChart data={(analyticsData?.payrollHistory || []).map(item => ({ month: item._id?.month || item.month, cost: item.cost }))}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                        <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                                        <YAxis tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} tickFormatter={(val) => `₹${val / 1000}k`} />
                                        <Tooltip formatter={(value) => [`₹${value.toLocaleString()}`, 'Cost']} contentStyle={{ borderRadius: 8 }} />
                                        <Line type="monotone" dataKey="cost" stroke="#8b5cf6" strokeWidth={3} dot={{ r: 4, fill: '#8b5cf6', strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 6 }} />
                                    </LineChart>
                                </ResponsiveContainer>
                            </Paper>
                        </Grid>

                        {/* 3. Employee Joinings */}
                        <Grid item xs={12} lg={4}>
                            <Paper elevation={0} sx={{ p: 3, border: '1px solid #e2e8f0', height: '400px', borderRadius: 4 }}>
                                <Typography variant="h6" fontWeight="800" mb={1}>Hiring Trends</Typography>
                                <Typography variant="caption" color="text.secondary" mb={3} display="block">New joiners (Last 12 Months)</Typography>
                                <ResponsiveContainer width="100%" height={280}>
                                    <AreaChart data={analyticsData?.hiringTrends || []}>
                                        <defs>
                                            <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#10b981" stopOpacity={0.2} />
                                                <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                        <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                                        <YAxis tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} allowDecimals={false} />
                                        <Tooltip contentStyle={{ borderRadius: 8 }} />
                                        <Area type="monotone" dataKey="count" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorCount)" />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </Paper>
                        </Grid>
                    </Grid>

                    {/* Employee List Table (Admin/HR) */}
                    <Paper elevation={0} sx={{ p: 3, border: '1px solid #e2e8f0', borderRadius: 4 }}>
                        <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
                            <Box display="flex" alignItems="center" gap={3}>
                                <Typography variant="h6" fontWeight="800">Review Employees</Typography>
                                <FormControl size="small" sx={{ minWidth: 200 }}>
                                    <InputLabel id="dept-filter-label">Department</InputLabel>
                                    <Select
                                        labelId="dept-filter-label"
                                        value={selectedDepartment}
                                        label="Department"
                                        onChange={(e) => setSelectedDepartment(e.target.value)}
                                        sx={{ borderRadius: 2 }}
                                    >
                                        <MenuItem value="All">All Departments</MenuItem>
                                        {departments.map((dept) => (
                                            <MenuItem key={dept._id} value={dept.name}>{dept.name}</MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Box>
                            <Button variant="outlined" onClick={() => navigate('/employees')}>View All</Button>
                        </Box>
                        <TableContainer>
                            <Table>
                                <TableHead>
                                    <TableRow sx={{ bgcolor: alpha(theme.palette.text.secondary, 0.02) }}>
                                        <TableCell sx={{ fontWeight: 700 }}>Name</TableCell>
                                        <TableCell sx={{ fontWeight: 700 }}>Role</TableCell>
                                        <TableCell sx={{ fontWeight: 700 }}>Department</TableCell>
                                        <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {employees
                                        .filter(emp => selectedDepartment === 'All' || emp.department === selectedDepartment)
                                        .slice(0, 5)
                                        .map((emp) => (
                                            <TableRow key={emp._id} hover>
                                                <TableCell sx={{ fontWeight: 600 }}>{emp.name}</TableCell>
                                                <TableCell sx={{ color: 'text.secondary' }}>{emp.designation?.name || 'N/A'}</TableCell>
                                                <TableCell sx={{ color: 'text.secondary' }}>{emp.department || 'N/A'}</TableCell>
                                                <TableCell>
                                                    <Chip
                                                        label={emp.status || 'Active'}
                                                        size="small"
                                                        sx={{
                                                            fontWeight: 700,
                                                            borderRadius: 1.5,
                                                            fontSize: '0.75rem',
                                                            textTransform: 'uppercase',
                                                            letterSpacing: '0.5px',
                                                            bgcolor: emp.status === 'Inactive' ? '#FFE5E5' : '#D4E8E0',
                                                            color: emp.status === 'Inactive' ? '#8B0000' : '#1E3A2F'
                                                        }}
                                                    />
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Paper>
                </>
            )}
        </Box>
    );
};

export default Dashboard;

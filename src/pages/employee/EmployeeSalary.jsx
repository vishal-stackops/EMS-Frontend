import React, { useState, useEffect } from 'react';
import {
    Box, Typography, Paper, Grid, CircularProgress, Alert, Divider, alpha, useTheme
} from '@mui/material';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import PaymentsIcon from '@mui/icons-material/Payments';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import { useSalary } from '../../context/SalaryContext';

const EmployeeSalary = () => {
    const theme = useTheme();
    const { fetchMySalary } = useSalary();
    const [salary, setSalary] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        loadSalary();
    }, []);

    const loadSalary = async () => {
        setLoading(true);
        const result = await fetchMySalary();
        if (result.success) {
            setSalary(result.data);
        } else {
            // It's possible salary isn't set yet
            setError(result.error);
        }
        setLoading(false);
    };

    if (loading) return <Box display="flex" justifyContent="center" p={5}><CircularProgress /></Box>;

    return (
        <Box sx={{ p: { xs: 2, md: 4 } }}>
            <Typography variant="h4" fontWeight="800" mb={1}>My Salary Structure</Typography>
            <Typography variant="body1" color="text.secondary" mb={4}>Overview of your current compensation package</Typography>

            {!salary ? (
                <Paper sx={{ p: 4, textAlign: 'center', bgcolor: alpha(theme.palette.error.main, 0.05), color: theme.palette.error.main }}>
                    <Typography variant="h6">Salary details not available yet. Please contact HR.</Typography>
                </Paper>
            ) : (
                <Grid container spacing={4}>
                    <Grid item xs={12} md={4}>
                        <Paper elevation={0} sx={{ p: 4, border: '1px solid #e2e8f0', borderRadius: 4, height: '100%', bgcolor: theme.palette.primary.main, color: '#fff' }}>
                            <Box display="flex" alignItems="center" gap={2} mb={4}>
                                <Box sx={{ p: 1, bgcolor: 'rgba(255,255,255,0.2)', borderRadius: 2 }}><AccountBalanceWalletIcon /></Box>
                                <Typography variant="subtitle1" fontWeight="600" sx={{ opacity: 0.9 }}>Net Monthly Salary</Typography>
                            </Box>
                            <Typography variant="h3" fontWeight="800" mb={1}>₹{salary.netSalary.toLocaleString()}</Typography>
                            <Typography variant="body2" sx={{ opacity: 0.8 }}>Credited by end of each month</Typography>
                        </Paper>
                    </Grid>

                    <Grid item xs={12} md={8}>
                        <Paper elevation={0} sx={{ p: 4, border: '1px solid #e2e8f0', borderRadius: 4 }}>
                            <Typography variant="h6" fontWeight="800" mb={3}>Breakdown</Typography>
                            <Box display="flex" flexDirection="column" gap={3}>
                                <Box display="flex" justifyContent="space-between" alignItems="center">
                                    <Box display="flex" alignItems="center" gap={2}>
                                        <AccountBalanceIcon color="action" />
                                        <Typography variant="body1" fontWeight="600">Basic Salary</Typography>
                                    </Box>
                                    <Typography variant="h6">₹{salary.basicSalary.toLocaleString()}</Typography>
                                </Box>
                                <Divider />
                                <Box display="flex" justifyContent="space-between" alignItems="center">
                                    <Box display="flex" alignItems="center" gap={2}>
                                        <PaymentsIcon color="success" />
                                        <Typography variant="body1" fontWeight="600">Allowances</Typography>
                                    </Box>
                                    <Typography variant="h6" color="success.main">+ ₹{salary.allowances.toLocaleString()}</Typography>
                                </Box>
                                <Divider />
                                <Box display="flex" justifyContent="space-between" alignItems="center">
                                    <Box display="flex" alignItems="center" gap={2}>
                                        <PaymentsIcon color="error" />
                                        <Typography variant="body1" fontWeight="600">Deductions</Typography>
                                    </Box>
                                    <Typography variant="h6" color="error.main">- ₹{salary.deductions.toLocaleString()}</Typography>
                                </Box>
                                <Divider />
                                <Box display="flex" justifyContent="space-between" alignItems="center" sx={{ bgcolor: '#f8fafc', p: 2, borderRadius: 2 }}>
                                    <Typography variant="h6" fontWeight="800">Total Net Salary</Typography>
                                    <Typography variant="h5" fontWeight="800" color="primary">₹{salary.netSalary.toLocaleString()}</Typography>
                                </Box>
                            </Box>
                        </Paper>
                    </Grid>
                </Grid>
            )}
        </Box>
    );
};

export default EmployeeSalary;

import React, { useState } from 'react';
import { Box, Paper, Typography, TextField, Button, Grid, MenuItem, Alert, Snackbar, Link, useTheme } from '@mui/material';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import HexagonIcon from '@mui/icons-material/Hexagon';
import api from '../services/api';
import { Link as RouterLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Register = ({ isPublic = false }) => {
    const { user } = useAuth();
    const theme = useTheme();
    const isAdmin = user?.role === 'ADMIN' || user?.role?.name === 'ADMIN';

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        roleName: 'EMPLOYEE'
    });
    const [status, setStatus] = useState({ type: '', message: '' });
    const [openSnackbar, setOpenSnackbar] = useState(false);

    const roles = ['EMPLOYEE', 'ADMIN', 'HR'];

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus({ type: '', message: '' });

        try {
            await api.post('/auth/register', formData);
            const successMsg = isPublic
                ? 'Registration successful! Please wait for admin approval before logging in.'
                : 'Employee registered successfully!';
            setStatus({ type: 'success', message: successMsg });
            setFormData({ name: '', email: '', password: '', roleName: 'EMPLOYEE' }); // Reset form
        } catch (error) {
            console.error('Registration failed:', error);
            const errorMsg = error.response?.data?.message || 'Registration failed. Please try again.';
            setStatus({ type: 'error', message: errorMsg });
        }
        setOpenSnackbar(true);
    };

    const handleCloseSnackbar = () => {
        setOpenSnackbar(false);
    };

    const formContent = (
        <Paper elevation={isPublic ? 10 : 3} sx={{ p: 4, borderRadius: 2, width: '100%', maxWidth: isPublic ? 450 : '100%' }}>
            {isPublic ? (
                /* Empify Logo for Public Signup */
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
                        <Box
                            sx={{
                                width: 48,
                                height: 48,
                                bgcolor: theme.palette.primary.main,
                                borderRadius: '14px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: '#fff',
                                boxShadow: '0 8px 16px -4px rgba(60, 70, 123, 0.4)'
                            }}
                        >
                            <HexagonIcon sx={{ fontSize: 30 }} />
                        </Box>
                        <Typography
                            variant="h4"
                            fontWeight="800"
                            sx={{
                                background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                            }}
                        >
                            Empify
                        </Typography>
                    </Box>
                    <Typography component="h1" variant="h6" color="text.secondary" fontWeight="500">
                        Create your account
                    </Typography>
                </Box>
            ) : (
                /* Admin Register Header */
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3, justifyContent: 'flex-start' }}>
                    <PersonAddIcon sx={{ fontSize: 40, color: 'primary.main', mr: 2 }} />
                    <Typography variant="h5" component="h1" fontWeight="bold">
                        Register New Employee
                    </Typography>
                </Box>
            )}

            <form onSubmit={handleSubmit}>
                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            label="Full Name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            margin="normal"
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            label="Email Address"
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            margin="normal"
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            label="Password"
                            name="password"
                            type="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            margin="normal"
                        />
                    </Grid>
                    {/* Only show Role selection for ADMINs in internal registration */}
                    {!isPublic && isAdmin && (
                        <Grid item xs={12}>
                            <TextField
                                select
                                fullWidth
                                label="Role"
                                name="roleName"
                                value={formData.roleName}
                                onChange={handleChange}
                                margin="normal"
                            >
                                {roles.map((role) => (
                                    <MenuItem key={role} value={role}>
                                        {role}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </Grid>
                    )}
                    <Grid item xs={12} sx={{ mt: 2 }}>
                        <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                            size="large"
                            fullWidth
                            sx={{ py: 1.5, fontWeight: 'bold' }}
                        >
                            {isPublic ? 'Register' : 'Register Employee'}
                        </Button>
                    </Grid>
                </Grid>

                {isPublic && (
                    <Box sx={{ mt: 3, textAlign: 'center' }}>
                        <Typography variant="body2" color="text.secondary" display="inline">
                            Already have an account?{' '}
                        </Typography>
                        <Link component={RouterLink} to="/login" variant="body2" sx={{ textDecoration: 'none', fontWeight: 'bold' }}>
                            Sign In
                        </Link>
                    </Box>
                )}
            </form>
        </Paper>
    );

    if (isPublic) {
        return (
            <Box
                sx={{
                    minHeight: '100vh',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    bgcolor: 'background.default',
                    background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
                    p: 2
                }}
            >
                {formContent}
                <Snackbar
                    open={openSnackbar}
                    autoHideDuration={6000}
                    onClose={handleCloseSnackbar}
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                >
                    <Alert onClose={handleCloseSnackbar} severity={status.type || 'info'} sx={{ width: '100%' }}>
                        {status.message}
                    </Alert>
                </Snackbar>
            </Box>
        );
    }

    return (
        <Box sx={{ maxWidth: 600, mx: 'auto', mt: 4 }}>
            {formContent}
            <Snackbar
                open={openSnackbar}
                autoHideDuration={6000}
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert onClose={handleCloseSnackbar} severity={status.type || 'info'} sx={{ width: '100%' }}>
                    {status.message}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default Register;

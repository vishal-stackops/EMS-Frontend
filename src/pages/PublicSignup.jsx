import React, { useState } from 'react';
import { Box, Paper, Typography, TextField, Button, Alert, Link, useTheme } from '@mui/material';
import HexagonIcon from '@mui/icons-material/Hexagon';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const PublicSignup = () => {
    const { signup } = useAuth();
    const theme = useTheme();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [status, setStatus] = useState({ type: '', message: '' });
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus({ type: '', message: '' });
        setLoading(true);

        // Validate password confirmation
        if (formData.password !== formData.confirmPassword) {
            setStatus({ type: 'error', message: 'Passwords do not match' });
            setLoading(false);
            return;
        }

        try {
            const result = await signup(formData.name, formData.email, formData.password);

            if (result.success) {
                setStatus({ type: 'success', message: result.message });
                setFormData({ name: '', email: '', password: '', confirmPassword: '' });

                // Redirect to login after 3 seconds
                setTimeout(() => {
                    navigate('/login');
                }, 3000);
            } else {
                setStatus({ type: 'error', message: result.error });
            }
        } catch (error) {
            setStatus({ type: 'error', message: 'An unexpected error occurred' });
        } finally {
            setLoading(false);
        }
    };

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
            <Paper elevation={10} sx={{ p: 4, borderRadius: 2, width: '100%', maxWidth: 450 }}>
                {/* Empify Logo */}
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

                {status.message && (
                    <Alert severity={status.type} sx={{ mb: 2 }}>
                        {status.message}
                    </Alert>
                )}

                <form onSubmit={handleSubmit}>
                    <TextField
                        fullWidth
                        label="Full Name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        margin="normal"
                    />
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
                    <TextField
                        fullWidth
                        label="Confirm Password"
                        name="confirmPassword"
                        type="password"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        required
                        margin="normal"
                    />
                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        size="large"
                        fullWidth
                        disabled={loading}
                        sx={{ mt: 3, py: 1.5, fontWeight: 'bold' }}
                    >
                        {loading ? 'Creating Account...' : 'Sign Up'}
                    </Button>
                </form>

                <Box sx={{ mt: 3, textAlign: 'center' }}>
                    <Typography variant="body2" color="text.secondary" display="inline">
                        Already have an account?{' '}
                    </Typography>
                    <Link component={RouterLink} to="/login" variant="body2" sx={{ textDecoration: 'none', fontWeight: 'bold' }}>
                        Sign In
                    </Link>
                </Box>
            </Paper>
        </Box>
    );
};

export default PublicSignup;

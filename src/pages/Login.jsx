import React, { useState } from 'react';
import { Box, Paper, Typography, TextField, Button, Alert, Checkbox, FormControlLabel, Link } from '@mui/material';
import HexagonIcon from '@mui/icons-material/Hexagon';
import { useTheme } from '@mui/material';

import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
    const theme = useTheme();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { login } = useAuth();
    const [showPassword, setShowPassword] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        const result = await login(email, password);
        if (result.success) {
            navigate('/');
        } else if (result.approvalStatus === 'PENDING') {
            // Redirect to pending approval page
            navigate('/pending-approval');
        } else {
            setError(result.error);
        }
    };

    return (
        <Box
            sx={{
                height: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                bgcolor: 'background.default',
                background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`
            }}
        >
            <Paper elevation={10} sx={{ p: 4, width: '100%', maxWidth: 400, borderRadius: 3 }}>
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
                        Sign In to continue
                    </Typography>
                </Box>

                {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

                <form onSubmit={handleSubmit}>
                    <TextField
                        fullWidth
                        label="Email Address"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        margin="normal"
                        autoFocus
                    />
                    <TextField
                        fullWidth
                        label="Password"
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        margin="normal"
                    />
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={showPassword}
                                onChange={(e) => setShowPassword(e.target.checked)}
                                color="primary"
                            />
                        }
                        label="Show Password"
                    />

                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3, mb: 2, bgcolor: 'primary.main', height: 48, fontSize: '1rem' }}
                    >
                        Sign In
                    </Button>
                    <Box sx={{ textAlign: 'center' }}>
                        <Link component={RouterLink} to="/signup" variant="body2" sx={{ textDecoration: 'none', fontWeight: 'bold' }}>
                            Don't have an account? Sign Up
                        </Link>
                    </Box>
                </form>
            </Paper>
        </Box>
    );
};

export default Login;

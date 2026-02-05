import React from 'react';
import { Box, Paper, Typography, Button, useTheme } from '@mui/material';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const PendingApproval = () => {
    const { logout } = useAuth();
    const theme = useTheme();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
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
            <Paper elevation={10} sx={{ p: 5, borderRadius: 2, maxWidth: 500, textAlign: 'center' }}>
                <HourglassEmptyIcon sx={{ fontSize: 80, color: 'warning.main', mb: 2 }} />

                <Typography variant="h5" fontWeight="bold" gutterBottom>
                    Account Pending Approval
                </Typography>

                <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
                    Your account is currently pending admin approval. You'll be able to access the dashboard once an administrator approves your registration.
                </Typography>

                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                    Please check back later or contact your administrator for more information.
                </Typography>

                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleLogout}
                    sx={{ px: 4, py: 1.5 }}
                >
                    Back to Login
                </Button>
            </Paper>
        </Box>
    );
};

export default PendingApproval;

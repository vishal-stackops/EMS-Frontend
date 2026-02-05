import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Box, CircularProgress } from '@mui/material';

const PrivateRoute = ({ children, allowedRoles }) => {
    const { user, loading } = useAuth();

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <CircularProgress />
            </Box>
        );
    }

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    // Check for roles if allowedRoles prop is provided
    if (allowedRoles && allowedRoles.length > 0) {
        const userRole = user.role?.name || user.role; // Handle both object (populated) and string roles
        if (!allowedRoles.includes(userRole)) {
            // Redirect to dashboard or unauthorized page if role doesn't match
            return <Navigate to="/" replace />;
        }
    }

    return children;
};

export default PrivateRoute;

import React, { useState, useEffect } from 'react';
import {
    Box, Paper, Typography, Table, TableBody, TableCell, TableContainer,
    TableHead, TableRow, Button, Dialog, DialogTitle, DialogContent,
    DialogActions, TextField, Alert, Chip, IconButton, Tooltip
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import api from '../services/api';

const PendingUsers = () => {
    const [pendingUsers, setPendingUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [rejectDialog, setRejectDialog] = useState({ open: false, userId: null });
    const [rejectionReason, setRejectionReason] = useState('');
    const [status, setStatus] = useState({ type: '', message: '' });

    useEffect(() => {
        fetchPendingUsers();
    }, []);

    const fetchPendingUsers = async () => {
        try {
            setLoading(true);
            const response = await api.get('/users/pending');
            setPendingUsers(response.data);
        } catch (error) {
            console.error('Error fetching pending users:', error);
            setStatus({ type: 'error', message: 'Failed to load pending users' });
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = async (userId) => {
        try {
            await api.put(`/users/${userId}/approve`);
            setStatus({ type: 'success', message: 'User approved successfully!' });
            fetchPendingUsers(); // Refresh list
        } catch (error) {
            console.error('Error approving user:', error);
            setStatus({ type: 'error', message: error.response?.data?.message || 'Failed to approve user' });
        }
    };

    const handleRejectClick = (userId) => {
        setRejectDialog({ open: true, userId });
        setRejectionReason('');
    };

    const handleRejectConfirm = async () => {
        try {
            await api.put(`/users/${rejectDialog.userId}/reject`, { reason: rejectionReason });
            setStatus({ type: 'success', message: 'User rejected successfully' });
            setRejectDialog({ open: false, userId: null });
            setRejectionReason('');
            fetchPendingUsers(); // Refresh list
        } catch (error) {
            console.error('Error rejecting user:', error);
            setStatus({ type: 'error', message: error.response?.data?.message || 'Failed to reject user' });
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <Box sx={{ maxWidth: 1200, mx: 'auto', mt: 4, p: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <PersonAddIcon sx={{ fontSize: 40, color: 'primary.main', mr: 2 }} />
                <Typography variant="h4" component="h1" fontWeight="bold">
                    Pending User Approvals
                </Typography>
            </Box>

            {status.message && (
                <Alert severity={status.type} sx={{ mb: 3 }} onClose={() => setStatus({ type: '', message: '' })}>
                    {status.message}
                </Alert>
            )}

            <TableContainer component={Paper} elevation={3}>
                <Table>
                    <TableHead>
                        <TableRow sx={{ bgcolor: 'primary.main' }}>
                            <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Name</TableCell>
                            <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Email</TableCell>
                            <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Role</TableCell>
                            <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Registration Date</TableCell>
                            <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Status</TableCell>
                            <TableCell sx={{ color: 'white', fontWeight: 'bold' }} align="center">Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={6} align="center">Loading...</TableCell>
                            </TableRow>
                        ) : pendingUsers.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} align="center">
                                    <Typography variant="body1" color="text.secondary" sx={{ py: 3 }}>
                                        No pending user approvals
                                    </Typography>
                                </TableCell>
                            </TableRow>
                        ) : (
                            pendingUsers.map((user) => (
                                <TableRow key={user._id} hover>
                                    <TableCell>{user.name}</TableCell>
                                    <TableCell>{user.email}</TableCell>
                                    <TableCell>
                                        <Chip label={user.role?.name || 'EMPLOYEE'} size="small" color="primary" />
                                    </TableCell>
                                    <TableCell>{formatDate(user.createdAt)}</TableCell>
                                    <TableCell>
                                        <Chip label="PENDING" size="small" color="warning" />
                                    </TableCell>
                                    <TableCell align="center">
                                        <Tooltip title="Approve">
                                            <IconButton
                                                color="success"
                                                onClick={() => handleApprove(user._id)}
                                                sx={{ mr: 1 }}
                                            >
                                                <CheckCircleIcon />
                                            </IconButton>
                                        </Tooltip>
                                        <Tooltip title="Reject">
                                            <IconButton
                                                color="error"
                                                onClick={() => handleRejectClick(user._id)}
                                            >
                                                <CancelIcon />
                                            </IconButton>
                                        </Tooltip>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Reject Dialog */}
            <Dialog open={rejectDialog.open} onClose={() => setRejectDialog({ open: false, userId: null })}>
                <DialogTitle>Reject User Registration</DialogTitle>
                <DialogContent>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        Are you sure you want to reject this user? You can optionally provide a reason.
                    </Typography>
                    <TextField
                        fullWidth
                        label="Rejection Reason (Optional)"
                        multiline
                        rows={3}
                        value={rejectionReason}
                        onChange={(e) => setRejectionReason(e.target.value)}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setRejectDialog({ open: false, userId: null })}>Cancel</Button>
                    <Button onClick={handleRejectConfirm} color="error" variant="contained">
                        Reject User
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default PendingUsers;

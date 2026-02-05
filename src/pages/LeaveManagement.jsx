import React, { useEffect, useState } from 'react';
import {
    Typography, Table, TableBody, TableCell, TableContainer,
    TableHead, TableRow, Paper, Box, IconButton, Tooltip, Snackbar, Alert
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import { useLeave } from '../context/LeaveContext';

const LeaveManagement = () => {
    const { allLeaves, fetchAllLeaves, updateStatus, loading } = useLeave();
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

    useEffect(() => {
        fetchAllLeaves();
    }, []);

    const handleAction = async (id, status) => {
        const result = await updateStatus(id, status);
        if (result.success) {
            setSnackbar({ open: true, message: `Leave ${status} successfully`, severity: 'success' });
        } else {
            setSnackbar({ open: true, message: result.error, severity: 'error' });
        }
    };

    return (
        <Box>
            <Typography variant="h4" sx={{ mb: 3 }}>Leave Management</Typography>

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Employee</TableCell>
                            <TableCell>Department</TableCell>
                            <TableCell>Designation</TableCell>
                            <TableCell>Type</TableCell>
                            <TableCell>Dates</TableCell>
                            <TableCell>Reason</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell align="right">Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {allLeaves.map((l) => (
                            <TableRow key={l._id}>
                                <TableCell>{l.employee?.name || 'N/A'}</TableCell>
                                <TableCell>{l.employee?.department || 'N/A'}</TableCell>
                                <TableCell>{l.employee?.designation?.name || 'N/A'}</TableCell>
                                <TableCell>{l.leaveType?.name}</TableCell>
                                <TableCell>
                                    {new Date(l.startDate).toLocaleDateString()} - {new Date(l.endDate).toLocaleDateString()}
                                </TableCell>
                                <TableCell>{l.reason}</TableCell>
                                <TableCell>
                                    <Box sx={{
                                        px: 1.5, py: 0.5, borderRadius: 1.5, display: 'inline-block',
                                        bgcolor: l.status === 'Approved' ? '#D4E8E0' : l.status === 'Rejected' ? '#FFE5E5' : '#FFF4E6',
                                        color: l.status === 'Approved' ? '#1E3A2F' : l.status === 'Rejected' ? '#8B0000' : '#8B5A00',
                                        fontWeight: 700,
                                        fontSize: '0.813rem',
                                        textTransform: 'uppercase',
                                        letterSpacing: '0.5px'
                                    }}>
                                        {l.status}
                                    </Box>
                                </TableCell>
                                <TableCell align="right">
                                    {l.status === 'Pending' && (
                                        <>
                                            <Tooltip title="Approve">
                                                <IconButton color="success" onClick={() => handleAction(l._id, 'Approved')}>
                                                    <CheckCircleIcon />
                                                </IconButton>
                                            </Tooltip>
                                            <Tooltip title="Reject">
                                                <IconButton color="error" onClick={() => handleAction(l._id, 'Rejected')}>
                                                    <CancelIcon />
                                                </IconButton>
                                            </Tooltip>
                                        </>
                                    )}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <Snackbar
                open={snackbar.open}
                autoHideDuration={4000}
                onClose={() => setSnackbar({ ...snackbar, open: false })}
            >
                <Alert severity={snackbar.severity}>{snackbar.message}</Alert>
            </Snackbar>
        </Box>
    );
};

export default LeaveManagement;

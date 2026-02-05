import React, { useState, useEffect } from 'react';
import {
    Typography, Button, Table, TableBody, TableCell, TableContainer,
    TableHead, TableRow, Paper, Box, Grid, TextField, Dialog,
    DialogTitle, DialogContent, DialogActions, MenuItem, Snackbar, Alert
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { useLeave } from '../context/LeaveContext';
import { useAuth } from '../context/AuthContext';

const LeaveRequest = () => {
    const { leaveTypes, myLeaves, applyLeave, fetchMyLeaves, loading } = useLeave();
    const { user } = useAuth();
    const [open, setOpen] = useState(false);
    const [formData, setFormData] = useState({
        leaveTypeId: '',
        startDate: '',
        endDate: '',
        reason: ''
    });
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

    useEffect(() => {
        if (user?.id) fetchMyLeaves(user.id);
    }, [user]);

    const handleOpen = () => setOpen(true);
    const handleClose = () => {
        setOpen(false);
        setFormData({ leaveTypeId: '', startDate: '', endDate: '', reason: '' });
    };

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleApply = async () => {
        const result = await applyLeave({ ...formData, employeeId: user.id });
        if (result.success) {
            setSnackbar({ open: true, message: 'Leave applied successfully', severity: 'success' });
            handleClose();
        } else {
            setSnackbar({ open: true, message: result.error, severity: 'error' });
        }
    };

    return (
        <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                <Typography variant="h4">My Leave Requests</Typography>
                <Button variant="contained" startIcon={<AddIcon />} onClick={handleOpen}>
                    Apply for Leave
                </Button>
            </Box>

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Type</TableCell>
                            <TableCell>From</TableCell>
                            <TableCell>To</TableCell>
                            <TableCell>Reason</TableCell>
                            <TableCell>Status</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {myLeaves.map((l) => (
                            <TableRow key={l._id}>
                                <TableCell>{l.leaveType?.name}</TableCell>
                                <TableCell>{new Date(l.startDate).toLocaleDateString()}</TableCell>
                                <TableCell>{new Date(l.endDate).toLocaleDateString()}</TableCell>
                                <TableCell>{l.reason}</TableCell>
                                <TableCell>
                                    <Box sx={{
                                        px: 1, py: 0.5, borderRadius: 1, display: 'inline-block',
                                        bgcolor: l.status === 'Approved' ? 'success.light' : l.status === 'Rejected' ? 'error.light' : 'warning.light',
                                        color: l.status === 'Approved' ? 'success.dark' : l.status === 'Rejected' ? 'error.dark' : 'warning.dark',
                                        fontWeight: 'bold'
                                    }}>
                                        {l.status}
                                    </Box>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
                <DialogTitle>Apply for Leave</DialogTitle>
                <DialogContent>
                    <Grid container spacing={2} sx={{ mt: 1 }}>
                        <Grid item xs={12}>
                            <TextField
                                select
                                fullWidth
                                label="Leave Type"
                                name="leaveTypeId"
                                value={formData.leaveTypeId}
                                onChange={handleChange}
                            >
                                {leaveTypes.map(t => <MenuItem key={t._id} value={t._id}>{t.name}</MenuItem>)}
                            </TextField>
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                fullWidth
                                type="date"
                                label="Start Date"
                                name="startDate"
                                InputLabelProps={{ shrink: true }}
                                value={formData.startDate}
                                onChange={handleChange}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                fullWidth
                                type="date"
                                label="End Date"
                                name="endDate"
                                InputLabelProps={{ shrink: true }}
                                value={formData.endDate}
                                onChange={handleChange}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                multiline
                                rows={3}
                                label="Reason"
                                name="reason"
                                value={formData.reason}
                                onChange={handleChange}
                            />
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button onClick={handleApply} variant="contained" color="primary">Submit</Button>
                </DialogActions>
            </Dialog>

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

export default LeaveRequest;

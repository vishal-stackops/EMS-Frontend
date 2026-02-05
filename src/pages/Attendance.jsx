import React, { useState, useEffect } from 'react';
import {
    Typography, Button, Table, TableBody, TableCell, TableContainer,
    TableHead, TableRow, Paper, Box, Grid, Card, CardContent, Snackbar, Alert
} from '@mui/material';
import LoginIcon from '@mui/icons-material/Login';
import LogoutIcon from '@mui/icons-material/Logout';
import { useAttendance } from '../context/AttendanceContext';
import { useAuth } from '../context/AuthContext';

const Attendance = () => {
    const { attendanceHistory, checkIn, checkOut, fetchPersonalAttendance, loading } = useAttendance();
    const { user } = useAuth();
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

    useEffect(() => {
        if (user?.id) fetchPersonalAttendance(user.id);
    }, [user]);

    const handleCheckIn = async () => {
        const result = await checkIn(user.id);
        if (result.success) {
            setSnackbar({ open: true, message: 'Check-in successful', severity: 'success' });
            fetchPersonalAttendance(user.id);
        } else {
            setSnackbar({ open: true, message: result.error, severity: 'error' });
        }
    };

    const handleCheckOut = async () => {
        const result = await checkOut(user.id);
        if (result.success) {
            setSnackbar({ open: true, message: 'Check-out successful', severity: 'success' });
            fetchPersonalAttendance(user.id);
        } else {
            setSnackbar({ open: true, message: result.error, severity: 'error' });
        }
    };

    return (
        <Box>
            <Typography variant="h4" sx={{ mb: 3 }}>Attendance Tracker</Typography>

            <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid item xs={12} sm={6}>
                    <Card sx={{ bgcolor: 'success.light' }}>
                        <CardContent sx={{ textAlign: 'center' }}>
                            <Typography variant="h6" color="success.dark">Daily Check-In</Typography>
                            <Button
                                variant="contained"
                                color="success"
                                startIcon={<LoginIcon />}
                                sx={{ mt: 2 }}
                                onClick={handleCheckIn}
                                disabled={loading}
                            >
                                Check In
                            </Button>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={6}>
                    <Card sx={{ bgcolor: 'error.light' }}>
                        <CardContent sx={{ textAlign: 'center' }}>
                            <Typography variant="h6" color="error.dark">Daily Check-Out</Typography>
                            <Button
                                variant="contained"
                                color="error"
                                startIcon={<LogoutIcon />}
                                sx={{ mt: 2 }}
                                onClick={handleCheckOut}
                                disabled={loading}
                            >
                                Check Out
                            </Button>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            <Typography variant="h5" sx={{ mb: 2 }}>Attendance History</Typography>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Date</TableCell>
                            <TableCell>Check In</TableCell>
                            <TableCell>Check Out</TableCell>
                            <TableCell>Hours</TableCell>
                            <TableCell>Status</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {attendanceHistory.map((row) => (
                            <TableRow key={row._id}>
                                <TableCell>{new Date(row.date).toLocaleDateString()}</TableCell>
                                <TableCell>{new Date(row.checkIn).toLocaleTimeString()}</TableCell>
                                <TableCell>{row.checkOut ? new Date(row.checkOut).toLocaleTimeString() : '-'}</TableCell>
                                <TableCell>{row.totalHours || '-'}</TableCell>
                                <TableCell>{row.status}</TableCell>
                            </TableRow>
                        ))}
                        {attendanceHistory.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={5} align="center">No attendance records found.</TableCell>
                            </TableRow>
                        )}
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

export default Attendance;

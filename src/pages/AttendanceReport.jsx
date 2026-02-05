import React, { useState, useEffect } from 'react';
import {
    Typography, Table, TableBody, TableCell, TableContainer,
    TableHead, TableRow, Paper, Box, Grid, TextField, MenuItem, Button
} from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import SearchIcon from '@mui/icons-material/Search';
import { useAttendance } from '../context/AttendanceContext';
import { useDepartment } from '../context/DepartmentContext';

const AttendanceReport = () => {
    const { fetchAllAttendance, loading } = useAttendance();
    const { departments } = useDepartment();
    const [reportData, setReportData] = useState([]);
    const [filters, setFilters] = useState({
        month: new Date().getMonth() + 1,
        year: new Date().getFullYear(),
        department: ''
    });

    const months = [
        { value: 1, label: 'January' }, { value: 2, label: 'February' },
        { value: 3, label: 'March' }, { value: 4, label: 'April' },
        { value: 5, label: 'May' }, { value: 6, label: 'June' },
        { value: 7, label: 'July' }, { value: 8, label: 'August' },
        { value: 9, label: 'September' }, { value: 10, label: 'October' },
        { value: 11, label: 'November' }, { value: 12, label: 'December' }
    ];

    const loadReport = async () => {
        const result = await fetchAllAttendance(filters);
        if (result.success) {
            setReportData(result.data);
        }
    };

    useEffect(() => {
        loadReport();
    }, []);

    const handleChange = (e) => {
        setFilters({ ...filters, [e.target.name]: e.target.value });
    };

    return (
        <Box>
            <Typography variant="h4" sx={{ mb: 3 }}>Attendance Reports</Typography>

            <Paper sx={{ p: 2, mb: 3 }}>
                <Grid container spacing={2} alignItems="center">
                    <Grid item xs={12} sm={3}>
                        <TextField
                            select
                            fullWidth
                            label="Month"
                            name="month"
                            value={filters.month}
                            onChange={handleChange}
                            size="small"
                        >
                            {months.map(m => <MenuItem key={m.value} value={m.value}>{m.label}</MenuItem>)}
                        </TextField>
                    </Grid>
                    <Grid item xs={12} sm={3}>
                        <TextField
                            fullWidth
                            label="Year"
                            name="year"
                            type="number"
                            value={filters.year}
                            onChange={handleChange}
                            size="small"
                        />
                    </Grid>
                    <Grid item xs={12} sm={3}>
                        <TextField
                            select
                            fullWidth
                            label="Department"
                            name="department"
                            value={filters.department}
                            onChange={handleChange}
                            size="small"
                        >
                            <MenuItem value="">All Departments</MenuItem>
                            {departments.map(d => <MenuItem key={d._id} value={d.name}>{d.name}</MenuItem>)}
                        </TextField>
                    </Grid>
                    <Grid item xs={12} sm={3}>
                        <Button
                            variant="contained"
                            startIcon={<SearchIcon />}
                            onClick={loadReport}
                            fullWidth
                        >
                            Generate Report
                        </Button>
                    </Grid>
                </Grid>
            </Paper>

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Employee</TableCell>
                            <TableCell>Department</TableCell>
                            <TableCell>Designation</TableCell>
                            <TableCell>Date</TableCell>
                            <TableCell>Check In</TableCell>
                            <TableCell>Check Out</TableCell>
                            <TableCell>Hours</TableCell>
                            <TableCell>Status</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {reportData.map((row) => (
                            <TableRow key={row._id}>
                                <TableCell>{row.employee?.name}</TableCell>
                                <TableCell>{row.employee?.department}</TableCell>
                                <TableCell>{row.employee?.designation?.name || 'N/A'}</TableCell>
                                <TableCell>{new Date(row.date).toLocaleDateString()}</TableCell>
                                <TableCell>{new Date(row.checkIn).toLocaleTimeString()}</TableCell>
                                <TableCell>{row.checkOut ? new Date(row.checkOut).toLocaleTimeString() : '-'}</TableCell>
                                <TableCell>{row.totalHours || '-'}</TableCell>
                                <TableCell>{row.status}</TableCell>
                            </TableRow>
                        ))}
                        {reportData.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={7} align="center">No records found for the selected period.</TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
};

export default AttendanceReport;

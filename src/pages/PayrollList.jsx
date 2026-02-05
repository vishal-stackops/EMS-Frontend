import React, { useState, useEffect } from 'react';
import {
    Typography, Button, Table, TableBody, TableCell, TableContainer,
    TableHead, TableRow, Paper, Box, TextField, MenuItem, Grid,
    Snackbar, Alert, IconButton, Tooltip
} from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import { usePayroll } from '../context/PayrollContext';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

const PayrollList = () => {
    const { payrolls, fetchPayrolls, generatePayroll, updatePayrollStatus, loading } = usePayroll();
    const [month, setMonth] = useState(new Date().toLocaleString('default', { month: 'long' }));
    const [year, setYear] = useState(new Date().getFullYear());
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

    const months = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    const years = [2024, 2025, 2026];

    useEffect(() => {
        fetchPayrolls({ month, year });
    }, [month, year]);

    const handleGenerate = async () => {
        const result = await generatePayroll(month, year);
        if (result.success) {
            setSnackbar({ open: true, message: result.message, severity: 'success' });
        } else {
            setSnackbar({ open: true, message: result.error, severity: 'error' });
        }
    };

    const handleMarkAsPaid = async (payroll) => {
        const result = await updatePayrollStatus(payroll._id, {
            status: 'Paid',
            paymentDate: new Date()
        });
        if (result.success) {
            setSnackbar({ open: true, message: 'Payroll marked as Paid', severity: 'success' });
        }
    };

    const downloadSlip = async (p) => {
        try {
            console.log('Generating PDF for payroll:', p);

            if (!p.employee) {
                setSnackbar({ open: true, message: 'Employee data not found. Please refresh the page.', severity: 'error' });
                return;
            }

            const doc = new jsPDF();

            // Header
            doc.setFontSize(20);
            doc.text("Salary Slip", 105, 20, { align: "center" });
            doc.setFontSize(12);
            doc.text(`${p.month} ${p.year}`, 105, 30, { align: "center" });

            // Employee Info
            doc.text(`Employee Name: ${p.employee?.name || 'N/A'}`, 20, 50);
            doc.text(`Email: ${p.employee?.email || 'N/A'}`, 20, 60);
            doc.text(`Department: ${p.employee?.department || 'N/A'}`, 20, 70);

            // Salary Table
            doc.autoTable({
                startY: 80,
                head: [['Description', 'Amount (INR)']],
                body: [
                    ['Basic Salary', p.basicSalary.toLocaleString()],
                    ['Allowances', p.allowances.toLocaleString()],
                    ['Deductions', p.deductions.toLocaleString()],
                    ['Net Salary', p.netSalary.toLocaleString()],
                ],
                theme: 'grid',
                headStyles: { fillColor: [63, 81, 181] }
            });

            doc.text(`Total Payable: INR ${p.netSalary.toLocaleString()}`, 20, doc.lastAutoTable.finalY + 20);
            doc.text(`Status: Paid`, 20, doc.lastAutoTable.finalY + 30);

            const filename = `SalarySlip_${p.employee?.name || 'Employee'}_${p.month}_${p.year}.pdf`;
            console.log('Saving PDF as:', filename);
            doc.save(filename);

            // Automatically mark as paid after generating PDF
            if (p.status === 'Pending') {
                console.log('Updating payroll status to Paid for:', p._id);
                const result = await updatePayrollStatus(p._id, {
                    status: 'Paid',
                    paymentDate: new Date()
                });
                console.log('Update result:', result);
                if (result.success) {
                    setSnackbar({ open: true, message: 'PDF generated and payroll marked as Paid', severity: 'success' });
                    // Refresh the payroll list to show updated status
                    await fetchPayrolls({ month, year });
                } else {
                    setSnackbar({ open: true, message: 'PDF generated but failed to update status', severity: 'warning' });
                }
            } else {
                setSnackbar({ open: true, message: 'PDF downloaded successfully', severity: 'success' });
            }
        } catch (error) {
            console.error('Error generating PDF:', error);
            setSnackbar({ open: true, message: 'Failed to generate PDF: ' + error.message, severity: 'error' });
        }
    };

    return (
        <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                <Typography variant="h4">Payroll Management</Typography>
                <Button
                    variant="contained"
                    color="secondary"
                    startIcon={<PlayArrowIcon />}
                    onClick={handleGenerate}
                    disabled={loading}
                >
                    Generate for {month} {year}
                </Button>
            </Box>

            <Paper sx={{ p: 2, mb: 3 }}>
                <Grid container spacing={2} alignItems="center">
                    <Grid item xs={12} sm={4}>
                        <TextField
                            select
                            fullWidth
                            label="Month"
                            value={month}
                            onChange={(e) => setMonth(e.target.value)}
                            size="small"
                        >
                            {months.map(m => <MenuItem key={m} value={m}>{m}</MenuItem>)}
                        </TextField>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <TextField
                            select
                            fullWidth
                            label="Year"
                            value={year}
                            onChange={(e) => setYear(e.target.value)}
                            size="small"
                        >
                            {years.map(y => <MenuItem key={y} value={y}>{y}</MenuItem>)}
                        </TextField>
                    </Grid>
                </Grid>
            </Paper>

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Employee</TableCell>
                            <TableCell>Basic</TableCell>
                            <TableCell>Allowances</TableCell>
                            <TableCell>Deductions</TableCell>
                            <TableCell>Net Amount</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell align="right">Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {payrolls.map((p) => (
                            <TableRow key={p._id}>
                                <TableCell>{p.employee?.name || 'N/A'}</TableCell>
                                <TableCell>₹{p.basicSalary.toLocaleString()}</TableCell>
                                <TableCell>₹{p.allowances.toLocaleString()}</TableCell>
                                <TableCell>₹{p.deductions.toLocaleString()}</TableCell>
                                <TableCell sx={{ fontWeight: 'bold' }}>₹{p.netSalary.toLocaleString()}</TableCell>
                                <TableCell>
                                    <Box sx={{
                                        px: 1.5, py: 0.5, borderRadius: 1.5, display: 'inline-block',
                                        bgcolor: p.status === 'Paid' ? '#D4E8E0' : '#FFF4E6',
                                        color: p.status === 'Paid' ? '#1E3A2F' : '#8B5A00',
                                        fontWeight: 700,
                                        fontSize: '0.813rem',
                                        textTransform: 'uppercase',
                                        letterSpacing: '0.5px'
                                    }}>
                                        {p.status}
                                    </Box>
                                </TableCell>
                                <TableCell align="right">
                                    {p.status === 'Pending' && (
                                        <Tooltip title="Mark as Paid">
                                            <IconButton color="success" onClick={() => handleMarkAsPaid(p)}>
                                                <CheckCircleIcon />
                                            </IconButton>
                                        </Tooltip>
                                    )}
                                    <Tooltip title="Download Slip">
                                        <IconButton color="primary" onClick={() => downloadSlip(p)}>
                                            <DownloadIcon />
                                        </IconButton>
                                    </Tooltip>
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

export default PayrollList;

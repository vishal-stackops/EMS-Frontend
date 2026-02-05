import React, { useState, useEffect } from 'react';
import {
    Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    IconButton, Tooltip, CircularProgress, Chip, alpha, useTheme
} from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import { usePayroll } from '../../context/PayrollContext';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

const EmployeePayroll = () => {
    const theme = useTheme();
    const { fetchMyPayrollHistory } = usePayroll();
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadHistory();
    }, []);

    const loadHistory = async () => {
        setLoading(true);
        console.log('EmployeePayroll: Fetching payroll history...');
        const result = await fetchMyPayrollHistory();
        console.log('EmployeePayroll: Fetch result:', result);
        if (result.success) {
            console.log('EmployeePayroll: History data:', result.data);
            setHistory(result.data);
        } else {
            console.error('EmployeePayroll: Failed to fetch history:', result.error);
        }
        setLoading(false);
    };

    const downloadSlip = (p) => {
        const doc = new jsPDF();
        doc.setFontSize(20);
        doc.text("Salary Slip", 105, 20, { align: "center" });
        doc.setFontSize(12);
        doc.text(`${p.month} ${p.year}`, 105, 30, { align: "center" });

        // Employee Info (Populated from backend)
        doc.text(`Employee Name: ${p.employee?.name || 'N/A'}`, 20, 50);
        doc.text(`Email: ${p.employee?.email || 'N/A'}`, 20, 60);
        doc.text(`Department: ${p.employee?.department || 'N/A'}`, 20, 70);

        doc.text(`Pay Period: ${p.month} ${p.year}`, 140, 50);

        doc.autoTable({
            startY: 70,
            head: [['Description', 'Amount (INR)']],
            body: [
                ['Basic Salary', p.basicSalary.toLocaleString()],
                ['Allowances', p.allowances.toLocaleString()],
                ['Deductions', p.deductions.toLocaleString()],
                ['Net Salary', p.netSalary.toLocaleString()],
            ],
            theme: 'grid',
            headStyles: { fillColor: [theme.palette.primary.main] }
        });

        doc.text(`Total Payable: INR ${p.netSalary.toLocaleString()}`, 20, doc.lastAutoTable.finalY + 20);
        doc.text(`Status: ${p.status}`, 20, doc.lastAutoTable.finalY + 30);
        doc.save(`Payslip_${p.month}_${p.year}.pdf`);
    };

    if (loading) return <Box display="flex" justifyContent="center" p={5}><CircularProgress /></Box>;

    return (
        <Box sx={{ p: { xs: 2, md: 4 } }}>
            <Typography variant="h4" fontWeight="800" mb={1}>Payroll History</Typography>
            <Typography variant="body1" color="text.secondary" mb={4}>View and download your monthly payslips</Typography>

            <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid #e2e8f0', borderRadius: 4 }}>
                <Table>
                    <TableHead sx={{ bgcolor: alpha(theme.palette.primary.main, 0.05) }}>
                        <TableRow>
                            <TableCell sx={{ fontWeight: 700 }}>Month/Year</TableCell>
                            <TableCell sx={{ fontWeight: 700 }}>Basic</TableCell>
                            <TableCell sx={{ fontWeight: 700 }}>Allowances</TableCell>
                            <TableCell sx={{ fontWeight: 700 }}>Deductions</TableCell>
                            <TableCell sx={{ fontWeight: 700 }}>Net Pay</TableCell>
                            <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
                            <TableCell align="right" sx={{ fontWeight: 700 }}>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {history.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={7} align="center" sx={{ py: 4, color: 'text.secondary' }}>No payroll records found.</TableCell>
                            </TableRow>
                        ) : (
                            history.map((p) => (
                                <TableRow key={p._id} hover>
                                    <TableCell sx={{ fontWeight: 600 }}>{p.month} {p.year}</TableCell>
                                    <TableCell>₹{p.basicSalary.toLocaleString()}</TableCell>
                                    <TableCell sx={{ color: 'success.main' }}>+₹{p.allowances.toLocaleString()}</TableCell>
                                    <TableCell sx={{ color: 'error.main' }}>-₹{p.deductions.toLocaleString()}</TableCell>
                                    <TableCell sx={{ fontWeight: 800, color: 'primary.main' }}>₹{p.netSalary.toLocaleString()}</TableCell>
                                    <TableCell>
                                        <Chip
                                            label={p.status}
                                            size="small"
                                            sx={{
                                                fontWeight: 700,
                                                borderRadius: 1.5,
                                                fontSize: '0.75rem',
                                                textTransform: 'uppercase',
                                                letterSpacing: '0.5px',
                                                bgcolor: p.status === 'Paid' ? '#D4E8E0' : '#FFF4E6',
                                                color: p.status === 'Paid' ? '#1E3A2F' : '#8B5A00'
                                            }}
                                        />
                                    </TableCell>
                                    <TableCell align="right">
                                        <Tooltip title="Download Payslip">
                                            <IconButton color="primary" onClick={() => downloadSlip(p)}>
                                                <DownloadIcon />
                                            </IconButton>
                                        </Tooltip>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
};

export default EmployeePayroll;

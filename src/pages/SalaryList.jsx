import React, { useState, useEffect } from 'react';
import {
    Typography, Button, Table, TableBody, TableCell, TableContainer,
    TableHead, TableRow, Paper, IconButton, Box, TextField, Dialog,
    DialogTitle, DialogContent, DialogActions, Grid, Snackbar, Alert
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import { useSalary } from '../context/SalaryContext';
import { useEmployee } from '../context/EmployeeContext';

const SalaryList = () => {
    const { salaries, fetchSalaries, setSalary, updateSalary, loading } = useSalary();
    const { employees, fetchEmployees } = useEmployee();
    const [open, setOpen] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [selectedSalary, setSelectedSalary] = useState(null);
    const [formData, setFormData] = useState({
        employeeId: '',
        basicSalary: '',
        allowances: '',
        deductions: ''
    });
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

    useEffect(() => {
        fetchSalaries();
        fetchEmployees({ limit: 100 }); // Get all employees for selection
    }, []);

    const handleOpen = (salary = null) => {
        if (salary) {
            setEditMode(true);
            setSelectedSalary(salary);
            setFormData({
                employeeId: salary.employee?._id || '',
                basicSalary: salary.basicSalary,
                allowances: salary.allowances,
                deductions: salary.deductions
            });
        } else {
            setEditMode(false);
            setFormData({ employeeId: '', basicSalary: '', allowances: '', deductions: '' });
        }
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setSelectedSalary(null);
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSave = async () => {
        let result;
        if (editMode) {
            result = await updateSalary(selectedSalary._id, formData);
        } else {
            result = await setSalary(formData);
        }

        if (result.success) {
            setSnackbar({ open: true, message: `Salary ${editMode ? 'updated' : 'set'} successfully`, severity: 'success' });
            handleClose();
            fetchSalaries();
        } else {
            setSnackbar({ open: true, message: result.error, severity: 'error' });
        }
    };

    return (
        <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                <Typography variant="h4">Salary Management</Typography>
                <Button variant="contained" startIcon={<AddIcon />} onClick={() => handleOpen()}>
                    Set Salary
                </Button>
            </Box>

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Employee</TableCell>
                            <TableCell>Department</TableCell>
                            <TableCell>Basic Salary</TableCell>
                            <TableCell>Allowances</TableCell>
                            <TableCell>Deductions</TableCell>
                            <TableCell>Net Salary</TableCell>
                            <TableCell align="right">Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {salaries.map((s) => (
                            <TableRow key={s._id}>
                                <TableCell>{s.employee?.name || 'N/A'}</TableCell>
                                <TableCell>{s.employee?.department || 'N/A'}</TableCell>
                                <TableCell>₹{s.basicSalary.toLocaleString()}</TableCell>
                                <TableCell>₹{s.allowances.toLocaleString()}</TableCell>
                                <TableCell>₹{s.deductions.toLocaleString()}</TableCell>
                                <TableCell sx={{ fontWeight: 'bold' }}>₹{s.netSalary.toLocaleString()}</TableCell>
                                <TableCell align="right">
                                    <IconButton color="primary" onClick={() => handleOpen(s)}>
                                        <EditIcon />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
                <DialogTitle>{editMode ? 'Update Salary' : 'Set Employee Salary'}</DialogTitle>
                <DialogContent>
                    <Grid container spacing={2} sx={{ mt: 1 }}>
                        {!editMode && (
                            <Grid item xs={12}>
                                <TextField
                                    select
                                    fullWidth
                                    label="Employee"
                                    name="employeeId"
                                    value={formData.employeeId}
                                    onChange={handleChange}
                                    SelectProps={{ native: true }}
                                >
                                    <option value=""></option>
                                    {employees.map(emp => (
                                        <option key={emp._id} value={emp._id}>{emp.name} ({emp.department})</option>
                                    ))}
                                </TextField>
                            </Grid>
                        )}
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Basic Salary"
                                name="basicSalary"
                                type="number"
                                value={formData.basicSalary}
                                onChange={handleChange}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                fullWidth
                                label="Allowances"
                                name="allowances"
                                type="number"
                                value={formData.allowances}
                                onChange={handleChange}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                fullWidth
                                label="Deductions"
                                name="deductions"
                                type="number"
                                value={formData.deductions}
                                onChange={handleChange}
                            />
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button onClick={handleSave} variant="contained" color="primary">
                        Save
                    </Button>
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

export default SalaryList;

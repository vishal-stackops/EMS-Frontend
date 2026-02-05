import React, { useState, useEffect } from 'react';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { Box, TextField, MenuItem, Grid, Pagination, Stack, Snackbar, Alert } from '@mui/material';
import { useEmployee } from '../context/EmployeeContext';
import { useAuth } from '../context/AuthContext';
import { useDesignation } from '../context/DesignationContext';
import { useDepartment } from '../context/DepartmentContext';
import EmployeeForm from '../components/EmployeeForm';

const EmployeeList = () => {
    const { employees, addEmployee, updateEmployee, deleteEmployee, fetchEmployees, totalPages } = useEmployee();
    const { designations } = useDesignation();
    const { departments: dynamicDepartments } = useDepartment();
    const { user } = useAuth();
    const isAdmin = user?.role === 'ADMIN' || user?.role?.name === 'ADMIN';
    const isHR = user?.role === 'HR' || user?.role?.name === 'HR';
    const canCreate = isAdmin || isHR;
    const canEdit = isAdmin || isHR;
    const canDelete = isAdmin;

    const [open, setOpen] = useState(false);
    const [currentEmployee, setCurrentEmployee] = useState(null);

    // Filter & Search State
    const [search, setSearch] = useState('');
    const [department, setDepartment] = useState('');
    const [designation, setDesignation] = useState('');
    const [status, setStatus] = useState('');
    const [page, setPage] = useState(1);

    // Debounce search
    useEffect(() => {
        const timer = setTimeout(() => {
            fetchEmployees({ search, department, designation, status, page, limit: 10 });
        }, 500);
        return () => clearTimeout(timer);
    }, [search, department, designation, status, page]);

    const handleOpen = (employee = null) => {
        setCurrentEmployee(employee);
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setCurrentEmployee(null);
    };

    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

    const handleCloseSnackbar = () => {
        setSnackbar({ ...snackbar, open: false });
    };

    const handleSave = async (employeeData) => {
        let result;
        // Ensure salary is a number if it exists
        const payload = {
            ...employeeData,
            salary: employeeData.salary ? Number(employeeData.salary) : 0
        };

        console.log('Saving employee with payload:', payload);

        if (currentEmployee) {
            result = await updateEmployee(currentEmployee._id, payload);
        } else {
            result = await addEmployee(payload);
        }

        if (result.success) {
            setSnackbar({ open: true, message: currentEmployee ? 'Employee updated successfully' : 'Employee added successfully', severity: 'success' });
            handleClose(); // Close the modal
            fetchEmployees({ search, department, designation, status, page, limit: 10 });
        } else {
            console.error('Save failed:', result.error);
            setSnackbar({ open: true, message: result.error || 'Failed to save employee', severity: 'error' });
            // Do not close the modal if there is an error
            return;
        }
    };

    const handlePageChange = (event, value) => {
        setPage(value);
    };

    const statuses = ['Active', 'Inactive'];

    return (
        <div>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3, alignItems: 'center' }}>
                <Typography variant="h4">
                    Employees
                </Typography>
                {canCreate && (
                    <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={() => handleOpen()}
                    >
                        Add Employee
                    </Button>
                )}
            </Box>

            {/* Filters */}
            <Paper sx={{ p: 2, mb: 3 }}>
                <Grid container spacing={2} alignItems="center">
                    <Grid item xs={12} sm={4}>
                        <TextField
                            fullWidth
                            label="Search by Name"
                            variant="outlined"
                            size="small"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </Grid>
                    <Grid item xs={6} sm={3}>
                        <TextField
                            select
                            fullWidth
                            label="Department"
                            variant="outlined"
                            size="small"
                            value={department}
                            onChange={(e) => setDepartment(e.target.value)}
                        >
                            <MenuItem value="">All</MenuItem>
                            {dynamicDepartments.map((dept) => (
                                <MenuItem key={dept._id} value={dept.name}>{dept.name}</MenuItem>
                            ))}
                        </TextField>
                    </Grid>
                    <Grid item xs={6} sm={3}>
                        <TextField
                            select
                            fullWidth
                            label="Designation"
                            variant="outlined"
                            size="small"
                            value={designation}
                            onChange={(e) => setDesignation(e.target.value)}
                        >
                            <MenuItem value="">All</MenuItem>
                            {designations.map((des) => (
                                <MenuItem key={des._id} value={des._id}>{des.name}</MenuItem>
                            ))}
                        </TextField>
                    </Grid>
                    <Grid item xs={6} sm={2}>
                        <TextField
                            select
                            fullWidth
                            label="Status"
                            variant="outlined"
                            size="small"
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}
                        >
                            <MenuItem value="">All</MenuItem>
                            {statuses.map((st) => (
                                <MenuItem key={st} value={st}>{st}</MenuItem>
                            ))}
                        </TextField>
                    </Grid>
                </Grid>
            </Paper>

            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell>Name</TableCell>
                            <TableCell>Email</TableCell>
                            <TableCell>Department</TableCell>
                            <TableCell>Designation</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell align="right">Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {employees.map((row) => (
                            <TableRow
                                key={row._id || row.id}
                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                            >
                                <TableCell component="th" scope="row">
                                    {row.name}
                                </TableCell>
                                <TableCell>{row.email}</TableCell>
                                <TableCell>{row.department}</TableCell>
                                <TableCell>{row.designation?.name || row.designation || row.jobTitle || '-'}</TableCell>
                                <TableCell>
                                    <Box
                                        sx={{
                                            display: 'inline-block',
                                            px: 1.5, py: 0.5,
                                            borderRadius: 1.5,
                                            bgcolor: row.status === 'Active' ? '#D4E8E0' : '#FFE5E5',
                                            color: row.status === 'Active' ? '#1E3A2F' : '#8B0000',
                                            fontSize: '0.813rem',
                                            fontWeight: 700,
                                            textTransform: 'uppercase',
                                            letterSpacing: '0.5px'
                                        }}
                                    >
                                        {row.status}
                                    </Box>
                                </TableCell>
                                <TableCell align="right">
                                    {canEdit && (
                                        <IconButton color="primary" onClick={() => handleOpen(row)}>
                                            <EditIcon />
                                        </IconButton>
                                    )}
                                    {canDelete && (
                                        <IconButton color="error" onClick={() => deleteEmployee(row._id)}>
                                            <DeleteIcon />
                                        </IconButton>
                                    )}
                                </TableCell>
                            </TableRow>
                        ))}
                        {employees.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={6} align="center">
                                    No employees found.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Pagination */}
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
                <Stack spacing={2}>
                    <Pagination
                        count={totalPages}
                        page={page}
                        onChange={handlePageChange}
                        color="primary"
                    />
                </Stack>
            </Box>

            <EmployeeForm
                open={open}
                handleClose={handleClose}
                handleSave={handleSave}
                initialData={currentEmployee}
            />

            <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={handleCloseSnackbar}>
                <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </div>
    );
};

export default EmployeeList;

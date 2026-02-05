import React, { useState } from 'react';
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
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';
import { Box, Snackbar, Alert, Dialog, DialogTitle, DialogContent, DialogActions, Checkbox, FormControlLabel, FormGroup } from '@mui/material';
import { useDepartment } from '../context/DepartmentContext';
import { useEmployee } from '../context/EmployeeContext';
import { useAuth } from '../context/AuthContext';
import DepartmentForm from '../components/DepartmentForm';

const DepartmentList = () => {
    const { departments, addDepartment, updateDepartment, deleteDepartment, assignEmployees, fetchDepartments } = useDepartment();
    const { employees } = useEmployee();
    const { user } = useAuth();
    const isAdmin = user?.role === 'ADMIN' || user?.role?.name === 'ADMIN';
    const isHR = user?.role === 'HR' || user?.role?.name === 'HR';
    const canCreate = isAdmin || isHR;
    const canEdit = isAdmin || isHR;
    const canDelete = isAdmin;

    const [open, setOpen] = useState(false);
    const [currentDepartment, setCurrentDepartment] = useState(null);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

    const [assignOpen, setAssignOpen] = useState(false);
    const [selectedDepartment, setSelectedDepartment] = useState(null);
    const [selectedEmployees, setSelectedEmployees] = useState([]);

    const handleOpen = (department = null) => {
        setCurrentDepartment(department);
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setCurrentDepartment(null);
    };

    const handleCloseSnackbar = () => {
        setSnackbar({ ...snackbar, open: false });
    };

    const handleSave = async (departmentData) => {
        let result;
        if (currentDepartment) {
            result = await updateDepartment(currentDepartment._id, departmentData);
        } else {
            result = await addDepartment(departmentData);
        }

        if (result.success) {
            setSnackbar({ open: true, message: currentDepartment ? 'Department updated successfully' : 'Department added successfully', severity: 'success' });
            handleClose();
            fetchDepartments();
        } else {
            setSnackbar({ open: true, message: result.error || 'Failed to save department', severity: 'error' });
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this department?')) {
            const result = await deleteDepartment(id);
            if (result.success) {
                setSnackbar({ open: true, message: 'Department deleted successfully', severity: 'success' });
            } else {
                setSnackbar({ open: true, message: result.error || 'Failed to delete department', severity: 'error' });
            }
        }
    };

    const handleOpenAssign = (department) => {
        setSelectedDepartment(department);
        setSelectedEmployees([]);
        setAssignOpen(true);
    };

    const handleCloseAssign = () => {
        setAssignOpen(false);
        setSelectedDepartment(null);
        setSelectedEmployees([]);
    };

    const handleEmployeeToggle = (employeeId) => {
        setSelectedEmployees(prev =>
            prev.includes(employeeId)
                ? prev.filter(id => id !== employeeId)
                : [...prev, employeeId]
        );
    };

    const handleAssignSubmit = async () => {
        if (selectedDepartment && selectedEmployees.length > 0) {
            const result = await assignEmployees(selectedDepartment._id, selectedEmployees);
            if (result.success) {
                setSnackbar({ open: true, message: 'Employees assigned successfully', severity: 'success' });
                handleCloseAssign();
            } else {
                setSnackbar({ open: true, message: result.error || 'Failed to assign employees', severity: 'error' });
            }
        }
    };

    return (
        <div>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3, alignItems: 'center' }}>
                <Typography variant="h4">
                    Departments
                </Typography>
                {canCreate && (
                    <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={() => handleOpen()}
                    >
                        Add Department
                    </Button>
                )}
            </Box>

            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="departments table">
                    <TableHead>
                        <TableRow>
                            <TableCell>Name</TableCell>
                            <TableCell>Description</TableCell>
                            <TableCell align="right">Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {departments.map((row) => (
                            <TableRow
                                key={row._id || row.id}
                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                            >
                                <TableCell component="th" scope="row">
                                    {row.name}
                                </TableCell>
                                <TableCell>{row.description}</TableCell>
                                <TableCell align="right">
                                    {canEdit && (
                                        <IconButton color="primary" onClick={() => handleOpen(row)}>
                                            <EditIcon />
                                        </IconButton>
                                    )}
                                    {canEdit && (
                                        <IconButton color="info" onClick={() => handleOpenAssign(row)} title="Assign Employees">
                                            <AssignmentIndIcon />
                                        </IconButton>
                                    )}
                                    {canDelete && (
                                        <IconButton color="error" onClick={() => handleDelete(row._id)}>
                                            <DeleteIcon />
                                        </IconButton>
                                    )}
                                </TableCell>
                            </TableRow>
                        ))}
                        {departments.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={3} align="center">
                                    No departments found.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>

            <DepartmentForm
                open={open}
                handleClose={handleClose}
                handleSave={handleSave}
                initialData={currentDepartment}
            />

            <Dialog open={assignOpen} onClose={handleCloseAssign} maxWidth="sm" fullWidth>
                <DialogTitle>Assign Employees to {selectedDepartment?.name}</DialogTitle>
                <DialogContent>
                    <FormGroup>
                        {employees.map((emp) => (
                            <FormControlLabel
                                key={emp._id}
                                control={
                                    <Checkbox
                                        checked={selectedEmployees.includes(emp._id)}
                                        onChange={() => handleEmployeeToggle(emp._id)}
                                    />
                                }
                                label={`${emp.name} (${emp.email})`}
                            />
                        ))}
                    </FormGroup>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseAssign} color="secondary">Cancel</Button>
                    <Button onClick={handleAssignSubmit} color="primary" disabled={selectedEmployees.length === 0}>
                        Assign
                    </Button>
                </DialogActions>
            </Dialog>

            <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={handleCloseSnackbar}>
                <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </div>
    );
};

export default DepartmentList;

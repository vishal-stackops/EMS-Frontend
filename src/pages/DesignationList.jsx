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
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import { Box, Snackbar, Alert, Dialog, DialogTitle, DialogContent, DialogActions, MenuItem, TextField } from '@mui/material';
import { useDesignation } from '../context/DesignationContext';
import { useEmployee } from '../context/EmployeeContext';
import { useAuth } from '../context/AuthContext';
import DesignationForm from '../components/DesignationForm';

const DesignationList = () => {
    const { designations, addDesignation, updateDesignation, deleteDesignation, assignEmployee, fetchDesignations } = useDesignation();
    const { employees } = useEmployee();
    const { user } = useAuth();
    const isAdmin = user?.role === 'ADMIN' || user?.role?.name === 'ADMIN';
    const isHR = user?.role === 'HR' || user?.role?.name === 'HR';
    const canCreate = isAdmin || isHR;
    const canEdit = isAdmin || isHR;
    const canDelete = isAdmin;

    const [open, setOpen] = useState(false);
    const [currentDesignation, setCurrentDesignation] = useState(null);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

    const [assignOpen, setAssignOpen] = useState(false);
    const [selectedDesignation, setSelectedDesignation] = useState(null);
    const [selectedEmployee, setSelectedEmployee] = useState('');

    const handleOpen = (designation = null) => {
        setCurrentDesignation(designation);
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setCurrentDesignation(null);
    };

    const handleCloseSnackbar = () => {
        setSnackbar({ ...snackbar, open: false });
    };

    const handleSave = async (designationData) => {
        let result;
        if (currentDesignation) {
            result = await updateDesignation(currentDesignation._id, designationData);
        } else {
            result = await addDesignation(designationData);
        }

        if (result.success) {
            setSnackbar({ open: true, message: currentDesignation ? 'Designation updated successfully' : 'Designation added successfully', severity: 'success' });
            handleClose();
            fetchDesignations();
        } else {
            setSnackbar({ open: true, message: result.error || 'Failed to save designation', severity: 'error' });
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this designation?')) {
            const result = await deleteDesignation(id);
            if (result.success) {
                setSnackbar({ open: true, message: 'Designation deleted successfully', severity: 'success' });
            } else {
                setSnackbar({ open: true, message: result.error || 'Failed to delete designation', severity: 'error' });
            }
        }
    };

    const handleOpenAssign = (designation) => {
        setSelectedDesignation(designation);
        setSelectedEmployee('');
        setAssignOpen(true);
    };

    const handleCloseAssign = () => {
        setAssignOpen(false);
        setSelectedDesignation(null);
        setSelectedEmployee('');
    };

    const handleAssignSubmit = async () => {
        if (selectedDesignation && selectedEmployee) {
            const result = await assignEmployee(selectedDesignation._id, selectedEmployee);
            if (result.success) {
                setSnackbar({ open: true, message: 'Employee assigned successfully', severity: 'success' });
                handleCloseAssign();
            } else {
                setSnackbar({ open: true, message: result.error || 'Failed to assign employee', severity: 'error' });
            }
        }
    };

    return (
        <div>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3, alignItems: 'center' }}>
                <Typography variant="h4">
                    Designations
                </Typography>
                {canCreate && (
                    <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={() => handleOpen()}
                    >
                        Add Designation
                    </Button>
                )}
            </Box>

            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="designations table">
                    <TableHead>
                        <TableRow>
                            <TableCell>Name</TableCell>
                            <TableCell>Description</TableCell>
                            <TableCell align="right">Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {designations.map((row) => (
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
                                        <IconButton color="info" onClick={() => handleOpenAssign(row)} title="Assign Employee">
                                            <PersonAddIcon />
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
                        {designations.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={3} align="center">
                                    No designations found.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>

            <DesignationForm
                open={open}
                handleClose={handleClose}
                handleSave={handleSave}
                initialData={currentDesignation}
            />

            <Dialog open={assignOpen} onClose={handleCloseAssign} maxWidth="sm" fullWidth>
                <DialogTitle>Assign Employee to {selectedDesignation?.name}</DialogTitle>
                <DialogContent>
                    <TextField
                        select
                        fullWidth
                        label="Select Employee"
                        value={selectedEmployee}
                        onChange={(e) => setSelectedEmployee(e.target.value)}
                        margin="normal"
                        variant="outlined"
                    >
                        {employees.map((emp) => (
                            <MenuItem key={emp._id} value={emp._id}>
                                {emp.name} ({emp.email})
                            </MenuItem>
                        ))}
                    </TextField>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseAssign} color="secondary">Cancel</Button>
                    <Button onClick={handleAssignSubmit} color="primary" disabled={!selectedEmployee}>
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

export default DesignationList;

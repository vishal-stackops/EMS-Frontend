import React, { useState, useEffect } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import MenuItem from '@mui/material/MenuItem';
import { useDepartment } from '../context/DepartmentContext';
import { useDesignation } from '../context/DesignationContext';

const EmployeeForm = ({ open, handleClose, handleSave, initialData }) => {
    const { departments } = useDepartment();
    const { designations } = useDesignation();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        department: '',
        designation: '',
        salary: '',
        joiningDate: '',
        status: 'Active'
    });

    useEffect(() => {
        if (initialData) {
            setFormData({
                name: initialData.name || '',
                email: initialData.email || '',
                phone: initialData.phone || '',
                department: initialData.department || '',
                designation: initialData.designation?._id || initialData.designation || '',
                salary: initialData.salary || '',
                // Format date for date input (YYYY-MM-DD)
                joiningDate: initialData.joiningDate ? initialData.joiningDate.split('T')[0] : '',
                status: initialData.status || 'Active'
            });
        } else {
            setFormData({
                name: '',
                email: '',
                phone: '',
                department: '',
                designation: '',
                salary: '',
                joiningDate: '',
                status: 'Active'
            });
        }
    }, [initialData, open]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === 'department') {
            setFormData(prev => ({ ...prev, [name]: value, designation: '' }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        handleSave(formData);
    };

    const statuses = ['Active', 'Inactive'];

    return (
        <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
            <DialogTitle>{initialData ? 'Edit Employee' : 'Add Employee'}</DialogTitle>
            <form onSubmit={handleSubmit}>
                <DialogContent>
                    <Grid container spacing={2}>
                        <Grid size={{ xs: 12, sm: 6 }}>
                            <TextField
                                autoFocus
                                margin="dense"
                                name="name"
                                label="Full Name"
                                type="text"
                                fullWidth
                                variant="outlined"
                                value={formData.name}
                                onChange={handleChange}
                                required
                            />
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6 }}>
                            <TextField
                                margin="dense"
                                name="email"
                                label="Email"
                                type="email"
                                fullWidth
                                variant="outlined"
                                value={formData.email}
                                onChange={handleChange}
                                required
                            />
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6 }}>
                            <TextField
                                margin="dense"
                                name="phone"
                                label="Phone Number"
                                type="text"
                                fullWidth
                                variant="outlined"
                                value={formData.phone}
                                onChange={handleChange}
                                required
                            />
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6 }}>
                            <TextField
                                select
                                margin="dense"
                                name="department"
                                label="Department"
                                fullWidth
                                variant="outlined"
                                value={formData.department}
                                onChange={handleChange}
                                required
                            >
                                {departments.map((dept) => (
                                    <MenuItem key={dept._id} value={dept.name}>
                                        {dept.name}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6 }}>
                            <TextField
                                select
                                margin="dense"
                                name="designation"
                                label="Designation"
                                fullWidth
                                variant="outlined"
                                value={formData.designation}
                                onChange={handleChange}
                                required
                                disabled={!formData.department}
                            >
                                {designations
                                    .filter(des => des.department === formData.department)
                                    .map((des) => (
                                        <MenuItem key={des._id} value={des._id}>
                                            {des.name}
                                        </MenuItem>
                                    ))}
                            </TextField>
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6 }}>
                            <TextField
                                margin="dense"
                                name="joiningDate"
                                label="Joining Date"
                                type="date"
                                fullWidth
                                variant="outlined"
                                value={formData.joiningDate}
                                onChange={handleChange}
                                required
                                InputLabelProps={{
                                    shrink: true,
                                }}
                            />
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6 }}>
                            <TextField
                                select
                                margin="dense"
                                name="status"
                                label="Status"
                                fullWidth
                                variant="outlined"
                                value={formData.status}
                                onChange={handleChange}
                                required
                            >
                                {statuses.map((status) => (
                                    <MenuItem key={status} value={status}>
                                        {status}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="secondary">Cancel</Button>
                    <Button type="submit" color="primary">{initialData ? 'Update' : 'Add'}</Button>
                </DialogActions>
            </form>
        </Dialog>
    );
};

export default EmployeeForm;

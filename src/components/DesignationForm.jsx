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

const DesignationForm = ({ open, handleClose, handleSave, initialData }) => {
    const { departments } = useDepartment();
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        department: ''
    });

    useEffect(() => {
        if (initialData) {
            setFormData({
                name: initialData.name || '',
                description: initialData.description || '',
                department: initialData.department || ''
            });
        } else {
            setFormData({
                name: '',
                description: '',
                department: ''
            });
        }
    }, [initialData, open]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        handleSave(formData);
    };

    return (
        <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
            <DialogTitle>{initialData ? 'Edit Designation' : 'Add Designation'}</DialogTitle>
            <form onSubmit={handleSubmit}>
                <DialogContent>
                    <Grid container spacing={2}>
                        <Grid size={{ xs: 12 }}>
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
                        <Grid size={{ xs: 12 }}>
                            <TextField
                                autoFocus
                                margin="dense"
                                name="name"
                                label="Designation Name"
                                type="text"
                                fullWidth
                                variant="outlined"
                                value={formData.name}
                                onChange={handleChange}
                                required
                            />
                        </Grid>
                        <Grid size={{ xs: 12 }}>
                            <TextField
                                margin="dense"
                                name="description"
                                label="Description"
                                type="text"
                                fullWidth
                                variant="outlined"
                                multiline
                                rows={3}
                                value={formData.description}
                                onChange={handleChange}
                            />
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

export default DesignationForm;

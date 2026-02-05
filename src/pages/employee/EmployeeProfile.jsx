import React, { useState, useEffect } from 'react';
import {
    Box, Typography, Paper, Grid, TextField, Button, Avatar, Divider, Alert, CircularProgress, alpha, useTheme
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import BusinessIcon from '@mui/icons-material/Business';
import BadgeIcon from '@mui/icons-material/Badge';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import { useEmployee } from '../../context/EmployeeContext';

const EmployeeProfile = () => {
    const theme = useTheme();
    const { fetchMyProfile, updateMyProfile } = useEmployee();
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [editMode, setEditMode] = useState(false);
    const [formData, setFormData] = useState({ phone: '', name: '' });
    const [message, setMessage] = useState(null);

    useEffect(() => {
        loadProfile();
    }, []);

    const loadProfile = async () => {
        setLoading(true);
        const data = await fetchMyProfile();
        if (data) {
            setProfile(data);
            setFormData({ phone: data.phone || '', name: data.name });
        }
        setLoading(false);
    };

    const handleSave = async () => {
        const result = await updateMyProfile(formData);
        if (result.success) {
            setProfile(result.employee);
            setEditMode(false);
            setMessage({ type: 'success', text: 'Profile updated successfully' });
        } else {
            setMessage({ type: 'error', text: result.error });
        }
        setTimeout(() => setMessage(null), 3000);
    };

    if (loading) return <Box display="flex" justifyContent="center" p={5}><CircularProgress /></Box>;

    return (
        <Box sx={{ p: { xs: 2, md: 4 } }}>
            <Typography variant="h4" fontWeight="800" mb={1}>My Profile</Typography>
            <Typography variant="body1" color="text.secondary" mb={4}>Manage your personal information</Typography>

            {message && <Alert severity={message.type} sx={{ mb: 3 }}>{message.text}</Alert>}

            <Grid container spacing={4}>
                <Grid item xs={12} md={4}>
                    <Paper elevation={0} sx={{ p: 4, textAlign: 'center', border: '1px solid #e2e8f0', borderRadius: 4 }}>
                        <Avatar
                            sx={{
                                width: 120,
                                height: 120,
                                margin: '0 auto',
                                mb: 3,
                                bgcolor: theme.palette.primary.main,
                                fontSize: '3rem',
                                fontWeight: 800,
                                boxShadow: `0 0 0 8px ${alpha(theme.palette.primary.main, 0.1)}`
                            }}
                        >
                            {profile?.name?.[0]}
                        </Avatar>
                        <Typography variant="h5" fontWeight="800" sx={{ mb: 1 }}>{profile?.name}</Typography>
                        <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>{profile?.designation?.name}</Typography>
                        <Typography variant="caption" sx={{ bgcolor: alpha(theme.palette.success.main, 0.1), color: theme.palette.success.main, px: 2, py: 0.5, borderRadius: 10, fontWeight: 700 }}>
                            {profile?.status}
                        </Typography>
                    </Paper>
                </Grid>

                <Grid item xs={12} md={8}>
                    <Paper elevation={0} sx={{ p: 4, border: '1px solid #e2e8f0', borderRadius: 4 }}>
                        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                            <Typography variant="h6" fontWeight="800">Personal Details</Typography>
                            {!editMode ? (
                                <Button startIcon={<EditIcon />} onClick={() => setEditMode(true)} variant="outlined" sx={{ borderRadius: 2 }}>
                                    Edit Details
                                </Button>
                            ) : (
                                <Box>
                                    <Button startIcon={<CancelIcon />} onClick={() => setEditMode(false)} sx={{ mr: 1, color: 'text.secondary' }}>
                                        Cancel
                                    </Button>
                                    <Button startIcon={<SaveIcon />} onClick={handleSave} variant="contained" sx={{ borderRadius: 2 }}>
                                        Save Changes
                                    </Button>
                                </Box>
                            )}
                        </Box>

                        <Divider sx={{ mb: 4 }} />

                        <Grid container spacing={3}>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    label="Full Name"
                                    value={editMode ? formData.name : profile?.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    InputProps={{ readOnly: !editMode }}
                                    variant={editMode ? "outlined" : "filled"}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    label="Email Address"
                                    value={profile?.email}
                                    InputProps={{ readOnly: true }}
                                    variant="filled"
                                    helperText="Contact Admin to change email"
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    label="Phone Number"
                                    value={editMode ? formData.phone : profile?.phone}
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                    InputProps={{ readOnly: !editMode }}
                                    variant={editMode ? "outlined" : "filled"}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    label="Department"
                                    value={profile?.department}
                                    InputProps={{ readOnly: true }}
                                    variant="filled"
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    label="Date of Joining"
                                    value={profile?.joiningDate ? new Date(profile.joiningDate).toLocaleDateString() : ''}
                                    InputProps={{ readOnly: true }}
                                    variant="filled"
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    label="Role"
                                    value={'Employee'} // Since designation is shown elsewhere
                                    InputProps={{ readOnly: true }}
                                    variant="filled"
                                />
                            </Grid>
                        </Grid>
                    </Paper>
                </Grid>
            </Grid>
        </Box>
    );
};

export default EmployeeProfile;

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Box,
    Typography,
    Paper,
    Avatar,
    Button,
    alpha,
    useTheme,
    Divider,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Snackbar,
    Alert,
    InputAdornment,
    IconButton as MuiIconButton
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import LockResetIcon from '@mui/icons-material/LockReset';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

import { useEmployee } from '../context/EmployeeContext';
import { useAuth } from '../context/AuthContext';

const Settings = () => {
    const theme = useTheme();
    const navigate = useNavigate();
    const { fetchMyProfile, updateMyProfile } = useEmployee();
    const { user, changePassword } = useAuth();

    const [profile, setProfile] = useState(null);
    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
    const [updateForm, setUpdateForm] = useState({ name: '', phone: '' });

    // Password change states
    const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
    const [passwordForm, setPasswordForm] = useState({
        oldPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [showOldPassword, setShowOldPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

    useEffect(() => {
        loadProfile();
    }, []);

    const loadProfile = async () => {
        const result = await fetchMyProfile();
        if (result && result._id) {
            setProfile(result);
            setUpdateForm({ name: result.name, phone: result.phone || '' });
        }
    };

    const handleUpdateProfile = async () => {
        const result = await updateMyProfile(updateForm);
        if (result.success) {
            setProfile(result.employee);
            setIsUpdateModalOpen(false);
            setSnackbar({ open: true, message: 'Profile updated successfully', severity: 'success' });
        } else {
            setSnackbar({ open: true, message: result.error, severity: 'error' });
        }
    };

    const handleChangePassword = async () => {
        // Validation
        if (!passwordForm.oldPassword || !passwordForm.newPassword || !passwordForm.confirmPassword) {
            setSnackbar({ open: true, message: 'All fields are required', severity: 'error' });
            return;
        }

        if (passwordForm.newPassword !== passwordForm.confirmPassword) {
            setSnackbar({ open: true, message: 'New passwords do not match', severity: 'error' });
            return;
        }

        if (passwordForm.newPassword.length < 6) {
            setSnackbar({ open: true, message: 'Password must be at least 6 characters', severity: 'error' });
            return;
        }

        const result = await changePassword(passwordForm.oldPassword, passwordForm.newPassword);

        if (result.success) {
            setSnackbar({ open: true, message: 'Password changed successfully', severity: 'success' });
            setIsPasswordModalOpen(false);
            setPasswordForm({ oldPassword: '', newPassword: '', confirmPassword: '' });
        } else {
            setSnackbar({ open: true, message: result.error, severity: 'error' });
        }
    };

    return (
        <Box sx={{ p: { xs: 2, md: 3 } }}>
            <Box mb={4}>
                <Typography variant="h5" fontWeight="800">Settings</Typography>
                <Typography variant="body2" color="text.secondary">Manage your profile and account settings</Typography>
            </Box>

            <Paper elevation={0} sx={{ p: 4, border: '1px solid #e2e8f0', borderRadius: 3, bgcolor: '#f8fafc', maxWidth: 600 }}>
                <Box display="flex" alignItems="center" gap={2} mb={3}>
                    <Avatar
                        sx={{
                            width: 60,
                            height: 60,
                            bgcolor: theme.palette.primary.main,
                            fontSize: '1.5rem',
                            fontWeight: 800
                        }}
                    >
                        {profile?.name?.[0] || user?.name?.[0] || 'U'}
                    </Avatar>
                    <Box>
                        <Typography variant="h6" fontWeight="800">{profile?.name || user?.name || 'User'}</Typography>
                        <Typography variant="body2" color="text.secondary">{profile?.email || user?.email}</Typography>
                    </Box>
                </Box>
                <Divider sx={{ mb: 3 }} />
                <Typography variant="h6" fontWeight="800" mb={3}>Quick Actions</Typography>
                <Box display="flex" flexDirection="column" gap={2}>
                    <Button variant="outlined" startIcon={<EditIcon />} fullWidth onClick={() => setIsUpdateModalOpen(true)} sx={{ justifyContent: 'flex-start', py: 1.5, textTransform: 'none', bgcolor: '#fff' }}>Edit Profile</Button>
                    <Button variant="outlined" startIcon={<LockResetIcon />} fullWidth onClick={() => setIsPasswordModalOpen(true)} sx={{ justifyContent: 'flex-start', py: 1.5, textTransform: 'none', bgcolor: '#fff' }}>Change Password</Button>
                    {user?.role === 'EMPLOYEE' && (
                        <>
                            <Button variant="outlined" startIcon={<FileDownloadOutlinedIcon />} fullWidth onClick={() => navigate('/employee-payroll')} sx={{ justifyContent: 'flex-start', py: 1.5, textTransform: 'none', bgcolor: '#fff' }}>Download Latest Slip</Button>
                            <Button variant="outlined" startIcon={<AccessTimeIcon />} fullWidth onClick={() => navigate('/attendance')} sx={{ justifyContent: 'flex-start', py: 1.5, textTransform: 'none', bgcolor: '#fff' }}>View Attendance</Button>
                        </>
                    )}
                </Box>
            </Paper>

            {/* Profile Update Dialog */}
            <Dialog
                open={isUpdateModalOpen}
                onClose={() => setIsUpdateModalOpen(false)}
                PaperProps={{ sx: { borderRadius: 3, p: 1 } }}
            >
                <DialogTitle fontWeight="900">Update Profile Details</DialogTitle>
                <DialogContent>
                    <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 3 }}>
                        <TextField
                            label="Full Name"
                            fullWidth
                            value={updateForm.name}
                            onChange={(e) => setUpdateForm({ ...updateForm, name: e.target.value })}
                            variant="outlined"
                        />
                        <TextField
                            label="Phone Number"
                            fullWidth
                            value={updateForm.phone}
                            onChange={(e) => setUpdateForm({ ...updateForm, phone: e.target.value })}
                            variant="outlined"
                        />
                    </Box>
                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 2 }}>
                    <Button onClick={() => setIsUpdateModalOpen(false)} sx={{ fontWeight: 600, color: 'text.secondary' }}>Cancel</Button>
                    <Button onClick={handleUpdateProfile} variant="contained" sx={{ px: 4, borderRadius: 2, fontWeight: 700 }}>Save Changes</Button>
                </DialogActions>
            </Dialog>

            {/* Password Change Dialog */}
            <Dialog
                open={isPasswordModalOpen}
                onClose={() => {
                    setIsPasswordModalOpen(false);
                    setPasswordForm({ oldPassword: '', newPassword: '', confirmPassword: '' });
                }}
                PaperProps={{ sx: { borderRadius: 3, p: 1, minWidth: 400 } }}
            >
                <DialogTitle fontWeight="900">Change Password</DialogTitle>
                <DialogContent>
                    <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 3 }}>
                        <TextField
                            label="Current Password"
                            type={showOldPassword ? 'text' : 'password'}
                            fullWidth
                            value={passwordForm.oldPassword}
                            onChange={(e) => setPasswordForm({ ...passwordForm, oldPassword: e.target.value })}
                            variant="outlined"
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <MuiIconButton
                                            onClick={() => setShowOldPassword(!showOldPassword)}
                                            edge="end"
                                        >
                                            {showOldPassword ? <VisibilityOff /> : <Visibility />}
                                        </MuiIconButton>
                                    </InputAdornment>
                                )
                            }}
                        />
                        <TextField
                            label="New Password"
                            type={showNewPassword ? 'text' : 'password'}
                            fullWidth
                            value={passwordForm.newPassword}
                            onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                            variant="outlined"
                            helperText="Minimum 6 characters"
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <MuiIconButton
                                            onClick={() => setShowNewPassword(!showNewPassword)}
                                            edge="end"
                                        >
                                            {showNewPassword ? <VisibilityOff /> : <Visibility />}
                                        </MuiIconButton>
                                    </InputAdornment>
                                )
                            }}
                        />
                        <TextField
                            label="Confirm New Password"
                            type={showConfirmPassword ? 'text' : 'password'}
                            fullWidth
                            value={passwordForm.confirmPassword}
                            onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                            variant="outlined"
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <MuiIconButton
                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                            edge="end"
                                        >
                                            {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                                        </MuiIconButton>
                                    </InputAdornment>
                                )
                            }}
                        />
                    </Box>
                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 2 }}>
                    <Button
                        onClick={() => {
                            setIsPasswordModalOpen(false);
                            setPasswordForm({ oldPassword: '', newPassword: '', confirmPassword: '' });
                        }}
                        sx={{ fontWeight: 600, color: 'text.secondary' }}
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleChangePassword}
                        variant="contained"
                        sx={{ px: 4, borderRadius: 2, fontWeight: 700 }}
                    >
                        Change Password
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Snackbar for notifications */}
            <Snackbar
                open={snackbar.open}
                autoHideDuration={4000}
                onClose={() => setSnackbar({ ...snackbar, open: false })}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            >
                <Alert
                    onClose={() => setSnackbar({ ...snackbar, open: false })}
                    severity={snackbar.severity}
                    sx={{ width: '100%' }}
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default Settings;

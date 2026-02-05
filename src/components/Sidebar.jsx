import React from 'react';
import {
    Box,
    Drawer,
    Toolbar,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Typography,
    Divider,
    alpha,
    useTheme
} from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';



import GroupsIcon from '@mui/icons-material/Groups';
import BusinessIcon from '@mui/icons-material/Business';
import BadgeIcon from '@mui/icons-material/Badge';
import PaymentsIcon from '@mui/icons-material/Payments';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import EventNoteIcon from '@mui/icons-material/EventNote';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import AssessmentIcon from '@mui/icons-material/Assessment';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import LogoutIcon from '@mui/icons-material/Logout';
import TravelExploreIcon from '@mui/icons-material/TravelExplore';

import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const drawerWidth = 260;

const Sidebar = ({ mobileOpen, handleDrawerToggle }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const { user, logout } = useAuth();
    const theme = useTheme();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };



    const menuItems = [
        { text: 'Dashboard', icon: <DashboardIcon />, path: '/' },

        { text: 'Department', icon: <BusinessIcon />, path: '/departments', roles: ['ADMIN', 'HR'] },
        { text: 'Designation', icon: <BadgeIcon />, path: '/designations', roles: ['ADMIN', 'HR'] },
        { text: 'Employee', icon: <GroupsIcon />, path: '/employees', roles: ['ADMIN', 'HR'] },
        { text: 'Salary', icon: <AccountBalanceWalletIcon />, path: '/salary', roles: ['ADMIN', 'HR'] },
        { text: 'Payroll', icon: <PaymentsIcon />, path: '/payroll', roles: ['ADMIN', 'HR'] },
        { text: 'Attendance', icon: <AccessTimeIcon />, path: '/attendance', roles: ['EMPLOYEE'] },
        { text: 'Attendance Report', icon: <AssessmentIcon />, path: '/attendance-report', roles: ['ADMIN', 'HR'] },
        { text: 'Analytics', icon: <AssessmentIcon />, path: '/analytics', roles: ['ADMIN', 'HR'] },
        { text: 'Leave', icon: <EventNoteIcon />, path: '/leaves', roles: ['EMPLOYEE'] },
        { text: 'Leave Management', icon: <EventAvailableIcon />, path: '/leave-management', roles: ['ADMIN', 'HR'] },
        { text: 'Register', icon: <PersonAddIcon />, path: '/register', roles: ['ADMIN'] },

        // Employee Only Links
        { text: 'My Profile', icon: <PersonAddIcon />, path: '/employee-profile', roles: ['EMPLOYEE'] },
        { text: 'My Salary', icon: <AccountBalanceWalletIcon />, path: '/employee-salary', roles: ['EMPLOYEE'] },
        { text: 'Payroll', icon: <PaymentsIcon />, path: '/employee-payroll', roles: ['EMPLOYEE'] },
    ];

    const filteredItems = menuItems.filter(item => {
        if (!item.roles) return true;
        const userRole = typeof user?.role === 'object' ? user?.role?.name : user?.role;
        return item.roles.includes(userRole);
    });

    const drawer = (
        <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <Toolbar />

            <Box sx={{ px: 2, flexGrow: 1 }}>
                <List sx={{ pt: 1 }}>
                    {filteredItems.map((item) => {
                        const active = location.pathname === item.path;
                        return (
                            <ListItem key={item.text} disablePadding sx={{ mb: 0.5 }}>
                                <ListItemButton
                                    onClick={() => navigate(item.path)}
                                    sx={{
                                        borderRadius: 2,
                                        py: 1.2,
                                        px: 2,
                                        bgcolor: active ? alpha(theme.palette.primary.main, 0.08) : 'transparent',
                                        color: active ? theme.palette.primary.main : theme.palette.text.secondary,
                                        '&:hover': {
                                            bgcolor: alpha('#6E8CFB', 0.08), // Light background tint of the accent color
                                            color: '#6E8CFB', // The requested hover color for words
                                            '& .MuiListItemIcon-root': {
                                                color: '#6E8CFB', // Icon changes to match
                                            }
                                        }
                                    }}
                                >
                                    <ListItemIcon
                                        sx={{
                                            minWidth: 40,
                                            color: active ? theme.palette.primary.main : 'inherit',
                                            transition: 'color 0.2s', // Smooth transition
                                        }}
                                    >
                                        {React.cloneElement(item.icon, { fontSize: 'medium' })}
                                    </ListItemIcon>
                                    <ListItemText
                                        primary={item.text}
                                        primaryTypographyProps={{
                                            fontWeight: active ? 700 : 500,
                                            fontSize: '0.925rem'
                                        }}
                                    />
                                </ListItemButton>
                            </ListItem>
                        );
                    })}
                </List>
            </Box>

            <Box sx={{ p: 2, mt: 'auto' }}>
                <Divider sx={{ mb: 2, opacity: 0.5 }} />
                <List>

                    <ListItem disablePadding>
                        <ListItemButton
                            onClick={handleLogout}
                            sx={{
                                borderRadius: 2,
                                color: 'text.secondary',
                                '&:hover': {
                                    color: '#6E8CFB',
                                    bgcolor: alpha('#6E8CFB', 0.08),
                                    '& .MuiListItemIcon-root': {
                                        color: '#6E8CFB',
                                    }
                                }
                            }}
                        >
                            <ListItemIcon sx={{ minWidth: 40, color: 'inherit' }}><LogoutIcon fontSize="small" /></ListItemIcon>
                            <ListItemText primary="Log out" primaryTypographyProps={{ fontSize: '0.9rem', fontWeight: 500 }} />
                        </ListItemButton>
                    </ListItem>
                </List>
            </Box>
        </Box >
    );

    return (
        <Box
            component="nav"
            sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
        >
            <Drawer
                variant="temporary"
                open={mobileOpen}
                onClose={handleDrawerToggle}
                ModalProps={{ keepMounted: true }}
                sx={{
                    display: { xs: 'block', sm: 'none' },
                    '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
                }}
            >
                {drawer}
            </Drawer>
            <Drawer
                variant="permanent"
                sx={{
                    display: { xs: 'none', sm: 'block' },
                    '& .MuiDrawer-paper': {
                        boxSizing: 'border-box',
                        width: drawerWidth,
                        borderRight: `1px solid ${theme.palette.divider}`
                    },
                }}
                open
            >
                {drawer}
            </Drawer>
        </Box>
    );
};

export default Sidebar;

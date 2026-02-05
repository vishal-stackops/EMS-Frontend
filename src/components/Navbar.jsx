import React from 'react';
import {
    AppBar,
    Toolbar,
    Typography,
    IconButton,
    Box,
    Avatar,
    alpha,
    useTheme
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import HexagonIcon from '@mui/icons-material/Hexagon';
import LogoutIcon from '@mui/icons-material/Logout';
import SettingsIcon from '@mui/icons-material/Settings';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = ({ toggleSidebar }) => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const theme = useTheme();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <AppBar
            position="fixed"
            sx={{
                zIndex: (theme) => theme.zIndex.drawer + 1,
                backgroundColor: '#ffffff',
                color: theme.palette.text.primary,
                boxShadow: 'none',
                borderBottom: `1px solid ${theme.palette.divider}`
            }}
        >
            <Toolbar sx={{ justifyContent: 'space-between', px: { xs: 2, sm: 4 }, minHeight: 70 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        edge="start"
                        onClick={toggleSidebar}
                        sx={{ display: { sm: 'none' } }}
                    >
                        <MenuIcon />
                    </IconButton>

                    {/* Logo visible on all screens */}
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Box
                            sx={{
                                width: 32,
                                height: 32,
                                bgcolor: theme.palette.primary.main,
                                borderRadius: '8px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: '#fff',
                            }}
                        >
                            <HexagonIcon sx={{ fontSize: 20 }} />
                        </Box>
                        <Typography
                            variant="h6"
                            fontWeight="800"
                            color="text.primary"
                            sx={{
                                background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                            }}
                        >
                            Empify
                        </Typography>
                    </Box>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', ml: 1, gap: 1.5 }}>
                        <Box sx={{ textAlign: 'right', display: { xs: 'none', sm: 'block' } }}>
                            <Typography variant="body2" fontWeight="800" fontSize="0.85rem" color="text.primary" lineHeight={1.2}>
                                {user?.name || 'User'}
                            </Typography>
                            <Typography variant="caption" fontWeight="600" color="text.secondary" sx={{ letterSpacing: '0.02em', textTransform: 'uppercase', fontSize: '0.65rem' }}>
                                {user?.role?.name || user?.role || 'Role'}
                            </Typography>
                        </Box>
                        <Avatar
                            sx={{
                                width: 38,
                                height: 38,
                                bgcolor: theme.palette.primary.main,
                                fontSize: '0.95rem',
                                fontWeight: 700,
                                boxShadow: `0 0 0 2px #fff, 0 0 0 4px ${alpha(theme.palette.primary.main, 0.1)}`
                            }}
                        >
                            {user?.name?.[0] || 'U'}
                        </Avatar>
                        <IconButton
                            onClick={() => navigate('/settings')}
                            size="small"
                            sx={{
                                color: '#94a3b8',
                                '&:hover': { color: '#6E8CFB', bgcolor: alpha('#6E8CFB', 0.08) }
                            }}
                            title="Settings"
                        >
                            <SettingsIcon fontSize="small" />
                        </IconButton>
                        <IconButton
                            onClick={handleLogout}
                            size="small"
                            sx={{
                                color: '#94a3b8',
                                ml: 0.5,
                                '&:hover': { color: '#6E8CFB', bgcolor: alpha('#6E8CFB', 0.08) }
                            }}
                            title="Logout"
                        >
                            <LogoutIcon fontSize="small" />
                        </IconButton>
                    </Box>
                </Box>
            </Toolbar>
        </AppBar>
    );
};

export default Navbar;

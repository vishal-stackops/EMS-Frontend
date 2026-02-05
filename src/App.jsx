import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';

import theme from './theme/theme';
import { EmployeeProvider } from './context/EmployeeContext';
import { AuthProvider } from './context/AuthContext';
import { DepartmentProvider } from './context/DepartmentContext';
import { DesignationProvider } from './context/DesignationContext';
import { SalaryProvider } from './context/SalaryContext';
import { PayrollProvider } from './context/PayrollContext';
import { AttendanceProvider } from './context/AttendanceContext';
import { LeaveProvider } from './context/LeaveContext';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import EmployeeList from './pages/EmployeeList';
import DepartmentList from './pages/DepartmentList';
import DesignationList from './pages/DesignationList';
import SalaryList from './pages/SalaryList';
import PayrollList from './pages/PayrollList';
import Attendance from './pages/Attendance';
import AttendanceReport from './pages/AttendanceReport';
import LeaveRequest from './pages/LeaveRequest';
import LeaveManagement from './pages/LeaveManagement';
import Register from './pages/Register';
import Login from './pages/Login';
import PrivateRoute from './components/PrivateRoute';
import { AnalyticsProvider } from './context/AnalyticsContext';
import Analytics from './pages/Analytics';
import EmployeeProfile from './pages/employee/EmployeeProfile';
import EmployeeSalary from './pages/employee/EmployeeSalary';
import EmployeePayroll from './pages/employee/EmployeePayroll';
import Settings from './pages/Settings';

const Layout = ({ children }) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const handleDrawerToggle = () => setMobileOpen(!mobileOpen);
  const drawerWidth = 240;

  return (
    <Box sx={{ display: 'flex' }}>
      <Navbar toggleSidebar={handleDrawerToggle} />
      <Sidebar mobileOpen={mobileOpen} handleDrawerToggle={handleDrawerToggle} />
      <Box
        component="main"
        sx={{ flexGrow: 1, p: 3, width: { sm: `calc(100% - ${drawerWidth}px)` } }}
      >
        <Toolbar />
        {children}
      </Box>
    </Box>
  );
};

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <DesignationProvider>
          <DepartmentProvider>
            <SalaryProvider>
              <PayrollProvider>
                <AttendanceProvider>
                  <LeaveProvider>
                    <AnalyticsProvider>
                      <EmployeeProvider>
                        <Router>
                          <Routes>
                            <Route path="/login" element={<Login />} />
                            <Route path="/signup" element={<Register isPublic={true} />} />

                            {/* Protected Routes */}
                            <Route path="/" element={
                              <PrivateRoute>
                                <Layout>
                                  <Dashboard />
                                </Layout>
                              </PrivateRoute>
                            } />
                            <Route path="/settings" element={
                              <PrivateRoute>
                                <Layout>
                                  <Settings />
                                </Layout>
                              </PrivateRoute>
                            } />
                            <Route path="/employees" element={
                              <PrivateRoute allowedRoles={['ADMIN', 'HR']}>
                                <Layout>
                                  <EmployeeList />
                                </Layout>
                              </PrivateRoute>
                            } />
                            <Route path="/departments" element={
                              <PrivateRoute allowedRoles={['ADMIN', 'HR']}>
                                <Layout>
                                  <DepartmentList />
                                </Layout>
                              </PrivateRoute>
                            } />
                            <Route path="/designations" element={
                              <PrivateRoute allowedRoles={['ADMIN', 'HR']}>
                                <Layout>
                                  <DesignationList />
                                </Layout>
                              </PrivateRoute>
                            } />
                            <Route path="/salary" element={
                              <PrivateRoute allowedRoles={['ADMIN', 'HR']}>
                                <Layout>
                                  <SalaryList />
                                </Layout>
                              </PrivateRoute>
                            } />
                            <Route path="/payroll" element={
                              <PrivateRoute allowedRoles={['ADMIN', 'HR']}>
                                <Layout>
                                  <PayrollList />
                                </Layout>
                              </PrivateRoute>
                            } />
                            <Route path="/attendance" element={
                              <PrivateRoute allowedRoles={['ADMIN', 'HR', 'EMPLOYEE']}>
                                <Layout>
                                  <Attendance />
                                </Layout>
                              </PrivateRoute>
                            } />
                            <Route path="/attendance-report" element={
                              <PrivateRoute allowedRoles={['ADMIN', 'HR']}>
                                <Layout>
                                  <AttendanceReport />
                                </Layout>
                              </PrivateRoute>
                            } />
                            <Route path="/leaves" element={
                              <PrivateRoute allowedRoles={['ADMIN', 'HR', 'EMPLOYEE']}>
                                <Layout>
                                  <LeaveRequest />
                                </Layout>
                              </PrivateRoute>
                            } />
                            <Route path="/leave-management" element={
                              <PrivateRoute allowedRoles={['ADMIN', 'HR']}>
                                <Layout>
                                  <LeaveManagement />
                                </Layout>
                              </PrivateRoute>
                            } />

                            {/* Employee Specific Routes */}
                            <Route path="/employee-profile" element={
                              <PrivateRoute allowedRoles={['EMPLOYEE']}>
                                <Layout>
                                  <EmployeeProfile />
                                </Layout>
                              </PrivateRoute>
                            } />
                            <Route path="/employee-salary" element={
                              <PrivateRoute allowedRoles={['EMPLOYEE']}>
                                <Layout>
                                  <EmployeeSalary />
                                </Layout>
                              </PrivateRoute>
                            } />
                            <Route path="/employee-payroll" element={
                              <PrivateRoute allowedRoles={['EMPLOYEE']}>
                                <Layout>
                                  <EmployeePayroll />
                                </Layout>
                              </PrivateRoute>
                            } />
                            <Route path="/register" element={
                              <PrivateRoute allowedRoles={['ADMIN', 'HR']}>
                                <Layout>
                                  <Register />
                                </Layout>
                              </PrivateRoute>
                            } />
                            <Route path="/analytics" element={
                              <PrivateRoute allowedRoles={['ADMIN', 'HR']}>
                                <Layout>
                                  <Analytics />
                                </Layout>
                              </PrivateRoute>
                            } />

                            {/* Catch all redirect to login or dashboard */}
                            <Route path="*" element={<Navigate to="/" replace />} />
                          </Routes>
                        </Router>
                      </EmployeeProvider>
                    </AnalyticsProvider>
                  </LeaveProvider>
                </AttendanceProvider>
              </PayrollProvider>
            </SalaryProvider>
          </DepartmentProvider>
        </DesignationProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;

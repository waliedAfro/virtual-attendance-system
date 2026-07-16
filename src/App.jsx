import React, { useState , useEffect } from "react";
import { Toaster } from "react-hot-toast";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import SideMenu from "./menu/side_menu";
import TopNavbar from "./menu/top_nav_bar";
import NotificationUI from "./component/NotificationUI";
import Login from "./pages/auth/login";
import Signup from "./pages/auth/Signup";
import ForgotPassword from "./pages/auth/forgot-password";
import ResetPassword from "./pages/auth/reset-password";
import Home from "./pages/auth/home";
import ProtectedRoute from "./component/protectedRoute";
import { useNavigate } from "react-router-dom";
import ViewCompany from "./pages/company/view-company";
import AddLocation from "./pages/location/add-location";
import AddDevice from "./pages/device/add-device";

//HR
import AddEmployee from "./pages/hr/employee/add-employee";
import SearchEmployee from "./pages/hr/employee/search-employee";
import EditEmployee from "./pages/hr/employee/edit-employee";
import ViewEmployee from "./pages/hr/employee/view-employee";

import ShiftAssignmentSearch from "./pages/hr/shift/shift-assignment-search";
import ShiftAssignmentCreate from "./pages/hr/shift/shift-assignment-create";
import ShiftAssignmentUpdate from "./pages/hr/shift/shift-assignment-update";

import SearchDevice from "./pages/device/search-device";
import SearchLocation from "./pages/location/search-location";

import Subscription from "./pages/subscription/Subscription";
import TenantPayment from "./pages/billing/payment-management";
import PaymentSuccess from "./pages/billing/payment-success";
import { UserLicenses } from "./pages/subscription/user-licenses";
import { SubscriptionLicenses } from "./pages/subscription/subscription-licenses";
import InvoiceManagement from "./pages/billing/invoice-mangement";
import InvoiceDetail from "./pages/billing/invoice-detail";
import DailyAttendanceReport from "./pages/report/daily-attendance-report";
import DetailAttendanceReport from "./pages/report/details-report ";
import AttendanceReport from "./pages/report/attendance-report";
//setting
import ShiftSearch from "./pages/setting/shift/shift-search";
import ShiftForm from "./pages/setting/shift/shift-form";
import DepartmentManagement from "./pages/setting/department/department-management";

//user rols
import RolesList from "./pages/permission/roles-list";
import RoleForm from "./pages/permission/role-form";
import UserRoleAssignment from "./pages/permission/user-role-assignment";
import UserAccessManagement from "./pages/permission/user-access-management";
import PermissionGroupsPage from "./pages/security/rbac/pages/PermissionGroupsPage";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
const queryClient = new QueryClient();
import { useTranslation } from "react-i18next";
import "./App.css";
import './i18n';


// Create a wrapper component to handle routing logic
const AppContent = () => {
  const [sideMenuOpen, setSideMenuOpen] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();
  const { i18n } = useTranslation();

  // Check if current route is login or signup
  const isAuthPage =
    location.pathname === "/" ||
    location.pathname === "/signup" ||
    location.pathname === "/forgot-password" ||
    location.pathname === "/reset-password";

  const toggleSideMenu = () => {
    setSideMenuOpen(!sideMenuOpen);
  };

   

  useEffect(() => {
    document.documentElement.lang = i18n.language;
    document.documentElement.dir =
      i18n.language === "ar" ? "rtl" : "ltr";
  }, [i18n.language]);

  return (

  

    <div className="app">
      <Toaster position="top-right" />

      {/* Only show TopNavbar and SideMenu if not on auth pages */}
      {!isAuthPage && (
        <>
          <TopNavbar toggleSideMenu={toggleSideMenu} />
          <SideMenu isOpen={sideMenuOpen} />
        </>
      )}

      <div className={`main-content ${isAuthPage ? "auth-page" : ""}`}>
        <div
          className={`content-area ${
            !isAuthPage && sideMenuOpen ? "menu-open" : "menu-closed"
          } ${isAuthPage ? "full-width" : ""}`}
        >
          <QueryClientProvider client={queryClient}>
            <Routes>
              <Route path="/" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              <Route
                path="/home"
                element={
                  <ProtectedRoute>
                    <Home />
                  </ProtectedRoute>
                }
              />
              {/* Company Routes */}
              <Route
                path="/view-company"
                element={
                  <ProtectedRoute>
                    <ViewCompany />
                  </ProtectedRoute>
                }
              />
              {/* Subscription*/}
              <Route
                path="/subscriptions/manage"
                element={
                  <ProtectedRoute>
                    <Subscription />
                  </ProtectedRoute>
                }
              />
              <Route
                path="subscriptions/licenses"
                element={
                  <ProtectedRoute>
                    <SubscriptionLicenses />
                  </ProtectedRoute>
                }
              />
              {/* Billing  Routes */}
              <Route
                path="invoices"
                element={
                  <ProtectedRoute>
                    <InvoiceManagement />
                  </ProtectedRoute>
                }
              />
              <Route
                path="invoices/:id"
                element={
                  <ProtectedRoute>
                    <InvoiceDetail />
                  </ProtectedRoute>
                }
              />
              {/* payment  Routes */}
              <Route
                path="payments"
                element={
                  <ProtectedRoute>
                    <TenantPayment />
                  </ProtectedRoute>
                }
              />
              success
              <Route
                path="payments/success"
                element={
                  <ProtectedRoute>
                    <PaymentSuccess />
                  </ProtectedRoute>
                }
              />
              {/* Location Routes */}
              <Route
                path="/add-location"
                element={
                  <ProtectedRoute>
                    <AddLocation />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/search-location"
                element={
                  <ProtectedRoute>
                    <SearchLocation />
                  </ProtectedRoute>
                }
              />
              {/* Device Routes */}
              <Route
                path="/add-device"
                element={
                  <ProtectedRoute>
                    <AddDevice />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/search-device"
                element={
                  <ProtectedRoute>
                    <SearchDevice />
                  </ProtectedRoute>
                }
              />
              {/* Employee Routes */}
              <Route
                path="/search-employee"
                element={
                  <ProtectedRoute>
                    <SearchEmployee />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/add-employee"
                element={
                  <ProtectedRoute>
                    <AddEmployee />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/employee/:id/edit"
                element={
                  <ProtectedRoute>
                    <EditEmployee />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/employee/:id/view"
                element={
                  <ProtectedRoute>
                    <ViewEmployee />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/shift-assignment"
                element={
                  <ProtectedRoute>
                    <ShiftAssignmentSearch />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/shift-assignment/new"
                element={
                  <ProtectedRoute>
                    <ShiftAssignmentCreate />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/shift-assignment/:id/edit"
                element={
                  <ProtectedRoute>
                    <ShiftAssignmentUpdate />
                  </ProtectedRoute>
                }
              />
              {/* Report Routes */}
              <Route
                path="reports/daily-attendance"
                element={
                  <ProtectedRoute>
                    <DailyAttendanceReport />
                  </ProtectedRoute>
                }
              />
              <Route
                path="reports/attendance"
                element={
                  <ProtectedRoute>
                    <AttendanceReport />
                  </ProtectedRoute>
                }
              />
              <Route
                path="reports/details"
                element={
                  <ProtectedRoute>
                    <DetailAttendanceReport />
                  </ProtectedRoute>
                }
              />
              {/* Setting Routes */}
              {/* shift */}
              <Route
                path="settings/shift"
                element={
                  <ProtectedRoute>
                    <ShiftSearch />
                  </ProtectedRoute>
                }
              />
              <Route
                path="settings/shift/:id"
                element={
                  <ProtectedRoute>
                    <ShiftForm />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/settings/shift/new"
                element={
                  <ProtectedRoute>
                    <ShiftForm />
                  </ProtectedRoute>
                }
              />
              {/* department */}
              <Route
                path="settings/department"
                element={
                  <ProtectedRoute>
                    <DepartmentManagement />
                  </ProtectedRoute>
                }
              />
              {/* User Role */}
              <Route
                path="/access/roles"
                element={
                  <ProtectedRoute>
                    <PermissionGroupsPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/access/roles/new"
                element={
                  <ProtectedRoute>
                    <RoleForm />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/access/roles/edit/:roleId"
                element={
                  <ProtectedRoute>
                    <RoleForm />
                  </ProtectedRoute>
                }
              />
              <Route 
                path="/access/users/:userId/roles"
                element={
                  <ProtectedRoute>
                    <UserRoleAssignment />
                  </ProtectedRoute>
                }
              />

              <Route 
                path="/access/user-assign"
                element={
                  <ProtectedRoute>
                    <UserAccessManagement />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </QueryClientProvider>
        </div>
      </div>
    </div>
  );
};

// Main App Component
function App() {
  const theme = createTheme({
    palette: {
      primary: {
        main: "#667eea",
        light: "#a5b4fc",
        dark: "#4c6ef5",
      },
      secondary: {
        main: "#764ba2",
        light: "#a786c6",
        dark: "#5e3a8a",
      },
      background: {
        default: "#f5f7fa",
        paper: "#ffffff",
      },
    },
    typography: {
      fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
      h4: {
        fontWeight: 700,
      },
      h6: {
        fontWeight: 600,
      },
    },
    shape: {
      borderRadius: 12,
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            textTransform: "none",
            borderRadius: 8,
            fontWeight: 500,
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: 12,
          },
        },
      },
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <CssBaseline />
        <NotificationUI />
        <BrowserRouter>
          <AppContent />
        </BrowserRouter>
      </LocalizationProvider>
    </ThemeProvider>
  );
}

export default App;

import React from 'react';
import { RouterProvider, createBrowserRouter ,Navigate} from 'react-router-dom';
import Cookies from 'js-cookie';


import Login from './components/Login.jsx';
import Register from './components/Register.jsx';
import AdminLogin from './components/AdminLogin.jsx';
import StudentDashboard from './components/StudentDashboard.jsx';
import AdminDashboard from './components/AdminDashboard.jsx';

const ProtectedRoute = ({ children, redirectTo }) => {
  const token = Cookies.get('token');
  return token ? children : <Navigate to={redirectTo} />;
};

const AdminProtectedRoute = ({ children, redirectTo }) => {
  const adminToken = Cookies.get('adminToken');
  return adminToken ? children : <Navigate to={redirectTo} />;
};

const router = createBrowserRouter([
  
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "register",
        element: <Register />,
      },
      {
        path: "admin-login",
        element: <AdminLogin />,
      },
      {
        path: "dashboard",
        element: (
          <ProtectedRoute redirectTo="/login">
            <StudentDashboard />
          </ProtectedRoute>
        ),
      },
      {
        path: "admin-dashboard",
        element: (
          <AdminProtectedRoute redirectTo="/admin-login">
            <AdminDashboard />
          </AdminProtectedRoute>
        ),
      },
      {
        path: "*",
        element: <Navigate to={Cookies.get('token') ? "/dashboard" : "/login"} />,
      },
  
  
]);

const App = () => {
  return (
    <RouterProvider router={router} />
  );
};

export default App;

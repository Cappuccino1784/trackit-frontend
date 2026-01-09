import { Routes, Route, Navigate } from "react-router-dom";

// pages
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import Transactions from "./pages/Transactions";
import Income from "./pages/Income";
import Expense from "./pages/Expense";
import Analytics from "./pages/Analytics";
import Accounts from "./pages/Accounts";

// components
import ProtectedRoute from "./components/layout/ProtectedRoute";
import AppLayout from "./components/layout/AppLayout";

const App = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      {/* Protected Routes with Layout */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <AppLayout>
              <Dashboard />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route 
        path="/transactions" 
        element={
          <ProtectedRoute>
            <AppLayout>
              <Transactions />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route 
        path="/accounts" 
        element={
          <ProtectedRoute>
            <AppLayout>
              <Accounts />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route 
        path="/income" 
        element={
          <ProtectedRoute>
            <AppLayout>
              <Income />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route 
        path="/expense" 
        element={
          <ProtectedRoute>
            <AppLayout>
              <Expense />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route 
        path="/analytics" 
        element={
          <ProtectedRoute>
            <AppLayout>
              <Analytics />
            </AppLayout>
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
};

export default App;

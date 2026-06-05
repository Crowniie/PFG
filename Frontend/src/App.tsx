import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import Login from "./pages/login";
import Register from "./pages/register";
import Dashboard from "./pages/dashboard";
import AssetChart from "./pages/assetchart";
import Welcome from "./pages/welcome";
import Knowledge from "./pages/knowledge";
function App() {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      {/* Landing page */}
      <Route
        path="/"
        element={
          isAuthenticated ? (
            <Navigate to="/dashboard" replace />
          ) : (
            <Welcome />
          )
        }
      />

      {/* Auth routes */}
      <Route
        path="/login"
        element={
          isAuthenticated ? (
            <Navigate to="/dashboard" replace />
          ) : (
            <Login />
          )
        }
      />
    <Route
      path="/register"
      element={
        isAuthenticated ? (
          <Navigate to="/dashboard" replace />
        ) : (
          <Register />
        )
      }
    />

      {/* Protected routes */}
<Route
  path="/dashboard"
  element={
    isAuthenticated ? (
      <Dashboard />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />
      <Route
        path="/history"
        element={
          isAuthenticated ? (
            <PlaceholderPage title="Recommendations History" />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />

      {/* Catch-all: send to root */}
      <Route path="*" element={<Navigate to="/" replace />} />
      <Route
        path="/asset/:symbol"
        element={
          isAuthenticated ? (
            <AssetChart />
             ) : (
             <Navigate to="/login" replace />
      )
  }
/>
<Route
  path="/knowledge"
  element={
    isAuthenticated ? (
      <Knowledge />
    ) : (
      <Navigate to="/login" replace />
    )
  }
/>
    </Routes>
  );
  
}

function PlaceholderPage({ title }: { title: string }) {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center">
      <h1 className="text-4xl font-bold">{title}</h1>
    </div>
  );
}

export default App;
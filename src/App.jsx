import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AlertCircle } from 'lucide-react';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import Dashboard from './pages/Dashboard';
import Inversiones from './pages/Inversiones';
import Prestamos from './pages/Prestamos';
import Usuarios from './pages/Usuarios';
import Perfil from './pages/Perfil';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Verificar si hay token guardado en localStorage
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (token && userData) {
      try {
        setUser(JSON.parse(userData));
        setIsAuthenticated(true);
      } catch (err) {
        console.error('Error al parsear usuario:', err);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
    setLoading(false);
  }, []);

  const handleLogin = (token, userData) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
    setIsAuthenticated(true);
    setError(null);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setIsAuthenticated(false);
  };

  const handleRegister = (token, userData) => {
    handleLogin(token, userData);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-teal-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Cargando aplicación...</p>
        </div>
      </div>
    );
  }

  return (
    <Router>
      {error && (
        <div className="fixed top-4 right-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded flex items-center gap-2 z-50">
          <AlertCircle size={20} />
          <span>{error}</span>
        </div>
      )}
      
      {isAuthenticated && <Navbar user={user} onLogout={handleLogout} />}
      
      <div className={isAuthenticated ? 'pt-16' : ''}>
        <Routes>
          {/* Rutas públicas */}
          <Route 
            path="/login" 
            element={isAuthenticated ? <Navigate to="/" /> : <LoginPage onLogin={handleLogin} />} 
          />
          <Route 
            path="/registro" 
            element={isAuthenticated ? <Navigate to="/" /> : <RegisterPage onRegister={handleRegister} />} 
          />

          {/* Rutas protegidas */}
          <Route 
            path="/" 
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated}>
                <Dashboard user={user} />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/inversiones" 
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated}>
                <Inversiones />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/prestamos" 
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated}>
                <Prestamos />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/usuarios" 
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated}>
                <Usuarios />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/perfil" 
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated}>
                <Perfil user={user} />
              </ProtectedRoute>
            } 
          />

          {/* Ruta 404 */}
          <Route path="*" element={<Navigate to={isAuthenticated ? "/" : "/login"} />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
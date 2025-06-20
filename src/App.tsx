import './App.css';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Saidas from './pages/Saidas';
import Entradas from './pages/Entradas';
import Credores from './pages/Credores';
import { Login } from './pages/Login';
import { Cadastro } from './pages/CadastroUsu';
import RedefinirSenha from './pages/RedefinirSenha';

const isValidToken = (token: string) => {
  try {
    const decoded = JSON.parse(atob(token.split('.')[1])); 
    const expirationDate = decoded.exp * 1000; 
    return expirationDate > Date.now(); 
  } catch (error) {
    return false; 
  }
};

const PrivateRoute = ({ children }: { children: JSX.Element }) => {
  const token = localStorage.getItem("token");

  if (!token || !isValidToken(token)) {
    localStorage.removeItem("token"); 
    return <Navigate to="/auth" replace />;
  }

  return children;
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/auth" element={<Login />} />
        <Route path="/redefinir-senha" element={<RedefinirSenha />} />
        <Route path="/cadastro" element={<Cadastro />} />
        <Route path="/" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
        <Route path="/saidas" element={<PrivateRoute><Saidas /></PrivateRoute>} />
        <Route path="/entradas" element={<PrivateRoute><Entradas /></PrivateRoute>} />
        <Route path="/credores" element={<PrivateRoute><Credores /></PrivateRoute>} />
      </Routes>
    </Router>
  );
}

export default App;

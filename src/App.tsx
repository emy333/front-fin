
import './App.css'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Saidas from './pages/Saidas';
import Entradas from './pages/Entradas';
import Credores from './pages/Credores';

function App() {

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/saidas" element={<Saidas />} />
        <Route path="/entradas" element={<Entradas />} />
        <Route path="/credores" element={<Credores />} />
      </Routes>
    </Router>

  )
}

export default App

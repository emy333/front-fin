
import './App.css'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Saidas from './pages/Saidas';
import Entradas from './pages/Entradas';

function App() {

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/saidas" element={<Saidas />} />
        <Route path="/entradas" element={<Entradas />} />

      </Routes>
    </Router>

  )
}

export default App

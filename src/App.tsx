
import './App.css'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Saidas from './pages/Saidas';

function App() {

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/saidas" element={<Saidas />} />
      </Routes>
    </Router> 

  )
}

export default App

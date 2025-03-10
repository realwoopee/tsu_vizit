
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css'
import LoginPage from './pages/loginPage';
import RegistrationPage from './pages/registrationPage';

function App() {

  return (
     <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegistrationPage />} />
        <Route path="/" element={<LoginPage />} />
      </Routes>
    </Router>
  )
}

export default App

import './App.css'
import LoginPage from './pages/loginPage';
import RegistrationPage from './pages/registrationPage';
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom"
import reactLogo from "./assets/react.svg"
import viteLogo from "/vite.svg"
import "./App.css"
import TestPage from "./pages/pass-list"

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

/*
      <Routes>
        <Route path="/test" element={<TestPage />} />
        <Route
          path="/"
          element={
            <>
              <div>
                <a href="https://vite.dev" target="_blank" rel="noreferrer">
                  <img src={viteLogo || "/placeholder.svg"} className="logo" alt="Vite logo" />
                </a>
                <a href="https://react.dev" target="_blank" rel="noreferrer">
                  <img src={reactLogo || "/placeholder.svg"} className="logo react" alt="React logo" />
                </a>
              </div>
              <h1>Vite + React</h1>
              <div className="card">
                <button onClick={() => setCount((count) => count + 1)}>count is {count}</button>
                <p>
                  Edit <code>src/App.tsx</code> and save to test HMR
                </p>
              </div>
              <p className="read-the-docs">Click on the Vite and React logos to learn more</p>
              <div>
                <Link to="/test" className="nav-link">
                  Перейти к списку пропусков
                </Link>
              </div>
            </>
          }
        />
*/

export default App


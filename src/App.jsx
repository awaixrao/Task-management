
import './App.css'
import LoginPage from './pages/Login/LoginPage'
import { Routes,Route } from 'react-router-dom';
import SignupPage from './pages/Signup/SignupPage';
import DashboardPage from './pages/Home/HomePage';
import ProjectsPage from './pages/ProjectPage/ProjectPage.';


function App() {
 

  return (
    <>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/projects" element={<ProjectsPage />} />


      </Routes>
    </>

  )
}

export default App

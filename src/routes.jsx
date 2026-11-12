import { Routes, Route, Navigate } from "react-router-dom"
import StartPage from './pages/startPage'
import ArchivePage from './pages/archivePage'
import LoginPage from './pages/loginPage'
// import ContactPage from './pages/contactPage'
// import MessagePage from './pages/messagePage'
import NotFoundPage from './pages/notFoundPage'
// import { useState } from 'react';

export const AppRoutes = ({ isAuthenticated, setIsAuthenticated }) => {
//    const [indexMessage, setIndexMessage] = useState(null);
//    const [indexContact, setIndexContact] = useState([]);


  return (
    <Routes>
        <Route path="/login" element={!isAuthenticated ? <LoginPage setIsAuthenticated={setIsAuthenticated} /> : <Navigate to="/" replace />} />
        <Route path="/" element={isAuthenticated ? <StartPage /> : <Navigate to="/login" replace />} />
        <Route path="/archivePage" element={isAuthenticated ? <ArchivePage /> : <Navigate to="/login" replace />} />
        <Route path="*" element={<NotFoundPage />} />
    </Routes>
    
     )
     }

     export default AppRoutes;
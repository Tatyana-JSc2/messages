import { Routes, Route } from "react-router-dom"
import StartPage from './pages/startPage'
import ArchivePage from './pages/archivePage'
// import ContactPage from './pages/contactPage'
// import MessagePage from './pages/messagePage'
import NotFoundPage from './pages/notFoundPage'
// import { useState } from 'react';

export const AppRoutes = ()=> {
//    const [indexMessage, setIndexMessage] = useState(null);
//    const [indexContact, setIndexContact] = useState([]);


  return (
    <Routes>
        <Route path="/" element={<StartPage /*indexMessage={indexMessage} indexContact={indexContact} setIndexMessage={setIndexMessage} setIndexContact={setIndexContact}*/></StartPage>}/>
        <Route path="/archivePage" element={<ArchivePage></ArchivePage>}/>
        <Route path="*" element={<NotFoundPage></NotFoundPage>}/>
    </Routes>
    
     )
     }

     export default AppRoutes;
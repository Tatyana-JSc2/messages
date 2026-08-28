import { Routes, Route } from "react-router-dom"
import StartPage from './pages/startPage'
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
        {/* <Route path="/contactPage" element={<ContactPage setIndexContact={setIndexContact} ></ContactPage>}/>
        <Route path="/messagePage" element={<MessagePage setIndexMessage={setIndexMessage} ></MessagePage>}/> */}
        <Route path="*" element={<NotFoundPage></NotFoundPage>}/>
    </Routes>
    
     )
     }

     export default AppRoutes;
import './style.css'
import SmsPage from '../../components/smsPage';
import MessagePage from '../../components/messagePage';
import ContactPage from '../../components/contactPage';
import { useState } from 'react';
import { Link } from 'react-router-dom';

 

function StartPage() {
  const [indexMessage, setIndexMessage] = useState(null);
   const [indexContact, setIndexContact] = useState([]);
   const [selectedMessageText, setSelectedMessageText] = useState('');
   const [selectedPhone, setSelectedPhone] = useState('');
   const [activeComponent, setActiveComponent] = useState('sms');

  // const SameText = Messages.find(message => message.id === indexMessage)?.text;
  // const SamePhone = () => {
  //   const indexSet = new Set(indexContact);
  //   const matchedContacts = Contacts.filter(contact => indexSet.has(contact.id));
  //   const phonesArray = matchedContacts.map(contact => contact.phone);
  //   return phonesArray.join('; '); 

  // const [messageText, setMessageText] = useState(indexMessage? SameText:'');
  // const [phoneNumber, setPhoneNumber] = useState(indexContact? SamePhone():'');


  // const handleSendMessage = () => {
  //   if (!messageText || !phoneNumber) {
  //     alert('Заполните все поля!');
  //     return;
  //   }
  //   // console.log(`проверка id mess "${indexMessage}" проверка текст mess"${SameText}"`);
  //    console.log(`Отправка сообщения "${messageText}" на номер ${phoneNumber}`);
  //   // Здесь будет вызов API для отправки SMS
  //   alert('Сообщение отправлено!');
  //   setMessageText('');
  //   setPhoneNumber('');
  //   setIndexMessage('');
  //   setIndexContact('');
  // };


  return (
    <>
   
       <section className='section hover:bg-red-300 '>
        <header className='topbar'>
           <div className='topbarTitle'>
             <h2>SMS-сообщения</h2>
             <p>создание и отправка текстовых сообщений</p>
           </div>
        </header>
         <main className='main'>
           <div className={`mainWorkSpace ${activeComponent === 'sms' ? 'smsActive' : ''} ${activeComponent === 'message' ? 'messageActive' : ''} ${activeComponent === 'contact' ? 'contactActive' : ''}`}>
             <div className={`workspaceColumn ${activeComponent === 'sms' ? 'active' : ''}`} onClick={() => setActiveComponent('sms')}>
               <SmsPage indexMessage={indexMessage} indexContact={indexContact} setIndexMessage={setIndexMessage} setIndexContact={setIndexContact} selectedMessageText={selectedMessageText} selectedPhone={selectedPhone} isActive={activeComponent === 'sms'} setActiveComponent={setActiveComponent}></SmsPage>
             </div>
             <div className={`workspaceColumn ${activeComponent === 'message' ? 'active' : ''}`} onClick={() => setActiveComponent('message')}>
               <MessagePage setIndexMessage={setIndexMessage} setSelectedMessageText={setSelectedMessageText} setActiveComponent={setActiveComponent} isActive={activeComponent === 'message'}></MessagePage>
             </div>
             <div className={`workspaceColumn ${activeComponent === 'contact' ? 'active' : ''}`} onClick={() => setActiveComponent('contact')}>
               <ContactPage setIndexContact={setIndexContact} setSelectedPhone={setSelectedPhone} setActiveComponent={setActiveComponent} isActive={activeComponent === 'contact'}></ContactPage>
             </div>
           </div>
         </main>
          <Link to="/archivePage" className='archiveLink'>Архив отправленных сообщений</Link>
      </section>
      {/* <Link to="/archivePage" className='archiveLink'>Архив отправленных сообщений</Link> */}
    </>
  )
}

export default StartPage;

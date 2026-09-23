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


  const tabs = [
    { key: 'sms', label: 'Отправка SMS' },
    { key: 'message', label: 'Шаблоны сообщений' },
    { key: 'contact', label: 'Контакты' },
  ];

  return (
    <>
       <section className='section'>
        <header className='topbar'>
           <div className='topbarTitle'>
             <h2>SMS-сообщения</h2>
             <p>создание и отправка текстовых сообщений</p>
           </div>
        </header>
         <main className='main'>
           <div className="tabsHeader">
             {tabs.map((tab) => (
               <button
                 key={tab.key}
                 className={`tabButton ${activeComponent === tab.key ? 'active' : ''}`}
                 onClick={() => setActiveComponent(tab.key)}
               >
                 {tab.label}
               </button>
             ))}
           </div>
           <div className="tabContent">
             {activeComponent === 'sms' && (
               <SmsPage
                 indexMessage={indexMessage}
                 indexContact={indexContact}
                 setIndexMessage={setIndexMessage}
                 setIndexContact={setIndexContact}
                 selectedMessageText={selectedMessageText}
                 selectedPhone={selectedPhone}
                 isActive={true}
                 setActiveComponent={setActiveComponent}
               />
             )}
             {activeComponent === 'message' && (
               <MessagePage
                 setIndexMessage={setIndexMessage}
                 setSelectedMessageText={setSelectedMessageText}
                 setActiveComponent={setActiveComponent}
                 isActive={true}
               />
             )}
             {activeComponent === 'contact' && (
               <ContactPage
                 setIndexContact={setIndexContact}
                 setSelectedPhone={setSelectedPhone}
                 setActiveComponent={setActiveComponent}
                 isActive={true}
               />
             )}
           </div>
         </main>
         <Link to="/archivePage" className='archiveLink'>Архив отправленных сообщений</Link>
      </section>
    </>
  )
}

export default StartPage;

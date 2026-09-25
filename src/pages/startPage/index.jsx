import './style.css'
import SmsPage from '../../components/smsPage';
import MessagePage from '../../components/messagePage';
import ContactPage from '../../components/contactPage';
import GroupPage from '../../components/groupPage';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

// Заглушка API для групп
const mockGroups = [
  {
    id: '1',
    name: 'Семья',
    contacts: [
      { phone: '+79001111111', first_name: 'Иван', last_name: 'Иванов', middle_name: 'Петрович' },
      { phone: '+79002222222', first_name: 'Мария', last_name: 'Иванова', middle_name: 'Сергеевна' },
    ],
  },
  {
    id: '2',
    name: 'Работа',
    contacts: [
      { phone: '+79003333333', first_name: 'Алексей', last_name: 'Петров', middle_name: 'Иванович' },
    ],
  },
];

function getGroups() {
  return new Promise((resolve) => {
    setTimeout(() => resolve(mockGroups), 300);
  });
}

function addGroup(group) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ id: Date.now().toString(), name: group.name, contacts: [] });
    }, 300);
  });
}

function updateGroup(group) {
  return new Promise((resolve) => {
    setTimeout(() => resolve(group), 300);
  });
}

function deleteGroup(id) {
  return new Promise((resolve) => {
    setTimeout(() => resolve(id), 300);
  });
}

 

function StartPage() {
   const [indexMessage, setIndexMessage] = useState(null);
   const [indexContact, setIndexContact] = useState([]);
   const [selectedMessageText, setSelectedMessageText] = useState('');
   const [selectedPhone, setSelectedPhone] = useState('');
   const [activeComponent, setActiveComponent] = useState('sms');
   const [groupEditMode, setGroupEditMode] = useState(null); // null или id группы (для редактирования)
   const [addingToGroupId, setAddingToGroupId] = useState(null); // ID группы при добавлении контактов
   const [pendingGroupContacts, setPendingGroupContacts] = useState([]); // массив контактов, добавленных из contactPage
   const [groups, setGroups] = useState([]);
   const [groupsLoading, setGroupsLoading] = useState(true);

   useEffect(() => {
     let cancelled = false;
     getGroups()
       .then((data) => {
         if (!cancelled) setGroups(data);
       })
       .catch(() => {})
       .finally(() => {
         if (!cancelled) setGroupsLoading(false);
       });
     return () => { cancelled = true; };
   }, []);

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
    { key: 'group', label: 'Группы контактов' },
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
                   setSelectedPhone={setSelectedPhone}
                   setActiveComponent={setActiveComponent}
                   addingToGroupId={addingToGroupId}
                   setPendingGroupContacts={setPendingGroupContacts}
                   isActive={true}
                 />
               )}
               {activeComponent === 'group' && (
                 <GroupPage
                   groups={groups}
                   setGroups={setGroups}
                   groupsLoading={groupsLoading}
                   setSelectedPhone={setSelectedPhone}
                   setActiveComponent={setActiveComponent}
                   groupEditMode={groupEditMode}
                   setGroupEditMode={setGroupEditMode}
                   addingToGroupId={addingToGroupId}
                   pendingGroupContacts={pendingGroupContacts}
                   setPendingGroupContacts={setPendingGroupContacts}
                   setAddingToGroupId={setAddingToGroupId}
                   addGroup={addGroup}
                   updateGroup={updateGroup}
                   deleteGroup={deleteGroup}
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

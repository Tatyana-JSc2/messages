import './style.css'
import SmsPage from '../../components/smsPage';
import MessagePage from '../../components/messagePage';
import ContactPage from '../../components/contactPage';
import GroupPage from '../../components/groupPage';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getContacts, getGroups, addGroup as addGroupApi, updateGroup as updateGroupApi, deleteGroup as deleteGroupApi } from '../../api';

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
   const [contacts, setContacts] = useState([]);

   useEffect(() => {
     let cancelled = false;
     getGroups()
       .then((data) => {
         if (!cancelled) setGroups(data);
       })
       .catch((err) => {
         if (!cancelled) console.error('Ошибка при загрузке групп:', err);
       })
       .finally(() => {
         if (!cancelled) setGroupsLoading(false);
       });
       return () => { cancelled = true; };
     }, []);

   // Обёртки над реальным API
   const realAddGroup = async (group) => {
     return await addGroupApi({ name: group.name, contact_ids: [] });
   };

   const realUpdateGroup = async (group) => {
     return await updateGroupApi(group.id, { name: group.name, contact_ids: [] });
   };

   const realDeleteGroup = async (id) => {
     return await deleteGroupApi(id);
   };

   useEffect(() => {
      let cancelled = false;
      getContacts()
        .then((data) => {
          if (!cancelled) {
            const contacts = data.map((c, index) => {
              const phone = c.phones?.[0] || '';
              const parts = (c.name || '').split(' ').filter(Boolean);
              const [first_name, middle_name, ...rest] = parts;
              const last_name = rest.join(' ') || '';
              return {
                phone,
                first_name: first_name || '',
                last_name,
                middle_name: middle_name || '',
                id: `${phone}-${index}`,
                active: false,
              };
            });
            setContacts(contacts);
          }
        })
        .catch(() => {})
        .finally(() => {});
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
                    groupContacts={pendingGroupContacts}
                    setGroupContacts={setPendingGroupContacts}
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
                    addGroup={realAddGroup}
                    updateGroup={realUpdateGroup}
                    deleteGroup={realDeleteGroup}
                    contacts={contacts}
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

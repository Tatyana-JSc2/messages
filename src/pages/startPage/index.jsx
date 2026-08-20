 import './style.css'
 import Navigation from '../../components/navigation';
 import { Link } from 'react-router-dom';
 import { useState } from 'react';
 import Messages from '../../dataMessages';
 import Contacts from '../../dataContacts';
 

function StartPage({indexMessage, indexContact, setIndexMessage, setIndexContact }) {
  const SameText = Messages.find(message => message.id === indexMessage)?.text;
  const SamePhone = () => {
    const indexSet = new Set(indexContact);
    const matchedContacts = Contacts.filter(contact => indexSet.has(contact.id));
    const phonesArray = matchedContacts.map(contact => contact.phone);
    return phonesArray.join('; '); 
}
  const [messageText, setMessageText] = useState(indexMessage? SameText:'');
  const [phoneNumber, setPhoneNumber] = useState(indexContact? SamePhone():'');


  const handleSendMessage = () => {
    if (!messageText || !phoneNumber) {
      alert('Заполните все поля!');
      return;
    }
    // console.log(`проверка id mess "${indexMessage}" проверка текст mess"${SameText}"`);
     console.log(`Отправка сообщения "${messageText}" на номер ${phoneNumber}`);
    // Здесь будет вызов API для отправки SMS
    alert('Сообщение отправлено!');
    setMessageText('');
    setPhoneNumber('');
    setIndexMessage('');
    setIndexContact('');
  };


  return (
    <>
   
      <section id="center">
        <div id="mainBlock" className='mainBlock'>
          <h2>Создание и отправка SMS-сообщений</h2>
      
      <div className="formGroup">
        
        <textarea
        
          className="formGroupInput"
          type="text"
          value={ messageText}
          onChange={(e)=>setMessageText(e.target.value)}         
          placeholder="Введите текст сообщения..."
        />
        <ul>
            <li >
              <Link className="formGroupLink" to="/messagePage"> 
               Выбрать шаблонный текст
              </Link>
            </li>
        </ul>
        
      </div>

      <div className="formGroup">
        
        <textarea
          className="formGroupInput"
          type="tel"
          value={phoneNumber}
          onChange={(e)=>setPhoneNumber(e.target.value)}
          placeholder="+7XXXXXXXXXX"
        />
        <ul>
            <li >
              <Link className="formGroupLink" to="/contactPage"> 
               Выбрать адресата из списка
              </Link>
            </li>
        </ul>
        
      </div>

          
        </div>
        <button
          type="button"
          className="counter"
          onClick={() => handleSendMessage()}
        >Отправить сообщение
        </button>
      </section>

     

      <Navigation></Navigation>
    </>
  )
     }
export default StartPage;

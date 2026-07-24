 import './style.css'
 import Navigation from '../../components/navigation';
 import { Link } from 'react-router-dom';
 import { useState } from 'react';
 import Messages from '../../dataMessages';
 import Contacts from '../../dataContacts';
 

function StartPage({indexMessage, indexContact}) {
  const SameText = Messages.find(message => message.id === indexMessage)?.text;
  const SamePhone = Contacts.find(contact => contact.id === indexContact)?.phone;
  const [messageText, setMessageText] = useState(indexMessage? SameText:'');
  const [phoneNumber, setPhoneNumber] = useState(indexContact? SamePhone:'');

  

  const handleSendMessage = () => {
    if (!messageText || !phoneNumber) {
      alert('Заполните все поля!');
      return;
    }
    console.log(`проверка "${indexMessage}" проверка "${SameText}"`);
    console.log(`Отправка сообщения "${messageText}" на номер ${phoneNumber}`);
    // Здесь будет вызов API для отправки SMS
    alert('Сообщение отправлено!');
    setMessageText('');
    setPhoneNumber('');
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
          // onChange={ChangeText}
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

import './style.css'
import { useState, useEffect, useRef } from 'react';
import Contacts from '../../dataContacts';

const STORAGE_KEY = 'sentMessages';

function getSentMessages() {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

function saveSentMessage(message) {
  const messages = getSentMessages();
  messages.push(message);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
}

function parsePhoneNumbers(phoneString) {
  return phoneString.split(';').map(p => p.trim()).filter(p => p.length > 0);
}

function findContactNames(phones) {
  const names = [];
  phones.forEach(phone => {
    const contact = Contacts.find(c => c.phone === phone);
    if (contact) {
      names.push(contact.name);
    } else {
      names.push('Неизвестный');
    }
  });
  return names;
}

function SmsPage({setIndexMessage, setIndexContact, selectedMessageText, selectedPhone, isActive, setActiveComponent }) {
  const [messageText, setMessageText] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const prevSelectedTextRef = useRef(null);
  const prevSelectedPhoneRef = useRef(null);

  useEffect(() => {
    if (selectedMessageText !== prevSelectedTextRef.current) {
      setMessageText(selectedMessageText);
      prevSelectedTextRef.current = selectedMessageText;
    }
  }, [selectedMessageText]);

  useEffect(() => {
    if (selectedPhone !== prevSelectedPhoneRef.current) {
      setPhoneNumber(selectedPhone);
      prevSelectedPhoneRef.current = selectedPhone;
    }
  }, [selectedPhone]);

  const handleSendMessage = () => {
    if (!messageText || !phoneNumber) {
      alert('Заполните все поля!');
      return;
    }

    const phones = parsePhoneNumbers(phoneNumber);
    const contactNames = findContactNames(phones);
    const now = new Date();
    const dateStr = now.toLocaleDateString('ru-RU');
    const timeStr = now.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });

    const sentMessage = {
      text: messageText,
      phones: phones,
      contactNames: contactNames,
      date: dateStr,
      time: timeStr,
      timestamp: now.getTime()
    };

    saveSentMessage(sentMessage);
    console.log('Отправленное сообщение:', sentMessage);

    alert('Сообщение отправлено!');
    setMessageText('');
    setPhoneNumber('');
    setIndexMessage('');
    setIndexContact('');
  };

  return (
    <>
      <section className="smsCenter">
        <h2>Создание и отправка SMS-сообщений</h2>
        {isActive && (
          <>
            <div id="mainBlock" className='mainBlock'>
              <div className="formGroup">
                <textarea
                  className="formGroupInput"
                  type="text"
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  placeholder="Введите текст сообщения..."
                />
                <ul>
                  <li>
                    <span
                      className="formGroupLink"
                      onClick={(e) => { e.stopPropagation(); setActiveComponent('message'); }}
                      style={{ cursor: 'pointer' }}
                    >
                      Выбрать шаблонный текст
                    </span>
                  </li>
                </ul>
              </div>

              <div className="formGroup">
                <textarea
                  className="formGroupInput"
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="+7XXXXXXXXXX"
                />
                <ul>
                  <li>
                    <span
                      className="formGroupLink"
                      onClick={(e) => { e.stopPropagation(); setActiveComponent('contact'); }}
                      style={{ cursor: 'pointer' }}
                    >
                      Выбрать адресата из списка
                    </span>
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
          </>
        )}
      </section>

    </>
  )
}

export default SmsPage;

import { useState } from 'react';
import './style.css';
import { Link } from 'react-router-dom';

const STORAGE_KEY = 'sentMessages';

function getSentMessages() {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

function saveSentMessages(messages) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
}

function ArchivePage() {
  const [messages, setMessages] = useState(getSentMessages);

  const handleDelete = (index) => {
    const updated = messages.filter((_, i) => i !== index);
    setMessages(updated);
    saveSentMessages(updated);
  };

  return (
    <>
      <section className='archiveSection'>
        <div className='archiveContent'>
        <h2>Архив отправленных сообщений</h2>
        
        {messages.length === 0 ? (
          <p className='emptyMessage'>Архив пуст</p>
        ) : (
          <div className='archiveTableWrapper'>
            <table className='archiveTable'>
              <thead>
                <tr>
                  <th>№</th>
                  <th>Текст сообщения</th>
                  <th>Номера телефонов</th>
                  <th>Имена контактов</th>
                  <th>Дата</th>
                  <th>Время</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {messages.map((msg, index) => (
                  <tr key={msg.timestamp || index}>
                    <td>{index + 1}</td>
                    <td>{msg.text}</td>
                    <td>{msg.phones.join('; ')}</td>
                    <td>{msg.contactNames.join('; ')}</td>
                    <td>{msg.date}</td>
                    <td>{msg.time}</td>
                    <td>
                      <button className='deleteButton' onClick={() => handleDelete(index)}>✕</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
     <div className='backLinkContainer'><br/>
        <Link to="/" className='backLink'>Главная страница</Link>
        </div>
      </section>
      
    </>
  );
}

export default ArchivePage;

import './style.css'
import Contacts from '../../dataContacts';
import { Link } from 'react-router-dom';
import { useState } from 'react';

function ContactPage({ /*setIndexContact,*/ setSelectedPhone, setActiveComponent, isActive }) {
  const [items, setItems] = useState(Contacts);

  const changeItemActive = (id) => {
    setItems(prevItems =>
      prevItems.map((item) => {
        if (item.id === id) {
          return { ...item, active: !item.active };
        }
        return item;
      })
    );
  };

  const handleAddContacts = () => {
    const activeItems = items.filter(item => item.active);
    const phonesArray = activeItems.map(item => item.phone);
    const phones = phonesArray.join('; ');
    setSelectedPhone(phones);
    setItems(prevItems =>
      prevItems.map(item => ({ ...item, active: false }))
    );
    setActiveComponent('sms');
  };

  return (
    <>
      <section className="contactCenter" onClick={(e) => e.stopPropagation()}>
        <h2>Список контактов</h2>
        {isActive && (
          <>
            <div id="contactMainBlock" className='contactMainBlock'>
              <ul>
                {items.map((item) => (
                  <li className='contactLi'
                    style={{backgroundColor: item.active ? 'rgb(98, 111, 110)' : '', color: item.active ? '#fea8a2' : ''}}
                    key={item.id}
                    onClick={() => changeItemActive(item.id)}
                  >
                    {item.name} {item.phone}
                  </li>
                ))}
              </ul>
            </div>
            <Link to="/"
              type="button"
              className="button"
              onClick={(e) => {
                e.stopPropagation();
                handleAddContacts();
              }}
            >
              Добавить выбранный контакт
            </Link>
          </>
        )}
      </section>
    </>
  );
}

export default ContactPage;

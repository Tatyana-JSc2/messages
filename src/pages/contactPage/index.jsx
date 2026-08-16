import './style.css'
import Navigation from '../../components/navigation';
import Contacts from '../../dataContacts';
import { Link } from 'react-router-dom';
import { useState } from 'react';


function ContactPage({setIndexContact}) {
  const [idChange, setIDChange] = useState(null);

  const handleChangeContact = () => {
    
    // console.log(`id cont изменен на "${idChange}" `);
     setIndexContact(idChange);
     
    
  };

  return (
    <>
     <section id="center">
        <div id="contactMainBlock" className='contactMainBlock'>
          <h2>Список контактов</h2>
          {Contacts.map((contact) => (
        <li className='contactLi'
        style={{backgroundColor: contact.id===idChange? ` rgb(98, 111, 110)` : '', color: contact.id===idChange? ` #fea8a2` : ''}} 
        key={contact.id} 
        onClick={() => setIDChange(contact.id)} >
          {contact.name}    {contact.phone}
        </li>
      ))}
    
    </div>
    <Link to="/"
          type="button"
          className="button"
          onClick={() => handleChangeContact()}>            
               Добавить выбранный контакт
              </Link>
    </section>
    <Navigation></Navigation>
    </>
     )
     }
export default ContactPage;
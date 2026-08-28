import './style.css'
// import Navigation from '../navigation';
import Contacts from '../../dataContacts';
import { Link } from 'react-router-dom';
import { useState} from 'react';


function ContactPage({setIndexContact}) {
 
 const [items, setItems] = useState(Contacts);
  

  const handleChangeContact = () => {
    // console.log(`id cont изменен на "${idChange}" `);  
    const contactListId = items.filter(item => item.active).map(el => el.id);
    console.log(contactListId);   
     setIndexContact(contactListId);   
  };
 

  const changeItemActive = (id) => {    
    setItems (prevItems => 
      prevItems.map((item) => {
  // Если находим нужного пользователя, возвращаем новый объект с изменениями
     if (item.id === id) {       
      return { ...item, active: !item.active }; 
    }
  // Для остальных просто возвращаем оригинальный объект
    return item;  
    })
    )
  }

return (
    <>
     <section id="center">
        <div id="contactMainBlock" className='contactMainBlock'>
          <h2>Список контактов</h2>
          <ul>
          {items.map((item) => (
        <li className='contactLi'
        style={{backgroundColor: item.active? ` rgb(98, 111, 110)` : '', color: item.active? ` #fea8a2` : ''}} 
        key={item.id} 
        onClick={() =>changeItemActive(item.id)} >
          {item.name}    {item.phone}
        </li>
        
      ))}
      </ul>
    
    </div>
    <Link to="/"
          type="button"
          className="button"
          onClick={() => handleChangeContact()}>            
               Добавить выбранный контакт
              </Link>
    </section>
    {/* <Navigation></Navigation> */}
    </>
     )
     }
export default ContactPage;
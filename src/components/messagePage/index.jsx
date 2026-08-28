import './style.css'
// import Navigation from '../navigation';
import Messages from '../../dataMessages';
import { useState } from 'react';
import { Link } from 'react-router-dom';

function MessagePage({setIndexMessage}) {
  const [idChange, setIDChange] = useState(null);
 


const handleChangeMessage = () => {
    
    // console.log(`id mess изменен на "${idChange}" `);
     setIndexMessage(idChange);
     
    
  };


  return (
    <>
     <section id="center">
        <div id="messageMainBlock" className='messageMainBlock'>
          <h2>Шаблоны текстовых сообщений</h2>
          <ul>           
            {Messages.map((message) => (
                // Важно: каждый элемент в цикле должен иметь уникальный ключ \`key\`
                <li /*className='messageLi'*/
                style={{backgroundColor: message.id===idChange? ` rgb(98, 111, 110)` : '', color: message.id===idChange? ` #fea8a2` : ''}} 
                key={message.id} 
                onClick={() => {setIDChange(message.id)}} >{message.text}</li>
            ))}
        </ul>
    
    </div>
    <Link to="/"
          type="button"
          className="button"
          onClick={() => handleChangeMessage()}>            
               Добавить выбранный текст
              </Link>
    
    </section>
    {/* <Navigation></Navigation> */}
    </>
     )
     }
export default MessagePage;
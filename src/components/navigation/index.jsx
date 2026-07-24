import { Link } from "react-router-dom";

function Navigation() {
  // Компонент возвращает JSX, который представляет собой HTML-разметку
   return (
    <>
    

     

      <section id="next-steps">
        <div >         
          <ul>
            <li>
              <Link to="/">            
               Главная
              </Link>
            </li>
            <li>
              <Link to="/messagePage"> 
                Шаблоны сообщений             
              </Link>
            </li>
            <li>
              <Link to="/contactPage">            
                Список контактов
              </Link>
            </li>
            {/* <li>
              <a href="https://bsky.app/profile/vite.dev" target="_blank">
                Архив сообщений
              </a>
            </li> */}
          </ul>
        </div>
      </section>    
    </>
  )
}



// Экспорт компонента, чтобы его можно было использовать в других частях приложения
export default Navigation;
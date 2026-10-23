import './style.css';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { registerApi } from '../../api';

function RegisterPage() {
  const [name, setName] = useState('');
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async () => {
    if (!name.trim() || !login.trim() || !password.trim()) {
      alert('Заполните все поля!');
      return;
    }
    try {
      const result = await registerApi(name, login, password);
      if (result.success) {
        alert('Регистрация успешна! Теперь вы можете войти.');
        navigate('/login');
      }
    } catch (err) {
      if (err.status === 409) {
        alert('Пользователь с таким логином уже существует!');
      } else {
        alert('Ошибка регистрации. Попробуйте позже.');
      }
    }
  };

  return (
    <section className="registerSection">
      <div className="registerCard">
        {/* Левая панель — декоративная */}
        <div className="registerLeft">
          <div className="registerLeftContent">
            <div>
              <div className="registerLogo">
                <div className="registerLogoIcon">
                  <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M13 2L3 14h8l-1 8 10-12h-8l1-8z"/>
                  </svg>
                </div>
                <div className="registerLogoText">
                  <h1>АО «ЛОЭСК»</h1>
                  <p>Лаунчер</p>
                </div>
              </div>
              <h2>Регистрация</h2>
            </div>

            <div className="registerSupport">
              <i className="fas fa-headset"></i>
              <div>
                <p>Нужна помощь?</p>
                <p>Обратитесь в службу поддержки</p>
              </div>
            </div>
          </div>
        </div>

        {/* Правая панель — форма */}
        <div className="registerRight">
          <div className="registerRightInner">
            {/* Мобильный заголовок */}
            <div className="registerMobileHeader">
              <div className="registerMobileLogo">
                <div className="registerMobileLogoIcon">
                  <i className="fas fa-bolt"></i>
                </div>
                <div className="registerMobileLogoText">
                  <h1>АО «ЛОЭСК»</h1>
                  <p>Лаунчер</p>
                </div>
              </div>
            </div>

            <div className="registerFormHeader">
              <h1>Регистрация</h1>
              <p>Заполните данные для создания аккаунта</p>
            </div>

            <div>
              {/* Имя */}
              <div className="formGroup">
                <label htmlFor="name">Имя</label>
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Введите ваше имя"
                />
              </div>

              {/* Логин */}
              <div className="formGroup">
                <label htmlFor="registerLogin">Логин</label>
                <input
                  id="registerLogin"
                  type="text"
                  value={login}
                  onChange={(e) => setLogin(e.target.value)}
                  placeholder="Введите логин"
                />
              </div>

              {/* Пароль */}
              <div className="formGroup">
                <label htmlFor="registerPassword">Пароль</label>
                <div className="passwordWrapper">
                  <input
                    id="registerPassword"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Введите пароль"
                  />
                  <button
                    type="button"
                    className="passwordToggle"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label="Показать пароль"
                  >
                    <i className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                  </button>
                </div>
              </div>

              {/* Кнопка регистрации */}
              <div className="registerSubmit">
                <button onClick={handleRegister}>
                  <i className="fas fa-user-plus"></i>
                  Зарегистрироваться
                </button>
              </div>

              {/* Ссылка на вход */}
              <div className="loginLink">
                <p>Уже есть учетная запись?</p>
                <p onClick={() => navigate('/login')}>Войти</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default RegisterPage;

import './style.css';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginApi } from '../../api';

function LoginPage({ setIsAuthenticated }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const result = await loginApi(username, password);
      if (result.id) {
        setIsAuthenticated(true);
        navigate('/');
      }
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <section className="loginSection">
      <div className="loginCard">
        {/* Левая панель — декоративная */}
        <div className="loginLeft">
          <div className="loginLeftContent">
            <div>
              <div className="loginLogo">
                <div className="loginLogoIcon">
                  <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M13 2L3 14h8l-1 8 10-12h-8l1-8z"/>
                  </svg>
                </div>
                <div className="loginLogoText">
                  <h1>АО «ЛОЭСК»</h1>
                  <p>Лаунчер</p>
                </div>
              </div>
              <h2>С возвращением!</h2>
            </div>

            <div className="loginSupport">
              <i className="fas fa-headset"></i>
              <div>
                <p>Нужна помощь?</p>
                <p>Обратитесь в службу поддержки</p>
              </div>
            </div>
          </div>
        </div>

        {/* Правая панель — форма */}
        <div className="loginRight">
          <div className="loginRightInner">
            {/* Мобильный заголовок */}
            <div className="loginMobileHeader">
              <div className="loginMobileLogo">
                <div className="loginMobileLogoIcon">
                  <i className="fas fa-bolt"></i>
                </div>
                <div className="loginMobileLogoText">
                  <h1>АО «ЛОЭСК»</h1>
                  <p>Лаунчер</p>
                </div>
              </div>
            </div>

            <div className="loginFormHeader">
              <h1>Вход</h1>
              <p>Введите ваши учетные данные</p>
            </div>

            <div>
              {/* Логин */}
              <div className="formGroup">
                <label htmlFor="username">Логин</label>
                <input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Введите логин"
                />
              </div>

              {/* Пароль */}
              <div className="formGroup">
                <label htmlFor="password">Пароль</label>
                <div className="passwordWrapper">
                  <input
                    id="password"
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

              {/* Кнопка входа */}
              <div className="loginSubmit">
                <button onClick={handleLogin}>
                  <i className="fas fa-sign-in-alt"></i>
                  Войти в систему
                </button>
              </div>


            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default LoginPage;

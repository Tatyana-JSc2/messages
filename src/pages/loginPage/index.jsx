import './style.css';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginApi } from '../../api';

function LoginPage({ setIsAuthenticated }) {
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const result = await loginApi(login, password);
      if (result.success) {
        setIsAuthenticated(true);
        navigate('/');
      }
    } catch (err) {
      alert('Введен неверный логин или пароль!');
    }
  };

  return (
    <section className="loginSection">
      <h2>Создание и отправка SMS-сообщений</h2>
      <div className="loginCard">
        <h2 className="LoginHeader">Вход в приложение</h2>
        <div className="loginField">
           <label htmlFor="login">Логин: </label>
          <input
            id="login"
            type="text"
            className="loginInput"
            value={login}
            onChange={(e) => setLogin(e.target.value)}
            placeholder="Введите логин: сац"
          />
        </div>
        <div className="loginField">
          <label htmlFor="password">Пароль: </label>
          <input
            id="password"
            type="password"
            className="loginInput"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Введите пароль: 1234"
          />
        </div>
        <div className="loginButtons">
          <button
            type="button"
            className="loginButton"
            onClick={handleLogin}
          >
            Войти
          </button>
          <button
            type="button"
            className="loginButton"
            onClick={() => navigate('/register')}
          >
            Зарегистрироваться
          </button>
        </div>
      </div>
    </section>
  );
}

export default LoginPage;

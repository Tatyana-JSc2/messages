import './style.css';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { registerApi } from '../../api';

function RegisterPage() {
  const [name, setName] = useState('');
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
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
    <section className="loginSection">
      <h2>Регистрация в приложении</h2>
      <div className="loginCard">
        <h2 className="LoginHeader">Создание аккаунта</h2>
        <div className="loginField">
          <label htmlFor="name">Имя: </label>
          <input
            id="name"
            type="text"
            className="loginInput"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Введите ваше имя"
          />
        </div>
        <div className="loginField">
          <label htmlFor="registerLogin">Логин: </label>
          <input
            id="registerLogin"
            type="text"
            className="loginInput"
            value={login}
            onChange={(e) => setLogin(e.target.value)}
            placeholder="Введите логин"
          />
        </div>
        <div className="loginField">
          <label htmlFor="registerPassword">Пароль: </label>
          <input
            id="registerPassword"
            type="password"
            className="loginInput"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Введите пароль"
          />
        </div>
        <div className="loginButtons">
          <button
            type="button"
            className="loginButton"
            onClick={handleRegister}
          >
            Зарегистрироваться
          </button>
          <button
            type="button"
            className="loginButton"
            onClick={() => navigate('/login')}
          >
            Войти
          </button>
        </div>
      </div>
    </section>
  );
}

export default RegisterPage;

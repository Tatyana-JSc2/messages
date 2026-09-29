const API_URL = '/api/v1/notifications/sms'

// --- Auth stubs (заглушки до подключения реального бэкенда) ---

const registeredUsers = [];

export async function loginApi(login, password) {
  // Заглушка: проверяем по хардкод-учётке или по зарегистрированным
  if (login === 'сац' && password === '1234') {
    return { success: true, user: { name: 'Disp_ca', login } };
  }
  const found = registeredUsers.find(
    (u) => u.login === login && u.password === password
  );
  if (found) {
    return { success: true, user: { name: found.name, login: found.login } };
  }
  const error = new Error('Неверный логин или пароль');
  error.status = 401;
  throw error;
}

export async function registerApi(name, login, password) {
  // Заглушка: сохраняем в локальный массив
  const exists = registeredUsers.some((u) => u.login === login);
  if (exists) {
    const error = new Error('Пользователь с таким логином уже существует');
    error.status = 409;
    throw error;
  }
  registeredUsers.push({ name, login, password });
  return { success: true, user: { name, login } };
}

export async function sendSms(phones, message) {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ phones, message }),
  });

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }

  return response.json();
}

export async function getContacts() {
  const response = await fetch(`/api/v1/notifications/sms/contacts`);
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }
  return response.json();
}

export async function addContact(contact) {
  const response = await fetch(`${API_URL}/contacts`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify([contact]),
  });
  if (!response.ok) {
    const text = await response.text();
    console.error('addContact error:', response.status, text);
    throw new Error(`HTTP ${response.status}: ${text}`);
  }
  return response.json();
}

export async function deleteContact(phone) {
  const response = await fetch(`${API_URL}/contacts`, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ phone }),
  });
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }
  return response.json();
}

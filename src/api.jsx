const API_URL = '/api/v1';

// --- Auth ---

export async function loginApi(login, password) {
  const body = JSON.stringify({ login, pass: password });
  const response = await fetch(`${API_URL}/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-app': 'sms_sac',
    },
    body,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.err_msg || `HTTP ${response.status}`);
  }

  return await response.json();
}

  
export async function registerApi(name, login, password) {
  const body = JSON.stringify({
    login,
    pass: password,
    first_name: name,
    surname: '',
    middle_name: '',
    fil: '',
    email: '',
  });
  const response = await fetch(`${API_URL}/registration`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-app': 'sms_sac',
    },
    body,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.err_msg || `HTTP ${response.status}`);
  }

  return await response.json();
}

export async function logoutApi() {
  const response = await fetch(`${API_URL}/logout`, {
    method: 'GET',
    headers: { 'x-app': 'sms_sac' },
  });
  return response.ok;
}

export async function getCurrentUser() {
  const response = await fetch(`${API_URL}/cur_user`, {
    method: 'GET',
    headers: { 'x-app': 'sms_sac' },
  });
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }
  return response.json();
}

// --- SMS ---

export async function sendSms(phones, text, contactIds = [], groupIds = []) {
  const response = await fetch(`${API_URL}/sms_sac/sms`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-app': 'sms_sac',
    },
    body: JSON.stringify({
      text,
      contact_ids: contactIds,
      group_ids: groupIds,
      phones: Array.isArray(phones) ? phones : [phones],
    }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.err_msg || `HTTP ${response.status}`);
  }

  return await response.json();
}

// --- Contacts ---

export async function getContacts() {
  const response = await fetch(`${API_URL}/sms_sac/contacts`, {
    headers: { 'x-app': 'sms_sac' },
  });
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }
  return response.json();
}

export async function addContact(contact) {
  const rawPhones = contact.phones || contact.phone || '';
  const phones = Array.isArray(rawPhones)
    ? rawPhones.filter(p => p && p.trim())
    : rawPhones && rawPhones.trim() ? [rawPhones.trim()] : [];
  const response = await fetch(`${API_URL}/sms_sac/contacts`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-app': 'sms_sac',
    },
    body: JSON.stringify({
      name: contact.name,
      phones,
    }),
  });
  if (!response.ok) {
    const text = await response.text();
    console.error('addContact error:', response.status, text);
    throw new Error(`HTTP ${response.status}: ${text}`);
  }
  return response.json();
}

export async function updateContact(id, contact) {
  const rawPhones = contact.phones || contact.phone || '';
  const phones = Array.isArray(rawPhones)
    ? rawPhones.filter(p => p && p.trim())
    : rawPhones && rawPhones.trim() ? [rawPhones.trim()] : [];
  const response = await fetch(`${API_URL}/sms_sac/contacts/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'x-app': 'sms_sac',
    },
    body: JSON.stringify({
      name: contact.name,
      phones,
    }),
  });
  if (!response.ok) {
    const text = await response.text();
    throw new Error(`HTTP ${response.status}: ${text}`);
  }
  return response.json();
}

export async function deleteContact(id) {
  const response = await fetch(`${API_URL}/sms_sac/contacts/${id}`, {
    method: 'DELETE',
    headers: { 'x-app': 'sms_sac' },
  });
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }
  return response.json();
}

// --- Contact Groups ---

export async function getGroups() {
  const response = await fetch(`${API_URL}/sms_sac/contact_groups`, {
    headers: { 'x-app': 'sms_sac' },
  });
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }
  return response.json();
}

export async function addGroup(group) {
  const response = await fetch(`${API_URL}/sms_sac/contact_groups`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-app': 'sms_sac',
    },
    body: JSON.stringify({
      name: group.name,
      contact_ids: group.contact_ids || [],
    }),
  });
  if (!response.ok) {
    const text = await response.text();
    throw new Error(`HTTP ${response.status}: ${text}`);
  }
  return response.json();
}

export async function updateGroup(id, group) {
  const response = await fetch(`${API_URL}/sms_sac/contact_groups/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'x-app': 'sms_sac',
    },
    body: JSON.stringify({
      name: group.name,
      contact_ids: group.contact_ids || [],
    }),
  });
  if (!response.ok) {
    const text = await response.text();
    throw new Error(`HTTP ${response.status}: ${text}`);
  }
  return response.json();
}

export async function deleteGroup(id) {
  const response = await fetch(`${API_URL}/sms_sac/contact_groups/${id}`, {
    method: 'DELETE',
    headers: { 'x-app': 'sms_sac' },
  });
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }
  return response.json();
}

// --- Archive ---

export async function saveArchive(message) {
  const response = await fetch(`${API_URL}/sms_sac/archive`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-app': 'sms_sac',
    },
    body: JSON.stringify({
      text: message.text,
      phones: message.phones,
      contact_names: message.contactNames,
      date: message.date,
      time: message.time,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.err_msg || `HTTP ${response.status}`);
  }

  return await response.json();
}

export async function getArchive({ limit = 50, offset = 0, dateFrom, dateTo } = {}) {
  const params = new URLSearchParams({
    limit: String(limit),
    offset: String(offset),
  });

  if (dateFrom) params.set('date_from', dateFrom);
  if (dateTo) params.set('date_to', dateTo);

  const response = await fetch(`${API_URL}/sms_sac/archive?${params}`, {
    method: 'GET',
    headers: { 'x-app': 'sms_sac' },
  });

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }

  return response.json();
}

const API_URL = '/api/v1/notifications/sms'

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

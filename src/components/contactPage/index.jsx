import './style.css'
// import Contacts from '../../dataContacts';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { getContacts, addContact } from '../../api';

function buildDisplayName(contact) {
  const parts = [contact.last_name, contact.first_name, contact.middle_name].filter(Boolean);
  return parts.length > 0 ? parts.join(' ') : contact.phone;
}

function ContactPage({ /*setIndexContact,*/ setSelectedPhone, setActiveComponent, isActive }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingPhone, setEditingPhone] = useState(null);
  const [editForm, setEditForm] = useState({ phone: '', first_name: '', last_name: '', middle_name: '' });
  const [newContact, setNewContact] = useState({ phone: '', first_name: '', last_name: '', middle_name: '' });
  const [showAddForm, setShowAddForm] = useState(false);
  const [title, setTitle] = useState('Список контактов');

  useEffect(() => {
    let cancelled = false;
    
    getContacts()
      .then((data) => {
        if (!cancelled) {
          const contacts = data.map((c, index) => {
            const phone = c.phones?.[0] || '';
            const parts = (c.name || '').split(' ').filter(Boolean);
            const [first_name, middle_name, ...rest] = parts;
            const last_name = rest.join(' ') || '';
            return {
              phone,
              first_name: first_name || '',
              last_name,
              middle_name: middle_name || '',
              id: `${phone}-${index}`,
              active: false,
            };
          });
          setItems(contacts);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err.message);
        }
      })
      .finally(() => {
        if (!cancelled) {
          setLoading(false);
        }
      });
      
    return () => { cancelled = true; };
  }, []);

  const changeItemActive = (id) => {
    setItems(prevItems =>
      prevItems.map((item) => {
        if (item.id === id) {
          return { ...item, active: !item.active };
        }
        return item;
      })
    );
  };

  const handleAddContacts = () => {
    const activeItems = items.filter(item => item.active);
    const phonesArray = activeItems.map(item => item.phone);
    const phones = phonesArray.join('; ');
    setSelectedPhone(phones);
    setItems(prevItems =>
      prevItems.map(item => ({ ...item, active: false }))
    );
    setActiveComponent('sms');
  };

  const handleStartEdit = (contact) => {
    setEditingPhone(contact.phone);
    setEditForm({
      phone: contact.phone,
      first_name: contact.first_name || '',
      last_name: contact.last_name || '',
      middle_name: contact.middle_name || '',
    });
  };

  const handleSaveEdit = async () => {
    if (!editForm.phone.trim()) return;
    try {
      const updated = {
        phone: editForm.phone,
        first_name: editForm.first_name || null,
        last_name: editForm.last_name || null,
        middle_name: editForm.middle_name || null,
      };
      const results = await addContact(updated);
      if (results.length === 0) {
        alert('Контакт не обновлен: проверьте данные');
        return;
      }
      const created = results[0];
      const parts = (created.name || '').split(' ').filter(Boolean);
      const [first_name, middle_name, ...rest] = parts;
      const last_name = rest.join(' ') || '';
      setItems(prev =>
        prev.map(item =>
          item.phone === editForm.phone
            ? { ...item, phone: created.phone, first_name, last_name, middle_name: middle_name || '', id: created.phone, active: item.active }
            : item
        )
      );
      setEditingPhone(null);
      setEditForm({ phone: '', first_name: '', last_name: '', middle_name: '' });
    } catch (err) {
      console.error('Ошибка при обновлении контакта:', err);
      if (err.message.includes('500')) {
        alert('Сервер временно недоступен. Попробуйте ещё раз.');
      } else {
        alert(`Ошибка при обновлении контакта: ${err.message}`);
      }
    }
  };

  const handleCancelEdit = () => {
    setEditingPhone(null);
    setEditForm({ phone: '', first_name: '', last_name: '', middle_name: '' });
  };

  const handleDeleteContact = async (phone) => {
    try {
      const contact = { phone };
      const results = await addContact(contact);
      if (results.length === 0) {
        setItems(prev => prev.filter(item => item.phone !== phone));
      } else {
        alert('Контакт не удален: у контакта должны быть пустые поля имени');
      }
    } catch (err) {
      console.error('Ошибка при удалении контакта:', err);
      if (err.message.includes('500')) {
        alert('Сервер временно недоступен. Попробуйте ещё раз.');
      } else {
        alert(`Ошибка при удалении контакта: ${err.message}`);
      }
    }
  };

  const setEditField = (field, value) => {
    setEditForm(prev => ({ ...prev, [field]: value }));
  };

  const setNewField = (field, value) => {
    setNewContact(prev => ({ ...prev, [field]: value }));
  };

  const handleShowAddForm = () => {
    setShowAddForm(true);
    setTitle('Новый контакт');
  };

  const handleCancelAddForm = () => {
    setShowAddForm(false);
    setTitle('Список контактов');
    setNewContact({ phone: '', first_name: '', last_name: '', middle_name: '' });
  };

  const handleConfirmAdd = async () => {
    if (!newContact.phone.trim()) {
      alert('Укажите номер телефона');
      return;
    }
    if (!newContact.first_name.trim()) {
      alert('Укажите имя');
      return;
    }
    if (!newContact.last_name.trim()) {
      alert('Укажите фамилию');
      return;
    }
    if (!newContact.middle_name.trim()) {
      alert('Укажите отчество');
      return;
    }
    try {
      const contact = { phone: newContact.phone };
      if (newContact.first_name) contact.first_name = newContact.first_name;
      if (newContact.last_name) contact.last_name = newContact.last_name;
      if (newContact.middle_name) contact.middle_name = newContact.middle_name;
      const results = await addContact(contact);
      if (results.length === 0) {
        alert('Контакт не добавлен: проверьте данные');
        return;
      }
      const created = results[0];
      const parts = (created.name || '').split(' ').filter(Boolean);
      const [first_name, middle_name, ...rest] = parts;
      const last_name = rest.join(' ') || '';
      setItems(prev => [...prev, {
        phone: created.phone,
        first_name: first_name || '',
        last_name,
        middle_name: middle_name || '',
        id: created.phone,
        active: false,
      }]);
      setNewContact({ phone: '', first_name: '', last_name: '', middle_name: '' });
      setShowAddForm(false);
      setTitle('Список контактов');
    } catch (err) {
      console.error('Ошибка при добавлении контакта:', err);
      if (err.message.includes('500')) {
        alert('Сервер временно недоступен. Попробуйте ещё раз.');
      } else {
        alert(`Ошибка при добавлении контакта: ${err.message}`);
      }
    }
  };

  return (
    <>
      <section className="contactCenter" /*onClick={(e) => e.stopPropagation()}*/>
        <h2>{title}</h2>
        {isActive && (
          <>
            {loading && <div className="emptyMessage">Загрузка контактов...</div>}
            {error && <div className="emptyMessage" style={{color: 'red'}}>Ошибка: {error}</div>}
            {!loading && !error && (
              <>
                <div id="contactMainBlock" className='contactMainBlock'>
                  {!showAddForm && (
                    <>
                      <ul>
                        {items.length === 0 && (
                          <div className="emptyMessage">Список контактов пуст! Добавьте новый контакт!</div>
                        )}
                        {items.map((item) => (
                          <li className='contactLi'
                            style={{backgroundColor: item.active ? 'rgb(188, 195, 195)' : '', color: item.active ? 'var(--text-h7)' : ''}}
                            key={item.id}
                            onClick={() => changeItemActive(item.id)}
                          >
                            {editingPhone === item.phone ? (
                              <>
                                <div className="editForm" onClick={(e) => e.stopPropagation()}>
                                  <input
                                    className="editInput"
                                    type="text"
                                    placeholder="Телефон"
                                    value={editForm.phone}
                                    onChange={(e) => setEditField('phone', e.target.value)}
                                  />
                                  <input
                                    className="editInput"
                                    type="text"
                                    placeholder="Имя"
                                    value={editForm.first_name}
                                    onChange={(e) => setEditField('first_name', e.target.value)}
                                  />
                                  <input
                                    className="editInput"
                                    type="text"
                                    placeholder="Фамилия"
                                    value={editForm.last_name}
                                    onChange={(e) => setEditField('last_name', e.target.value)}
                                  />
                                  <input
                                    className="editInput"
                                    type="text"
                                    placeholder="Отчество"
                                    value={editForm.middle_name}
                                    onChange={(e) => setEditField('middle_name', e.target.value)}
                                  />
                                </div>
                                <button
                                  className="editButton saveButton"
                                  onClick={(e) => { e.stopPropagation(); handleSaveEdit(); }}
                                  title="Сохранить"
                                >
                                  ✓
                                </button>
                                <button
                                  className="editButton cancelButton"
                                  onClick={(e) => { e.stopPropagation(); handleCancelEdit(); }}
                                  title="Отмена"
                                >
                                  ✕
                                </button>
                              </>
                            ) : (
                              <>
                                <p className="contactName">{buildDisplayName(item)}</p>
                                <p className="contactPhone">{item.phone}</p>
                                <button
                                  className="editButton"
                                  onClick={(e) => { e.stopPropagation(); handleStartEdit(item); }}
                                  title="Редактировать"
                                >
                                  ✎
                                </button>
                                <button
                                  className="editButton deleteButton"
                                  onClick={(e) => { e.stopPropagation(); handleDeleteContact(item.phone); }}
                                  title="Удалить"
                                >
                                  ✕
                                </button>
                              </>
                            )}
                          </li>
                        ))}
                      </ul>

                      <div className="contactAddRow">
                        <button className="addButton" onClick={handleShowAddForm}>
                          Добавить новый контакт в список
                        </button>
                      </div>
                    </>
                  )}

                  {showAddForm && (
                    <div className="addFormContainer">
                      <input
                        className="newTextInput"
                        type="text"
                        placeholder="Телефон..."
                        value={newContact.phone}
                        onChange={(e) => setNewField('phone', e.target.value)}
                      />
                      <input
                        className="newTextInput"
                        type="text"
                        placeholder="Имя"
                        value={newContact.first_name}
                        onChange={(e) => setNewField('first_name', e.target.value)}
                      />
                      <input
                        className="newTextInput"
                        type="text"
                        placeholder="Фамилия"
                        value={newContact.last_name}
                        onChange={(e) => setNewField('last_name', e.target.value)}
                      />
                      <input
                        className="newTextInput"
                        type="text"
                        placeholder="Отчество"
                        value={newContact.middle_name}
                        onChange={(e) => setNewField('middle_name', e.target.value)}
                      />
                      <div className="addFormButtons">
                        <button className="addButton confirmButton" onClick={handleConfirmAdd}>
                          Добавить контакт
                        </button>
                        <button className="addButton cancelButton" onClick={handleCancelAddForm}>
                          Не добавлять
                        </button>
                      </div>
                    </div>
                  )}
                </div>
                <div className="buttonWrapper" style={{ display: showAddForm ? 'none' : 'flex' }}>
                  <Link to="/"
                    type="button"
                    className="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      const activeItems = items.filter(item => item.active);
                      if (activeItems.length > 0) {
                        handleAddContacts();
                      } else {
                        alert('Выберите контакт из списка!');
                      }
                    }}
                  >
                    Добавить контакт в СМС-сообщение
                  </Link>
                </div>
              </>
            )}
          </>
        )}
      </section>
    </>
  );
}

export default ContactPage;

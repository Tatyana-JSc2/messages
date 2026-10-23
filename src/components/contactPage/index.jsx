import './style.css'
// import Contacts from '../../dataContacts';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { getContacts, addContact } from '../../api';

function ContactPage({ /*setIndexContact,*/ setSelectedPhone, setActiveComponent, isActive, addingToGroupId, setPendingGroupContacts, groupContacts: groupContactsProp }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingPhone, setEditingPhone] = useState(null);
  const [editForm, setEditForm] = useState({ phone: '', name: '' });
  const [newContact, setNewContact] = useState({ phone: '', name: '' });
  const [showAddForm, setShowAddForm] = useState(false);
  const [title, setTitle] = useState('Список контактов');

  const groupContacts = groupContactsProp || [];

  const isGroupEditMode = !!addingToGroupId;

  useEffect(() => {
    let cancelled = false;
    
    getContacts()
      .then((data) => {
        if (!cancelled) {
          const contacts = data.map((c, index) => {
            const phone = c.phones?.[0] || '';
            return {
              phone,
              name: c.name || '',
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
    if (activeItems.length === 0) {
      alert('Выберите контакт из списка!');
      return;
    }
    if (isGroupEditMode) {
      // Добавляем выбранные контакты в группу и возвращаемся к groupPage
      const existingPhones = new Set(groupContacts.map((c) => c.phone));
      const newContacts = activeItems.filter((c) => !existingPhones.has(c.phone));
      const updatedContacts = [...groupContacts, ...newContacts];
      // Сбрасываем выделение
      setItems((prev) =>
        prev.map((item) => ({ ...item, active: false }))
      );
      // Передаём контакты обратно в groupPage — groupPage сам сбросит addingToGroupId
      if (setPendingGroupContacts) {
        setPendingGroupContacts(updatedContacts);
      }
      setActiveComponent('group');
    } else {
      const phonesArray = activeItems.map(item => item.phone);
      const phones = phonesArray.join('; ');
      setSelectedPhone(phones);
      setItems(prevItems =>
        prevItems.map(item => ({ ...item, active: false }))
      );
      setActiveComponent('sms');
    }
  };

  const handleStartEdit = (contact) => {
    setEditingPhone(contact.phone);
    setEditForm({
      phone: contact.phone,
      name: contact.name || '',
    });
  };

  const handleSaveEdit = async () => {
    if (!editForm.phone.trim()) return;
    if (!editForm.name.trim()) {
      alert('Укажите имя контакта');
      return;
    }
    try {
      const updated = {
        phone: editForm.phone,
        name: editForm.name,
      };
      const result = await addContact(updated);
      setItems(prev =>
        prev.map(item =>
          item.phone === editForm.phone
            ? { ...item, phone: result.phone, name: result.name || editForm.name, id: result.phone, active: item.active }
            : item
        )
      );
      setEditingPhone(null);
      setEditForm({ phone: '', name: '' });
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
    setEditForm({ phone: '', name: '' });
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
    setNewContact({ phone: '', name: '' });
  };

  const handleConfirmAdd = async () => {
    if (!newContact.phone.trim()) {
      alert('Укажите номер телефона');
      return;
    }
    if (!newContact.name.trim()) {
      alert('Укажите имя контакта');
      return;
    }
    try {
      const contact = {
        phone: newContact.phone,
        name: newContact.name,
      };
      const result = await addContact(contact);
      setItems(prev => [...prev, {
        phone: result.phone,
        name: result.name || newContact.name,
        id: result.phone,
        active: false,
      }]);
      setNewContact({ phone: '', name: '' });
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
        {isActive && (
          <>
            {loading && <div className="emptyMessage">Загрузка контактов...</div>}
            {error && <div className="emptyMessage" style={{color: 'red'}}>Ошибка: {error}</div>}
            {!loading && !error && (
              <>
                <div id="contactMainBlock" className='contactMainBlock'>
                  <h2>{title}</h2>
                  {!showAddForm && (
                    <>
                      {isGroupEditMode && groupContacts.length > 0 && (
                        <div className="groupContactsList" style={{ marginBottom: '16px' }}>
                          <h3>Добавленные контакты:</h3>
                          {groupContacts.map((contact, idx) => (
                            <div key={idx} className="groupContactItem">
                              <span className="groupContactName">
                                {contact.name}
                              </span>
                              <span className="groupContactPhone">{contact.phone}</span>
                            </div>
                          ))}
                        </div>
                      )}
                      <ul className="templatesList">
                        {items.length === 0 && (
                          <div className="emptyMessage">
                            Список контактов пуст! Добавьте первый контакт!
                          </div>
                        )}
                        {items.map((item) => (
                          <li
                            className={`${editingPhone === item.phone ? 'editing' : ''} ${item.active ? 'selected' : ''}`}
                            key={item.id}
                            onClick={() => changeItemActive(item.id)}
                          >
                            {editingPhone === item.phone ? (
                              <>
                                <input
                                  className="editInput"
                                  type="text"
                                  placeholder="Имя контакта"
                                  value={editForm.name}
                                  onChange={(e) => setEditField('name', e.target.value)}
                                  onClick={(e) => e.stopPropagation()}
                                />
                                <input
                                  className="editInput"
                                  type="text"
                                  placeholder="Телефон"
                                  value={editForm.phone}
                                  onChange={(e) => setEditField('phone', e.target.value)}
                                  onClick={(e) => e.stopPropagation()}
                                />
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
                                <span className="templateText">
                                  <span>{item.name || '—'}</span>
                                  <span className="templatePhone">{item.phone}</span>
                                </span>
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

                      <div className="contactAddRow" style={{ display: isGroupEditMode ? 'none' : 'flex' }}>
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
                        placeholder="Имя контакта"
                        value={newContact.name}
                        onChange={(e) => setNewField('name', e.target.value)}
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
                  {isGroupEditMode ? (
                    <button
                      className="groupAddButton"
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAddContacts();
                      }}
                    >
                      Добавить контакт в группу
                    </button>
                  ) : (
                    <Link to="/"
                      type="button"
                      className="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAddContacts();
                      }}
                    >
                      Добавить контакт в СМС-сообщение
                    </Link>
                  )}
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

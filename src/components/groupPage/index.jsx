import './style.css';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';

function GroupPage({ groups, setGroups, groupsLoading, setSelectedPhone, setActiveComponent, groupEditMode, setGroupEditMode, addingToGroupId, setAddingToGroupId, pendingGroupContacts, setPendingGroupContacts, addGroup, updateGroup, deleteGroup, isActive }) {
  const [editingGroupId, setEditingGroupId] = useState(null);
  const [editForm, setEditForm] = useState({ name: '', contacts: [] });
  const [newGroup, setNewGroup] = useState({ name: '' });
  const [showAddForm, setShowAddForm] = useState(false);
  const [title, setTitle] = useState('Группы контактов');
  const [selectedGroupId, setSelectedGroupId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // pendingGroupContacts — массив контактов, добавленных из contactPage
  // addingToGroupId — ID группы, в которую добавляем
  useEffect(() => {
    if (Array.isArray(pendingGroupContacts) && pendingGroupContacts.length > 0 && addingToGroupId) {
      // Добавляем контакты к существующей группе
      setGroups((prev) =>
        prev.map((g) => {
          if (g.id === addingToGroupId) {
            const existingPhones = new Set(g.contacts?.map((c) => c.phone) || []);
            const newContacts = pendingGroupContacts.filter((c) => !existingPhones.has(c.phone));
            return { ...g, contacts: [...(g.contacts || []), ...newContacts] };
          }
          return g;
        })
      );
      setPendingGroupContacts([]);
      setAddingToGroupId(null);
    }
  }, [pendingGroupContacts, addingToGroupId, setPendingGroupContacts, setAddingToGroupId, setGroups]);

  // Когда groupEditMode установлен извне (при редактировании группы)
  useEffect(() => {
    if (groupEditMode) {
      setEditingGroupId(groupEditMode);
    }
  }, [groupEditMode]);

  const handleSelectGroup = (id) => {
    setSelectedGroupId(id === selectedGroupId ? null : id);
  };

  const handleStartEdit = (group) => {
    setEditingGroupId(group.id);
    setEditForm({
      name: group.name,
      contacts: group.contacts || [],
    });
  };

  const handleSaveEdit = async () => {
    if (!editForm.name.trim()) {
      alert('Укажите название группы');
      return;
    }
    try {
      const updated = {
        id: editingGroupId,
        name: editForm.name,
        contacts: editForm.contacts,
      };
      await updateGroup(updated);
      setGroups((prev) =>
        prev.map((g) => (g.id === editingGroupId ? updated : g))
      );
      setEditingGroupId(null);
      setGroupEditMode(null);
      setEditForm({ name: '', contacts: [] });
      setPendingGroupContacts([]);
    } catch (err) {
      console.error('Ошибка при обновлении группы:', err);
      alert(`Ошибка при обновлении группы: ${err.message}`);
    }
  };

  const handleCancelEdit = () => {
    setEditingGroupId(null);
    setEditForm({ name: '', contacts: [] });
  };

  const handleDeleteGroup = async (id) => {
    if (!confirm('Удалить группу?')) return;
    try {
      await deleteGroup(id);
      setGroups((prev) => prev.filter((g) => g.id !== id));
      if (selectedGroupId === id) setSelectedGroupId(null);
    } catch (err) {
      console.error('Ошибка при удалении группы:', err);
      alert(`Ошибка при удалении группы: ${err.message}`);
    }
  };

  const handleShowAddForm = () => {
    setShowAddForm(true);
    setTitle('Новая группа');
    setNewGroup({ name: '' });
  };

  const handleCancelAddForm = () => {
    setShowAddForm(false);
    setTitle('Группы контактов');
    setNewGroup({ name: '' });
  };

  const handleConfirmAdd = async () => {
    if (!newGroup.name.trim()) {
      alert('Укажите название группы');
      return;
    }
    try {
      const created = await addGroup({ name: newGroup.name, contacts: [] });
      setGroups((prev) => [...prev, created]);
      setNewGroup({ name: '' });
      setShowAddForm(false);
      setTitle('Группы контактов');
    } catch (err) {
      console.error('Ошибка при добавлении группы:', err);
      alert(`Ошибка при добавлении группы: ${err.message}`);
    }
  };

  const handleAddContactToGroup = () => {
    setAddingToGroupId(editingGroupId);
    setPendingGroupContacts([]);
    setActiveComponent('contact');
  };

  const handleRemoveContactFromGroup = (contactPhone) => {
    // Локально удаляем контакт из формы редактирования
    setEditForm((prev) => ({
      ...prev,
      contacts: prev.contacts.filter((c) => c.phone !== contactPhone),
    }));
    // Обновляем группу в списке
    if (editingGroupId) {
      setGroups((prev) =>
        prev.map((g) =>
          g.id === editingGroupId
            ? { ...g, contacts: (g.contacts || []).filter((c) => c.phone !== contactPhone) }
            : g
        )
      );
    }
  };

  const handleAddGroupContactsToSms = () => {
    if (!selectedGroupId) {
      alert('Выберите группу из списка!');
      return;
    }
    const group = groups.find((g) => g.id === selectedGroupId);
    if (!group || !group.contacts || group.contacts.length === 0) {
      alert('В группе нет контактов');
      return;
    }
    const phones = group.contacts.map((c) => c.phone).join('; ');
    setSelectedPhone(phones);
    setActiveComponent('sms');
  };

  const getContactsDisplay = (contacts) => {
    if (!contacts || contacts.length === 0) return '';
    return contacts
      .map((c) => {
        const name = [c.last_name, c.first_name, c.middle_name].filter(Boolean).join(' ');
        return `${name} — ${c.phone}`;
      })
      .join('\n');
  };

  return (
    <>
      <section className="contactCenter">
        {isActive && (
          <>
            {groupsLoading && <div className="emptyMessage">Загрузка групп...</div>}
            {error && <div className="emptyMessage" style={{ color: 'red' }}>Ошибка: {error}</div>}
            {!groupsLoading && !error && (
              <>
                <div id="contactMainBlock" className="contactMainBlock">
                  <h2>{title}</h2>
                  {!showAddForm && (
                    <>
                      <ul className="templatesList">
                        {groups.length === 0 && (
                          <div className="emptyMessage">
                            Список групп пуст! Добавьте новую группу!
                          </div>
                        )}
                        {groups.map((group) => (
                          <li
                            className={`${editingGroupId === group.id ? 'editing' : ''}`}
                            style={{
                              backgroundColor: selectedGroupId === group.id ? 'rgb(188, 195, 195)' : '',
                              color: selectedGroupId === group.id ? 'var(--text-h7)' : '',
                            }}
                            key={group.id}
                            onClick={() => handleSelectGroup(group.id)}
                          >
                            {editingGroupId === group.id ? (
                              <>
                                <input
                                  className="editInput"
                                  type="text"
                                  placeholder="Название группы"
                                  value={editForm.name}
                                  onChange={(e) => setEditForm((prev) => ({ ...prev, name: e.target.value }))}
                                  onClick={(e) => e.stopPropagation()}
                                />
                                {editForm.contacts && editForm.contacts.length > 0 && (
                                  <div className="groupContactsList" onClick={(e) => e.stopPropagation()}>
                                    {editForm.contacts.map((contact, idx) => (
                                      <div key={idx} className="groupContactItem">
                                        <span className="groupContactName">
                                          {[contact.last_name, contact.first_name, contact.middle_name].filter(Boolean).join(' ')}
                                        </span>
                                        <span className="groupContactPhone">{contact.phone}</span>
                                        <button
                                          className="editButton removeContactButton"
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            handleRemoveContactFromGroup(contact.phone);
                                          }}
                                          title="Удалить контакт"
                                        >
                                          ✕
                                        </button>
                                      </div>
                                    ))}
                                  </div>
                                )}
                                <button
                                  className="addContactIcon"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleAddContactToGroup();
                                  }}
                                  title="Добавить контакт в группу"
                                >
                                  +
                                </button>
                                <button
                                  className="editButton saveButton"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleSaveEdit();
                                  }}
                                  title="Сохранить"
                                >
                                  ✓
                                </button>
                                <button
                                  className="editButton cancelButton"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleCancelEdit();
                                  }}
                                  title="Отмена"
                                >
                                  ✕
                                </button>
                              </>
                            ) : (
                              <>
                                <span className="templateText">
                                  <span>{group.name}</span>
                                  <span className="templatePhone">
                                    {group.contacts && group.contacts.length > 0
                                      ? `${group.contacts.length} конт.`
                                      : 'Нет контактов'}
                                  </span>
                                </span>
                                <button
                                  className="editButton"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleStartEdit(group);
                                  }}
                                  title="Редактировать"
                                >
                                  ✎
                                </button>
                                <button
                                  className="editButton deleteButton"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleDeleteGroup(group.id);
                                  }}
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
                          Добавить новую группу в список
                        </button>
                      </div>
                    </>
                  )}

                  {showAddForm && (
                    <div className="addFormContainer">
                      <input
                        className="newTextInput"
                        type="text"
                        placeholder="Название группы..."
                        value={newGroup.name}
                        onChange={(e) => setNewGroup({ name: e.target.value })}
                      />
                      <div className="addFormButtons">
                        <button className="addButton confirmButton" onClick={handleConfirmAdd}>
                          Добавить группу
                        </button>
                        <button className="addButton cancelButton" onClick={handleCancelAddForm}>
                          Не добавлять
                        </button>
                      </div>
                    </div>
                  )}
                </div>
                <div className="buttonWrapper" style={{ display: showAddForm ? 'none' : 'flex' }}>
                  <Link
                    to="/"
                    type="button"
                    className="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAddGroupContactsToSms();
                    }}
                  >
                    Добавить контакты группы в СМС-сообщение
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

export default GroupPage;

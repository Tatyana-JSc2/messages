import './style.css'
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const STORAGE_KEY = 'messageTemplates';

function getMessageTemplates() {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

function saveMessageTemplates(templates) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(templates));
}

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
}

function MessagePage({ setSelectedMessageText, setActiveComponent, isActive }) {
  const [templates, setTemplates] = useState(() => getMessageTemplates());
  const [idChange, setIdChange] = useState(null);
  const [newText, setNewText] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState('');

  useEffect(() => {
    saveMessageTemplates(templates);
  }, [templates]);

  const handleAdd = () => {
    const text = newText.trim();
    if (!text) return;
    const item = { id: generateId(), text };
    setTemplates(prev => [...prev, item]);
    setNewText('');
  };

  const handleDelete = (id) => {
    setTemplates(prev => prev.filter(t => t.id !== id));
    if (idChange === id) setIdChange(null);
  };

  const handleStartEdit = (template) => {
    setEditingId(template.id);
    setEditText(template.text);
  };

  const handleSaveEdit = (id) => {
    const text = editText.trim();
    if (!text) return;
    setTemplates(prev => prev.map(t => t.id === id ? { ...t, text } : t));
    setEditingId(null);
    setEditText('');
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditText('');
  };

  const handleSelect = (template) => {
    setIdChange(template.id);
  };

  const selectedTemplate = templates.find(t => t.id === idChange);

  return (
    <>
      <section className="messageCenter" onClick={(e) => e.stopPropagation()}>
        <h2>Шаблоны текстовых сообщений</h2>
        {isActive && (
          <>
            <div id="messageMainBlock" className='messageMainBlock'>
              <ul className="templatesList">
                {templates.length === 0 && (
                  <li className="emptyMessage">Список сообщений пуст! Добавьте новое сообщение!</li>
                )}
                {templates.map((template) => (
                  <li
                    className={idChange === template.id ? 'selected' : ''}
                    style={{
                      backgroundColor: template.id === idChange ? 'rgb(98, 111, 110)' : '',
                      color: template.id === idChange ? '#fea8a2' : ''
                    }}
                    key={template.id}
                    onClick={() => handleSelect(template)}
                  >
                    {editingId === template.id ? (
                      <>
                        <input
                          className="editInput"
                          type="text"
                          value={editText}
                          onChange={(e) => setEditText(e.target.value)}
                          onClick={(e) => e.stopPropagation()}
                        />
                        <button
                          className="editButton saveButton"
                          onClick={(e) => { e.stopPropagation(); handleSaveEdit(template.id); }}
                        >
                          ✓
                        </button>
                        <button
                          className="editButton cancelButton"
                          onClick={(e) => { e.stopPropagation(); handleCancelEdit(); }}
                        >
                          ✕
                        </button>
                      </>
                    ) : (
                      <>
                        <span className="templateText">{template.text}</span>
                        <button
                          className="editButton"
                          onClick={(e) => { e.stopPropagation(); handleStartEdit(template); }}
                          title="Редактировать"
                        >
                          ✎
                        </button>
                        <button
                          className="editButton deleteButton"
                          onClick={(e) => { e.stopPropagation(); handleDelete(template.id); }}
                          title="Удалить"
                        >
                          ✕
                        </button>
                      </>
                    )}
                  </li>
                ))}
              </ul>

              <div className="addRow">
                <input
                  className="newTextInput"
                  type="text"
                  value={newText}
                  onChange={(e) => setNewText(e.target.value)}
                  placeholder="Введите новый текст..."
                  onClick={(e) => e.stopPropagation()}
                />
                <button className="addButton" onClick={handleAdd}>
                  Добавить текст в список
                </button>
              </div>
            </div>

            <Link
              to="/"
              type="button"
              className="button"
              onClick={(e) => {
                e.stopPropagation();
                if (selectedTemplate) {
                  setSelectedMessageText(selectedTemplate.text);
                  setActiveComponent('sms');
                }
              }}
            >
              Добавить выбранный текст
            </Link>
          </>
        )}
      </section>
    </>
  );
}

export default MessagePage;

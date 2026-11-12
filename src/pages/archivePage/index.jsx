import { useState, useEffect, useRef, useCallback } from 'react';
import './style.css';
import { Link } from 'react-router-dom';
import { getArchive } from '../../api';

const PAGE_SIZE = 50;

function ArchivePage() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [offset, setOffset] = useState(0);
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [filterApplied, setFilterApplied] = useState(false);

  const observerTarget = useRef(null);
  const hasMoreRef = useRef(true);

  const loadMessages = useCallback(async (pageOffset, append = false) => {
    if (loading) return;
    setLoading(true);

    try {
      const data = await getArchive({
        limit: PAGE_SIZE,
        offset: pageOffset,
        dateFrom: dateFrom || undefined,
        dateTo: dateTo || undefined,
      });

      if (data.length < PAGE_SIZE) {
        setHasMore(false);
        hasMoreRef.current = false;
      } else {
        setHasMore(true);
        hasMoreRef.current = true;
      }

      setMessages(prev => append ? [...prev, ...data] : data);
      setOffset(pageOffset + PAGE_SIZE);
    } catch (err) {
      console.error('Ошибка загрузки архива:', err);
    } finally {
      setLoading(false);
    }
  }, [dateFrom, dateTo, loading]);

  // Initial load
  useEffect(() => {
    setMessages([]);
    setOffset(PAGE_SIZE);
    setHasMore(true);
    hasMoreRef.current = true;
    loadMessages(0, false);
  }, []);

  // Reload when filter changes
  const handleFilterChange = () => {
    setFilterApplied(true);
    setMessages([]);
    setOffset(PAGE_SIZE);
    setHasMore(true);
    hasMoreRef.current = true;
    loadMessages(0, false);
  };

  const handleResetFilter = () => {
    setDateFrom('');
    setDateTo('');
    setFilterApplied(false);
    setMessages([]);
    setOffset(PAGE_SIZE);
    setHasMore(true);
    hasMoreRef.current = true;
    loadMessages(0, false);
  };

  // Infinite scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMoreRef.current && !loading) {
          loadMessages(offset, true);
        }
      },
      { root: null, rootMargin: '200px', threshold: 0 }
    );

    const currentTarget = observerTarget.current;
    if (currentTarget) {
      observer.observe(currentTarget);
    }

    return () => {
      if (currentTarget) {
        observer.unobserve(currentTarget);
      }
    };
  }, [offset, loading, loadMessages]);

  const handleDelete = async (index) => {
    // Удаление из локального состояния
    const updated = messages.filter((_, i) => i !== index);
    setMessages(updated);
  };

  return (
    <>
      <section className='archiveSection'>
        <div className='archiveContent'>
          <h2>Архив отправленных сообщений</h2>

          {/* Фильтр по дате */}
          <div className='dateFilter'>
            <div className='filterGroup'>
              <label htmlFor='dateFrom'>С даты:</label>
              <input
                id='dateFrom'
                type='date'
                className='dateInput'
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
              />
            </div>
            <div className='filterGroup'>
              <label htmlFor='dateTo'>По дату:</label>
              <input
                id='dateTo'
                type='date'
                className='dateInput'
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
              />
            </div>
            <button className='filterButton' onClick={handleFilterChange}>
              Применить
            </button>
            {filterApplied && (
              <button className='resetButton' onClick={handleResetFilter}>
                Сбросить
              </button>
            )}
          </div>

          {messages.length === 0 && !loading ? (
            <p className='emptyMessage'>Архив пуст</p>
          ) : (
            <>
              <div className='archiveTableWrapper'>
                <table className='archiveTable'>
                  <thead>
                    <tr>
                      <th>№</th>
                      <th>Текст сообщения</th>
                      <th>Номера телефонов</th>
                      <th>Имена контактов</th>
                      <th>Дата</th>
                      <th>Время</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {messages.map((msg, index) => (
                      <tr key={msg.timestamp || index}>
                        <td>{index + 1}</td>
                        <td>{msg.text}</td>
                        <td>{msg.phones?.join('; ')}</td>
                        <td>{msg.contact_names?.join('; ') || 'Неизвестный'}</td>
                        <td>{msg.date}</td>
                        <td>{msg.time}</td>
                        <td>
                          <button className='deleteButton' onClick={() => handleDelete(index)}>
                            ✕
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* IntersectionObserver target */}
              <div ref={observerTarget} style={{ height: '1px' }} />

              {loading && (
                <p className='loadingMessage'>Загрузка...</p>
              )}
            </>
          )}
        </div>

        <div className='backLinkContainer'>
          <Link to='/' className='backLink'>Главная страница</Link>
        </div>
      </section>
    </>
  );
}

export default ArchivePage;

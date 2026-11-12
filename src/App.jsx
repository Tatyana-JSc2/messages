import { useState } from 'react'
import AppRoutes from './routes'

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(
    localStorage.getItem('isAuthenticated') === 'true'
  );

  const handleSetIsAuthenticated = (value) => {
    setIsAuthenticated(value);
    localStorage.setItem('isAuthenticated', String(value));
  };

  return (
    <AppRoutes isAuthenticated={isAuthenticated} setIsAuthenticated={handleSetIsAuthenticated} />
  )
}

export default App

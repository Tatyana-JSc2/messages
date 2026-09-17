import { useState } from 'react'
import AppRoutes from './routes'

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  return (
    <AppRoutes isAuthenticated={isAuthenticated} setIsAuthenticated={setIsAuthenticated} />
  )
}

export default App

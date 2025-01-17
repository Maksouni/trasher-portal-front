import './App.scss'
import LoginPage from './pages/login/Login'
import { AuthProvider } from './providers/auth/AuthProvider'

function App() {

  return (
    <div className="app">
      <AuthProvider>
        <Browser></Browser>
      </AuthProvid>
    </div>
  )
}

export default App

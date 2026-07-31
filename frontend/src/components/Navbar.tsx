import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'

export default function Navbar() {
  const { email, logout } = useAuthStore()
  const navigate = useNavigate()

  function handleLogout() {
    logout()
    navigate('/login')
  }

  return (
    <nav className="bg-white border-b px-6 py-3 flex items-center justify-between">
      <span className="font-bold text-blue-600 text-lg">Capstone App</span>
      <div className="flex items-center gap-4">
        <span className="text-sm text-gray-500" data-testid="nav-email">{email}</span>
        <button
          onClick={handleLogout}
          className="text-sm text-red-500 hover:underline"
          data-testid="logout-button"
        >
          Logout
        </button>
      </div>
    </nav>
  )
}

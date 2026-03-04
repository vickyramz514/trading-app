import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export function Navbar() {
  const { user, logout } = useAuth()

  return (
    <nav className="flex items-center justify-between border-b border-slate-200/80 bg-slate-800 px-6 py-3 shadow-md">
      <Link to="/" className="text-lg font-semibold text-white">
        Trading Dashboard
      </Link>
      <div className="flex items-center gap-3">
        <span className="rounded-md bg-slate-700 px-3 py-1.5 text-sm font-medium text-slate-200">
          {user}
        </span>
        <span className="text-slate-500">|</span>
        <button
          onClick={logout}
          className="rounded-md bg-slate-600 px-3 py-1.5 text-sm text-white transition-colors hover:bg-slate-500"
        >
          Logout
        </button>
      </div>
    </nav>
  )
}

import { NavLink } from 'react-router-dom'

const links = [
  { to: '/', label: 'Dashboard' },
  { to: '/holdings', label: 'Holdings' },
  { to: '/positions', label: 'Positions' },
  { to: '/market', label: 'Market Watch' },
]

export function Sidebar() {
  return (
    <aside className="w-52 bg-slate-800 p-4 shadow-lg">
      <ul className="space-y-1">
        {links.map(({ to, label }) => (
          <li key={to}>
            <NavLink
              to={to}
              className={({ isActive }) =>
                `block rounded-md px-3 py-2.5 text-sm transition-colors ${
                  isActive
                    ? 'bg-emerald-600 font-medium text-white'
                    : 'text-slate-300 hover:bg-slate-700 hover:text-white'
                }`
              }
            >
              {label}
            </NavLink>
          </li>
        ))}
      </ul>
    </aside>
  )
}

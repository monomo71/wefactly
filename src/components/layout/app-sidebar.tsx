import { NavLink } from 'react-router-dom';

const navigationItems = [
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/settings', label: 'Settings' },
];

export function AppSidebar() {
  return (
    <aside className="flex w-full max-w-64 flex-col border-r border-border bg-surface px-4 py-6">
      <div className="mb-6 px-2">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">weFactly</p>
        <p className="mt-2 text-lg font-semibold text-foreground">Fundament</p>
      </div>

      <nav className="space-y-1">
        {navigationItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              [
                'block rounded-md px-3 py-2 text-sm font-medium transition',
                isActive ? 'bg-slate-100 text-foreground' : 'text-slate-600 hover:bg-slate-50 hover:text-foreground',
              ].join(' ')
            }
          >
            {item.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}

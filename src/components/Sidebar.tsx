import Icon from '@/components/ui/icon';

export type ViewType = 'objects' | 'tasks' | 'brigades' | 'stats' | 'employees';

interface SidebarProps {
  currentView: ViewType;
  onNavigate: (view: ViewType) => void;
  urgentCount: number;
  isMobileOpen: boolean;
  onMobileClose: () => void;
}

const NAV_ITEMS = [
  { id: 'objects' as ViewType, label: 'Объекты', icon: 'Building2' },
  { id: 'tasks' as ViewType, label: 'Задачи', icon: 'ClipboardList' },
  { id: 'brigades' as ViewType, label: 'Бригады', icon: 'Users' },
  { id: 'stats' as ViewType, label: 'Статистика', icon: 'BarChart2' },
  { id: 'employees' as ViewType, label: 'Сотрудники', icon: 'UserCog' },
];

export default function Sidebar({ currentView, onNavigate, urgentCount, isMobileOpen, onMobileClose }: SidebarProps) {
  return (
    <>
      {/* Mobile overlay */}
      {isMobileOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 md:hidden" onClick={onMobileClose} />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed left-0 top-0 h-full w-60 z-50
        transition-transform duration-300
        md:relative md:translate-x-0 md:z-auto
        ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'}
      `} style={{ backgroundColor: 'hsl(var(--sidebar-background))' }}>
        {/* Logo */}
        <div className="px-4 py-5 border-b" style={{ borderColor: 'hsl(var(--sidebar-border))' }}>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-500 flex items-center justify-center">
              <Icon name="Wrench" size={16} className="text-white" />
            </div>
            <div>
              <p className="font-bold text-sm" style={{ color: 'hsl(0 0% 98%)' }}>СервисПро</p>
              <p className="text-xs" style={{ color: 'hsl(var(--sidebar-foreground))' }}>Управление объектами</p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="p-3 space-y-0.5">
          {NAV_ITEMS.map(item => (
            <button
              key={item.id}
              className={`nav-item w-full ${currentView === item.id ? 'active' : ''}`}
              onClick={() => { onNavigate(item.id); onMobileClose(); }}
            >
              <Icon name={item.icon} size={18} fallback="Circle" />
              <span className="flex-1 text-left">{item.label}</span>
              {item.id === 'tasks' && urgentCount > 0 && (
                <span className="px-1.5 py-0.5 bg-red-500 text-white text-xs rounded-full font-medium pulse-urgent">
                  {urgentCount}
                </span>
              )}
            </button>
          ))}
        </nav>

        {/* User */}
        <div className="absolute bottom-0 left-0 right-0 p-3 border-t" style={{ borderColor: 'hsl(var(--sidebar-border))' }}>
          <div className="flex items-center gap-2.5 px-3 py-2">
            <div className="w-7 h-7 rounded-full bg-blue-500/30 flex items-center justify-center flex-shrink-0">
              <Icon name="User" size={14} className="text-blue-300" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium truncate" style={{ color: 'hsl(0 0% 90%)' }}>Администратор</p>
              <p className="text-xs" style={{ color: 'hsl(var(--sidebar-foreground))' }}>Главный</p>
            </div>
            <button className="p-1 rounded hover:bg-white/10 transition-colors">
              <Icon name="LogOut" size={14} className="text-muted-foreground" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}

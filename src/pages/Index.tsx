import { useState, useEffect, useCallback } from 'react';
import { ObjectItem, STATUS_CONFIG, StatusType } from '@/data/mockData';
import { api } from '@/api/client';
import { normalizeObject } from '@/api/normalize';
import Sidebar, { ViewType } from '@/components/Sidebar';
import ObjectCard from '@/components/ObjectCard';
import ObjectDetail from '@/components/ObjectDetail';
import TasksView from '@/components/TasksView';
import BrigadesView from '@/components/BrigadesView';
import StatsView from '@/components/StatsView';
import EmployeesView from '@/components/EmployeesView';
import Icon from '@/components/ui/icon';

export default function Index() {
  const [objects, setObjects] = useState<ObjectItem[]>([]);
  const [organizations, setOrganizations] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentView, setCurrentView] = useState<ViewType>('objects');
  const [selectedObject, setSelectedObject] = useState<ObjectItem | null>(null);
  const [filterOrg, setFilterOrg] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<StatusType | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [urgentNotification, setUrgentNotification] = useState(true);

  const loadData = useCallback(async () => {
    try {
      const [rawObjects, rawOrgs] = await Promise.all([api.getObjects(), api.getOrganizations()]);
      setObjects(rawObjects.map(normalizeObject));
      setOrganizations(rawOrgs.map((o: { name: string }) => o.name));
    } catch (e) {
      console.error('Ошибка загрузки данных:', e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  const urgentCount = objects.flatMap(o => o.tasks).filter(t => t.status === 'urgent').length;

  useEffect(() => {
    if (urgentCount > 0 && urgentNotification) {
      const timer = setTimeout(() => setUrgentNotification(false), 6000);
      return () => clearTimeout(timer);
    }
  }, [urgentCount, urgentNotification]);

  const filteredObjects = objects.filter(obj => {
    if (filterOrg !== 'all' && obj.organization !== filterOrg) return false;
    if (filterStatus !== 'all' && obj.status !== filterStatus) return false;
    if (searchQuery && !obj.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !obj.address.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const handleUpdateObject = (updated: ObjectItem) => {
    setObjects(prev => prev.map(o => o.id === updated.id ? updated : o));
    setSelectedObject(updated);
  };

  const orgCounts = organizations.reduce((acc, org) => {
    acc[org] = objects.filter(o => o.organization === org).length;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="flex h-screen overflow-hidden bg-background font-golos">
      <Sidebar
        currentView={currentView}
        onNavigate={setCurrentView}
        urgentCount={urgentCount}
        isMobileOpen={isMobileMenuOpen}
        onMobileClose={() => setIsMobileMenuOpen(false)}
      />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top bar */}
        <header className="h-14 bg-white border-b border-border flex items-center px-4 gap-3 flex-shrink-0">
          <button
            className="md:hidden p-2 rounded-lg hover:bg-secondary transition-colors"
            onClick={() => setIsMobileMenuOpen(true)}
          >
            <Icon name="Menu" size={18} />
          </button>
          <div className="flex-1" />
          {urgentCount > 0 && (
            <button
              onClick={() => setCurrentView('tasks')}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 transition-colors"
            >
              <span className="w-2 h-2 bg-red-500 rounded-full pulse-urgent" />
              <span className="text-xs font-semibold text-red-700">{urgentCount} срочных</span>
            </button>
          )}
          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
            <span className="text-primary-foreground text-xs font-bold">А</span>
          </div>
        </header>

        {/* Urgent push notification */}
        {urgentNotification && urgentCount > 0 && (
          <div className="mx-4 mt-3 p-3 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3 animate-fade-in flex-shrink-0">
            <span className="w-3 h-3 bg-red-500 rounded-full pulse-urgent flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-red-800">Срочный выезд — требуется реакция!</p>
              <p className="text-xs text-red-600 mt-0.5">{urgentCount} заявок ждут назначения</p>
            </div>
            <button
              onClick={() => { setCurrentView('tasks'); setUrgentNotification(false); }}
              className="px-3 py-1.5 bg-red-500 text-white text-xs rounded-lg hover:bg-red-600 transition-colors font-semibold flex-shrink-0"
            >
              Открыть
            </button>
            <button onClick={() => setUrgentNotification(false)} className="p-1 hover:bg-red-100 rounded transition-colors flex-shrink-0">
              <Icon name="X" size={13} className="text-red-400" />
            </button>
          </div>
        )}

        {/* Main views */}
        <main className="flex-1 overflow-y-auto">

          {/* Objects view */}
          {currentView === 'objects' && (
            <div className="p-4 md:p-6 space-y-4 animate-fade-in">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-xl font-bold">Объекты</h1>
                  <p className="text-sm text-muted-foreground mt-0.5">{objects.length} объектов · {filteredObjects.length} показано</p>
                </div>
                <button className="flex items-center gap-2 px-3 py-2 bg-primary text-primary-foreground text-sm rounded-lg hover:opacity-90 transition-opacity font-medium">
                  <Icon name="Plus" size={15} />
                  <span className="hidden sm:inline">Добавить объект</span>
                </button>
              </div>

              {/* Search */}
              <div className="relative">
                <Icon name="Search" size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input
                  className="w-full pl-9 pr-4 py-2.5 text-sm rounded-xl border border-border bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                  placeholder="Поиск по названию или адресу..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                />
              </div>

              {/* Status filters */}
              <div className="flex gap-2 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
                <button
                  onClick={() => setFilterStatus('all')}
                  className={`flex-shrink-0 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${filterStatus === 'all' ? 'bg-primary text-primary-foreground' : 'bg-white border border-border hover:bg-secondary'}`}
                >
                  Все статусы
                </button>
                {(['ok', 'maintenance', 'repair', 'urgent'] as StatusType[]).map(s => (
                  <button
                    key={s}
                    onClick={() => setFilterStatus(s)}
                    className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${filterStatus === s ? 'bg-primary text-primary-foreground' : 'bg-white border border-border hover:bg-secondary'}`}
                  >
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: STATUS_CONFIG[s].color }} />
                    {STATUS_CONFIG[s].label}
                  </button>
                ))}
              </div>

              {/* Org tabs */}
              <div className="flex gap-1.5 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
                <button
                  onClick={() => setFilterOrg('all')}
                  className={`flex-shrink-0 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${filterOrg === 'all' ? 'bg-foreground text-background' : 'bg-white border border-border hover:bg-secondary'}`}
                >
                  Все ({objects.length})
                </button>
                {organizations.map(org => (
                  <button
                    key={org}
                    onClick={() => setFilterOrg(org)}
                    className={`flex-shrink-0 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${filterOrg === org ? 'bg-foreground text-background' : 'bg-white border border-border hover:bg-secondary'}`}
                  >
                    {org.replace('ООО "Маяк-Калуга"', 'Маяк-Калуга').replace('ИП ', '')} ({orgCounts[org] || 0})
                  </button>
                ))}
              </div>

              {/* Grid */}
              {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="bg-white rounded-xl border border-border p-4 space-y-3 animate-pulse">
                      <div className="flex justify-between">
                        <div className="space-y-2 flex-1">
                          <div className="h-4 bg-secondary rounded w-3/4" />
                          <div className="h-3 bg-secondary rounded w-1/2" />
                        </div>
                        <div className="w-3 h-3 rounded-full bg-secondary" />
                      </div>
                      <div className="h-3 bg-secondary rounded w-full" />
                      <div className="h-3 bg-secondary rounded w-2/3" />
                      <div className="flex gap-1">
                        <div className="h-5 bg-secondary rounded w-16" />
                        <div className="h-5 bg-secondary rounded w-20" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : filteredObjects.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                  <Icon name="Building2" size={36} className="text-muted-foreground mb-3" />
                  <p className="font-semibold">Объекты не найдены</p>
                  <p className="text-sm text-muted-foreground mt-1">Попробуйте изменить фильтры</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
                  {filteredObjects.map(obj => (
                    <ObjectCard
                      key={obj.id}
                      obj={obj}
                      onClick={() => setSelectedObject(obj)}
                    />
                  ))}
                </div>
              )}
            </div>
          )}

          {currentView === 'tasks' && (
            <TasksView
              objects={objects}
              onOpenObject={obj => { setSelectedObject(obj); setCurrentView('objects'); }}
            />
          )}

          {currentView === 'brigades' && <BrigadesView objects={objects} />}
          {currentView === 'stats' && <StatsView objects={objects} />}
          {currentView === 'employees' && <EmployeesView />}
        </main>
      </div>

      {/* Object detail drawer */}
      {selectedObject && (
        <ObjectDetail
          obj={selectedObject}
          onClose={() => setSelectedObject(null)}
          onUpdate={handleUpdateObject}
        />
      )}
    </div>
  );
}
import { useState } from 'react';
import { Brigade, Employee, MOCK_BRIGADES, MOCK_EMPLOYEES, ObjectItem } from '@/data/mockData';
import Icon from '@/components/ui/icon';
import StatusDot from './StatusDot';

interface BrigadesViewProps {
  objects: ObjectItem[];
}

export default function BrigadesView({ objects }: BrigadesViewProps) {
  const [brigades] = useState<Brigade[]>(MOCK_BRIGADES);
  const [employees] = useState<Employee[]>(MOCK_EMPLOYEES);
  const [selectedBrigade, setSelectedBrigade] = useState<string | null>(null);
  const [showTimeLog, setShowTimeLog] = useState(false);
  const [timeEntry, setTimeEntry] = useState({ brigadeId: '', date: new Date().toISOString().split('T')[0], start: '08:00', end: '17:00' });

  const getEmployee = (id: string) => employees.find(e => e.id === id);

  const getBrigadeTaskObjects = (brigade: Brigade) => {
    return objects.filter(o => o.tasks.some(t => t.assignee === brigade.name));
  };

  const formatHours = (h: number) => {
    const hours = Math.floor(h);
    const mins = Math.round((h - hours) * 60);
    return mins > 0 ? `${hours}ч ${mins}м` : `${hours}ч`;
  };

  return (
    <div className="p-4 md:p-6 space-y-5 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold">Бригады</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Управление бригадами и учёт времени</p>
        </div>
        <button
          onClick={() => setShowTimeLog(!showTimeLog)}
          className="flex items-center gap-2 px-3 py-2 bg-primary text-primary-foreground text-sm rounded-lg hover:opacity-90 transition-opacity"
        >
          <Icon name="Clock" size={15} />
          Отметить время
        </button>
      </div>

      {/* Time log form */}
      {showTimeLog && (
        <div className="bg-white rounded-xl border border-border p-4 space-y-3 animate-fade-in">
          <h3 className="font-semibold text-sm">Начало / конец рабочего дня</h3>
          <div className="grid grid-cols-2 gap-2">
            <select
              className="px-3 py-2 text-sm rounded-lg border border-border bg-white focus:outline-none col-span-2"
              value={timeEntry.brigadeId}
              onChange={e => setTimeEntry(p => ({ ...p, brigadeId: e.target.value }))}
            >
              <option value="">— Выбрать бригаду —</option>
              {brigades.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
            </select>
            <input type="date" className="px-3 py-2 text-sm rounded-lg border border-border bg-white focus:outline-none"
              value={timeEntry.date} onChange={e => setTimeEntry(p => ({ ...p, date: e.target.value }))} />
            <div className="grid grid-cols-2 gap-1">
              <input type="time" className="px-3 py-2 text-sm rounded-lg border border-border bg-white focus:outline-none"
                value={timeEntry.start} onChange={e => setTimeEntry(p => ({ ...p, start: e.target.value }))} />
              <input type="time" className="px-3 py-2 text-sm rounded-lg border border-border bg-white focus:outline-none"
                value={timeEntry.end} onChange={e => setTimeEntry(p => ({ ...p, end: e.target.value }))} />
            </div>
          </div>
          <div className="flex gap-2">
            <button className="flex-1 py-2 bg-primary text-primary-foreground text-sm rounded-lg hover:opacity-90 font-medium">
              Сохранить
            </button>
            <button onClick={() => setShowTimeLog(false)} className="px-4 py-2 bg-secondary text-sm rounded-lg">
              Отмена
            </button>
          </div>
        </div>
      )}

      {/* Brigades */}
      <div className="space-y-4">
        {brigades.map(brigade => {
          const members = brigade.members.map(id => getEmployee(id)).filter(Boolean) as Employee[];
          const brigadeObjects = getBrigadeTaskObjects(brigade);
          const isOpen = selectedBrigade === brigade.id;

          return (
            <div key={brigade.id} className="bg-white rounded-xl border border-border overflow-hidden">
              <div
                className="flex items-center justify-between p-4 cursor-pointer hover:bg-secondary/30 transition-colors"
                onClick={() => setSelectedBrigade(isOpen ? null : brigade.id)}
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-blue-100 flex items-center justify-center">
                    <Icon name="Users" size={18} className="text-blue-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm">{brigade.name}</p>
                    <p className="text-xs text-muted-foreground">{members.length} чел. · {brigadeObjects.length} объектов</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right hidden sm:block">
                    <p className="text-xs text-muted-foreground">Неделя</p>
                    <p className="font-mono text-sm font-semibold">{formatHours(brigade.hoursThisWeek)}</p>
                  </div>
                  <Icon name={isOpen ? 'ChevronUp' : 'ChevronDown'} size={16} className="text-muted-foreground" />
                </div>
              </div>

              {isOpen && (
                <div className="border-t border-border p-4 space-y-4 animate-fade-in">
                  {/* Members */}
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Состав</p>
                    <div className="space-y-2">
                      {members.map(emp => (
                        <div key={emp.id} className="flex items-center justify-between py-1.5">
                          <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-full bg-secondary flex items-center justify-center">
                              <span className="text-xs font-semibold">{emp.name.charAt(0)}</span>
                            </div>
                            <span className="text-sm">{emp.name}</span>
                          </div>
                          <div className="flex gap-4 text-right">
                            <div>
                              <p className="text-xs text-muted-foreground">Неделя</p>
                              <p className="font-mono text-xs font-semibold">{formatHours(emp.hoursThisWeek)}</p>
                            </div>
                            <div>
                              <p className="text-xs text-muted-foreground">Месяц</p>
                              <p className="font-mono text-xs font-semibold">{formatHours(emp.hoursThisMonth)}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Current tasks */}
                  {brigadeObjects.length > 0 && (
                    <div>
                      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Текущие объекты</p>
                      <div className="space-y-2">
                        {brigadeObjects.map(obj => (
                          <div key={obj.id} className="flex items-center gap-2 p-2 bg-secondary/50 rounded-lg">
                            <StatusDot status={obj.status} size="sm" />
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium truncate">{obj.name}</p>
                              <p className="text-xs text-muted-foreground truncate">{obj.address}</p>
                            </div>
                            <span className="text-xs text-muted-foreground">
                              {obj.tasks.filter(t => t.assignee === brigade.name).length} зад.
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

import { useState, useEffect, useCallback } from 'react';
import { ObjectItem, STATUS_CONFIG } from '@/data/mockData';
import { api } from '@/api/client';
import Icon from '@/components/ui/icon';

interface StatsViewProps {
  objects: ObjectItem[];
}

/* eslint-disable @typescript-eslint/no-explicit-any */
export default function StatsView({ objects }: StatsViewProps) {
  const [statsData, setStatsData] = useState<{ employees: any[]; brigades: any[] }>({ employees: [], brigades: [] });
  const [loading, setLoading] = useState(true);

  const loadStats = useCallback(async () => {
    try {
      const data = await api.getStats();
      setStatsData(data);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadStats(); }, [loadStats]);

  const employees = statsData.employees;
  const brigades = statsData.brigades;

  const formatHours = (h: number) => {
    const hours = Math.floor(h);
    const mins = Math.round((h - hours) * 60);
    return mins > 0 ? `${hours}ч ${mins}м` : `${hours}ч`;
  };

  const totalByStatus = {
    ok: objects.filter(o => o.status === 'ok').length,
    maintenance: objects.filter(o => o.status === 'maintenance').length,
    repair: objects.filter(o => o.status === 'repair').length,
    urgent: objects.filter(o => o.status === 'urgent').length,
  };

  const allTasks = objects.flatMap(o => o.tasks);

  return (
    <div className="p-4 md:p-6 space-y-6 animate-fade-in">
      <div>
        <h1 className="text-xl font-bold">Статистика</h1>
        <p className="text-sm text-muted-foreground mt-0.5">Отчёты за неделю и месяц</p>
      </div>

      {/* Objects summary */}
      <section>
        <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Состояние объектов</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {(['ok', 'maintenance', 'repair', 'urgent'] as const).map(status => {
            const config = STATUS_CONFIG[status];
            return (
              <div key={status} className={`p-4 rounded-xl border-2 bg-white ${config.bg}`}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-medium text-muted-foreground">{config.label}</span>
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: config.color }} />
                </div>
                <p className="text-3xl font-bold" style={{ color: config.color }}>
                  {totalByStatus[status]}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {totalByStatus[status] === 1 ? 'объект' : totalByStatus[status] < 5 ? 'объекта' : 'объектов'}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Tasks summary */}
      <section>
        <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Задачи</h2>
        <div className="grid grid-cols-3 gap-3">
          <div className="p-4 bg-white rounded-xl border border-border text-center">
            <p className="text-2xl font-bold">{allTasks.length}</p>
            <p className="text-xs text-muted-foreground mt-1">Всего активных</p>
          </div>
          <div className="p-4 bg-white rounded-xl border border-border text-center">
            <p className="text-2xl font-bold text-red-500">{allTasks.filter(t => t.status === 'urgent').length}</p>
            <p className="text-xs text-muted-foreground mt-1">Срочных</p>
          </div>
          <div className="p-4 bg-white rounded-xl border border-border text-center">
            <p className="text-2xl font-bold text-green-500">{objects.filter(o => o.tasks.length === 0).length}</p>
            <p className="text-xs text-muted-foreground mt-1">Без задач</p>
          </div>
        </div>
      </section>

      {/* Brigades stats */}
      <section>
        <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Бригады</h2>
        <div className="space-y-3">
          {loading ? (
            <div className="p-6 text-center text-sm text-muted-foreground">Загрузка...</div>
          ) : brigades.map(brigade => {
            const maxHoursMonth = 200;
            const hrs = parseFloat(brigade.hours_month) || 0;
            const pct = Math.min((hrs / maxHoursMonth) * 100, 100);
            return (
              <div key={brigade.id} className="bg-white rounded-xl border border-border p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
                      <Icon name="Users" size={16} className="text-blue-600" />
                    </div>
                    <p className="font-semibold text-sm">{brigade.name}</p>
                  </div>
                  <div className="flex gap-4 text-right">
                    <div>
                      <p className="text-xs text-muted-foreground">Нед.</p>
                      <p className="font-mono text-sm font-bold">{formatHours(parseFloat(brigade.hours_week) || 0)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Мес.</p>
                      <p className="font-mono text-sm font-bold">{formatHours(hrs)}</p>
                    </div>
                  </div>
                </div>
                <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500 rounded-full transition-all" style={{ width: `${pct}%` }} />
                </div>
                <p className="text-xs text-muted-foreground mt-1">{Math.round(pct)}% от нормы ({maxHoursMonth}ч)</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Employee stats */}
      <section>
        <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Сотрудники (полевые)</h2>
        <div className="bg-white rounded-xl border border-border overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-secondary/30">
                <th className="text-left px-4 py-2.5 text-xs font-semibold text-muted-foreground">Сотрудник</th>
                <th className="text-right px-4 py-2.5 text-xs font-semibold text-muted-foreground">Неделя</th>
                <th className="text-right px-4 py-2.5 text-xs font-semibold text-muted-foreground">Месяц</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={3} className="px-4 py-6 text-center text-sm text-muted-foreground">Загрузка...</td></tr>
              ) : employees.map((emp, i) => (
                <tr key={emp.id} className={`border-b border-border last:border-0 ${i % 2 === 0 ? '' : 'bg-secondary/20'}`}>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-secondary flex items-center justify-center flex-shrink-0">
                        <span className="text-xs font-semibold">{emp.name?.charAt(0)}</span>
                      </div>
                      <div>
                        <span className="text-sm font-medium">{emp.name}</span>
                        {emp.brigade_name && <span className="text-xs text-muted-foreground ml-2">· {emp.brigade_name}</span>}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <span className="font-mono text-sm font-semibold">{formatHours(parseFloat(emp.hours_week) || 0)}</span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <span className="font-mono text-sm font-semibold">{formatHours(parseFloat(emp.hours_month) || 0)}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
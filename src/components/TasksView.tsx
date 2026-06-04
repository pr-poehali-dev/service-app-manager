import { useState } from 'react';
import { ObjectItem, STATUS_CONFIG, StatusType } from '@/data/mockData';
import StatusDot from './StatusDot';
import Icon from '@/components/ui/icon';

interface TasksViewProps {
  objects: ObjectItem[];
  onOpenObject: (obj: ObjectItem) => void;
}

export default function TasksView({ objects, onOpenObject }: TasksViewProps) {
  const [filterStatus, setFilterStatus] = useState<StatusType | 'all'>('all');

  const allTasks = objects.flatMap(obj =>
    obj.tasks.map(task => ({ ...task, objectName: obj.name, objectId: obj.id, obj }))
  );

  const filtered = filterStatus === 'all'
    ? allTasks
    : allTasks.filter(t => t.status === filterStatus);

  const sorted = [...filtered].sort((a, b) => {
    const order = { urgent: 0, repair: 1, maintenance: 2, ok: 3 };
    return order[a.status] - order[b.status];
  });

  const counts = {
    urgent: allTasks.filter(t => t.status === 'urgent').length,
    repair: allTasks.filter(t => t.status === 'repair').length,
    maintenance: allTasks.filter(t => t.status === 'maintenance').length,
  };

  return (
    <div className="p-4 md:p-6 space-y-5 animate-fade-in">
      <div>
        <h1 className="text-xl font-bold">Задачи</h1>
        <p className="text-sm text-muted-foreground mt-0.5">Все активные задачи по объектам</p>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 flex-wrap">
        {[
          { key: 'all', label: 'Все', count: allTasks.length },
          { key: 'urgent', label: 'Срочные', count: counts.urgent },
          { key: 'repair', label: 'Ремонт', count: counts.repair },
          { key: 'maintenance', label: 'ТО', count: counts.maintenance },
        ].map(f => (
          <button
            key={f.key}
            onClick={() => setFilterStatus(f.key as StatusType | 'all')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
              filterStatus === f.key
                ? 'bg-primary text-primary-foreground'
                : 'bg-white border border-border hover:bg-secondary'
            }`}
          >
            {f.key !== 'all' && <StatusDot status={f.key as StatusType} size="sm" />}
            {f.label}
            {f.count > 0 && (
              <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                filterStatus === f.key ? 'bg-white/20 text-white' : 'bg-secondary text-muted-foreground'
              }`}>{f.count}</span>
            )}
          </button>
        ))}
      </div>

      {sorted.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mb-3">
            <Icon name="CheckCircle2" size={24} className="text-green-600" />
          </div>
          <p className="font-semibold text-green-700">Нет активных задач</p>
          <p className="text-sm text-muted-foreground mt-1">Все объекты в порядке</p>
        </div>
      ) : (
        <div className="space-y-2.5">
          {sorted.map(task => {
            const tc = STATUS_CONFIG[task.status];
            return (
              <div
                key={task.id}
                className={`bg-white rounded-xl border-2 p-4 cursor-pointer hover:shadow-sm transition-all ${tc.bg}`}
                onClick={() => onOpenObject(task.obj)}
              >
                <div className="flex items-start gap-3">
                  <StatusDot status={task.status} size="md" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="font-semibold text-sm">{task.title}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">{task.objectName} · {task.type}</p>
                      </div>
                      {task.status === 'urgent' && (
                        <span className="flex-shrink-0 px-2 py-0.5 bg-red-500 text-white text-xs rounded-full font-medium pulse-urgent">
                          СРОЧНО
                        </span>
                      )}
                    </div>
                    {task.description && (
                      <p className="text-xs text-muted-foreground mt-1.5 line-clamp-2">{task.description}</p>
                    )}
                    <div className="flex flex-wrap gap-x-3 gap-y-1 mt-2">
                      {task.deadline && (
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <Icon name="Calendar" size={11} /> до {task.deadline}
                        </span>
                      )}
                      {task.contact && (
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <Icon name="User" size={11} /> {task.contact}
                        </span>
                      )}
                      {task.assignee && (
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <Icon name="Users" size={11} /> {task.assignee}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

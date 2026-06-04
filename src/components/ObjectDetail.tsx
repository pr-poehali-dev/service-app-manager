import { useState } from 'react';
import { ObjectItem, Task, STATUS_CONFIG, StatusType, WORK_TYPES, MOCK_BRIGADES } from '@/data/mockData';
import StatusDot from './StatusDot';
import Icon from '@/components/ui/icon';

interface ObjectDetailProps {
  obj: ObjectItem;
  onClose: () => void;
  onUpdate: (obj: ObjectItem) => void;
}

export default function ObjectDetail({ obj, onClose, onUpdate }: ObjectDetailProps) {
  const [showAddTask, setShowAddTask] = useState(false);
  const [newTask, setNewTask] = useState({
    title: '',
    type: WORK_TYPES[0],
    status: 'maintenance' as StatusType,
    contact: obj.contact,
    deadline: '',
    description: '',
    assignee: '',
  });

  const yandexNavUrl = `https://yandex.ru/navi/?rtext=~${obj.lat},${obj.lng}&rtt=auto`;
  const yandexMapUrl = `https://yandex.ru/maps/?pt=${obj.lng},${obj.lat}&z=16&l=map`;

  const handleAddTask = () => {
    if (!newTask.title.trim()) return;
    const task: Task = {
      id: `t${Date.now()}`,
      ...newTask,
      createdAt: new Date().toISOString().split('T')[0],
    };
    const worstStatus = (tasks: Task[]): StatusType => {
      const priority = ['urgent', 'repair', 'maintenance', 'ok'];
      for (const s of priority) {
        if (tasks.some(t => t.status === s)) return s as StatusType;
      }
      return 'ok';
    };
    const updatedTasks = [...obj.tasks, task];
    onUpdate({ ...obj, tasks: updatedTasks, status: worstStatus(updatedTasks) });
    setShowAddTask(false);
    setNewTask({ title: '', type: WORK_TYPES[0], status: 'maintenance', contact: obj.contact, deadline: '', description: '', assignee: '' });
  };

  const handleDeleteTask = (taskId: string) => {
    const updatedTasks = obj.tasks.filter(t => t.id !== taskId);
    const worstStatus = (tasks: Task[]): StatusType => {
      if (tasks.length === 0) return 'ok';
      const priority = ['urgent', 'repair', 'maintenance'];
      for (const s of priority) {
        if (tasks.some(t => t.status === s)) return s as StatusType;
      }
      return 'ok';
    };
    onUpdate({ ...obj, tasks: updatedTasks, status: worstStatus(updatedTasks) });
  };

  return (
    <div className="fixed inset-0 z-50 flex">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative ml-auto w-full max-w-lg bg-white h-full overflow-y-auto shadow-2xl animate-slide-in-right">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-border z-10 px-5 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <StatusDot status={obj.status} size="lg" />
              <div>
                <h2 className="font-semibold text-base">{obj.name}</h2>
                <p className="text-xs text-muted-foreground">{obj.organization}</p>
              </div>
            </div>
            <button onClick={onClose} className="p-2 rounded-lg hover:bg-secondary transition-colors">
              <Icon name="X" size={18} />
            </button>
          </div>
        </div>

        <div className="p-5 space-y-5">
          {/* Info */}
          <section>
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Информация</h3>
            <div className="space-y-2.5">
              <div className="flex gap-2.5">
                <Icon name="MapPin" size={16} className="text-muted-foreground mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm text-foreground">{obj.address}</p>
                  <div className="flex gap-2 mt-1">
                    <a href={yandexNavUrl} target="_blank" rel="noopener noreferrer"
                      className="text-xs text-blue-600 hover:underline flex items-center gap-1">
                      <Icon name="Navigation" size={11} /> Навигатор
                    </a>
                    <a href={yandexMapUrl} target="_blank" rel="noopener noreferrer"
                      className="text-xs text-blue-600 hover:underline flex items-center gap-1">
                      <Icon name="Map" size={11} /> Карта
                    </a>
                  </div>
                </div>
              </div>
              <div className="flex gap-2.5">
                <Icon name="User" size={16} className="text-muted-foreground flex-shrink-0" />
                <div>
                  <p className="text-sm">{obj.contact}</p>
                  <p className="text-xs text-muted-foreground">{obj.contactPhone}</p>
                </div>
              </div>
              <div className="flex gap-2.5">
                <Icon name="FileText" size={16} className="text-muted-foreground flex-shrink-0" />
                <div>
                  <p className="text-sm">{obj.requisites}</p>
                  <p className="text-xs text-muted-foreground">ИНН: {obj.inn}</p>
                </div>
              </div>
            </div>
          </section>

          {/* Systems */}
          <section>
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Системы и оборудование</h3>
            <div className="flex flex-wrap gap-1.5">
              {obj.systems.map(sys => (
                <span key={sys} className="px-2.5 py-1 bg-secondary text-secondary-foreground text-xs rounded-lg font-medium">
                  {sys}
                </span>
              ))}
            </div>
          </section>

          {/* Tasks */}
          <section>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Задачи ({obj.tasks.length})
              </h3>
              <button
                onClick={() => setShowAddTask(!showAddTask)}
                className="flex items-center gap-1 px-2.5 py-1 bg-primary text-primary-foreground text-xs rounded-lg hover:opacity-90 transition-opacity"
              >
                <Icon name="Plus" size={12} />
                Добавить
              </button>
            </div>

            {showAddTask && (
              <div className="mb-4 p-4 bg-secondary/50 rounded-xl border border-border space-y-3 animate-fade-in">
                <h4 className="text-sm font-semibold">Новая задача</h4>
                <input
                  className="w-full px-3 py-2 text-sm rounded-lg border border-border bg-white focus:outline-none focus:ring-2 focus:ring-primary/20"
                  placeholder="Название задачи"
                  value={newTask.title}
                  onChange={e => setNewTask(p => ({ ...p, title: e.target.value }))}
                />
                <div className="grid grid-cols-2 gap-2">
                  <select
                    className="px-3 py-2 text-sm rounded-lg border border-border bg-white focus:outline-none"
                    value={newTask.type}
                    onChange={e => setNewTask(p => ({ ...p, type: e.target.value }))}
                  >
                    {WORK_TYPES.map(t => <option key={t}>{t}</option>)}
                  </select>
                  <select
                    className="px-3 py-2 text-sm rounded-lg border border-border bg-white focus:outline-none"
                    value={newTask.status}
                    onChange={e => setNewTask(p => ({ ...p, status: e.target.value as StatusType }))}
                  >
                    <option value="maintenance">Техобслуживание</option>
                    <option value="repair">Плановый ремонт</option>
                    <option value="urgent">Срочный выезд</option>
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    className="px-3 py-2 text-sm rounded-lg border border-border bg-white focus:outline-none"
                    placeholder="Контактное лицо"
                    value={newTask.contact}
                    onChange={e => setNewTask(p => ({ ...p, contact: e.target.value }))}
                  />
                  <input
                    type="date"
                    className="px-3 py-2 text-sm rounded-lg border border-border bg-white focus:outline-none"
                    value={newTask.deadline}
                    onChange={e => setNewTask(p => ({ ...p, deadline: e.target.value }))}
                  />
                </div>
                <select
                  className="w-full px-3 py-2 text-sm rounded-lg border border-border bg-white focus:outline-none"
                  value={newTask.assignee}
                  onChange={e => setNewTask(p => ({ ...p, assignee: e.target.value }))}
                >
                  <option value="">— Назначить бригаду —</option>
                  {MOCK_BRIGADES.map(b => <option key={b.id} value={b.name}>{b.name}</option>)}
                </select>
                <textarea
                  className="w-full px-3 py-2 text-sm rounded-lg border border-border bg-white focus:outline-none resize-none"
                  placeholder="Описание"
                  rows={2}
                  value={newTask.description}
                  onChange={e => setNewTask(p => ({ ...p, description: e.target.value }))}
                />
                <div className="flex gap-2">
                  <button onClick={handleAddTask}
                    className="flex-1 py-2 bg-primary text-primary-foreground text-sm rounded-lg hover:opacity-90 transition-opacity font-medium">
                    Создать задачу
                  </button>
                  <button onClick={() => setShowAddTask(false)}
                    className="px-4 py-2 bg-secondary text-secondary-foreground text-sm rounded-lg hover:bg-muted transition-colors">
                    Отмена
                  </button>
                </div>
              </div>
            )}

            {obj.tasks.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center mb-2">
                  <Icon name="CheckCircle" size={20} className="text-green-600" />
                </div>
                <p className="text-sm font-medium text-green-700">Всё исправно</p>
                <p className="text-xs text-muted-foreground mt-0.5">Активных задач нет</p>
              </div>
            ) : (
              <div className="space-y-2.5">
                {obj.tasks.map(task => {
                  const tc = STATUS_CONFIG[task.status];
                  return (
                    <div key={task.id} className={`p-3.5 rounded-xl border ${tc.bg} animate-fade-in`}>
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-start gap-2 flex-1 min-w-0">
                          <StatusDot status={task.status} size="sm" />
                          <div className="min-w-0">
                            <p className="text-sm font-semibold">{task.title}</p>
                            <p className="text-xs text-muted-foreground mt-0.5">{task.type}</p>
                          </div>
                        </div>
                        <button
                          onClick={() => handleDeleteTask(task.id)}
                          className="p-1 rounded hover:bg-white/50 transition-colors flex-shrink-0"
                        >
                          <Icon name="Trash2" size={13} className="text-muted-foreground" />
                        </button>
                      </div>
                      {task.description && (
                        <p className="text-xs text-muted-foreground mt-2">{task.description}</p>
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
                  );
                })}
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}

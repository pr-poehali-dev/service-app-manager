import { useState } from 'react';
import { Employee, MOCK_EMPLOYEES, MOCK_BRIGADES, UserRole } from '@/data/mockData';
import Icon from '@/components/ui/icon';

const ROLE_LABELS: Record<UserRole, string> = {
  admin: 'Администратор',
  office: 'Офис',
  brigade: 'Бригадир',
  tech: 'Техник',
};

const ROLE_COLORS: Record<UserRole, string> = {
  admin: 'bg-purple-100 text-purple-700',
  office: 'bg-gray-100 text-gray-600',
  brigade: 'bg-blue-100 text-blue-700',
  tech: 'bg-green-100 text-green-700',
};

export default function EmployeesView() {
  const [employees, setEmployees] = useState<Employee[]>(MOCK_EMPLOYEES);
  const [showAdd, setShowAdd] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState({ name: '', login: '', password: '', role: 'tech' as UserRole, brigade: '' });

  const brigades = MOCK_BRIGADES;

  const handleAdd = () => {
    if (!form.name.trim() || !form.login.trim()) return;
    const newEmp: Employee = {
      id: `e${Date.now()}`,
      name: form.name,
      login: form.login,
      role: form.role,
      brigade: form.brigade || undefined,
      hoursThisWeek: 0,
      hoursThisMonth: 0,
    };
    setEmployees(p => [...p, newEmp]);
    setForm({ name: '', login: '', password: '', role: 'tech', brigade: '' });
    setShowAdd(false);
  };

  const handleDelete = (id: string) => {
    setEmployees(p => p.filter(e => e.id !== id));
  };

  return (
    <div className="p-4 md:p-6 space-y-5 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold">Сотрудники</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Управление доступом и учётными данными</p>
        </div>
        <button
          onClick={() => setShowAdd(!showAdd)}
          className="flex items-center gap-2 px-3 py-2 bg-primary text-primary-foreground text-sm rounded-lg hover:opacity-90 transition-opacity"
        >
          <Icon name="UserPlus" size={15} />
          Добавить
        </button>
      </div>

      {/* Add form */}
      {showAdd && (
        <div className="bg-white rounded-xl border border-border p-4 space-y-3 animate-fade-in">
          <h3 className="font-semibold text-sm">Новый сотрудник</h3>
          <div className="grid grid-cols-2 gap-2">
            <input
              className="px-3 py-2 text-sm rounded-lg border border-border col-span-2 focus:outline-none"
              placeholder="Полное имя"
              value={form.name}
              onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
            />
            <input
              className="px-3 py-2 text-sm rounded-lg border border-border focus:outline-none"
              placeholder="Логин"
              value={form.login}
              onChange={e => setForm(p => ({ ...p, login: e.target.value }))}
            />
            <input
              type="password"
              className="px-3 py-2 text-sm rounded-lg border border-border focus:outline-none"
              placeholder="Пароль"
              value={form.password}
              onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
            />
            <select
              className="px-3 py-2 text-sm rounded-lg border border-border bg-white focus:outline-none"
              value={form.role}
              onChange={e => setForm(p => ({ ...p, role: e.target.value as UserRole }))}
            >
              <option value="tech">Техник</option>
              <option value="brigade">Бригадир</option>
              <option value="office">Офис</option>
              <option value="admin">Администратор</option>
            </select>
            <select
              className="px-3 py-2 text-sm rounded-lg border border-border bg-white focus:outline-none"
              value={form.brigade}
              onChange={e => setForm(p => ({ ...p, brigade: e.target.value }))}
            >
              <option value="">— Бригада (необяз.) —</option>
              {brigades.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
            </select>
          </div>
          <div className="flex gap-2">
            <button onClick={handleAdd}
              className="flex-1 py-2 bg-primary text-primary-foreground text-sm rounded-lg hover:opacity-90 font-medium">
              Создать
            </button>
            <button onClick={() => setShowAdd(false)}
              className="px-4 py-2 bg-secondary text-sm rounded-lg">
              Отмена
            </button>
          </div>
        </div>
      )}

      {/* Employees list */}
      <div className="bg-white rounded-xl border border-border overflow-hidden">
        {employees.map((emp, i) => {
          const brigade = brigades.find(b => b.members.includes(emp.id));
          return (
            <div key={emp.id} className={`flex items-center gap-3 px-4 py-3 ${i < employees.length - 1 ? 'border-b border-border' : ''}`}>
              <div className="w-9 h-9 rounded-full bg-secondary flex items-center justify-center flex-shrink-0 font-semibold text-sm">
                {emp.name.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="font-medium text-sm">{emp.name}</p>
                  <span className={`px-1.5 py-0.5 text-xs rounded-md font-medium ${ROLE_COLORS[emp.role]}`}>
                    {ROLE_LABELS[emp.role]}
                  </span>
                </div>
                <div className="flex items-center gap-2 mt-0.5">
                  <p className="text-xs text-muted-foreground font-mono">@{emp.login}</p>
                  {brigade && (
                    <span className="text-xs text-muted-foreground">· {brigade.name}</span>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setEditId(editId === emp.id ? null : emp.id)}
                  className="p-2 rounded-lg hover:bg-secondary transition-colors"
                  title="Редактировать"
                >
                  <Icon name="Pencil" size={14} className="text-muted-foreground" />
                </button>
                {emp.role !== 'admin' && (
                  <button
                    onClick={() => handleDelete(emp.id)}
                    className="p-2 rounded-lg hover:bg-red-50 hover:text-red-500 transition-colors"
                    title="Удалить"
                  >
                    <Icon name="Trash2" size={14} className="text-muted-foreground" />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

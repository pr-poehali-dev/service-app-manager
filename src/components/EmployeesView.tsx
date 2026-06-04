import { useState, useEffect, useCallback } from 'react';
import { UserRole } from '@/data/mockData';
import { api } from '@/api/client';
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

/* eslint-disable @typescript-eslint/no-explicit-any */
export default function EmployeesView() {
  const [employees, setEmployees] = useState<any[]>([]);
  const [brigades, setBrigades] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ name: '', login: '', password: '', role: 'tech' as UserRole, brigade_id: '' });

  const load = useCallback(async () => {
    try {
      const [emps, brig] = await Promise.all([api.getEmployees(), api.getBrigades()]);
      setEmployees(emps);
      setBrigades(brig);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleAdd = async () => {
    if (!form.name.trim() || !form.login.trim() || saving) return;
    setSaving(true);
    try {
      const created = await api.createEmployee({
        name: form.name,
        login: form.login,
        password: form.password,
        role: form.role,
        brigade_id: form.brigade_id || null,
      });
      setEmployees(p => [...p, created]);
      setForm({ name: '', login: '', password: '', role: 'tech', brigade_id: '' });
      setShowAdd(false);
    } catch (e: any) {
      alert(e.message || 'Ошибка создания');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Удалить сотрудника?')) return;
    try {
      await api.deleteEmployee(id);
      setEmployees(p => p.filter(e => e.id !== id));
    } catch (e: any) {
      alert(e.message || 'Ошибка');
    }
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

      {showAdd && (
        <div className="bg-white rounded-xl border border-border p-4 space-y-3 animate-fade-in">
          <h3 className="font-semibold text-sm">Новый сотрудник</h3>
          <div className="grid grid-cols-2 gap-2">
            <input className="px-3 py-2 text-sm rounded-lg border border-border col-span-2 focus:outline-none"
              placeholder="Полное имя" value={form.name}
              onChange={e => setForm(p => ({ ...p, name: e.target.value }))} />
            <input className="px-3 py-2 text-sm rounded-lg border border-border focus:outline-none"
              placeholder="Логин" value={form.login}
              onChange={e => setForm(p => ({ ...p, login: e.target.value }))} />
            <input type="password" className="px-3 py-2 text-sm rounded-lg border border-border focus:outline-none"
              placeholder="Пароль" value={form.password}
              onChange={e => setForm(p => ({ ...p, password: e.target.value }))} />
            <select className="px-3 py-2 text-sm rounded-lg border border-border bg-white focus:outline-none"
              value={form.role} onChange={e => setForm(p => ({ ...p, role: e.target.value as UserRole }))}>
              <option value="tech">Техник</option>
              <option value="brigade">Бригадир</option>
              <option value="office">Офис</option>
              <option value="admin">Администратор</option>
            </select>
            <select className="px-3 py-2 text-sm rounded-lg border border-border bg-white focus:outline-none"
              value={form.brigade_id} onChange={e => setForm(p => ({ ...p, brigade_id: e.target.value }))}>
              <option value="">— Бригада (необяз.) —</option>
              {brigades.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
            </select>
          </div>
          <div className="flex gap-2">
            <button onClick={handleAdd} disabled={saving}
              className="flex-1 py-2 bg-primary text-primary-foreground text-sm rounded-lg hover:opacity-90 font-medium disabled:opacity-50">
              {saving ? 'Создаём...' : 'Создать'}
            </button>
            <button onClick={() => setShowAdd(false)} className="px-4 py-2 bg-secondary text-sm rounded-lg">
              Отмена
            </button>
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl border border-border overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-sm text-muted-foreground">Загрузка...</div>
        ) : employees.length === 0 ? (
          <div className="p-8 text-center text-sm text-muted-foreground">Нет сотрудников</div>
        ) : employees.map((emp, i) => {
          const role = (emp.role as UserRole) || 'tech';
          return (
            <div key={emp.id} className={`flex items-center gap-3 px-4 py-3 ${i < employees.length - 1 ? 'border-b border-border' : ''}`}>
              <div className="w-9 h-9 rounded-full bg-secondary flex items-center justify-center flex-shrink-0 font-semibold text-sm">
                {emp.name?.charAt(0) || '?'}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="font-medium text-sm">{emp.name}</p>
                  <span className={`px-1.5 py-0.5 text-xs rounded-md font-medium ${ROLE_COLORS[role]}`}>
                    {ROLE_LABELS[role]}
                  </span>
                </div>
                <div className="flex items-center gap-2 mt-0.5">
                  <p className="text-xs text-muted-foreground font-mono">@{emp.login}</p>
                  {emp.brigade_name && (
                    <span className="text-xs text-muted-foreground">· {emp.brigade_name}</span>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-1">
                {emp.role !== 'admin' && (
                  <button onClick={() => handleDelete(emp.id)}
                    className="p-2 rounded-lg hover:bg-red-50 hover:text-red-500 transition-colors" title="Удалить">
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

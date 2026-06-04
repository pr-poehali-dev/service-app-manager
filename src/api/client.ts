/* eslint-disable @typescript-eslint/no-explicit-any */
import func2url from '../../backend/func2url.json';

const BASE = func2url.api;

// Platform doesn't support sub-paths — route via ?r= query param
async function request<T>(route: string, options: RequestInit = {}, extra?: string): Promise<T> {
  const qs = extra ? `?r=${encodeURIComponent(route)}&${extra}` : `?r=${encodeURIComponent(route)}`;
  const res = await fetch(`${BASE}${qs}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || `HTTP ${res.status}`);
  return data as T;
}

export const api = {
  getOrganizations: () => request<{ id: number; name: string }[]>('/organizations'),

  getObjects: () => request<any[]>('/objects'),
  createObject: (data: any) => request<any>('/objects', { method: 'POST', body: JSON.stringify(data) }),
  updateObject: (id: number, data: any) => request<any>(`/objects/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
  deleteObject: (id: number) => request<any>(`/objects/${id}`, { method: 'DELETE' }),

  getTasks: () => request<any[]>('/tasks'),
  createTask: (objectId: number, data: any) =>
    request<any>(`/objects/${objectId}/tasks`, { method: 'POST', body: JSON.stringify(data) }),
  updateTask: (id: number, data: any) => request<any>(`/tasks/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
  deleteTask: (id: number) => request<any>(`/tasks/${id}`, { method: 'DELETE' }),

  getBrigades: () => request<any[]>('/brigades'),
  createBrigade: (data: any) => request<any>('/brigades', { method: 'POST', body: JSON.stringify(data) }),

  getEmployees: () => request<any[]>('/employees'),
  createEmployee: (data: any) => request<any>('/employees', { method: 'POST', body: JSON.stringify(data) }),
  updateEmployee: (id: number, data: any) => request<any>(`/employees/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
  deleteEmployee: (id: number) => request<any>(`/employees/${id}`, { method: 'DELETE' }),

  getStats: () => request<{ employees: any[]; brigades: any[] }>('/stats'),

  getTimeLogs: (period?: 'week' | 'month') =>
    request<any[]>('/time-logs', {}, period ? `period=${period}` : undefined),
  createTimeLog: (data: any) => request<any>('/time-logs', { method: 'POST', body: JSON.stringify(data) }),

  login: (login: string, password: string) =>
    request<{ user: any }>('/auth', { method: 'POST', body: JSON.stringify({ login, password }) }),
};
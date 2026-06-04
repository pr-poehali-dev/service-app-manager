/* eslint-disable @typescript-eslint/no-explicit-any */
import { ObjectItem, Task, StatusType } from '@/data/mockData';

export function normalizeTask(t: any): Task {
  return {
    id: String(t.id),
    title: t.title,
    type: t.type || '',
    status: (t.status as StatusType) || 'ok',
    contact: t.contact || '',
    deadline: t.deadline ? String(t.deadline).split('T')[0] : '',
    description: t.description || '',
    createdAt: t.created_at ? String(t.created_at).split('T')[0] : '',
    startTime: t.start_time || undefined,
    endTime: t.end_time || undefined,
    assignee: t.assignee || undefined,
  };
}

export function normalizeObject(o: any): ObjectItem {
  return {
    id: String(o.id),
    name: o.name,
    organization: o.organization_name || '',
    address: o.address || '',
    lat: o.lat || 0,
    lng: o.lng || 0,
    contact: o.contact || '',
    contactPhone: o.contact_phone || '',
    requisites: o.requisites || '',
    inn: o.inn || '',
    systems: o.systems || [],
    status: (o.status as StatusType) || 'ok',
    tasks: (o.tasks || []).map(normalizeTask),
  };
}

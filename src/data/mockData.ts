export type StatusType = 'ok' | 'maintenance' | 'repair' | 'urgent';
export type UserRole = 'admin' | 'office' | 'brigade' | 'tech';

export const STATUS_CONFIG = {
  ok: { label: 'Всё исправно', color: '#22c55e', bg: 'status-ok-bg', text: 'status-ok-text', dot: 'status-ok' },
  maintenance: { label: 'Техобслуживание', color: '#3b82f6', bg: 'status-maintenance-bg', text: 'status-maintenance-text', dot: 'status-maintenance' },
  repair: { label: 'Плановый ремонт', color: '#f59e0b', bg: 'status-repair-bg', text: 'status-repair-text', dot: 'status-repair' },
  urgent: { label: 'Срочный выезд', color: '#ef4444', bg: 'status-urgent-bg', text: 'status-urgent-text', dot: 'status-urgent' },
};

export const ORGANIZATIONS = [
  'ООО "Маяк-Калуга"',
  'ИП Ястребков Н.И.',
  'ИП Ястребков Р.Н.',
  'ИП Шелепин А.С.',
  'ИП Фролов О.Е.',
];

export interface Task {
  id: string;
  title: string;
  type: string;
  status: StatusType;
  contact: string;
  deadline: string;
  description: string;
  createdAt: string;
  startTime?: string;
  endTime?: string;
  assignee?: string;
}

export interface ObjectItem {
  id: string;
  name: string;
  organization: string;
  address: string;
  lat: number;
  lng: number;
  contact: string;
  contactPhone: string;
  requisites: string;
  inn: string;
  systems: string[];
  tasks: Task[];
  status: StatusType;
}

export interface Employee {
  id: string;
  name: string;
  login: string;
  role: UserRole;
  brigade?: string;
  hoursThisWeek: number;
  hoursThisMonth: number;
}

export interface Brigade {
  id: string;
  name: string;
  members: string[];
  currentTasks: string[];
  hoursThisWeek: number;
  hoursThisMonth: number;
}

export const MOCK_OBJECTS: ObjectItem[] = [
  {
    id: '1',
    name: 'ТЦ "Галерея"',
    organization: 'ООО "Маяк-Калуга"',
    address: 'Калуга, ул. Кирова, 34',
    lat: 54.5126,
    lng: 36.2613,
    contact: 'Петров Андрей Сергеевич',
    contactPhone: '+7 910 123-45-67',
    requisites: 'ООО "Маяк-Калуга", ИНН 4027123456',
    inn: '4027123456',
    systems: ['Вентиляция', 'Кондиционирование', 'Пожарная сигнализация', 'Видеонаблюдение'],
    status: 'urgent',
    tasks: [
      {
        id: 't1',
        title: 'Замена компрессора кондиционера',
        type: 'Замена оборудования',
        status: 'urgent',
        contact: 'Петров А.С.',
        deadline: '2026-06-05',
        description: 'Вышел из строя компрессор центрального кондиционера, зал +28°C',
        createdAt: '2026-06-04',
        assignee: 'Бригада Альфа',
      },
    ],
  },
  {
    id: '2',
    name: 'Офис "Технопарк"',
    organization: 'ИП Ястребков Н.И.',
    address: 'Калуга, пр. Ленина, 74',
    lat: 54.5085,
    lng: 36.2520,
    contact: 'Смирнова Ольга Викторовна',
    contactPhone: '+7 903 987-65-43',
    requisites: 'ИП Ястребков Н.И., ИНН 402700123456',
    inn: '402700123456',
    systems: ['Электроснабжение', 'Вентиляция', 'Охрана периметра'],
    status: 'repair',
    tasks: [
      {
        id: 't2',
        title: 'Плановая замена фильтров вентиляции',
        type: 'Плановый ремонт',
        status: 'repair',
        contact: 'Смирнова О.В.',
        deadline: '2026-06-15',
        description: 'Замена воздушных фильтров в системе вентиляции, плановое ТО',
        createdAt: '2026-06-01',
        assignee: 'Бригада Бета',
      },
    ],
  },
  {
    id: '3',
    name: 'Склад "Северный"',
    organization: 'ИП Ястребков Р.Н.',
    address: 'Калуга, ул. Московская, 212',
    lat: 54.5310,
    lng: 36.2890,
    contact: 'Козлов Дмитрий Иванович',
    contactPhone: '+7 915 555-11-22',
    requisites: 'ИП Ястребков Р.Н., ИНН 402701234567',
    inn: '402701234567',
    systems: ['Электроснабжение', 'Пожарная сигнализация', 'Ворота автоматические'],
    status: 'maintenance',
    tasks: [
      {
        id: 't3',
        title: 'ТО электрощита',
        type: 'Техобслуживание',
        status: 'maintenance',
        contact: 'Козлов Д.И.',
        deadline: '2026-06-20',
        description: 'Плановое техническое обслуживание главного распределительного щита',
        createdAt: '2026-06-03',
        assignee: 'Бригада Альфа',
      },
    ],
  },
  {
    id: '4',
    name: 'Ресторан "Причал"',
    organization: 'ИП Шелепин А.С.',
    address: 'Калуга, набережная Яченского вдхр., 1',
    lat: 54.4980,
    lng: 36.2750,
    contact: 'Шелепин Александр Сергеевич',
    contactPhone: '+7 920 777-88-99',
    requisites: 'ИП Шелепин А.С., ИНН 402712345678',
    inn: '402712345678',
    systems: ['Холодильное оборудование', 'Вентиляция кухни', 'Кондиционирование'],
    status: 'ok',
    tasks: [],
  },
  {
    id: '5',
    name: 'АЗС "Энергия"',
    organization: 'ИП Фролов О.Е.',
    address: 'Калуга, ул. Тульская, 55',
    lat: 54.5200,
    lng: 36.3100,
    contact: 'Фролов Олег Евгеньевич',
    contactPhone: '+7 905 321-54-87',
    requisites: 'ИП Фролов О.Е., ИНН 402723456789',
    inn: '402723456789',
    systems: ['Насосное оборудование', 'Система мониторинга топлива', 'Видеонаблюдение', 'Освещение'],
    status: 'repair',
    tasks: [
      {
        id: 't4',
        title: 'Замена насоса №2',
        type: 'Замена оборудования',
        status: 'repair',
        contact: 'Фролов О.Е.',
        deadline: '2026-06-18',
        description: 'Насос №2 работает с перебоями, необходима замена',
        createdAt: '2026-06-02',
        assignee: 'Бригада Бета',
      },
    ],
  },
  {
    id: '6',
    name: 'БЦ "Центральный"',
    organization: 'ООО "Маяк-Калуга"',
    address: 'Калуга, ул. Суворова, 121',
    lat: 54.5050,
    lng: 36.2580,
    contact: 'Новикова Татьяна Павловна',
    contactPhone: '+7 912 444-33-22',
    requisites: 'ООО "Маяк-Калуга", ИНН 4027123456',
    inn: '4027123456',
    systems: ['Лифтовое оборудование', 'Вентиляция', 'Кондиционирование', 'Электроснабжение'],
    status: 'ok',
    tasks: [],
  },
];

export const MOCK_EMPLOYEES: Employee[] = [
  { id: 'e1', name: 'Иванов Сергей Петрович', login: 'ivanov', role: 'tech', brigade: 'b1', hoursThisWeek: 36, hoursThisMonth: 142 },
  { id: 'e2', name: 'Сидоров Михаил Алексеевич', login: 'sidorov', role: 'tech', brigade: 'b1', hoursThisWeek: 38, hoursThisMonth: 156 },
  { id: 'e3', name: 'Кузнецов Андрей Николаевич', login: 'kuznetsov', role: 'tech', brigade: 'b2', hoursThisWeek: 32, hoursThisMonth: 128 },
  { id: 'e4', name: 'Попов Виктор Дмитриевич', login: 'popov', role: 'tech', brigade: 'b2', hoursThisWeek: 40, hoursThisMonth: 164 },
  { id: 'e5', name: 'Морозова Елена Андреевна', login: 'morozova', role: 'office', hoursThisWeek: 0, hoursThisMonth: 0 },
  { id: 'e6', name: 'Волков Игорь Степанович', login: 'volkov', role: 'office', hoursThisWeek: 0, hoursThisMonth: 0 },
  { id: 'e7', name: 'Администратор', login: 'admin', role: 'admin', hoursThisWeek: 0, hoursThisMonth: 0 },
];

export const MOCK_BRIGADES: Brigade[] = [
  { id: 'b1', name: 'Бригада Альфа', members: ['e1', 'e2'], currentTasks: ['t1', 't3'], hoursThisWeek: 74, hoursThisMonth: 298 },
  { id: 'b2', name: 'Бригада Бета', members: ['e3', 'e4'], currentTasks: ['t2', 't4'], hoursThisWeek: 72, hoursThisMonth: 292 },
];

export const WORK_TYPES = [
  'Техобслуживание',
  'Плановый ремонт',
  'Замена оборудования',
  'Срочный выезд',
  'Диагностика',
  'Монтаж',
  'Пусконаладка',
];

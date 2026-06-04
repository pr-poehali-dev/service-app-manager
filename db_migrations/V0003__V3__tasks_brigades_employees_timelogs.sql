CREATE TABLE t_p84316984_service_app_manager.tasks (
  id SERIAL PRIMARY KEY,
  object_id INTEGER,
  title TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT '',
  status TEXT NOT NULL DEFAULT 'maintenance',
  contact TEXT DEFAULT '',
  deadline DATE,
  description TEXT DEFAULT '',
  assignee TEXT DEFAULT '',
  start_time TIMESTAMPTZ,
  end_time TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE t_p84316984_service_app_manager.brigades (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE t_p84316984_service_app_manager.employees (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  login TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL DEFAULT '',
  role TEXT NOT NULL DEFAULT 'tech',
  brigade_id INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE t_p84316984_service_app_manager.time_logs (
  id SERIAL PRIMARY KEY,
  employee_id INTEGER,
  brigade_id INTEGER,
  log_date DATE NOT NULL DEFAULT CURRENT_DATE,
  start_time TIME,
  end_time TIME,
  object_id INTEGER,
  task_id INTEGER,
  notes TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

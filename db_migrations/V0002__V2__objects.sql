CREATE TABLE t_p84316984_service_app_manager.objects (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  organization_id INTEGER,
  address TEXT NOT NULL DEFAULT '',
  lat DOUBLE PRECISION DEFAULT 0,
  lng DOUBLE PRECISION DEFAULT 0,
  contact TEXT DEFAULT '',
  contact_phone TEXT DEFAULT '',
  requisites TEXT DEFAULT '',
  inn TEXT DEFAULT '',
  systems TEXT[] DEFAULT '{}',
  status TEXT NOT NULL DEFAULT 'ok',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

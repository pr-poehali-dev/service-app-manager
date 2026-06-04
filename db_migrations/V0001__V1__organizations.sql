CREATE TABLE IF NOT EXISTS t_p84316984_service_app_manager.organizations (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

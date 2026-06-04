INSERT INTO t_p84316984_service_app_manager.organizations (name) VALUES
  ('ООО "Маяк-Калуга"'),
  ('ИП Ястребков Н.И.'),
  ('ИП Ястребков Р.Н.'),
  ('ИП Шелепин А.С.'),
  ('ИП Фролов О.Е.')
ON CONFLICT (name) DO NOTHING;

INSERT INTO t_p84316984_service_app_manager.brigades (name) VALUES
  ('Бригада Альфа'),
  ('Бригада Бета')
ON CONFLICT (name) DO NOTHING;

INSERT INTO t_p84316984_service_app_manager.employees (name, login, password_hash, role) VALUES
  ('Администратор', 'admin', 'admin123', 'admin')
ON CONFLICT (login) DO NOTHING;

INSERT INTO t_p84316984_service_app_manager.employees (name, login, password_hash, role, brigade_id) VALUES
  ('Иванов Сергей Петрович', 'ivanov', 'pass123', 'tech',
    (SELECT id FROM t_p84316984_service_app_manager.brigades WHERE name='Бригада Альфа')),
  ('Сидоров Михаил Алексеевич', 'sidorov', 'pass123', 'tech',
    (SELECT id FROM t_p84316984_service_app_manager.brigades WHERE name='Бригада Альфа')),
  ('Кузнецов Андрей Николаевич', 'kuznetsov', 'pass123', 'tech',
    (SELECT id FROM t_p84316984_service_app_manager.brigades WHERE name='Бригада Бета')),
  ('Попов Виктор Дмитриевич', 'popov', 'pass123', 'tech',
    (SELECT id FROM t_p84316984_service_app_manager.brigades WHERE name='Бригада Бета')),
  ('Морозова Елена Андреевна', 'morozova', 'pass123', 'office', NULL),
  ('Волков Игорь Степанович', 'volkov', 'pass123', 'office', NULL)
ON CONFLICT (login) DO NOTHING;

INSERT INTO t_p84316984_service_app_manager.objects (name, organization_id, address, lat, lng, contact, contact_phone, requisites, inn, systems, status)
SELECT 'ТЦ "Галерея"',
  (SELECT id FROM t_p84316984_service_app_manager.organizations WHERE name='ООО "Маяк-Калуга"'),
  'Калуга, ул. Кирова, 34', 54.5126, 36.2613,
  'Петров Андрей Сергеевич', '+7 910 123-45-67',
  'ООО "Маяк-Калуга", ИНН 4027123456', '4027123456',
  ARRAY['Вентиляция','Кондиционирование','Пожарная сигнализация','Видеонаблюдение'], 'urgent'
WHERE NOT EXISTS (SELECT 1 FROM t_p84316984_service_app_manager.objects WHERE name='ТЦ "Галерея"');

INSERT INTO t_p84316984_service_app_manager.objects (name, organization_id, address, lat, lng, contact, contact_phone, requisites, inn, systems, status)
SELECT 'Офис "Технопарк"',
  (SELECT id FROM t_p84316984_service_app_manager.organizations WHERE name='ИП Ястребков Н.И.'),
  'Калуга, пр. Ленина, 74', 54.5085, 36.2520,
  'Смирнова Ольга Викторовна', '+7 903 987-65-43',
  'ИП Ястребков Н.И., ИНН 402700123456', '402700123456',
  ARRAY['Электроснабжение','Вентиляция','Охрана периметра'], 'repair'
WHERE NOT EXISTS (SELECT 1 FROM t_p84316984_service_app_manager.objects WHERE name='Офис "Технопарк"');

INSERT INTO t_p84316984_service_app_manager.objects (name, organization_id, address, lat, lng, contact, contact_phone, requisites, inn, systems, status)
SELECT 'Склад "Северный"',
  (SELECT id FROM t_p84316984_service_app_manager.organizations WHERE name='ИП Ястребков Р.Н.'),
  'Калуга, ул. Московская, 212', 54.5310, 36.2890,
  'Козлов Дмитрий Иванович', '+7 915 555-11-22',
  'ИП Ястребков Р.Н., ИНН 402701234567', '402701234567',
  ARRAY['Электроснабжение','Пожарная сигнализация','Ворота автоматические'], 'maintenance'
WHERE NOT EXISTS (SELECT 1 FROM t_p84316984_service_app_manager.objects WHERE name='Склад "Северный"');

INSERT INTO t_p84316984_service_app_manager.objects (name, organization_id, address, lat, lng, contact, contact_phone, requisites, inn, systems, status)
SELECT 'Ресторан "Причал"',
  (SELECT id FROM t_p84316984_service_app_manager.organizations WHERE name='ИП Шелепин А.С.'),
  'Калуга, набережная Яченского вдхр., 1', 54.4980, 36.2750,
  'Шелепин Александр Сергеевич', '+7 920 777-88-99',
  'ИП Шелепин А.С., ИНН 402712345678', '402712345678',
  ARRAY['Холодильное оборудование','Вентиляция кухни','Кондиционирование'], 'ok'
WHERE NOT EXISTS (SELECT 1 FROM t_p84316984_service_app_manager.objects WHERE name='Ресторан "Причал"');

INSERT INTO t_p84316984_service_app_manager.objects (name, organization_id, address, lat, lng, contact, contact_phone, requisites, inn, systems, status)
SELECT 'АЗС "Энергия"',
  (SELECT id FROM t_p84316984_service_app_manager.organizations WHERE name='ИП Фролов О.Е.'),
  'Калуга, ул. Тульская, 55', 54.5200, 36.3100,
  'Фролов Олег Евгеньевич', '+7 905 321-54-87',
  'ИП Фролов О.Е., ИНН 402723456789', '402723456789',
  ARRAY['Насосное оборудование','Система мониторинга топлива','Видеонаблюдение','Освещение'], 'repair'
WHERE NOT EXISTS (SELECT 1 FROM t_p84316984_service_app_manager.objects WHERE name='АЗС "Энергия"');

INSERT INTO t_p84316984_service_app_manager.objects (name, organization_id, address, lat, lng, contact, contact_phone, requisites, inn, systems, status)
SELECT 'БЦ "Центральный"',
  (SELECT id FROM t_p84316984_service_app_manager.organizations WHERE name='ООО "Маяк-Калуга"'),
  'Калуга, ул. Суворова, 121', 54.5050, 36.2580,
  'Новикова Татьяна Павловна', '+7 912 444-33-22',
  'ООО "Маяк-Калуга", ИНН 4027123456', '4027123456',
  ARRAY['Лифтовое оборудование','Вентиляция','Кондиционирование','Электроснабжение'], 'ok'
WHERE NOT EXISTS (SELECT 1 FROM t_p84316984_service_app_manager.objects WHERE name='БЦ "Центральный"');

INSERT INTO t_p84316984_service_app_manager.tasks (object_id, title, type, status, contact, deadline, description, assignee)
SELECT
  (SELECT id FROM t_p84316984_service_app_manager.objects WHERE name='ТЦ "Галерея"'),
  'Замена компрессора кондиционера', 'Замена оборудования', 'urgent',
  'Петров А.С.', '2026-06-10',
  'Вышел из строя компрессор центрального кондиционера', 'Бригада Альфа'
WHERE NOT EXISTS (SELECT 1 FROM t_p84316984_service_app_manager.tasks WHERE title='Замена компрессора кондиционера');

INSERT INTO t_p84316984_service_app_manager.tasks (object_id, title, type, status, contact, deadline, description, assignee)
SELECT
  (SELECT id FROM t_p84316984_service_app_manager.objects WHERE name='Офис "Технопарк"'),
  'Плановая замена фильтров вентиляции', 'Плановый ремонт', 'repair',
  'Смирнова О.В.', '2026-06-20',
  'Замена воздушных фильтров в системе вентиляции', 'Бригада Бета'
WHERE NOT EXISTS (SELECT 1 FROM t_p84316984_service_app_manager.tasks WHERE title='Плановая замена фильтров вентиляции');

INSERT INTO t_p84316984_service_app_manager.tasks (object_id, title, type, status, contact, deadline, description, assignee)
SELECT
  (SELECT id FROM t_p84316984_service_app_manager.objects WHERE name='Склад "Северный"'),
  'ТО электрощита', 'Техобслуживание', 'maintenance',
  'Козлов Д.И.', '2026-06-25',
  'Плановое ТО главного распределительного щита', 'Бригада Альфа'
WHERE NOT EXISTS (SELECT 1 FROM t_p84316984_service_app_manager.tasks WHERE title='ТО электрощита');

INSERT INTO t_p84316984_service_app_manager.tasks (object_id, title, type, status, contact, deadline, description, assignee)
SELECT
  (SELECT id FROM t_p84316984_service_app_manager.objects WHERE name='АЗС "Энергия"'),
  'Замена насоса N2', 'Замена оборудования', 'repair',
  'Фролов О.Е.', '2026-06-22',
  'Насос N2 работает с перебоями, необходима замена', 'Бригада Бета'
WHERE NOT EXISTS (SELECT 1 FROM t_p84316984_service_app_manager.tasks WHERE title='Замена насоса N2');

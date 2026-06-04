"""
Главный API для управления объектами обслуживания. v2
Маршруты: объекты, задачи, сотрудники, бригады, учёт времени.
"""
import json
import os
import psycopg2
from psycopg2.extras import RealDictCursor

SCHEMA = 't_p84316984_service_app_manager'

CORS_HEADERS = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, X-User-Id, X-Auth-Token',
    'Content-Type': 'application/json',
}


def get_conn():
    return psycopg2.connect(os.environ['DATABASE_URL'], cursor_factory=RealDictCursor)


def ok(data):
    return {'statusCode': 200, 'headers': CORS_HEADERS, 'body': json.dumps(data, default=str)}


def err(msg, code=400):
    return {'statusCode': code, 'headers': CORS_HEADERS, 'body': json.dumps({'error': msg})}


def handler(event: dict, context) -> dict:
    """API: объекты, задачи, сотрудники, бригады, учёт времени."""
    if event.get('httpMethod') == 'OPTIONS':
        return {'statusCode': 200, 'headers': CORS_HEADERS, 'body': ''}

    method = event.get('httpMethod', 'GET')
    qs = event.get('queryStringParameters') or {}
    # Route comes as ?r=/objects/1/tasks (URL-encoded) — fallback to path
    from urllib.parse import unquote
    route = unquote(qs.get('r') or event.get('path', '/'))
    body = {}
    if event.get('body'):
        try:
            body = json.loads(event['body'])
        except Exception:
            pass

    parts = [p for p in route.strip('/').split('/') if p]
    # parts[0] = resource, parts[1] = id (optional), parts[2] = sub-resource

    conn = get_conn()
    cur = conn.cursor()

    try:
        # ─── ORGANIZATIONS ───────────────────────────────────────────────
        if parts and parts[0] == 'organizations':
            if method == 'GET':
                cur.execute(f'SELECT * FROM {SCHEMA}.organizations ORDER BY name')
                return ok(list(cur.fetchall()))
            if method == 'POST':
                name = body.get('name', '').strip()
                if not name:
                    return err('name required')
                cur.execute(f"INSERT INTO {SCHEMA}.organizations(name) VALUES(%s) RETURNING *", (name,))
                conn.commit()
                return ok(dict(cur.fetchone()))

        # ─── OBJECTS ─────────────────────────────────────────────────────
        elif parts and parts[0] == 'objects':
            if len(parts) == 1:
                if method == 'GET':
                    cur.execute(f'''
                        SELECT o.*, org.name as organization_name
                        FROM {SCHEMA}.objects o
                        LEFT JOIN {SCHEMA}.organizations org ON org.id = o.organization_id
                        ORDER BY o.created_at
                    ''')
                    objects = [dict(r) for r in cur.fetchall()]
                    # Attach tasks
                    for obj in objects:
                        cur.execute(f'SELECT * FROM {SCHEMA}.tasks WHERE object_id=%s ORDER BY created_at', (obj['id'],))
                        obj['tasks'] = [dict(t) for t in cur.fetchall()]
                    return ok(objects)

                if method == 'POST':
                    r = body
                    cur.execute(f'''
                        INSERT INTO {SCHEMA}.objects(name, organization_id, address, lat, lng, contact, contact_phone, requisites, inn, systems, status)
                        VALUES(%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s) RETURNING *
                    ''', (
                        r.get('name'), r.get('organization_id'), r.get('address', ''),
                        r.get('lat', 0), r.get('lng', 0),
                        r.get('contact', ''), r.get('contact_phone', ''),
                        r.get('requisites', ''), r.get('inn', ''),
                        r.get('systems', []), r.get('status', 'ok'),
                    ))
                    conn.commit()
                    obj = dict(cur.fetchone())
                    obj['tasks'] = []
                    return ok(obj)

            elif len(parts) >= 2:
                obj_id = parts[1]

                # Tasks sub-resource
                if len(parts) == 3 and parts[2] == 'tasks':
                    if method == 'GET':
                        cur.execute(f'SELECT * FROM {SCHEMA}.tasks WHERE object_id=%s ORDER BY created_at', (obj_id,))
                        return ok(list(cur.fetchall()))
                    if method == 'POST':
                        r = body
                        cur.execute(f'''
                            INSERT INTO {SCHEMA}.tasks(object_id, title, type, status, contact, deadline, description, assignee)
                            VALUES(%s,%s,%s,%s,%s,%s,%s,%s) RETURNING *
                        ''', (
                            obj_id, r.get('title'), r.get('type', ''),
                            r.get('status', 'maintenance'), r.get('contact', ''),
                            r.get('deadline') or None, r.get('description', ''),
                            r.get('assignee', ''),
                        ))
                        task = dict(cur.fetchone())
                        # Recalculate object status
                        _recalc_object_status(cur, obj_id)
                        conn.commit()
                        return ok(task)

                # Single object operations
                if method == 'PUT' or method == 'PATCH':
                    r = body
                    cur.execute(f'''
                        UPDATE {SCHEMA}.objects SET
                            name=COALESCE(%s, name),
                            organization_id=COALESCE(%s, organization_id),
                            address=COALESCE(%s, address),
                            lat=COALESCE(%s, lat),
                            lng=COALESCE(%s, lng),
                            contact=COALESCE(%s, contact),
                            contact_phone=COALESCE(%s, contact_phone),
                            requisites=COALESCE(%s, requisites),
                            inn=COALESCE(%s, inn),
                            systems=COALESCE(%s, systems),
                            status=COALESCE(%s, status)
                        WHERE id=%s RETURNING *
                    ''', (
                        r.get('name'), r.get('organization_id'), r.get('address'),
                        r.get('lat'), r.get('lng'), r.get('contact'), r.get('contact_phone'),
                        r.get('requisites'), r.get('inn'), r.get('systems'), r.get('status'),
                        obj_id,
                    ))
                    conn.commit()
                    row = cur.fetchone()
                    if not row:
                        return err('not found', 404)
                    obj = dict(row)
                    cur.execute(f'SELECT * FROM {SCHEMA}.tasks WHERE object_id=%s', (obj_id,))
                    obj['tasks'] = [dict(t) for t in cur.fetchall()]
                    return ok(obj)

                if method == 'DELETE':
                    cur.execute(f'UPDATE {SCHEMA}.objects SET status=%s WHERE id=%s', ('ok', obj_id))
                    conn.commit()
                    return ok({'deleted': True, 'id': obj_id})

        # ─── TASKS ───────────────────────────────────────────────────────
        elif parts and parts[0] == 'tasks':
            if len(parts) == 1 and method == 'GET':
                cur.execute(f'''
                    SELECT t.*, o.name as object_name
                    FROM {SCHEMA}.tasks t
                    LEFT JOIN {SCHEMA}.objects o ON o.id = t.object_id
                    ORDER BY
                        CASE t.status WHEN 'urgent' THEN 1 WHEN 'repair' THEN 2 WHEN 'maintenance' THEN 3 ELSE 4 END,
                        t.created_at DESC
                ''')
                return ok(list(cur.fetchall()))

            elif len(parts) == 2:
                task_id = parts[1]
                if method == 'PATCH' or method == 'PUT':
                    r = body
                    cur.execute(f'''
                        UPDATE {SCHEMA}.tasks SET
                            title=COALESCE(%s, title),
                            type=COALESCE(%s, type),
                            status=COALESCE(%s, status),
                            contact=COALESCE(%s, contact),
                            deadline=COALESCE(%s::date, deadline),
                            description=COALESCE(%s, description),
                            assignee=COALESCE(%s, assignee),
                            start_time=COALESCE(%s::timestamptz, start_time),
                            end_time=COALESCE(%s::timestamptz, end_time)
                        WHERE id=%s RETURNING *
                    ''', (
                        r.get('title'), r.get('type'), r.get('status'),
                        r.get('contact'), r.get('deadline'), r.get('description'),
                        r.get('assignee'), r.get('start_time'), r.get('end_time'),
                        task_id,
                    ))
                    task = cur.fetchone()
                    if task:
                        _recalc_object_status(cur, task['object_id'])
                    conn.commit()
                    return ok(dict(task) if task else {})

                if method == 'DELETE':
                    cur.execute(f'SELECT object_id FROM {SCHEMA}.tasks WHERE id=%s', (task_id,))
                    row = cur.fetchone()
                    if row:
                        cur.execute(f'UPDATE {SCHEMA}.tasks SET status=%s WHERE id=%s', ('ok', task_id))
                        _recalc_object_status(cur, row['object_id'])
                        conn.commit()
                    return ok({'deleted': True})

        # ─── BRIGADES ────────────────────────────────────────────────────
        elif parts and parts[0] == 'brigades':
            if method == 'GET':
                cur.execute(f'SELECT * FROM {SCHEMA}.brigades ORDER BY name')
                brigades = [dict(r) for r in cur.fetchall()]
                for b in brigades:
                    cur.execute(f'SELECT * FROM {SCHEMA}.employees WHERE brigade_id=%s', (b['id'],))
                    b['members'] = [dict(e) for e in cur.fetchall()]
                return ok(brigades)
            if method == 'POST':
                name = body.get('name', '').strip()
                if not name:
                    return err('name required')
                cur.execute(f"INSERT INTO {SCHEMA}.brigades(name) VALUES(%s) RETURNING *", (name,))
                conn.commit()
                brigade = dict(cur.fetchone())
                brigade['members'] = []
                return ok(brigade)

        # ─── EMPLOYEES ───────────────────────────────────────────────────
        elif parts and parts[0] == 'employees':
            if len(parts) == 1:
                if method == 'GET':
                    cur.execute(f'''
                        SELECT e.*, b.name as brigade_name
                        FROM {SCHEMA}.employees e
                        LEFT JOIN {SCHEMA}.brigades b ON b.id = e.brigade_id
                        ORDER BY e.name
                    ''')
                    emps = [dict(r) for r in cur.fetchall()]
                    for e in emps:
                        e.pop('password_hash', None)
                    return ok(emps)

                if method == 'POST':
                    r = body
                    login = r.get('login', '').strip()
                    if not login:
                        return err('login required')
                    cur.execute(f'''
                        INSERT INTO {SCHEMA}.employees(name, login, password_hash, role, brigade_id)
                        VALUES(%s,%s,%s,%s,%s) RETURNING *
                    ''', (
                        r.get('name', ''), login,
                        r.get('password', ''),
                        r.get('role', 'tech'),
                        r.get('brigade_id') or None,
                    ))
                    conn.commit()
                    emp = dict(cur.fetchone())
                    emp.pop('password_hash', None)
                    return ok(emp)

            elif len(parts) == 2:
                emp_id = parts[1]
                if method == 'PATCH' or method == 'PUT':
                    r = body
                    cur.execute(f'''
                        UPDATE {SCHEMA}.employees SET
                            name=COALESCE(%s, name),
                            login=COALESCE(%s, login),
                            role=COALESCE(%s, role),
                            brigade_id=COALESCE(%s, brigade_id)
                            {", password_hash=%s" if r.get('password') else ""}
                        WHERE id=%s RETURNING *
                    ''', (
                        *([r.get('name'), r.get('login'), r.get('role'), r.get('brigade_id')] +
                          ([r.get('password')] if r.get('password') else [])),
                        emp_id,
                    ))
                    conn.commit()
                    emp = cur.fetchone()
                    if emp:
                        emp = dict(emp)
                        emp.pop('password_hash', None)
                    return ok(emp or {})

                if method == 'DELETE':
                    cur.execute(f'UPDATE {SCHEMA}.employees SET role=%s WHERE id=%s', ('tech', emp_id))
                    conn.commit()
                    return ok({'deleted': True})

        # ─── TIME LOGS ───────────────────────────────────────────────────
        elif parts and parts[0] == 'time-logs':
            if method == 'GET':
                period = (event.get('queryStringParameters') or {}).get('period', 'week')
                if period == 'month':
                    date_filter = "log_date >= date_trunc('month', CURRENT_DATE)"
                else:
                    date_filter = "log_date >= date_trunc('week', CURRENT_DATE)"

                cur.execute(f'''
                    SELECT tl.*, e.name as employee_name, b.name as brigade_name
                    FROM {SCHEMA}.time_logs tl
                    LEFT JOIN {SCHEMA}.employees e ON e.id = tl.employee_id
                    LEFT JOIN {SCHEMA}.brigades b ON b.id = tl.brigade_id
                    WHERE {date_filter}
                    ORDER BY tl.log_date DESC, tl.created_at DESC
                ''')
                return ok(list(cur.fetchall()))

            if method == 'POST':
                r = body
                cur.execute(f'''
                    INSERT INTO {SCHEMA}.time_logs(employee_id, brigade_id, log_date, start_time, end_time, object_id, task_id, notes)
                    VALUES(%s,%s,%s,%s,%s,%s,%s,%s) RETURNING *
                ''', (
                    r.get('employee_id'), r.get('brigade_id') or None,
                    r.get('log_date') or 'today',
                    r.get('start_time') or None, r.get('end_time') or None,
                    r.get('object_id') or None, r.get('task_id') or None,
                    r.get('notes', ''),
                ))
                conn.commit()
                return ok(dict(cur.fetchone()))

        # ─── AUTH ─────────────────────────────────────────────────────────
        elif parts and parts[0] == 'auth':
            if method == 'POST':
                login = body.get('login', '').strip()
                password = body.get('password', '').strip()
                cur.execute(f'''
                    SELECT e.*, b.name as brigade_name
                    FROM {SCHEMA}.employees e
                    LEFT JOIN {SCHEMA}.brigades b ON b.id = e.brigade_id
                    WHERE e.login=%s AND e.password_hash=%s
                ''', (login, password))
                emp = cur.fetchone()
                if not emp:
                    return err('Неверный логин или пароль', 401)
                emp = dict(emp)
                emp.pop('password_hash', None)
                return ok({'user': emp})

        # ─── STATS ────────────────────────────────────────────────────────
        elif parts and parts[0] == 'stats':
            cur.execute(f'''
                SELECT e.id, e.name, e.role, e.brigade_id, b.name as brigade_name,
                    COALESCE(SUM(CASE WHEN tl.log_date >= date_trunc('week', CURRENT_DATE)
                        THEN EXTRACT(EPOCH FROM (tl.end_time - tl.start_time))/3600 ELSE 0 END), 0) as hours_week,
                    COALESCE(SUM(CASE WHEN tl.log_date >= date_trunc('month', CURRENT_DATE)
                        THEN EXTRACT(EPOCH FROM (tl.end_time - tl.start_time))/3600 ELSE 0 END), 0) as hours_month
                FROM {SCHEMA}.employees e
                LEFT JOIN {SCHEMA}.brigades b ON b.id = e.brigade_id
                LEFT JOIN {SCHEMA}.time_logs tl ON tl.employee_id = e.id
                WHERE e.role NOT IN ('office', 'admin')
                GROUP BY e.id, e.name, e.role, e.brigade_id, b.name
                ORDER BY e.name
            ''')
            employees = list(cur.fetchall())

            cur.execute(f'''
                SELECT b.id, b.name,
                    COALESCE(SUM(CASE WHEN tl.log_date >= date_trunc('week', CURRENT_DATE)
                        THEN EXTRACT(EPOCH FROM (tl.end_time - tl.start_time))/3600 ELSE 0 END), 0) as hours_week,
                    COALESCE(SUM(CASE WHEN tl.log_date >= date_trunc('month', CURRENT_DATE)
                        THEN EXTRACT(EPOCH FROM (tl.end_time - tl.start_time))/3600 ELSE 0 END), 0) as hours_month
                FROM {SCHEMA}.brigades b
                LEFT JOIN {SCHEMA}.time_logs tl ON tl.brigade_id = b.id
                GROUP BY b.id, b.name
                ORDER BY b.name
            ''')
            brigades = list(cur.fetchall())

            return ok({'employees': employees, 'brigades': brigades})

        return err('Not found', 404)

    except Exception as e:
        conn.rollback()
        return err(str(e), 500)
    finally:
        cur.close()
        conn.close()


def _recalc_object_status(cur, object_id):
    """Пересчитать статус объекта по активным задачам."""
    cur.execute(f'''
        SELECT status FROM {SCHEMA}.tasks
        WHERE object_id=%s AND status != 'ok'
        ORDER BY CASE status WHEN 'urgent' THEN 1 WHEN 'repair' THEN 2 WHEN 'maintenance' THEN 3 ELSE 4 END
        LIMIT 1
    ''', (object_id,))
    row = cur.fetchone()
    new_status = row['status'] if row else 'ok'
    cur.execute(f"UPDATE {SCHEMA}.objects SET status=%s WHERE id=%s", (new_status, object_id))
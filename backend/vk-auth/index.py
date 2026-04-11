"""
VK OAuth авторизация для администраторов.
Действия: vk_url, callback, me, approve, reject, users, site_data, save_site_data
"""
import json
import os
import hmac
import hashlib
import base64
import time
import urllib.request
import urllib.parse
import psycopg2

CORS = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, X-Authorization",
}

SUPER_ADMIN_VK = "soul__shu"

def resp(status, body, extra_headers=None):
    h = {**CORS}
    if extra_headers:
        h.update(extra_headers)
    return {"statusCode": status, "headers": h, "body": json.dumps(body, ensure_ascii=False)}

def get_conn():
    conn = psycopg2.connect(os.environ["DATABASE_URL"])
    schema = os.environ.get("MAIN_DB_SCHEMA", "public")
    cur = conn.cursor()
    cur.execute(f"SET search_path TO {schema}")
    cur.close()
    return conn

def make_token(vk_id: str, role: str) -> str:
    secret = os.environ.get("ADMIN_SECRET_KEY", "fallback-secret")
    payload = base64.b64encode(
        json.dumps({"vk_id": vk_id, "role": role, "t": int(time.time())}).encode()
    ).decode()
    sig = hmac.new(secret.encode(), payload.encode(), hashlib.sha256).hexdigest()
    return f"{payload}.{sig}"

def verify_token(token: str):
    try:
        payload, sig = token.rsplit(".", 1)
        secret = os.environ.get("ADMIN_SECRET_KEY", "fallback-secret")
        expected = hmac.new(secret.encode(), payload.encode(), hashlib.sha256).hexdigest()
        if not hmac.compare_digest(sig, expected):
            return None
        data = json.loads(base64.b64decode(payload).decode())
        if time.time() - data["t"] > 86400 * 30:
            return None
        return data
    except Exception:
        return None

def get_current_user(event):
    token = (event.get("headers") or {}).get("X-Authorization", "").replace("Bearer ", "")
    return verify_token(token)

def handler(event: dict, context) -> dict:
    """VK OAuth: авторизация, одобрение/отклонение пользователей, управление данными сайта."""
    if event.get("httpMethod") == "OPTIONS":
        return {"statusCode": 200, "headers": CORS, "body": ""}

    qs = event.get("queryStringParameters") or {}
    action = qs.get("action", "")

    # ── GET vk_url — возвращает URL для редиректа на VK ──────────────────────
    if action == "vk_url":
        app_id = os.environ.get("VK_APP_ID", "")
        redirect_uri = qs.get("redirect_uri", "")
        state = qs.get("state", "")
        url = (
            f"https://oauth.vk.com/authorize"
            f"?client_id={app_id}"
            f"&display=page"
            f"&redirect_uri={urllib.parse.quote(redirect_uri, safe='')}"
            f"&scope=email"
            f"&response_type=code"
            f"&v=5.131"
            f"&state={state}"
        )
        return resp(200, {"url": url})

    # ── POST callback — обмен code на токен VK, регистрация/вход ─────────────
    if action == "callback":
        body = json.loads(event.get("body") or "{}")
        code = body.get("code", "")
        redirect_uri = body.get("redirect_uri", "")

        if not code:
            return resp(400, {"error": "Нет кода авторизации"})

        app_id = os.environ.get("VK_APP_ID", "")
        app_secret = os.environ.get("VK_APP_SECRET", "")

        token_url = (
            f"https://oauth.vk.com/access_token"
            f"?client_id={app_id}"
            f"&client_secret={app_secret}"
            f"&redirect_uri={urllib.parse.quote(redirect_uri, safe='')}"
            f"&code={code}"
        )
        with urllib.request.urlopen(token_url) as r:
            vk_token_data = json.loads(r.read().decode())

        if "error" in vk_token_data:
            return resp(400, {"error": "Ошибка VK: " + vk_token_data.get("error_description", "")})

        access_token = vk_token_data["access_token"]
        vk_user_id = str(vk_token_data["user_id"])

        user_url = (
            f"https://api.vk.com/method/users.get"
            f"?user_ids={vk_user_id}"
            f"&fields=photo_100,screen_name"
            f"&access_token={access_token}"
            f"&v=5.131"
        )
        with urllib.request.urlopen(user_url) as r:
            user_data = json.loads(r.read().decode())

        vk_user = user_data["response"][0]
        vk_name = f"{vk_user.get('first_name', '')} {vk_user.get('last_name', '')}".strip()
        vk_avatar = vk_user.get("photo_100", "")
        vk_screen = vk_user.get("screen_name", "")

        conn = get_conn()
        cur = conn.cursor()

        cur.execute("SELECT id, role, approved FROM admins WHERE vk_id = %s", (vk_user_id,))
        existing = cur.fetchone()

        is_super = (vk_screen == SUPER_ADMIN_VK or vk_user_id == SUPER_ADMIN_VK)

        if existing:
            admin_id, role, approved = existing
            cur.execute(
                "UPDATE admins SET vk_name = %s, vk_avatar = %s WHERE vk_id = %s",
                (vk_name, vk_avatar, vk_user_id)
            )
            if is_super and not approved:
                cur.execute(
                    "UPDATE admins SET approved = TRUE, role = 'super_admin' WHERE vk_id = %s",
                    (vk_user_id,)
                )
                role = "super_admin"
                approved = True
            conn.commit()
            conn.close()
            if not approved and not is_super:
                return resp(403, {"error": "pending", "message": "Ваша заявка на доступ ожидает одобрения администратора"})
            token = make_token(vk_user_id, role)
            return resp(200, {"token": token, "vk_name": vk_name, "vk_avatar": vk_avatar, "role": role})
        else:
            role = "super_admin" if is_super else "editor"
            approved = is_super
            cur.execute(
                "INSERT INTO admins (vk_id, vk_name, vk_avatar, role, approved) VALUES (%s, %s, %s, %s, %s)",
                (vk_user_id, vk_name, vk_avatar, role, approved)
            )
            conn.commit()
            conn.close()
            if not approved:
                return resp(403, {"error": "pending", "message": "Заявка отправлена. Ожидайте одобрения администратора"})
            token = make_token(vk_user_id, role)
            return resp(200, {"token": token, "vk_name": vk_name, "vk_avatar": vk_avatar, "role": role})

    # ── GET me — проверка токена ──────────────────────────────────────────────
    if action == "me":
        user = get_current_user(event)
        if not user:
            return resp(401, {"error": "Unauthorized"})
        conn = get_conn()
        cur = conn.cursor()
        cur.execute("SELECT vk_name, vk_avatar, role, approved FROM admins WHERE vk_id = %s", (user["vk_id"],))
        row = cur.fetchone()
        conn.close()
        if not row or not row[3]:
            return resp(403, {"error": "Нет доступа"})
        return resp(200, {"vk_id": user["vk_id"], "vk_name": row[0], "vk_avatar": row[1], "role": row[2]})

    # ── GET users — список всех пользователей (только super_admin) ────────────
    if action == "users":
        user = get_current_user(event)
        if not user or user.get("role") != "super_admin":
            return resp(403, {"error": "Только для главного администратора"})
        conn = get_conn()
        cur = conn.cursor()
        cur.execute("SELECT id, vk_id, vk_name, vk_avatar, role, approved, created_at FROM admins ORDER BY created_at DESC")
        rows = cur.fetchall()
        conn.close()
        users = [{"id": r[0], "vk_id": r[1], "vk_name": r[2], "vk_avatar": r[3], "role": r[4], "approved": r[5], "created_at": str(r[6])} for r in rows]
        return resp(200, {"users": users})

    # ── POST approve — одобрить пользователя ────────────────────────────────
    if action == "approve":
        user = get_current_user(event)
        if not user or user.get("role") != "super_admin":
            return resp(403, {"error": "Только для главного администратора"})
        body = json.loads(event.get("body") or "{}")
        target_id = body.get("vk_id")
        role = body.get("role", "editor")
        if not target_id:
            return resp(400, {"error": "Нет vk_id"})
        conn = get_conn()
        cur = conn.cursor()
        cur.execute("UPDATE admins SET approved = TRUE, role = %s, approved_by = %s WHERE vk_id = %s", (role, user["vk_id"], target_id))
        conn.commit()
        conn.close()
        return resp(200, {"ok": True})

    # ── POST reject — отклонить/удалить пользователя ────────────────────────
    if action == "reject":
        user = get_current_user(event)
        if not user or user.get("role") != "super_admin":
            return resp(403, {"error": "Только для главного администратора"})
        body = json.loads(event.get("body") or "{}")
        target_id = body.get("vk_id")
        if not target_id:
            return resp(400, {"error": "Нет vk_id"})
        conn = get_conn()
        cur = conn.cursor()
        cur.execute("DELETE FROM admins WHERE vk_id = %s", (target_id,))
        conn.commit()
        conn.close()
        return resp(200, {"ok": True})

    # ── GET site_data — получить данные сайта из БД ─────────────────────────
    if action == "site_data":
        user = get_current_user(event)
        if not user:
            return resp(401, {"error": "Unauthorized"})
        conn = get_conn()
        cur = conn.cursor()
        cur.execute("SELECT key, value FROM site_content")
        rows = cur.fetchall()
        conn.close()
        data = {r[0]: json.loads(r[1]) for r in rows}
        return resp(200, {"data": data})

    # ── POST save_site_data — сохранить блок сайта в БД ─────────────────────
    if action == "save_site_data":
        user = get_current_user(event)
        if not user:
            return resp(401, {"error": "Unauthorized"})
        body = json.loads(event.get("body") or "{}")
        key = body.get("key")
        value = body.get("value")
        if not key:
            return resp(400, {"error": "Нет key"})
        conn = get_conn()
        cur = conn.cursor()
        cur.execute(
            "INSERT INTO site_content (key, value, updated_by) VALUES (%s, %s, %s) "
            "ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, updated_by = EXCLUDED.updated_by, updated_at = NOW()",
            (key, json.dumps(value, ensure_ascii=False), user["vk_id"])
        )
        conn.commit()
        conn.close()
        return resp(200, {"ok": True})

    return resp(400, {"error": "Укажите action"})

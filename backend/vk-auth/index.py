"""
Авторизация администраторов по никнейму ВКонтакте.
Действия: login, me, site_data, save_site_data
"""
import json
import os
import hmac
import hashlib
import base64
import time
import psycopg2

CORS = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, X-Authorization",
}

# Белый список: никнейм ВК (строчные, без vk.ru/) -> роль
WHITELIST = {
    "soul__shu":  "super_admin",
    "cccuvigon":  "editor",
}

def resp(status, body):
    return {"statusCode": status, "headers": CORS, "body": json.dumps(body, ensure_ascii=False)}

def get_conn():
    conn = psycopg2.connect(os.environ["DATABASE_URL"])
    schema = os.environ.get("MAIN_DB_SCHEMA", "public")
    cur = conn.cursor()
    cur.execute(f"SET search_path TO {schema}")
    cur.close()
    return conn

def make_token(nickname: str, role: str) -> str:
    secret = os.environ.get("ADMIN_SECRET_KEY", "fallback-secret")
    payload = base64.b64encode(
        json.dumps({"nick": nickname, "role": role, "t": int(time.time())}).encode()
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
        # Перепроверяем: вдруг убрали из вайтлиста
        nick = data.get("nick", "")
        if nick not in WHITELIST:
            return None
        return data
    except Exception:
        return None

def get_current_user(event):
    token = (event.get("headers") or {}).get("X-Authorization", "").replace("Bearer ", "")
    return verify_token(token)

def handler(event: dict, context) -> dict:
    """Авторизация по никнейму ВК, проверка токена, управление данными сайта."""
    if event.get("httpMethod") == "OPTIONS":
        return {"statusCode": 200, "headers": CORS, "body": ""}

    qs = event.get("queryStringParameters") or {}
    action = qs.get("action", "")

    # ── POST login ────────────────────────────────────────────────────────────
    if action == "login":
        body = json.loads(event.get("body") or "{}")
        raw = (body.get("nickname") or "").strip().lower()

        # Чистим ссылку: убираем https://vk.ru/, https://vk.com/, пробелы, @
        for prefix in ["https://vk.ru/", "https://vk.com/", "http://vk.ru/", "http://vk.com/", "vk.ru/", "vk.com/", "@"]:
            if raw.startswith(prefix):
                raw = raw[len(prefix):]
        raw = raw.strip("/").strip()

        if not raw:
            return resp(400, {"error": "Введите никнейм ВКонтакте"})

        role = WHITELIST.get(raw)
        if not role:
            return resp(403, {"error": "denied", "message": "Ой, а вы не администратор…"})

        token = make_token(raw, role)
        return resp(200, {"token": token, "nickname": raw, "role": role})

    # ── GET me ────────────────────────────────────────────────────────────────
    if action == "me":
        user = get_current_user(event)
        if not user:
            return resp(401, {"error": "Unauthorized"})
        nick = user.get("nick", "")
        role = WHITELIST.get(nick)
        if not role:
            return resp(403, {"error": "Нет доступа"})
        return resp(200, {"nickname": nick, "role": role})

    # ── GET site_data ─────────────────────────────────────────────────────────
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

    # ── POST save_site_data ───────────────────────────────────────────────────
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
            (key, json.dumps(value, ensure_ascii=False), user.get("nick", ""))
        )
        conn.commit()
        conn.close()
        return resp(200, {"ok": True})

    return resp(400, {"error": "Укажите action"})

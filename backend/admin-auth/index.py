"""
Аутентификация администраторов: регистрация, вход, проверка токена.
Действие передаётся через ?action=login|register|me
"""
import json
import os
import hashlib
import hmac
import base64
import time
import psycopg2

CORS = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, X-Authorization",
}

def get_conn():
    return psycopg2.connect(os.environ["DATABASE_URL"])

def get_schema():
    return os.environ.get("MAIN_DB_SCHEMA", "public")

def hash_password(password: str) -> str:
    return hashlib.sha256(password.encode()).hexdigest()

def make_token(username: str) -> str:
    secret = os.environ.get("ADMIN_SECRET_KEY", "fallback-secret")
    payload = base64.b64encode(
        json.dumps({"u": username, "t": int(time.time())}).encode()
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
        if time.time() - data["t"] > 86400 * 7:
            return None
        return data["u"]
    except Exception:
        return None

def handler(event: dict, context) -> dict:
    """Регистрация, вход и проверка токена администратора."""
    if event.get("httpMethod") == "OPTIONS":
        return {"statusCode": 200, "headers": CORS, "body": ""}

    qs = event.get("queryStringParameters") or {}
    action = qs.get("action", "")
    method = event.get("httpMethod", "GET")
    schema = get_schema()

    # GET ?action=me — проверка токена
    if action == "me":
        token = (event.get("headers") or {}).get("X-Authorization", "").replace("Bearer ", "")
        username = verify_token(token)
        if not username:
            return {"statusCode": 401, "headers": CORS, "body": json.dumps({"error": "Unauthorized"})}
        return {"statusCode": 200, "headers": CORS, "body": json.dumps({"username": username})}

    if method != "POST":
        return {"statusCode": 405, "headers": CORS, "body": json.dumps({"error": "Method not allowed"})}

    body = json.loads(event.get("body") or "{}")
    username = (body.get("username") or "").strip().lower()
    password = body.get("password") or ""

    if not username or not password:
        return {"statusCode": 400, "headers": CORS, "body": json.dumps({"error": "Заполните все поля"})}

    conn = get_conn()
    cur = conn.cursor()
    cur.execute(f"SET search_path TO {schema}")

    # POST ?action=register
    if action == "register":
        cur.execute("SELECT id FROM admins WHERE username = %s", (username,))
        if cur.fetchone():
            conn.close()
            return {"statusCode": 409, "headers": CORS, "body": json.dumps({"error": "Пользователь уже существует"})}
        cur.execute("SELECT COUNT(*) FROM admins")
        count = cur.fetchone()[0]
        if count >= 5:
            conn.close()
            return {"statusCode": 403, "headers": CORS, "body": json.dumps({"error": "Лимит администраторов достигнут"})}
        pw_hash = hash_password(password)
        cur.execute("INSERT INTO admins (username, password_hash) VALUES (%s, %s)", (username, pw_hash))
        conn.commit()
        conn.close()
        token = make_token(username)
        return {"statusCode": 200, "headers": CORS, "body": json.dumps({"token": token, "username": username})}

    # POST ?action=login
    if action == "login":
        pw_hash = hash_password(password)
        cur.execute(
            "SELECT id FROM admins WHERE username = %s AND password_hash = %s",
            (username, pw_hash)
        )
        row = cur.fetchone()
        conn.close()
        if not row:
            return {"statusCode": 401, "headers": CORS, "body": json.dumps({"error": "Неверный логин или пароль"})}
        token = make_token(username)
        return {"statusCode": 200, "headers": CORS, "body": json.dumps({"token": token, "username": username})}

    conn.close()
    return {"statusCode": 400, "headers": CORS, "body": json.dumps({"error": "Укажите action"})}

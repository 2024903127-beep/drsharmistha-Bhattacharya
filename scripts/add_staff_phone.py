import ssl
import sys
import pg8000.native

HOST = "db.cyreyzeipyvvfuyijqfm.supabase.co"
PORT = 5432
USER = "postgres"
PASSWORD = "xiI4iYiaHT6Ix6LB"
DATABASE = "postgres"

ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

try:
    conn = pg8000.native.Connection(
        user=USER,
        password=PASSWORD,
        host=HOST,
        port=PORT,
        database=DATABASE,
        ssl_context=ctx
    )
    conn.run("ALTER TABLE staff ADD COLUMN IF NOT EXISTS phone text;")
    res = conn.run("SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'staff' ORDER BY ordinal_position;")
    print("Staff table columns:")
    for r in res:
        print(f" - {r[0]}: {r[1]}")
    conn.close()
    print("SUCCESS")
except Exception as e:
    print(f"ERROR: {e}")

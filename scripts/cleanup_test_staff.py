import pg8000.native
import ssl

HOST = "db.cyreyzeipyvvfuyijqfm.supabase.co"
PORT = 5432
USER = "postgres"
PASSWORD = "xiI4iYiaHT6Ix6LB"
DATABASE = "postgres"

ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

conn = pg8000.native.Connection(
    user=USER,
    password=PASSWORD,
    host=HOST,
    port=PORT,
    database=DATABASE,
    ssl_context=ctx
)

# Remove test user
conn.run("DELETE FROM staff WHERE email = 'ananya.reception@gmail.com';")
conn.run("DELETE FROM auth.users WHERE email = 'ananya.reception@gmail.com';")

# List current staff
staff = conn.run("SELECT id, full_name, email, role, phone, active FROM staff;")
print("Current staff members in database:")
for s in staff:
    print(f" - {s[1]} ({s[2]}) | Role: {s[3]} | Phone: {s[4]} | Active: {s[5]}")

conn.close()

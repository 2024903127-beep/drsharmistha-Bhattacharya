import ssl
import sys
import pg8000.native

# Supabase direct postgres connection parameters
HOST = "db.cyreyzeipyvvfuyijqfm.supabase.co"
PORT = 5432
USER = "postgres"
PASSWORD = "xiI4iYiaHT6Ix6LB"
DATABASE = "postgres"

def main():
    print(f"Connecting to {HOST}:{PORT}/{DATABASE} with user {USER}...")
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
        print("Connected successfully!")
    except Exception as e:
        print(f"Connection failed: {e}")
        sys.exit(1)

    # Read migration file
    with open("supabase/migrations/0001_init.sql", "r", encoding="utf-8") as f:
        sql = f.read()

    print("Running migration 0001_init.sql...")
    try:
        conn.run(sql)
        print("Migration executed successfully!")
    except Exception as e:
        print(f"Error during migration: {e}")
        # Note: if types or tables already exist, let's inspect what happened
    
    # Verify tables
    tables = conn.run("SELECT tablename FROM pg_tables WHERE schemaname = 'public';")
    print(f"Public tables found ({len(tables)}):")
    for t in tables:
        print(f" - {t[0]}")

    conn.close()

if __name__ == "__main__":
    main()

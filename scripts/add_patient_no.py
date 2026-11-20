import ssl
import pg8000.native

ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

conn = pg8000.native.Connection(
    'postgres',
    host='db.cyreyzeipyvvfuyijqfm.supabase.co',
    port=5432,
    database='postgres',
    password='xiI4iYiaHT6Ix6LB',
    ssl_context=ctx
)

sql = """
CREATE SEQUENCE IF NOT EXISTS patient_seq START 1001;

CREATE OR REPLACE FUNCTION next_patient_no() RETURNS text LANGUAGE sql AS $$
  SELECT 'PT-' || lpad(nextval('patient_seq')::text, 4, '0');
$$;

ALTER TABLE patients ADD COLUMN IF NOT EXISTS patient_no text UNIQUE DEFAULT next_patient_no();

-- Update any existing patient rows that don't have patient_no
UPDATE patients SET patient_no = next_patient_no() WHERE patient_no IS NULL;
"""

conn.run(sql)
print("Migration applied successfully!")
cols = conn.run("SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'patients';")
print("Patients columns:")
for c in cols:
    print(f" - {c[0]}: {c[1]}")
conn.close()

import json
import jsonschema2db
import psycopg2
import socketio

schema = json.load(open('../assets/test-schema.json'))

# create a Socket.IO server
sio = socketio.Server()

# wrap with a WSGI application
app = socketio.WSGIApp(sio)


translator = jsonschema2db.JSONSchemaToPostgres(
    schema,
    postgres_schema='schm',
    #item_col_name='loan_file_id',
    #item_col_type='string',
    abbreviations={
        'AbbreviateThisReallyLongColumn': 'AbbTRLC',
    }
)

con = psycopg2.connect('host=localhost user=sitindustries dbname=testdb')
translator.create_tables(con)
con.commit()

# ****** Table creation tested ******
# ****** Worked ******
""" cur = con.cursor()
try:
    cur.execute("CREATE TABLE vendors ( vendor_id SERIAL PRIMARY KEY, vendor_name VARCHAR(255) NOT NULL)")
except:
    print ("I can't SELECT from bar")

# close communication with the PostgreSQL database server
cur.close()
# commit the changes
con.commit() """

# ****** First test to see if interaction with the DB works ****** 
# ****** Worked ******
"""cursor = con.cursor()
 cursor.execute("SELECT table_name FROM testdb.tables WHERE table_schema = 'public'")
 for table in cursor.fetchall():
    print(table) """

print(translator)
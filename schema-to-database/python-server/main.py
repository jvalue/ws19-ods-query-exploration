import json
import jsonschema2db
import psycopg2
import socketio

DEBUG = 0

con = psycopg2.connect('host=localhost user=sitindustries dbname=testdb')

# create a Socket.IO server
sio = socketio.Client()

sio.connect('http://localhost:3000')

@sio.on('create-table')
def on_message(schema_data, schema_name):

    if DEBUG: 
        print('\n*** create-table event triggered ***')
        print('\nschema_data: ' + schema_data)
        print('\nschema_name: ' + schema_name)

    create_table(schema_data, schema_name)

@sio.on('insert-data')
def on_message(json_data, index, schema_data, schema_name):

    if DEBUG: 
        print('\*** insert-data event triggered ***')
        print('\njson_data: ' + json_data)
        print('\nindex: ' + index)
        print('\nschema_data: ' + schema_data)
        print('\nschema_name: ' + schema_name)

    insert_data(json_data, index, schema_data,schema_name)

def create_table(schema_data, schema_name):
    if DEBUG: print('\n*** create-table function entered ***')

    translator = jsonschema2db.JSONSchemaToPostgres(
        schema_data,
        postgres_schema=schema_name,
        item_col_name=schema_name + '_file_id',
        item_col_type='string',
        abbreviations={
            'AbbreviateThisReallyLongColumn': 'AbbTRLC',
        }
    )
    translator.create_tables(con)
    con.commit()

def insert_data(json_data, index, schema_data, schema_name):
    if DEBUG: print('\n*** insert-data event entered ***')

    translator = jsonschema2db.JSONSchemaToPostgres(
        schema_data,
        postgres_schema=schema_name,
        item_col_name=schema_name + '_file_id',
        item_col_type='string',
        abbreviations={
            'AbbreviateThisReallyLongColumn': 'AbbTRLC',
        }
    )
    #print(schema_name + 'json_data')    
    #translator.create_tables(con)

    translator.insert_items(con,[(schema_name + index, json_data)])
    con.commit()

def delete_schema(schema_name):
    if DEBUG: 
        print('\n*** insert-data event entered ***')
        print('\nschema_name: ' + schema_name)

    cur = con.cursor()
    if schema_name == '01':
        schema_name = 'pegel'
    elif schema_name == '02':
        schema_name = 'crime'
    try:
        query = "DROP SCHEMA "+schema_name+" CASCADE;"

        if DEBUG: print(query)

        cur.execute(query)
        cur.close()
        con.commit()
    except:
        print ("Failed to delete")

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

#print(translator)

while(True):
    channel = input('Enter the one of the following commands:\n create | insert | delete\n-->')
    if channel != 'create' and channel != 'insert' and channel != 'delete' and channel != 'DEBUG':
        print("Input wrong!")
        continue
    
    if channel == 'DEBUG':
        DEBUG = not DEBUG
        continue

    source = input('Enter the one of the following sources:\n "01" for pegel | "02" for crime \n-->')
    if source != '01' and source != '02' :
        print("Input wrong!")
        continue

    argument_one = None
    argument_two = None

    if channel == 'create':
        argument_one = 'create-table'
        argument_two = source

    elif channel == 'insert':
        argument_one = 'insert-data'
        index = input('Enter the desired index:\n e.g. "1" without " \n-->')
        try:
            if int(index) < 0:
                print('Number must be greater 0 (zero)')
                continue
        except: 
            print('Input was not a number!')
            continue
        argument_two = (source, index)

    
    
    if channel == "delete":
        delete_schema(source)
    else:
        sio.emit(argument_one, argument_two)
    
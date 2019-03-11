from flask import Flask, request
app = Flask(__name__)

import os
import configparser
config = configparser.ConfigParser()
config.read('.config')
env = os.environ.get('ENV', 'dev')

from db_connector import DBConnector
db_connector = DBConnector(
    config[env]['url'],
    int(config[env]['port']),
    config[env]['database'],
    config[env]['collection']
)

from orm import ORM

from client import Client

def get_orm(func):
    def wrap_get_orm(*args, **kwargs):
        with db_connector as connector:
            orm = ORM(Client, connector)
            return func(orm, *args, **kwargs)
    return wrap_get_orm

def to_json(func):
    import json
    def wrap_to_json(*args, **kwargs):
        return json.dumps(func(*args, **kwargs))
    return wrap_to_json

@app.route('/')
def hello():
    return 'Hello World!'

@app.route('/clients')
@get_orm
@to_json
def clients(orm):
    return list(map(lambda cs: cs.to_dict(), orm.all()))

@app.route('/client', methods=['POST'])
@app.route('/client/<name>', methods=['GET', 'PUT'])
@to_json
@get_orm
def client(orm, name: str=None):
    if request.method == 'POST':
        new_cs = _get_client_from_request()
        return orm.create(new_cs.to_dict()).to_dict()
    query = {'name': name}
    if request.method == 'GET':
        return orm.get(query).to_dict()
    update_cs = _get_client_from_request()
    return orm.update(query, update_cs.to_dict()).to_dict()

def _get_client_from_request():
    data = request.get_json()
    return Client(**data)

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0')
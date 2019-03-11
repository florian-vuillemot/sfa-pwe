from flask import Flask, request
app = Flask(__name__)

import os
import json
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

from accounting import Accounting
from convertor import convert_for_accounting, from_accounting

def get_orm(func):
    def wrap_get_orm(*args, **kwargs):
        with db_connector as connector:
            orm = ORM(Accounting, connector)
            return func(orm, *args, **kwargs)
    return wrap_get_orm

def to_json(func):
    def wrap_to_json(*args, **kwargs):
        r = func(*args, **kwargs)
        if isinstance(r, list):
            r = [from_accounting(i) for i in r]
        else:
            r = from_accounting(r)
        return json.dumps(r)
    return wrap_to_json

@app.route('/')
def hello():
    return 'Hello World!'

@app.route('/accountings')
@get_orm
@to_json
def accountings(orm):
    return list(map(lambda cs: cs.to_dict(), orm.all()))

@app.route('/accounting', methods=['POST'])
@app.route('/accounting/<id>', methods=['GET', 'PUT'])
@to_json
@get_orm
def accounting(orm, id: str=None):
    if request.method == 'POST':
        new_cs = _get_accounting_from_request()
        return orm.create(new_cs.to_dict()).to_dict()
    if not id.isdigit():
        return {}
    _id = int(id)
    if request.method == 'GET':
        return orm.get(_id).to_dict()
    update_cs = _get_accounting_from_request()
    return orm.update(_id, update_cs.to_dict()).to_dict()

@app.route('/accounting/<year>/<month>', methods=['GET'], endpoint='get_accounting')
@get_orm
@to_json
def get_accounting(orm, year: str, month: str):
    from datetime import datetime
    from calendar import monthrange
    _year, _month = int(year), int(month)
    query = {'year': _year, 'month': _month}
    return list(map(lambda cs: cs.to_dict(), orm.all(query)))

def _get_accounting_from_request():
    data = convert_for_accounting(request.get_json())
    return Accounting(**data)

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0')

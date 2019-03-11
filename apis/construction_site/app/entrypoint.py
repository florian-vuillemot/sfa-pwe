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

from construction_site import ConstructionSite
from convertor import convert_for_construction_site, from_construction_site

def get_orm(func):
    def wrap_get_orm(*args, **kwargs):
        with db_connector as connector:
            orm = ORM(ConstructionSite, connector)
            return func(orm, *args, **kwargs)
    return wrap_get_orm

def to_json(func):
    def wrap_to_json(*args, **kwargs):
        r = func(*args, **kwargs)
        if isinstance(r, list):
            r = [from_construction_site(i) for i in r]
        else:
            r = from_construction_site(r)
        return json.dumps(r)
    return wrap_to_json

@app.route("/")
def hello():
    return "Hello World!"

@app.route("/constructions-site")
@get_orm
@to_json
def constructions_site(orm):
    return list(map(lambda cs: cs.to_dict(), orm.all()))

@app.route("/construction-site", methods=['POST'])
@app.route("/construction-site/<id>", methods=['GET', 'PUT'])
@to_json
@get_orm
def construction_site(orm, id: str=None):
    if request.method == 'POST':
        new_cs = _get_construction_site_from_request()
        return orm.create(new_cs.to_dict()).to_dict()
    if not id or not id.isdigit():
        return {}
    _id = int(id)
    if request.method == 'GET':
        return orm.get(_id).to_dict()
    update_cs = _get_construction_site_from_request()
    return orm.update(_id, update_cs.to_dict()).to_dict()

def _get_construction_site_from_request():
    data = convert_for_construction_site(request.get_json())
    return ConstructionSite(**data)

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0')

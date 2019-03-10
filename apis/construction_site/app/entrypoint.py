from flask import Flask, request
app = Flask(__name__)

from db_connector import DBConnector
db_connector = DBConnector("localhost", 27017, "test", "construction_site")

from orm import ORM

from construction_site import ConstructionSite

def get_orm(func):
    def wrap_get_orm(*args, **kwargs):
        with db_connector as connector:
            orm = ORM(ConstructionSite, connector)
            return func(orm, *args, **kwargs)
    return wrap_get_orm

def to_json(func):
    import json
    def wrap_to_json(*args, **kwargs):
        return json.dumps(func(*args, **kwargs))
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
    data = request.get_json()
    return ConstructionSite(**data)

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0')

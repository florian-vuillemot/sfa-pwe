from flask import Flask, request
app = Flask(__name__)

from db_connector import DBConnector
db_connector = DBConnector("localhost", 27017, "test", "construction_site")

from back_end import BackEnd

from construction_site import ConstructionSite

def back_end(func):
    def wrap_back_end(*args, **kwargs):
        with db_connector as connector:
            bc = BackEnd(ConstructionSite, connector)
            return func(bc, *args, **kwargs)
    return wrap_back_end

def to_json(func):
    import json
    def wrap_to_json(*args, **kwargs):
        return json.dumps(func(*args, **kwargs))
    return wrap_to_json

@app.route("/")
def hello():
    return "Hello World!"

@app.route("/constructions-site")
@back_end
@to_json
def constructions_site(bc):
    return list(map(lambda cs: cs.to_dict(), bc.all()))

@app.route("/construction-site", methods=['POST'])
@app.route("/construction-site/<id>", methods=['GET', 'PUT'])
@to_json
@back_end
def construction_site(bc, id: str=None):
    if request.method == 'POST':
        new_cs = _get_construction_site_from_request()
        return bc.create(new_cs.to_dict()).to_dict()
    if not id or not id.isdigit():
        return {}
    _id = int(id)
    if request.method == 'GET':
        return bc.get(_id).to_dict()
    update_cs = _get_construction_site_from_request()
    return bc.update(_id, update_cs.to_dict()).to_dict()

def _get_construction_site_from_request():
    data = request.get_json()
    return ConstructionSite(**data)

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0')

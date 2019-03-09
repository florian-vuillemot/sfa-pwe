from flask import Flask
app = Flask(__name__)

@app.route("/")
def hello():
    return "Hello World!"

@app.route("/constructions-site")
def constructions_site():
    db_connector
    return "All constructions site"

@app.route("/construction-site", methods=['POST'])
@app.route("/construction-site/<id>", methods=['GET', 'PUT'])
def construction_site(id=None):
    if request.method == 'POST':
        return "post"
    if request.method == 'GET':
        return "get"
    return "put"

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0')

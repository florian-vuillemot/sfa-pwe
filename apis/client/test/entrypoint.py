import json
import unittest
import copy
import sys
sys.path.append('..')
sys.path.append('../app')
import os
env = 'test'
os.environ['ENV'] = env
from app.entrypoint import app

client = {
    "name": "My entreprise",
    "address": {
        "number": "42",
        "street": "Rue du",
        "city": "Paris",
        "postalCode": "34",
        "additionalDetails": None
    }
}

class AppTest(unittest.TestCase):
    def setUp(self):
        clean_db()

    def test_hello_world(self):
        with app.test_client() as c:
            resp = c.get('/')
            self.assertEqual(resp.data.decode('UTF-8'), "Hello World!")

    def test_post(self):
        with app.test_client() as c:
            resp = c.post('/client', json=client)
            r = json.loads(resp.data)
            self.assertEqual(r, client)

    def test_get_all_empty(self):
        with app.test_client() as c:
            resp = c.get('/clients')
            r = json.loads(resp.data)
            self.assertEqual(r, [])

    def test_get_all(self):
        with app.test_client() as c:
            c.post('/client', json=client)
            resp = c.get('/clients')
            r = json.loads(resp.data)
            self.assertEqual(r, [client])

    def test_get(self):
        with app.test_client() as c:
            c.post('/client', json=client)
            resp = c.get(f'/client/%s' % client['name'])
            r = json.loads(resp.data)
            self.assertEqual(r, client)

    def test_put(self):
        with app.test_client() as c:
            c.post('/client', json=client)
            cs = copy.deepcopy(client)
            cs['name'] += "2.0"
            resp = c.put(f'/client/%s' % cs['name'], json=cs)
            r = json.loads(resp.data)
            self.assertEqual(r, cs)

    def test_put_empty(self):
        with app.test_client() as c:
            resp = c.put(f'/client/%s' % client['name'], json=client)
            r = json.loads(resp.data)
            self.assertEqual(r, client)

def clean_db():
    import configparser
    config = configparser.ConfigParser()
    config.read('.config')

    from db_connector import DBConnector
    db_connector = DBConnector(
        config[env]['url'],
        int(config[env]['port']),
        config[env]['database'],
        config[env]['collection']
    )

    with db_connector as connector:
        connector.delete_many({})

if __name__ == '__main__':
    unittest.main()

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

accounting = {
    'id': 1,
    'date': '2019-03-02',
    'price': {'price': 120.00, 'taxPercent': 20, 'taxFreePrice': 100},
    'payment': {'method': 'CHEQUE', 'chequeNumber': '323'},
    'info': {'description': 'libelle', 'invoiceNumber': 'FDS23'}
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
            resp = c.post('/accounting', json=accounting)
            r = json.loads(resp.data)
            self.assertEqual(r, accounting)

    def test_get_all_empty(self):
        with app.test_client() as c:
            resp = c.get('/accountings')
            r = json.loads(resp.data)
            self.assertEqual(r, [])

    def test_get_all(self):
        with app.test_client() as c:
            c.post('/accounting', json=accounting)
            resp = c.get('/accountings')
            r = json.loads(resp.data)
            self.assertEqual(r, [accounting])

    def test_get(self):
        with app.test_client() as c:
            c.post('/accounting', json=accounting)
            resp = c.get(f'/accounting/%d' % accounting['id'])
            r = json.loads(resp.data)
            self.assertEqual(r, accounting)

    def test_put(self):
        with app.test_client() as c:
            c.post('/accounting', json=accounting)
            cs = copy.deepcopy(accounting)
            cs['date'] += "2.0"
            resp = c.put(f'/accounting/%d' % cs['id'], json=cs)
            r = json.loads(resp.data)
            self.assertEqual(r, cs)

    def test_put_empty(self):
        with app.test_client() as c:
            resp = c.put(f'/accounting/%s' % accounting['id'], json=accounting)
            r = json.loads(resp.data)
            self.assertEqual(r, accounting)

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

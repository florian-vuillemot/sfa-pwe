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

construction_site = {
    "id": 1, 
    "year": 2019,
    "month": 3,
    "working_days": [{
        "id": 1,
        "date": "2019-03-03",
        "type": "Transfert",
        "tax_free_price": 3.2,
        "price": 2.3,
        "hours": 2
    }],
    "construction_site_data": {
        "client": "eurovia",
        "place": "Mtn",
        "rate": {
            "hour_tax_free_price": 32.3,
            "day_tax_free_price": 3.1,
            "tax_percent": 10
            }
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
            resp = c.post('/construction-site', json=construction_site)
            r = json.loads(resp.data)
            self.assertEqual(r, construction_site)

    def test_get_all_empty(self):
        with app.test_client() as c:
            resp = c.get('/constructions-site')
            r = json.loads(resp.data)
            self.assertEqual(r, [])

    def test_get_all(self):
        with app.test_client() as c:
            c.post('/construction-site', json=construction_site)
            resp = c.get('/constructions-site')
            r = json.loads(resp.data)
            self.assertEqual(r, [construction_site])

    def test_get(self):
        with app.test_client() as c:
            c.post('/construction-site', json=construction_site)
            resp = c.get(f'/construction-site/%d' % construction_site['id'])
            r = json.loads(resp.data)
            self.assertEqual(r, construction_site)

    def test_put(self):
        with app.test_client() as c:
            c.post('/construction-site', json=construction_site)
            cs = copy.deepcopy(construction_site)
            cs['year'] += 1
            resp = c.put(f'/construction-site/%d' % cs['id'], json=cs)
            r = json.loads(resp.data)
            self.assertEqual(r, cs)

    def test_put_empty(self):
        with app.test_client() as c:
            resp = c.put(f'/construction-site/%d' % construction_site['id'], json=construction_site)
            r = json.loads(resp.data)
            self.assertEqual(r, construction_site)

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

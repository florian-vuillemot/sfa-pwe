import sys
sys.path.append('..')
from app.client import Client
import unittest

class ClientTest(unittest.TestCase):
    client = {
        "name": "My entreprise",
        "address": {
            "number": "42",
            "street": "Rue du",
            "city": "Paris",
            "postal_code": "34",
            "additional_details": None
        }
    }

    def test_to_dict(self):
        c = Client(**self.client)
        self.assertEqual(c.to_dict(), self.client)

if __name__ == '__main__':
    unittest.main()
import sys
sys.path.append('..')
from app.construction_site import ConstructionSite
import unittest

class ConstructionSiteTest(unittest.TestCase):
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

    def test_to_dict(self):
        cs = ConstructionSite(**self.construction_site)
        self.assertEqual(cs.to_dict(), self.construction_site)

if __name__ == '__main__':
    unittest.main()
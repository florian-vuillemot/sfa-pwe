import sys
sys.path.append('..')
from app.accounting import Accounting
import unittest

class AccountingTest(unittest.TestCase):
    accounting = {
        'id': 1,
        'date': '2019-03-02',
        'price': {'price': 120.00, 'tax_percent': 20, 'tax_free_price': 100},
        'payment': {'method': 'CHEQUE', 'cheque_number': '323'},
        'info': {'description': 'libelle', 'invoice_number': 'FDS23'}
    }

    def test_to_dict(self):
        c = Accounting(**self.accounting)
        self.assertEqual(c.to_dict(), self.accounting)

if __name__ == '__main__':
    unittest.main()
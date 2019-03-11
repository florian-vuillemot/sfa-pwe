from datetime import datetime
from typing import Dict, Any, Union

DATE_FORMAT = '%Y-%m-%d'

class Accounting:
    def __init__(self, id: int, date: str, price: Dict[str, Union[int, float]],
                payment: Dict[str, Union[str, str]], info: Dict[str, str], **kwargs):
        self._id = id
        self._date = datetime.strptime(date, DATE_FORMAT)
        self._price = Price(**price)
        self._payment = Payment(**payment)
        self._info = Info(**info)
        self._year = self._date.year
        self._month = self._date.month

    def to_dict(self):
        return {
            'id': self._id,
            'date': self._date.strftime(DATE_FORMAT),
            'price': self._price.to_dict(),
            'payment': self._payment.to_dict(),
            'info': self._info.to_dict(),
            'year': self._year,
            'month': self._month
        }

class Price:
    def __init__(self, price: float, tax_percent: float, tax_free_price: float, **kwargs):
        self._price = price
        self._tax_free_price = tax_free_price
        self._tax_percent = tax_percent

    def to_dict(self):
        return {
            'price': self._price,
            'tax_free_price': self._tax_free_price,
            'tax_percent': self._tax_percent
        }

class Payment:
    def __init__(self, method: str, cheque_number: str, **kwargs):
        self._method = method
        self._cheque_number = cheque_number

    def to_dict(self):
        return {
            'method': self._method,
            'cheque_number': self._cheque_number
        }

class Info:
    def __init__(self, description: str, invoice_number: str, **kwargs):
        self._description = description
        self._invoice_number = invoice_number

    def to_dict(self):
        return {
            'description': self._description,
            'invoice_number': self._invoice_number
        }
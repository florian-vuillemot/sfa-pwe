from typing import Dict, Any

class Client:
    def __init__(self, name: str, address: Dict[Any, Any], **kwargs):
        self._name = name
        self._address = Address(**address)

    def to_dict(self):
        return {
            'name': self._name,
            'address': self._address.to_dict()
        }

class Address:
    def __init__(self, number: int, street: str, city: str, postal_code: str, additional_details: str):
        self._number = number
        self._street = street
        self._city = city
        self._postal_code = postal_code
        self._additional_details = additional_details

    def to_dict(self):
        return {
            'number': self._number,
            'street': self._street,
            'city': self._city,
            'postal_code': self._postal_code,
            'additional_details': self._additional_details
        }

from copy import deepcopy
from typing import Dict, Any

fields = [
    ('address', [
        ('postalCode', 'postal_code'),
        ('additionalDetails', 'additional_details'),
    ])
]

def _convert(data, from_accounting):
    _data = deepcopy(data)
    for field, li in fields:
        d = _data[field]
        for f1, f2 in li:
            new_field, to_change = (f1, f2) if from_accounting else (f2, f1)
            d[new_field] = d[to_change]
            del d[to_change]
    return _data

def convert_for_client(data: Dict[str, Any]):
    return _convert(data, False)

def from_client(data: Dict[str, Any]):
    return _convert(data, True)


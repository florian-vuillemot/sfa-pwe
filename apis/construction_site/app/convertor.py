from copy import deepcopy
from typing import Dict, Any

fields = [
    ('construction_site_data', ('rate', [
        ('hourTaxFreePrice', 'hour_tax_free_price'),
        ('dayTaxFreePrice', 'day_tax_free_price'),
        ('taxPercent', 'tax_percent')
    ])),
    ('working_days', [('taxFreePrice', 'tax_free_price')])
]

def _convert(data, from_accounting):
    for field, li in fields:
        d = data[field]
        if isinstance(li, tuple):
            new_field, new_li = li
            d = data[field][new_field]
            li = new_li
        for f1, f2 in li:
            new_field, to_change = (f1, f2) if from_accounting else (f2, f1)
            if isinstance(d, list):
                for _d in d:
                    _d[new_field] = _d[to_change]
                    del _d[to_change]
            else:
                d[new_field] = d[to_change]
                del d[to_change]
    return data

def _convert_root_fields(data: Dict[str, Any], from_cs):
    old_wd, new_wd = 'workingDays', 'working_days'
    old_csd, new_csd = 'constructionSiteData', 'construction_site_data'
    if from_cs:
        old_wd, new_wd = new_wd, old_wd
        old_csd, new_csd = new_csd, old_csd
    data[new_wd] = data[old_wd]
    data[new_csd] = data[old_csd]
    del data[old_wd]
    del data[old_csd]
    return data

def convert_for_construction_site(data: Dict[str, Any]):
    _data = deepcopy(data)
    _data = _convert_root_fields(_data, False)
    return _convert(_data, False)

def from_construction_site(data: Dict[str, Any]):
    _data = _convert(data, True)
    return _convert_root_fields(_data, True)


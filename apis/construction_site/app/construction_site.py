class ConstructionSite:
    def __init__(self, id: int, year: int, month: int, working_days, construction_site_data):
        self._id = id
        self._year = year
        self._month = month
        self._working_days = [WorkingDay(**k) for k in working_days]
        self._construction_site_data = ConstructionSiteData(**construction_site_data)

    def to_dict(self):
        return {
            "id": self._id,
            "working_days": [k.to_dict() for k in self._working_days],
            "year": self._year,
            "month": self._month,
            "construction_site_data": self._construction_site_data.to_dict()
        }

class ConstructionSiteData:
    def __init__(self, client: str, place: str, rate):
        self._client = client
        self._place = place
        self._rate = Rate(**rate)

    def to_dict(self):
        return {
            "client": self._client,
            "place": self._place,
            "rate": self._rate.to_dict()
        }

class Rate:
    def __init__(self, hour_tax_free_price: float, day_tax_free_price: float, tax_percent: int):
        self._hour_tax_free_price = hour_tax_free_price
        self._day_tax_free_price = day_tax_free_price
        self._tax_percent = tax_percent

    def to_dict(self):
        return {
            "hour_tax_free_price": self._hour_tax_free_price,
            "day_tax_free_price": self._day_tax_free_price,
            "tax_percent": self._tax_percent
        }

class WorkingDay:
    def __init__(self, id: int, date: str, type: str, tax_free_price: float, price: float, hours: float):
        self._id = id
        self._date = date
        self._type = type
        self._tax_free_price = tax_free_price
        self._price = price
        self._hours = hours

    def to_dict(self):
        return {
            "id": self._id,
            "date": self._date,
            "type": self._type,
            "tax_free_price": self._tax_free_price,
            "price": self._price,
            "hours": self._hours
        }

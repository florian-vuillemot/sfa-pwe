import json
from bson.json_util import dumps
from db_connector import DBConnector
from typing import Dict, Any, Union

class ORM:
    def __init__(self, cls, db_connector: DBConnector):
        self._cls = cls
        self._db_connector = db_connector
    
    def all(self):
        elements = self._db_connector.find({})
        return map(lambda e: self._cls(**_clean_object_id(e)), elements)

    def create(self, element: Dict[str, Any]):
        n = self._db_connector.insert_one(element).inserted_id
        return self.get({"_id": n})

    def get(self, query: Union[int, Dict]):
        if isinstance(query, int):
            query = {'id': query}
        element = self._db_connector.find_one(query)
        return self._cls(**_clean_object_id(element))

    def update(self, query: Union[int, Dict], element: Dict[str, Any]):
        if isinstance(query, int):
            query = {'id': query}
        self._db_connector.replace_one(query, element)   
        return self.get(query)

def _clean_object_id(cs):
    return json.loads(dumps(cs))

import sys
import pymongo

class DBConnector:
    def __init__(self, url, port, database, collection):
        self._url = url
        self._port = port
        self._database = database
        self._collection = collection
        self._client = None
        self._db_connection = None

    def __enter__(self):
        self._client = MongoClient(self.url, self.port)
        self._db_connection = self._client[self.database]
        return self._db_connection[self._collection]

    def __exit__(self, type, value, traceback):
        self._client.close()
        self._client = None
        self._db_connection = None

import json as simplejson
import urllib
import pymongo
import threading
import config
import os,json

def refresh():
    config.collection.remove({})
    threading.Timer(86400,refresh).start()

def get_json_data(data_url):
    if (config.collection.find_one({"url": data_url}) is not None):
        return config.collection.find_one({"url": data_url})["jsonData"]
    # Fetch it from MongoDB otherwise
    else:
        response = urllib.urlopen(data_url)
        jsonData = simplejson.load(response)
        config.collection.insert({'url': data_url, 'jsonData': jsonData})
        return jsonData

def initialize():
    if not config.initialized:
        vcap_config=os.environ.get("VCAP_SERVICES")
        decoded_config=json.loads(vcap_config)
        for key,value in decoded_config.iteritems():
            if key.startswith('mongodb'):
                mongo_creds=decoded_config[key][0]['credentials']
        mongo_url=str(mongo_creds['url'])

        client=pymongo.MongoClient(mongo_url)
        config.db=config.client['db']
        config.collection=config.db['mycollection']
        config.collection.remove({})
        config.initialized=True
        refresh()




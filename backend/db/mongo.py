from pymongo import MongoClient
import os
from dotenv import load_dotenv


load_dotenv()

client = MongoClient(os.getenv("MONGO_URI"))

# creating db
db = client["DocLens"]

# collections
message_collection = db["messages"]
conversation_collection = db["conversation"]
user_collection = db["user"]
pdfs_collection = db["pdfs"]


from pymongo import MongoClient
import os
from dotenv import load_dotenv


load_dotenv()

client = MongoClient(os.getenv("MONGO_URI"))

# creating db
db = client["DocLens"]

# collections
chat_collection = db["chats"]


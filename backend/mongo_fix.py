from db.mongo import message_collection
from bson import ObjectId

def fix_conversation_id(message_collection):
   
   fixed = 0

   messages = message_collection.find({
      "conversation_id": {"$type": "string"}
   })

   for msg in messages:
      try:
         message_collection.update_one({
            "_id": msg["_id"]
         },
         {"$set": {
            "conversation_id": ObjectId(msg["conversation_id"])
         }}
         )
         fixed += 1
      except Exception as e:
         print(str(e))
    
   print(f"fixed: {fixed}")

  
    

fix_conversation_id(message_collection=message_collection)
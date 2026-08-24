# import google.generativeai as genai
# import os
# from dotenv import load_dotenv

# load_dotenv()
# genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

# for m in genai.list_models():
#     print(m.name, m.supported_generation_methods)


from groq import Groq
from dotenv import load_dotenv
import os

load_dotenv()

client = Groq(api_key=os.getenv("GROQ_API_KEY"))

models = client.models.list()

for model in models.data:
    print(model.id)
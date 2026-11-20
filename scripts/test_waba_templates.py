import os
from dotenv import load_dotenv
load_dotenv('.env.local')

token = os.getenv('WHATSAPP_TOKEN')

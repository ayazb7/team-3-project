import os
from dotenv import load_dotenv
from datetime import timedelta

load_dotenv()

class Config:
    MYSQL_HOST = os.getenv('MYSQL_HOST')
    MYSQL_USER = os.getenv('MYSQL_USER')
    MYSQL_PASSWORD = os.getenv('MYSQL_PASSWORD')
    MYSQL_DB = os.getenv('MYSQL_DB')

    JWT_SECRET_KEY = os.getenv('JWT_SECRET_KEY', 'change-me-in-env')
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(minutes=15)
    JWT_REFRESH_TOKEN_EXPIRES = timedelta(days=30)


    # Option 1: Set CORS_ORIGINS as comma-separated list: "http://localhost:83,http://localhost:5173"
    # Option 2: Set FRONTEND_URL for a single origin: "https://your-deployed-frontend.com"
    # Default: http://localhost:83 (for local development)
    cors_origins_env = os.getenv('CORS_ORIGINS')
    frontend_url = os.getenv('FRONTEND_URL', 'http://localhost:83')
    
    origins_string = cors_origins_env if cors_origins_env else frontend_url
    CORS_ORIGINS = [
        origin.strip() 
        for origin in origins_string.split(',')
        if origin.strip()
    ]


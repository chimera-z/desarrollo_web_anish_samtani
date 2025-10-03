from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker

DB_HOST = "localhost"
DB_USERNAME = "cc5002"
DB_PASSWORD = "programacionweb"
DB_PORT = "3306"
DB_NAME = "tarea2"
DB_URL = f"mysql+pymysql://{DB_USERNAME}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}"

Base = declarative_base()

engine = create_engine(
    DB_URL, 
    echo=False,          
    future=True              
)

SessionLocal = sessionmaker(
    bind=engine
)
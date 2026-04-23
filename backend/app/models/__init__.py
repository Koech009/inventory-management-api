# Initialize SQLAlchemy and create a shared db instance for all models to use 

from flask_sqlalchemy import SQLAlchemy
 
db = SQLAlchemy()
 
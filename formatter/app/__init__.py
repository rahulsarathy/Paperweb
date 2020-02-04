from flask import Flask, current_app
from config import Config
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)
app.config.from_object(Config)
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# db = SQLAlchemy(app)
# db.init_app(current_app)
# db.Model.metadata.reflect(db.engine)

from app import routes

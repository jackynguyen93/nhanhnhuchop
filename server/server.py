#!/usr/bin/env python
# -*- coding: utf-8 -*-
import json
import os
from sqlite3 import dbapi2 as sqlite

from flask import Flask, request
from flask_cors import CORS
from sqlalchemy import Integer
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import scoped_session
from sqlalchemy.orm import sessionmaker
from sqlalchemy.schema import Column
from sqlalchemy.sql import func
from sqlalchemy.types import String, INTEGER

app = Flask(__name__)
app.config['SECRET_KEY'] = 'somethingsectret'
CORS(app)

Base = declarative_base()
engine = create_engine('sqlite+pysqlite:///db/Question',  module=sqlite)

####################################################################################################
##### Table Def ############
class JsonModel(object):
    def as_dict(self):
        return {c.name: getattr(self, c.name) for c in self.__table__.columns}

class Question(Base, JsonModel):
    __tablename__ = 'Question'
    question = Column(String(1000), nullable=False)
    _id = Column(Integer, primary_key=True, autoincrement=True)
    level = Column(String(1000), nullable=False)
    casea = Column(String(1000), nullable=False)
    caseb = Column(String(1000), nullable=False)
    casec = Column(String(1000), nullable=False)
    cased = Column(String(1000), nullable=False)
    truecase = Column(INTEGER, nullable=False)

####################################################################################################


######### RESTFUL API ###########

@app.route("/get-question/", methods = ['GET'])
def get_doctors():
    Session = scoped_session(session_factory)
    session = Session()
    level = request.args.get('level')

    question = session.query(Question).filter(Question.level == level).order_by(func.random()).first()
    response = app.response_class(
        response=json.dumps(question.as_dict(), default=str),
        status=200,
        mimetype='application/json'
    )
    return response



if __name__ == "__main__":
    connection = engine.connect()
    session_factory = sessionmaker(bind=engine)
    app.run(host='localhost', port=os.environ.get('PORT', 3001), debug=True)
    connection.close()

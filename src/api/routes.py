"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, User
from api.utils import generate_sitemap, APIException, check_fields
from flask_cors import CORS

from flask_jwt_extended import create_access_token
from flask_jwt_extended import jwt_required
from flask_jwt_extended import get_jwt_identity
from flask_jwt_extended import get_jwt

api = Blueprint('api', __name__)

# Allow CORS requests to this API
CORS(api)


@api.route('/hello', methods=['POST', 'GET'])
def handle_hello():

    response_body = {
        "message": "Hello! I'm a message that came from the backend, check the network tab on the google inspector and you will see the GET request"
    }

    return jsonify(response_body), 200

@api.route('/register', methods=['POST'])
def handle_register():
    response_body = request.get_json()
    fields = ["email","username", "password"]
    email, username, password =check_fields(response_body, fields)
    new_user = User(email, username, password)
    db.session.add(new_user)
    db.session.commit()

    return jsonify(new_user.serialize()), 201

@api.route("/login", methods=["POST"])
def login():
    response_body = request.get_json()
    fields = ["email", "password"]
    email, password =check_fields(response_body, fields)

    searched_user = User.query.filter_by(email=email).first()
    if not searched_user:
        return jsonify({"msg": "Bad email or password"}), 401

    if searched_user.password != password:
        return jsonify({"msg": "Bad email or password"}), 401

    access_token = create_access_token(identity=email)
    return jsonify({
        "access_token": access_token,
        "user_id": searched_user.id,
        "username": searched_user.username,
        "email": searched_user.email
    }), 200


@api.route('/token', methods=['GET'])
@jwt_required()
def check_token():
    token = get_jwt()
    return jsonify(token=token), 200

@api.route('/users/me', methods=['GET'])
@jwt_required()
def get_me():
    email = get_jwt_identity()
    user = User.query.filter_by(email=email).first()
    return jsonify(user.serialize()), 200
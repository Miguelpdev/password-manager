# app.py
from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from flask_talisman import Talisman
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address
from flask_migrate import Migrate
from flask_cors import CORS
import datetime

app = Flask(__name__)
CORS(app)
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+pymysql://root:miguel12@localhost:3306/db_password_manager'
#app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+pymysql://root:miguel12@localhost/db_password_manager'

app.config['SECRET_KEY'] = 'your_secret_key'
app.config['JWT_SECRET_KEY'] = 'your_jwt_secret_key'
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = datetime.timedelta(hours=1)  # Token expiry time

limiter = Limiter(
    key_func=get_remote_address,
    default_limits=["200 per day", "50 per hour"]
)

db = SQLAlchemy(app)
migrate = Migrate(app, db)
bcrypt = Bcrypt(app)
jwt = JWTManager(app)
Talisman(app)  # Add security headers to all responses
limiter.init_app(app)
#limiter = Limiter(app, key_func=get_remote_address)

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(150), unique=True, nullable=False)
    password = db.Column(db.String(150), nullable=False)

class Password(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    service = db.Column(db.String(150), nullable=False)
    password = db.Column(db.String(150), nullable=False)

@app.route('/register', methods=['POST'])
@limiter.limit("5 per minute")  # Rate limiting
def register():
    data = request.get_json()
    if not data or not data.get('username') or not data.get('password'):
        return jsonify(message="Invalid input"), 400
    
    hashed_password = bcrypt.generate_password_hash(data['password']).decode('utf-8')
    new_user = User(username=data['username'], password=hashed_password)
    try:
        db.session.add(new_user)
        db.session.commit()
        return jsonify(message="User created successfully"), 201
    except:
        return jsonify(message="Username already exists"), 400

@app.route('/login', methods=['POST'])
@limiter.limit("5 per minute")  # Rate limiting
def login():
    data = request.get_json()
    if not data or not data.get('username') or not data.get('password'):
        return jsonify(message="Invalid input"), 400

    user = User.query.filter_by(username=data['username']).first()
    if user and bcrypt.check_password_hash(user.password, data['password']):
        access_token = create_access_token(identity=user.id)
        return jsonify(access_token=access_token)
    else:
        return jsonify(message="Invalid credentials"), 401

@app.route('/passwords', methods=['POST'])
@jwt_required()
@limiter.limit("10 per minute")  # Rate limiting
def add_password():
    user_id = get_jwt_identity()
    data = request.get_json()
    if not data or not data.get('service') or not data.get('password'):
        return jsonify(message="Invalid input"), 400

    new_password = Password(user_id=user_id, service=data['service'], password=data['password'])
    db.session.add(new_password)
    db.session.commit()
    return jsonify(message="Password added successfully"), 201

@app.route('/passwords', methods=['GET'])
@jwt_required()
@limiter.limit("10 per minute")  # Rate limiting
def get_passwords():
    user_id = get_jwt_identity()
    passwords = Password.query.filter_by(user_id=user_id).all()
    result = [{"service": pwd.service, "password": pwd.password} for pwd in passwords]
    return jsonify(result), 200

if __name__ == '__main__':
    #app.run(debug=True, ssl_context=('path/to/ssl/cert.pem', 'path/to/ssl/key.pem'))  # HTTPS
    app.run(debug=True)
# PASSWORD MANAGER

## Banckend with Flask 🥏 and MySQL 🦭

- Create virtual enviroment(venv)

```
python3 -m venv venv
```

- Install requirements

```
pip3 install -r requirements.txt
```

- Start and migrate bd

```
flask db init
flask db migrate -m "Initial migration."
flask db upgrade
```

- Start application

```
python3 run.py
```

## Frontend with React 🎧

- Install dependencies

```
npm install
```

- Start application

```
npm start
```

## Register username and passdowrd

```
http://localhost:3000/
```

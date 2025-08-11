from flask import Flask, request, jsonify
from ekreta import User
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # hogy a frontendről is elérd

@app.route("/login", methods=["POST"])
def login():
    try:
        data = request.json
        username = data.get("username")
        password = data.get("password")
        institute = data.get("institute")

        user = User(username, password, institute)
        info = user.getInfo()

        return jsonify({"success": True, "data": info})
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 400

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=10000)

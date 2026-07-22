from flask import Flask, render_template, request, jsonify
import os
import uuid
import requests

app = Flask(__name__)

N8N_WEBHOOK = "https://hemi.app.n8n.cloud/webhook/resume-analysis"

UPLOAD_FOLDER = "static/uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

app.config["UPLOAD_FOLDER"] = UPLOAD_FOLDER


@app.route("/")
def home():
    return render_template("index.html")


@app.route("/upload")
def upload():
    return render_template("upload.html")


@app.route("/api/upload", methods=["POST"])
def upload_resume():

    if "resume" not in request.files:
        return jsonify({"error": "No file uploaded"}), 400

    file = request.files["resume"]

    if file.filename == "":
        return jsonify({"error": "No file selected"}), 400

    if not file.filename.lower().endswith(".pdf"):
        return jsonify({"error": "Only PDF files are allowed"}), 400

    filename = f"{uuid.uuid4()}.pdf"
    filepath = os.path.join(app.config["UPLOAD_FOLDER"], filename)

    file.save(filepath)

    print("Saved:", filepath)
    print("Exists:", os.path.exists(filepath))

    try:
        with open(filepath, "rb") as pdf:
            response = requests.post(
                N8N_WEBHOOK,
                files={
                    "resume": (filename, pdf, "application/pdf")
                    }
            )
        print("Status:", response.status_code)
        print("Response:", response.text)

        data = response.json()

        return jsonify(data)

    except Exception as e:
        return jsonify({"error": str(e)}), 500


if __name__ == "__main__":
    app.run(debug=True)

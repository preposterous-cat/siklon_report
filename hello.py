from flask import Flask, render_template, jsonify, request
import pandas as pd


app = Flask(__name__)
app.config["DEBUG"] = True


@app.route("/")
def hello_world():
    return render_template("index.html")


@app.route("/read_csv_report", methods=["POST"])
def read_csv_report():
    if "file" not in request.files:
        return "File tidak ditemukan"

    file = request.files["file"]

    if file.filename == "":
        return "Nama file kosong"

    if not file.filename.endswith(".csv"):
        return "File harus berformat CSV"

    df = pd.read_csv(file, sep=";")

    print(df.columns)

    if (
        "Latitude" in df.columns
        and "Longitude" in df.columns
        and "Tanggal" in df.columns
    ):
        latitudes = df["Latitude"].tolist()
        longitudes = df["Longitude"].tolist()
        tanggal = df["Tanggal"].tolist()

        # Lakukan apa yang Anda inginkan dengan data ini
        # Misalnya, kirimkan data sebagai JSON
        data = {"latitudes": latitudes, "longitudes": longitudes, "tanggal": tanggal}
        return jsonify(data)
    else:
        return "Kolom yang diperlukan tidak ditemukan dalam file CSV."

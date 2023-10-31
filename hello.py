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

    df = pd.read_csv(file)

    if (
        "Latitude" in df.columns
        and "Longitude" in df.columns
        and "Tanggal" in df.columns
        and "Waktu" in df.columns
        and "Intensity" in df.columns
    ):
        df.dropna(
            subset=["Latitude", "Longitude", "Tanggal", "Waktu", "Intensity"],
            inplace=True,
        )

        latitudes = df["Latitude"].tolist()
        longitudes = df["Longitude"].tolist()

        waktu = df["Waktu"].tolist()
        waktu_hh_mm = [
            waktu.split()[0].split(":")[0] + ":" + waktu.split()[0].split(":")[1]
            for waktu in waktu
        ]
        waktu = waktu_hh_mm

        tanggal = df["Tanggal"].tolist()
        tanggal_hari_bulan = [
            tgl.split("/")[0] + "/" + tgl.split("/")[1] for tgl in tanggal
        ]
        tanggal = tanggal_hari_bulan

        intensity = df["Intensity"].tolist()

        # Lakukan apa yang Anda inginkan dengan data ini
        # Misalnya, kirimkan data sebagai JSON
        data = {
            "latitudes": latitudes,
            "longitudes": longitudes,
            "tanggal": tanggal,
            "waktu": waktu,
            "intensity": intensity,
        }
        print(data)

        return jsonify(data)
    else:
        return "Kolom yang diperlukan tidak ditemukan dalam file CSV."

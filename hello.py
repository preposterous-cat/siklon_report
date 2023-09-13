from flask import Flask, render_template
from selenium import webdriver
from selenium.webdriver.common.keys import Keys


app = Flask(__name__)
app.config["DEBUG"] = True


@app.route("/")
def hello_world():
    return render_template("index.html")


@app.route("/capture")
def capture():
    # Inisialisasi opsi untuk Chrome
    chrome_options = webdriver.ChromeOptions()

    # Tambahkan opsi untuk mengatur path ke ChromeDriver
    chrome_options.binary_location = "D:\Projects\siklon_report\chrome-win64\chrome.exe"
    chrome_options.add_argument(
        "chromedriver.exe path=D:\Projects\siklon_report\chrome-win64\chromedriver.exe"
    )

    # Inisialisasi web driver
    driver = webdriver.Chrome(options=chrome_options)

    # Buka halaman web Flask yang berjalan lokal
    driver.get("http://localhost:5000")  # Ganti URL sesuai dengan URL Flask Anda

    # Menunggu beberapa detik agar halaman web selesai dimuat
    driver.implicitly_wait(10)

    # Temukan elemen dengan ID "maps"
    maps_element = driver.find_element_by_id("maps")

    # Capture gambar dari elemen "maps"
    maps_element.screenshot("screenshot.png")

    # Tutup web driver
    driver.quit()

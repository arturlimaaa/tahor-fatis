import requests
from urllib.parse import urljoin
import os

base_url = "https://pdr-assets.b-cdn.net/collections/sola-busca/sola-busca-" # common to all the images
tail_url = ".jpg?width=600&height=1200" # common to all the images

os.makedirs("cards", exist_ok=True)

for i in range(00, 78):
    number = f"{i:02d}"
    final_url = base_url + number + tail_url
    response = requests.get(final_url)
    with open(f"cards/sola_busca_{number}.jpg", "wb") as file:
        file.write(response.content)
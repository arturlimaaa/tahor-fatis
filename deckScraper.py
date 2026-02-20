import requests
import re
import os

# ── Filename → proper card name mapping ─────────────────────────────────────

RENAME = {
    # Major Arcana
    "RWS_Tarot_00_Fool.jpg":             "The_Fool.jpg",
    "RWS_Tarot_01_Magician.jpg":         "The_Magician.jpg",
    "RWS_Tarot_02_High_Priestess.jpg":   "The_High_Priestess.jpg",
    "RWS_Tarot_03_Empress.jpg":          "The_Empress.jpg",
    "RWS_Tarot_04_Emperor.jpg":          "The_Emperor.jpg",
    "RWS_Tarot_05_Hierophant.jpg":       "The_Hierophant.jpg",
    "RWS_Tarot_06_Lovers.jpg":           "The_Lovers.jpg",
    "RWS_Tarot_07_Chariot.jpg":          "The_Chariot.jpg",
    "RWS_Tarot_08_Strength.jpg":         "Strength.jpg",
    "RWS_Tarot_09_Hermit.jpg":           "The_Hermit.jpg",
    "RWS_Tarot_10_Wheel_of_Fortune.jpg": "Wheel_of_Fortune.jpg",
    "RWS_Tarot_11_Justice.jpg":          "Justice.jpg",
    "RWS_Tarot_12_Hanged_Man.jpg":       "The_Hanged_Man.jpg",
    "RWS_Tarot_13_Death.jpg":            "Death.jpg",
    "RWS_Tarot_14_Temperance.jpg":       "Temperance.jpg",
    "RWS_Tarot_15_Devil.jpg":            "The_Devil.jpg",
    "RWS_Tarot_16_Tower.jpg":            "The_Tower.jpg",
    "RWS_Tarot_17_Star.jpg":             "The_Star.jpg",
    "RWS_Tarot_18_Moon.jpg":             "The_Moon.jpg",
    "RWS_Tarot_19_Sun.jpg":              "The_Sun.jpg",
    "RWS_Tarot_20_Judgement.jpg":        "Judgement.jpg",
    "RWS_Tarot_21_World.jpg":            "The_World.jpg",
    # Wands
    "Wands01.jpg":            "Ace_of_Wands.jpg",
    "Wands02.jpg":            "Two_of_Wands.jpg",
    "Wands03.jpg":            "Three_of_Wands.jpg",
    "Wands04.jpg":            "Four_of_Wands.jpg",
    "Wands05.jpg":            "Five_of_Wands.jpg",
    "Wands06.jpg":            "Six_of_Wands.jpg",
    "Wands07.jpg":            "Seven_of_Wands.jpg",
    "Wands08.jpg":            "Eight_of_Wands.jpg",
    "Tarot_Nine_of_Wands.jpg": "Nine_of_Wands.jpg",
    "Wands10.jpg":            "Ten_of_Wands.jpg",
    "Wands11.jpg":            "Page_of_Wands.jpg",
    "Wands12.jpg":            "Knight_of_Wands.jpg",
    "Wands13.jpg":            "Queen_of_Wands.jpg",
    "Wands14.jpg":            "King_of_Wands.jpg",
    # Cups
    "Cups01.jpg":  "Ace_of_Cups.jpg",
    "Cups02.jpg":  "Two_of_Cups.jpg",
    "Cups03.jpg":  "Three_of_Cups.jpg",
    "Cups04.jpg":  "Four_of_Cups.jpg",
    "Cups05.jpg":  "Five_of_Cups.jpg",
    "Cups06.jpg":  "Six_of_Cups.jpg",
    "Cups07.jpg":  "Seven_of_Cups.jpg",
    "Cups08.jpg":  "Eight_of_Cups.jpg",
    "Cups09.jpg":  "Nine_of_Cups.jpg",
    "Cups10.jpg":  "Ten_of_Cups.jpg",
    "Cups11.jpg":  "Page_of_Cups.jpg",
    "Cups12.jpg":  "Knight_of_Cups.jpg",
    "Cups13.jpg":  "Queen_of_Cups.jpg",
    "Cups14.jpg":  "King_of_Cups.jpg",
    # Swords
    "Swords01.jpg": "Ace_of_Swords.jpg",
    "Swords02.jpg": "Two_of_Swords.jpg",
    "Swords03.jpg": "Three_of_Swords.jpg",
    "Swords04.jpg": "Four_of_Swords.jpg",
    "Swords05.jpg": "Five_of_Swords.jpg",
    "Swords06.jpg": "Six_of_Swords.jpg",
    "Swords07.jpg": "Seven_of_Swords.jpg",
    "Swords08.jpg": "Eight_of_Swords.jpg",
    "Swords09.jpg": "Nine_of_Swords.jpg",
    "Swords10.jpg": "Ten_of_Swords.jpg",
    "Swords11.jpg": "Page_of_Swords.jpg",
    "Swords12.jpg": "Knight_of_Swords.jpg",
    "Swords13.jpg": "Queen_of_Swords.jpg",
    "Swords14.jpg": "King_of_Swords.jpg",
    # Pentacles
    "Pents01.jpg": "Ace_of_Pentacles.jpg",
    "Pents02.jpg": "Two_of_Pentacles.jpg",
    "Pents03.jpg": "Three_of_Pentacles.jpg",
    "Pents04.jpg": "Four_of_Pentacles.jpg",
    "Pents05.jpg": "Five_of_Pentacles.jpg",
    "Pents06.jpg": "Six_of_Pentacles.jpg",
    "Pents07.jpg": "Seven_of_Pentacles.jpg",
    "Pents08.jpg": "Eight_of_Pentacles.jpg",
    "Pents09.jpg": "Nine_of_Pentacles.jpg",
    "Pents10.jpg": "Ten_of_Pentacles.jpg",
    "Pents11.jpg": "Page_of_Pentacles.jpg",
    "Pents12.jpg": "Knight_of_Pentacles.jpg",
    "Pents13.jpg": "Queen_of_Pentacles.jpg",
    "Pents14.jpg": "King_of_Pentacles.jpg",
}

SKIP = {
    "Arthur_Waite_Author.JPG",
    "Pamela_Colman_Smith_circa_1912.jpg",
    "Waite%E2%80%93Smith_Tarot_Roses_and_Lilies_cropped.jpg",
}

# ── Download ─────────────────────────────────────────────────────────────────

print("Fetching Wikipedia page...")
response = requests.get(
    "https://en.wikipedia.org/wiki/Rider-Waite_Tarot",
    headers={"User-Agent": "Mozilla/5.0"}
)
html = response.text

thumb_paths = re.findall(
    r'upload\.wikimedia\.org/wikipedia/commons/thumb/([a-f0-9]/[a-f0-9]{2}/[^/]+\.(?:jpg|JPG|png|PNG))',
    html
)
unique_paths = list(dict.fromkeys(thumb_paths))

os.makedirs("public/cards", exist_ok=True)

downloaded = 0
skipped = 0

for path in unique_paths:
    filename = path.split("/")[-1]

    if filename in SKIP:
        skipped += 1
        continue

    proper_name = RENAME.get(filename, filename)
    save_path = f"public/cards/{proper_name}"
    full_url = f"https://upload.wikimedia.org/wikipedia/commons/{path}"

    print(f"  {filename} → {proper_name}")
    img = requests.get(full_url, headers={"User-Agent": "Mozilla/5.0"})

    if img.status_code == 200:
        with open(save_path, "wb") as f:
            f.write(img.content)
        downloaded += 1
    else:
        print(f"    FAILED ({img.status_code})")

print(f"\nDone. {downloaded} cards downloaded, {skipped} non-card images skipped.")

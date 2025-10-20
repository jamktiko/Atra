import re
import time
import requests # type: ignore
from bs4 import BeautifulSoup # type: ignore

element_to_catch = 'h2'
class_to_catch = 'TopPaddingWide'
placeholder_image_url = 'https://www.nordictattoosupplies.com/WebRoot/NTS/Shops/24052010-172317/65CE/0425/9EFB/4FDE/39AF/0A28/1066/809C/KSI44FLBL_ml.jpg'
max_name_length = 45
ink_amount = 0
page_number = 1
seen = set()
sql_values = []

# add pages as needed; running takes ~6-7 seconds per page -> ~5 minutes total
pages = [
    ('https://www.nordictattoosupplies.com/epages/tattoo.sf/fi_FI/?ObjectPath=/Shops/24052010-172317/Categories/Tattoo_Ink/Shop_by_Colour/Black', 'Black'),
    ('https://www.nordictattoosupplies.com/epages/tattoo.sf/fi_FI/?ViewAction=View&ObjectID=46291928&PageSize=60&Page=2&FocusReference=PagerCurrentPageID', 'Black'),
    ('https://www.nordictattoosupplies.com/epages/tattoo.sf/fi_FI/?ObjectPath=/Shops/24052010-172317/Categories/Tattoo_Ink/Shop_by_Colour/White', 'White'),
    ('https://www.nordictattoosupplies.com/epages/tattoo.sf/fi_FI/?ObjectPath=/Shops/24052010-172317/Categories/Tattoo_Ink/Shop_by_Colour/Grey', 'Grey'),
    ('https://www.nordictattoosupplies.com/epages/tattoo.sf/fi_FI/?ViewAction=View&ObjectID=46291930&PageSize=60&Page=2&FocusReference=PagerCurrentPageID', 'Grey'),
    ('https://www.nordictattoosupplies.com/epages/tattoo.sf/fi_FI/?ObjectPath=/Shops/24052010-172317/Categories/Tattoo_Ink/Shop_by_Colour/Greywash', 'Greywash'),
    ('https://www.nordictattoosupplies.com/epages/tattoo.sf/fi_FI/?ViewAction=View&ObjectID=46291931&PageSize=60&Page=2&FocusReference=PagerCurrentPageID', 'Greywash'),
    ('https://www.nordictattoosupplies.com/epages/tattoo.sf/fi_FI/?ViewAction=View&ObjectID=46291931&PageSize=60&Page=3&FocusReference=PagerCurrentPageID', 'Greywash'),
    ('https://www.nordictattoosupplies.com/epages/tattoo.sf/fi_FI/?ObjectPath=/Shops/24052010-172317/Categories/Tattoo_Ink/Shop_by_Colour/Red','Red'),
    ('https://www.nordictattoosupplies.com/epages/tattoo.sf/fi_FI/?ViewAction=View&ObjectID=46291932&PageSize=60&Page=2&FocusReference=PagerCurrentPageID','Red'),
    ('https://www.nordictattoosupplies.com/epages/tattoo.sf/fi_FI/?ObjectPath=/Shops/24052010-172317/Categories/Tattoo_Ink/Shop_by_Colour/Blue','Blue'),
    ('https://www.nordictattoosupplies.com/epages/tattoo.sf/fi_FI/?ViewAction=View&ObjectID=46291933&PageSize=60&Page=2&FocusReference=PagerCurrentPageID','Blue'),
    ('https://www.nordictattoosupplies.com/epages/tattoo.sf/fi_FI/?ViewAction=View&ObjectID=46291933&PageSize=60&Page=3&FocusReference=PagerCurrentPageID','Blue'),
    ('https://www.nordictattoosupplies.com/epages/tattoo.sf/fi_FI/?ObjectPath=/Shops/24052010-172317/Categories/Tattoo_Ink/Shop_by_Colour/Yellow','Yellow'),
    ('https://www.nordictattoosupplies.com/epages/tattoo.sf/fi_FI/?ViewAction=View&ObjectID=46291934&PageSize=60&Page=2&FocusReference=PagerCurrentPageID','Yellow'),
    ('https://www.nordictattoosupplies.com/epages/tattoo.sf/fi_FI/?ObjectPath=/Shops/24052010-172317/Categories/Tattoo_Ink/Shop_by_Colour/Green','Green'),
    ('https://www.nordictattoosupplies.com/epages/tattoo.sf/fi_FI/?ViewAction=View&ObjectID=46291935&PageSize=60&Page=2&FocusReference=PagerCurrentPageID','Green'),
    ('https://www.nordictattoosupplies.com/epages/tattoo.sf/fi_FI/?ViewAction=View&ObjectID=46291935&PageSize=60&Page=3&FocusReference=PagerCurrentPageID','Green'),
    ('https://www.nordictattoosupplies.com/epages/tattoo.sf/fi_FI/?ObjectPath=/Shops/24052010-172317/Categories/Tattoo_Ink/Shop_by_Colour/Brown','Brown'),
    ('https://www.nordictattoosupplies.com/epages/tattoo.sf/fi_FI/?ViewAction=View&ObjectID=46291936&PageSize=60&Page=2&FocusReference=PagerCurrentPageID','Brown'),
    ('https://www.nordictattoosupplies.com/epages/tattoo.sf/fi_FI/?ViewAction=View&ObjectID=46291936&PageSize=60&Page=3&FocusReference=PagerCurrentPageID','Brown'),
    ('https://www.nordictattoosupplies.com/epages/tattoo.sf/fi_FI/?ObjectPath=/Shops/24052010-172317/Categories/Tattoo_Ink/Shop_by_Colour/Orange','Orange'),
    ('https://www.nordictattoosupplies.com/epages/tattoo.sf/fi_FI/?ViewAction=View&ObjectID=46291937&PageSize=60&Page=2&FocusReference=PagerCurrentPageID','Orange'),
    ('https://www.nordictattoosupplies.com/epages/tattoo.sf/fi_FI/?ObjectPath=/Shops/24052010-172317/Categories/Tattoo_Ink/Shop_by_Colour/Pink','Pink'),
    ('https://www.nordictattoosupplies.com/epages/tattoo.sf/fi_FI/?ViewAction=View&ObjectID=46291938&PageSize=60&Page=2&FocusReference=PagerCurrentPageID','Pink'),
    ('https://www.nordictattoosupplies.com/epages/tattoo.sf/fi_FI/?ObjectPath=/Shops/24052010-172317/Categories/Tattoo_Ink/Shop_by_Colour/Purple','Purple'),
    ('https://www.nordictattoosupplies.com/epages/tattoo.sf/fi_FI/?ViewAction=View&ObjectID=46291941&PageSize=60&Page=2&FocusReference=PagerCurrentPageID','Purple'),
    ('https://www.nordictattoosupplies.com/epages/tattoo.sf/fi_FI/?ObjectPath=/Shops/24052010-172317/Categories/Tattoo_Ink/Shop_by_Colour/Flesh_tones','Skin tones'),
    ('https://www.nordictattoosupplies.com/epages/tattoo.sf/fi_FI/?ViewAction=View&ObjectID=46291944&PageSize=60&Page=2&FocusReference=PagerCurrentPageID','Skin tones'),
]

# parse product details from title
def parse_product(title, color, image_url):
    size_match = re.search(r"(\d+ml)", title)
    size = size_match.group(1) if size_match else ""

    # add manufacturers as needed
    if "Carbon Black" in title:
        manufacturer = "Carbon Black"
    elif "Cosmoink" in title:
        manufacturer = "Cosmoink"
    elif "Dynamic" in title:
        manufacturer = "Dynamic"
    elif "Eclipse Black Tattoo Ink" in title:
        manufacturer = "Eclipse Black"
    elif "Eternal Ink" in title:
        manufacturer = "Eternal Ink"
    elif "I AM INK" in title:
        manufacturer = "I AM INK"
    elif "Inked Army" in title:
        manufacturer = "The Inked Army Tattoo Colors"
    elif "Intenze Gen-Z" in title:
        manufacturer = "Intenze"
    elif "Kokkai Sumi" in title:
        manufacturer = "Kokkai Sumi"
    elif "Kuro Sumi" in title:
        manufacturer = "Kuro Sumi"
    elif "Kwadron INX" in title:
        manufacturer = "Kwadron INX"
    elif "Lauro Paolini" in title:
        manufacturer = "Lauro Paolini"
    elif "Panthera Ink" in title:
        manufacturer = "Panthera Ink"
    elif "Quantum Ink" in title:
        manufacturer = "Quantum Ink"
    elif "Radiant Evolved" in title:
        manufacturer = "Radiant"
    elif "Raw Pigments" in title:
        manufacturer = "Raw Pigments"
    elif "Sacred Color" in title:
        manufacturer = "Lauro Paolini"
    elif "Viking by Dynamic" in title:
        manufacturer = "Viking by Dynamic"
    elif "World Famous Ink" in title:
        manufacturer = "World Famous Ink"
    elif "Xtreme Ink" in title:
        manufacturer = "Xtreme Ink"
    else:
        manufacturer = "Unknown"

    # product name is title minus manufacturer and size, plus some rubbish
    product_name = title.replace(manufacturer, "").replace(size, "").strip(" -")
    product_name = clean_title(product_name) # remove unnecessary words
    product_name = normalize_whitespace(product_name) # clean up whitespace
    product_name = product_name[:max_name_length]  # truncate safely
    #TODO: alter the truncation when DB schema is changed

    # return SQL value tuple, with apostrophes escaped
    return f"('{escape_sql(product_name)}', '{escape_sql(manufacturer)}', '{escape_sql(color)}', 0, '{escape_sql(image_url)}', '{escape_sql(size)}')"

# escape single quotes for SQL
def escape_sql(value):
    return value.replace("'", "''")

# normalize whitespace in text
def normalize_whitespace(text):
    return re.sub(r'\s+', ' ', text).strip()

# remove words from titles: example "Uusi", expires at etc.
def clean_title(title):
    title = title.replace("Uusi", "").strip()
    title = title.replace("+", "").strip()
    title = re.sub(r"\(.*?\)", "", title) # remove anything in parentheses
    return title

# determines if the title indicates a set/bundle
def is_set(title):
    title_lower = title.lower()
    return any(keyword in title_lower for keyword in ["set", "bundle"])

# MAIN SCRAPING LOGIC STARTS HERE
# Scrape and build SQL
for url, color in pages:
    try:
        response = requests.get(url)
        response.raise_for_status()
        soup = BeautifulSoup(response.text, "html.parser")
        elements = soup.find_all(class_=class_to_catch)

        # skip if no elements found
        if not elements:
            print(f"No elements found on {url}")
            continue

        ink_amount += len(elements)

        for h in elements:
            title = h.get_text(strip=True)
            # Find the parent <td> of the <h2> element
            td = h.find_parent("td")
            if not td:
              continue

            #Try to find the image inside the ImageArea div
            image_div = td.find("div", class_="ImageArea")
            image_url = placeholder_image_url  # fallback
            if image_div:
              img_tag = image_div.find("img")
            if img_tag and img_tag.get("src"):
              relative_url = img_tag["src"]
              image_url = f"https://www.nordictattoosupplies.com{relative_url}"

            key = (title.lower().strip(), color.lower()) # normalize key to avoid duplicates
            if key in seen: # avoid duplicates
                continue
            seen.add(key) # mark as seen
            sql_values.append(parse_product(title, color, image_url))

    except Exception as e:
        print(f"Error reading {url}: {e}")
        continue

    print(f"Page {page_number}/{len(pages)} crawled")
    page_number += 1
    time.sleep(5) # be polite and wait between requests

# Save SQL to file; header + values
sql_header = "INSERT INTO PublicInk (product_name, manufacturer, color, recalled, image_url, size) VALUES\n"
with open("inserts.sql", "w", encoding="utf-8") as f:
    f.write(sql_header)
    f.write(",\n      ".join(sql_values) + ";\n")

print("SQL statements saved to inserts.sql")
print("Total amount of inks fetched:", ink_amount)
# End of file: use inserts.sql to import data into the database.
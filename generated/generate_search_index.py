# pip install beautifulsoup4

import pathlib

import utils, json

files = pathlib.Path().rglob("all_works/*.html")
paths = [e for e in iter(files)]
print(paths)

search_index = []

for file in paths:
    entry = {}
    title, text = utils.extract_page_content(file)
    entry["title"] = title
    entry["url"] = str(file)
    entry["content"] = text
    search_index.append(entry)

with open("generated/search-index.json", "w", encoding="utf-8") as file:
    file.write(json.dumps(search_index, ensure_ascii=False, indent=4))
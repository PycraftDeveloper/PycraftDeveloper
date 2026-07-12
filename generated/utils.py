from bs4 import BeautifulSoup

def extract_page_content(file_path):
    with open(file_path, "r", encoding="utf-8") as file:
        html_content = file.read()

    soup = BeautifulSoup(html_content, "html.parser")

    page_title = soup.title.string.strip() if soup.title else "No Title Found"

    for invisible_element in soup(["script", "style", "head", "meta", "[document]"]):
        invisible_element.decompose()

    plain_text = soup.get_text(separator=" ", strip=True)

    return page_title, plain_text
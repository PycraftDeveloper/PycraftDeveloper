// search.js

let fuse;
let pages = [];

const searchInput = document.getElementById("searchInput");
const resultsDiv = document.getElementById("results");

async function initSearch() {
    try {
        const response = await fetch("generated/search-index.json");
        pages = await response.json();

        fuse = new Fuse(pages, {
            includeScore: true,
            includeMatches: true,

            // Search these fields
            keys: [
                { name: "title", weight: 2.5 },
                { name: "content", weight: 1 }
            ],

            threshold: 0.35,
            distance: 200,
            ignoreLocation: true,
            minMatchCharLength: 2,
            findAllMatches: true
        });

        searchInput.disabled = false;
        searchInput.placeholder = "Search...";
    }
    catch (err) {
        console.error(err);
        searchInput.placeholder = "Search unavailable";
    }
}

function escapeHTML(str) {
    return str
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;");
}

function makeSnippet(content, query) {
    const lower = content.toLowerCase();
    const index = lower.indexOf(query.toLowerCase());

    if (index === -1) {
        return escapeHTML(content.slice(0, 150)) + "...";
    }

    const start = Math.max(index - 60, 0);
    const end = Math.min(index + 90, content.length);

    let snippet = escapeHTML(content.slice(start, end));

    const regex = new RegExp(query, "ig");

    snippet = snippet.replace(regex, match =>
        `<mark>${match}</mark>`
    );

    if (start > 0) snippet = "..." + snippet;
    if (end < content.length) snippet += "...";

    return snippet;
}

function performSearch(query) {

    resultsDiv.innerHTML = "";

    resultsDiv.classList.remove("visible"); // hide

    if (!query.trim()) return;

    const results = fuse.search(query).slice(0, 15);

    resultsDiv.classList.add("visible"); // show

    if (results.length === 0) {
        resultsDiv.innerHTML =
            "No results found.";
        return;
    }

    for (const result of results) {

        const page = result.item;

        const article = document.createElement("article");
        article.className = "search-result";

        article.innerHTML = `
            <h3>
                <a href="${page.url}">
                    ${escapeHTML(page.title)}
                </a>
            </h3>

            <small>
                <i>(Match: ${(100 - result.score * 100).toFixed(0)}%)</i>
            </small>

            <p>
                ${makeSnippet(page.content, query)}
            </p>
        `;

        resultsDiv.appendChild(article);
    }
}

searchInput.addEventListener("input", e => {
    performSearch(e.target.value);
});

initSearch();
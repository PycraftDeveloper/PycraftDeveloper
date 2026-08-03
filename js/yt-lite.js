const thumbnails = [
    "maxresdefault.jpg",
    "sddefault.jpg",
    "hqdefault.jpg"
];

function setBestThumbnail(el, id, index = 0) {
    if (index >= thumbnails.length) return;

    const url = `https://i.ytimg.com/vi/${id}/${thumbnails[index]}`;
    const img = new Image();

    img.onload = () => {
        if (img.naturalWidth > 120) {
            el.style.backgroundImage = `url(${url})`;
        } else {
            setBestThumbnail(el, id, index + 1);
        }
    };

    img.onerror = () => setBestThumbnail(el, id, index + 1);

    img.src = url;
}

document.querySelectorAll(".yt-lite").forEach(el => {
    const id = el.dataset.id;

    // load thumbnail (VERY fast, no iframe yet)
    setBestThumbnail(el, id);

    el.addEventListener("click", () => {
        const iframe = document.createElement("iframe");
        iframe.src = `https://www.youtube.com/embed/${id}?autoplay=1`;
        iframe.allow =
            "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture";
        iframe.allowFullscreen = true;
        iframe.style.display = "block";
        iframe.style.width = "100%";
        iframe.style.height = "100%";
        iframe.style.aspectRatio = "16 / 9";
        iframe.style.border = "0";

        el.replaceWith(iframe);
    });
});
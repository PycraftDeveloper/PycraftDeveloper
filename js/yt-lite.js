document.querySelectorAll(".yt-lite").forEach(el => {
    const id = el.dataset.id;

    // load thumbnail (VERY fast, no iframe yet)
    el.style.backgroundImage =
        `url(https://i.ytimg.com/vi/${id}/hqdefault.jpg)`;

    el.addEventListener("click", () => {
        const iframe = document.createElement("iframe");
        iframe.src = `https://www.youtube.com/embed/${id}?autoplay=1`;
        iframe.allow =
            "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture";
        iframe.allowFullscreen = true;
        iframe.style.width = "100%";
        iframe.style.aspectRatio = "16 / 9";

        el.replaceWith(iframe);
    });
});
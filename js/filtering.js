const filterGroups = document.querySelectorAll(".filters");
const projects = document.querySelectorAll("section[data-tags]");

document.querySelectorAll(".filters input").forEach(input => {
    input.addEventListener("change", updateFilters);
});

function updateFilters() {

    projects.forEach(project => {

        const tags = project.dataset.tags.split(",");

        let visible = true;

        filterGroups.forEach(group => {

            // Which filters are checked in THIS group?
            const selected = [...group.querySelectorAll("input:checked")]
                .map(input => input.value);

            // Nothing selected -> ignore this group
            if (selected.length === 0)
                return;

            // At least ONE tag from this group must match
            const groupMatches = selected.some(tag => tags.includes(tag));

            if (!groupMatches)
                visible = false;
        });

        project.style.display = visible ? "" : "none";
    });

}
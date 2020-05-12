// Initializes top & side nav

document.addEventListener("DOMContentLoaded", () => {
    const menus = document.querySelectorAll(".side-menu");
    M.Sidenav.init(menus, { edge: "right" });

    setTimeout(() => {
        const latestEl = document.getElementById("latestData")
        latestEl.style.maxHeight = latestEl.scrollHeight + "px"
    }, 1200)
});


// Collapsible Data
const coll = document.getElementsByClassName("collapsible");

for (let i = 0; i < coll.length; i++) {
    coll[i].addEventListener("click", function () {
        this.classList.toggle("active");
        var content = this.nextElementSibling;
        if (content.style.maxHeight) {
            content.style.maxHeight = null;
        } else {
            content.style.maxHeight = content.scrollHeight + "px";
        }
    });
}
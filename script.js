const navItems = document.querySelectorAll(".side-bar li");
const pages = document.querySelectorAll(".page");

navItems.forEach(item => {
    item.addEventListener("click", () => {
        const pageId = item.dataset.page;

        pages.forEach(page => page.classList.remove("active"));

        document.getElementById(pageId).classList.add("active");

        navItems.forEach(nav => nav.classList.remove("actv"));

        item.classList.add("actv");
        
    });
});
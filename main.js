(function () {
  const root = document.documentElement;
  const themeBtn = document.getElementById("theme-toggle");
  const filterBtns = document.querySelectorAll(".filter-link");
  const items = document.querySelectorAll(".projects li");

  function setTheme(theme) {
    root.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
    if (themeBtn) {
      themeBtn.setAttribute("aria-pressed", String(theme === "dark"));
    }
  }

  const saved = localStorage.getItem("theme");
  const prefersDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
  setTheme(saved || (prefersDark ? "dark" : "light"));

  if (themeBtn) {
    themeBtn.addEventListener("click", function () {
      const next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
      setTheme(next);
    });
  }

  filterBtns.forEach(function (btn) {
    btn.addEventListener("click", function () {
      const cat = btn.getAttribute("data-filter");

      filterBtns.forEach(function (b) {
        const active = b === btn;
        b.classList.toggle("active", active);
        b.setAttribute("aria-pressed", String(active));
      });

      items.forEach(function (item) {
        const cats = (item.getAttribute("data-cat") || "").split(" ");
        item.hidden = !(cat === "all" || cats.includes(cat));
      });
    });
  });
})();

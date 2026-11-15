(function () {
  const root = document.documentElement;
  const themeBtn = document.getElementById("theme-toggle");
  const filterBtns = document.querySelectorAll(".filter-btn");
  const projectRows = document.querySelectorAll(".project-row");
  const filterStatus = document.getElementById("filter-status");
  const copyEmailBtn = document.getElementById("copy-email");
  const copyFeedback = document.getElementById("copy-feedback");

  function applyTheme(theme) {
    root.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
    if (themeBtn) {
      const isDark = theme === "dark";
      themeBtn.textContent = isDark ? "TEMA: ESCURO" : "TEMA: CLARO";
      themeBtn.setAttribute("aria-pressed", String(isDark));
    }
  }

  const savedTheme = localStorage.getItem("theme");
  const prefersDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
  applyTheme(savedTheme || (prefersDark ? "dark" : "light"));

  if (themeBtn) {
    themeBtn.addEventListener("click", function () {
      const next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
      applyTheme(next);
    });
  }

  filterBtns.forEach(function (btn) {
    btn.addEventListener("click", function () {
      const category = btn.getAttribute("data-filter");
      let visibleCount = 0;

      filterBtns.forEach(function (b) {
        const active = b === btn;
        b.classList.toggle("active", active);
        b.setAttribute("aria-pressed", String(active));
      });

      projectRows.forEach(function (row) {
        const categories = (row.getAttribute("data-category") || "").split(" ");
        const match = category === "all" || categories.includes(category);
        row.hidden = !match;
        if (match) visibleCount++;
      });

      if (filterStatus) {
        filterStatus.textContent =
          visibleCount === 1
            ? "Exibindo 1 projeto."
            : "Exibindo " + visibleCount + " projetos.";
      }
    });
  });

  if (copyEmailBtn && copyFeedback) {
    copyEmailBtn.addEventListener("click", function () {
      const email = "rodriguesmateus.rm@gmail.com";
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(email).then(function () {
          copyFeedback.textContent = "Email copiado para a área de transferência.";
        });
      } else {
        copyFeedback.textContent = "Email: " + email;
      }
    });
  }
})();

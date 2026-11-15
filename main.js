(function () {
  const root = document.documentElement;
  const themeBtn = document.getElementById("theme-toggle");
  const filterBtns = document.querySelectorAll(".filter-btn");
  const rows = document.querySelectorAll(".term-row");
  const shellForm = document.getElementById("shell-form");
  const shellInput = document.getElementById("shell-input");
  const shellOutput = document.getElementById("shell-output");
  const chipCmds = document.querySelectorAll(".chip-cmd");

  const history = [];
  let histIdx = -1;

  function applyTheme(theme) {
    root.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
    if (themeBtn) {
      themeBtn.textContent = "theme: " + theme;
      themeBtn.setAttribute("aria-pressed", String(theme === "dark"));
    }
  }

  applyTheme(localStorage.getItem("theme") || "dark");

  if (themeBtn) {
    themeBtn.addEventListener("click", function () {
      const next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
      applyTheme(next);
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
      rows.forEach(function (r) {
        const cats = (r.getAttribute("data-cat") || "").split(" ");
        r.hidden = !(cat === "all" || cats.includes(cat));
      });
    });
  });

  function runCommand(raw) {
    const cmd = raw.trim();
    if (!cmd) return;

    history.unshift(cmd);
    histIdx = -1;

    if (cmd === "clear") {
      shellOutput.innerHTML = "";
      return;
    }

    let resp = "";
    if (cmd === "help") {
      resp =
        "Comandos disponíveis:\n" +
        "  whoami       — resumo de atuação e pesquisa\n" +
        "  ls projects  — lista os principais repositórios\n" +
        "  cat stack    — tecnologias principais\n" +
        "  theme        — alterna entre dark e light\n" +
        "  clear        — limpa o terminal";
    } else if (cmd === "whoami") {
      resp =
        "Rodrigues Matheus · Engenharia de Computação (IFPB)\n" +
        "Atuação: Interagi Tecnologia\n" +
        "Pesquisa: Laboratório Hórus de Robótica & LAPLIN-IFPB\n" +
        "Formação complementar: Virtus-CC (STM32 Bare-Metal)";
    } else if (cmd === "ls projects") {
      resp =
        "antigravity-flow/         volto-light-theme-skills/  Pedaleira-digital/\n" +
        "lab3-i2c-imu-oled/        projeto-final-vibracao/    stm32-trng-monte-carlo-pi/\n" +
        "lab1-gpio-nvic/           lab2-timer-uart/           lab4-adc-dac-dma/\n" +
        "led-MQTT/                 smart-lighting-system/";
    } else if (cmd === "cat stack") {
      resp =
        "Embedded: STM32 (F4/F7/H7), ESP32, FreeRTOS, SystemVerilog, I2C/SPI/UART/MQTT\n" +
        "AI/Agents: Google Antigravity, Gemini CLI, Multi-Agent, MCP, Graphify\n" +
        "Software: C, C++, Python, TypeScript, Java, Docker, Linux";
    } else if (cmd === "theme") {
      const next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
      applyTheme(next);
      resp = "Tema alterado para " + next + ".";
    } else {
      resp = "zsh: command not found: " + cmd + " (tente 'help')";
    }

    const entry = document.createElement("div");
    entry.className = "shell-entry";

    const line = document.createElement("div");
    line.innerHTML = '<span class="c-green">➜</span> <span class="c-blue">~</span> ';
    const cmdSpan = document.createElement("span");
    cmdSpan.className = "c-cmd";
    cmdSpan.textContent = cmd;
    line.appendChild(cmdSpan);

    const out = document.createElement("pre");
    out.className = "shell-resp";
    out.textContent = resp;

    entry.appendChild(line);
    entry.appendChild(out);
    shellOutput.appendChild(entry);
  }

  if (shellForm && shellInput) {
    shellForm.addEventListener("submit", function (e) {
      e.preventDefault();
      runCommand(shellInput.value);
      shellInput.value = "";
    });

    shellInput.addEventListener("keydown", function (e) {
      if (e.key === "ArrowUp" && history.length > 0) {
        e.preventDefault();
        histIdx = Math.min(histIdx + 1, history.length - 1);
        shellInput.value = history[histIdx];
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        histIdx = Math.max(histIdx - 1, -1);
        shellInput.value = histIdx === -1 ? "" : history[histIdx];
      }
    });
  }

  chipCmds.forEach(function (chip) {
    chip.addEventListener("click", function () {
      runCommand(chip.getAttribute("data-cmd") || "");
      if (shellInput) shellInput.focus();
    });
  });
})();


/*
 * Christmas Lights
 * Simulador de luzes natalinas com controles interativos.
 */

// Seleciona os elementos da página.
const lightString = document.getElementById("lightString");
const lightCount = document.getElementById("lightCount");
const countValue = document.getElementById("countValue");
const speed = document.getElementById("speed");
const speedValue = document.getElementById("speedValue");
const wireStyle = document.getElementById("wireStyle");

const toggleButton = document.getElementById("toggleButton");
const resetButton = document.getElementById("resetButton");
const copyButton = document.getElementById("copyButton");
const themeButton = document.getElementById("themeButton");

const cssCode = document.getElementById("cssCode");
const copyMessage = document.getElementById("copyMessage");
const status = document.getElementById("status");

// Cores usadas no modo multicolorido.
const rainbowColors = [
    "#ff304f",
    "#00e676",
    "#2979ff",
    "#ffd54f",
    "#b388ff",
    "#18eaff"
];

// Estado atual da aplicação.
let currentColor = "#ff304f";
let currentMode = "normal";
let isPaused = false;
let isOn = true;

// Cria todas as lâmpadas dentro do cordão.
function createLights() {
    const quantity = Number(lightCount.value);

    // Limpa as lâmpadas anteriores.
    lightString.replaceChildren();

    // Cria a quantidade selecionada.
    for (let i = 0; i < quantity; i++) {
        const bulb = document.createElement("span");

        bulb.className = "bulb";

        // Alterna cores ou usa uma cor única.
        const color = currentColor === "rainbow"
            ? rainbowColors[i % rainbowColors.length]
            : currentColor;

        bulb.style.setProperty("--bulb-color", color);

        // Distribui o início da animação ao longo do cordão.
        bulb.style.animationDelay = `${i * 0.12}s`;

        lightString.appendChild(bulb);
    }

    updatePreview();
}

// Atualiza o modo, a velocidade e o CSS apresentado.
function updatePreview() {
    // Atualiza os valores mostrados na interface.
    countValue.value = lightCount.value;
    speedValue.value = `${Number(speed.value).toFixed(1)} s`;

    // Atualiza as classes responsáveis pelas animações.
    lightString.classList.remove("normal", "twinkle", "fade");
    lightString.classList.add(currentMode);

    lightString.style.setProperty(
        "--speed",
        `${speed.value}s`
    );

    // Atualiza o formato do fio.
    lightString.classList.remove("wave", "straight", "zigzag");
    lightString.classList.add(wireStyle.value);

    // Aplica o estado atual.
    lightString.classList.toggle("paused", isPaused);
    lightString.classList.toggle("off", !isOn);

    // Atualiza os botões e o indicador.
    toggleButton.textContent = isPaused
        ? "▶ Retomar luzes"
        : "⏸ Pausar luzes";

    status.textContent = !isOn
        ? "Desligadas"
        : isPaused
            ? "Pausadas"
            : "Ligadas";

    status.style.color = !isOn ? "#ff6677" : "#00e676";

    // Gera uma amostra do CSS correspondente.
    const colorDescription = currentColor === "rainbow"
        ? "multicolorido"
        : currentColor;

    cssCode.textContent = `/* Christmas Lights */
.christmas-lights {
  /* Cor: ${colorDescription} */
  --bulb-color: ${currentColor === "rainbow"
        ? "multicolor"
        : currentColor};
  --animation-duration: ${speed.value}s;
  animation-name: ${currentMode};
  /* Quantidade: ${lightCount.value} lâmpadas */
}

/* Fio: ${wireStyle.value} */
/* Use a classe .${currentMode} para o modo escolhido. */`;

    copyMessage.textContent = "";
}

// Seleção das cores.
document.querySelectorAll(".color-option").forEach((button) => {
    button.addEventListener("click", () => {
        currentColor = button.dataset.color;

        // Atualiza a indicação visual da cor selecionada.
        document.querySelectorAll(".color-option").forEach((item) => {
            item.classList.toggle("selected", item === button);
        });

        createLights();
    });
});

// Atualiza a quantidade de lâmpadas.
lightCount.addEventListener("input", createLights);

// Atualiza a velocidade.
speed.addEventListener("input", updatePreview);

// Altera o estilo do fio.
wireStyle.addEventListener("change", updatePreview);

// Seleciona o modo de animação.
document.querySelectorAll(".mode-button").forEach((button) => {
    button.addEventListener("click", () => {
        currentMode = button.dataset.mode;

        document.querySelectorAll(".mode-button").forEach((item) => {
            item.classList.toggle("active", item === button);
        });

        updatePreview();
    });
});

// Pausa ou retoma as animações.
toggleButton.addEventListener("click", () => {
    if (!isOn) {
        isOn = true;
        isPaused = false;
    } else {
        isPaused = !isPaused;
    }

    updatePreview();
});

// Tema claro e escuro.
themeButton.addEventListener("click", () => {
    document.body.classList.toggle("light-theme");

    const lightTheme = document.body.classList.contains("light-theme");

    themeButton.textContent = lightTheme
        ? "🌙 Tema escuro"
        : "☀️ Tema claro";
});

// Restaura as configurações originais.
resetButton.addEventListener("click", () => {
    currentColor = "#ff304f";
    currentMode = "normal";
    isPaused = false;
    isOn = true;

    lightCount.value = 20;
    speed.value = 1;
    wireStyle.value = "wave";

    document.querySelectorAll(".color-option").forEach((button) => {
        button.classList.toggle(
            "selected",
            button.dataset.color === currentColor
        );
    });

    document.querySelectorAll(".mode-button").forEach((button) => {
        button.classList.toggle(
            "active",
            button.dataset.mode === currentMode
        );
    });

    createLights();
});

// Copia o CSS gerado.
copyButton.addEventListener("click", async () => {
    try {
        await navigator.clipboard.writeText(cssCode.textContent);
        copyMessage.textContent = "CSS copiado com sucesso!";
    } catch (error) {
        copyMessage.textContent =
            "Não foi possível copiar automaticamente. Selecione e copie o código manualmente.";
    }
});

// Inicia a aplicação.
createLights();

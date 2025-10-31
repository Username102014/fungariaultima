document.addEventListener("DOMContentLoaded", () => {
  const gradients = [
    { name: "Exo Shine", chance: 1.4, image: "exo.png" },
    { name: "Frosty Fih", chance: 6.7, image: "fih.png" },
    { name: "Eye of Rah", chance: 4.1, image: "rah.png" },
    { name: "Isa", chance: 1.3, image: "isa.png" },
    { name: "Demonic Wrath", chance: 4.5, image: "demon.png" },
    { name: "Tropical Mist", chance: 4, image: "mist.png" },
    { name: "Frost Tides", chance: 5, image: "tides.png" },
    { name: "Popsicle", chance: 6, image: "pop.png" },
    { name: "Lemon Lime", chance: 7, image: "lime.png" },
    { name: "Velvet Sea", chance: 5, image: "velvet.png" },
    { name: "Cotton Candy", chance: 7, image: "candy.png" },
    { name: "Frosted Beam", chance: 15, image: "beam.png" },
    { name: "Sunflower", chance: 20, image: "sunflower.png" }
  ];

  const fungalCards = [
    { name: "Waning Star", chance: 2, image: "waning.png" },
    { name: "Fungus Eye", chance: 1, image: "fungus.png" },
    { name: "Inverted Spiral", chance: 1, image: "spiral.png" },
    { name: "Clan Eye", chance: 0.1, image: "clan.png" }
  ];

  let totalPacksOpened = 0;
  let revealedCards = [];
  let hasClanEye = false;

  const usedCodes = new Set();
  let fungalightActiveUntil = null;
  let clanEyeNextPack = false;

  const openBtn = document.getElementById("openBtn");
  const codeBtn = document.getElementById("codeBtn");
  const codeInput = document.getElementById("codeInput");
  const overlay = document.getElementById("ripOverlay");
  const wrapper = document.getElementById("packWrapper");

  openBtn.onclick = openPack;
  codeBtn.onclick = applyCode;

  function rollGradient() {
    let pool = [...gradients];

    if (fungalightActiveUntil && Date.now() < fungalightActiveUntil) {
      pool = pool.concat(fungalCards);
    }

    const totalChance = pool.reduce((sum, g) => sum + g.chance, 0);
    const rand = Math.random() * totalChance;
    let cumulative = 0;
    for (let g of pool) {
      cumulative += g.chance;
      if (rand < cumulative) return g;
    }
    return pool[0];
  }

  function openPack() {
    totalPacksOpened++;
    overlay.classList.remove("hidden");
    wrapper.innerHTML = "";
    wrapper.classList.add("hidden");
    revealedCards = [];

    setTimeout(() => {
      overlay.classList.add("hidden");
      const pack = [];

      if (clanEyeNextPack) {
        pack.push({ name: "Clan Eye", image: "clan.png" });
        clanEyeNextPack = false;
      }

      for (let i = 0; i < 7; i++) {
        const card = rollGradient();
        if (card.name === "Clan Eye") hasClanEye = true;
        pack.push(card);
      }

      revealedCards = pack;
      displayFullPack();
    }, 2000);
  }

  function displayFullPack() {
    wrapper.classList.remove("hidden");
    revealedCards.forEach(card => {
      const div = document.createElement("div");
      div.className = "card";
      div.innerHTML = `<img src="${card.image}" alt="${card.name}" />`;
      wrapper.appendChild(div);
    });
  }

  function applyCode() {
    const code = codeInput.value.trim().toLowerCase();

    if (usedCodes.has(code)) {
      alert("Code already used.");
      return;
    }

    switch (code) {
      case "fungalight":
        fungalightActiveUntil = Date.now() + 10 * 60 * 1000;
        usedCodes.add(code);
        alert("Fungalight activated: 2% Waning Star, 1% Fungus Eye & Inverted Spiral, 0.1% Clan Eye for 10 minutes.");
        break;
      case "eyesofaclashroyalegrinderwillberedlol":
        clanEyeNextPack = true;
        usedCodes.add(code);
        alert("Next pack will contain a guaranteed Clan Eye.");
        break;
      default:
        alert("Invalid code.");
        return;
    }

    codeInput.value = "";
  }
});




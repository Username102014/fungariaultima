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

  const baseFungalCards = [
    { name: "Waning Star", chance: 2, image: "waning.png" },
    { name: "Fungus Eye", chance: 1, image: "fungus.png" },
    { name: "Inverted Spiral", chance: 1, image: "spiral.png" },
    { name: "Clan Eye", chance: 0.1, image: "clan.png" }
  ];

  const boostedFungalCards = [
    { name: "Waning Star", chance: 2, image: "waning.png" },
    { name: "Fungus Eye", chance: 1, image: "fungus.png" },
    { name: "Inverted Spiral", chance: 1, image: "spiral.png" },
    { name: "Clan Eye", chance: 0.67, image: "clan.png" }
  ];

  const craftables = [
    {
      name: "Tropical Shine",
      image: "troshine.png",
      requires: ["Tropical Mist", "Exo Shine"]
    },
    {
      name: "Clan Eye",
      image: "clan.png",
      requires: ["Fungus Eye", "Inverted Spiral", "Waning Star"]
    },
    {
      name: "Candy Petal",
      image: "petal.png",
      requires: ["Cotton Candy", "Sunflower"]
    }
  ];

  let inventory = [];
  const maxInventory = 30;
  let autosellEnabled = false;
  let fungalightActiveUntil = null;
  let clanEyeNextPack = false;
  const usedCodes = new Set();

  const openBtn = document.getElementById("openBtn");
  const codeBtn = document.getElementById("codeBtn");
  const codeInput = document.getElementById("codeInput");
  const inventoryBtn = document.getElementById("inventoryBtn");
  const inventoryPanel = document.getElementById("inventoryPanel");
  const inventoryCards = document.getElementById("inventoryCards");
  const autosellToggle = document.getElementById("autosellToggle");
  const craftIcon = document.getElementById("craftIcon");
  const craftPanel = document.getElementById("craftPanel");
  const ripOverlay = document.getElementById("ripOverlay");
  const wrapper = document.getElementById("packWrapper");

  const craftList = document.getElementById("craftList");
  const craftName = document.getElementById("craftName");
  const craftImage = document.getElementById("craftImage");
  const craftReqs = document.getElementById("craftReqs");

  openBtn.onclick = openPack;
  codeBtn.onclick = applyCode;
  inventoryBtn.onclick = () => inventoryPanel.classList.toggle("hidden");
  autosellToggle.onclick = () => {
    autosellEnabled = !autosellEnabled;
    autosellToggle.textContent = autosellEnabled ? "Autosell: ON" : "Autosell: OFF";
  };
  craftIcon.onclick = () => craftPanel.classList.toggle("hidden");

  document.addEventListener("keydown", (event) => {
    if (event.key === "`") {
      window.location.href = "https://houstonisd.instructure.com/";
    }
  });

  function rollGradient() {
    let pool = [...gradients];

    if (fungalightActiveUntil && Date.now() < fungalightActiveUntil) {
      pool = pool.concat(boostedFungalCards);
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
    ripOverlay.classList.remove("hidden");
    wrapper.innerHTML = "";
    wrapper.classList.add("hidden");

    setTimeout(() => {
      ripOverlay.classList.add("hidden");
      const pack = [];

      if (clanEyeNextPack) {
        pack.push({ name: "Clan Eye", image: "clan.png" });
        clanEyeNextPack = false;
      }

      for (let i = 0; i < 7; i++) {
        const card = rollGradient();
        pack.push(card);
      }

      pack.forEach(card => {
        if (autosellEnabled && inventory.some(c => c.name === card.name)) return;
        if (inventory.length < maxInventory) inventory.push(card);
      });

      displayFullPack();
      updateInventory();
    }, 2000);
  }

  function displayFullPack() {
    wrapper.classList.remove("hidden");
    revealedCards = inventory.slice(-7);
    wrapper.innerHTML = "";
    revealedCards.forEach(card => {
      const div = document.createElement("div");
      div.className = "card";
      div.innerHTML = `<img src="${card.image}" alt="${card.name}" />`;
      wrapper.appendChild(div);
    });
  }

  function updateInventory() {
    inventoryCards.innerHTML = "";
    inventory.forEach((card, index) => {
      const div = document.createElement("div");
      div.className = "card";
      div.innerHTML = `<img src="${card.image}" alt="${card.name}" /><p>${card.name}</p>`;
      const sellBtn = document.createElement("button");
      sellBtn.textContent = "Sell";
      sellBtn.onclick = () => {
        inventory.splice(index, 1);
        updateInventory();
      };
      div.appendChild(sellBtn);
      inventoryCards.appendChild(div);
    });
  }

  function renderCraftPanel() {
    craftList.innerHTML = "";
    craftables.forEach(craft => {
      const btn = document.createElement("button");
      btn.textContent = craft.name;
      btn.onclick = () => {
        craftName.textContent = craft.name;
        craftImage.src = craft.image;
        craftReqs.innerHTML = "";
        craft.requires.forEach(req => {
          const item = document.createElement("li");
          item.textContent = req;
          craftReqs.appendChild(item);
        });

        const canCraft = craft.requires.every(req =>
          inventory.some(card => card.name === req)
        );

        const craftBtn = document.createElement("button");
        craftBtn.textContent = "Craft";
        craftBtn.disabled = !canCraft;
        craftBtn.onclick = () => {
          craft.requires.forEach(req => {
            const index = inventory.findIndex(card => card.name === req);
            if (index !== -1) inventory.splice(index, 1);
          });
          inventory.push({ name: craft.name, image: craft.image });
          updateInventory();
        };

        craftReqs.appendChild(craftBtn);
      };
      craftList.appendChild(btn);
    });
  }

  renderCraftPanel();

  function applyCode() {
    const code = codeInput.value.trim().toLowerCase();

    if (usedCodes.has(code)) {
      alert("Code already used.");
      return;
    }

    switch (code) {
      case "funguschangus":
        fungalightActiveUntil = Date.now() + 10 * 60 * 1000;
        usedCodes.add(code);
        alert("Funguschangus activated: Clan Eye chance boosted to 0.67% for 10 minutes.");
        break;
      case "eyesofaclashroyalegrinderwillberedlol":
        clanEyeNextPack = true;







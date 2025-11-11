document.addEventListener("DOMContentLoaded", () => {
  const gradients = [
    { name: "Tropical Mist", image: "mist.png" },
    { name: "Exo Shine", image: "exo.png" },
    { name: "Cotton Candy", image: "candy.png" },
    { name: "Sunflower", image: "sunflower.png" },
    { name: "Fungus Eye", image: "fungus.png" },
    { name: "Inverted Spiral", image: "spiral.png" },
    { name: "Waning Star", image: "waning.png" }
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

  function openPack() {
    ripOverlay.classList.remove("hidden");

    setTimeout(() => {
      ripOverlay.classList.add("hidden");

      const pack = [];
      for (let i = 0; i < 5; i++) {
        const card = gradients[Math.floor(Math.random() * gradients.length)];
        pack.push(card);
      }

      pack.forEach(card => {
        if (autosellEnabled && inventory.some(c => c.name === card.name)) return;
        if (inventory.length < maxInventory) inventory.push(card);
      });

      updateInventory();
    }, 2000);
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
        craftBtn

document.addEventListener("DOMContentLoaded", () => {
  const gradients = [
    { name: "Tropical Mist", image: "mist.png" },
    { name: "Exo Shine", image: "exo.png" },
    { name: "Cotton Candy", image: "candy.png" },
    { name: "Sunflower", image: "sunflower.png" },
    { name: "Fungus Eye", image: "fungus.png" },
    { name: "Inverted Spiral", image: "spiral.png" },
    { name: "Waning Star", image: "waning.png" },
    // Add more if needed
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
  const craftBtn = document.getElementById("craftBtn");
  const craftPanel = document.getElementById("craftPanel");
  const inventoryPanel = document.getElementById("inventoryPanel");
  const autosellToggle = document.getElementById("autosellToggle");

  openBtn.onclick = openPack;
  craftBtn.onclick = () => craftPanel.classList.toggle("hidden");
  autosellToggle.onclick = () => {
    autosellEnabled = !autosellEnabled;
    autosellToggle.textContent = autosellEnabled ? "Autosell: ON" : "Autosell: OFF";
  };

  function openPack() {
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
  }

  function updateInventory() {
    inventoryPanel.innerHTML = "";
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
      inventoryPanel.appendChild(div);
    });
  }

  function renderCraftPanel() {
    const left = document.getElementById("craftList");
    const rightName = document.getElementById("craftName");
    const rightImage = document.getElementById("craftImage");
    const rightReqs = document.getElementById("craftReqs");

    left.innerHTML = "";
    craftables.forEach(craft => {
      const btn = document.createElement("button");
      btn.textContent = craft.name;
      btn.onclick = () => {
        rightName.textContent = craft.name;
        rightImage.src = craft.image;
        rightReqs.innerHTML = "";
        craft.requires.forEach(req => {
          const item = document.createElement("li");
          item.textContent = req;
          rightReqs.appendChild(item);
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

        rightReqs.appendChild(craftBtn);
      };
      left.appendChild(btn);
    });
  }

  renderCraftPanel();
});



const CARD_POOL = [
  {id:'exo',name:'Exo Shine',file:'assets/exo.png',rate:1.4},
  {id:'fih',name:'Frosty Fih',file:'assets/fih.png',rate:6.7},
  {id:'rah',name:'Eye of Rah',file:'assets/rah.png',rate:4.1},
  {id:'isa',name:'Isa',file:'assets/isa.png',rate:1.3},
  {id:'demon',name:'Demonic Wrath',file:'assets/demon.png',rate:4.5},
  {id:'mist',name:'Tropical Mist',file:'assets/mist.png',rate:4.0},
  {id:'tides',name:'Frost Tides',file:'assets/tides.png',rate:5.0},
  {id:'pop',name:'Popsicle',file:'assets/pop.png',rate:6.0},
  {id:'lime',name:'Lemon Lime',file:'assets/lime.png',rate:7.0},
  {id:'velvet',name:'Velvet Sea',file:'assets/velvet.png',rate:5.0},
  {id:'candy',name:'Cotton Candy',file:'assets/candy.png',rate:7.0},
  {id:'beam',name:'Frosted Beam',file:'assets/beam.png',rate:15.0},
  {id:'sunflower',name:'Sunflower',file:'assets/sunflower.png',rate:20.0},
];

const FUNGAL_CARDS = [
  {id:'waning',name:'Waning Star',file:'assets/waning.png',rate:2.0},
  {id:'fungus',name:'Fungus Eye',file:'assets/fungus.png',rate:1.0},
  {id:'spiral',name:'Inverted Spiral',file:'assets/spiral.png',rate:1.0},
  {id:'clan',name:'Clan Eye',file:'assets/clan.png',rate:0.67},
];

const CRAFTABLES = [
  {id:'troshine',name:'Tropical Shine',file:'assets/troshine.png',ingredients:['mist','exo']},
  {id:'clanCraft',name:'Clan Eye',file:'assets/clan.png',ingredients:['fungus','spiral','waning']},
  {id:'petal',name:'Candy Petal',file:'assets/petal.png',ingredients:['candy','sunflower']},
];

let inventory=[],credits=0,autosell=false,guarantee=false,boostUntil=0;
const MAX=30;
const els={
  invList:document.getElementById('inventoryList'),
  invCount:document.getElementById('invCount'),
  credits:document.getElementById('credits'),
  packRes:document.getElementById('packResult'),
  openPack:document.getElementById('openPack'),
  autosell:document.getElementById('autosellToggle'),
  craftMachine:document.getElementById('craftMachine'),
  modal:document.getElementById('craftModal'),
  closeCraft:document.getElementById('closeCraft'),
  craftables:document.getElementById('craftables'),
  craftName:document.getElementById('craftName'),
  craftImage:document.getElementById('craftImage'),
  ingList:document.getElementById('ingredientsList'),
  craftBtn:document.getElementById('craftButton'),
  code:document.getElementById('codeInput'),
  apply:document.getElementById('applyCode')
};

function findMeta(id){
  return [...CARD_POOL,...FUNGAL_CARDS,...CRAFTABLES].find(x=>x.id===id);
}
function update(){
  els.invCount.textContent=`${inventory.length}/${MAX}`;
  els.credits.textContent=`Credits: ${credits}`;
  renderInv();
}
function renderInv(){
  els.invList.innerHTML='';
  inventory.forEach((id,i)=>{
    const m=findMeta(id);
    const row=document.createElement('div');row.className='inv-row';
    row.innerHTML=`<img src=\"${m.file}\"><div>${m.name}</div>`;
    const btn=document.createElement('button');btn.textContent='Sell';
    btn.onclick=()=>{inventory.splice(i,1);credits+=10;update();};
    row.appendChild(btn);
    els.invList.appendChild(row);
  });
}
function weightedPool(){
  let pool=[...CARD_POOL];
  if(Date.now()<boostUntil)pool.push(...FUNGAL_CARDS);
  return pool;
}
function pick(){
  if(guarantee){guarantee=false;return 'clan';}
  const pool=weightedPool();
  const tot=pool.reduce((s,p)=>s+p.rate,0);
  let r=Math.random()*tot;
  for(const c of pool){r-=c.rate;if(r<=0)return c.id;}
  return pool[pool.length-1].id;
}
function addCard(id){
  if(inventory.length>=MAX)return;
  if(autosell&&inventory.includes(id)){credits+=5;return;}
  inventory.push(id);
}
function openPack(){
  els.packRes.innerHTML='';
  for(let i=0;i<5;i++){
    const id=pick();addCard(id);
    const m=findMeta(id);
    const c=document.createElement('div');c.className='card';
    c.innerHTML=`<img src=\"${m.file}\"/><div>${m.name}</div>`;
    els.packRes.appendChild(c);
  }
  update();
}
function openCraft(){
  els.modal.classList.remove('hidden');
  els.craftables.innerHTML='';
  CRAFTABLES.forEach(c=>{
    const li=document.createElement('li');li.textContent=c.name;
    li.onclick=()=>selectCraft(c);
    els.craftables.appendChild(li);
  });
}
function selectCraft(c){
  els.craftName.textContent=c.name;
  els.craftImage.src=c.file;
  els.ingList.innerHTML='';
  c.ingredients.forEach(i=>{
    const m=findMeta(i);
    const li=document.createElement('li');
    li.textContent=m.name+(inventory.includes(i)?' ✓':' ✗');
    els.ingList.appendChild(li);
  });
  els.craftBtn.disabled=!c.ingredients.every(i=>inventory.includes(i));
  els.craftBtn.onclick=()=>{
    c.ingredients.forEach(i=>{
      const idx=inventory.indexOf(i);
      if(idx>-1)inventory.splice(idx,1);
    });
    inventory.push(c.id);
    update();
  };
}
function applyCode(){
  const code=els.code.value.trim().toLowerCase();
  if(code==='funguschangus'){boostUntil=Date.now()+10*60*1000;alert('Fungal boost activated!');}
  else if(code==='eyesofaclashroyalegrinderwillberedlol'){guarantee=true;alert('Guaranteed Clan Eye next pack!');}
  els.code.value='';
}
document.addEventListener('keydown',e=>{if(e.key==='`')window.location.href='https://houstonisd.instructure.com/';});
els.openPack.onclick=openPack;
els.autosell.onchange=()=>autosell=els.autosell.checked;
els.craftMachine.onclick=openCraft;
els.closeCraft.onclick=()=>els.modal.classList.add('hidden');
els.apply.onclick=applyCode;
update();


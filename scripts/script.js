//UI
const commands = Array.from(document.querySelectorAll(".command"))
const battleScene = document.getElementById("battle")

//Scenes
const ennemiesScene = document.querySelector(".ennemies")
const charScene = document.querySelector(".characters")

const charName = document.querySelector("#charName")
const charHp = document.querySelector("#charHp span")
const charTp = document.querySelector("#charTp span")

const attBtn = document.getElementById("attack")
const comboBtn = document.getElementById("combo")

//sounds
const swordSound = document.querySelector("[ref='sword']")
const biteSound = document.querySelector("[ref='bite']")
const isDeadSound = document.querySelector("[ref='isdead']")
const music = document.querySelector("[ref='music']")

let damages

const character = 
	{
		name: "Ch'gars",
		hpMax: 24,
		hp: 24,
		tpMax: 9,
		tp: 9,
		stats: {
			str: 7,
			def: 3,
			sp: 4
		}
	}

const ennemy =
	{
		name: "vieux Carré",
		hpMax: 32,
		hp: 20,
		stats: {
			str: 10,
			def: 0,
			sp: 2
		},
		xp: 30
	}
function endGame(state, xp) {
	document.getElementById(state).style.display= "flex"
	document.getElementById("xp").textContent= xp
}

function tremble() {
	document.querySelector(".Game").classList.add("shake")
	setTimeout(function(){
		document.querySelector(".Game").classList.remove("shake")
	},1000)
}

function triggerAnimation(id, hitPath, hitLocation, charPath, charLocation) {
	const hit = document.createElement("img")
	hit.setAttribute("id", id)
	hit.setAttribute("src", hitPath)
	hitLocation.appendChild(hit)
	setTimeout(()=>{hitLocation.removeChild(hit)},1000)

	const char = document.createElement("img")
	char.setAttribute("src", charPath)
	document.querySelector(".attackAnim").appendChild(char)
	setTimeout(()=>{document.querySelector(".attackAnim").removeChild(char)},1000)
}

function damageAnim(location, damages, id) {
	const dmg = document.createElement("div")
	dmg.setAttribute("id", id)
	dmg.appendChild(document.createTextNode(damages))
	location.appendChild(dmg)
	setTimeout(function(){location.removeChild(dmg)},1000)
}

function damageCalc(str,def, modifier) {
	damages = Math.floor(Math.random() * str) + modifier - def
	if(damages <= 0) {
		damages = 1
	}
	return damages
}

function attack() {
	triggerAnimation(
		"damageFX",
		"medias/images/slash.gif",
		ennemiesScene,
		"medias/images/attack01.gif")
	damageCalc(character.stats.str, ennemy.stats.def, 1)
  	swordSound.play();
	damageAnim(ennemiesScene, damages, "damages")
	ennemy.hp = ennemy.hp - damages
}

function combo() {
	attBtn.disabled=true
	comboBtn.disabled= true
	character.tp = character.tp - 3
	charTp.textContent = character.tp
	document.querySelector(".Combo").style.display= "block"
	startCombo()
	setTimeout(()=> {
		triggerAnimation("damageFX",
			"medias/images/doubleSlash.gif",
			ennemiesScene,
			"medias/images/attack02.gif")
		swordSound.play();
		const comboDmg = result + 3
		ennemy.hp = ennemy.hp - comboDmg
		damageAnim(ennemiesScene, comboDmg, "damages")
	},5000)
}

function ennemyTurn() {
	attBtn.disabled= true
	comboBtn.disabled= true
	if(ennemy.hp <= 0) {
		setTimeout(()=>{
			isDeadSound.play();
			document.querySelector(".ennemy").classList.add("isDead")
			setTimeout(function(){
				endGame("win", ennemy.xp)
			},1500)
		},1500)
	} else {
		damageCalc(ennemy.stats.str,character.stats.def, 3)
		setTimeout(function(){
			//trigger chomp anim and sound
			const dmgFx = document.createElement("img")
			dmgFx.setAttribute("id","damageFX")
			dmgFx.setAttribute("src","medias/images/chomp.gif")
			charScene.appendChild(dmgFx)
			tremble()
			biteSound.play();
			setTimeout(function(){charScene.removeChild(dmgFx)},1000)
		}, 1500)
		setTimeout(function(){
			character.hp = character.hp - damages
			charHp.textContent= character.hp
			updateChar()
			damageAnim(charScene, damages, "damagesChara")
			attBtn.disabled= false
			if(character.tp < 3) {
				comboBtn.disabled= true
			} else {
				comboBtn.disabled= false
			}
		}, 3000)
	}
}

function updateChar() {
	if(character.hp <= character.hpMax / 2 && character.hp > 0) {
		charHp.style.color= "yellow"
	} else if(character.hp <= 0) {
		character.hp = 0
		charHp.textContent= 0
		charHp.style.color= "tomato"
		setTimeout(()=> {
			endGame("lose")
		},1000)
	} else {
		charHp.style.color= "white"
	}
	if(character.tp <= character.tpMax / 2 && character.tp > 0) {
		charTp.style.color= "yellow"
	} else if(character.tp <= 0) {
		character.tp = 0
		charTp.textContent= 0
		charTp.style.color= "tomato"
	} else {
		charTp.style.color= "white"
	}
}

function startBattle() {
	document.getElementById("win").style.display= "none"
	document.getElementById("lose").style.display= "none"
	character.hp = character.hpMax
	ennemy.hp = ennemy.hpMax
	music.play();
	battleScene.style.display= "block";
	commands.forEach(command => {
		command.addEventListener("mouseenter", () => {
			document.querySelector(".commands__text").textContent = command.dataset.name;
		})
		command.addEventListener("mouseleave", () => {
			document.querySelector(".commands__text").textContent = "";
		})
	})
	charName.textContent= character.name
	charHp.textContent= character.hp
	charTp.textContent= character.tp
	ennemiesScene.innerHTML += '<div class="ennemy"><img src="medias/images/ennemy.gif"/></div>'
	updateChar()
	attBtn.addEventListener("click", ()=> {
		attack()
		ennemyTurn()
		updateChar()
	})
	comboBtn.addEventListener("click", ()=> {
		combo()
		setTimeout(()=>{
			ennemyTurn()
			updateChar()
		}, 6000)
	})
}




var DragonSlayer = {
	heroHealth: 100,
	dragonHealth: 200,
	intervalID: null,
	getRandomInt: function (min, max) {
		return Math.floor(Math.random() * (max - min + 1)) + min;
	},
	chanceToHappen: function (chance) {
		// Used to determine if something happens given a percent chance, will return true or false.
		var randnum = DragonSlayer.getRandomInt(0,100);
		if (randnum <= chance) {
			return true;
		}
		else {
			return false;
		}
	},
	damageDone: function (to, from) {
		/*
			Determines how much damage is done in a turn
				Dragon base damage = 10-15
					Fighter has a 33% chance to block, reducing the damage by 1/2

				Fighter base damage = 5-10
					Fighter has a 5% chance to critically hit, multiplying the damage by 4

			Removes the damage done from the appropriate health bar
		*/
		if (to == "fighter") {
			//document.getElementById("fighter").src = "img/fighter.gif";
			var damage = DragonSlayer.getRandomInt(10,15);
			if (DragonSlayer.chanceToHappen(33)) {
				damage = damage / 2;
				document.getElementById("fighter").src = "img/fighter-block.gif";
				var timeout1;
				function delayedFire() {
					timeout1 = window.setTimeout(showFire, 500);
				}

				function showFire() {
				  document.getElementById("dragon").src = "img/dragon-in-action.gif";
				  document.getElementById("fighter").src = "img/fighter-block.gif";
				  delayFireStop();
				}
				delayedFire();
				function delayFireStop() {
					clearTimeout(timeout1);
					timeout1 = window.setTimeout(hideFire, 500);
				}

				function hideFire() {
					document.getElementById("fighter").src = "img/fighter.gif"; //not working for somereason.... 
					document.getElementById("dragon").src = "img/dragon.gif";
				}			
			}
			else {
				var timeout1;
				document.getElementById("dragon").src = "img/dragon-in-action.gif";
				delayFireStop();
				function delayFireStop() {
					clearTimeout(timeout1);
					timeout1 = window.setTimeout(hideFire, 500);
				}

				function hideFire() {
					if (document.getElementById("fighter-health").value <= 0 ) {
						document.getElementById("dragon").src = "img/dragon-victory.gif";
					}
					else{
				  		document.getElementById("dragon").src = "img/dragon.gif";	
					}
				}
			}
			var currentHealth = document.getElementById("fighter-health").value;
			var newHealth = currentHealth - damage;
			document.getElementById("fighter-health").value = newHealth;
			return damage;
		}
		else {
			document.getElementById("dragon").src = "img/dragon.gif";
			document.getElementById("fighter").src = "img/fighter-in-action.gif";
			var damage = DragonSlayer.getRandomInt(5,10);
			if (DragonSlayer.chanceToHappen(5)) {
				damage = damage * 4;
			};
			var currentHealth = document.getElementById("dragon-health").value;
			var newHealth = currentHealth - damage;
			document.getElementById("dragon-health").value = newHealth;
			return damage;
		}
	},
	recordRound: function (opponent) {
		// Records the results of the round to the Battle Status area of the page
		if (DragonSlayer.intervalID) {
			clearInterval(DragonSlayer.intervalID);	
		};
		document.getElementById("standard_attack").disabled = true;
		document.getElementById("auto_attack").disabled = true;
		document.getElementById("body").innerHTML = "<h1>Refresh Page to Play Again</h1>";
		if (opponent == "fighter") {
			document.getElementById("battle-status").innerHTML = "Dragon defeates Fighter";
			document.getElementById("dragon").src = "img/dragon-victory.gif";
			return
		}
		else {
			document.getElementById("battle-status").innerHTML = "Fighter defeates Dragon";
			document.getElementById("fighter").src = "img/fighter-victory.gif";
			return
		}
		document.getElementById("fighter-health").value = 100;
		document.getElementById("dragon-health").value = 200;


	},
	playRound: function () {
		/*
			Plays one full round of the game
				Determine who is attacking: Fighter or Dragon (50/50 chance)
				Figure out damage done (change images, update meters, etc.)
				Record the events of the round
					Decide on a winner if either participant has run out of health
		*/
		if (DragonSlayer.chanceToHappen(50)) {
			//dragon attacks!
			var fighterDamageLost = DragonSlayer.damageDone("fighter","dragon");
			console.log(fighterDamageLost);
		}
		else {
			//Fighter Attacks!
			var dragonDamageLost = DragonSlayer.damageDone("dragon","fighter");
			console.log(dragonDamageLost);
		}
		if (document.getElementById("fighter-health").value <= 0) {
			DragonSlayer.recordRound("fighter");
		}
		else if (document.getElementById("dragon-health").value <= 0) {
			DragonSlayer.recordRound("dragon");
		}
		return
	},
	autoAttach: function(){
		DragonSlayer.intervalID = window.setInterval(DragonSlayer.playRound, 1000);
	},
	init: function () {
		// Setup your button, reset values, etc.
		document.getElementById("standard_attack").addEventListener("click", DragonSlayer.playRound);
		document.getElementById("auto_attack").addEventListener("click", DragonSlayer.autoAttach);
	}
};

DragonSlayer.init();
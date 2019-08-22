/*
GAME RULES:

- The game has 2 players, playing in rounds
- In each turn, a player rolls a dice as many times as he whishes. Each result get added to his ROUND score
- BUT, if the player rolls at least a 1, all his ROUND score gets lost. After that, it's the next player's turn
- The player can choose to 'Hold', which means that his ROUND score gets added to his GLOBAL score. After that, it's the next player's turn
- The first player to reach 100 points on GLOBAL score wins the game
- Loser plays first for the next game
- If a player rolls two 6 in a row, he loses all his GLOBAL score and his turn

Bonus:
- Display rules button
- Add a feature that shows previous rolled dice, as a smaller image, above the dice(s)
*/

let scores, roundScore, activePlayer, gamePlaying, sixCounts;
let loser = null;
let winningScore = document.getElementById('winning-score').value;
let dice2Enabled = false;
const dice1DOM = document.querySelector('.dice-1');
const dice2DOM = document.querySelector('.dice-2');


function init() {
	scores = [0, 0];
	roundScore = 0;
	sixCounts = [0, 0];
	winningScore = document.getElementById('winning-score').value;

	if (document.getElementById('2-dices').checked) {
		dice2Enabled = true;
	} else {
		dice2Enabled = false;
	}

	if (loser === null) {
		activePlayer = 0;
	} else {
		activePlayer = loser;
	}
	gamePlaying = true;

	// remove dice
	hideDices();


	// iterate over players to initialize/reset everything
	for (let i = 0; i < 2; i++) {
		document.getElementById('score-' + i).textContent = '0';
		document.getElementById('current-' + i).textContent = '0';
		document.getElementById('name-' + i).textContent = 'Player ' + (i + 1);
		document.querySelector('.player-' + i + '-panel').classList.remove('winner');
		document.querySelector('.player-' + i + '-panel').classList.remove('active');
	}

	document.querySelector('.player-' + activePlayer + '-panel').classList.add('active');
}

init();

function switchPlayersTimed() {
	setTimeout(function () {
		switchPlayers();
	}, 300);
}

function hideDices() {
	dice1DOM.style.display = 'none';
	dice2DOM.style.display = 'none';

}

// Event for ROLL button
document.querySelector('.btn-roll').addEventListener('click', function () {
	if (gamePlaying) {
		// 1. Change the dice(s) and make it a random number
		let dice1 = Math.floor(Math.random() * 6) + 1;
		let dice2 = 0;

		if (dice2Enabled) {
			dice2 = Math.floor(Math.random() * 6) + 1;
		}

		// 2. Display result
		dice1DOM.style.display = 'block';
		dice1DOM.src = 'dice-' + dice1 + '.png';

		if (dice2 !== 0) {
			dice2DOM.style.display = 'block';
			dice2DOM.src = 'dice-' + dice2 + '.png';
		}

		// 3. Update the round score, if number was not 1 + change player
		if (dice1 !== 1 && dice2 !== 1) {
			// add score
			roundScore += dice1 + dice2;
			document.getElementById('current-' + activePlayer).textContent = roundScore;

			// Two 6 in a row
			if (dice1 === 6) sixCounts[activePlayer] += 1;
			if (dice2 === 6) sixCounts[activePlayer] += 1;

			if (sixCounts[activePlayer] >= 2) {
				sixCounts[activePlayer] = 0;
				scores[activePlayer] = 0;
				document.getElementById('score-' + activePlayer).textContent = '0';
				switchPlayersTimed();
			}
		} else {
			switchPlayersTimed();
		}
	}
});


// Function for switching players
function switchPlayers() {
	sixCounts[activePlayer] = 0;
	// ROUND score at 0
	roundScore = 0;
	document.getElementById('current-' + activePlayer).textContent = roundScore;

	// Switch players
	activePlayer === 0 ? activePlayer = 1 : activePlayer = 0;

	// Update the UI
	document.querySelector('.player-0-panel').classList.toggle('active');
	document.querySelector('.player-1-panel').classList.toggle('active');

	// remove dice
	hideDices();
}


// Event for HOLD button
document.querySelector('.btn-hold').addEventListener('click', function () {
	if (gamePlaying) {
		// Add ROUND score to GLOBAL score
		scores[activePlayer] += roundScore;

		// Update the UI
		document.querySelector('#score-' + activePlayer).textContent = scores[activePlayer];

		// check if player won the game
		if (scores[activePlayer] >= winningScore) {
			// remove dice
			dice1DOM.style.display = 'none';
			dice2DOM.style.display = 'none';

			// set winner
			document.querySelector('#name-' + activePlayer).textContent = 'Winner!';
			document.querySelector('.player-' + activePlayer + '-panel').classList.add('winner');
			document.querySelector('.player-' + activePlayer + '-panel').classList.remove('active');

			// set loser
			activePlayer === 0 ? loser = 1 : loser = 0;

			gamePlaying = false;
		} else {
			// if no winner, next player's turn
			switchPlayers();
		}
	}
});


// Event for NEW GAME button
document.querySelector('.btn-new').addEventListener('click', init);
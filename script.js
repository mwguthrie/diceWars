// Assuming the same HTML and CSS setup as before

document.addEventListener('DOMContentLoaded', () => {
    const gameBoard = document.getElementById('gameBoard');
    const endTurnButton = document.getElementById('endTurn');

    let currentPlayer = 1;
    let territories = []; // Store owner and dice count for each territory
    let selectedTerritoryIndex = null; // Track selected territory for attack

    // Initialize game state
    function initGame() {
        for (let i = 0; i < 64; i++) { // Assuming an 8x8 board
            const territory = document.createElement('div');
            territory.className = 'territory';
            territory.addEventListener('click', () => handleTerritoryClick(i));
            gameBoard.appendChild(territory);
            territories.push({ owner: Math.ceil(Math.random() * 2), dice: Math.floor(Math.random() * 6) + 1 }); // Random owner and dice
        }
        updateBoard();
    }

    // Update the board based on the territories state
    function updateBoard() {
        territories.forEach((t, index) => {
            const territory = gameBoard.children[index];
            territory.textContent = t.dice;
            territory.className = `territory player${t.owner}`;
        });
    }

    // Handle territory click
    function handleTerritoryClick(index) {
        const territory = territories[index];
        if (territory.owner !== currentPlayer) {
            if (selectedTerritoryIndex !== null) {
                attemptAttack(selectedTerritoryIndex, index);
                selectedTerritoryIndex = null; // Reset selection after attack
            }
        } else {
            selectedTerritoryIndex = index; // Select territory for potential attack
        }
    }

    // Attempt an attack from one territory to another
    function attemptAttack(attackerIndex, defenderIndex) {
        const attacker = territories[attackerIndex];
        const defender = territories[defenderIndex];

        // Ensure valid attack
        if (attacker.owner === defender.owner || attacker.dice <= 1) {
            console.log("Invalid attack");
            return;
        }

        console.log(`Player ${currentPlayer} attacks from ${attackerIndex} to ${defenderIndex}`);

        // Simulate dice rolls
        const attackerRolls = rollDice(attacker.dice);
        const defenderRolls = rollDice(defender.dice);

        // Compare highest roll
        const attackerHighest = Math.max(...attackerRolls);
        const defenderHighest = Math.max(...defenderRolls);

        if (attackerHighest > defenderHighest) {
            // Attacker wins
            defender.owner = currentPlayer;
            defender.dice = attacker.dice - 1; // Move all but one die to the new territory
            attacker.dice = 1; // Leave one die behind
        } else {
            // Defender wins or draw
            attacker.dice = 1; // Attacker loses all but one die
        }

        updateBoard();
        checkVictoryConditions(); // Check if the game has been won
    }

    // Roll dice for an attack or defense
    function rollDice(diceCount) {
        const rolls = [];
        for (let i = 0; i < diceCount; i++) {
            rolls.push(Math.floor(Math.random() * 6) + 1);
        }
        return rolls;
    }

    // Distribute reinforcements at the end of a turn
    function distributeReinforcements() {
        const ownedTerritories = territories.filter(t => t.owner === currentPlayer);
        const reinforcements = Math.max(Math.floor(ownedTerritories.length / 3), 3); // Simple reinforcement rule

        // Distribute reinforcements randomly for simplicity
        for (let i = 0; i < reinforcements; i++) {
            const randomTerritoryIndex = Math.floor(Math.random() * ownedTerritories.length);
            territories[ownedTerritories[randomTerritoryIndex]].dice += 1;
        }

        updateBoard();
    }

    // Check if a player has won
    function checkVictoryConditions() {
        const playerTerritories = territories.filter(t => t.owner === currentPlayer).length;
        if (playerTerritories === territories.length) {
            alert(`Player ${currentPlayer} wins!`);
            // Reset or end game
        }
    }

    // End turn and distribute reinforcements
    endTurnButton.addEventListener('click', () => {
        distributeReinforcements();
        currentPlayer = currentPlayer === 1 ? 2 : 1;
        console.log(`Player ${currentPlayer}'s turn`);
    });

    initGame(); // Initialize the game on load
});
